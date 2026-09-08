# Pauta de conteúdo — o que falta para o site vender

> Escopo: ness.com.br, trustness.com.br e forense.io.
> A engenharia da Onda 2 está entregue: o site renderiza na edge, indexa em três
> idiomas e tem o caminho do lead fechado. O que falta agora **não é código**.

Esta pauta lista o que precisa ser produzido, em que ordem, e em que formato —
os campos são os que o CMS (canal) já espera, para o conteúdo entrar sem
retrabalho.

---

## 1. Por que esta é a fila

| Falta | Trava o quê |
|---|---|
| Casos com números | A seção de prova social da home fica vazia. Hoje quem chega lê promessa sem evidência |
| Depoimentos | Mesma seção. Um caso sem alguém assinando é folheto |
| Métricas comprováveis | Três alegações no site são absolutas e indefensáveis (§4) |
| Traduções de soluções e assessments | `/en/solucoes/secops` e `/es/assessment/cyber` **não existem** — foram deixados fora de propósito, para não indexar página inglesa com corpo em português |
| Insights com cadência | O blog já renderiza no servidor; sem publicação regular, não há o que indexar |

---

## 2. Prioridade 1 — seis casos com números

**Meta:** 6 estudos publicados, sendo ao menos 2 por marca.

O CMS espera exatamente estes campos por caso:

| Campo | O que é | Exemplo |
|---|---|---|
| `client` | Nome do cliente **ou** descrição sob NDA | `Banco regional (sob NDA)` |
| `category` | Uma de: Segurança, Infraestrutura, Software, Privacidade, Forense | `Segurança` |
| `project` | O que foi entregue, em uma linha | `SOC gerenciado 24×7` |
| `result` | O resultado, com número | `MTTD de 72 h para 4 h` |
| `desc` | 2–3 frases: contexto, o que foi feito, o que mudou | — |
| `stats` | 3 métricas `{label, value, delta}` | `{MTTD, 4h, -94%}` |
| `image` | 1200×630, sem logo de cliente não autorizado | — |

**Como obter os números sem violar NDA:**

1. Peça ao gerente da conta o *antes* e o *depois* de **uma** métrica operacional
   que já exista no relatório mensal — não invente indicador novo.
2. Se o valor absoluto for sensível, publique só a variação (`-94%`) e omita a
   base. Variação sem base não identifica o cliente.
3. Cliente sob NDA vira setor + porte: `Banco regional`, `Indústria de médio
   porte`, `Operadora de saúde`. Nunca `um grande banco brasileiro` — isso é
   identificável e não diz nada.

**Quem aprova:** o gerente da conta valida o número; o jurídico valida a
descrição do cliente. Sem as duas assinaturas, o caso não publica.

---

## 3. Prioridade 2 — três depoimentos por marca

**Meta:** 9 depoimentos (3 ness., 3 trustness., 3 forense.io).

Peça a cada cliente **três respostas curtas**, não um texto livre:

1. Qual era o problema antes de chamar a ness.? (1–2 frases)
2. O que mudou depois, que você consegue medir? (1 frase, com número se houver)
3. O que você diria a quem está avaliando contratar? (1 frase)

Publique com **nome, cargo e empresa**. Depoimento anônimo não convence — se o
cliente não pode se identificar, use o caso (§2) e deixe o depoimento de fora.

Formato de entrega: 40–60 palavras por depoimento, já revisado pelo cliente por
escrito (e-mail de aprovação anexado ao card no canal).

---

## 4. Prioridade 3 — trocar as três métricas indefensáveis

Estas estão no site hoje e não se sustentam:

| Onde | Alegação atual | O problema | Troque por |
|---|---|---|---|
| forense.io | **laudos aceitos: 100%** | Alegação sobre decisão judicial de terceiro. Um único laudo contestado desmente | Número absoluto de laudos entregues, ou anos de atuação pericial |
| trustness. | **certificações: 100%** | Não é métrica — 100% de quê? | Quantidade de certificações vigentes, nominalmente (ISO 27001, etc.) |
| trustness. | **compliance score: 100%** | Índice sem fonte nem metodologia | Média de aderência nos assessments concluídos, com n amostral |
| Portfólio | **100% de confidencialidade** | Absoluto de segurança é o tipo de frase que envelhece mal | O compromisso contratual concreto: NDA em todo projeto, cadeia de custódia ISO 27037 |

Regra geral: **todo número no site precisa ter uma fonte que alguém do time
consiga apontar em 30 segundos.** Se não tem, não publica.

---

## 5. Prioridade 4 — insights com cadência

**Meta:** 2 publicações por mês, alternando marcas. Cada post usa os campos
`title`, `tag`, `date`, `desc`, `body` (markdown), `featured`.

Pautas concretas, todas dentro do que a casa faz — quem escreve é quem opera:

**ness. (infra e engenharia)**
- O que muda no runbook quando o SOC passa a operar 24×7 de verdade
- Custo real de um ambiente crítico: onde o orçamento vaza sem ninguém ver
- Migração sem janela: o que precisa estar pronto antes do primeiro corte

**trustness. (GRC e privacidade)**
- LGPD depois da multa: o que os primeiros processos sancionadores mudaram na prática
- DPO interno, terceirizado ou híbrido — como decidir pelo tamanho da operação
- ISO 27001: os controles que reprovam mais em auditoria de primeira vez

**forense.io (perícia)**
- Cadeia de custódia digital: onde a evidência costuma se perder
- Ransomware: as primeiras seis horas decidem o resto da resposta
- O que um laudo precisa ter para não ser contestado

Cada post: 800–1200 palavras, um exemplo concreto, e um CTA para o assessment ou
o contato. Sem post genérico sobre "a importância da segurança" — isso já existe
na internet inteira e não posiciona ninguém.

---

## 6. Prioridade 5 — traduções que reabrem rotas

Dois arquivos, e só eles, seguram as páginas de solução e assessment em inglês
e espanhol:

| Arquivo | O que contém | Efeito de traduzir |
|---|---|---|
| `src/data/solutionsData.ts` | Copy das 5 soluções (overview, entregas, metaTitle, metaDescription) | Reabre `/en/solucoes/:slug` e `/es/solucoes/:slug` |
| `src/data/assessments.ts` | Perguntas e resultados dos assessments LGPD e Cyber | Reabre `/en/assessment/:type` e `/es/assessment/:type` |

Tradução técnica, não literal: `perícia digital` é `digital forensics`, não
`digital expertise`. Quando as duas estiverem prontas, a reabertura é uma linha
em `src/routes.ts` — a estrutura de idioma já está montada e testada.

---

## 7. Como entregar

- **Onde:** canal (CMS), coleções `cases` e `insights`. Rascunho fica em
  `status: draft` e só aparece no site quando vira `published`.
- **Idioma:** cada entrada tem `locale`. Publicar em `pt` já vale; `en` e `es`
  entram quando houver tradução — a rota já sabe buscar pelo idioma da URL.
- **Imagens:** 1200×630 para og:image. Sem logo de cliente sem autorização por
  escrito.
- **Quem revisa:** conteúdo técnico revisado por quem operou o projeto; número
  revisado pelo gerente da conta; nome de cliente revisado pelo jurídico.

---

## 8. O que não depende de conteúdo

Registrado aqui para não se misturar com a fila acima — é trabalho de
engenharia, e está esperando decisão ou chave, não texto:

- **Turnstile** — criar o widget no painel e instalar o secret. O formulário já
  está cabeado e funciona sem ele.
- **Zaraz + consentimento** — configuração no painel; os eventos já saem do código.
- **Cloudflare Web Analytics** — ligar no painel. Sem dado de campo, qualquer
  ajuste de performance é chute.
- **Resend** — chave. O aviso de lead novo já está pronto e inerte sem ela.
