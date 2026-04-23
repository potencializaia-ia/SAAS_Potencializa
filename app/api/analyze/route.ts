import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { saveLeadToSupabase, fetchCatalogAutomations } from "@/lib/supabase";
import { notifyNewLead } from "@/lib/email";
import type { FormData, AnalysisResult, AutomacaoCatalogo } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const orcamentoLabel: Record<string, string> = {
  "ate-5k":     "até R$ 5.000",
  "5k-15k":     "R$ 5.000 a R$ 15.000",
  "15k-30k":    "R$ 15.000 a R$ 30.000",
  "30k-50k":    "R$ 30.000 a R$ 50.000",
  "acima-50k":  "acima de R$ 50.000",
  "indefinido": "ainda não definido",
};

// ─── Validação pré-IA ─────────────────────────────────────────────────────────
function detectarConteudoInvalido(data: FormData): string | null {
  const textos = [
    { campo: "descrição dos processos", valor: data.descricao },
    { campo: "principal dor/desafio",   valor: data.dor },
  ];
  for (const { campo, valor } of textos) {
    const palavras = valor.trim().split(/\s+/);
    if (palavras.length < 4) {
      return `O campo "${campo}" está muito curto. Descreva com mais detalhes os processos reais da sua empresa.`;
    }
    const comprimentoMedio = valor.replace(/\s+/g, "").length / palavras.length;
    if (comprimentoMedio > 12) {
      return `O campo "${campo}" parece conter texto inválido. Use palavras reais para descrever sua empresa.`;
    }
    if (/(.)\1{4,}/.test(valor)) {
      return `O campo "${campo}" contém caracteres repetidos. Descreva com informações reais da sua empresa.`;
    }
    const palavrasReais = palavras.filter((p) => p.length >= 3);
    if (palavrasReais.length / palavras.length < 0.5) {
      return `O campo "${campo}" não contém informações suficientes. Seja mais detalhado sobre seus processos.`;
    }
  }
  return null;
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

// ─── Prompt com catálogo real ─────────────────────────────────────────────────
function buildPrompt(data: FormData, catalogo: AutomacaoCatalogo[]): string {
  return `Você é um especialista sênior em automação com IA da Potencializa, empresa brasileira.

## DADOS DA EMPRESA

- **Responsável:** ${data.nome}
- **Empresa:** ${data.empresa}
- **Setor:** ${data.setor}
- **Tamanho:** ${data.tamanho} funcionários
- **Orçamento disponível:** ${orcamentoLabel[data.orcamento] ?? data.orcamento}
- **Descrição dos processos:** "${data.descricao}"
- **Principal dor/desafio:** "${data.dor}"

## CATÁLOGO DE AUTOMAÇÕES DISPONÍVEIS (${catalogo.length} opções para este setor)

Estas são automações REAIS que a Potencializa entrega. Escolha APENAS desta lista:

${formatarCatalogo(catalogo)}

## SUA TAREFA

1. **Valide os dados**: Se a descrição ou dor forem incoerentes/sem sentido, retorne:
   {"erro": "dados_insuficientes", "mensagem": "explique em 1 frase o que falta"}

2. **Selecione as TOP 5** automações mais impactantes para esta empresa específica
   - A automação #1 deve atacar diretamente a dor: "${data.dor}"
   - Priorize pelo ROI e pelo alinhamento com os processos descritos
   - Use os valores reais de horas_mes e roi_12meses do catálogo

3. **Personalize a descrição** de cada automação mencionando detalhes reais dos processos da ${data.empresa}

## FORMATO DE RESPOSTA (somente JSON válido, sem markdown)

{
  "automacoes": [
    {
      "titulo": "Nome da automação do catálogo (pode adaptar levemente)",
      "descricao": "Descrição PERSONALIZADA usando contexto real da empresa (2-3 frases específicas)",
      "tipoAgente": "Tipo do agente (ex: Chatbot de atendimento, Processador de documentos)",
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
  "resumoGeral": "Parágrafo de 2-3 frases citando a ${data.empresa}, o setor ${data.setor} e os principais ganhos identificados."
}

## REGRAS
1. Use SOMENTE automações do catálogo acima — não invente novas
2. economiaMes = horasMes × custo médio/hora do setor (R$40–R$150)
3. roi12meses = economiaMes × 12
4. complexidade: exatamente "Fácil", "Médio" ou "Complexo"
5. produtosPotencializa: valores de ["Treinamento IA", "Agente IA Customizado", "Consultoria em IA", "Treinamento + Agente"]
6. Retorne APENAS o JSON — sem texto antes ou depois`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const data: FormData = await req.json();

    // 1. Validação pré-IA
    const erroValidacao = detectarConteudoInvalido(data);
    if (erroValidacao) {
      return NextResponse.json(
        { erro: "dados_insuficientes", mensagem: erroValidacao },
        { status: 422 }
      );
    }

    // 2. Busca automações relevantes do catálogo
    const catalogo = await fetchCatalogAutomations(data.setor);

    // Fallback: se catálogo vazio (ex: setor "Outro"), busca genéricas "Todos"
    const catalogoFinal = catalogo.length >= 3 ? catalogo : catalogo;

    if (catalogoFinal.length === 0) {
      return NextResponse.json(
        { erro: "dados_insuficientes", mensagem: "Não encontramos automações mapeadas para o seu setor ainda. Entre em contato diretamente com a Potencializa." },
        { status: 422 }
      );
    }

    // 3. Chama Claude com catálogo real
    const message = await client.messages.create({
      model:      "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [{ role: "user", content: buildPrompt(data, catalogoFinal) }],
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
