import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Barista em Casa — Café bom, sem complicação.",
  description: "Receitas, métodos e preparo guiado para café especial em casa.",
  metadataBase: new URL("https://baristaemcasa.com.br"),
  openGraph: {
    title: "Barista em Casa",
    description: "Café bom, sem complicação.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}