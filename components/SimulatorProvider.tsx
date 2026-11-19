"use client";

import { createContext, useContext, useMemo, useState } from "react";

// Estado compartilhado da landing: o valor escolhido no mini-simulador da Hero
// alimenta a barra fixa do mobile. O formulário em si vive em /simular.
type SimulatorContextValue = {
  /** Crédito escolhido no mini-simulador (null até o usuário mexer). */
  heroCredit: number | null;
  setHeroCredit: (credit: number) => void;
};

const SimulatorContext = createContext<SimulatorContextValue | null>(null);

export function useSimulator() {
  const ctx = useContext(SimulatorContext);
  if (!ctx) throw new Error("useSimulator deve ser usado dentro de SimulatorProvider");
  return ctx;
}

export default function SimulatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [heroCredit, setHeroCredit] = useState<number | null>(null);
  const value = useMemo(() => ({ heroCredit, setHeroCredit }), [heroCredit]);
  return (
    <SimulatorContext.Provider value={value}>
      {children}
    </SimulatorContext.Provider>
  );
}
