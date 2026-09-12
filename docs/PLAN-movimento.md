# Movimento: a luz que responde ao leitor

**Data:** 12/09/2026 · **Status:** proposta, a decidir por Ricardo Esper ·
**Base:** [`superpowers/specs/2026-09-11-site-wow-design.md`](superpowers/specs/2026-09-11-site-wow-design.md) (D2, D3, D6, D13) e [`PLAN-performance-ux-comercial.md`](PLAN-performance-ux-comercial.md) (ondas 0–1)

## 1. O problema

O desenho delicado está no ar e está certo: meia-noite, filete de 1 px,
Montserrat 500, o ponto azul. O que falta não é desenho, é **tempo**. Hoje
nada no site acontece *ao longo do tempo*:

| O que vi (12/09, `npx vite`, 1440 e 390 px) | Onde |
|---|---|
| A abertura aparece inteira no primeiro quadro: título, lede, foto e botões chegam juntos, sem ordem. | `Abertura.tsx` não tem nenhuma animação de entrada; as classes `anim-fade-up` só são usadas no menu do celular |
| A foto da Terra é estática. A rolagem não a afeta; ela é papel de parede. | `HeroPicture.tsx` |
| Rolar a página não muda nada: soluções, blog, clientes e o fecho já estão lá, iguais, quando a tela chega. | `Solutions.tsx`, `Insights.tsx`, `ClientLogos.tsx`, `CTA.tsx` |
| O hover só troca cor (`group-hover:text-primary`). Nem o filete, nem o marcador do estágio, nem o botão respondem além do brilho. | os mesmos, e `BOTAO`/`LINK` em `Abertura.tsx` |
| Trocar de página é um corte seco; o scroll-to-top faz a tela piscar. | `ScrollToTop.tsx`, `root.tsx` |
| O menu de soluções e o chat aparecem e somem sem transição. | `Navbar.tsx`, `ChatLauncher.tsx` |
| O `motion` (Framer) só sobrevive no portfólio, na página de produto e no chat, e está saindo com a arquitetura B. | `Portfolio.tsx`, `SolutionPage.tsx`, `ChatbotWidget.tsx` |

O resultado é um site bonito que parece **uma captura de tela**. É isso que
lê como "regular" depois de duas rodadas de skill de design: as skills mexem
no que se vê parado; o *wow* que falta é o que se vê **acontecendo**.

## 2. O princípio

A frase da marca já diz a regra do movimento: **invisível quando tudo
funciona, presente quando importa.**

1. **Nada se mexe sozinho.** Nenhum loop, nenhum brilho pulsando, nenhuma
   partícula. O que a onda 1 do plano de performance tirou (as animações
   infinitas de blur) não volta.
2. **Tudo responde.** O site se move em resposta ao leitor: ele chega (a
   abertura se compõe), ele rola (a página se revela e a foto ganha
   profundidade), ele aponta (o filete e o marcador acendem), ele escolhe (o
   momento troca), ele navega (a página seguinte nasce da anterior).
3. **O leitor nunca espera.** Toda entrada dura menos de 1 s, nenhuma
   rolagem é sequestrada, e a página está completa e legível no HTML do
   servidor, com JavaScript desligado. Isso é o que faz a D3 (o leitor
   conduz) e a D13 (páginas sem JS) continuarem verdadeiras.
4. **Uma luz, uma curva.** O único acento em movimento é o azul da marca
   (`#00ade8`), e a única curva é `cubic-bezier(0.22, 1, 0.36, 1)`, que já
   existe em `index.css`. O ponto azul ganha a única exceção: um leve
   sobressalto ao pousar.
5. **Só `transform`, `opacity` e `clip-path`.** Nunca `filter`, `blur`,
   `box-shadow` ou `padding` animados em superfície grande. É o que mantém o
   portão de 2,5 s da D6 e o TBT em zero.

## 3. O sistema (tokens de movimento)

Entram no `@theme` de `src/index.css`, ao lado das cores e fontes, e o
`DESIGN.md` da raiz os registra na seção de motion:

