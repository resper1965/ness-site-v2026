# Ficha — n.cirt

> **Rascunho de 14/09/2026, a validar pelo time que opera.** Escrito a partir do
> glifo do momento "responder" (as cinco células em volta do comando,
> `GlifoDoMomento.tsx`), do que o site já publica em `solutionsData.ts` e de uma
> pesquisa de serviços correlatos no mercado (seção no fim). Campo marcado
> **a confirmar** é inferência minha: corrija ou apague. Seção sem resposta não
> aparece no site.
>
> Três regras, as mesmas de `FICHA-runbook-por-produto.md`: **nada de número de
> SLA**; **nada de absoluto sem fonte**; **diga o que não está no escopo**.
> Este é o produto em que o modelo de resposta mais importa: é literalmente o
> que se vende.

- **Empresa:** ness. · **Categoria:** serviço (prontidão contratada e comando da crise) · **Endereço:** `/solucoes/cirt`
- **Momento do ciclo:** responder. Divide a coluna com a forense.io, que é a
  perícia com cadeia de custódia; o n.cirt é o comando que puxa a perícia.
- **Roda sobre:** o n.csirt (cockpit, runbooks, cadeia de custódia e canal
  regulatório); a ficha `n-csirt.md` descreve a plataforma, esta descreve o
  serviço.
- **Passagem:** vem do n.secops (o incidente que escapa da contenção) e vai
  para a forense.io (perícia) e para a trustness. (o que a auditoria vai
  perguntar depois).

## O glifo, em uma frase

Cinco células em volta de um ponto azul no centro. O centro é **o comando**: um
comandante, uma sala de crise, um registro. As cinco células são as frentes que
ele coordena: **perícia e custódia**, **resposta tática**, **reestruturação**,
**comunicação** e **jurídico e regulatório**. Nenhuma célula fala com a outra
sem passar pelo centro: é isso que impede a prova de morrer na pressa de
restaurar e o comitê de decidir por boato. A promessa do desenho: **o colapso
vem da descoordenação, e o que se vende é a coordenação**.

## Promessa (o h1 da página)

> quando o impensável acontece, um comando assume e cinco frentes respondem em ordem **a confirmar**

Alternativas: *"a crise tem um comandante, cinco frentes e um registro"* ·
*"contido, provado, reconstruído e comunicado, nessa ordem"*.

## Apresentação (a lede)

Num incidente grave, o colapso costuma vir da descoordenação: provas perdidas na
pressa de restaurar, ambiente contaminado de volta ao ar, comitê decidindo por
boato. Assumimos o comando da crise e organizamos cinco frentes sob um
comandante: perícia e custódia, resposta tática, reestruturação, comunicação e
jurídico e regulatório. O comitê acompanha no cockpit, e cada decisão fica
registrada.

## As cinco células (o conteúdo do momento)

| Célula | O que faz | Entra quando | Quem age |
|---|---|---|---|
| comando (o centro) | assume, distribui os papéis, decide a ordem, responde ao comitê, registra cada decisão | na primeira confirmação do incidente | comandante da ness. |
| 1. perícia e custódia | preserva a evidência antes de qualquer reinício, imagem e memória com hash, cadeia de custódia | antes da contenção destrutiva | forense.io |
| 2. resposta tática | contém, isola, bloqueia credencial, corta o acesso do atacante, com o seu time e os seus fornecedores | logo depois de a evidência estar preservada, ou junto, quando a contenção não destrói prova | time de resposta com o seu time |
| 3. reestruturação | cópias verificadas antes de restaurar, liberação em fases, o ambiente limpo de volta ao ar | depois da contenção e da prova | reestruturação com o n.infraops ou o seu time |
| 4. comunicação | o que se diz, para quem, quando: colaboradores, clientes, imprensa; uma voz só | desde a sala de crise | comunicação, com o porta-voz seu |
| 5. jurídico e regulatório | quem precisa ser notificado, em que prazo, com que texto (ANPD, CTIR Gov, setor regulado); contrato com fornecedores | desde a sala de crise | jurídico seu, com o canal regulatório do n.csirt |

**A ordem que o comando impõe:** prova antes de reiniciar; contenção antes de
comunicar para fora; cópias verificadas antes de restaurar. Trocar a ordem é o
erro que a página existe para nomear.

