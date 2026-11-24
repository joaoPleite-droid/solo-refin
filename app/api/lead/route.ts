import { NextResponse } from "next/server";
import { allErrors, coerceForm } from "@/lib/simular";
import { buildLeadWebhookPayload } from "@/lib/crmWebhook";

export const runtime = "nodejs";

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

  const meta = {
    ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    userAgent: req.headers.get("user-agent"),
  };

  const payload = buildLeadWebhookPayload(form, tracking, meta);

  const webhook = process.env.CRM_WEBHOOK_URL;

  // Sem webhook configurado: não trava a experiência do cliente.
  if (!webhook) {
    console.warn("[api/lead] CRM_WEBHOOK_URL não configurada: lead não encaminhado.");
    return NextResponse.json({ ok: true, forwarded: false });
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  // Token opcional do Lead Webhook (gerado em Configurações → Webhooks no CRM).
  // Sem ele configurado, o CRM aceita a requisição do mesmo jeito.
  if (process.env.CRM_WEBHOOK_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.CRM_WEBHOOK_TOKEN}`;
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers,
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
