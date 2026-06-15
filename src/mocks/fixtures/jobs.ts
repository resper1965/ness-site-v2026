import type { Job } from '../../types/canal';

export const jobsMock: Job[] = [
  {
    id: 'mock-job-1',
    title: 'Engenheiro de Segurança — SOC',
    vertical: 'forense.io / n.cirt',
    location: 'Remoto (Brasil)',
    type: 'CLT',
    desc: 'Monitoramento e resposta a incidentes de segurança. Análise de alertas SIEM, threat hunting e desenvolvimento de playbooks de resposta.',
    requirements: [
      'Experiência com SIEM (Splunk, IBM QRadar ou Microsoft Sentinel)',
      'Conhecimento em frameworks MITRE ATT&CK e Kill Chain',
      'Desejável: certificações CEH, GCIH ou CompTIA Security+',
      'Disponibilidade para plantão (regime de escala)',
    ],
  },
  {
    id: 'mock-job-2',
    title: 'Especialista em Cloud & Infraestrutura',
    vertical: 'ness.',
    location: 'Híbrido — SP/RJ ou Remoto',
    type: 'CLT',
    desc: 'Projeto, implantação e operação de ambientes multi-cloud (AWS, Azure, GCP). Automação com Terraform, Kubernetes e GitOps.',
    requirements: [
      'Kubernetes em produção (3+ anos)',
      'Terraform e IaC obrigatórios',
      'Experiência com Cloudflare Workers e Edge Computing é diferencial',
      'Certificações cloud (AWS Solutions Architect, AZ-104 ou equivalente)',
    ],
  },
  {
    id: 'mock-job-3',
    title: 'Consultora DPO — trustness.',
    vertical: 'trustness.',
    location: 'Remoto (Brasil)',
    type: 'PJ',
    desc: 'Atuar como DPO as a Service para carteira de clientes. Condução de adequação LGPD, atendimento de DSARs, treinamentos e relacionamento com ANPD.',
    requirements: [
      'Graduação em Direito, TI ou correlatas',
      'Experiência comprovada com LGPD e GDPR',
      'Desejável: CIPM, CIPP/E ou certificação ANPD',
      'Excelente comunicação escrita — elaboração de relatórios e pareceres',
    ],
  },
];