## Modelo de severidade

O n.cirt entra no que o n.secops classifica como **P1 confirmado** ou no que
chega de fora do n.secops (cliente sem SOC da ness., aviso de terceiro, extorsão
recebida). Dentro do n.cirt, a escala é por **fase da crise**, não por
severidade; a severidade já foi dada.

| | Fase 0 · aviso | Fase 1 · sala de crise | Fase 2 · contenção | Fase 3 · retomada | Fase 4 · fechamento |
|---|---|---|---|---|---|
| **O que caracteriza** | o incidente é confirmado por quem tem contrato | o comando assume; papéis distribuídos; comitê no cockpit | o atacante perde o acesso; a prova está preservada | o ambiente limpo volta em fases | lições, evidência entregue, notificações fechadas |
| **Quem age** | comandante de sobreaviso | comandante e comitê | células 1 e 2 | células 3 e 4 | comando, 5 e trustness. |
| **Em que ordem** | confirma antes de mobilizar | comando antes de ação | prova antes de reinício | verificação antes de liberação | registro antes de encerrar |
| **O que o cliente recebe** | o acionamento confirmado | o cockpit aberto e o primeiro registro | boletim de contenção **a confirmar** | plano de liberação por fase | relatório final e pacote de custódia |

## Momento marcante — `cinco-celulas`

O leitor escolhe um incidente e vê quais células acendem primeiro e o que o
comando decide antes de todo o resto.

| Incidente escolhido | Acende primeiro | Depois | A primeira decisão do comando |
|---|---|---|---|
| ransomware com resgate pedido | 1 e 2 | 5, 4, 3 | ninguém reinicia nada; a nota de resgate é evidência |
| vazamento de dado pessoal confirmado | 1 e 5 | 4, 2, 3 | o prazo regulatório começa a contar agora; o jurídico entra na sala **a confirmar** |
| fornecedor comprometido com acesso ao seu ambiente | 2 e 5 | 1, 4, 3 | corta o acesso do fornecedor antes de avisá-lo **a confirmar** |
| negação de serviço na loja | 2 e 4 | 3 | comunicação para clientes sai antes de a causa ser conhecida |
| credencial de diretor usada de fora do país | 1 e 2 | 5 | preserva o histórico antes de trocar a senha |

Marcadores por ator, como no n.secops: o comando em círculo cheio `#00ade8`, as
células da ness. e das marcas em anel `#7bd0ff`, você (comitê, porta-voz,
jurídico) em círculo cheio `#dae2fd`.

## Escopo

| | Preencher |
|---|---|
| **Dentro** | comando do incidente; sala de crise e cockpit para o comitê; coordenação do seu time e dos seus fornecedores; contenção coordenada; preservação de evidência e perícia (com a forense.io); retomada em fases com cópias verificadas; roteiro de comunicação; mapa de notificação regulatória; registro de cada decisão; relatório final e lições |
| **Com autorização** | ação destrutiva ou de alto impacto (desligar sistema, cortar link, revogar acesso em massa); contato com o atacante; comunicação externa; notificação ao regulador (quem assina é você) |
| **Fora** | decidir pagar ou não pagar resgate (é sua, com o seu jurídico; o n.cirt informa, não decide); reconstruir o que não estava documentado; assessoria jurídica formal e representação perante o regulador (o seu jurídico ou escritório); comunicação de marca fora da crise; seguro cibernético e a negociação com a seguradora, que continuam seus **a confirmar** |
| **Fronteira** | o comitê decide, o comando executa e registra; o porta-voz é seu; a notificação é assinada por você; o SOC que detectou (n.secops ou de terceiro) continua monitorando durante a crise |
| **Não promete** | que o incidente não volte; recuperar todo dado; tempo de retomada; que a notificação regulatória evite sanção |

## O que o cliente recebe

| Artefato | Ritmo |
|---|---|
| prontidão: contrato ativo, comandante de sobreaviso, matriz de acionamento | contínuo, antes da crise |
| roteiros de crise e mapa de fornecedores (o que cada um faz quando começa) | na ativação, revisado por ciclo **a confirmar** |
| exercício de mesa com diretoria e times | por ciclo **a confirmar** |
| cockpit aberto com o registro de cada decisão | durante a crise |
| boletins de situação para o comitê | durante a crise, no ritmo que o comando definir |
| pacote de cadeia de custódia (pela forense.io) e relatório pericial | por incidente |
| comprovante das notificações despachadas (pelo n.csirt) | por notificação |
| relatório final: linha do tempo, decisões, causa, o que muda | ao fechar |

