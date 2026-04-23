-- ─── Seed: 109 automações reais da Potencializa ──────────────────────────────
-- Execute APÓS criar a tabela com supabase-catalog-schema.sql

INSERT INTO automacoes_catalogo (nome, categoria, setores, descricao, complexidade, horas_mes, roi_12meses, custo_implementacao) VALUES

-- ATENDIMENTO
('Receptionist AI 24/7', 'Atendimento', 'Advocacia|Contabilidade|Saúde|Educação|Varejo|Imobiliária|RH|Tecnologia', 'Agente que recebe mensagens em WhatsApp/email, responde perguntas frequentes automaticamente, qualifica leads e escalona para humano quando necessário. Funciona 24/7 eliminando triagem manual.', 'Médio', 80, 48000, 8000),
('Technical Support Chatbot', 'Atendimento', 'Tecnologia|Varejo|Educação|Logística|Construção Civil', 'Diagnóstico automático de problemas técnicos, executa troubleshooting básico e escalona para especialista quando necessário. Reduz 60% dos chamados repetitivos.', 'Médio', 120, 72000, 10000),
('Escalador Automático de Tickets de Suporte', 'Atendimento', 'Todos', 'Recebe tickets de suporte, tria por urgência, responde problemas simples automaticamente e escalona casos complexos. Elimina 70% de tickets simples.', 'Fácil', 100, 60000, 6000),

