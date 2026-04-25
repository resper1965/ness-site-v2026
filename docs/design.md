# ness. Design System

> Fonte de verdade para identidade visual do grupo ness. e suas verticais.
> Nunca se afaste deste documento ao criar interfaces, emails, apresentações ou materiais.

---

## 1. Marca e Nomenclatura

| Elemento | Regra |
|----------|-------|
| Escrita | `ness.` — sempre minúsculo, com ponto final |
| Sem espaço | Entre o nome e o ponto: `ness.` ✅ `ness .` ❌ |
| Ponto azul | O ponto é sempre `#00ade8` — nunca preto, nunca branco |
| Verticais | `trustness.` · `forense.io` — mesma regra de lowercase |
| Serviços | `n.secops` · `n.infraops` · `n.devarch` · `n.autoops` · `n.cirt` |
| Tom | Direto, técnico, sem excesso de adjetivos. Nunca "revolucionário" ou "disruptivo" |

---

## 2. Paleta de Cores

### Cores Base (Dark OLED — padrão de interface)

| Token | Hex | Uso |
|-------|-----|-----|
| `--bg` | `#060e20` | Fundo mais profundo (body) |
| `--surface` | `#0b1326` | Superfície padrão (cards, sidebar) |
| `--surface-2` | `#0f172a` | Container baixo (inputs) |
| `--surface-3` | `#222a3d` | Container alto (hover, dividers) |
| `--border` | `rgba(255,255,255,0.06)` | Bordas padrão |
| `--border-hover` | `rgba(255,255,255,0.12)` | Bordas em hover |

### Cores de Texto

| Token | Hex | Uso |
|-------|-----|-----|
| `--text` | `#dae2fd` | Texto primário on-surface |
| `--text-muted` | `#87929a` | Texto secundário, labels |
| `--text-dim` | `#abc1ec` | Texto intermediário |

### Accent — ness. Primary

| Token | Hex | Uso |
|-------|-----|-----|
| `--accent` | `#7bd0ff` | Accent UI (botões, links ativos) |
| Ponto de marca | `#00ade8` | O ponto azul no logo exclusivamente |
| `--accent-soft` | `rgba(123,208,255,0.10)` | Backgrounds sutis de accent |
| `--accent-glow` | `rgba(0,173,232,0.22)` | Glow effects |

### Cores Semânticas

| Token | Hex | Uso |
|-------|-----|-----|
| `--success` | `#34d399` | Estados positivos |
| `--warning` | `#fbbf24` | Alertas |
| `--danger` | `#f43f5e` | Erros, ações destrutivas |
| `--orange` | `#f97316` | CTA secundário |

### Cores por Vertical

| Vertical | Cor Primária | Uso |
|----------|-------------|-----|
| ness. | `#00ade8` / `#7bd0ff` | Grupo principal |
| trustness. | `#1e40af` | Azul corporate/GRC |
| forense.io | `#052e16` | Verde escuro/forense |

---

## 3. Tipografia

### Fontes

| Família | Peso | Uso |
|---------|------|-----|
| **Montserrat** | 500 | Logo, wordmark, display hero |
| **Inter** | 300–700 | UI, corpo de texto, componentes |
| **JetBrains Mono / Fira Code** | 400–500 | Código, métricas, valores numéricos |

### Hierarquia de Texto

| Nível | Tamanho | Peso | Uso |
|-------|---------|------|-----|
| Display | 5–7rem | 500 | Hero H1 |
| H2 | 3–5rem | 500–600 | Títulos de seção |
| H3 | 1.25–1.5rem | 600 | Cards, subtítulos |
| Body | 14–16px | 400 | Texto corrido |
| Label | 10–12px | 600–700 | Rótulos uppercase |
| Mono | 12–14px | 400 | Dados, código |

### Regras Tipográficas

- Letter-spacing negativo em títulos grandes: `-0.03em` a `-0.05em`
- Títulos de seção em `lowercase` nas verticais (ex: "governança, risco e compliance")
- Label categórico: `UPPERCASE · letter-spacing: 0.8–1px · font-weight: 700`
- Nunca usar itálico em UI

---

## 4. Espaçamento e Grid

| Token | Valor | Uso |
|-------|-------|-----|
| Base | `4px` | Unidade mínima |
| Padding card | `24px` | Cards internos |
| Gap padrão | `16–24px` | Entre elementos |
| Page padding | `28px` | Conteúdo da página |
| Sidebar width | `240px` | Sidebar fixa |
| Topbar height | `56px` | Barra superior |

---

## 5. Bordas e Raios

| Elemento | Valor |
|----------|-------|
| Cards | `12px` (`--radius`) |
| Botões, inputs | `8px` (`--radius-sm`) |
| Modais | `16–18px` |
| Badges, Pills | `99px` |
| Tags, mini | `4–6px` |

---

## 6. Sombras e Efeitos

- **Glow de accent:** `box-shadow: 0 0 16px rgba(0,173,232,0.22)`
- **Card hover:** `box-shadow: 0 4px 24px rgba(0,0,0,0.25)`
- **Modal:** `box-shadow: 0 32px 64px rgba(0,0,0,0.6)`
- **Frosted glass (topbar/overlays):** `backdrop-filter: blur(12px) saturate(180%)` + `background: rgba(11,19,38,0.8)`
- **Borda interna de luz:** `0 1px 0 rgba(255,255,255,0.03) inset`

---

## 7. Animações e Transições

| Tipo | Curva | Duração |
|------|-------|---------|
| Padrão UI | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 150–200ms |
| Modal spring | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 220ms |
| Hover cor | `linear` | 120–150ms |
| Scroll/collapse | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | 200–250ms |

**Regras:**
- Sempre respeitar `prefers-reduced-motion`
- Botões: `transform: scale(0.97)` no `:active`
- Nunca animar `layout` ou `width/height` diretamente — usar `transform` e `grid-template-rows`

---

## 8. Anti-Patterns (Nunca Fazer)

| ❌ Proibido | ✅ Correto |
|------------|-----------|
| Roxo/violeta como cor primária | Usar `#00ade8` / `#7bd0ff` |
| Gradiente arco-íris ou colorido | Gradientes monocromáticos sutis |
| "ness" sem o ponto | Sempre `ness.` |
| Logo em maiúsculo `NESS.` | Sempre lowercase `ness.` |
| Itálico em UI | Sem itálico em componentes |
| Emojis como ícones de UI | SVG (Lucide, Heroicons) somente |
| Fundo branco por padrão em dark app | OLED dark `#060e20` |
| Sombras pesadas coloridas | Sombras `rgba(0,0,0,x)` neutras |
| Vermelho como primário | Vermelho só para danger/erro |
| Texto uppercase em H1/H2 | Lowercase nas verticais, normal em admin |

---

## 9. Componentes Chave

### Logo
```
ness<span style="color:#00ade8">.</span>
font-family: Montserrat, sans-serif
font-weight: 500
letter-spacing: -0.5px
```

### Botão Primário
```css
background: var(--accent); /* #7bd0ff */
color: #081420; /* escuro para contraste */
font-weight: 700;
box-shadow: 0 1px 0 rgba(255,255,255,0.15) inset, 0 4px 12px rgba(0,173,232,0.2);
```

### Badge/Pill
```css
background: rgba(123,208,255,0.10);
color: var(--accent);
border-radius: 99px;
font-size: 11px; font-weight: 600;
```

---

*Última atualização: 2026-04-24 · Responsável: Canal Design System · ness. Inovação e Tecnologia*
