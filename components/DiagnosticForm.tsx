"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Building2, User, Cpu, Target, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import type { FormData, AnalysisResult } from "@/types";
import LoadingAnalysis from "@/components/LoadingAnalysis";

// ─── Validação Zod ────────────────────────────────────────────────────────────

const schema = z.object({
  nome:             z.string().min(2, "Nome obrigatório"),
  email:            z.string().email("Email inválido"),
  telefone:         z.string().min(10, "Telefone inválido"),
  empresa:          z.string().min(2, "Nome da empresa obrigatório"),
  setor:            z.string().min(2, "Setor obrigatório"),
  tamanho:          z.string().min(1, "Tamanho obrigatório"),
  ferramentas:      z.array(z.string()).min(1, "Selecione pelo menos uma ferramenta"),
  tarefasManuais:   z.array(z.string()).min(1, "Selecione pelo menos uma tarefa"),
  jaAutomatizados:  z.array(z.string()),
  volumeMensal:     z.string().min(1, "Selecione o volume mensal"),
  objetivo:         z.string().min(1, "Selecione seu objetivo principal"),
  contextoAdicional: z.string().optional(),
  orcamento:        z.string().min(1, "Selecione uma faixa de orçamento"),
});

type Schema = z.infer<typeof schema>;

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Contato",   icon: User },
  { id: 2, label: "Empresa",   icon: Building2 },
  { id: 3, label: "Processos", icon: Cpu },
  { id: 4, label: "Objetivo",  icon: Target },
];

// ─── Opções dos campos ────────────────────────────────────────────────────────

const SETORES = [
  "Advocacia / Jurídico",
  "Contabilidade / Financeiro",
  "Saúde / Clínicas",
  "Educação",
  "Educação Online / EAD",
  "Varejo / E-commerce",
  "Imobiliária",
  "Tecnologia",
  "SaaS / Produto Digital",
  "Logística / Transporte",
  "Construção Civil",
  "RH / Gestão de Pessoas",
  "Marketing / Agência",
  "Serviços B2B",
  "Outro",
];

const TAMANHOS = [
  { value: "1-10",    label: "1 – 10 funcionários" },
  { value: "10-50",   label: "10 – 50 funcionários" },
  { value: "50-200",  label: "50 – 200 funcionários" },
  { value: "200-500", label: "200 – 500 funcionários" },
  { value: "500+",    label: "500+ funcionários" },
];

const FERRAMENTAS = [
  "WhatsApp / WhatsApp Business",
  "Email (Gmail / Outlook)",
  "Planilhas (Excel / Google Sheets)",
  "CRM (HubSpot, RD Station, Salesforce...)",
  "ERP / Sistema de gestão (SAP, TOTVS, Omie...)",
  "Sistema próprio / interno",
  "Nenhuma ferramenta específica",
];

const TAREFAS_MANUAIS = [
  "Responder dúvidas repetitivas de clientes",
  "Gerar contratos / propostas / documentos",
  "Emitir notas fiscais / cobranças",
  "Agendar reuniões / consultas",
  "Classificar e responder emails",
  "Atualizar planilhas e relatórios",
  "Cobrar clientes inadimplentes",
  "Fazer onboarding de novos clientes",
  "Triagem e qualificação de leads",
  "Outra",
];

const JA_AUTOMATIZADOS = [
  "Atendimento automático via chatbot",
  "Envio automático de emails / follow-ups",
  "Emissão automática de notas fiscais / cobranças",
  "Agendamento online automático",
  "Geração automática de contratos / documentos",
  "Relatórios automáticos / dashboards",
  "Integração entre sistemas (ex: CRM ↔ planilha)",
  "Qualificação automática de leads",
  "Não temos nada automatizado ainda",
];

const VOLUMES = [
  { value: "menos-50",  label: "Menos de 50" },
  { value: "50-200",    label: "50 – 200" },
  { value: "200-500",   label: "200 – 500" },
  { value: "500-2000",  label: "500 – 2.000" },
  { value: "mais-2000", label: "Mais de 2.000" },
];

