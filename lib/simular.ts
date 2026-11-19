// Regras, máscaras e validação do fluxo /simular.
// Compartilhado entre o formulário (cliente) e /api/lead (servidor).

import { digits, isValidCpf } from "./lead";

// Modalidade exclusiva: apenas carros de passeio. Qualquer outro valor é bloqueado
// (blockForField) e rejeitado pelo servidor.
export const VEHICLE_OPTS = ["Carro"] as const;
export const SPC_OPTS = ["Não possuo", "Sim, possuo"] as const;
export const TRANSMISSION_OPTS = ["Manual", "Automático"] as const;
export const OWNER_OPTS = ["Sim", "Não"] as const;
export const TERM_OPTS = ["24", "36", "48", "60"] as const;
export const OCCUPATION_OPTS = ["Assalariado (CLT)", "Autônomo", "Empresário"] as const;
export const TENURE_OPTS = [
  "Menos de 6 meses",
  "6 meses a 1 ano",
  "1 a 2 anos",
  "2 a 5 anos",
  "Mais de 5 anos",
] as const;
export const HOUSING_OPTS = ["Própria", "Alugada", "Financiada", "Familiar"] as const;

export const UFS = [
  ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"],
  ["BA", "Bahia"], ["CE", "Ceará"], ["DF", "Distrito Federal"], ["ES", "Espírito Santo"],
  ["GO", "Goiás"], ["MA", "Maranhão"], ["MT", "Mato Grosso"], ["MS", "Mato Grosso do Sul"],
  ["MG", "Minas Gerais"], ["PA", "Pará"], ["PB", "Paraíba"], ["PR", "Paraná"],
  ["PE", "Pernambuco"], ["PI", "Piauí"], ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"],
  ["RS", "Rio Grande do Sul"], ["RO", "Rondônia"], ["RR", "Roraima"], ["SC", "Santa Catarina"],
  ["SP", "São Paulo"], ["SE", "Sergipe"], ["TO", "Tocantins"],
] as const;

/** Estados atendidos. */
export const ELIGIBLE_UFS = ["PR", "SC", "RS", "SP", "MG", "GO", "MT", "MS"] as const;

export const isUfEligible = (uf: string) =>
  (ELIGIBLE_UFS as readonly string[]).includes(uf);

export const MIN_AMOUNT_CENTS = 1_000_000; // R$ 10.000,00

export type FormState = {
  // Etapa 1
  vehicleType: string;
  spc: string;
  uf: string;
  plate: string;
  transmission: string;
  owner: string;
  // Etapa 2
  amountCents: number;
  term: string;
  name: string;
  phone: string;
  email: string;
  // Etapa 3
  occupation: string;
  employer: string;
  tenure: string;
  incomeCents: number;
  // Etapa 4
  cpf: string;
  birth: string;
  birthCity: string;
  birthUf: string;
  mother: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  addrUf: string;
  housing: string;
  consent: boolean;
};

export const EMPTY: FormState = {
  vehicleType: "", spc: "", uf: "", plate: "", transmission: "", owner: "",
  amountCents: 0, term: "", name: "", phone: "", email: "",
  occupation: "", employer: "", tenure: "", incomeCents: 0,
  cpf: "", birth: "", birthCity: "", birthUf: "", mother: "",
  cep: "", street: "", number: "", complement: "", district: "", city: "",
  addrUf: "", housing: "", consent: false,
};

/* ───────── Máscaras ───────── */

