"use client";

import { Clock, DollarSign, TrendingUp, Zap, Bot, CheckCircle2 } from "lucide-react";
import type { Automacao } from "@/types";

const complexConfig = {
  Fácil:    { color: "text-emerald-400", bg: "bg-emerald-400/8 border-emerald-400/20" },
  Médio:    { color: "text-yellow-400",  bg: "bg-yellow-400/8  border-yellow-400/20"  },
  Complexo: { color: "text-red-400",     bg: "bg-red-400/8     border-red-400/20"     },
};

function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);
}

export default function AutomacaoCard({ automacao, index }: { automacao: Automacao; index: number }) {
  const cfg = complexConfig[automacao.complexidade] ?? complexConfig.Médio;

  return (
    <div
      className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 hover:border-[#2a2a2a] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] animate-[slideUp_0.4s_ease_both] group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Priority badge */}
      <div className="absolute -top-3 left-5">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
          index === 0
            ? "bg-[#ff851b] text-white"
            : "bg-[#1a1a1a] border border-[#2a2a2a] text-[#888]"
        }`}>
          <Zap className="w-3 h-3" />
          {index === 0 ? "Maior impacto" : `#${automacao.prioridade} prioridade`}
        </div>
      </div>

      <div className="mt-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-1.5 leading-tight"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              {automacao.titulo}
            </h3>
            <div className="flex items-center gap-1.5">
              <Bot className="w-3 h-3 text-[#7fdbff]" />
              <span className="text-[#7fdbff] text-xs">{automacao.tipoAgente}</span>
            </div>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
            {automacao.complexidade}
          </span>
        </div>

        {/* Description */}
        <p className="text-[#666] text-sm leading-relaxed mb-5">
          {automacao.descricao}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <MetricBox
            icon={<Clock className="w-3.5 h-3.5 text-[#7fdbff]" />}
            label="Horas/mês"
            value={`${automacao.horasMes}h`}
          />
          <MetricBox
            icon={<DollarSign className="w-3.5 h-3.5 text-emerald-400" />}
            label="Economia/mês"
            value={fmt(automacao.economiaMes)}
          />
          <MetricBox
            icon={<TrendingUp className="w-3.5 h-3.5 text-[#ff851b]" />}
            label="ROI 12 meses"
            value={fmt(automacao.roi12meses)}
            highlight
          />
        </div>

        {/* Produtos */}
        <div className="border-t border-[#141414] pt-4">
          <p className="text-[#444] text-xs mb-2">Como a Potencializa pode ajudar:</p>
          <div className="flex flex-wrap gap-1.5">
            {automacao.produtosPotencializa.map(p => (
              <div key={p}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff851b]/8 border border-[#ff851b]/20 text-[#ff851b] text-xs">
                <CheckCircle2 className="w-3 h-3" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({ icon, label, value, highlight = false }: {
  icon: React.ReactNode; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl p-3 text-center ${
      highlight
        ? "bg-[#ff851b]/8 border border-[#ff851b]/15"
        : "bg-[#111] border border-[#1a1a1a]"
    }`}>
      <div className="flex justify-center mb-1.5">{icon}</div>
      <div className={`text-xs font-bold mb-0.5 ${highlight ? "text-[#ff851b]" : "text-white"}`}>
        {value}
      </div>
      <div className="text-[#444] text-[10px]">{label}</div>
    </div>
  );
}
