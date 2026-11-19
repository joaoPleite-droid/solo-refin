"use client";

import { blockFor, stepErrors, type FormState } from "@/lib/simular";
import AnimatedCurrency from "../AnimatedCurrency";

/** Mini-placa estilo Mercosul. */
export function Plate({ value, big = false }: { value: string; big?: boolean }) {
  return (
    <div
      className={`inline-flex flex-col overflow-hidden rounded-md border-2 border-slate-300 bg-white text-ink shadow-sm ${
        big ? "w-[148px]" : "w-[104px]"
      }`}
    >
      <div
        className={`bg-[#1D4ED8] text-center font-bold leading-none tracking-[0.22em] text-white ${
          big ? "py-[3px] text-[8px]" : "py-[2px] text-[7px]"
        }`}
      >
        BRASIL
      </div>
      <div
        className={`text-center font-mono font-bold tracking-[0.1em] ${
          big ? "py-1.5 text-[22px]" : "py-1 text-[15px]"
        } ${value ? "text-ink" : "text-slate-300"}`}
      >
        {value || "ABC1D23"}
      </div>
    </div>
  );
}

function Status({ eligible }: { eligible: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-[3px] text-[10px] font-semibold leading-none transition-colors duration-200 ${
        eligible ? "bg-[#16A34A] text-white" : "bg-white/10 text-white/70"
      }`}
    >
      {eligible ? "Elegível ✓" : "Em preenchimento"}
    </span>
  );
}

/**
 * Cartão da proposta que se atualiza enquanto o usuário preenche.
 * compact: faixa horizontal (< lg), no máximo 96px de altura.
 * full: cartão vertical fixo na lateral (lg+), com o nome do titular.
 */
export default function LiveProposalCard({
  data,
  variant,
}: {
  data: FormState;
  variant: "compact" | "full";
}) {
  const eligible =
    !blockFor(data) && Object.keys(stepErrors(0, data)).length === 0;
  const term = data.term ? `${data.term}x` : "—";
  const amount = data.amountCents / 100;

  if (variant === "compact") {
    return (
      <div className="flex h-[92px] items-center justify-between gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E1B4B] via-[#3B0764] to-[#0F172A] px-3.5 py-2.5 text-white shadow-[0_12px_28px_-16px_rgba(30,27,75,0.8)]">
        <div className="flex min-w-0 flex-col gap-1.5">
          <Plate value={data.plate} />
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-white/10 px-1.5 py-[3px] text-[10px] font-semibold leading-none text-white/80">
              {data.uf || "UF"}
            </span>
            <Status eligible={eligible} />
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-white/60">
            Valor solicitado
          </p>
          <p className="font-display text-[22px] font-extrabold leading-tight tracking-tight tabular-nums">
            <AnimatedCurrency value={amount} />
          </p>
          <p className="text-[12px] font-semibold text-white/70">Prazo {term}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#3B0764] to-[#0F172A] p-6 text-white shadow-[0_24px_48px_-24px_rgba(30,27,75,0.85)]">
      <div className="flex items-start justify-between">
        <p className="flex items-baseline gap-0.5 font-display text-[22px] font-extrabold leading-none tracking-tight">
          SOLO
          <span
            aria-hidden="true"
            className="inline-block h-[6px] w-[6px] rounded-full bg-action"
          />
        </p>
        <span className="rounded-md border border-white/25 px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.12em] text-white/85">
          Banco Daycoval
        </span>
      </div>

      <div className="mt-7 flex items-center gap-3">
        <Plate value={data.plate} big />
        <div className="flex flex-col items-start gap-1.5">
          <span className="rounded bg-white/10 px-2 py-1 text-[11px] font-semibold leading-none text-white/80">
            {data.uf || "UF"}
          </span>
          <Status eligible={eligible} />
        </div>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/60">
            Valor solicitado
          </p>
          <p className="mt-1 font-display text-[26px] font-extrabold leading-none tracking-tight tabular-nums">
            <AnimatedCurrency value={amount} />
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-white/60">
            Prazo
          </p>
          <p className="mt-1 font-display text-[26px] font-extrabold leading-none tracking-tight tabular-nums">
            {term}
          </p>
        </div>
      </div>

      <div className="mt-7 border-t border-white/15 pt-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/50">
          Nome do titular
        </p>
        <p className="mt-1 truncate text-[14px] font-semibold uppercase tracking-wide">
          {data.name || "—"}
        </p>
      </div>
    </div>
  );
}
