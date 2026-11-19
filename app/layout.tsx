import type { Metadata, Viewport } from "next";
import ButtonGlow from "@/components/ButtonGlow";
import MetaPixel from "@/components/MetaPixel";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const title =
  "Refinanciamento de Veículo | Solopromotora | Banco Daycoval";
const description =
  "Refinancie seu veículo quitado e receba dinheiro na conta sem vendê-lo. Empréstimo com garantia de veículo, libere até 80% da tabela FIPE com parcelas fixas em até 60x, com o Banco Daycoval. Simule em 2 minutos.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "refinanciamento de veículo",
    "empréstimo com garantia de veículo",
    "crédito com garantia de carro",
    "Banco Daycoval",
    "Solopromotora",
  ],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "pt_BR",
    siteName: "Solopromotora",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
        />
      </head>
      <body>
        {children}
        <ButtonGlow />
        <MetaPixel />
        <CookieBanner />
      </body>
    </html>
  );
}