| Token | Valor | Uso |
|---|---|---|
| `--ease-sair` | `cubic-bezier(0.22, 1, 0.36, 1)` | toda entrada e todo hover |
| `--ease-pousar` | `cubic-bezier(0.34, 1.4, 0.64, 1)` | só o ponto azul e os marcadores de 9 px |
| `--dur-micro` | 150 ms | cor, opacidade de painel (é o que a spec do `Momento` já fixa) |
| `--dur-curta` | 250 ms | hover, menu, transição de página |
| `--dur-entrada` | 700 ms | subida de bloco, filete que se desenha |
| `--dur-titulo` | 900 ms | as palavras do título |
| `--passo` | 60 ms | escalonamento entre itens de uma sequência |
| `--sobe-item` | 16 px | deslocamento de item de lista |
| `--sobe-bloco` | 24 px | deslocamento de seção |

**A convenção de sequência:** todo elemento escalonado sai do servidor com
`style="--i: N"` (o índice do `map`). O CSS calcula
`animation-delay: calc(var(--i) * var(--passo))`. Não há hook, observer nem
estado; um `Sequencia`/`--i` é só uma prop de estilo.

**A regra da preferência de movimento vira positiva.** Hoje o `index.css`
zera todas as durações sob `prefers-reduced-motion: reduce`. Com animações
que **começam em `opacity: 0`**, isso é perigoso: uma regra que escape deixa
conteúdo invisível. O plano inverte: cada animação de entrada e de rolagem é
declarada **dentro** de `@media (prefers-reduced-motion: no-preference)`. Sem
a preferência, o elemento fica como já é hoje: visível, parado. É a garantia
de que a página nunca depende do movimento para existir.

**Onde vive:** um `@layer movimento` no fim de `src/index.css`, com os
keyframes e as utilidades (`.entra`, `.entra-palavras`, `.revela`,
`.filete-desenha`, `.pousa`). Componente nenhum importa biblioteca: são
classes. O `motion` não volta a nenhum lugar de onde já saiu.

## 4. O catálogo

Cada movimento diz o que faz, como, o que custa e se depende de JavaScript.
"Nativo" é HTML e CSS só, compatível com a arquitetura B.

### 4.1 A abertura se compõe (`Abertura.tsx`)

**O que o leitor vê:** a foto chega já nítida, mas um pouco maior, e assenta
(escala 1,06 → 1 em 1,6 s). Enquanto isso o título **sobe palavra por
palavra** de trás de uma linha invisível (cada palavra num `span` com
`overflow: hidden`, o texto vindo de `translateY(110%)`), o ponto azul
**pousa por último** com `--ease-pousar` (escala 0 → 1), o lede sobe em
seguida e os dois botões fecham a sequência. Total: 1,1 s do primeiro quadro
ao último botão.

**Como:** o título que chega como `string` (todas as páginas menos a home)
é partido em palavras no servidor; o da home, que vem por `Trans` com o
`<highlight>`, passa a ser lido com `t()` e partido do mesmo jeito, já que o
`highlight` hoje é um `<span />` vazio. Cada palavra recebe `--i`. Nada de
JavaScript no cliente.

**Custo e risco:** a foto continua sendo o candidato a LCP e é pintada no
primeiro quadro com a opacidade final (a escala é `transform`, não conta).
O título em `opacity: 0` deixa de ser candidato a LCP durante 0,9 s, o que
não muda a medida porque a foto é maior. **Confere-se no Lighthouse do
preview**, mediana de 3 execuções, como a D6 manda. Palavra com descendente
(g, p, ç) precisa de `padding-bottom: 0.12em` e margem negativa na janela do
`overflow`, senão a cauda é cortada.

### 4.2 A foto ganha profundidade (`HeroPicture.tsx`)

**O que o leitor vê:** ao rolar, a foto sobe mais devagar que o texto e vai
escurecendo até sumir sob a seção seguinte. O véu em degradê que já existe
continua; a foto passa a ter dois planos.

**Como:** animação guiada por rolagem em CSS puro:

```css
@supports (animation-timeline: scroll()) {
  .foto-do-hero { animation: afunda linear both; animation-timeline: scroll(root); animation-range: 0 100vh; }
  @keyframes afunda { to { transform: translateY(18%) scale(1.04); opacity: 0.15; } }
}
```

Roda no compositor, sem JavaScript e sem `scroll` listener. Onde
`animation-timeline` não existe, a foto fica como hoje. Nativo.

### 4.3 A página se revela ao chegar (todas as seções)

