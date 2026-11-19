"use client";

import { useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Simular", href: "#inicio" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Economia", href: "#economia" },
  { label: "Prazos e Vantagens", href: "#prazos" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Dúvidas", href: "#duvidas" },
];

function Logo() {
  return (
    <a
      href="#top"
      aria-label="Solopromotora, início"
      className="flex items-center gap-2.5 font-display text-[24px] font-extrabold leading-none tracking-tight text-ink"
    >
      <Image
        src="/logo.png"
        alt=""
        width={36}
        height={36}
        priority
        className="h-9 w-9"
      />
      SOLO
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <header
      id="top"
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md"
    >
      {/* Progresso de leitura: 2px na base da barra (h-16 = 64px). */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[62px] h-[2px] w-full origin-left bg-brand"
        style={{ scaleX: reduce ? scrollYProgress : progress }}
      />
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Logo />
          <span className="hidden h-5 w-px bg-slate-200 xl:block" aria-hidden="true" />
          <span className="hidden text-[12px] font-medium leading-tight text-body xl:block">
            Correspondente Autorizado
            <br />
            Banco Daycoval
          </span>
        </div>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-5 xl:gap-7">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[14px] font-medium text-body transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/simular"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary hidden min-h-[44px] px-5 text-[14px] lg:inline-flex"
          >
            Simular Agora
          </a>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-slate-100 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="menu-mobile"
          aria-label="Menu mobile"
          className="border-t border-slate-200/80 bg-white lg:hidden"
        >
          <ul className="wrap py-2">
            {links.map((l) => (
              <li key={l.href} className="border-b border-slate-100 last:border-0">
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center text-[16px] font-medium text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="py-3 text-[12px] text-body">
              Correspondente Autorizado Banco Daycoval
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
