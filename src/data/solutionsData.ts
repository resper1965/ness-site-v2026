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
    overview: "O n.secops é o serviço gerenciado de segurança da ness. para empresas que precisam fortalecer sua operação com proteção contínua, capacidade real de resposta e evolução mensurável da postura de segurança. A oferta combina monitoramento permanente, resposta estruturada a incidentes, automação operacional, conformidade normativa e gestão de riscos em uma única operação.",
    workflow: [
      { step: "01", name: "Visibilidade Total 24/7", desc: "Monitoramos todos os seus dispositivos, servidores e ambientes em nuvem sem pausas. Se houver qualquer comportamento estranho ou brecha de segurança, nós detectamos no mesmo segundo." },
      { step: "02", name: "Resposta Imediata", desc: "Se um ataque for detectado, nossa equipe age na hora. Isolamos a ameaça antes que ela se espalhe e avisamos você diretamente em canais de resposta rápida, como Teams ou WhatsApp." },
      { step: "03", name: "Pronto para Auditorias", desc: "Tudo o que defendemos vira um relatório claro. Traduzimos ataques em evidências organizadas que garantem sua aprovação em processos rígidos como ISO 27001 e LGPD." }
    ],
    benefits: [
      { title: "Mais previsibilidade para operar com segurança", desc: "Em vez de sustentar múltiplas frentes desconectadas, o n.secops organiza a segurança em um modelo recorrente, com custo previsível e estrutura operacional pronta para execução contínua. Isso reduz dispersão, simplifica a gestão e amplia a capacidade de resposta sem exigir expansão proporcional da estrutura interna." },
      { title: "Segurança que gera decisão", desc: "Cada incidente tratado fortalece a capacidade de decisão da organização com documentação, rastreabilidade, indicadores e direcionamento claro para correção, priorização e melhoria contínua. O resultado é uma operação de segurança mais madura e preparada para sustentar continuidade." }
    ],
    services: [
      { name: "SOC 24x7 com MDR", desc: "A operação mantém vigilância contínua sobre eventos, alertas e comportamentos suspeitos, com correlação, triagem, classificação de severidade, escalonamento e resposta coordenada. Esse modelo entrega uma capacidade permanente de SOC 24x7 com MDR." }
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
      title: "n.infraops metrics",
      mainStat: { value: "100%", label: "disponibilidade global" },
      metrics: [
        { value: "99.9%", label: "SLA", color: "text-primary" },
        { value: "< 10ms", label: "latência", color: "text-green-500" }
      ],
      progress: { label: "infrastructure health", value: "100%", subLabel: "optimal" }
    },
    workflow: [
      { step: "01", name: "Assessment de Dívida Técnica", desc: "Mapeamento sem viés de infraestruturas ociosas e gargalos de resiliência legado." },
      { step: "02", name: "Refatoração Cloud-Native", desc: "Abandono do conceito 'lift and shift'. Reconstrução arquitetural para tolerância elástica a falhas." },
      { step: "03", name: "Sustentação FinOps", desc: "Monitoramento ativo onde algoritmos ligam e desligam clusters sob demanda atrelados à variação de receita." }
    ],
    benefits: [
      { title: "Transformação CapEx para OpEx Cirúrgico", desc: "Não compre servidores aguardando o pico de Black Friday. Escalonamento milissegundo de recursos que desliga a conta na hora exata em que o tráfego acaba." },
      { title: "Resiliência Multi-Região Silenciosa", desc: "Um data center cai, seu usuário não percebe. Espelhamento assíncrono e failovers autônomos garantindo um SLA que blinda sua diretoria." },
      { title: "Developer Experience inegociável", desc: "Desenvolvedor não deve abrir ticket para rodar um banco de dados temporário. Entregamos Infra as Code (IaC) para autonomia com guardrails de compliance rígidos." }
    ],
    services: [
      { name: "Sustentação SRE 24/7", desc: "Engenharia de Confiabilidade operando como extensão do seu board técnico, reagindo a anomalias antes do downtime acontecer." },
      { name: "Gestão Híbrida Inteligente (FinOps)", desc: "Plataforma multicloud distribuindo carga estrategicamente onde a computação está mais barata e a latência menor no globo." },
      { name: "Auditoria Contínua (Compliance-as-Code)", desc: "Verificação sistêmica que varre aberturas de firewall erráticas no código e barra deploys inseguros na fonte." }
    ],
    ctaLabel: "otimizar infraestrutura",
    technicalFeatures: [
      { title: "Automação Kubernetes Absoluta", desc: "Orquestração conteinerizada agnóstica a provider, evitando 'vendor lock-in' crônico." },
      { title: "IaC Terraform State", desc: "Toda sua infraestrutura corporativa é textualmente documentada em controle de versão Git." },
      { title: "Redundância de Topologia Ativa", desc: "Arquitetura distribuída entre provedores garantindo SLA 99,99% em nível de kernel." }
    ],
    portfolio: [
      { client: "Enterprise Retail", project: "Cloud Migration & FinOps", result: "Redução de 45% nos custos mensais de infraestrutura." }
    ]
  },
  "devarch": {
    icon: Cpu,
    bgImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000",
    dashboard: {
      title: "n.devarch throughput",
      mainStat: { value: "24/7", label: "deployments" },
      metrics: [
        { value: "10x", label: "velocidade de entrega", color: "text-primary" },
        { value: "0", label: "débito técnico", color: "text-green-500" }
      ],
      progress: { label: "development velocity", value: "High", subLabel: "" }
    },
    workflow: [
      { step: "01", name: "Blindagem de Arquitetura", desc: "Refatoração focada no isolamento de domínio (Clean/Hexagonal) para garantir sobrevida do software sem acoplamento a frameworks mutáveis." },
      { step: "02", name: "Transição Shift-Left", desc: "Injeção de testes end-to-end e varreduras SAST/DAST em pipelines antes que códigos falhos atinjam os reviews manuais de PR." },
      { step: "03", name: "Maturidade de Rollout", desc: "Estabelecimento de Blue-Green deployments e canários graduais que anulam inteiramente as madrugadas de pânico da sua equipe de release." }
    ],
    benefits: [
      { title: "Fim da Obsolescência Programada e Débito Anual", desc: "Construímos bases cimentadas sobre Clean Architecture. O seu core bancário e sistêmico não exigirá reescrita catastrófica daqui a 5 anos." },
      { title: "Deployments na Sexta-Feira sem Medo", desc: "Processo infalível de automação em que jogar nova versão para produção se torna menos arriscado do que reiniciar um celular." },
      { title: "Segurança por Design (SecOps Integrado)", desc: "Arquitetura não é segura nos pênaltis. Seu time submete o código, IA corporativa realiza pentest de sintaxe automático barrendo vazamento preventivamente." }
    ],
    services: [
      { name: "Engenharia Squad-as-a-Service", desc: "Acople células sêniores que codificam sua vantagem competitiva mantendo o padrão da arquitetura intacto." },
      { name: "Esteiras de Entrega e CI/CD Moderno", desc: "Fluxos de delivery algorítmico conectando o IDE direto para produção via validação por branch condicional e testes E2E." },
      { name: "Desenvolvimento Especialista Modernizado", desc: "Stack tecnológico em constante calibração (Next.js, Node.js escalável, Golang e microsserviços atômicos)." }
    ],
    ctaLabel: "acelerar meu software",
    technicalFeatures: [
      { title: "Portabilidade Hexagonal", desc: "Seu domínio agnóstico que permite plugar novos bancos de dados ou interfaces sem refatorar core logic." },
      { title: "Telemetria Dev Embedded", desc: "Código emitindo traces OpenTelemetry antes mesmo da implantação final de produto corporativo." },
      { title: "Micro-Frontends Atômicos", desc: "Equipes escalando isoladas publicando atualizações de interface sem impactar o layout do time vizinho." }
    ],
    portfolio: [
      { client: "SaaS Decacorn", project: "Refactoring Core Banking", result: "Time-to-market reduzido de meses para dias." }
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
      mainStat: { value: "< 5m", label: "time to response" },
      metrics: [
        { value: "100%", label: "threat containment", color: "text-primary" },
        { value: "24/7", label: "plantão de especialistas", color: "text-green-500" }
      ],
      progress: { label: "readiness", value: "maximum", subLabel: "" }
    },
    workflow: [
      { step: "01", name: "Identificação do Foco" },
      { step: "02", name: "Mitigação e Contenção" },
      { step: "03", name: "Erradicação e Recuperação" }
    ],
    benefits: [
      { title: "Recuperação Imediata", desc: "Downtime custa milhões. Contemos danos em tempo recorde para garantir a continuidade absoluta do seu negócio." }
    ],
    services: [
      { name: "Incident Response", desc: "Intervenção ativa de elite em cenários de violação corporativa." }
    ],
    ctaLabel: "agendar análise cirt",
    technicalFeatures: [
      { title: "Forensics Engine", desc: "Coleta e análise automatizada de artefatos." }
    ],
    portfolio: [
      { client: "Healthcare Provider", project: "Ransomware Recovery", result: "R$ 15M protegidos e zero dados vazados." }
    ]
  }
};
