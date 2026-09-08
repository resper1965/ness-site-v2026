# PLAN: Sites Extremamente Performáticos — Técnico, UX/UI e Comercial

> **Escopo:** ness.com.br, trustness.com.br e forense.io (mesmo deploy, `src/` + `public/` + `functions/`).
> **Data:** 2026-09-08
> **Tipo:** Análise profunda + plano de execução em ondas.
> **Relação com o roadmap:** amplia a Fase 6 (Growth) e reabre itens da Fase 2 (Qualidade) do [`PLAN-epics-roadmap.md`](PLAN-epics-roadmap.md). O North Star "Lighthouse ≥ 90" do roadmap é insuficiente; este plano define metas de campo (Core Web Vitals reais) e de negócio (leads).

---

## 0. Sumário executivo

Os três sites são uma SPA React única, bonita e coerente com a marca, mas **não são performáticos em nenhuma das três dimensões pedidas**:

| Dimensão | Estado hoje | Meta em 90 dias |
|----------|-------------|-----------------|
| **Técnica** | Lighthouse mobile 77–79 (medido localmente, sem terceiros). LCP 3,2–3,4 s, FCP 2,7 s, Speed Index 21 s. ~216 kB gz de JS/CSS antes do primeiro pixel. Avatar do chat de 334 kB em todas as páginas. HTML vazio (sem SSR). | Lighthouse mobile ≥ 95. LCP p75 ≤ 2,0 s (CrUX). INP ≤ 200 ms. JS inicial ≤ 90 kB gz. HTML completo servido da edge com cache. |
| **UX/UI** | Modal de "35 anos" bloqueia **todas** as páginas na primeira visita; chatbot abre sozinho por cima dele (dois overlays). Labels 9–10 px, contraste falhando, formulários sem `label for`, animações infinitas de blur, home com 9 seções e ~9 telas de rolagem no mobile. | Zero overlays não solicitados. WCAG 2.1 AA sem violações (axe). Tipografia mínima 12 px. Motion respeita `prefers-reduced-motion`. Home com 6 seções orientadas a decisão. |
| **Comercial** | Zero eventos de conversão no GA4. Título da home é "insights — ness." (bug). Páginas de solução compartilham o mesmo título/descrição. Sitemap aponta para URLs inexistentes. Conteúdo en/es não indexável. OG de trustness/forense mostra ness. Sem telefone clicável, sem WhatsApp, sem Turnstile, sem captura de UTM. | Funil instrumentado ponta a ponta (evento → lead no D1 → notificação < 5 min). Metadados únicos por página, marca e idioma. Taxa visita→lead ≥ 2 %. Orgânico +50 % em 6 meses. |

**As 10 correções de maior retorno** (todas na Onda 0/1, ~2 semanas):

1. Remover/neutralizar o `CelebrationPopup` e o auto-open do chatbot (conversão e UX).
2. Corrigir metadados: título da home, canonical de `/contato`, título/descrição únicos por solução, `h1` da trustness.
3. Sitemap: remover `/solucoes/devsecops` e `/solucoes/aiops` (não existem) e gerar um sitemap por marca.
4. Otimizar imagens locais: avatar 334 kB → ~4 kB; OG 429 kB → 1200×630 ≤ 120 kB; portfólio 4 × ~1 MB → ~60 kB cada.
5. Self-host das fontes (2 famílias, 4 pesos, `woff2` subset) com preload; remover o `@import` do Google Fonts do CSS.
6. Tirar Sentry, `motion` e o widget de chat do caminho crítico (carregar sob demanda).
7. Substituir imagens de fundo Unsplash de 500 kB (opacidade 10–30 %) por gradientes CSS ou WebP/AVIF locais com `srcset`.
8. Cache de API na edge (`/api/insights`, `/api/cases`, `/api/jobs`) com `s-maxage` + `stale-while-revalidate`.
9. Instrumentar conversão: eventos de CTA/form/assessment/chat + Turnstile + UTM + página de obrigado.
10. Lighthouse CI com orçamento de performance bloqueando PRs + deploy de preview por PR.

A mudança estrutural que destrava o resto é **renderizar HTML na edge** (React Router 7 em modo framework num Worker, já presente nas dependências), o que resolve de uma vez SEO multi-marca/multi-idioma, LCP e TTFB.

---

## 1. Método e evidências

| O que foi feito | Resultado |
|-----------------|-----------|
| Leitura completa de `src/`, `public/`, `functions/`, `index.html`, `vite.config.ts`, `_headers`, workflows, docs | Inventário de 60+ achados (Apêndice A) |
| `npm ci && npm run build` | Build OK em 5,5 s; tamanhos de chunks abaixo |
| Lighthouse 12 (mobile, throttling padrão) em `vite preview` para `/`, `/solucoes/secops`, `/contato` | Perf 77–79; A11y 89–96; BP 96; SEO 100 (SEO "100" é enganoso: o Lighthouse não valida título duplicado nem canonical errado) |
| `curl` nos três domínios em produção e no canal | TTFB 0,34–0,89 s do container (HTML `cf-cache-status: DYNAMIC`); headers de segurança OK |
| Medição de payload externo | Hero Unsplash 175 kB (webp); fundos internos 504–520 kB (JPEG q=80, sem `fm=webp`); CSS do Google Fonts encadeado |
| Screenshots Playwright (390 px e 1440 px) | Confirmação visual dos overlays, hierarquia e comprimento da home |

**Limitações:** o ambiente bloqueia `logo.clearbit.com`, `images.unsplash.com` e `fonts.gstatic.com` para o Chrome, então o Lighthouse local **subestima** o custo real: em produção somam-se fontes (~150–250 kB), imagens externas, `gtag.js` (~100 kB gz) e a chamada ao D1. A expectativa realista em 4G é **LCP de 4–5 s na home**. Recomenda-se ligar o Cloudflare Web Analytics (RUM) na Onda 0 para ter dados de campo antes/depois.

---

## 2. Diagnóstico técnico

### 2.1 Caminho crítico de renderização

O HTML é uma casca vazia (`<div id="root">`). Nada aparece até que estes arquivos sejam baixados, parseados e executados:

| Arquivo | Raw | Gzip | Conteúdo / problema |
|---------|-----|------|---------------------|
| `index-*.js` | 335 kB | 108 kB | Entrada. Inclui **@sentry/react** inteiro (79 referências no bundle), `react-dom`, `react-i18next`, os recursos `pt` inline (`src/i18n.ts`, 734 linhas), Navbar, Footer, ChatbotWidget, CelebrationPopup, SchemaOrg |
| `motion-*.js` | 129 kB | 42 kB | Framer Motion completo; carregado sempre porque Navbar/Chatbot/Popup usam `motion` |
| `i18n-*.js` | 66 kB | 22 kB | i18next + detector + http-backend |
| `vendor-*.js` | 50 kB | 17 kB | React Router |
| `ui-*.js` | 30 kB | 7 kB | lucide-react (ícones usados por 32 arquivos) |
| `index-*.css` | 152 kB | 20 kB | Tailwind 4 + **`@import` do Google Fonts** (bloqueia render: CSS → CSS de fontes → woff2) |
| **Total antes do 1º pixel** | **762 kB** | **~216 kB** | Mais `gtag.js` async, `ga.js`, e a página lazy (`Home` 3,5 kB) |

Consequências medidas: FCP 2,7 s e LCP 3,2–3,4 s em mobile throttled **sem** fontes nem imagens externas. Com elas, o LCP (o `h1` em Manrope) espera a fonte.

### 2.2 Imagens

