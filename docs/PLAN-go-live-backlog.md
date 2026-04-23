# PLAN-go-live-backlog

Este plano detalha tecnicamente a execução do roteiro de Go-Live (Próximos Passos) e a arquitetura do Backlog do Canal SaaS, cobrindo D1, Vectorize, Cloudflare Workers e Front-end.

---

## 1. Fase 1: Go-Live Crítico (P0 e P1)

Essa fase foca puramente em interligar a infraestrutura de Cloudflare Pages (Frontend) ao Cloudflare Workers (Canal Backend) em produção.

### 1.1 Configuração do Ingress e Secrets
- **Workers (Canal CMS)**: Realizar o push da branch Claude para a `main`, efetuar o merge e rodar `wrangler deploy` na subpasta `canal/`.
  - Configurar remotamente via dashboard CF: `BETTER_AUTH_SECRET`, `ADMIN_SETUP_KEY`, e `RESEND_API_KEY`.
- **Pages (Site Frontend)**:
  - Definir `CANAL_WORKER_URL` = `https://canal.ness.workers.dev` no ambiente de Produção do Pages.
  - Limpar a variável antiga `VITE_CANAL_BASE_URL`.

### 1.2 Bootstrapping de Dados
1. **Administração**: Realizar o `cURL` POST para o endpoint `/api/setup/admin` utilizando o header `x-setup-key`. Isso criará a super-conta utilizando as rotas da Better Auth.
2. **Setup do Vectorize**: Chamar `/api/admin/seed-vectors`. Este processo fará a varredura (`RAG Embedding`) do site atual via Workers AI (`@cf/baai/bge-base-en-v1.5`) e armazenará os encodings no Cloudflare Vectorize para manter o contexto vivo do Chatbot Gabi.OS.

### 1.3 CORS e Roteamento
- Configurar origin binding no `index.ts` do Canal para aceitar tráfego limpo das 3 custom domains (`ness.com.br`, `trustness.com.br`, `forense.io`) e branches em preview da Cloudflare `https://*.ness-site2026.pages.dev`.

---

## 2. Fase 2: Arquitetura Técnica do Backlog

Este escopo exigirá expansão do Schema D1 (`schema.ts`) e implementação pesada no Front-end Administrativo do Canal SaaS.

### Epic 1 & 5: Multi-Tenant Config, KV Cache Layer, e Políticas Internas
A base de dados será particionada virtualmente via coluna `tenant_id` em toda as tabelas. Para proteger os limites do D1 contra picos massivos em consultas públicas, serviremos os dados nativamente via **Cloudflare Workers KV (ou Cache API)** com TTL de 5 minutos, poupando +99% do throughput do DB.
- **DB Schema Alterações**: Na tabela `tenants`, adicionar `chatbot_config (JSONB)` armazenando o behavior (Tom de voz, Prompt do Sistema). Toda query de API fará restrição estrita via `WHERE tenant_id = ?`.
- **Endpoint Inteligente (RAG Isolado)**: O proxy executará a busca semântica em Vectorize sempre afunilada com `namespace: tenant_id`. 
- **Editor de Políticas**: Uso de engine `react-markdown`. O Banco salvará Hashes estruturados imutáveis do documento para rastro fidedigno da LGPD.

### Epic 2 & 7: Tarefas Assíncronas (Cloudflare Queues & DLQ)
Traduções de AI Llama e disparos massivos esgotam os "50ms libres" na Cloudflare.
- **Workers AI Asíncrono**: Deslocamento total para um Consumidor nativo via **Cloudflare Queues**, impedindo Timeout.
- **Cron Triggers Fixos**: Newsletters consumirão um Scheduler no `wrangler.toml` disparando via Webhook ao Resend.
- **Dead Letter Queues (DLQ) para Resiliência**: Caso o LLM falhe 3 vezes ou o email não dispare nas Queues, a Fila "ejetará" o Payload para um Banco/Tabela Especial DLQ, provocando um disparo passivo ao Slack/PagerDuty da equipe humana de MKT solicitando Revisão (Evita travamento mudo).

