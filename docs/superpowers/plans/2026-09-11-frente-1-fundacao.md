# Frente 1, a fundação: plano de implementação

> **Para quem executa:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para executar tarefa por tarefa. Os passos usam caixas (`- [ ]`) para acompanhar.

**Objetivo:** deixar o site pronto para o redesenho. Isso quer dizer: a régua de produto atualizada (`PRODUCT.md`), o design registrado (`DESIGN.md`), a CI rodando os testes unitários e o detector do impeccable, e os quatro produtos antigos da ness. sem alegação sem fonte e descritos pelo que são.

**Arquitetura:** nenhuma mudança de estrutura. São dados em `src/data/solutionsData.ts`, textos em `src/i18n.ts` e `src/locales/{en,es}.json`, dois passos novos no workflow de preview, uma configuração do detector em `.impeccable/config.json` e dois documentos na raiz. Toda regra nova de conteúdo entra primeiro como teste que falha.

**Stack:** React Router 7 (SSR) num Worker da Cloudflare, Vitest, Playwright, GitHub Actions, impeccable 4.1.0 (npm).

**Especificação:** [docs/superpowers/specs/2026-09-11-site-wow-design.md](../specs/2026-09-11-site-wow-design.md), seção 8 (fundação). Leia também as seções 3.1 (portfólio) e 6.2 (regras de texto), porque as tarefas 2 a 4 as aplicam.

## Restrições globais

- **Codinome de projeto nunca aparece**, nem em texto, chave de i18n, identificador, rota, branch, commit, descrição de PR ou nome de arquivo. O teste `nenhum codinome interno de projeto` guarda só hashes SHA-256; para acrescentar outro codinome, some o hash, nunca o nome.
- **Documento de cliente não vira conteúdo:** nome de cliente, achado de pentest e dado de ambiente de cliente nunca vão para o site.
- **Nada de número, prazo ou ganho sem fonte registrada** em `docs/PESQUISA-metricas.md`. SLA fica na proposta.
- **Produto se descreve pelo serviço que presta**, não por ferramenta nem indicador do setor.
- "Agentes de IA", "agentic" e "copiloto" não aparecem no site. No n.secops e no ness.OS, o ator automatizado é o **AIOps**.
- **Marca no meio de frase sai desenhada** (`src/components/ComMarcas.tsx`). Nos textos de corpo que esta frente reescreve, não escreva nome de marca: use a primeira pessoa do plural ("cuidamos", "assumimos").
- **Como um produto é construído** (stack, linguagem, provedor, modelo) não aparece no site.
- Código (identificadores) segue o padrão do arquivo que você edita; comentários, docs e commits em **português**; commits no formato convencional (`feat:`, `fix:`, `docs:`, `chore:`, `ci:`, `test:`).
- Todo commit termina com `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- **Como rodar comandos:** o repositório mora no WSL, e o `node_modules` é do Linux. A partir do Git Bash, com o diretório atual em `/c/Users`:
  `MSYS_NO_PATHCONV=1 wsl.exe -d Ubuntu -e bash -lc "cd /home/resper/ness-site2026 && <comando>"`.
  Neste plano, "Rode: `<comando>`" significa exatamente isso. Git e `gh` rodam direto no PowerShell, em `W:\home\resper\ness-site2026`.
  Dentro das aspas duplas do comando, escape `$` como `\$` (por exemplo, `echo exit=\$?`); sem isso, o Git Bash expande a variável antes de ela chegar ao WSL.
- Merge em `main` publica em produção, e **o merge é sempre do Ricardo**. Nunca faça merge.

## Preparação (antes da Tarefa 1)

**Pré-condição:** o PR #44 (`fix/dpo-sem-codinome`) já está mergeado em `main`. Ele mexe no mesmo bloco do n.autoops em `src/i18n.ts` e nos dois `locales`. Confira:

```powershell
gh pr view 44 --json state --jq .state
```

Esperado: `MERGED`. Se vier `OPEN`, pare e avise o Ricardo.

Depois, crie a branch a partir da especificação, rebaseada no `main` atualizado:

```powershell
git fetch origin
git switch docs/spec-redesenho
git rebase origin/main
git switch -c chore/fundacao
```

Esperado: rebase sem conflito, porque a branch de especificação só mexe em `docs/superpowers/`.

## Mapa dos arquivos

| Arquivo | O que muda | Tarefa |
|---|---|---|
| `.impeccable/config.json` | criado pelo CLI: exceção da regra `overused-font` para Inter e Montserrat, as fontes da marca | 1 |
| `.gitignore` | ignora `.impeccable/config.local.json` (exceções privadas) | 1 |
| `.github/workflows/preview.yml` | passos "Testes unitários" e "Detector do impeccable" antes do build | 1 |
| `src/data/solutionsData.test.ts` | produto sem ficha não publica número com unidade, case nem caso de uso; n.infraops sem FinOps | 2 |
| `src/data/solutionsData.ts` | blocos `infraops`, `devarch`, `autoops` e `cirt` reescritos; ícone do n.autoops | 2 |
| `src/utils/integridade.test.ts` | nenhum produto vendido como agente ou copiloto; varredura de codinome também nos `.md` da raiz e de `docs/` | 3, 4 |
| `src/i18n.ts`, `src/locales/en.json`, `src/locales/es.json` | `solutions.infraops`, `solutions.devarch` e `solutions.autoops` | 3 |
| `PRODUCT.md` | reescrito com as três empresas, o portfólio e as regras de 11/09 | 4 |
| `README.md` e cinco documentos de `docs/` | o nome antigo da assistente do chat vira "Gabi" | 4 |
| `docs/PESQUISA-metricas.md` | alegações confirmadas em 11/09 | 4 |
| `DESIGN.md`, `.impeccable/design.json` | gerados por `/impeccable document` | 5 |
| `docs/DESIGN.md`, `docs/DESIGN-SYSTEM.md` | aviso no topo apontando para o `DESIGN.md` da raiz | 5 |

---

### Tarefa 1: portões na CI (testes unitários e detector do impeccable)

Hoje o workflow de preview roda build, e2e e Lighthouse, mas **não roda `npm test`**. Por isso o `integridade.test.ts` só barra alguma coisa quando alguém roda os testes na mão. O detector do impeccable acusa hoje 5 achados, todos a regra `overused-font` nas `@font-face` da Inter e da Montserrat de `src/index.css`. Isso é falso positivo, porque as duas são as fontes da marca.

**Arquivos:**
- Criar: `.impeccable/config.json` (pelo CLI, não à mão)
- Modificar: `.gitignore`
- Modificar: `.github/workflows/preview.yml:35-39`

**Interfaces:**
- Produz: o passo `Testes unitários` e o passo `Detector do impeccable` no job `preview`, dos quais as tarefas seguintes dependem para a CI barrar regressão.

- [ ] **Passo 1: confirmar que o detector falha hoje**

Rode: `npx --yes impeccable@4.1.0 detect src; echo exit=$?`

Esperado: 5 achados `overused-font` em `src/index.css` e `exit=2`.

- [ ] **Passo 2: registrar as exceções, uma por fonte (a mais estreita possível)**

Rode:
`npx --yes impeccable@4.1.0 ignores add-value overused-font Inter --reason "fonte da marca (corpo)" && npx --yes impeccable@4.1.0 ignores add-value overused-font Montserrat --reason "fonte da marca (títulos)"`

Esperado: duas linhas `Added overused-font=... to shared detector ignoreValues (.impeccable/config.json).` Não use `add-rule`, que desliga a regra para qualquer fonte.

- [ ] **Passo 3: confirmar que o detector passa**

Rode: `npx --yes impeccable@4.1.0 detect src; echo exit=$?`

Esperado: nenhum achado e `exit=0`.

- [ ] **Passo 4: ignorar as exceções privadas**

Acrescente ao fim de `.gitignore`:

```gitignore

