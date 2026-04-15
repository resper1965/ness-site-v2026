import { ShieldCheck, Cloud, Cpu, Brain, Gavel } from 'lucide-react';

export const solutionsData: any = {
  "secops": {
    icon: ShieldCheck,
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
    dashboard: {
      title: "n.secops dashboard",
      mainStat: { value: "100%", label: "postura atualizada" },
      metrics: [
        { value: "A.I.", label: "triagem agêntica", color: "text-green-500" },
        { value: "0 gaps", label: "em privacidade", color: "text-primary" }
      ],
      progress: { label: "soar isolation speed", value: "Sub 500ms", subLabel: "" }
    },
    overview: "Segurança de elite para sua infraestrutura. O n.secops consolida Monitoramento 24x7, Resposta Imediata e Gestão de Riscos (GRC) em um único contrato — entregando defesa contínua de escala global sem que você precise inflar sua equipe interna.",
    workflow: [
      { step: "01", name: "Visibilidade Total 24/7", desc: "Monitoramos todos os seus dispositivos, servidores e ambientes em nuvem sem pausas. Se houver qualquer comportamento estranho ou brecha de segurança, nós detectamos no mesmo segundo." },
      { step: "02", name: "Resposta Imediata", desc: "Se um ataque for detectado, nossa equipe age na hora. Isolamos a ameaça antes que ela se espalhe e avisamos você diretamente em canais de resposta rápida, como Teams ou WhatsApp." },
      { step: "03", name: "Pronto para Auditorias", desc: "Tudo o que defendemos vira um relatório claro. Traduzimos ataques em evidências organizadas que garantem sua aprovação em processos rígidos como ISO 27001 e LGPD." }
    ],
    benefits: [
      { title: "Previsibilidade Operacional", desc: "Troque a gestão caótica de múltiplos fornecedores de software por uma operação centralizada. Ganhe escala de segurança 24/7 de forma previsível e recorrente sem precisar expandir drasticamente sua folha de pagamento." },
      { title: "Inteligência para Decidir", desc: "Reduza o 'achismo'. Fornecemos os indicadores exatos de defesa e as evidências cirúrgicas que a diretoria exige para priorizar os investimentos em TI com segurança blindada e confiança real." },
      { title: "Visão via Portal GRC", desc: "Acompanhe sua Governança de Risco e Postura em tempo real. Nosso Portal Integrado traduz milhares de eventos cibernéticos em um painel gerencial absurdamente simples para você liderar o compliance." }
    ],
    services: [
      { name: "Motor SOC 24x7 (MDR)", desc: "Vigilância ininterrupta sobre eventos e comportamentos suspeitos em toda a sua rede. Nossa equipe realiza a triagem e neutraliza ameaças instantaneamente antes que elas escalem." },
      { name: "Gestão Contínua de Vulnerabilidades", desc: "Não focamos apenas em achar buracos críticos, mas em fechá-los. Realizamos varreduras recorrentes no seu ambiente e aplicamos os patches necessários de forma cadenciada." },
      { name: "Threat Intelligence e Forense", desc: "Estudo contínuo do cibercrime focado no seu setor de mercado para prever ataques. Se o pior acontecer, conduzimos extrações forenses completas para propósitos legais." }
    ],
    ctaLabel: "Fale com a ness.",
    useCases: [
      { title: "Empresa sofreu ransomware e quer prevenir recorrência", desc: "SOC 24×7 monitora ameaças, EDR bloqueia processos maliciosos antes de propagação, e patching reduz superfície de ataque." },
      { title: "Startup precisa ISO 27001/SOC 2 em 6 meses", desc: "A empresa já sai com as evidências mandatórias prontas para a auditoria: logs centralizados, scan contínuo de vulnerabilidades, relatórios trimestrais de patch e inventário unificado." },
      { title: "TI enxuta não consegue acompanhar CVEs críticos", desc: "Nosso motor assume a máquina. Triagem automatizada de vulnerabilidades + ciclo de patch aplicado de forma orquestrada durante janelas silenciosas, sem causar downtime não planejado." },
      { title: "Gestor quer visibilidade exata de quem acessou o quê", desc: "O SIEM proprietário correlaciona logs infinitos de AD, firewalls, EDR e aplicações em nuvem, entregando dashboards centralizados e irrevogáveis para controle e compliance direto." }
    ],
    features: [
      { name: "Motor SOC 24×7", category: "Monitoramento Ativo" },
      { name: "Correlação SIEM Avançada", category: "Visibilidade" },
      { name: "EDR/AV Next-Gen com ML", category: "Combate de Ponto" },
      { name: "Gestão Contínua de Vulnerabilidades", category: "Prevenção" },
      { name: "Application Patch Management", category: "Higiene Tática" },
      { name: "Security Hardening (CIS/NIST)", category: "Fundação" },
      { name: "Inventário Discovery de Ativos", category: "Governança" },
      { name: "Orquestração Incident Response", category: "Contenção" },
      { name: "Feeds de Threat Intelligence", category: "Capacidade Cíclica" },
      { name: "Reportes Táticos Executivos", category: "Auditoria" }
    ],
    onboarding: [
      { step: "01", title: "Diagnóstico Completo", desc: "Mapeamento em profundidade do ambiente, assessment de stack tecnológico atual frente às ameaças globais operantes." },
      { step: "02", title: "Baseline e Instalação", desc: "Deploy silencioso de sensores EDR, conexões criptografadas ao SIEM e centralização dos dados do tenant." },
      { step: "03", title: "Tuning e Ajuste Fino", desc: "Calibração aguda das regras de detecção da Inteligência para reduzir fadiga de alertas e focar apenas no ruído que derruba negócios." },
      { step: "04", title: "Operação 24x7 Ativada", desc: "O n.secops assume a vigília ininterrupta com emissão agendada de relatórios evolutivos sem gap de feriado." }
    ],
    technicalFeatures: [],
    portfolio: [
      { client: "Global Fintech", project: "SOC Enterprise", result: "Prevenção estimada de US$ 2.5M em fraudes anuais." }
    ]
  },
  "infraops": {
    icon: Cloud,
    bgImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
    dashboard: {
      title: "n.infraops tickets",
      mainStat: { value: "L1/L2/L3", label: "service desk itil" },
      metrics: [
        { value: "99.9%", label: "uptime sla", color: "text-primary" },
        { value: "70%", label: "redução backlog", color: "text-green-500" }
      ],
      progress: { label: "infrastructure health", value: "100%", subLabel: "optimal" }
    },
    overview: "Infraestrutura instável gera downtime, insatisfação de usuários e desperdício financeiro. O n.infraops assume a operação completa do seu ambiente — do Service Desk L1/L2/L3 à gestão de ITIL e Cloud — liberando seu time interno de apagar incêndios para focar puramente em inovações de alto nível.",
    workflow: [
      { step: "01", name: "Assessment Inicial", desc: "Mapeamento minucioso da infraestrutura atual, descobrindo ativos não documentados, processos e identificando os pain points com SLAs reais." },
      { step: "02", name: "Setup ITSM e CMDB", desc: "Estruturação rigorosa da ferramenta de serviços, desenhando os workflows ITIL (Incident/Change/Problem) e a malha conectada de gestão de ativos." },
      { step: "03", name: "Operação e SLA Ativo", desc: "Assumimos as trincheiras. Nossos Service Desks L1 e L2 passam a responder os chamados enquanto reportamos indicadores SLO/SLI limpos para a liderança." }
    ],
    benefits: [
      { title: "Foco Estratégico, Zero Incêndios", desc: "Times enxutos gastam cerca de 70% do tempo apagando fogo em chamados de senha e redes. Absorvemos esse impacto para que sua engenharia foque apenas em projetos de core business." },
      { title: "Visibilidade Métrica de SLOs", desc: "Tire do 'achismo' a saúde da sua TI. Entregamos Dashboards executivos com Uptime, MTTR e Satisfação (CSAT) em tempo real." },
      { title: "Gestão Unificada de Ativos (CMDB)", desc: "Empresas que crescem rápido costumam perder a rastreabilidade do parque. Controlamos licenças, acessos, servidores físicos e nuvens híbridas sem margem para pontos cegos." }
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
    bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000",
    dashboard: {
      title: "n.devarch throughput",
      mainStat: { value: "24/7", label: "secure deployments" },
      metrics: [
        { value: "10x", label: "deploy frequency", color: "text-primary" },
        { value: "0", label: "critical breaches", color: "text-green-500" }
      ],
      progress: { label: "development velocity", value: "High", subLabel: "accelerated" }
    },
    overview: "80% das vulnerabilidades nascem no código mal versionado. O n.devarch embarca Segurança e Cloud Native diretamente no seu SDLC. Desenhe aplicações escaláveis, consolide CI/CD com varreduras SAST/DAST integradas, levante SBOM dinamicamente e escale sua malha de microsserviços sem travar a velocidade de entrega técnica.",
    workflow: [
      { step: "01", name: "Architecture Review", desc: "Varredura pontual na arquitetura vigente identificando débitos técnicos, riscos iminentes e desenhando os Threat Models lógicos." },
      { step: "02", name: "SSDLC Design", desc: "Integração cirúrgica do Secure SDLC desenhando gates automatizados. SAST/DAST acoplados diretamente ao pull request do seu desenvolvedor sem estresse." },
      { step: "03", name: "CI/CD Setup e Handoff", desc: "Deploys condicionados automatizados com testes E2E blindados. Sua equipe assina a qualidade em produção enquanto a ferramenta aprova riscos baixos sozinha." }
    ],
    benefits: [
      { title: "Segurança Shift-Left sem Fricção", desc: "Times ágeis não podem esperar aprovação de segurança para lançar features. Inserimos autoaprovação para níveis de baixo risco na sua esteira nativa (CI/CD)." },
      { title: "Defesas by Design (Cloud-Native)", desc: "Seja orquestrando Microsserviços e Event-Driven, aplicamos um robusto Threat Modeling profilático para escalar sua tecnologia sem herdar furos crônicos de arquitetura." },
      { title: "Métricas DORA no Board", desc: "Aperte um botão, audite os números e mostre que a TI é estratégica. Deployment Frequency altíssimo e Change Failure Rate achatado atestando que qualidade caminha junto à robustez do código." }
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
    bgImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2000",
    dashboard: {
      title: "n.autoops intelligence",
      mainStat: { value: "A.I.", label: "agents active" },
      metrics: [
        { value: "1M+", label: "tarefas automatizadas", color: "text-primary" },
        { value: "-40%", label: "custo operacional", color: "text-green-500" }
      ],
      progress: { label: "model accuracy", value: "99.8%", subLabel: "" }
    },
    workflow: [
      { step: "01", name: "Triagem de Fricção Cognitiva", desc: "Varredura corporativa cruzando o mapa de processos departamentais e destacando onde atividades humanas não agregam inovação orgânica." },
      { step: "02", name: "Injeção LLM Customizada", desc: "Treinamento do core de IA sobre sua wiki corporativa e contratos vitais garantindo acurácia setorial profunda e sem alucinações vazias." },
      { step: "03", name: "Delegação Ativa Transacional", desc: "Acoplamento de agentes neuro-digitais executivos; eles leem a solicitação, acionam API sem intervenção e enviam o ticket resolvido ao requisitante final." }
    ],
    benefits: [
      { title: "Multiplicação Contínua sem Inchar Headcount", desc: "O volume de clientes da sua empresa pode saltar 10x neste quadrimestre sem que você precise expandir a folha BPO e suporte call-center do RH." },
      { title: "Propriedade Intelectual Isolada em VPC", desc: "Modelos privados consumindo gigabytes estruturais da sua governança limitados entre quatro paredes impenetráveis da nuvem, afastados dos fóruns corriqueiros públicos." },
      { title: "Acurácia Sistêmica e Frieza Executiva (99,8%)", desc: "Robôs digitais não são corroídos pelo stress corporativo. Eles encaram laudos gigantescos de fraude financeira em segundos, emitindo o alerta com índice percentual frio da decisão tomada." }
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
    bgImage: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=2000",
    dashboard: {
      title: "n.cirt response",
      mainStat: { value: "< 15m", label: "war room SLA" },
      metrics: [
        { value: "100%", label: "threat containment", color: "text-primary" },
        { value: "24/7", label: "plantão de especialistas", color: "text-green-500" }
      ],
      progress: { label: "readiness", value: "maximum", subLabel: "standby mode" }
    },
    overview: "Quando o impensável acontece, o pânico e o tempo são seus maiores inimigos. O n.cirt é a força de liderança em Resposta a Incidentes, atuando na orquestração da crise. Acionamos uma Sala de Guerra virtual estruturada em até 15 minutos, assumindo o controle gerencial usando Playbooks NIST/ISO. Alinhamos sua equipe de TI, a Comunicação (PR), o Jurídico e até acionamos perícia forense externa, tirando o peso dos ombros da sua diretoria para garantir a continuidade do negócio.",
    workflow: [
      { step: "01", name: "War Room e Triagem", desc: "Assumimos a cadeira central de comando. Centralizamos as informações cruzando relatos dos seus times internos e provedores de segurança (SOC/MSSP) para entender a magnitude do incidente sem achismos." },
      { step: "02", name: "Coordenação de Contenção", desc: "Direcionamos a aplicação de playbooks táticos aprovados. Instruímos suas equipes de redes e infraestrutura sobre exatamente quais conectividades cortar e quais ativos isolar para estancar a sangria imediatamente." },
      { step: "03", name: "Orquestração de Retomada e Forense", desc: "Gerenciamos a recuperação. Acionamos parceiros especialistas e peritos externos (ex: forense.io) para análise profunda, enquanto guiamos seus DBAs na homologação e subida limpa dos backups essenciais." }
    ],
    benefits: [
      { title: "Liderança Fria no Momento Crítico", desc: "Quando a TI interna está exausta e sob enorme pressão, entramos com a sobriedade de quem só faz isso. Assumimos a coordenação e ditamos o ritmo de salvação baseado em processos provados, não emoções." },
      { title: "Readiness: Preparo Gerencial", desc: "A defesa começa antes. Organizamos Tabletop Exercises intensos imitando ransomware para estressar e preparar todas as decisões vitais do seu Board Executivo e C-Level em um ensaio controlado." },
      { title: "Orquestração Jurídica e de Relações Públicas", desc: "O incidente técnico é apenas 20% do problema. Lideramos as comunicações metódicas a conselhos de diretores e ajudamos na redação técnica para notificações de brechas exigidas pelas leis vigentes (ANPD/LGPD)." }
    ],
    services: [
      { name: "Incident Response Management", desc: "Liderança ativa de elite em cenários de violação. Assumimos a posição de Incident Commander, gerenciando seus provedores de tecnologia e ditando prioridades críticas minuto a minuto." },
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
