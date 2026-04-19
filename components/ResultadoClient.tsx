"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Calendar, FileText, TrendingUp, Clock, DollarSign,
  ArrowRight, Share2, CheckCircle, Sparkles,
} from "lucide-react";
import AutomacaoCard from "@/components/AutomacaoCard";
import type { AnalysisResult, FormData } from "@/types";

const CAL_LINK    = process.env.NEXT_PUBLIC_CAL_LINK    ?? "#";
const REPORT_LINK = process.env.NEXT_PUBLIC_REPORT_LINK ?? "#";

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);
}

export default function ResultadoClient() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [form,   setForm]   = useState<FormData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const r = sessionStorage.getItem("diagnostico_result");
    const f = sessionStorage.getItem("diagnostico_form");
    if (!r || !f) { router.replace("/diagnostico"); return; }
    setResult(JSON.parse(r));
    setForm(JSON.parse(f));
  }, [router]);

  if (!result || !form) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-[#ff851b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleShare = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { /* ignore */ }
  };

  return (
    <main className="min-h-screen bg-black">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-black/80 backdrop-blur-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Potencializa" width={36} height={36} className="object-contain" />
            <span className="text-white font-bold text-base hidden sm:block"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Potencializa
            </span>
          </div>
          <button onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#222] text-[#666] hover:text-white hover:border-[#333] transition-all text-sm">
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            {copied ? "Copiado!" : "Compartilhar"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* Hero */}
        <div className="relative text-center mb-14 animate-[fadeIn_0.5s_ease]">
          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#ff851b]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/8 border border-emerald-400/20 text-emerald-400 text-xs font-semibold mb-5 tracking-wide">
              <CheckCircle className="w-3.5 h-3.5" />
              DIAGNÓSTICO CONCLUÍDO — {form.empresa.toUpperCase()}
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              {form.nome.split(" ")[0]}, encontramos{" "}
              <span className="gradient-text">{result.automacoes.length} oportunidades</span>
              <br />de automação
            </h1>
            <p className="text-[#666] text-base max-w-2xl mx-auto leading-relaxed">
              {result.resumoGeral}
            </p>
          </div>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
          <SummaryCard
            icon={<Clock className="w-5 h-5 text-[#7fdbff]" />}
            label="Horas economizadas/mês"
            value={`${result.totalHorasMes}h`}
            sub={`≈ ${Math.round(result.totalHorasMes / 8)} dias de trabalho liberados`}
            accent="cyan"
          />
          <SummaryCard
            icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
            label="Economia mensal estimada"
            value={fmt(result.totalEconomiaMes)}
            sub="com as automações implementadas"
            accent="emerald"
          />
          <SummaryCard
            icon={<TrendingUp className="w-5 h-5 text-[#ff851b]" />}
            label="ROI em 12 meses"
            value={fmt(result.totalRoi12meses)}
            sub="retorno estimado no primeiro ano"
            accent="orange"
            highlight
          />
        </div>

        {/* Automações */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#ff851b]" />
            <h2 className="text-xl font-bold text-white"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Suas top automações
            </h2>
          </div>
          <p className="text-[#555] text-sm mb-7">Ordenadas por impacto — comece pela #1.</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {result.automacoes.map((a, i) => (
              <AutomacaoCard key={i} automacao={a} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] p-8 sm:p-12 text-center overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff851b]/3 to-transparent pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-[#ff851b]/20 to-transparent pointer-events-none" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Pronto para economizar{" "}
              <span className="gradient-text">{fmt(result.totalEconomiaMes)}/mês</span>?
            </h2>
            <p className="text-[#666] text-base mb-10 max-w-lg mx-auto">
              Nossa equipe pode implementar essas automações para a {form.empresa}. Escolha como quer prosseguir:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {/* Call */}
              <a href={CAL_LINK} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#ff851b] hover:bg-[#e0700d] text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,133,27,0.2)]">
                <Calendar className="w-7 h-7" />
                <div>
                  <div className="font-bold text-base">Agendar Call Gratuita</div>
                  <div className="text-white/70 text-xs mt-0.5">30 min com especialista da Potencializa</div>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  Agendar agora
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>

              {/* Relatório */}
              <a href={REPORT_LINK} target="_blank" rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#111] border border-[#222] hover:border-[#333] text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                <FileText className="w-7 h-7 text-[#7fdbff]" />
                <div>
                  <div className="font-bold text-base">Relatório Detalhado PDF</div>
                  <div className="text-[#555] text-xs mt-0.5">Plano completo de implementação + custos</div>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-[#7fdbff]">
                  Adquirir relatório
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>

            <p className="text-[#333] text-xs mt-7">Entraremos em contato em até 24h. Sem compromisso.</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="/diagnostico" className="text-[#333] hover:text-[#666] text-sm transition-colors">
            ← Fazer novo diagnóstico
          </a>
        </div>
      </div>

      <footer className="border-t border-[#111] py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[#333] text-xs">
          <p>© {new Date().getFullYear()} Potencializa. Todos os direitos reservados.</p>
          <p>As estimativas são baseadas em médias do mercado brasileiro e podem variar.</p>
        </div>
      </footer>
    </main>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ icon, label, value, sub, accent, highlight = false }: {
  icon: React.ReactNode; label: string; value: string;
  sub: string; accent: "cyan" | "emerald" | "orange"; highlight?: boolean;
}) {
  const borders = {
    cyan:    "border-[#7fdbff]/10 hover:border-[#7fdbff]/25",
    emerald: "border-emerald-400/10 hover:border-emerald-400/25",
    orange:  "border-[#ff851b]/15 hover:border-[#ff851b]/35",
  };
  return (
    <div className={`rounded-2xl p-6 bg-[#0a0a0a] border ${borders[accent]} transition-all duration-200 animate-[fadeIn_0.6s_ease] ${highlight ? "bg-gradient-to-b from-[#ff851b]/3 to-transparent" : ""}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[#555] text-xs">{label}</span>
      </div>
      <div className={`text-3xl font-black mb-1 ${highlight ? "text-[#ff851b]" : "text-white"}`}
        style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
        {value}
      </div>
      <div className="text-[#444] text-xs">{sub}</div>
    </div>
  );
}
