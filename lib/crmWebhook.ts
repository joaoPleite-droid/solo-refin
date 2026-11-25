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
 *
 * O campo "Necessidade" do CRM não preserva quebra de linha na exibição
 * (tudo vira um parágrafo só), então aqui usamos " • " para separar cada
 * seção — assim o texto continua legível mesmo exibido em uma linha única.
 */
function buildNecessidade(form: FormState, protocolo: string): string {
  const sections = [
    `Simulação de refinanciamento de veículo${protocolo ? " — " + protocolo : ""}`,
    [
      "Veículo",
      `tipo ${form.vehicleType || "—"}`,
      `placa ${form.plate || "—"}`,
      `câmbio ${form.transmission || "—"}`,
      `no nome do solicitante: ${form.owner || "—"}`,
      `UF ${form.uf ? ufLabel(form.uf) : "—"}`,
      `restrição SPC/Serasa: ${form.spc || "—"}`,
    ].join(", "),
    [
      "Crédito desejado",
      `${formatBRL(form.amountCents / 100)}`,
      `em ${form.term ? `${form.term} meses` : "—"}`,
    ].join(", "),
    [
      "Profissional",
      `${form.occupation || "—"}`,
      `em ${form.employer || "—"}`,
      `há ${form.tenure || "—"}`,
      `renda ${formatBRL(form.incomeCents / 100)}`,
    ].join(", "),
    [
      "Endereço",
      `${form.street || "—"}, ${form.number || "s/n"}${form.complement ? " - " + form.complement : ""}`,
      `${form.district || "—"}`,
      `${form.city || "—"}/${form.addrUf ? ufLabel(form.addrUf) : "—"}`,
      `CEP ${form.cep || "—"}`,
      `moradia ${form.housing || "—"}`,
    ].join(", "),
    [
      "Pessoal",
      `nascido em ${form.birth || "—"} em ${form.birthCity || "—"}/${form.birthUf ? ufLabel(form.birthUf) : "—"}`,
      `mãe: ${form.mother || "—"}`,
    ].join(", "),
    `Aceitou a Política de Privacidade: ${form.consent ? "Sim" : "Não"}`,
  ];
  return sections.join(" • ");
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
