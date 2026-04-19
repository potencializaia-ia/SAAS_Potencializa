"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Brain, BarChart3, Calculator, FileSearch, Sparkles } from "lucide-react";

const STEPS = [
  { icon: FileSearch,   text: "Lendo os processos da sua empresa...",         duration: 3500 },
  { icon: Brain,        text: "Identificando oportunidades de automação...",   duration: 4000 },
  { icon: BarChart3,    text: "Calculando horas economizadas por processo...", duration: 3500 },
  { icon: Calculator,   text: "Estimando ROI e economia em R$...",             duration: 3500 },
  { icon: Sparkles,     text: "Preparando seu diagnóstico personalizado...",   duration: 99999 },
];

export default function LoadingAnalysis() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dots, setDots]     = useState("");
  const [progress, setProgress] = useState(0);

  // Avança etapas sequencialmente
  useEffect(() => {
    let stepIndex = 0;

    const advance = () => {
      const step = STEPS[stepIndex];
      if (!step || stepIndex >= STEPS.length - 1) return;

      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, stepIndex]);
        stepIndex += 1;
        setCurrentStep(stepIndex);
        setProgress(Math.round((stepIndex / (STEPS.length - 1)) * 90));
        advance();
      }, step.duration);

      return timer;
    };

    advance();
  }, []);

  // Animação dos "..."
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? "" : d + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Progresso suave na última etapa
  useEffect(() => {
    if (currentStep < STEPS.length - 1) return;
    const interval = setInterval(() => {
      setProgress(p => p < 98 ? p + 0.3 : p);
    }, 200);
    return () => clearInterval(interval);
  }, [currentStep]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001f3f] overflow-hidden">

      {/* ── Fundo animado ── */}
      <BackgroundFX />

      {/* ── Card central ── */}
      <div className="relative z-10 w-full max-w-md mx-6">

        {/* Logo pulsando */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Rings pulsantes */}
            <div className="absolute inset-0 rounded-full bg-[#ff851b]/10 animate-ping scale-150" />
            <div className="absolute inset-0 rounded-full bg-[#ff851b]/5  animate-ping scale-[2] animation-delay-300" />
            <div className="relative w-16 h-16 rounded-full bg-[#ff851b]/10 border border-[#ff851b]/30 flex items-center justify-center">
              <Image src="/logo.png" alt="Potencializa" width={36} height={36} className="object-contain" />
            </div>
          </div>
        </div>

        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-white mb-2"
            style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            Analisando sua empresa
            <span className="text-[#ff851b]">{dots}</span>
          </h2>
          <p className="text-white/40 text-sm">
            Nossa IA está gerando um diagnóstico personalizado para você
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-white/30 mb-2">
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

        {/* Steps */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const Icon      = step.icon;
            const done      = completedSteps.includes(i);
            const active    = currentStep === i;
            const pending   = i > currentStep;

            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                  done    ? "bg-[#ff851b]/8  border-[#ff851b]/20 opacity-60" :
                  active  ? "bg-white/5      border-white/15     opacity-100 shadow-[0_0_20px_rgba(255,133,27,0.08)]" :
                            "bg-transparent border-transparent   opacity-20"
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Ícone */}
                <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  done   ? "bg-[#ff851b]/20 text-[#ff851b]" :
                  active ? "bg-white/10     text-white"     :
                           "bg-white/5      text-white/30"
                }`}>
                  {done
                    ? <CheckCircle2 className="w-4 h-4 text-[#ff851b]" />
                    : <Icon className={`w-3.5 h-3.5 ${active ? "animate-pulse" : ""}`} />
                  }
                </div>

                {/* Texto */}
                <span className={`text-sm font-medium transition-all duration-300 ${
                  done   ? "text-white/50"  :
                  active ? "text-white"     :
                           "text-white/20"
                }`}>
                  {step.text}
                </span>

                {/* Spinner no step ativo */}
                {active && !done && (
                  <div className="ml-auto shrink-0">
                    <div className="w-4 h-4 border-2 border-[#ff851b]/30 border-t-[#ff851b] rounded-full animate-spin" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Nota de rodapé */}
        <p className="text-center text-white/20 text-xs mt-8">
          Isso pode levar até 30 segundos — vale a pena esperar 😊
        </p>
      </div>
    </div>
  );
}

// ── Fundo com partículas e grid ───────────────────────────────────────────────
function BackgroundFX() {
  return (
    <>
      {/* Grid sutil */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow laranja no topo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#ff851b]/6 rounded-full blur-[120px]" />

      {/* Glow cyan embaixo */}
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[200px] bg-[#7fdbff]/4 rounded-full blur-[100px]" />

      {/* Partículas flutuantes */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left:             `${p.x}%`,
            top:              `${p.y}%`,
            width:            `${p.size}px`,
            height:           `${p.size}px`,
            background:       p.color,
            opacity:          p.opacity,
            animation:        `float ${p.duration}s ease-in-out infinite`,
            animationDelay:   `${p.delay}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33%       { transform: translateY(-${8}px) translateX(${4}px); }
          66%       { transform: translateY(${4}px) translateX(-${6}px); }
        }
      `}</style>
    </>
  );
}

const PARTICLES = [
  { x: 10,  y: 20,  size: 3, color: "#ff851b", opacity: 0.3, duration: 6,  delay: 0   },
  { x: 85,  y: 15,  size: 2, color: "#7fdbff", opacity: 0.2, duration: 8,  delay: 1   },
  { x: 20,  y: 75,  size: 4, color: "#ff851b", opacity: 0.15,duration: 7,  delay: 2   },
  { x: 75,  y: 80,  size: 2, color: "#7fdbff", opacity: 0.25,duration: 9,  delay: 0.5 },
  { x: 50,  y: 10,  size: 3, color: "#ffffff", opacity: 0.1, duration: 10, delay: 3   },
  { x: 90,  y: 50,  size: 2, color: "#ff851b", opacity: 0.2, duration: 7,  delay: 1.5 },
  { x: 5,   y: 50,  size: 3, color: "#7fdbff", opacity: 0.15,duration: 8,  delay: 2.5 },
  { x: 40,  y: 90,  size: 2, color: "#ff851b", opacity: 0.2, duration: 6,  delay: 4   },
  { x: 65,  y: 30,  size: 4, color: "#7fdbff", opacity: 0.1, duration: 11, delay: 0.8 },
  { x: 30,  y: 40,  size: 2, color: "#ffffff", opacity: 0.08,duration: 9,  delay: 3.5 },
];
