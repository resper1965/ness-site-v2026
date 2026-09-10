# Página de produto como runbook — plano de implementação

> **Para quem executa:** use `superpowers:subagent-driven-development`
> (recomendado) ou `superpowers:executing-plans` para tocar tarefa a tarefa.
> Os passos usam `- [ ]` para marcar progresso.

**Objetivo:** reorganizar `/solucoes/:slug` em sete seções que respondem
perguntas distintas de um CISO comparando fornecedores, tirando do ar o
dashboard de números inventados.

**Arquitetura:** `src/data/solutionsData.ts` ganha quatro campos opcionais
(`severidade`, `escopo`, `entregaveis`, `operacao`) e perde dois
(`dashboard`, `benefits`). Cada seção nova é um componente próprio em
`src/components/solutions/` que devolve `null` sem dado — `SolutionPage.tsx`
só ordena. Seção sem dado some inteira, sem título órfão.

**Stack:** React Router 7 (framework mode), React 19, Tailwind 4,
`motion/react`, Vitest (unitário), Playwright (e2e contra o build).

**Spec:** `docs/DESIGN-pagina-de-produto.md` — leia antes; este plano
argumenta a partir dele.

## Restrições globais

Valem para toda tarefa, copiadas do spec e do brandbook:

- **Nenhum absoluto sem fonte** em conteúdo de produto: `100%`, `0 gaps`,
  `zero downtime`. Mesma regra de `docs/PESQUISA-metricas.md`.
- **Nenhum número de SLA.** A página publica o modelo; o número fica na
  proposta.
- **Escala de peso:** 400 corpo, 500 H2/H3/microcopy/marca, 600 display/H1.
  `font-bold` (700) e `font-light` (300) não existem neste projeto.
- **O ponto de marca e de produto é `<BlueDot />`**, nunca um span solto.
- **Alvo de toque ≥ 24 px**; anel de foco `focus-visible:ring-2
  focus-visible:ring-primary-container`.
- **Sem animação infinita** e sem entrada decorativa por seção.
- Comentário e commit em português; identificador em inglês só onde o
  arquivo já usa.
- Build e teste rodam na WSL:
  `MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && ..."`.

---

## Mapa de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `src/data/solutionsData.ts` | tipos + conteúdo dos cinco produtos |
| `src/data/solutionsData.test.ts` | **criar** — guarda das restrições de conteúdo |
| `src/components/solutions/RespostaAIncidente.tsx` | **criar** — seção 1 |
| `src/components/solutions/Escopo.tsx` | **criar** — seção 2 |
| `src/components/solutions/Entregaveis.tsx` | **criar** — seção 3 |
| `src/components/solutions/Operacao.tsx` | **criar** — seção 4 |
| `src/components/solutions/SolutionExecutiveDashboard.tsx` | **apagar** |
| `src/pages/SolutionPage.tsx` | ordena as seções, nada mais |
| `tests/site/smoke.spec.ts` | e2e de degradação e de conteúdo |
| `scripts/preview-local.sh` | sobe o build num Worker local para e2e e auditoria |
| `scripts/auditoria-de-tela.mjs` | alt, rótulo, alvo de 24 px, hierarquia, rolagem, peso |

---

### Tarefa 1: tirar o dashboard falso e os benefícios de marketing do ar

Entregável independente: as páginas de produto deixam de publicar número
inventado. Não depende de nenhuma ficha preenchida.

**Arquivos:**
- Criar: `src/data/solutionsData.test.ts`
- Modificar: `src/data/solutionsData.ts`
- Modificar: `src/pages/SolutionPage.tsx`
- Apagar: `src/components/solutions/SolutionExecutiveDashboard.tsx`

**Interfaces:**
- Produz: `SolutionData` sem `dashboard` e sem `benefits`; as tarefas 2–5
  adicionam campos a essa mesma interface.

- [ ] **Passo 1: escrever o teste que falha**