-- VENDAS
('Lead Intelligence & Enrichment AI', 'Vendas', 'Advocacia|Contabilidade|Tecnologia|Marketing|Imobiliária|Logística|RH|Educação|Saúde|Varejo', 'Busca leads automaticamente em LinkedIn/Google conforme ICP, enriquece dados coletando receita estimada, tamanho da empresa, contatos-chave e inteligência competitiva. Organiza e classifica leads por perfil.', 'Complexo', 120, 72000, 12000),
('Decision Maker Finder', 'Vendas', 'Advocacia|Contabilidade|Tecnologia|Marketing|Imobiliária|RH|Logística|Educação|Saúde', 'Identifica automaticamente o tomador de decisão na empresa para seu produto/serviço. Analisa organograma e coleta contato do CFO, CTO ou decisor apropriado.', 'Médio', 40, 24000, 5000),
('Personalized Outreach Generator', 'Vendas', 'Advocacia|Contabilidade|Tecnologia|Marketing|Imobiliária|RH|Logística|Educação|Saúde|Varejo', 'Gera mensagens de contato inicial altamente personalizadas para cada lead conforme empresa, cargo, setor e contexto. Evita parecer automática.', 'Médio', 120, 72000, 7000),
('Multi-Channel Outreach Sequence Manager', 'Vendas', 'Advocacia|Contabilidade|Tecnologia|Marketing|Imobiliária|RH|Logística|Educação|Saúde|Varejo', 'Automatiza sequências de contatos em múltiplos canais: email dia 1, LinkedIn dia 2, WhatsApp dia 4, email dia 7. Personaliza cada contato e não cai em spam.', 'Médio', 90, 54000, 8000),
('Sales Arguments & Objection Handler', 'Vendas', 'Advocacia|Contabilidade|Tecnologia|Marketing|Imobiliária|RH|Logística|Educação|Saúde|Varejo', 'Responde automaticamente às objeções mais comuns (preço, timing, concorrência) com argumentação pronta. Quando lead responde com objeção, agente já responde com contra-argumentação.', 'Médio', 60, 36000, 5000),
('Lead Activity Monitor & Conversion Predictor', 'Vendas', 'Advocacia|Contabilidade|Tecnologia|Marketing|Imobiliária|RH|Logística|Educação|Saúde', 'Monitora comportamento do lead em tempo real (abriu email, visitou site, clicou em link) e alerta vendedor quando há sinais de interesse. Prediz probabilidade de conversão baseado em padrões.', 'Complexo', 90, 54000, 10000),
('Relationship Manager AI', 'Vendas', 'Todos', 'Registra automaticamente cada interação com lead: quando você ligou, o que conversou, qual foi outcome. Tudo sem digitação manual, agente extrai informações de emails/calls.', 'Fácil', 40, 24000, 4000),
('Content Matcher for Leads', 'Vendas', 'Advocacia|Contabilidade|Tecnologia|Marketing|Imobiliária|RH|Logística|Educação|Saúde', 'Identifica qual conteúdo (case study, webinar, whitepaper) enviar para cada lead conforme seu setor, cargo e estágio do funil. Move venda automaticamente.', 'Médio', 50, 30000, 6000),
('Lead Nurturing & Re-engagement Automator', 'Vendas', 'Advocacia|Contabilidade|Tecnologia|Marketing|Imobiliária|RH|Logística|Educação|Saúde|Varejo', 'Envia follow-ups em momento certo conforme comportamento do lead. Se não respondeu em 3 dias, lembra. Se respondeu positivo, acelera. Se rejeitou, propõe oferta diferente.', 'Médio', 100, 60000, 8000),
('Smart Proposal & Price Optimizer', 'Vendas', 'Advocacia|Contabilidade|Tecnologia|Marketing|Imobiliária|Logística|RH|Educação|Saúde', 'Gera proposta comercial customizada baseado em requisitos do cliente. Analisa histórico de negociações e sugere preço/desconto ideal que fecha venda sem comprometer margem.', 'Complexo', 80, 48000, 10000),
('Smart Demo Scheduler', 'Vendas', 'Todos', 'Quando lead aprova demo, agente oferece horários disponíveis, agenda no calendário de ambos, envia confirmação automática. Elimina ping-pong de emails.', 'Fácil', 50, 30000, 4000),
('Demo Prep Assistant', 'Vendas', 'Todos', 'Antes da demo, agente compila: contexto do lead, seu negócio, dores principais, argumentação customizada e possíveis objeções. Prepara vendedor em minutos.', 'Médio', 30, 18000, 3000),
('Sales Pipeline Analyzer & Conversion Predictor', 'Vendas', 'Todos', 'Acompanha pipeline em tempo real por estágio, prediz quem vai converter, identifica leads travados. Alerta sobre gargalos no funil.', 'Complexo', 80, 48000, 9000),
('Upsell/Cross-Sell Opportunity Finder', 'Vendas', 'SaaS|Varejo|Telecomunicações|Saúde|Educação', 'Analisa clientes atuais e sugere quem está pronto para upgrade (upsell) ou produto complementar (cross-sell). Identifica automaticamente a melhor oferta para cada cliente.', 'Médio', 40, 24000, 6000),
('Sales Cycle Optimizer', 'Vendas', 'Todos', 'Identifica gargalos em cada estágio do funil (prospecção, qualificação, proposta, fechamento) e sugere ações para acelerar conversão.', 'Médio', 60, 36000, 7000),
('Sales Rep Performance Analyzer', 'Vendas', 'Todos', 'Compara métricas de todos os vendedores: conversão, ciclo de venda, ticket médio. Identifica top performers e quem precisa de treinamento específico.', 'Médio', 40, 24000, 5000),
('Sales Compliance Auditor', 'Vendas', 'Todos', 'Revisa emails/calls de vendedores validando se seguem script, coletam dados necessários e mantêm qualidade. Garante consistência do processo.', 'Médio', 50, 30000, 6000),
('Sales Report Generator', 'Vendas', 'Todos', 'Gera relatórios de vendas diários/semanais/mensais automaticamente. Compila leads gerados, conversões, faturamento, taxa de conversão e tendências.', 'Fácil', 50, 30000, 4000),
('Disqualified Lead Manager', 'Vendas', 'Todos', 'Acompanha leads desqualificados e revisita em momento apropriado. Lead que disse não agora é revisitado em 3-6 meses conforme predição de timing ideal.', 'Fácil', 30, 18000, 3000),

