---
name: "ness., trustness. e forense.io"
description: "O desenho delicado: fundo de meia-noite, filete de 1 px, Montserrat 500 e um ponto azul por assinatura."
colors:
  surface: "#0b1326"
  surface-container-lowest: "#060e20"
  surface-container-low: "#0f172a"
  surface-container-high: "#222a3d"
  surface-container-highest: "#333c52"
  primary: "#7bd0ff"
  primary-container: "#00ade8"
  on-surface: "#dae2fd"
  on-surface-variant: "#9db0c0"
  on-primary: "#003549"
  status-critico: "#ef4444"
  status-desenvolvimento: "#f59e0b"
  status-adequado: "#22c55e"
  status-excelente: "#3b82f6"
  white: "#ffffff"
  hairline: "rgba(255, 255, 255, 0.1)"
  hairline-strong: "rgba(255, 255, 255, 0.2)"
typography:
  display:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "56px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  display-sm:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "44px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  display-xs:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "48px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline-sm:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline-xs:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    letterSpacing: "-0.025em"
  title-block:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 500
    letterSpacing: "-0.025em"
  title-inline:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
  brand:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 500
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.625
  body-small:
    fontFamily: "Inter, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 500
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11.5px"
    fontWeight: 400
  micro:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "10.5px"
    fontWeight: 500
  display-legacy:
    fontFamily: "Montserrat, Montserrat Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "5.5rem"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.05em"
rounded:
  sm: "4px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  full: "9999px"
spacing:
  gutter: "32px"
  section: "96px"
  header: "40px"
  stack: "20px"
  container: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 24px"
    height: "44px"
  link-inline:
    textColor: "{colors.white}"
    typography: "{typography.label}"
    padding: "4px 0"
  field-text:
    backgroundColor: "rgba(255, 255, 255, 0.05)"
    textColor: "{colors.white}"
    rounded: "{rounded.2xl}"
    padding: "16px 24px"
  card-outline:
    rounded: "{rounded.2xl}"
    padding: "24px"
  glyph-aiops:
    backgroundColor: "{colors.primary-container}"
    rounded: "{rounded.full}"
    size: "8px"
  glyph-time:
    backgroundColor: "transparent"
    rounded: "{rounded.full}"
    size: "8px"
  glyph-voce:
    backgroundColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    size: "8px"
  nav-bar:
    backgroundColor: "rgba(51, 60, 82, 0.6)"
    rounded: "{rounded.full}"
    padding: "10px 20px"
---

# Design System: ness., trustness. e forense.io

Uma codebase serve os três domínios, e o desenho é um só: o que muda de marca é
o nome, a foto da abertura e o assunto. Este documento descreve o que está no
ar — foi lido do código, não de uma intenção.

## Overview

**Creative North Star: "O desenho delicado"**

O site fala com um CISO que está comparando fornecedores e desconta tudo o que
parece apresentação. Então a tela não convence pelo volume: convence porque o
conteúdo tem forma. Um filete de 1 px separa; um círculo de 8 px diz quem age;
um tracejado diz que existe uma condição ali. Nada é gritado, e nada é
decorativo — todo traço na tela carrega uma informação que o texto teria de
explicar em um parágrafo.

O fundo é de meia-noite (`#0b1326`), sempre, nos três domínios: o tema é escuro
por definição (`color-scheme: dark`), não por preferência do visitante. Sobre
ele, a tipografia é contida — Montserrat 500 em títulos e marcas, Inter no
corpo — e a escala é baixa de propósito: a maior linha do desenho novo tem 56 px.
A abertura já esteve a 88 px, e a 88 px o site ficava grosseiro; a 32 px ficava
pequeno demais. O tamanho de hoje é o piso da faixa Display do guia de marca. A
página do DPO ainda abre com um título herdado de 88 px (`5.5rem`), com uma
sobrancelha em caixa alta logo acima dele: é o ponto mais alto da dívida, e ela
desce para 48 px quando a tela for redesenhada.

A cor aparece pouco. O azul da marca (`#00ade8`) é assinatura, não tinta: ele
mora no ponto que fecha um nome, no marcador do ator automatizado, no botão de
ação e no fio que indica sequência. Quando uma zona precisa de preenchimento,
ela fica entre 4 % e 8 % de opacidade — ou não tem preenchimento nenhum. O que
foi rejeitado tem nome: bloco cheio no lugar de filete, caixa com gradiente no
lugar de linha, palavra pintada de azul dentro de um título, sobrancelha em
caixa alta acima da abertura e painel de exemplo apresentado como dado real.
Rejeitado quer dizer que não se escreve mais — não que já tenha sumido do site:
as telas ainda não redesenhadas carregam parte disso, e a seção de tipografia
diz quanto.

