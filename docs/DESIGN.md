# DESIGN.md — ness. Design System

> Documento de referência do design system utilizado nos 3 domínios: **ness.com.br**, **trustness.com.br** e **forense.io**.

---

## 1. Brand Architecture

Uma única codebase React (Vite + Tailwind v4) servindo 3 marcas via detecção de hostname:

| Marca | Domínio | Posicionamento |
|-------|---------|----------------|
| **ness.** | ness.com.br | Holding — tecnologia digital de precisão |
| **trustness.** | trustness.com.br | GRC, compliance e privacidade (LGPD) |
| **forense.io** | forense.io | Perícia digital e resposta a incidentes |

A marca é detectada em runtime (`src/config/brand.ts`) e customiza navbar, footer, rotas e schema SEO.

---

## 2. Filosofia de Design

### Princípios

1. **Midnight Precision** — estética escura, minimalista, profissional
2. **Invisible when it works** — UI que não distrai, funciona 
3. **Blue Dot (`.`)** — assinatura visual da ness (ponto azul após títulos)
4. **Lowercase everything** — toda tipografia de heading é lowercase por convenção
5. **Glassmorphism sutil** — superfícies semi-transparentes com backdrop blur

### Anti-patterns (o que NÃO fazer)

- ❌ Cores vibrantes/saturadas fora da paleta
- ❌ Purple/violet em qualquer variação
- ❌ Layouts genéricos de template
- ❌ Texto em uppercase (exceto tags pequenas `tracking-widest`)
- ❌ Bordas visíveis (usar `border-white/5` ou `/10` no máximo)

---

## 3. Paleta de Cores

Baseada em Material Design 3 tokens adaptados para dark mode:

### Superfícies (backgrounds)

```
surface                  #0b1326    ← base principal
surface-container-lowest #060e20    ← seções escuras/hero
surface-container-low    #0f172a    ← cards, containers
surface-container-high   #222a3d    ← inputs, hover states
surface-container-highest #333c52   ← scrollbar, dividers
```

### Primárias (accent)

```
primary                  #7bd0ff    ← links, ícones secundários
primary-container        #00ade8    ← CTAs, botões, badges, BlueDot
```

### Texto

```
on-surface               #dae2fd    ← texto principal (quase branco)
on-surface-variant       #87929a    ← texto secundário (cinza)
on-primary               #003549    ← texto sobre primary-container
```

### Uso contextual

| Contexto | Cor | Exemplo |
|----------|-----|---------|
| CTA principal | `bg-white text-surface` | Botão "começar agora" |
| CTA secundário | `bg-primary-container text-on-primary` | Botão "explorar" |
| Tag/label | `text-primary-container text-[10px] uppercase tracking-widest` | Seção headers |
| Emergência/CIRT | `bg-red-500/10 text-red-400` | Botão incidente |
| Sucesso | `text-green-400` | Indicadores |

---

## 4. Tipografia

### Font Stack

```css
--font-sans:    "Inter", ui-sans-serif, system-ui     /* Body text */
--font-display: "Manrope", sans-serif                  /* Headings */
--font-brand:   "Montserrat", sans-serif               /* Logo/brand */
```

### Escala

| Elemento | Classe | Peso |
|----------|--------|------|
| Hero title | `text-5xl md:text-7xl font-display font-bold` | 700-800 |
| Section title | `text-3xl md:text-5xl font-display font-medium` | 500 |
| Card title | `text-xl font-display font-medium` | 500 |
| Body | `text-sm md:text-base font-sans font-light` | 300 |
| Tag | `text-[10px] uppercase tracking-widest font-bold` | 700 |

### Convenções

- Headings são sempre `lowercase` (classe `.lowercase-all` ou `lowercase`)
- Body text usa `font-light leading-relaxed`
- Links usam `text-primary hover:text-primary-container transition-colors`

---

## 5. Componentes

### 5.1 BlueDot

```tsx
<BlueDot />
```

Ponto azul animado (`primary-container`) usado após títulos como assinatura visual.

### 5.2 Glass Card

```html
<div class="glass rounded-3xl p-8">
  <!-- bg-surface-container-highest/60 backdrop-blur-xl border border-white/10 -->
</div>
```

### 5.3 Nebula Shadow

```html
<div class="nebula-shadow">
  <!-- box-shadow: 0 20px 40px rgba(0, 173, 232, 0.08) -->
</div>
```

### 5.4 Section Pattern

```tsx
<section className="py-24 px-8 bg-surface border-t border-white/5">
  <div className="max-w-7xl mx-auto">
    <span className="text-[10px] text-primary-container font-bold uppercase tracking-widest block mb-3">
      tag label
    </span>
    <h2 className="text-3xl md:text-5xl font-display font-medium text-white tracking-tighter lowercase">
      título da seção<BlueDot />
    </h2>
    <p className="mt-4 text-on-surface-variant max-w-2xl font-light">descrição</p>
  </div>
</section>
```

