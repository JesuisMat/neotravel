import type { Metadata } from "next";
import "./globals.css";
import "../design-system/styles.css";

export const metadata: Metadata = {
  title: "NeoTravel - Trajet sur mesure",
  description:
    "Affrètement d'autocars et minibus pour entreprises, associations et établissements scolaires. Devis en quelques minutes.",
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicons/favicon.ico" },
    ],
    apple: { url: "/favicons/apple-touch-icon.png" },
    other: [
      { rel: "manifest", url: "/favicons/site.webmanifest" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: "#060F14" }}>
        {children}
      </body>
    </html>
  );
}
