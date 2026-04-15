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
    overview: "SOCs tradicionais fracassam pois medem o sucesso pelo volume de alertas gerados, desencadeando fatiga operacional severa no seu corpo de engenharia. Em n.secops, desafiamos essa convenção: o silêncio é a nossa verdadeira métrica. Projetamos uma arquitetura onde a inteligência autônoma contém anomalias e gera faturamento de trilhas de auditoria GRC sem que sua equipe precise piscar. Menos reuniões de crise, mais continuidade intocável.",
    workflow: [
      { step: "01", name: "Extração de Sinais Base", desc: "Varredura on-premise e cloud extraindo eventos sistêmicos da infraestrutura crítica para identificar desvios da normalidade comportamental." },
      { step: "02", name: "Validação Cruzada IA", desc: "Alertas filtrados por algoritmos Red-Team que eliminam 95% do ruído convencional, poupando humanos de analisar triviais benignos." },
      { step: "03", name: "Extirpação e Relatório", desc: "Intervenção ativa (SOAR) que aborta o dano isolando o segmento; e atualização forense retroativa na sua documentação jurídica." }
    ],
    benefits: [
      { title: "Risco Zero em Auditorias ISO/LGPD", desc: "A dor de reunir logs na véspera da auditoria acabou. Cada resposta a incidente gera uma trilha compliance contínua, garantindo conformidade sem atrito legal." },
      { title: "Garantia Tática de Faturamento", desc: "Downtime é igual a cliente churn. Nosso isolamento em sub-milissegundos blinda a espinha dorsal dos seus serviços, preservando a liquidez e a percepção de marca." },
      { title: "ROI em Capital Humano Especializado", desc: "Pare de desperdiçar salários sêniores em triagem júnior. Extraia o valor verdadeiro dos seus engenheiros enquanto nós cuidamos da primeira linha de embate térmico." }
    ],
    services: [
      { name: "MDR Aumentado por IA", desc: "Visibilidade central em toda a superfície 24/7 com supressão de ruídos em nível agêntico." },
      { name: "Supervisão RMM Remota", desc: "Poder de fogo militar direto no endpoint: patches aplicados invisivelmente em todos os cantos da sua planta operacional." },
      { name: "Playbooks SOAR Nativos", desc: "Rede de decisões autônomas pré-aprovada pela sua Governança que elimina a perda de tempo na escalada de incidentes críticos." },
      { name: "Integração Executiva (GRC/POAM)", desc: "Tradução simultânea do 'tecniquês' de segurança cibernética para o dashboard visual de Risco que o seu Comitê Executivo necessita validar diariamente." }
    ],
    ctaLabel: "agendar auditoria secops",
    technicalFeatures: [
      { title: "Telemetria Cloud-First", desc: "Sensores embutidos conectando Office 365, G-Suite e AWS." },
      { title: "Gestão Ativa de RMM Corporativo", desc: "Isolamento lateral estrito operado via painel centralizado remoto." },
      { title: "Fluxos Decisórios Autônomos", desc: "Regras orquestradas de SOAR contendo ataques baseados em IP/Heurística." },
      { title: "Matriz Neural Supressora", desc: "A.I. designada para rebaixar prioridade de alertas inócuos legados." },
      { title: "Documentação Forense Viva", desc: "Compliance injetado no código: geração de laudo ativo após contensão." }
    ],
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
      { step: "01", name: "Avaliação de Arquitetura" },
      { step: "02", name: "Migração Estratégica" },
      { step: "03", name: "Operação Sustentada" }
    ],
    benefits: [
      { title: "TCO Otimizado", desc: "Redução drástica do Custo Total de Propriedade (TCO) com arquiteturas escaláveis que pagam por si mesmas." }
    ],
    services: [
      { name: "Cloud Management", desc: "Gestão inteligente de ambientes multi-cloud." }
    ],
    ctaLabel: "otimizar infraestrutura",
    technicalFeatures: [
      { title: "Infra as Code", desc: "Automação total via Terraform e afins." }
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
      { step: "01", name: "Design System Central" },
      { step: "02", name: "Microserviços Ágeis" },
      { step: "03", name: "Esteira CI/CD Automatizada" }
    ],
    benefits: [
      { title: "Time-to-Market Acelerado", desc: "Transformamos ciclos de desenvolvimento em vantagem competitiva. Entregue features meses antes da concorrência." }
    ],
    services: [
      { name: "Software Engineering", desc: "Construção de aplicações resilientes com padrões modernos." },
      { name: "DevSecOps", desc: "Integramos segurança no pipeline (Shift-Left) desde o dia zero." }
    ],
    ctaLabel: "acelerar meu software",
    technicalFeatures: [
      { title: "Arquitetura Hexagonal", desc: "Isolamos o domínio da sua aplicação contra obsolescência de frameworks." }
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
      { step: "01", name: "Mapeamento de Processos" },
      { step: "02", name: "Treinamento de IA" },
      { step: "03", name: "Delegação Contínua" }
    ],
    benefits: [
      { title: "Escala sem Headcount", desc: "Multiplique a capacidade operacional do seu negócio infinitamente, sem a necessidade de inchar a folha de pagamento." }
    ],
    services: [
      { name: "IA Generativa no Backoffice", desc: "Automatização de análise de dados e suporte N1." }
    ],
    ctaLabel: "automatizar operações",
    technicalFeatures: [
      { title: "LLM Orchestration", desc: "Modelos privados acoplados ao seu banco de dados interno de forma segura." }
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
