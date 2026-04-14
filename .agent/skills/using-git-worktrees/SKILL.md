---
name: using-git-worktrees
description: Use when starting feature work that needs isolation, or before executing implementation plans. Creates isolated git worktrees with safety verification. Adapted from obra/superpowers.
---

# Using Git Worktrees

**Announce at start:** "Usando a skill `using-git-worktrees` para criar workspace isolado."

## Overview

Git worktrees criam workspaces isolados compartilhando o mesmo repositório. Permite trabalhar em múltiplas branches simultaneamente sem trocar de contexto.

**Core principle:** Seleção sistemática de diretório + verificação de segurança = isolamento confiável.

---

## Processo

### 1. Selecionar diretório (em ordem de prioridade)

```bash
# Verificar se já existe
ls -d .worktrees 2>/dev/null   # preferido (oculto)
ls -d worktrees 2>/dev/null    # alternativa
```

- **Se encontrar:** usar esse. Se ambos existirem, `.worktrees` vence.
- **Se não encontrar:** perguntar ao usuário:

```
Nenhum diretório de worktree encontrado. Onde criar?

1. .worktrees/ (local ao projeto, oculto)
2. ~/.config/worktrees/<nome-projeto>/ (global)

Qual prefere?
```

### 2. Verificar .gitignore (OBRIGATÓRIO para locais do projeto)

```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```

**Se NÃO estiver ignorado:**
1. Adicionar ao `.gitignore`
2. Fazer commit da mudança
3. Continuar com criação do worktree

### 3. Criar worktree

```bash
# Detectar nome do projeto
project=$(basename "$(git rev-parse --show-toplevel)")

# Criar worktree com nova branch
git worktree add .worktrees/<nome-feature> -b feature/<nome-feature>
```

### 4. Instalar dependências

Auto-detectar e rodar o setup adequado:

```bash
# Node.js (projetos React, Next.js, Vite, Wrangler)
if [ -f package.json ]; then npm install; fi

# Python
if [ -f requirements.txt ]; then pip install -r requirements.txt; fi
if [ -f pyproject.toml ]; then poetry install; fi
```

### 5. Verificar baseline limpa

```bash
npm test 2>/dev/null || npx tsc --noEmit 2>/dev/null || echo "Sem suite de testes configurada"
```

**Se falhar:** Reportar falhas e perguntar se deve continuar ou investigar.
**Se passar:** Reportar pronto.

### 6. Reportar localização

```
Worktree pronto em: .worktrees/<nome-feature>
Branch: feature/<nome-feature>
Testes: ✅ passando (ou ⚠️ sem suite configurada)
Pronto para implementar <nome-feature>
```

---

## Tabela de decisão

| Situação | Ação |
|---|---|
| `.worktrees/` existe | Usar (verificar .gitignore) |
| `worktrees/` existe | Usar (verificar .gitignore) |
| Ambos existem | Usar `.worktrees/` |
| Nenhum existe | Perguntar usuário |
| Diretório não ignorado | Adicionar ao .gitignore + commit |
| Testes falham no baseline | Reportar + perguntar |
| Sem package.json | Pular instalação de deps |

---

## Erros comuns

- ❌ Criar worktree sem verificar .gitignore → conteúdo vaza para git status
- ❌ Assumir localização sem verificar → inconsistência com convenções do projeto
- ❌ Prosseguir com testes falhando → impossível distinguir bugs novos de pré-existentes

---

## Integração no nosso ambiente

**Ativado por:**
- `/plan` workflow — OBRIGATÓRIO quando design aprovado e implementação segue
- `subagent-driven-development` — OBRIGATÓRIO antes de executar tasks
- Qualquer trabalho que precise de workspace isolado

**Par obrigatório:**
- `finishing-a-development-branch` — cleanup após trabalho completo

**Compatível com:**
- Projetos Cloudflare Workers (`ness-site2026`, `canal`)
- Wrangler + Vite builds
- React Router v7 / Next.js
