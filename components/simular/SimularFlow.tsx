"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowLeft, Check, Info, Loader2 } from "lucide-react";
import {
  EMPTY,
  ELIGIBLE_UFS,
  HOUSING_OPTS,
  OCCUPATION_OPTS,
  OWNER_OPTS,
  SPC_OPTS,
  TENURE_OPTS,
  TERM_OPTS,
  TRANSMISSION_OPTS,
  UFS,
  VEHICLE_OPTS,
  blockFor,
  blockForField,
  buildCrmPayload,
  formatMoney,
  maskCep,
  maskCpf,
  maskDate,
  maskPhone,
  maskPlate,
  parseMoney,
  stepErrors,
  type Block,
  type FormState,
} from "@/lib/simular";
import { captureTracking, makeProtocol, type Tracking } from "@/lib/tracking";
import { submitLeadToCRM } from "@/lib/crm";
import { trackMetaEvent } from "@/lib/metaPixel";
import { Choice, Field, inputClass } from "./ui";
import LiveProposalCard from "./LiveProposalCard";
import ProgressRhythm from "./ProgressRhythm";
import ProtocolFlip from "./ProtocolFlip";

const EASE = [0.22, 1, 0.36, 1] as const;
const TOTAL = 4;

const STEPS = [
  {
    title: "Vamos verificar sua elegibilidade",
    sub: "Responda algumas perguntas rápidas para verificar sua elegibilidade.",
  },
  {
    title: "Simulação e contato",
    sub: "Informe o valor desejado e seus dados de contato para receber a análise.",
  },
  {
    title: "Dados profissionais e renda",
    sub: "Informe sua ocupação e seus rendimentos para análise de crédito.",
  },
  {
    title: "Últimos dados e autorização",
    sub: "Falta pouco para enviar sua solicitação.",
  },
];

/** Motivo enviado ao Meta quando o lead é desqualificado. */
const BLOCK_REASON: Partial<Record<keyof FormState, string>> = {
  vehicleType: "tipo_veiculo",
  spc: "restricao_spc_serasa",
  uf: "uf_inelegivel",
  owner: "veiculo_em_nome_de_terceiro",
};

type TextKey =
  | "plate" | "name" | "phone" | "email" | "employer" | "cpf" | "birth"
  | "birthCity" | "mother" | "cep" | "street" | "number" | "complement"
  | "district" | "city";

/** No celular, leva o campo para o centro da tela quando o teclado abre. */
const centerOnFocus = (e: React.FocusEvent<HTMLElement>) => {
  if (!window.matchMedia("(pointer: coarse)").matches) return;
  const el = e.currentTarget;
  window.setTimeout(
    () => el.scrollIntoView({ block: "center", behavior: "smooth" }),
    280,
  );
};

