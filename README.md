# ness. — Engenharia de Precisão Digital

> *Invisíveis quando tudo funciona. Presentes quando mais importa.*

Consultoria boutique especializada em **engenharia de software de alta performance**, **resiliência cibernética** e **operações inteligentes**. Fundada em 1991, com +35 anos de legado digital.

🔗 **Repositório Oficial:** [github.com/resper1965/ness-site-v2026](https://github.com/resper1965/ness-site-v2026)

---

## 🏗️ Arquitetura

Este monorepo contém **3 camadas** servindo 3 marcas em produção:

| Camada | Diretório | Stack | Descrição |
|--------|-----------|-------|-----------|
| **Site Institucional** | `src/` | React 19, Tailwind 4, Framer Motion, Vite | 17 páginas, multi-brand, i18n (pt/en/es) |
| **Canal CMS (Backend)** | `canal/src/` | Hono, CF Workers, D1, R2, Vectorize, Workers AI | API, RAG chatbot, autenticação, queues |
| **Backoffice Admin** | `canal/admin/` | React, Vite | Painel administrativo SaaS multi-tenant |

### Marcas servidas (mesmo deploy)

| Domínio | Marca |
|---------|-------|
| `ness.com.br` | ness. |
| `trustness.com.br` | trustness. |
| `forense.io` | forense.io |

A detecção de marca é feita em runtime por `window.location.hostname`.

---

## 🚀 Quick Start

### Pré-requisitos

- Node.js ≥ 18
- npm

### Instalação

```bash
npm install
cd canal && npm install
cd canal/admin && npm install
```

### Desenvolvimento

```bash
# Site (Vite + Worker no workerd, respostas de /api vindas de fixtures)
npm run dev

# Canal Worker (separado — requer wrangler login)
cd canal && npx wrangler dev

# Backoffice Admin (separado)
cd canal/admin && npm run dev
```

### Build de Produção

```bash
npm run build          # Site → dist/client (assets) + dist/server (Worker)
npm run preview        # Roda o build no workerd, como em produção
npm run deploy         # Publica o Worker (usa dist/server/wrangler.json)
npm run test:e2e:site  # Smoke do site público contra o build local (npm run preview)
cd canal/admin && npm run build  # Admin → canal/admin/dist/
cd canal && npx wrangler deploy  # Worker → Cloudflare
```

---

## ✨ Features

### Site Público
- **Design Imersivo** — Dark mode, glassmorphism, microanimações (Framer Motion)
- **Gabi.OS Chatbot** — IA generativa com RAG (BGE embeddings + Vectorize + Llama 3)
- **SEO Agressivo** — JSON-LD, sitemap, robots.txt, OG images, canonical URLs
- **Lead Magnets** — LGPD checklist, DevSecOps checklist, quiz interativo
- **i18n** — Português, English, Español (react-i18next)
- **Multi-brand** — 3 domínios, 1 deploy

### Canal CMS
- **Headless CMS** — Collections genéricas, entries tipadas, CRUD completo
- **Auth SaaS** — Better Auth (admin, organization, agent-auth plugins)
- **IA Nativa** — Workers AI (Llama 3.3 70B + 8B), AI Writer, governance
- **Media R2** — Upload, storage, CDN com cache imutável
- **Queues** — Auto-vectorize, traduções, notificações assíncronas
- **MCP Server** — Integração com agentes externos

### Backoffice Admin
- **Dashboard** — Métricas, analytics, overview por tenant
- **Content Manager** — Editor de entries por collection
- **Brandbook** — Assets da marca, logos, paletas
- **Assinaturas** — Templates de email signature com preview
- **Leads & Forms** — Gestão de contatos e formulários
- **Newsletters** — Gestão de campanhas e subscribers

---

## 📁 Estrutura

```
ness-site2026/
├── src/                    # Site público (React)
│   ├── pages/              # 17 páginas
│   ├── components/         # Componentes reutilizáveis
│   ├── config/             # Brand config por domínio
│   ├── data/               # Dados estáticos (solutions, etc.)
│   ├── hooks/              # Custom hooks
│   ├── i18n.ts             # Traduções (pt/en/es)
│   └── shared/             # Tipos, utils compartilhados
├── canal/                  # Backend (Cloudflare Worker)
│   ├── src/                # Código-fonte do Worker
│   │   ├── ai/             # Models, prompts, client AI
│   │   ├── db/             # Drizzle schema
│   │   ├── routes/         # API routes (entries, media, admin, etc.)
│   │   ├── auth.ts         # Better Auth config
│   │   ├── agent.ts        # GabiAgent Durable Object
│   │   ├── mcp.ts          # MCP Server
│   │   ├── queue.ts        # Queue consumer
│   │   └── index.ts        # Main entry point
│   ├── admin/              # Backoffice SPA (React)
│   │   ├── src/routes/     # 18 rotas admin
│   │   └── src/components/ # Componentes admin
│   ├── migrations/         # SQL migrations
│   └── wrangler.jsonc      # Cloudflare config
├── workers/                # Worker do site: HTML na edge, API, robots, sitemap
├── public/                 # Assets estáticos
├── docs/                   # Documentação do projeto
│   ├── PLAN-epics-roadmap.md  # 📋 ROADMAP MASTER (contexto obrigatório)
│   ├── PLAN-canal-tech-debt.md
│   ├── PLAN-next-steps.md
│   ├── DESIGN.md           # Design system reference
│   └── archive/            # Planos concluídos/supersedidos
└── .agent/                 # Antigravity Kit (AI agents & skills)
```

---

## 🌐 API

### Rotas Públicas

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/insights` | Lista artigos do blog |
| `GET` | `/api/insights/:slug` | Artigo por slug |
| `GET` | `/api/jobs` | Lista vagas ativas |
| `GET` | `/api/cases` | Lista casos do portfólio |
| `GET` | `/api/cases/:slug` | Caso por slug |
| `POST` | `/api/chat` | Chat com Gabi.OS (RAG + streaming) |
| `POST` | `/api/forms` | Envio de formulário de contato |
| `POST` | `/api/newsletter` | Inscrição na newsletter |
| `POST` | `/api/incidents` | Reporte de incidente (n.cirt) |

### Rotas Autenticadas (`/api/v1/`)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/v1/collections` | Lista collections |
| `GET/POST` | `/api/v1/collections/:slug/entries` | CRUD de entries |
| `POST` | `/api/v1/media/upload` | Upload de mídia para R2 |
| `POST` | `/api/admin/seed-vectors` | Indexar conteúdo no Vectorize |
| `POST` | `/api/admin/seed-collections` | Registrar collections |

### Autenticação

| Rota | Descrição |
|------|-----------|
| `/api/auth/*` | Better Auth (login, signup, sessions) |
| `/api/setup/admin` | Bootstrap admin (requer `x-setup-key`) |
| `/api/mcp/*` | MCP Server (requer auth ou agent token) |

---

## ⚙️ Variáveis de Ambiente

### Site (`.env`)

| Variável | Descrição | Default |
|----------|-----------|---------|
| `VITE_CANAL_BASE_URL` | URL do Canal (vazio = proxy) | _(vazio)_ |
| `VITE_BRAND` | Tema da marca (ness/trustness/forense) | `ness` |

### Canal Worker (Cloudflare Secrets)

| Secret | Descrição |
|--------|-----------|
| `BETTER_AUTH_SECRET` | JWT secret (≥ 32 chars) |
| `ADMIN_SETUP_KEY` | Chave de bootstrap admin |
| `RESEND_API_KEY` | Chave da API Resend (emails) |
| `SLACK_WEBHOOK_URL` | (Opcional) Alertas de incidentes |

### Cloudflare Bindings

| Binding | Tipo | Descrição |
|---------|------|-----------|
| `DB` | D1 Database | `canal-db` |
| `MEDIA` | R2 Bucket | `canal-media` |
| `VECTORIZE` | Vectorize Index | `canal-vectors` |
| `AI` | Workers AI | Llama 3.3 / BGE embeddings |
| `CANAL_KV` | KV Namespace | Cache e configurações |
| `QUEUE` | Queue | `canal-tasks-queue` |
| `AGENT_DO` | Durable Object | `GabiAgent` |

---

## 📋 Roadmap

> **Documento central:** [`docs/PLAN-epics-roadmap.md`](docs/PLAN-epics-roadmap.md)

| Fase | Foco | Prioridade |
|------|------|------------|
| 1 | Infraestrutura & Go-Live | P0 |
| 2 | Dívida Técnica & Qualidade | P0-P1 |
| 3 | Conteúdo & CMS Completo | P1 |
| 4 | Compliance & Segurança (LGPD) | P2 |
| 5 | IA & Automação | P2-P3 |
| 6 | Growth & Diferenciação | P3 |

---

## 📚 Documentação Adicional

| Documento | Descrição |
|-----------|-----------|
| [`docs/PLAN-epics-roadmap.md`](docs/PLAN-epics-roadmap.md) | **Roadmap Master** — 6 fases, 26 entregas, 114 tasks |
| [`docs/PLAN-performance-ux-comercial.md`](docs/PLAN-performance-ux-comercial.md) | **Análise e plano de performance** — técnica, UX/UI e comercial (3 marcas) |
| [`docs/PLAN-canal-tech-debt.md`](docs/PLAN-canal-tech-debt.md) | Débitos técnicos do Canal CMS |
| [`docs/PLAN-next-steps.md`](docs/PLAN-next-steps.md) | Próximos passos pós-estabilização |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Design system (cores, tipografia, componentes) |
| [`docs/archive/`](docs/archive/) | Planos concluídos e supersedidos |

---

## 📄 Licença

Proprietário — © 2026 ness. Engenharia de Precisão Digital
