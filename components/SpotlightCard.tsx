"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Entrada em cascata (whileInView, uma vez) + halo que segue o cursor.
 * O halo é CSS (.spot / .spot-dark no globals.css); aqui só gravamos a
 * posição do ponteiro. tone="dark" acende também a borda, para fundos escuros.
 * No toque, o halo acende ao tocar e apaga logo depois.
 */
export default function SpotlightCard({
  as = "li",
  tone = "light",
  index = 0,
  lift = false,
  className = "",
  children,
}: {
  as?: "li" | "figure" | "div";
  tone?: "light" | "dark";
  index?: number;
  /** true = sobe 2px no hover; um número define os px. */
  lift?: boolean | number;
  className?: string;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const Comp = (
    as === "li" ? motion.li : as === "figure" ? motion.figure : motion.div
  ) as typeof motion.div;

  const setPos = (e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <Comp
      className={`${tone === "dark" ? "spot-dark" : "spot"} ${className}`}
      onPointerMove={(e) => e.pointerType === "mouse" && setPos(e)}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse") return;
        setPos(e);
        const el = e.currentTarget;
        el.dataset.lit = "1";
        window.setTimeout(() => delete el.dataset.lit, 700);
      }}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={
        lift && !reduce
          ? { y: -(typeof lift === "number" ? lift : 2) }
          : undefined
      }
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay: reduce ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Comp>
  );
}
