"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const items = [
  "Carros a partir de 2003",
  "Crédito a partir de R$ 10 mil",
  "Até 80% da tabela FIPE",
  "O carro continua 100% com você",
  "Correspondente autorizado Banco Daycoval",
  "Parcelas fixas em até 60x",
];

const LOOP_MS = 28000;

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {items.map((t) => (
        <li key={t} className="flex items-center whitespace-nowrap">
          <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-600">
            {t}
          </span>
          <span
            aria-hidden="true"
            className="mx-7 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-action"
          />
        </li>
      ))}
    </ul>
  );
}

export default function AuthorityBar() {
  const reduce = useReducedMotion();
  const progress = useMotionValue(0);
  // A velocidade é uma mola: pausa e retoma suavemente, sem tranco.
  const speed = useSpring(1, { stiffness: 60, damping: 18 });
  const x = useTransform(progress, (v) => `${-v * 50}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const s = Math.max(0, Math.min(1, speed.get()));
    progress.set((progress.get() + (delta / LOOP_MS) * s) % 1);
  });

  return (
    <section
      aria-label="Diferenciais da Solopromotora"
      className="border-y border-slate-200/80 bg-surface"
    >
      {reduce ? (
        <ul className="wrap flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-6">
          {items.map((t) => (
            <li
              key={t}
              className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-600"
            >
              {t}
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="overflow-hidden py-5 [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]"
          onPointerEnter={(e) => e.pointerType === "mouse" && speed.set(0)}
          onPointerLeave={() => speed.set(1)}
        >
          {/* Duas trilhas idênticas: -50% leva exatamente uma até a posição da outra. */}
          <motion.div style={{ x }} className="flex w-max">
            <Track />
            <Track hidden />
          </motion.div>
        </div>
      )}
    </section>
  );
}