| Asset | Tamanho | Dimensões | Uso real | Problema |
|-------|---------|-----------|----------|----------|
| `public/gabi-avatar.png` | **334 kB** | 1024×1024 JPEG (extensão errada) | Botão de 64 px em **todas** as páginas | 60 % do peso de qualquer página; sem `Cache-Control` explícito (Pages devolve `max-age=0`) |
| `public/og-image.png` | **429 kB** | 1024×1024 JPEG | Preview em LinkedIn/WhatsApp | Proporção errada (deve ser 1200×630); pesado para scrapers |
| `public/portfolio/*.png` (4) | **800 kB–1,1 MB cada** | 1024×1024 JPEG | Cards do portfólio | 3,6 MB na página de portfólio; sem `srcset`, sem WebP/AVIF |
| Hero Unsplash (home) | 175 kB | 2000 px WebP | Fundo a 60 % de opacidade | Dependência externa (licença, disponibilidade, 3º host); `preload` fixo no `index.html` também dispara em páginas que não usam a imagem |
| Fundos Unsplash (Serviços, Verticais, Sobre, Contato, Insights, Soluções, Trustness, Forense, DPO) | **500–520 kB cada** | 2000 px JPEG q=80 | Opacidade 10–30 % | Meio megabyte para uma textura quase invisível; sem `fm=webp`, sem `srcset`, sem `loading=lazy` |
| Logos de clientes | externo | `logo.clearbit.com` | Seção "quem confia" | Serviço de terceiro (bloqueado aqui, instável; API em descontinuação); a seção fica vazia quando falha |

### 2.3 Animações e pintura

- Hero: dois blobs de 384–500 px com `blur(120–150px)` animados **infinitamente** (`repeat: Infinity`). É a causa do Speed Index de 21 s e de consumo de GPU/bateria em mobile.
- 92 usos de `animate`/`whileInView`; 13 usos de `backdrop-blur`. A navbar fixa usa `backdrop-blur-xl` sobre imagem animada: custo de composição a cada frame de scroll.
- `prefers-reduced-motion` só é respeitado no CSS; nenhum `useReducedMotion`/`MotionConfig`, então as 92 animações do Framer Motion ignoram a preferência do usuário.
- `AnimatePresence mode="wait"` envolve o `Suspense` sem `key` de rota: as animações de `exit` nunca rodam, mas o custo do wrapper existe.

### 2.4 Rede, cache e edge

- HTML das três marcas: `cf-cache-status: DYNAMIC`; TTFB 0,34–0,89 s. Não há cache de HTML na edge (sem SSR não faz sentido; com SSR passa a ser o principal ganho).
- `functions/api/[[route]].ts` consulta o D1 a cada visita para `/api/insights` (a home renderiza a seção Insights) e `/api/cases`, **sem `Cache-Control`**. Apenas `chatbot-config` tem `max-age=60`.
- `_headers`: `/locales/*` com `max-age=86400` sem hash (risco de tradução obsoleta por 24 h); imagens em `public/` sem regra (revalidação a cada visita); CSP permite `cdn.jsdelivr.net` (não usado) e `img-src https:` (curinga); `X-XSS-Protection` é obsoleto.
- `i18n.ts` empacota `pt` inline **e** configura `HttpBackend` para `/locales/{{lng}}/translation.json`: o `pt` é carregado duas vezes (bundle + fetch); `en`/`es` só chegam após um fetch em runtime (flash de texto não traduzido).
- Sentry inicializa no `main.tsx` com DSN hardcoded, sem `tracesSampleRate`, sem tunnel; carrega antes de qualquer conteúdo. Além do custo, é infra externa (a Constituição pede Cloudflare-native).
- GA4 (`gtag.js`) no `<head>` de todas as páginas, sem consentimento e sem nenhum evento (`grep gtag(` em `src/` = 0).
- `server.ts` (Express + Hono + Vite) e `@react-router/node`, `@react-router/serve`, `express`, `hono` estão nas `dependencies` mas só servem ao dev; o build de produção não os usa.

### 2.5 Build, CI/CD e qualidade

- `deploy.yml`: `npm install` (não `npm ci`), sem cache, sem deploy de preview por PR, deploy direto do `main` para as três marcas sem gate de qualidade.
- `e2e-playwright.yml` roda **contra o canal de produção** a cada PR (`baseURL: https://canal.ness.com.br`); não há e2e do site público.
- Sem Lighthouse CI, sem orçamento de bundle, sem `size-limit`, sem análise de bundle (`rollup-plugin-visualizer`).
- Um único teste unitário (`canal.test.ts`).
- Higiene: pasta `site/` (Next.js abandonado), scripts soltos na raiz (`fix-imports.ts`, `refactor.js`, `patch_admin_orgs.patch`, `parse_i18n.js`, `update_components.js`, `fix_components.ts`), `package.json` com nome `react-example` versão `0.0.0`.

### 2.6 Bugs funcionais encontrados

| ID | Bug | Onde | Impacto |
|----|-----|------|---------|
| B-01 | `CelebrationPopup` aparece em **todas as rotas** da marca ness (não só na home) 1,5 s após carregar, bloqueando o conteúdo | `App.tsx`, `CelebrationPopup.tsx` | Conversão, LCP percebido, bounce |
| B-02 | Chatbot abre sozinho (8 s em páginas críticas, 25 s nas outras) e, por ter `z-60`, aparece **por cima** do popup (`z-50`) | `ChatbotWidget.tsx` | Dois overlays empilhados na primeira visita (screenshot) |
| B-03 | Título da home é `insights — ness. — ness. IT Company`: `Solutions`, `Services`, `Verticals` e `Insights` chamam `usePageTitle` ao serem usados como **seções** da home e sobrescrevem o do `Hero` | `pages/Home.tsx` + seções | SEO da página mais importante |
| B-04 | `/contato` não chama `usePageMeta`: título genérico e **canonical herdado** (`https://ness.com.br/` ou o da página anterior) | `pages/Contact.tsx` | Google pode consolidar `/contato` na home |
| B-05 | Todas as páginas `/solucoes/:slug` têm o mesmo título `solução — ness.` e a descrição padrão | `pages/SolutionPage.tsx` | As páginas de produto não rankeiam |
| B-06 | Sitemap lista `/solucoes/devsecops` e `/solucoes/aiops`, que não existem (`solutionsData` tem `secops`, `infraops`, `devarch`, `autoops`, `cirt`); `REF_MAP` do contato também referencia `devsecops`/`aiops` | `public/sitemap.xml`, `Contact.tsx` | Soft-404 no sitemap |
| B-07 | `SolutionPage` com slug inválido renderiza "carregando" para sempre (sem 404) | `pages/SolutionPage.tsx` | Soft-404 infinito |
| B-08 | `h1` da trustness renderiza `trustness.auditoria e conformidade` (sem separação) | `pages/trustness/Home.tsx` | Legibilidade e SEO |
| B-09 | Cor padrão do chatbot é `#00E5A0` (verde neon) — viola a paleta (`#00ade8`) quando a config não carrega | `ChatbotWidget.tsx`, `functions/api` | Identidade |
| B-10 | Sitemap declara `hreflang` pt/en/es apontando para a **mesma URL**; idioma vive em `localStorage`, então en/es não existem para o Google | `sitemap.xml`, `i18n.ts` | Zero SEO internacional (Portugal, Chile, Peru, Colômbia, EUA) |
| B-11 | `og:title`, `og:image`, `og:url` do `index.html` são da ness. para os três domínios; scrapers de LinkedIn/WhatsApp não executam JS | `index.html` | Compartilhar trustness.com.br mostra a ness. |
| B-12 | `/trustness` e `/forense` na ness.com.br duplicam as homes dos outros domínios sem canonical cruzado | `App.tsx` | Conteúdo duplicado entre domínios |
| B-13 | Pill "‹ ness." com `position: fixed; top: 16px; left: 20px` colide com o logo da navbar (também fixo no topo) | `trustness/Home.tsx`, `forense/Home.tsx` | Sobreposição visual (screenshot mobile) |
| B-14 | `LeadMagnet` mostra "Material enviado!" mesmo quando o `fetch` falha | `LeadMagnet.tsx` | Lead perdido silenciosamente |
| B-15 | Sucesso do formulário de contato some após 3 s | `Contact.tsx` | Usuário não tem certeza de que enviou |
| B-16 | Preload do hero Unsplash no `index.html` roda em todas as rotas | `index.html` | 175 kB desperdiçados fora da home |

