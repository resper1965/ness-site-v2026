# DESIGN-SYSTEM.md — ness. Universal Design System

> **Documento anterior (24/04/2026), mantido como histórico.** O design system
> vigente está em [`DESIGN.md`](../DESIGN.md), na raiz, gerado do que está no
> ar. Onde os dois divergirem, vale o da raiz.

> Guia universal de identidade visual e design system para aplicação em **todos os contextos**: site, relatórios, apresentações, emails, documentos, dashboards e materiais impressos.

---

## 1. Identidade de Marca

### 1.1 Arquitetura de Marcas

```
                    ness.
              ┌──────┼──────┐
         trustness.    forense.io
```

| Marca | Posicionamento | Tom de Voz |
|-------|----------------|------------|
| **ness.** | Holding — tecnologia digital de precisão (desde 1991) | Técnico, confiante, minimalista |
| **trustness.** | GRC, compliance, privacidade (LGPD) | Autoritativo, transparente, regulatório |
| **forense.io** | Perícia digital e resposta a incidentes | Urgente, preciso, investigativo |

### 1.2 Assinatura Visual

A assinatura da marca é sempre escrita em **lowercase** seguida de um ponto (`.`):

```
✅ ness.           ✅ trustness.          ✅ forense.io
❌ Ness            ❌ TRUSTNESS           ❌ Forense.IO
❌ NESS.           ❌ TrustNess.          ❌ FORENSE.IO
```

### 1.3 BlueDot `.`

O **ponto azul** (`#00ade8`) após o nome da marca é a assinatura visual mais importante. Ele aparece:

- Após títulos de seção no site
- No logotipo da marca
- Como separador visual em relatórios
- Como bullet point customizado em listas formais

> **Regra:** O BlueDot é sempre na cor `primary-container` (`#00ade8`). Nunca usar em preto, cinza ou qualquer outra cor.

---

## 2. Paleta de Cores

### 2.1 Cores Primárias (Dark Mode — Padrão)

| Token | Hex | RGB | Uso |
|-------|-----|-----|-----|
| `surface` | `#0b1326` | `11, 19, 38` | Background principal |
| `surface-container-lowest` | `#060e20` | `6, 14, 32` | Hero, seções escuras |
| `surface-container-low` | `#0f172a` | `15, 23, 42` | Cards, containers |
| `surface-container-high` | `#222a3d` | `34, 42, 61` | Inputs, hover |
| `surface-container-highest` | `#333c52` | `51, 60, 82` | Dividers, scrollbar |
| `primary` | `#7bd0ff` | `123, 208, 255` | Links, ícones |
| `primary-container` | `#00ade8` | `0, 173, 232` | CTAs, BlueDot, badges |
| `on-surface` | `#dae2fd` | `218, 226, 253` | Texto principal |
| `on-surface-variant` | `#87929a` | `135, 146, 154` | Texto secundário |
| `on-primary` | `#003549` | `0, 53, 73` | Texto sobre primary |

### 2.2 Cores de Suporte

| Função | Cor | Hex | Uso |
|--------|-----|-----|-----|
| Sucesso | Verde | `#4ade80` | Indicadores positivos |
| Alerta | Âmbar | `#fbbf24` | Avisos, warnings |
| Erro / CIRT | Vermelho | `#ef4444` | Emergências, erros |
| Info | Azul claro | `#60a5fa` | Informações neutras |

### 2.3 Cores para Light Mode (Relatórios / Impressão)

Para documentos em papel ou PDFs com fundo claro:

| Token | Hex | Uso |
|-------|-----|-----|
| `surface-light` | `#f8fafc` | Background (quase branco) |
| `surface-container-light` | `#f1f5f9` | Cards, blocos |
| `text-primary-light` | `#0f172a` | Texto principal (quase preto) |
| `text-secondary-light` | `#64748b` | Texto secundário |
| `accent-light` | `#0284c7` | Primary adaptado para leitura |
| `accent-strong-light` | `#0369a1` | CTAs em fundo claro |
| `border-light` | `#e2e8f0` | Bordas e separadores |

