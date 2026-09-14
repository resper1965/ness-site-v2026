# Ficha — n.infraops

> **Rascunho de 14/09/2026, a validar pelo time que opera.** Escrito a partir do
> glifo do momento "operar" (as três frentes, `GlifoDoMomento.tsx`), do que o
> site já publica em `solutionsData.ts` e de uma pesquisa de serviços correlatos
> no mercado (seção no fim). Campo marcado **a confirmar** é inferência minha:
> corrija ou apague. Seção sem resposta não aparece no site.
>
> Três regras, as mesmas de `FICHA-runbook-por-produto.md`: **nada de número de
> SLA**; **nada de absoluto sem fonte**; **diga o que não está no escopo**.

- **Empresa:** ness. · **Categoria:** serviço (operação contínua) · **Endereço:** `/solucoes/infraops`
- **Momento do ciclo:** operar. Divide a coluna com o n.autoops; o glifo é o
  mesmo para os dois.
- **Roda sobre:** o ness.OS, que registra chamado, mudança e ação na mesma
  trilha do n.secops **a confirmar**.

## O glifo, em uma frase

Três camadas, uma sobre a outra, e um ponto azul na do meio. As camadas são as
três frentes: em cima, **o atendimento** a quem usa; no meio, **a sustentação
técnica** que mantém o ambiente de pé; embaixo, **a arquitetura** que o desenha
e evolui. O ponto azul marca a frente que está agindo agora. O desenho promete:
**todo pedido e todo alerta cai numa frente, e cada frente sabe o que é dela**.

## Promessa (o h1 da página)

> a infraestrutura cuidada em três frentes, com cada mudança registrada e o plano de volta **a confirmar**

Alternativas: *"quem usa é atendido, o ambiente fica de pé, o desenho evolui"* ·
*"três frentes, um registro só"*.

## Apresentação (a lede)

Cuidamos da sua infraestrutura em três frentes: o atendimento a quem usa, a
sustentação técnica que mantém o ambiente de pé e a arquitetura que desenha e
evolui o ambiente, on-premises, em nuvem ou híbrido. Tudo vira registro, e
nenhuma mudança entra sem o plano de volta.

## As três frentes (o conteúdo do momento)

| Frente | O que ela cuida | Como chega | Quem age |
|---|---|---|---|
| 1. atendimento | quem usa: acesso, estação, aplicativo, dúvida | pedido do usuário, no canal combinado | atendimento em níveis; o que se repete vira solução documentada |
| 2. sustentação técnica | o ambiente: servidor, rede, backup, patch, capacidade | alerta do monitoramento ou pedido escalado do atendimento | sustentação, com cada mudança registrada e o plano de volta |
| 3. arquitetura | o desenho: o que precisa mudar de forma, migrar, crescer ou custar menos | pedido de projeto ou recomendação da sustentação | arquitetura, com você decidindo |

**A regra de passagem entre frentes:** o atendimento resolve o que é de uso; o
que é do ambiente sobe para a sustentação; o que pede mudança de desenho sobe
para a arquitetura. Ninguém "empurra" o chamado: ele muda de frente com o
histórico junto. **a confirmar:** os critérios objetivos de cada passagem.

## Momento marcante — `quem-cuida`

O leitor escolhe um pedido ou um alerta e vê em que frente ele cai e se precisa
de mudança registrada.

| Escolhido | Frente | O que acontece | Mudança registrada? |
|---|---|---|---|
| "não consigo entrar no e-mail" | 1 | atendimento resolve; se for a terceira vez no mês, vira solução documentada | não |
| disco do servidor de arquivos em 90 % | 2 | sustentação limpa o que pode e amplia o volume | sim, com o plano de volta |
| "precisamos de um ambiente novo para o projeto X" | 3 → 2 | arquitetura desenha, você aprova, sustentação constrói | sim, por etapa |
| a conta da nuvem subiu 30 % em um mês | 3 | arquitetura analisa consumo e propõe o ajuste; o corte é decisão sua | depende do ajuste **a confirmar** |
| restaurar um arquivo apagado ontem | 2 | sustentação restaura do backup e registra | não; fica no histórico do chamado |

Marcadores por ator, como no n.secops: AIOps e monitoramento em círculo cheio
`#00ade8`, o time da ness. em anel `#7bd0ff`, você em círculo cheio `#dae2fd`.

## Escopo