**Key Characteristics:**

- Fundo de meia-noite fixo, sem tema claro.
- Filete de 1 px como unidade de separação e de estrutura.
- Preenchimento de 4 % a 8 %, ou nenhum.
- Montserrat 500 em título e marca; Inter no corpo.
- Um ponto azul por assinatura, e um marcador de 8 px por ator.
- Diagrama em SVG de traço fino no lugar de card repetido.
- Foto da marca só na abertura, sob véu em degradê.

## Colors

Paleta de um acento só sobre uma escala de superfícies azuladas: tudo o que não
é o azul da marca é superfície, texto ou linha.

### Primary

- **Azul da marca** (`#00ade8`, token `primary-container`): o ponto que fecha
  `ness.`, `trustness.`, `forense.io` e os produtos `n.…`; o fundo do botão de
  ação; o marcador do AIOps; o número e o fio da etapa que está em curso; o
  rótulo de severidade. É a cor mais rara da tela, e é isso que a faz funcionar.
- **Azul claro** (`#7bd0ff`, token `primary`): o segundo ator — o time de
  segurança — e o tracejado que marca ciclo ou condição. Também é o azul do
  `hover` de link de navegação e do anel de foco.

### Neutral

- **Meia-noite** (`#0b1326`, token `surface`): o fundo das páginas
  institucionais e das faixas da home.
- **Meia-noite profunda** (`#060e20`, token `surface-container-lowest`): o fundo
  das páginas de produto e das homes da trustness. e da forense.io; também o
  miolo dos marcadores em anel, para que a linha do fio não apareça por dentro
  do círculo.
- **Ardósia** (`#0f172a`, `#222a3d`, `#333c52`, tokens
  `surface-container-low/high/highest`): as superfícies que se levantam um
  degrau — o menu suspenso, a barra de navegação em vidro, a barra de rolagem.
- **Branco** (`#ffffff`): título e nome de marca. Nenhum título é escrito no
  cinza do corpo.
- **Gelo azulado** (`#dae2fd`, token `on-surface`): o texto corrente e o
  marcador do terceiro ator, você.
- **Cinza de apoio** (`#9db0c0`, token `on-surface-variant`): apoio, legenda,
  rótulo de eixo, texto de nó de diagrama.
- **Azul de contraste** (`#003549`, token `on-primary`): o texto sobre o azul da
  marca — o rótulo dentro do botão.
- **Filete** (`rgba(255,255,255,0.1)` e `rgba(255,255,255,0.2)`): a linha de
  1 px que separa item de item, seção de seção e zona de zona. A mais forte
  (20 %) é a que o leitor precisa ver como estrutura; a mais fraca (10 %), a que
  ele só percebe quando procura.

### Estado

Quatro cores fora da paleta, e só elas: o resultado dos assessments, onde o
nível de maturidade precisa de uma escala que o leitor já reconhece de outros
lugares. Nunca entram em superfície, em texto corrido nem em gráfico decorativo.

- **Crítico** (`#ef4444`): faixa de 0 a 30 pontos. É também a borda do campo de
  formulário com erro, sempre acompanhada da mensagem — a cor nunca é o único
  sinal.
- **Em desenvolvimento** (`#f59e0b`): faixa de 31 a 60.
- **Adequado** (`#22c55e`): faixa de 61 a 80.
- **Excelente** (`#3b82f6`): faixa de 81 a 100.

### Named Rules

**A regra do ponto azul.** O azul da marca só entra depois do nome de uma marca
ou de um produto, como ponto final de um título de seção, no botão de ação, no
marcador do AIOps e no fio da etapa em curso. Nunca dentro de um rótulo de botão
ou de link, e nunca pintando uma palavra no meio de um título.

**A regra do preenchimento fraco.** Uma zona tintada fica entre 4 % e 8 % de
opacidade, ou não tem preenchimento. Bloco cheio de cor é o desenho anterior.

**A regra do fundo único.** Não existe tema claro. A paleta é escrita uma vez,
no `@theme` de `src/index.css`, e é a única fonte da verdade: classe de cor que
não sai de um token do `@theme` não gera CSS e o elemento fica sem fundo, sem
erro nenhum.

