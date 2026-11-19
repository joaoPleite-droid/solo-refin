import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SimularFlow from "@/components/simular/SimularFlow";

export const metadata: Metadata = {
  title: "Simular refinanciamento de veículo | Solopromotora",
  description:
    "Simule o refinanciamento do seu carro em poucos minutos. Correspondente autorizado do Banco Daycoval.",
};

export default function SimularPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-surface">
      {/* Cabeçalho minimalista: sem menu, para não gerar fuga de conversão. */}
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1100px] items-center justify-between px-5">
          <span className="flex items-center gap-2.5 font-display text-[24px] font-extrabold leading-none tracking-tight text-ink">
            <Image
              src="/logo.png"
              alt=""
              width={36}
              height={36}
              priority
              className="h-9 w-9"
            />
            SOLO
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center gap-1 text-[13px] font-medium text-body transition-colors hover:text-ink sm:text-[14px]"
          >
            Conhecer a Solopromotora
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </header>

      <main className="flex-1">
        <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
          <SimularFlow />
        </Suspense>
      </main>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto flex w-full max-w-[1100px] flex-col gap-1 px-5 py-6 text-[12px] leading-relaxed text-body sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Solopromotora • Correspondente autorizado do Banco Daycoval.
            Sujeito à análise e aprovação de crédito.
          </p>
          <a
            href="/privacidade"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center font-semibold text-ink underline underline-offset-2 sm:min-h-0"
          >
            Política de Privacidade (LGPD)
          </a>
        </div>
      </footer>
    </div>
  );
}
