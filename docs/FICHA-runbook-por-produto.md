# Ficha — o runbook de cada produto

Uma ficha por produto. Preencha o que souber; seção sem resposta simplesmente
não aparece no site, então **ficha pela metade já vale** — não segure para
entregar completa.

O desenho que estas fichas alimentam está em `DESIGN-pagina-de-produto.md`.

## Três regras

1. **Nada de número de SLA.** A decisão foi publicar o modelo, não o número.
   "contém primeiro, avisa depois" pode; "resposta em 15 minutos" não —
   isso fica na proposta.
2. **Nada de absoluto sem fonte.** `100%`, `0 gaps`, `zero downtime` não
   entram, pela mesma razão registrada em `PESQUISA-metricas.md`.
3. **Diga o que *não* está no escopo.** É a parte que mais constrói confiança
   com quem compra, e a que ninguém publica.

---

## n.secops — SOC 24×7, resposta a incidentes e GRC

### Modelo de severidade

Quatro linhas. Se vocês usam outra escala, troque os nomes.

| | P1 | P2 | P3 | P4 |
|---|---|---|---|---|
| **O que caracteriza este nível** (uma frase, exemplo concreto) | | | | |
| **Quem age** (papel, não nome) | | | | |
| **Em que ordem** (ex.: "contém primeiro, avisa depois") | | | | |
| **O que o cliente recebe, e quando** | | | | |

> **Matéria-prima já publicada no site**, para conferir e corrigir — não é
> resposta, é ponto de partida:
> - *"Isolamos a ameaça antes que ela se espalhe e avisamos você diretamente
>   em canais de resposta rápida, como Teams ou WhatsApp."* → isto descreve um
>   P1? A contenção vem mesmo antes do aviso?
> - *"Se houver qualquer comportamento estranho ou brecha de segurança, nós
>   detectamos no mesmo segundo."* → "no mesmo segundo" é afirmação de tempo
>   sem fonte. O que entra no lugar?

### Escopo

| | Preencher |
|---|---|
| **Dentro** — o que vocês monitoram e sobre o que agem (liste) | |
| **Fora** — o que explicitamente não é responsabilidade de vocês | |
| **Fronteira** — onde acaba vocês e começa o cliente (ex.: quem aplica patch em produção?) | |

### O que o cliente recebe

| Artefato | Cadência |
|---|---|
| | |
| | |
| | |

> Matéria-prima: *"Tudo o que defendemos vira um relatório claro"*,
> *"Portal Integrado"*, *"relatórios trimestrais de patch"*, *"evidências
> organizadas para ISO 27001 e LGPD"*. Quais existem de fato, e de quanto em
> quanto tempo chegam?

### Como a operação roda

| Campo | Preencher |
|---|---|
| **Cobertura** (modelo, não headcount — ex.: turnos, follow-the-sun, sobreaviso) | |
| **Passagem de plantão** (como um turno entrega ao outro sem perder contexto) | |
| **Escalação** (quem o cliente aciona, e o que acontece se não responderem) | |
| **Tempo de ativação** (do contrato assinado até estar monitorando — faixa serve) | |

---

## n.infraops — infraestrutura e cloud com FinOps

*(mesma estrutura; copie os quatro blocos acima)*

---

## n.devarch — engenharia e arquitetura de software

*(mesma estrutura)*

---

## n.autoops — automação de infraestrutura e processos

*(mesma estrutura)*

---

## n.cirt — resposta a incidentes cibernéticos

*(mesma estrutura. Este é o produto onde o modelo de severidade mais importa —
é literalmente o que se vende)*

---

## Quando devolver

Me mande o arquivo com o que estiver preenchido, mesmo que seja só o modelo
de severidade de um produto. Eu levo para `src/data/solutionsData.ts` no mesmo
commit, com a data e quem confirmou no corpo da mensagem — para a próxima
pessoa saber de onde veio.
