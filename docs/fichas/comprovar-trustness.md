# Ficha — comprovar (trustness.)

> **Rascunho de 14/09/2026, a validar pelo time da trustness.** Escrito a partir
> do glifo do momento "comprovar" (o selo com o traço da conferência,
> `GlifoDoMomento.tsx`), do que a home da trustness. já publica (`i18n.ts`,
> chave `trustness`) e de uma pesquisa de serviços correlatos. Campo marcado
> **a confirmar** é inferência minha: corrija ou apague.
>
> Esta ficha é diferente das outras quatro: "comprovar" não é um produto n., é
> a marca inteira. Ela alimenta a **home da trustness.** e a coluna "comprovar"
> do ciclo, não uma página em `/solucoes`. Os produtos da trustness. que têm
> ficha própria são o n.iso (`n-iso.md`) e o n.pentest (`n-pentest.md`).
>
> Três regras, as mesmas de `FICHA-runbook-por-produto.md`: **nada de número de
> SLA**; **nada de absoluto sem fonte**; **diga o que não está no escopo**.

- **Empresa:** trustness. · **Endereço:** a home da marca (`/trustness` em
  qualquer domínio; `trustness.com.br` em produção)
- **Momento do ciclo:** comprovar. É a última coluna: depois de construir,
  operar, proteger e responder, alguém de fora pergunta "prove".
- **Passagem:** recebe do n.cirt o incidente fechado (o que a auditoria vai
  perguntar) e do n.secops as evidências organizadas; devolve ao n.secops os
  controles que precisam de ajuste **a confirmar**.

## O glifo, em uma frase

Um anel com o traço de uma conferência dentro e um ponto azul no alto. O anel é
**o selo**: a certificação, a auditoria, o parecer que alguém de fora assina. O
traço é **a conferência**, feita antes de o auditor chegar: cada controle
contra o que a norma exige. O ponto azul no alto é o resultado que vai para a
diretoria. A promessa do desenho é a mesma da home: **você chega à auditoria
sabendo o que ela vai encontrar**.

## Promessa (o h1 da home, já no ar)

> você chega à auditoria sabendo o que ela vai encontrar

Mantida. É a melhor frase do site inteiro; a ficha existe para sustentá-la com
o que a marca entrega, não para trocá-la.

## Apresentação (a lede, já no ar)

Auditoria independente, implementação da ISO 27001 e programa de privacidade da
LGPD, com relatório executivo e um plano de correção em ordem de prioridade.

## Os quatro momentos da marca (o conteúdo do momento)

A home já publica a linha "medir, estruturar, testar, manter". A ficha diz o
que cada momento entrega e com quem ele conversa.

| Momento | O que a trustness. faz | O que sai | Conversa com |
|---|---|---|---|
| medir | auditoria e assessment: cada controle contra o que o framework exige, em cinco fases com ordem fixa (kickoff e escopo, coleta de evidências, análise de gaps, relatório e apresentação, plano de correção) | relatório executivo e plano de correção em ordem de risco e de esforço | a diretoria e o time técnico |
| estruturar | implementação da ISO 27001 e da governança: aplicabilidade declarada, risco tratado, evidência guardada com integridade conferida (n.iso) | o sistema de gestão pronto para o auditor externo entrar e ver | o auditor externo; o n.secops, que gera as evidências |
| testar | testes e vulnerabilidades: o achado não morre no PDF, volta para a correção e para o monitoramento (n.pentest) | achados com dono, prazo e comprovação da correção | o n.secops e o n.devarch |
| manter | DPO como serviço: o programa de privacidade da LGPD em rotina, com a plataforma que sustenta o programa | o encarregado nomeado, o registro de tratamento vivo, a resposta ao titular e à ANPD | o jurídico do cliente; o n.cirt, quando há incidente com dado pessoal |

## Momento marcante — `o-selo`

O leitor escolhe uma obrigação e vê o que a conferência olha, que evidência
pede e quem assina o selo no fim.

| Obrigação escolhida | O que a conferência olha | Evidência típica | Quem assina no fim |
|---|---|---|---|
| certificar a ISO 27001 | os controles do Anexo A contra a declaração de aplicabilidade | política, registro de risco, trilha do n.secops, ata de análise crítica | o organismo certificador **a confirmar** |
| nomear um DPO e sustentar o programa LGPD | o registro de tratamento, a base legal de cada operação, o atendimento ao titular | mapa de dados, contratos com operadores, registro de atendimento | o encarregado, com a trustness. como serviço |
| responder ao questionário de segurança de um cliente grande | as perguntas contra o que existe de fato | os mesmos artefatos do assessment | você, com o parecer da trustness. |
| provar, depois de um incidente, que os controles existiam | o que estava em vigor na data, com evidência datada | trilha de auditoria, relatório final do n.cirt, evidências do n.secops | a trustness., em parecer **a confirmar** |

