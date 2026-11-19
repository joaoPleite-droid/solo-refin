"use client";

import { useEffect, useState } from "react";
import { useSimulator } from "./SimulatorProvider";
import { simularHref } from "@/lib/simularUrl";

const brl2 = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function MobileCtaBar() {
  const { heroCredit } = useSimulator();
  // Enquanto o botão verde do mini-simulador está na tela, a barra se recolhe:
  // nunca há dois botões verdes iguais na mesma viewport.
  const [heroCtaVisible, setHeroCtaVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById("hero-cta");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setHeroCtaVisible(entry.isIntersecting),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={heroCtaVisible}
      inert={heroCtaVisible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/90 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none md:hidden ${
        heroCtaVisible ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <a
        href={simularHref(
          heroCredit ? { amount: heroCredit, term: "48" } : undefined,
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary w-full tabular-nums"
      >
        {heroCredit ? `Simular ${brl2(heroCredit)}` : "Simular Crédito Grátis"}
      </a>
    </div>
  );
}
