-- ============================================================
-- Schema Supabase – Potencializa Diagnóstico IA
-- Execute este SQL no SQL Editor do Supabase
-- ============================================================

-- Tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id               BIGSERIAL PRIMARY KEY,
  nome             TEXT NOT NULL,
  email            TEXT NOT NULL,
  telefone         TEXT NOT NULL,
  empresa          TEXT NOT NULL,
  setor            TEXT NOT NULL,
  tamanho          TEXT NOT NULL,
  descricao        TEXT,
  dor              TEXT,
  orcamento        TEXT,
  resultado        JSONB NOT NULL,         -- AnalysisResult completo
  total_horas_mes  INTEGER,
  total_economia   NUMERIC(10, 2),
  roi_12meses      NUMERIC(12, 2),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Index para busca por email e empresa
CREATE INDEX IF NOT EXISTS leads_email_idx   ON leads (email);
CREATE INDEX IF NOT EXISTS leads_empresa_idx ON leads (empresa);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);

-- Row Level Security: apenas service_role pode ler/escrever
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Política: sem acesso via anon key (somente service_role)
CREATE POLICY "Somente service_role pode inserir"
  ON leads FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Somente service_role pode ler"
  ON leads FOR SELECT
  TO service_role
  USING (true);

-- View útil para dashboard de leads (opcional)
CREATE OR REPLACE VIEW leads_dashboard AS
SELECT
  id,
  nome,
  email,
  telefone,
  empresa,
  setor,
  tamanho,
  orcamento,
  total_horas_mes,
  total_economia,
  roi_12meses,
  created_at,
  (resultado->>'resumoGeral') AS resumo
FROM leads
ORDER BY created_at DESC;