export function maskPlate(v: string) {
  return v.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
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

export function maskCep(v: string) {
  const d = digits(v).slice(0, 8);
  return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
}

export function maskDate(v: string) {
  const d = digits(v).slice(0, 8);
  let out = d.slice(0, 2);
  if (d.length > 2) out += "/" + d.slice(2, 4);
  if (d.length > 4) out += "/" + d.slice(4);
  return out;
}

/** "R$ 10.000,00" a partir de centavos; vazio quando 0. */
export function formatMoney(cents: number) {
  if (!cents) return "";
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function parseMoney(v: string) {
  const d = digits(v).slice(0, 11);
  return d ? parseInt(d, 10) : 0;
}

/* ───────── Validações ───────── */

export const isValidPlate = (v: string) => /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(v);
export const isValidMobile = (v: string) => digits(v).length === 11;
export const isValidEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isValidFullName = (v: string) => {
  const parts = v.trim().split(/\s+/);
  return parts.length >= 2 && parts.every((p) => p.length >= 2);
};

/** Retorna "" se válido, ou a mensagem de erro. */
export function birthError(v: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return "Informe uma data válida (dd/mm/aaaa).";
  const d = Number(m[1]);
  const mo = Number(m[2]);
  const y = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (
    y < 1900 ||
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo - 1 ||
    dt.getDate() !== d
  )
    return "Informe uma data válida (dd/mm/aaaa).";
  const now = new Date();
  let age = now.getFullYear() - y;
  if (
    now.getMonth() < mo - 1 ||
    (now.getMonth() === mo - 1 && now.getDate() < d)
  )
    age -= 1;
  if (age < 18) return "É preciso ter 18 anos ou mais.";
  return "";
}

export type Errors = Partial<Record<keyof FormState, string>>;

const need = "Campo obrigatório.";

export function stepErrors(step: number, d: FormState): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!d.vehicleType) e.vehicleType = need;
    if (!d.spc) e.spc = need;
    if (!d.uf) e.uf = need;
    if (!isValidPlate(d.plate)) e.plate = "Informe a placa completa. Exemplo: ABC1D23";
    if (!d.transmission) e.transmission = need;
    if (!d.owner) e.owner = need;
  }
  if (step === 1) {
    if (d.amountCents < MIN_AMOUNT_CENTS) e.amountCents = "O valor mínimo é R$ 10.000,00.";
    if (!d.term) e.term = need;
    if (!isValidFullName(d.name)) e.name = "Informe seu nome completo.";
    if (!isValidMobile(d.phone)) e.phone = "Informe o celular com DDD (11 dígitos).";
    if (!isValidEmail(d.email)) e.email = "Informe um e-mail válido. Exemplo: email@exemplo.com";
  }
  if (step === 2) {
    if (!d.occupation) e.occupation = need;
    if (d.employer.trim().length < 2) e.employer = need;
    if (!d.tenure) e.tenure = need;
    if (d.incomeCents <= 0) e.incomeCents = "Informe o valor.";
  }
  if (step === 3) {
    if (!isValidCpf(d.cpf)) e.cpf = "CPF inválido. Confira os números.";
    const b = birthError(d.birth);
    if (b) e.birth = b;
    if (d.birthCity.trim().length < 2) e.birthCity = need;
    // Pode ter nascido em qualquer um dos 27 estados.
    if (!UFS.some(([u]) => u === d.birthUf)) e.birthUf = "Selecione o estado.";
    if (!isValidFullName(d.mother)) e.mother = "Informe o nome completo da mãe.";
    if (digits(d.cep).length !== 8) e.cep = "Informe o CEP com 8 dígitos.";
    if (d.street.trim().length < 2) e.street = need;
    if (!d.number.trim()) e.number = need;
    if (d.district.trim().length < 2) e.district = need;
    if (d.city.trim().length < 2) e.city = need;
    if (!isUfEligible(d.addrUf)) e.addrUf = "Selecione o estado.";
    if (!d.housing) e.housing = need;
    if (!d.consent) e.consent = "É necessário aceitar para enviar.";
  }
  return e;
}

/* ───────── Bloqueio imediato (filtro de leads) ───────── */

export type Block = { field: keyof FormState; title: string; message: string };

const ATENDIDOS = "Atendemos PR, SC, RS, SP, MG, GO, MT e MS.";

