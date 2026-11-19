// Captura de atribuição (Meta Ads) no navegador.

export type Tracking = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  fbclid: string;
  fbp: string;
  fbc: string;
  /** Mesmo ID para o Pixel (navegador) e a API de Conversões (servidor): deduplica o evento. */
  event_id: string;
  page_url: string;
  referrer: string;
  /** Preenchido no envio final: #SOLO-AAAA-XXXXX. */
  protocolo: string;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

const STORE = "solo_tracking_v1";
const EVENT_ID = "solo_event_id_v1";

function readCookie(name: string) {
  const m = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&") + "=([^;]*)"),
  );
  return m ? decodeURIComponent(m[1]) : "";
}

function safeStorage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "ev-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}

/**
 * Lê UTMs/fbclid da URL (e guarda na sessão: o primeiro contato vence, mesmo
 * que o usuário navegue), mais os cookies _fbp/_fbc e um event_id por sessão.
 */
export function captureTracking(): Tracking {
  const store = safeStorage();
  let saved: Partial<Tracking> = {};
  try {
    saved = JSON.parse(store?.getItem(STORE) ?? "{}");
  } catch {
    saved = {};
  }

  const params = new URLSearchParams(window.location.search);
  const t: Record<string, string> = {};
  for (const k of KEYS) t[k] = params.get(k) || (saved[k] ?? "");

  // _fbc: cookie do Meta; se não existir mas há fbclid, monta no formato oficial.
  const fbp = readCookie("_fbp");
  // Cookie do Meta vence; senão, um fbclid novo na URL gera um _fbc novo;
  // sem fbclid novo, mantém o da sessão.
  let fbc = readCookie("_fbc");
  if (!fbc) {
    const urlFbclid = params.get("fbclid");
    fbc = urlFbclid
      ? `fb.1.${Date.now()}.${urlFbclid}`
      : (saved.fbc ?? "");
  }

  let eventId = store?.getItem(EVENT_ID) ?? "";
  if (!eventId) {
    eventId = uuid();
    try {
      store?.setItem(EVENT_ID, eventId);
    } catch {
      /* sem storage: segue só com o ID em memória */
    }
  }

  const out: Tracking = {
    utm_source: t.utm_source,
    utm_medium: t.utm_medium,
    utm_campaign: t.utm_campaign,
    utm_content: t.utm_content,
    utm_term: t.utm_term,
    fbclid: t.fbclid,
    fbp,
    fbc,
    event_id: eventId,
    page_url: window.location.href,
    referrer: document.referrer,
    protocolo: "",
  };

  try {
    store?.setItem(STORE, JSON.stringify(out));
  } catch {
    /* ignora */
  }
  return out;
}

/** Protocolo exibido no comprovante: SOLO-2026-A7K2P (a exibição acrescenta o "#"). */
export function makeProtocol() {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint32Array(5);
  crypto.getRandomValues(bytes);
  let s = "";
  for (const n of bytes) s += A[n % A.length];
  return `SOLO-${new Date().getFullYear()}-${s}`;
}