## Typography

**Display Font:** Montserrat (variável, self-host, com fallback métrico
"Montserrat Fallback" sobre Arial).
**Body Font:** Inter (variável, self-host, com fallback métrico "Inter
Fallback").
**Mono:** a pilha monoespaçada do sistema, só para hash de evidência e número de
passo.

**Character:** Montserrat é a fonte do guia de marca, e o motivo é o ponto: em
corpo grande, o ponto dela tem o desenho certo — foi por isso que a Manrope saiu,
porque o ponto virava um quadrado. Inter faz o trabalho invisível do corpo. As
duas são variáveis, self-host, com `font-display: swap` e fallback métrico
ajustado (`size-adjust: 108.9%` para a Montserrat, medido no navegador), para
que o texto não salte quando a fonte real chega.

### Hierarchy

- **Display** (Montserrat 500, 56 px no desktop — 44 px em `sm`, 34 px no
  celular; entrelinha 1.1): a abertura da home da ness., e só ela.
- **Headline** (Montserrat 500, 48 px no desktop — 40 px em `sm`, 32 px no
  celular): a abertura de todas as outras telas.
- **Title** (Montserrat 500, 24 px, caixa baixa): o título de seção, sempre
  fechado com o ponto azul, sobre um bloco de no máximo 62 caracteres.
- **Brand** (Montserrat 500, caixa baixa, `letter-spacing: -0.01em`): a
  assinatura de marca, a classe `.marca`. Vale para a marca na navegação, no
  rodapé, acima da abertura e no meio de um parágrafo. A classe não declara
  tamanho — ele vem do contexto, e no ar vai de 14 px (o produto no menu
  suspenso) a 24 px (a marca na navegação), passando por 15, 16, 18 e 20 px.
- **Title inline** (Montserrat 500, 15 px): o título curto de um bloco dentro de
  uma seção — a zona do escopo, a etapa da cadeia de custódia, o item de
  insight — e o nome do cliente na lista. O papel não declara tracking porque os
  seus dois grupos não o compartilham: os três primeiros são `<h3>` e recebem os
  −0,025em da regra de `h1, h2, h3, h4`; o nome do cliente é um `span` fora dela
  e fica com o tracking padrão do navegador. Os outros 15 px da tela não são
  deste papel — o nome do produto no mapa de soluções é `.marca`, e o parágrafo
  de fecho é corpo.
- **Body** (Inter 400, 16 px, entrelinha 1.625, no máximo 58–72 caracteres por
  linha): o texto corrente. O lede da abertura sobe para 18 px em `md`, e o
  parágrafo de fecho de página desce a 15 px — ainda Inter 400, não o papel de
  título de mesmo tamanho.
- **Body small** (Inter 400, 13,5 px / 13 px): item de lista, legenda de figura,
  texto de apoio dentro de um bloco.
- **Label** (Montserrat 500, 12,5 px, caixa normal): rótulo de coluna, de eixo e
  de estado.
- **Title block** (Montserrat 500, 17 px, caixa baixa): o título de um bloco de
  oferta dentro de uma seção — a isca de material gratuito.
- **Mono** (11,5 px): o hash da cadeia de custódia; a 14 px, o número de passo
  dos blocos herdados.
- **Micro** (Montserrat 500, 10,5 px): o número dentro do anel de 19 px de uma
  etapa numerada, e o nível de severidade sobre a régua do mês. É o menor texto
  do site, e só aparece dentro de um marcador.

Fora dessa escala existe um degrau só, herdado: os 88 px (`5.5rem`) do título da
página do DPO. Nenhum desenho novo o usa.

### Named Rules

**A regra do 500.** Título e marca são Montserrat 500. Não existe 600 no desenho
novo, e peso novo escrito a 600 é regressão. O 600 que ainda está no ar é
dívida, e ela é grande: cerca de 28 ocorrências em 17 arquivos — entre outras,
na grade de ferramentas das páginas de produto sem ficha, no menu do celular,
nos títulos de fallback de `Operacao` e `RespostaAIncidente`, no rodapé, e nas
páginas ainda não redesenhadas (contato, carreiras, portfólio e o caso, blog,
sobre, conformidade, o estado vazio, o erro e a página do DPO). Não é um resto
de quatro blocos: sai tela a tela, conforme cada uma for redesenhada.

**A regra da marca desenhada.** Nome de marca no meio de um texto nunca sai como
texto comum: passa por `ComMarcas`, que o escreve em Montserrat 500 com o ponto
no azul da marca. Um `ness.` com o ponto cinza dentro de um parágrafo é a regra
quebrada, e há teste e2e que reprova.

**A regra da caixa baixa.** Título de seção e nome de marca são escritos em
caixa baixa, e nenhum texto novo nasce em caixa alta. A dívida aqui é maior que
a do peso: `uppercase` aparece cerca de 95 vezes em 22 arquivos — no
micro-rótulo da navegação, no rótulo de métrica e no de campo de formulário, no
rótulo de botão de várias telas ainda não redesenhadas (contato, carreiras,
portfólio, a página de produto, o erro) e na sobrancelha em caixa alta acima da
abertura de carreiras, sobre, brandbook e da página do DPO. Não se escreve um
novo; os que existem saem com o redesenho de cada tela.

### Desvios deliberados do guia do ecossistema

Três, todos conscientes:

1. **Montserrat 500 nos títulos**, onde o guia do ecossistema pede 600. A 600 o
   título brigava com o corpo e o desenho perdia a delicadeza.
2. **Produto grafado com o ponto azul** — `n.secops`, `n.cirt`, `n.infraops` —,
   onde o guia pede a forma colada em caixa camelo (`nShield`). O ponto é a
   assinatura do ecossistema, e o produto herda a assinatura.
3. **Rótulo em caixa normal**, onde o guia pede caixa alta.

E uma exceção de grafia que não é desvio: **ness.OS** se escreve com "OS" em
maiúsculo, com o ponto azul no meio. É o único nome do ecossistema que carrega
maiúscula; todos os outros (`ness.`, `trustness.`, `forense.io`, `n.secops`)
são inteiramente em caixa baixa.

## Layout

Uma coluna centrada de no máximo 1280 px (`max-w-7xl`), com goteira de 32 px
(`px-8`) em qualquer largura. O container das páginas de produto e das homes é
`box-content`, para que a goteira fique fora dos 1280 px e a medida do texto não
encolha.

A abertura com foto é a exceção: ela é uma seção de largura inteira, fora do
container, com altura mínima de 84 vh na home da ness. e 70 vh nas demais, e
respiro de topo de 144 px (160 px em `md`) para passar por baixo da barra de
navegação flutuante.

O ritmo vertical é constante: 96 px entre seções (`mb-24`), 40 px entre o
cabeçalho de uma seção e o conteúdo dela, 20 px entre os elementos empilhados da
abertura. O texto de apoio de um cabeçalho de seção fica a 12 px do título.

A medida do texto é curta de propósito: 58 caracteres no lede da abertura, 60 no
fecho, 62 no cabeçalho de seção, 72 na legenda de figura.

Os pontos de parada são os do Tailwind, sem configuração própria: `sm` 640 px,
`md` 768 px, `lg` 1024 px, `xl` 1280 px. Quem manda no rearranjo é `md` para
texto e tabela, e `lg` para as linhas do tempo, que passam de vertical (marcador
à esquerda, fio descendo) a horizontal (marcador em cima, fio atravessando). A
auditoria das rotas roda a 390 px e a 1440 px, e nenhuma página rola de lado.

**A regra dos dois desenhos.** Um diagrama largo não é escalado para o celular:
são dois desenhos do mesmo grafo, um horizontal e um vertical, cada um com o seu
`viewBox`, e o outro fica escondido. Escalar levaria o rótulo de 11,5 px para
4 px. No desenho do celular o rótulo sobe para 13 px, porque lá o SVG encolhe
para cerca de 88 % da largura.

## Elevation & Depth

O sistema é plano. Não há sombra em repouso, não há card que "levanta", e a
profundidade vem de três coisas: o filete de 1 px, o degrau tonal entre as
superfícies e um único brilho difuso atrás da abertura.

### Shadow Vocabulary

- **`nebula-shadow`** (`box-shadow: 0 20px 40px rgba(0, 173, 232, 0.08)`): a
  barra de navegação flutuante e o menu suspenso de soluções — os dois elementos
  que realmente flutuam sobre a página.
- **Brilho do botão** (`box-shadow: 0 0 20px rgba(0, 173, 232, 0.25)`): só no
  `hover` do botão de ação. É resposta a estado, nunca repouso.
- **Brilho da abertura** (`radial-gradient` a 50 % 45 %, azul da marca a 14 %):
  atrás do título da abertura, sobre a foto. Não é sombra: é luz.

### Named Rules

**A regra do filete.** Profundidade se faz com uma linha de 1 px, não com uma
sombra. Se um bloco precisa se separar do vizinho, ele ganha `border-t` a 10 %
de branco — não um fundo, não um card, não uma elevação.

## Shapes

Duas formas resolvem quase tudo: o círculo e o retângulo de canto suave.

- **Pílula** (`rounded-full`): tudo que é ação ou marcador — botão, seletor de
  idioma, barra de navegação, marcador de ator, marcador de etapa, filete de
  medida. Ação é sempre pílula; nunca um retângulo.
- **16 px** (`rounded-2xl`): figura, moldura de diagrama, aparte, campo de
  formulário, caixa de erro. É o canto padrão de qualquer superfície contida.
- **24 px** (`rounded-3xl`): o menu suspenso de soluções.
- **10 a 14 px** (`rx` no SVG): o nó e a moldura tracejada dentro dos diagramas;
  6 px nas fichas pequenas de fonte de evento.
- **Losango** (quadrado de 10 px a 45°): a marca do entregável mensal na régua
  do mês. É a única forma que não é círculo nem retângulo, e é ela que separa o
  mensal do contínuo.

Marcadores, por tamanho e por função:

- **8 px**, círculo: o ator (AIOps, time de segurança, você).
- **9 px**, anel de 1 px sobre o fundo da página: a etapa de uma sequência.
- **19 px**, anel de 1 px com o número dentro: a etapa numerada de uma ativação.
- **2 px de altura**, filete arredondado: quanto um ator entra em um nível de
  severidade.

**A regra do tracejado.** Tracejado quer dizer condição ou limite, nunca
decoração: o limite do runbook, o limite do contrato, o desvio que só acontece
se o contato não responder, o ciclo que se repete, a fronteira do que a ness.
opera. Linha cheia é o que sempre acontece.

## Components

### Buttons

- **Shape:** pílula (`border-radius: 9999px`), altura fixa de 44 px, que é
  também o alvo de toque.
- **Primary:** fundo no azul da marca (`#00ade8`), texto em azul de contraste
  (`#003549`), Montserrat 500 a 14 px, 24 px de recuo lateral.
- **Hover / Focus:** `filter: brightness(1.1)` mais o brilho de 20 px; no
  `active`, `scale(0.98)`. O foco é um anel branco de 2 px com 2 px de
  afastamento sobre a superfície.
- **Secondary:** não existe botão secundário. O segundo caminho é um link
  sublinhado — Montserrat 500 a 14 px, branco, sublinhado a 25 % de branco com
  5 px de afastamento, que passa ao azul da marca no `hover`. Dois botões lado a
  lado dividem a decisão; um botão e um link a ordenam.

### Cards / Containers

- **Corner Style:** 16 px.
- **Background:** nenhum, na maioria dos casos. Quando precisa de um, é o próprio
  fundo da página; quando precisa de tinta, 5 % do azul da marca.
- **Shadow Strategy:** nenhuma (ver Elevation & Depth).
- **Border:** 1 px a 10 % de branco.
- **Internal Padding:** 24 px (12 px em volta de um diagrama no celular, 28 px em
  `md`).

### Inputs / Fields

- **Style:** fundo a 5 % de branco, borda de 1 px a 35 % de branco, canto de
  16 px, 16 px por 24 px de recuo. O rótulo fica acima, recuado 24 px para
  acompanhar o canto do campo.
- **Focus:** anel de 2 px no azul da marca, com o contorno nativo removido.
- **Error:** a borda passa a vermelho a 60 %, e a mensagem sai em `role="alert"`
  abaixo do campo — a cor nunca é o único sinal.

### Navigation

Barra flutuante em vidro: 95 % da largura, no máximo 1280 px, centrada a 12 px
do topo (16 px em `md`), com recuo interno de 10 px por 20 px (12 px por 32 px
em `md`), fundo da superfície mais alta a 60 % com
`backdrop-filter: blur(24px)`, borda de 1 px a 10 % de branco e a sombra
`nebula-shadow`. A marca fica à esquerda, em `.marca` a 24 px, e muda com o
domínio. O item ativo é escrito no azul da marca. No celular a barra vira um
menu de tela cheia, com os títulos grandes em caixa baixa e os cinco produtos
listados sob "soluções" — no toque não existe `hover`, então nada fica escondido
atrás de um.

### Glifos por ator (assinatura)

O componente que o resto do sistema depende para dispensar legenda: três
marcadores de 8 px, sempre os mesmos, em todos os diagramas de todas as páginas
de produto. O leitor aprende uma vez.

- **AIOps** — círculo cheio no azul da marca (`#00ade8`).
- **Time de segurança** — anel de 1,5 px no azul claro (`#7bd0ff`), sem
  preenchimento.
- **Você** — círculo cheio no gelo azulado (`#dae2fd`).

O ator automatizado se chama AIOps, e só AIOps. O marcador é decorativo para a
tecnologia assistiva (`aria-hidden`): o nome do ator vem sempre escrito ao lado,
porque forma e cor nunca carregam a informação sozinhas.

### Abertura (assinatura)

Centralizada, em no máximo 768 px: a marca acima, a promessa em Display ou
Headline fechada com o ponto azul, o lede em cinza de apoio, e as ações — um
botão e um link. Quando a página tem foto, ela ocupa a largura inteira por trás,
em três camadas: a foto (55 % de opacidade na ness., 40 % e em cinza nas outras
marcas), um véu em degradê vertical que vai de 20 % a 100 % do fundo da seção
seguinte — sem ele aparece emenda entre a abertura e a seção de baixo — e, por
cima, o brilho radial do azul da marca no centro. A foto é servida em AVIF e
WebP em três larguras, com `alt` vazio e `aria-hidden`, porque não carrega
informação.

### Diagramas (assinatura)

Os diagramas são o produto: o fluxo do evento, a escada de severidade, a zona de
escopo, a régua do mês, a cadeia de custódia, o ciclo do DPO. Todos seguem as
mesmas regras: traço de 1 px, preenchimento de 5 % ou nenhum, texto de 12 px a
13 px, marcador de ator para dizer quem age, tracejado para dizer condição,
`role="img"` com um `aria-label` que descreve o desenho em uma frase, e uma
legenda logo abaixo que diz o que o desenho afirma. Dado de exemplo aparece
rotulado como exemplo, na própria figura.

## Do's and Don'ts

### Do:

- **Do** separar com um filete de 1 px a 10 % de branco antes de pensar em card.
- **Do** fechar todo título de seção com o ponto azul, e escrever o título em
  caixa baixa, Montserrat 500 a 24 px.
- **Do** escrever nome de marca no meio de um parágrafo através de `ComMarcas`,
  para que saia em Montserrat 500 com o ponto no azul da marca.
- **Do** usar os três marcadores de ator de 8 px sempre que um desenho disser
  quem faz o quê, e escrever o nome do ator ao lado.
- **Do** desenhar duas versões de um diagrama largo — uma horizontal e uma
  vertical — em vez de escalar uma só.
- **Do** manter o alvo de toque em 44 px nas ações e o anel de foco visível em
  tudo que recebe teclado.
- **Do** rotular dado de exemplo como exemplo, dentro da própria figura.
- **Do** respeitar `prefers-reduced-motion`: a folha de estilo já zera duração e
  repetição, e nada pode reintroduzi-las inline.

### Don't:

- **Don't** escrever título em Montserrat 600 — o desenho é 500.
- **Don't** pintar uma palavra de azul dentro de um título, nem pôr sobrancelha
  em caixa alta acima da abertura — as quatro que ainda estão no ar (carreiras,
  sobre, brandbook e a página do DPO) são dívida nomeada na regra da caixa
  baixa, não precedente.
- **Don't** preencher uma zona acima de 8 % de opacidade.
- **Don't** pôr sombra em superfície em repouso; sombra é resposta a estado.
- **Don't** usar tracejado como decoração — ele significa condição ou limite.
- **Don't** pôr dois botões lado a lado: a segunda ação é um link sublinhado.
- **Don't** escrever uma classe de cor fora dos tokens do `@theme`
  (`bg-surface-container` sem sufixo não existe, não gera CSS e falha em
  silêncio; há teste que reprova).
- **Don't** usar foto fora da abertura, nem foto sem véu em degradê e sem brilho
  central.
- **Don't** apresentar painel ou telemetria de mentira como se fosse dado real.
