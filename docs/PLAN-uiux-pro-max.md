# PLAN: UI/UX Pro Max (VisionOS Style)

**Task:** Refatorar o Design System Global do Canal CMS para adotar a Abordagem B (Glassmorphism / VisionOS).
**Context:** O re-arquitetamento de banco de dados e APIs do CMS (D1/Workers) foi concluído com sucesso, porém a UI resultante ainda é visualmente datada. A missão agora é aplicar o "WOW factor" através da interface Apple-Dense com efeitos de vidro translúcido, corrigindo espaçamentos colapsados (ex: tabs) e aprimorando hierarquia tipográfica.

---

## 1. Escopo e Justificativa

*   **Problema:** "OverviewAnalyticsReports" grudadados, stat cards opacos muito escuros, falta de profundidade em dark mode, tipografia desbalanceada.
*   **Abordagem:** Glassmorphism. Substituir tons cinzas opacos por cores levemente transparentes (`bg-zinc-950/40`), sombras complexas (`shadow-glass`) e *backdrop-blurs* profundos.
*   **Restrições:** Evitar roxo/violeta (Purple Ban ativo no brandbook Ness). Manter alta densidade de informação (Apple-Dense) nas tabelas.

---

## 2. Fases de Implementação

### Phase 1: CSS Global e Tokens (Fundação)
- Modificar `canal/admin/src/index.css`.
- Trocar `--background` e globais dark mode para utilizar uma base que possibilite refração de blur (aplicar no #root um background malhado ou gradiente abissal estático).
- Introduzir tokens avançados de cor e radii (`--radius: 16px`).
- Adicionar classes `.glass-panel`, `.glass-floating`, e animações aprimoradas.

### Phase 2: Componentes Core (UI/UX)
- Reescrever `canal/admin/src/components/ui/Card.tsx`: Passar de `bg-card` estático para contêineres `backdrop-blur-xl bg-card/60` com bordas semitransparentes `border-white/10`.
- Reescrever `canal/admin/src/components/ui/StatCard.tsx`: Destacar a tipografia do valor e adicionar micro-interações de hover.
- Consertar `canal/admin/src/components/ui/Tabs.tsx`: Adicionar gap decente, pílulas flutuantes e transição de layout.

### Phase 3: Dashboard Principal (A Grande Tela)
- Refatorar `canal/admin/src/routes/dashboard-home.tsx`.
- Usar grid "Bento Box" onde elementos prioritários (ex: Total Leads) recebem backgrounds especiais fluidos.
- Remover a poluição visual de contêineres aninhados desnecessários.

### Phase 4: Consistência em Tabelas e Formulários
- Aplicar o novo design às Collections DataGrids (`canal/admin/src/components/collection/DataGrid.tsx`).
- Remover bordas sólidas rígidas e usar divisões de linha via transparência (`border-white/5`).

---

## 3. Checklist de Verificação Pós-Build

- [ ] `npm run build` passa localmente.
- [ ] O componente de Tabs não está com o texto fundido (ex: `Overview Analytics Reports`).
- [ ] O fundo de `StatCard` possui refração de luz e borda macia se contrastado com a página de fundo.
- [ ] A performance LCP / CLS não foi degradada pelos filtros de blur. 

---

## 4. Worktrees & Agentes Necessários

**Agentes envolvidos:** 
- `frontend-specialist` (Design Thinking, Cores)
- `orchestrator` (Para garantir que integrações do React/Vite com Router sigam de pé)

**Worktree:** Refatoração far-se-á na própria raiz `canal/admin` para deploy facilitado via Pages.
