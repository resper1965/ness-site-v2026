# PLAN: Resolução de Débito Técnico no `canal`

> 📋 **Contexto:** Este plano está mapeado na **Fase 2 (Dívida Técnica & Qualidade)** do [Roadmap Master](PLAN-epics-roadmap.md) — entregas E2.2 (Drizzle ORM), E2.3 (God Files) e E2.4 (E2E Testing).

Este plano detalha os débitos técnicos encontrados no módulo `canal` (backend e backoffice) na data de auditoria e os passos necessários para saná-los, garantindo estabilidade e manutenibilidade para produção.

## 🔴 User Review Required

> [!IMPORTANT]
> Aprovação Necessária
> Precisamos confirmar a ordem de prioridade para estas correções. Qual área você gostaria de atacar primeiro: **Infraestrutura de Testes, Backend (SQL Raw) ou Frontend (Acoplamento/Clean Code)?**  

## 🛠️ Débitos Técnicos Encontrados

Após execução dos comandos de auditoria da estrutura estática das pastas (`canal/src` e `canal/admin/src`), identificamos 4 grandes origens de possíveis débitos técnicos de arquitetura e manutenibilidade:

1. **Testes Automatizados Inexistentes (E2E e Unitários)**
   - O diretório principal carece de diretórios convencionais de validação como `tests/` ou `e2e/`.
   - *Risco:* Regressão em produção. Alterações no backoffice quebrarão fluxos não supervisionados sem detecção prévia. Esta era, aliás, uma pendência apontada em metas passadas da arquitetura (Playwright E2E).

2. **Dívida de Banco de Dados (`Raw SQL`) no Backend**
   - O arquivo `canal/src/mcp.ts` continua a utilizar *queries* em via strings não-tipadas (por exemplo `.prepare('SELECT').bind()`), ao invés das tipagens Drizzle ORM estruturadas no sistema base de ORM (para D1).
   - *Risco:* Inconsistências de schema, quebra na segurança (se concatenado impropriamente a longo prazo) e falta de *Type-Safety*.

3. **Arquivos Monolíticos de Frontend ("God Files") no Administrador**
   - Várias rotas do seu backoffice concentram muita responsabilidade HTML, estados locais longos e renderização complexa. Exemplo:
      - `canal/admin/src/routes/saas.tsx` (723 linhas).
      - `canal/admin/src/routes/collection.tsx` (593 linhas).
      - `canal/admin/src/routes/dashboard.tsx` (547 linhas).
   - *Risco:* Alta complexidade ciclomática, código redundante, dificuldades para adicionar refatorações por outro engenheiro.

4. **Folha de Estilo Global Sobrecarregada**
   - O arquivo `canal/admin/src/index.css` tem quase 1000 linhas de CSS base puro.
   - *Risco:* Dificuldade em debugar conflitos de regras visuais globais (escopo vazando) para os componentes das novas páginas criadas, ao invés da abordagem CSS Modules ou Tokens locais.

---

## 📋 Plano de Ação (Task Breakdown)

Com o foco único na estabilização conforme as boas práticas (`@[skills/clean-code]`), propomos a execução por fases.  

### Fase 1: Padronização Backend (Type-Safety vs Raw SQL)
- [ ] Refatorar `canal/src/mcp.ts` converter as operações (`all`, `first`, `run` SQL inline) para Drizzle queries tipadas integradas com o sistema de `db` principal já disponível no projeto.
- [ ] Executar o `npx tsc --noEmit` de auditoria para assegurar tipagens em 100% dos fluxos.

### Fase 2: Desacoplamento Frontend (SaaS, Admin UI & CSS)
- [ ] **Mudar "God Files" para Composition:** Extrair as seções ricas em métricas/tabelas (particularmente no SaaS e Dashboard) em componentes independentes `/canal/admin/src/components/...` limpos.
- [ ] **Limpeza de CSS:** Consolidar e enxugar o `index.css`, movendo tokens de modulação em arquivos correspondentes e adotar variáveis nativas quando cabível.

### Fase 3: Infra Estrutura e Framework E2E 
- [ ] Efetuar a configuração base do **Playwright** para cobrir os fluxos cruciais da plataforma via `E2E`.
- [ ] Escrever o bypass de autorização (para ambiente teste local).
- [ ] Adicionar o teste inicial (Smoke Test) simulando manipulação e login Admin no dashboard.

## 🎯 Verification Plan

### Testes Automáticos
- Pipeline limpo para CLI (0 avisos de erro de Tipagem na pasta).
- Suíte do Playwright validando as mudanças de frontend `GREEN`.

### Validação Manual  
- Validar se o carregamento local nas telas do SaaS continuam corretos visualmente no painel.
- Rever Logs e Console da rede para assegurar que chamadas backend convertidas ao ORM retornam exatamente as mesmas respostas.
