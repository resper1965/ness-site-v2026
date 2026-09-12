# Ficha — ness.OS

> **Rascunho de 11/09/2026, a validar pelo time que opera.** Escrito a partir da
> descrição que o Ricardo passou. Campo marcado **a confirmar** é inferência
> minha: corrija ou apague. Seção sem resposta não aparece no site.
>
> Três regras, as mesmas de `FICHA-runbook-por-produto.md`: **nada de número de
> SLA** (o modelo vai ao ar, o número fica na proposta); **nada de absoluto sem
> fonte**; **diga o que não está no escopo** — é a parte que constrói confiança.

- **Empresa:** ness. · **Categoria:** plataforma · **Endereço:** `/solucoes/ness-os`
- **Grafia:** `ness.OS`, com "OS" em maiúsculo e o ponto azul. É a única exceção
  à marca em caixa baixa.
- **Quem roda sobre ela:** n.secops e n.infraops. O n.pentest devolve os achados
  corrigidos para o monitoramento.

## Promessa (o h1 da página)

> a operação de segurança que age, não só avisa **a confirmar**

## Apresentação (a lede)

A plataforma própria de operações de segurança da ness., usada pelo seu time e
pelo nosso: ela junta infraestrutura e segurança numa esteira só — o evento
entra, é triado, o que o runbook autoriza é contido na hora, e o que muda o
ambiente espera a sua aprovação.

## As três camadas (o conteúdo do momento)

| Camada | O que faz | Quem age |
|---|---|---|
| 1. ingestão e triagem, 24×7 | Recebe a telemetria, normaliza, correlaciona, descarta o ruído conhecido e abre o incidente já com contexto: máquina, usuário, vulnerabilidade associada e criticidade | AIOps |
| 2. ação controlada | Aplica patch, contém a máquina, bloqueia credencial — **só o que o runbook já autoriza**, na janela de menor impacto | AIOps, sob runbook |
| 3. decisão humana e governança | Ação de alto impacto espera aprovação formal de mudança (GMUD); toda ação fica na trilha de auditoria | time de segurança e você |

**Fontes que entram na camada 1** (confirmar a lista): firewalls e gateways de
rede, identidades em nuvem, estações e servidores, plataformas de proteção de
endpoint. **a confirmar**

## Momento marcante — `fronteira`

O leitor escolhe uma ação e vê em que camada ela cai e se espera aprovação.

| Ação escolhida | Camada | O que acontece | Espera aprovação? |
|---|---|---|---|
| aplicar patch crítico num servidor de produção | 2 → 3 | a correção é preparada e agendada | sim, GMUD — **quem aprova, do seu lado: a confirmar** |
| isolar uma estação com malware | 2 | a máquina sai da rede na hora | não, quando o runbook autoriza |
| bloquear uma credencial anômala | 2 | o acesso é revogado e o dono é avisado | não, quando o runbook autoriza |
| atualizar um aplicativo de terceiro nas estações | 2 | entra na janela de manutenção | **a confirmar** |

Marcadores por ator, como no n.secops: AIOps em círculo cheio `#00ade8`, time de
segurança em anel `#7bd0ff`, você em círculo cheio `#dae2fd`.

## Escopo

| | Preencher |
|---|---|
| **Dentro** | ingestão e triagem contínuas; contenção e bloqueio autorizados pelo runbook; aplicação de correção; registro de tudo |
| **Com autorização** | qualquer ação de alto impacto: mudança em produção, parada de serviço, alteração de regra de rede **a confirmar** |
| **Fora** | **a confirmar** — o que a plataforma não faz (ex.: não substitui o EDR, não gerencia identidade, não opera a aplicação do cliente?) |
| **Fronteira** | quem aprova a janela de mudança e quem é dono do ativo **a confirmar** |

## O que o cliente recebe

| Artefato | Ritmo |
|---|---|
| incidentes com contexto (máquina, usuário, criticidade) | quando acontece |
| postura e vulnerabilidades do parque | contínuo |
| trilha de auditoria das ações | contínuo |
| relatório executivo | **a confirmar** |

## Como a operação roda

| Campo | Preencher |
|---|---|
| Cobertura | 24×7 na camada 1 (confirmar as demais) **a confirmar** |
| Ativação | **a confirmar** — do contrato até estar recebendo evento |
| Onde roda | em nuvem, sem appliance nem servidor coletor no cliente; agentes nos equipamentos e conectores nas contas de nuvem |
| Conformidade | indicadores organizados pelo CIS Controls v8 e pela ISO/IEC 27001:2022 |
| Ciclo fechado | os achados do n.pentest, depois de corrigidos, voltam para o monitoramento contínuo |

## Alegações com fonte registrada

Em `docs/PESQUISA-metricas.md`, confirmadas por Ricardo Esper em 11/09/2026:

- toda ação fica numa trilha de auditoria imutável;
- não exige infraestrutura local no cliente.

## O que não vai ao ar

Do texto de origem, até haver medição com fonte: "em minutos", "quase imediato",
"redução drástica de ruído", "autônoma" como absoluto, e a tabela comparativa
com SOC e RMM "tradicionais". O ator automatizado se chama **AIOps** — nunca
"agentes de IA" nem "agentic". Como a plataforma é construída (linguagem,
provedor, modelo) não aparece no site.
