# PLAN: ness-site2026 — Full Improvements Sprint

## Goal
Implement all improvements, innovations and bug fixes identified in the brainstorm analysis across the ness-site2026 + Canal platform.

## Agents
- project-planner (this doc)
- frontend-specialist (UI/React)
- backend-specialist (Canal API / Workers AI)
- seo-specialist (meta tags)
- devops-engineer (deploy/lint)

---

## Task Breakdown

### 🔴 P0 — CORREÇÕES CRÍTICAS

#### T1: Hero CTAs com navegação real
- `Hero.tsx`: botão "explorar" → `<Link to="/solucoes">`
- `Hero.tsx`: botão "conhecer a ness" → `<Link to="/sobre">`
- Ambos usam `react-router-dom Link`

#### T2: Empty State — Blog / Careers / Portfolio
- Criar componente `EmptyState.tsx` reutilizável
- Mostra ícone, titulo e subtítulo quando array vazio
- Usar em Blog, Careers, Portfolio

#### T3: Lint cleanup
- `ChatbotWidget.tsx` linha 91: `z-[60]` → `z-60`
- `Careers.tsx` linha 222: `rounded-[2rem]` → `rounded-4xl`
- `CelebrationPopup.tsx` linha 40: `z-[100]` → `z-100`

#### T4: Rota `/portfólio` → `/portfolio` (sem acento)
- `App.tsx`: mudar rota para `/portfolio`
- `Footer.tsx` e `Navbar.tsx`: atualizar links

#### T5: Remover `App.backup.tsx`
- Arquivo desnecessário no bundle

---

### 🟠 P1 — MELHORIAS HIGH IMPACT

#### T6: Rotas de detalhe `/blog/:slug`
- Nova rota `App.tsx`: `<Route path="/blog/:slug" element={<BlogPost />} />`
- Nova página `pages/BlogPost.tsx`:
  - Fetch `GET /api/insights/:slug` do Canal
  - Layout com header, conteúdo, tags, data
  - Back button para `/blog`
- Canal API: adicionar `GET /api/insights/:slug`
- Blog.tsx: cards viram links `<Link to={/blog/${art.slug}}>`

#### T7: Rotas de detalhe `/portfolio/:slug`
- Nova rota: `<Route path="/portfolio/:slug" element={<PortfolioCase />} />`
- Nova página `pages/PortfolioCase.tsx`
- Canal API: adicionar `GET /api/cases/:slug`
- Portfolio.tsx: cards viram links `<Link to={/portfolio/${c.slug}}>`

#### T8: Meta tags dinâmicos por página (react-helmet-async)
- `npm install react-helmet-async`
- `main.tsx`: envolver `App` em `<HelmetProvider>`
- Cada página recebe `<Helmet>` com title + description PT/EN/ES
- Páginas: Home, About, Blog, Careers, Portfolio, Contact

---

### 🟡 P2 — INOVAÇÕES

#### T9: Chatbot com Workers AI (Llama 3.3)
- Canal `src/index.ts`: `POST /api/chat` usando `env.AI.run('@cf/meta/llama-3.3-70b-instruct-fp8-fast')`
- System prompt: "Você é Gabi, assistente digital da ness. Responda apenas sobre os serviços ness: segurança, IA, infraestrutura. Seja conciso e profissional."
- `wrangler.jsonc`: adicionar binding `AI`

#### T10: Contador animado de métricas (About/Home)
- Componente `AnimatedCounter.tsx`
- Props: `value`, `suffix`, `label`, `duration`
- Usar `useInView` + `useMotionValue` para animação ao entrar na viewport
- Inserir na página About: "35 anos", "6 países", "+200 projetos", "+500 clientes"

#### T11: Filtros de tag no Blog
- Blog.tsx: extrair tags únicas dos artigos
- Barra de filtros similar à de Careers
- Client-side filtering sem nova chamada de API

---

### 🟢 P3 — NEWSLETTER FOOTER

#### T12: Newsletter funcional
- Canal API: `POST /api/newsletter` → salva email em tabela `newsletter` no D1
- Footer.tsx: form com onSubmit real + feedback visual

---

## Execution Order

```
T3 (lint) → T5 (remove backup) → T4 (rota) →
T1 (hero CTAs) → T2 (empty state) →
T8 (helmet) → T6 (blog detail) → T7 (portfolio detail) →
T9 (chatbot AI) → T10 (counters) → T11 (blog filters) →
T12 (newsletter) →
BUILD → DEPLOY
```

## Files to Create
- `src/components/EmptyState.tsx` [NEW]
- `src/components/AnimatedCounter.tsx` [NEW]
- `src/pages/BlogPost.tsx` [NEW]
- `src/pages/PortfolioCase.tsx` [NEW]

## Files to Modify
- `src/components/Hero.tsx`
- `src/components/ChatbotWidget.tsx` (lint)
- `src/components/Footer.tsx` (newsletter)
- `src/components/CelebrationPopup.tsx` (lint)
- `src/pages/Blog.tsx` (links + filtros)
- `src/pages/Careers.tsx` (lint + empty state)
- `src/pages/Portfolio.tsx` (links + empty state)
- `src/App.tsx` (novas rotas)
- `src/main.tsx` (HelmetProvider)
- `canal/src/index.ts` (novos endpoints + AI)
- `canal/wrangler.jsonc` (AI binding)

## Files to Delete
- `src/App.backup.tsx`
