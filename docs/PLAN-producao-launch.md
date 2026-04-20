# PLAN-producao-launch.md
# Plano de Lançamento em Produção — ness-site2026

## Objetivo
Eliminar todos os gaps técnicos, i18n, acessibilidade e qualidade identificados na auditoria de 2026-04-20, preparando o site para lançamento em produção com zero débito técnico crítico.

## Estado Atual
- ✅ Build: OK (2150 módulos, ~2.3s)  
- ✅ Commits: main atualizado, brandbook seed executado  
- ⚠️ TypeScript: 15+ erros em `canal/` (types Cloudflare + better-auth API)  
- ⚠️ i18n: 6 componentes/pages com strings hardcoded PT  
- ⚠️ UX: botão "Contato" desktop sem navegação, aria-labels faltando  
- ⚠️ SEO: og-image.png ausente, twitter:image faltando  
- ⚠️ Código: `solutionsData` tipado como `any`, imports mortos  

---

## FASE 1 — TypeScript & Build Integrity
**Critério de Aceite:** `npx tsc --noEmit` → 0 erros em `canal/` e `canal/admin/`  
**Esforço:** ~30min

### 1.1 `canal/generate-schema-run.ts`
- `fValue.isOptional` → `fValue.optional`
- Remover `fValue.isPrimaryKey` (não existe na API atual do better-auth)
- `fValue.isUnique` → `fValue.unique`

### 1.2 `canal/auth-export.ts`
- Corrigir chamada `createAuth()` com 3 argumentos corretos (stub para schema gen)

### 1.3 Alinhar versões `@better-auth/core`
- Verificar divergência entre `canal/package.json` e `canal/admin/package.json`
- Erro de `HookEndpointContext` indica duplicate instances

### 1.4 `canal/admin/src/routes/organizations.tsx:37`
- `Property 'message' does not exist` → type guard com `(err as Error).message`

**Verificação:**
```bash
cd canal && npx tsc --noEmit 2>&1 | grep -c "error TS"
cd canal/admin && npx tsc --noEmit 2>&1 | grep -c "error TS"
```

---

## FASE 2 — i18n Completo (pt / en / es)
**Critério de Aceite:** Zero strings de UI hardcoded; troca de idioma afeta 100% do conteúdo  
**Esforço:** ~60min

### 2.1 `Services.tsx`
- Array de 4 serviços `{title, desc}` → chaves `services.items[0..3]` em `i18n.ts`
- Traduzir EN e ES

### 2.2 `Verticals.tsx`
- Descrições dos 2 cards → `verticals.forense.desc`, `verticals.trustness.desc`, `verticals.cta`
- Traduzir EN e ES

### 2.3 `Navbar.tsx`
- `"começar agora"` mobile → `{t('nav.cta')}` com chave em pt/en/es

### 2.4 `Footer.tsx`
- `"Ecossistema"` hardcoded → `{t('footer.ecosystem')}`
- Lista de países `["brasil", "portugal", ...]` → `footer.presence` string por locale

### 2.5 `Careers.tsx`
- 3 placeholders (`seu nome`, `email@exemplo.com`, `linkedin`) → chaves `careers.form.*`

### 2.6 `Compliance.tsx`
- 3 placeholders do whistleblower → usar chaves `contact.whistleblower.*` já existentes

### 2.7 Padronizar rota `/portfólio` → `/portfolio`
- Arquivos: `src/App.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`
- Manter `<Route path="/portfólio" element={<Navigate to="/portfolio" />}` para redirect SEO

**Verificação:**
```bash
grep -rn '"[A-ZÁ]' src/pages/Services.tsx src/pages/Verticals.tsx src/pages/Careers.tsx
# Esperado: apenas className e imports, nenhum conteúdo textual visível ao usuário
```

---

## FASE 3 — UX, Acessibilidade e SEO
**Critério de Aceite:** Lighthouse Accessibility ≥ 90; meta tags completas; navegação 100% funcional  
**Esforço:** ~45min

### 3.1 `Navbar.tsx` — botão "Contato" desktop
- `<button>` sem onClick → `<Link to="/contato" className="...">…</Link>`

### 3.2 `Navbar.tsx` — botão `LayoutGrid` orphan
- Remover ou implementar (e.g., redirecionar para `/solucoes`)

### 3.3 `aria-label` nos botões iconográficos
- `ChatbotWidget.tsx:108` — botão fechar → `aria-label={t('a11y.close')}`
- `Footer.tsx:87` — botão newsletter → `aria-label={t('a11y.subscribe')}`
- `EmergencyChatModal.tsx:123` — botão enviar → `aria-label={t('a11y.send')}`
- Adicionar chaves `a11y.*` em `i18n.ts`

### 3.4 `Footer.tsx` — newsletter input
- `type="text"` → `type="email"` com `required`

### 3.5 `index.html` — meta tags SEO faltantes
- Verificar/criar `public/og-image.png`
- Adicionar `<meta name="twitter:image" content="https://ness.com.br/og-image.png" />`

