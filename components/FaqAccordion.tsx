"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { site } from "@/lib/site";

const faqs = [
  {
    q: "Quais veículos posso refinanciar?",
    a: "Carros a partir de 2003. A avaliação final do veículo é feita pelo Banco Daycoval.",
  },
  {
    q: "Preciso entregar ou deixar meu veículo guardado?",
    a: "Não. O veículo entra apenas como garantia no contrato, mas continua 100% com você para trabalhar, viajar e usar normalmente no dia a dia.",
  },
  {
    q: "Quanto posso pegar emprestado?",
    a: "Você pode solicitar até 80% do valor da tabela FIPE do seu veículo, sujeito à análise de crédito e avaliação do Banco Daycoval.",
  },
  {
    q: "Como são definidas as condições?",
    a: "Condições especiais definidas pelo ano e modelo do seu carro, não pelo seu CPF. As condições finais são confirmadas pelo Banco Daycoval após a análise de crédito.",
  },
  {
    q: "O veículo precisa estar quitado?",
    a: "Preferencialmente sim. Caso ainda exista um saldo devedor pequeno, nossa equipe avalia a possibilidade de quitação dentro da própria operação.",
  },
  {
    q: "Simular afeta meu score de crédito?",
    a: "Não. A simulação inicial é 100% gratuita, sem compromisso e não gera consulta negativa no seu CPF.",
  },
  {
    q: "Em quanto tempo o dinheiro cai na conta?",
    a: "Após a aprovação da proposta, vistoria digital rápida e assinatura eletrônica do contrato, o valor é transferido diretamente para a sua conta bancária.",
  },
];

export default function FaqAccordion() {
  const reduce = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const heightSpring = reduce
    ? { duration: 0 }
    : {
        height: { type: "spring", stiffness: 260, damping: 30 },
        opacity: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section
      id="duvidas"
      className="scroll-mt-20 border-t border-slate-200 bg-surface"
    >
      <div className="wrap grid gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="text-[13px] font-semibold text-brand">Dúvidas</p>
            <h2 className="mt-3 text-[32px] font-extrabold leading-[1.08] sm:text-[44px]">
              Perguntas frequentes
            </h2>
            <p className="mt-5 max-w-[400px] text-[16px] leading-relaxed text-body">
              O essencial sobre o refinanciamento de veículo. Se ficou alguma
              dúvida, fale com quem acompanha a sua proposta.
            </p>
            <a
              href={site.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-[44px] items-center border-b border-slate-300 text-[15px] font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Falar com um especialista
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <ul className="divide-y divide-slate-200 border-y border-slate-200">
            {faqs.map((f, i) => {
              const open = openIndex === i;
              return (
                <li key={f.q}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`faq-${i}`}
                      id={`faq-btn-${i}`}
                      onClick={() => setOpenIndex(open ? null : i)}
                      className="flex min-h-[44px] w-full items-center justify-between gap-6 py-5 text-left font-display text-[17px] font-semibold tracking-tight text-ink"
                    >
                      {f.q}
                      {/* "+" gira 45° e vira "×" ao abrir. */}
                      <motion.span
                        aria-hidden="true"
                        initial={false}
                        animate={{ rotate: open ? 45 : 0 }}
                        transition={
                          reduce
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 400, damping: 26 }
                        }
                        className="flex shrink-0 text-brand"
                      >
                        <Plus size={20} />
                      </motion.span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="content"
                        id={`faq-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={heightSpring}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[560px] pb-6 text-[15px] leading-relaxed text-body">
                          {f.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
