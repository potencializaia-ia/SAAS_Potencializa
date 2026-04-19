import DiagnosticForm from "@/components/DiagnosticForm";
import Image from "next/image";
import { Shield, Clock, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Diagnóstico de Automação IA | Potencializa",
  description:
    "Descubra quais processos da sua empresa podem ser automatizados com IA. Gratuito e instantâneo.",
};

export default function DiagnosticoPage() {
  return (
    <main className="min-h-screen bg-black">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1f1f1f] bg-black/80 backdrop-blur-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Potencializa" width={36} height={36} className="object-contain" />
            <span className="text-white font-bold text-base tracking-tight hidden sm:block"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Potencializa
            </span>
          </div>
          <a href="https://potencializaia.com"
            className="text-[#666] hover:text-white text-sm transition-colors">
            ← Voltar ao site
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 overflow-hidden">

        {/* Background glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ff851b]/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[200px] bg-[#7fdbff]/4 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff851b]/10 border border-[#ff851b]/20 text-[#ff851b] text-xs font-semibold mb-8 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff851b] animate-pulse" />
              DIAGNÓSTICO GRATUITO · RESULTADO EM 30 SEGUNDOS
            </div>

            <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-[1.08] tracking-tight"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Descubra o que a{" "}
              <span className="gradient-text">IA pode automatizar</span>
              <br />na sua empresa
            </h1>

            <p className="text-[#888] text-lg max-w-2xl mx-auto leading-relaxed">
              Preencha o formulário e nossa IA identifica as{" "}
              <span className="text-white font-medium">top 5 automações específicas</span>{" "}
              para o seu negócio — com estimativa real de horas e dinheiro economizados.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {[
              { icon: Shield,     text: "Dados protegidos" },
              { icon: Clock,      text: "Resultado em menos de 1 min" },
              { icon: TrendingUp, text: "ROI estimado em R$" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-[#555] text-sm">
                <Icon className="w-4 h-4 text-[#7fdbff]" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <DiagnosticForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[#444] text-xs">
          <p>© {new Date().getFullYear()} Potencializa. Todos os direitos reservados.</p>
          <p>Análise gerada por IA — estimativas baseadas em médias do mercado brasileiro.</p>
        </div>
      </footer>
    </main>
  );
}