### 5.5 CTA Button Variants

```tsx
{/* Primary (white) */}
<button className="bg-white text-surface px-10 py-5 rounded-full font-display font-semibold uppercase tracking-widest text-sm hover:bg-primary-container hover:text-on-primary hover:scale-105 transition-all">
  começar agora
</button>

{/* Secondary (outline) */}
<button className="border border-white/10 text-white px-8 py-4 rounded-full hover:bg-white/5 transition-all">
  saiba mais
</button>
```

---

## 6. Layout & Spacing

### Grid

- Container: `max-w-7xl mx-auto` (1280px)
- Narrow: `max-w-5xl mx-auto` (1024px)
- Section padding: `py-24 px-8`
- Card grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### Border Radius

| Uso | Classe |
|-----|--------|
| Botões | `rounded-full` |
| Cards grandes | `rounded-3xl` ou `rounded-[2.5rem]` |
| Cards médios | `rounded-2xl` |
| Inputs | `rounded-xl` |
| Tags/badges | `rounded-full` |

### Separadores

- Entre seções: `border-t border-white/5`
- Dentro de cards: `border border-white/10`
- Hover: `border-primary-container/20`

---

## 7. Animações

### Framework

`motion/react` (Framer Motion) para todas as animações.

### Padrões

```tsx
// Fade-in ao entrar na viewport
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: i * 0.08 }}
/>

// Page transition
<AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  />
</AnimatePresence>

// Hover scale
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} />
```

### Performance

- Todas as animações usam `viewport={{ once: true }}` (não re-anima)
- Stagger com `delay: i * 0.08` para listas
- Sem animações pesadas em mobile

---

## 8. Responsividade

### Breakpoints (Tailwind defaults)

| Prefix | Width | Uso |
|--------|-------|-----|
| (base) | 0px+ | Mobile first |
| `md:` | 768px+ | Tablet |
| `lg:` | 1024px+ | Desktop |

### Padrões responsivos

- Hero: `text-4xl md:text-6xl lg:text-8xl`
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Padding: `px-6 md:px-8`
- Navbar: hamburger mobile → links inline desktop

---

## 9. SEO & Schema

### Meta Tags

- Cada página usa `usePageTitle()` que gera `<title>` dinâmico por brand
- OG Image: `/og-image.png`
- Schema JSON-LD via `<SchemaOrg>` component

### Schema Types

| Tipo | Página |
|------|--------|
| `organization` | Home |
| `website` | Default |
| `service` | Solutions |
| `article` | Blog posts |
| `faqPage` | DPO Service |

---

## 10. Internacionalização

- Framework: `react-i18next` com `LanguageDetector`
- Idiomas: `pt` (default), `en`, `es`
- Traduções inline em `src/i18n.ts` (~2100 linhas)
- Chatbot respeita idioma do usuário via `locale` no body da API

---

## 11. Performance

### Code Splitting

Todas as páginas são `lazy()` com `<Suspense>` e skeleton loader (PageLoader).

### Bundle Analysis

```
index.js          280 KB (87 KB gzip)   ← core + i18n
motion.js         129 KB (42 KB gzip)   ← animations
SolutionPage.js    52 KB (16 KB gzip)   ← largest page
BlogPost.js       121 KB (37 KB gzip)   ← markdown renderer
```

### Caching

- Assets: Vite content hash → immutable cache
- API: CF Pages Functions → Edge Cache para reads públicos
- Images: Clearbit logos com `brightness-0 invert` CSS filter

---

## 12. Iconografia

**Lucide React** — ícones outlined, consistentes, lightweight.

Convenções:
- Tamanho default: `size={20}`
- Hero icons: `size={28}` ou `size={32}`
- Cor: herda do parent (`text-primary-container`, etc.)
- Todos os botões de ícone têm `aria-label`

---

## 13. File Structure

```
src/
├── components/          # UI reutilizável
│   ├── BlueDot.tsx      # Assinatura visual
│   ├── Navbar.tsx       # Multi-brand navigation
│   ├── Footer.tsx       # Multi-brand footer
│   ├── ChatbotWidget.tsx # Gabi.OS chatbot
│   ├── LeadMagnet.tsx   # Email capture modal
│   ├── ClientLogos.tsx  # Social proof
│   ├── SchemaOrg.tsx    # SEO structured data
│   └── solutions/       # Solution-specific components
├── pages/               # Route-level pages
│   ├── trustness/       # trustness-only pages
│   └── forense/         # forense-only pages
├── config/
│   ├── brand.ts         # Brand detection
│   └── api.ts           # API base URL
├── data/
│   ├── solutionsData.ts # Static solution definitions
│   └── assessments.ts   # Quiz data
├── hooks/
│   └── usePageTitle.ts  # Dynamic title + SEO
├── i18n.ts              # Translations (pt/en/es)
├── index.css            # Design tokens + utilities
└── App.tsx              # Router + layout
```
