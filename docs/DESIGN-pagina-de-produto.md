# Design — a página de produto como runbook

**Data:** 09/09/2026 · **Estado:** aguardando revisão do Ricardo antes do plano
de implementação · **Alcance:** as cinco páginas `/solucoes/:slug`

---

## As decisões que fecharam o desenho

| Pergunta | Decisão |
|---|---|
| Quem a página convence | **CISO/CTO comparando fornecedores.** Já sabe o que é um SOC, está avaliando duas ou três opções. A página é prova, não apresentação |
| Os compromissos operacionais podem ir ao ar | **Não o número, o modelo.** SLA fica na proposta; a página publica níveis de severidade, quem é acionado, em que ordem e o que o cliente recebe |
| Ideia organizadora | **A página é o runbook.** Publicar como a operação roda por dentro |
| Rollout | n.secops primeiro; os outros quatro renderizam só o que têm |
| De onde vem o conteúdo | Ficha preenchida pelo time que opera — ver `FICHA-runbook-por-produto.md` |

## O problema, medido

`/solucoes/secops` em 09/09/2026: **5.583 px, seis telas, dez seções.**

1. **Quatro seções dizem a mesma coisa.** `casos de uso reais`, `valor para o
   negócio`, `soluções estratégicas` e `o arsenal em operação` são quatro
   listas de recursos com títulos diferentes. Repetição lê como enchimento.
2. **A peça central é um mock.** O bloco `dashboard` publica `100% postura
   atualizada`, `0 gaps em privacidade` e `soar isolation speed — sub 500ms`,
   com barra de progresso vazia. Números inventados, apresentados como
   telemetria. Para o leitor definido acima é o item de maior custo da
   página: quem reconhece um mock desconta o resto junto. É também o mesmo
   problema de absoluto sem fonte tratado em `PESQUISA-metricas.md`.
3. **`features` nomeia ferramentas, não resultados.** "EDR/AV Next-Gen com
   ML", "Correlação SIEM Avançada" — o comprador não consegue dizer o que
   muda na operação dele. E o layout escalonado com opacidade decrescente
   sugere hierarquia que ninguém decidiu.
4. **`benefits` é superlativo.** "segurança blindada e confiança real",
   "painel gerencial absurdamente simples", "reduza o achismo". Superlativo é
   a primeira coisa que um CISO desconta.
5. **Falta o dado duro.** Em nenhum lugar a página diz o que acontece às 3h
   da manhã, o que chega toda semana, ou até onde vai a responsabilidade.

**A pirâmide está invertida.** O melhor conteúdo do arquivo — os quatro
`useCases`, que são situações reais de comprador — está na quarta seção de
dez. O pior ocupa o topo.

## A ordem de leitura nova

Sete seções, cada uma respondendo uma pergunta distinta, na ordem em que o
leitor as faz:

| # | Seção | A pergunta que responde |
|---|---|---|
| 1 | o que acontece quando alguma coisa acontece | como vocês operam de verdade? *(hero)* |
| 2 | o que está no escopo — e o que não está | até onde vai a responsabilidade de vocês? |
| 3 | o que você recebe | o que chega na minha mesa, com que frequência? |
| 4 | como a operação roda | quem são, como é a passagem de plantão, em quanto tempo entra no ar |
| 5 | ferramentas | posso conferir item a item? |
| 6 | quatro situações | o meu caso está aqui? |
| 7 | casos | já fizeram isso antes? |

Duas escolhas que não são óbvias:

- **A seção 2 publica o que *não* está no escopo.** Fornecedor que diz o que
  não faz ganha confiança de CISO — é o oposto de "segurança de elite".
- **O hero é uma tabela, não uma imagem.** Para este leitor, saber como a
  operação responde vale mais que qualquer tratamento visual. A aposta por
  trás disso — de que poucos concorrentes publicam o modelo, e que por isso
  ele desempata comparação — é uma hipótese minha, não um levantamento de
  mercado. Se o comercial souber que é falsa, o hero muda.