Criar `src/data/solutionsData.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { solutionsData } from './solutionsData';

/**
 * O conteúdo de produto é lido por um comprador que compara fornecedores.
 * Absoluto sem fonte é o que ele desconta primeiro — e foi exatamente o que
 * o bloco `dashboard` publicava: "100% postura atualizada", "0 gaps".
 */
const ABSOLUTOS = /\b100\s*%|\b0\s+gaps?\b|zero\s+downtime|\b100\s+por\s+cento\b/i;

function textos(valor: unknown): string[] {
  if (typeof valor === 'string') return [valor];
  if (Array.isArray(valor)) return valor.flatMap(textos);
  if (valor && typeof valor === 'object') return Object.values(valor).flatMap(textos);
  return [];
}

describe('conteúdo das soluções', () => {
  for (const [slug, dados] of Object.entries(solutionsData)) {
    it(`${slug} não publica absoluto sem fonte`, () => {
      const ofensores = textos(dados).filter((t) => ABSOLUTOS.test(t));
      expect(ofensores).toEqual([]);
    });

    it(`${slug} não tem mais dashboard nem benefits`, () => {
      expect(dados).not.toHaveProperty('dashboard');
      expect(dados).not.toHaveProperty('benefits');
    });
  }
});
```

- [ ] **Passo 2: rodar e ver falhar**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && npx vitest run src/data/solutionsData.test.ts"
```

Esperado: FAIL — `secops` tem `100%` e `0 gaps` no bloco `dashboard`, e os
cinco produtos ainda têm as duas propriedades.

- [ ] **Passo 3: remover os tipos**

Em `src/data/solutionsData.ts`, apagar as interfaces `DashboardMetric` e
`DashboardData` e a interface `Benefit`. Em `SolutionData`, apagar as linhas
`dashboard: DashboardData;` e `benefits: Benefit[];`.

- [ ] **Passo 4: remover o conteúdo dos cinco produtos**

Apagar o bloco `dashboard: { ... }` e o bloco `benefits: [ ... ]` de
`secops`, `infraops`, `devarch`, `autoops` e `cirt`. São dez blocos.

- [ ] **Passo 5: rodar o teste e ver passar**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && npx vitest run src/data/solutionsData.test.ts"
```

Esperado: PASS, 10 testes.

- [ ] **Passo 6: consertar o que o TypeScript apontar em SolutionPage**

Três pontos, todos em `src/pages/SolutionPage.tsx`.

**a)** O nome do serviço no JSON-LD vinha do dashboard. Trocar:

```tsx
        data={{ 
          name: solution.dashboard?.title || 'Solution', 
```

por:

```tsx
        data={{ 
          name: solution.metaTitle || t(`solutions.${slug}.title`), 
```

**b)** A coluna direita do hero era o dashboard. `autoops` mostra
`<ChatPreview />`, que é o produto trabalhando e fica; os outros quatro
perdem a coluna. Substituir o bloco inteiro do `<motion.div>` da direita
(o que contém `animate-pulse`, `ChatPreview` e `SolutionExecutiveDashboard`)
por:

```tsx
          {slug === 'autoops' && (
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <ChatPreview />
            </motion.div>
          )}
```

E trocar a classe do grid do hero, para ele não deixar meia tela vazia nos
outros quatro:

```tsx
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
```

por:

```tsx
        <div className={`mb-24 grid items-center gap-16 ${slug === 'autoops' ? 'lg:grid-cols-2' : 'max-w-3xl'}`}>
```

**c)** Apagar a seção `#benefícios` inteira, de `{/* NEW Valor para o
Negócio` até o `</section>` que a fecha, e o import
`SolutionExecutiveDashboard`.

- [ ] **Passo 7: apagar o componente órfão**

```bash
rm src/components/solutions/SolutionExecutiveDashboard.tsx
```

- [ ] **Passo 8: verificar tipo e build**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && npx tsc --noEmit && npm run build 2>&1 | tail -3"
```

Esperado: sem erro de tipo; build conclui.

- [ ] **Passo 9: commit**

```bash
git add src/data/solutionsData.ts src/data/solutionsData.test.ts src/pages/SolutionPage.tsx
git rm src/components/solutions/SolutionExecutiveDashboard.tsx
git commit -m "fix(solucoes): tirar do ar o dashboard de numeros inventados

O bloco publicava '100% postura atualizada', '0 gaps em privacidade' e
'soar isolation speed sub 500ms' com barra de progresso vazia — telemetria
que nao existe, na peca central da pagina. Para um CISO comparando
fornecedores e o item de maior custo: quem reconhece um mock desconta o resto
junto.

Saem tambem os tres benefits, que eram adjetivo e nao informacao.

