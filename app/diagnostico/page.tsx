import DiagnosticForm from "@/components/DiagnosticForm";
import Image from "next/image";
import { Shield, Clock, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Diagnóstico de Automação IA | Potencializa",
  description:
    "Descubra quais processos da sua empresa podem ser automatizados com IA e quanto você pode economizar. Gratuito e instantâneo.",
};

export default function DiagnosticoPage() {
  return (
    <main className="min-h-screen bg-[#001f3f]">

      {/* Header */}
      <header className="border-b border-white/10 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Potencializa"
              width={40}
              height={40}
              className="object-contain"
            />
            <span
              className="text-white font-bold text-lg hidden sm:block"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              Potencializa
            </span>
          </div>
          <a
            href="https://potencializaia.com"
            className="text-white/50 hover:text-white text-sm transition-colors"
          >
            Voltar ao site
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff851b]/10 border border-[#ff851b]/30 text-[#ff851b] text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[#ff851b] animate-pulse" />
              Diagnóstico gratuito • Resultado em 30 segundos
            </div>

            <h1
              className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              Descubra o que a{" "}
              <span className="gradient-text">IA pode automatizar</span>
              <br />
              na sua empresa
            </h1>

            <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
              Preencha o formulário abaixo e nossa IA analisa os processos da sua empresa —
              retornando as <strong className="text-white/90">top 5 automações específicas</strong> com
              estimativa real de horas e dinheiro economizados.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mb-14">
            {[
              { icon: Shield,    text: "Seus dados são protegidos" },
              { icon: Clock,     text: "Resultado em menos de 1 minuto" },
              { icon: TrendingUp, text: "ROI estimado em R$" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-white/50 text-sm">
                <Icon className="w-4 h-4 text-[#7fdbff]" />
                {text}
              </div>
            ))}
          </div>

          {/* Form */}
          <DiagnosticForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <p>© {new Date().getFullYear()} Potencializa. Todos os direitos reservados.</p>
          <p>Análise gerada por Inteligência Artificial — as estimativas são baseadas em médias do mercado brasileiro.</p>
        </div>
      </footer>
    </main>
  );
}