---

## 3. Diagnóstico UX/UI

### 3.1 Primeira impressão (o que o CISO/DPO vê nos primeiros 10 segundos)

1. Tela escura vazia por 2,7–5 s (SPA sem HTML).
2. Modal "35 anos de tecnologia de precisão" cobre a página (qualquer página, qualquer marca ness).
3. Aos 8 s (páginas de solução/forense/compliance/DPO) o chatbot verde abre por cima do modal.
4. Só depois de fechar os dois ele lê o hero: "invisíveis quando tudo funciona. presentes quando mais importa." — bonito, mas não diz **o que** a ness. faz nem **para quem**; a tag "tecnologia digital de precisão" é abstrata.
5. Os CTAs do hero são "explorar soluções" e "conheça a ness": nenhum é uma ação comercial (diagnóstico, conversa, avaliação).

### 3.2 Hierarquia e conteúdo

- **Home com 9 seções** (Hero, Presença, Métricas, Soluções, Serviços, Verticais, Insights, Logos, CTA) e ~8.800 px no mobile. Soluções, Serviços e Verticais também são rotas próprias com o **mesmo conteúdo**: duplicação para o usuário e para o Google.
- Métricas hardcoded ("500+ projetos", "200+ clientes", "99.9 %") sem fonte; para um comprador de segurança, número sem prova reduz credibilidade.
- Seção "quem confia" depende do Clearbit e renderiza os logos com `brightness-0 invert` (perde identidade). Sem depoimentos, sem certificações, sem selos (ISO 27001, credenciamento pericial, ANPD).
- Blog na home aparece vazio quando o CMS não tem conteúdo publicado (o título "blog." fica órfão).
- Solução: a página de produto é boa (visão executiva vs. técnica, dashboard, fluxo, benefícios, casos, onboarding, lead magnet). Problema é ser inatingível por SEO (B-05) e o chatbot cobrir o "dashboard" no desktop.

### 3.3 Tipografia, contraste e acessibilidade

- Labels, tags e menu em **9–10 px uppercase com tracking largo** (`text-[9px]`, `text-[10px]`) em dezenas de lugares; o design system fixa "Tag/Label 10 px". Para o público-alvo (executivos 40+), em mobile, é ilegível.
- Corpo em `font-light` (300) sobre fundo escuro e variantes `on-surface-variant/40`, `/50`, `/60`: Lighthouse acusa `color-contrast` na home e no contato.
- `heading-order` falha (h4 sob h1 sem h2/h3), `link-name` falha (ícones sociais e o cadeado do rodapé sem `aria-label`), `select-name` falha no contato; 15 `<label>` e só 5 `htmlFor`.
- Foco visível existe (`:focus-visible` global) e o skip link existe: bom, manter.
- Motion ignora `prefers-reduced-motion` (ver 2.3).
- `theme-color` é `#0a0a0f`, mas a surface é `#060e20`/`#0b1326`: barra do navegador destoa.

### 3.4 Navegação e mobile

- Navbar com 7 itens + badge "35 anos" + idioma + CTA. No mobile só o hambúrguer sobra: o CTA "Contato" (`hidden sm:flex`) e o idioma (`hidden sm:flex`) desaparecem exatamente onde mais importam.
- Sem mega-menu de soluções: o comprador precisa de dois cliques para chegar a n.secops.
- `Breadcrumbs` existe mas só é usado em 2 páginas.
- `ScrollToTop` zera o scroll também no "voltar" do navegador (perde a posição na lista do blog/portfólio).
- Botão do chat (64 px + sombra) fica sobre CTAs no canto inferior direito em telas pequenas.
- Links do ecossistema (`ness.` ↔ `trustness.` ↔ `forense.io`) abrem em nova aba (`target="_blank"`): para marcas próprias, deveriam abrir na mesma aba.

### 3.5 Formulários e feedback

- Contato: 6 campos + select + consentimento. Placeholder "email ou telefone para retorno" num campo `type="email"` (contradição). Sem validação inline, sem máscara, sem honeypot/Turnstile, sem indicação de SLA de resposta.
- Telefone e e-mail são texto puro: sem `tel:`/`mailto:`. Sem WhatsApp (canal com maior conversão B2B no Brasil).
- Newsletter só no desktop (`hidden lg:block`), sem double opt-in.
- Chat: quick replies incluem "Ouvidoria DPO" (canal de denúncia) ao lado de "Falar com especialista" — mistura compliance com vendas e confunde.

---

## 4. Diagnóstico comercial (SEO, conversão, marca)

### 4.1 Aquisição orgânica

| Tema | Achado | Efeito |
|------|--------|--------|
| Indexabilidade | HTML vazio; título/descrição/canonical/JSON-LD só via JS (`usePageMeta`, `SchemaOrg`) | Google renderiza, mas com atraso e fila; Bing/LinkedIn/WhatsApp/GPT-crawlers não |
| Títulos | Home = "insights"; soluções = "solução"; contato = genérico (B-03/04/05) | As páginas que vendem não rankeiam pelos termos que vendem |
| Internacional | Idioma em `localStorage`; `hreflang` inválido (B-10) | Presença em 6 países sem uma URL indexável fora do PT |
| Multi-marca | `index.html` único; OG da ness. nos três domínios; rotas espelho (B-11/12) | Diluição entre domínios e social cards errados |
| Sitemap | Um arquivo com os três hosts, URLs fantasmas, sem `lastmod`, sem blog/portfólio dinâmico (B-06) | Sinais fracos e inconsistentes |
| Conteúdo | `solutionsData` só em PT e hardcoded (viola a regra de i18n da Constituição); blog depende de seed no D1; FAQ schema usado só no DPO | Pouca superfície indexável |
| Schema | Organization/WebSite/Service/Article/FAQ/Breadcrumb implementados (bom); `Article.author` = organização, `dateModified` = `datePublished`; `Service.url` usa `window.location.href` | Rich results parciais |

### 4.2 Conversão

- **Nenhum evento de conversão** (`gtag('event')` = 0; sem `dataLayer` push). Não é possível saber a taxa visita→lead, nem qual página/marca/idioma gera leads.
- Sem captura de `utm_*`, `referrer`, página de origem ou `gclid` nos formulários; o `ref` só existe quando a URL traz `?ref=`.
- Sem página/estado de "obrigado" estável para configurar meta de conversão.
- Lead magnet e assessment enviam `formType` ao canal, mas o front confirma sucesso mesmo em falha (B-14).
- Chatbot: RAG com streaming é um diferencial real, mas não captura lead (nome/e-mail/empresa) e o CSAT vale mais que o lead.
- Forense.io: quem chega com incidente ativo precisa de **telefone 24×7 no topo**, não de um chatbot aos 8 s.
- Trustness: o assessment LGPD (`/assessment/lgpd`) é o melhor funil do ecossistema, mas não é linkado do menu nem da home da ness.
- Não há prova social verificável (depoimentos, casos com números, logos autorizados, certificações), nem preço/ancoragem no DPO as a Service.

