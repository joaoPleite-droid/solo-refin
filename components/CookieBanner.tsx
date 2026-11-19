"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { acceptConsent, getConsent } from "@/lib/consent";
import { site } from "@/lib/site";

/**
 * Aviso discreto de cookies. Fica acima da barra fixa do mobile na landing
 * (para nunca cobrir o botão de ação) e respeita a área segura do iPhone.
 */
export default function CookieBanner() {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  const accept = () => {
    acceptConsent();
    setVisible(false);
  };

  // Na landing, a barra fixa de CTA (só mobile) ocupa a base da tela.
  const aboveCtaBar = pathname === "/";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label="Aviso de cookies"
          className={`fixed inset-x-3 z-50 mx-auto max-w-[560px] ${
            aboveCtaBar
              ? "bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] md:bottom-[calc(env(safe-area-inset-bottom)+0.75rem)]"
              : "bottom-[calc(env(safe-area-inset-bottom)+0.75rem)]"
          }`}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-card backdrop-blur-md sm:flex-row sm:items-center sm:gap-4">
            <p className="text-[13px] leading-relaxed text-body">
              Usamos cookies para melhorar a sua experiência e medir o
              desempenho de campanhas de anúncios.{" "}
              <a
                href={site.privacyHref}
                className="font-semibold text-ink underline underline-offset-2"
              >
                Política de Privacidade
              </a>
              .
            </p>
            <button
              type="button"
              onClick={accept}
              className="btn-primary min-h-[48px] shrink-0 px-6 text-[14px]"
            >
              Aceitar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
