import {
  Document, Page, Text, View, StyleSheet, Image, Font,
} from "@react-pdf/renderer";
import type { AnalysisResult, FormData, Automacao } from "@/types";

// ─── Registro de fontes ───────────────────────────────────────────────────────
Font.register({
  family: "Raleway",
  fonts: [
    { src: "https://fonts.gstatic.com/s/raleway/v34/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCIPrE.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/raleway/v34/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCGPrE.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/raleway/v34/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCFPrE.woff2", fontWeight: 700 },
  ],
});

// ─── Cores ────────────────────────────────────────────────────────────────────
const C = {
  navy:      "#001f3f",
  navyLight: "#002d5c",
  orange:    "#ff851b",
  cyan:      "#7fdbff",
  white:     "#ffffff",
  gray1:     "#f8f9fa",
  gray2:     "#e9ecef",
  gray3:     "#6c757d",
  gray4:     "#343a40",
  emerald:   "#10b981",
  yellow:    "#f59e0b",
  red:       "#ef4444",
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    fontFamily:      "Raleway",
    backgroundColor: C.white,
    paddingBottom:   60,
  },

  // ── Header de capa ──
  coverBg: {
    backgroundColor: C.navy,
    padding:         48,
    paddingBottom:   40,
  },
  coverTag: {
    backgroundColor: C.orange,
    color:           C.white,
    fontSize:        9,
    fontWeight:      700,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius:    20,
    alignSelf:       "flex-start",
    marginBottom:    20,
    letterSpacing:   1,
  },
  coverTitle: {
    fontSize:   30,
    fontWeight: 700,
    color:      C.white,
    lineHeight: 1.2,
    marginBottom: 10,
  },
  coverTitleAccent: {
    color: C.orange,
  },
  coverSub: {
    fontSize:  12,
    color:     "#7fa8cc",
    marginBottom: 28,
  },
  coverMeta: {
    flexDirection: "row",
    gap:           24,
  },
  coverMetaItem: {
    flexDirection: "row",
    alignItems:    "center",
    gap:           6,
  },
  coverMetaDot: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: C.orange,
  },
  coverMetaText: {
    fontSize: 10,
    color:    "#a0c0d8",
  },

  // ── Seção de métricas ──
  metricsRow: {
    flexDirection:   "row",
    gap:             12,
    paddingHorizontal: 32,
    marginTop:       -1,
    marginBottom:    28,
    backgroundColor: C.navy,
    paddingVertical: 24,
  },
  metricCard: {
    flex:            1,
    backgroundColor: "#ffffff10",
    borderRadius:    10,
    padding:         14,
    borderWidth:     1,
    borderColor:     "#ffffff15",
    alignItems:      "center",
  },
  metricLabel: {
    fontSize:     8,
    color:        "#7fa8cc",
    marginBottom: 6,
    textAlign:    "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  metricValue: {
    fontSize:   18,
    fontWeight: 700,
    color:      C.white,
  },
  metricValueOrange: {
    fontSize:   18,
    fontWeight: 700,
    color:      C.orange,
  },
  metricSub: {
    fontSize:  8,
    color:     "#5588aa",
    marginTop: 3,
    textAlign: "center",
  },

  // ── Corpo ──
  body: {
    paddingHorizontal: 32,
  },
  sectionTitle: {
    fontSize:     13,
    fontWeight:   700,
    color:        C.navy,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize:     9,
    color:        C.gray3,
    marginBottom: 16,
  },
  divider: {
    height:          1,
    backgroundColor: C.gray2,
    marginBottom:    20,
  },

  // ── Card de automação ──
  autoCard: {
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     C.gray2,
    marginBottom:    14,
    overflow:        "hidden",
  },
  autoCardHeader: {
    backgroundColor: C.navy,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection:   "row",
    justifyContent:  "space-between",
    alignItems:      "center",
  },
  autoPrioBadge: {
    backgroundColor: C.orange,
    color:           C.white,
    fontSize:        8,
    fontWeight:      700,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius:    20,
  },
  autoPrioBadgeGray: {
    backgroundColor: "#334",
    color:           "#aaa",
    fontSize:        8,
    fontWeight:      700,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius:    20,
  },
  autoComplexBadgeFacil: {
    backgroundColor: "#d1fae5",
    color:           "#065f46",
    fontSize:        8,
    fontWeight:      600,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius:    20,
  },
  autoComplexBadgeMedio: {
    backgroundColor: "#fef3c7",
    color:           "#92400e",
    fontSize:        8,
    fontWeight:      600,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius:    20,
  },
  autoComplexBadgeComplexo: {
    backgroundColor: "#fee2e2",
    color:           "#991b1b",
    fontSize:        8,
    fontWeight:      600,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius:    20,
  },
  autoCardBody: {
    padding: 14,
    backgroundColor: C.white,
  },
  autoTitle: {
    fontSize:     11,
    fontWeight:   700,
    color:        C.navy,
    marginBottom: 3,
  },
  autoAgente: {
    fontSize:     8,
    color:        "#2980b9",
    marginBottom: 8,
  },
  autoDesc: {
    fontSize:     9,
    color:        C.gray3,
    lineHeight:   1.5,
    marginBottom: 12,
  },
  autoMetricsRow: {
    flexDirection:   "row",
    gap:             8,
    marginBottom:    10,
  },
  autoMetricBox: {
    flex:            1,
    backgroundColor: C.gray1,
    borderRadius:    6,
    padding:         8,
    alignItems:      "center",
  },
  autoMetricBoxOrange: {
    flex:            1,
    backgroundColor: "#fff4ec",
    borderRadius:    6,
    padding:         8,
    alignItems:      "center",
    borderWidth:     1,
    borderColor:     "#ffd4a8",
  },
  autoMetricVal: {
    fontSize:     10,
    fontWeight:   700,
    color:        C.navy,
    marginBottom: 2,
  },
  autoMetricValOrange: {
    fontSize:     10,
    fontWeight:   700,
    color:        C.orange,
    marginBottom: 2,
  },
  autoMetricLabel: {
    fontSize: 7,
    color:    C.gray3,
  },
  autoProdutosLabel: {
    fontSize:     7,
    color:        C.gray3,
    marginBottom: 4,
    fontWeight:   600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  autoProdutosRow: {
    flexDirection: "row",
    flexWrap:      "wrap",
    gap:           4,
  },
  autoProdutoBadge: {
    backgroundColor: "#fff0e6",
    borderWidth:     1,
    borderColor:     "#ffd4a8",
    color:           C.orange,
    fontSize:        8,
    fontWeight:      600,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius:    20,
  },

  // ── Resumo final ──
  resumoCard: {
    backgroundColor: C.navy,
    borderRadius:    12,
    padding:         24,
    marginTop:       8,
    marginHorizontal: 32,
  },
  resumoTitle: {
    fontSize:     14,
    fontWeight:   700,
    color:        C.white,
    marginBottom: 8,
  },
  resumoText: {
    fontSize:  10,
    color:     "#7fa8cc",
    lineHeight: 1.6,
    marginBottom: 16,
  },
  resumoCTA: {
    backgroundColor: C.orange,
    borderRadius:    8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf:       "flex-start",
  },
  resumoCTAText: {
    color:      C.white,
    fontSize:   10,
    fontWeight: 700,
  },
  resumoContact: {
    marginTop:  12,
    fontSize:   9,
    color:      "#5588aa",
  },

  // ── Footer ──
  footer: {
    position:        "absolute",
    bottom:          20,
    left:            32,
    right:           32,
    flexDirection:   "row",
    justifyContent:  "space-between",
    alignItems:      "center",
    borderTopWidth:  1,
    borderTopColor:  C.gray2,
    paddingTop:      10,
  },
  footerText: {
    fontSize: 8,
    color:    C.gray3,
  },
  footerPage: {
    fontSize: 8,
    color:    C.gray3,
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency", currency: "BRL", maximumFractionDigits: 0,
  }).format(v);
}