-- MARKETING
('Copywriting Generator for Multiple Channels', 'Marketing', 'Marketing|Varejo|Tecnologia|Saúde|Educação|Imobiliária|RH|Contabilidade', 'Gera copy otimizado para múltiplos canais: posts em redes sociais, captions para anúncios pagos (Google/Meta/LinkedIn) e copy para landing pages. Adapta tom e estrutura por canal.', 'Médio', 90, 54000, 6000),
('Long-form Content Generator', 'Marketing', 'Marketing|Tecnologia|Educação|Saúde|Varejo|Imobiliária|RH|Contabilidade|Advocacia', 'Gera artigos estruturados, case studies e depoimentos otimizados para SEO. Recebe tema e cria conteúdo pronto para publicar com storytelling incorporado.', 'Complexo', 100, 60000, 8000),
('Video Script Generator', 'Marketing', 'Marketing|Educação|Tecnologia|Saúde|Varejo|RH', 'Gera roteiros estruturados para vídeos (YouTube, TikTok, Reels, webinars). Recebe tema/objetivo e cria script com hook, desenvolvimento e CTA pronto para gravação.', 'Médio', 60, 36000, 5000),
('Email Newsletter Generator', 'Marketing', 'Marketing|Tecnologia|Educação|Saúde|Varejo|RH|Contabilidade', 'Compila conteúdo produzido em formato newsletter semanal/mensal. Cria subject line de alto open rate e estrutura visual.', 'Fácil', 50, 30000, 3000),
('AI Design Studio', 'Marketing', 'Marketing|Varejo|Tecnologia|Saúde|Educação|Imobiliária|RH', 'Gera ideias de design, paleta de cores e layouts para posts/banners. Cria múltiplas variações de designs para A/B testing e thumbnails para YouTube com psicologia visual.', 'Médio', 70, 42000, 7000),
('Product Description Generator', 'Marketing', 'Varejo|E-commerce|Moda|Alimentação', 'Gera descrições de produtos para e-commerce/marketplace otimizadas para venda. Recebe características do produto e cria descrição persuasiva com benefícios.', 'Fácil', 40, 24000, 3000),
('FAQ & Help Articles Generator', 'Marketing', 'Tecnologia|Saúde|Educação|SaaS|Varejo|Imobiliária', 'Gera FAQs e artigos de ajuda baseado em produto/serviço. Analisa produto e gera lista de perguntas frequentes com respostas estruturadas.', 'Fácil', 30, 18000, 2000),
('Content Calendar Planner', 'Marketing', 'Marketing|Tecnologia|Educação|Varejo|RH', 'Cria calendário editorial mensal/trimestral automaticamente com datas, temas, canais. Planeja estratégia de conteúdo em minutos.', 'Fácil', 40, 24000, 3000),
('Content Repurposing Manager', 'Marketing', 'Marketing|Tecnologia|Saúde|Educação|Varejo', 'Converte um conteúdo em múltiplos formatos: blog para post social, vídeo, infográfico, email. Maximiza ROI de cada peça criada.', 'Médio', 80, 48000, 6000),
('Content Asset Organizer', 'Marketing', 'Marketing|Educação|Tecnologia|Saúde', 'Categoriza automaticamente biblioteca de conteúdo: posts, vídeos, imagens, documentos por tema/formato/data. Facilita reutilização.', 'Fácil', 40, 24000, 2000),
('Content Adaptation & Variation Generator', 'Marketing', 'Marketing|Tecnologia|Saúde|Educação|Varejo', 'Adapta mesmo conteúdo para diferentes públicos/segmentos. Traduz e localiza para múltiplos idiomas/regiões com adaptação cultural.', 'Complexo', 100, 60000, 9000),
('Content Optimization & Audit Engine', 'Marketing', 'Marketing|Tecnologia|Saúde|Educação|Varejo|Imobiliária', 'Otimiza conteúdo existente para SEO, sugere temas de alto impacto e identifica conteúdo desatualizado. Recomenda updates e melhoria contínua.', 'Médio', 80, 48000, 8000),
('Vertical-Specific Content Generator', 'Marketing', 'Educação|Saúde|Advocacia|Imobiliária', 'Gera conteúdo especializado por setor: material educacional, conteúdo médico, artigos jurídicos, guides imobiliários. Templates customizados por vertical.', 'Complexo', 110, 66000, 10000),
('Interactive Quiz & Survey Generator', 'Marketing', 'Marketing|Educação|Varejo|Saúde', 'Cria quizzes educacionais, enquetes de opinião e testes de personalidade. Gera automaticamente com opções de compartilhamento em redes.', 'Médio', 40, 24000, 4000),
('Webinar Content Generator', 'Marketing', 'Educação|Marketing|Tecnologia|RH|Saúde', 'Gera estrutura completa de webinar: slides estruturados, script do apresentador, atividades interativas. Reduz tempo de preparação de seminários online.', 'Médio', 90, 54000, 7000),
('Content Production Manager', 'Marketing', 'Marketing|Tecnologia|Educação', 'Centraliza acompanhamento de conteúdo em produção: quem está criando o quê, quando fica pronto, quando publica. Garante prazos e fluxo.', 'Fácil', 40, 24000, 3000),
('Content Trend Analyzer', 'Marketing', 'Marketing|Tecnologia|Varejo|Saúde', 'Monitora trending topics e redes sociais em tempo real. Identifica oportunidades de conteúdo viral e sugere criação oportuna.', 'Médio', 50, 30000, 5000),
('Content Quality Auditor', 'Marketing', 'Marketing|Educação|Tecnologia', 'Revisa qualidade de conteúdo: erros gramaticais, tom de voz, alinhamento com brand guidelines, CTA efetivo. Garante padrão antes de publicação.', 'Médio', 60, 36000, 4000),
('Content ROI Report Generator', 'Marketing', 'Marketing|Tecnologia|Saúde|Educação', 'Gera relatórios de desempenho de conteúdo com ROI. Compila dados de views, leads, conversões e calcula retorno de cada peça.', 'Fácil', 40, 24000, 3000),
('Infographic Generator', 'Marketing', 'Marketing|Tecnologia|Saúde|Educação|Varejo', 'Transforma dados e informações em infográficos visuais estruturados. Recebe dados e cria visual profissional pronto para publicar.', 'Médio', 60, 36000, 6000),
('Video Subtitle Generator', 'Marketing', 'Marketing|Educação|Tecnologia|Saúde|Varejo', 'Gera legendas automáticas sincronizadas para vídeos em múltiplos idiomas (PT, EN, ES). Elimina legendação manual e amplia alcance do conteúdo.', 'Fácil', 40, 24000, 3000),

