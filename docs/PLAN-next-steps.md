# PROJETO: Próximos Passos (Next Steps) após Estabilização

> 📋 **Contexto:** Este plano está mapeado na **Fase 2 (Dívida Técnica)** e **Fase 3 (Conteúdo)** do [Roadmap Master](PLAN-epics-roadmap.md) — entregas E2.5 (streaming fix), E3.5 (media pipeline) e E2.4 (Playwright).

## Visão Geral
Concluímos um grande push na infraestrutura do **Canal CMS**. Eliminamos dívida técnica, expandimos o banco de dados via Drizzle, colocamos a base de SEO (Boilerplate removal) no Front-end (Next.js), fragmentamos código (`React.lazy`) para Web Vitals e implementamos um Queue de Cloudflare para prototipar integrações modernas de Inteligência Artificial usando o Llama-3.

Nossa arquitetura encontra-se assim: `site/` limpo, `canal/` resiliente, `canal/admin` veloz.

No entanto, há laços críticos abertos da prototipação e integrações que demandam fechamento antes do Deploy de Produção.

---

## 🔴 CRITÉRIOS DE SUCESSO (Success Criteria)
A implementação será bem sucedida quando:
1. O placeholder REST de imagens providenciar redimensionamento Real-Time via R2 e WebP (Resolvendo o TBT pesado no Site).
2. O Auto-tradutor IA (Llama 3) deixar de ser 'fire-and-forget' da porta pra fora e efetivamente Inserir o novo Post (`en`) traduzido ativamente no Banco D1.
3. A suíte de E2E (Playwright) estabilizar — notei que o executor `smoke.spec.ts` engasga constantemente após várias horas em modo "running".
4. O Webhook Consumer na Fila (`queue.ts`) estiver blindado com retries oficiais.

---

## 🛠 TECH STACK
- **Backend:** Cloudflare Workers, R2 Image Resizing, D1 SQLite.
- **Integrações:** Workers AI (`@cf/meta/llama-3-8b-instruct`), Cloudflare Queues.
- **Testes:** Playwright (com fix de Timeout).

---

## 📁 ESTRUTURA IMPACTADA
- `/canal/src/index.ts` (API Images) 
- `/canal/src/queue.ts` (Fechamento do fluxo da AI e persistência no Drizzle)
- `/canal/admin/tests/` (Refatoração E2E)

---

## 📋 TASK BREAKDOWN (Implementações Pendentes)

### [Task 1] Efetivação do Cloudflare R2 Media Endpoint
- **Agent:** `backend-specialist`
- **Por quê:** O LCP (Maior Conteúdo de Tela) do `site` sangrará sem isso. A rota `/media/:filename` configurada em `index.ts` é apenas texto.
- **INPUT:** Chamada HTTPS GET `/media/imagem.png?w=800`
- **OUTPUT:** Requisição via Fetch nativo vinculando os headers `cf-image` para auto-formato (Webp/AVIF) e redimensionamento antes da saída REST.
- **VERIFY:** Baixar imagem processada através da porta do servidor e conferir ganho de peso.

### [Task 2] Integração de Inserção da IA (Closed-loop Translation)
- **Agent:** `backend-specialist` // `database-architect`
- **Por quê:** Finalizar a promessa de Viabilidade de Ontem.
- **INPUT:** Resposta text/json pura que retorna de `env.AI.run` simulado da Fila.
- **OUTPUT:** Uso do `drizzle.insert(entries)` criando um novo Slot em `en`, salvando UUID novo com Tenant Link.
- **VERIFY:** D1 Database Explorer confirma a segunda query logo após chamada nativa ser resolvida.

### [Task 3] Saneamento da Suíte de Automação Playwright (Timeout Fix)
- **Agent:** `test-engineer`
- **Por quê:** Teremos a promessa do Sistema quebrado se o processo continuar "Gargalando/Travando" em Background. O terminal do Playwright reporta loop.
- **INPUT:** Refatoração de `/canal/admin/tests/smoke.spec.ts` para isolar workers ou ajustar a captura invisível para contornar instabilidade de rede.
- **OUTPUT:** Playwright finalizando as submissões em < 60s.
- **VERIFY:** Output Terminal limpo, retornando Exit 0.

---

## ✅ PHASE X: VERIFICATION

Após a execução destas atividades pelo `/create`, a monorepo passará pelos trâmites finais:

- [ ] **Lighthouse Build:** `npx next build` -> Auditar na nuvem para garantir imagens enxutas.
- [ ] **E2E Smoke:** O Test do Playwright rodar sem loop infinito nos stubs. 
- [ ] **Security:** O Insert de IA não abre SQL Injection via payload não-sanitizado do Llama 3 (Parsing estrito `Zod JSON`).
