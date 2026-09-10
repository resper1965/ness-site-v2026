# Pesquisa — as métricas que precisam de fonte

> **Estado em 09/09/2026.** Os números foram levantados na reunião e Ricardo
> confirmou que os que estão no ar são coerentes. Isso encerra as alegações
> **quantificadas** — elas ficam como estão. O que segue aberto são as três
> alegações **sem denominador**, listadas ao fim: ali o problema nunca foi o
> valor estar errado, e sim a frase não dizer o que mede. Coerência não
> resolve isso.

## Encerrado — alegações quantificadas, confirmadas na reunião

| Onde | Alegação no ar | Situação |
|---|---|---|
| ness. | `35+` anos de experiência | confirmada |
| ness. | `500+` projetos executados | confirmada |
| ness. | `200+` clientes ativos | confirmada |
| ness. | `99.9%` disponibilidade | confirmada |
| forense.io | `450+` perícias | confirmada |
| trustness. | `15+` frameworks | confirmada |

Falta só uma linha para a ficha ficar completa e a próxima pessoa não reabrir
a discussão: **de onde saiu cada número** (sistema, planilha ou relatório — o
nome e onde fica) e **quem confirma**. Me passe isso e eu registro aqui, no
mesmo commit da próxima mudança.

## Aberto — as três que não têm denominador

Estas não entram no encerramento acima porque a objeção não é sobre exatidão:

| Onde | No ar hoje | O que continua sem resposta |
|---|---|---|
| forense.io | **laudos aceitos — 100%** | É afirmação sobre o que o juízo decidiu, não sobre o que a ness. fez. Mesmo exata hoje, um laudo contestado torna o site falso — e ninguém aqui controla isso |
| trustness. | **certificações — 100%** | 100% de quê? Sem denominador o leitor não consegue interpretar |
| trustness. | **compliance score — A+** | Índice sem metodologia declarada. (A ficha 3 abaixo fala em `100%`; o site mostra `A+` — o valor mudou, a falta de metodologia não) |

Proposta, mantendo o mesmo fato e trocando só a forma:

- `laudos aceitos 100%` → o volume já está ao lado em `450+ perícias`; o par
  honesto é o que a ness. controla, como a cadeia de custódia ISO 27037, que
  já ocupa o terceiro slot.
- `certificações 100%` → nomeá-las. `ISO 27001 · SOC 2 · LGPD` diz mais que
  um percentual e não envelhece mal.
- `compliance score A+` → ou vem com a metodologia em uma frase, ou o slot
  fica com `15+ frameworks`, que já é verificável.

As fichas abaixo seguem valendo para qualquer número novo.

---

## Ficha 1 — "laudos aceitos: 100%" (forense.io)

| Campo | Preencher |
|---|---|
| **Onde aparece hoje** | `src/i18n.ts`, bloco `forense`, chave `laudos` |
| **Por que não se sustenta** | É alegação sobre decisão de terceiro (o juízo). Um único laudo contestado desmente — e ninguém controla isso |
| **Risco se ficar** | O maior dos três: alegação sobre resultado judicial, num site de perícia |
| **Dado substituto — opção A** | Nº de laudos entregues (absoluto, desde quando) |
| **Dado substituto — opção B** | Anos de atuação pericial + nº de peritos com registro |
| **Dado substituto — opção C** | Nº de casos com cadeia de custódia ISO 27037 |
| **Valor apurado** | |
| **Período que o número cobre** | |
| **Fonte** (sistema, planilha, relatório — nome e onde fica) | |
| **Quem confirma** (nome e papel) | |
| **Data da apuração** | |
| **Pode ser publicado sem NDA?** | |

---

## Ficha 2 — "certificações: 100%" (trustness.)

| Campo | Preencher |
|---|---|
| **Onde aparece hoje** | `src/i18n.ts`, bloco `trustness`, chave `cert` |
| **Por que não se sustenta** | Não é métrica: 100% de quê? Não há denominador |
| **Dado substituto — opção A** | Lista nominal das certificações vigentes (ISO 27001, LGPD, etc.) com ano |
| **Dado substituto — opção B** | Nº de profissionais certificados / nº total do time |
| **Valor apurado** | |
| **Fonte** | |
| **Quem confirma** | |
| **Data da apuração** | |
| **Validade** (certificação vence: quando?) | |

---

## Ficha 3 — "compliance score: 100%" (trustness.)

| Campo | Preencher |
|---|---|
| **Onde aparece hoje** | `src/i18n.ts`, bloco `trustness`, chave `comp` |
| **Por que não se sustenta** | Índice sem metodologia nem fonte declarada |
| **Dado substituto — opção A** | Média de aderência nos assessments concluídos, **com n amostral** |
| **Dado substituto — opção B** | Nº de organizações levadas à conformidade, por norma |
| **Valor apurado** | |
| **n (quantos casos entram na média)** | |
| **Metodologia em uma frase** | |
| **Fonte** | |
| **Quem confirma** | |
| **Data da apuração** | |

---

## Ficha 4 — "100% de confidencialidade" (portfólio)

| Campo | Preencher |
|---|---|
| **Onde aparece hoje** | `src/i18n.ts`, chave `confidentiality` |
| **Por que não se sustenta** | Absoluto de segurança — o tipo de frase que envelhece mal |
| **Substituto sugerido** | O compromisso contratual concreto: NDA em todo projeto; cadeia de custódia ISO 27037 na perícia |
| **Texto final aprovado** | |
| **Quem confirma** (jurídico) | |

---

## Ficha em branco — para qualquer número novo

Copie esta ficha antes de publicar qualquer métrica no site.

| Campo | Preencher |
|---|---|
| **Alegação (texto exato que vai ao ar)** | |
| **Onde vai aparecer** | |
| **Valor apurado** | |
| **Período que cobre** | |
| **n amostral** (se for média ou percentual) | |
| **Fonte** | |
| **Quem confirma** | |
| **Data da apuração** | |
| **Revalidar em** (data — número envelhece) | |

---

## Depois de preenchido

Me devolva este arquivo preenchido (ou só as fichas que ficaram prontas) e eu
faço a troca no `src/i18n.ts` nos três idiomas, com o número e a fonte no
mesmo commit — para a próxima pessoa saber de onde veio.
