"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Building2, User, FileText, ChevronRight, ChevronLeft, Loader2, Zap } from "lucide-react";
import type { FormData, AnalysisResult } from "@/types";

// ─── Validação ────────────────────────────────────────────────────────────────
const schema = z.object({
  nome:      z.string().min(2, "Nome obrigatório"),
  email:     z.string().email("Email inválido"),
  telefone:  z.string().min(10, "Telefone inválido"),
  empresa:   z.string().min(2, "Nome da empresa obrigatório"),
  setor:     z.string().min(2, "Setor obrigatório"),
  tamanho:   z.string().min(1, "Tamanho obrigatório"),
  descricao: z.string().min(50, "Descreva com pelo menos 50 caracteres"),
  dor:       z.string().min(10, "Descreva seu principal desafio"),
  orcamento: z.string().min(1, "Selecione uma faixa de orçamento"),
});
type Schema = z.infer<typeof schema>;

const STEPS = [
  { id: 1, label: "Contato",  icon: User },
  { id: 2, label: "Empresa",  icon: Building2 },
  { id: 3, label: "Contexto", icon: FileText },
];

const SETORES = [
  "Advocacia / Jurídico", "Contabilidade / Financeiro", "Saúde / Clínicas",
  "Educação", "Varejo / E-commerce", "Imobiliária", "Tecnologia",
  "Logística / Transporte", "Construção Civil", "RH / Gestão de Pessoas",
  "Marketing / Agência", "Outro",
];

const TAMANHOS = [
  { value: "1-10",    label: "1 – 10" },
  { value: "10-50",   label: "10 – 50" },
  { value: "50-200",  label: "50 – 200" },
  { value: "200-500", label: "200 – 500" },
  { value: "500+",    label: "500+" },
];

const ORCAMENTOS = [
  { value: "ate-5k",     label: "Até R$ 5.000" },
  { value: "5k-15k",     label: "R$ 5k – R$ 15k" },
  { value: "15k-30k",    label: "R$ 15k – R$ 30k" },
  { value: "30k-50k",    label: "R$ 30k – R$ 50k" },
  { value: "acima-50k",  label: "Acima de R$ 50k" },
  { value: "indefinido", label: "Ainda não definido" },
];