O nome do servico no JSON-LD vinha de dashboard.title e passa a vir de
metaTitle. autoops mantem o ChatPreview, que e o produto trabalhando.

Um teste unitario passa a reprovar absoluto sem fonte em qualquer produto."
```

---

### Tarefa 2: seção 1 — o que acontece quando alguma coisa acontece

**Arquivos:**
- Modificar: `src/data/solutionsData.ts`
- Criar: `src/components/solutions/RespostaAIncidente.tsx`
- Modificar: `src/pages/SolutionPage.tsx`
- Modificar: `tests/site/smoke.spec.ts`

**Interfaces:**
- Consome: `SolutionData` da tarefa 1.
- Produz: `NivelDeSeveridade`, `WorkflowStep` exportados de
  `solutionsData.ts`; componente `RespostaAIncidente` com props
  `{ severidade?: NivelDeSeveridade[]; workflow?: WorkflowStep[] }`.

- [ ] **Passo 1: escrever o teste e2e que falha**

Acrescentar ao fim de `tests/site/smoke.spec.ts`:

```ts
test.describe('página de produto', () => {
  // Enquanto a ficha do produto nao volta, a secao 1 cai para o `workflow`,
  // que ja esta publicado. O que nao pode e ficar titulo com vazio embaixo.
  test('a resposta a incidente aparece, por severidade ou por fluxo', async ({ page }) => {
    await page.goto('/solucoes/secops');
    const secao = page.locator('#resposta');
    await expect(secao).toBeVisible();
    await expect(secao.getByRole('heading', { level: 3 })).toContainText(/acontece/i);
    // ou a tabela de severidade, ou a lista do fluxo — nunca as duas, nunca nenhuma
    const tabela = await secao.locator('table').count();
    const lista = await secao.locator('ol > li').count();
    expect(tabela > 0 || lista > 0).toBe(true);
    expect(tabela > 0 && lista > 0).toBe(false);
  });
});
```

- [ ] **Passo 2: rodar e ver falhar**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && SITE_BASE_URL=http://127.0.0.1:4351 npx playwright test -c playwright.site.config.ts -g 'resposta a incidente'"
```

Esperado: FAIL — `#resposta` não existe.

- [ ] **Passo 3: adicionar os tipos**

Em `src/data/solutionsData.ts`, exportar `WorkflowStep` (hoje é interface
local) e acrescentar:

```ts
export interface WorkflowStep { step: string; name: string; desc: string }

/**
 * Um nível do modelo de severidade. `quando` descreve ordem e não prazo:
 * "contém primeiro, avisa depois" entra; "em 15 minutos" não — número de SLA
 * fica na proposta comercial.
 */
export interface NivelDeSeveridade {
  nivel: string;
  exemploConcreto: string;
  quemAge: string;
  quando: string;
  voceRecebe: string;
}
```

E em `SolutionData`: `severidade?: NivelDeSeveridade[];`

- [ ] **Passo 4: criar o componente**

`src/components/solutions/RespostaAIncidente.tsx`:

```tsx
import BlueDot from '../BlueDot';
import type { NivelDeSeveridade, WorkflowStep } from '../../data/solutionsData';

/**
 * Seção 1 — "o que acontece quando alguma coisa acontece".
 *
 * É o hero de conteúdo da página: publica o modelo de severidade, que é a
 * informação que o comprador não consegue nos concorrentes. Enquanto a ficha
 * do produto não volta (ver docs/FICHA-runbook-por-produto.md), cai para o
 * `workflow`, que diz a mesma coisa com menos precisão e já está publicado.
 *
 * Tabela de verdade, não grade de divs: é uma matriz de nível × resposta, e
 * leitor de tela precisa do cabeçalho de linha e de coluna para navegá-la.
 */
export default function RespostaAIncidente({
  severidade,
  workflow,
}: {
  severidade?: NivelDeSeveridade[];
  workflow?: WorkflowStep[];
}) {
  const temSeveridade = Boolean(severidade?.length);
  if (!temSeveridade && !workflow?.length) return null;

  return (
    <section id="resposta" className="mb-24">
      <h3 className="mb-10 font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
        o que acontece quando alguma coisa acontece<BlueDot />
      </h3>

      {temSeveridade ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-widest text-on-surface-variant">
                <th scope="col" className="py-4 pr-6 font-medium">nível</th>
                <th scope="col" className="py-4 pr-6 font-medium">o que é</th>
                <th scope="col" className="py-4 pr-6 font-medium">quem age</th>
                <th scope="col" className="py-4 pr-6 font-medium">em que ordem</th>
                <th scope="col" className="py-4 font-medium">você recebe</th>
              </tr>
            </thead>
            <tbody>
              {severidade!.map((n) => (
                <tr key={n.nivel} className="border-b border-white/5 align-top">
                  <th scope="row" className="py-6 pr-6 font-display text-lg font-medium text-primary-container">
                    {n.nivel}
                  </th>
                  <td className="py-6 pr-6 text-sm leading-relaxed text-white">{n.exemploConcreto}</td>
                  <td className="py-6 pr-6 text-sm leading-relaxed text-on-surface-variant">{n.quemAge}</td>
                  <td className="py-6 pr-6 text-sm leading-relaxed text-on-surface-variant">{n.quando}</td>
                  <td className="py-6 text-sm leading-relaxed text-on-surface-variant">{n.voceRecebe}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ol className="grid gap-6 md:grid-cols-3">
          {workflow!.map((w) => (
            <li key={w.step} className="rounded-3xl border border-white/5 bg-surface-container-low/20 p-8">
              <span className="font-mono text-sm text-primary-container">{w.step}</span>
              <h4 className="mt-4 font-display text-lg font-medium leading-snug tracking-tight text-white">
                {w.name}
              </h4>
              {w.desc && <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{w.desc}</p>}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
```

- [ ] **Passo 5: trocar a seção antiga pelo componente**

Em `src/pages/SolutionPage.tsx`, apagar a seção `#fluxo-operacional` inteira
e pôr no lugar, logo depois do `</div>` que fecha o hero:

```tsx
        <RespostaAIncidente severidade={solution.severidade} workflow={solution.workflow} />
```

Import no topo:

```tsx
import RespostaAIncidente from '../components/solutions/RespostaAIncidente';
```

- [ ] **Passo 6: rodar o e2e e ver passar**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && npm run build && PORTA=4351 bash scripts/preview-local.sh --sem-build && SITE_BASE_URL=http://127.0.0.1:4351 npx playwright test -c playwright.site.config.ts -g 'resposta a incidente'"
```

Esperado: PASS nos dois projetos (mobile e desktop). Cai para a lista do
`workflow`, porque nenhum produto tem `severidade` ainda.

- [ ] **Passo 7: commit**

```bash
git add src/data/solutionsData.ts src/components/solutions/RespostaAIncidente.tsx src/pages/SolutionPage.tsx tests/site/smoke.spec.ts
git commit -m "feat(solucoes): secao 1 publica o modelo de severidade

O que o comprador quer saber primeiro e o que acontece as 3h da manha. A
secao aceita o modelo de severidade — nivel, quem age, em que ordem, o que
voce recebe — e cai para o fluxo ja publicado enquanto a ficha do produto nao
volta, para nao nascer com titulo e vazio embaixo.

Tabela de verdade, com escopo de linha e coluna: e uma matriz, e leitor de
tela precisa navega-la."
```

---

### Tarefa 3: seção 2 — o que está no escopo, e o que não está

**Arquivos:**
- Modificar: `src/data/solutionsData.ts`
- Criar: `src/components/solutions/Escopo.tsx`
- Modificar: `src/pages/SolutionPage.tsx`
- Modificar: `tests/site/smoke.spec.ts`

**Interfaces:**
- Produz: `EscopoDoServico` exportado; componente `Escopo` com prop
  `{ escopo?: EscopoDoServico }`.

- [ ] **Passo 1: escrever o teste que falha**

Acrescentar dentro do `test.describe('página de produto')`:

```ts
  // Secao sem dado nao pode deixar titulo orfao — foi o erro que a home
  // cometia com o blog.
  test('seção sem dado não deixa título órfão', async ({ page }) => {
    await page.goto('/solucoes/secops');
    for (const id of ['#escopo', '#entregaveis', '#operacao']) {
      const secao = page.locator(id);
      if (await secao.count()) {
        const itens = await secao.locator('li, dd').count();
        expect(itens, `${id} existe mas está vazia`).toBeGreaterThan(0);
      }
    }
  });
```

- [ ] **Passo 2: rodar e ver passar por vacuidade, depois confirmar que ele morde**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && SITE_BASE_URL=http://127.0.0.1:4351 npx playwright test -c playwright.site.config.ts -g 'título órfão'"
```

