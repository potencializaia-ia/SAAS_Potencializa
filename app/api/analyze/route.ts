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

// ─── Validação pré-IA: detecta gibberish sem gastar créditos ─────────────────
function detectarConteudoInvalido(data: FormData): string | null {
  const textos = [
    { campo: "descrição dos processos", valor: data.descricao },
    { campo: "principal dor/desafio",   valor: data.dor },
  ];

  for (const { campo, valor } of textos) {
    const palavras = valor.trim().split(/\s+/);

    // Menos de 4 palavras reais
    if (palavras.length < 4) {
      return `O campo "${campo}" está muito curto para gerar um diagnóstico preciso. Descreva com mais detalhes.`;
    }

    // Média de comprimento de palavra > 12 (ex: "asdhasudhausdhausd")
    const comprimentoMedio = valor.replace(/\s+/g, "").length / palavras.length;
    if (comprimentoMedio > 12) {
      return `O campo "${campo}" parece conter texto inválido. Use palavras reais para descrever sua empresa.`;
    }

    // Muitos caracteres repetidos seguidos (ex: "aaaaaaa", "ssssss")
    if (/(.)\1{4,}/.test(valor)) {
      return `O campo "${campo}" contém caracteres repetidos. Descreva com informações reais da sua empresa.`;
    }

    // Menos de 30% das palavras têm 3+ letras (palavras reais)
    const palavrasReais = palavras.filter((p) => p.length >= 3);
    if (palavrasReais.length / palavras.length < 0.5) {
      return `O campo "${campo}" não contém informações suficientes. Seja mais detalhado sobre seus processos.`;
    }
  }

  return null; // Tudo ok
}

// ─── Prompt principal ────────────────────────────────────────────────────────
function buildPrompt(data: FormData): string {
  return `Você é um especialista sênior em automação com IA para empresas brasileiras da Potencializa.

## SUA TAREFA

Analise os dados reais desta empresa e gere um diagnóstico de automação PERSONALIZADO e ESPECÍFICO.

## DADOS DA EMPRESA

- **Responsável:** ${data.nome}
- **Empresa:** ${data.empresa}
- **Setor:** ${data.setor}
- **Tamanho:** ${data.tamanho} funcionários
- **Orçamento:** ${orcamentoLabel[data.orcamento] ?? data.orcamento}
- **Descrição dos processos:** "${data.descricao}"
- **Principal dor/desafio:** "${data.dor}"

## VALIDAÇÃO OBRIGATÓRIA

Antes de gerar as automações, avalie se os dados acima são informativos e coerentes:
- A descrição menciona processos reais de uma empresa? (ex: atendimento, vendas, contratos, relatórios, agendamentos...)
- A dor/desafio descreve um problema real de negócio?

Se os dados forem vagos, incoerentes ou sem sentido, retorne SOMENTE este JSON:
{
  "erro": "dados_insuficientes",
  "mensagem": "Explique em 1 frase o que está faltando para gerar o diagnóstico"
}

## SE OS DADOS FOREM VÁLIDOS

Identifique as **top 5 oportunidades de automação** mais impactantes para esta empresa ESPECÍFICA.

**REGRAS DE PERSONALIZAÇÃO (crítico):**
- Cada automação deve mencionar detalhes reais da descrição fornecida
- Não gere automações genéricas — use o contexto do setor (${data.setor}) e dos processos descritos
- O resumoGeral deve citar o nome da empresa (${data.empresa}) e detalhes específicos
- Os valores devem ser realistas para ${data.tamanho} funcionários no setor de ${data.setor}

**Custo médio de mão de obra no Brasil por setor:**
- Advocacia/Jurídico: R$ 80–150/hora
- Saúde/Clínicas: R$ 60–120/hora
- Contabilidade/Financeiro: R$ 70–130/hora
- Tecnologia: R$ 80–160/hora
- Varejo/E-commerce: R$ 30–60/hora
- Educação: R$ 40–80/hora
- Outros setores: R$ 40–100/hora

## FORMATO DE RESPOSTA (quando dados são válidos)

Responda APENAS com JSON válido neste formato exato:

{
  "automacoes": [
    {
      "titulo": "Nome específico da automação (máx. 8 palavras, use contexto da empresa)",
      "descricao": "Descreva EXATAMENTE o que será automatizado com base nos processos mencionados. Como a IA resolve a dor específica desta empresa. (2-3 frases concretas)",
      "tipoAgente": "Tipo do agente IA (ex: Agente de triagem de contratos, Chatbot de agendamento, Processador de laudos, Classificador de leads)",
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
  "resumoGeral": "2-3 frases específicas sobre o potencial da ${data.empresa} no setor de ${data.setor}, mencionando as principais oportunidades identificadas nos processos descritos."
}

## REGRAS CRÍTICAS

1. Retorne APENAS o JSON — sem markdown, sem texto antes ou depois
2. horasMes: horas economizadas/mês por automação (10–80h, seja conservador)
3. economiaMes: horasMes × custo/hora do setor
4. roi12meses: economiaMes × 12
5. complexidade: exatamente "Fácil", "Médio" ou "Complexo"
6. produtosPotencializa: valores de ["Treinamento IA", "Agente IA Customizado", "Consultoria em IA", "Treinamento + Agente"]
7. Máximo 5, mínimo 3 automações
8. A primeira automação (#1) deve atacar diretamente a DOR principal descrita pelo usuário`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const data: FormData = await req.json();

    // 1. Validação pré-IA (sem custo de crédito)
    const erroValidacao = detectarConteudoInvalido(data);
    if (erroValidacao) {
      return NextResponse.json(
        { erro: "dados_insuficientes", mensagem: erroValidacao },
        { status: 422 }
      );
    }

    // 2. Chama Claude API
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

    // 3. Extrai o texto da resposta
    const rawText = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    // 4. Parse do JSON
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

    // 6. Salva lead e notifica (não bloqueia a resposta)
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
