"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, FileText, TrendingUp, Clock, DollarSign, ArrowRight, Share2, CheckCircle } from "lucide-react";
import AutomacaoCard from "@/components/AutomacaoCard";
import type { AnalysisResult, FormData } from "@/types";

const CAL_LINK  = process.env.NEXT_PUBLIC_CAL_LINK  ?? "#";
const REPORT_LINK = process.env.NEXT_PUBLIC_REPORT_LINK ?? "#";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", maximumFractionDigits: 0,
  }).format(value);
}

export default function ResultadoClient() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [form,   setForm]   = useState<FormData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const rawResult = sessionStorage.getItem("diagnostico_result");
    const rawForm   = sessionStorage.getItem("diagnostico_form");

    if (!rawResult || !rawForm) {
      router.replace("/diagnostico");
      return;
    }
    setResult(JSON.parse(rawResult));
    setForm(JSON.parse(rawForm));
  }, [router]);

  if (!result || !form) {
    return (
      <div className="min-h-screen bg-[#001f3f] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ff851b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <main className="min-h-screen bg-[#001f3f]">

      {/* Header */}
      <header className="border-b border-white/10 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Potencializa" width={40} height={40} className="object-contain" />
            <span className="text-white font-bold text-lg hidden sm:block" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Potencializa
            </span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all text-sm"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Copiado!" : "Compartilhar"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Hero do resultado */}
        <div className="text-center mb-12 animate-[fadeIn_0.5s_ease]">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4" />
            Diagnóstico concluído para {form.empresa}
          </div>
          <h1
            className="text-4xl sm:text-5xl font-black text-white mb-4"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            {form.nome.split(" ")[0]}, encontramos{" "}
            <span className="gradient-text">{result.automacoes.length} oportunidades</span>
            <br />de automação na sua empresa
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {result.resumoGeral}
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <SummaryCard
            icon={<Clock className="w-6 h-6 text-[#7fdbff]" />}
            label="Horas economizadas/mês"
            value={`${result.totalHorasMes}h`}
            sublabel={`≈ ${Math.round(result.totalHorasMes / 8)} dias de trabalho`}
            color="cyan"
          />
          <SummaryCard
            icon={<DollarSign className="w-6 h-6 text-emerald-400" />}
            label="Economia mensal estimada"
            value={formatCurrency(result.totalEconomiaMes)}
            sublabel="com as automações implementadas"
            color="emerald"
          />
          <SummaryCard
            icon={<TrendingUp className="w-6 h-6 text-[#ff851b]" />}
            label="ROI em 12 meses"
            value={formatCurrency(result.totalRoi12meses)}
            sublabel="retorno estimado no primeiro ano"
            color="orange"
            highlight
          />
        </div>

        {/* Automações */}
        <div className="mb-14">
          <h2
            className="text-2xl font-bold text-white mb-2"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            Suas top automações
          </h2>
          <p className="text-white/50 text-sm mb-6">Ordenadas por impacto — comece pela #1.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {result.automacoes.map((automacao, i) => (
              <AutomacaoCard key={i} automacao={automacao} index={i} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="rounded-3xl bg-gradient-to-br from-[#001f3f] to-[#003366] border border-white/10 p-8 sm:p-12 text-center card-glow">
          <h2
            className="text-3xl sm:text-4xl font-black text-white mb-4"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}
          >
            Pronto para começar a{" "}
            <span className="gradient-text">economizar {formatCurrency(result.totalEconomiaMes)}/mês</span>?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Nossa equipe pode implementar essas automações para a {form.empresa}. Escolha como quer prosseguir:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {/* CTA 1: Agendar call */}
            <a
              href={CAL_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#ff851b] hover:bg-[#e0700d] text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ff851b]/20"
            >
              <Calendar className="w-8 h-8" />
              <div>
                <div className="font-bold text-lg">Agendar Call Gratuita</div>
                <div className="text-white/80 text-sm mt-1">
                  30 min com especialista da Potencializa
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold mt-1">
                Agendar agora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* CTA 2: Relatório detalhado */}
            <a
              href={REPORT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#7fdbff]/50 text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="w-8 h-8 text-[#7fdbff]" />
              <div>
                <div className="font-bold text-lg">Relatório Detalhado em PDF</div>
                <div className="text-white/60 text-sm mt-1">
                  Plano completo de implementação + custos
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-[#7fdbff] mt-1">
                Adquirir relatório
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>

          <p className="text-white/30 text-xs mt-6">
            Entraremos em contato em até 24h. Sem compromisso.
          </p>
        </div>

        {/* New diagnosis link */}
        <div className="text-center mt-8">
          <a href="/diagnostico" className="text-white/30 hover:text-white/60 text-sm transition-colors">
            Fazer novo diagnóstico →
          </a>
        </div>
      </div>

      <footer className="border-t border-white/10 py-8 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-sm">
          <p>© {new Date().getFullYear()} Potencializa. Todos os direitos reservados.</p>
          <p>As estimativas são baseadas em médias do mercado brasileiro e podem variar.</p>
        </div>
      </footer>
    </main>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({
  icon, label, value, sublabel, color, highlight = false,
}: {
  icon:       React.ReactNode;
  label:      string;
  value:      string;
  sublabel:   string;
  color:      "cyan" | "emerald" | "orange";
  highlight?: boolean;
}) {
  const borderColors = {
    cyan:    "border-[#7fdbff]/20 hover:border-[#7fdbff]/40",
    emerald: "border-emerald-400/20 hover:border-emerald-400/40",
    orange:  "border-[#ff851b]/30 hover:border-[#ff851b]/60",
  };
  const bgColors = {
    cyan:    "",
    emerald: "",
    orange:  highlight ? "bg-[#ff851b]/5" : "",
  };

  return (
    <div
      className={`rounded-2xl p-6 border ${borderColors[color]} ${bgColors[color]} bg-white/5 transition-all duration-200 animate-[fadeIn_0.6s_ease]`}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <span className="text-white/60 text-sm">{label}</span>
      </div>
      <div
        className={`text-3xl font-black mb-1 ${highlight ? "text-[#ff851b]" : "text-white"}`}
        style={{ fontFamily: "'Source Sans 3', sans-serif" }}
      >
        {value}
      </div>
      <div className="text-white/40 text-xs">{sublabel}</div>
    </div>
  );
}
