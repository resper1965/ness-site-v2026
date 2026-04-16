/**
 * seed-vectors.ts — Ingestão dos dados de solutionsData no Cloudflare Vectorize
 *
 * Uso: npx wrangler dev --test-scheduled  (depois curl POST)
 *   OU: via rota administrativa /api/admin/seed-vectors
 *
 * Lê as soluções da ness., chunka textos, gera embeddings via Workers AI
 * (@cf/baai/bge-base-en-v1.5) e insere no índice canal-vectors.
 */

// Mapeamento estático das soluções — extraído de solutionsData.ts
// (Usado como source-of-truth para RAG do chatbot)
export const SOLUTIONS_CORPUS = [
  {
    id: "secops",
    title: "n.secops",
    content: `n.secops — Segurança de elite para sua infraestrutura.
Consolida Monitoramento 24x7, Resposta Imediata e Gestão de Riscos (GRC) em um único contrato.
Serviços: Motor SOC 24x7 (MDR), Gestão Contínua de Vulnerabilidades, Threat Intelligence e Forense.
Benefícios: Previsibilidade Operacional, Inteligência para Decidir, Visão via Portal GRC.
O n.secops entrega defesa contínua de escala global sem que o cliente precise inflar sua equipe interna.
Workflow: Visibilidade Total 24/7 → Resposta Imediata → Pronto para Auditorias.
Features: Motor SOC 24x7, Correlação SIEM Avançada, EDR/AV Next-Gen com ML, Gestão Contínua de Vulnerabilidades, Application Patch Management, Security Hardening (CIS/NIST), Inventário Discovery de Ativos, Orquestração Incident Response, Feeds de Threat Intelligence, Reportes Táticos Executivos.`
  },
  {
    id: "infraops",
    title: "n.infraops",
    content: `n.infraops — Infraestrutura estável e resiliente.
Assume a operação completa do ambiente — do Service Desk L1/L2/L3 à gestão de ITIL e Cloud.
Serviços: Service Desk (L1/L2/L3), Gestão de Ambientes Cloud (AWS/Azure/GCP), NOC 24×7.
Benefícios: Eliminação de firefighting, Previsibilidade de Custos, Resolução até N3.
Features: Service Desk L1/L2/L3 ITIL, Gestão AWS/Azure/GCP, NOC 24×7, CMDB, Capacity Planning, Change Management ITIL, Automation Runbooks, DR/BCP Orchestration.
Workflow: Assessment Inicial → Setup ITSM e CMDB → Operação e SLA Ativo.`
  },
  {
    id: "aiops",
    title: "n.aiops",
    content: `n.aiops — Inteligência Artificial aplicada às operações.
Implementação de IA generativa e agentes autônomos para orquestração de conhecimento e tomada de decisão em tempo real.
Serviços: Consultoria de Casos de Uso, Implementação de Agentes, Data Intelligence.
Benefícios: Automação de decisões complexas, Redução de tempo de resposta, Orquestração de conhecimento corporativo.
Casos: Copiloto logístico com IA generativa (Gabi.OS), triagem inteligente via NLP em healthtech, automação de backoffice.
Features: Automação Decisória com Agentes, Ingestão e RAG Corporativo, NLP/NLU Pipeline, ML Ops, AI Ethics Governance.`
  },
  {
    id: "cirt",
    title: "n.cirt",
    content: `n.cirt — Orquestração de Crises e Resposta a Incidentes.
Coordenação completa de resposta a incidentes de segurança — desde a ativação do War Room até a recuperação total.
A ness. NÃO executa a forense "mão na massa": orquestra equipes internas do cliente, peritos externos e laboratórios forenses especializados.
Serviços: Command Center (War Room), Coordenação de Perícia Forense, Comunicação Estratégica de Crise, Programa de Prontidão.
Benefícios: Redução drástica do tempo de contenção, Preservação de evidências para processo legal, Comunicação coordenada com reguladores e mídia.
Workflow: Ativação Imediata → Comando e Coordenação → Contenção e Recuperação → Pós-Incidente.
A ness. age como o "general do campo de batalha" que articula todas as frentes simultaneamente.`
  },
  {
    id: "compliance",
    title: "n.compliance",
    content: `n.compliance — Governança, Risco e Conformidade (GRC).
Programa completo de adequação legal e normativa — LGPD, ISO 27001, SOC 2, PCI-DSS, HIPAA, GDPR.
Serviços: Assessment de Maturidade, Implementação de Frameworks, DPO as a Service, Auditoria Contínua.
Benefícios: Conformidade legal garantida, Redução de risco regulatório, Evidências prontas para auditoria.
Features: LGPD/GDPR Assessment, ISO 27001 Implementation, SOC 2 Readiness, PCI-DSS Compliance, DPO as a Service, Risk Register, Policy Framework, Audit Trail Automatizado, Treinamento e Conscientização.`
  },
  {
    id: "about-ness",
    title: "Sobre a ness.",
    content: `A ness. é uma empresa de tecnologia fundada em 12 de junho de 1991.
Mais de 34 anos de experiência no mercado de TI corporativa.
Escritórios em São Paulo, Portugal e Chile. Presença operacional em 3 continentes.
Áreas de atuação: Cibersegurança, Infraestrutura, Inteligência Artificial, Resposta a Incidentes, Compliance.
Pilares das soluções: n.secops, n.infraops, n.aiops, n.cirt, n.compliance.
Missão: Entregar segurança, resiliência e inteligência para empresas que não podem parar.`
  }
]

/**
 * Gera embeddings e insere no Vectorize.
 * Chamado via rota admin ou scheduled event.
 */
export async function seedVectors(env: any) {
  const results: string[] = []

  for (const doc of SOLUTIONS_CORPUS) {
    // Gerar embedding via Workers AI
    const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
      text: [doc.content]
    }) as any

    const vector = {
      id: doc.id,
      values: embedding.data[0],
      metadata: {
        title: doc.title,
        content: doc.content.slice(0, 1000) // metadata cap
      }
    }

    await env.VECTORIZE.upsert([vector])
    results.push(`✅ ${doc.id} (${doc.title})`)
  }

  return results
}
