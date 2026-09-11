# Redesenho do ecossistema: a operação vista por dentro

**Data:** 11/09/2026 · **Status:** aprovado em conversa, aguardando revisão
escrita · **Decisor:** Ricardo Esper

## 1. Objetivo

Dar ao site dos três domínios o efeito que o Ricardo pediu ("um website
*wow*") sem trair o leitor que o `PRODUCT.md` define: o CISO ou CTO que
compara fornecedores e desconta a página inteira quando reconhece um efeito
vazio, um número sem fonte ou um painel de mentira.

Para esse leitor, o impacto é **ver a operação funcionando por dentro**, e
entender, sem pedir reunião, quem age, em que ordem, o que está no escopo e o
que chega à mesa dele. Cada página de produto ganha **um momento marcante**
que o leitor conduz; o resto da página fica quieto.

Ponto de partida, medido em produção:

- Auditoria de 10/09: **11/20**. Desenho delicado aprovado; problemas no
  rodapé global e nas telas antigas (corrigidos em parte no PR #43).
- Lighthouse de 11/09, 19 URLs: celular com **LCP de 4,7 s** (meta: 2,5 s),
  desktop com 1,3 s. O gargalo é o JavaScript: 41 scripts em prioridade alta
  e 302 KiB disputam a banda com as fontes e a foto do hero; o bloqueio de
  thread é zero.

## 2. Decisões

| # | Decisão | Alternativas descartadas |
|---|---|---|
| D1 | O *wow* é para o **CISO/CTO avaliando**: prova, não espetáculo | reunião/pitch; percepção de marca |
| D2 | **O desenho delicado é a base** e é estendido | abrir direções visuais novas |
| D3 | Nos momentos, **o leitor conduz**: escolhe e a página responde | animação que ele assiste; narrativa por rolagem |
| D4 | **Toda a área visível** dos três domínios entra, e todos os produtos | só o n.secops |
| D5 | Fichas dos produtos sem conteúdo: **rascunhadas a partir do texto atual e validadas pelo time** que opera | esperar as fichas; transcrever com o Ricardo |
| D6 | **Desempenho é portão em toda entrega**: 2,5 s no celular | orçamento sem frente própria; otimizar no fim |
| D7 | **Só pt** nesta rodada para produtos e fichas; o global segue em pt, en e es | três idiomas já; pt + en |
| D8 | A home da ness. é **institucional**: apresenta as verticais, não o produto | operação na primeira tela; entrada por situação |
| D9 | A linha das verticais da ness. é **por tempo** | por papel (operar/conformar/periciar) |
| D10 | **Presença global** em **faixa discreta** na primeira tela, só na home da ness. | seção própria com mapa |
| D11 | **trustness. e forense.io são empresas** com produtos próprios; suas homes seguem a dinâmica da home da ness. | sub-páginas da ness. |
| D12 | Páginas comuns **por empresa onde o conteúdo muda** (sobre, contato, portfólio, assessment); do grupo onde não muda (carreiras, blog, compliance, brandbook) | todas por empresa; todas do grupo |
| D13 | **Arquitetura B**: páginas de conteúdo **sem JavaScript**, momentos em HTML e CSS nativos | enxugar o pacote mantendo a hidratação (fica como contingência); React Server Components (experimental) |
| D14 | Os dois assessments online moram na **trustness.**; o de privacidade se chama **"maturidade em privacidade"** | nos três domínios; "maturidade LGPD" |
| D15 | **Seis plataformas** de software ao lado dos serviços: ness.OS e n.csirt na ness., n.iso e n.privacy na trustness., e duas nas duas empresas, n.training (página na trustness.) e n.pentest (página na ness.). Os serviços que rodam sobre elas as citam | — |

## 3. Arquitetura de informação

### 3.1 As três empresas e os portfólios

| Empresa | Domínio | Produtos (slug) |
|---|---|---|
| **ness.** | ness.com.br | n.secops (`secops`), n.infraops (`infraops`), n.devarch (`devarch`), n.autoops (`autoops`), n.cirt (`cirt`); plataformas: **ness.OS** (`ness-os`), **n.csirt** (`n-csirt`), **n.pentest** (`n-pentest`) e **n.training** (página na trustness.) |
| **trustness.** | trustness.com.br | auditoria e assessment (`auditoria`), ISO 27001 e governança (`iso-27001`), DPO como serviço (`dpo`), testes e vulnerabilidades (`testes`); plataformas: **n.iso** (`n-iso`), **n.privacy** (`n-privacy`), **n.training** (`n-training`) e **n.pentest** (página na ness.) |
| **forense.io** | forense.io | perícia digital (`pericia`), assistência técnica e contraprova (`contraprova`), coleta preventiva (`coleta-preventiva`) |

- **n.cirt é produto da ness., não vertical.**
- **n.infraops são três serviços:** atendimento (o suporte a quem usa),
  sustentação técnica (manter o ambiente de pé: operação, manutenção, correção e
  patch, que correm no ness.OS) e arquitetura de infraestrutura (desenhar e
  evoluir o ambiente on-premises, em nuvem ou híbrido). O FinOps sai do título
  e da descrição.
- **n.devarch é uma célula** de desenvolvimento, arquitetura e segurança de
  software: um time dedicado ao cliente, com foco em arquitetura, segurança ao
  longo do ciclo de vida do desenvolvimento e testes.
- **ness.OS** é a plataforma própria de operações de segurança da ness., usada
  pelo cliente e pelo time, que une infraestrutura e segurança numa esteira só,
  em três camadas:
  1. **ingestão e triagem 24×7:** telemetria de firewalls, identidades em
     nuvem, estações, servidores e EDR, normalizada e correlacionada pelo
     AIOps, que agrupa o que é o mesmo incidente e abre o registro com
     contexto;
  2. **ação controlada:** RMM integrado (patch, contenção, bloqueio de
     credencial), só no que o runbook já autoriza;
  3. **decisão humana e governança:** ação de alto impacto espera aprovação
     formal (GMUD) do time e do cliente, e toda ação fica numa trilha de
     auditoria imutável.

  Opera em nuvem, sem infraestrutura local no cliente, com os controles
  mapeados no CIS Controls v8 e na ISO/IEC 27001:2022, e recebe os achados dos
  testes de intrusão do n.pentest para monitorar a superfície corrigida. **O n.secops e o
  n.infraops rodam sobre ele**: é o "portal da operação" que hoje aparece como
  entregável do n.secops. Grafia: **"OS" em maiúsculo**, a única exceção à
  marca em caixa baixa, com o ponto azul.
- "ISO 27001 e governança" inclui implementação, políticas, treinamento,
  assessoria regulatória (BACEN, SUSEP, ANS, ANATEL) e due diligence de
  fornecedores.
- **n.iso** é um SaaS de acompanhamento da implementação da ISO 27001 e da
  27701, usado por terceiros ou pelo time da trustness. com o cliente que quer
  se certificar. A página tem duas entradas: "com a trustness." e "com o seu
  time". O produto "ISO 27001 e governança" cita o n.iso como a ferramenta do
  acompanhamento. O que ele cobre: declaração de aplicabilidade dos 93
  controles do Anexo A da ISO 27001:2022, com a migração da versão de 2013;
  riscos em matriz 5×5 com planos de tratamento e o inventário de ativos
  ligado a vulnerabilidades e ameaças; cofre de evidências com integridade
  conferida por SHA-256 e trilha de auditoria por documento; ROPA, DPIA,
  ações corretivas e preventivas e auditorias; portal de ciência das
  políticas (controle A.6.3); portal do auditor, somente leitura, com
  credencial temporária. **A página não menciona IA, integração por MCP nem
  como o produto é construído.**
- **n.privacy** é a plataforma de adequação às leis de privacidade (LGPD e
  GDPR) incluída no DPO como serviço: ROPA, pedidos de titulares, DPIA,
  incidentes e painéis. Não se confunde com o n.iso, que trata das normas
  ISO 27001 e 27701: o n.iso é certificação por norma, o n.privacy é
  conformidade com a lei.
- **n.csirt** é a plataforma de gestão, triagem e resposta a incidentes para
  SOCs, CSIRTs e operadoras de infraestrutura crítica. O cockpit leva o
  incidente por estágios do ciclo de vida, recebe alertas do SIEM e dos agentes
  do SOC, abre um dos oito runbooks (ransomware, phishing, vazamento, DDoS,
  transbordo para TO/SCADA, malware, defacement, zero-day), gera a cadeia de
  custódia (pacote STIX 2.1, relatório com SHA-256, marcação TLP) e despacha a
  notificação regulatória ao CTIR Gov/GSI (Decreto 10.748/2021), ao
  CARCCiber/ONS (Submódulo 5.13 / RO-CB.BR.01) e à ANPD. **O n.cirt roda sobre
  ele**, que também é vendido a CSIRTs de terceiros. As referências regulatórias
  entram na ficha como "a conferir".
- **n.training** é a plataforma de treinamento corporativo em segurança da
  informação e privacidade. Pertence às duas empresas: a página mora na
  trustness.com.br, onde o serviço "ISO 27001 e governança" (treinamento e
  conscientização) a cita, e a ness. a lista nas suas plataformas com link para
  lá, sem duplicar a página.
- **n.pentest** é a plataforma de testes de intrusão **operada pela ness.**, não
  pelo cliente. O cliente consome os resultados nela ou os exporta para a
  plataforma de gestão de vulnerabilidades que já usa (hoje, o DefectDojo). Os
  achados corrigidos voltam ao ness.OS, que passa a monitorar a superfície
  corrigida. Pertence às duas empresas: a página mora na ness.com.br, e o
  serviço "testes e vulnerabilidades" da trustness. roda sobre ele e aponta
  para lá.
- Os demais produtos da trustness. e da forense.io têm **nomes descritivos**.

### 3.2 Endereços

- Um formato só nos três domínios: **`/solucoes/:slug`**. A rota tem um
  guarda: produto de outra empresa responde **404 de verdade**. O guarda
  substitui o `routes/somente-ness.tsx`.
- `/solucoes` em cada domínio mostra o mapa só dos produtos daquela empresa.
- `/assessment/:type` passa a existir só na trustness.
- en e es das páginas de produto continuam fora até as fichas serem
  validadas e traduzidas.

### 3.3 Redirecionamentos 301

Feitos no Worker (`workers/app.ts`) antes de qualquer render, no mesmo mapa de
`/servicos`, com os equivalentes sob `/en` e `/es`:

| De | Para |
|---|---|
| `ness.com.br/trustness` | `https://trustness.com.br/` |
| `ness.com.br/forense` | `https://forense.io/` |
| `/dpo-as-a-service`, em qualquer domínio | `https://trustness.com.br/solucoes/dpo` |
| `/trustness` em trustness.com.br e `/forense` em forense.io | `/` |
| `/assessment/*` em ness.com.br e forense.io | o mesmo caminho em trustness.com.br |
| `ness.com.br/solucoes/n-training` | `https://trustness.com.br/solucoes/n-training` |
| `trustness.com.br/solucoes/n-pentest` | `https://ness.com.br/solucoes/n-pentest` |

As rotas `/trustness`, `/forense` e `/dpo-as-a-service` saem de
`src/routes.ts`. O sitemap de cada domínio (`workers/sitemap.ts`) lista só as
páginas daquela empresa.

## 4. As homes (frente 5)

Todas seguem a mesma dinâmica, a da abertura atual (`Abertura`):

- **Foto de fundo da marca** com véu em degradê e brilho central. O Ricardo
  gosta dela; ela fica.
- Título atual de cada domínio, lede, botão principal e link.
- Abaixo das ações, um filete de 1 px e **a linha da empresa**. Cada ponto
  leva à página correspondente.

| Home | Linha | Pontos |
|---|---|---|
| ness. | "uma casa, o ciclo inteiro", **por tempo** | antes: **trustness.** (auditoria, ISO 27001, LGPD e DPO) → todo dia: **ness.** (a operação e a resposta; lista os cinco produtos, n.cirt incluído, e as plataformas ness.OS, n.csirt, n.pentest e n.training à parte; marcador cheio) → quando é preciso provar: **forense.io** (perícia digital com cadeia de custódia) |
| trustness. | "medir, estruturar, testar, manter" | auditoria e assessment → ISO 27001 e governança → testes e vulnerabilidades → DPO como serviço; n.iso, n.privacy, n.training e n.pentest num grupo à parte, "plataformas" |
| forense.io | "da prova ao processo" | antes que ela suma: coleta preventiva → quando é preciso saber: perícia digital → quando há outro laudo: assistência técnica e contraprova |

- **Faixa de presença global**, só na ness.: "clientes atendidos em brasil ·
  portugal · chile · peru · colômbia · estados unidos", com marcador em mira
  de 7 px. O texto diz sempre **"clientes atendidos"**, nunca "escritórios" ou
  "operação em".
- A escala segue a aprovada em 10/09: título de 56 px na home da ness. e de
  48 px nas outras, seções a 24 px e botões de 44 px. Escala e respiro finos
  se acertam no navegador, no `/impeccable live`.
- O que vem abaixo da primeira tela passa por `/impeccable critique`. Se o
  ciclo das soluções repetir a linha nova, ele sai.

## 5. Os momentos marcantes (frente 6)

### 5.1 Os 18 momentos

| Produto | Tipo | O leitor escolhe | A página mostra | Conteúdo |
|---|---|---|---|---|
| n.secops | `severidade` | P1–P4 | o caminho do evento (fontes → AIOps, no ness.OS → time de segurança → você) aceso conforme o nível, fundido com a escada de severidade | ficha pronta |
| n.cirt | `mesa-de-crise` | a fase (acionamento, contenção, retomada, lições) | quem está à mesa e o que cada um faz (comando da ness., TI, jurídico, comunicação, perícia); o registro e a notificação correm no n.csirt | rascunho a validar |
| n.infraops | `demanda` | a demanda (usuário sem acesso, alerta de disco no servidor, patch do mês, nova filial precisa de rede) | qual frente cuida (atendimento, sustentação ou arquitetura), o caminho e o que chega para você; a sustentação corre no ness.OS | rascunho a validar |
| n.devarch | `portoes` | o portão (arquitetura, código, testes, homologação, produção) | o que é conferido em cada um (desenho revisado; revisão e análise de segurança do código e das dependências; testes automatizados e de segurança) e o que fica de evidência | rascunho a validar |
| n.autoops | `antes-depois` | o processo (conceder acesso, aplicar patch, abrir chamado) | hoje à mão × com n.autoops, com a linha "← humano" onde a automação para | rascunho a validar |
| ness.OS | `fronteira` | a ação (aplicar patch crítico em servidor de produção, isolar estação com malware, bloquear credencial anômala, atualizar aplicativo nas estações) | em que camada ela cai (ingestão e triagem, ação por runbook ou decisão humana) e se espera aprovação (GMUD); abaixo, a captura real com a etiqueta "dados de exemplo" quando chegar | texto do produto (11/09); captura aguarda |
| n.csirt | `a-quem-notificar` | o incidente (ransomware em órgão federal, vazamento de dado pessoal, incidente em TO do setor elétrico, defacement) | o runbook que abre, a marcação TLP e quais reguladores recebem a notificação (CTIR Gov, CARCCiber/ONS, ANPD) | texto do produto (11/09); fundamentos a conferir; captura aguarda |
| n.pentest | `ciclo-do-achado` | um achado | encontrado → validado pelo time → entregue (na plataforma ou exportado ao DefectDojo) → corrigido → retestado → monitorado no ness.OS: o achado não morre no PDF | texto do produto (11/09); captura aguarda |
| auditoria e assessment | `regua` | o ponto de partida | as fases sobre a régua de 4 a 8 semanas | texto no ar |
| ISO 27001 e governança | `rastreabilidade` | um controle do Anexo A da ISO 27001:2022 (5.15, 8.13, 6.3) | política → procedimento → controle → evidência que o auditor pede | rascunho a validar |
| DPO como serviço | `ciclo` | um acontecimento (pedido de titular, incidente com dado pessoal, fornecedor novo) | por onde passa no ciclo, quem responde e onde fica registrado no n.privacy | texto no ar |
| testes e vulnerabilidades | `matriz` | um achado | o quadrante de criticidade técnica × impacto no negócio, quem corrige e o reteste; os achados vivem no n.pentest | rascunho a validar |
| n.iso | `jornada` | um controle do Anexo A (5.15, 8.13, 6.3) | aplicabilidade na declaração → risco ligado → evidência no cofre com o hash conferido → o que o auditor vê no portal; abaixo, a captura real com a etiqueta "dados de exemplo" quando chegar | texto do produto (11/09); captura aguarda |
| n.privacy | `duas-leis` | um direito do titular (acesso, correção, eliminação, portabilidade) | o fundamento lado a lado, LGPD (art. 18) e GDPR (arts. 15, 16, 17 e 20), e o que a plataforma registra | texto do produto (11/09); captura aguarda |
| n.training | `trilha` | o público (colaboradores, TI, liderança, quem trata dado pessoal) | a trilha de módulos e o que fica de evidência de conclusão, a prova que o controle 6.3 da ISO 27001 e o programa de privacidade pedem | rascunho a validar; captura aguarda |
| perícia digital | `cadeia` | "alterar 1 bit na cópia" / "restaurar" | o hash deixa de bater no elo seguinte e a cadeia mostra onde quebrou | texto no ar |
| assistência técnica e contraprova | `conferencia` | um ponto do laudo (cadeia, hash, método, conclusão) | o que o laudo diz × o que se confere × o achado, conforme a ISO/IEC 27037 e a 27042 | rascunho a validar |
| coleta preventiva | `volatilidade` | a fonte (memória, conexões e logs, disco, backup e nuvem) | a posição na ordem de volatilidade (RFC 3227) e o que a coleta fixa na hora, com o hash | rascunho a validar |

Nenhum momento publica prazo em minutos, ganho percentual, preço ou número de
SLA; o prazo fica na proposta.

### 5.2 O componente `Momento`

- `src/components/momentos/Momento.tsx` desenha um `<fieldset>` com `<legend>`
  (a pergunta), as opções como **`<input type="radio">` nativos** com cara de
  chip e um painel por opção.
- O estado é **CSS**: `.momento:has([data-opcao="N"]:checked) [data-estado="N"]`
  mostra o painel, e a classe `acende-N` acende nó, seta ou filete do desenho.
  `ponytail:` são no máximo **6 opções por momento**, porque as regras são
  fixas no `index.css`; se algum dia precisar de mais, é só gerar as regras.
- A primeira opção sai marcada do servidor: sem JavaScript, a página abre
  completa. O texto de todas as opções está no HTML.
- Um arquivo por tipo em `momentos/<tipo>.tsx`, lendo a ficha tipada. As peças
  que já existem (`Glifo` com os marcadores por ator, o filete da escada, nós
  e setas do `FluxoDoEvento`) vão para `momentos/partes/` e são reusadas.
- Os marcadores por ator continuam fixos: AIOps em círculo cheio `#00ade8`,
  time de segurança em anel `#7bd0ff`, você em círculo cheio `#dae2fd`.

**Acessibilidade:**

- **Teclado:** as setas trocam a opção; o foco aparece no chip
  (`:has(input:focus-visible)`).
- **Leitor de tela:** lê a pergunta e a opção. O painel vem logo depois do
  grupo, e os ocultos ficam fora da leitura.
- **Cor:** o estado nunca é só cor. O chip muda de borda e de texto, e o
  painel diz em palavras o que mudou.
- **Movimento:** transição de 150 a 200 ms só na opacidade, e nenhuma com
  `prefers-reduced-motion`.
- **Celular:** o desenho tem versão própria quando o horizontal não cabe, e
  nunca rola para o lado.

**Ordem:** n.secops (piloto) e ness.OS, que dividem o mesmo fluxo → perícia digital, auditoria, n.iso, n.privacy, n.csirt e n.pentest (conteúdo pronto) →
os demais conforme as fichas forem validadas ; as capturas reais das seis plataformas entram quando
chegarem.

## 6. Conteúdo e integridade

### 6.1 Fichas e validação

- Os dados saem de `src/data/solutionsData.ts` para
  `src/data/produtos/{ness,trustness,forense}.ts`, com um tipo comum
  `Produto`: `slug`, `marca`, `categoria` (serviço ou plataforma), `promessa`,
  textos de meta, `momento` (união discriminada por `tipo`, seção 5.1) e as
  seções escopo, entregáveis, operação e fecho.
- Cada ficha tem **`status: 'rascunho' | 'validado'`**. O rascunho aparece
  **só no Worker de preview**, reconhecido por uma variável de ambiente que o `preview.yml` define no deploy, com a etiqueta "rascunho, a validar": **o time
  valida olhando a página pronta no link do PR**. Em produção só vai ao ar
  ficha validada; enquanto isso, a página segue no formato atual, já sem as
  alegações sem fonte.
- As fichas dos quatro produtos da ness. sem conteúdo e dos produtos da
  trustness. e da forense.io são rascunhadas a partir do texto do site, sem
  número, prazo ou cliente inventado. O `docs/FICHA-runbook-por-produto.md`
  continua sendo o molde.

### 6.2 Regras de texto

- **Toda alegação tem fonte** registrada em `docs/PESQUISA-metricas.md`.
  Presença global: *clientes atendidos em Brasil, Portugal, Chile, Peru,
  Colômbia e Estados Unidos, confirmado por Ricardo Esper em 11/09/2026, com
  base na carteira de clientes.* ness.OS: *trilha de auditoria imutável e
  nenhuma infraestrutura local no cliente, confirmado por Ricardo Esper em
  11/09/2026.*
- **Codinome de projeto nunca aparece**: nem no texto, nem em chave de i18n,
  identificador, rota, alt, branch, commit ou PR. O teste de integridade
  guarda só o SHA-256 dos codinomes, inclusive os escritos com ponto (PR #44).
- **Documento de cliente não vira conteúdo.** Texto de produto tirado de
  proposta ou relatório de um cliente serve só como descrição genérica: o nome
  do cliente, os achados e os dados do ambiente dele nunca vão para o site.
- **Como um produto é construído** (stack, linguagem, provedor, modelo) não
  aparece no site. A página do n.iso não menciona IA nem a integração por MCP.
- **Integração só aparece quando já funciona:** hoje, a exportação do n.pentest
  para o DefectDojo.
- **Produto se descreve pelo serviço que presta**, não pelas ferramentas e
  indicadores do setor (ITIL, CMDB, RPO e RTO, SLO e SLI). Isso é meio.
- Do texto de produto do ness.OS ficam fora, até haver medição: "em minutos",
  "quase imediato", "redução drástica de ruído", "autônoma" como absoluto e
  a tabela comparativa com SOC e RMM "tradicionais".
- No n.secops e no ness.OS, o ator automatizado é **AIOps**; "agentic" não aparece no site. "Agentes de IA" descreve só
  o n.autoops.
- **Marca no meio da frase sai desenhada** (`ComMarcas`), inclusive a ness.OS,`n  com "OS" em maiúsculo.
- O assessment de privacidade se chama **"maturidade em privacidade"**.
- Rótulos em caixa normal, sem caixa alta espaçada.

### 6.3 Desvios deliberados do guia de marca

O guia do ecossistema (Montserrat 600 em títulos, produtos grafados como
`nShield`, microcopy em caixa alta) diverge do que o repositório já fixou:
**Montserrat 500, `n.secops` com o ponto azul e caixa normal**. Vale o
repositório. A marca **ness.OS** é a exceção deliberada à caixa baixa: "OS" em maiúsculo,`ncom o ponto azul. O `DESIGN.md` registra os três desvios e essa exceção.

## 7. Arquitetura de renderização (frentes 2 e 3)

### 7.1 Páginas sem JavaScript

- A rota de conteúdo declara `export const handle = { semJs: true }`. No
  `Layout` de `src/root.tsx`, `useMatches()` confere o `handle` e deixa
  **`<Scripts>` e `<ScrollRestoration>` de fora**. O HTML continua saindo
  completo do servidor, e nenhum módulo React desce.
- **Sem JS:** as três homes, as páginas de produto, sobre, portfólio, blog,
  compliance, brandbook e 404.
- **Hidratadas:** contato, assessment, carreiras e obrigado.
- **Menu, mega-menu e seletor de marca:** `<details>` e `popover` nativos.
- **Um script de reforço** (meta: menos de 5 KiB), com o nonce da CSP:
  - eventos por atributo (`data-evento` e `data-parametros` viram
    `zaraz.track`, como faz `src/utils/eventos.ts`) e a profundidade de
    rolagem;
  - o botão do chat, que só baixa o módulo do chat no primeiro clique, como
    faz hoje o `ChatLauncher`;
  - o Turnstile do rodapé, carregado quando o formulário chega perto da tela.
- **Formulários em página sem JS:** envio nativo (`POST`) para o mesmo
  endpoint, com o Turnstile.
- **Navegação:** carregamento de documento, com `<script
  type="speculationrules">` (com nonce) pré-carregando a página ao pairar o
  mouse. Funciona no Chrome e no Edge; nos outros, é a navegação normal, que
  começa com 0,25 s de TTFB.
- **Idioma:** nada muda. O servidor já renderiza no idioma da rota.
- **Consentimento:** o aviso de cookies passa a funcionar sem React, sobre a
  API de consentimento da Zaraz.

### 7.2 A prova (frente 2) e o critério de aceitação

Antes de estender, a home da forense.io é migrada sozinha, num PR com preview,
para responder:

1. **O LCP no celular fica abaixo de 2,5 s** no Lighthouse do preview (mediana
   de 3 execuções). É o critério de aceitação.
2. **Como o build emite o reforço e o módulo do chat**, com hash, sem o
   runtime do React Router, e como o `Layout` descobre o endereço deles. É o
   ponto técnico mais incerto.
3. A Zaraz (visualização de página e consentimento), o aviso de cookies e o
   Turnstile funcionam sem React.
4. Os e2e atuais continuam passando.

**Se o item 1 ou o 2 falhar**, a contingência é a abordagem A: manter a
hidratação, tirar o `motion` do caminho global, pré-carregar só a Montserrat,
dar `fetchpriority` alto à foto do hero e reduzir os pré-carregamentos. O
Ricardo decide antes de seguir.

## 8. Fundação (frente 1)

1. **`PRODUCT.md`** passa a registrar as três empresas e os portfólios, a
   regra dos codinomes, "maturidade em privacidade" e a presença global com a
   fonte, o ness.OS e as duas alegações técnicas dele. As fontes entram também
   em `docs/PESQUISA-metricas.md`.
2. **`DESIGN.md`**, na raiz, ao lado do `PRODUCT.md`, é gerado por `/impeccable document` a partir do que está no
   ar: escala, tipografia, filetes, marcadores por ator e desvios do guia. O
   `docs/DESIGN.md` de 24/04 e o `docs/DESIGN-SYSTEM.md` passam a apontar para
   ele.
3. **CI** (`.github/workflows/preview.yml`):
   - `npm test` antes do build;
   - o detector do impeccable, com `overused-font` ignorada, porque Inter e
     Montserrat são da marca;
   - `lighthouserc.json` com duas faixas: **erro** acima de 2,5 s de LCP e de
     10 KiB de script nas rotas migradas, **aviso** nas demais.
4. **Limpeza imediata** das alegações sem fonte nos quatro produtos antigos da
   ness. e no portfólio: "sala de guerra em 15 minutos", "R$ 15 milhões",
   "<= 15 minutos", "índice legal inabalado", "uptime garantido" (inclusive na meta
   description do n.infraops), "MTTR 78% menor", "RTO e RPO matemáticos",
   "agentes autônomos" e o jargão vazio. O FinOps sai do título do n.infraops. O teste de dados
   passa a reprovar número com unidade (minutos, horas, milhões, %) em ficha
   não validada.

## 9. Acabamento (frente 7)

- Sobre, contato e portfólio por empresa.
- Carreiras, blog, compliance e brandbook no desenho delicado,
  com `/impeccable polish`, uma tela por vez.
- **`/impeccable audit` final**, comparada com os 11/20 de 10/09.
- **Lighthouse das mesmas 19 URLs**, comparado com 10/09 e 11/09.

## 10. Frentes, ordem e dependências

| # | Frente | Depende de | Entrega |
|---|---|---|---|
| 1 | Fundação | — | PR com `PRODUCT.md`, `DESIGN.md`, CI e limpeza |
| 2 | Prova da arquitetura | 1 | PR da home da forense.io sem JS; sim ou não para D13 |
| 3 | Globais sem JS | 2 | cabeçalho, menu, seletor, rodapé, chat, aviso de cookies, reforço |
| 4 | Uma casa por empresa | 2 | rotas, guarda, 301, sitemap, fichas tipadas, páginas comuns por empresa |
| 5 | As três homes | 3, 4 | seção 4 |
| 6 | Os 18 momentos | 4 | `Momento` e um PR por leva de momentos |
| 7 | Acabamento | 5, 6 | seção 9 |

Cada frente tem o seu plano de implementação e sai em PR com preview. Merge em
`main` publica em produção, e o merge é sempre do Ricardo.

## 11. Testes e portões

- **Unitários (vitest):**
  - fichas tipadas: slug único por empresa e ficha validada completa;
  - nenhum rascunho renderiza fora do preview;
  - integridade: alegações vetadas, codinomes e número com unidade em ficha
    não validada.
- **e2e (Playwright) por domínio:**
  - produto de outra empresa responde 404;
  - cada 301 aponta ao destino certo;
  - página sem JS não carrega `/assets/*.js` além do reforço;
  - cada momento funciona com o **JavaScript desligado** (a opção N mostra o
    painel N), troca de opção pelas setas do teclado, não rola para o lado a
    390 px e passa no axe sem violações.
- **Lighthouse na CI:** portão de 2,5 s e de 10 KiB de script nas rotas
  migradas.
- **Detector do impeccable** na CI.
- Os e2e e o Lighthouse existentes continuam valendo, e marca como texto comum
  continua reprovada.

## 12. Riscos

| Risco | Mitigação |
|---|---|
| Servir o reforço e o chat sem o runtime do React Router exige mexer no build | É a pergunta 2 da prova; a contingência A existe |
| `speculationrules` só funciona em navegadores Chromium | A navegação normal já parte de 0,25 s; é ganho, não dependência |
| `:has()` e `popover` em navegador antigo | Os dois são Baseline (2023 e 2024). Sem eles, a primeira opção continua visível e o menu abre como lista |
| As fichas atrasam na validação do time | O rascunho vive no preview; produção segue no formato atual, sem alegações sem fonte |
| O Lighthouse varia entre execuções | Mediana de 3 execuções na CI e comparação com a mesma lista de URLs |

## 13. Pendências fora do código

- **Time que opera:** validar as fichas no link de preview de cada PR.
- **Ricardo:**
  - enviar as capturas das seis plataformas (ness.OS, n.csirt, n.pentest, n.iso, n.privacy e n.training);
  - fazer o merge do PR #44 (codinome);
  - decidir o que fazer com o codinome que ainda aparece em `canal/`, o
    sistema interno.

## 14. Fora do escopo

- Acionamento real do plantão pelo canal de emergência do n.cirt, que é
  trabalho de backend.
- en e es das páginas de produto e das fichas.
- O `canal/` (sistema interno), exceto pela decisão sobre o codinome.
- Uma direção visual nova.

## 15. Critérios de sucesso

- **Desempenho:** LCP no celular de até 2,5 s em todas as rotas migradas,
  medido no Lighthouse da CI.
- **Momentos:** os 18 no ar com ficha validada. As seis plataformas saem com o momento desenhado e ganham a captura real depois.
- **Qualidade:** nenhuma violação no axe, nenhuma rolagem lateral a 390 px e
  nenhuma alegação sem fonte, com os testes verdes.
- **Auditoria:** a `/impeccable audit` final registrada e comparada com os
  11/20. A proposta de meta é chegar à faixa "Bom", de 16/20 para cima.
