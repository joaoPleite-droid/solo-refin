"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const PHRASES = [
  "sem precisar vender o veículo.",
  "com taxa definida pelo carro, não pelo CPF.",
  "para investir ou organizar suas finanças.",
];

const INTERVAL_MS = 3200;

/**
 * Linha dinâmica do H1. As três frases ocupam a mesma célula (as invisíveis
 * só reservam a altura da maior), então o layout nunca pula na troca.
 * Com "reduzir movimento" ativo, fica parada na primeira frase.
 */
export default function RotatingHeadline() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(
      () => setI((n) => (n + 1) % PHRASES.length),
      INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <span className="mt-1 grid text-brand">
      <span className="sr-only">{PHRASES[0]}</span>
      {PHRASES.map((p) => (
        <span key={p} aria-hidden="true" className="invisible [grid-area:1/1]">
          {p}
        </span>
      ))}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={i}
          aria-hidden="true"
          className="[grid-area:1/1]"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
        >
          {PHRASES[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
