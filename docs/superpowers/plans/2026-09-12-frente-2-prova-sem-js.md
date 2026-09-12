# Frente 2, a prova da arquitetura sem JavaScript: plano de implementação

> **Para quem executa:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para executar tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar.

**Objetivo:** responder, com número medido, se uma rota de conteúdo servida **sem JavaScript** carrega o conteúdo principal no celular em menos de 2,5 s — e se o site continua funcionando à volta dela. A rota da prova é a home da forense.io, em `/forense`.

**Isto é uma prova, não uma migração.** O resultado pode ser "não", e "não" é uma entrega válida: a especificação já registra a contingência (abordagem A, enxugar o pacote mantendo a hidratação). Nenhuma tarefa aqui migra outra rota.

**Arquitetura:** um `handle` por rota decide se o `Layout` emite `<Scripts>`; o que a página ainda precisa de comportamento vem de um arquivo estático em `public/`, servido pelo runtime antes de o Worker rodar e autorizado pela CSP atual (`script-src 'self'`).

**Stack:** React Router 7 (SSR) num Worker da Cloudflare, Vite, Vitest, Playwright, Lighthouse CI, GitHub Actions.

**Especificação:** [docs/superpowers/specs/2026-09-11-site-wow-design.md](../specs/2026-09-11-site-wow-design.md), seção 7 (arquitetura de renderização) e 7.2 (a prova e o critério de aceitação).

## Restrições globais

- Valem **todas** as restrições da frente 1 (o plano dela está em `2026-09-11-frente-1-fundacao.md`): sem codinome, sem documento de cliente, sem número sem fonte, sem stack de produto no site, "agentes de IA"/"agentic"/"copiloto" fora, marca desenhada no meio de frase, commits convencionais em português com o rodapé `Co-Authored-By:` do modelo que escreveu o commit.
- **Não mexa em conteúdo.** Esta frente não reescreve texto de página nenhuma.
- **Uma rota só.** Se aparecer vontade de migrar `/trustness` "porque é igual", pare: a prova perde o valor se virar migração.
- **Como rodar comandos:** o repositório mora no WSL e o `node_modules` é do Linux. A partir do Git Bash, com o diretório atual em `/c/Users`:
  `MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && <comando>"`.
  Dentro das aspas duplas, escape `$` como `\$`. Git roda **dentro do WSL** com o mesmo embrulho; `gh` roda no PowerShell.
- Merge em `main` publica em produção, e **o merge é sempre do Ricardo**. Nunca faça merge.

## O que já foi levantado (não redescubra)

| Fato | Onde |
|---|---|
| O `Layout` emite `<ScrollRestoration nonce>` e `<Scripts nonce>` sem condição | `src/root.tsx:113-114` |
| O loader da raiz já entrega `nonce`, `brand`, `lang` e `pathnameCompleto` | `src/root.tsx:31-52` |
| A CSP do Worker permite `script-src 'self'` e o nonce por requisição | `workers/app.ts:41-42` |
| `public/` é servido pelo runtime **antes** de o Worker rodar, e `_headers` já tem a convenção de um script solto (`/boot.js`, cache de 1 h) | `public/_headers` |
| `/forense` existe em qualquer domínio e renderiza a home da forense.io | `src/routes.ts:34` |
| O passo do Lighthouse mede só a URL raiz do preview | `.github/workflows/preview.yml:87-93` |
| Hoje o celular abre a home em ~5,8 s de LCP com 41 scripts em prioridade alta | especificação, seção 1 |

## Mapa dos arquivos

| Arquivo | O que muda | Tarefa |
|---|---|---|
| `tests/site/sem-js.spec.ts` | novo: a rota da prova não baixa módulo nenhum e continua funcionando | 1 |
| `src/pages/forense/Home.tsx` | `export const handle = { semJs: true }` na rota da prova | 1 |
| `src/root.tsx` | o `Layout` decide pelo `handle` se emite `<Scripts>` e `<ScrollRestoration>` | 1 |
| `public/reforco.js` | novo: eventos por atributo, profundidade de rolagem | 2 |
| `public/_headers` | cache do reforço, como o `/boot.js` | 2 |
| `src/root.tsx` | o reforço e as regras de pré-carregamento entram só nas rotas sem JS | 2 |
| `src/components/ChatLauncher.tsx`, `public/reforco.js` | o botão do chat abre a ilha sem o runtime do React Router | 3 |
| `lighthouserc.json`, `.github/workflows/preview.yml` | medir `/forense` e reprovar acima de 2,5 s nas rotas migradas | 4 |
| `docs/superpowers/specs/2026-09-11-site-wow-design.md` | o veredito, com os números medidos | 5 |

