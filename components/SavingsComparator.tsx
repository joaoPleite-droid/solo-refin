"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatBRL } from "@/lib/lead";
import { PERSONAL_RATE, REFIN_RATE, pmt } from "@/lib/finance";
import AnimatedCurrency from "./AnimatedCurrency";
import SimulatorButton from "./SimulatorButton";

const AMOUNTS = [10000, 25000, 45000, 70000];
const TERM = 48;

export default function SavingsComparator() {
  const reduce = useReducedMotion();
  const [amount, setAmount] = useState(25000);

  const personalInstallment = pmt(amount, TERM, PERSONAL_RATE);
  const refinInstallment = pmt(amount, TERM, REFIN_RATE);
  const personalTotal = personalInstallment * TERM;
  const refinTotal = refinInstallment * TERM;
  const savings = Math.round(personalTotal - refinTotal);

  const spring = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 180, damping: 24 } as const);
  const pill = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 420, damping: 34 } as const);

  const rows = [
    {
      key: "personal",
      title: "Empréstimo pessoal ou cartão (sem garantia)",
      installment: personalInstallment,
      total: personalTotal,
      scale: 1,
      bar: "bg-slate-400",
    },
    {
      key: "refin",
      title: "Refinanciamento Solopromotora + Daycoval",
      installment: refinInstallment,
      total: refinTotal,
      scale: refinTotal / personalTotal,
      bar: "bg-brand",
    },
  ];

  return (
    <section
      id="economia"
      className="scroll-mt-20 border-y border-slate-200 bg-surface"
    >
      <div className="wrap grid gap-10 py-14 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-5">
          <p className="text-[13px] font-semibold text-brand">Economia</p>
          <h2 className="mt-3 text-[32px] font-extrabold leading-[1.08] sm:text-[44px]">
            Veja na prática quanto você economiza
          </h2>
          <p className="mt-5 max-w-[420px] text-[16px] leading-relaxed text-body">
            Escolha o valor e compare, em {TERM}x, uma operação sem garantia com
            o refinanciamento do seu veículo.
          </p>

          {/* Segmented control: a pílula desliza entre os valores. */}
          <div
            className="mt-7 grid grid-cols-4 gap-1 rounded-xl bg-slate-200/70 p-1"
            role="group"
            aria-label="Valor desejado"
          >
            {AMOUNTS.map((a) => {
              const on = amount === a;
              return (
                <button
                  key={a}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setAmount(a)}
                  className="relative inline-flex min-h-[44px] items-center justify-center rounded-lg px-1 text-[12.5px] font-semibold tabular-nums sm:text-[14px]"
                >
                  {on && (
                    <motion.span
                      layoutId="activeSavingsTab"
                      className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-brand/30"
                      transition={pill}
                    />
                  )}
                  <span
                    className={`relative transition-colors duration-150 ${
                      on ? "text-brand" : "text-body"
                    }`}
                  >
                    {formatBRL(a)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
            <ul className="divide-y divide-slate-200">
              {rows.map((r) => (
                <li key={r.key} className="p-6">
                  <p className="text-[14px] font-semibold text-ink">{r.title}</p>
                  <div
                    className="mt-3 h-10 w-full overflow-hidden rounded-md bg-slate-100"
                    role="img"
                    aria-label={`Custo total de ${formatBRL(r.total)}`}
                  >
                    <motion.div
                      className={`h-full w-full origin-left rounded-md ${r.bar}`}
                      initial={false}
                      animate={{ scaleX: r.scale }}
                      transition={spring}
                    />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-4 tabular-nums">
                    <div>
                      <dt className="text-[12px] text-body">Parcela estimada</dt>
                      <dd className="font-display text-[20px] font-bold text-ink">
                        {formatBRL(r.installment)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[12px] text-body">Custo total em {TERM}x</dt>
                      <dd className="font-display text-[20px] font-bold text-ink">
                        {formatBRL(r.total)}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>

            <div className="rounded-b-2xl border-t border-slate-200 bg-surface p-6">
              <p className="text-[13px] font-medium text-body">
                Economia estimada no final do contrato
              </p>
              <p className="mt-1 font-display text-[40px] font-extrabold leading-none tracking-tight text-action-hover tabular-nums">
                <AnimatedCurrency value={savings} />
              </p>
              <SimulatorButton
                className="btn-primary mt-5 w-full sm:w-auto"
                options={{ amount, term: `${TERM}x` }}
              >
                Garantir essa condição
              </SimulatorButton>
            </div>
          </div>

          <p className="mt-4 text-[12px] leading-relaxed text-body">
            Comparação ilustrativa em {TERM}x. Condições especiais definidas
            pelo ano e modelo do seu carro, não pelo seu CPF. As condições
            reais são definidas pelo Banco Daycoval após análise de crédito.
          </p>
        </div>
      </div>
    </section>
  );
}
