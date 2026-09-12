# Estudo: Tailwind, shadcn e o *wow* do desktop

**Data:** 12/09/2026 · **Pedido:** Ricardo Esper ("um estudo para implantação de
Tailwind e/ou shadcn para elevar a qualidade visual; no celular o site está
adequado, no desktop está pouco *wow*") · **Status:** estudo, a decidir ·
**Base:** [`superpowers/specs/2026-09-11-site-wow-design.md`](superpowers/specs/2026-09-11-site-wow-design.md),
[`PLAN-movimento.md`](PLAN-movimento.md), `DESIGN.md`

## 0. A resposta curta

1. **Tailwind já está implantado.** O site roda Tailwind CSS 4.1 (o admin,
   4.2) desde a fundação; todo componente é escrito com ele. Não há o que
   "implantar": há o que **usar melhor** (seção 3).
2. **shadcn/ui não resolve o problema do desktop, e no site público atrapalha.**
   É uma coleção de componentes de aplicativo (diálogo, menu, abas,
   formulário) sobre Radix e React, com uma estética própria de cartão,
   borda e sombra. Nada disso é o que falta na home a 1440 px, e tudo isso
   briga com duas decisões já tomadas: o desenho delicado (D2) e as páginas
   sem JavaScript (D13). Onde ele faz sentido é no **backoffice** (seção 4).
3. **O desktop está "pouco *wow*" por composição, não por ferramenta.** O
   layout de desktop de hoje é o layout do celular esticado: uma coluna
   estreita de texto pequeno, centralizada ou encostada à esquerda, com 60 %
   da largura vazia e um único objeto visual, a foto da abertura. O celular
   fica bom porque a coluna estreita **é** o celular. A 1440 px, a mesma
   coluna vira um site tímido (seção 2).
4. **A recomendação** é um plano de composição de desktop em quatro PRs
   (seção 5), todo em Tailwind 4 e CSS nativo, sem biblioteca nova, que
   junta o que a spec já previu para as homes (a linha da empresa e a faixa
   de presença) com uma grade editorial, uma escala fluida e objetos
   visuais na primeira tela.

## 1. Onde o site está

| Dimensão | Estado |
|---|---|
| CSS | Tailwind CSS 4.1.14 via `@tailwindcss/vite`; tokens em `@theme` (`src/index.css`); `@layer movimento` (PR #49) |
| Componentes | próprios, em `src/components/`; nenhum kit (sem Radix, shadcn, Headless UI, Base UI) |
| Ícones | `lucide-react` (o mesmo que o shadcn usa) |
| Animação | CSS nativo (PR #49); `motion` só no portfólio, na página de produto e no chat, e saindo |
| Backoffice (`canal/admin`) | Tailwind 4.2 e componentes próprios (`Card`, `Tabs`, `Table`, `StatCard`, `Badge`, `EmptyState`) |
| Decisões vigentes | D2: o desenho delicado é a base; D3: o leitor conduz; D6: LCP ≤ 2,5 s no celular; D13: páginas de conteúdo sem JavaScript, menus com `<details>`/`popover` |
| Portões na CI | e2e: abertura ≤ 56 px, seções ≤ 28 px, home com ≤ 6 seções, marca sempre desenhada, axe sem violações; Lighthouse; detector do impeccable |

## 2. Diagnóstico: por que o desktop parece pouco *wow*

Medido na home a 1440 × 900 (screenshots de 12/09, no preview do PR #49).

### 2.1 A largura não é usada

| Bloco | Largura do conteúdo | Da tela | O que sobra |
|---|---|---|---|
| Abertura (título, lede, ações) | `max-w-3xl` = 768 px, centrado | 53 % | 24 % de cada lado, só foto escurecida |
| Lede da abertura | `max-w-[58ch]` ≈ 520 px | 36 % | — |
| Cabeçalho de seção (`CabecalhoDeSecao`) | `max-w-[62ch]` ≈ 560 px, à esquerda | 39 % | a direita inteira vazia, em cima de cada seção |
| Fecho ("conte o que precisa resolver") | `max-w-[60ch]` ≈ 540 px, à esquerda | 38 % | 62 % vazio |
| Ciclo, blog, clientes | `max-w-7xl` = 1280 px | 89 % | usam a largura, mas em texto de 13–15 px |

Na coluna de 390 px do celular, o texto ocupa a coluna inteira e a página
tem ritmo. A 1440 px, os mesmos blocos viram uma faixa estreita num campo
escuro. É a definição de "layout do celular esticado".

### 2.2 A escala é a do celular

| Elemento | Tamanho | A 1440 px lê como |
|---|---|---|
| Título da abertura | 56 px (teto da CI) | um título de página interna, não de capa |
| Título de seção | 24 px | subtítulo |
| Nome de produto no ciclo | 15 px | rodapé |
| Resumo do produto, artigo do blog, cliente | 12,5–13,5 px | letra miúda |
| Corpo | 16 px | ok |

O desenho delicado fixou a escala olhando o celular ("a 88 px a home era
grosseira; a 32 px, pequena demais"). A 1440 px não houve a mesma volta. Os
textos de 12,5–13,5 px, que no celular são um segundo plano discreto, no
desktop somem.

### 2.3 Há um objeto visual só

A home tem a foto da abertura e mais nada: nenhum diagrama, nenhuma marca
de cliente desenhada, nenhuma figura. As páginas de produto (n.secops) têm
o fluxo do evento em SVG e, por isso, **já parecem mais ricas no desktop do
que a home**. O *wow* que a spec define, "ver a operação funcionando por
dentro", está nas páginas de produto e ainda não chegou à primeira tela.

### 2.4 O que já melhorou e o que não resolve

O PR #49 (movimento) dá **tempo** ao desenho: a abertura se compõe, os
filetes se desenham, o hover acende. Isso tira o "captura de tela". Mas não
muda a composição: a coluna continua estreita e o texto continua pequeno.
Movimento sobre um layout tímido é um layout tímido que se mexe.

## 3. Tailwind: o que já está e o que falta usar

Tailwind 4 já é a base. O que ele oferece e o site ainda não usa, e que é
exatamente o que a composição de desktop precisa:

| Recurso do Tailwind 4 | Para quê | Onde |
|---|---|---|
| **Escala fluida com `clamp()` no `@theme`** (`--text-display: clamp(34px, 1.6vw + 24px, 64px)`) | a abertura crescer com a tela sem quebrar no celular; um token por faixa, não três utilitários por breakpoint | `index.css`, `Abertura.tsx` |
| **`grid-cols-12` + `subgrid`** (nativo no v4) | a grade editorial: cabeçalho de seção numa coluna à esquerda (4/12) e o conteúdo à direita (8/12), alinhados linha a linha | `CabecalhoDeSecao`, `Solutions`, `Insights`, `ClientLogos`, `CTA` |
| **Container queries (`@container`, `@lg:`)** | o ciclo e os diagramas mudarem de desenho pela largura do contêiner, não da tela | `Solutions.tsx`, `momentos/` |
| **`@utility`** | as classes de movimento (`.entra`, `.revela`, `.filete`) aceitarem variantes (`lg:revela`, `hover:`), em vez do `.filete-lg` feito à mão | `index.css` |
| **Variantes `starting:` e `open:`** | menus e painéis com `@starting-style` e `<details open>` sem CSS avulso | `Navbar.tsx`, frente 3 |
| **`text-pretty`** | parágrafos sem viúva, ao lado do `text-balance` dos títulos | `Abertura`, `CabecalhoDeSecao` |
| **`@theme` para o movimento** | os tokens `--ease-*` e `--dur-*` saírem do `:root` para o `@theme`, ganhando utilitários (`ease-sair`, `duration-curta`) | `index.css` |

Nada disso pede dependência. É migração de utilitários avulsos para tokens
e grades do próprio Tailwind 4.

## 4. shadcn/ui: o que é, o que dá, o que custa

**O que é.** Não é uma biblioteca instalada: é um gerador que copia
componentes React para o repositório (`npx shadcn add dialog`), escritos
com Tailwind, `class-variance-authority`, `clsx`/`tailwind-merge` e
primitivos do **Radix UI** (ou, nas versões recentes, do Base UI) para
acessibilidade e comportamento. Vem com um tema de tokens (`--background`,
`--card`, `--primary`, `--radius`) e uma estética: cartões com borda,
sombras suaves, cantos de 8–12 px, botões cheios.

**O que ele dá bem.** Componentes de aplicativo prontos e acessíveis:
`Dialog`, `Sheet`, `DropdownMenu`, `NavigationMenu`, `Tabs`, `Accordion`,
`Popover`, `Tooltip`, `Command`, `Form` (com react-hook-form e zod),
`Table`, `DataTable`, `Toast`, `Select`, `Combobox`, `Calendar`.

**O que ele não dá.** Composição, escala, ritmo, imagem, diagrama, uma
primeira tela. O *wow* de um site institucional não está numa `Tabs`
acessível. Sites de referência do próprio ecossistema shadcn (Vercel,
Linear, Resend) são *wow* pela composição e pela tipografia, não pelos
componentes, que lá são coadjuvantes.

**O que custa aqui.**

| Custo | Por quê | Peso |
|---|---|---|
| **JavaScript nas páginas de conteúdo** | todo componente shadcn é React sobre Radix; precisa de hidratação. A D13 tira o React das três homes e das páginas de produto; os menus vão para `<details>`/`popover` nativos | bloqueia |
| **Estética contrária ao desenho delicado** | cartão, borda, sombra e canto de 12 px são o que o `DESIGN.md` proíbe ("separar com um filete antes de pensar em card", "não pôr sombra em superfície em repouso") | cada componente teria que ser despido, e aí não sobra o shadcn |
| **Dois sistemas de tokens** | `--background`/`--card`/`--muted` ao lado de `--color-surface*`; ou se traduz um no outro, ou se mantêm dois | dívida |
| **Peso** | Radix para menu, diálogo e popover: 25–40 kB gz; `class-variance-authority` + `tailwind-merge`: ~8 kB | contra a D6 e o portão de 10 KiB de script das rotas migradas |
| **Testes** | o e2e de marca-desenhada, de escala e de axe continua valendo; nada muda de graça | — |

**Onde ele faz sentido.**

- **`canal/admin` (backoffice):** é um aplicativo, hidratado, com tabelas,
  abas, formulários e diálogos. Os componentes próprios de lá (`Card`,
  `Tabs`, `Table`, `StatCard`) são exatamente o catálogo do shadcn, feito à
  mão. O `PLAN-uiux-pro-max.md` já pede ali refração de vidro, abas com
  respiro e grid "bento": o shadcn entrega a base acessível disso em uma
  tarde, com o tema traduzido para os tokens da marca. **Recomendação:
  sim, no admin, numa frente própria.**
- **As páginas hidratadas do site** (contato, assessment, carreiras): o
  `Form` + zod do shadcn substituiria `utils/formulario.ts` e daria
  validação com mensagem por campo. Ganho real, mas pequeno; só se o admin
  já tiver adotado e o time quiser um padrão só.
- **O chat (`ChatbotWidget`)**: `Sheet` e `ScrollArea` caem bem; é um
  módulo carregado sob demanda, fora do caminho crítico. Opcional.

**Verdict:** shadcn/ui **não** entra nas páginas públicas. Entra, se o
Ricardo quiser, no backoffice.

### 4.1 E os kits de "efeito *wow*"?

Aceternity UI, Magic UI, Motion Primitives: feixes de luz, *spotlight*,
*sparkles*, *marquee* de logos, cartões 3D. Três razões para não:

1. São o "efeito vazio" que a D1 descarta para o leitor CISO.
2. Dependem de Framer Motion, que o site está tirando.
3. Rodam em loop, o que o plano de movimento proíbe.

O único deles que vale a pena, o *spotlight* que segue o ponteiro, já é o
M4 do plano de movimento, em 600 bytes de JavaScript, sem kit.

## 5. O que o desktop precisa: um plano de composição

Quatro PRs, em Tailwind 4 e CSS nativo, sem dependência nova. Cada um sai
com preview, screenshots a 1440 e 390 px e o Lighthouse da CI. Os que mudam
a escala aprovada pedem decisão do Ricardo (seção 6).

### C1 · A grade editorial e a escala fluida

**O que muda.** A partir de 1024 px, toda seção da home e das homes das
marcas passa a uma grade de 12 colunas: o cabeçalho (`CabecalhoDeSecao`,
título e intro) ocupa as colunas 1–4, **fixo (`position: sticky`) enquanto
a seção rola**; o conteúdo ocupa as colunas 5–12. O ciclo, o blog, os
clientes e o fecho ganham a mesma grade. A direita deixa de ficar vazia, e o
título acompanha o leitor pela seção.

A escala vira fluida, por token no `@theme`:

| Token | Celular | 1440 px | Hoje |
|---|---|---|---|
| abertura (`display`) | 34 px | 64 px | 34 → 56 |
| título de seção | 24 px | 32 px | 24 |
| nome de produto / artigo | 15 px | 18 px | 15 |
| resumo, secundário | 13,5 px | 15 px | 12,5–13,5 |
| corpo | 16 px | 17 px | 16 |

**Portão.** O e2e fixa hoje 56 px na abertura e 28 px nas seções; os tetos
sobem para 64 e 32 no mesmo PR, com a razão no teste. A 390 px nada muda.

**Custo.** Um dia. Só CSS e classes; nenhum componente muda de estrutura.

### C2 · A primeira tela com objeto (frente 5 da spec)

**O que muda.** A abertura da home deixa de ser um bloco centrado de texto
sobre a foto e passa a ter dois planos a partir de 1024 px: o texto à
esquerda (colunas 1–7) e, à direita (colunas 8–12), **a linha da empresa**
que a spec já definiu ("uma casa, o ciclo inteiro", por tempo: trustness.
antes → ness. todo dia → forense.io quando é preciso provar), desenhada em
SVG com os marcadores de 9 px e o ponto azul, e a **faixa de presença
global** abaixo das ações. A linha aparece com o movimento do PR #49 (os
marcadores pousam em sequência). No celular, a linha vai para baixo do
texto, como a spec descreve.

Nas homes da trustness. e da forense.io, o mesmo com as linhas delas.

**Por quê.** É o objeto visual que falta (2.3), já aprovado na spec, e é o
que transforma a primeira tela de "frase sobre foto" em "a operação por
dentro" desde o primeiro segundo.

**Custo.** Dois dias, com os textos que a spec já fixou.

### C3 · Os produtos na home, em desenho

**O que muda.** O ciclo das soluções (cinco colunas de texto a 13 px) ganha,
em cada coluna, **o glifo do momento do produto**: o mesmo desenho reduzido
que a página do produto usa (a escada de severidade do n.secops, as cinco
células do n.cirt, os portões do n.devarch), a 64 px, em SVG, monocromático
com o azul da marca. O nome do produto sobe para 18 px. Ao passar o mouse, o
glifo acende com o filete (já feito no PR #49).

**Por quê.** Dá densidade e imagem à seção mais importante da home sem
virar cartão. O leitor reconhece na home o desenho que vai encontrar na
página do produto.

**Custo.** Três dias; depende das fichas validadas de cada produto (frente
6), então entra produto a produto.

### C4 · Clientes com marca, e o fecho com peso

**O que muda.** Os wordmarks em texto viram **logotipos em SVG
monocromático** (branco a 60 %, azul no hover), quando houver autorização de
uso, em uma faixa de seis; o fecho ("conte o que precisa resolver") ocupa a
grade inteira, com o título a 32 px à esquerda e a ação à direita, e a luz
que já chega (PR #49) ganha o espaço para ser vista.

**Custo.** Um dia de código; a autorização das marcas é pendência do
Ricardo.

### O que fica de fora

- Cartões, sombras, cantos grandes, vidro em superfície de conteúdo: são o
  que o desenho delicado tirou, e o desktop *wow* não os pede.
- Vídeo de fundo, partículas, *marquee*: seção 4.1.
- Trocar de fonte, de paleta ou de direção visual: D2.

## 6. Decisões para o Ricardo

1. **Escala fluida** (C1): subir os tetos da abertura para 64 px e das
   seções para 32 px no desktop? A recomendação é sim; é a diferença mais
   barata e mais visível.
2. **Cabeçalho de seção fixo** (`sticky`, C1): o título acompanhar a rolagem
   da seção? Recomendação: sim, só a partir de 1024 px.
3. **shadcn no backoffice** (seção 4): abrir uma frente para o admin?
   Recomendação: sim, depois das frentes 2 e 3 do site, com o tema traduzido
   para os tokens da marca.
4. **Ordem**: C1 → C2 → C4 → C3 (C3 espera as fichas). C1 e C2 cabem numa
   semana.

## 7. Portões e riscos

| Portão | Como |
|---|---|
| LCP ≤ 2,5 s no celular (aviso hoje: 2,9 s) | Lighthouse da CI, mediana de 3; C2 acrescenta um SVG inline pequeno, nada de imagem nova |
| Escala | e2e atualizado no C1 com os tetos novos e a razão |
| Marca desenhada, axe, seis seções | os e2e atuais |
| Nenhuma rolagem lateral a 390 px | e2e de movimento |

| Risco | Mitigação |
|---|---|
| A grade editorial parecer "documentação" e não "site" | o cabeçalho fixo e o objeto da primeira tela (C2) são o que separa uma coisa da outra; conferir no `/impeccable critique` do C1 antes do C2 |
| A escala fluida quebrar linha no título da home a 1024–1280 px | `clamp()` com o passo intermediário medido no navegador; `text-balance` já está |
| O `sticky` do cabeçalho brigar com a navbar fixa | `top` = altura da pílula + 16 px; conferir no Safari |
| Os logotipos de clientes sem autorização | fica o wordmark; a faixa aceita os dois |
