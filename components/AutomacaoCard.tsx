"use client";

import { Clock, DollarSign, TrendingUp, Zap, Bot, CheckCircle2 } from "lucide-react";
import type { Automacao } from "@/types";

const complexidadeConfig = {
  Fácil:    { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30" },
  Médio:    { color: "text-yellow-400",  bg: "bg-yellow-400/10  border-yellow-400/30"  },
  Complexo: { color: "text-red-400",     bg: "bg-red-400/10     border-red-400/30"     },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style:    "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

interface Props {
  automacao: Automacao;
  index:     number;
}

export default function AutomacaoCard({ automacao, index }: Props) {
  const complexConfig = complexidadeConfig[automacao.complexidade] ?? complexidadeConfig.Médio;

  return (
    <div
      className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#ff851b]/40 transition-all duration-300 hover:-translate-y-1 card-glow group animate-[slideUp_0.4s_ease_both]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Priority badge */}
      <div className="absolute -top-3 left-6">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff851b] text-white text-xs font-bold shadow-lg">
          <Zap className="w-3 h-3" />
          {index === 0 ? "Maior impacto" : `#${automacao.prioridade} prioridade`}
        </div>
      </div>

      <div className="mt-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3
              className="text-lg font-bold text-white mb-1 leading-tight"
              style={{ fontFamily: "'Source Sans 3', sans-serif" }}
            >
              {automacao.titulo}
            </h3>
            <div className="flex items-center gap-2">
              <Bot className="w-3.5 h-3.5 text-[#7fdbff]" />
              <span className="text-[#7fdbff] text-xs">{automacao.tipoAgente}</span>
            </div>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full border ${complexConfig.bg} ${complexConfig.color}`}>
            {automacao.complexidade}
          </span>
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm leading-relaxed mb-5">
          {automacao.descricao}
        </p>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <MetricBox
            icon={<Clock className="w-4 h-4 text-[#7fdbff]" />}
            label="Horas/mês"
            value={`${automacao.horasMes}h`}
          />
          <MetricBox
            icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
            label="Economia/mês"
            value={formatCurrency(automacao.economiaMes)}
          />
          <MetricBox
            icon={<TrendingUp className="w-4 h-4 text-[#ff851b]" />}
            label="ROI 12 meses"
            value={formatCurrency(automacao.roi12meses)}
            highlight
          />
        </div>

        {/* Produtos Potencializa */}
        <div className="border-t border-white/5 pt-4">
          <p className="text-white/40 text-xs mb-2">Como a Potencializa pode ajudar:</p>
          <div className="flex flex-wrap gap-2">
            {automacao.produtosPotencializa.map((produto) => (
              <div
                key={produto}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff851b]/10 border border-[#ff851b]/30 text-[#ff851b] text-xs"
              >
                <CheckCircle2 className="w-3 h-3" />
                {produto}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricBox({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon:        React.ReactNode;
  label:       string;
  value:       string;
  highlight?:  boolean;
}) {
  return (
    <div className={`rounded-xl p-3 text-center ${highlight ? "bg-[#ff851b]/10 border border-[#ff851b]/20" : "bg-white/5"}`}>
      <div className="flex justify-center mb-1">{icon}</div>
      <div className={`text-sm font-bold mb-0.5 ${highlight ? "text-[#ff851b]" : "text-white"}`}>
        {value}
      </div>
      <div className="text-white/40 text-xs">{label}</div>
    </div>
  );
}