Esperado: PASS (as seções ainda não existem). Este teste é uma guarda, não um
teste vermelho — para provar que morde, no passo 6 renderize a seção sem
dado de propósito, veja falhar, e desfaça.

- [ ] **Passo 3: adicionar o tipo**

```ts
/** O que a ness. faz e o que explicitamente não faz. A segunda lista é a que
 *  constrói confiança: fornecedor que só diz o que faz não diz nada. */
export interface EscopoDoServico { dentro: string[]; fora: string[] }
```

E em `SolutionData`: `escopo?: EscopoDoServico;`

- [ ] **Passo 4: criar o componente**

`src/components/solutions/Escopo.tsx`:

```tsx
import { Check, Minus } from 'lucide-react';
import BlueDot from '../BlueDot';
import type { EscopoDoServico } from '../../data/solutionsData';

/**
 * Seção 2 — até onde vai a responsabilidade.
 *
 * A coluna "fora" não é ressalva jurídica: é o que faz um CISO acreditar na
 * coluna "dentro". As duas listas têm o mesmo peso visual de propósito.
 */
export default function Escopo({ escopo }: { escopo?: EscopoDoServico }) {
  if (!escopo?.dentro?.length && !escopo?.fora?.length) return null;

  const colunas = [
    { titulo: 'dentro', itens: escopo?.dentro ?? [], Icone: Check, cor: 'text-primary-container' },
    { titulo: 'fora', itens: escopo?.fora ?? [], Icone: Minus, cor: 'text-on-surface-variant/60' },
  ].filter((c) => c.itens.length);

  return (
    <section id="escopo" className="mb-24">
      <h3 className="mb-10 font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
        o que está no escopo — e o que não está<BlueDot />
      </h3>
      <div className="grid gap-8 md:grid-cols-2">
        {colunas.map(({ titulo, itens, Icone, cor }) => (
          <div key={titulo} className="rounded-3xl border border-white/5 bg-surface-container-low/20 p-8">
            <h4 className="mb-6 text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">
              {titulo}
            </h4>
            <ul className="space-y-4">
              {itens.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-on-surface">
                  <Icone size={16} className={`mt-0.5 shrink-0 ${cor}`} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Passo 5: pendurar na página**

Em `SolutionPage.tsx`, depois de `<RespostaAIncidente … />`:

```tsx
        <Escopo escopo={solution.escopo} />
```

Import: `import Escopo from '../components/solutions/Escopo';`

- [ ] **Passo 6: provar que a guarda morde**

Temporariamente, em `solutionsData.ts`, dê a `secops`
`escopo: { dentro: [], fora: [] }` e troque no componente
`if (!escopo?.dentro?.length && !escopo?.fora?.length) return null;` por
`if (!escopo) return null;`. Rode o teste do passo 1: deve FALHAR com
"`#escopo` existe mas está vazia". Desfaça as duas alterações e rode de novo:
PASS.

- [ ] **Passo 7: commit**

```bash
git add src/data/solutionsData.ts src/components/solutions/Escopo.tsx src/pages/SolutionPage.tsx tests/site/smoke.spec.ts
git commit -m "feat(solucoes): secao 2 diz ate onde vai a responsabilidade

Com uma coluna que quase ninguem publica: o que NAO esta no escopo. E a que
faz acreditar na outra — fornecedor que so diz o que faz nao diz nada. As
duas listas tem o mesmo peso visual de proposito.

Um teste garante que secao sem dado some inteira, em vez de deixar titulo com
vazio embaixo."
```

---

### Tarefa 4: seção 3 — o que você recebe

**Arquivos:**
- Modificar: `src/data/solutionsData.ts`
- Criar: `src/components/solutions/Entregaveis.tsx`
- Modificar: `src/pages/SolutionPage.tsx`

**Interfaces:**
- Produz: `Entregavel` exportado; componente `Entregaveis` com prop
  `{ entregaveis?: Entregavel[] }`.

- [ ] **Passo 1: adicionar o tipo**

```ts
/** O artefato que chega ao cliente e de quanto em quanto tempo. */
export interface Entregavel { item: string; cadencia: string }
```

E em `SolutionData`: `entregaveis?: Entregavel[];`

- [ ] **Passo 2: criar o componente**

