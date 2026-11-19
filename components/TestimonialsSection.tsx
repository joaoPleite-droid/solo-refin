import { BadgeCheck } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

const testimonials = [
  {
    initials: "EG",
    name: "Enilson Goedert",
    meta: "Pitanga-PR • Refinanciamento de caminhão",
    text: "Agradecendo a equipe da Solopromotora pelo excelente atendimento, com agilidade e transparência no seu atendimento! Em menos de 24 horas após o início da negociação, o dinheiro estava na conta! Recomendo.",
  },
  {
    initials: "GC",
    name: "Guido Celestino dos Santos",
    meta: "Cascavel-PR • Cliente no terceiro contrato",
    text: "Agradeço a equipe da Solopromotora pelo atendimento. Já estou no terceiro contrato de financiamento com essa empresa e sempre fizeram de tudo para dar certo. Excelente atendimento e transparência, obrigado.",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="scroll-mt-20 bg-white">
      <div className="wrap py-14 lg:py-24">
        <div className="max-w-[680px]">
          <p className="text-[13px] font-semibold text-brand">Clientes</p>
          <h2 className="mt-3 text-[32px] font-extrabold leading-[1.08] sm:text-[44px]">
            Quem já refinanciou com a Solopromotora
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-body">
            Veja o que dizem quem já passou pelo processo.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:gap-8">
          {testimonials.map((t, i) => (
            <SpotlightCard
              key={t.name}
              as="figure"
              index={i}
              lift
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,box-shadow] duration-200 ease-out lg:p-9 [@media(hover:hover)]:hover:border-brand/30 [@media(hover:hover)]:hover:shadow-card"
            >
              {/* Aspas arquitetônicas, grandes e translúcidas. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-2 -top-10 select-none font-display text-[200px] font-extrabold leading-none text-brand/10"
              >
                “
              </span>

              <div className="relative flex justify-end">
                <span className="badge-shine relative inline-flex items-center gap-1.5 overflow-hidden rounded-md border border-slate-200 bg-surface px-2.5 py-1.5 text-[12px] font-medium leading-none text-body">
                  <BadgeCheck
                    size={14}
                    strokeWidth={2}
                    className="text-action"
                    aria-hidden="true"
                  />
                  Operação verificada • Banco Daycoval
                </span>
              </div>

              <blockquote className="relative mt-8 flex-1 text-[18px] leading-relaxed text-ink">
                {t.text}
              </blockquote>
              <figcaption className="relative mt-8 flex items-center gap-3 border-t border-slate-200 pt-6">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-50 font-display text-[14px] font-bold text-brand ring-1 ring-violet-200"
                >
                  {t.initials}
                </span>
                <span>
                  <span className="block text-[15px] font-semibold text-ink">
                    {t.name}
                  </span>
                  <span className="block text-[13px] text-body">{t.meta}</span>
                </span>
              </figcaption>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
