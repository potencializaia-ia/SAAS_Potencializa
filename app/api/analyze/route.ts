import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { saveLeadToSupabase } from "@/lib/supabase";
import { notifyNewLead } from "@/lib/email";
import type { FormData, AnalysisResult } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── Mapeamento de orçamento para valor legível ───────────────────────────────
const orcamentoLabel: Record<string, string> = {
  "ate-5k":     "até R$ 5.000",
  "5k-15k":     "R$ 5.000 a R$ 15.000",
  "15k-30k":    "R$ 15.000 a R$ 30.000",
  "30k-50k":    "R$ 30.000 a R$ 50.000",
  "acima-50k":  "acima de R$ 50.000",
  "indefinido": "ainda não definido",
};

// ─── Prompt para Claude ───────────────────────────────────────────────────────
function buildPrompt(data: FormData): string {
  return `Você é um especialista sênior em automação com IA para empresas brasileiras. Analise os dados abaixo e retorne um diagnóstico preciso e personalizado.

## DADOS DA EMPRESA

- **Nome:** ${data.nome} (${data.empresa})
- **Setor:** ${data.setor}
- **Tamanho:** ${data.tamanho} funcionários
- **Descrição dos processos:** ${data.descricao}
- **Principal dor/desafio:** ${data.dor}
- **Orçamento disponível:** ${orcamentoLabel[data.orcamento] ?? data.orcamento}

## INSTRUÇÕES

Identifique as **top 5 oportunidades de automação com IA** mais relevantes para esta empresa específica, ordenadas por impacto (maior impacto primeiro).

Para cada automação, considere:
- O contexto real do setor (${data.setor})
- Os processos descritos acima
- A principal dor mencionada
- O custo médio de mão de obra no Brasil: R$ 50-150/hora (varia por setor e cargo)

## FORMATO DE RESPOSTA (OBRIGATÓRIO)

Responda APENAS com um JSON válido neste formato exato, sem texto antes ou depois:

{
  "automacoes": [
    {
      "titulo": "Nome curto e claro da automação (máx. 8 palavras)",
      "descricao": "Descrição concreta de o que automatizar e como a IA faz isso (2-3 frases)",
      "tipoAgente": "Tipo do agente IA (ex: Chatbot de atendimento, Processador de documentos, Classificador automático, Gerador de relatórios, Agente de triagem)",
      "horasMes": 40,
      "economiaMes": 3000,
      "roi12meses": 36000,
      "complexidade": "Fácil",
      "prioridade": 1,
      "produtosPotencializa": ["Treinamento IA", "Agente IA Customizado"]
    }
  ],
  "totalHorasMes": 120,
  "totalEconomiaMes": 9000,
  "totalRoi12meses": 108000,
  "resumoGeral": "Parágrafo de 2-3 frases resumindo o potencial de automação desta empresa específica, mencionando os principais ganhos e o impacto esperado."
}

## REGRAS CRÍTICAS

1. Retorne APENAS o JSON, sem markdown, sem explicações
2. Os valores numéricos devem ser realistas para o setor e tamanho da empresa
3. horasMes = horas economizadas mensalmente (seja conservador: 10-80h por automação)
4. economiaMes = horasMes × custo/hora médio do setor
5. roi12meses = economiaMes × 12 (estimativa de economia bruta anual)
6. complexidade deve ser exatamente: "Fácil", "Médio" ou "Complexo"
7. produtosPotencializa deve conter valores do array: ["Treinamento IA", "Agente IA Customizado", "Consultoria em IA", "Treinamento + Agente"]
8. Máximo de 5 automações, mínimo de 3
9. Seja específico para o setor: uma automação de escritório de advocacia é diferente de uma clínica médica`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const data: FormData = await req.json();

    // Chama Claude API
    const message = await client.messages.create({
      model:      "claude-sonnet-4-5",
      max_tokens: 2048,
      messages: [
        {
          role:    "user",
          content: buildPrompt(data),
        },
      ],
    });

    // Extrai o texto da resposta
    const rawText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    // Parse do JSON
    let result: AnalysisResult;
    try {
      // Remove possíveis marcações de código caso Claude inclua
      const clean = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      result = JSON.parse(clean);
    } catch {
      console.error("Falha ao parsear JSON do Claude:", rawText);
      return NextResponse.json(
        { error: "Falha ao processar resposta da IA. Tente novamente." },
        { status: 500 }
      );
    }

    // Salva lead no Supabase (não bloqueia a resposta)
    saveLeadToSupabase(data, result).catch(console.error);

    // Envia email de notificação (não bloqueia a resposta)
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
