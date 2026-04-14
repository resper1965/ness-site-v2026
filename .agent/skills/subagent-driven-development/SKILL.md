---
name: subagent-driven-development
description: Use when executando planos de implementação com tasks independentes na sessão atual. Despacha subagentes frescos por task com revisão em 2 estágios (spec → qualidade). Adapted from obra/superpowers.
---

# Subagent-Driven Development

**Announce at start:** "Usando `subagent-driven-development` para executar este plano."

## Core Principle

Fresh subagent por task + revisão em 2 estágios (spec compliance → code quality) = alta qualidade, iteração rápida.

**Por que subagentes:** Cada task recebe contexto isolado e preciso. Sem herdar histórico de sessão. Você (controller) cuida apenas da coordenação.

---

## Quando usar

```
Tem plano de implementação? → sim
Tasks são independentes?    → sim
Ficar nesta sessão?         → sim → USE ESTA SKILL
                            → não → use executing-plans (sessão paralela)
Tasks acopladas?            → não → brainstorm primeiro
```

---

## O Processo

### 0. Preparação (uma vez)

1. Ler o plano **uma única vez**
2. Extrair TODAS as tasks com texto completo + contexto
3. Criar TodoWrite com todas as tasks
4. Rodar `using-git-worktrees` para workspace isolado

### Por task (repetir):

#### Passo 1 — Despachar Implementador

Criar subagente com:
- Texto completo da task (não "leia o plano")
- Contexto de onde essa task se encaixa
- Stack do projeto (Cloudflare Workers, Vite, React Router v7, etc.)
- Instrução para usar TDD (`tdd-workflow` skill)
- Instrução para fazer commit ao finalizar

O implementador reportará um de 4 status:

| Status | Ação do controller |
|---|---|
| **DONE** | Prosseguir para spec review |
| **DONE_WITH_CONCERNS** | Ler preocupações; se sobre corretude → resolver antes; se observações → prosseguir |
| **NEEDS_CONTEXT** | Fornecer contexto faltante e re-despachar |
| **BLOCKED** | Avaliar: mais contexto → re-despachar; task grande demais → dividir; plano errado → escalar ao humano |

#### Passo 2 — Spec Compliance Review

Despachar subagente revisor com:
- Texto completo da task (spec)
- SHA dos commits do implementador
- Instrução: verificar se código atende a spec (nem a mais, nem a menos)

**Se falhar:** Implementador (mesmo subagente) corrige → revisor revisa de novo → repetir até ✅

#### Passo 3 — Code Quality Review

**SÓ após spec compliance ✅**

Despachar subagente revisor de qualidade com:
- SHA dos commits
- Checar: legibilidade, DRY, YAGNI, segurança, performance

**Se falhar:** Implementador corrige → revisor revisa de novo → repetir até ✅

#### Passo 4 — Marcar task completa

```
ToDoWrite: task X → DONE
```

Repetir do Passo 1 para próxima task.

### Final (após todas as tasks)

1. Despachar revisor final para implementação completa
2. Rodar `finishing-a-development-branch`

---

## Seleção de modelo

| Tipo de task | Modelo |
|---|---|
| Mecânica (1-2 arquivos, spec clara) | Mais rápido/barato |
| Integração (múltiplos arquivos) | Padrão |
| Arquitetura, design, revisão | Mais capaz |

---

## Red Flags

**Nunca:**
- Começar implementação na branch `main` sem consentimento explícito
- Pular revisão (spec compliance OU code quality)
- Deixar issues abertos e avançar
- Despachar múltiplos implementadores em paralelo (conflitos)
- Fazer o subagente ler o plano (você fornece o texto completo)
- Ignorar perguntas do subagente (responder antes de implementar)
- Aceitar "próximo o suficiente" em spec compliance
- Fazer quality review antes de spec compliance ✅
- Avançar com issues abertos de qualquer revisão

---

## Integração no nosso ambiente

**Requer:**
- `using-git-worktrees` — OBRIGATÓRIO antes de iniciar
- `tdd-workflow` — subagentes devem seguir TDD
- `finishing-a-development-branch` — após todas as tasks

**Ativado por:**
- `/plan` workflow (fase de execução)
- `/orchestrate` workflow (tasks independentes)

**Alternativa:**
- `parallel-agents` — para tasks verdadeiramente paralelas sem dependência