// ─── Componente ───────────────────────────────────────────────────────────────
export default function DiagnosticForm() {
  const router   = useRouter();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const { register, handleSubmit, trigger, formState: { errors } } =
    useForm<Schema>({ resolver: zodResolver(schema) });

  const nextStep = async () => {
    const fields: Record<number, (keyof Schema)[]> = {
      1: ["nome", "email", "telefone"],
      2: ["empresa", "setor", "tamanho"],
      3: ["descricao", "dor", "orcamento"],
    };
    if (await trigger(fields[step])) setStep(s => s + 1);
  };

  const onSubmit = async (data: Schema) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const result: AnalysisResult = await res.json();
      sessionStorage.setItem("diagnostico_form",   JSON.stringify(data));
      sessionStorage.setItem("diagnostico_result", JSON.stringify(result));
      router.push("/resultado");
    } catch {
      setError("Algo deu errado. Tente novamente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Step indicators */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {STEPS.map(s => {
            const Icon  = s.icon;
            const done  = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  done   ? "bg-[#ff851b] border-[#ff851b] text-white" :
                  active ? "bg-[#ff851b]/10 border-[#ff851b]/50 text-[#ff851b]" :
                           "bg-[#111] border-[#222] text-[#555]"
                }`}>
                  {done
                    ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                    : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs font-medium ${active || done ? "text-white" : "text-[#444]"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        {/* Progress bar */}
        <div className="h-px bg-[#1f1f1f] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff851b] to-[#7fdbff] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-[#0a0a0a] border border-[#1f1f1f] rounded-2xl p-8">

          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
              <StepHeader title="Sobre você" sub="Precisamos dessas informações para personalizar seu diagnóstico." />
              <Field label="Nome completo" error={errors.nome?.message}>
                <input {...register("nome")} placeholder="João Silva" className={inp(!!errors.nome)} />
              </Field>
              <Field label="Email corporativo" error={errors.email?.message}>
                <input {...register("email")} type="email" placeholder="joao@empresa.com.br" className={inp(!!errors.email)} />
              </Field>
              <Field label="WhatsApp" error={errors.telefone?.message}>
                <input {...register("telefone")} type="tel" placeholder="(51) 99999-9999" className={inp(!!errors.telefone)} />
              </Field>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
              <StepHeader title="Sua empresa" sub="Nos conte mais sobre o seu negócio." />
              <Field label="Nome da empresa" error={errors.empresa?.message}>
                <input {...register("empresa")} placeholder="Empresa Ltda." className={inp(!!errors.empresa)} />
              </Field>
              <Field label="Setor / Ramo de atuação" error={errors.setor?.message}>
                <select {...register("setor")} className={inp(!!errors.setor)}>
                  <option value="">Selecione o setor...</option>
                  {SETORES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Tamanho da empresa (funcionários)" error={errors.tamanho?.message}>
                <div className="grid grid-cols-5 gap-2">
                  {TAMANHOS.map(t => (
                    <label key={t.value}
                      className="relative flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#1f1f1f] cursor-pointer hover:border-[#333] transition-colors has-[:checked]:border-[#ff851b] has-[:checked]:bg-[#ff851b]/5 text-center">
                      <input {...register("tamanho")} type="radio" value={t.value} className="sr-only" />
                      <span className="text-xs text-[#888] has-[:checked]:text-white leading-tight">{t.label}</span>
                    </label>
                  ))}
                </div>
                {errors.tamanho && <p className="text-red-400 text-xs mt-1">{errors.tamanho.message}</p>}
              </Field>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-5 animate-[fadeIn_0.3s_ease]">
              <StepHeader title="Contexto do negócio" sub="Quanto mais detalhes, mais preciso será seu diagnóstico." />
              <Field
                label="Descreva os processos e operações da sua empresa"
                hint="Ex: recebemos contratos por email, revisamos manualmente, enviamos para assinar..."
                error={errors.descricao?.message}
              >
                <textarea {...register("descricao")} rows={5} placeholder="Descreva como sua equipe trabalha no dia a dia..." className={`${inp(!!errors.descricao)} resize-none`} />
              </Field>
              <Field label="Qual é sua principal dor/desafio hoje?" error={errors.dor?.message}>
                <textarea {...register("dor")} rows={3} placeholder="Ex: perdemos muito tempo em tarefas repetitivas..." className={`${inp(!!errors.dor)} resize-none`} />
              </Field>
              <Field label="Orçamento estimado para automação" error={errors.orcamento?.message}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ORCAMENTOS.map(o => (
                    <label key={o.value}
                      className="relative flex items-center gap-2 p-3 rounded-xl border border-[#1f1f1f] cursor-pointer hover:border-[#333] transition-colors has-[:checked]:border-[#ff851b] has-[:checked]:bg-[#ff851b]/5">
                      <input {...register("orcamento")} type="radio" value={o.value} className="sr-only" />
                      <span className="text-xs text-[#888] leading-tight">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.orcamento && <p className="text-red-400 text-xs mt-1">{errors.orcamento.message}</p>}
              </Field>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-5">
          {step > 1 ? (
            <button type="button" onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#222] text-[#666] hover:text-white hover:border-[#333] transition-all text-sm">
              <ChevronLeft className="w-4 h-4" /> Voltar
            </button>
          ) : <div />}

          {step < STEPS.length ? (
            <button type="button" onClick={nextStep}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#ff851b] hover:bg-[#e0700d] text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
              Próximo <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-[#ff851b] hover:bg-[#e0700d] text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Analisando com IA...</>
                : <><Zap className="w-4 h-4" /> Gerar Diagnóstico</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function inp(err: boolean) {
  return `w-full px-4 py-3 rounded-xl bg-[#111] border ${err ? "border-red-500/40" : "border-[#1f1f1f]"} text-white placeholder-[#444] focus:border-[#ff851b]/40 focus:bg-[#161616] transition-colors text-sm outline-none`;
}

function StepHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>{title}</h2>
      <p className="text-[#555] text-sm">{sub}</p>
    </div>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#aaa]">{label}</label>
      {hint && <p className="text-xs text-[#444]">{hint}</p>}
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
