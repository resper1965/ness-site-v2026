# Canal CMS nativo com Cloudflare Workers AI

A Ness precisa que o Canal (Seu Hub de Comunicação) processe textos, classifique políticas de governança e gere rascunhos de forma autônoma **sem depender de gateways externos (como OpenAI ou Anthropics via AI Gateway)**. Tudo deve rodar na borda usando os modelos hospedados nativamente pela Cloudflare (Workers AI).

## Análise de Modelos (Workers AI)

Baseado no catálogo atualizado do Cloudflare Workers AI, comparei as melhores opções disponíveis para o contexto editorial e de governança do Canal CMS:

| Modelo (Cloudflare Workers AI) | Perfil | Uso Ideal no Canal CMS |
|--------------------------------|--------|------------------------|
| `@cf/meta/llama-3.3-70b-instruct-fp8-fast` | **Heavy-Duty / Reasoning** (70B params) | **Classificação de Governança**, aprovações automáticas complexas e geração de rascunhos longos (Comunicação Institucional). Alta qualidade cognitiva e suporte a function calling. |
| `@cf/meta/llama-3.1-8b-instruct-fast` | **Veloz / Simples** (8B params) | Resumos rápidos, extração de tags SEO, geração de meta-descriptions. Substitui queries rápidas onde a latência é mais importante que o raciocínio complexo. |
| `@cf/qwen/qwq-32b` ou `deepseek-r1-distill-qwen-32b` | **Logic / Raciocínio Profundo** | Caso a validação de conformidade/compliance exija deduções lógicas estritas contra um documento legal (ex: LGPD). |

**🏆 Veredito / Tech Stack da IA:**
- Utilizar o binding nativo `env.AI` da Cloudflare.
- **Modelo Principal (Escrita e Análise Crítica):** `@cf/meta/llama-3.3-70b-instruct-fp8-fast`.
- **Modelo Secundário (UX e Velocidade):** `@cf/meta/llama-3.1-8b-instruct-fast`.

---

## Estrutura de Arquivos

```text
canal/
├── wrangler.toml               # Manter o binding [ai] binding = "AI"
├── src/
│   ├── ai/
│   │   ├── models.ts           # Constantes dos IDs dos modelos CF
│   │   ├── prompts.ts          # Templates para Llama 3.3
│   │   └── client.ts           # Wrapper para c.env.AI.run()
│   └── index.ts                # Rotas para interagir com a IA web
```

---

## User Review Required

> [!IMPORTANT]
> **Aprovação do Modelo Primário:** Você concorda em utilizarmos o `llama-3.3-70b-instruct-fp8-fast` como motor principal para as tarefas mais densas e usar o `llama-3.1-8b` para tarefas super rápidas? O Llama 3.3 é o topo de linha em Serverless GPU da Cloudflare hoje.

---

## Proposed Changes (Task Breakdown)

### Phase 1: Configuração Core da IA

#### [NEW] `canal/src/ai/models.ts`
- Definir constantes fortemente tipadas para os IDs da Cloudflare.
- Exemplo: `export const MODEL_HEAVY = "@cf/meta/llama-3.3-70b-instruct-fp8-fast"`.

#### [NEW] `canal/src/ai/client.ts`
- Criar a camada de serviço que abstrai `await c.env.AI.run(MODEL, { messages })`.
- Adicionar tratamento de erros e parsing do output em markdown ou JSON (dependendo do modo).

### Phase 2: Integração com Governança e Rascunho

#### [MODIFY] `canal/src/governance.ts`
- Em vez de apenas regex/keywords estatísticas para `ASSISTED_TOPICS`, enviar o texto do rascunho para o modelo veloz (`llama-3.1-8b-instruct`) pedindo uma análise de sensibilidade e retornar a justificativa gerada pela IA.

#### [NEW] `canal/src/routes/ai.ts`
- Criar endpoint `POST /api/ai/draft` para que os editores possam pedir ao `llama-3.3-70b` a geração de comunicados a partir de bullet points.

---

## Verification Plan

### Phase X: Verification
- [ ] Segurança: O LLM tem acesso apenas ao `prompt` construído e as proteções de isolamento de *tenant* e contexto são garantidas no código rodando *server-side*.
- [ ] Build: `npm run lint && npm run build` (garantir tipos estritos do Cloudflare Worker API para o objeto AI).
- [ ] Run & Test: Usar `wrangler dev` para executar a rota de IA e garantir que o *Llama 3.3* responde dentro do tempo aceitável sem *timeout* de worker.
