// Consentimento de cookies (LGPD), guardado no localStorage.

export const CONSENT_KEY = "solo_cookie_consent_v1";
export const CONSENT_EVENT = "solo:consent";

export function getConsent(): "accepted" | null {
  try {
    return window.localStorage.getItem(CONSENT_KEY) === "accepted"
      ? "accepted"
      : null;
  } catch {
    return null;
  }
}

export function acceptConsent() {
  try {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
  } catch {
    /* sem storage: vale só para esta sessão */
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
