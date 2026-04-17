// Dados coletados no formulário
export interface FormData {
  // Etapa 1 – Contato
  nome:    string;
  email:   string;
  telefone: string;

  // Etapa 2 – Empresa
  empresa:  string;
  setor:    string;
  tamanho:  string;

  // Etapa 3 – Contexto
  descricao:  string;
  dor:        string;
  orcamento:  string;
}

// Uma automação sugerida pela IA
export interface Automacao {
  titulo:          string;   // ex: "Triagem automática de emails"
  descricao:       string;   // o que automatizar e como
  tipoAgente:      string;   // chatbot, processador de documentos, etc.
  horasMes:        number;   // horas economizadas por mês
  economiaMes:     number;   // R$ economizados por mês
  roi12meses:      number;   // R$ economizados em 12 meses
  complexidade:    "Fácil" | "Médio" | "Complexo";
  prioridade:      number;   // 1 = maior prioridade
  produtosPotencializa: string[]; // ex: ["Treinamento IA", "Agente Customizado"]
}

// Resposta completa da análise
export interface AnalysisResult {
  automacoes:       Automacao[];
  totalHorasMes:    number;
  totalEconomiaMes: number;
  totalRoi12meses:  number;
  resumoGeral:      string;
}

// Payload salvo no Supabase
export interface LeadPayload {
  nome:       string;
  email:      string;
  telefone:   string;
  empresa:    string;
  setor:      string;
  tamanho:    string;
  resultado:  AnalysisResult;
  created_at: string;
}
