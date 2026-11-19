"use client";

import { useEffect } from "react";
import {
  motion,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { formatBRL } from "@/lib/lead";

/**
 * Valor em reais que "rola" com inércia de mola até o novo número
 * (contador de saldo). A animação roda por MotionValue, sem re-render React.
 * Leitores de tela recebem só o valor final (a versão animada é aria-hidden).
 */
export default function AnimatedCurrency({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 110, damping: 20, mass: 0.9 });
  const text = useTransform(spring, (v) => formatBRL(Math.round(v)));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  if (reduce) return <span className={className}>{formatBRL(value)}</span>;

  return (
    <>
      <span className="sr-only" aria-live="polite">
        {formatBRL(value)}
      </span>
      <motion.span aria-hidden="true" className={className}>
        {text}
      </motion.span>
    </>
  );
}