**O que o leitor vê:** cada seção sobe 24 px e aparece nos primeiros 30 %
da sua entrada na tela; **o filete de 1 px se desenha** da esquerda para a
direita (`scaleX` de 0 a 1, origem à esquerda) e os itens de lista entram
escalonados a 60 ms. No ciclo das soluções, os cinco marcadores de 9 px
pousam em sequência sobre o filete que acabou de se desenhar. É o movimento
que mais transforma a home, e é o que mais faz o desenho delicado parecer
**feito à mão** em vez de impresso.

**Como:** `animation-timeline: view()` com `animation-range: entry 0% entry
35%`, também sob `@supports`. Quem já está na tela quando a página abre tem
o progresso calculado no primeiro quadro, sem piscar. O filete é um
`::before` sobre o `border-t` atual, para o fallback continuar sendo o
filete estático. O `CabecalhoDeSecao`, o `Solutions` (colunas e produtos), o
`Insights` (artigos), o `ClientLogos` (wordmarks) e o `CTA` recebem as
classes; nenhum muda de estrutura. Nativo.

**Regra para não virar espetáculo:** a revelação só roda **uma vez**, na
entrada (o `animation-range` termina a 35 % e o `fill-mode` segura). Rolar
para cima não "desrevela" nada, e nada se move enquanto a seção está
inteira na tela. É a diferença entre "a página se compõe" e "narrativa por
rolagem", que a D3 descartou.

### 4.4 O que está sob o mouse acende

| Elemento | Hoje | Passa a |
|---|---|---|
| Produto no ciclo (`Solutions.tsx`) | nome muda de cor | nome muda de cor, o **marcador do estágio se preenche de azul** e o filete daquela coluna acende (`::after` azul com `scaleX`, 250 ms) |
| Artigo do blog e cliente (`Insights.tsx`, `ClientLogos.tsx`) | título muda de cor | o filete acima do item **vira azul da esquerda para a direita** (250 ms) e o bloco sobe 2 px |
| Link do menu (`Navbar.tsx`) | cor | cor e um **sublinhado de 1 px que cresce** da esquerda; o ativo já nasce sublinhado |
| `BOTAO` | brilho e sombra | brilho, sombra, **sobe 1 px** e um reflexo (`::after` em degradê branco a 12 %, `translateX(-120% → 120%)`, 600 ms) que passa uma vez por hover |
| `LINK` | cor do sublinhado | o sublinhado **engrossa para 2 px** e vira azul (`text-decoration-thickness`, 150 ms) |
| Wordmark de cliente | cor | cor e o filete azul, como o blog |

Tudo em `:hover` e `:focus-visible` (o teclado vê o mesmo que o mouse), só
`transform` e `opacity`. Nativo.

### 4.5 O menu de soluções e o chat nascem, não aparecem

- **Menu de soluções:** sobe 8 px e aparece em 250 ms com `@starting-style`,
  que funciona tanto no `useState` de hoje quanto no `<details>`/`popover`
  que a frente 3 vai usar. Fechar é imediato (sair tem que ser mais fácil
  que entrar, como o comentário do componente já diz).
- **Chat:** o botão "falar com a gabi" **não está na primeira tela**. Ele
  desliza para dentro, pela direita, quando o leitor rola os primeiros
  200 px (`animation-timeline: scroll(root)`, `animation-range: 0 200px`).
  Quem só olha a abertura não vê chat; quem começou a ler ganha o convite.
  Nativo, e é uma coisa a menos disputando a atenção com o LCP.
- **Navbar:** ao rolar 80 px, a pílula de vidro fica mais opaca (opacidade
  de um `::before`, não `background`) e a marca encolhe a 92 % por
  `transform`. Nativo.

### 4.6 A página seguinte nasce da anterior

**O que o leitor vê:** ao clicar, o conteúdo antigo some e o novo sobe
16 px em 250 ms; a pílula da navbar e o rodapé **ficam no lugar**. Sem o
corte seco e sem a piscada do scroll-to-top.

**Como, em duas fases que convivem:**

1. **Hoje (site hidratado):** React Router 7 já suporta `<Link viewTransition>`.
   Basta a prop nos links internos e as regras `::view-transition-old(root)`
   / `::view-transition-new(root)` no CSS. A navbar recebe
   `view-transition-name: navbar` para não participar da troca.
2. **Com a arquitetura B (páginas sem JS):** `@view-transition { navigation:
   auto; }` no CSS faz a mesma transição **entre documentos**, sem
   JavaScript, no Chrome 126+ e no Safari 18.2+. Somado ao `speculationrules`
   que a frente 3 já prevê, a troca de página fica instantânea e contínua.
   Fora desses navegadores é a navegação normal.

