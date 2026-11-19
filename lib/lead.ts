// Opções, máscaras e validação compartilhadas entre o simulador (cliente)
// e a rota /api/lead (servidor).

export const VEHICLE_TYPES = [
  "Carro de passeio",
  "Utilitário / Picape",
  "Caminhão",
] as const;

export const SITUATIONS = [
  "Já está quitado no meu nome",
  "Ainda tem poucas parcelas para quitar",
  "Está financiado em outro banco",
] as const;

export const TERMS = [24, 48, 60] as const;

export const AMOUNT_MIN = 5000;
export const AMOUNT_MAX = 80000;
export const AMOUNT_STEP = 1000;

export type VehicleType = (typeof VEHICLE_TYPES)[number];
export type Situation = (typeof SITUATIONS)[number];
export type Term = (typeof TERMS)[number];

export type LeadInput = {
  vehicleType: VehicleType;
  situation: Situation;
  amount: number;
  term: Term;
  model: string;
  plate: string;
  name: string;
  phone: string; // somente dígitos
  cpf: string; // somente dígitos
};

export const digits = (v: string) => v.replace(/\D/g, "");

export function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
}

export function maskPhone(v: string) {
  const d = digits(v).slice(0, 11);
  let out = "";
  if (d.length > 0) out = "(" + d.slice(0, 2);
  if (d.length >= 3) out += ") " + d.slice(2, 7);
  if (d.length > 7) out += "-" + d.slice(7);
  return out;
}

export function maskCpf(v: string) {
  const d = digits(v).slice(0, 11);
  let out = d.slice(0, 3);
  if (d.length > 3) out += "." + d.slice(3, 6);
  if (d.length > 6) out += "." + d.slice(6, 9);
  if (d.length > 9) out += "-" + d.slice(9);
  return out;
}

export function maskPlate(v: string) {
  const p = v
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 7);
  return p.length > 3 ? p.slice(0, 3) + "-" + p.slice(3) : p;
}

export function isValidPlate(v: string) {
  return /^[A-Z]{3}-?\d[A-Z0-9]\d{2}$/.test(v);
}

export function isValidPhone(v: string) {
  const d = digits(v);
  return d.length === 11 && d[2] === "9";
}

export function isValidName(v: string) {
  const parts = v.trim().split(/\s+/);
  return parts.length >= 2 && parts.every((p) => p.length >= 2);
}

export function isValidCpf(v: string) {
  const d = digits(v);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(d[i]) * (len + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === Number(d[9]) && calc(10) === Number(d[10]);
}

type Result =
  | { ok: true; data: LeadInput }
  | { ok: false; errors: string[] };

export function validateLead(raw: unknown): Result {
  const errors: string[] = [];
  const b = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;
  const str = (k: string) => (typeof b[k] === "string" ? (b[k] as string) : "");

  const vehicleType = str("vehicleType") as VehicleType;
  if (!VEHICLE_TYPES.includes(vehicleType)) errors.push("vehicleType");

  const situation = str("situation") as Situation;
  if (!SITUATIONS.includes(situation)) errors.push("situation");

  const amount = Number(b.amount);
  if (!Number.isFinite(amount) || amount < AMOUNT_MIN || amount > AMOUNT_MAX)
    errors.push("amount");

  const term = Number(b.term) as Term;
  if (!TERMS.includes(term)) errors.push("term");

  const model = str("model").trim().slice(0, 80);
  if (model.length < 3) errors.push("model");

  const plate = maskPlate(str("plate"));
  if (plate && !isValidPlate(plate)) errors.push("plate");

  const name = str("name").trim().replace(/\s+/g, " ").slice(0, 120);
  if (!isValidName(name)) errors.push("name");

  const phone = digits(str("phone"));
  if (!isValidPhone(phone)) errors.push("phone");

  const cpf = digits(str("cpf"));
  if (!isValidCpf(cpf)) errors.push("cpf");

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    data: { vehicleType, situation, amount, term, model, plate, name, phone, cpf },
  };
}
