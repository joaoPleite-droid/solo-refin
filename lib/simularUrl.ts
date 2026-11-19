/** Link para /simular, repassando valor e prazo quando existirem. */
export function simularHref(opts?: { amount?: number; term?: string }) {
  const p = new URLSearchParams();
  if (opts?.amount && opts.amount > 0) p.set("valor", String(Math.round(opts.amount)));
  const term = parseInt(opts?.term ?? "", 10);
  if (Number.isFinite(term)) p.set("prazo", String(term));
  const q = p.toString();
  return q ? `/simular?${q}` : "/simular";
}
