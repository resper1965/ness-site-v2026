# PLAN: Tradução PT-BR — Canal Admin Routes

**Objetivo:** Varrer todos os arquivos de rota do Canal Admin e traduzir textos visíveis que estejam em inglês, preservando termos que fazem sentido em inglês por convenção técnica ou de produto.

---

## Critério de Preservação (NÃO traduzir)

Termos que devem permanecer em inglês:
- Nomes de produto/marca: `Dashboard`, `Brandbook`, `Cases`, `Insights`, `Newsletter`, `RAG`
- Termos técnicos universais: `LinkedIn`, `PDF`, `HTML`, `SVG`, `PNG`, `API`, `LGPD`, `DSAR`
- Status de plataforma: `draft`, `published` → **traduzir** (`Rascunho`, `Publicado`)
- Termos de dev visíveis ao usuário: `console.error(...)` → manter (não aparece na UI)
- Labels de código/chave: `"cor"`, `"logo"` → manter (são valores de campo)

---

## Arquivos e Ocorrências Identificadas

### 🔴 PRIORIDADE ALTA (texto visível ao usuário)

#### `applicants.tsx` ✅ (já corrigido nesta sessão)

---

#### `social-calendar.tsx` ✅ (já corrigido nesta sessão)

---

#### `compliance.tsx`
- [ ] `label: "Security Incidents"` → `"Incidentes de Segurança"`
- [ ] `label: 'Workers Analytics'` → `"Análise de Performance"`
- [ ] Verificar demais labels de aba

---

#### `account.tsx`
- [ ] `label: "Developer API"` → `"API para Desenvolvedores"`
- [ ] `label: "Brand Assets"` → `"Assets de Marca"`

---

#### `signatures.tsx`
- [ ] `label: "Brand Assets"` → `"Assets de Marca"`
- [ ] Verificar textos dos campos do formulário

---

#### `dashboard.tsx` (layout)
- [ ] `sub: "Control Plane"` → `"Painel de Controle"` (fallback do PAGE_META)

---

#### `media.tsx`
- [ ] `"Vetores de IA"` já está OK — verificar demais labels

---

#### `chats.tsx`
- [ ] `console.error("Failed to load generic chat sessions", ...)` → manter (não é UI)
- [ ] Verificar labels visíveis

---

#### `newsletters.tsx`
- [ ] Varredura completa — arquivo grande (19kb)

---

#### `communications.tsx`
- [ ] Varredura completa — arquivo grande (20kb)

---

#### `automation.tsx`
- [ ] Varredura completa — arquivo grande (15kb)
- [ ] `label: 'Triagem de Vagas'` já OK

---

### 🟡 PRIORIDADE MÉDIA (textos de sistema/estado)

#### `emergency.tsx`
- [ ] Verificar labels de status e ações

#### `knowledge-base.tsx`
- [ ] Verificar labels de abas e botões

#### `saas.tsx`
- [ ] Varredura de labels e mensagens de erro

#### `users.tsx`
- [ ] Varredura de labels e estado vazio

---

### 🟢 JÁ OK (validados)

- `dashboard-home.tsx` — somente PT-BR
- `organizations.tsx` — corrigido nesta sessão
- `brandbook.tsx` — corrigido nesta sessão
- `login.tsx` — verificar

---

## Ordem de Execução

| # | Arquivo | Tamanho | Prioridade |
|---|---------|---------|------------|
| 1 | `compliance.tsx` | 23kb | 🔴 Alta |
| 2 | `account.tsx` | 14kb | 🔴 Alta |
| 3 | `signatures.tsx` | 16kb | 🔴 Alta |
| 4 | `dashboard.tsx` | 10kb | 🔴 Alta |
| 5 | `newsletters.tsx` | 19kb | 🟡 Média |
| 6 | `communications.tsx` | 20kb | 🟡 Média |
| 7 | `automation.tsx` | 15kb | 🟡 Média |
| 8 | `emergency.tsx` | 6kb | 🟡 Média |
| 9 | `knowledge-base.tsx` | 9kb | 🟡 Média |
| 10 | `chats.tsx` | 6kb | 🟡 Média |
| 11 | `saas.tsx` | 7kb | 🟡 Média |
| 12 | `users.tsx` | 7kb | 🟡 Média |
| 13 | `login.tsx` | 7kb | 🟡 Média |
| 14 | `media.tsx` | 12kb | 🟡 Média |

---

## Build & Deploy (ao final de cada bloco)

```bash
# Dentro de canal/admin/
npm run build

# Dentro de canal/
npm run deploy
```

---

## Critério de Conclusão

- [ ] Nenhum texto visível ao usuário em inglês (fora dos termos preservados)
- [ ] Build sem erros TypeScript
- [ ] Deploy confirmado
