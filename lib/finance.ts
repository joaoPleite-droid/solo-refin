// Cálculos ilustrativos. As condições reais são definidas pelo Banco Daycoval
// após análise de crédito; as taxas abaixo são premissas de exibição.

/**
 * Taxa efetiva interna de refinanciamento (a.m.), já considerando encargos
 * médios da operação (IOF e tarifas). Uso interno apenas no cálculo da
 * parcela: NÃO exibir em nenhum texto da página.
 */
export const REFIN_RATE = 0.0325;
/** Taxa média ilustrativa de empréstimo pessoal sem garantia (a.m.). PREMISSA: confirmar. */
export const PERSONAL_RATE = 0.055;
/** Percentual máximo da FIPE liberado. */
export const LTV = 0.8;

/** Parcela fixa (Tabela Price). */
export function pmt(principal: number, months: number, rate = REFIN_RATE) {
  return (principal * rate) / (1 - Math.pow(1 + rate, -months));
}
