import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Diagnóstico de Automação IA | Potencializa",
  description:
    "Descubra em minutos quais processos da sua empresa podem ser automatizados com IA e quanto você pode economizar.",
  openGraph: {
    title: "Diagnóstico de Automação IA | Potencializa",
    description:
      "Descubra em minutos quais processos da sua empresa podem ser automatizados com IA.",
    siteName: "Potencializa",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full flex flex-col bg-[#001f3f] text-white">
        {children}
      </body>
    </html>
  );
}