### 3.6 `src/main.tsx` — `lang` dinâmico pelo i18n
- Adicionar listener: `i18n.on('languageChanged', lng => document.documentElement.lang = lng)`

**Verificação:**
```bash
python .agent/skills/frontend-design/scripts/ux_audit.py src/
python .agent/skills/seo-fundamentals/scripts/seo_checker.py .
```

---

## FASE 4 — Qualidade de Código & Tipagem
**Critério de Aceite:** Sem `any` em data crítica; sem imports mortos  
**Esforço:** ~30min

### 4.1 Tipar `src/data/solutionsData.ts`
```ts
export interface SolutionData {
  icon: React.ComponentType<{ size?: number; className?: string }>
  bgImage: string
  dashboard: { title: string; mainStat: {...}; metrics: [...]; progress: {...} }
  overview: string
  workflow: Array<{ step: string; name: string; desc: string }>
  benefits: Array<{ title: string; desc: string }>
  services: Array<{ name: string; desc: string }>
}
export const solutionsData: Record<string, SolutionData> = { ... }
```

### 4.2 Remover imports mortos
- `Services.tsx`: `FOUNDATION_YEAR`, `CURRENT_YEAR`, `YEARS_OF_LEGACY` — remover se não usados no JSX
- `Verticals.tsx`: idem

### 4.3 Limpar comentários `@license Apache-2.0`
- Mover comentários de dentro de imports para o topo do arquivo (acima de todos os imports)

### 4.4 Tipar respostas da API em `ChatbotWidget.tsx`
- Criar interfaces `ChatJob` e `ChatItem` para substituir `.map((item: any) => …)`

**Verificação:**
```bash
npx tsc --noEmit  # frontend — 0 erros
grep -rn ": any" src --include="*.ts" --include="*.tsx" | grep -v "//\|test\|as any"
```

---

## FASE 5 — Build Final & Deploy
**Critério de Aceite:** Build limpo, push para main com commits semânticos por fase  
**Esforço:** ~30min

### 5.1 Fix script de build
```json
// package.json
"build": "NODE_OPTIONS=--max-old-space-size=4096 vite build"
```

### 5.2 Build limpo
```bash
npm run build
# Esperado: ✓ built in <5s, sem "process is not defined" ou memory warnings
```

### 5.3 Checklist final
```bash
python .agent/scripts/checklist.py .
```

### 5.4 Commits semânticos por fase + push
```bash
git commit -m "fix(ts): resolve canal TypeScript errors [phase-1]"
git commit -m "feat(i18n): complete pt/en/es coverage [phase-2]"
git commit -m "fix(ux): a11y aria-labels, SEO meta, nav link [phase-3]"
git commit -m "refactor(types): solutionsData interface, dead imports [phase-4]"
git commit -m "chore(build): NODE_OPTIONS in build script [phase-5]"
git push origin main
```

### 5.5 Validação pós-deploy
- [ ] Troca de idioma pt → en → es em Services, Verticals, Careers
- [ ] `/portfolio` funciona; `/portfólio` redireciona com 301
- [ ] og:image aparece no LinkedIn Post Inspector
- [ ] Botão "Contato" no Navbar desktop navega para `/contato`
- [ ] Nenhum erro no console do browser (sem `t is not a function`, sem 404s)

---

## Resumo de Esforço

| Fase | Descrição | Esforço | Prioridade |
|------|-----------|---------|------------|
| 1 | TypeScript & Build | ~30min | 🔴 Crítica |
| 2 | i18n Completo | ~60min | 🟠 Alta |
| 3 | UX / Acessibilidade / SEO | ~45min | 🟠 Alta |
| 4 | Qualidade de Código | ~30min | 🟡 Média |
| 5 | Build Final + Deploy | ~30min | 🔵 Conclusão |
| **Total** | | **~3h15min** | |

---

## Riscos

> [!WARNING]
> **@better-auth versão duplicada (Fase 1.3):** Alinhar versões pode introduzir breaking changes. Verificar changelogs entre as versões antes de bumpar.

> [!CAUTION]
> **Rota `/portfólio` (Fase 2.7):** Nunca remover o `<Route>` de redirect — backlinks externos com acento devem continuar funcionando para preservar o SEO juice.

> [!NOTE]
> **og-image.png (Fase 3.5):** Se não existir em `public/`, pode ser gerado via `generate_image` ou screenshot do hero section. Dimensões recomendadas: 1200×630px.

---

## Definition of Done

```
✅ npx tsc --noEmit → 0 erros (canal/ + frontend)
✅ npm run build → sem warnings críticos
✅ Idioma pt/en/es cobre 100% do conteúdo visível
✅ Lighthouse Accessibility ≥ 90
✅ og:image verificado no LinkedIn Post Inspector
✅ /portfolio OK; /portfólio → redireciona
✅ Botão "Contato" navega para /contato
✅ git push main com commits semânticos por fase
```