# Exceções privadas do detector do impeccable; as compartilhadas ficam em
# .impeccable/config.json, versionado.
.impeccable/config.local.json
```

- [ ] **Passo 5: incluir os dois passos no workflow**

Em `.github/workflows/preview.yml`, troque:

```yaml
      - name: Instalar dependências
        run: npm ci

      - name: Build
```

por:

```yaml
      - name: Instalar dependências
        run: npm ci

      # Os testes de integridade (alegação sem fonte, codinome, marca) só
      # barram alguma coisa se rodarem aqui; antes, dependiam de alguém rodar
      # npm test na mão.
      - name: Testes unitários
        run: npm test

      # Versão fixa: uma versão nova do detector com regra nova não pode
      # derrubar a CI sem ninguém ter mexido no código. As exceções ficam em
      # .impeccable/config.json.
      - name: Detector do impeccable
        run: npx --yes impeccable@4.1.0 detect src

      - name: Build
```

- [ ] **Passo 6: rodar os testes unitários como a CI vai rodar**

Rode: `npm test 2>&1 | tail -4`

Esperado: `Test Files  8 passed` e nenhuma falha.

- [ ] **Passo 7: commit**

```powershell
git add .impeccable/config.json .gitignore .github/workflows/preview.yml
git commit -m "ci: testes unitários e detector do impeccable no preview" -m "O preview passa a rodar npm test e o detector do impeccable antes do build. As duas fontes da marca, Inter e Montserrat, entram como exceção da regra overused-font, uma por valor, com o motivo registrado." -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Tarefa 2: os quatro produtos antigos sem alegação sem fonte

Os blocos `infraops`, `devarch`, `autoops` e `cirt` de `src/data/solutionsData.ts` ainda estão no formato antigo (sem `promessa`) e publicam, entre outras coisas: "uptime garantido" (na meta description), "MTTR 78% menor", "sala de guerra em 15 minutos", "R$ 15 milhões", "<= 15 minutos", "30.000 horas/ano", "1-2 semanas", cases sem fonte ("Logística Nacional", "Healthcare Provider", "Top Fintech", "Logistics Leader") e "agentes de IA". Também descrevem os produtos pelas ferramentas.

A redefinição veio do Ricardo em 11/09 (especificação, 3.1):
- **n.infraops:** atendimento, sustentação técnica e arquitetura de infraestrutura, sem FinOps.
- **n.devarch:** célula de desenvolvimento, arquitetura e segurança de software.
- **n.autoops:** gestão da frota de automações, sem IA e sem a Gabi.
- **n.cirt:** comando da crise cibernética.

A página (`src/pages/SolutionPage.tsx`) já esconde `useCases`, `features`, `technicalFeatures` e `portfolio` quando ausentes ou vazios.

**Arquivos:**
- Modificar: `src/data/solutionsData.test.ts`
- Modificar: `src/data/solutionsData.ts:1` (import de ícones) e os blocos `"infraops"`, `"devarch"`, `"autoops"` e `"cirt"` (hoje nas linhas 209–356)

**Interfaces:**
- Consome: `SolutionData` e a função `textos()` já existentes em `solutionsData.test.ts`.
- Produz: produto sem `promessa` sem `useCases` e sem `portfolio`. A frente 4 troca esses blocos pelas fichas tipadas.

- [ ] **Passo 1: escrever os testes que falham**

Em `src/data/solutionsData.test.ts`, depois da constante `PARTES_DO_DESENHO`, acrescente:

```ts
/**
 * Produto no formato antigo (sem `promessa`) ainda não passou pela ficha
 * validada pelo time: nele não vai ao ar número com unidade — prazo, ganho ou
 * valor —, nem case, nem caso de uso. Quando a ficha voltar, o número entra
 * com a fonte registrada em docs/PESQUISA-metricas.md.
 */
const NUMERO_COM_UNIDADE = /\d[\d.,]*\s*(?:-\s*\d+\s*)?(?:minutos?\b|min\b|horas?\b|h\b|semanas?\b|s\b|dias?\b|meses\b|milh|mil\b|%)|R\$\s*\d|<=\s*\d/i;
```

E, dentro do `for`, depois do teste `não tem mais dashboard nem benefits`, acrescente:

```ts
    it(`${slug}, sem ficha, não publica número com unidade`, () => {
      if (dados.promessa) return;
      expect(textos(dados).filter((t) => NUMERO_COM_UNIDADE.test(t))).toEqual([]);
    });

    it(`${slug}, sem ficha, não publica case nem caso de uso`, () => {
      if (dados.promessa) return;
      expect(dados.portfolio ?? []).toEqual([]);
      expect(dados.useCases ?? []).toEqual([]);
    });
```

E, fora do `for`, antes do `});` final do `describe`, acrescente:

```ts
  // O n.infraops é atendimento, sustentação técnica e arquitetura; o FinOps
  // saiu do produto em 11/09.
  it('o n.infraops não fala em FinOps', () => {
    expect(textos(solutionsData.infraops).filter((t) => /finops/i.test(t))).toEqual([]);
  });
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npx vitest run src/data/solutionsData.test.ts 2>&1 | grep -E '✓|×|FAIL|Tests '`

Esperado: FAIL em `... sem ficha, não publica número com unidade` para `infraops`, `autoops` e `cirt` (o `devarch` não tem número com unidade, só case sem fonte), em `... sem ficha, não publica case nem caso de uso` para os quatro, e em `o n.infraops não fala em FinOps`. O `secops` passa, porque tem `promessa`.

- [ ] **Passo 3: trocar o ícone do n.autoops**

O cérebro sugere IA, e o n.autoops não é IA. Na linha 1 de `src/data/solutionsData.ts`, troque:

```ts
import { ShieldCheck, Cloud, Cpu, Brain, Gavel } from 'lucide-react';
```

por:

```ts
import { ShieldCheck, Cloud, Cpu, Workflow, Gavel } from 'lucide-react';
```

- [ ] **Passo 4: reescrever os quatro blocos**

Substitua o bloco `"infraops": { ... },` inteiro (de `"infraops": {` até o `},` que fecha antes de `"devarch": {`) por:

```ts
  "infraops": {
    icon: Cloud,
    metaTitle: "n.infraops — atendimento, sustentação técnica e arquitetura de infraestrutura",
    metaDescription: "Atendimento a quem usa, sustentação técnica do ambiente e arquitetura de infraestrutura on-premises, em nuvem ou híbrida.",
    overview: "Cuidamos da sua infraestrutura em três frentes: o atendimento a quem usa, a sustentação técnica que mantém o ambiente de pé e a arquitetura que desenha e evolui o ambiente, on-premises, em nuvem ou híbrido.",
    workflow: [
      { step: "01", name: "o pedido ou o alerta", desc: "Um usuário pede ou o monitoramento avisa. Tudo vira registro." },
      { step: "02", name: "quem cuida", desc: "O atendimento resolve o que é de uso; a sustentação, o que é do ambiente; a arquitetura, o que pede mudança de desenho." },
      { step: "03", name: "o que você recebe", desc: "A solução documentada e, quando o ambiente muda, a mudança registrada com o plano de volta." }
    ],
    services: [
      { name: "atendimento", desc: "Suporte a quem usa, em níveis, com registro de cada chamado e a solução documentada para o que se repete." },
      { name: "sustentação técnica", desc: "Operação, manutenção, correção e aplicação de patch do ambiente, com cada mudança registrada e o plano de volta." },
      { name: "arquitetura de infraestrutura", desc: "Desenho e evolução do ambiente on-premises, em nuvem ou híbrido, incluindo backup e recuperação." }
    ],
    ctaLabel: "agendar diagnóstico",
    onboarding: [
      { step: "01", title: "diagnóstico", desc: "Mapeamos o ambiente, os ativos e o atendimento que você já tem." },
      { step: "02", title: "montagem", desc: "Organizamos o registro de chamados e de mudanças e o inventário dos ativos." },
      { step: "03", title: "shadowing", desc: "Nosso time acompanha o seu, aprende a rotina e documenta os runbooks da sua TI." },
      { step: "04", title: "go-live", desc: "Entramos como apoio ao seu time até assumirmos a frente, com o mesmo registro." }
    ],
    technicalFeatures: [],
  },
```

Substitua o bloco `"devarch": { ... },` inteiro por:

```ts
  "devarch": {
    icon: Cpu,
    metaTitle: "n.devarch — célula de desenvolvimento, arquitetura e segurança de software",
    metaDescription: "Um time dedicado ao seu produto, com foco em arquitetura, segurança ao longo do ciclo de vida do desenvolvimento e testes.",
    overview: "Segurança que entra no fim do ciclo vira retrabalho. Montamos uma célula dedicada ao seu produto, que junta desenvolvimento, arquitetura e segurança de software: o desenho é revisado antes do código, o código passa por revisão e análise de segurança, e nada chega à produção sem teste.",
    workflow: [
      { step: "01", name: "arquitetura", desc: "O desenho é revisado e as ameaças são modeladas antes do código." },
      { step: "02", name: "código", desc: "Revisão e análise de segurança do código e das dependências a cada mudança." },
      { step: "03", name: "testes", desc: "Testes automatizados e de segurança antes da homologação e da produção." }
    ],
    services: [
      { name: "arquitetura de software", desc: "Revisão da arquitetura que existe e desenho do que vem, com modelagem de ameaças." },
      { name: "segurança no ciclo de desenvolvimento", desc: "Análise do código e das dependências na esteira de entrega, e o inventário dos componentes do software." },
      { name: "testes", desc: "Testes automatizados e de segurança, de aplicação e de API, antes de cada entrega." }
    ],
    ctaLabel: "solicitar revisão de arquitetura",
    onboarding: [
      { step: "01", title: "revisão", desc: "Sessões de arquitetura para definir aonde o seu software precisa chegar." },
      { step: "02", title: "ciclo seguro", desc: "As regras de segurança entram nos repositórios e na esteira de entrega." },
      { step: "03", title: "esteira", desc: "A esteira do seu time passa a rodar as verificações a cada mudança." },
      { step: "04", title: "passagem", desc: "Treinamento e documentação para o seu time assumir a rotina." }
    ],
    technicalFeatures: [],
  },
```

Substitua o bloco `"autoops": { ... },` inteiro por:

```ts
  "autoops": {
    icon: Workflow,
    metaTitle: "n.autoops — gestão de automações",
    metaDescription: "Construir robô virou commodity. Governamos, sustentamos, protegemos e medimos o retorno da sua frota de automações, e o código e a documentação são seus desde o primeiro dia.",
    overview: "Construir robô virou commodity; o difícil é governar, sustentar, proteger e provar o retorno. Cuidamos da sua frota de automações inteira: acompanhamos cada execução, corrigimos quando uma tela ou uma credencial muda, guardamos as credenciais fora do código e mostramos a economia líquida de cada automação.",
    workflow: [
      { step: "01", name: "mapear", desc: "Os processos com mais atrito, documentados como são hoje e como devem ficar." },
      { step: "02", name: "automatizar", desc: "Cada automação com o tratamento de exceção desenhado e as credenciais num cofre, fora do código." },
      { step: "03", name: "sustentar e medir", desc: "Cada execução acompanhada, a correção quando algo muda e a economia líquida de cada automação." }
    ],
    services: [
      { name: "cockpit da frota", desc: "O que rodou, quanto tempo levou, onde falhou e o que está parado, em todas as automações." },
      { name: "economia líquida", desc: "Horas poupadas vezes o custo da hora, menos o custo da automação: a conta de cada robô." },
      { name: "trilha de auditoria", desc: "Cada execução registrada, com o hash dos arquivos processados." },
      { name: "credenciais protegidas", desc: "Segredos fora do código, entregues só na hora da execução, com o menor privilégio." }
    ],
    ctaLabel: "conversar sobre a sua frota de automações",
  },
```

Substitua o bloco `"cirt": { ... }` inteiro (é o último do objeto; mantenha o `};` que fecha `solutionsData`) por:

```ts
  "cirt": {
    icon: Gavel,
    metaTitle: "n.cirt — resposta a incidentes: comando da crise, contenção, perícia e comunicação",
    metaDescription: "Assumimos o comando da crise cibernética e coordenamos contenção, perícia, retomada e comunicação, com o comitê acompanhando cada decisão registrada.",
    overview: "Num incidente grave, o colapso costuma vir da descoordenação: provas perdidas na pressa de restaurar, ambiente contaminado de volta ao ar, comitê decidindo por boato. Assumimos o comando da crise e organizamos cinco frentes sob um comandante: perícia e custódia, resposta tática, reestruturação, comunicação e jurídico e regulatório. O comitê acompanha no cockpit, e cada decisão fica registrada.",
    workflow: [
      { step: "01", name: "sala de crise", desc: "O comando é assumido, os papéis são distribuídos e o comitê passa a acompanhar no cockpit." },
      { step: "02", name: "contenção", desc: "A contenção é coordenada com o seu time e os seus fornecedores, preservando a evidência antes de reiniciar." },
      { step: "03", name: "retomada e perícia", desc: "Cópias verificadas antes de restaurar, liberação em fases e a perícia com cadeia de custódia." }
    ],
    services: [
      { name: "comando do incidente", desc: "Assumimos o comando: distribuímos os papéis, coordenamos o seu time e os seus fornecedores e respondemos ao comitê." },
      { name: "prontidão contratada", desc: "Um time contratado antes da crise, que entra na primeira confirmação do incidente." },
      { name: "perícia e retomada", desc: "Evidência preservada antes de restaurar, cópias verificadas e retomada em fases." }
    ],
    ctaLabel: "falar com o time de resposta",
    onboarding: [
      { step: "01", title: "roteiros", desc: "Os ritos e as decisões de crise desenhados para os seus times e diretores." },
      { step: "02", title: "prontidão", desc: "O mapa do que cada fornecedor faz quando o incidente começa." },
      { step: "03", title: "em espera", desc: "O contrato fica ativo, com o comando pronto para entrar." },
      { step: "04", title: "acionamento", desc: "Crise confirmada: o comando assume e o comitê é chamado." }
    ],
  }
```

