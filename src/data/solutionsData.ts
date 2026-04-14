import { ShieldCheck, Cloud, Cpu, Brain, Gavel } from 'lucide-react';

export const solutionsData: any = {
  "secops": {
    icon: ShieldCheck,
    bgImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
    dashboard: {
      title: "n.secops dashboard",
      mainStat: { value: "99.99%", label: "uptime operacional" },
      metrics: [
        { value: "0.4s", label: "latency", color: "text-green-500" },
        { value: "0 incidentes", label: "críticos", color: "text-primary" }
      ],
      progress: { label: "threat containment", value: "100%", subLabel: "secured" }
    },
    workflow: [
      { step: "01", name: "Monitoramento Contínuo" },
      { step: "02", name: "Análise Heurística" },
      { step: "03", name: "Contenção Automática" }
    ],
    benefits: [
      { title: "Segurança Ativa", desc: "Sua operação protegida 24/7" }
    ],
    services: [
      { name: "DevSecOps", desc: "Integramos segurança desde o dia zero no ciclo de desenvolvimento." }
    ],
    ctaLabel: "agendar auditoria secops",
    technicalFeatures: [
      { title: "Zero Trust Architecture", desc: "Adoção de perímetro definido por software." }
    ],
    portfolio: [
      { client: "Global Fintech", project: "SecOps as a Service", result: "Redução de 95% em falsos positivos" }
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
      { title: "Escalabilidade Infinita", desc: "Infraestrutura desenhada para crescer com seu negócio." }
    ],
    services: [
      { name: "Cloud Management", desc: "Gestão inteligente de ambientes multi-cloud." }
    ],
    ctaLabel: "otimizar infraestrutura",
    technicalFeatures: [
      { title: "Infra as Code", desc: "Automação total via Terraform e afins." }
    ],
    portfolio: [
      { client: "E-commerce Giant", project: "Cloud Migration", result: "Zero downtime durante a Black Friday." }
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
      { title: "Agilidade Corporativa", desc: "Menos burocracia, mais entrega de valor técnico." }
    ],
    services: [
      { name: "Software Engineering", desc: "Construção de aplicações resilientes com padrões modernos." }
    ],
    ctaLabel: "acelerar meu software",
    technicalFeatures: [
      { title: "Arquitetura Hexagonal", desc: "Isolamos o domínio da sua aplicação contra obsolescência de frameworks." }
    ],
    portfolio: [
      { client: "Tech Unicorn", project: "App Refactoring", result: "Aumento de 300% na capacidade de TPS." }
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
      { title: "Produtividade Aumentada", desc: "Seu time foca no que a IA não pode copiar: a estratégia." }
    ],
    services: [
      { name: "IA Generativa no Backoffice", desc: "Automatização de análise de dados e suporte N1." }
    ],
    ctaLabel: "automatizar operações",
    technicalFeatures: [
      { title: "LLM Orchestration", desc: "Modelos privados acoplados ao seu banco de dados interno de forma segura." }
    ],
    portfolio: [
      { client: "Legal Tech", project: "Assistente Jurídico OS", result: "Contratos lidos 500x mais rápidos." }
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
      { title: "Resiliência Crítica", desc: "Proteção contra cenários extremos de perda de dados e indisponibilidade." }
    ],
    services: [
      { name: "Incident Response", desc: "Intervenção ativa de elite em cenários de violação corporativa." }
    ],
    ctaLabel: "agendar análise cirt",
    technicalFeatures: [
      { title: "Forensics Engine", desc: "Coleta e análise automatizada de artefatos." }
    ],
    portfolio: [
      { client: "Large Retail", project: "Ransomware Recovery", result: "Operação restaurada em menos de 8 horas." }
    ]
  }
};