`src/components/solutions/Entregaveis.tsx`:

```tsx
import BlueDot from '../BlueDot';
import type { Entregavel } from '../../data/solutionsData';

/**
 * Seção 3 — o que chega na mesa de quem contrata, e quando.
 *
 * Lista de definição: o artefato é o termo, a cadência é a definição. É a
 * estrutura que o conteúdo tem, e dá ao leitor de tela o par correto.
 */
export default function Entregaveis({ entregaveis }: { entregaveis?: Entregavel[] }) {
  if (!entregaveis?.length) return null;

  return (
    <section id="entregaveis" className="mb-24">
      <h3 className="mb-10 font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
        o que você recebe<BlueDot />
      </h3>
      <dl className="divide-y divide-white/5 border-y border-white/5">
        {entregaveis.map((e) => (
          <div key={e.item} className="flex flex-col gap-2 py-6 md:flex-row md:items-baseline md:gap-8">
            <dt className="font-display text-lg font-medium text-white md:flex-1">{e.item}</dt>
            <dd className="text-[11px] uppercase tracking-widest text-primary-container md:w-56 md:shrink-0">
              {e.cadencia}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Passo 3: pendurar na página**

Depois de `<Escopo … />`:

```tsx
        <Entregaveis entregaveis={solution.entregaveis} />
```

Import: `import Entregaveis from '../components/solutions/Entregaveis';`

- [ ] **Passo 4: verificar tipo e build**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && npx tsc --noEmit && npm run build 2>&1 | tail -3"
```

Esperado: sem erro; a seção não renderiza, porque nenhum produto tem
`entregaveis` ainda.

- [ ] **Passo 5: commit**

```bash
git add src/data/solutionsData.ts src/components/solutions/Entregaveis.tsx src/pages/SolutionPage.tsx
git commit -m "feat(solucoes): secao 3 lista o que chega na mesa do cliente

Artefato e cadencia, em lista de definicao — que e a estrutura que o conteudo
tem de fato. Some inteira ate a ficha do produto voltar preenchida."
```

---

### Tarefa 5: seção 4 — como a operação roda

**Arquivos:**
- Modificar: `src/data/solutionsData.ts`
- Criar: `src/components/solutions/Operacao.tsx`
- Modificar: `src/pages/SolutionPage.tsx`

**Interfaces:**
- Consome: `OnboardingStep` (já existe em `solutionsData.ts`, hoje local —
  exportar).
- Produz: o tipo `OperacaoDoServico` exportado de `solutionsData.ts`, e o
  componente `Operacao` com props
  `{ operacao?: OperacaoDoServico; onboarding?: OnboardingStep[] }`. Os dois
  nomes são diferentes de propósito: um é o dado, o outro é a seção.

- [ ] **Passo 1: adicionar os tipos**

Exportar `OnboardingStep` e acrescentar:

```ts
/** Como a operação roda por dentro. `cobertura` descreve o modelo (turnos,
 *  sobreaviso), não o número de pessoas. */
export interface OperacaoDoServico {
  cobertura: string;
  passagemDePlantao: string;
  escalacao: string;
  tempoDeAtivacao: string;
}
```

E em `SolutionData`: `operacao?: OperacaoDoServico;`

- [ ] **Passo 2: criar o componente**

`src/components/solutions/Operacao.tsx`:

```tsx
import BlueDot from '../BlueDot';
import type { OnboardingStep, OperacaoDoServico } from '../../data/solutionsData';

/**
 * Seção 4 — quem opera, como o turno passa o bastão, e em quanto tempo entra
 * no ar. A linha do tempo de ativação fecha a seção porque responde a última
 * dessas perguntas.
 */
export default function Operacao({
  operacao,
  onboarding,
}: {
  operacao?: OperacaoDoServico;
  onboarding?: OnboardingStep[];
}) {
  if (!operacao && !onboarding?.length) return null;

  const campos = operacao
    ? [
        { rotulo: 'cobertura', valor: operacao.cobertura },
        { rotulo: 'passagem de plantão', valor: operacao.passagemDePlantao },
        { rotulo: 'escalação', valor: operacao.escalacao },
        { rotulo: 'tempo de ativação', valor: operacao.tempoDeAtivacao },
      ].filter((c) => c.valor)
    : [];

  return (
    <section id="operacao" className="mb-24">
      <h3 className="mb-10 font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
        como a operação roda<BlueDot />
      </h3>

      {campos.length > 0 && (
        <dl className="mb-16 grid gap-8 md:grid-cols-2">
          {campos.map((c) => (
            <div key={c.rotulo} className="rounded-3xl border border-white/5 bg-surface-container-low/20 p-8">
              <dt className="mb-3 text-[11px] font-medium uppercase tracking-widest text-primary-container">
                {c.rotulo}
              </dt>
              <dd className="text-sm leading-relaxed text-on-surface">{c.valor}</dd>
            </div>
          ))}
        </dl>
      )}

      {onboarding?.length ? (
        <ol className="grid gap-8 md:grid-cols-4">
          {onboarding.map((p) => (
            <li key={p.step}>
              <span className="font-mono text-sm text-primary-container">{p.step}</span>
              <h4 className="mt-3 font-display text-base font-medium tracking-tight text-white">{p.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{p.desc}</p>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
```

