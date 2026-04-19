"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Building2, User, FileText, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import type { FormData, AnalysisResult } from "@/types";
import LoadingAnalysis from "@/components/LoadingAnalysis";

// ─── Validação Zod ────────────────────────────────────────────────────────────

const schema = z.object({
  nome:      z.string().min(2, "Nome obrigatório"),
  email:     z.string().email("Email inválido"),
  telefone:  z.string().min(10, "Telefone inválido"),
  empresa:   z.string().min(2, "Nome da empresa obrigatório"),
  setor:     z.string().min(2, "Setor obrigatório"),
  tamanho:   z.string().min(1, "Tamanho obrigatório"),
  descricao: z.string().min(50, "Descreva com pelo menos 50 caracteres para uma análise precisa"),
  dor:       z.string().min(10, "Descreva seu principal desafio"),
  orcamento: z.string().min(1, "Selecione uma faixa de orçamento"),
});

type Schema = z.infer<typeof schema>;

// ─── Configuração dos steps ───────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Contato",  icon: User },
  { id: 2, label: "Empresa",  icon: Building2 },
  { id: 3, label: "Contexto", icon: FileText },
];

const SETORES = [
  "Advocacia / Jurídico",
  "Contabilidade / Financeiro",
  "Saúde / Clínicas",
  "Educação",
  "Varejo / E-commerce",
  "Imobiliária",
  "Tecnologia",
  "Logística / Transporte",
  "Construção Civil",
  "RH / Gestão de Pessoas",
  "Marketing / Agência",
  "Outro",
];

const TAMANHOS = [
  { value: "1-10",    label: "1 – 10 funcionários" },
  { value: "10-50",   label: "10 – 50 funcionários" },
  { value: "50-200",  label: "50 – 200 funcionários" },
  { value: "200-500", label: "200 – 500 funcionários" },
  { value: "500+",    label: "500+ funcionários" },
];

const ORCAMENTOS = [
  { value: "ate-5k",     label: "Até R$ 5.000" },
  { value: "5k-15k",     label: "R$ 5.000 – R$ 15.000" },
  { value: "15k-30k",    label: "R$ 15.000 – R$ 30.000" },
  { value: "30k-50k",    label: "R$ 30.000 – R$ 50.000" },
  { value: "acima-50k",  label: "Acima de R$ 50.000" },
  { value: "indefinido", label: "Ainda não definido" },
];

// ─── Componente principal ─────────────────────────────────────────────────────

