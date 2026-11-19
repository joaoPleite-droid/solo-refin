import type { FormState, buildCrmPayload } from "./simular";
import type { Tracking } from "./tracking";

export type LeadPayload = {
  /** Estado bruto do formulário (o servidor revalida a partir dele). */
  form: FormState;
  /** Dados já normalizados (dígitos, números, booleanos) no formato do CRM. */
  data: ReturnType<typeof buildCrmPayload>;
  /** UTMs, fbclid, _fbp, _fbc, event_id e protocolo. */
  tracking: Tracking;
};

/**
 * Envia o lead ao CRM. O envio passa por /api/lead, que revalida tudo no
 * servidor e encaminha ao CRM_WEBHOOK_URL (configure no .env.local).
 */
export async function submitLeadToCRM(
  payload: LeadPayload,
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
