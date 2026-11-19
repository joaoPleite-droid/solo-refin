import SimulatorButton from "./SimulatorButton";
import SpotlightCard from "./SpotlightCard";
import LiveIcon from "./LiveIcon";
import { ArrowRight,CarFront, Headset, Lock, TrendingDown } from "lucide-react";

const benefits = [
  {
    icon: CarFront,
    title: "O carro continua com você",
    text: "O veículo fica apenas como garantia no documento; você segue dirigindo e trabalhando normalmente.",
  },
  {
    icon: TrendingDown,
    title: "Condições especiais para o seu carro",
    text: "Condições especiais definidas pelo ano e modelo do seu carro, não pelo seu CPF. Por ter um bem em garantia no Banco Daycoval, o custo é bem menor que o do empréstimo pessoal ou cartão.",
  },
  {
    icon: Lock,
    title: "Parcelas fixas até o fim",
    text: "Você sabe exatamente quanto vai pagar todo mês, sem sustos ou reajustes inesperados.",
  },
  {
    icon: Headset,
    title: "Atendimento humano de verdade",
    text: "Nada de ficar falando só com robô — nossa equipe acompanha sua proposta até o dinheiro cair na conta.",
  },
];

export default function BenefitsSection() {
  return (
    <section
      id="vantagens"
      className="scroll-mt-20 border-y border-slate-200 bg-surface"
    >
      <div className="wrap grid gap-12 py-14 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="text-[13px] font-semibold text-brand">Vantagens</p>
            <h2 className="mt-3 text-[32px] font-extrabold leading-[1.08] sm:text-[44px]">
              Por que fazer com a Solopromotora
            </h2>
            <p className="mt-5 max-w-[420px] text-[16px] leading-relaxed text-body">
              Crédito com garantia de veículo do Banco Daycoval, com o
              acompanhamento de quem entende do processo do começo ao fim.
            </p>
            <SimulatorButton className="btn-primary mt-8 w-full sm:w-auto">
              Simular agora
              <ArrowRight size={18} aria-hidden="true" />
            </SimulatorButton>
          </div>
        </div>

        <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:col-span-7">
          {benefits.map(({ icon: Icon, title, text }, i) => (
            <SpotlightCard
              key={title}
              as="li"
              index={i}
              lift={4}
              className="-mx-3 rounded-xl px-3 pb-3"
            >
              <div className="border-t border-slate-200 pt-6">
              <LiveIcon index={i}>
                <Icon
                  size={22}
                  strokeWidth={1.75}
                  className="text-brand"
                  aria-hidden="true"
                />
              </LiveIcon>
              <h3 className="mt-5 text-[18px] font-bold">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-body">
                {text}
              </p>
              </div>
            </SpotlightCard>
          ))}
        </ul>
      </div>
    </section>
  );
}
