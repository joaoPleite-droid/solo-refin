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
 * O campo "Necessidade" do CRM (crm.whatsprofissional.com) é um sistema de
 * terceiros cujo front-end exibe esse campo com `white-space: normal`,
 * então qualquer quebra de linha enviada é colapsada visualmente (isso foi
 * confirmado inspecionando o DOM de um lead real: o texto chega intacto
 * com \n, mas é renderizado em um parágrafo só). Não temos acesso ao
 * código desse sistema para corrigir a causa raiz lá, então aqui geramos
 * o texto já pensado para ficar legível em uma única linha: emojis por
 * seção, títulos em maiúsculas e " | " como separador único.
 */
const ownerLabel = (v: string) => {
  if (v === "Sim") return "Em nome do solicitante";
  if (v === "Não") return "Em nome de terceiro";
  return v || "—";
};

const spcLabel = (v: string) => {
  if (v === "Não possuo") return "Sem restrições";
  if (v === "Sim, possuo") return "Possui restrições";
  return v || "—";
};

function buildNecessidade(form: FormState, protocolo: string): string {
  const parts = [
    `📋 SIMULAÇÃO DE REFINANCIAMENTO | ${protocolo || "—"}`,
    [
      `🚗 VEÍCULO: ${form.vehicleType || "—"}`,
      `Placa: ${form.plate || "—"}`,
      `Câmbio: ${form.transmission || "—"}`,
      `Propriedade: ${ownerLabel(form.owner)}`,
      `UF: ${form.uf ? ufLabel(form.uf) : "—"}`,
      `SPC/Serasa: ${spcLabel(form.spc)}`,
    ].join(" | "),
    [
      `💰 CRÉDITO: Valor solicitado: ${formatBRL(form.amountCents / 100)}`,
      `Prazo: ${form.term ? `${form.term} meses` : "—"}`,
    ].join(" | "),
    [
      `💼 PROFISSIONAL: Regime: ${form.occupation || "—"}`,
      `Empresa: ${form.employer || "—"}`,
      `Tempo de trabalho: ${form.tenure || "—"}`,
      `Renda mensal: ${formatBRL(form.incomeCents / 100)}`,
    ].join(" | "),
    [
      `📍 ENDEREÇO: ${form.street || "—"}, ${form.number || "s/n"}${form.complement ? ` (${form.complement})` : ""}`,
      form.district || "—",
      `${form.city || "—"}/${form.addrUf ? ufLabel(form.addrUf) : "—"}`,
      `CEP: ${form.cep || "—"}`,
      `Moradia: ${form.housing || "—"}`,
    ].join(" | "),
    [
      `👤 DADOS PESSOAIS: Nascimento: ${form.birth || "—"}`,
      `Naturalidade: ${form.birthCity || "—"}/${form.birthUf ? ufLabel(form.birthUf) : "—"}`,
      `Nome da mãe: ${form.mother || "—"}`,
    ].join(" | "),
    `🔒 PRIVACIDADE: Política de Privacidade aceita: ${form.consent ? "Sim" : "Não"}`,
  ];
  return parts.join(" | ");
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
