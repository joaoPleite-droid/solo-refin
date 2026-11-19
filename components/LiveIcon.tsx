"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Ícone que "acorda" (escala + giro curto com mola) quando entra na tela. */
export default function LiveIcon({
  index = 0,
  children,
}: {
  index?: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="inline-flex"
      initial={reduce ? false : { opacity: 0, scale: 0.55, rotate: -14 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 16,
        delay: reduce ? 0 : 0.18 + index * 0.08,
      }}
    >
      {children}
    </motion.span>
  );
}
