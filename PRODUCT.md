# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Leitor principal: CISO ou CTO comparando fornecedores.** Já sabe o que é um
SOC, está avaliando duas ou três opções e lê o site como prova, não como
apresentação. Desconta superlativo, número sem fonte e mock de painel — e,
quando reconhece um, desconta o resto da página junto.

O mesmo leitor atravessa as três marcas, com a pergunta que cada uma responde:

| Marca | Domínio | O que o leitor quer saber |
|---|---|---|
| **ness.** | ness.com.br | Como vocês operam, até onde vai a responsabilidade e o que chega na minha mesa |
| **trustness.** | trustness.com.br | Como vocês me levam à conformidade (LGPD, GRC) e em quanto tempo |
| **forense.io** | forense.io | Como a evidência é preservada e se o laudo se sustenta |

## Product Purpose

Site institucional do ecossistema ness., que é consultoria boutique de
engenharia de software, resiliência cibernética e operações, desde 1991. Ele
serve para o leitor chegar a uma conversa comercial — formulário, chat,
assessment, ouvidoria ou reporte de incidente — já convencido pelo que leu.
Todas essas entradas viram lead, com aviso por e-mail.

Sucesso é o CISO/CTO encontrar, sem pedir reunião, a resposta às perguntas que
faria na reunião.

## Positioning

Duas coisas que um concorrente vizinho não copia com verdade:

1. **A operação publicada.** O site mostra como a operação roda por dentro:
   níveis de severidade, quem é acionado e em que ordem, o que está no escopo
   **e o que não está**, a cadência do que o cliente recebe e o tempo até
   entrar no ar. O número de SLA fica na proposta; o que vai ao ar é o modelo.
   A aposta de que poucos concorrentes publicam isso é hipótese, não
   levantamento de mercado.
2. **Três marcas integradas na mesma casa.** Operar (ness.), conformar
   (trustness.) e periciar (forense.io), com 35 anos de história.

## Operating Context

- Uma codebase e um Worker na Cloudflare servem os três domínios; a marca é
  decidida pelo hostname (`src/config/brand.ts`).
- Idiomas: pt (padrão), en e es. As páginas de produto estão só em português
  (`src/data/solutionsData.ts`), por isso as rotas `/en` e `/es` delas estão
  excluídas em `src/routes.ts`.
- O conteúdo das páginas de produto vem de uma ficha preenchida pelo time que
  opera (`docs/FICHA-runbook-por-produto.md`). Cada seção só aparece quando a
  ficha correspondente volta preenchida; seção sem dado some inteira.
- Merge em `main` publica em produção (`deploy.yml`).

## Capabilities and Constraints

**Produtos da ness.** (`/solucoes/:slug`): n.secops (SOC 24×7, resposta e GRC),
n.infraops (infraestrutura e cloud com FinOps), n.devarch (engenharia e
arquitetura de software), n.autoops (automação de infraestrutura e processos) e
n.cirt (resposta a incidentes, forense e crise).

**Terminologia fixa:**

- No n.secops o ator automatizado é **AIOps**, nunca "agentes de IA"; "agentes
  de IA" descreve só o n.autoops.
- Nome de marca e de produto sempre em minúsculas com o ponto: `ness.`,
  `trustness.`, `forense.io`, `n.secops`. Marca no meio de uma frase sai sempre
  desenhada (`src/components/ComMarcas.tsx`), com teste e2e que reprova marca
  como texto comum.

**Restrições:**

- Nenhuma alegação absoluta sem fonte nas páginas de produto (`100%`,
  `0 gaps`, `zero downtime`); há teste que falha se aparecer uma.
- Nada de telemetria inventada nem mock de painel apresentado como dado real.
- Somente Cloudflare, sem nuvem externa; TypeScript sem erros (`npx tsc --noEmit`).
- Texto de tela entra pelo i18n, nos três idiomas.
- A lógica multimarca não pode quebrar: toda mudança em rota ou UI compartilhada
  vale para os três domínios.

## Brand Commitments

- Constituição e design system vigentes: `.specify/memory/constitution.md`,
  `docs/DESIGN-SYSTEM.md`, `docs/DESIGN.md`. O visual é decidido lá e no
  código, não aqui.
- Tom de voz por marca: ness. técnico, confiante e direto; trustness.
  autoritativo e protetor; forense.io investigativo, preciso e urgente.
- Regras de escrita: frases curtas, voz ativa, dado concreto no lugar de
  adjetivo, sem jargão vazio ("soluções inovadoras") e sem superlativo sem
  prova ("o melhor do mercado").
- Fornecedor que diz o que não faz ganha a confiança do CISO: o escopo
  publica o que está fora dele.

## Evidence on Hand

**Números confirmados em reunião (09/09/2026)** — ver `docs/PESQUISA-metricas.md`:

| Marca | Alegação |
|---|---|
| ness. | 35+ anos · 500+ projetos · 200+ clientes ativos · 99,9% de disponibilidade |
| forense.io | 450+ perícias |
| trustness. | 15+ frameworks |

Ainda falta registrar a fonte e quem confirma cada um.

**Em aberto, não reutilizar:** "laudos aceitos 100%" (forense.io),
"certificações 100%" e "compliance score A+" (trustness.), "100% de
confidencialidade" (portfólio). Nenhum deles tem denominador ou metodologia.

**Referência de conteúdo real:** n.secops, com severidade, escopo,
entregáveis, operação e fecho preenchidos. Os outros quatro produtos
aguardam as fichas.

**Ausências que não se inventam:** depoimentos, logos de cliente sem
autorização, números de SLA, preços e certificações sem nome e ano.

## Product Principles

1. **Prova, não apresentação.** Cada seção responde uma pergunta que o
   CISO/CTO faria, na ordem em que ele a faria.
2. **O modelo em público, o número na proposta.** Publicar como a operação
   funciona; compromisso numérico só no contrato.
3. **Sem dado, sem seção.** Título sem nada embaixo é pior do que não ter a
   seção.
4. **A estrutura do conteúdo decide a forma.** Sequência, matriz,
   responsabilidade e cadeia de custódia têm forma própria; não viram o mesmo
   bloco repetido.
5. **Toda alegação tem fonte.** Número novo passa pela ficha em branco de
   `docs/PESQUISA-metricas.md` antes de ir ao ar.

## Accessibility & Inclusion

WCAG AA como piso. Alvo de toque de pelo menos 24 px, foco visível, nenhuma
informação só por cor, `prefers-reduced-motion` respeitado e nenhuma rolagem
lateral no celular (a auditoria das rotas roda em 390 e 1440 px).
