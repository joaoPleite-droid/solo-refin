import type { Metadata } from "next";
import LegalPage, { H2, P } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidade (LGPD) | Solopromotora",
};

// TEXTO-BASE: descreve o que o site realmente coleta e por quê. Os dados da
// empresa vêm de lib/site.ts. Recomenda-se revisão jurídica (prazos de
// retenção, encarregado/DPO) antes de campanhas em escala.
export default function PrivacidadePage() {
  return (
    <LegalPage title="Política de Privacidade (LGPD)" updated="novembro de 2026">
      <H2>Quem é o controlador</H2>
      <P>
        {site.legalName}, nome fantasia {site.tradeName}, inscrita no CNPJ sob o
        nº {site.cnpj}, com sede em {site.addressLine}. Atuamos como
        correspondente de instituições financeiras do Banco Daycoval S.A., nos
        termos da Resolução CMN nº 4.935 ({site.activity}).
      </P>

      <H2>Quais dados coletamos</H2>
      <P>
        No formulário de simulação: dados do veículo (tipo, placa, transmissão e
        titularidade), de contato (nome, celular e e-mail), profissionais e de
        renda, pessoais (CPF, data de nascimento, cidade e estado de nascimento
        e nome da mãe) e de endereço. Também registramos informações de origem
        do acesso, como parâmetros de campanha (UTM) e identificadores de
        anúncios (como <em>fbclid</em>, <em>_fbp</em> e <em>_fbc</em>).
      </P>

      <H2>Para que usamos</H2>
      <P>
        Para analisar a sua solicitação, entrar em contato com você e
        encaminhar a proposta ao Banco Daycoval para análise de crédito. Os
        dados de origem do acesso servem para medir o desempenho das nossas
        campanhas de anúncios.
      </P>

      <H2>Cookies e mensuração de campanhas</H2>
      <P>
        Com o seu consentimento (botão &ldquo;Aceitar&rdquo; do aviso de
        cookies), usamos o Meta Pixel para mensurar campanhas de anúncios. Sem o
        seu aceite, esse recurso não é carregado. Você pode apagar a sua escolha
        limpando os dados do site no navegador.
      </P>

      <H2>Compartilhamento</H2>
      <P>
        Compartilhamos os dados necessários com o Banco Daycoval S.A., para a
        análise de crédito e a contratação, e com provedores que apoiam a
        operação do site e do atendimento.
      </P>

      <H2>Seus direitos</H2>
      <P>
        Nos termos da LGPD (Lei nº 13.709/2018), você pode solicitar
        confirmação do tratamento, acesso, correção, anonimização,
        portabilidade e eliminação dos seus dados, além de revogar o
        consentimento. Para exercer esses direitos, escreva para{" "}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-semibold text-brand underline underline-offset-2"
        >
          {site.contactEmail}
        </a>
        .
      </P>

      <H2>Contato</H2>
      <P>
        {site.hours}. Telefone {site.phone}. WhatsApp {site.whatsapp}.
      </P>
    </LegalPage>
  );
}