---

### Tarefa 1: a rota da prova para de mandar JavaScript

**Arquivos:**
- Criar: `tests/site/sem-js.spec.ts`
- Modificar: `src/pages/forense/Home.tsx`, `src/root.tsx:97-118`

**Interfaces:**
- Produz: a convenção `export const handle = { semJs: true }`, que as tarefas 2 e 3 leem no `Layout`, e que a frente 3 vai aplicar às demais rotas.

- [ ] **Passo 1: escrever o teste que falha**

Crie `tests/site/sem-js.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

/**
 * A prova da frente 2: a home da forense.io é servida sem JavaScript.
 * O que a página promete tem que sobreviver sem hidratação — por isso o
 * teste olha o conteúdo, não só a ausência de script.
 */
test.describe('rota sem JavaScript', () => {
  test('/forense não baixa nenhum módulo da aplicação', async ({ page }) => {
    const modulos: string[] = [];
    page.on('request', (req) => {
      const url = new URL(req.url());
      if (url.pathname.startsWith('/assets/') && url.pathname.endsWith('.js')) modulos.push(url.pathname);
    });
    await page.goto('/forense');
    await page.waitForLoadState('networkidle');
    expect(modulos, `módulos baixados: ${modulos.join(' ')}`).toEqual([]);
  });

  test('/forense mostra a cadeia de custódia com o JavaScript desligado', async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const pagina = await contexto.newPage();
    await pagina.goto('/forense');
    await expect(pagina.locator('#cadeia')).toBeVisible();
    // Cinco etapas, e o mesmo hash em todas — é o que a página afirma.
    await expect(pagina.locator('#cadeia ol > li')).toHaveCount(5);
    const hashes = await pagina.locator('#cadeia code').allInnerTexts();
    expect(new Set(hashes.map((h) => h.trim())).size).toBe(1);
    await contexto.close();
  });
});
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npx playwright test -c playwright.site.config.ts tests/site/sem-js.spec.ts 2>&1 | tail -15`

Esperado: o primeiro teste falha listando os módulos de `/assets/*.js` que a página baixa hoje. O segundo já passa, porque o HTML vem do servidor — anote o resultado: ele é a prova de que o conteúdo não depende de hidratação.

- [ ] **Passo 3: marcar a rota**

Em `src/pages/forense/Home.tsx`, antes do `export default`, acrescente (a rota `/forense` é um módulo de rota próprio, declarado em `src/routes.ts:34`):

```ts
export const handle = { semJs: true };
```

**Não marque `src/routes/home.tsx`.** Essa rota serve as três marcas de uma vez,
e a prova é de uma rota só: marcá-la tira o JavaScript das três homes e derruba
o mega-menu, o seletor de marcas, o menu do celular, o chat e o aviso de
cookies. Uma versão anterior deste passo mandava marcá-la; a execução quebrou
treze testes por causa disso, e a correção foi restringir o `handle` à home da
forense.io.

- [ ] **Passo 4: o `Layout` obedecer ao `handle`**

Em `src/root.tsx`, troque o import do React Router:

```ts
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useRouteLoaderData } from 'react-router';
```

por:

```ts
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useMatches, useRouteLoaderData } from 'react-router';
```

E troque o corpo do `Layout` (linhas 97-118) por:

```tsx
export function Layout({ children }: { children: ReactNode }) {
  const dados = useRouteLoaderData('root') as RootData | undefined;
  const lang = dados?.lang ?? IDIOMA_PADRAO;
  const nonce = dados?.nonce;
  // Rota marcada com `semJs` não recebe o runtime do React Router: o HTML sai
  // completo do servidor e nenhum módulo desce. O que ainda precisa de
  // comportamento vem de /reforco.js (frente 2, tarefa 2).
  const semJs = useMatches().some((m) => (m.handle as { semJs?: boolean } | undefined)?.semJs);

  return (
    <html lang={lang === 'pt' ? 'pt-BR' : lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
        {dados ? <PreloadDoHero brand={dados.brand} pathname={dados.pathnameCompleto} /> : null}
      </head>
      <body>
        {children}
        {semJs ? null : (
          <>
            <ScrollRestoration nonce={nonce} />
            <Scripts nonce={nonce} />
          </>
        )}
      </body>
    </html>
  );
}
```

- [ ] **Passo 5: rodar e ver passar**

