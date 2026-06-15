---
description: Planejar e implementar UI/UX de alto nível usando o design system VisionOS e o pipeline de auditoria
---

# /ui-ux-pro-max

Workflow para implementar interfaces de nível profissional no Canal CMS.

> **Stack deste projeto:** Tailwind v4 · React Router v7 · Cloudflare Workers · Lucide React · Better Auth

---

## Passo 1 — Gerar Design System

Execute a partir da **raiz do projeto** (`ness-site2026/`):

```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "<produto> <indústria> <estilo>" --design-system -p "Canal Admin"
```

**Exemplos:**
```bash
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "saas admin dark dashboard" --design-system -p "Canal Admin"
python3 .agent/.shared/ui-ux-pro-max/scripts/search.py "applicants tracking glassmorphism" --design-system -p "Canal Admin"
```

Retorna: padrão visual, paleta de cores, tipografia, efeitos e **anti-padrões para evitar**.

---

## Passo 2 — Auditoria UX

```bash
# Audita uma rota específica
python3 .agent/skills/frontend-design/scripts/ux_audit.py canal/admin/src/routes/<arquivo>.tsx

# Audita todas as rotas de uma vez
python3 .agent/skills/frontend-design/scripts/ux_audit.py canal/admin/src/routes/
```

Prioridade de correção: **Fitts' Law → Tipografia → Visual → Animação**.

---

## Passo 3 — Implementar

### Padrões obrigatórios (VisionOS/Canal)

**Card padrão:**
```tsx
<div className="bg-black/40 backdrop-blur-xl border border-white/5
                rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]
                hover:border-brand-primary/30 transition-all duration-300">
```

**Botões e targets interativos — mínimo 44×44px (Lei de Fitts):**
```tsx
<button
  className="flex items-center justify-center w-11 h-11 rounded-lg
             hover:bg-white/5 transition-colors"
  aria-label="Descrição da ação"
>
```

**Inputs e selects:**
```tsx
<select className="h-11 px-3 rounded-lg bg-black/30 border border-white/5
                   text-sm focus:ring-1 focus:ring-primary outline-none">
```

**Hierarquia tipográfica:**
```tsx
<h1 className="text-2xl font-bold tracking-tight">       {/* página */}
<h2 className="text-lg font-semibold">                   {/* seção */}
<h3 className="text-sm font-medium">                     {/* título de card */}
<p  className="text-sm text-zinc-300 max-w-prose">       {/* corpo — 45-75ch */}
```

---

## Armadilhas Conhecidas

| Problema | Causa | Solução |
|---|---|---|
| Espaçamentos somem | Reset CSS global sobrescreve Tailwind v4 | **Nunca usar** `*, *::before { margin: 0; padding: 0 }` solto — colocar dentro de `@layer base` |
| Cards cortam texto | `overflow-hidden` sem padding suficiente | Usar `p-6` mínimo nos cards com `rounded-2xl` |
| Textos espremidos | `truncate` sem container largo o suficiente | Remover `truncate`; usar `whitespace-nowrap` só quando necessário |
| CSS global destrói Tailwind v4 | CSS solto tem prioridade sobre `@layer utilities` | Todo CSS customizado dentro de `@layer base` ou `@layer utilities` |

---

## Passo 4 — Build e Deploy

```bash
# 1. Build do admin (rodar dentro de canal/admin/)
npm run build

# 2. Deploy do worker (rodar dentro de canal/)
npm run deploy
```

---

## Checklist de Entrega

### Visual
- [ ] Sem emojis como ícones — apenas Lucide SVG
- [ ] Cards com `backdrop-blur` e sombra profunda
- [ ] Hover definido em todos os elementos interativos
- [ ] Gradiente radial nos cards de destaque (KPI, Hero)

### Interação e Acessibilidade
- [ ] Todos os botões e links com área mínima de 44×44px
- [ ] `aria-label` em botões com apenas ícone (sem texto visível)
- [ ] Hierarquia de headings sequencial por rota — um único `h1` por página
- [ ] Transições entre 150–300ms

### Tipografia
- [ ] Textos longos com `max-w-prose` (45–75 caracteres por linha)
- [ ] Labels técnicos em maiúsculas + `tracking-widest` + `text-[10px]`

### Layout
- [ ] Responsivo: 375px, 768px, 1440px
- [ ] Sem scroll horizontal
- [ ] Padding de container: `px-10 md:px-12`
- [ ] Largura máxima: `max-w-[1600px]`

### CSS / Tailwind v4
- [ ] Nenhum reset global solto fora de `@layer base`
- [ ] Classes personalizadas dentro de `@layer utilities` ou `@layer base`
- [ ] Sem `!important` — resolver por especificidade ou camada

### Build
- [ ] `npm run build` sem erros (dentro de `canal/admin/`)
- [ ] Auditoria UX executada: `ux_audit.py canal/admin/src/routes/`
- [ ] Deploy confirmado via `npm run deploy` (dentro de `canal/`)