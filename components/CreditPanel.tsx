"use client";

import { useEffect } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import AnimatedCurrency from "./AnimatedCurrency";

/**
 * Painel de crédito estilo carteira digital: leve (sem imagens nem iframes),
 * com valor em odômetro e uma barra que acompanha o slider (t: 0 a 1).
 */
export default function CreditPanel({
  credit,
  t,
}: {
  credit: number;
  /** Posição do slider de valor do veículo, de 0 a 1. */
  t: number;
}) {
  const reduce = useReducedMotion();
  const target = 0.12 + 0.88 * t;
  const sp = useSpring(target, {
    stiffness: reduce ? 1000 : 160,
    damping: reduce ? 100 : 24,
  });
  useEffect(() => {
    sp.set(target);
  }, [target, sp]);
  // Degradê ancorado na trilha inteira; a barra só revela até o valor atual.
  const x = useTransform(sp, (v) => `${(v - 1) * 100}%`);

  return (
    <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] p-5 text-white shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md border border-white/20 px-2 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.12em] text-white/80">
          Crédito liberado (até 80% FIPE)
        </span>
        <span className="flex items-baseline gap-0.5 font-display text-[15px] font-extrabold leading-none tracking-tight text-white/90">
          SOLO
          <span
            aria-hidden="true"
            className="inline-block h-[5px] w-[5px] rounded-full bg-action"
          />
        </span>
      </div>

      <p className="mt-4 font-display text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
        <AnimatedCurrency value={credit} />
      </p>

      <div
        className="my-4 h-2 overflow-hidden rounded-full bg-white/10"
        aria-hidden="true"
      >
        <motion.div
          className="h-full w-full bg-gradient-to-r from-[#7C3AED] to-[#16A34A]"
          style={{ x }}
        />
      </div>
      <div className="-mt-1 flex justify-between gap-3 text-[11px] text-white/60">
        <span>80% liberado em dinheiro</span>
        <span className="text-right">Garantia no documento</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-3">
        <span className="rounded-full bg-green-500/15 px-2.5 py-1.5 text-[10px] font-semibold leading-none text-green-300 ring-1 ring-green-400/30">
          O carro continua 100% com você
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70">
          Correspondente Banco Daycoval
        </span>
      </div>
    </div>
  );
}