-- DOCUMENTOS
('Document Processor Bot', 'Documentos', 'Advocacia|Contabilidade|Financeiro|Logística|Imobiliária|Construção Civil|RH', 'Lê, classifica e extrai dados de documentos (contratos, notas, recibos, petições). Extrai cláusulas, valores, datas automaticamente.', 'Complexo', 140, 84000, 12000),
('Task Manager Bot', 'Documentos', 'Todos', 'Monitora projetos/processos e automaticamente cria tasks, atribui a pessoas certas, envia lembretes e acompanha progresso.', 'Fácil', 40, 24000, 3000),
('Content Quality Reviewer', 'Documentos', 'Advocacia|Contabilidade|Educação|Marketing|Imobiliária|RH|Saúde', 'Revisa textos, contratos, emails, relatórios para erros, formatação, conformidade. Sugere correções automaticamente.', 'Médio', 60, 36000, 4000),
('Internal Comms Scheduler', 'Documentos', 'Todos', 'Agenda e envia comunicações internas (reuniões, briefings, atualizações) automaticamente em horários otimizados.', 'Fácil', 30, 18000, 2000),
('Auto Report Generator', 'Documentos', 'Contabilidade|Financeiro|Logística|RH|Saúde|Educação|Tecnologia', 'Coleta dados de múltiplas fontes, compila e gera relatórios periódicos (diários, semanais, mensais) sem intervenção manual.', 'Médio', 80, 48000, 7000),
('Real-time Data Analyzer', 'Documentos', 'Varejo|Logística|Tecnologia|Financeiro|Contabilidade|RH|Saúde|Construção Civil', 'Monitora métricas em tempo real e alerta sobre anomalias. Acompanha KPIs 24/7 e sugere ações quando há desvios.', 'Complexo', 90, 54000, 10000),
('Trend Predictor AI', 'Documentos', 'Varejo|Logística|Construção Civil|Financeiro|Imobiliária|RH|Educação', 'Prediz demanda, comportamento de clientes e tendências de mercado baseado em dados históricos. Antecipa cenários futuros.', 'Complexo', 100, 60000, 11000),
('Business Insights Generator', 'Documentos', 'Todos', 'Analisa dados operacionais e sugere oportunidades de melhoria, redução de custos e aumento de receita. Gera insights estratégicos acionáveis a partir de dados brutos.', 'Médio', 80, 48000, 7000),

