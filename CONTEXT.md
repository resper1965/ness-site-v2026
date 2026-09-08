# CONTEXT.md — Contexto Obrigatório para Agentes AI

> 🔴 **OBRIGATÓRIO:** Todo agente AI que trabalhar neste repositório DEVE ler este arquivo antes de qualquer ação.

---

## O que é este projeto?

**ness-site2026** é a plataforma digital da [ness.](https://ness.com.br) — uma consultoria boutique de engenharia de software, resiliência cibernética e operações inteligentes, fundada em 1991.

O monorepo contém:

1. **Site Institucional** (`src/`) — React 19, Tailwind 4, Framer Motion. Multi-brand (ness/trustness/forense.io). i18n (pt/en/es).
2. **Canal CMS** (`canal/src/`) — Backend Hono em Cloudflare Workers. D1, R2, Vectorize, Workers AI, Queues, Durable Objects.
3. **Backoffice Admin** (`canal/admin/`) — SPA React para gestão de conteúdo, leads, brandbook, assinaturas, newsletters.

## Onde está o roadmap?

> 📋 **[`docs/PLAN-epics-roadmap.md`](docs/PLAN-epics-roadmap.md)** — Roadmap Master

Este é o documento de planejamento central. Contém:
- **6 Fases** (Infra → Tech Debt → Conteúdo → Compliance → IA → Growth)
- **26 Entregas** com INPUT → OUTPUT → VERIFY
- **114 Tasks** com atribuição de agentes
- **KPIs e Métricas** por fase
- **Gantt visual** com dependências

**Toda implementação deve seguir este roadmap.** Novas features devem ser mapeadas a uma fase/entrega existente ou justificar a criação de uma nova.

## Estado atual (2026-09-08)

| Dimensão | Status |
|----------|--------|
| Branch | `main` — sincronizada com [github.com/resper1965/ness-site-v2026](https://github.com/resper1965/ness-site-v2026) |
| Site | ✅ Build OK, 17 páginas, 3 marcas, acessibilidade WCAG 2.1 AA+ e foco executivo CISO/DPO |
| Canal CMS | ✅ Funcional, MCP Server integrado, validação defensiva e rate-limiting em rotas de IA |
| Admin | ⚠️ Em expansão (18 rotas, ~5 novos componentes) |
| Deploy | 🚀 Pronto para deploy via Cloudflare Pages / Workers (Fase 1 do roadmap) |

## Tech Stack

| Componente | Tecnologia |
|------------|------------|
| Frontend | React 19, React Router 7, Tailwind CSS 4, Framer Motion |
| Build | Vite 6 |
| Backend | Hono 4 (Cloudflare Workers) |
| Database | Cloudflare D1 (SQLite), Drizzle ORM |
| Storage | Cloudflare R2 |
| Search | Cloudflare Vectorize (RAG embeddings) |
| AI | Workers AI (Llama 3.3 70B, Llama 3.1 8B, BGE-base) |
| Auth | Better Auth (admin, organization, agent-auth plugins) |
| Queue | Cloudflare Queues (auto-vectorize, traduções) |
| State | Durable Objects (GabiAgent chatbot) |
| Email | Resend API |
| i18n | react-i18next |

## Documentos ativos

| Documento | Propósito |
|-----------|-----------|
| [`README.md`](README.md) | Visão geral, quick start, API reference |
| [`docs/PLAN-epics-roadmap.md`](docs/PLAN-epics-roadmap.md) | **Roadmap Master** (contexto obrigatório) |
| [`docs/PLAN-canal-tech-debt.md`](docs/PLAN-canal-tech-debt.md) | Débitos técnicos pendentes |
| [`docs/PLAN-next-steps.md`](docs/PLAN-next-steps.md) | Próximos passos pós-estabilização |
| [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md) | **Design System Universal** (regras visuais estritas) |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Referência legada do Design System (foco web) |
| [`.specify/memory/constitution.md`](.specify/memory/constitution.md) | **Constituição do Projeto** (regras do Spec Kit e SDD) |
| [`canal/README.md`](canal/README.md) | Documentação do Canal CMS backend |

## Documentos arquivados

Planos concluídos ou supersedidos pelo roadmap master estão em [`docs/archive/`](docs/archive/). Consulte-os apenas para contexto histórico — **não os siga para implementação.**

## Spec-Driven Development (Spec Kit)

Este repositório adota o **GitHub Spec Kit** para guiar o ciclo de desenvolvimento de novas features e refatorações complexas.
- A **Constituição** ([`constitution.md`](.specify/memory/constitution.md)) define os princípios inalteráveis do projeto.
- Todo ciclo de feature deve gerar as especificações e planos correspondentes:
  - `/speckit-specify` ou `/speckit-plan` para criar especificações e planejamento técnico.
  - `/speckit-tasks` para decompor em tarefas discretas e rastreáveis.
  - `/speckit-implement` para executar o código guiado pelo plano.

## Regras para agentes

1. **Leia a Constituição** (`.specify/memory/constitution.md`) e o **Roadmap** (`PLAN-epics-roadmap.md`) antes de qualquer implementação.
2. **Siga a fase correta** — não pule fases (ex: não inicie Fase 5 se Fase 1 não está concluída).
3. **Atualize o roadmap** — marque `[x]` quando concluir tasks, `[/]` quando em progresso.
4. **Respeite a arquitetura** — o projeto é Cloudflare-native, não introduza infra externa.
5. **Commits semânticos** — `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
6. **Type-safety** — `npx tsc --noEmit` deve retornar 0 erros.
7. **Teste antes de declarar pronto** — verificação obrigatória usando os scripts de auditoria (`checklist.py`/`verify_all.py`).