## O que sai

| Sai | Por quê | Para onde vai o que presta |
|---|---|---|
| `dashboard` | Números inventados apresentados como telemetria | Nada. O espaço vira o modelo de severidade |
| `benefits` | Adjetivo, não informação | O que há de concreto vira entregável na seção 3 |
| Layout escalonado de `features` | Decoração fingindo hierarquia | Lista compacta, uma linha por item dizendo o que faz na operação do cliente |

## A forma dos dados

`src/data/solutionsData.ts` é lido pelas cinco páginas — é aqui que a mudança
deixa de ser estilo e vira estrutura.

```ts
interface NivelDeSeveridade {
  nivel: string;            // "P1"
  exemploConcreto: string;  // o que caracteriza este nível, em uma frase
  quemAge: string;          // quem é acionado
  quando: string;           // em que ordem/prazo relativo, sem número de SLA
  voceRecebe: string;       // o artefato que chega ao cliente
}

interface Escopo { dentro: string[]; fora: string[] }
interface Entregavel { item: string; cadencia: string }

interface Operacao {
  cobertura: string;          // modelo de cobertura, não headcount
  passagemDePlantao: string;
  escalacao: string;
  tempoDeAtivacao: string;
}
```

Adiciona a `SolutionData`: `severidade?`, `escopo?`, `entregaveis?`,
`operacao?` — todos opcionais.
Remove: `dashboard`, `benefits`.
Mantém: `workflow`, `useCases`, `services`, `features`, `onboarding`,
`portfolio`.

`dashboard` hoje é obrigatório na interface; ao removê-lo o TypeScript aponta
os cinco produtos de uma vez, que é o comportamento desejado.

## Degradação

Toda seção nova é opcional e **some inteira** quando não há dado — sem
título órfão, sem bloco vazio, como já acontece com `useCases` e `features`.
É o mesmo tratamento que a seção de blog da home recebeu: título com vazio
embaixo é pior do que não ter a seção.

Consequência assumida: **n.secops também nasce degradado.** O template vai ao
ar e cada seção acende quando a ficha correspondente volta preenchida.

## Rollout

1. Template novo + forma dos dados, com tudo opcional.
2. `FICHA-runbook-por-produto.md` entregue, uma ficha por produto.
3. Cada produto acende conforme a ficha volta. n.secops primeiro por ser o
   que tem mais conteúdo escrito hoje, o que o torna a melhor referência para
   os outros quatro — não tenho dado de tráfego para afirmar mais que isso.
4. Os quatro restantes seguem renderizando `workflow`, `services`,
   `useCases`, `features`, `onboarding` e `portfolio` enquanto isso — a
   página fica mais curta, não quebrada.

## Como se verifica

- Um teste que falha se alguma `/solucoes/:slug` publicar um absoluto sem
  fonte — `100%`, `0 gaps`, `zero downtime` — a mesma regra que fechamos nas
  métricas, agora automatizada. Vale só para as páginas de produto: os
  absolutos que ainda existem em `trustness.` e `forense.io` estão em aberto
  em `PESQUISA-metricas.md` e são outra conversa.
- Um teste que garante que toda seção presente no dado aparece renderizada, e
  que seção sem dado não deixa título órfão.
- A auditoria das oito rotas (alt, rótulo, alvo de 24 px, hierarquia de
  título, rolagem lateral) roda contra `/solucoes/secops` também.

## Fora deste trabalho

- O conteúdo das fichas — é do time que opera.
- Tradução das páginas de produto para `/en` e `/es`: `solutionsData.ts` está
  só em português e por isso essas rotas estão excluídas em `src/routes.ts`.
  Continua assim; reabrir é outro trabalho.
- As páginas das sub-marcas (`trustness.`, `forense.io`) não usam este
  template.
