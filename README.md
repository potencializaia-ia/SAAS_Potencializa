# Potencializa — Diagnóstico de Automação IA

SaaS de diagnóstico que analisa processos de empresas e retorna as top 5 oportunidades de automação com IA, com estimativa de horas e R$ economizados.

**URL:** `potencializaia.com/diagnostico`

---

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** — cores da Potencializa
- **Claude API** (Sonnet) — análise de automação
- **Supabase** — banco de dados de leads
- **Resend** — email de notificação de novos leads

---

## Setup inicial (1ª vez)

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha o `.env.local` com as chaves reais (veja abaixo como obter cada uma).

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. No painel: **SQL Editor** → cole o conteúdo de `lib/supabase-schema.sql` → Execute
3. Copie as chaves em **Settings → API**:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` (não a `anon`) → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Configurar Claude API

1. Acesse [console.anthropic.com](https://console.anthropic.com)
2. Crie uma API Key → cole em `ANTHROPIC_API_KEY`

### 5. Configurar Resend (email)

1. Acesse [resend.com](https://resend.com) → crie conta grátis
2. **Domains** → adicione `potencializaia.com` → siga as instruções DNS na Hostinger
3. **API Keys** → crie uma chave → cole em `RESEND_API_KEY`
4. Defina `FROM_EMAIL` como `diagnostico@potencializaia.com`
5. Defina `NOTIFY_EMAIL` como o seu email pessoal

### 6. Adicionar logo

Coloque o arquivo `logo.png` em `/public/logo.png` (PNG com fundo transparente, 80x80px mínimo).

### 7. Rodar localmente

```bash
npm run dev
# Acesse: http://localhost:3000/diagnostico
```

---

## Deploy na Hostinger

A Hostinger suporta Node.js via **Node.js App** no hPanel.

### Passo a passo

1. **Build do projeto:**
   ```bash
   npm run build
   ```

2. **No hPanel Hostinger:**
   - Va em **Node.js** → **Criar aplicativo**
   - Versão: **Node.js 20**
   - Diretório: pasta do projeto no servidor
   - Script de inicialização: `node_modules/.bin/next start`
   - Porta: `3000`

3. **Upload dos arquivos via Git ou FTP:**
   - Faça upload de todo o projeto (exceto `node_modules`)
   - No servidor, rode: `npm install && npm run build`

4. **Configurar variáveis de ambiente no hPanel:**
   - Node.js App → **Variáveis de Ambiente**
   - Adicione todas as variáveis do `.env.example`

5. **Configurar domínio/subdiretório:**

   **Opção A — Subdomínio (mais simples):**
   - Crie `diagnostico.potencializaia.com` no hPanel → DNS → A Record apontando para o IP do servidor Node.js

   **Opção B — Subdiretório `/diagnostico`:**
   - Configure um reverse proxy no `.htaccess` do site principal:
   ```apache
   RewriteRule ^diagnostico(.*)$ http://localhost:3000/diagnostico$1 [P,L]
   ```
   - Requer que o plano Hostinger suporte `mod_proxy` (Business ou superior)

---

## CTAs da página de resultado

Configure no `.env.local`:

```env
# Link do Calendly para agendar call gratuita
NEXT_PUBLIC_CAL_LINK=https://calendly.com/potencializa/30min

# Link de compra do relatorio detalhado (Hotmart, Stripe, etc.)
NEXT_PUBLIC_REPORT_LINK=https://...
```

---

## Estrutura de pastas

```
potencializa-diagnostico/
├── app/
│   ├── diagnostico/page.tsx    # Página com formulário
│   ├── resultado/page.tsx      # Página de resultados
│   ├── api/
│   │   └── analyze/route.ts   # API Claude + Supabase + Email
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── DiagnosticForm.tsx      # Form multi-step (3 etapas)
│   ├── AutomacaoCard.tsx       # Card de cada automação
│   └── ResultadoClient.tsx     # Página de resultado (client)
├── lib/
│   ├── supabase.ts             # Client Supabase + saveLeadToSupabase
│   ├── email.ts                # notifyNewLead via Resend
│   └── supabase-schema.sql     # SQL para criar tabela de leads
├── types/
│   └── index.ts                # FormData, Automacao, AnalysisResult
├── public/
│   └── logo.png                # Logo da Potencializa (adicionar manualmente)
└── .env.example                # Template de variáveis de ambiente
```

---

## Custos estimados

| Serviço | Plano | Custo |
|---|---|---|
| Claude API | Pay-per-use | ~R$0,15 por análise (Sonnet) |
| Supabase | Free tier | R$ 0/mês até 500MB |
| Resend | Free tier | R$ 0/mês até 3.000 emails |
| Hostinger | Plano atual | R$ 0 (já contratado) |
| **Total estimado** | 1.000 análises/mês | **~R$ 150/mês** |

---

## Fluxo do usuário

```
/diagnostico → Form (3 etapas) → POST /api/analyze
                                        ↓
                               Claude analisa processos
                                        ↓
                         Salva lead no Supabase
                         Envia email de notificação
                                        ↓
                              /resultado — Top 5 automações
                                        ↓
                         CTA: Agendar Call | Comprar Relatório
```