### 4.3 Credibilidade regulatória

- A vertical de privacidade (trustness/DPOaaS) carrega GA4 **sem banner de consentimento** e envia dados a Sentry (EUA). Para quem vende LGPD, isso é inconsistência visível a qualquer DPO que inspecione a página.
- `security.txt` OK; `Hiring` aponta para `/careers`, mas a rota é `/carreiras`.

---

## 5. Arquitetura-alvo

### 5.1 Renderização: HTML na edge (decisão central)

**Recomendação:** migrar para **React Router 7 em modo framework, SSR num Cloudflare Worker com Static Assets** (`@react-router/cloudflare`), mantendo React 19, Tailwind 4 e o código de páginas.

Por quê esta e não outras opções:

| Opção | Prós | Contras |
|-------|------|---------|
| **SSR na edge (recomendada)** | Uma implantação atende os 3 hostnames e os 3 idiomas; meta/OG/canonical/hreflang por request; loaders buscam D1/KV no servidor (blog e cases com HTML completo); streaming; HTML cacheável com `s-maxage` + purge por webhook do canal; TTFB < 100 ms em cache HIT; substitui `server.ts`, `functions/` e o proxy | Migração de `App.tsx`/rotas para `routes.ts` + loaders (2–3 semanas); precisa disciplina de `typeof window` |
| Pré-render estático (SSG) | Simples, zero servidor | 3 builds (uma por marca) ou 3 projetos Pages; blog/cases exigem rebuild a cada publicação; i18n por URL triplica o build |
| Manter SPA e só otimizar | Menor esforço | Teto de LCP ~2,5 s no mobile, SEO multi-marca/multi-idioma continua dependendo de JS |

Regras da migração:

- Marca detectada no **servidor** pelo `Host` (fallback `VITE_BRAND` só em dev). Cada marca tem `root` com `<title>`, OG, `theme-color`, JSON-LD e `sitemap.xml`/`robots.txt` próprios (rotas de recurso).
- Idioma **na URL**: `/` (pt), `/en/...`, `/es/...`. `hreflang` real, `<html lang>` correto. Sem redirect automático por `Accept-Language` (apenas sugestão discreta).
- Rotas espelho (`/trustness`, `/forense` na ness) viram **redirect 301** para o domínio da marca.
- `loader` das rotas de blog/portfólio/vagas lê D1 direto (o Worker tem o binding) com `Cache-Control: public, s-maxage=300, stale-while-revalidate=86400` e `cache.put` na Cache API; o canal chama `/api/revalidate` (webhook já existente em `webhooks-api.ts`) ao publicar.
- Erros e 404 reais (`throw data(null, { status: 404 })`) para slugs inválidos (B-07).

### 5.2 Orçamento de front-end

| Item | Orçamento |
|------|-----------|
| JS inicial (rota + shell) | ≤ 90 kB gz |
| CSS crítico | ≤ 25 kB gz, sem `@import` externo |
| Fontes | 2 famílias (Manrope display, Inter texto), 4–5 pesos, `woff2` subset latin/latin-ext, self-host, `preload` das 2 críticas, `font-display: swap` + `size-adjust` no fallback. Montserrat só no logo → logo em SVG |
| Imagem LCP | ≤ 120 kB, AVIF/WebP, `srcset` 640/1024/1600, `fetchpriority="high"`, `preload` com `imagesrcset` **apenas na home** |
| Fundos decorativos | 0 kB (gradiente/ruído CSS) ou ≤ 30 kB WebP com `loading="lazy"` |
| Mídia do CMS (R2) | via Cloudflare Image Transformations (`/cdn-cgi/image/width=...,format=auto/`) em um componente `<Img>` com `width`/`height`/`sizes` obrigatórios |
| Terceiros no caminho crítico | 0. GA4/LinkedIn Insight via **Cloudflare Zaraz** (server-side, gate de consentimento). Cloudflare Web Analytics para RUM sem cookie |
| Erros | Substituir `@sentry/react` no bundle por captura leve (`window.onerror` → endpoint no Worker → Analytics Engine/Logpush) ou carregar o SDK sob demanda com `tracesSampleRate` baixo (decisão do time; a Constituição favorece a primeira) |
| Motion | `LazyMotion` + `m` com `domAnimation`; sem animações infinitas; `MotionConfig reducedMotion="user"`; Navbar/Chat/Popup em CSS puro |
| Chat | Botão estático no HTML; widget carregado em `requestIdleCallback` ou no primeiro clique; config buscada só ao abrir; sem auto-open |

### 5.3 Dados, cache e observabilidade

- Cache API na edge para todas as leituras públicas; KV para `chatbot-config` e flags; purge por webhook.
- `_headers`: imagens e fontes `immutable` 1 ano (com hash no nome); HTML `s-maxage=300, stale-while-revalidate`; CSP sem `cdn.jsdelivr.net`, `img-src` restrito a `self`, `*.ness.com.br`, `*.r2.dev`; adicionar `Reporting-Endpoints` para CSP; remover `X-XSS-Protection`; Early Hints (103) ativado no painel para `preload` de CSS/fonte.
- RUM (Web Analytics) + CrUX no Search Console como fonte de verdade dos Core Web Vitals; dashboard semanal.
- Lighthouse CI em cada PR contra a URL de preview; `size-limit` no `npm test`.

### 5.4 Conversão e tracking

- **Plano de eventos** (nomes GA4): `cta_click{location,label,brand}`, `form_start{form}`, `form_submit{form,ref,utm_source,utm_campaign}`, `lead_magnet_download{slug}`, `assessment_start{type}`, `assessment_complete{type,level}`, `chat_open{trigger}`, `chat_lead`, `phone_click`, `whatsapp_click`, `newsletter_subscribe`, `ecosystem_click{to}`.
- Front envia via Zaraz (`zaraz.track`), o canal reenvia lead criado via GA4 Measurement Protocol (evento `generate_lead` server-side, imune a bloqueadores).
- Formulários: Turnstile (nativo Cloudflare) + honeypot; campos `utm_*`, `referrer`, `landing_page`, `brand`, `locale` persistidos no D1; validação `zod` no canal; resposta com `leadId`; rota `/obrigado` com próximos passos e agendamento.
- Notificação de lead (Resend + Slack) em < 5 min; SLA de retorno < 1 h útil exibido no formulário.
- Consentimento: banner leve (Zaraz Consent) — necessário para GA4; Web Analytics não precisa.

---

## 6. Plano de execução em ondas

Esforço em dias-pessoa (dp) de um dev sênior front/edge. Cada tarefa tem critério de aceite (CA).

### Onda 0 — Correções críticas (semana 1, ~5 dp) — sem mudar arquitetura

