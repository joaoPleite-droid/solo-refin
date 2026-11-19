"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { formatMoney, type FormState } from "@/lib/simular";
import LiveProposalCard, { Plate } from "./LiveProposalCard";

const EASE = [0.22, 1, 0.36, 1] as const;
const FLIP_DELAY = 0.25;
const FLIP_DURATION = 1.2;

const COLORS = ["#6D28D9", "#16A34A", "#A78BFA"];

// 18 partículas geométricas, posições determinísticas (sem Math.random: sem divergência de hidratação).
const PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2 + (i % 3) * 0.21;
  const r = 70 + ((i * 37) % 60);
  return {
    dx: Math.cos(a) * r,
    dy: -Math.abs(Math.sin(a)) * r * 1.15 - 40, // sobem suavemente
    rot: (i % 2 ? 1 : -1) * (90 + i * 20),
    size: 6 + (i % 3) * 3,
    color: COLORS[i % 3],
    shape: i % 3, // 0 quadrado, 1 círculo, 2 losango
    delay: (i % 6) * 0.025,
  };
});

/** Explosão leve: só transform e opacity, 1,1 s. */
function Burst() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className={`absolute ${p.shape === 1 ? "rounded-full" : p.shape === 0 ? "rounded-[2px]" : "rounded-[2px]"}`}
          style={{ width: p.size, height: p.size, backgroundColor: p.color }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: p.shape === 2 ? 45 : 0 }}
          animate={{
            x: p.dx,
            y: p.dy,
            opacity: [0, 1, 0],
            scale: [0.4, 1, 0.8],
            rotate: (p.shape === 2 ? 45 : 0) + p.rot,
          }}
          transition={{ duration: 1.1, ease: EASE, delay: p.delay, times: [0, 0.2, 1] }}
        />
      ))}
    </div>
  );
}

const faceStyle: React.CSSProperties = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};

/**
 * Coreografia de ~1,2 s: o Cartão Vivo gira em 3D (rotateY 180°) e revela o
 * Cartão de Protocolo; ao fim do giro, uma explosão discreta de partículas.
 */
export default function ProtocolFlip({
  data,
  protocol,
}: {
  data: FormState;
  protocol: string;
}) {
  const reduce = useReducedMotion();
  const [burst, setBurst] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = `#${protocol}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        /* sem suporte: o número continua visível para cópia manual */
      }
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="relative [perspective:1200px]">
      <motion.div
        className="grid"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ rotateY: reduce ? 180 : 0 }}
        animate={{ rotateY: 180 }}
        transition={{ duration: reduce ? 0 : FLIP_DURATION, delay: reduce ? 0 : FLIP_DELAY, ease: EASE }}
        onAnimationComplete={() => {
          if (!reduce) setBurst(true);
        }}
      >
        {/* Frente: o Cartão Vivo da proposta */}
        <div className="[grid-area:1/1]" style={faceStyle}>
          <LiveProposalCard data={data} variant="full" />
        </div>

        {/* Verso: Cartão de Protocolo Oficial */}
        <div
          className="[grid-area:1/1]"
          style={{ ...faceStyle, transform: "rotateY(180deg)" }}
        >
          <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#3B0764] to-[#0F172A] p-6 text-white shadow-[0_24px_48px_-24px_rgba(30,27,75,0.85)]">
            <div className="flex items-start justify-between">
              <p className="flex items-baseline gap-0.5 font-display text-[22px] font-extrabold leading-none tracking-tight">
                SOLO
                <span
                  aria-hidden="true"
                  className="inline-block h-[6px] w-[6px] rounded-full bg-action"
                />
              </p>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60">
                Cartão de protocolo
              </span>
            </div>

            <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-[#16A34A]/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-green-300 ring-1 ring-green-400/40">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Solicitação registrada ✓
            </span>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/50">
                  Protocolo
                </p>
                <p className="mt-1 break-all font-mono text-[22px] font-bold leading-tight tracking-wide">
                  #{protocol}
                </p>
              </div>
              <button
                type="button"
                onClick={copy}
                aria-label="Copiar número do protocolo"
                className="inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 text-[13px] font-semibold transition-colors duration-150 active:scale-[0.97] [@media(hover:hover)]:hover:bg-white/15"
              >
                {copied ? (
                  <>
                    <Check size={15} aria-hidden="true" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy size={15} aria-hidden="true" />
                    Copiar
                  </>
                )}
              </button>
            </div>

            <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/15 pt-4">
              <div>
                <p className="whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em] text-white/50">
                  Valor solicitado
                </p>
                <p className="mt-1 whitespace-nowrap font-display text-[19px] font-extrabold leading-none tabular-nums">
                  {formatMoney(data.amountCents)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/50">
                  Prazo
                </p>
                <p className="mt-1 font-display text-[20px] font-extrabold leading-none tabular-nums">
                  {data.term}x
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <Plate value={data.plate} />
              <div className="min-w-0 text-right">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/50">
                  Titular
                </p>
                <p className="mt-1 truncate text-[13px] font-semibold uppercase tracking-wide">
                  {data.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {burst && <Burst />}
    </div>
  );
}
