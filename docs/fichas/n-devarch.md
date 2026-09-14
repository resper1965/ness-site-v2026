# Ficha — n.devarch

> **Rascunho de 14/09/2026, a validar pelo time que opera.** Escrito a partir do
> glifo do momento "construir" (os portões, `GlifoDoMomento.tsx`), do que o site
> já publica em `solutionsData.ts` e de uma pesquisa de serviços correlatos no
> mercado (seção no fim). Campo marcado **a confirmar** é inferência minha:
> corrija ou apague. Seção sem resposta não aparece no site.
>
> Três regras, as mesmas de `FICHA-runbook-por-produto.md`: **nada de número de
> SLA**; **nada de absoluto sem fonte**; **diga o que não está no escopo**.

- **Empresa:** ness. · **Categoria:** serviço (célula dedicada) · **Endereço:** `/solucoes/devarch`
- **Momento do ciclo:** construir. É o primeiro glifo da home: a linha do código
  atravessa três portões, e o ponto azul já passou pelo último.
- **Com quem conversa:** o n.pentest devolve achados para a esteira; o n.secops
  recebe o inventário de componentes (SBOM) do que foi entregue **a confirmar**.

## O glifo, em uma frase

Uma linha que atravessa três portões. Cada portão é uma pergunta que o código
responde antes de seguir: *o desenho aguenta?* (arquitetura), *o código é
seguro?* (revisão e análise), *o que sai está provado?* (testes). O ponto azul
no fim é a entrega que passou pelos três. O desenho promete uma coisa só: **nada
chega à produção sem atravessar os portões**, e é isso que a ficha precisa
sustentar.

## Promessa (o h1 da página)

> segurança que entra no desenho, não no retrabalho **a confirmar**

Alternativas, se a primeira soar genérica: *"uma célula dedicada ao seu produto,
com os portões que o código atravessa"* · *"o código passa por três portões
antes de ser seu"*.

## Apresentação (a lede)

Uma célula dedicada ao seu produto, que junta desenvolvimento, arquitetura e
segurança de software num time só. O desenho é revisado antes do código, o
código passa por revisão e análise a cada mudança, e nada chega à produção sem
teste. O código, a esteira e a documentação são seus desde o primeiro dia.

## Os três portões (o conteúdo do momento)

| Portão | O que se pergunta | O que acontece | Quem age |
|---|---|---|---|
| 1. arquitetura | o desenho aguenta o que vem? | revisão da arquitetura que existe, desenho do que vem, modelagem de ameaças por funcionalidade | arquiteto da célula com o seu time de produto |
| 2. código | o que mudou é seguro? | revisão por pares, análise estática do código e das dependências a cada mudança, inventário dos componentes (SBOM) | a célula, na esteira do seu repositório |
| 3. testes | o que sai está provado? | testes automatizados e de segurança, de aplicação e de API, antes da homologação e da produção | a célula; a homologação é sua |

**O que um portão fechado significa:** a mudança não segue. Não é um aviso que
alguém pode ignorar; é a esteira que para. **a confirmar:** quem pode abrir um
portão em caráter excepcional (hotfix de produção), e como isso fica registrado.

## Momento marcante — `portoes`

O leitor escolhe uma mudança e vê por quais portões ela passa e onde ela pode
parar.

| Mudança escolhida | Portão 1 | Portão 2 | Portão 3 | Onde costuma parar |
|---|---|---|---|---|
| nova funcionalidade com dado pessoal | modelagem de ameaças e desenho do dado | revisão e análise; dependência nova entra no SBOM | teste de aplicação e de API | no portão 1, quando o dado não tem dono nem prazo de retenção |
| atualização de uma dependência com CVE | passa direto **a confirmar** | análise da dependência e do que ela toca | testes de regressão | no portão 2, quando a versão corrigida quebra a API |
| hotfix em produção | passa com registro **a confirmar** | revisão por par, mesmo com urgência | os testes que existem para aquele caminho | não para; fica registrado quem abriu o portão e por quê **a confirmar** |
| mudança de esquema de banco | desenho da migração e do plano de volta | revisão da migração | teste da migração num ambiente igual ao seu | no portão 1, sem plano de volta |

Marcadores por ator, como no n.secops: a célula em anel `#7bd0ff`, você em
círculo cheio `#dae2fd`; a esteira automatizada em círculo cheio `#00ade8`.

## Escopo

| | Preencher |
|---|---|
| **Dentro** | revisão e desenho de arquitetura; modelagem de ameaças; desenvolvimento pela célula; revisão de código; análise estática de código e de dependências; SBOM; testes automatizados e de segurança de aplicação e de API; a esteira configurada no seu repositório; documentação e passagem para o seu time |
| **Com autorização** | mudança em produção; mudança de esquema de banco; troca de dependência de base (framework, runtime); abertura excepcional de um portão **a confirmar** |
| **Fora** | operar a aplicação em produção (é do n.infraops ou do seu time); monitoramento de segurança do ambiente (n.secops); teste de intrusão independente (n.pentest); decisão de produto e priorização do backlog, que continuam suas; suporte ao usuário final |
| **Fronteira** | quem homologa (você) e quem publica em produção **a confirmar**; a quem pertence o código e a esteira (a você, desde o primeiro dia) |
| **Não promete** | eliminar toda vulnerabilidade do software; substituir o seu time de produto; velocidade de entrega fixa em número de histórias por sprint |

