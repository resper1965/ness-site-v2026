# PLAN: Produção, Playwright QA e Conexão Frontend

**Escopo:** Implantação e orquestração do trio VITE/Next (Frontend), Nuvem Cloudflare (Produção do CMS) e CI/CD Robusto (Playwright E2E).
**Agentes:** `project-planner` -> transferindo para `frontend-specialist`, `devops-engineer` e `qa-engineer`.

## Visão Geral das Fases 

### Fase 1: Finalização de Deploy do Backend (CMS/API)
- Revisão dos bindings reais (`D1`, `R2`, `Vectorize`, `Queue`, `Workers Analytics`).
- Disparo do `npx wrangler deploy --env production` oficializando o ambiente SaaS que rodará o Backoffice e abrigará os clientes da Agência.

### Fase 2: Conexões de Frontend (Next.js - _ja existe_)
- Ajustar os Endpoints base de `site/` apontando estritamente para o ambiente de produção do Cloudflare Workers (`canal`).
- Validar se o mecanismo de SSR ou SSG interage perfeitamente em cache com o CMS para não onerar as conexões D1 via banco.

### Fase 3: E2E Playwright Actions
- Abstenção forte de runs em *localhost*. Toda aferição deve ser de *Nuvem*.
- Construção do `e2e.yml` rodando npx playwright em headless mode com destino principal à URL de preview/produção disponibilizada pela CLOUDFLARE.
- Validação das rotas essenciais de Admin, LGPD e N.CIRT garantindo que não há vazamentos no build recém montado.