| # | Tarefa | Arquivos | CA | dp |
|---|--------|----------|----|----|
| 0.1 | Desligar `CelebrationPopup` (ou limitar à home, 1×/30 dias, sem bloquear, fechar com Esc) | `App.tsx`, `CelebrationPopup.tsx` | Nenhum overlay não solicitado em nenhuma rota | 0,5 |
| 0.2 | Chatbot: remover auto-open; abrir só por clique; 1 nudge discreto (badge) após 60 % de scroll em páginas de solução | `ChatbotWidget.tsx` | Zero aberturas automáticas; z-index abaixo de modais | 0,5 |
| 0.3 | Corrigir `usePageTitle` nas seções da home (só rotas definem meta); meta única por solução (`solutionsData` ganha `metaTitle`/`metaDescription`); `/contato`, `/blog`, `/portfolio`, `/carreiras` com meta e canonical próprios | `Home.tsx`, seções, `SolutionPage.tsx`, `Contact.tsx` | Título/descrição/canonical corretos em todas as rotas (teste Playwright) | 1 |
| 0.4 | Sitemap: remover URLs fantasmas; 1 sitemap por marca (`/sitemap.xml` servido por Pages Function conforme `Host`) incluindo blog/cases do D1 com `lastmod`; `hreflang` removido até existir URL por idioma | `functions/`, `public/sitemap.xml` | 0 URLs 404 no Search Console | 1 |
| 0.5 | Slug inválido em `/solucoes/:slug` → `NotFound` (404 real quando houver SSR) | `SolutionPage.tsx` | Teste e2e | 0,25 |
| 0.6 | `h1` trustness; cor padrão do chat `#00ade8`; `security.txt` `Hiring` → `/carreiras`; `theme-color` `#060e20` | vários | Revisão visual | 0,25 |
| 0.7 | Imagens locais: avatar → 128 px WebP (~4 kB); OG → 1200×630 ≤ 120 kB por marca; portfólio → 800 px WebP + AVIF ≤ 60 kB; extensões corretas; `_headers` com `immutable` para `/portfolio/*`, `/*.webp`, `/*.avif` | `public/`, `_headers` | Peso da home < 500 kB sem terceiros | 0,5 |
| 0.8 | Remover preload global do hero; `tel:`/`mailto:` clicáveis; sucesso do formulário persistente; `LeadMagnet` trata erro | `index.html`, `Contact.tsx`, `LeadMagnet.tsx` | Testes e2e | 0,5 |
| 0.9 | Ligar Cloudflare Web Analytics (RUM) nas três marcas; ativar Early Hints | painel CF + `index.html` | Dados de campo fluindo | 0,25 |
| 0.10 | Cache de API: `s-maxage=300, stale-while-revalidate=3600` + Cache API em `/api/insights`, `/api/cases`, `/api/jobs` | `functions/api/[[route]].ts` | `cf-cache-status: HIT` na 2ª chamada | 0,5 |

### Onda 1 — Performance de front (semanas 2–3, ~8 dp)

| # | Tarefa | CA | dp |
|---|--------|----|----|
| 1.1 | Self-host de fontes (Manrope 500/700, Inter 400/500, subset), `preload`, remover `@import`; logo em SVG (elimina Montserrat) | Sem requisição a `fonts.googleapis`; CLS = 0 | 1 |
| 1.2 | Hero local em AVIF/WebP com `srcset` + `preload` só na home; fundos decorativos → CSS ou WebP ≤ 30 kB lazy; remover Unsplash | 0 requisições a `images.unsplash.com` | 1 |
| 1.3 | Sentry fora do caminho crítico (import dinâmico após `load`, `tracesSampleRate: 0.05`) ou substituição por captura leve → Worker | `index-*.js` ≤ 45 kB gz | 1 |
| 1.4 | i18n: remover duplicação (recursos `pt` inline, `en`/`es` por `import()` com chunk próprio; sem `HttpBackend`); mover `solutionsData` para i18n | 1 carregamento por idioma; `solucoes` traduzível | 1,5 |
| 1.5 | Motion: `LazyMotion`/`m`; Navbar, Chat, Popup, Footer em CSS; remover animações infinitas; `MotionConfig reducedMotion="user"` | `motion` fora do bundle inicial; Speed Index < 4 s | 1,5 |
| 1.6 | Chat lazy (botão estático + `import()` no clique/idle; config só ao abrir) | Nenhum fetch de chat antes da interação | 0,5 |
| 1.7 | `vite.config.ts`: `manualChunks` por rota (não por biblioteca fixa), `build.target: 'es2022'`, `rollup-plugin-visualizer`, `size-limit` no CI | Relatório de bundle no PR; budget falha o CI | 0,5 |
| 1.8 | Logos de clientes self-host (SVG mono autorizados) ou remover a seção até ter autorização | 0 chamadas ao Clearbit | 0,5 |
| 1.9 | `_headers`/CSP endurecidos; remover `X-XSS-Protection`; `Reporting-Endpoints` | Mozilla Observatory A+ sem quebrar nada | 0,5 |

**Meta ao fim da Onda 1:** Lighthouse mobile ≥ 90 em produção, LCP lab ≤ 2,5 s, peso da home ≤ 450 kB, JS inicial ≤ 110 kB gz.

### Onda 2 — HTML na edge, SEO e i18n (semanas 4–7, ~15 dp)

| # | Tarefa | CA | dp |
|---|--------|----|----|
| 2.1 | Migrar para React Router 7 framework mode + Worker (`@react-router/cloudflare`, Static Assets); `routes.ts` com prefixo de idioma opcional; brand por `Host` | 3 domínios servidos por 1 Worker com HTML completo | 5 |
| 2.2 | Loaders para blog/cases/vagas lendo D1 com Cache API; `/api/revalidate` chamado pelo canal ao publicar | HTML do post contém o corpo; TTFB p75 ≤ 200 ms | 2 |
| 2.3 | Meta/OG/JSON-LD/canonical/hreflang por marca+idioma no servidor; OG image por marca (e por post, gerada no Worker) | Cards corretos no LinkedIn Post Inspector para os 3 domínios | 2 |
| 2.4 | Sitemaps e `robots.txt` por marca gerados no Worker; redirects 301 das rotas espelho; `www` → apex | Search Console sem erros de cobertura | 1 |
| 2.5 | i18n por URL com `en`/`es` reais (tradução de `solutionsData`, `assessments`, DPO, trustness/forense) | Páginas en/es indexadas | 3 |
| 2.6 | Substituir `server.ts`, `functions/` e proxies pelo Worker; limpar deps (`express`, `@react-router/serve`), `site/`, scripts soltos, `package.json` | `npm ls` sem deps não usadas; repo limpo | 1 |
| 2.7 | CI/CD: `npm ci` + cache; deploy de preview por PR (`wrangler versions upload`/Pages preview); Lighthouse CI com asserções (perf ≥ 90 mobile, LCP ≤ 2,5 s, TBT ≤ 200 ms, CLS ≤ 0,1); e2e do site (home, contato, assessment, chat, 404) contra preview; e2e do canal só em `workflow_dispatch` | PR bloqueado se orçamento estourar | 1 |

### Onda 3 — UX/UI e conversão (semanas 4–8, em paralelo, ~12 dp + design)