- [ ] **Passo 5: rodar e ver passar**

Rode: `npx vitest run src/data/solutionsData.test.ts 2>&1 | tail -4`

Esperado: todos os testes passam.

- [ ] **Passo 6: conferir tipos e o e2e que depende do título do n.cirt**

Rode: `npx tsc --noEmit; echo tsc-exit=$?`

Esperado: `tsc-exit=0`. O smoke e2e espera `/n\.cirt — resposta a incidentes/` no título de `/solucoes/cirt` (`tests/site/smoke.spec.ts:23`), e o `metaTitle` novo mantém esse começo.

- [ ] **Passo 7: commit**

```powershell
git add src/data/solutionsData.ts src/data/solutionsData.test.ts
git commit -m "fix(solucoes): os quatro produtos antigos sem alegação sem fonte" -m "n.infraops, n.devarch, n.autoops e n.cirt passam a ser descritos pelo que são (atendimento, sustentação e arquitetura; célula de desenvolvimento, arquitetura e segurança; gestão de automações; comando da crise) e perdem prazos, ganhos, valores, cases sem fonte, agentes de IA e o FinOps do n.infraops. O teste de dados reprova número com unidade, case e caso de uso em produto que ainda não tem ficha validada." -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Tarefa 3: os textos dos produtos nos três idiomas

O mapa de soluções e as páginas usam `solutions.<produto>.fullTitle`, `desc`, `longDesc` e `cta` do i18n. O n.infraops fala em "IA aplicada que atua como copiloto", o n.autoops em "agentes de IA" e "copilotos", e o n.devarch em "escala extrema" e "vantagem competitiva". O botão do n.autoops já foi corrigido no PR #44; **não mexa nele**.

**Arquivos:**
- Modificar: `src/utils/integridade.test.ts`
- Modificar: `src/i18n.ts` (bloco `solutions`, chaves `infraops`, `devarch` e `autoops`)
- Modificar: `src/locales/en.json`, `src/locales/es.json` (as mesmas chaves)

**Interfaces:**
- Consome: a função `ofensores(padrao)` de `integridade.test.ts`.

- [ ] **Passo 1: escrever o teste que falha**

Em `src/utils/integridade.test.ts`, antes do teste `nenhum codinome interno de projeto`, acrescente:

```ts
  // Nenhum produto é vendido como agente ou copiloto: no n.secops e no ness.OS
  // o ator automatizado é o AIOps, e o n.autoops é gestão de automações, sem IA
  // (PRODUCT.md, 11/09).
  it('nenhum produto vendido como agente de IA ou copiloto', () => {
    expect(ofensores(/agentes (de IA|de intelig|autônomos|neuro)|AI agents?|co-?pilot|copiloto/i)).toEqual([]);
  });
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npx vitest run src/utils/integridade.test.ts 2>&1 | grep -E 'Received|\+   |Tests '`

Esperado: FAIL, com `../i18n.ts`, `../locales/en.json` e `../locales/es.json` entre os ofensores. `solutionsData.ts` já não aparece, por causa da Tarefa 2.

- [ ] **Passo 3: trocar os textos em português (`src/i18n.ts`)**

Faça cada troca exatamente. Cada texto de origem aparece uma única vez no arquivo.

| De | Para |
|---|---|
| `"fullTitle": "infraestrutura inteligente & suporte global",` | `"fullTitle": "atendimento, sustentação técnica e arquitetura de infraestrutura",` |
| `"desc": "Infraestrutura e cloud: service desk, ITIL, backup e recuperação.",` | `"desc": "Atendimento, sustentação técnica e arquitetura de infraestrutura, on-premises, em nuvem ou híbrida.",` |
| `"longDesc": "o n.infraops redefine o suporte técnico tradicional. unimos a robustez do framework ITIL à agilidade de um sistema de IA aplicada que atua como copiloto das nossas operações.",` | `"longDesc": "cuidamos da sua infraestrutura em três frentes: o atendimento a quem usa, a sustentação técnica que mantém o ambiente de pé e a arquitetura que o desenha e evolui.",` |
| `"fullTitle": "arquitetura orientada ao desenvolvedor & escala segura",` | `"fullTitle": "desenvolvimento, arquitetura e segurança de software",` |
| `"desc": "Engenharia e arquitetura de software, com segurança desde o código.",` | `"desc": "Uma célula de desenvolvimento, arquitetura e segurança de software.",` |
| `"longDesc": "no n.devarch, transformamos o desenvolvimento em uma vantagem competitiva. criamos nossas próprias soluções e capacitamos empresas a alcançarem escala extrema.",` | `"longDesc": "uma célula dedicada ao seu produto, com foco em arquitetura, segurança ao longo do ciclo de vida do desenvolvimento e testes.",` |
| `"cta": "escalar meu desenvolvimento"` | `"cta": "solicitar revisão de arquitetura"` |
| `"fullTitle": "eficiência operacional & automação estratégica",` | `"fullTitle": "gestão de automações: governar, sustentar e provar o retorno",` |
| `"desc": "Automação de processos e operações com agentes de IA.",` | `"desc": "Gestão da sua frota de automações: governança, sustentação, segurança e retorno medido.",` |
| `"longDesc": "o n.autoops é o braço de inteligência da ness. que coloca sua empresa à frente da concorrência. desenvolvemos assistentes personalizados (copilotos) que assumem tarefas repetitivas.",` | `"longDesc": "construir robô virou commodity. cuidamos da sua frota de automações inteira: governamos, sustentamos, protegemos e medimos o retorno de cada automação.",` |

- [ ] **Passo 4: trocar os textos em inglês (`src/locales/en.json`)**

| De | Para |
|---|---|
| `"fullTitle": "intelligent infrastructure & global support",` | `"fullTitle": "user support, technical sustainment and infrastructure architecture",` |
| `"desc": "Infrastructure and cloud: service desk, ITIL, backup and recovery.",` | `"desc": "User support, technical sustainment and infrastructure architecture, on-premises, cloud or hybrid.",` |
| `"longDesc": "n.infraops redefines traditional technical support. we combine the robustness of the ITIL framework with the agility of an applied AI system that acts as a co-pilot for our operations.",` | `"longDesc": "we look after your infrastructure on three fronts: support for the people who use it, the technical sustainment that keeps it running, and the architecture that designs and evolves it.",` |
| `"fullTitle": "developer-oriented architecture & secure scale",` | `"fullTitle": "software development, architecture and security",` |
| `"desc": "Software engineering and architecture, secure from the code up.",` | `"desc": "A software development, architecture and security cell.",` |
| `"longDesc": "at n.devarch, we transform development into a competitive advantage. we create our own solutions and empower companies to achieve extreme scale.",` | `"longDesc": "a cell dedicated to your product, focused on architecture, security across the development lifecycle, and testing.",` |
| `"cta": "scale my development"` | `"cta": "request an architecture review"` |
| `"fullTitle": "operational efficiency & strategic automation",` | `"fullTitle": "automation management: govern, sustain and prove the return",` |
| `"desc": "Process and operations automation with AI agents.",` | `"desc": "Management of your automation fleet: governance, sustainment, security and measured return.",` |
| `"longDesc": "n.autoops is the intelligence arm of ness. that puts your company ahead of the competition. we develop personalized assistants (co-pilots) that take over repetitive tasks.",` | `"longDesc": "building bots has become a commodity. we look after your whole automation fleet: we govern, sustain, protect and measure the return of every automation.",` |

- [ ] **Passo 5: trocar os textos em espanhol (`src/locales/es.json`)**

| De | Para |
|---|---|
| `"fullTitle": "infraestructura inteligente & soporte global",` | `"fullTitle": "atención, sostenimiento técnico y arquitectura de infraestructura",` |
| `"desc": "Infraestructura y cloud: service desk, ITIL, backup y recuperación.",` | `"desc": "Atención, sostenimiento técnico y arquitectura de infraestructura, on-premises, en la nube o híbrida.",` |
| `"longDesc": "n.infraops redefine el soporte técnico tradicional. combinamos la robustez del marco ITIL con la agilidad de un sistema de IA aplicada que actúa como copiloto de nuestras operaciones.",` | `"longDesc": "cuidamos de su infraestructura en tres frentes: la atención a quien la usa, el sostenimiento técnico que la mantiene en pie y la arquitectura que la diseña y la hace evolucionar.",` |
| `"fullTitle": "arquitectura orientada al desarrollador & escala segura",` | `"fullTitle": "desarrollo, arquitectura y seguridad de software",` |
| `"desc": "Ingeniería y arquitectura de software, con seguridad desde el código.",` | `"desc": "Una célula de desarrollo, arquitectura y seguridad de software.",` |
| `"longDesc": "en n.devarch, transformamos el desarrollo en una ventaja competitiva. creamos nuestras propias soluciones y capacitamos a las empresas para alcanzar una escala extrema.",` | `"longDesc": "una célula dedicada a su producto, con foco en arquitectura, seguridad a lo largo del ciclo de vida del desarrollo y pruebas.",` |
| `"cta": "escalar mi desarrollo"` | `"cta": "solicitar una revisión de arquitectura"` |
| `"fullTitle": "eficiencia operativa & automatización estratégica",` | `"fullTitle": "gestión de automatizaciones: gobernar, sostener y probar el retorno",` |
| `"desc": "Automatización de procesos y operaciones con agentes de IA.",` | `"desc": "Gestión de su flota de automatizaciones: gobierno, sostenimiento, seguridad y retorno medido.",` |
| `"longDesc": "n.autoops es el brazo de inteligencia de ness. que pone a su empresa por delante de la competencia. desarrollamos asistentes personalizados (copilotos) que se encargan de tareas repetitivas.",` | `"longDesc": "construir robots se volvió commodity. cuidamos de toda su flota de automatizaciones: la gobernamos, la sostenemos, la protegemos y medimos el retorno de cada automatización.",` |

- [ ] **Passo 6: rodar e ver passar**

Rode: `npx vitest run src/utils/integridade.test.ts 2>&1 | tail -4`

Esperado: todos os testes passam.

- [ ] **Passo 7: conferir o JSON e as marcas nas telas testadas**

Rode: `node -e "JSON.parse(require('fs').readFileSync('src/locales/en.json','utf8')); JSON.parse(require('fs').readFileSync('src/locales/es.json','utf8')); console.log('json ok')"`

Esperado: `json ok`. Os textos novos de `desc` não citam marca, então o e2e `nenhuma marca aparece como texto comum nas telas`, que passa por `/solucoes`, continua passando.

- [ ] **Passo 8: commit**

```powershell
git add src/utils/integridade.test.ts src/i18n.ts src/locales/en.json src/locales/es.json
git commit -m "fix(i18n): n.infraops, n.devarch e n.autoops descritos pelo que são" -m "Saem o copiloto do n.infraops, os agentes de IA e os copilotos do n.autoops e a escala extrema do n.devarch, em pt, en e es. O teste de integridade reprova produto vendido como agente de IA ou copiloto em qualquer arquivo de src/." -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Tarefa 4: `PRODUCT.md`, a pesquisa de métricas e os documentos sem codinome

