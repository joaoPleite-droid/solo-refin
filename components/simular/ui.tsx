"use client";

import { Check } from "lucide-react";

export const inputClass = (error?: string) =>
  `h-14 w-full scroll-mt-28 rounded-xl border bg-white px-4 text-base text-ink outline-none transition-colors duration-150 placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20 ${
    error ? "border-red-500" : "border-slate-300"
  }`;

/** Pergunta com rótulo, dica e erro. */
export function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14px] font-semibold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-msg`} role="alert" className="mt-2 text-[13px] text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-msg`} className="mt-2 text-[13px] leading-snug text-body">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Cartões táteis de seleção única. */
export function Choice({
  legend,
  name,
  options,
  value,
  onChange,
  error,
  cols = 2,
  variant = "cards",
}: {
  legend: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
  cols?: 1 | 2;
  /** cards: grandes; pills: lado a lado, 48px; stack: empilhadas, para colunas estreitas. */
  variant?: "cards" | "pills" | "stack";
}) {
  const groupCls =
    variant === "pills"
      ? "grid grid-cols-2 gap-2.5"
      : variant === "stack"
        ? "flex flex-col gap-2"
        : `grid gap-2.5 ${cols === 2 ? "sm:grid-cols-2" : ""}`;
  const btnCls =
    variant === "pills"
      ? "min-h-[48px] justify-center whitespace-nowrap px-2 text-[15px]"
      : variant === "stack"
        ? "min-h-[48px] justify-center px-2 text-[14px]"
        : "min-h-[56px] px-4 text-left text-[15px]";
  return (
    <fieldset>
      <legend className="mb-2 block text-[14px] font-semibold text-ink">
        {legend}
      </legend>
      <div
        role="radiogroup"
        aria-label={legend}
        className={groupCls}
      >
        {options.map((o) => {
          const on = value === o;
          return (
            <button
              key={o}
              type="button"
              name={name}
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o)}
              className={`flex w-full items-center gap-2.5 rounded-xl border font-semibold leading-snug ${btnCls} transition-[background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.985] ${
                on
                  ? "border-brand bg-violet-50/60 text-ink"
                  : "border-slate-200 bg-white text-ink [@media(hover:hover)]:hover:border-slate-400"
              }`}
            >
              {variant === "cards" && (
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150 ${
                    on ? "border-brand bg-brand text-white" : "border-slate-300 bg-white"
                  }`}
                >
                  {on && <Check size={12} strokeWidth={3} />}
                </span>
              )}
              {o}
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-2 text-[13px] text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  );
}
