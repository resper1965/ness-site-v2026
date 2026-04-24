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
};