### 4.7 O fecho: presente quando importa (`CTA.tsx`)

O único lugar em que a luz **chega**, não responde: quando o "conte o que
precisa resolver" entra na tela, um brilho azul suave (o `radial-gradient`
da abertura, a 8 % de opacidade) desabrocha atrás do texto, o filete se
desenha e o botão entra por último. É a rima com a abertura: o site começa
com a luz e termina com ela. `animation-timeline: view()`, nativo.

### 4.8 Os momentos (frente 6)

A spec fixa para o `Momento`: transição de 150 a 200 ms só na opacidade.
Este plano **acrescenta uma proposta, a decidir**: quando a opção muda, os
nós do desenho que acendem (`acende-N`) fazem isso **em sequência ao longo
do caminho**, com `transition-delay: calc(var(--i) * 60ms)`, ainda só em
opacidade (o marcador cheio aparece sobre o vazio). O leitor vê o evento
**percorrer** fontes → AIOps → time → você, em vez de ver o desenho trocar
de estado. Mesmo custo, mesma acessibilidade, e é a versão do "operação
vista por dentro" que mais convence quem avalia.

### 4.9 A luz que segue o leitor (opcional)

Na abertura, o brilho central (`radial-gradient` em 50 % 45 %) passa a
**seguir o ponteiro** com atraso (interpolação linear a cada quadro, duas
variáveis CSS `--mx`/`--my` no `section`). Só em `(hover: hover)`; no
celular fica onde está. É o efeito mais "wow" da lista e **o único que
precisa de JavaScript**: cerca de 600 bytes, que cabem no script de reforço
de menos de 5 KiB que a frente 3 já prevê. Por isso é uma decisão à parte
(seção 7).

### 4.10 O que fica de fora, de propósito

- Contador animado nas métricas (`Metrica.tsx`): a decisão de sair pronto do
  servidor continua certa.
- Cursor customizado, partículas, grão, gradientes animados, texto que
  "digita", "scroll-jacking", seções que travam a rolagem.
- Qualquer animação com `filter: blur()`.
- Qualquer coisa que rode em loop.

## 5. Como encaixa nas frentes da spec

O movimento é **uma camada transversal**, não uma frente nova. Entra assim:

| Frente da spec | O que este plano acrescenta |
|---|---|
| 1 Fundação | os tokens de movimento no `DESIGN.md`; a regra positiva de `prefers-reduced-motion` |
| 3 Globais sem JS | navbar (4.5), menu (4.5), chat (4.5), transição entre documentos (4.6), a luz que segue o leitor se aprovada (4.9) |
| 5 As três homes | abertura (4.1), foto (4.2), revelação (4.3), hover (4.4), fecho (4.7); a "linha da empresa" da seção 4 da spec nasce já com os marcadores pousando em sequência |
| 6 Os 18 momentos | o percurso em sequência (4.8) |
| 7 Acabamento | as mesmas classes nas páginas comuns, uma tela por vez, no `/impeccable polish` |

Nada aqui espera a arquitetura B: 4.1 a 4.5 e 4.7 funcionam no site de hoje
e sobrevivem à migração sem mudar, porque são CSS sobre o mesmo HTML.

## 6. Ordem de entrega (PRs com preview)

| PR | Entrega | Toca | Portão |
|---|---|---|---|
| **M1 · a base e a abertura** | tokens, `@layer movimento`, regra positiva de reduced-motion, título por palavras, ponto que pousa, lede e botões em sequência, foto que assenta; hovers de `BOTAO`, `LINK` e menu | `index.css`, `Abertura.tsx`, `Hero.tsx`, `Navbar.tsx` | LCP celular ≤ 2,5 s no preview; e2e verdes; HTML do servidor completo sem JS |
| **M2 · a página se revela** | `view()` nas seções, filetes que se desenham, marcadores que pousam, hovers de produto, blog e clientes, fecho com a luz, chat que desliza | `Solutions.tsx`, `Insights.tsx`, `ClientLogos.tsx`, `CTA.tsx`, `ChatLauncher.tsx`, `HeroPicture.tsx` | idem, mais CLS ≤ 0,1 e zero rolagem lateral a 390 px |
| **M3 · a passagem** | `<Link viewTransition>` e as regras de `::view-transition`; navbar que compacta; `@view-transition` entre documentos entra junto com a frente 2/3 | `root.tsx`, links internos, `Navbar.tsx` | nenhuma piscada na troca de página (vídeo de 3 s no PR) |
| **M4 · a luz que segue** (se aprovado) | as duas variáveis no `section` da abertura e os 600 bytes no reforço | `Abertura.tsx`, script de reforço | script total do reforço < 5 KiB |
| **Momentos** | 4.8 entra no plano da frente 6, não aqui | `momentos/` | os testes da frente 6 |

