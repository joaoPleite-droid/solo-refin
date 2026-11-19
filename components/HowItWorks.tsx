"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import SpotlightCard from "./SpotlightCard";

const steps = [
  {
    n: "01",
    title: "Simule em 2 min",
    text: "Informe os dados básicos do seu carro e o valor desejado, sem compromisso e sem afetar seu score.",
  },
  {
    n: "02",
    title: "Vistoria digital pelo celular",
    text: "Processo 100% online, sem papelada, com acompanhamento direto de um especialista da Solopromotora junto ao Banco Daycoval.",
  },
  {
    n: "03",
    title: "Dinheiro na sua conta",
    text: "Após a aprovação e assinatura digital do contrato, o valor cai direto na sua conta e você continua usando o carro normalmente.",
  },
];

// Progresso (0–1) da linha em que cada marcador "acende".
const THRESHOLDS = [0.01, 0.5, 0.98];

function Marker({ n, on, reduce }: { n: string; on: boolean; reduce: boolean }) {
  return (
    <motion.span
      className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border bg-[#0F172A] font-display text-[13px] font-bold tabular-nums text-white transition-colors duration-200 ${
        on ? "border-brand" : "border-white/25"
      }`}
      animate={on && !reduce ? { scale: [0.9, 1.08, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-brand"
        initial={false}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="relative">{n}</span>
    </motion.span>
  );
}

export default function HowItWorks() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });
  const [lit, setLit] = useState(0);

  useMotionValueEvent(progress, "change", (v) => {
    setLit(THRESHOLDS.filter((t) => v >= t).length);
  });

  const count = reduce ? steps.length : lit;
  const fill = reduce ? 1 : progress;

  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 bg-[#0F172A] text-white"
    >
      <div className="wrap py-14 lg:py-24">
        <div className="max-w-[640px]">
          <p className="text-[13px] font-semibold text-violet-300">
            Como funciona
          </p>
          <h2 className="mt-3 text-[32px] font-extrabold leading-[1.08] text-white sm:text-[44px]">
            Três passos simples para liberar seu crédito
          </h2>
        </div>

        <ol
          ref={ref}
          className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-x-10"
        >
          {/* Trilho + preenchimento ligado ao scroll (só transform). */}
          <span
            aria-hidden="true"
            className="absolute bottom-5 left-5 top-5 w-px overflow-hidden bg-white/15 md:bottom-auto md:left-5 md:right-[calc(33.333%-47px)] md:top-5 md:h-px md:w-auto"
          >
            <motion.span
              className="absolute inset-0 origin-top bg-violet-500 md:hidden"
              style={{ scaleY: fill }}
            />
            <motion.span
              className="absolute inset-0 hidden origin-left bg-violet-500 md:block"
              style={{ scaleX: fill }}
            />
          </span>

          {steps.map((s, i) => (
            <li key={s.n} className="relative pl-16 md:pl-0 md:pt-16">
              <Marker n={s.n} on={count > i} reduce={reduce} />
              <SpotlightCard
                as="div"
                tone="dark"
                index={i}
                className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <h3 className="text-[20px] font-bold text-white">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
                  {s.text}
                </p>
              </SpotlightCard>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
