"use client";

import { useEffect } from "react";

/**
 * Um único listener delegado: grava a posição do cursor em --mx/--my nos
 * botões .btn-primary, que o CSS usa para o reflexo de luz no hover.
 * Só em ponteiro preciso (mouse); no toque não faz nada.
 */
export default function ButtonGlow() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;

    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>(".btn-primary");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