-- FINANCEIRO
('Automated Collections Manager', 'Financeiro', 'Contabilidade|Financeiro|Varejo|Logística|Serviços B2B', 'Monitora contas a receber em tempo real, envia cobranças automáticas progressivas (15, 30, 60 dias), registra atrasos. Reduz inadimplência.', 'Fácil', 90, 54000, 5000),
('Cash Flow Optimizer', 'Financeiro', 'Contabilidade|Financeiro|Tecnologia|Varejo|Logística', 'Prediz fluxo de caixa futuro analisando padrões de entrada/saída. Sugere otimizações de pagamentos, antecipação de recebimentos.', 'Médio', 60, 36000, 7000),
('Budget & Quote Generator', 'Financeiro', 'Construção Civil|Logística|Marketing|Tecnologia|Serviços B2B', 'Gera orçamentos/cotações automaticamente conforme requisitos do cliente. Recebe especificações e gera proposta precificada pronta para envio.', 'Médio', 50, 30000, 4000),
('Expense Monitor & Cost Optimizer', 'Financeiro', 'Todos', 'Categoriza despesas automaticamente, identifica desperdício e sugere renegociação com fornecedores. Reduz custos operacionais.', 'Médio', 80, 48000, 6000),

-- RH
('Automated Interviewer Bot', 'RH', 'Todos', 'Faz entrevistas iniciais de candidatos automaticamente via chatbot, avalia respostas conforme critérios e qualifica candidatos.', 'Médio', 100, 60000, 8000),
('Onboarding Content Creator', 'RH', 'Todos', 'Gera materiais de integração para novo funcionário: guias, checklists, vídeos de treinamento. Automatiza onboarding.', 'Fácil', 40, 24000, 3000),
('Performance Management AI', 'RH', 'Todos', 'Acompanha performance de funcionários, gera avaliações estruturadas e sugere feedbacks baseado em dados coletados.', 'Médio', 60, 36000, 5000),
('Payroll Automation Bot', 'RH', 'Todos', 'Processa folha de pagamento automaticamente: cálculos de salários, descontos, impostos (INSS, FGTS, IRRF) e gera contracheques sem erro humano.', 'Médio', 60, 36000, 5000),
('HR Benefits Manager', 'RH', 'Todos', 'Gestão de benefícios e documentos trabalhistas. Coleta e organiza documentos, acompanha renovações de benefícios e envia notificações de vencimentos automaticamente.', 'Fácil', 40, 24000, 3000),

-- GESTÃO
('Process Management & Documentation AI', 'Gestão', 'Todos', 'Monitora execução de processos, alerta sobre desvios e documenta automaticamente conforme execução. Gera fluxogramas e passo-a-passos.', 'Médio', 80, 48000, 7000),
('Automation Opportunity Finder', 'Gestão', 'Todos', 'Analisa processos operacionais e identifica quais tarefas podem ser automatizadas com IA ou robótica. Sugere priorização por impacto.', 'Médio', 60, 36000, 6000),
('Workplace Climate Monitor', 'Gestão', 'Todos', 'Envia pesquisas discretas regularmente, analisa respostas sobre clima organizacional. Alerta liderança sobre riscos de burnout ou turnover.', 'Fácil', 40, 24000, 3000),
('Internal Communications & Engagement Manager', 'Gestão', 'Todos', 'Gera conteúdo para engajamento de equipe, distribui conforme preferência de canal, acompanha taxa de leitura e engajamento.', 'Médio', 50, 30000, 4000),
('Supplier Management & Negotiation AI', 'Gestão', 'Todos', 'Centraliza contratos com fornecedores, monitora vencimentos, sugere renegociação antes do término. Analisa ofertas e negocia melhores preços/condições.', 'Médio', 70, 42000, 6000),