Rode: `npx playwright test -c playwright.site.config.ts tests/site/sem-js.spec.ts 2>&1 | tail -8`

Esperado: os dois testes passam.

- [ ] **Passo 6: o resto do site continua de pé**

Rode: `npm test 2>&1 | tail -4 && npx tsc --noEmit && echo tsc-ok && npx playwright test -c playwright.site.config.ts 2>&1 | tail -8`

Esperado: unitários verdes, `tsc-ok`, e o smoke inteiro passando. **Se algum e2e falhar, anote qual e por quê antes de mexer:** o smoke passa por `/forense` em quatro lugares (alvo de toque, escala das aberturas, marca como texto comum e rolagem lateral) e todos olham DOM que o servidor já emite. Uma falha aqui é informação da prova, não um estorvo — reporte como DONE_WITH_CONCERNS se não souber resolver sem inventar.

- [ ] **Passo 7: commit**

Escreva a mensagem num arquivo e use `git commit -F`:

```
feat(sem-js): a home da forense.io deixa de mandar JavaScript

A rota marcada com `handle.semJs` não recebe <Scripts> nem
<ScrollRestoration>: o HTML sai completo do servidor e nenhum módulo desce.
É a prova da frente 2, numa rota só.

Um e2e novo garante as duas metades: nenhum /assets/*.js baixado, e a cadeia
de custódia visível com o JavaScript desligado no navegador.
```

---

### Tarefa 2: o reforço — medição e pré-carregamento sem hidratação

Sem hidratação, três coisas somem da rota: os eventos de conversão, a profundidade de rolagem e a navegação instantânea. As duas primeiras são medição (o site fica cego); a terceira é conforto. Nada disso justifica trazer o React de volta.

**Arquivos:**
- Criar: `public/reforco.js`
- Modificar: `public/_headers`, `src/root.tsx`

- [ ] **Passo 1: escrever o reforço**

Crie `public/reforco.js` (arquivo servido pelo runtime, fora do build — por isso sem import, sem TypeScript):

```js
/**
 * Reforço das rotas sem JavaScript (frente 2).
 *
 * O que a hidratação fazia e aqui continua: mandar evento de conversão para a
 * Zaraz e marcar a profundidade de rolagem. Nada mais — se este arquivo
 * crescer, a rota deixou de ser "sem JavaScript" e virou outra coisa.
 *
 * Mede menos de 1 KiB e é carregado com `defer`: nunca segura a pintura.
 */
(function () {
  var zaraz = function (nome, parametros) {
    if (window.zaraz && typeof window.zaraz.track === 'function') window.zaraz.track(nome, parametros || {});
  };

  // Evento por atributo: <a data-evento="cta_click" data-cta="hero"> vira
  // track('cta_click', { cta: 'hero' }). Delegação: um ouvinte para a página.
  document.addEventListener('click', function (e) {
    var alvo = e.target instanceof Element ? e.target.closest('[data-evento]') : null;
    if (!alvo) return;
    var parametros = {};
    for (var i = 0; i < alvo.attributes.length; i++) {
      var a = alvo.attributes[i];
      if (a.name.indexOf('data-') === 0 && a.name !== 'data-evento') parametros[a.name.slice(5)] = a.value;
    }
    zaraz(alvo.getAttribute('data-evento'), parametros);
  });

  // Profundidade de rolagem, uma vez por marca e por carregamento.
  var marcas = [25, 50, 75, 100];
  var vistas = {};
  var pendente = false;
  window.addEventListener(
    'scroll',
    function () {
      if (pendente) return;
      pendente = true;
      requestAnimationFrame(function () {
        pendente = false;
        var altura = document.documentElement.scrollHeight - window.innerHeight;
        if (altura <= 0) return;
        var pct = (window.scrollY / altura) * 100;
        for (var i = 0; i < marcas.length; i++) {
          var m = marcas[i];
          if (pct >= m && !vistas[m]) {
            vistas[m] = true;
            zaraz('scroll_depth', { profundidade: String(m) });
          }
        }
      });
    },
    { passive: true }
  );
})();
```

- [ ] **Passo 2: cache do reforço**

Em `public/_headers`, depois do bloco `/boot.js`, acrescente:

```
/reforco.js
  Cache-Control: public, max-age=3600, must-revalidate
```

- [ ] **Passo 3: o `Layout` servir o reforço só nas rotas sem JS**

No `Layout` de `src/root.tsx`, troque:

```tsx
        {semJs ? null : (
```

por:

```tsx
        {semJs ? (
          <>
            {/* Medição e navegação nas rotas sem hidratação. `defer` para não
                disputar a primeira pintura; as regras de pré-carregamento são
                do navegador, e onde não houver suporte a navegação é a normal. */}
            <script defer nonce={nonce} src="/reforco.js" />
            <script
              type="speculationrules"
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  prerender: [{ where: { href_matches: '/*' }, eagerness: 'moderate' }],
                }),
              }}
            />
          </>
        ) : (
```

- [ ] **Passo 4: o teste da tarefa 1 continua valendo**

Rode: `npx playwright test -c playwright.site.config.ts tests/site/sem-js.spec.ts 2>&1 | tail -8`

Esperado: os dois testes continuam passando. O primeiro olha `/assets/*.js`, e o reforço mora em `/reforco.js` — de propósito: ele não é módulo da aplicação, e o teste continua barrando o retorno do runtime.

- [ ] **Passo 5: conferir o tamanho e a CSP**

Rode: `wc -c public/reforco.js && npx playwright test -c playwright.site.config.ts -g "nonce" 2>&1 | tail -5`

Esperado: menos de 2048 bytes, e o teste que exige nonce em script inline continuar passando (o smoke tem um, e o `speculationrules` é inline).

- [ ] **Passo 6: commit**

```
feat(sem-js): o reforço devolve medição e pré-carregamento à rota sem JS

Um arquivo estático de menos de 1 KiB, servido pelo runtime e autorizado pela
CSP atual: evento de conversão por atributo, profundidade de rolagem e as
regras de pré-carregamento do navegador. Ele existe porque sem hidratação o
site ficaria cego — não para trazer comportamento de volta.
```

---

### Tarefa 3: o chat sem o runtime do React Router

O botão do chat é global: ele aparece na rota da prova e, sem hidratação, não abre. Esta tarefa responde a pergunta técnica que a especificação chama de mais incerta — **como carregar uma ilha React numa página que não tem o runtime**.

**Arquivos:**
- Modificar: `public/reforco.js`, `src/root.tsx` (ou `src/components/ChatLauncher.tsx`, conforme a alternativa escolhida)
- Criar: `src/ilhas/chat.tsx` (só na alternativa A)

- [ ] **Passo 1: decidir entre duas alternativas, medindo**

**A — ilha de verdade.** Um segundo ponto de entrada no Vite (`src/ilhas/chat.tsx`) que monta o `ChatbotWidget` com `createRoot` num contêiner. O reforço, no clique, importa o arquivo emitido. Custo: o nome do arquivo leva hash, e o `Layout` precisa descobri-lo — o caminho mais simples é ler o manifesto do cliente em build e passar o caminho pelo loader da raiz.

**B — o chat continua onde está.** Na rota da prova, o botão vira um link para `/contato`, e o chat só existe nas rotas hidratadas. Custo: a rota da prova perde o chat.

**Regra de decisão:** implemente **B primeiro** — é uma linha — e só vá para A se a medição da tarefa 4 mostrar folga. A prova é sobre carregamento, e um chat que ninguém abriu não pode custar nada. Registre a escolha no relatório.

- [ ] **Passo 2 (alternativa B): o botão vira link na rota sem JS**

Em `src/root.tsx`, dentro do `Shell`, troque `<ChatLauncher />` por:

```tsx
{semJsShell ? (
  <a
    href="/contato?ref=chat"
    data-evento="cta_click"
    data-cta="chat_sem_js"
    className="fixed bottom-6 right-6 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary-container/25 bg-surface-container-low px-5 py-3 font-display text-sm font-medium text-white shadow-xl shadow-black/30 md:bottom-8 md:right-8"
  >
    {t('chatbot.open', 'falar com a Gabi')}
  </a>
) : (
  <ChatLauncher />
)}
```

O `Shell` recebe `semJsShell` do mesmo `useMatches()` do `Layout` — declare `const semJsShell = useMatches().some((m) => (m.handle as { semJs?: boolean } | undefined)?.semJs);` no topo do `Shell`.

- [ ] **Passo 3: verificar**

Rode: `npx playwright test -c playwright.site.config.ts 2>&1 | tail -8`

Esperado: suíte verde. O alvo de toque de 24 px vale para o link novo (ele tem `min-h-11`, 44 px).

- [ ] **Passo 4: commit**

```
feat(sem-js): na rota sem JavaScript o chat vira link para o contato

O botão do chat depende de hidratação para abrir. Na rota da prova ele passa
a ser um link para o contato, com o mesmo alvo de toque e o mesmo evento de
conversão. A ilha de verdade só se justifica se a medição mostrar folga.
```

