import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
});

const OG_IMAGE = {
  url: "/og-uma.png",
  width: 1672,
  height: 941,
  alt: "Atlas Anatómico 3D de la Universidad María Auxiliadora",
};

/**
 * Absolute URLs for og:image and friends. Resolved per host so a preview
 * deployment does not advertise another origin's assets:
 *   1. NEXT_PUBLIC_SITE_URL — explicit override, wins everywhere
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the project's stable production domain
 *   3. the original Cloudflare/OpenAI host
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://anatomy-atelier.openai.site");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Atlas Anatómico 3D | UMA",
  description:
    "Explora órganos humanos en 3D y aprende anatomía de forma interactiva con la Universidad María Auxiliadora.",
  applicationName: "Atlas Anatómico 3D UMA",
  keywords: ["anatomía", "anatomía 3D", "cuerpo humano", "educación médica", "aprendizaje interactivo", "UMA"],
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    locale: "es_PE",
    type: "website",
    siteName: "Atlas Anatómico 3D UMA",
    title: "Atlas Anatómico 3D | UMA",
    description: "Explora el cuerpo humano mediante modelos anatómicos 3D interactivos.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Atlas Anatómico 3D | UMA",
    description: "Explora el cuerpo humano mediante modelos anatómicos 3D interactivos.",
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#e5154f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-PE">
      <body
        className={`${sans.variable} ${serif.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
