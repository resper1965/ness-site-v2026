export interface AssessmentQuestion {
  id: string;
  question: string;
  options: { label: string; score: number }[];
  category: string;
}

export interface AssessmentConfig {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  questions: AssessmentQuestion[];
  levels: { min: number; max: number; label: string; color: string; emoji: string; recommendation: string; cta: string }[];
  categories: string[];
}

export const assessments: Record<string, AssessmentConfig> = {
  lgpd: {
    slug: "lgpd",
    title: "maturidade lgpd",
    subtitle: "avalie sua conformidade em 3 minutos",
    description:
      "Descubra o nível de maturidade do programa de privacidade da sua organização com base nos requisitos da LGPD e melhores práticas internacionais.",
    categories: [
      "Governança",
      "Processos",
      "Tecnologia",
      "Pessoas",
    ],
    questions: [
      {
        id: "dpo",
        question: "Sua organização possui um Encarregado (DPO) nomeado e comunicado à ANPD?",
        category: "Governança",
        options: [
          { label: "Sim, formalmente nomeado e comunicado", score: 10 },
          { label: "Temos alguém designado, mas não formalizado", score: 5 },
          { label: "Não temos DPO", score: 0 },
        ],
      },
      {
        id: "ropa",
        question: "Sua organização mantém um Registro de Operações de Tratamento (ROPA) atualizado?",
        category: "Processos",
        options: [
          { label: "Sim, documentado e atualizado periodicamente", score: 10 },
          { label: "Temos um mapeamento parcial ou desatualizado", score: 5 },
          { label: "Não temos ROPA", score: 0 },
        ],
      },
      {
        id: "dpia",
        question: "São realizadas Avaliações de Impacto à Proteção de Dados (DPIA/RIPD)?",
        category: "Processos",
        options: [
          { label: "Sim, para todas as operações de alto risco", score: 10 },
          { label: "Apenas para alguns casos", score: 5 },
          { label: "Nunca realizamos", score: 0 },
        ],
      },
      {
        id: "privacy_policy",
        question: "Sua organização tem política de privacidade publicada e acessível aos titulares?",
        category: "Governança",
        options: [
          { label: "Sim, revisada nos últimos 12 meses", score: 10 },
          { label: "Temos, mas está desatualizada", score: 5 },
          { label: "Não temos política publicada", score: 0 },
        ],
      },
      {
        id: "consent",
        question: "Existe um mecanismo de gestão de consentimento dos titulares de dados?",
        category: "Tecnologia",
        options: [
          { label: "Sim, com registro de consentimento e opção de revogação", score: 10 },
          { label: "Coletamos consentimento, mas sem gestão centralizada", score: 5 },
          { label: "Não temos controle de consentimento", score: 0 },
        ],
      },
      {
        id: "incident",
        question: "Existe um processo de resposta a incidentes de privacidade?",
        category: "Processos",
        options: [
          { label: "Sim, com plano documentado, testado e com SLA para ANPD", score: 10 },
          { label: "Temos procedimentos informais", score: 5 },
          { label: "Não temos processo definido", score: 0 },
        ],
      },
      {
        id: "training",
        question: "Os colaboradores recebem treinamento periódico sobre privacidade e proteção de dados?",
        category: "Pessoas",
        options: [
          { label: "Sim, com programa anual e registro de participação", score: 10 },
          { label: "Realizamos treinamentos pontuais", score: 5 },
          { label: "Não realizamos treinamentos", score: 0 },
        ],
      },
      {
        id: "dpa",
        question: "Existem contratos de processamento de dados (DPA) com fornecedores que tratam dados pessoais?",
        category: "Governança",
        options: [
          { label: "Sim, com todos os fornecedores relevantes", score: 10 },
          { label: "Com alguns fornecedores", score: 5 },
          { label: "Não temos contratos DPA", score: 0 },
        ],
      },
      {
        id: "dsar",
        question: "Existe um canal e processo para atendimento de solicitações de titulares (DSAR)?",
        category: "Tecnologia",
        options: [
          { label: "Sim, com canal dedicado e SLA definido", score: 10 },
          { label: "Atendemos sob demanda, sem processo formal", score: 5 },
          { label: "Não temos canal para titulares", score: 0 },
        ],
      },
      {
        id: "audit",
        question: "São realizadas auditorias periódicas de conformidade com a LGPD?",
        category: "Processos",
        options: [
          { label: "Sim, com frequência definida e relatórios", score: 10 },
          { label: "Realizamos verificações informais", score: 5 },
          { label: "Nunca realizamos auditorias", score: 0 },
        ],
      },
    ],
    levels: [
      {
        min: 0,
        max: 30,
        label: "Crítico",
        color: "#ef4444",
        emoji: "🔴",
        recommendation:
          "Sua organização possui gaps críticos de conformidade com a LGPD. Recomendamos uma adequação completa com apoio de um DPO especializado. Risco regulatório elevado.",
        cta: "Agendar diagnóstico urgente",
      },
      {
        min: 31,
        max: 60,
        label: "Em Desenvolvimento",
        color: "#f59e0b",
        emoji: "🟡",
        recommendation:
          "Existem iniciativas, mas gaps significativos precisam ser endereçados. Um programa estruturado de adequação pode elevar rapidamente o nível de maturidade.",
        cta: "Iniciar programa de adequação",
      },
      {
        min: 61,
        max: 80,
        label: "Adequado",
        color: "#22c55e",
        emoji: "🟢",
        recommendation:
          "Bom nível de maturidade! Recomendamos manutenção contínua, atualização de ROPA e auditorias periódicas para garantir conformidade sustentável.",
        cta: "Contratar manutenção contínua",
      },
      {
        min: 81,
        max: 100,
        label: "Excelente",
        color: "#3b82f6",
        emoji: "🔵",
        recommendation:
          "Maturidade avançada. Sua organização pode buscar certificações internacionais (ISO 27701) e atuar como referência em privacidade no seu setor.",
        cta: "Avaliar certificação ISO 27701",
      },
    ],
  },

  cyber: {
    slug: "cyber",
    title: "maturidade em cibersegurança",
    subtitle: "avalie sua postura de segurança em 3 minutos",
    description:
      "Descubra o nível de maturidade da segurança cibernética da sua organização com base em frameworks como NIST CSF, CIS Controls e ISO 27001.",
    categories: [
      "Governança",
      "Infraestrutura",
      "Operações",
      "Pessoas",
    ],
    questions: [
      {
        id: "policy",
        question: "Sua organização possui uma Política de Segurança da Informação formalizada e revisada periodicamente?",
        category: "Governança",
        options: [
          { label: "Sim, revisada nos últimos 12 meses", score: 10 },
          { label: "Existe, mas está desatualizada", score: 5 },
          { label: "Não temos política formalizada", score: 0 },
        ],
      },
      {
        id: "firewall",
        question: "Como está a proteção de perímetro (firewall, WAF, IDS/IPS)?",
        category: "Infraestrutura",
        options: [
          { label: "NGFW + WAF + IDS/IPS com regras atualizadas", score: 10 },
          { label: "Firewall básico configurado", score: 5 },
          { label: "Sem proteção de perímetro ou desatualizada", score: 0 },
        ],
      },
      {
        id: "patching",
        question: "Existe um processo formal de gestão de patches e vulnerabilidades?",
        category: "Operações",
        options: [
          { label: "Sim, com scan periódico e SLA de correção", score: 10 },
          { label: "Realizamos patches reativamente", score: 5 },
          { label: "Não temos processo definido", score: 0 },
        ],
      },
      {
        id: "backup",
        question: "Qual a maturidade da estratégia de backup e recuperação de desastres (DR)?",
        category: "Infraestrutura",
        options: [
          { label: "Backup 3-2-1 com testes de restore periódicos e DR documentado", score: 10 },
          { label: "Temos backups, mas sem testes regulares", score: 5 },
          { label: "Backup irregular ou inexistente", score: 0 },
        ],
      },
      {
        id: "mfa",
        question: "Autenticação multifator (MFA) está implementada para acessos críticos?",
        category: "Infraestrutura",
        options: [
          { label: "MFA obrigatório para todos os sistemas críticos e VPN", score: 10 },
          { label: "MFA apenas para alguns sistemas", score: 5 },
          { label: "Não utilizamos MFA", score: 0 },
        ],
      },
      {
        id: "soc",
        question: "Existe monitoramento de segurança (SOC/SIEM) ativo?",
        category: "Operações",
        options: [
          { label: "SOC 24x7 com SIEM e playbooks de resposta", score: 10 },
          { label: "Monitoramento parcial em horário comercial", score: 5 },
          { label: "Sem monitoramento de segurança", score: 0 },
        ],
      },
      {
        id: "incident_response",
        question: "Existe um plano de resposta a incidentes cibernéticos documentado e testado?",
        category: "Operações",
        options: [
          { label: "Sim, com tabletop exercises periódicos", score: 10 },
          { label: "Temos um plano, mas nunca testamos", score: 5 },
          { label: "Não temos plano de IR", score: 0 },
        ],
      },
      {
        id: "awareness",
        question: "Os colaboradores recebem treinamento de conscientização em segurança?",
        category: "Pessoas",
        options: [
          { label: "Programa contínuo com simulações de phishing", score: 10 },
          { label: "Treinamentos pontuais anuais", score: 5 },
          { label: "Não realizamos treinamentos de segurança", score: 0 },
        ],
      },
      {
        id: "zerotrust",
        question: "A organização adota princípios de Zero Trust (menor privilégio, segmentação)?",
        category: "Governança",
        options: [
          { label: "Sim, com microsegmentação e PAM implementados", score: 10 },
          { label: "Iniciativas parciais de segmentação", score: 5 },
          { label: "Rede plana sem segmentação", score: 0 },
        ],
      },
      {
        id: "supply_chain",
        question: "Existe avaliação de risco de segurança em fornecedores e cadeia de suprimentos?",
        category: "Governança",
        options: [
          { label: "Sim, com due diligence, SLA de segurança e monitoramento contínuo", score: 10 },
          { label: "Avaliação inicial, sem monitoramento contínuo", score: 5 },
          { label: "Não avaliamos segurança de fornecedores", score: 0 },
        ],
      },
    ],
    levels: [
      {
        min: 0,
        max: 30,
        label: "Crítico",
        color: "#ef4444",
        emoji: "🔴",
        recommendation:
          "Sua organização está altamente exposta a ameaças cibernéticas. Gaps críticos em perímetro, monitoramento e resposta a incidentes precisam ser endereçados urgentemente.",
        cta: "Solicitar avaliação de emergência",
      },
      {
        min: 31,
        max: 60,
        label: "Em Desenvolvimento",
        color: "#f59e0b",
        emoji: "🟡",
        recommendation:
          "Existem controles básicos, mas lacunas significativas em monitoramento (SOC), resposta a incidentes e gestão de vulnerabilidades podem ser exploradas por atacantes.",
        cta: "Iniciar programa n.secops",
      },
      {
        min: 61,
        max: 80,
        label: "Adequado",
        color: "#22c55e",
        emoji: "🟢",
        recommendation:
          "Boa postura de segurança. Recomendamos evoluir para SOC 24x7, implementar Zero Trust completo e buscar certificação ISO 27001 para maturidade enterprise.",
        cta: "Evoluir para SOC gerenciado",
      },
      {
        min: 81,
        max: 100,
        label: "Excelente",
        color: "#3b82f6",
        emoji: "🔵",
        recommendation:
          "Maturidade avançada em cibersegurança. Considere threat hunting proativo, Red Team exercises e buscar certificações SOC 2 Type II ou ISO 27001.",
        cta: "Agendar Red Team assessment",
      },
    ],
  },
};