O `PRODUCT.md` é a régua que o impeccable lê em todo comando. Hoje ele descreve "três marcas" com cinco produtos, cita o FinOps no n.infraops, reserva "agentes de IA" ao n.autoops e manda o visual para os `docs/DESIGN*.md` antigos. As decisões de 11/09 estão na especificação. E o `README.md` e cinco documentos de `docs/` ainda citam o nome antigo da assistente do chat, que é codinome.

**Arquivos:**
- Modificar: `src/utils/integridade.test.ts` (a varredura de codinome passa a cobrir os `.md` da raiz e de `docs/`)
- Modificar (reescrever): `PRODUCT.md`
- Modificar: `docs/PESQUISA-metricas.md`
- Modificar: `README.md`, `docs/DESIGN.md`, `docs/PLAN-epics-roadmap.md`, `docs/archive/PLAN-go-live-backlog.md`, `docs/archive/PLAN-setup-ui-audit.md`, `docs/archive/PROXIMOS-PASSOS.md`

- [ ] **Passo 1: estender a varredura de codinome aos documentos**

Os documentos não entram nos outros testes de integridade: `PESQUISA-metricas.md` cita "100%" de propósito, para registrar o que foi vetado. Em `src/utils/integridade.test.ts`, depois da constante `arquivos`, acrescente:

```ts
/**
 * Os documentos entram só na varredura de codinome: PESQUISA-metricas.md cita
 * "100%" de propósito, para registrar o que foi vetado, e reprovaria os outros
 * testes sem estar errado.
 */
const documentos = import.meta.glob(['../../*.md', '../../docs/**/*.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;
```

E, no teste `nenhum codinome interno de projeto`, troque:

```ts
    const achados = Object.entries(arquivos)
```

por:

```ts
    const achados = Object.entries({ ...arquivos, ...documentos })
```

- [ ] **Passo 2: rodar e ver falhar**

Rode: `npx vitest run src/utils/integridade.test.ts 2>&1 | grep -E 'Received|\+   |Tests '`

Esperado: FAIL em `nenhum codinome interno de projeto`, com estes seis ofensores: `../../README.md`, `../../docs/DESIGN.md`, `../../docs/PLAN-epics-roadmap.md`, `../../docs/archive/PLAN-go-live-backlog.md`, `../../docs/archive/PLAN-setup-ui-audit.md` e `../../docs/archive/PROXIMOS-PASSOS.md`. Todos citam o nome antigo da assistente do chat, com o sufixo de sistema operacional, que é codinome. O Ricardo decidiu em 11/09 que ele vira só "Gabi".

