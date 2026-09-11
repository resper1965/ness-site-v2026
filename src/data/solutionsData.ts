import { ShieldCheck, Cloud, Cpu, Brain, Gavel } from 'lucide-react';
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
    metaTitle: "n.infraops — operações de infraestrutura e cloud com FinOps",
    metaDescription: "Suporte técnico e operação de infraestrutura híbrida com ITIL, automação e IA aplicada. Nuvem elástica, custos previsíveis e uptime garantido.",
    overview: "Infraestrutura instável gera downtime, insatisfação de usuários e desperdício financeiro. O n.infraops assume a operação completa do seu ambiente — do Service Desk L1/L2/L3 à gestão de ITIL e Cloud — liberando seu time interno de apagar incêndios para focar puramente em inovações de alto nível.",
    workflow: [
      { step: "01", name: "Assessment Inicial", desc: "Mapeamento minucioso da infraestrutura atual, descobrindo ativos não documentados, processos e identificando os pain points com SLAs reais." },
      { step: "02", name: "Setup ITSM e CMDB", desc: "Estruturação rigorosa da ferramenta de serviços, desenhando os workflows ITIL (Incident/Change/Problem) e a malha conectada de gestão de ativos." },
      { step: "03", name: "Operação e SLA Ativo", desc: "Assumimos as trincheiras. Nossos Service Desks L1 e L2 passam a responder os chamados enquanto reportamos indicadores SLO/SLI limpos para a liderança." }
    ],
    services: [
      { name: "Service Desk L1/L2/L3 (ITIL)", desc: "Triagem, escalonamento e resolução sob rigorosos processos ITIL. Encerramos tickets velozmente documentando soluções para problemas repetitivos." },
      { name: "AIOps e Orquestração Autônoma (SOAR)", desc: "Vigilância impulsionada por agentes de Inteligência Artificial. Malhas de sensores detectam anomalias, executam fluxos de mitigação antes do impacto e atualizam seus dashboards de integridade automagicamente." },
      { name: "Backup Strategy & Disaster Recovery", desc: "Engenharia voltada para salvaguardar a continuidade do negócio. Criamos cofres de dados com RTO e RPO matemáticos para recuperação instantânea de desastres." }
    ],
    ctaLabel: "agendar assessment (1-2s)",
    useCases: [
      { title: "TI enxuta precisa escalar Atendimento sem inchar a folha", desc: "Assumimos as linhas iniciais L1 e L2, resolvendo rapidamente o volume. Seu board foca em inovação, derrubando o ticket backlog em mais da metade na primeira semana." },
      { title: "Fadiga de alertas de Infraestrutura esgotando os engenheiros", desc: "Implementação de modelo agentico de monitoramento. Nossa IA investiga ocorrências, auto-resolve incidentes comuns via orquestração e só abre chamados documentados para humanos em falhas críticas reais." },
      { title: "A Diretoria exige relatórios de compliance para a próxima rodada", desc: "A adoção rigorosa de processos ITIL, Change Management (CAB) com rollbacks e relatórios abrem imediatamente o caminho em auditorias rigorosas como SOC 2 e ISO." },
      { title: "A empresa perdeu dinheiro renovando licenças que não usava", desc: "Implementação profunda de CMDB e Gestão de Capacidade. Auditamos periodicamente ativos de software e hardware matando o desperdício de recursos inativos ou ociosos." }
    ],
    features: [
      { name: "Agentes Autônomos de NOC", category: "AIOps" },
      { name: "Orquestração de Resposta (SOAR)", category: "Automação" },
      { name: "Service Desk L1/L2/L3", category: "Atendimento" },
      { name: "Gestão de Ativos (CMDB / ITAM)", category: "Governança" },
      { name: "Painéis de Autonomia SLO/SLI", category: "Monitoramento" },
      { name: "Planos RPO / RTO em Backup", category: "Continuidade" },
      { name: "Cloud Migration Strategy", category: "Operação" },
      { name: "Relatórios de Evidência ITIL", category: "Auditoria" }
    ],
    onboarding: [
      { step: "01", title: "Discovery", desc: "Assessment de arquitetura e dores em 1-2 semanas." },
      { step: "02", title: "Setup ITSM", desc: "Customização das vias de ITIL e importação do CMDB." },
      { step: "03", title: "Shadowing", desc: "Transferência de conhecimento documentando runbooks da sua própria TI." },
      { step: "04", title: "Go-Live Híbrido", desc: "Atuação como backup/suporte até atingirmos autonomia total nos protocolos." }
    ],
    technicalFeatures: [],
    portfolio: [
      { client: "Logística Nacional", project: "Help Desk + CMDB", result: "Redução de MTTR em mais de 78% nos primeiros meses." }
    ]
  },
  "devarch": {
    icon: Cpu,
    metaTitle: "n.devarch — engenharia e arquitetura de software sob medida",
    metaDescription: "Squads de engenharia de software de alta performance: arquitetura, desenvolvimento seguro (DevSecOps) e modernização de sistemas críticos.",
    overview: "Segurança que entra no fim do ciclo é retrabalho. O n.devarch embarca Segurança e Cloud Native diretamente no seu SDLC. Desenhe aplicações escaláveis, consolide CI/CD com varreduras SAST/DAST integradas, levante SBOM dinamicamente e escale sua malha de microsserviços sem travar a velocidade de entrega técnica.",
    workflow: [
      { step: "01", name: "Architecture Review", desc: "Varredura pontual na arquitetura vigente identificando débitos técnicos, riscos iminentes e desenhando os Threat Models lógicos." },
      { step: "02", name: "SSDLC Design", desc: "Integração cirúrgica do Secure SDLC desenhando gates automatizados. SAST/DAST acoplados diretamente ao pull request do seu desenvolvedor sem estresse." },
      { step: "03", name: "CI/CD Setup e Handoff", desc: "Deploys condicionados automatizados com testes E2E blindados. Sua equipe assina a qualidade em produção enquanto a ferramenta aprova riscos baixos sozinha." }
    ],
    services: [
      { name: "Varreduras Automáticas (SAST/DAST)", desc: "Seu time faz commit, o código é estressado de forma silenciosa por heurísticas em Sandbox localizando fragilidades muito antes de compilar para produção." },
      { name: "Threat Modeling e SBOM", desc: "Radiografia constante do seu software, desde matrizes com o modelo STRIDE até a transparência milimétrica das bibliotecas em formato SBOM para rigor de auditorias corporativas." },
      { name: "API e Container Security", desc: "Blindagem externa ponta a ponta. Refinamento de APIs (OAuth2, rate limits) contido na fortaleza de runtime images atestados por scanners contínuos." }
    ],
    ctaLabel: "solicitar architecture review",
    useCases: [
      { title: "O time ágil sofre gargalos da segurança ao soltar releases", desc: "Ao acoplarmos o Scanner de SAST/DAST à esteira CI/CD, os falsos positivos e os alertas de baixo impacto são validados instantaneamente reduzindo revisões puramente manuais da Segurança." },
      { title: "Startup transicionando carga para Cloud-Native", desc: "Executamos o redesign cirúrgico convertendo monolitos em micro-funcionalidades e API-gateways, migrando a topologia arquitetural aos poucos." },
      { title: "Auditoria exigiu imediatamente lista SBOM do produto", desc: "Entregamos automações de pipeline que cospem todo o Software Bill of Materials validando assinaturas e varrendo licenças open-source maliciosas on-demand." },
      { title: "CTO foi cobrado por Métricas Ágeis em Produtividade", desc: "Configuramos painéis executivos vivos medindo Deployment Frequency e tempo médio de recuperação (MTTR) em tempo real baseados nos KPIs DORA universais." }
    ],
    features: [
      { name: "Pipelines CI/CD Seguros", category: "Automação" },
      { name: "Security Gateways SAST/DAST", category: "Shift-Left" },
      { name: "SBOM Configuration Tracker", category: "Compliance" },
      { name: "Painéis de DORA Metrics", category: "Métricas" },
      { name: "Threat Modeling (STRIDE/PASTA)", category: "Arquitetura" },
      { name: "Container/Runtime Hardening", category: "Isolamento" },
      { name: "Infra-as-Code (Terraform/OPA)", category: "Deploy" },
      { name: "Arquitetura API & OIDC", category: "Transação" }
    ],
    onboarding: [
      { step: "01", title: "Review", desc: "Identificação do end-state em sessões precisas de arquitetura de software de até duas semanas." },
      { step: "02", title: "SSDLC", desc: "Mapeamento rigoroso e implantação inicial das regras nos repositórios para Secure SDLC." },
      { step: "03", title: "CI/CD Pipe", desc: "Setup final conectando a engenharia de delivery nativa da corporação à nossa automação." },
      { step: "04", title: "Handoff", desc: "Treinamentos pragmáticos. O processo fica claro, documentado na rotina e assumido pelos DevOps." }
    ],
    technicalFeatures: [],
    portfolio: [
      { client: "Top Fintech", project: "Refatoração Secure SDLC & SBOM", result: "Adequação acelerada para aprovação do SOC2." }
    ]
  },
  "autoops": {
    icon: Brain,
    metaTitle: "n.autoops — automação de infraestrutura e processos",
    metaDescription: "Automação de infraestrutura, pipelines e processos operacionais com IA. Menos tarefas manuais, mais previsibilidade e escala.",
    workflow: [
      { step: "01", name: "Triagem de Fricção Cognitiva", desc: "Varredura corporativa cruzando o mapa de processos departamentais e destacando onde atividades humanas não agregam inovação orgânica." },
      { step: "02", name: "Injeção LLM Customizada", desc: "Treinamento do core de IA sobre sua wiki corporativa e contratos vitais garantindo acurácia setorial profunda e sem alucinações vazias." },
      { step: "03", name: "Delegação Ativa Transacional", desc: "Acoplamento de agentes neuro-digitais executivos; eles leem a solicitação, acionam API sem intervenção e enviam o ticket resolvido ao requisitante final." }
    ],
    services: [
      { name: "LLMs de Backoffice Auditável", desc: "Agentes operando leitura de milhares de PDFs, comparando faturamento automático e indicando onde há gargalos logísticos contábeis rotineiramente." },
      { name: "Atendimento N1 Cognitivo", desc: "FrontDesk hiper-escalável que absorve tickets técnicos triviais resetando senhas ou acionando rollbacks simples via permissões pré-negociaveis da chefia." },
      { name: "Orquestradores Baseados em Agentes", desc: "Avanço estrutural de engenharia: A.I. conectada e programada autonomamente atirando payload a múltiplos nós das arquiteturas AWS / GCP por demanda de texto." }
    ],
    ctaLabel: "automatizar operações",
    technicalFeatures: [
      { title: "Stack LLM Isolado Corporativamente", desc: "Modelos OpenSource robustos empacotados privadamente sem rastreamento dos provedores globais terceiros vigentes." },
      { title: "Engenharia de Prompt Parametrizada", desc: "Roteamento sistemático na camada de entrada e RAG vector para suprimir distorções." },
      { title: "Agents via Function Calling", desc: "IAs emparelhadas ativando scripts na AWS isoladas pelo seu controle de JWT/SAML corporativo central." }
    ],
    portfolio: [
      { client: "Logistics Leader", project: "Backoffice AI", result: "Economia de 30.000 horas/ano em tarefas de retaguarda." }
    ]
  },
  "cirt": {
    icon: Gavel,
    metaTitle: "n.cirt — resposta a incidentes: contenção, forense e comunicação de crise",
    metaDescription: "Time de resposta a incidentes para ransomware, vazamento de dados e indisponibilidade crítica. Contenção, forense e comunicação de crise, com sala de guerra estruturada e playbooks NIST/ISO.",
    overview: "Quando o impensável acontece, o pânico e o tempo são seus maiores inimigos. O n.cirt é a força de liderança em Resposta a Incidentes, atuando na orquestração da crise. Acionamos uma sala de guerra virtual estruturada e assumimos o controle gerencial com playbooks NIST/ISO. Alinhamos sua equipe de TI, a Comunicação (PR), o Jurídico e até acionamos perícia forense externa, tirando o peso dos ombros da sua diretoria para garantir a continuidade do negócio.",
    workflow: [
      { step: "01", name: "War Room e Triagem", desc: "Assumimos a cadeira central de comando. Centralizamos as informações cruzando relatos dos seus times internos e provedores de segurança (SOC/MSSP) para entender a magnitude do incidente sem achismos." },
      { step: "02", name: "Coordenação de Contenção", desc: "Direcionamos a aplicação de playbooks táticos aprovados. Instruímos suas equipes de redes e infraestrutura sobre exatamente quais conectividades cortar e quais ativos isolar para estancar a sangria imediatamente." },
      { step: "03", name: "Orquestração de Retomada e Forense", desc: "Gerenciamos a recuperação. Acionamos parceiros especialistas e peritos externos (ex: forense.io) para análise profunda, enquanto guiamos seus DBAs na homologação e subida limpa dos backups essenciais." }
    ],
    services: [
      { name: "Incident Response Management", desc: "Liderança ativa em cenários de violação. Assumimos a posição de Incident Commander, gerenciando seus provedores de tecnologia e ditando prioridades críticas minuto a minuto." },
      { name: "Modo Standby (Retainer Ativo)", desc: "Seu seguro-comandante contratado antes da falência. Uma liderança sênior à espreita, garantindo a subida do comitê de crise à primeira confirmação do seu NOC de que as barreiras caíram." },
      { name: "Post-Incident Forensic Review", desc: "Após apagar o incêndio, centralizamos auditorias. Contratamos especialistas forenses para rastrear a origem da porta arrombada e devolvemos um roadmap gerencial de Security inaleável." }
    ],
    ctaLabel: "agendar emergência cirúrgica",
    useCases: [
      { title: "Ransomware Ativo paralisando a operação global", desc: "Acionamento de emergência. A Sala de Guerra subiu em 15 minutos e os especialistas da Ness coordenaram os líderes de TI do cliente e a provedora de nuvem para isolar as contas administrativas antes da perda total." },
      { title: "Vazamento contínuo de Logs na DarkWeb", desc: "Ativação do processo tático focado em contenção de PII. A coordenação da Ness acionou rapidamente firmas forenses parceiras e guiou o comitê jurídico na formatação da defesa pública." }
    ],
    features: [
      { name: "Sala de Guerra Virtual 24/7", category: "Orquestração" },
      { name: "Playbooks Normatizados (NIST)", category: "Processos" },
      { name: "Coordenação de Fornecedores", category: "Microgestão" },
      { name: "Integração Jurídica e Forense", category: "Legal Hold" },
      { name: "Comunicação de Crise", category: "C-Level PR" },
      { name: "Simulações Tabletop (Readiness)", category: "Preparo" }
    ],
    onboarding: [
      { step: "01", title: "Playbook Engine", desc: "Assessment de governança desenhando os rituais obrigatórios do NIST aplicados ao catálogo de times e diretores do cliente." },
      { step: "02", title: "Readiness", desc: "Mapeamento das capacidades dos terceiros (SOC, Cloud Providers) garantindo que eles sabem o que fazer quando a Ness pedir." },
      { step: "03", title: "Standby Retainer", desc: "O contrato dorme: uma liderança remota silenciosa mas apta a comandar o incidente ao primeiro disparo tático." },
      { step: "04", title: "War Trigger", desc: "Crise instaurada. A central é puxada, todos os processos bloqueados e os gestores são colocados na call em <= 15 Minutos." }
    ],
    portfolio: [
      { client: "Healthcare Provider", project: "Ransomware Rescue Coordination", result: "Ameaça contida pela War Room gerencial orquestrando os DBAs internos e evitando R$ 15 Milhões em perdas com índice legal inabalado." }
    ]
  }
};
