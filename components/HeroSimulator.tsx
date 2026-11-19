"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatBRL } from "@/lib/lead";
import { LTV, pmt } from "@/lib/finance";
import AnimatedCurrency from "./AnimatedCurrency";
import CreditPanel from "./CreditPanel";
import SimulatorButton from "./SimulatorButton";
import { useSimulator } from "./SimulatorProvider";

const MIN = 20000;
const MAX = 150000;
const STEP = 5000;
const TERM = 48;

export default function HeroSimulator() {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(50000);
  const [dragging, setDragging] = useState(false);
  const { setHeroCredit } = useSimulator();

  // Solta o "arrasto" onde quer que o ponteiro termine.
  useEffect(() => {
    if (!dragging) return;
    const end = () => setDragging(false);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [dragging]);

  const credit = Math.round(value * LTV);
  const installment = Math.round(pmt(credit, TERM));
  const pct = ((value - MIN) / (MAX - MIN)) * 100;
  const active = dragging && !reduce;

  return (
    <motion.aside
      aria-label="Mini simulador"
      className="relative rounded-2xl border border-slate-200 bg-white shadow-card"
      animate={{ scale: active ? 1.01 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      {/* Brilho que pulsa na borda enquanto o slider é arrastado (só opacity). */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl ring-2 ring-brand/35 shadow-[0_0_0_5px_rgba(109,40,217,0.08)]"
        initial={false}
        animate={{ opacity: active ? [0.3, 1, 0.3] : 0 }}
        transition={
          active
            ? { duration: 1.3, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        }
      />

      <div className="px-6 pb-6 pt-6">
        <CreditPanel credit={credit} t={pct / 100} />

        <div className="mt-5 flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
          <h2 className="text-[15px] font-semibold text-ink">
            Quanto vale o seu veículo?
          </h2>
          <span className="rounded-md border border-slate-200 bg-surface px-2 py-1 text-[11px] font-medium leading-none text-body">
            Carros a partir de 2003 • Crédito de R$ 10 mil+
          </span>
        </div>

        <div className="mt-6">
          <label htmlFor="hero-value" className="text-[13px] text-body">
            Valor estimado do veículo
          </label>
          <p className="mt-1 font-display text-[34px] font-extrabold leading-none tracking-tight text-ink tabular-nums">
            {formatBRL(value)}
          </p>
          <input
            id="hero-value"
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={value}
            onPointerDown={() => setDragging(true)}
            onChange={(e) => {
              const v = Number(e.target.value);
              setValue(v);
              setHeroCredit(Math.round(v * LTV));
            }}
            className="range-brand mt-3"
            style={{ ["--pct" as string]: `${pct}%` }}
          />
          <div className="flex justify-between text-[12px] text-body">
            <span>{formatBRL(MIN)}</span>
            <span>{formatBRL(MAX)}</span>
          </div>
        </div>
      </div>

      <dl className="divide-y divide-slate-200 border-t border-slate-200">
        <div className="flex items-baseline justify-between gap-4 px-6 py-4">
          <dt className="text-[14px] text-body">Parcela estimada em {TERM}x</dt>
          <dd className="font-display text-[18px] font-bold text-ink tabular-nums">
            <AnimatedCurrency value={installment} />
          </dd>
        </div>
      </dl>

      <div
        id="hero-cta"
        className="rounded-b-2xl border-t border-slate-200 bg-surface px-6 pb-6 pt-4"
      >
        <SimulatorButton
          className="btn-primary w-full"
          options={{ amount: credit, term: `${TERM}` }}
        >
          Continuar com esse valor
        </SimulatorButton>
        <p className="mt-3 text-[12px] leading-relaxed text-body">
          Estimativa ilustrativa sujeita à análise de crédito e avaliação do
          carro pelo Banco Daycoval.
        </p>
      </div>
    </motion.aside>
  );
}
