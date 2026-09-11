# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Leitor principal: CISO ou CTO comparando fornecedores.** Já sabe o que é um
SOC, está avaliando duas ou três opções e lê o site como prova, não como
apresentação. Desconta superlativo, número sem fonte e mock de painel — e,
quando reconhece um, desconta o resto da página junto.

O mesmo leitor atravessa as três empresas, com a pergunta que cada uma responde:

| Empresa | Domínio | O que o leitor quer saber |
|---|---|---|
| **ness.** | ness.com.br | Como vocês operam, até onde vai a responsabilidade e o que chega na minha mesa |
| **trustness.** | trustness.com.br | Como vocês me levam à conformidade, com as normas e com as leis de privacidade, e como a auditoria anda |
| **forense.io** | forense.io | Como a evidência é preservada e se o laudo se sustenta |

## Product Purpose

Site de três empresas do mesmo ecossistema — ness., trustness. e forense.io —,
cada uma no seu domínio, com seus serviços e suas plataformas. A ness. é
consultoria boutique de engenharia de software, resiliência cibernética e
operações, desde 1991. O site serve para o leitor chegar a uma conversa
comercial — formulário, chat, assessment, ouvidoria ou reporte de incidente —
já convencido pelo que leu. Todas essas entradas viram lead, com aviso por
e-mail.

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
2. **Três empresas na mesma casa, com plataformas próprias por baixo.**
   Operar (ness.), conformar (trustness.) e periciar (forense.io), com 35 anos
   de história, e seis plataformas de software sobre as quais os serviços
   rodam.

## Operating Context

- Uma codebase e um Worker na Cloudflare servem os três domínios; a empresa é
  decidida pelo hostname (`src/config/brand.ts`).
- Cada empresa tem uma home institucional — apresenta a empresa e a linha dos
  seus produtos, sem abrir por um produto — e as páginas dos seus produtos. A
  organização por domínio está descrita em
  `docs/superpowers/specs/2026-09-11-site-wow-design.md`.
- Idiomas: pt (padrão), en e es. As páginas de produto estão só em português,
  por isso as rotas `/en` e `/es` delas estão excluídas em `src/routes.ts`.
- O conteúdo das páginas de produto vem de uma ficha validada pelo time que
  opera (`docs/FICHA-runbook-por-produto.md`). Seção sem dado some inteira.
- Merge em `main` publica em produção (`deploy.yml`).

## Capabilities and Constraints

**Portfólio (11/09/2026):**

| Empresa | Serviços | Plataformas |
|---|---|---|
| ness. | n.secops (SOC 24×7, resposta e GRC), n.infraops (atendimento, sustentação técnica e arquitetura de infraestrutura), n.devarch (célula de desenvolvimento, arquitetura e segurança de software), n.autoops (gestão de automações), n.cirt (comando da crise cibernética) | ness.OS (operações de segurança; o n.secops e o n.infraops rodam sobre ele), n.csirt (gestão e resposta a incidentes, com notificação regulatória; o n.cirt fica acima dele), n.pentest (testes de intrusão operados pela ness.), n.training (a página mora na trustness.) |
| trustness. | auditoria e assessment, ISO 27001 e governança, DPO como serviço, testes e vulnerabilidades | n.iso (normas ISO 27001 e 27701), n.privacy (leis LGPD e GDPR; incluído no DPO), n.training (treinamento em segurança e privacidade), n.pentest (a página mora na ness.) |
| forense.io | perícia digital, assistência técnica e contraprova, coleta preventiva | — |

**Terminologia fixa:**

- No n.secops e no ness.OS, o ator automatizado é **AIOps**. "Agentes de IA",
  "agentic" e "copiloto" não aparecem no site: nenhum produto é vendido como
  agente.
- Nome de marca e de produto sempre em minúsculas com o ponto: `ness.`,
  `trustness.`, `forense.io`, `n.secops`. A exceção é **ness.OS**, com "OS" em
  maiúsculo e o ponto azul. Marca no meio de uma frase sai sempre desenhada
  (`src/components/ComMarcas.tsx`), com teste e2e que reprova marca como texto
  comum.
- O assessment de privacidade se chama **"maturidade em privacidade"**, nunca
  só "LGPD".
- Produto se descreve pelo serviço que presta, não pelas ferramentas e
  indicadores do setor (ITIL, CMDB, RPO e RTO, SLO e SLI).

**Restrições:**

- Nenhuma alegação absoluta sem fonte (`100%`, `0 gaps`, `zero downtime`);
  há teste que falha se aparecer uma.
- Nada de telemetria inventada nem mock de painel apresentado como dado real.
  Tela de produto só com dado de exemplo rotulado como exemplo.
- **Codinome de projeto nunca aparece**: nem no texto, nem em chave de i18n,
  identificador, rota, alt, branch, commit ou PR. O teste de integridade
  guarda só o SHA-256 dos codinomes.
- **Documento de cliente não vira conteúdo.** Texto de produto tirado de
  proposta ou relatório de um cliente serve só como descrição genérica: o nome
  do cliente, os achados e os dados do ambiente dele nunca vão para o site.
- **Como um produto é construído** (stack, linguagem, provedor, modelo) não
  aparece no site.
- **Integração só aparece quando já funciona:** hoje, a exportação do
  n.pentest para o DefectDojo.
- Somente Cloudflare, sem nuvem externa; TypeScript sem erros (`npx tsc --noEmit`).
- Texto de tela entra pelo i18n, nos três idiomas (as páginas de produto, só
  em pt nesta rodada).
- A lógica multimarca não pode quebrar: toda mudança em rota ou UI compartilhada
  vale para os três domínios.

## Brand Commitments

- O design system vigente está em `DESIGN.md`, na raiz, gerado do que está no
  ar. A constituição continua em `.specify/memory/constitution.md`;
  `docs/DESIGN.md` e `docs/DESIGN-SYSTEM.md` são anteriores e apontam para o
  `DESIGN.md`.
- Desvios deliberados do guia de marca do ecossistema: Montserrat 500 nos
  títulos (o guia pede 600), produtos grafados com o ponto azul, como
  `n.secops` (o guia pede `nShield`), e rótulos em caixa normal (o guia pede
  caixa alta).
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

**Confirmados por Ricardo Esper em 11/09/2026:**

| Onde | Alegação |
|---|---|
| ness. | clientes atendidos em Brasil, Portugal, Chile, Peru, Colômbia e Estados Unidos (com base na carteira de clientes; o texto diz sempre "clientes atendidos", nunca "escritórios") |
| ness.OS | toda ação fica numa trilha de auditoria imutável; não exige infraestrutura local no cliente |
| n.cirt | livro de decisões imutável; opera fora de banda, em infraestrutura independente da rede da empresa |

**Em aberto, não reutilizar:** "laudos aceitos 100%" (forense.io),
"certificações 100%" e "compliance score A+" (trustness.), "100% de
confidencialidade" (portfólio). Nenhum deles tem denominador ou metodologia.

**Referência de conteúdo real:** n.secops, com severidade, escopo,
entregáveis, operação e fecho preenchidos. Os outros produtos têm rascunho a
validar pelo time.

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
