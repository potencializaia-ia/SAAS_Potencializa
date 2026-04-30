"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Brain, BarChart3, Calculator, FileSearch, Sparkles } from "lucide-react";

const STEPS = [
  { icon: FileSearch,  text: "Lendo os processos da sua empresa...",         duration: 3500, cards: 1 },
  { icon: Brain,       text: "Identificando oportunidades de automação...",  duration: 4000, cards: 2 },
  { icon: BarChart3,   text: "Calculando horas economizadas por processo...", duration: 3500, cards: 3 },
  { icon: Calculator,  text: "Estimando ROI e economia em R$...",            duration: 3500, cards: 4 },
  { icon: Sparkles,    text: "Preparando seu diagnóstico personalizado...",  duration: 99999, cards: 5 },
];

export default function LoadingAnalysis() {
  const [currentStep, setCurrentStep]     = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dots, setDots]                   = useState("");
  const [progress, setProgress]           = useState(0);
  const [visibleCards, setVisibleCards]   = useState(0);

  // Avança etapas sequencialmente
  useEffect(() => {
    let stepIndex = 0;

    const advance = () => {
      const step = STEPS[stepIndex];
      if (!step || stepIndex >= STEPS.length - 1) return;

      const timer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, stepIndex]);
        stepIndex += 1;
        setCurrentStep(stepIndex);
        setProgress(Math.round((stepIndex / (STEPS.length - 1)) * 90));
        setVisibleCards(STEPS[stepIndex]?.cards ?? 5);
        advance();
      }, step.duration);

      return timer;
    };

    advance();
  }, []);

  // Animação dos "..."
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Progresso suave na última etapa
  useEffect(() => {
    if (currentStep < STEPS.length - 1) return;
    const interval = setInterval(() => {
      setProgress((p) => (p < 98 ? p + 0.3 : p));
    }, 200);
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center bg-[#001f3f] overflow-y-auto">
      <BackgroundFX />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* ── Topo: logo + título + progress ── */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#ff851b]/10 animate-ping scale-150" />
            <div className="absolute inset-0 rounded-full bg-[#ff851b]/5  animate-ping scale-[2] [animation-delay:300ms]" />
            <div className="relative w-14 h-14 rounded-full bg-[#ff851b]/10 border border-[#ff851b]/30 flex items-center justify-center">
              <Image src="/logo.png" alt="Potencializa" width={30} height={30} className="object-contain" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Analisando sua empresa<span className="text-[#ff851b]">{dots}</span>
            </h2>
            <p className="text-white/40 text-sm mt-1">
              Nossa IA está gerando um diagnóstico personalizado para você
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md">
            <div className="flex justify-between text-xs text-white/30 mb-1.5">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff851b] via-[#ffaa55] to-[#7fdbff] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Corpo: steps (esq) + skeleton cards (dir) ── */}
        <div className="flex flex-col md:flex-row gap-6 w-full">

          {/* Steps */}
          <div className="md:w-2/5 space-y-2 shrink-0">
            <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
              O que estamos fazendo
            </p>
            {STEPS.map((step, i) => {
              const Icon    = step.icon;
              const done    = completedSteps.includes(i);
              const active  = currentStep === i;

              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                    done   ? "bg-[#ff851b]/8  border-[#ff851b]/20 opacity-60" :
                    active ? "bg-white/5      border-white/15 shadow-[0_0_20px_rgba(255,133,27,0.08)]" :
                             "bg-transparent border-transparent opacity-20"
                  }`}
                >
                  <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    done   ? "bg-[#ff851b]/20 text-[#ff851b]" :
                    active ? "bg-white/10 text-white" :
                             "bg-white/5 text-white/30"
                  }`}>
                    {done
                      ? <CheckCircle2 className="w-4 h-4 text-[#ff851b]" />
                      : <Icon className={`w-3.5 h-3.5 ${active ? "animate-pulse" : ""}`} />}
                  </div>
                  <span className={`text-sm font-medium transition-all ${
                    done ? "text-white/50" : active ? "text-white" : "text-white/20"
                  }`}>
                    {step.text}
                  </span>
                  {active && !done && (
                    <div className="ml-auto shrink-0">
                      <div className="w-4 h-4 border-2 border-[#ff851b]/30 border-t-[#ff851b] rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Skeleton cards */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest">
                Automações identificadas
              </p>
              {visibleCards > 0 && (
                <span className="text-xs font-bold text-[#ff851b] animate-pulse">
                  {visibleCards} de 5
                </span>
              )}
            </div>

            {visibleCards === 0 && (
              <div className="flex items-center justify-center h-40 rounded-2xl border border-white/5 bg-white/2">
                <p className="text-white/20 text-sm">Aguardando análise...</p>
              </div>
            )}

            {Array.from({ length: 5 }).map((_, i) =>
              i < visibleCards ? (
                <SkeletonCard key={i} index={i} delay={i * 120} />
              ) : null
            )}
          </div>
        </div>

        {/* Nota de rodapé */}
        <p className="text-center text-white/20 text-xs pb-4">
          Isso pode levar até 30 segundos — vale a pena esperar 😊
        </p>
      </div>
    </div>
  );
}

// ─── Skeleton card (mimics AutomacaoCard) ─────────────────────────────────────
function SkeletonCard({ index, delay }: { index: number; delay: number }) {
  return (
    <div
      className="relative bg-white/5 border border-white/10 rounded-2xl p-5 animate-[fadeInUp_0.5s_ease_both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Priority badge */}
      <div className="absolute -top-3 left-5">
        <div className="h-6 w-28 rounded-full shimmer-line" />
      </div>

      <div className="mt-2 space-y-4">
        {/* Header: título + badge complexidade */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded-lg shimmer-line" style={{ width: `${65 + (index % 3) * 10}%` }} />
            <div className="h-3 rounded-lg shimmer-line w-1/3" />
          </div>
          <div className="h-6 w-14 rounded-full shrink-0 shimmer-line" />
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <div className="h-3 rounded shimmer-line w-full" />
          <div className="h-3 rounded shimmer-line w-5/6" />
          <div className="h-3 rounded shimmer-line w-2/3" />
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((j) => (
            <div key={j} className="rounded-xl p-3 bg-white/3 flex flex-col items-center gap-1.5">
              <div className="h-2.5 w-8 rounded shimmer-line" />
              <div className="h-5 w-14 rounded shimmer-line" />
              <div className="h-2 w-10 rounded shimmer-line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Fundo com partículas e grid ───────────────────────────────────────────────
function BackgroundFX() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#ff851b]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-[#7fdbff]/4 rounded-full blur-[100px] pointer-events-none" />

      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left:           `${p.x}%`,
            top:            `${p.y}%`,
            width:          `${p.size}px`,
            height:         `${p.size}px`,
            background:     p.color,
            opacity:        p.opacity,
            animation:      `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33%       { transform: translateY(-8px) translateX(4px); }
          66%       { transform: translateY(4px)  translateX(-6px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .shimmer-line {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.04) 25%,
            rgba(255,255,255,0.10) 50%,
            rgba(255,255,255,0.04) 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

const PARTICLES = [
  { x: 10, y: 20, size: 3, color: "#ff851b", opacity: 0.3,  duration: 6,  delay: 0   },
  { x: 85, y: 15, size: 2, color: "#7fdbff", opacity: 0.2,  duration: 8,  delay: 1   },
  { x: 20, y: 75, size: 4, color: "#ff851b", opacity: 0.15, duration: 7,  delay: 2   },
  { x: 75, y: 80, size: 2, color: "#7fdbff", opacity: 0.25, duration: 9,  delay: 0.5 },
  { x: 50, y: 10, size: 3, color: "#ffffff", opacity: 0.1,  duration: 10, delay: 3   },
  { x: 90, y: 50, size: 2, color: "#ff851b", opacity: 0.2,  duration: 7,  delay: 1.5 },
  { x: 5,  y: 50, size: 3, color: "#7fdbff", opacity: 0.15, duration: 8,  delay: 2.5 },
  { x: 40, y: 90, size: 2, color: "#ff851b", opacity: 0.2,  duration: 6,  delay: 4   },
  { x: 65, y: 30, size: 4, color: "#7fdbff", opacity: 0.1,  duration: 11, delay: 0.8 },
  { x: 30, y: 40, size: 2, color: "#ffffff", opacity: 0.08, duration: 9,  delay: 3.5 },
];
