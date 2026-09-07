# ness-site2026 Constitution

Esta é a Constituição oficial da plataforma digital da **ness.**, estabelecendo os princípios fundamentais, restrições e governança para todo desenvolvimento de software (Spec-Driven Development) executado por engenheiros e agentes de IA.

---

## Core Principles

### I. Spec-Driven Development (SDD)
Nenhum código de produção deve ser escrito sem uma especificação clara. O fluxo de trabalho de desenvolvimento segue rigidamente as fases:
1. **Spec** (Definição dos requisitos - o "quê" e o "porquê")
2. **Plan** (Desenho da arquitetura técnica e análise de impacto - o "como")
3. **Tasks** (Decomposição do plano em tarefas executáveis atômicas)
4. **Implement** (Escrita do código de forma iterativa acompanhada de testes)
5. **Verify** (Execução da checklist de qualidade e testes E2E)

### II. Midnight Precision Design
A estética visual da ness. é definida por precisão milimétrica, estilo minimalista e interfaces baseadas em escuro (dark mode por padrão). Os princípios visuais incluem:
- **Blue Dot (`.`)**: O ponto azul (`#00ade8`) posicionado após cabeçalhos e títulos como assinatura de marca.
- **Lowercase Everything**: A tipografia dos headings deve ser toda em letras minúsculas (ex: `infraestrutura crítica.`).
- **Proibição do Roxo (Purple Ban)**: Nenhuma variação de violeta ou roxo é permitida no design do ecossistema.
- **Bordas Sutis**: Evitar bordas marcadas. Usar opacidades sutis como `border-white/5` ou `border-white/10`.

### III. Multi-Brand & Tenant Architecture
O monorepo compartilha uma única codebase React servindo três marcas distintas em tempo de execução via detecção de hostname:
- **ness.** (`ness.com.br`) — Holding e engenharia digital de precisão.
- **trustness.** (`trustness.com.br`) — GRC, compliance e LGPD.
- **forense.io** (`forense.io`) — Perícia computacional e resposta a incidentes.
Qualquer alteração na UI ou em rotas compartilhadas deve preservar a lógica multi-brand (`src/config/brand.ts`) e garantir isolamento visual e semântico.

### IV. Cloudflare-Native & Stack Integrity
A infraestrutura é 100% nativa do ecossistema Cloudflare. É proibido introduzir dependências ou serviços externos de nuvem.
- **Backend**: Hono 4 rodando sob Cloudflare Workers.
- **Database**: Cloudflare D1 (SQLite) gerenciado via Drizzle ORM.
- **Storage**: Cloudflare R2 para mídias e uploads seguros.
- **IA e Embeddings**: Cloudflare Vectorize e Workers AI.
- **Autenticação**: Better Auth com plugins nativos de organização e agentes.

### V. Type-Safety & Zero Warnings
O código deve ser estritamente tipado em TypeScript.
- O comando `npx tsc --noEmit` deve sempre retornar **0 erros** em qualquer pull request.
- Evitar o uso de `any` explícito ou desativações de lint (`// @ts-ignore`). Se necessário usar um escape hatch, ele deve ser documentado e aprovado.

---

## Technical Constraints & Safety

### 1. Socratic Gate (Alinhamento Prévio)
Antes de qualquer alteração de código ou tomada de decisão arquitetural, o agente/desenvolvedor deve submeter a proposta ao **Socratic Gate** (conforme regras do `GEMINI.md`), fazendo perguntas de esclarecimento ou apresentando cenários de trade-off ao usuário.

### 2. File Dependency Awareness
Antes de editar qualquer arquivo, deve-se validar o mapa de dependências no `CODEBASE.md` ou `ARCHITECTURE.md` para assegurar que modificações locais não quebrem outros domínios da marca ou do Canal CMS.

### 3. Validação por Scripts
Nenhum deploy ou merge é aceito sem a execução prévia dos scripts de auditoria:
- `python .agent/scripts/checklist.py .` para validações rápidas (segurança, lint, schema, testes básicos).
- `python .agent/scripts/verify_all.py .` para auditorias completas pré-deploy (Lighthouse, E2E com Playwright, Bundle Analysis, Mobile e i18n).

---

## Development Workflow & Governance

1. **A Constituição é Soberana**: Este arquivo (`constitution.md`) prevalece sobre práticas antigas ou hábitos individuais. Quaisquer novos pacotes ou desvios de design precisam de amendação constitucional formal.
2. **Ciclo TDD (Test-Driven)**: Sempre que possível, defina ou prepare os testes automatizados antes de escrever a lógica de negócios da funcionalidade correspondente.
3. **Internacionalização Obrigatória (i18n)**: Textos e literais em telas voltadas ao usuário não podem ser "hardcoded". Devem ser integrados ao `src/i18n.ts` com suporte para Português, Inglês e Espanhol.

---

**Version**: 1.0.0 | **Ratified**: 2026-07-08 | **Last Amended**: 2026-07-08