export default function SimularFlow() {
  const reduce = useReducedMotion();
  const search = useSearchParams();

  const [data, setData] = useState<FormState>(() => {
    const valor = Number(search.get("valor"));
    const prazo = String(parseInt(search.get("prazo") ?? "", 10));
    return {
      ...EMPTY,
      vehicleType: VEHICLE_OPTS[0], // modalidade exclusiva: carro
      amountCents: Number.isFinite(valor) && valor > 0 ? Math.round(valor * 100) : 0,
      term: (TERM_OPTS as readonly string[]).includes(prazo) ? prazo : "",
    };
  });
  const dataRef = useRef(data);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [blocked, setBlocked] = useState<Block | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attempted, setAttempted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);
  const [protocol, setProtocol] = useState("");

  const headingRef = useRef<HTMLHeadingElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const tracking = useRef<Tracking | null>(null);
  const fired = useRef<Set<string>>(new Set());

  /** Evento do Meta com event_id derivado do ID da sessão (Lead usa o ID puro). */
  const fire = (
    name: string,
    params?: Record<string, unknown>,
    opts?: { id?: string; once?: boolean },
  ) => {
    if (opts?.once) {
      if (fired.current.has(name)) return;
      fired.current.add(name);
    }
    const base = tracking.current?.event_id ?? "";
    trackMetaEvent(name, params, opts?.id ?? `${base}-${name}`);
  };

  useEffect(() => {
    tracking.current = captureTracking();
    fire("ViewContent", { content_name: "Formulario_Simulacao_Solo" }, { once: true });
    return () => window.clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [step, done, blocked]);

  const errs = stepErrors(step, data);
  // Erro só aparece depois que o usuário tocou no campo ou tentou avançar.
  const show = (k: keyof FormState) =>
    attempted || touched[k] ? errs[k] : undefined;

  /* ── navegação ── */

  const go = (n: number) => {
    window.clearTimeout(timer.current);
    setConfirming(false);
    setDir(n > step ? 1 : -1);
    setAttempted(false);
    setTouched({});
    setSubmitError("");
    setStep(n);
    window.scrollTo({ top: 0 });
  };

  /** Feedback de 350 ms e avanço automático (nunca na última etapa). */
  const startAdvance = (next: FormState, st: number) => {
    if (confirming || st >= TOTAL - 1) return;
    if (Object.keys(stepErrors(st, next)).length || blockFor(next)) return;
    setConfirming(true);
    timer.current = window.setTimeout(() => {
      setConfirming(false);
      // Só leads qualificados chegam aqui: sem restrição, UF elegível, veículo no nome.
      if (st === 0) fire("InitiateCheckout", { content_name: "Formulario_Simulacao_Solo" }, { once: true });
      if (st === 2) fire("AddPaymentInfo", { content_name: "Dados_Profissionais" }, { once: true });
      go(st + 1);
    }, 350);
  };

  const setField = <K extends keyof FormState>(
    k: K,
    v: FormState[K],
    opts?: { select?: boolean },
  ) => {
    // dataRef evita que duas alterações seguidas se sobrescrevam (estado velho).
    const next = { ...dataRef.current, [k]: v };
    dataRef.current = next;
    setData(next);
    const b = blockForField(k, next);
    if (b) {
      // Bloqueio NÃO dispara Lead: só DisqualifiedLead, para excluir o público.
      fire("DisqualifiedLead", { reason: BLOCK_REASON[k] ?? String(k) });
      setBlocked(b);
      return;
    }
    if (opts?.select) {
      setTouched((t) => ({ ...t, [k]: true }));
      startAdvance(next, step);
    }
  };

  const reviewAnswer = () => {
    if (!blocked) return;
    const next = { ...dataRef.current, [blocked.field]: "" };
    dataRef.current = next;
    setData(next);
    setBlocked(null);
  };

  const onFormBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    const t: EventTarget = e.target;
    if (!(t instanceof HTMLInputElement || t instanceof HTMLSelectElement)) return;
    // Campo que já saiu da tela (troca de etapa) não conta como interação.
    if (!e.currentTarget.contains(t)) return;
    if (t.type === "checkbox") return;
    if (t.name) setTouched((s) => ({ ...s, [t.name]: true }));
    const to = e.relatedTarget as Node | null;
    // Se o foco só foi para outro campo do formulário, o usuário ainda está editando.
    if (to && e.currentTarget.contains(to)) return;
    startAdvance(data, step);
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError("");
    const base = tracking.current ?? captureTracking();
    const proto = protocol || makeProtocol();
    const trk: Tracking = { ...base, protocolo: proto };
    const r = await submitLeadToCRM({
      form: data,
      data: buildCrmPayload(data),
      tracking: trk,
    });
    setSubmitting(false);
    if (!r.ok) {
      setSubmitError(
        "Não foi possível enviar agora. Confira sua conexão e tente novamente.",
      );
      return;
    }
    // Lead: mesmo event_id do payload enviado ao CRM (desduplica com a CAPI).
    fire(
      "Lead",
      {
        value: data.amountCents / 100,
        currency: "BRL",
        content_name: "Proposta_Refinanciamento_Auto",
      },
      { id: trk.event_id, once: true },
    );
    setProtocol(proto);
    setDir(1);
    setDone(true);
    window.scrollTo({ top: 0 });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirming || submitting) return;
    setAttempted(true);
    const first = Object.keys(errs)[0];
    if (first) {
      document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (blockFor(data)) return;
    if (step < TOTAL - 1) startAdvance(data, step);
    else void submit();
  };

  /* ── campos ── */

  const text = (
    k: TextKey,
    label: string,
    o: {
      mask?: (v: string) => string;
      hint?: React.ReactNode;
      placeholder?: string;
      type?: string;
      inputMode?: "text" | "numeric" | "decimal" | "email" | "tel";
      autoComplete?: string;
      capitalize?: boolean;
    } = {},
  ) => (
    <Field id={`f-${k}`} label={label} hint={o.hint} error={show(k)}>
      <input
        id={`f-${k}`}
        name={k}
        type={o.type ?? "text"}
        inputMode={o.inputMode}
        autoComplete={o.autoComplete ?? "off"}
        autoCapitalize={o.capitalize ? "characters" : "none"}
        spellCheck={false}
        placeholder={o.placeholder}
        value={data[k]}
        onFocus={centerOnFocus}
        onChange={(e) =>
          setField(k, o.mask ? o.mask(e.target.value) : e.target.value)
        }
        aria-invalid={!!show(k)}
        aria-describedby={`f-${k}-msg`}
        className={inputClass(show(k))}
      />
    </Field>
  );

  const money = (
    k: "amountCents" | "incomeCents",
    label: string,
    hint?: React.ReactNode,
  ) => (
    <Field id={`f-${k}`} label={label} hint={hint} error={show(k)}>
      <input
        id={`f-${k}`}
        name={k}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        placeholder="R$ 0,00"
        value={formatMoney(data[k])}
        onFocus={centerOnFocus}
        onChange={(e) => setField(k, parseMoney(e.target.value))}
        aria-invalid={!!show(k)}
        aria-describedby={`f-${k}-msg`}
        className={inputClass(show(k))}
      />
    </Field>
  );

  const ufSelect = (
    k: "uf" | "addrUf" | "birthUf",
    label: string,
    eligibleOnly: boolean,
  ) => (
    <Field id={`f-${k}`} label={label} error={show(k)}>
      <select
        id={`f-${k}`}
        name={k}
        value={data[k]}
        onFocus={centerOnFocus}
        onChange={(e) => setField(k, e.target.value, { select: k === "uf" })}
        aria-invalid={!!show(k)}
        aria-describedby={`f-${k}-msg`}
        className={inputClass(show(k))}
      >
        <option value="">Selecione</option>
        {(eligibleOnly
          ? UFS.filter(([u]) => (ELIGIBLE_UFS as readonly string[]).includes(u))
          : UFS
        ).map(([u, n]) => (
          <option key={u} value={u}>
            {u} — {n}
          </option>
        ))}
      </select>
    </Field>
  );

  const incomeLabel =
    data.occupation === "Assalariado (CLT)"
      ? "Renda bruta mensal"
      : data.occupation
        ? "Média mensal de faturamento / renda bruta"
        : "Renda mensal";

  /* ── telas ── */

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 36 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -36 }),
  };

  const firstName = data.name.trim().split(" ")[0];
  const progress = done ? 1 : (step + 1) / TOTAL;
  const viewKey = done ? "done" : blocked ? "blocked" : `step-${step}`;

  return (
    <div className="mx-auto w-full max-w-[620px] px-5 pb-36 pt-6 sm:pt-10 lg:grid lg:max-w-[1000px] lg:grid-cols-[620px_340px] lg:items-start lg:gap-8">
      <div className="min-w-0">
        {/* Voltar + ritmo: mensagem e barra viva */}
        <div className="flex items-center">
          {step > 0 && !done && !blocked ? (
            <button
              type="button"
              onClick={() => go(step - 1)}
              className="-ml-2 inline-flex min-h-[48px] items-center gap-1.5 rounded-lg px-2 text-[14px] font-medium text-body [@media(hover:hover)]:hover:text-ink"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Voltar
            </button>
          ) : (
            <span />
          )}
        </div>
        <ProgressRhythm step={step} done={done} />
        {/* Cartão vivo compacto (mobile): logo abaixo da barra, até 96px. */}
        {!done && (
          <div className="mt-4 lg:hidden">
            <LiveProposalCard data={data} variant="compact" />
          </div>
        )}

        <div className="relative mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-8">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={viewKey}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: reduce ? 0 : 0.24, ease: EASE }}
            >
                {done ? (
                <div>
                  <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-[26px] font-extrabold leading-tight outline-none sm:text-[28px]"
                  >
                    Solicitação enviada, {firstName}!
                  </h1>

                  <div className="mt-5">
                    <ProtocolFlip data={data} protocol={protocol} />
                  </div>

                  <ol className="mt-6 space-y-2 text-[14px] leading-relaxed text-body">
                    <li>
                      <strong className="text-ink">1.</strong> Um especialista da
                      Solopromotora analisa sua solicitação junto ao Banco Daycoval.
                    </li>
                    <li>
                      <strong className="text-ink">2.</strong> Você recebe o retorno
                      pelo celular informado. As condições finais dependem de
                      aprovação de crédito.
                    </li>
                  </ol>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-6 w-full"
                  >
                    Conhecer a Solopromotora
                  </a>
                </div>
              ) : blocked ? (
                <div>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                    <AlertTriangle size={22} aria-hidden="true" />
                  </span>
                  <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-5 text-[24px] font-extrabold leading-tight outline-none"
                  >
                    {blocked.title}
                  </h1>
                  <p className="mt-3 text-[16px] leading-relaxed text-body">
                    {blocked.message}
                  </p>
                  <button
                    type="button"
                    onClick={reviewAnswer}
                    className="btn-primary mt-7 w-full"
                  >
                    Revisar minha resposta
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center text-[14px] font-semibold text-body [@media(hover:hover)]:hover:text-ink"
                  >
                    Conhecer a Solopromotora
                  </a>
                </div>
              ) : (
                <form noValidate onSubmit={onSubmit} onBlur={onFormBlur}>
                  <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-[26px] font-extrabold leading-[1.15] outline-none sm:text-[28px]"
                  >
                    {STEPS[step].title}
                  </h1>
                  {/* Etapa 1: a mensagem acima da barra já instrui; sem subtítulo repetido. */}
                  {step > 0 && (
                    <p className="mt-2 text-[15px] leading-relaxed text-body">
                      {STEPS[step].sub}
                    </p>
                  )}

                  <div className="mt-5 grid gap-5">
                    {step === 0 && (
                      <>
                        {/* Selo informativo: a modalidade já vem confirmada. */}
                        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3.5 py-2 text-[13px] font-semibold text-green-700">
                          <Check size={14} strokeWidth={3} aria-hidden="true" />
                          Modalidade: Carro de passeio (2003+)
                        </p>
                        <Choice
                          variant="pills"
                          legend="Você possui alguma restrição no SPC ou Serasa?"
                          name="spc"
                          options={SPC_OPTS}
                          value={data.spc}
                          onChange={(v) => setField("spc", v, { select: true })}
                          error={show("spc")}
                        />
                        {ufSelect(
                          "uf",
                          "Em qual estado (UF) você mora / o veículo está emplacado?",
                          false,
                        )}
                        <div className="grid grid-cols-2 items-start gap-3">
                          {text("plate", "Placa do veículo", {
                            mask: maskPlate,
                            placeholder: "ABC1D23",
                            capitalize: true,
                          })}
                          <Choice
                            variant="stack"
                            legend="Transmissão"
                            name="transmission"
                            options={TRANSMISSION_OPTS}
                            value={data.transmission}
                            onChange={(v) => setField("transmission", v, { select: true })}
                            error={show("transmission")}
                          />
                        </div>
                        <div
                          role="note"
                          className="flex items-center gap-2.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-3 text-[12px] font-extrabold uppercase tracking-[0.05em] text-amber-900"
                        >
                          <AlertTriangle size={16} className="shrink-0" aria-hidden="true" />
                          O veículo precisa estar em seu nome
                        </div>
                        <Choice
                          variant="pills"
                          legend="O veículo está no seu nome?"
                          name="owner"
                          options={OWNER_OPTS}
                          value={data.owner}
                          onChange={(v) => setField("owner", v, { select: true })}
                          error={show("owner")}
                        />
                      </>
                    )}
                    {step === 1 && (
                      <>
                        {money(
                          "amountCents",
                          "Valor desejado em crédito",
                          "Mínimo de R$ 10.000, até o valor do veículo",
                        )}
                        <Choice
                          legend="Prazo"
                          name="term"
                          options={TERM_OPTS.map((t) => `${t} vezes`)}
                          value={data.term ? `${data.term} vezes` : ""}
                          onChange={(v) =>
                            setField("term", v.split(" ")[0], { select: true })
                          }
                          error={show("term")}
                        />
                        {text("name", "Nome completo", {
                          hint: "Como consta no seu documento oficial",
                          autoComplete: "name",
                        })}
                        {text("phone", "Celular com DDD", {
                          mask: maskPhone,
                          placeholder: "(99) 99999-9999",
                          type: "tel",
                          inputMode: "numeric",
                          autoComplete: "tel-national",
                        })}
                        {text("email", "E-mail", {
                          type: "email",
                          inputMode: "email",
                          placeholder: "email@exemplo.com",
                          autoComplete: "email",
                        })}
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <Choice
                          legend="Tipo de ocupação"
                          name="occupation"
                          options={OCCUPATION_OPTS}
                          value={data.occupation}
                          onChange={(v) => setField("occupation", v, { select: true })}
                          error={show("occupation")}
                          cols={1}
                        />
                        {text("employer", "Onde trabalha / Nome da empresa", {
                          autoComplete: "organization",
                        })}
                        <Choice
                          legend="Há quanto tempo trabalha / atua"
                          name="tenure"
                          options={TENURE_OPTS}
                          value={data.tenure}
                          onChange={(v) => setField("tenure", v, { select: true })}
                          error={show("tenure")}
                        />
                        {money("incomeCents", incomeLabel)}
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <div
                          role="note"
                          className="flex gap-3 rounded-xl border border-violet-200 bg-violet-50/70 px-4 py-4 text-[14px] leading-relaxed text-ink"
                        >
                          <Info size={18} className="mt-0.5 shrink-0 text-brand" aria-hidden="true" />
                          <p>
                            <strong>Importante:</strong> para o perfeito compliance
                            e aprovação da proposta, os dados abaixo devem estar
                            exatamente de acordo com o seu documento oficial e com
                            um comprovante de endereço recente (conta de água,
                            luz, internet fixa ou fatura de cartão de crédito).
                          </p>
                        </div>

                        <section
                          aria-labelledby="blk-pessoais"
                          className="grid gap-5 rounded-2xl border border-slate-200 bg-surface/60 p-4 sm:p-5"
                        >
                          <h2
                            id="blk-pessoais"
                            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-body"
                          >
                            1. Seus dados pessoais
                          </h2>
                          {text("cpf", "CPF", {
                            mask: maskCpf,
                            placeholder: "000.000.000-00",
                            inputMode: "numeric",
                          })}
                          {text("birth", "Data de nascimento", {
                            mask: maskDate,
                            placeholder: "dd/mm/aaaa",
                            inputMode: "numeric",
                            autoComplete: "bday",
                          })}
                          <div className="grid gap-5 sm:grid-cols-2">
                            {text("birthCity", "Cidade onde nasceu")}
                            {ufSelect("birthUf", "Estado onde nasceu (UF)", false)}
                          </div>
                          {text("mother", "Nome da mãe")}
                        </section>

                        <section
                          aria-labelledby="blk-endereco"
                          className="grid gap-5 rounded-2xl border border-slate-200 bg-surface/60 p-4 sm:p-5"
                        >
                          <h2
                            id="blk-endereco"
                            className="text-[12px] font-semibold uppercase tracking-[0.12em] text-body"
                          >
                            2. Endereço atual para comprovante
                          </h2>
                          {text("cep", "CEP", {
                            mask: maskCep,
                            placeholder: "00000-000",
                            inputMode: "numeric",
                            autoComplete: "postal-code",
                          })}
                          {text("street", "Logradouro", { autoComplete: "address-line1" })}
                          <div className="grid gap-5 sm:grid-cols-2">
                            {text("number", "Número")}
                            {text("complement", "Complemento", {
                              hint: "Opcional",
                              autoComplete: "address-line2",
                            })}
                          </div>
                          {text("district", "Bairro")}
                          {text("city", "Cidade", { autoComplete: "address-level2" })}
                          {ufSelect("addrUf", "UF", true)}
                          <Choice
                            legend="Situação da moradia"
                            name="housing"
                            options={HOUSING_OPTS}
                            value={data.housing}
                            onChange={(v) => setField("housing", v, { select: true })}
                            error={show("housing")}
                          />
                        </section>

                        <div>
                          <label className="flex min-h-[48px] cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[14px] leading-relaxed text-ink">
                            <input
                              type="checkbox"
                              name="consent"
                              checked={data.consent}
                              onChange={(e) => setField("consent", e.target.checked)}
                              className="mt-0.5 h-5 w-5 shrink-0 accent-brand"
                            />
                            <span>
                              Li e aceito a política de privacidade. Autorizo o
                              tratamento dos meus dados para análise desta
                              solicitação.{" "}
                              <a
                                href="/privacidade"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-brand underline underline-offset-2"
                              >
                                Ler a política de privacidade
                              </a>
                            </span>
                          </label>
                          {attempted && errs.consent && (
                            <p role="alert" className="mt-2 text-[13px] text-red-600">
                              {errs.consent}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {submitError && (
                    <p role="alert" className="mt-5 text-[13px] text-red-600">
                      {submitError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={submitting}
                    aria-busy={submitting}
                    className="btn-primary mt-7 w-full disabled:cursor-wait disabled:opacity-80"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" aria-hidden="true" />
                        Enviando...
                      </>
                    ) : step < TOTAL - 1 ? (
                      "Continuar"
                    ) : (
                      "Enviar solicitação"
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Confirmação breve (350 ms) antes do avanço automático. */}
          <AnimatePresence>
            {confirming && (
              <motion.div
                className="absolute inset-0 z-10 flex items-center justify-center bg-white/75 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
              >
                <motion.span
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-action text-white shadow-lg"
                  initial={{ scale: reduce ? 1 : 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 420, damping: 18 }}
                >
                  <Check size={30} strokeWidth={3} aria-hidden="true" />
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cartão vivo completo (desktop): fixo na lateral direita. */}
      {!done && (
        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <LiveProposalCard data={data} variant="full" />
        </aside>
      )}
    </div>
  );
}
