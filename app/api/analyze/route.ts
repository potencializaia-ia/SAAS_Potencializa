import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { saveLeadToSupabase, fetchCatalogAutomations } from "@/lib/supabase";
import { notifyNewLead } from "@/lib/email";
import type { FormData, AnalysisResult, AutomacaoCatalogo } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Labels legíveis para os campos estruturados ──────────────────────────────

const orcamentoLabel: Record<string, string> = {
  "ate-5k":     "até R$ 5.000",
  "5k-15k":     "R$ 5.000 a R$ 15.000",
  "15k-30k":    "R$ 15.000 a R$ 30.000",
  "30k-50k":    "R$ 30.000 a R$ 50.000",
  "acima-50k":  "acima de R$ 50.000",
  "indefinido": "ainda não definido",
};

const volumeLabel: Record<string, string> = {
  "menos-50":  "menos de 50 operações/mês",
  "50-200":    "50 a 200 operações/mês",
  "200-500":   "200 a 500 operações/mês",
  "500-2000":  "500 a 2.000 operações/mês",
  "mais-2000": "mais de 2.000 operações/mês",
};

const objetivoLabel: Record<string, string> = {
  "reduzir-custos":        "Reduzir custos operacionais",
  "escalar-sem-contratar": "Escalar sem precisar contratar",
  "atender-mais-rapido":   "Atender clientes mais rápido",
  "eliminar-erros":        "Eliminar erros humanos em processos",
  "liberar-equipe":        "Liberar equipe para tarefas estratégicas",
};

// ─── Validação pré-IA (apenas contextoAdicional, se preenchido) ───────────────
function detectarConteudoInvalido(data: FormData): string | null {
  if (!data.contextoAdicional || data.contextoAdicional.trim().length === 0) return null;

  const valor   = data.contextoAdicional.trim();
  const palavras = valor.split(/\s+/);

  if (/(.)\1{4,}/.test(valor)) {
    return `O campo de contexto adicional contém caracteres repetidos. Use informações reais da sua empresa.`;
  }
  if (palavras.length >= 3) {
    const comprimentoMedio = valor.replace(/\s+/g, "").length / palavras.length;
    if (comprimentoMedio > 15) {
      return `O campo de contexto adicional parece conter texto inválido. Use palavras reais para descrever sua empresa.`;
    }
  }
  return null;
}

// ─── Monta o bloco de contexto da empresa para o prompt ──────────────────────
function buildContextoEmpresa(data: FormData): string {
  const jaAutomFiltrados = (data.jaAutomatizados ?? []).filter(
    (j) => j !== "Não temos nada automatizado ainda"
  );

  const ferramentasCompleto = [
    ...(data.ferramentas ?? []),
    ...(data.outraFerramenta?.trim() ? [data.outraFerramenta.trim()] : []),
  ].join(", ") || "Não informado";

  const tarefasCompleto = [
    ...(data.tarefasManuais ?? []),
    ...(data.outraTarefa?.trim() ? [data.outraTarefa.trim()] : []),
  ].join(", ") || "Não informado";

  const objetivosCompleto = (data.objetivo ?? [])
    .map((o) => objetivoLabel[o] ?? o)
    .join(", ") || "Não informado";

  return `
- **Responsável:** ${data.nome}
- **Empresa:** ${data.empresa}
- **Setor:** ${data.setor}
- **Tamanho:** ${data.tamanho} funcionários
- **Orçamento disponível:** ${orcamentoLabel[data.orcamento] ?? data.orcamento}
- **Ferramentas que já usa:** ${ferramentasCompleto}
- **Tarefas manuais que mais consomem tempo:** ${tarefasCompleto}
- **Volume mensal de operações:** ${volumeLabel[data.volumeMensal] ?? data.volumeMensal}
- **Objetivos com automação:** ${objetivosCompleto}${data.contextoAdicional?.trim() ? `\n- **Contexto adicional:** "${data.contextoAdicional.trim()}"` : ""}${jaAutomFiltrados.length > 0 ? `\n\n⚠️ **JÁ AUTOMATIZADOS — NÃO RECOMENDAR ESSES:** ${jaAutomFiltrados.join(", ")}` : ""}`;
}