export default function DiagnosticForm() {
  const router   = useRouter();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<Schema>({ resolver: zodResolver(schema) });

  // Avança para o próximo step (valida apenas campos do step atual)
  const nextStep = async () => {
    const fieldsPerStep: Record<number, (keyof Schema)[]> = {
      1: ["nome", "email", "telefone"],
      2: ["empresa", "setor", "tamanho"],
      3: ["descricao", "dor", "orcamento"],
    };
    const valid = await trigger(fieldsPerStep[step]);
    if (valid) setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  // Submit final
  const onSubmit = async (data: Schema) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Erro ao processar análise");
      const result: AnalysisResult = await res.json();

      // Salva no sessionStorage para a página de resultado ler
      sessionStorage.setItem("diagnostico_form",   JSON.stringify(data));
      sessionStorage.setItem("diagnostico_result", JSON.stringify(result));

      router.push("/resultado");
    } catch (err) {
      setError("Algo deu errado. Tente novamente em instantes.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  // Mostra tela de loading full-screen durante análise da IA
  if (loading) return <LoadingAnalysis />;

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const active   = step === s.id;
            const done     = step > s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    done
                      ? "bg-[#ff851b] text-white"
                      : active
                      ? "bg-[#ff851b]/20 border-2 border-[#ff851b] text-[#ff851b]"
                      : "bg-white/5 border border-white/20 text-white/40"
                  }`}
                >
                  {done ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs font-medium ${active || done ? "text-[#ff851b]" : "text-white/40"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        {/* Bar */}
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff851b] to-[#7fdbff] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Form card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">

          {/* ── Step 1: Contato ── */}
          {step === 1 && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  Sobre você
                </h2>
                <p className="text-white/60 text-sm">Precisamos dessas informações para personalizar seu diagnóstico.</p>
              </div>

              <Field label="Nome completo" error={errors.nome?.message}>
                <input
                  {...register("nome")}
                  placeholder="João Silva"
                  className={inputClass(!!errors.nome)}
                />
              </Field>

              <Field label="Email corporativo" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="joao@empresa.com.br"
                  className={inputClass(!!errors.email)}
                />
              </Field>

              <Field label="WhatsApp" error={errors.telefone?.message}>
                <input
                  {...register("telefone")}
                  type="tel"
                  placeholder="(51) 99999-9999"
                  className={inputClass(!!errors.telefone)}
                />
              </Field>
            </div>
          )}

          {/* ── Step 2: Empresa ── */}
          {step === 2 && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  Sua empresa
                </h2>
                <p className="text-white/60 text-sm">Nos conte mais sobre o seu negócio.</p>
              </div>

              <Field label="Nome da empresa" error={errors.empresa?.message}>
                <input
                  {...register("empresa")}
                  placeholder="Empresa Ltda."
                  className={inputClass(!!errors.empresa)}
                />
              </Field>

              <Field label="Setor / Ramo de atuação" error={errors.setor?.message}>
                <select {...register("setor")} className={inputClass(!!errors.setor)}>
                  <option value="">Selecione o setor...</option>
                  {SETORES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Tamanho da empresa" error={errors.tamanho?.message}>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {TAMANHOS.map((t) => (
                    <label
                      key={t.value}
                      className="relative flex items-center gap-2 p-3 rounded-xl border border-white/10 cursor-pointer hover:border-[#ff851b]/50 transition-colors has-[:checked]:border-[#ff851b] has-[:checked]:bg-[#ff851b]/10"
                    >
                      <input
                        {...register("tamanho")}
                        type="radio"
                        value={t.value}
                        className="sr-only"
                      />
                      <span className="text-xs text-white/80 leading-tight">{t.label}</span>
                    </label>
                  ))}
                </div>
                {errors.tamanho && <p className="text-red-400 text-xs mt-1">{errors.tamanho.message}</p>}
              </Field>
            </div>
          )}

          {/* ── Step 3: Contexto ── */}
          {step === 3 && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  Contexto do negócio
                </h2>
                <p className="text-white/60 text-sm">
                  Quanto mais detalhes, mais preciso será o seu diagnóstico.
                </p>
              </div>

              <Field
                label="Descreva os processos e operações da sua empresa"
                error={errors.descricao?.message}
                hint="Ex: recebemos contratos por email, advogados revisam manualmente, enviamos para cliente assinar..."
              >
                <textarea
                  {...register("descricao")}
                  rows={5}
                  placeholder="Descreva como sua equipe trabalha no dia a dia, quais tarefas são feitas manualmente, quais ferramentas usam..."
                  className={`${inputClass(!!errors.descricao)} resize-none`}
                />
              </Field>

              <Field label="Qual é sua principal dor/desafio hoje?" error={errors.dor?.message}>
                <textarea
                  {...register("dor")}
                  rows={3}
                  placeholder="Ex: nossa equipe perde muito tempo em tarefas repetitivas, não conseguimos escalar..."
                  className={`${inputClass(!!errors.dor)} resize-none`}
                />
              </Field>

              <Field label="Orçamento estimado para automação" error={errors.orcamento?.message}>
                <select {...register("orcamento")} className={inputClass(!!errors.orcamento)}>
                  <option value="">Selecione uma faixa...</option>
                  {ORCAMENTOS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#ff851b] hover:bg-[#e0700d] text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-[#ff851b] hover:bg-[#e0700d] text-white font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              <Zap className="w-4 h-4" />
              Gerar Diagnóstico
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function inputClass(hasError: boolean) {
  return `w-full px-4 py-3 rounded-xl bg-white/5 border ${
    hasError ? "border-red-400/60" : "border-white/10"
  } text-white placeholder-white/30 focus:border-[#ff851b]/60 focus:bg-white/8 transition-colors text-sm`;
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-white/80">{label}</label>
      {hint && <p className="text-xs text-white/40">{hint}</p>}
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