-- CONFORMIDADE
('Compliance Monitor Bot', 'Conformidade', 'Advocacia|Financeiro|Contabilidade|Saúde|Educação', 'Monitora conformidade legal e regulatória, alerta sobre novas leis aplicáveis à empresa. Reduz risco de multas.', 'Médio', 60, 36000, 6000),
('Privacy & LGPD Manager', 'Conformidade', 'Todos', 'Monitora como dados de clientes são coletados/armazenados, verifica aderência LGPD. Alerta sobre riscos de multa por privacidade.', 'Médio', 70, 42000, 7000),
('Fraud & Risk Analyzer', 'Conformidade', 'Financeiro|Contabilidade|Varejo|Tecnologia', 'Analisa padrão normal de operações e flagra desvios (transações estranhas, acessos inusitados). Identifica fraude e risco operacional.', 'Complexo', 100, 60000, 9000),

-- QUALIDADE / INOVAÇÃO / ESTRATÉGIA
('Automated Quality Assurance & Monitoring', 'Qualidade', 'Tecnologia|SaaS|Manufatura', 'Executa testes automatizados de qualidade (funcional, regressão, performance) e monitora em produção. Identifica bugs e relata issues.', 'Complexo', 140, 84000, 12000),
('Product Innovation & Feedback Engine', 'Inovação', 'Tecnologia|SaaS|Varejo|Educação', 'Gera ideias de novos produtos analisando feedback de clientes e tendências. Compila feedback de múltiplas fontes em insights acionáveis.', 'Médio', 80, 48000, 7000),
('Strategic Management Suite', 'Estratégia', 'Todos', 'Suite com 3 módulos: análise competitiva (monitora concorrentes), planejamento estratégico (gera planos baseado em dados) e KPI monitoring (acompanha métricas-chave em tempo real).', 'Complexo', 120, 72000, 14000),

-- PÓS-VENDA
('Customer Health & Retention Manager', 'Pós-venda', 'SaaS|Tecnologia|Educação Online|Saúde Digital|Serviços Recorrentes', 'Monitora saúde do cliente via NPS, uso do produto, tickets de suporte. Prevê churn, sugere retenção e acompanha contratos próximos do vencimento.', 'Complexo', 100, 60000, 10000),
('Personalized Offer Generator for Customers', 'Pós-venda', 'SaaS|Varejo|Telecomunicações|Saúde|Educação', 'Analisa como cliente usa serviço e sugere upgrade (upsell), add-ons ou produtos complementares. Aumenta receita por cliente.', 'Médio', 60, 36000, 6000),

-- SAÚDE
('Medical Scheduler AI', 'Saúde', 'Saúde|Clínicas|Consultórios', 'Recebe solicitações de agendamento via WhatsApp/email, verifica disponibilidade do médico, agenda consulta, envia confirmação e lembretes automáticos ao paciente.', 'Médio', 80, 48000, 6000),
('Medical Triage Bot', 'Saúde', 'Saúde|Clínicas|Consultórios|Hospitais', 'Coleta sintomas do paciente via chatbot e classifica em urgente/rotina/encaminhamento. Reduz tempo de espera e direciona para atendimento apropriado.', 'Complexo', 60, 36000, 8000),
('EHR Generator Bot', 'Saúde', 'Saúde|Clínicas|Consultórios|Hospitais', 'Transcreve consultas em áudio/texto e gera prontuários eletrônicos estruturados automaticamente. Popula campos do prontuário sem digitação manual do médico.', 'Complexo', 80, 48000, 10000),
('Patient History Monitor', 'Saúde', 'Saúde|Clínicas|Hospitais', 'Monitora prontuários de pacientes e alerta médicos sobre riscos: medicações duplicadas, interações medicamentosas, check-ups pendentes e follow-ups atrasados.', 'Complexo', 50, 30000, 8000),

-- EDUCAÇÃO
('AI Tutor Bot', 'Educação', 'Educação|Cursos Online|Escolas|Universidades', 'Atende dúvidas de alunos 24/7, explica conceitos em diferentes níveis de complexidade e gera listas de exercícios personalizados conforme nível do estudante.', 'Complexo', 120, 72000, 10000),
('Auto Grader Bot', 'Educação', 'Educação|Cursos Online|Escolas|Universidades', 'Corrige provas, exercícios e atividades automaticamente com critérios predefinidos. Gera notas, feedback personalizado e relatório de desempenho por aluno.', 'Médio', 80, 48000, 7000),
('Lesson Plan Generator', 'Educação', 'Educação|Cursos Online|Escolas|Universidades', 'Recebe informações da disciplina e gera plano completo de aula com objetivos, atividades, avaliações, slides e materiais de apoio prontos para uso.', 'Médio', 60, 36000, 5000),
('Academic Record Manager', 'Educação', 'Educação|Escolas|Universidades', 'Centraliza notas e faltas de múltiplas fontes, gera relatórios de desempenho e alerta automaticamente sobre alunos com baixo rendimento ou risco de reprovação.', 'Fácil', 40, 24000, 3000),

