-- ════════════════════════════════════════════════════════════════
-- Canal CMS — Seed Data: ness. (dados de teste para o site)
-- Roda sobre o schema v3 (tabela entries com tenant_id)
-- ════════════════════════════════════════════════════════════════

-- Primeiro, buscar os collection_ids
-- (Assumindo que seed-collections já rodou e as collections existem)

-- ── BRANDBOOK: Cores Corporativas ───────────────────────────────

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'bb-cor-001', NULL,
  c.id, 'azul-ness-primario', 'pt', 'published',
  json('{"title":"Azul Ness Primary","category":"cor","brand":"ness","hex_value":"#0A84FF","desc":"Cor primária institucional. Usada em CTAs, links e elementos de destaque.","usage_notes":"Usar sobre fundo escuro para máximo contraste. Nunca aplicar sobre fundos claros sem contorno."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'brandbook';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'bb-cor-002', NULL,
  c.id, 'cinza-surface', 'pt', 'published',
  json('{"title":"Surface Dark","category":"cor","brand":"ness","hex_value":"#1A1A2E","desc":"Cor de fundo principal do site e dashboard. Base do dark mode.","usage_notes":"Aplicar como background principal. Evitar texto longo diretamente sobre — usar surface-2 (#242442) para cards."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'brandbook';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'bb-cor-003', NULL,
  c.id, 'accent-cyan', 'pt', 'published',
  json('{"title":"Accent Cyan","category":"cor","brand":"ness","hex_value":"#00D4AA","desc":"Cor de acento para badges, indicadores de sucesso e highlights.","usage_notes":"Usar com parcimônia — máximo 10% da superfície visual."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'brandbook';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'bb-cor-004', NULL,
  c.id, 'vermelho-alerta', 'pt', 'published',
  json('{"title":"Alert Red","category":"cor","brand":"ness","hex_value":"#FF453A","desc":"Cor de alerta e ações destrutivas (deletar, erro, aviso crítico).","usage_notes":"Exclusivo para estados de erro e danger zones. Nunca usar decorativamente."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'brandbook';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'bb-cor-005', NULL,
  c.id, 'branco-texto', 'pt', 'published',
  json('{"title":"Text White","category":"cor","brand":"ness","hex_value":"#F0F0F5","desc":"Cor principal de texto sobre fundos escuros.","usage_notes":"Usar para headings e body text. Para texto secundário, usar #A0A0B8."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'brandbook';

-- ── BRANDBOOK: Tipografia ───────────────────────────────────────

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'bb-tipo-001', NULL,
  c.id, 'inter-sans', 'pt', 'published',
  json('{"title":"Inter","category":"tipografia","brand":"ness","desc":"Fonte principal para UI, dashboards e interfaces administrativas. Pesos: 400, 500, 600, 700. Excelente legibilidade em telas.","usage_notes":"Usar em todo o admin panel, formulários e tabelas. Sempre com font-feature-settings: cv02, cv03, cv04 para diferenciação de caracteres."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'brandbook';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'bb-tipo-002', NULL,
  c.id, 'jetbrains-mono', 'pt', 'published',
  json('{"title":"JetBrains Mono","category":"tipografia","brand":"ness","desc":"Fonte monospace para código, IDs, hashes e dados técnicos. Pesos: 400, 700.","usage_notes":"Usar exclusivamente para: IDs de entry, hashes, code blocks, logs e outputs de terminal."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'brandbook';

-- ── BRANDBOOK: Logos ────────────────────────────────────────────

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'bb-logo-001', NULL,
  c.id, 'ness-logo-dark', 'pt', 'published',
  json('{"title":"ness. Logo Dark","category":"logo","brand":"ness","desc":"Logo principal da ness. para fundo escuro. Formato SVG.","usage_notes":"Usar sobre fundos #1A1A2E ou mais escuros. Mínimo 120px de largura. Sempre com o ponto final."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'brandbook';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'bb-logo-002', NULL,
  c.id, 'ness-logo', 'pt', 'published',
  json('{"title":"ness. Shield","category":"logo","brand":"ness","desc":"Logo da vertical ness. (cibersegurança e privacidade). Ícone de escudo com shield gradient.","usage_notes":"Usar apenas em contextos de segurança, LGPD, SOC e compliance. Nunca misturar com logo ness. no mesmo espaço."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'brandbook';

-- ── SIGNATURES: Equipe ness. ────────────────────────────────────

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'sig-001', NULL,
  c.id, 'ricardo-esperanca', 'pt', 'published',
  json('{"name":"Ricardo Esperança","role":"CEO & Founder","email":"resper@bekaa.eu","phone":"+351 912 345 678","brand":"ness","department":"Diretoria","linkedin":"https://linkedin.com/in/ricardoesperanca"}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'signatures';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'sig-002', NULL,
  c.id, 'ana-silva', 'pt', 'published',
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'signatures';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'sig-003', NULL,
  c.id, 'marcos-oliveira', 'pt', 'published',
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'signatures';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'sig-004', NULL,
  c.id, 'carla-mendes', 'pt', 'published',
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'signatures';

-- ── INSIGHTS: Conteúdo editorial ────────────────────────────────

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'ins-v3-001', NULL,
  c.id, 'ia-generativa-empresas-2026', 'pt', 'published',
  json('{"title":"IA Generativa nas Empresas: O Que Mudou em 2026","tag":"IA","icon":"Brain","date":"2026-04-10","desc":"A adoção de IA generativa saltou de projetos piloto para operações críticas. Analisamos como empresas brasileiras estão integrando LLMs em processos de atendimento, operações e tomada de decisão.","featured":true,"body":"## A Revolução Silenciosa\n\nEm 2026, a IA generativa não é mais novidade — é infraestrutura. Empresas que há dois anos experimentavam chatbots agora operam pipelines completos de automação cognitiva.\n\n### Principais Tendências\n\n1. **RAG Corporativo** — Retrieval-Augmented Generation sobre bases de conhecimento proprietárias\n2. **Agentes MCP** — Model Context Protocol permite que LLMs acessem ferramentas empresariais\n3. **IA on Edge** — Modelos rodando em Workers/CDN para latência sub-100ms\n\n### O Papel da ness.\n\nComo integradora, a ness. implementa pipelines RAG sobre Cloudflare Workers AI, permitindo que empresas mantenham seus dados on-premise enquanto usam modelos de última geração."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'insights';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'ins-v3-002', NULL,
  c.id, 'zero-trust-alem-do-perimetro', 'pt', 'published',
  json('{"title":"Zero Trust: Além do Perímetro em 2026","tag":"Segurança","icon":"Shield","date":"2026-03-22","desc":"O modelo Zero Trust evoluiu de buzzword para padrão regulatório. Como implementar ZTNA em ambientes híbridos sem quebrar a produtividade.","featured":true,"body":"## O Fim do Perímetro\n\nA arquitetura tradicional de firewall + VPN não funciona mais. Com 73% dos colaboradores em regime híbrido, cada dispositivo é um potencial vetor de ataque.\n\n### Pilares do Zero Trust Moderno\n\n- **Identity-first:** Cada request é autenticada. Sem exceções.\n- **Least Privilege:** Acesso mínimo necessário, revogável em tempo real.\n- **Continuous Verification:** Postura do dispositivo reavaliada a cada sessão.\n\n### Stack Recomendada\n\n| Camada | Tecnologia | Função |\n|--------|-----------|--------|\n| Identity | Cloudflare Access | ZTNA + SSO |\n| Network | Cloudflare Tunnel | Replace VPN |\n| Endpoint | CrowdStrike | EDR/XDR |\n| Monitoring | ness. SIEM | Correlation |"}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'insights';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'ins-v3-003', NULL,
  c.id, 'lgpd-multas-2026-cenario', 'pt', 'published',
  json('{"title":"LGPD em 2026: Multas, Fiscalização e Como se Preparar","tag":"Compliance","icon":"FileCheck","date":"2026-04-01","desc":"A ANPD intensificou a fiscalização em 2026. Análise das multas aplicadas e um checklist prático para adequação de PMEs.","featured":false,"body":"## Panorama Regulatório\n\nA ANPD aplicou R$ 52 milhões em multas no primeiro trimestre de 2026 — um aumento de 340% em relação ao mesmo período de 2025.\n\n### Setores Mais Afetados\n\n1. Saúde (32% das autuações)\n2. Fintechs (28%)\n3. E-commerce (19%)\n4. Educação (12%)\n\n### Checklist de Adequação\n\n- [ ] Mapeamento de dados pessoais (ROPA)\n- [ ] Política de privacidade atualizada\n- [ ] DPO nomeado e registrado na ANPD\n- [ ] Procedimento de resposta a incidentes\n- [ ] Treinamento anual para colaboradores\n\n> A plataforma **ness.** da ness. automatiza o ROPA e gera relatórios DPIA em minutos, não semanas."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'insights';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'ins-v3-004', NULL,
  c.id, 'cloudflare-workers-edge-computing', 'pt', 'published',
  json('{"title":"Edge Computing com Cloudflare Workers: Guia Prático","tag":"Cloud","icon":"Cloud","date":"2026-03-15","desc":"Workers, D1, R2, Vectorize — como a ness. construiu toda sua stack SaaS na edge. Arquitetura, custos e lições aprendidas.","featured":false,"body":"## Por Que Edge?\n\nLatência importa. Cada 100ms de delay reduz conversões em 7%. Com Workers, o código roda em 300+ data centers globalmente.\n\n### Stack Canal CMS\n\n- **Runtime:** Cloudflare Workers (Hono)\n- **Database:** D1 (SQLite distribuído)\n- **Storage:** R2 (S3-compatible, zero egress)\n- **AI:** Workers AI (@cf/meta/llama-3.1-8b)\n- **Search:** Vectorize (embeddings RAG)\n\n### Custos Reais\n\nPara 100k requests/dia:\n- Workers: $5/mês\n- D1: $0 (no free tier)\n- R2: $0.015/GB armazenado\n- **Total: ~$8/mês**\n\nComparado a $45+ equivalente na AWS."}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'insights';

-- ── CASES: Projetos clientes ────────────────────────────────────

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'case-v3-001', NULL,
  c.id, 'banco-nacional-soc-24x7', 'pt', 'published',
  json('{"client":"Instituição Financeira Nacional","category":"segurança","project":"SOC 24x7 com SIEM Integrado","result":"Redução de 89% no tempo de resposta a incidentes","desc":"Implementação de Centro de Operações de Segurança com monitoramento contínuo, correlação de eventos via ness. SIEM e resposta automatizada a incidentes para uma das maiores instituições financeiras do Brasil.","stats":"89% faster response | 24/7 coverage | 15M events/day","featured":true}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'cases';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'case-v3-002', NULL,
  c.id, 'hospital-rede-lgpd', 'pt', 'published',
  json('{"client":"Rede Hospitalar","category":"compliance","project":"Adequação LGPD Completa","result":"100% de conformidade ANPD em 4 meses","desc":"Programa completo de adequação à LGPD para rede com 12 unidades hospitalares. Incluiu mapeamento de 340 processos, ROPA automatizado via ness., treinamento de 2.800 colaboradores e implementação de consent management.","stats":"340 processos mapeados | 12 unidades | 4 meses","featured":true}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'cases';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'case-v3-003', NULL,
  c.id, 'varejo-cloud-migration', 'pt', 'published',
  json('{"client":"Varejo Nacional","category":"cloud","project":"Migração Cloud-First","result":"45% de redução em custos de infraestrutura","desc":"Migração de data center on-premise para arquitetura multi-cloud (AWS + Cloudflare) para rede varejista com 200 lojas. Inclui CDN, WAF, DDoS protection e failover automático.","stats":"200 lojas | 45% cost reduction | 99.99% uptime","featured":false}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'cases';

-- ── JOBS: Vagas abertas ─────────────────────────────────────────

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'job-001', NULL,
  c.id, NULL, 'pt', 'published',
  json('{"title":"Engenheiro(a) de Segurança Sênior","vertical":"segurança","location":"São Paulo, SP (Híbrido)","type":"Full-time","desc":"Buscamos profissional sênior para liderar operações de segurança ofensiva e defensiva para nossos clientes enterprise. Atuação no SOC ness. com gestão de incidentes e threat hunting.","requirements":["5+ anos em cibersegurança","Certificação CISSP, CEH ou equivalente","Experiência com SIEM/SOAR","Conhecimento em cloud security (AWS/Azure/GCP)","Inglês avançado"]}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'jobs';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'job-002', NULL,
  c.id, NULL, 'pt', 'published',
  json('{"title":"Desenvolvedor(a) Full-Stack (Edge/Workers)","vertical":"engenharia","location":"Remoto (Brasil/Portugal)","type":"Full-time","desc":"Desenvolvimento de plataformas SaaS na edge com Cloudflare Workers, D1 e Hono. Projetos incluem Canal CMS e ness. Platform. Stack: TypeScript, React, Workers AI.","requirements":["3+ anos com TypeScript","Experiência com Cloudflare Workers ou edge computing","React/Next.js","SQL (D1/PostgreSQL)","Familiaridade com AI/LLM é diferencial"]}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'jobs';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'job-003', NULL,
  c.id, NULL, 'pt', 'published',
  json('{"title":"Consultor(a) de Privacidade e LGPD","vertical":"segurança","location":"São Paulo, SP","type":"Full-time","desc":"Consultoria em adequação LGPD para clientes enterprise. Atuação com mapeamento de dados, DPIA, ROPA e treinamentos. Uso da plataforma ness. para automação de processos de privacidade.","requirements":["Formação em Direito ou Tecnologia","Certificação DPO/CDPO","2+ anos com projetos LGPD/GDPR","Conhecimento em frameworks de privacidade (NIST, ISO 27701)","Habilidade de comunicação com C-Level"]}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'jobs';

-- ── PAGES: Páginas institucionais ───────────────────────────────

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'page-001', NULL,
  c.id, 'sobre', 'pt', 'published',
  json('{"title":"Sobre a ness.","meta_title":"Sobre a ness. | Tecnologia desde 1991","meta_description":"A ness. é uma empresa de tecnologia fundada em 1991 com mais de 34 anos de experiência em infraestrutura, segurança e cloud.","body":"## Quem Somos\n\nA **ness.** é uma empresa de tecnologia fundada em 1991, com mais de 34 anos de experiência em soluções críticas para empresas. Atuamos nas verticais de **Infraestrutura**, **Cibersegurança**, **Cloud** e **Inteligência Artificial**.\n\n## Nossas Verticais\n\n- **ness. Infrastructure** — Data center, redes, telecom\n- **ness. by ness.** — SOC, SIEM, LGPD, pentest\n- **ness. Cloud** — Multi-cloud, edge computing, serverless\n- **ness. AI** — RAG, agentes MCP, automação cognitiva\n\n## Números\n\n| Métrica | Valor |\n|---------|-------|\n| Anos de mercado | 34+ |\n| Clientes ativos | 200+ |\n| Profissionais | 150+ |\n| Uptime médio | 99.97% |"}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'pages';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, published_at, created_at, updated_at)
SELECT 
  'page-002', NULL,
  c.id, 'servicos', 'pt', 'published',
  json('{"title":"Nossos Serviços","meta_title":"Serviços | ness. Tecnologia","meta_description":"Conheça os serviços da ness.: infraestrutura, cibersegurança, cloud computing e inteligência artificial para empresas.","body":"## Serviços\n\n### 🏗️ Infraestrutura & Redes\nProjeto, implementação e gestão de infraestrutura corporativa. Data centers, redes complexas e telecomunicações.\n\n### 🛡️ Cibersegurança (ness.)\nSOC 24x7, SIEM, pentest, compliance LGPD/GDPR, resposta a incidentes e threat intelligence.\n\n### ☁️ Cloud & Edge Computing\nMigração cloud-first, multi-cloud (AWS/Azure/Cloudflare), edge computing com Workers e otimização de custos.\n\n### 🤖 Inteligência Artificial\nRAG corporativo, agentes MCP, automação de processos com LLMs, analytics preditivo e Workers AI.\n\n---\n\n> **Fale com um consultor:** [contato@ness.com.br](mailto:contato@ness.com.br)"}'),
  datetime('now'), datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'pages';

-- ── FORMS: Exemplos de submissões ───────────────────────────────

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, created_at, updated_at)
SELECT 
  'form-001', NULL,
  c.id, NULL, 'pt', 'published',
  json('{"source":"site-contato","payload":{"nome":"João Pereira","email":"joao@empresa.com.br","assunto":"Orçamento SOC","mensagem":"Gostaria de receber um orçamento para implementação de SOC 24x7 para nossa empresa. Temos 500 colaboradores e infraestrutura híbrida."}}'),
  datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'forms';

INSERT OR IGNORE INTO entries (id, tenant_id, collection_id, slug, locale, status, data, created_at, updated_at)
SELECT 
  'form-002', NULL,
  c.id, NULL, 'pt', 'published',
  json('{"source":"site-newsletter","payload":{"email":"maria@startup.io","nome":"Maria Costa","interesse":"IA e Automação"}}'),
  datetime('now'), datetime('now')
FROM collections c WHERE c.slug = 'forms';