| | Preencher |
|---|---|
| **Dentro** | atendimento a quem usa, em níveis; operação, manutenção, correção e patch do ambiente; monitoramento e capacidade; backup e recuperação; desenho e evolução do ambiente on-premises, em nuvem e híbrido; registro de chamado, mudança e inventário; recomendação de custo de nuvem **a confirmar** |
| **Com autorização** | mudança com impacto em produção; parada de serviço; migração; troca de fornecedor de nuvem ou de link; qualquer corte de custo que reduza capacidade |
| **Fora** | administração funcional das suas aplicações (ERP, CRM, sistema de negócio); desenvolvimento e correção de código (n.devarch); monitoramento de segurança e resposta a incidente (n.secops); compra de hardware e de licença, que é sua; contratos com a operadora e com o provedor de nuvem, que continuam seus |
| **Fronteira** | quem aprova a janela de mudança (você); quem é dono do ativo e do dado (você); quem aplica patch em produção e em que janela **a confirmar** |
| **Não promete** | ambiente sem indisponibilidade; substituir o seu time de TI, quando ele existe (a ativação prevê apoio antes de assumir a frente); redução de custo de nuvem em porcentagem |

## O que o cliente recebe

| Artefato | Ritmo |
|---|---|
| registro de cada chamado, com a solução documentada para o que se repete | contínuo |
| registro de cada mudança, com o plano de volta | por mudança |
| inventário dos ativos | contínuo, consolidado de tempos em tempos |
| relatório de capacidade e de backup (o que foi testado, o que falhou) | mensal **a confirmar** |
| relatório de consumo e custo de nuvem, com recomendações | mensal **a confirmar** |
| relatório executivo: chamados, mudanças, incidentes de infraestrutura e o que recomendamos | mensal |
| desenho atualizado do ambiente | quando o ambiente muda |

## Como a operação roda

| Campo | Preencher |
|---|---|
| **Cobertura** | atendimento em horário comercial ou estendido **a confirmar**; sustentação com sobreaviso fora do horário para o que o monitoramento acusa **a confirmar** |
| **Passagem de plantão** | o chamado e a mudança ficam no registro; quem chega lê e continua |
| **Escalação** | atendimento sem solução sobe para a sustentação; a sustentação aciona o contato do cliente pela matriz definida na ativação; sem resposta, o próximo da cadeia |
| **Ativação** | 1. diagnóstico: ambiente, ativos e o atendimento que já existe; 2. montagem: registro de chamados e mudanças, inventário; 3. *shadowing*: o time acompanha o seu, aprende a rotina e documenta os runbooks; 4. go-live: apoio ao seu time até assumir a frente, com o mesmo registro |
| **Caso ilustrativo (o registro que passa o turno)** | *chamado: lentidão no sistema de vendas às 09:40 · atendimento: reproduziu, não é da estação · sustentação: banco com 95 % de CPU, consulta nova sem índice · ação: índice criado em homologação, mudança aberta para produção na janela de hoje à noite, plano de volta pronto · arquitetura: recomendou revisar a capacidade do banco antes do fechamento do mês · pendência: aprovação sua da janela* **exemplo** |

## Serviços correlatos no mercado, e onde a ness. se diferencia

O mercado chama isto de *infrastructure managed services* e, cada vez mais,
vende junto a governança de custo de nuvem (FinOps). Três pontos que ajudam a
escrever a página:

- **Escopo em camadas**: os serviços de infraestrutura gerenciada cobrem todas
  as camadas (nuvem, on-premises, híbrido), incluindo as de baixo nível
  (físico e virtualização) que os serviços "só de nuvem" costumam deixar de
  fora. O n.infraops cabe nessa definição, e a página deve dizer que o
  on-premises está dentro. Fonte: [Opsio, "What Are Infrastructure Managed Services?"](https://opsiocloud.com/knowledge-base/what-are-infrastructure-managed-services/).
- **FinOps como parte do serviço**: visibilidade do gasto, ajuste de tamanho
  e eliminação de desperdício entram no pacote dos provedores de referência.
  A frente de arquitetura do n.infraops já faz "custar menos" na prática; a
  página pode nomear isso, sem prometer porcentagem. Fontes: [Microsoft Learn, "FinOps Framework overview"](https://learn.microsoft.com/en-us/cloud-computing/finops/framework/finops-framework); [InterVision, "Managed FinOps"](https://intervision.com/services/managed-finops/).
- **Service desk com triagem assistida por IA** é o que os grandes vendem
  como diferencial. Na ness. isso é o AIOps do ness.OS classificando o chamado
  antes de a pessoa pegar; vale dizer com o mesmo vocabulário do n.secops.
  Fonte: [Milestone Technologies, "Infrastructure Managed Services"](https://milestone.tech/services/digital-workplace-cloud-and-infrastructure-services/infrastructure-managed-services/).

**Onde a ness. se diferencia, e a página deve dizer:** (1) as três frentes
compartilham um registro só, e o chamado muda de frente com o histórico junto;
(2) nenhuma mudança entra sem o plano de volta; (3) a mesma plataforma que
opera a infraestrutura opera a segurança (ness.OS), então o alerta de
infraestrutura e o evento de segurança se cruzam. **a confirmar** os três.

## O que não vai ao ar

Percentual de redução de custo, tempo de resposta do atendimento em minutos,
disponibilidade em "noves", número de pessoas do time e nome das ferramentas
de monitoramento. Os exemplos do momento marcante são ilustrativos e ficam
rotulados como exemplo.