function complexBadgeStyle(c: string) {
  if (c === "Fácil")    return S.autoComplexBadgeFacil;
  if (c === "Complexo") return S.autoComplexBadgeComplexo;
  return S.autoComplexBadgeMedio;
}

const now = new Date().toLocaleDateString("pt-BR", {
  day: "2-digit", month: "long", year: "numeric",
});

// ─── Componente PDF ───────────────────────────────────────────────────────────
export function DiagnosticoPDF({
  form, result,
}: {
  form:   FormData;
  result: AnalysisResult;
}) {
  return (
    <Document
      title={`Diagnóstico IA — ${form.empresa}`}
      author="Potencializa"
      subject="Diagnóstico de Automação com IA"
    >

      {/* ════════════════════════════════════════
          PÁGINA 1 — Capa + Métricas + Automações
          ════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>

        {/* Capa */}
        <View style={S.coverBg}>
          <Text style={S.coverTag}>DIAGNÓSTICO DE AUTOMAÇÃO IA</Text>
          <Text style={S.coverTitle}>
            Relatório Personalizado{"\n"}
            <Text style={S.coverTitleAccent}>{form.empresa}</Text>
          </Text>
          <Text style={S.coverSub}>
            Gerado por Inteligência Artificial · Potencializa
          </Text>
          <View style={S.coverMeta}>
            {[
              `${form.nome}`,
              `${form.setor}`,
              `${form.tamanho} funcionários`,
              now,
            ].map((item, i) => (
              <View key={i} style={S.coverMetaItem}>
                <View style={S.coverMetaDot} />
                <Text style={S.coverMetaText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Métricas resumo */}
        <View style={S.metricsRow}>
          <View style={S.metricCard}>
            <Text style={S.metricLabel}>Horas economizadas/mês</Text>
            <Text style={S.metricValue}>{result.totalHorasMes}h</Text>
            <Text style={S.metricSub}>≈ {Math.round(result.totalHorasMes / 8)} dias de trabalho</Text>
          </View>
          <View style={S.metricCard}>
            <Text style={S.metricLabel}>Economia mensal</Text>
            <Text style={S.metricValue}>{fmt(result.totalEconomiaMes)}</Text>
            <Text style={S.metricSub}>com automações ativas</Text>
          </View>
          <View style={S.metricCard}>
            <Text style={S.metricLabel}>ROI em 12 meses</Text>
            <Text style={S.metricValueOrange}>{fmt(result.totalRoi12meses)}</Text>
            <Text style={S.metricSub}>retorno estimado</Text>
          </View>
        </View>

        {/* Automações */}
        <View style={S.body}>
          <Text style={S.sectionTitle}>Suas top automações identificadas</Text>
          <Text style={S.sectionSub}>Ordenadas por impacto — comece pela #1 para retorno mais rápido.</Text>
          <View style={S.divider} />

          {result.automacoes.map((a, i) => (
            <AutoCard key={i} automacao={a} index={i} />
          ))}
        </View>

        <FooterPDF page={1} empresa={form.empresa} />
      </Page>

      {/* ════════════════════════════════════════
          PÁGINA 2 — Resumo + CTA
          ════════════════════════════════════════ */}
      <Page size="A4" style={S.page}>
        <View style={{ ...S.coverBg, paddingBottom: 28 }}>
          <Text style={S.coverTag}>PRÓXIMOS PASSOS</Text>
          <Text style={{ ...S.coverTitle, fontSize: 22, marginBottom: 6 }}>
            Como implementar estas{"\n"}
            <Text style={S.coverTitleAccent}>automações na {form.empresa}</Text>
          </Text>
          <Text style={{ ...S.coverSub, marginBottom: 0 }}>
            A Potencializa oferece dois caminhos para você começar hoje mesmo.
          </Text>
        </View>

        <View style={{ ...S.body, marginTop: 28 }}>

          {/* Opção 1 */}
          <View style={{ ...S.autoCard, marginBottom: 16 }}>
            <View style={{ ...S.autoCardHeader, backgroundColor: C.orange }}>
              <Text style={{ color: C.white, fontSize: 11, fontWeight: 700 }}>
                Opção 1 — Call estratégica gratuita (30 min)
              </Text>
            </View>
            <View style={S.autoCardBody}>
              <Text style={S.autoDesc}>
                Converse com um especialista da Potencializa para entender qual das{" "}
                {result.automacoes.length} automações faz mais sentido começar, qual o cronograma
                realista e qual investimento esperar. Sem compromisso.
              </Text>
              <Text style={{ fontSize: 10, color: C.orange, fontWeight: 700 }}>
                → potencializaia.com · contato@potencializaia.com
              </Text>
            </View>
          </View>

          {/* Opção 2 */}
          <View style={{ ...S.autoCard, marginBottom: 28 }}>
            <View style={{ ...S.autoCardHeader, backgroundColor: "#003366" }}>
              <Text style={{ color: C.white, fontSize: 11, fontWeight: 700 }}>
                Opção 2 — Desenvolvimento de agente IA customizado
              </Text>
            </View>
            <View style={S.autoCardBody}>
              <Text style={S.autoDesc}>
                A Potencializa desenvolve agentes IA sob medida para o seu processo específico.
                Desde chatbots de atendimento até processadores de documentos jurídicos —
                sempre com treinamento da equipe incluído.
              </Text>
              <Text style={{ fontSize: 10, color: "#2980b9", fontWeight: 700 }}>
                → Treinamento IA · Agentes Customizados · Consultoria
              </Text>
            </View>
          </View>

          {/* Resumo geral */}
          <View style={S.resumoCard}>
            <Text style={S.resumoTitle}>Resumo do diagnóstico</Text>
            <Text style={S.resumoText}>{result.resumoGeral}</Text>
            <View style={S.resumoCTA}>
              <Text style={S.resumoCTAText}>
                Potencial de economia: {fmt(result.totalRoi12meses)} no primeiro ano
              </Text>
            </View>
            <Text style={S.resumoContact}>
              Potencializa · potencializaia.com · contato@potencializaia.com{"\n"}
              Diagnóstico gerado em {now} · Estimativas baseadas em médias do mercado brasileiro
            </Text>
          </View>
        </View>

        <FooterPDF page={2} empresa={form.empresa} />
      </Page>
    </Document>
  );
}

// ─── Card de automação no PDF ─────────────────────────────────────────────────
function AutoCard({ automacao, index }: { automacao: Automacao; index: number }) {
  return (
    <View style={S.autoCard}>
      <View style={S.autoCardHeader}>
        <Text style={index === 0 ? S.autoPrioBadge : S.autoPrioBadgeGray}>
          {index === 0 ? "★ MAIOR IMPACTO" : `#${automacao.prioridade} PRIORIDADE`}
        </Text>
        <Text style={complexBadgeStyle(automacao.complexidade)}>
          {automacao.complexidade}
        </Text>
      </View>

      <View style={S.autoCardBody}>
        <Text style={S.autoTitle}>{automacao.titulo}</Text>
        <Text style={S.autoAgente}>{automacao.tipoAgente}</Text>
        <Text style={S.autoDesc}>{automacao.descricao}</Text>

        <View style={S.autoMetricsRow}>
          <View style={S.autoMetricBox}>
            <Text style={S.autoMetricVal}>{automacao.horasMes}h</Text>
            <Text style={S.autoMetricLabel}>Horas/mês</Text>
          </View>
          <View style={S.autoMetricBox}>
            <Text style={S.autoMetricVal}>{fmt(automacao.economiaMes)}</Text>
            <Text style={S.autoMetricLabel}>Economia/mês</Text>
          </View>
          <View style={S.autoMetricBoxOrange}>
            <Text style={S.autoMetricValOrange}>{fmt(automacao.roi12meses)}</Text>
            <Text style={S.autoMetricLabel}>ROI 12 meses</Text>
          </View>
        </View>

        <Text style={S.autoProdutosLabel}>Como a Potencializa pode ajudar:</Text>
        <View style={S.autoProdutosRow}>
          {automacao.produtosPotencializa.map((p) => (
            <Text key={p} style={S.autoProdutoBadge}>{p}</Text>
          ))}
        </View>
      </View>
    </View>
  );
}

// ─── Footer das páginas ───────────────────────────────────────────────────────
function FooterPDF({ page, empresa }: { page: number; empresa: string }) {
  return (
    <View style={S.footer} fixed>
      <Text style={S.footerText}>Potencializa · Diagnóstico IA · {empresa}</Text>
      <Text style={S.footerPage}>Página {page}</Text>
    </View>
  );
}