---

### Tarefa 4: medir, e transformar a medição em portão

**Arquivos:**
- Modificar: `lighthouserc.json`, `.github/workflows/preview.yml`

- [ ] **Passo 1: medir as duas rotas no preview**

Em `.github/workflows/preview.yml`, no passo `Lighthouse contra o preview`, troque:

```yaml
          urls: ${{ steps.deploy.outputs.deployment-url }}
```

por:

```yaml
          urls: |
            ${{ steps.deploy.outputs.deployment-url }}
            ${{ steps.deploy.outputs.deployment-url }}/forense
```

- [ ] **Passo 2: a faixa que reprova, só na rota migrada**

Em `lighthouserc.json`, troque o bloco `"assert"` inteiro por:

```json
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],

        "categories:seo": "off",
        "is-crawlable": "off",
        "document-title": "error",
        "meta-description": "error",
        "http-status-code": "error",
        "crawlable-anchors": "error",
        "link-text": "error",

        "categories:performance": ["warn", { "minScore": 0.9 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 2500 }],
        "total-blocking-time": ["warn", { "maxNumericValue": 200 }],
        "cumulative-layout-shift": ["warn", { "maxNumericValue": 0.1 }]
      },
      "assertMatrix": [
        {
          "matchingUrlPattern": ".*/forense$",
          "assertions": {
            "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
            "resource-summary:script:size": ["error", { "maxNumericValue": 10240 }]
          }
        }
      ]
    }
```

`assertMatrix` só se aplica às URLs que casam com o padrão; a rota migrada reprova o PR, as demais continuam avisando. À medida que outras rotas migrarem, o padrão cresce.

- [ ] **Passo 3: medir localmente antes de abrir o PR**

Rode, com o preview local no ar (`npm run build && npx wrangler dev -c dist/server/wrangler.json --port 8788`, numa porta livre a cada ciclo):

`npx --yes @lhci/cli collect --url=http://localhost:8788/forense --numberOfRuns=3 --settings.formFactor=mobile --settings.throttlingMethod=simulate && npx --yes @lhci/cli assert --preset=lighthouse:no-pwa 2>&1 | tail -20`

Esperado: o LCP do celular em `/forense`. **Anote o número** — é o resultado da prova. Compare com os 5,8 s medidos em 11/09 na home da ness. e com o que a mesma máquina mede hoje em `/` (rode uma vez cada, na mesma sessão, senão a comparação não vale).

- [ ] **Passo 4: commit**

```
ci(lighthouse): mede /forense e reprova acima de 2,5 s na rota migrada

O portão em duas faixas que a frente 1 adiou: a rota já migrada reprova o PR
acima de 2,5 s de LCP ou 10 KiB de script; as demais continuam avisando,
porque nelas o número ainda é o de hoje.
```

---

### Tarefa 5: o veredito

**Arquivos:**
- Modificar: `docs/superpowers/specs/2026-09-11-site-wow-design.md` (seção 7.2)

- [ ] **Passo 1: escrever o que a medição respondeu**

Na seção 7.2 da especificação, depois do parágrafo da contingência, acrescente uma subseção `#### Resultado da prova (12/09/2026)` com, em prosa curta:

- o LCP do celular em `/forense` sem JavaScript, a mediana de três execuções, e o mesmo número para `/` no mesmo ambiente;
- quantos bytes de script a rota baixa (deve ser só o reforço) e quantos a `/` baixa;
- o que quebrou no e2e e o que isso significa;
- a decisão sobre o chat (alternativa A ou B) e por quê;
- **o veredito:** a arquitetura B segue para a frente 3, ou cai para a contingência A.

Escreva o número mesmo que ele seja ruim. Uma prova que só sabe dizer "deu certo" não era uma prova.

- [ ] **Passo 2: commit**

```
docs(spec): o resultado da prova da arquitetura sem JavaScript

A primeira linha do corpo traz o número medido e o veredito, nesta forma:
"LCP de X,X s no celular em /forense, contra Y,Y s na home hidratada medida
no mesmo ambiente; a arquitetura B segue para a frente 3" — ou, se o número
não fechar, "a prova falhou em X,X s; cai para a contingência A".
```

---

## Fora deste plano

- Migrar qualquer outra rota (frente 3).
- Reescrever os componentes globais para funcionarem sem React (frente 3).
- Formulários sem JavaScript: a rota da prova não tem formulário.
- Qualquer mudança de conteúdo.