- [ ] **Passo 3: trocar o nome antigo da assistente por "Gabi" nos documentos**

No PowerShell, em `W:\home\resper\ness-site2026`. O nome antigo é montado de trás para frente para não ficar escrito neste plano:

```powershell
$velho = -join ('SO.ibaG'[-1..-7])
$arqs = 'README.md','docs\DESIGN.md','docs\PLAN-epics-roadmap.md','docs\archive\PLAN-go-live-backlog.md','docs\archive\PLAN-setup-ui-audit.md','docs\archive\PROXIMOS-PASSOS.md'
foreach ($a in $arqs) {
  $p = (Resolve-Path $a).Path
  $c = [IO.File]::ReadAllText($p)
  $n = ([regex]::Matches($c, [regex]::Escape($velho), 'IgnoreCase')).Count
  [IO.File]::WriteAllText($p, [regex]::Replace($c, [regex]::Escape($velho), 'Gabi', 'IgnoreCase'), [Text.UTF8Encoding]::new($false))
  "$a : $n"
}
```

Esperado: `README.md : 2`, `docs\DESIGN.md : 1`, `docs\PLAN-epics-roadmap.md : 2`, `docs\archive\PLAN-go-live-backlog.md : 1`, `docs\archive\PLAN-setup-ui-audit.md : 3` e `docs\archive\PROXIMOS-PASSOS.md : 2` (11 no total).

- [ ] **Passo 4: rodar e ver passar**

Rode: `npx vitest run src/utils/integridade.test.ts 2>&1 | tail -4`

Esperado: todos passam.
- [ ] **Passo 5: reescrever o `PRODUCT.md`**

Substitua o conteúdo inteiro de `PRODUCT.md` por:

```markdown
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Leitor principal: CISO ou CTO comparando fornecedores.** Já sabe o que é um
SOC, está avaliando duas ou três opções e lê o site como prova, não como
apresentação. Desconta superlativo, número sem fonte e mock de painel — e,
quando reconhece um, desconta o resto da página junto.

O mesmo leitor atravessa as três empresas, com a pergunta que cada uma responde:

| Empresa | Domínio | O que o leitor quer saber |
|---|---|---|
| **ness.** | ness.com.br | Como vocês operam, até onde vai a responsabilidade e o que chega na minha mesa |
| **trustness.** | trustness.com.br | Como vocês me levam à conformidade, com as normas e com as leis de privacidade, e como a auditoria anda |
| **forense.io** | forense.io | Como a evidência é preservada e se o laudo se sustenta |

## Product Purpose

Site de três empresas do mesmo ecossistema — ness., trustness. e forense.io —,
cada uma no seu domínio, com seus serviços e suas plataformas. A ness. é
consultoria boutique de engenharia de software, resiliência cibernética e
operações, desde 1991. O site serve para o leitor chegar a uma conversa
comercial — formulário, chat, assessment, ouvidoria ou reporte de incidente —
já convencido pelo que leu. Todas essas entradas viram lead, com aviso por
e-mail.

Sucesso é o CISO/CTO encontrar, sem pedir reunião, a resposta às perguntas que
faria na reunião.

## Positioning

Duas coisas que um concorrente vizinho não copia com verdade:

1. **A operação publicada.** O site mostra como a operação roda por dentro:
   níveis de severidade, quem é acionado e em que ordem, o que está no escopo
   **e o que não está**, a cadência do que o cliente recebe e o tempo até
   entrar no ar. O número de SLA fica na proposta; o que vai ao ar é o modelo.
   A aposta de que poucos concorrentes publicam isso é hipótese, não
   levantamento de mercado.
2. **Três empresas na mesma casa, com plataformas próprias por baixo.**
   Operar (ness.), conformar (trustness.) e periciar (forense.io), com 35 anos
   de história, e seis plataformas de software sobre as quais os serviços
   rodam.

## Operating Context

- Uma codebase e um Worker na Cloudflare servem os três domínios; a empresa é
  decidida pelo hostname (`src/config/brand.ts`).
- Cada empresa tem uma home institucional — apresenta a empresa e a linha dos
  seus produtos, sem abrir por um produto — e as páginas dos seus produtos. A
  organização por domínio está descrita em
  `docs/superpowers/specs/2026-09-11-site-wow-design.md`.
- Idiomas: pt (padrão), en e es. As páginas de produto estão só em português,
  por isso as rotas `/en` e `/es` delas estão excluídas em `src/routes.ts`.
- O conteúdo das páginas de produto vem de uma ficha validada pelo time que
  opera (`docs/FICHA-runbook-por-produto.md`). Seção sem dado some inteira.
- Merge em `main` publica em produção (`deploy.yml`).

## Capabilities and Constraints

**Portfólio (11/09/2026):**

| Empresa | Serviços | Plataformas |
|---|---|---|
| ness. | n.secops (SOC 24×7, resposta e GRC), n.infraops (atendimento, sustentação técnica e arquitetura de infraestrutura), n.devarch (célula de desenvolvimento, arquitetura e segurança de software), n.autoops (gestão de automações), n.cirt (comando da crise cibernética) | ness.OS (operações de segurança; o n.secops e o n.infraops rodam sobre ele), n.csirt (gestão e resposta a incidentes, com notificação regulatória; o n.cirt fica acima dele), n.pentest (testes de intrusão operados pela ness.), n.training (a página mora na trustness.) |
| trustness. | auditoria e assessment, ISO 27001 e governança, DPO como serviço, testes e vulnerabilidades | n.iso (normas ISO 27001 e 27701), n.privacy (leis LGPD e GDPR; incluído no DPO), n.training (treinamento em segurança e privacidade), n.pentest (a página mora na ness.) |
| forense.io | perícia digital, assistência técnica e contraprova, coleta preventiva | — |

**Terminologia fixa:**

- No n.secops e no ness.OS, o ator automatizado é **AIOps**. "Agentes de IA",
  "agentic" e "copiloto" não aparecem no site: nenhum produto é vendido como
  agente.
- Nome de marca e de produto sempre em minúsculas com o ponto: `ness.`,
  `trustness.`, `forense.io`, `n.secops`. A exceção é **ness.OS**, com "OS" em
  maiúsculo e o ponto azul. Marca no meio de uma frase sai sempre desenhada
  (`src/components/ComMarcas.tsx`), com teste e2e que reprova marca como texto
  comum.
- O assessment de privacidade se chama **"maturidade em privacidade"**, nunca
  só "LGPD".
- Produto se descreve pelo serviço que presta, não pelas ferramentas e
  indicadores do setor (ITIL, CMDB, RPO e RTO, SLO e SLI).

**Restrições:**

- Nenhuma alegação absoluta sem fonte (`100%`, `0 gaps`, `zero downtime`);
  há teste que falha se aparecer uma.
- Nada de telemetria inventada nem mock de painel apresentado como dado real.
  Tela de produto só com dado de exemplo rotulado como exemplo.
- **Codinome de projeto nunca aparece**: nem no texto, nem em chave de i18n,
  identificador, rota, alt, branch, commit ou PR. O teste de integridade
  guarda só o SHA-256 dos codinomes.
- **Documento de cliente não vira conteúdo.** Texto de produto tirado de
  proposta ou relatório de um cliente serve só como descrição genérica: o nome
  do cliente, os achados e os dados do ambiente dele nunca vão para o site.
- **Como um produto é construído** (stack, linguagem, provedor, modelo) não
  aparece no site.
- **Integração só aparece quando já funciona:** hoje, a exportação do
  n.pentest para o DefectDojo.
- Somente Cloudflare, sem nuvem externa; TypeScript sem erros (`npx tsc --noEmit`).
- Texto de tela entra pelo i18n, nos três idiomas (as páginas de produto, só
  em pt nesta rodada).
- A lógica multimarca não pode quebrar: toda mudança em rota ou UI compartilhada
  vale para os três domínios.

## Brand Commitments

- O design system vigente está em `DESIGN.md`, na raiz, gerado do que está no
  ar. A constituição continua em `.specify/memory/constitution.md`;
  `docs/DESIGN.md` e `docs/DESIGN-SYSTEM.md` são anteriores e apontam para o
  `DESIGN.md`.
- Desvios deliberados do guia de marca do ecossistema: Montserrat 500 nos
  títulos (o guia pede 600), produtos grafados com o ponto azul, como
  `n.secops` (o guia pede `nShield`), e rótulos em caixa normal (o guia pede
  caixa alta).
- Tom de voz por marca: ness. técnico, confiante e direto; trustness.
  autoritativo e protetor; forense.io investigativo, preciso e urgente.
- Regras de escrita: frases curtas, voz ativa, dado concreto no lugar de
  adjetivo, sem jargão vazio ("soluções inovadoras") e sem superlativo sem
  prova ("o melhor do mercado").
- Fornecedor que diz o que não faz ganha a confiança do CISO: o escopo
  publica o que está fora dele.

## Evidence on Hand

**Números confirmados em reunião (09/09/2026)** — ver `docs/PESQUISA-metricas.md`:

| Marca | Alegação |
|---|---|
| ness. | 35+ anos · 500+ projetos · 200+ clientes ativos · 99,9% de disponibilidade |
| forense.io | 450+ perícias |
| trustness. | 15+ frameworks |

**Confirmados por Ricardo Esper em 11/09/2026:**

| Onde | Alegação |
|---|---|
| ness. | clientes atendidos em Brasil, Portugal, Chile, Peru, Colômbia e Estados Unidos (com base na carteira de clientes; o texto diz sempre "clientes atendidos", nunca "escritórios") |
| ness.OS | toda ação fica numa trilha de auditoria imutável; não exige infraestrutura local no cliente |
| n.cirt | livro de decisões imutável; opera fora de banda, em infraestrutura independente da rede da empresa |

**Em aberto, não reutilizar:** "laudos aceitos 100%" (forense.io),
"certificações 100%" e "compliance score A+" (trustness.), "100% de
confidencialidade" (portfólio). Nenhum deles tem denominador ou metodologia.

**Referência de conteúdo real:** n.secops, com severidade, escopo,
entregáveis, operação e fecho preenchidos. Os outros produtos têm rascunho a
validar pelo time.

**Ausências que não se inventam:** depoimentos, logos de cliente sem
autorização, números de SLA, preços e certificações sem nome e ano.

## Product Principles

1. **Prova, não apresentação.** Cada seção responde uma pergunta que o
   CISO/CTO faria, na ordem em que ele a faria.
2. **O modelo em público, o número na proposta.** Publicar como a operação
   funciona; compromisso numérico só no contrato.
3. **Sem dado, sem seção.** Título sem nada embaixo é pior do que não ter a
   seção.
4. **A estrutura do conteúdo decide a forma.** Sequência, matriz,
   responsabilidade e cadeia de custódia têm forma própria; não viram o mesmo
   bloco repetido.
5. **Toda alegação tem fonte.** Número novo passa pela ficha em branco de
   `docs/PESQUISA-metricas.md` antes de ir ao ar.

## Accessibility & Inclusion

WCAG AA como piso. Alvo de toque de pelo menos 24 px, foco visível, nenhuma
informação só por cor, `prefers-reduced-motion` respeitado e nenhuma rolagem
lateral no celular (a auditoria das rotas roda em 390 e 1440 px).
```