M1 e M2 são um dia de trabalho cada, e já mudam o site inteiro, porque
`Abertura`, `CabecalhoDeSecao`, `BOTAO` e `LINK` são compartilhados pelas
três marcas. M3 é meio dia. Cada PR vem com **um vídeo de 5 s** da home no
preview, celular e desktop, para o Ricardo decidir olhando, não lendo.

## 7. Decisões para o Ricardo

1. **A abertura de 1,1 s.** É a única "animação que o leitor assiste" da
   lista. Ela cabe na D3 (é entrada, não narrativa; a página está legível
   em 0,4 s, quando a primeira linha do título já pousou) ou a D3 pede que
   o título nasça parado e só o ponto azul pouse? A recomendação é a
   sequência inteira; é ela que faz a diferença entre "site" e "captura".
2. **A luz que segue o leitor (4.9).** Vale os 600 bytes de JavaScript e a
   exceção à regra "tudo em CSS"? A recomendação é sim, como M4, depois de
   ver M1 e M2 no ar; se o site já estiver *wow* sem ela, ela não entra.
3. **O percurso nos momentos (4.8).** Confirmar a mudança na spec do
   `Momento` antes de a frente 6 começar pelo n.secops.

## 8. Testes e portões

- **Lighthouse na CI** (já existe): LCP ≤ 2,5 s e CLS ≤ 0,1 no celular,
  mediana de 3, nas mesmas 19 URLs. Falha barra o PR.
- **e2e novo, `tests/site/movimento.spec.ts`:**
  - com `reducedMotion: 'reduce'`, `document.getAnimations()` volta vazio
    em toda rota e todo texto da home está visível (`opacity` computada 1);
  - o HTML do servidor (sem JS) não tem `opacity:0` inline nem classe que
    esconda conteúdo fora de um `@media (no-preference)`;
  - a 390 px nenhuma animação causa rolagem lateral (`scrollWidth ===
    clientWidth` ao fim de cada entrada);
  - nenhuma animação em curso 1,5 s depois do `load` com a página parada
    (`getAnimations().filter(a => a.playState === 'running')` vazio): é o
    teste da regra "nada se mexe sozinho";
  - axe sem violações, como hoje.
- **Detector do impeccable** (já na CI): sem novo achado.
- **`/impeccable critique`** da home nos dois tamanhos depois de M2,
  comparado com a de 10/09.

## 9. Riscos

| Risco | Mitigação |
|---|---|
| `animation-timeline` (Chrome 115, Edge, Safari 26) sem suporte no Firefox estável na data | Tudo sob `@supports`; sem suporte, a página é a de hoje. Conferir o caniuse no dia do M2 e anotar no PR |
| View transitions entre documentos só no Chrome 126+ e Safari 18.2+ | Fallback é a navegação normal; nenhuma dependência |
| `@starting-style` em navegador antigo | O menu aparece sem transição, como hoje |
| O título em `opacity: 0` empurrar o LCP | A foto é o candidato e é pintada no primeiro quadro; medir no preview de M1 e, se o LCP subir, o título nasce a `opacity: 1` e só faz o `clip` |
| Palavra cortada no `overflow: hidden` do título | Folga de `0.12em` abaixo da janela de cada palavra; conferir em pt, en e es, com "ç", "g" e "p" |
| Sequência escalonada em lista longa (18 clientes, 40 posts) somar segundos | `--i` é limitado a 8 (`min(var(--i), 8)`); a partir do nono, tudo entra junto |
| Movimento demais depois de tudo ligado | A regra 1 (nada em loop) e o teste "nenhuma animação em curso com a página parada" seguram o teto; e o Ricardo vê cada PR em vídeo antes do merge |

## 10. Fora do escopo

- Uma direção visual nova (D2: o desenho delicado é a base).
- O `canal/` e o backoffice.
- Animações em e-mail, PDF e impressão.
- Trazer o `motion` de volta a qualquer componente.
