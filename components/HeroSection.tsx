import HeroSimulator from "./HeroSimulator";
import AvailabilityIndicator from "./AvailabilityIndicator";
import RotatingHeadline from "./RotatingHeadline";

const metrics = [
  { figure: "Até 80%", caption: "da tabela FIPE" },
  { figure: "Até 60x", caption: "parcelas fixas" },
  { figure: "100% seu", caption: "carro segue com você" },
];

export default function HeroSection() {
  return (
    <section id="inicio" className="relative bg-white">
      {/* Textura de pontos, ultra discreta, esmaecida nas bordas. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] [-webkit-mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_60%,transparent_100%)]"
      />

      <div className="wrap relative grid items-center gap-8 pb-16 pt-28 sm:pb-20 md:pt-32 lg:grid-cols-12 lg:gap-12 lg:pb-24">
        <div className="lg:col-span-7 lg:pr-6">
          <p className="flex items-stretch gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            <span className="w-0.5 shrink-0 bg-brand" aria-hidden="true" />
            <span className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
              <span>Solopromotora</span>
              <span className="hidden text-slate-300 sm:inline" aria-hidden="true">
                |
              </span>
              <span>Correspondente Banco Daycoval</span>
            </span>
          </p>

          <h1 className="mt-6 text-[38px] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[52px] lg:text-[58px]">
            <span className="block">Transforme seu carro em crédito na conta</span>
            <RotatingHeadline />
          </h1>

          <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-body sm:text-[18px]">
            Refinanciamento para carros a partir de 2003, com valores a partir
            de R$ 10 mil e parcelas fixas.
          </p>

          <dl className="mt-8 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200/80 py-3.5">
            {metrics.map((m) => (
              <div key={m.figure} className="px-3 first:pl-0 last:pr-0 sm:px-5">
                <dt className="font-display text-[17px] font-extrabold leading-tight tracking-tight text-ink tabular-nums sm:text-[24px]">
                  {m.figure}
                </dt>
                <dd className="mt-1 text-[12px] leading-snug text-body">
                  {m.caption}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-6">
            <AvailabilityIndicator />
          </div>
        </div>

        <div className="lg:col-span-5">
          <HeroSimulator />
        </div>
      </div>
    </section>
  );
}
