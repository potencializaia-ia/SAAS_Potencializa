import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { FormData, AnalysisResult, AutomacaoCatalogo } from "@/types";

// Lazy initialization — só cria o client quando chamado (não no build)
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("Supabase env vars not set: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
    }
    _client = createClient(url, key);
  }
  return _client;
}

export async function saveLeadToSupabase(
  form:   FormData,
  result: AnalysisResult
): Promise<void> {
  const supabase = getClient();

  const { error } = await supabase.from("leads").insert({
    nome:             form.nome,
    email:            form.email,
    telefone:         form.telefone,
    empresa:          form.empresa,
    setor:            form.setor,
    tamanho:          form.tamanho,
    descricao:        form.descricao,
    dor:              form.dor,
    orcamento:        form.orcamento,
    resultado:        result,
    total_horas_mes:  result.totalHorasMes,
    total_economia:   result.totalEconomiaMes,
    roi_12meses:      result.totalRoi12meses,
    created_at:       new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }
}

// ─── Busca automações do catálogo por setor (matching flexível) ───────────────
// Ex: "Saúde / Clínicas" → busca por "Saúde" OR "Clínicas" OR "Todos"
export async function fetchCatalogAutomations(
  setor: string
): Promise<AutomacaoCatalogo[]> {
  const supabase = getClient();

  // Extrai palavras-chave do setor (ignora palavras curtas e conjunções)
  const keywords = setor
    .split(/[\s\/]+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !["de", "do", "da", "e"].includes(w.toLowerCase()));

  // Monta filtro OR: qualquer keyword OU "Todos"
  const filters = [
    ...keywords.map((k) => `setores.ilike.%${k}%`),
    "setores.ilike.%Todos%",
  ].join(",");

  const { data, error } = await supabase
    .from("automacoes_catalogo")
    .select("*")
    .or(filters)
    .limit(30);

  if (error) {
    console.error("Erro ao buscar catálogo:", error.message);
    return [];
  }

  return (data ?? []) as AutomacaoCatalogo[];
}