// ─── Formata catálogo para o prompt ──────────────────────────────────────────
function formatarCatalogo(automacoes: AutomacaoCatalogo[]): string {
  return automacoes
    .map(
      (a, i) =>
        `${i + 1}. [${a.categoria}] ${a.nome}\n` +
        `   Descrição: ${a.descricao}\n` +
        `   Complexidade: ${a.complexidade} | Horas/mês: ${a.horas_mes}h | ROI 12m: R$ ${a.roi_12meses.toLocaleString("pt-BR")} | Custo impl.: R$ ${a.custo_implementacao.toLocaleString("pt-BR")}`
    )
    .join("\n\n");
}

// ─── Prompt COM catálogo (modo principal) ─────────────────────────────────────
function buildPromptComCatalogo(data: FormData, catalogo: AutomacaoCatalogo[]): string {
  const jaAutomFiltrados = (data.jaAutomatizados ?? []).filter(
    (j) => j !== "Não temos nada automatizado ainda"
  );

  return `Você é um especialista sênior em automação com IA da Potencializa, empresa brasileira.

## DADOS DA EMPRESA
${buildContextoEmpresa(data)}

## CATÁLOGO DE AUTOMAÇÕES DISPONÍVEIS (${catalogo.length} opções para este setor)
Estas são automações REAIS que a Potencializa entrega. Escolha APENAS desta lista:

${formatarCatalogo(catalogo)}

## SUA TAREFA
1. **Valide os dados**: Se as seleções forem incoerentes ou inconsistentes, retorne:
   {"erro": "dados_insuficientes", "mensagem": "explique em 1 frase o que falta"}

2. **Selecione as TOP 5** automações mais impactantes para esta empresa específica
   - Priorize automações que atacam as tarefas manuais: "${(data.tarefasManuais ?? []).join(", ")}"
   - Alinhe com o objetivo: "${(data.objetivo ?? []).map((o) => objetivoLabel[o] ?? o).join(", ")}"
   - Considere o volume de ${volumeLabel[data.volumeMensal] ?? data.volumeMensal} para dimensionar o impacto
   - Use os valores reais de horas_mes e roi_12meses do catálogo
   - Personalize a descrição mencionando detalhes reais dos processos da ${data.empresa}${jaAutomFiltrados.length > 0 ? `\n   - NÃO sugira automações similares ao que já está automatizado: ${jaAutomFiltrados.join(", ")}` : ""}

## FORMATO DE RESPOSTA (somente JSON válido, sem markdown)
{
  "automacoes": [
    {
      "titulo": "Nome da automação do catálogo",
      "descricao": "Descrição PERSONALIZADA com contexto real da empresa (2-3 frases)",
      "tipoAgente": "Tipo do agente (ex: Chatbot, Processador de documentos)",
      "horasMes": 80,
      "economiaMes": 4000,
      "roi12meses": 48000,
      "complexidade": "Médio",
      "prioridade": 1,
      "produtosPotencializa": ["Agente IA Customizado", "Treinamento IA"]
    }
  ],
  "totalHorasMes": 250,
  "totalEconomiaMes": 12000,
  "totalRoi12meses": 144000,
  "resumoGeral": "2-3 frases sobre o potencial da ${data.empresa} no setor ${data.setor}, alinhado ao objetivo de ${(data.objetivo ?? []).map((o) => objetivoLabel[o] ?? o).join(", ")}."
}

## REGRAS
1. Use SOMENTE automações do catálogo acima
2. economiaMes = horasMes × custo médio/hora do setor (R$40–R$150)
3. roi12meses = economiaMes × 12
4. complexidade: exatamente "Fácil", "Médio" ou "Complexo"
5. produtosPotencializa: valores de ["Treinamento IA", "Agente IA Customizado", "Consultoria em IA", "Treinamento + Agente"]
6. Retorne APENAS o JSON — sem texto antes ou depois`;
}

