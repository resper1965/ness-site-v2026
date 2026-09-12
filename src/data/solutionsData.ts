import { ShieldCheck, Cloud, Cpu, Workflow, Gavel } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface WorkflowStep { step: string; name: string; desc: string }
interface Service { name: string; desc: string }
interface UseCase { title: string; desc: string }
interface Feature { name: string; category: string }
export interface OnboardingStep { step: string; title: string; desc: string }
interface TechnicalFeature { title: string; desc: string }
interface PortfolioEntry { client: string; project: string; result: string }

/**
 * Um nível do modelo de severidade, contado por quem age. `time` ausente
 * significa que o time de segurança não precisa entrar naquele nível — e a
 * página diz isso em vez de deixar a coluna vazia. `ordem` descreve sequência
 * e não prazo: "contém primeiro, avisa em seguida" entra; "em 15 minutos" não —
 * número de SLA fica na proposta comercial.
 */
export interface NivelDeSeveridade {
  nivel: string;
  nome: string;
  exemplo: string;
  ordem: string;
  aiops: string;
  time?: string;
  voce: { quando: string; recebe: string };
}

/**
 * Quem decide o quê, em três zonas separadas por duas linhas: o runbook e o
 * contrato. `comAutorizacao` é a zona que as listas "dentro" e "fora" deixavam
 * sem lugar — o que a ness. executa, mas só com autorização. `fora` fica com o
 * cliente; `naoPromete` é o que ninguém garante. A coluna "fora" não é
 * ressalva jurídica: é o que faz um CISO acreditar na coluna "dentro".
 */
export interface EscopoDoServico {
  dentro: string[];
  comAutorizacao: string[];
  fora: string[];
  naoPromete?: string;
}

/** Com que ritmo o entregável chega — é o que posiciona a marca no calendário. */
export type Ritmo = 'continuo' | 'ocorrencia' | 'mensal' | 'ciclo';

/** O artefato que chega ao cliente, dito em poucas palavras, e o seu ritmo. */
export interface Entregavel { nome: string; detalhe: string; ritmo: Ritmo }

/**
 * Como a operação roda por dentro. `escalacao` é a cadeia de acionamento, e o
 * último passo é o desvio: o que acontece quando o contato não responde.
 * `caso` é um exemplo ilustrativo do registro que passa o turno.
 */
export interface OperacaoDoServico {
  escalacao: { titulo: string; texto: string }[];
  caso: { severidade: string; campos: { rotulo: string; valor: string }[]; nota: string };
  ativacao: string[];
  ativacaoNota: string;
}

export interface SolutionData {
  icon: LucideIcon;
  metaTitle?: string;
  metaDescription?: string;
  overview?: string;
  /**
   * Liga o desenho por diagramas: com `promessa`, o h1 da página é ela, e não
   * o nome do produto. Só entra quando a ficha do produto volta preenchida — o
   * teste de dados exige, junto, todas as partes do desenho.
   */
  promessa?: string;
  apresentacao?: string;
  /** Rótulos curtos das fontes de evento, no fluxo do topo da página. */
  fontes?: string[];
  fecho?: { titulo: string; texto: string };
  workflow?: WorkflowStep[];
  services?: Service[];
  ctaLabel: string;
  useCases?: UseCase[];
  features?: Feature[];
  onboarding?: OnboardingStep[];
  technicalFeatures?: TechnicalFeature[];
  portfolio?: PortfolioEntry[];
  severidade?: NivelDeSeveridade[];
  escopo?: EscopoDoServico;
  entregaveis?: Entregavel[];
  operacao?: OperacaoDoServico;
}