| # | Tarefa | CA | dp |
|---|--------|----|----|
| 3.1 | **Hero orientado a decisão** por marca: headline concreta (o que + para quem + prova), sub-headline com as 5 frentes, CTA primário ("agendar diagnóstico de 30 min") + secundário ("ver soluções"); forense: telefone 24×7 e WhatsApp acima da dobra | Teste A/B via Worker + KV (variantes), evento `cta_click` | 2 |
| 3.2 | Home reduzida a 6 seções: hero → barra de prova (35 anos, 6 países, certificações) → 5 soluções com resultado → como trabalhamos (3 passos) → casos com números + depoimentos → CTA final. Serviços/Verticais viram seções internas de Soluções/Sobre (rotas com redirect) | Scroll depth ≥ 50 % em mobile; home ≤ 5 telas | 2 |
| 3.3 | Tipografia e contraste: mínimo 12 px (labels), corpo 16 px peso 400, `on-surface-variant` ≥ /70; escala revisada em `DESIGN-SYSTEM.md` | axe 0 violações; Lighthouse a11y 100 | 1,5 |
| 3.4 | Navegação: mega-menu "Soluções" (5 itens + assessment), CTA e idioma visíveis no mobile, breadcrumbs em todas as internas, ecosystem switcher no lugar do pill fixo, links de marca na mesma aba, restauração de scroll no voltar | Teste de usabilidade com 5 pessoas do perfil | 1,5 |
| 3.5 | Formulários: 4 campos (nome, e-mail corporativo, empresa, mensagem), assunto inferido por `ref`, Turnstile + honeypot, validação inline, UTM/referrer ocultos, `/obrigado` com agendamento; newsletter no mobile com double opt-in | `form_submit`/`generate_lead` no GA4; spam < 2 % | 2 |
| 3.6 | Tracking: Zaraz + consentimento; eventos da seção 5.4; Measurement Protocol no canal; dashboard Looker Studio/GA4 por marca | Funil visível por marca/idioma/origem | 1,5 |
| 3.7 | Chat como canal de lead: quick replies só comerciais (especialista, diagnóstico, incidente); captura nome/e-mail/empresa antes de handoff; remover "Ouvidoria" (fica no rodapé) | `chat_lead` ≥ 10 % das conversas | 1 |
| 3.8 | Prova social: depoimentos (3 por marca), casos com métricas verificáveis, certificações, logos autorizados; substituir métricas não comprováveis | Página "casos" com ≥ 6 estudos | conteúdo |
| 3.9 | Assessment LGPD/Cyber linkados do menu e da home; resultado gera lead qualificado com score no D1 e sequência de e-mails (Resend) | `assessment_complete` ≥ 40 % dos `assessment_start` | 0,5 + conteúdo |

### Onda 4 — Growth contínuo (mês 3+)

- Conteúdo SEO: 12 artigos iniciais por marca focados em intenção comercial ("DPO as a service preço", "SOC 24x7 para empresa média", "perícia digital ransomware", "resposta a incidentes SLA"); FAQ schema em todas as soluções; páginas de vertical (saúde, energia, jurídico) cruzando caso + solução; RSS; autor e E-E-A-T na página Sobre.
- Speculation Rules / prefetch on hover das rotas (React Router `prefetch="intent"`).
- Personalização leve na edge (geo → sugestão de idioma; setor via `ref`).
- Programa de reviews (Google Business Profile, Clutch) e LocalBusiness schema.
- Nurture por Resend (lead magnet → 3 e-mails; assessment → 5 e-mails).

---

## 7. Metas, orçamento e governança

### 7.1 KPIs

| Camada | Métrica | Hoje (estimado) | 30 dias | 90 dias |
|--------|---------|-----------------|---------|---------|
| Técnica | LCP p75 mobile (CrUX) | ~4 s | ≤ 2,5 s | ≤ 2,0 s |
| Técnica | INP p75 | n/d | ≤ 200 ms | ≤ 150 ms |
| Técnica | CLS p75 | ~0 | ≤ 0,05 | ≤ 0,05 |
| Técnica | TTFB p75 (HTML) | 0,3–0,9 s | ≤ 400 ms | ≤ 200 ms (cache HIT ≥ 90 %) |
| Técnica | JS inicial gz | 196 kB | ≤ 110 kB | ≤ 90 kB |
| Técnica | Peso da home (mobile) | ~1,2 MB | ≤ 450 kB | ≤ 350 kB |
| Técnica | Lighthouse mobile Perf/A11y/SEO | 77/89/100* | 90/100/100 | 95/100/100 |
| UX | Violações axe (AA) | > 5 | 0 | 0 |
| UX | Bounce rate home | n/d | −15 % | −30 % |
| UX | Scroll depth 50 % em soluções | n/d | ≥ 40 % | ≥ 55 % |
| Comercial | Visita → lead | n/d (não medido) | medido | ≥ 2 % |
| Comercial | Leads/mês (3 marcas) | baseline | +50 % | +100 % |
| Comercial | Assessment completion | n/d | ≥ 30 % | ≥ 40 % |
| Comercial | Sessões orgânicas | baseline | +15 % | +50 % |
| Comercial | Páginas indexadas | ~25 (só pt) | ~40 | ~120 (3 marcas × 3 idiomas + blog) |
| Comercial | Speed-to-lead (notificação) | n/d | < 15 min | < 5 min |

\* SEO "100" do Lighthouse não detecta os bugs B-03/04/05/10/11.

### 7.2 Governança

- **Orçamento de performance** versionado (`.lighthouserc.json` + `size-limit`) e obrigatório no PR.
- **Revisão semanal** (15 min): CrUX/RUM, Search Console (cobertura, CWV), funil GA4 por marca.
- **Definição de pronto** para qualquer página nova: meta única, JSON-LD, imagem com `srcset`, sem terceiro no caminho crítico, axe 0, evento de CTA.
- Atualizar `DESIGN-SYSTEM.md` (escala tipográfica, motion, contraste) e a Constituição (sem terceiros no caminho crítico; i18n por URL; Cloudflare-native para telemetria).

---

## 8. Riscos e decisões pendentes

| Decisão | Recomendação | Quem decide |
|---------|--------------|-------------|
| SSR no Worker vs. manter Pages + SPA | SSR (seção 5.1). Alternativa de menor risco: prerender estático por marca | Tech lead |
| Sentry: manter (lazy) ou substituir por captura nativa Cloudflare | Substituir (Constituição IV); manter lazy se o time depender dos dashboards | Tech lead |
| Popup "35 anos" | Remover; usar o badge da navbar e uma seção na página Sobre | Marketing |
| Métricas "500+ / 200+ / 99.9 %" | Só publicar o que for comprovável; trocar por 3 números auditáveis | Direção |
| Logos de clientes | Obter autorização escrita e usar SVG local; até lá, depoimentos com nome/cargo | Comercial/Jurídico |
| WhatsApp Business como canal | Sim, para ness. e forense.io (incidentes) | Comercial |
| Preço de ancoragem no DPOaaS | Publicar "a partir de" para qualificar leads | Comercial |
| Consentimento de cookies | Zaraz Consent + Web Analytics sem cookie como base | DPO |
| Escopo de i18n | en/es completos para soluções, DPO, trustness, forense; blog conforme conteúdo | Marketing |

---

## Status de execução (2026-09-08, mesma sessão da análise)

**Ondas 0 e 1 implementadas** neste PR, mais um subconjunto das Ondas 2.7 e 3. A migração para HTML na edge saiu depois, no PR #6 (tasks 2.1 e 2.6 — ver abaixo). A instrumentação completa de conversão (3.5–3.7) permanece como próximo passo.

| Métrica (Lighthouse 12, mobile throttled, `vite preview`, mesma máquina) | Antes | Depois |
|---|---|---|
| Performance home / solução / contato | 79 / 77 / 77 | **85 / 84 / 91** |
| Acessibilidade home / solução / contato | 89 / 96 / 90 | **100 / 100 / 100** |
| Speed Index (home) | 22,3 s | **2,2 s** |
| FCP (home) | 2,7 s | **2,2 s** |
| LCP (home) | 3,2 s (sem fontes nem imagens carregadas) | 3,9 s (com fontes e hero reais; teto da SPA — cai com SSR) |
| TBT (home) | 80 ms | **50 ms** |
| Peso da home (local, sem terceiros) | 564 kB | **378 kB** (antes, em produção com Unsplash + Google Fonts + gtag: ~1,2 MB) |
| JS antes do 1º pixel (gz) | 196 kB | **122 kB** (Sentry 29 kB e Motion 46 kB agora fora do caminho crítico) |
| Requisições a terceiros no caminho crítico | Unsplash, Google Fonts, Clearbit, gtag | **0** (gtag após `load`, em idle) |
| Overlays não solicitados na 1ª visita | 2 (popup + chat) | **0** |
| Título da home | `insights — ness.` | `tecnologia digital de precisão — ness.` |
| Páginas de solução com meta própria | 0 de 5 | **5 de 5** |