### Epic 3 e 4: DSAR e Ouvidoria Blindada (Whistleblower Assimétrico)
Foco massivo em fluxos Zero-Trust. O Escopo inicial em AES-GCM (Simétrico) deve ser abandonado por risco crítico de roubo de chaves client-side.
- **Whistleblower (Criptografia Assimétrica)**: A aplicação Frontend utilizará `RSA-OAEP`, carregando Apenas a **Public Key** do DPO embarcada. O browser fará o encrypt do pacote blindado ANTES do `POST`. Ninguém conseguirá abrir, a nuvem vira cega. A visualização das denúncias será estritamente offline pelo responsável dono da **Private Key**.
- **DSAR**: Endpoint genérico processando intakes. Triggers automáticos notificarão via PagerDuty ou Webhooks do Slack fazendo contagem regressiva de SLA.

### Epic 6: Resumo de Emergências (n.cirt)
- Modificar o `EmergencyChatModal` local. Ao receber primeiro ping válido, ele injetará automaticamente um `POST /api/incidents` com Payload JSON.
- No back-end, criar rota que conectará (via SDK ou Fetch padrão) diretamente na Pipe do OpsGenie, acionando o Call On Duty imediato e setando flags de urgência no painel mestre D1 do canal.

---

## 3. Estratégia de Branches & Review

Será necessário rodar a importação segura de toda a branch da pipeline do Claude (sem sobrescrever as nossas vitórias visuais e reparos massivos que foram pra `main` hoje).

### Como operaremos a migração e código
1. Checkout da master atual (`origin/main`).
2. Fast-fusion ou cherry-pick dos 5 commits visuais, estruturais e lógicos do `origin/claude/organize-project-structure-uVacT` via git CLI.
3. Tratamento de qualquer mínimo conflito no `Functions` para bater de frente com a estabilidade de rotas atual.

---

## 4. Evolução Futura: Arquitetura Agêntica (Cloudflare Agents SDK)

O plano culminante transforma o Canal Institucional em uma **Máquina Ativa de Aquisição B2B e Engenharia de Venda**. Utilizando os *Durable Objects* da Cloudflare (memória de estado) combinados a *Tools Autônomos*, os Agentes atuarão em 3 frentes de receita:

### Epic 8: Convergência B2B, Triage e Automação de Compliance (Agentic Workflows)
- **Princípio Arquitetural Básico:** UX Determinística no Site (Sem Generative UI invasivos no Frontend). O Site guia e funila o contato, o Canal executa o pensamento pesados (70B Model).
- **Gabi (A Siserone / Concierge):** Interface frontal operando como recepcionista com atalhos preditivos (Quick Replies). Ela funila Leads institucionais diretamente para as intenções do Canal em 1 clique.
- **SDR / Presales Engineer:** A IA atuará no front do site. Se detectar dores estratégicas no visitante, em vez de respostas genéricas, qualificará o Lead (Lead Scoring) e utilizará integrações (ex: Google Calendar API) para engatilhar reuniões qualificadas com Diretores diretamente no chat.
- **Triagem "Paramédica" n.cirt:** No acionamento de incidentes reais no site, o Agente isolará o lead atacado via `EmergencyChatModal`. Ele notificará instantaneamente a NESS (Webhook/Slack SLA 0) e iniciará contenção inicial retórica para mapear IoCs (Prontuário Autônomo) e acalmar o usuário antes da invasão tática humana.
- **Agente de Automação de Compliance (DSAR & Ouvidoria):** Em paralelo à "Blindagem Criptográfica" (onde o DPO analisa o caso cru offline), esse Agente cuidará da **Administração Regulatória**. Ele formulará respostas instantâneas padronizadas por lei ("O seu pedido DSAR foi iniciado"), monitorará ativamente os prazos/timers (SLA) das LGPDs, emitirá cobranças aos DPOs no penúltimo dia do vencimento, e confeccionará logs auditáveis comprovando que as demandas foram administradas nos ritos do Compliance.
- **Máquina de Conteúdo Omnichannel:** Trabalhando invisível no servidor na madrugada, o Agente monitorará inputs e notícias globais, escrevendo e enfileirando (Queues) conteúdos otimizados nativamente para **Blogs de SEO**, **Newsletters Semanais** e **Postagens do LinkedIn**. Ele cruza os casos de sucesso reais do D1 para sustentar toda a esteira Inbound de forma ininterrupta, dependendo apenas do botão "Aprovar" no painel humano.
