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
    overview: "Nossa resiliência não decorre de esforço manual, mas de orquestração arquitetônica. Construímos um ecossistema silencioso onde anomalias em seus endpoints e correios são lidas, mitigadas e auditadas legalmente antes que o seu comitê saiba de um potencial incidente. Menos dashboards ofuscantes, mais bloqueio em sub-segundos.",
    workflow: [
      { step: "01", name: "Telemetria Centralizada", desc: "Varredura contínua e inventário nos seus endpoints e domínios de correio (Microsoft/Google) via agentes embarcados." },
      { step: "02", name: "Isolamento Autônomo (SOAR)", desc: "Se identificado risco letal pelo nosso SIEM, playbooks táticos de SOAR acionam softwares de Gestão Remota (RMM) para conter e desabilitar endpoints instantaneamente." },
      { step: "03", name: "Integração Agêntica e GRC", desc: "IA atualiza painéis, alerta canais de crise (Teams/WhatsApp), e documenta o rastreio no POAM e plataformas ativas de controle legal (Privacidade)." }
    ],
    benefits: [
      { title: "Continuidade e Blindagem de Receita", desc: "Mais do que segurança, garantimos que suas operações não parem. Isolamento de ransomware e ameaças zero-day em tempo real para proteger seu faturamento e equidade de marca." },
      { title: "Conformidade Automatizada (GRC)", desc: "A cada intervenção, nossos sistemas compilam automativamente um rastro de auditoria. Diminui vertiginosamente o atrito gerencial em certificações LGPD/ISO e defesas regulatórias." },
      { title: "Zero-Noise Operacional", desc: "Sua equipe técnica não é um gargalo de triagem. A mitigação acontece sem intervenção manual (SLA sub-segundo), acordando a gestão e diretores apenas quando a ameaça letal já está na gaiola." }
    ],
    services: [
      { name: "SOC Agêntico (AI Triage)", desc: "Monitoramento 24/7 com integração fluida da sua telemetria (Office 365, Google Workspace, Azure) refinado por aprendizado contínuo para evitar escalonamentos ocos." },
      { name: "Gestão e Remediação Remota", desc: "Visão milimétrica sobre a vulnerabilidade de cada endpoint com aplicação cirúrgica de patches virtuais antes da infecção latente acontecer." },
      { name: "Orquestração Autônoma (SOAR)", desc: "Sistemas pre-escriptados que removem redes comprometidas do ar em sub-segundos, blindando instâncias laterais sem depender do clique de fuso horário de um engenheiro Tier 1." },
      { name: "Governança de Risco (POAM)", desc: "Atualização gerencial viva traduzindo alertas hiper-técnicos em Planos de Ação que conversam diretamente com as urgências normativas da alta diretoria." }
    ],
    ctaLabel: "agendar auditoria secops",
    technicalFeatures: [
      { title: "Plataforma Centralizada de Anomalias", desc: "Auditoria extensiva de endpoints e correios, fornecendo a espinha dorsal de identificação em tempo real." },
      { title: "Gestão Remota & Patching (RMM)", desc: "Busca de inventários, gerenciamento de vulnerabilidades e a capacidade de intervir fisicamente em dispositivos comprometidos." },
      { title: "Orquestração Autônoma (SOAR)", desc: "Geração de playbooks automáticos para análise imediata, disparando contenções táticas diretamente nos endpoints." },
      { title: "IA Agêntica e Integração Nativa", desc: "Agentes operando sobre EDR/XDR, orquestrando alertas para ITSM, corporativos e atualizando métricas no dashboard central." },
      { title: "Conformidade GRC Ativa", desc: "Cada resolução atualiza sua postura de risco (POAM) e trilha de privacidade em background, com rastreabilidade legal." }
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
