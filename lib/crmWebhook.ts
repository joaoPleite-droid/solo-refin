// Monta o payload no formato aceito pelo Lead Webhook do CRM Whats Profissional
// (https://crm.whatsprofissional.com/configuracoes → Webhooks → Lead Webhook).
// Usado só no servidor (app/api/lead/route.ts): nunca importar em código de cliente.

import type { FormState } from "./simular";
import { digits, formatBRL } from "./lead";
import { UFS } from "./simular";

// Recebe o objeto de tracking já normalizado pela rota (Record<string,string>
// com pelo menos estas chaves — ver TRACKING_KEYS em app/api/lead/route.ts).
type Tracking = Record<string, string>;

const ufLabel = (uf: string) => UFS.find(([sigla]) => sigla === uf)?.[1] ?? uf;

/**
 * O CRM não tem campos próprios para veículo/crédito/profissão/endereço
 * (só nome, telefone, e-mail, documento, origem e segmento). Por isso todo
 * esse contexto vai formatado dentro de "necessidade", que o CRM grava como
 * nota no lead — assim quem for ligar já vê tudo de uma vez.
 */
function buildNecessidade(form: FormState, protocolo: string): string {
  const lines = [
    `Simulação de refinanciamento de veículo${protocolo ? " — " + protocolo : ""}`,
    "",
    "Veículo:",
    `- Tipo: ${form.vehicleType || "—"}`,
    `- Placa: ${form.plate || "—"}`,
    `- Câmbio: ${form.transmission || "—"}`,
    `- Veículo no nome do solicitante: ${form.owner || "—"}`,
    `- UF do veículo: ${form.uf ? ufLabel(form.uf) : "—"}`,
    `- Restrição SPC/Serasa: ${form.spc || "—"}`,
    "",
    "Crédito desejado:",
    `- Valor: ${formatBRL(form.amountCents / 100)}`,
    `- Prazo: ${form.term ? `${form.term} meses` : "—"}`,
    "",
    "Profissional:",
    `- Ocupação: ${form.occupation || "—"}`,
    `- Empregador/atividade: ${form.employer || "—"}`,
    `- Tempo no emprego/atividade: ${form.tenure || "—"}`,
    `- Renda mensal: ${formatBRL(form.incomeCents / 100)}`,
    "",
    "Endereço:",
    `- ${form.street || "—"}, ${form.number || "s/n"}${form.complement ? " - " + form.complement : ""}`,
    `- ${form.district || "—"} — ${form.city || "—"}/${form.addrUf ? ufLabel(form.addrUf) : "—"}`,
    `- CEP: ${form.cep || "—"}`,
    `- Moradia: ${form.housing || "—"}`,
    "",
    "Pessoal:",
    `- Nascimento: ${form.birth || "—"} em ${form.birthCity || "—"}/${form.birthUf ? ufLabel(form.birthUf) : "—"}`,
    `- Nome da mãe: ${form.mother || "—"}`,
    "",
    `Aceitou a Política de Privacidade: ${form.consent ? "Sim" : "Não"}`,
  ];
  return lines.join("\n");
}

export function buildLeadWebhookPayload(
  form: FormState,
  tracking: Tracking,
  meta: { ip: string | null; userAgent: string | null },
) {
  return {
    nome: form.name,
    telefone: digits(form.phone),
    email: form.email.toLowerCase(),
    documento: digits(form.cpf),
    origem: "Site institucional",
    necessidade: buildNecessidade(form, tracking.protocolo),
    form_id: "simular-refinanciamento",
    form_name: "Simulação — Refinanciamento de Veículo",
    page_url: tracking.page_url || undefined,
    ip_address: meta.ip || undefined,
    user_agent: meta.userAgent || undefined,
    utm_source: tracking.utm_source || undefined,
    utm_medium: tracking.utm_medium || undefined,
    utm_campaign: tracking.utm_campaign || undefined,
    utm_content: tracking.utm_content || undefined,
    utm_term: tracking.utm_term || undefined,
  };
}
