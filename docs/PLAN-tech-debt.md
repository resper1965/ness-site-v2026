# PLAN: Technical Debt Mapping

**Status:** Em mapeamento inicial  
**Mode:** PLANNING ONLY  
**Target:** Site Principal (`src/`) e Canal CMS (`canal/`)  

---

## 1. Contexto & Problemática

O objetivo deste plano é mapear todos os débitos técnicos explícitos e implícitos presentes na base de código, abrangendo o site público e a plataforma de administração multi-tenant (Canal). Com o amadurecimento do produto e as recentes refatorações de autenticação (Better Auth) e banco de dados, surgiram ou foram introduzidos pontos de melhoria, quebra de tipagem, ou soluções legadas que precisam ser organizadas.

---

## 2. Inventário de Débitos Técnicos Encontrados

### 2.1. Frontend Público (`src/`)
- **[Alta Prioridade] Ausência de Tipagem Estrita (`any` generalizado):** As páginas principais realizam fetching de dados e salvam em React state sem inferência de tipos. Foram identificados estados tipados como `any[]` ou `any` nos arquivos:
  - `src/pages/Careers.tsx`
  - `src/pages/Portfolio.tsx`
  - `src/pages/Blog.tsx`
  - `src/pages/Insights.tsx`
  - `src/pages/SolutionPage.tsx`
  - `src/pages/PortfolioCase.tsx`
- **[Média Prioridade] Componentes Hardcoded:** Modelos como o `solutionsData` (`src/data/solutionsData.ts`) estão operando de forma estática com tipagem `any`, quando já estamos movendo a arquitetura para consumir o CMS genérico. 

### 2.2. Canal Admin (`canal/admin/src/`)
- **[Alta Prioridade] Supressões TypeScript (`@ts-ignore`):**
  - Em `canal/admin/src/lib/auth-client.ts`, há supressão por incompatibilidade (mismatch) nas versões de plugins do BetterAuth.
  - Em `canal/admin/src/routes/saas.tsx` (linha ~505), existe outro uso da diretiva para burlar a checagem.
- **[Média Prioridade] Falta de End-to-End Type Safety:** O painel hoje consome a API do Backend via `authClient.$fetch`, mas sem utilizar garantias de RPC ou compartilhamento de tipos (Zod) entre cliente e servidor.

### 2.3. Canal Backend (`canal/src/`)
- **[Crítico] Rotas Administrativas Legadas:** Apesar de migrarmos para rotas genéricas (`/api/v1/collections`), o arquivo `index.ts` ainda mantém as rotas estruturais antigas com schemas soltos (`/api/admin/insights`, `/api/admin/jobs`, `/api/admin/cases`). Estas tabelas precisam ser unificadas via collections ou as rotas eliminadas se o schema v3 global já possuir as instâncias correspondentes.
- **[Média Prioridade] Type Casting Inseguro:** O middleware do Hono no `index.ts` executa assunções arriscadas como `c.get('agentSession') as any`.
- **[Média Prioridade] Fallback Hardcoded no RAG:** O chatbot RAG (`/api/chat`) usa variáveis como `SOLUTIONS_CORPUS` (textos chumbados no código fonte `canal/src/seed-vectors.ts`) quando poderia consultar dinamicamente a D1 ou diretório estruturado.

### 2.4. Infraestrutura & Testes
- **[Alta Prioridade] Automating Testing Gap:** A plataforma possui unitários limitados e verificação de build (`tsc`). Faltam testes End-to-End (ex: via Playwright) validando o roteamento cross-tenant e o controle de isolamento do Better Auth.

---

## 3. Socratic Gate (Dúvidas de Escopo)

> [!WARNING]
> Responda aos questionamentos abaixo antes de iniciarmos qualquer execução via `/create` ou modificação na branch principal:

1. **Priorização:** Você prefere que a gente elimine primeiro os "focos de incêndio" relacionados a TypeScript (os vários `any` e `@ts-ignore`) ou que a gente inicie matando as Rotas Legadas Inseguras do Backend?
2. **Tipagem Global (E2E):** O objetivo é conectar as tipagens compartilhando bibliotecas ou apenas adicionar interfaces TypeScript exclusivas em cada pasta (frontend vs backend) para remover rapidamente os `any` sem mudar arquitetura de repasse de dados?
3. **Legado:** Podemos migrar (ou apagar, caso irrelevantes) as rotas REST legadas e remover as tabelas velhas como `insights`, `jobs` agora?

---

## 4. Plano de Ação (Próximos Passos)

1. **Fase 1: Correção Tipográfica Estrita:** Substituir cada `any` encontrado em estados por Interfaces reais baseadas no Zod. Remover e resolver todos os `@ts-ignore`.
2. **Fase 2: Arquitetura de Dados:** Limpar `index.ts`, remover tabelas antigas (apenas collections em vigor) e extrair logs/chatbot logic para controllers isolados.
3. **Fase 3: Refatoração do RAG:** Integrar a fonte de verdade do Vectorize real time na D1 (ou API) removendo textões hardcoded em código fonte do Cloudflare Worker.

---
`docs/PLAN-tech-debt.md` gerado seguindo as diretrizes do workflow `/plan`.