## Como a operação roda

| Campo | Preencher |
|---|---|
| **Cobertura** | comandante de sobreaviso contínuo para quem tem contrato de prontidão **a confirmar**; sem contrato, o acionamento entra numa fila de emergência **a confirmar** |
| **Passagem de plantão** | o cockpit é o registro; a troca de comandante numa crise longa passa pelo registro, nunca por conversa |
| **Escalação** | você aciona o número de crise; o comandante confirma e mobiliza as células; sem resposta sua, a cadeia de contatos do comitê definida na ativação |
| **Ativação** | 1. roteiros: os ritos e as decisões de crise desenhados para os seus times e diretores; 2. prontidão: o mapa do que cada fornecedor faz quando o incidente começa; 3. em espera: contrato ativo, comando pronto para entrar; 4. acionamento: crise confirmada, o comando assume e o comitê é chamado |
| **Caso ilustrativo (o registro que passa o turno)** | *incidente: ransomware, 03:20 · comando assumido 03:35 · célula 1: imagens dos dois servidores antes de qualquer reinício · célula 2: VPN derrubada, credenciais administrativas revogadas · célula 5: dado pessoal possivelmente exposto, prazo regulatório contando · célula 4: comunicado interno às 07:00, externo só depois da contenção · decisão registrada: não reiniciar o ERP até a cópia ser verificada · pendência: comitê às 09:00 decide sobre o contato com o atacante* **exemplo** |

## Serviços correlatos no mercado, e onde a ness. se diferencia

O mercado vende isto como *incident response retainer* e *IR as a service*. O
que ele diz, e o que ajuda a escrever a página:

- **O retainer é contratado antes da crise, com horas anuais, e inclui
  serviços proativos**: um exercício de mesa no primeiro período do contrato,
  que confirma o fluxo de acionamento, apresenta os analistas nomeados e
  expõe falhas de processo antes de o incidente real aparecer. A "prontidão
  contratada" do n.cirt é exatamente isso, e o exercício de mesa deve aparecer
  na lista de entregáveis. Fonte: [Decryption Digest, "Incident Response Retainer Guide 2026: Contract Terms and Tiers"](https://www.decryptiondigest.com/blog/incident-response-retainer-buyers-guide).
- **A ferramenta de coleta (memória, imagem de disco, logs) pré-instalada no
  ambiente encurta o início da resposta**; sem ela, a resposta começa
  instalando. Vale decidir se a ativação do n.cirt inclui isso, e dizer.
  Fonte: a mesma acima.
- **O exercício de mesa tem roteiro**: cenário de negócio, escopo, papéis,
  pontos de decisão, premissas técnicas, caminhos de comunicação e questões
  jurídicas definidos antes. O momento `cinco-celulas` da página é uma versão
  em miniatura desse exercício, e pode dizer isso. Fontes: [Sygnia, "How to Run Incident Response Tabletop Exercises in 2026"](https://www.sygnia.co/blog/incident-response-tabletop-exercise/); [Datapath, "Cyber Incident Response Tabletop Exercise Checklist"](https://www.mydatapath.com/blog/cyber-incident-response-tabletop-exercise-checklist-mid-market-teams/).

**Onde a ness. se diferencia, e a página deve dizer:** (1) o n.cirt vende o
**comando**, não horas de analista: um comandante, cinco frentes e a ordem
entre elas; (2) a perícia é de uma marca própria (forense.io) e a notificação
regulatória sai de uma plataforma própria (n.csirt), então prova e prazo não
dependem de um terceiro que chega depois; (3) o comitê acompanha no cockpit e
cada decisão fica registrada, o que raramente se publica. **a confirmar** os
três.

## O que não vai ao ar

Horas do retainer, tempo até o comando assumir, prazo de retomada, número de
incidentes atendidos, nome de cliente atendido em crise, e qualquer prazo
regulatório em horas sem a norma citada ao lado (regra da ficha do n.csirt). O
caso ilustrativo é exemplo e fica rotulado como exemplo dentro da figura.
