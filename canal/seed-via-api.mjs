/**
 * Seed script — popula Canal CMS com dados reais da ness.
 * Usa a API REST do backend diretamente.
 * 
 * Uso: node seed-via-api.mjs
 */

const BASE = 'https://canal.ness.workers.dev/api/v1';

// ── Helpers ─────────────────────────────────────────────────────
async function seed(collection, data) {
  const res = await fetch(`${BASE}/collections/${collection}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const status = res.status;
  const text = await res.text().catch(() => '');
  const label = data.title || data.name || data.source || '?';
  if (status >= 200 && status < 300) {
    console.log(`  ✓ [${collection}] ${label}`);
  } else {
    console.log(`  ✗ [${collection}] ${label} → ${status}: ${text.slice(0, 100)}`);
  }
}

// ── BRANDBOOK: Cores ────────────────────────────────────────────
const brandbook = [
  { title: 'Azul Ness Primary', slug: 'azul-ness-primario', category: 'cor', brand: 'ness', hex_value: '#0A84FF', desc: 'Cor primária institucional. Usada em CTAs, links e elementos de destaque.', usage_notes: 'Usar sobre fundo escuro para máximo contraste.' },
  { title: 'Surface Dark', slug: 'cinza-surface', category: 'cor', brand: 'ness', hex_value: '#1A1A2E', desc: 'Cor de fundo principal do site e dashboard.', usage_notes: 'Aplicar como background principal. Usar #242442 para cards.' },
  { title: 'Accent Cyan', slug: 'accent-cyan', category: 'cor', brand: 'ness', hex_value: '#00D4AA', desc: 'Cor de acento para badges e indicadores de sucesso.', usage_notes: 'Usar com parcimônia — máximo 10% da superfície visual.' },
  { title: 'Alert Red', slug: 'vermelho-alerta', category: 'cor', brand: 'ness', hex_value: '#FF453A', desc: 'Cor de alerta e ações destrutivas.', usage_notes: 'Exclusivo para estados de erro. Nunca usar decorativamente.' },
  { title: 'Text White', slug: 'branco-texto', category: 'cor', brand: 'ness', hex_value: '#F0F0F5', desc: 'Cor principal de texto sobre fundos escuros.', usage_notes: 'Para texto secundário usar #A0A0B8.' },
  { title: 'Inter', slug: 'inter-sans', category: 'tipografia', brand: 'ness', desc: 'Fonte principal para UI. Pesos: 400, 500, 600, 700.', usage_notes: 'Usar em admin panel, formulários e tabelas.' },
  { title: 'JetBrains Mono', slug: 'jetbrains-mono', category: 'tipografia', brand: 'ness', desc: 'Fonte monospace para código, IDs e dados técnicos.', usage_notes: 'Usar para code blocks, logs e outputs.' },
  { title: 'ness. Logo Dark', slug: 'ness-logo-dark', category: 'logo', brand: 'ness', desc: 'Logo principal para fundo escuro. SVG.', usage_notes: 'Mínimo 120px de largura. Sempre com o ponto final.' },
  { title: 'Aegis Shield', slug: 'aegis-logo', category: 'logo', brand: 'aegis', desc: 'Logo da vertical Aegis (cibersegurança).', usage_notes: 'Usar apenas em contextos de segurança e compliance.' },
];

// ── SIGNATURES ──────────────────────────────────────────────────
const signatures = [
  { name: 'Ricardo Esperança', slug: 'ricardo-esperanca', role: 'CEO & Founder', email: 'resper@bekaa.eu', phone: '+351 912 345 678', brand: 'ness', department: 'Diretoria', linkedin: 'https://linkedin.com/in/ricardoesperanca' },
  { name: 'Ana Silva', slug: 'ana-silva', role: 'CTO', email: 'ana.silva@ness.com.br', phone: '+55 11 98765 4321', brand: 'ness', department: 'Engenharia', linkedin: 'https://linkedin.com/in/anasilva-tech' },
  { name: 'Marcos Oliveira', slug: 'marcos-oliveira', role: 'Head of Cybersecurity', email: 'marcos@aegis.ness.com.br', phone: '+55 11 91234 5678', brand: 'aegis', department: 'Engenharia', linkedin: 'https://linkedin.com/in/marcosoliveira-sec' },
  { name: 'Carla Mendes', slug: 'carla-mendes', role: 'Diretora Comercial', email: 'carla.mendes@ness.com.br', phone: '+55 11 97654 3210', brand: 'ness', department: 'Comercial', linkedin: 'https://linkedin.com/in/carlamendes' },
];

// ── INSIGHTS ────────────────────────────────────────────────────
const insights = [
  { title: 'IA Generativa nas Empresas: O Que Mudou em 2026', slug: 'ia-generativa-2026', tag: 'IA', icon: 'Brain', date: '2026-04-10', featured: true, desc: 'A adoção de IA generativa saltou de projetos piloto para operações críticas. Analisamos como empresas brasileiras estão integrando LLMs.', body: '## A Revolução Silenciosa\n\nEm 2026, a IA generativa não é mais novidade — é infraestrutura.\n\n### Principais Tendências\n\n1. **RAG Corporativo** — Retrieval-Augmented Generation sobre bases proprietárias\n2. **Agentes MCP** — Model Context Protocol permite que LLMs acessem ferramentas\n3. **IA on Edge** — Modelos rodando em Workers para latência sub-100ms' },
  { title: 'Zero Trust: Além do Perímetro em 2026', slug: 'zero-trust-2026', tag: 'Segurança', icon: 'Shield', date: '2026-03-22', featured: true, desc: 'O modelo Zero Trust evoluiu de buzzword para padrão regulatório.', body: '## O Fim do Perímetro\n\nA arquitetura tradicional de firewall + VPN não funciona mais.\n\n### Pilares do Zero Trust Moderno\n\n- **Identity-first:** Cada request é autenticada.\n- **Least Privilege:** Acesso mínimo necessário.\n- **Continuous Verification:** Postura reavaliada a cada sessão.' },
  { title: 'LGPD em 2026: Multas e Fiscalização', slug: 'lgpd-multas-2026', tag: 'Compliance', icon: 'FileCheck', date: '2026-04-01', featured: false, desc: 'A ANPD intensificou a fiscalização. Análise das multas e checklist para adequação.', body: '## Panorama Regulatório\n\nA ANPD aplicou R$ 52 milhões em multas no Q1 2026.\n\n### Checklist de Adequação\n\n- Mapeamento de dados pessoais (ROPA)\n- Política de privacidade atualizada\n- DPO nomeado e registrado\n- Procedimento de resposta a incidentes' },
  { title: 'Edge Computing com Cloudflare Workers', slug: 'edge-computing-workers', tag: 'Cloud', icon: 'Cloud', date: '2026-03-15', featured: false, desc: 'Workers, D1, R2, Vectorize — como construímos toda a stack SaaS na edge.', body: '## Por Que Edge?\n\nLatência importa. Com Workers, o código roda em 300+ data centers.\n\n### Stack Canal CMS\n\n- Runtime: Cloudflare Workers (Hono)\n- Database: D1 (SQLite distribuído)\n- Storage: R2 (S3-compatible)\n- AI: Workers AI\n- Search: Vectorize' },
];

// ── CASES ───────────────────────────────────────────────────────
const cases = [
  { client: 'Instituição Financeira Nacional', slug: 'banco-soc-24x7', category: 'segurança', project: 'SOC 24x7 com SIEM Integrado', result: 'Redução de 89% no tempo de resposta a incidentes', desc: 'Implementação de Centro de Operações de Segurança com monitoramento contínuo para uma das maiores instituições financeiras do Brasil.', stats: '89% faster response | 24/7 coverage | 15M events/day', featured: true },
  { client: 'Rede Hospitalar', slug: 'hospital-lgpd', category: 'compliance', project: 'Adequação LGPD Completa', result: '100% de conformidade ANPD em 4 meses', desc: 'Programa completo de adequação à LGPD para rede com 12 unidades hospitalares. Incluiu mapeamento de 340 processos.', stats: '340 processos mapeados | 12 unidades | 4 meses', featured: true },
  { client: 'Varejo Nacional', slug: 'varejo-cloud', category: 'cloud', project: 'Migração Cloud-First', result: '45% de redução em custos de infraestrutura', desc: 'Migração de data center on-premise para multi-cloud (AWS + Cloudflare) para rede varejista com 200 lojas.', stats: '200 lojas | 45% cost reduction | 99.99% uptime', featured: false },
];

// ── JOBS ────────────────────────────────────────────────────────
const jobs = [
  { title: 'Engenheiro(a) de Segurança Sênior', vertical: 'segurança', location: 'São Paulo, SP (Híbrido)', type: 'Full-time', desc: 'Liderar operações de segurança ofensiva e defensiva no SOC Aegis.', requirements: ['5+ anos em cibersegurança', 'CISSP, CEH ou equivalente', 'Experiência com SIEM/SOAR', 'Cloud security', 'Inglês avançado'] },
  { title: 'Dev Full-Stack (Edge/Workers)', vertical: 'engenharia', location: 'Remoto (Brasil/Portugal)', type: 'Full-time', desc: 'Plataformas SaaS na edge com Cloudflare Workers, D1 e Hono.', requirements: ['3+ anos TypeScript', 'Cloudflare Workers / edge', 'React/Next.js', 'SQL (D1/PostgreSQL)', 'AI/LLM diferencial'] },
  { title: 'Consultor(a) de Privacidade e LGPD', vertical: 'segurança', location: 'São Paulo, SP', type: 'Full-time', desc: 'Consultoria em adequação LGPD para clientes enterprise.', requirements: ['Formação em Direito ou Tecnologia', 'Certificação DPO/CDPO', '2+ anos LGPD/GDPR', 'NIST, ISO 27701', 'Comunicação C-Level'] },
];

// ── PAGES ───────────────────────────────────────────────────────
const pages = [
  { title: 'Sobre a ness.', slug: 'sobre', meta_title: 'Sobre a ness. | Tecnologia desde 1991', meta_description: 'A ness. é uma empresa de tecnologia com 34+ anos de experiência.', body: '## Quem Somos\n\nA **ness.** é uma empresa de tecnologia fundada em 1991.\n\n## Verticais\n\n- **ness. Infrastructure** — Data center, redes, telecom\n- **Aegis by ness.** — SOC, SIEM, LGPD, pentest\n- **ness. Cloud** — Multi-cloud, edge, serverless\n- **ness. AI** — RAG, agentes MCP, automação cognitiva' },
  { title: 'Nossos Serviços', slug: 'servicos', meta_title: 'Serviços | ness. Tecnologia', meta_description: 'Infraestrutura, cibersegurança, cloud e IA para empresas.', body: '## Serviços\n\n### 🏗️ Infraestrutura & Redes\nProjeto e gestão de infraestrutura corporativa.\n\n### 🛡️ Cibersegurança (Aegis)\nSOC 24x7, SIEM, pentest, compliance.\n\n### ☁️ Cloud & Edge\nMigração cloud-first, multi-cloud.\n\n### 🤖 Inteligência Artificial\nRAG corporativo, agentes MCP, Workers AI.' },
];

// ── FORMS (submissions de exemplo) ──────────────────────────────
const forms = [
  { source: 'site-contato', payload: { nome: 'João Pereira', email: 'joao@empresa.com.br', assunto: 'Orçamento SOC', mensagem: 'Gostaria de receber um orçamento para SOC 24x7.' } },
  { source: 'site-newsletter', payload: { email: 'maria@startup.io', nome: 'Maria Costa', interesse: 'IA e Automação' } },
];

// ── Execute Seed ────────────────────────────────────────────────
async function main() {
  console.log('\n🌱 Seeding Canal CMS com dados da ness.\n');
  
  console.log('📦 Brandbook:');
  for (const item of brandbook) await seed('brandbook', item);
  
  console.log('\n✉️  Signatures:');
  for (const item of signatures) await seed('signatures', item);
  
  console.log('\n📝 Insights:');
  for (const item of insights) await seed('insights', item);
  
  console.log('\n💼 Cases:');
  for (const item of cases) await seed('cases', item);
  
  console.log('\n👥 Jobs:');
  for (const item of jobs) await seed('jobs', item);
  
  console.log('\n📄 Pages:');
  for (const item of pages) await seed('pages', item);
  
  console.log('\n📬 Forms:');
  for (const item of forms) await seed('forms', item);
  
  console.log('\n✅ Seed completo!\n');
}

main().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
