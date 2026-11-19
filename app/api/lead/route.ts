import { NextResponse } from "next/server";
import { allErrors, buildCrmPayload, coerceForm } from "@/lib/simular";

export const runtime = "nodejs";

const SOURCE = "LP Refinanciamento Veículo - Solopromotora";

const TRACKING_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term",
  "fbclid", "fbp", "fbc", "event_id", "page_url", "referrer", "protocolo",
] as const;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const raw = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  // Revalida tudo no servidor: campos, formatos e regras de elegibilidade.
  const form = coerceForm(raw.form);
  const errors = allErrors(form);
  if (errors.length) {
    return NextResponse.json(
      { ok: false, error: "invalid_fields", fields: errors },
      { status: 400 },
    );
  }

  const t = (raw.tracking && typeof raw.tracking === "object" ? raw.tracking : {}) as Record<string, unknown>;
  const tracking: Record<string, string> = {};
  for (const k of TRACKING_KEYS) {
    tracking[k] = typeof t[k] === "string" ? (t[k] as string).slice(0, 500) : "";
  }

  // Protocolo com formato inválido é descartado.
  if (!/^SOLO-\d{4}-[A-Z0-9]{3,8}$/.test(tracking.protocolo)) tracking.protocolo = "";

  const payload = {
    timestamp: new Date().toISOString(),
    source: SOURCE,
    protocol: tracking.protocolo || null,
    ...buildCrmPayload(form),
    tracking,
    // Úteis para a API de Conversões da Meta (correspondência do evento).
    request: {
      ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: req.headers.get("user-agent"),
    },
  };

  const webhook = process.env.CRM_WEBHOOK_URL;

  // Sem webhook configurado: não trava a experiência do cliente.
  if (!webhook) {
    console.warn("[api/lead] CRM_WEBHOOK_URL não configurada: lead não encaminhado.");
    return NextResponse.json({ ok: true, forwarded: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[api/lead] CRM respondeu", res.status);
      return NextResponse.json({ ok: false, error: "crm_error" }, { status: 502 });
    }
    return NextResponse.json({ ok: true, forwarded: true });
  } catch (err) {
    console.error("[api/lead] falha ao chamar o CRM:", (err as Error).name);
    return NextResponse.json({ ok: false, error: "crm_unreachable" }, { status: 502 });
  }
}