- [ ] **Passo 3: trocar a seção antiga pelo componente**

Em `SolutionPage.tsx`, apagar a seção `#onboarding` inteira e pôr, depois de
`<Entregaveis … />`:

```tsx
        <Operacao operacao={solution.operacao} onboarding={solution.onboarding} />
```

Import: `import Operacao from '../components/solutions/Operacao';`

- [ ] **Passo 4: verificar tipo e build**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && npx tsc --noEmit && npm run build 2>&1 | tail -3"
```

Esperado: sem erro; a seção renderiza só a linha do tempo, porque
`onboarding` existe e `operacao` ainda não.

- [ ] **Passo 5: commit**

```bash
git add src/data/solutionsData.ts src/components/solutions/Operacao.tsx src/pages/SolutionPage.tsx
git commit -m "feat(solucoes): secao 4 mostra como a operacao roda

Cobertura, passagem de plantao, escalacao e tempo de ativacao — e a jornada
de ativacao, que era secao separada, fecha esta, porque responde a ultima
dessas quatro perguntas."
```

---

### Tarefa 6: reordenar, enxugar e tirar a decoração que finge informação

**Arquivos:**
- Modificar: `src/pages/SolutionPage.tsx`
- Modificar: `src/components/solutions/SolutionServicesGrid.tsx`
- Modificar: `tests/site/smoke.spec.ts`

**Interfaces:**
- Consome: os quatro componentes das tarefas 2–5.

- [ ] **Passo 1: escrever o teste da ordem**

Acrescentar ao `test.describe('página de produto')`:

```ts
  // A ordem e a decisao do desenho: cada secao responde uma pergunta, na
  // ordem em que o comprador a faz. Trocar a ordem sem trocar o spec e bug.
  test('as seções aparecem na ordem do desenho', async ({ page }) => {
    await page.goto('/solucoes/secops');
    const esperada = ['#resposta', '#ferramentas', '#situacoes', '#portfolio'];
    const posicoes: number[] = [];
    for (const id of esperada) {
      const el = page.locator(id);
      if (!(await el.count())) continue;
      posicoes.push((await el.boundingBox())!.y);
    }
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
    expect(posicoes.length).toBeGreaterThanOrEqual(3);
  });
```

- [ ] **Passo 2: rodar e ver falhar**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && SITE_BASE_URL=http://127.0.0.1:4351 npx playwright test -c playwright.site.config.ts -g 'ordem do desenho'"
```

Esperado: FAIL — `#ferramentas`, `#situacoes` e `#portfolio` não existem com
esses ids.

- [ ] **Passo 3: renomear e enxugar a seção de ferramentas**

Em `SolutionServicesGrid.tsx`, trocar o cabeçalho e o id da seção:

```tsx
    <section id="serviços" className="mb-24">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight lowercase">
          {t('solutions.strategic_solutions', 'soluções estratégicas')}<BlueDot />
        </h3>
      </div>
```

por:

```tsx
    <section id="ferramentas" className="mb-24">
      <div className="mb-12">
        <h3 className="font-display text-3xl font-semibold lowercase tracking-tight text-white md:text-4xl">
          ferramentas<BlueDot />
        </h3>
      </div>
```

O alinhamento central era o único da página; sai por consistência.

- [ ] **Passo 4: a nuvem de pílulas vira checklist**

