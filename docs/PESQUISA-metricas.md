# Pesquisa — as métricas que precisam de fonte

Preencha uma ficha por alegação. Uma alegação só volta ao site com os campos
**valor apurado**, **fonte** e **quem confirma** preenchidos.

A regra que decide tudo: *alguém do time consegue apontar a fonte desse número
em 30 segundos?* Se não, o número não publica — nem numa versão menor.

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