export const solutionsData: Record<string, SolutionData> = {

  "secops": {
    icon: ShieldCheck,
    metaTitle: "n.secops — SOC 24×7, resposta a incidentes e GRC",
    metaDescription: "Centro de operações de segurança 24×7 com detecção, resposta imediata e gestão de riscos em um único contrato. Defesa contínua sem inflar sua equipe interna.",
    // Tudo abaixo sai de docs/FICHA-runbook-por-produto.md, devolvida por
    // Ricardo Esper em 10/09/2026, e foi redesenhado em diagramas no mesmo dia.
    // Nenhum prazo numérico: a decisão foi publicar o modelo de resposta e
    // deixar o SLA na proposta comercial.
    promessa: "segurança operada 24×7, com a resposta combinada antes do incidente",
    apresentacao: "O AIOps vigia e correlaciona tudo o que chega das suas fontes e age dentro do que você já autorizou. O time de segurança entra quando é preciso julgar. Você fica sabendo do que precisa, pelo canal combinado.",
    fontes: ["identidade", "servidores", "endpoints", "firewalls", "aplicações", "cloud"],
    severidade: [
      {
        nivel: "P1",
        nome: "incidente crítico em andamento",
        exemplo: "Ransomware, movimentação lateral, credencial privilegiada comprometida ou exfiltração em curso.",
        ordem: "contém primeiro, avisa em seguida",
        aiops: "Triagem, correlação e as ações automatizadas já autorizadas.",
        time: "Assume o incidente escalado. Ação destrutiva ou de alto impacto só com a autorização prevista no runbook.",
        voce: { quando: "na hora", recebe: "Acionamento no canal combinado: contexto, o que já foi feito e o que recomendamos." },
      },
      {
        nivel: "P2",
        nome: "ameaça relevante confirmada",
        exemplo: "Atividade maliciosa com potencial de impacto, ainda sem sinal de comprometimento amplo.",
        ordem: "valida, aciona os responsáveis, executa o playbook",
        aiops: "Analisa, enriquece e prioriza.",
        time: "Entra para validar, decidir ou intervir com especialista.",
        voce: { quando: "notificação", recebe: "Contexto, evidências, classificação e recomendação de tratamento." },
      },
      {
        nivel: "P3",
        nome: "evento suspeito",
        exemplo: "Vulnerabilidade relevante ou desvio de segurança, sem exploração ativa.",
        ordem: "investiga, registra, recomenda",
        aiops: "Faz a triagem e consolida.",
        time: "Acompanha os casos que pedem investigação adicional.",
        voce: { quando: "no acompanhamento", recebe: "Registro e recomendação, no canal ou na reunião periódica, conforme a relevância." },
      },
      {
        nivel: "P4",
        nome: "evento informativo",
        exemplo: "Desvio de baixa criticidade ou melhoria sugerida, sem ameaça ativa.",
        ordem: "registra, classifica, alimenta as tendências",
        aiops: "Trata, registra e ajusta a detecção.",
        voce: { quando: "no relatório", recebe: "Métricas e tendências do mês." },
      },
    ],
    escopo: {
      dentro: [
        "Monitoramento e correlação em on-premise e cloud",
        "Integração com o EDR e o antivírus que você já usa",
        "Detecção comportamental e threat hunting",
        "Contenção já autorizada",
        "Gestão de vulnerabilidades, inventário e hardening",
        "Monitoramento e gestão remota dos ativos (RMM)",
        "Threat intelligence, evidências e relatórios",
      ],
      comAutorizacao: [
        "Mudança com impacto relevante em produção",
        "Ação com risco de indisponibilidade ou risco operacional",
        "Alteração de regra de negócio",
        "Ação destrutiva ou de alto impacto em incidente",
        "Patch e ação remota, só nas janelas e políticas de mudança acordadas",
      ],
      fora: [
        "Decisões de continuidade de negócio",
        "Administração funcional das suas aplicações",
        "Correção de código-fonte e desenvolvimento",
      ],
      naoPromete: "O contrato também não promete substituir as ferramentas de segurança que você já tem, nem eliminar todo risco, vulnerabilidade ou incidente.",
    },
    entregaveis: [
      { nome: "portal da operação", detalhe: "contínuo: eventos, vulnerabilidades, ativos, postura e tratativas", ritmo: "continuo" },
      { nome: "inventário dos ativos", detalhe: "contínuo, consolidado de tempos em tempos", ritmo: "continuo" },
      { nome: "notificações e acionamentos", detalhe: "quando acontece, conforme a severidade", ritmo: "ocorrencia" },
      { nome: "relatório executivo", detalhe: "mensal: o que aconteceu, o que foi feito, o que recomendamos", ritmo: "mensal" },
      { nome: "relatório de vulnerabilidades", detalhe: "mensal, com o andamento das correções", ritmo: "mensal" },
      { nome: "evidências para auditoria", detalhe: "no ritmo do seu ciclo de governança e auditoria", ritmo: "ciclo" },
    ],
    operacao: {
      escalacao: [
        { titulo: "o evento ganha severidade", texto: "O AIOps classifica. A severidade e o playbook dizem quem precisa saber." },
        { titulo: "a matriz aponta o responsável", texto: "A matriz de contatos definida no onboarding diz quem responde por aquele tipo de evento." },
        { titulo: "o contato principal é acionado", texto: "No canal direto com a operação, com o contexto do caso." },
        { titulo: "sem resposta, a escalação segue", texto: "Vai para o próximo contato da cadeia combinada, e depois para o seguinte." },
      ],
      caso: {
        severidade: "P2",
        campos: [
          { rotulo: "evento", valor: "Login de conta administrativa às 02:10, de um país sem histórico" },
          { rotulo: "evidências", valor: "Logs do provedor de identidade e alerta do EDR no mesmo host" },
          { rotulo: "enriquecimento", valor: "IP em lista de ameaças; MFA desativado na conta" },
          { rotulo: "ações automatizadas", valor: "Sessão encerrada, dentro do que o playbook autoriza" },
          { rotulo: "decisões", valor: "Time de segurança confirmou; você autorizou o reset da credencial" },
          { rotulo: "comunicação", valor: "Notificação no canal combinado às 02:14" },
          { rotulo: "pendências", valor: "Reativar o MFA e revisar o acesso condicional" },
        ],
        nota: "É assim que o turno passa: quem chega lê o caso e continua dali, sem depender de quem saiu.",
      },
      ativacao: [
        "diagnóstico do ambiente",
        "instalação ou integração dos componentes",
        "conexão das fontes e das ferramentas que você já usa",
        "inventário e baseline",
        "RMM, regras, playbooks e automações",
        "ajuste fino",
        "operação contínua",
      ],
      ativacaoNota: "A duração depende do porte, da quantidade de ativos, das fontes de log e das integrações. O prazo do seu ambiente sai do diagnóstico.",
    },
    fecho: {
      titulo: "comece pelo diagnóstico",
      texto: "Mapeamos o ambiente, as fontes de evento e as ferramentas que você já usa. É a primeira etapa da ativação, e dela sai o prazo.",
    },
    ctaLabel: "solicitar diagnóstico de segurança",
  },
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
};
