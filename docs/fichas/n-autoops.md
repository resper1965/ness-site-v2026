# Ficha — n.autoops

> **Rascunho de 14/09/2026, a validar pelo time que opera.** Escrito a partir do
> glifo do momento "operar" (as três frentes, `GlifoDoMomento.tsx`, dividido com
> o n.infraops), do que o site já publica em `solutionsData.ts` e de uma
> pesquisa de serviços correlatos no mercado (seção no fim). Campo marcado
> **a confirmar** é inferência minha: corrija ou apague. Seção sem resposta não
> aparece no site.
>
> Três regras, as mesmas de `FICHA-runbook-por-produto.md`: **nada de número de
> SLA**; **nada de absoluto sem fonte**; **diga o que não está no escopo**.

- **Empresa:** ness. · **Categoria:** serviço (gestão contínua de uma frota) · **Endereço:** `/solucoes/autoops`
- **Momento do ciclo:** operar, junto com o n.infraops. Se um dia ganhar glifo
  próprio, o desenho é a grade de robôs com alguns acesos (a frota).
- **Roda sobre:** o cockpit da frota, com a trilha de auditoria e o cofre de
  credenciais; se é uma plataforma própria ou o ness.OS **a confirmar**.

## O glifo, em uma frase

As três camadas do "operar" lidas pelo n.autoops são **governar, sustentar e
provar**: em cima, a governança que decide o que se automatiza e com que regra;
no meio, a sustentação que mantém cada robô rodando quando uma tela ou uma
credencial muda; embaixo, a prova, que mostra a economia líquida de cada
automação. O ponto azul é a automação que está sendo cuidada agora. A promessa
do desenho: **construir robô virou commodity; o difícil é governar, sustentar e
provar o retorno, e é isso que se vende aqui**.

## Promessa (o h1 da página)

> a frota de automações governada, sustentada e com a conta de cada robô **a confirmar**

Alternativas: *"o robô é fácil; a frota é o trabalho"* · *"cada automação com a
sua conta, a sua credencial guardada e o seu registro"*.

## Apresentação (a lede)

Construir robô virou commodity; o difícil é governar, sustentar, proteger e
provar o retorno. Cuidamos da sua frota de automações inteira: acompanhamos
cada execução, corrigimos quando uma tela ou uma credencial muda, guardamos as
credenciais fora do código e mostramos a economia líquida de cada automação. O
código e a documentação são seus desde o primeiro dia.

## As três camadas da frota (o conteúdo do momento)

| Camada | O que faz | Quem age |
|---|---|---|
| 1. governar | decide o que entra na frota e com que regra: dono do processo, tratamento de exceção desenhado, credencial no cofre, critério de retirada quando a automação para de compensar | comitê seu, com a ness. propondo **a confirmar** |
| 2. sustentar | acompanha cada execução no cockpit; corrige quando a tela, a API ou a credencial muda; reprocessa o que falhou; retira de operação o que quebrou de vez | a ness. |
| 3. provar | a conta de cada robô: horas poupadas vezes o custo da hora, menos o custo da automação; a trilha de auditoria com o hash dos arquivos processados | a ness. calcula; você confere |

## Momento marcante — `a-conta-do-robo`

O leitor escolhe uma automação e vê a linha dela no cockpit: o que rodou, onde
falhou, o que a sustentação fez e quanto ela vale por mês.

| Automação escolhida | Rodou | Falhou | O que a sustentação fez | A conta |
|---|---|---|---|---|
| lançamento de notas fiscais no ERP | todo dia útil, à noite | 2 de 22, layout novo da nota | ajustou o leitor, reprocessou as 2 | horas poupadas × custo da hora − custo da automação **exemplo** |
| conciliação bancária | toda manhã | 0 | nada; credencial renovada no cofre sem parar o robô | idem **exemplo** |
| admissão de colaborador | quando o RH abre | 1, senha do portal do governo expirada | avisou o dono, trocou a credencial no cofre | idem **exemplo** |
| relatório de vendas por e-mail | semanal | 0 | recomendou retirar: o BI já faz o mesmo | conta negativa: sai da frota **exemplo** |

A tabela toda é **exemplo** e precisa dizer isso dentro da figura. Sem número
real de economia: a fórmula vai ao ar, o valor fica na proposta.

## Escopo

