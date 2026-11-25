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
 * Formato pedido pelo cliente: título + seções com cabeçalho e itens em
 * lista (um por linha, com "* "). Se o campo "Necessidade" do CRM não
 * preservar quebra de linha na exibição, isso ainda aparece colapsado —
 * nesse caso o ajuste tem que ser feito no lado do CRM, não aqui.
 */
function buildNecessidade(form: FormState, protocolo: string): string {
  const lines = [
    `Código: ${protocolo || "—"}`,
    "",
    "Dados do veículo",
    `* Tipo: ${form.vehicleType || "—"}`,
    `* Placa: ${form.plate || "—"}`,
    `* Câmbio: ${form.transmission || "—"}`,
    `* Veículo no nome do solicitante: ${form.owner || "—"}`,
    `* UF: ${form.uf ? ufLabel(form.uf) : "—"}`,
    `* Restrição SPC/Serasa: ${form.spc || "—"}`,
    "",
    "Crédito desejado",
    `* Valor solicitado: ${formatBRL(form.amountCents / 100)}`,
    `* Prazo: ${form.term ? `${form.term} meses` : "—"}`,
    "",
    "Dados profissionais",
    `* Profissão: ${form.occupation || "—"}`,
    `* Empresa: ${form.employer || "—"}`,
    `* Tempo de trabalho: ${form.tenure || "—"}`,
    `* Renda mensal: ${formatBRL(form.incomeCents / 100)}`,
    "",
    "Endereço",
    `* Logradouro: ${form.street || "—"}`,
    `* Número: ${form.number || "s/n"}${form.complement ? ` (${form.complement})` : ""}`,
    `* Bairro: ${form.district || "—"}`,
    `* Cidade: ${form.city || "—"}`,
    `* Estado: ${form.addrUf ? ufLabel(form.addrUf) : "—"}`,
    `* CEP: ${form.cep || "—"}`,
    `* Tipo de moradia: ${form.housing || "—"}`,
    "",
    "Dados pessoais",
    `* Data de nascimento: ${form.birth || "—"}`,
    `* Cidade de nascimento: ${form.birthCity || "—"}`,
    `* Estado de nascimento: ${form.birthUf ? ufLabel(form.birthUf) : "—"}`,
    `* Nome da mãe: ${form.mother || "—"}`,
    "",
    "Política de Privacidade",
    `- Aceitou a Política de Privacidade: ${form.consent ? "Sim" : "Não"}`,
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
