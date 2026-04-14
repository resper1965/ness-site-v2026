---
name: finishing-a-development-branch
description: Use quando a implementação está completa e todos os testes passam. Guia o processo de integração do trabalho com opções estruturadas de merge, PR, keep ou discard. Adapted from obra/superpowers.
---

# Finishing a Development Branch

**Announce at start:** "Usando `finishing-a-development-branch` para completar este trabalho."

## Core Principle

Verificar testes → Apresentar opções → Executar escolha → Limpar worktree.

---

## O Processo

### Passo 1 — Verificar testes

```bash
# Detectar e rodar suite adequada
npm test 2>/dev/null \
  || npx tsc --noEmit 2>/dev/null \
  || npm run build 2>/dev/null \
  || echo "Sem suite configurada"
```

**Se falhar:**
```
Testes falhando (<N> falhas). Necessário corrigir antes de finalizar:

[Mostrar falhas]

Não é possível prosseguir com merge/PR até testes passarem.
```
→ Parar. Não ir para o Passo 2.

**Se passar:** Continuar.

### Passo 2 — Determinar branch base

```bash
git merge-base HEAD main 2>/dev/null || git merge-base HEAD master 2>/dev/null
```

Se ambíguo, perguntar: "Esta branch veio de `main` — correto?"

### Passo 3 — Apresentar opções (EXATAMENTE estas 4)

```
Implementação completa. O que deseja fazer?

1. Fazer merge para <branch-base> localmente
2. Push e criar Pull Request
3. Manter branch como está (cuidarei depois)
4. Descartar este trabalho

Qual opção?
```

Sem explicações extras — manter conciso.

### Passo 4 — Executar escolha

#### Opção 1: Merge local

```bash
git checkout <branch-base>
git pull
git merge <feature-branch>
<rodar testes no resultado>
git branch -d <feature-branch>
```

Depois: Passo 5 (cleanup worktree).

#### Opção 2: Push + PR

```bash
git push -u origin <feature-branch>
gh pr create --title "<título>" --body "$(cat <<'EOF'
## Resumo
- <bullet do que mudou>
- <bullet do que mudou>

## Plano de teste
- [ ] <passos de verificação>
EOF
)"
```

Depois: Passo 5 (cleanup worktree).

#### Opção 3: Manter como está

Reportar: "Mantendo branch `<nome>`. Worktree preservado em `<caminho>`."

**Não fazer cleanup do worktree.**

#### Opção 4: Descartar

**Confirmar primeiro:**
```
Isso vai permanentemente deletar:
- Branch <nome>
- Todos os commits: <lista>
- Worktree em <caminho>

Digite 'descartar' para confirmar.
```

Aguardar confirmação exata.

Se confirmado:
```bash
git checkout <branch-base>
git branch -D <feature-branch>
```

Depois: Passo 5.

### Passo 5 — Cleanup worktree (opções 1, 2 e 4)

```bash
# Verificar se está em worktree
git worktree list | grep $(git branch --show-current)

# Se sim, remover
git worktree remove <caminho-worktree>
```

**Opção 3:** Manter worktree.

---

## Tabela de referência rápida

| Opção | Merge | Push | Manter Worktree | Limpar Branch |
|---|---|---|---|---|
| 1. Merge local | ✅ | - | ❌ | ✅ |
| 2. Criar PR | - | ✅ | ✅ | - |
| 3. Manter | - | - | ✅ | - |
| 4. Descartar | - | - | ❌ | ✅ (force) |

---

## Erros comuns

- ❌ Pular verificação de testes → merge de código quebrado
- ❌ Perguntas abertas ("o que fazer agora?") → ambíguo; sempre apresentar as 4 opções
- ❌ Cleanup automático do worktree para opções 2 e 3
- ❌ Descartar sem confirmação explícita

---

## Red Flags

**Nunca:**
- Prosseguir com testes falhando
- Fazer merge sem verificar testes no resultado
- Deletar trabalho sem confirmação
- Force-push sem solicitação explícita

**Sempre:**
- Verificar testes antes de oferecer opções
- Apresentar exatamente 4 opções
- Exigir confirmação digitada para Opção 4
- Limpar worktree apenas para Opções 1 e 4

---

## Integração no nosso ambiente

**Chamado por:**
- `subagent-driven-development` — após todas as tasks completas
- `/deploy` workflow — antes de deployment em produção
- `/plan` workflow — fase de conclusão

**Par obrigatório:**
- `using-git-worktrees` — limpa o worktree criado por aquela skill

**Contexto do projeto:**
- Branch de produção: `main`
- Deploy Cloudflare Pages: `npx wrangler pages deploy dist`
- Deploy Cloudflare Workers (canal): `npx wrangler deploy` em `canal/`
