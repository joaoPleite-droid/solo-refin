"use client";

import { useEffect, useState } from "react";

// Atendimento: segunda a sexta, das 08h30 às 18h00 (horário de Brasília).
// Mantenha em sincronia com `site.hours`. Feriados não são considerados.
const OPEN_MIN = 8 * 60 + 30;
const CLOSE_MIN = 18 * 60;

function isBusinessHours(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? -1);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const t = hour * 60 + minute;
  return !["Sat", "Sun"].includes(weekday) && t >= OPEN_MIN && t < CLOSE_MIN;
}

export default function AvailabilityIndicator() {
  // Começa no texto "fora do horário" (sempre verdadeiro) e corrige após montar,
  // evitando divergência entre servidor e navegador.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tick = () => setOpen(isBusinessHours());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="flex items-center gap-2.5 text-[13px] text-body">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {open && (
          <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-action/60 motion-reduce:animate-none" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            open ? "bg-action" : "bg-slate-400"
          }`}
        />
      </span>
      {open
        ? "Especialistas Solopromotora online agora"
        : "Simulação online 24h • Retorno rápido em horário comercial"}
    </p>
  );
}