> Os números "antes" locais subestimam o ganho real: no ambiente de medição as fontes e imagens externas estavam bloqueadas, então a versão antiga foi medida *sem* pagar por elas.

### Entregue

| Item do plano | O que foi feito |
|---|---|
| 0.1 / B-01 | `CelebrationPopup` removido do app (badge "35 anos" permanece na navbar) |
| 0.2 / B-02 | Chat sem auto-open; `ChatLauncher` estático carrega o widget só no clique; z-index abaixo de modais; "Ouvidoria" saiu dos quick replies; cor padrão `#00ade8` |
| 0.3 / B-03, B-04, B-05 | `usePageMeta` ganhou `enabled`; seções da home não sobrescrevem o título; meta única por solução (`metaTitle`/`metaDescription` em `solutionsData`); `/contato`, `/sobre` e 404 com meta próprios; robots sempre redefinido |
| 0.4 / B-06, B-10, B-11 | `functions/sitemap.xml.ts` e `functions/robots.txt.ts` por marca (Host), com blog/cases do D1 e `lastmod`; sem URLs fantasmas; sem hreflang inválido; `og:image` 1200×630 |
| 0.5 / B-07 | Slug inválido renderiza `NotFound` com `noindex` |
| 0.6 / B-08, B-09, B-13 | h1 da trustness; pill "‹ ness." removido; `theme-color`; `security.txt` |
| 0.7 / A-11, A-17, A-18, A-22 | Avatar 334 kB → 2,7 kB WebP; OG 429 kB → 33 kB JPEG (1200×630); portfólio 3,6 MB → 74–130 kB por imagem (+ WebP/AVIF); `_headers` com cache para `/img`, `/fonts`, `/portfolio` |
| 0.8 / B-14, B-15, B-16, A-46 | Preload global removido; `tel:`/`mailto:`; sucesso do formulário persistente com SLA; `LeadMagnet` trata erro |
| 0.10 / A-19 | Cache API + `s-maxage=300, stale-while-revalidate=3600` em `/api/insights` e `/api/cases` |
| 1.1 / A-14 | Fontes self-host (Inter e Manrope variáveis, subsets latin/latin-ext) com `preload` e fallback métrico; Google Fonts e Montserrat removidos |
| 1.2 / A-15, A-36 | Heroes das 3 marcas em AVIF/WebP com `srcset` (`HeroPicture`), preload por marca só na home; fundos decorativos em CSS (`.bg-nebula`); Unsplash removido |
| 1.3 / A-12 | Sentry carregado após `load` em idle, tree-shaken (476 → 85 kB raw) com amostragem |
| 1.4 / A-20 | i18n sem `HttpBackend`; en/es por `import()` em chunks próprios; `public/locales` removido |
| 1.5 / A-13, A-16, A-26, A-39 | `LazyMotion` + `m` com features assíncronas; Navbar/Chat/Hero em CSS; animações infinitas removidas; `MotionConfig reducedMotion="user"` |
| 1.7 | Chunking por uso (vendor estável, Sentry isolado), `target es2022`, sem polyfill de modulepreload |
| 1.8 / A-32 | Logos via Clearbit substituídos por wordmarks locais (setor por cliente) |
| 1.9 / A-37, A-38 | CSP sem `cdn.jsdelivr.net`, sem `img-src https:` curinga, sem Google Fonts; `X-XSS-Protection` removido |
| 2.7 (parcial) / A-41, A-42 | `npm ci` + cache no deploy; e2e do site (`tests/site/smoke.spec.ts`) contra preview local em cada PR; e2e do canal só em `workflow_dispatch` |
| 3.1 (parcial) | Hero com subtítulo concreto (o que + para quem), CTA primário "falar com um especialista", 5 pilares visíveis antes da rolagem |
| 3.3 / A-23, A-24, A-25 | Tamanho mínimo 11 px; opacidades `/40–/50` elevadas; `label for` em todos os campos; `aria-label` em ícones; ordem de headings; Lighthouse a11y 100 |
| 3.4 (parcial) / A-28, A-47, A-48 | CTA visível no mobile; menu mobile em CSS com Esc e trava de scroll; links de marca na mesma aba; scroll preservado no "voltar" |
| A-33 (parcial) | gtag só após `load` e sem `page_view` automático (consentimento via Zaraz fica para a Onda 3.6) |

### Onda 2 — HTML na edge (PR #6, 2026-09-08)

Tasks **2.1 e 2.6 entregues juntas**: são a mesma virada, porque ao sair do
Cloudflare Pages a pasta `functions/` deixa de existir e precisa nascer dentro
do Worker no mesmo commit.

| Entregue | O quê |
|---|---|
| 2.1 | React Router 7 em modo framework + Worker com Static Assets; `src/routes.ts` (com `lang` preparado para a 2.5); marca resolvida pelo `Host` no loader da raiz; meta/og/canonical por marca no servidor (fecha B-11) |
| 2.6 | `server.ts`, `functions/` e o proxy de dev substituídos por `workers/app.ts`; `express`, `@hono/node-server` e `dotenv` fora das dependências |
| extra | 404 real (sem rota coringa; rotas só-ness devolvem 404 nos outros domínios); CSP com nonce por requisição em vez de `unsafe-inline`; deploy e preview por PR migrados para `wrangler deploy` |

LCP do preview (Lighthouse mobile, 3 rodadas): **2,76 s** — ainda acima da meta
de 2,5 s, que depende das ondas 2.2 (loaders no servidor) e de imagens.

**Virada de produção pendente e manual:** apontar ness.com.br,
trustness.com.br e forense.io para o Worker. Sem `routes` na `wrangler.toml`,
o deploy publica só em workers.dev e os domínios seguem no Pages.

### Próximos passos (ordem recomendada)

1. Onda 2.2–2.5: loaders lendo D1 com Cache API, meta por página no servidor,
   sitemaps e redirects no Worker, i18n por URL (`/en`, `/es`).
2. Onda 3.5–3.7: Turnstile, UTM, `/obrigado`, Zaraz + consentimento, eventos e Measurement Protocol; chat como canal de lead.
3. Onda 0.9: ligar Cloudflare Web Analytics (token no painel) e Early Hints.
4. Onda 3.8–3.9: prova social, casos com números, assessments no menu.
5. Lighthouse CI com asserções no PR (Onda 2.7 restante).

---

## Apêndice A — Inventário de achados

Severidade: **P0** bloqueia conversão/SEO; **P1** custo alto de performance/UX; **P2** melhoria.

