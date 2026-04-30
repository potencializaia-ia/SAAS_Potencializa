"use client";

import { useEffect, useState } from "react";

// Número base para dar sensação de produto estabelecido.
// O total exibido = SEED + contagem real de leads no Supabase.
const SEED = 200;

interface Props {
  realCount: number; // vem do servidor via Supabase
}

export default function CounterBadge({ realCount }: Props) {
  const total     = SEED + realCount;
  const startFrom = Math.max(total - 18, SEED); // começa ~18 abaixo do total real

  const [displayed, setDisplayed] = useState(startFrom);

  // Animação count-up ao montar
  useEffect(() => {
    if (displayed >= total) return;

    const step     = Math.ceil((total - startFrom) / 30); // ~30 frames
    const interval = setInterval(() => {
      setDisplayed((n) => {
        if (n + step >= total) {
          clearInterval(interval);
          return total;
        }
        return n + step;
      });
    }, 40); // 40ms × 30 frames ≈ 1,2s de animação

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm mb-6">
      {/* Mini avatares coloridos */}
      <div className="flex -space-x-2 shrink-0">
        {["bg-[#ff851b]", "bg-[#7fdbff]", "bg-emerald-400"].map((color, i) => (
          <div
            key={i}
            className={`w-6 h-6 rounded-full ${color} border-2 border-[#001f3f] opacity-90`}
          />
        ))}
      </div>

      <span>
        <strong className="text-white font-bold tabular-nums">{displayed}+</strong>
        {" "}empresas já descobriram suas automações
      </span>
    </div>
  );
}
