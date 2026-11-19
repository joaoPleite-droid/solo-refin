import type { Metadata } from "next";
import LegalPage, { H2, P } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Termos de Uso | Solopromotora",
};

// TEXTO-BASE: recomenda-se revisão jurídica antes da publicação em escala.
// Os dados da empresa vêm de lib/site.ts.
export default function TermosPage() {
  return (
    <LegalPage title="Termos de Uso" updated="novembro de 2026">
      <H2>1. Quem somos</H2>
      <P>
        Este site é operado por {site.legalName}, nome fantasia {site.tradeName},
        CNPJ {site.cnpj}, com sede em {site.addressLine}. Nossa atividade
        regulamentada: {site.activity}.
      </P>

      <H2>2. Natureza do serviço</H2>
      <P>
        A {site.name} atua como correspondente bancário autorizado do Banco
        Daycoval S.A., nos termos da Resolução CMN nº 4.935. Não somos uma
        instituição financeira e não concedemos crédito: a análise, a aprovação
        e a contratação são de responsabilidade exclusiva do Banco Daycoval.
      </P>

      <H2>3. Simulações são estimativas</H2>
      <P>
        Os valores, prazos e parcelas apresentados neste site são estimativas
        ilustrativas. Eles dependem de análise cadastral e de crédito, e de
        avaliação documental e presencial do veículo, e podem ser alterados ou
        não aprovados pelo Banco Daycoval. Nenhuma simulação representa oferta,
        promessa ou garantia de aprovação do crédito.
      </P>

      <H2>4. Requisitos e informações fornecidas</H2>
      <P>
        Para solicitar uma análise, você declara que as informações prestadas
        são verdadeiras, completas e de sua titularidade, e que o veículo está
        em seu nome. As condições de elegibilidade (como tipo e ano do veículo,
        estado de residência e ausência de restrições cadastrais) são definidas
        pelo Banco Daycoval e podem mudar sem aviso prévio.
      </P>

      <H2>5. Sem cobrança antecipada</H2>
      <P>
        A {site.name} não cobra nenhum valor antecipado para aprovação ou
        liberação de crédito. Desconfie de qualquer contato que peça pagamentos
        antecipados em nosso nome e avise-nos pelos canais oficiais.
      </P>

      <H2>6. Uso do site</H2>
      <P>
        Você se compromete a usar o site de forma lícita e a não tentar acessar
        áreas restritas, interferir no funcionamento ou usar dados de terceiros
        sem autorização. Marcas, textos e elementos visuais do site pertencem à{" "}
        {site.name} ou a seus licenciantes.
      </P>

      <H2>7. Privacidade</H2>
      <P>
        O tratamento dos seus dados pessoais está descrito na nossa{" "}
        <a
          href={site.privacyHref}
          className="font-semibold text-brand underline underline-offset-2"
        >
          Política de Privacidade
        </a>
        .
      </P>

      <H2>8. Alterações</H2>
      <P>
        Podemos atualizar estes termos a qualquer momento. A versão vigente é
        sempre a publicada nesta página, com a data da última atualização.
      </P>

      <H2>9. Contato</H2>
      <P>
        {site.hours}. Telefone {site.phone}. WhatsApp {site.whatsapp}. E-mail{" "}
        <a
          href={`mailto:${site.contactEmail}`}
          className="font-semibold text-brand underline underline-offset-2"
        >
          {site.contactEmail}
        </a>
        .
      </P>
    </LegalPage>
  );
}
