# Ficha — n.csirt

> **Rascunho de 11/09/2026, a validar pelo time que opera.** Escrito a partir da
> descrição que o Ricardo passou. Campo marcado **a confirmar** é inferência
> minha: corrija ou apague. Seção sem resposta não aparece no site.
>
> Três regras, as mesmas de `FICHA-runbook-por-produto.md`: **nada de número de
> SLA**; **nada de absoluto sem fonte**; **diga o que não está no escopo**.

- **Empresa:** ness. · **Categoria:** plataforma · **Endereço:** `/solucoes/n-csirt`
- **Quem roda sobre ela:** o n.cirt, que é o comando da crise, fica acima dela e
  puxa o que a perícia e o jurídico precisam. A plataforma também é vendida a
  CSIRTs e operadoras de terceiros.
- **Para quem é:** centros de operação de segurança, times de resposta a
  incidentes e operadoras de infraestrutura crítica.

## Promessa (o h1 da página)

> o incidente entra pelo cockpit e sai com a notificação no prazo **a confirmar**

## Apresentação (a lede)

O cockpit onde o incidente é triado, enriquecido e levado pelos estágios do
ciclo de vida — e onde a notificação obrigatória é despachada para quem a lei
manda avisar, sem depender de alguém lembrar do prazo no meio da crise.

## O que ele faz

| Bloco | O que faz |
|---|---|
| cockpit do CSIRT | triagem, enriquecimento e avanço do incidente por estágios do ciclo de vida |
| entrada de alertas | recebe o que o SIEM e os agentes do SOC mandam, por integração **a confirmar quais** |
| oito runbooks | ransomware, phishing, vazamento de dados, DDoS, transbordo para TO/SCADA, malware, defacement e zero-day |
| cadeia de custódia | pacote no padrão STIX 2.1, relatório com integridade conferida por SHA-256 e marcação TLP |
| canal regulatório | despacha a notificação ao CTIR Gov/GSI, ao CARCCiber/ONS e à ANPD |

## Momento marcante — `a-quem-notificar`

O leitor escolhe o incidente e vê o runbook que abre, a marcação TLP e quem
precisa ser avisado.

| Incidente escolhido | Runbook | Quem recebe a notificação |
|---|---|---|
| ransomware num órgão federal | ransomware | CTIR Gov/GSI **a conferir** |
| vazamento de dado pessoal | vazamento | ANPD **a conferir** |
| incidente na tecnologia de operação de um agente do setor elétrico | transbordo para TO/SCADA | CARCCiber/ONS **a conferir** |
| defacement num site institucional | defacement | **a confirmar** |

**As referências regulatórias precisam de conferência antes de ir ao ar:**
Decreto 10.748/2021 (CTIR Gov/GSI), Submódulo 5.13 e RO-CB.BR.01 (CARCCiber/ONS),
e a resolução da ANPD que trata de comunicação de incidente. Número de decreto ou
de submódulo errado é o tipo de erro que um CISO de infraestrutura crítica
percebe na hora. **Prazo em horas só entra com a norma citada ao lado.**

## Escopo

| | Preencher |
|---|---|
| **Dentro** | registro e triagem do incidente, execução dos runbooks, geração da cadeia de custódia, despacho da notificação |
| **Com autorização** | **a confirmar** — que ações a plataforma executa no ambiente, se alguma |
| **Fora** | **a confirmar** — ela não detecta (quem detecta é o SIEM/EDR?), não substitui o SOC, não responde pelo cliente perante o regulador? |
| **Fronteira** | quem assina a notificação e quem decide o TLP **a confirmar** |

## O que o cliente recebe

| Artefato | Ritmo |
|---|---|
| incidente com o histórico do ciclo de vida | quando acontece |
| pacote de cadeia de custódia (STIX 2.1) e relatório com hash | por incidente |
| comprovante do despacho regulatório | por notificação **a confirmar** |

## Como a operação roda

| Campo | Preencher |
|---|---|
| Quem opera | o CSIRT do cliente, o time da ness., ou os dois **a confirmar** |
| Ativação | **a confirmar** — do contrato até receber o primeiro alerta |
| Contingência | **a confirmar** — o que acontece se a plataforma ficar indisponível durante a crise |

## O que não vai ao ar

Como a plataforma é construída (provedor, autenticação, banco, formato de
chave) e o absoluto "100% client-side" do texto de origem. Nada de prazo
regulatório sem a norma ao lado.