- [ ] **Passo 6: registrar as fontes em `docs/PESQUISA-metricas.md`**

Logo depois do parágrafo que termina com `mesmo commit da próxima mudança.` (fim da seção "Encerrado — alegações quantificadas"), acrescente:

```markdown

## Encerrado — alegações confirmadas em 11/09/2026

| Onde | Alegação | Fonte | Quem confirma | Revalidar em |
|---|---|---|---|---|
| ness. (home) | clientes atendidos em Brasil, Portugal, Chile, Peru, Colômbia e Estados Unidos | carteira de clientes | Ricardo Esper | 11/09/2027 |
| ness.OS | toda ação fica numa trilha de auditoria imutável | o produto | Ricardo Esper | 11/09/2027 |
| ness.OS | não exige infraestrutura local no cliente | o produto | Ricardo Esper | 11/09/2027 |
| n.cirt | livro de decisões imutável | o produto | Ricardo Esper | 11/09/2027 |
| n.cirt | opera fora de banda, em infraestrutura independente da rede da empresa | o produto | Ricardo Esper | 11/09/2027 |

O texto de presença global diz sempre **"clientes atendidos"**, nunca
"escritórios" nem "operação em".
```

- [ ] **Passo 7: conferir**

Rode: `npx vitest run src/utils/integridade.test.ts 2>&1 | tail -3 && grep -cE 'n[.]privacy|ness[.]OS|maturidade em privacidade' PRODUCT.md && grep -c '11/09/2027' docs/PESQUISA-metricas.md`

Esperado: os testes passam, a primeira contagem (linhas) dá 3 ou mais e a segunda dá `5`.

- [ ] **Passo 8: commit**

