-- Seed de Conteúdos (Gerados por IA)
-- Popula as collections insights, cases e jobs com conteúdo realista do ecossistema Ness.

-- ===========================
-- COLLECTION REGISTRY (Garante que existem)
-- ===========================
INSERT INTO collections (id, slug, label, label_plural, icon, has_locale, has_slug, has_status, created_at) 
SELECT 'col-insights', 'insights', 'Insight', 'Insights', 'FileText', 1, 1, 1, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM collections WHERE slug = 'insights');

INSERT INTO collections (id, slug, label, label_plural, icon, has_locale, has_slug, has_status, created_at) 
SELECT 'col-cases', 'cases', 'Case', 'Cases', 'Briefcase', 1, 1, 1, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM collections WHERE slug = 'cases');

INSERT INTO collections (id, slug, label, label_plural, icon, has_locale, has_slug, has_status, created_at) 
SELECT 'col-jobs', 'jobs', 'Vaga', 'Vagas', 'Users', 1, 0, 1, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM collections WHERE slug = 'jobs');

-- ===========================
-- INSIGHTS
-- ===========================
-- Apaga os antigos primeiro
DELETE FROM entries WHERE collection_id = (SELECT id FROM collections WHERE slug = 'insights');

INSERT INTO entries (id, collection_id, data, slug, status, locale, created_at, updated_at) VALUES 
('ins-1', (SELECT id FROM collections WHERE slug = 'insights'), 
 '{"title":"Como a IA Reduziu o MTTR em 89% com o n.secops","tag":"Segurança","icon":"Shield","date":"2026-04-10","desc":"Análise profunda de como operações autônomas de segurança e orquestração preditiva transformam a contenção de ameaças zero-day antes de escalarem.","body":"# O Desafio do Tempo de Resposta\n\nNo cenário atual, responder a um incidente em horas não é suficiente. Invasores pivotam dentro das redes em minutos. Com nossa abordagem baseada no **n.secops** e Gabi.OS, nós automatizamos as camadas L1 e L2 do SOC. \n\n## Automação Preditiva\nO uso de LLMs para diagnosticar anomalias no trafego de rede reduz o tempo humano necessário para compreender o escopo de uma intrusão. O tempo médio de resposta (MTTR) cai em até 89% em implantações de governança rígida.","featured":true,"published":true}', 
 'ia-e-nsecops-mttr', 'published', 'pt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('ins-2', (SELECT id FROM collections WHERE slug = 'insights'), 
 '{"title":"Cloud Híbrida: O Papel do n.infraops na Alta Disponibilidade","tag":"Cloud","icon":"Cloud","date":"2026-04-12","desc":"Entenda como o desenho arquitetônico correto impede catástrofes de downtime e garante SLAs de 99.999%.","body":"# Modernizando a Infraestrutura\n\nManter uma infraestrutura inteligente não é apenas sobre mover para a nuvem. É sobre resiliência. O **n.infraops** traz práticas de SRE contínuo.\n\n## FinOps Integrado\nA otimização de custos e performance devem andar juntas. Migrar microserviços para workers edge gerou reduções de custo latente de até 40% em nosso ecossistema.","featured":false,"published":true}', 
 'cloud-hibrida-e-ninfraops', 'published', 'pt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ===========================
-- CASES
-- ===========================
DELETE FROM entries WHERE collection_id = (SELECT id FROM collections WHERE slug = 'cases');

INSERT INTO entries (id, collection_id, data, slug, status, locale, created_at, updated_at) VALUES 
('cas-1', (SELECT id FROM collections WHERE slug = 'cases'), 
 '{"client":"Fintech Nacional (Confidencial)","category":"segurança","project":"Modernização do SOC Core e Auditoria ISO 27001","result":"Certificação Concluída e Escudo contra Ransomware ativo.","desc":"Implantação completa do ecossistema trustness. para governança, acoplado ao n.secops para monitoramento de ponta a ponta dos ambientes AWS e on-premise do banco.","stats":"+15k EPS analisados, 0% Downtime de Segurança","featured":true,"published":true}', 
 'fintech-nacional-soc', 'published', 'pt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('cas-2', (SELECT id FROM collections WHERE slug = 'cases'), 
 '{"client":"Rede Varejista do Sul","category":"cloud","project":"Migração Zero-Downtime para Edge","result":"Redução de latência em 60% com n.devarch","desc":"Reescrevemos o gateway de pagamentos da loja online utilizando a filosofia do n.devarch, removendo servidores legados e implementando operações orientadas a orquestração global.","stats":"-60% Latência, +30k acessos/s","featured":false,"published":true}', 
 'varejo-sul-migracao-edge', 'published', 'pt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ===========================
-- JOBS (Vagas)
-- ===========================
DELETE FROM entries WHERE collection_id = (SELECT id FROM collections WHERE slug = 'jobs');

INSERT INTO entries (id, collection_id, data, slug, status, locale, created_at, updated_at) VALUES 
('job-1', (SELECT id FROM collections WHERE slug = 'jobs'), 
 '{"title":"Engenheiro de SRE Pleno (n.infraops)","vertical":"engenharia","location":"Remoto / São Paulo, SP","type":"Full-time","desc":"Buscamos um talento em infraestrutura e código para atuar em missões críticas, garantindo a sustentabilidade de ambientes cloud complexos de nossos clientes.","requirements":"[\"Kubernetes avançado\",\"Terraform / Pulumi\",\"Python ou Go\",\"Cultura Cloud Native e CI/CD\"]","published":true}', 
 'sre-pleno', 'published', 'pt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('job-2', (SELECT id FROM collections WHERE slug = 'jobs'), 
 '{"title":"Especialista em Forense Digital (CIRT)","vertical":"segurança","location":"Remoto / Global","type":"Full-time","desc":"Atuação em war-rooms e cenários de post-mortem. Integração ao time de resposta a incidentes críticos e preservação de cadeia de custódia utilizando práticas do forense.io.","requirements":"[\"Disposição para plantões 24x7\",\"Certificação GCIH ou similar\",\"Reversing de malware e análise de memória (Volatility)\"]","published":true}', 
 'forense-digital-cirt', 'published', 'pt', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