export function blockForField(
  field: keyof FormState,
  d: FormState,
): Block | null {
  if (field === "vehicleType" && d.vehicleType && d.vehicleType !== "Carro")
    return {
      field,
      title: "Por enquanto atendemos apenas carros",
      message:
        "No momento, a Solopromotora não consegue atender motos, caminhões e caminhonetes. Se você escolheu essa opção por engano, é só revisar sua resposta.",
    };
  if (field === "spc" && d.spc === "Sim, possuo")
    return {
      field,
      title: "Não conseguimos atender este perfil agora",
      message:
        "No momento, a Solopromotora não consegue atender perfis com restrição no SPC ou Serasa. Se você marcou essa opção por engano, é só revisar sua resposta.",
    };
  if (field === "uf" && d.uf && !isUfEligible(d.uf))
    return {
      field,
      title: "Ainda não atendemos o seu estado",
      message: `No momento, a Solopromotora não consegue atender o estado selecionado. ${ATENDIDOS} Se você escolheu o estado errado, é só revisar sua resposta.`,
    };
  if (field === "owner" && d.owner === "Não")
    return {
      field,
      title: "O veículo precisa estar no seu nome",
      message:
        "Para a análise de crédito, o veículo precisa estar em nome do solicitante. Se você respondeu por engano, é só revisar sua resposta.",
    };
  return null;
}

/** Procura qualquer condição de bloqueio no estado atual. */
export function blockFor(d: FormState): Block | null {
  for (const f of ["vehicleType", "spc", "uf", "owner"] as const) {
    const b = blockForField(f, d);
    if (b) return b;
  }
  return null;
}

/* ───────── Servidor ───────── */

const STR_KEYS = [
  "vehicleType", "spc", "uf", "plate", "transmission", "owner", "term", "name",
  "phone", "email", "occupation", "employer", "tenure", "cpf", "birth",
  "birthCity", "birthUf", "mother", "cep", "street", "number", "complement", "district",
  "city", "addrUf", "housing",
] as const;

/** Reconstrói um FormState confiável a partir de JSON desconhecido. */
export function coerceForm(raw: unknown): FormState {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const f: FormState = { ...EMPTY };
  for (const k of STR_KEYS) {
    const v = o[k];
    f[k] = typeof v === "string" ? v.trim().slice(0, 120) : "";
  }
  f.amountCents = Number.isFinite(Number(o.amountCents)) ? Math.round(Number(o.amountCents)) : 0;
  f.incomeCents = Number.isFinite(Number(o.incomeCents)) ? Math.round(Number(o.incomeCents)) : 0;
  f.consent = o.consent === true;
  return f;
}

export function allErrors(f: FormState): string[] {
  const out: string[] = [];
  for (let s = 0; s < 4; s++) out.push(...Object.keys(stepErrors(s, f)));
  const b = blockFor(f);
  if (b) out.push(`ineligible:${b.field}`);
  return out;
}

/** Payload limpo e padronizado para o CRM. */
export function buildCrmPayload(f: FormState) {
  return {
    vehicle: {
      type: f.vehicleType,
      plate: f.plate,
      transmission: f.transmission,
      ownedByApplicant: f.owner === "Sim",
      uf: f.uf,
    },
    credit: {
      desiredAmount: f.amountCents / 100,
      currency: "BRL",
      termMonths: Number(f.term),
      hasSpcSerasaRestriction: f.spc === "Sim, possuo",
    },
    contact: { name: f.name, mobile: digits(f.phone), email: f.email.toLowerCase() },
    professional: {
      occupation: f.occupation,
      employer: f.employer,
      tenure: f.tenure,
      monthlyIncome: f.incomeCents / 100,
    },
    personal: {
      cpf: digits(f.cpf),
      birthDate: f.birth,
      birthCity: f.birthCity,
      birthUf: f.birthUf,
      motherName: f.mother,
    },
    address: {
      zip: digits(f.cep),
      street: f.street,
      number: f.number,
      complement: f.complement || null,
      district: f.district,
      city: f.city,
      uf: f.addrUf,
      housing: f.housing,
    },
    consent: { privacyPolicyAccepted: f.consent },
  };
}