const OBJETIVOS = [
  { value: "reduzir-custos",        label: "Reduzir custos operacionais" },
  { value: "escalar-sem-contratar", label: "Escalar sem precisar contratar" },
  { value: "atender-mais-rapido",   label: "Atender clientes mais rápido" },
  { value: "eliminar-erros",        label: "Eliminar erros humanos em processos" },
  { value: "liberar-equipe",        label: "Liberar equipe para tarefas estratégicas" },
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      ferramentas:     [],
      tarefasManuais:  [],
      jaAutomatizados: [],
    },
  });

  const ferramentasSelecionadas    = watch("ferramentas")     ?? [];
  const tarefasManuaisSelecionadas = watch("tarefasManuais")  ?? [];
  const jaAutomatizadosSelecionados = watch("jaAutomatizados") ?? [];

  // Toggle genérico para checkboxes
  const toggleCheckbox = (
    field: "ferramentas" | "tarefasManuais" | "jaAutomatizados",
    value: string,
    maxItems?: number
  ) => {
    const map = {
      ferramentas:     ferramentasSelecionadas,
      tarefasManuais:  tarefasManuaisSelecionadas,
      jaAutomatizados: jaAutomatizadosSelecionados,
    };
    const current = map[field] as string[];
    if (current.includes(value)) {
      setValue(field, current.filter((v) => v !== value), { shouldValidate: true });
    } else if (!maxItems || current.length < maxItems) {
      setValue(field, [...current, value], { shouldValidate: true });
    }
  };

  // Avança step validando apenas os campos do step atual
  const nextStep = async () => {
    const fieldsPerStep: Record<number, (keyof Schema)[]> = {
      1: ["nome", "email", "telefone"],
      2: ["empresa", "setor", "tamanho"],
      3: ["ferramentas", "tarefasManuais"],
      4: ["volumeMensal", "objetivo", "orcamento"],
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

      const json = await res.json();

      if (res.status === 422 && json.erro === "dados_insuficientes") {
        setError(`⚠️ ${json.mensagem ?? "Preencha os campos com informações reais da sua empresa para gerar o diagnóstico."}`);
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Erro ao processar análise");

      const result: AnalysisResult = json;

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

  if (loading) return <LoadingAnalysis />;

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* ── Progress bar ── */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
          {STEPS.map((s) => {
            const Icon   = s.icon;
            const active = step === s.id;
            const done   = step > s.id;
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
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#ff851b] to-[#7fdbff] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── Form card ── */}
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
                <input {...register("nome")} placeholder="João Silva" className={inputClass(!!errors.nome)} />
              </Field>

              <Field label="Email corporativo" error={errors.email?.message}>
                <input {...register("email")} type="email" placeholder="joao@empresa.com.br" className={inputClass(!!errors.email)} />
              </Field>

              <Field label="WhatsApp" error={errors.telefone?.message}>
                <input {...register("telefone")} type="tel" placeholder="(51) 99999-9999" className={inputClass(!!errors.telefone)} />
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
                <input {...register("empresa")} placeholder="Empresa Ltda." className={inputClass(!!errors.empresa)} />
              </Field>

              <Field label="Setor / Ramo de atuação" error={errors.setor?.message}>
                <select
                  {...register("setor")}
                  className={inputClass(!!errors.setor)}
                  style={{ backgroundColor: "#002d5c", color: "white" }}
                >
                  <option value="" style={{ backgroundColor: "#002d5c", color: "white" }}>Selecione o setor...</option>
                  {SETORES.map((s) => (
                    <option key={s} value={s} style={{ backgroundColor: "#002d5c", color: "white" }}>{s}</option>
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
                      <input {...register("tamanho")} type="radio" value={t.value} className="sr-only" />
                      <span className="text-xs text-white/80 leading-tight">{t.label}</span>
                    </label>
                  ))}
                </div>
                {errors.tamanho && <p className="text-red-400 text-xs mt-1">{errors.tamanho.message}</p>}
              </Field>
            </div>
          )}

          {/* ── Step 3: Processos ── */}
          {step === 3 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  Processos da empresa
                </h2>
                <p className="text-white/60 text-sm">Nos conte como sua equipe trabalha hoje.</p>
              </div>

              {/* Ferramentas */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Quais ferramentas sua equipe usa no dia a dia?
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {FERRAMENTAS.map((f) => {
                    const selecionada = ferramentasSelecionadas.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleCheckbox("ferramentas", f)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                          selecionada
                            ? "border-[#ff851b] bg-[#ff851b]/10"
                            : "border-white/10 hover:border-[#ff851b]/50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                          selecionada ? "bg-[#ff851b] border-[#ff851b]" : "border-white/30"
                        }`}>
                          {selecionada && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-white/80 leading-tight">{f}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.ferramentas && (
                  <p className="text-red-400 text-xs">{errors.ferramentas.message as string}</p>
                )}
              </div>

              {/* Tarefas manuais */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Quais tarefas consomem mais tempo da sua equipe?{" "}
                  <span className="text-white/40 font-normal">(máx. 3)</span>
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {TAREFAS_MANUAIS.map((t) => {
                    const selecionada = tarefasManuaisSelecionadas.includes(t);
                    const bloqueada   = !selecionada && tarefasManuaisSelecionadas.length >= 3;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleCheckbox("tarefasManuais", t, 3)}
                        disabled={bloqueada}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                          selecionada
                            ? "border-[#ff851b] bg-[#ff851b]/10"
                            : bloqueada
                            ? "border-white/5 opacity-40 cursor-not-allowed"
                            : "border-white/10 hover:border-[#ff851b]/50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                          selecionada ? "bg-[#ff851b] border-[#ff851b]" : "border-white/30"
                        }`}>
                          {selecionada && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-white/80 leading-tight">{t}</span>
                      </button>
                    );
                  })}
                </div>
                {tarefasManuaisSelecionadas.length === 3 && (
                  <p className="text-[#ff851b] text-xs">✓ Máximo de 3 tarefas atingido.</p>
                )}
                {errors.tarefasManuais && (
                  <p className="text-red-400 text-xs">{errors.tarefasManuais.message as string}</p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 4: Objetivo ── */}
          {step === 4 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease]">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  Objetivos e contexto
                </h2>
                <p className="text-white/60 text-sm">Últimas perguntas para personalizar seu diagnóstico.</p>
              </div>

              {/* Já automatizados */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Sua empresa já tem algum processo automatizado?{" "}
                  <span className="text-white/40 font-normal">(opcional)</span>
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {JA_AUTOMATIZADOS.map((j) => {
                    const selecionado = jaAutomatizadosSelecionados.includes(j);
                    return (
                      <button
                        key={j}
                        type="button"
                        onClick={() => toggleCheckbox("jaAutomatizados", j)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                          selecionado
                            ? "border-[#7fdbff] bg-[#7fdbff]/10"
                            : "border-white/10 hover:border-[#7fdbff]/50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                          selecionado ? "bg-[#7fdbff] border-[#7fdbff]" : "border-white/30"
                        }`}>
                          {selecionado && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-white/80 leading-tight">{j}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Volume mensal */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Quantas operações / atendimentos sua empresa processa por mês?
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {VOLUMES.map((v) => (
                    <label
                      key={v.value}
                      className="relative flex items-center gap-2 p-3 rounded-xl border border-white/10 cursor-pointer hover:border-[#ff851b]/50 transition-colors has-[:checked]:border-[#ff851b] has-[:checked]:bg-[#ff851b]/10"
                    >
                      <input {...register("volumeMensal")} type="radio" value={v.value} className="sr-only" />
                      <span className="text-xs text-white/80 leading-tight">{v.label}</span>
                    </label>
                  ))}
                </div>
                {errors.volumeMensal && <p className="text-red-400 text-xs mt-1">{errors.volumeMensal.message}</p>}
              </div>

              {/* Objetivo principal */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Qual é o seu principal objetivo com automação?
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {OBJETIVOS.map((o) => (
                    <label
                      key={o.value}
                      className="relative flex items-center gap-2 p-3 rounded-xl border border-white/10 cursor-pointer hover:border-[#ff851b]/50 transition-colors has-[:checked]:border-[#ff851b] has-[:checked]:bg-[#ff851b]/10"
                    >
                      <input {...register("objetivo")} type="radio" value={o.value} className="sr-only" />
                      <span className="text-xs text-white/80 leading-tight">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.objetivo && <p className="text-red-400 text-xs mt-1">{errors.objetivo.message}</p>}
              </div>

              {/* Contexto adicional */}
              <Field
                label="Contexto adicional"
                hint="Algum detalhe específico sobre seus processos que quer que a IA considere? (opcional)"
              >
                <textarea
                  {...register("contextoAdicional")}
                  rows={3}
                  placeholder="Ex: trabalhamos com contratos de 3 tipos diferentes, nosso ticket médio é R$ 5.000, atendemos clientes em 5 estados..."
                  className={`${inputClass(false)} resize-none`}
                />
              </Field>

              {/* Orçamento */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80">
                  Orçamento estimado para automação
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {ORCAMENTOS.map((o) => (
                    <label
                      key={o.value}
                      className="relative flex items-center gap-2 p-3 rounded-xl border border-white/10 cursor-pointer hover:border-[#ff851b]/50 transition-colors has-[:checked]:border-[#ff851b] has-[:checked]:bg-[#ff851b]/10"
                    >
                      <input {...register("orcamento")} type="radio" value={o.value} className="sr-only" />
                      <span className="text-xs text-white/80 leading-tight">{o.label}</span>
                    </label>
                  ))}
                </div>
                {errors.orcamento && <p className="text-red-400 text-xs mt-1">{errors.orcamento.message}</p>}
              </div>
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