> **Regra de impressão:** Nunca usar fundo escuro como padrão em relatórios impressos. O `surface` (#0b1326) é reservado para covers, headers e blocos de destaque.

### 2.4 Proibições Cromáticas

| ❌ Proibido | Motivo |
|-------------|--------|
| Purple / Violet (qualquer tom) | Conflito com identidade — a ness. é azul |
| Cores neon saturadas | Destroem a estética "Midnight Precision" |
| Gradientes multicoloridos | Fora da personalidade minimalista |
| Preto puro (`#000000`) | Muito duro — usar `#060e20` ou `#0f172a` |
| Branco puro (`#ffffff`) em dark mode | Muito agressivo — usar `#dae2fd` |

---

## 3. Tipografia

### 3.1 Font Stack

| Função | Fonte | Peso | Uso |
|--------|-------|------|-----|
| **Display** | Manrope | 500–800 | Títulos, headings, hero |
| **Body** | Inter | 300–500 | Textos corridos, parágrafos |
| **Brand** | Montserrat | 500 | Logotipo, assinatura da marca |
| **Code** | JetBrains Mono | 400 | Código, terminal, configs |

### 3.2 Escala Tipográfica

| Nível | Tamanho | Peso | Letter Spacing | Line Height |
|-------|---------|------|----------------|-------------|
| Display XL | 72px / 4.5rem | Bold (700–800) | -0.04em | 1.1 |
| Display | 48px / 3rem | Bold (700) | -0.03em | 1.15 |
| H1 | 36px / 2.25rem | SemiBold (600) | -0.025em | 1.2 |
| H2 | 30px / 1.875rem | Medium (500) | -0.02em | 1.25 |
| H3 | 24px / 1.5rem | Medium (500) | -0.015em | 1.3 |
| H4 | 20px / 1.25rem | Medium (500) | -0.01em | 1.35 |
| Body Large | 18px / 1.125rem | Light (300) | 0 | 1.6 |
| Body | 16px / 1rem | Light (300) | 0 | 1.6 |
| Body Small | 14px / 0.875rem | Regular (400) | 0 | 1.5 |
| Caption | 12px / 0.75rem | Regular (400) | 0.02em | 1.4 |
| Tag/Label | 10px / 0.625rem | Bold (700) | 0.1em | 1 |

### 3.3 Convenções Tipográficas

```
✅ Headings em lowercase         → "infraestrutura crítica."
✅ Body em font-light            → legibilidade suave
✅ Tags em UPPERCASE tracking    → "CIBERSEGURANÇA"
✅ Números em tabular nums       → alinhamento vertical

❌ Headings em UPPERCASE         → agressivo demais
❌ Body em font-bold             → cansativo
❌ Itálico excessivo             → ruído visual
```

---

## 4. Spacing & Layout

### 4.1 Escala de Espaçamento

Baseada em múltiplos de 4px:

| Token | Valor | Uso |
|-------|-------|-----|
| `xs` | 4px | Gaps mínimos |
| `sm` | 8px | Padding interno de badges |
| `md` | 16px | Padding interno de cards |
| `lg` | 24px | Gap entre elementos |
| `xl` | 32px | Margem entre seções |
| `2xl` | 48px | Padding de seção |
| `3xl` | 64px | Espaço entre blocos maiores |
| `4xl` | 96px | Padding vertical de seções |

### 4.2 Grid System

| Contexto | Largura Máxima | Colunas |
|----------|---------------|---------|
| Site — Container | 1280px | 12 colunas |
| Site — Narrow | 1024px | 8 colunas |
| Relatório — A4 | 210mm | 2 colunas |
| Relatório — Letter | 8.5in | 2 colunas |
| Dashboard | 100% viewport | 12 colunas |
| Email | 600px | 1–2 colunas |

### 4.3 Margens de Página (Impressão)

| Tipo | Margens |
|------|---------|
| Relatório formal | 25mm (todas) |
| Relatório técnico | 20mm (topo/base), 25mm (laterais) |
| Proposta comercial | 30mm (topo), 20mm (laterais), 25mm (base) |

---

## 5. Componentes Visuais

### 5.1 Cards

#### Dark Mode (Web / Dashboard)
```
┌─────────────────────────────┐
│  bg: surface-container-low  │
│  border: white/10           │
│  radius: 24px (rounded-3xl) │
│  padding: 32px              │
│  shadow: nebula-shadow      │
└─────────────────────────────┘
```

#### Light Mode (Relatórios / PDF)
```
┌─────────────────────────────┐
│  bg: #f8fafc                │
│  border: #e2e8f0            │
│  radius: 8px                │
│  padding: 24px              │
│  shadow: 0 1px 3px #0001    │
└─────────────────────────────┘
```

### 5.2 Tabelas

#### Estilo "Midnight" (dark)

| Elemento | Valor |
|----------|-------|
| Header bg | `surface-container-high` (#222a3d) |
| Header text | `on-surface` (#dae2fd), Bold |
| Row bg (par) | `surface-container-low` (#0f172a) |
| Row bg (ímpar) | `surface` (#0b1326) |
| Border | `white/5` |
| Highlight row | `primary-container/10` |

#### Estilo "Clean" (light — relatórios)

| Elemento | Valor |
|----------|-------|
| Header bg | `#f1f5f9` |
| Header text | `#0f172a`, SemiBold |
| Row bg (par) | `#ffffff` |
| Row bg (ímpar) | `#f8fafc` |
| Border | `#e2e8f0` |
| Highlight row | `#dbeafe` |

### 5.3 Botões / CTAs

| Variante | Background | Texto | Border Radius |
|----------|-----------|-------|---------------|
| Primary | `#ffffff` | `#0b1326` | Full (pill) |
| Secondary | Transparente | `#ffffff` | Full (pill) |
| Accent | `#00ade8` | `#003549` | Full (pill) |
| Danger / CIRT | `#ef4444/10` | `#f87171` | Full (pill) |
| Ghost | Transparente | `#7bd0ff` | — |

### 5.4 Badges & Tags

```
┌──────────────────┐
│  CIBERSEGURANÇA  │   → 10px, UPPERCASE, tracking 0.1em
│  bg: primary/10  │   → font-bold, primary-container color
│  radius: full    │
│  px: 12, py: 4   │
└──────────────────┘
```

### 5.5 Separadores

| Contexto | Implementação |
|----------|--------------|
| Entre seções (dark) | `1px solid rgba(255,255,255,0.05)` |
| Dentro de cards (dark) | `1px solid rgba(255,255,255,0.10)` |
| Em relatórios (light) | `1px solid #e2e8f0` |
| Decorativo (BlueDot line) | Linha fina com BlueDot no centro |

---

## 6. Iconografia

### 6.1 Biblioteca Padrão

**Lucide React** — ícones outlined, consistentes, 24x24 base.

### 6.2 Tamanhos

| Contexto | Tamanho | Exemplo |
|----------|---------|---------|
| Inline com texto | 16px | Breadcrumb icons |
| Default (UI) | 20px | Botões, menus |
| Feature cards | 24px | Cards de serviço |
| Hero / destaque | 28–32px | Seções hero |
| Relatório (ícone isolado) | 40–48px | Cover de relatório |

### 6.3 Regras

- Cor herda do contexto (parent `color`)
- `stroke-width`: 1.5 (padrão) ou 2 (emphasis)
- Sempre incluir `aria-label` em botões de ícone
- Em relatórios PDF, usar versões SVG exportadas

---

## 7. Aplicação por Contexto

### 7.1 Relatórios Técnicos

```
┌─────────────────────────────────────────────┐
│  COVER                                      │
│  bg: #0b1326 (surface)                      │
│  ┌─────────────────────────────────────┐    │
│  │  [logo ness.] ← Montserrat 500     │    │
│  │                                     │    │
│  │  título do relatório.               │    │
│  │  ← Manrope 700, 36px, lowercase    │    │
│  │                                     │    │
│  │  BlueDot ← #00ade8                  │    │
│  │                                     │    │
│  │  Data | Versão | Classificação      │    │
│  │  ← Inter 300, 12px, on-surface-var │    │
│  └─────────────────────────────────────┘    │
│                                             │
├─────────────────────────────────────────────┤
│  CORPO                                      │
│  bg: #f8fafc (light)                        │
│  text: #0f172a                              │
│  headings: Manrope 500, #0f172a, lowercase  │
│  body: Inter 300, 16px, line-height 1.6     │
│  accent: #0284c7                            │
│  tables: estilo "Clean"                     │
│  code: JetBrains Mono 400, bg #f1f5f9       │
├─────────────────────────────────────────────┤
│  FOOTER                                     │
│  Inter 400, 10px, #64748b                   │
│  "ness. — confidencial" + nº página         │
└─────────────────────────────────────────────┘
```

### 7.2 Propostas Comerciais

| Elemento | Especificação |
|----------|--------------|
| Cover | Dark mode, logo grande, título em Manrope 700 |
| Seções internas | Light mode, 2 colunas |
| Destaques | Cards com borda `#00ade8` left-border 3px |
| Tabela de preços | Header `#0b1326`, rows alternadas light |
| Call-to-action | Botão Primary (white bg, dark text) |
| Footer | Logo small + dados de contato |

### 7.3 Apresentações (Slides)

| Elemento | Dark Slide | Light Slide |
|----------|-----------|-------------|
| Background | `#0b1326` | `#f8fafc` |
| Título | Manrope 700, `#dae2fd`, 44px | Manrope 700, `#0f172a`, 44px |
| Subtítulo | Inter 300, `#87929a`, 24px | Inter 300, `#64748b`, 24px |
| Accent | `#00ade8` | `#0284c7` |
| Gráficos | Paleta: `#00ade8`, `#7bd0ff`, `#333c52`, `#87929a` | Mesma paleta |

**Regras de slides:**
- Máximo 6 linhas de texto por slide
- Um conceito por slide
- BlueDot após o título principal
- Logo `ness.` no canto inferior direito, 12px

### 7.4 Emails Transacionais

```
┌────────────────────── 600px ──────────────────────┐
│  Header: bg #0b1326, logo ness. centralizado      │
├───────────────────────────────────────────────────┤
│  Body: bg #ffffff                                  │
│  Text: #0f172a, Inter 400, 16px                   │
│  Links: #0284c7, underline                        │
│  CTA button: bg #00ade8, text #003549, pill shape │
│  Dividers: #e2e8f0                                │
├───────────────────────────────────────────────────┤
│  Footer: bg #f1f5f9, text #64748b, 12px           │
│  "ness. — ness.com.br"                            │
└───────────────────────────────────────────────────┘
```

### 7.5 Dashboards & Admin

| Elemento | Valor |
|----------|-------|
| Sidebar | `surface-container-lowest` (#060e20) |
| Main area | `surface` (#0b1326) |
| Cards/widgets | `surface-container-low` (#0f172a) |
| Active menu item | `primary-container/10` bg + `primary-container` text |
| Charts palette | `#00ade8`, `#7bd0ff`, `#4ade80`, `#fbbf24`, `#87929a` |
| Status indicators | 🟢 `#4ade80` 🟡 `#fbbf24` 🔴 `#ef4444` 🔵 `#60a5fa` |

---

## 8. Animações & Micro-interações

### 8.1 Princípios

1. **Sutil, não espetacular** — animações servem para orientar, não distrair
2. **Once-only** — animações de entrada executam uma vez (`once: true`)
3. **Stagger ordenado** — itens de lista entram com `delay: i * 0.08s`
4. **Performance first** — animar apenas `transform` e `opacity`

### 8.2 Catálogo de Animações

| Nome | Propriedades | Duração | Easing |
|------|-------------|---------|--------|
| Fade In Up | `opacity: 0→1, y: 20→0` | 400ms | `ease-out` |
| Fade In | `opacity: 0→1` | 300ms | `ease-out` |
| Scale In | `scale: 0.95→1, opacity: 0→1` | 350ms | `spring(1, 100, 10)` |
| Slide Left | `x: 40→0, opacity: 0→1` | 400ms | `ease-out` |
| Hover Scale | `scale: 1→1.05` | 200ms | `ease-in-out` |
| Tap Scale | `scale: 1→0.95` | 100ms | `ease-in-out` |
| Page Transition | `opacity: 0→1` | 250ms | `ease-in-out` |

### 8.3 Contextos sem Animação

- Relatórios PDF — estáticos por natureza
- Emails — clientes de email não suportam
- Impressão — sem animação
- Reduz motion (`prefers-reduced-motion`) — desativar todas

---

## 9. Glassmorphism

### Receita

```css
/* Glass Card */
background: rgba(51, 60, 82, 0.6);   /* surface-container-highest/60 */
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 24px;
```

### Onde Usar

| ✅ Usar | ❌ Não Usar |
|---------|-------------|
| Modais overlay | Corpo principal de texto |
| Navbar flutuante | Cards de conteúdo denso |
| Tooltips premium | Formulários longos |
| Widgets flutuantes | Tabelas de dados |

---

## 10. Sombras

### Dark Mode

| Nome | Valor | Uso |
|------|-------|-----|
| `nebula-sm` | `0 8px 20px rgba(0,173,232,0.06)` | Cards hover |
| `nebula` | `0 20px 40px rgba(0,173,232,0.08)` | Cards principais |
| `nebula-lg` | `0 30px 60px rgba(0,173,232,0.12)` | Modais, popups |
| `inner-glow` | `inset 0 0 20px rgba(0,173,232,0.05)` | Inputs focused |

### Light Mode

| Nome | Valor | Uso |
|------|-------|-----|
| `clean-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Cards |
| `clean` | `0 4px 12px rgba(0,0,0,0.06)` | Cards elevados |
| `clean-lg` | `0 8px 24px rgba(0,0,0,0.10)` | Modais |

---

## 11. Border Radius

| Uso | Valor | Classe Tailwind |
|-----|-------|----------------|
| Botões | Pill (999px) | `rounded-full` |
| Cards grandes | 24px | `rounded-3xl` |
| Cards médios | 16px | `rounded-2xl` |
| Inputs | 12px | `rounded-xl` |
| Tags/badges | Pill (999px) | `rounded-full` |
| Tabelas | 8px (wrapper) | `rounded-lg` |
| Imagens | 12–16px | `rounded-xl` / `rounded-2xl` |

---

## 12. Imagens & Mídia

### 12.1 Tratamento de Fotos

- Fotos de stock usam overlay escuro `bg-gradient-to-r from-surface/80 to-transparent`
- Logos de clientes: `filter: brightness(0) invert(1)` (branco puro)
- Ícones de tecnologia: monocromáticos, nunca coloridos
- Aspect ratio padrão: `16:9` para hero, `3:2` para cards

### 12.2 Padrões de Background

| Pattern | Uso | Implementação |
|---------|-----|--------------|
| Grid sutil | Hero sections | `radial-gradient` dots, `opacity: 0.03` |
| Noise texture | Superfícies premium | `background-image: url(noise.svg)`, `opacity: 0.02` |
| Gradient radial | Atrás de CTAs | `radial-gradient(circle, #00ade8/10, transparent)` |

---

## 13. Acessibilidade

### 13.1 Contraste Mínimo

| Contexto | Ratio Mínimo |
|----------|-------------|
| Texto principal sobre surface | 7:1 (AAA) |
| Texto secundário sobre surface | 4.5:1 (AA) |
| Texto em relatório (light) | 7:1 (AAA) |
| Elementos interativos | 3:1 (AA) |

### 13.2 Verificações

| Par de cores | Ratio |
|-------------|-------|
| `#dae2fd` sobre `#0b1326` | **12.6:1** ✅ AAA |
| `#87929a` sobre `#0b1326` | **5.4:1** ✅ AA |
| `#00ade8` sobre `#0b1326` | **6.8:1** ✅ AA Large |
| `#0f172a` sobre `#f8fafc` | **15.2:1** ✅ AAA |
| `#64748b` sobre `#f8fafc` | **4.7:1** ✅ AA |

### 13.3 Regras

- Todo ícone interativo precisa de `aria-label`
- Focus visible em todos os interativos: `outline: 2px solid #00ade8`
- Nunca comunicar informação apenas por cor (usar ícone + texto)
- Respeitar `prefers-reduced-motion`

---

## 14. Tom de Voz

### Por Marca

| Marca | Tom | Exemplo |
|-------|-----|---------|
| **ness.** | Técnico, confiante, direto | "infraestrutura que não falha." |
| **trustness.** | Autoritativo, protetor | "compliance sem concessões." |
| **forense.io** | Investigativo, preciso, urgente | "cada byte conta." |

### Regras de Escrita

```
✅ Frases curtas e diretas
✅ Voz ativa ("monitoramos" não "é monitorado por nós")
✅ Dados concretos ("99.99% uptime" não "altíssima disponibilidade")
✅ Lowercase em títulos
✅ Ponto final após títulos curtos (assinatura BlueDot)

❌ Jargão corporativo vazio ("soluções inovadoras")
❌ Superlativos sem prova ("o melhor do mercado")
❌ Linguagem genérica de template
❌ Exclamações excessivas!!!
```

---

## 15. Referência Rápida por Contexto

| O que estou fazendo? | Mode | Cores | Fonts | Veja seção |
|---------------------|------|-------|-------|------------|
| Página web | Dark | §2.1 | §3.1 | §7.5 (dashboard) ou DESIGN.md |
| Relatório técnico | Light (corpo) + Dark (cover) | §2.3 + §2.1 | §3.1 | §7.1 |
| Proposta comercial | Misto | §2.1 + §2.3 | §3.1 | §7.2 |
| Apresentação/slides | Misto | §2.1 ou §2.3 | §3.2 | §7.3 |
| Email transacional | Light | §2.3 | §3.1 | §7.4 |
| Dashboard/admin | Dark | §2.1 | §3.1 | §7.5 |
| Material impresso | Light | §2.3 | §3.1 | §4.3, §7.1 |

---

## 16. Design Tokens (Exportáveis)

### CSS Custom Properties

```css
:root {
  /* Surfaces — Dark */
  --ness-surface: #0b1326;
  --ness-surface-lowest: #060e20;
  --ness-surface-low: #0f172a;
  --ness-surface-high: #222a3d;
  --ness-surface-highest: #333c52;

  /* Surfaces — Light */
  --ness-surface-light: #f8fafc;
  --ness-surface-container-light: #f1f5f9;

  /* Primary */
  --ness-primary: #7bd0ff;
  --ness-primary-container: #00ade8;
  --ness-primary-light: #0284c7;

  /* Text — Dark */
  --ness-on-surface: #dae2fd;
  --ness-on-surface-variant: #87929a;
  --ness-on-primary: #003549;

  /* Text — Light */
  --ness-text-primary-light: #0f172a;
  --ness-text-secondary-light: #64748b;

  /* Status */
  --ness-success: #4ade80;
  --ness-warning: #fbbf24;
  --ness-error: #ef4444;
  --ness-info: #60a5fa;

  /* Borders */
  --ness-border-dark: rgba(255, 255, 255, 0.1);
  --ness-border-light: #e2e8f0;

  /* Typography */
  --ness-font-display: "Manrope", sans-serif;
  --ness-font-body: "Inter", ui-sans-serif, system-ui, sans-serif;
  --ness-font-brand: "Montserrat", sans-serif;
  --ness-font-code: "JetBrains Mono", monospace;

  /* Spacing (base 4px) */
  --ness-space-xs: 4px;
  --ness-space-sm: 8px;
  --ness-space-md: 16px;
  --ness-space-lg: 24px;
  --ness-space-xl: 32px;
  --ness-space-2xl: 48px;
  --ness-space-3xl: 64px;
  --ness-space-4xl: 96px;

  /* Radii */
  --ness-radius-sm: 8px;
  --ness-radius-md: 12px;
  --ness-radius-lg: 16px;
  --ness-radius-xl: 24px;
  --ness-radius-full: 999px;
}
```

### JSON (para ferramentas de design)

```json
{
  "ness-design-tokens": {
    "color": {
      "primary": "#00ade8",
      "primary-soft": "#7bd0ff",
      "surface-dark": "#0b1326",
      "surface-light": "#f8fafc",
      "text-dark": "#dae2fd",
      "text-light": "#0f172a"
    },
    "font": {
      "display": "Manrope",
      "body": "Inter",
      "brand": "Montserrat",
      "code": "JetBrains Mono"
    },
    "radius": {
      "button": "999px",
      "card-lg": "24px",
      "card-md": "16px",
      "input": "12px"
    }
  }
}
```

---

## 17. Checklist de Consistência

Antes de publicar qualquer material visual da ness., verifique:

- [ ] **Marca em lowercase** — `ness.` não `Ness` ou `NESS`
- [ ] **BlueDot presente** — ponto azul `#00ade8` nos títulos
- [ ] **Sem purple/violet** — nenhum tom roxo em qualquer lugar
- [ ] **Fontes corretas** — Manrope (títulos) + Inter (corpo)
- [ ] **Contraste acessível** — mínimo 4.5:1 para texto
- [ ] **Espaçamento consistente** — múltiplos de 4px
- [ ] **Tom de voz** — técnico, direto, sem jargão vazio
- [ ] **Headings lowercase** — exceto tags/labels em UPPERCASE
- [ ] **Cores da paleta** — zero cores improvisadas fora da paleta
- [ ] **Logo no footer** — sempre presente em documentos formais

---

> **Versão:** 1.0  
> **Última atualização:** 2026-06-23  
> **Mantido por:** ness. Engineering