```powershell
git add src/utils/integridade.test.ts PRODUCT.md docs/PESQUISA-metricas.md README.md docs/DESIGN.md docs/PLAN-epics-roadmap.md docs/archive/PLAN-go-live-backlog.md docs/archive/PLAN-setup-ui-audit.md docs/archive/PROXIMOS-PASSOS.md
git commit -m "docs(produto): PRODUCT.md com as três empresas e o portfólio de 11/09" -m "A régua que o impeccable lê passa a trazer as três empresas, os serviços e as seis plataformas, a terminologia (AIOps, ness.OS, maturidade em privacidade), as regras de codinome, documento de cliente, construção e integração, e as alegações confirmadas em 11/09, também registradas em PESQUISA-metricas.md. A varredura de codinome passa a cobrir os documentos da raiz e de docs/, que deixam de citar o nome antigo da assistente: agora é só Gabi." -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Tarefa 5: `DESIGN.md` gerado do que está no ar

O impeccable lê o `DESIGN.md` da raiz (e o sidecar `.impeccable/design.json`) em todo comando, e o detector também usa esse arquivo como contexto. Hoje só existe o `docs/DESIGN.md` de 24/04, que ainda cita Manrope e descreve o desenho antigo.

**Arquivos:**
- Criar: `DESIGN.md`, `.impeccable/design.json` (gerados pelo impeccable)
- Modificar: `docs/DESIGN.md:1`, `docs/DESIGN-SYSTEM.md:1`

- [ ] **Passo 1: gerar o `DESIGN.md`**

Invoque a skill `impeccable` com o argumento `document` (em sessão: `/impeccable document`). Informe como fonte o código atual e o que está no ar (as abertas `src/components/Abertura.tsx`, os diagramas em `src/components/solutions/`, as homes em `src/pages/Home.tsx`, `src/pages/trustness/Home.tsx` e `src/pages/forense/Home.tsx`, e os tokens de `src/index.css`), e peça que o documento registre, no mínimo:
- escala: abertura a 56 px na home da ness. e 48 px nas outras telas, seções a 24 px, botões de 44 px;
- tipografia: Montserrat 500 em títulos e marcas (sem 600), Inter no corpo;
- linhas de 1 px, preenchimento de 4 a 8 % ou nenhum, marcadores de 8 px;
- marcadores por ator: AIOps em círculo cheio `#00ade8`, time de segurança em anel `#7bd0ff`, você em círculo cheio `#dae2fd`;
- foto de fundo da marca com véu em degradê e brilho central nas aberturas;
- os três desvios deliberados do guia do ecossistema e a exceção de grafia **ness.OS**.

- [ ] **Passo 2: conferir o que foi gerado**

Rode: `test -f DESIGN.md && test -f .impeccable/design.json && grep -c 'Montserrat' DESIGN.md && grep -c '#00ade8' DESIGN.md && grep -c 'ness.OS' DESIGN.md`

Esperado: os dois arquivos existem e as três contagens são 1 ou mais. Se faltar algum dos itens do Passo 1, edite o `DESIGN.md` à mão para incluí-lo, no mesmo formato do documento.

- [ ] **Passo 3: apontar os documentos antigos para o novo**

Em `docs/DESIGN.md`, logo abaixo da primeira linha (`# DESIGN.md — ness. Design System`), acrescente:

```markdown

> **Documento anterior (24/04/2026), mantido como histórico.** O design system
> vigente está em [`DESIGN.md`](../DESIGN.md), na raiz, gerado do que está no
> ar. Onde os dois divergirem, vale o da raiz.
```

Em `docs/DESIGN-SYSTEM.md`, logo abaixo da primeira linha (`# DESIGN-SYSTEM.md — ness. Universal Design System`), acrescente o mesmo aviso.

- [ ] **Passo 4: o detector continua passando, agora com o `DESIGN.md` como contexto, e a guarda de codinome cobre o arquivo novo**

Rode: `npx --yes impeccable@4.1.0 detect src; echo exit=$? && npx vitest run src/utils/integridade.test.ts 2>&1 | tail -3`

Esperado: `exit=0` e os testes passam. Se o detector passar a acusar algo por causa do `DESIGN.md`, corrija o `DESIGN.md` (ele deve descrever o que está no ar), não o código.

- [ ] **Passo 5: commit**

```powershell
git add DESIGN.md .impeccable/design.json docs/DESIGN.md docs/DESIGN-SYSTEM.md
git commit -m "docs(design): DESIGN.md do desenho delicado, gerado do que está no ar" -m "O impeccable passa a ler o design vigente: escala das aberturas, Montserrat 500 com Inter no corpo, filetes de 1 px, marcadores por ator, a foto de fundo das aberturas, os desvios deliberados do guia do ecossistema e a grafia ness.OS. Os DESIGN antigos em docs/ ficam como histórico e apontam para ele." -m "Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Tarefa 6: verificação final e PR

- [ ] **Passo 1: tudo verde localmente**

Rode: `npm test 2>&1 | tail -4 && npx tsc --noEmit && echo tsc-ok && npx --yes impeccable@4.1.0 detect src && echo detector-ok`

Esperado: testes passando, `tsc-ok` e `detector-ok`.

- [ ] **Passo 2: nenhuma alegação vetada sobrou nas páginas antigas**

Rode: `grep -nE 'uptime garantido|MTTR|15 [Mm]inutos|30[.]000|FinOps|copiloto|agentes de IA' src/data/solutionsData.ts src/i18n.ts src/locales/en.json src/locales/es.json; echo fim`

Esperado: só a linha `fim`.

- [ ] **Passo 3: publicar a branch e abrir o PR**

```powershell
git push -u origin chore/fundacao
```

Grave o corpo do PR em `.git/PR_BODY_FUNDACAO.md` (dentro de `.git`, fora do versionamento), com este conteúdo:

```markdown
## O que muda

- A especificação do redesenho (`docs/superpowers/specs/2026-09-11-site-wow-design.md`) e o plano desta frente (`docs/superpowers/plans/2026-09-11-frente-1-fundacao.md`).
- **CI:** o preview passa a rodar os testes unitários e o detector do impeccable. As duas fontes da marca entram como exceção da regra de fonte, uma por valor.
- **Produtos antigos:** n.infraops, n.devarch, n.autoops e n.cirt descritos pelo que são, sem prazo, ganho, valor ou case sem fonte, e sem agentes de IA nem copilotos, em pt, en e es.
- **`PRODUCT.md`** com as três empresas, o portfólio e as regras de 11/09, e as fontes registradas em `docs/PESQUISA-metricas.md`.
- **Documentos sem codinome:** o `README.md` e os documentos de `docs/` deixam de citar codinomes.
- **`DESIGN.md`** gerado do que está no ar; os documentos de design antigos apontam para ele.

## Fora deste PR

- O portão de desempenho em duas faixas, que entra na frente 2 com a primeira rota migrada.
- O `canal/` (sistema interno).

## Verificação

- vitest, tsc e detector do impeccable sem erros.
- e2e e Lighthouse rodam contra o preview deste PR.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

Depois abra o PR:

```powershell
gh pr create --base main --head chore/fundacao --title "chore: fundação do redesenho" --body-file .git/PR_BODY_FUNDACAO.md
```

Confira que nem o título, nem o corpo, nem os commits citam codinome.
- [ ] **Passo 4: acompanhar a CI do preview**

Rode `gh pr checks chore/fundacao --watch --interval 30` (no PowerShell). Esperado: o job "Publicar preview e validar" verde, agora passando por "Testes unitários" e "Detector do impeccable". O merge é do Ricardo.

---

## Fora deste plano

- **Portão de desempenho em duas faixas no `lighthouserc.json`** (especificação, seção 8, item 3). Ele passa para a **frente 2**, junto com a primeira rota migrada. Na frente 1 não há rota migrada, e a faixa que reprova ficaria vazia. Um limite de erro sobre o carregamento atual (3,6–5,8 s no celular, com variação entre execuções) faria a CI falhar ao acaso.
- O `canal/` (sistema interno), onde ainda aparece um codinome: decisão do Ricardo.
- As fichas tipadas por empresa, as rotas por domínio e os 301 (frente 4), as homes (frente 5) e os momentos (frente 6).