// ─── Prompt FALLBACK (sem catálogo) ──────────────────────────────────────────
function buildPromptFallback(data: FormData): string {
  const jaAutomFiltrados = (data.jaAutomatizados ?? []).filter(
    (j) => j !== "Não temos nada automatizado ainda"
  );

  return `Você é um especialista sênior em automação com IA para empresas brasileiras da Potencializa.

## DADOS DA EMPRESA
${buildContextoEmpresa(data)}

## SUA TAREFA
1. **Valide os dados**: Se as seleções forem incoerentes, retorne:
   {"erro": "dados_insuficientes", "mensagem": "explique em 1 frase o que falta"}

2. Identifique as **top 5 oportunidades de automação com IA** mais impactantes para esta empresa.
   - Priorize automações que eliminam as tarefas manuais: "${(data.tarefasManuais ?? []).join(", ")}"
   - Alinhe com o objetivo principal: "${(data.objetivo ?? []).map((o) => objetivoLabel[o] ?? o).join(", ")}"
   - Considere as ferramentas que já usa: ${(data.ferramentas ?? []).join(", ")}
   - Volume de ${volumeLabel[data.volumeMensal] ?? data.volumeMensal} — use para dimensionar o impacto
   - Seja específico ao setor ${data.setor} e ao porte da empresa (${data.tamanho} funcionários)
   - Custo médio de mão de obra BR: R$40–R$150/hora conforme setor${jaAutomFiltrados.length > 0 ? `\n   - NÃO sugira automações similares ao que já está automatizado: ${jaAutomFiltrados.join(", ")}` : ""}

## FORMATO DE RESPOSTA (somente JSON válido, sem markdown)
{
  "automacoes": [
    {
      "titulo": "Nome curto e claro da automação (máx 8 palavras)",
      "descricao": "Descrição concreta usando os processos reais mencionados (2-3 frases)",
      "tipoAgente": "Tipo do agente IA",
      "horasMes": 40,
      "economiaMes": 3000,
      "roi12meses": 36000,
      "complexidade": "Médio",
      "prioridade": 1,
      "produtosPotencializa": ["Agente IA Customizado", "Treinamento IA"]
    }
  ],
  "totalHorasMes": 120,
  "totalEconomiaMes": 9000,
  "totalRoi12meses": 108000,
  "resumoGeral": "2-3 frases específicas sobre o potencial da ${data.empresa} no setor ${data.setor}, alinhado ao objetivo de ${(data.objetivo ?? []).map((o) => objetivoLabel[o] ?? o).join(", ")}."
}

## REGRAS
1. horasMes: 10–80h por automação (conservador)
2. economiaMes = horasMes × custo/hora do setor
3. roi12meses = economiaMes × 12
4. complexidade: exatamente "Fácil", "Médio" ou "Complexo"
5. produtosPotencializa: valores de ["Treinamento IA", "Agente IA Customizado", "Consultoria em IA", "Treinamento + Agente"]
6. Retorne APENAS o JSON — sem texto antes ou depois`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const data: FormData = await req.json();

    // 1. Validação pré-IA (contextoAdicional opcional)
    const erroValidacao = detectarConteudoInvalido(data);
    if (erroValidacao) {
      return NextResponse.json(
        { erro: "dados_insuficientes", mensagem: erroValidacao },
        { status: 422 }
      );
    }

    // 2. Tenta buscar catálogo do Supabase
    let prompt: string;
    try {
      const catalogo = await fetchCatalogAutomations(data.setor);
      if (catalogo.length >= 3) {
        prompt = buildPromptComCatalogo(data, catalogo);
      } else {
        prompt = buildPromptFallback(data);
      }
    } catch {
      prompt = buildPromptFallback(data);
    }

    // 3. Chama Claude
    const message = await client.messages.create({
      model:      "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const rawText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    // 4. Parse JSON
    let parsed: AnalysisResult & { erro?: string; mensagem?: string };
    try {
      const clean = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error("Falha ao parsear JSON do Claude:", rawText);
      return NextResponse.json(
        { error: "Falha ao processar resposta da IA. Tente novamente." },
        { status: 500 }
      );
    }

    // 5. Claude identificou dados inválidos
    if (parsed.erro === "dados_insuficientes") {
      return NextResponse.json(
        { erro: "dados_insuficientes", mensagem: parsed.mensagem },
        { status: 422 }
      );
    }

    const result = parsed as AnalysisResult;

    // 6. Salva lead e notifica (não bloqueia resposta)
    saveLeadToSupabase(data, result).catch(console.error);
    notifyNewLead(data, result).catch(console.error);

    return NextResponse.json(result);
  } catch (err) {
    console.error("Erro na API analyze:", err);
    return NextResponse.json(
      { error: "Erro interno ao processar análise." },
      { status: 500 }
    );
  }
}
