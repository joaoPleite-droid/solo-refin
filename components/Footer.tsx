import Image from "next/image";
import { site } from "@/lib/site";

const nav = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Prazos", href: "#prazos" },
  { label: "Vantagens", href: "#vantagens" },
  { label: "Dúvidas frequentes", href: "#duvidas" },
];

const linkClass =
  "inline-flex min-h-[44px] items-center text-[14px] text-slate-300 transition-colors hover:text-white";

export default function Footer() {
  return (
    <footer className="bg-ink pb-20 text-slate-300 md:pb-0">
      <div className="wrap grid gap-12 py-14 lg:grid-cols-12 lg:gap-10 lg:py-20">
        <div className="lg:col-span-5">
          <p
            aria-label="Solopromotora"
            className="flex items-center gap-3 font-display text-[22px] font-extrabold leading-none tracking-tight text-white"
          >
            <Image
              src="/logo.png"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span>
              SOLO
              <span className="font-semibold text-slate-400">PROMOTORA</span>
            </span>
          </p>
          <p className="mt-5 inline-block rounded-md border border-slate-700 px-3 py-1.5 text-[12px] font-medium text-slate-200">
            Correspondente Autorizado Banco Daycoval
          </p>
          <p className="mt-5 max-w-[400px] text-[14px] leading-relaxed text-slate-400">
            Especialistas em refinanciamento de carros a partir de 2003, com
            atendimento humano do primeiro contato até o dinheiro na conta.
          </p>
        </div>

        <nav aria-label="Rodapé" className="lg:col-span-3 lg:col-start-6">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-wider text-slate-400">
            Navegação
          </h2>
          <ul className="mt-3">
            {nav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={linkClass}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h2 className="font-display text-[13px] font-semibold uppercase tracking-wider text-slate-400">
            Atendimento
          </h2>
          <ul className="mt-3">
            <li>
              <a
                href={site.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                WhatsApp {site.whatsapp}
              </a>
            </li>
            <li>
              <a href={site.phoneHref} className={linkClass}>
                Telefone {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contactEmail}`} className={linkClass}>
                {site.contactEmail}
              </a>
            </li>
            <li className="flex min-h-[44px] items-center text-[14px] text-slate-300">
              {site.hours}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="wrap py-8">
          <p className="max-w-[860px] text-[12px] leading-relaxed text-slate-400">
            A {site.name} atua como correspondente bancário autorizado do Banco
            Daycoval S.A., nos termos da Resolução CMN nº 4.935. A análise de
            crédito, as taxas e as condições da operação são definidas pelo
            banco e sujeitas à aprovação. A {site.name} não cobra nenhum valor
            antecipado para aprovação ou liberação de crédito.
          </p>
          <p className="mt-4 max-w-[860px] text-[12px] leading-relaxed text-slate-500">
            {site.legalName} • CNPJ {site.cnpj} • {site.addressLine}.{" "}
            {site.activity}.
          </p>
          <div className="mt-5 flex flex-col gap-1 text-[12px] text-slate-400 sm:flex-row sm:items-center sm:gap-6">
            <span>© 2026 {site.name}</span>
            <a
              href={site.privacyHref}
              className="inline-flex min-h-[44px] items-center hover:text-white sm:min-h-0"
            >
              Política de Privacidade (LGPD)
            </a>
            <a
              href={site.termsHref}
              className="inline-flex min-h-[44px] items-center hover:text-white sm:min-h-0"
            >
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
