// Helper tipado do Meta Pixel. Sem Pixel instalado (sem ID), tudo vira no-op.

export type MetaStandardEvent =
  | "PageView"
  | "ViewContent"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Lead"
  | "CompleteRegistration";

const STANDARD = new Set<string>([
  "PageView",
  "ViewContent",
  "InitiateCheckout",
  "AddPaymentInfo",
  "Lead",
  "CompleteRegistration",
]);

/**
 * Dispara um evento no Pixel sempre com eventID, para desduplicar com o mesmo
 * evento enviado pela API de Conversões (CAPI) no servidor/CRM.
 * Eventos padrão usam "track"; os demais (ex.: DisqualifiedLead) "trackCustom".
 */
export function trackMetaEvent(
  eventName: MetaStandardEvent | (string & {}),
  params: Record<string, unknown> | undefined,
  eventId: string,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  const method = STANDARD.has(eventName) ? "track" : "trackCustom";
  window.fbq(method, eventName, params ?? {}, { eventID: eventId });
}