## O que o cliente recebe

| Artefato | Ritmo |
|---|---|
| desenho de arquitetura e modelo de ameaças por funcionalidade | por funcionalidade, revisado quando o desenho muda |
| relatório dos portões: o que passou, o que parou e por quê | por entrega **a confirmar** |
| inventário dos componentes do software (SBOM) | a cada entrega |
| resultado das análises de código e de dependências | contínuo, na esteira |
| relatório de testes de aplicação e de API | por entrega |
| código, esteira e documentação no seu repositório | contínuo, é seu |
| relatório executivo: o que a célula entregou, o que parou nos portões, o que recomendamos | mensal **a confirmar** |

## Como a operação roda

| Campo | Preencher |
|---|---|
| **Formato da célula** | time dedicado, com arquiteto, desenvolvedores e um responsável por segurança de aplicação; composição por porte **a confirmar** |
| **Rito** | ciclo de entrega no ritmo do seu produto; revisão de arquitetura no início de cada funcionalidade; retrospectiva por ciclo **a confirmar** |
| **Escalação** | impedimento técnico sobe ao arquiteto da célula; decisão de produto sobe a você; quem o cliente aciona quando a célula não responde **a confirmar** |
| **Ativação** | 1. sessões de arquitetura; 2. as regras de segurança entram nos repositórios e na esteira; 3. a esteira passa a rodar as verificações a cada mudança; 4. treinamento e documentação para o seu time assumir a rotina |
| **Ferramentas** | as suas, de preferência; a lista do que a célula traz quando não há nada **a confirmar** (repositório, esteira, análise estática, gestão de dependências) |
| **Caso ilustrativo (o registro que passa o ciclo)** | *funcionalidade: exportação de relatório com dado pessoal · portão 1: dado classificado, retenção de 90 dias definida por você · portão 2: biblioteca de PDF atualizada, CVE fechada, SBOM atualizado · portão 3: teste de API cobre o filtro por perfil · pendência: revisar o log de acesso ao relatório* **exemplo** |

## Serviços correlatos no mercado, e onde a ness. se diferencia

O que o mercado vende como *squad as a service*, *DevSecOps* e *AppSec* costuma
separar três coisas que a célula junta: o time que desenvolve, o time que revisa
segurança e o time que testa. Duas referências que ajudam a escrever a página:

- **Portões de qualidade** são pontos de verificação com critério mensurável
  em cada fase do ciclo (requisitos, desenho, código, integração, teste); a
  mudança só segue quando cumpre o critério. É exatamente o desenho dos três
  portões, e a linguagem "quality gate" pode aparecer no texto em inglês da
  página. Fontes: [testRigor, "Software Quality Gates"](https://testrigor.com/blog/software-quality-gates/); [Dynatrace, "What are quality gates?"](https://www.dynatrace.com/news/blog/what-are-quality-gates-how-to-use-quality-gates-with-dynatrace/).
- **Revisão de arquitetura como checkpoint do ciclo, não como atividade à
  parte da segurança**: fronteiras de confiança, identidade, tratamento de dado
  e controles operacionais desenhados, não adicionados depois. Fonte: [Security Boulevard, "Secure design reviews and architecture checkpoints in the SDLC" (08/2026)](https://securityboulevard.com/2026/08/secure-design-reviews-and-architecture-checkpoints-in-the-sdlc-2/).
- **Dois modelos de organização de AppSec**: o centralizado (um time de AppSec
  que atende vários times, e vira gargalo a partir de uma certa proporção) e o
  distribuído (um responsável por segurança dentro de cada time, com um núcleo
  pequeno). A célula do n.devarch é o modelo distribuído vendido como serviço:
  o responsável por segurança já vem dentro do time. Fonte: [Palo Alto Networks, "What Is SDLC Security?"](https://www.paloaltonetworks.com/cyberpedia/what-is-secure-software-development-lifecycle).

**Onde a ness. se diferencia, e a página deve dizer:** (1) a célula é uma só,
não três fornecedores; (2) o código, a esteira e a documentação são do cliente
desde o primeiro dia, e a ativação termina com a passagem para o time dele;
(3) o portão fechado para a esteira, não gera um aviso. **a confirmar** os três.

## O que não vai ao ar

Nome de ferramenta de análise estática ou de esteira (muda por cliente), número
de desenvolvedores por célula, velocidade em histórias por sprint, cobertura de
teste em porcentagem, e qualquer "100 % seguro". Os números da seção de mercado
(proporção de AppSec por desenvolvedor) ficam aqui, como contexto, e não na
página.
