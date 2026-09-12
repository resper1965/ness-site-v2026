# Ficha — n.iso

> **Rascunho de 11/09/2026, a validar pelo time que opera.** Escrito a partir da
> descrição que o Ricardo passou. Campo marcado **a confirmar** é inferência
> minha: corrija ou apague. Seção sem resposta não aparece no site.
>
> Três regras, as mesmas de `FICHA-runbook-por-produto.md`: **nada de número de
> SLA**; **nada de absoluto sem fonte**; **diga o que não está no escopo**.

- **Empresa:** trustness. · **Categoria:** plataforma · **Endereço:** `/solucoes/n-iso`
- **Quem usa:** o time da trustness. com o cliente que quer se certificar, **ou o
  cliente por conta própria** — são duas entradas na mesma página.
- **Não confundir com o n.privacy:** o n.iso é certificação **por norma** (ISO
  27001 e 27701); o n.privacy é conformidade **com a lei** (LGPD e GDPR).

## Promessa (o h1 da página)

> a certificação deixa de ser uma corrida contra a auditoria **a confirmar**

## Apresentação (a lede)

O sistema onde a implantação da ISO 27001 e da ISO 27701 acontece: cada controle
com a sua aplicabilidade declarada, o risco que ele trata, a evidência guardada
com a integridade conferida, e o auditor externo entrando para ver, sem precisar
de e-mail com anexo.

## O que ele cobre (o conteúdo das seções)

| Bloco | O que faz |
|---|---|
| declaração de aplicabilidade | os 93 controles do Anexo A da ISO 27001:2022, com justificativa por controle e migração da versão de 2013 |
| riscos | matriz 5×5 com score, plano de tratamento e o inventário de ativos ligado a ameaças e vulnerabilidades |
| cofre de evidências | cada documento com integridade conferida por SHA-256 e trilha de auditoria própria |
| privacidade (ISO 27701) | registro das operações de tratamento (ROPA) e relatório de impacto (DPIA) |
| ações e auditorias | ações corretivas e preventivas (CAPA), auditoria interna e externa |
| ciência das políticas | portal onde cada pessoa confirma que leu — é a evidência que o controle **A.6.3** (conscientização) pede |
| portal do auditor | acesso somente leitura, com credencial temporária |

## Momento marcante — `jornada`

O leitor escolhe um controle do Anexo A e acompanha o caminho inteiro dele.

| Etapa | O que aparece |
|---|---|
| 1. aplicabilidade | o controle é aplicável? com a justificativa declarada na SoA |
| 2. risco | qual risco ele trata, e em que quadrante da matriz 5×5 ele está |
| 3. evidência | o documento no cofre, com o hash conferido e a data |
| 4. auditor | o que o auditor externo vê quando entra pelo portal |

Controles sugeridos para as opções: **5.15** (controle de acesso), **8.13**
(backup) e **6.3** (conscientização). **a confirmar** se são os três mais
ilustrativos para quem está avaliando.

## Escopo

| | Preencher |
|---|---|
| **Dentro** | **a confirmar** — o que o produto entrega sozinho (o sistema) e o que depende de serviço da trustness. |
| **Fora** | **a confirmar** — ele não emite certificado, não substitui o organismo certificador, não faz a auditoria de certificação |
| **Fronteira** | quem preenche a SoA, quem aprova o plano de tratamento e quem sobe evidência **a confirmar** |

## O que o cliente recebe

| Artefato | Ritmo |
|---|---|
| declaração de aplicabilidade atualizada | contínuo |
| plano de tratamento de risco | por ciclo **a confirmar** |
| evidências com integridade conferida | contínuo |
| relatório para a auditoria | **a confirmar** |

## Como a operação roda

| Campo | Preencher |
|---|---|
| Quem opera | o cliente, o time da trustness., ou os dois **a confirmar** |
| Ativação | **a confirmar** — do contrato até a SoA começar a ser preenchida |
| Atualização da norma | a migração de 2013 para 2022 é feita pelo sistema **a confirmar** |
| Limites | quantidade de usuários, de escopos ou de normas por conta **a confirmar** |

## O que não vai ao ar

- **A página não menciona IA nem a integração por MCP** (decisão do Ricardo,
  11/09), nem como o produto é construído — linguagem, provedor, modelo.
- **O "Art. 18 da LGPD" do texto de origem fica de fora:** esse artigo trata dos
  direitos do titular, não da ciência de políticas. O que sustenta o portal de
  ciência é o controle **A.6.3** da ISO 27001. Um DPO percebe a troca.
- Nada de número de controles "cobertos", percentual de aderência ou prazo de
  certificação sem fonte registrada em `docs/PESQUISA-metricas.md`.