-- VAREJO
('Shopping Assistant Bot', 'Varejo', 'Varejo|E-commerce|Moda|Alimentação', 'Chatbot que interage com cliente na loja virtual, sugere produtos conforme histórico e preferências, responde perguntas sobre itens e ajuda na decisão de compra.', 'Médio', 80, 48000, 7000),
('Inventory Manager AI', 'Varejo', 'Varejo|E-commerce|Logística|Distribuição', 'Acompanha níveis de estoque em múltiplas localidades em tempo real. Previne rupturas e sobrestoque, sugere reposição automática baseado em padrão de vendas.', 'Complexo', 60, 36000, 9000),
('Return Processor Bot', 'Varejo', 'Varejo|E-commerce|Moda', 'Automatiza fluxo completo de devolução: recebe solicitação do cliente, valida política, gera etiqueta de envio, rastreia retorno e processa reembolso automaticamente.', 'Médio', 50, 30000, 5000),
('Cart Recovery Bot', 'Varejo', 'Varejo|E-commerce|Moda|Alimentação', 'Monitora carrinhos abandonados e envia sequências de lembretes com ofertas personalizadas via email/WhatsApp. Recupera vendas perdidas automaticamente.', 'Médio', 40, 24000, 5000),

-- ADVOCACIA
('Legal Research AI', 'Advocacia', 'Advocacia|Jurídico|Escritórios', 'Recebe descrição do caso e busca automaticamente jurisprudências, legislação e precedentes aplicáveis. Compila resultados em relatório estruturado para o advogado.', 'Complexo', 100, 60000, 12000),
('Legal Document Generator', 'Advocacia', 'Advocacia|Jurídico|Escritórios', 'Recebe fatos do caso e gera peças jurídicas estruturadas (petições, contestações, recursos) prontas para revisão e assinatura. Reduz 60% do tempo de redação.', 'Complexo', 80, 48000, 10000),
('Deadline Manager Bot', 'Advocacia', 'Advocacia|Jurídico|Escritórios', 'Monitora todos os prazos processuais de todos os casos e envia alertas progressivos (30, 7, 3, 1 dia antes). Elimina perda de prazos por esquecimento.', 'Médio', 60, 36000, 5000),
('Legal Advisor Chatbot', 'Advocacia', 'Advocacia|Jurídico|Escritórios', 'Chatbot que atende clientes com dúvidas jurídicas básicas, coleta informações iniciais do caso, orienta sobre procedimentos e agenda consulta com advogado.', 'Médio', 50, 30000, 6000),

-- CONTABILIDADE
('Invoice Processor Bot', 'Contabilidade', 'Contabilidade|Financeiro|Varejo|Logística', 'Recebe NF-e ou imagem de nota fiscal, extrai automaticamente CNPJ, valores, itens, impostos e lança no sistema contábil. Elimina digitação manual de notas.', 'Complexo', 120, 72000, 10000),
('Bank Reconciliation Bot', 'Contabilidade', 'Contabilidade|Financeiro|Tecnologia|Varejo', 'Baixa automaticamente extratos de múltiplos bancos, casa com lançamentos contábeis e aponta diferenças. Elimina reconciliação manual de contas.', 'Médio', 60, 36000, 6000),
('Tax Report Generator', 'Contabilidade', 'Contabilidade|Financeiro|Tecnologia|Varejo', 'Compila dados contábeis e gera automaticamente declarações fiscais (ECF, ECD, LALUR) e apurações de impostos conforme normas SPED.', 'Complexo', 80, 48000, 8000),
('Financial Compliance Auditor', 'Contabilidade', 'Contabilidade|Financeiro|Varejo', 'Monitora transações em tempo real, valida contra regras de compliance e alerta sobre irregularidades. Garante auditoria contínua automática.', 'Complexo', 100, 60000, 9000),

