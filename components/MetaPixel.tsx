"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

/**
 * Script oficial do Meta Pixel. Só é carregado se NEXT_PUBLIC_META_PIXEL_ID
 * estiver definido (e for numérico) E depois que o visitante aceitar os
 * cookies no aviso. Sem um dos dois, o site funciona e nenhum evento é enviado.
 */
export default function MetaPixel() {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const sync = () => setConsented(getConsent() === "accepted");
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!id || !/^\d{5,20}$/.test(id) || !consented) return null;

  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${id}');fbq('track','PageView');`,
      }}
    />
  );
}