## Escopo

| | Preencher |
|---|---|
| **Dentro** | auditoria e assessment independentes; implementação da ISO 27001 (e ISO 27701, pelo n.iso); programa de privacidade e DPO como serviço; coordenação dos testes e o ciclo do achado (n.pentest); relatório executivo e plano de correção; preparação para o auditor externo |
| **Com autorização** | comunicação com o organismo certificador e com a ANPD em nome do cliente **a confirmar**; contato com o titular de dados **a confirmar** |
| **Fora** | emitir o certificado (é do organismo certificador, independente); corrigir os gaps (é do cliente, com o n.secops, o n.infraops ou o n.devarch quando contratados); assessoria jurídica formal; a operação de segurança do dia a dia (n.secops) |
| **Fronteira** | a trustness. audita e implementa; quem opera é a ness.; a independência entre as duas precisa estar declarada na página **a confirmar como** |
| **Não promete** | aprovação na certificação; ausência de sanção; conformidade em porcentagem |

## O que o cliente recebe

| Artefato | Ritmo |
|---|---|
| relatório executivo do assessment, para o time técnico e para a diretoria | por assessment |
| plano de correção em ordem de risco e de esforço | por assessment, revisado a cada ciclo |
| declaração de aplicabilidade e o sistema de gestão no n.iso | na implementação, mantido depois |
| registro de tratamento, resposta ao titular, relatório de impacto quando cabe | contínuo, no DPO como serviço |
| parecer independente sobre um controle ou um incidente | por pedido **a confirmar** |
| evidências organizadas para o auditor externo | por ciclo de auditoria |

## Como a operação roda

| Campo | Preencher |
|---|---|
| **Formato** | projeto (assessment, implementação) e serviço contínuo (DPO, manutenção do sistema de gestão) |
| **Duração do assessment** | a ordem das fases é fixa; a duração depende do escopo (a home já diz "4 semanas no escopo menor, até 8 no maior": manter, é faixa, não SLA) |
| **Independência** | quem audita não opera; como isso é garantido entre trustness. e ness. **a confirmar** |
| **Ativação** | kickoff e escopo: o que entra, com quem falar, que evidência pedir |

## Serviços correlatos no mercado, e onde a trustness. se diferencia

O mercado vende isto como consultoria de conformidade, *GRC as a service* e
*vCISO/DPO as a service*. O que ajuda a escrever a home:

- **A análise de gaps da ISO 27001 é vendida em duas fases**: entrevistas com
  os gestores e leitura da documentação e das configurações, e depois o
  relatório que reúne os achados. É a mesma ordem da "auditoria, semana a
  semana" da home. A diferença que a home pode nomear é o **ciclo fechado com
  quem opera**: o gap vira tarefa no n.secops e a evidência nasce da operação,
  não de uma pasta montada na véspera. Fontes: [GRC Solutions, "ISO 27001 Gap Analysis"](https://grcsolutions.io/iso27001-gap-analysis/); [Drata, "ISO 27001 Gap Analysis: What is It and How to Perform One?"](https://drata.com/grc-central/iso-27001/gap-analysis).
- **vCISO e DPO como serviço vêm em faixas**: o básico é a análise de gaps com
  um roteiro; as faixas de cima acrescentam o CISO virtual, o monitoramento e o
  DPO. A trustness. cobre a faixa inteira com marcas separadas (assessment,
  n.iso, n.pentest, DPO como serviço), e a home pode mostrar isso como um
  caminho, não como um catálogo. Fonte: [SOC2Auditors, "Best SOC 2 vCISO Firms" (08/2026)](https://soc2auditors.org/vciso-firms/).
- **Depois do incidente, a pergunta é regulatória**: os guias de resposta a
  incidente colocam jurídico e notificação dentro do exercício de mesa desde
  o início. A trustness. é quem responde a essa pergunta depois, e a home pode
  dizer que "comprovar" começa na sala de crise do n.cirt. Fonte: [Datapath, "Cyber Incident Response Tabletop Exercise Checklist"](https://www.mydatapath.com/blog/cyber-incident-response-tabletop-exercise-checklist-mid-market-teams/).

**Onde a trustness. se diferencia, e a home deve dizer:** (1) a auditoria é
independente, mas o plano de correção já sai com quem vai corrigir; (2) a
evidência nasce da operação (ness.OS, n.secops), não de uma pasta; (3) o DPO
é serviço contínuo, com plataforma, não uma nomeação no papel. **a confirmar**
os três, e a forma de declarar a independência.

## O que não vai ao ar

Nome de organismo certificador, promessa de aprovação, prazo de resposta à ANPD
em dias sem a norma ao lado, e qualquer "100 % conforme". A faixa de semanas do
assessment já está no ar e é faixa, não promessa.