-- IMOBILIÁRIA
('Real Estate Virtual Assistant', 'Imobiliária', 'Imobiliária', 'Chatbot que atende interessados 24/7, responde perguntas sobre características do imóvel (metragem, preço, localização), agenda visitas e envia documentação.', 'Médio', 80, 48000, 7000),
('Property Profile Generator', 'Imobiliária', 'Imobiliária', 'Recebe fotos e dados do imóvel e gera automaticamente ficha técnica completa com descrição comercial otimizada para venda e tratamento de imagens.', 'Médio', 40, 24000, 4000),
('Property Valuation AI', 'Imobiliária', 'Imobiliária', 'Analisa dados de propriedades similares na região (metragem, localização, acabamento) e sugere preço de mercado competitivo para o imóvel.', 'Complexo', 30, 18000, 8000),
('Real Estate Doc Manager', 'Imobiliária', 'Imobiliária', 'Automatiza geração de contratos de compra/venda/locação com dados do cliente e imóvel. Organiza toda documentação por transação.', 'Médio', 50, 30000, 5000),

-- LOGÍSTICA
('Route Optimizer AI', 'Logística', 'Logística|Transporte|Delivery|E-commerce', 'Recebe lista de entregas e calcula sequência otimizada considerando localização, horários, restrições de trânsito. Reduz km rodados e consumo de combustível.', 'Complexo', 60, 36000, 10000),
('Delivery Tracker Bot', 'Logística', 'Logística|Transporte|Delivery|E-commerce', 'Acompanha posição de veículos via GPS em tempo real, alerta sobre desvios de rota e atrasos potenciais. Notifica clientes automaticamente sobre status da entrega.', 'Médio', 50, 30000, 6000),
('Fleet Manager AI', 'Logística', 'Logística|Transporte', 'Monitora cada veículo da frota: km rodado, horas de serviço, consumo. Alerta quando está na hora de manutenção preventiva, reduzindo manutenção emergencial.', 'Médio', 40, 24000, 5000),
('Manifest Processor Bot', 'Logística', 'Logística|Transporte|Armazém', 'Automatiza entrada e saída de carga no sistema: gera manifesto de transporte, registra recebimentos e despachos sem digitação manual.', 'Médio', 60, 36000, 5000),

-- CONSTRUÇÃO CIVIL
('Construction Supply Manager', 'Construção Civil', 'Construção Civil', 'Controla entrada e saída de materiais em obra em tempo real. Alerta quando material está acabando e previne atrasos por falta de suprimento.', 'Médio', 60, 36000, 6000),
('Project Timeline AI', 'Construção Civil', 'Construção Civil', 'Cria cronograma de obra automaticamente (Gantt), acompanha progresso real vs planejado e alerta sobre desvios que podem causar atraso na entrega.', 'Complexo', 80, 48000, 9000),
('Safety Manager Bot', 'Construção Civil', 'Construção Civil', 'Monitora conformidade de segurança na obra: checklists de EPIs, normas NR, inspeções automáticas. Gera apontamentos e reduz acidentes e multas.', 'Médio', 50, 30000, 5000),
('Construction Billing Bot', 'Construção Civil', 'Construção Civil', 'Recebe dados de progresso da obra (fotos, medições) e gera automaticamente RRC (relatório de medição) e faturas baseadas no avanço físico.', 'Médio', 40, 24000, 4000),

-- TECNOLOGIA / SAAS
('Code Review AI', 'Tecnologia', 'Tecnologia|SaaS|Software', 'Analisa commits e pull requests automaticamente: identifica bugs, anti-patterns, vulnerabilidades de segurança e sugere otimizações de código.', 'Complexo', 100, 60000, 10000),
('API Documentation Bot', 'Tecnologia', 'Tecnologia|SaaS|Software', 'Analisa código-fonte da API e gera documentação estruturada automaticamente com endpoints, parâmetros, exemplos de uso e respostas esperadas.', 'Médio', 40, 24000, 4000),
('Release Manager Bot', 'Tecnologia', 'Tecnologia|SaaS|Software', 'Gerencia pipeline de CI/CD: automatiza deploy em staging/produção com validações, executa rollback em caso de erro e documenta cada release.', 'Complexo', 60, 36000, 8000);