| | Preencher |
|---|---|
| **Dentro** | mapeamento dos processos com mais atrito; construção ou adoção da automação que existe; tratamento de exceção desenhado por automação; cofre de credenciais, entregues só na hora da execução e com o menor privilégio; monitoramento de cada execução; correção quando tela, API ou credencial muda; trilha de auditoria com hash; a conta de cada automação; recomendação de retirada |
| **Com autorização** | pôr uma automação nova em produção; dar a um robô acesso a um sistema novo; alterar a regra de negócio que a automação executa; retirar uma automação da frota |
| **Fora** | mudar o processo de negócio que a automação executa (a recomendação é da ness., a mudança é sua); licença da plataforma de automação, que é sua **a confirmar**; sistemas que o robô opera (ERP, portal, planilha): a ness. não os administra; conformidade fiscal ou jurídica do que o robô lança |
| **Fronteira** | o dono de cada processo é seu; a ness. é dona da operação do robô; quem aprova a credencial nova **a confirmar** |
| **Não promete** | que toda automação compense; economia em porcentagem; que o robô não falhe quando o sistema alvo mudar (promete a correção, não a ausência de falha) |

## O que o cliente recebe

| Artefato | Ritmo |
|---|---|
| cockpit da frota: o que rodou, quanto tempo levou, onde falhou, o que está parado | contínuo |
| trilha de auditoria de cada execução, com o hash dos arquivos processados | contínuo |
| aviso de falha e o que foi feito | quando acontece |
| a conta de cada automação (economia líquida) | mensal |
| recomendação de entrada e de retirada na frota | por ciclo de governança **a confirmar** |
| código, documentação e desenho de exceção de cada automação, no seu repositório | contínuo, é seu |
| relatório executivo da frota | mensal **a confirmar** |

## Como a operação roda

| Campo | Preencher |
|---|---|
| **Cobertura** | monitoramento contínuo das execuções; sustentação em horário **a confirmar**; robô crítico com sobreaviso **a confirmar** |
| **Passagem de plantão** | a falha e a correção ficam no cockpit; quem chega lê e continua |
| **Escalação** | falha que a sustentação não resolve sozinha aciona o dono do processo pela matriz definida na ativação; credencial expirada aciona quem a emite do seu lado |
| **Ativação** | 1. mapear: os processos com mais atrito, documentados como são e como devem ficar; 2. automatizar ou adotar: cada automação com exceção desenhada e credencial no cofre; 3. sustentar e medir: cada execução acompanhada e a conta de cada uma |
| **Caso ilustrativo (o registro que passa o turno)** | *automação: lançamento de notas · execução: 22 notas, 2 rejeitadas por layout novo · ação: leitor ajustado, 2 reprocessadas, teste com a nota de amostra · credencial: renovada no cofre, robô não parou · conta do mês: recalculada com as horas do reprocesso · pendência: dono do processo confirma o layout novo como padrão* **exemplo** |

## Serviços correlatos no mercado, e onde a ness. se diferencia

O mercado vende isto como *RPA Center of Excellence*, *automation CoE as a
service* e *managed automation operations*. O que ele diz, e o que ajuda a
escrever a página:

- **Um CoE é a função que define padrão, governança e entrega para escalar a
  automação**: descoberta de processo padronizada, gestão de mudança, e
  monitoramento contínuo dos robôs para que a iniciativa seja repetível,
  mensurável e sustentável. É a camada 1 do n.autoops, vendida como serviço e
  não montada dentro do cliente. Fontes: [tblocks, "What Is an RPA Center of Excellence?"](https://tblocks.com/glossary/rpa-center-of-excellence/); [Sunflower Lab, "RPA Center of Excellence: Setup, Governance, and Scaling"](https://thesunflowerlab.com/rpa-center-of-excellence-setup-governance-and-scaling/).
- **Governança com controle de acesso por papel e trilha de auditoria dentro
  do fluxo** é o que os provedores de referência destacam. O n.autoops já
  tem a trilha com hash e o cofre; a página deve mostrar os dois como parte da
  operação, não como recurso. Fonte: [Infosys BPM, "Enterprise RPA services"](https://www.infosysbpm.com/services/robotics-process-automation.html).
- **O modelo operacional**: governança centralizada, execução que pode ser
  distribuída conforme a maturidade; o time de operação de robôs constrói,
  roda e mantém sob padrão definido. Fonte: [Appinventiv, "How to Build an RPA Center of Excellence That Scales Without Risk"](https://appinventiv.com/blog/rpa-center-of-excellence/).

**Onde a ness. se diferencia, e a página deve dizer:** (1) a conta de cada
robô, com a fórmula publicada e a recomendação de retirar o que não compensa,
que quase ninguém publica; (2) credencial fora do código, entregue na hora da
execução, com o menor privilégio; (3) o código e a documentação são do cliente
desde o primeiro dia, sem prisão à ferramenta. **a confirmar** os três.

## O que não vai ao ar

Valor de economia em reais ou em porcentagem, número de robôs da frota de
qualquer cliente, nome da plataforma de automação, e "100 % de sucesso" ou
"zero falha". A fórmula da economia líquida vai; o número fica na proposta.
