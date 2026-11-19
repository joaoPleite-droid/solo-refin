import { simularHref } from "@/lib/simularUrl";

/** CTA da landing: abre /simular em nova aba, repassando valor e prazo. */
export default function SimulatorButton({
  className,
  children,
  options,
}: {
  className?: string;
  children: React.ReactNode;
  options?: { amount?: number; term?: string };
}) {
  return (
    <a
      href={simularHref(options)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
