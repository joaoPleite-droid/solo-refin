# Solopromotora — site de refinanciamento de veículo

Landing page (`/`) e formulário dedicado de simulação (`/simular`) da Solopromotora,
correspondente autorizado do Banco Daycoval. Next.js 15 (App Router), TypeScript,
Tailwind CSS 3 e framer-motion.

## Rotas

| Rota | O que é |
| --- | --- |
| `/` | Landing page. Todos os botões de CTA abrem `/simular` em nova aba, repassando `?valor=` e `?prazo=`. |
| `/simular` | Formulário em 4 etapas, com bloqueios de elegibilidade, auto-avanço, rastreamento Meta e protocolo final. Recebe tráfego direto de anúncios. |
| `/privacidade` | Política de Privacidade (LGPD). Texto-base: recomenda-se revisão jurídica. |
| `/termos` | Termos de Uso. Texto-base: recomenda-se revisão jurídica. |
| `/api/lead` | Revalida o lead no servidor e encaminha ao CRM. |

## Rodando localmente

Requer Node 20 ou superior.

```bash
npm install
cp .env.example .env.local   # preencha as variáveis (opcional para desenvolvimento)
npm run dev                  # http://localhost:3000
```

Build de produção:

```bash
npx tsc --noEmit
npm run build
npm start
```

## Variáveis de ambiente

| Variável | Onde | Descrição |
| --- | --- | --- |
| `CRM_WEBHOOK_URL` | servidor | Lead Webhook do CRM Whats Profissional (Configurações → Webhooks → Lead Webhook). Sem ela o site funciona e o lead não é encaminhado. **Não** use o prefixo `NEXT_PUBLIC_`: isso exporia a URL no navegador. |
| `CRM_WEBHOOK_TOKEN` | servidor | Token do Lead Webhook (Configurações → Webhooks → Autenticação do Lead Webhook → "Gerar token"). Enviado como `Authorization: Bearer`. Opcional: sem ele, o CRM aceita a requisição do mesmo jeito enquanto "Exigir token nas requisições" estiver desligado lá. **Não** use o prefixo `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_META_PIXEL_ID` | navegador | ID numérico do Meta Pixel. Vazio = o Pixel não é carregado. |

`app/api/lead/route.ts` revalida o formulário e monta o payload no formato que o
Lead Webhook espera (`lib/crmWebhook.ts`): nome, telefone, email, documento (CPF),
origem, UTMs, IP/user-agent e um campo `necessidade` com todo o resto (veículo,
crédito, profissão, endereço) formatado em texto — o CRM não tem campos próprios
para isso, então vira nota no lead.

### Deploy na Vercel

1. Suba o repositório no GitHub e importe o projeto na Vercel (framework: Next.js, sem configuração extra).
2. Em **Settings → Environment Variables**, cadastre `CRM_WEBHOOK_URL`, `CRM_WEBHOOK_TOKEN` e `NEXT_PUBLIC_META_PIXEL_ID`.
3. Faça o deploy. Variáveis `NEXT_PUBLIC_*` só entram no build seguinte à alteração.

## Rastreamento (Meta Ads)

- `lib/tracking.ts` captura `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `_fbp` e `_fbc`, e gera um `event_id` por sessão.
- `lib/metaPixel.ts` dispara os eventos sempre com `eventID` (deduplicação com a API de Conversões):
  `ViewContent` (abertura), `InitiateCheckout` (passou na etapa 1), `AddPaymentInfo` (passou na etapa 3),
  `Lead` (envio final, com o mesmo `event_id` enviado ao CRM) e `DisqualifiedLead` (bloqueio de elegibilidade).
- O Pixel só é carregado depois que o visitante clica em "Aceitar" no aviso de cookies (consentimento em `localStorage`, `lib/consent.ts`) e se `NEXT_PUBLIC_META_PIXEL_ID` estiver definido. Sem um dos dois, nenhum script é carregado e todas as chamadas viram no-op.

## Dados da empresa

Razão social, CNPJ, endereço, telefone, WhatsApp, e-mail e horário ficam em `lib/site.ts` (fonte única do rodapé, FAQ, `/privacidade` e `/termos`). O indicador de horário da Hero (`components/AvailabilityIndicator.tsx`) usa 08h30–18h00 (horário de Brasília): mantenha em sincronia com `site.hours`.

## Regras de elegibilidade (em `lib/simular.ts`)

Apenas carros; sem restrição no SPC/Serasa; veículo no nome do solicitante; valor mínimo de R$ 10.000;
estados atendidos: PR, SC, RS, SP, MG, GO, MT e MS. As mesmas regras são revalidadas no servidor.

## Antes de publicar

- Revisar com o jurídico os textos de `/privacidade` e `/termos` (prazos de retenção, encarregado/DPO, foro).
- Cadastrar `CRM_WEBHOOK_URL` e `NEXT_PUBLIC_META_PIXEL_ID` na Vercel.