| ID | Sev | Camada | Achado | Evidência |
|----|-----|--------|--------|-----------|
| A-01 | P0 | UX/Com | Popup de celebração em todas as rotas | `App.tsx:66`, screenshots |
| A-02 | P0 | UX/Com | Chat auto-open por cima de modal | `ChatbotWidget.tsx:49-75` |
| A-03 | P0 | SEO | Título da home sobrescrito por seções | `Home.tsx`, Playwright: `insights — ness. — ness. IT Company` |
| A-04 | P0 | SEO | Soluções com meta idêntica | `SolutionPage.tsx:28` |
| A-05 | P0 | SEO | `/contato` sem meta e canonical herdado | Playwright: canonical `https://ness.com.br/` |
| A-06 | P0 | SEO | Sitemap com URLs inexistentes | `sitemap.xml` vs `solutionsData` |
| A-07 | P0 | SEO | en/es não indexáveis; hreflang inválido | `i18n.ts:718-724`, `sitemap.xml` |
| A-08 | P0 | SEO | OG/título únicos para 3 domínios (sem SSR) | `index.html`, `curl` nos 3 hosts |
| A-09 | P0 | Com | Zero eventos de conversão | `grep gtag(` = 0 |
| A-10 | P0 | Com | Sem Turnstile/honeypot/UTM/obrigado | `Contact.tsx`, `LeadMagnet.tsx` |
| A-11 | P1 | Perf | Avatar 334 kB em todas as páginas | `public/gabi-avatar.png` |
| A-12 | P1 | Perf | Sentry no bundle inicial | `main.tsx`, 79 refs em `index-*.js` |
| A-13 | P1 | Perf | `motion` 42 kB gz sempre carregado | `vite.config.ts` manualChunks |
| A-14 | P1 | Perf | Google Fonts via `@import` no CSS | `index.css:1` |
| A-15 | P1 | Perf | Fundos Unsplash 500 kB a 10–30 % opacidade | 9 arquivos, `curl` 504–520 kB |
| A-16 | P1 | Perf | Animações infinitas com blur | `Hero.tsx:36-45`; Speed Index 21 s |
| A-17 | P1 | Perf | Portfólio 3,6 MB | `public/portfolio/*` |
| A-18 | P1 | Perf | OG 429 kB 1024×1024 | `public/og-image.png` |
| A-19 | P1 | Perf | API pública sem cache na edge | `functions/api/[[route]].ts` |
| A-20 | P1 | Perf | i18n duplicado (inline + HTTP) | `i18n.ts:709-731` |
| A-21 | P1 | Perf | Chat busca config e carrega em todas as páginas | `ChatbotWidget.tsx:78` |
| A-22 | P1 | Perf | Sem cache em imagens de `public/` | `_headers` |
| A-23 | P1 | UX | Labels 9–10 px uppercase | `Navbar.tsx`, `Contact.tsx`, DS |
| A-24 | P1 | UX | Contraste `/40`–`/60` | Lighthouse `color-contrast` |
| A-25 | P1 | UX | `label` sem `htmlFor`, `select-name`, `link-name` | Lighthouse a11y 89–90 |
| A-26 | P1 | UX | Motion ignora reduced-motion | 0 usos de `useReducedMotion` |
| A-27 | P1 | UX | Home com 9 seções / 8.800 px mobile | screenshot full-page |
| A-28 | P1 | UX | CTA e idioma escondidos no mobile | `Navbar.tsx` `hidden sm:flex` |
| A-29 | P1 | UX | Pill "ness." sobre a navbar | `trustness/Home.tsx:21` |
| A-30 | P1 | Com | Forense sem telefone/WhatsApp na dobra | `forense/Home.tsx` |
| A-31 | P1 | Com | Métricas sem prova | `Metrics.tsx` |
| A-32 | P1 | Com | Logos via Clearbit | `ClientLogos.tsx` |
| A-33 | P1 | Com | GA4 sem consentimento na marca de privacidade | `index.html` |
| A-34 | P1 | Com | LeadMagnet confirma sucesso em falha | `LeadMagnet.tsx:47` |
| A-35 | P1 | Com | Assessment não linkado do menu/home | `Navbar.tsx` |
| A-36 | P2 | Perf | Preload do hero em todas as rotas | `index.html:11` |
| A-37 | P2 | Perf | CSP com `cdn.jsdelivr.net` e `img-src https:` | `_headers` |
| A-38 | P2 | Perf | `X-XSS-Protection` obsoleto | `_headers` |
| A-39 | P2 | Perf | `AnimatePresence` sem key | `App.tsx:69` |
| A-40 | P2 | Perf | Deps de servidor no bundle de deps | `package.json` |
| A-41 | P2 | CI | `npm install` no deploy; sem preview; sem Lighthouse CI | `.github/workflows/deploy.yml` |
| A-42 | P2 | CI | e2e roda contra produção em cada PR | `playwright.config.ts` |
| A-43 | P2 | Hig | `site/` Next.js morto; scripts soltos; `react-example` | raiz do repo |
| A-44 | P2 | UX | `theme-color` fora da paleta | `index.html:20` |
| A-45 | P2 | UX | Sucesso do form some em 3 s | `Contact.tsx:180` |
| A-46 | P2 | UX | Sem `tel:`/`mailto:` | `Contact.tsx` |
| A-47 | P2 | UX | Links de marca em nova aba | `Footer.tsx` |
| A-48 | P2 | UX | ScrollToTop no voltar | `ScrollToTop.tsx` |
| A-49 | P2 | UX | "Ouvidoria" como quick reply de vendas | `ChatbotWidget.tsx:328` |
| A-50 | P2 | UX | Newsletter só desktop | `Footer.tsx` `hidden lg:block` |
| A-51 | P2 | SEO | Slug inválido = loading infinito | `SolutionPage.tsx:38` |
| A-52 | P2 | SEO | `h1` trustness sem separador | `trustness/Home.tsx` |
| A-53 | P2 | SEO | `security.txt` Hiring → `/careers` | `.well-known/security.txt` |
| A-54 | P2 | SEO | `Article.author` = org; `dateModified` = `datePublished` | `SchemaOrg.tsx` |
| A-55 | P2 | SEO | `solutionsData` só em PT (viola Constituição III/i18n) | `solutionsData.ts` |
| A-56 | P2 | Com | Chat verde `#00E5A0` fora da paleta | `ChatbotWidget.tsx:222` |
| A-57 | P2 | Com | Sem depoimentos/certificações | home das 3 marcas |
| A-58 | P2 | Com | Sem SLA de resposta no formulário | `Contact.tsx` |

## Apêndice B — Medições brutas

```
Build (vite 6.2, 5,5 s):
  index-*.js       335,5 kB  gz 108,5 kB
  motion-*.js      129,3 kB  gz  42,6 kB
  BlogPost-*.js    121,2 kB  gz  37,5 kB   (react-markdown, lazy — OK)
  i18n-*.js         66,0 kB  gz  22,1 kB
  SolutionPage-*.js 51,4 kB  gz  16,6 kB
  vendor-*.js       49,5 kB  gz  17,4 kB
  ui-*.js           30,0 kB  gz   6,7 kB
  index-*.css      152,1 kB  gz  20,0 kB

Lighthouse 12 mobile, vite preview, sem terceiros (bloqueados):
  /                 Perf 79  A11y 89  BP 96  SEO 100  FCP 2,7s  LCP 3,2s  TBT 80ms  CLS 0  SI 22,3s  564 kB
  /solucoes/secops  Perf 77  A11y 96  BP 96  SEO 100  FCP 2,8s  LCP 3,4s  TBT 60ms  CLS 0  SI 21,3s  572 kB
  /contato          Perf 77  A11y 90  BP 96  SEO 100  FCP 2,7s  LCP 3,3s  TBT 90ms  CLS 0  SI 21,2s  557 kB

Produção (curl, do container):
  ness.com.br       200  TTFB 0,89s  cf-cache-status DYNAMIC
  trustness.com.br  200  TTFB 0,53s  cf-cache-status DYNAMIC
  forense.io        200  TTFB 0,34s  cf-cache-status DYNAMIC
  canal.ness.com.br 200  TTFB 0,51s  cf-cache-status HIT

Externos:
  hero unsplash webp w=2000 q=60 → 174,7 kB
  fundo unsplash jpeg w=2000 q=80 → 504–520 kB (×9 páginas)
  fonts.googleapis css2 (3 famílias, 9 pesos) → 2 kB CSS + woff2 sob demanda
```
