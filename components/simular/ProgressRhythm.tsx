"use client";

import { useEffect } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const TOTAL = 4;

const MESSAGES: React.ReactNode[] = [
  "Checando elegibilidade • leva menos de 45s",
  <>
    <span className="font-semibold text-[#16A34A]">Perfil elegível!</span>{" "}
    Definindo seu crédito • ~30s
  </>,
  "Quase lá! Perfil de renda • ~15s",
  "Último passo para gerar seu protocolo",
];

/**
 * Barra contínua de 3px (roxo → verde) com física de mola, pulso de brilho na
 * ponta a cada passo concluído e mensagem que recompensa o avanço.
 */
export default function ProgressRhythm({
  step,
  done,
}: {
  step: number;
  done: boolean;
}) {
  const reduce = useReducedMotion();
  const target = done ? 1 : (step + 1) / TOTAL;
  const sp = useSpring(target, {
    stiffness: reduce ? 1000 : 160,
    damping: reduce ? 100 : 24,
  });
  useEffect(() => {
    sp.set(target);
  }, [target, sp]);

  // O degradê fica ancorado na trilha inteira; a barra só "revela" até o valor atual.
  const x = useTransform(sp, (v) => `${(v - 1) * 100}%`);
  const left = useTransform(sp, (v) => `${v * 100}%`);

  const key = done ? "done" : String(step);

  return (
    <div className="mt-1">
      <div className="flex h-6 items-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={key}
            aria-live="polite"
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="text-[13px] font-medium text-body"
          >
            {done ? "Protocolo gerado com sucesso" : MESSAGES[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div
        className="relative mt-1.5 h-[3px] w-full"
        role="progressbar"
        aria-label="Progresso da simulação"
        aria-valuemin={0}
        aria-valuemax={TOTAL}
        aria-valuenow={done ? TOTAL : step + 1}
      >
        <div className="absolute inset-0 overflow-hidden rounded-full bg-slate-200">
          <motion.div
            className="h-full w-full bg-gradient-to-r from-[#6D28D9] to-[#16A34A]"
            style={{ x }}
          />
        </div>

        {/* Ponta da barra: ponto fixo + pulso a cada passo concluído. */}
        <motion.span
          aria-hidden="true"
          className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2"
          style={{ left }}
        >
          {!reduce && (step > 0 || done) && (
            <motion.span
              key={key}
              className="absolute inset-0 rounded-full bg-[#16A34A]"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 3.4], opacity: [0.7, 0] }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
            />
          )}
          <span className="absolute inset-0 rounded-full bg-[#16A34A] shadow-[0_0_8px_2px_rgba(22,163,74,0.45)]" />
        </motion.span>
      </div>
    </div>
  );
}
