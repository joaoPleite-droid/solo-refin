"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Check } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ───────── Card 1: régua de ano ───────── */

const Y0 = 2003;
const Y1 = 2026;

function YearRuler() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [year, setYear] = useState(Y0);

  // Ao entrar na tela o marcador desliza sozinho até 2018; depois é do usuário.
  useEffect(() => {
    if (!inView) return;
    const id = window.setTimeout(() => setYear(2018), reduce ? 0 : 350);
    return () => window.clearTimeout(id);
  }, [inView, reduce]);

  const t = (year - Y0) / (Y1 - Y0);
  const sp = useSpring(t, { stiffness: reduce ? 1000 : 170, damping: reduce ? 100 : 22 });
  useEffect(() => {
    sp.set(t);
  }, [t, sp]);
  const yearText = useTransform(sp, (v) => String(Math.round(Y0 + v * (Y1 - Y0))));
  const left = useTransform(sp, (v) => `${v * 100}%`);

  return (
    <div ref={ref} className="w-full">
      <div className="flex items-center justify-between gap-3">
        <motion.span className="font-display text-[44px] font-extrabold leading-none tracking-tight text-ink tabular-nums">
          {yearText}
        </motion.span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-[12px] font-semibold text-green-700">
          <Check size={13} strokeWidth={2.6} aria-hidden="true" />
          Elegível
        </span>
      </div>

      <div className="relative mt-5 flex h-11 items-center">
        <input
          type="range"
          aria-label="Ano do carro"
          min={Y0}
          max={Y1}
          step={1}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
          style={{ touchAction: "pan-y" }}
        />
        <div className="absolute inset-x-0 h-2 rounded-full bg-slate-200" />
        <motion.div
          className="absolute h-2 w-full origin-left rounded-full bg-brand"
          style={{ scaleX: sp }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left }}
        >
          <span className="block h-6 w-6 rounded-full border-2 border-brand bg-white shadow-md peer-focus-visible:ring-4" />
        </motion.span>
      </div>

      <div className="mt-1 flex justify-between text-[12px] font-medium tabular-nums text-body">
        <span>{Y0}</span>
        <span>{Y1}</span>
      </div>
    </div>
  );
}

/* ───────── Card 2: gauge semicircular ───────── */

function Gauge() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const label = useTransform(mv, (v) => `${Math.round(v)}%`);

  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, 80, { duration: reduce ? 0 : 1.4, ease: EASE });
    return () => c.stop();
  }, [inView, reduce, mv]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[250px]">
      <svg viewBox="0 0 200 110" className="w-full overflow-visible" aria-hidden="true">
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <motion.path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#6D28D9"
          strokeWidth="14"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? 0.8 : 0 }}
          transition={{ duration: reduce ? 0 : 1.4, ease: EASE }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-3 text-center">
        <motion.p className="font-display text-[44px] font-extrabold leading-none tracking-tight text-ink tabular-nums">
          {label}
        </motion.p>
        <p className="mt-1 text-[12px] text-body">da tabela FIPE</p>
      </div>
      <div className="mt-1 flex justify-between px-1 text-[11px] font-medium tabular-nums text-body">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

/* ───────── Card 3: status de posse (estilo Wallet) ───────── */

function OwnershipPass() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="w-full rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#3B0764] p-5 text-white shadow-[0_18px_36px_-20px_rgba(30,27,75,0.8)]"
      initial={reduce ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <div className="flex items-center justify-between">
        <p className="flex items-baseline gap-0.5 font-display text-[18px] font-extrabold leading-none tracking-tight">
          SOLO
          <span
            aria-hidden="true"
            className="inline-block h-[5px] w-[5px] rounded-full bg-action"
          />
        </p>
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">
          Status do veículo
        </span>
      </div>

      <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3.5">
        <span className="relative flex h-3 w-3 shrink-0" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60 motion-reduce:animate-none [animation-duration:2.2s]" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
        </span>
        <p className="text-[14px] font-semibold leading-snug">
          Uso livre • Garantia via Banco Daycoval
        </p>
      </div>
    </motion.div>
  );
}

/* ───────── Card 4: checklist vivo ───────── */

const steps = ["1. Simulação", "2. Vistoria no celular", "3. Crédito liberado"];

function Checklist() {
  const reduce = useReducedMotion();
  const step = (i: number) => ({
    off: { opacity: 0 },
    on: {
      opacity: 1,
      transition: { delay: reduce ? 0 : 0.4 + i * 0.75, duration: reduce ? 0 : 0.3 },
    },
  });

  return (
    <motion.ul
      className="w-full space-y-2.5"
      initial="off"
      whileInView="on"
      viewport={{ once: true, amount: 0.6 }}
    >
      {steps.map((s, i) => (
        <li
          key={s}
          className="relative flex min-h-[48px] items-center gap-3 rounded-full border border-slate-200 bg-surface px-3.5"
        >
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border border-green-200 bg-green-50"
            variants={step(i)}
          />
          <span className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-action"
              variants={step(i)}
            />
            <motion.span
              className="relative text-white"
              variants={{
                off: { scale: 0, opacity: 0 },
                on: {
                  scale: 1,
                  opacity: 1,
                  transition: reduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 16, delay: 0.4 + i * 0.75 },
                },
              }}
            >
              <Check size={14} strokeWidth={3} aria-hidden="true" />
            </motion.span>
          </span>
          <span className="relative text-[14px] font-semibold text-ink">{s}</span>
        </li>
      ))}
    </motion.ul>
  );
}

/* ───────── Seção ───────── */

const cards = [
  {
    visual: <YearRuler />,
    title: "Carros a partir de 2003",
    text: "Aceitamos carros fabricados de 2003 em diante, sujeitos à avaliação do Banco Daycoval.",
  },
  {
    visual: <Gauge />,
    title: "Libere até 80% da FIPE",
    text: "Crédito a partir de R$ 10 mil com parcelas fixas do início ao fim.",
  },
  {
    visual: <OwnershipPass />,
    title: "Você continua dirigindo normalmente",
    text: "O veículo fica apenas como garantia no documento. A posse e o uso continuam 100% seus.",
  },
  {
    visual: <Checklist />,
    title: "Da simulação ao dinheiro na conta sem sair de casa",
    text: "Envio de documentos e vistoria feitos diretamente pelo seu celular.",
  },
];

export default function CarHotspots() {
  return (
    <section id="raio-x" className="scroll-mt-20 bg-white">
      <div className="wrap py-14 lg:py-24">
        <div className="max-w-[720px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-brand">
            Condições reais • Banco Daycoval
          </p>
          <h2 className="mt-3 text-[32px] font-extrabold leading-[1.08] sm:text-[44px]">
            Seu carro trabalha por você enquanto continua na sua garagem
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-body">
            Sem burocracia de agência e sem abrir mão do seu veículo no dia a
            dia.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2">
          {cards.map((c, i) => (
            <SpotlightCard
              key={c.title}
              as="div"
              index={i}
              className="flex flex-col overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-card sm:p-8"
            >
              <div className="relative flex min-h-[170px] items-center">
                {c.visual}
              </div>
              <h3 className="relative mt-7 text-[20px] font-bold leading-snug">
                {c.title}
              </h3>
              <p className="relative mt-2 text-[15px] leading-relaxed text-body">
                {c.text}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
