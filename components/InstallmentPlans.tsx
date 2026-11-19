"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SimulatorButton from "./SimulatorButton";

const plans = [
  {
    term: 24,
    name: "Quitação rápida",
    text: "Parcela mais alta, para quem quer liquidar logo e pagar menos juros no total.",
    profile: "Quem tem folga no orçamento e quer se livrar da dívida mais cedo.",
    balance: 0.2,
    leaning: "mais velocidade de quitação",
  },
  {
    term: 48,
    name: "Equilíbrio ideal",
    text: "O melhor balanço entre valor da parcela e prazo.",
    profile: "Quem busca uma parcela confortável sem alongar demais o contrato.",
    balance: 0.5,
    leaning: "equilíbrio entre quitação e folga",
  },
  {
    term: 60,
    name: "Parcela reduzida",
    text: "O menor valor mensal para manter o orçamento folgado.",
    profile: "Quem precisa da menor parcela possível para manter o fluxo de caixa.",
    balance: 0.85,
    leaning: "mais folga no bolso",
  },
] as const;

type Term = (typeof plans)[number]["term"];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function InstallmentPlans() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<Term>(48);

  const meterSpring = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 180, damping: 22 } as const);

  const layoutSpring = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 320, damping: 34 } as const);

  return (
    <section id="prazos" className="scroll-mt-20 bg-white">
      <div className="wrap py-14 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="text-[13px] font-semibold text-brand">Prazos</p>
            <h2 className="mt-3 text-[32px] font-extrabold leading-[1.08] sm:text-[44px]">
              Parcelas que cabem no seu bolso
            </h2>
          </div>
          <p className="max-w-[460px] text-[16px] leading-relaxed text-body lg:col-span-5 lg:pb-1">
            As parcelas são fixas do início ao fim, sem surpresas. Escolha o
            prazo que combina com o seu orçamento.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-4 lg:grid-cols-3 lg:gap-5">
          {plans.map((p) => {
            const selected = active === p.term;
            return (
              <motion.article
                key={p.term}
                layout
                transition={{ layout: layoutSpring }}
                style={{ borderRadius: 16 }}
                className={`relative border border-slate-200 bg-white p-6 lg:p-7 ${
                  selected ? "shadow-card" : ""
                }`}
              >
                {/* Destaque único que desliza de um prazo para outro. */}
                {selected && (
                  <motion.span
                    layoutId="planHighlight"
                    aria-hidden="true"
                    transition={layoutSpring}
                    style={{ borderRadius: 16 }}
                    className="pointer-events-none absolute -inset-px border-2 border-brand bg-brand/[0.03]"
                  />
                )}

                {p.term === 48 && (
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: selected ? 1 : 0.75,
                      scale: selected ? 1 : 0.96,
                    }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="absolute -top-3 left-6 origin-left rounded-md bg-brand px-2.5 py-1 text-[12px] font-semibold text-white lg:left-7"
                  >
                    Mais escolhido
                  </motion.span>
                )}

                <motion.div layout="position" className="relative">
                  <button
                    type="button"
                    aria-pressed={selected}
                    aria-expanded={selected}
                    onClick={() => setActive(p.term)}
                    className="block min-h-[44px] w-full text-left"
                  >
                    <span className="block text-[13px] font-semibold text-body">
                      Até
                    </span>
                    <span className="block font-display text-[56px] font-extrabold leading-none tracking-tight text-ink">
                      {p.term}
                      <span className="text-slate-300">x</span>
                    </span>
                    <span className="mt-5 block font-display text-[18px] font-bold tracking-tight text-ink">
                      {p.name}
                    </span>
                    <span className="mt-2 block text-[15px] leading-relaxed text-body">
                      {p.text}
                    </span>
                  </button>
                </motion.div>

                {/* Medidor: qualitativo (sem valores), preenche com mola ao selecionar. */}
                <motion.div layout="position" className="relative mt-5">
                  <div
                    role="img"
                    aria-label={`Balanço deste prazo: ${p.leaning}`}
                    className="relative h-2 w-full rounded-full bg-slate-200"
                  >
                    <motion.div
                      className="h-full w-full origin-left rounded-full bg-brand"
                      initial={false}
                      animate={{ scaleX: selected ? p.balance : 0 }}
                      transition={meterSpring}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${p.balance * 100}%` }}
                    >
                      <motion.span
                        className="block h-4 w-4 rounded-full border-2 border-brand bg-white shadow-sm"
                        initial={false}
                        animate={{
                          scale: selected ? 1 : 0,
                          opacity: selected ? 1 : 0,
                        }}
                        transition={meterSpring}
                      />
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between gap-3 text-[11px] font-medium leading-tight text-body">
                    <span>Velocidade de quitação</span>
                    <span className="text-right">Folga no bolso</span>
                  </div>
                </motion.div>

                <AnimatePresence initial={false}>
                  {selected && (
                    <motion.div
                      key="details"
                      layout="position"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      transition={{ duration: 0.28, ease: EASE }}
                      className="relative mt-6 border-t border-slate-200 pt-5"
                    >
                      <p className="text-[12px] font-semibold uppercase tracking-wider text-body">
                        Perfil ideal
                      </p>
                      <p className="mt-1.5 text-[15px] leading-relaxed text-ink">
                        {p.profile}
                      </p>

                      <SimulatorButton
                        className="btn-primary mt-6 w-full"
                        options={{ term: `${p.term}x` }}
                      >
                        Simular em {p.term}x
                        <ArrowRight size={16} aria-hidden="true" />
                      </SimulatorButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-6 text-[12px] text-body">
          Prazos e valores sujeitos à análise e aprovação de crédito pelo Banco
          Daycoval.
        </p>
      </div>
    </section>
  );
}
