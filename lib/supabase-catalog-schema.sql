-- ─── Tabela de catálogo de automações reais da Potencializa ───────────────────
CREATE TABLE IF NOT EXISTS automacoes_catalogo (
  id                    SERIAL PRIMARY KEY,
  nome                  TEXT NOT NULL,
  categoria             TEXT NOT NULL,
  setores               TEXT NOT NULL,   -- pipe-separated: "Advocacia|Saúde|Todos"
  descricao             TEXT NOT NULL,
  complexidade          TEXT NOT NULL CHECK (complexidade IN ('Fácil', 'Médio', 'Complexo')),
  horas_mes             INTEGER NOT NULL,
  roi_12meses           INTEGER NOT NULL,
  custo_implementacao   INTEGER NOT NULL,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: leitura pública (a API lê sem autenticação de usuário)
ALTER TABLE automacoes_catalogo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública do catálogo"
  ON automacoes_catalogo FOR SELECT
  USING (true);

-- Index para buscas ILIKE por setor (melhora performance)
CREATE INDEX IF NOT EXISTS idx_automacoes_setores ON automacoes_catalogo USING gin(to_tsvector('portuguese', setores));
