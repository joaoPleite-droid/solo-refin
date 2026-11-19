import Image from "next/image";
import { site } from "@/lib/site";

/** Moldura das páginas legais (/privacidade e /termos): cabeçalho mínimo + texto. */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-white">
      <header className="border-b border-slate-200/80">
        <div className="mx-auto flex h-16 w-full max-w-[760px] items-center justify-between px-5">
          <a
            href="/"
            className="flex items-center gap-2.5 font-display text-[24px] font-extrabold leading-none tracking-tight text-ink"
          >
            <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9" />
            SOLO
          </a>
          <a
            href="/"
            className="inline-flex min-h-[48px] items-center text-[14px] font-medium text-body hover:text-ink"
          >
            Voltar ao site
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-5 py-12 text-[16px] leading-relaxed text-body">
        <h1 className="text-[32px] font-extrabold leading-tight">{title}</h1>
        {children}
        <p className="mt-10 text-[13px]">Última atualização: {updated}.</p>
      </main>

      <footer className="border-t border-slate-200/80">
        <div className="mx-auto w-full max-w-[760px] px-5 py-8 text-[12px] leading-relaxed text-body">
          <p>
            {site.legalName} • CNPJ {site.cnpj} • {site.addressLine}
          </p>
          <p className="mt-3 flex flex-wrap gap-x-5">
            <a href={site.privacyHref} className="inline-flex min-h-[44px] items-center underline underline-offset-2">
              Política de Privacidade
            </a>
            <a href={site.termsHref} className="inline-flex min-h-[44px] items-center underline underline-offset-2">
              Termos de Uso
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-[20px] font-bold">{children}</h2>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2">{children}</p>;
}