Em `SolutionPage.tsx`, substituir a seção `#funcionalidades` inteira por um
bloco simples, dentro do mesmo lugar (logo após `<SolutionServicesGrid … />`):

```tsx
        {solution.features && solution.features.length > 0 && (
          <div className="mb-24 -mt-8">
            {/* Era uma nuvem de pilulas escalonadas com opacidade decrescente:
                sugeria hierarquia que ninguem decidiu, e o item de baixo
                parecia menos importante sem motivo. Lista, para conferir. */}
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {solution.features.map((feat) => (
                <li key={feat.name} className="flex items-baseline gap-3 border-b border-white/5 py-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-container" aria-hidden="true" />
                  <span className="text-sm text-white">{feat.name}</span>
                  <span className="ml-auto text-[11px] uppercase tracking-widest text-on-surface-variant/70">
                    {feat.category}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
```

- [ ] **Passo 5: mover as situações para depois das ferramentas**

Mover o bloco `{solution.useCases && ( … )}` para depois do bloco do passo 4,
e trocar o id e o título:

```tsx
          <section id="casos-de-uso" className="mb-24">
```
por
```tsx
          <section id="situacoes" className="mb-24">
```

e

```tsx
                {t('solutions.use_cases', 'casos de uso reais')}<BlueDot />
```
por
```tsx
                {t('solutions.use_cases', 'quatro situações')}<BlueDot />
```

- [ ] **Passo 6: id do portfólio sem acento**

```tsx
        <section id="portfólio">
```
por
```tsx
        <section id="portfolio">
```

- [ ] **Passo 7: o botão do CTA deixa de ser branco**

Na faixa de CTA, trocar:

```tsx
              className="bg-white text-surface px-10 py-5 rounded-full font-display font-semibold uppercase tracking-widest text-sm hover:bg-primary-container hover:text-on-primary hover:scale-105 transition-all shadow-lg shadow-primary-container/20 whitespace-nowrap">
```

por:

```tsx
              className="whitespace-nowrap rounded-full bg-primary-container px-10 py-5 font-display text-sm font-semibold uppercase tracking-widest text-on-primary shadow-lg shadow-primary-container/25 transition-all hover:brightness-110 hover:shadow-[0_0_28px_rgba(0,173,232,0.4)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low">
```

Era o último botão branco do site; os outros já foram unificados em BlueDot
sólido.

- [ ] **Passo 8: rodar o e2e e ver passar**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && npm run build && PORTA=4351 bash scripts/preview-local.sh --sem-build && SITE_BASE_URL=http://127.0.0.1:4351 npx playwright test -c playwright.site.config.ts"
```

Esperado: a suíte inteira passa, incluindo os três testes novos.

- [ ] **Passo 9: auditar a página**

```
MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && node scripts/auditoria-de-tela.mjs http://127.0.0.1:4351"
```

Esperado: `nenhum achado.` e saída 0. O script cobre as nove rotas nos dois
tamanhos — imagem sem alt, campo sem rótulo, controle sem nome, alvo abaixo
de 24 px, salto de título, rolagem horizontal e peso 700.

- [ ] **Passo 10: commit**

```bash
git add src/pages/SolutionPage.tsx src/components/solutions/SolutionServicesGrid.tsx tests/site/smoke.spec.ts
git commit -m "refactor(solucoes): sete secoes, cada uma respondendo uma pergunta

A pagina tinha dez secoes e quatro diziam a mesma coisa em titulos
diferentes. Agora a ordem segue a do comprador: como voces respondem, ate
onde vai a responsabilidade, o que eu recebo, como a operacao roda,
ferramentas, situacoes, casos.

A nuvem de pilulas com opacidade decrescente vira lista conferivel — ela
sugeria hierarquia que ninguem decidiu. O alinhamento central da secao de
servicos, unico da pagina, sai. E o ultimo botao branco do site vira BlueDot
solido, como os outros.

Um teste reprova mudanca de ordem que nao passe pelo desenho."
```

---

## Depois deste plano

O template fica no ar com as quatro seções novas vazias — some cada uma até a
ficha do produto voltar. Quando `docs/FICHA-runbook-por-produto.md` voltar
preenchida, o trabalho é só preencher `solutionsData.ts` e as seções acendem
sozinhas, sem tocar em componente.

Fora de alcance, como o spec já registra: conteúdo das fichas, tradução para
`/en` e `/es`, e as páginas das sub-marcas.
