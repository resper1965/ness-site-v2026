# PLAN-user-settings

## Resumo
Implementação de um painel de **Configurações de Contra (Profile Settings)** para os usuários administrativos do Canal CMS, rodando no tier Better Auth, focando na recomendação de Opção B e C com os mais altos rigores de segurança multi-tenant (SaaS). 

## Objetivos (Scope)
- Permitir edição de nome de usuário e avatar via interface (`updateUser`).
- Fluxo de alteração de senha revogando outras sessões (`changePassword`).
- Alteração segura de e-mail (requer confirmação do e-mail novo).
- Habilitar remoção da conta (`deleteUser`) e vínculo de contas sociais Oauth (`accountLinking`) se exigido via settings futuros.

## Architectura
A solução será dividida em Back-end (Hono SDK do Better Auth) e Front-end (React + authClient exportado).

## Passo a Passo (Task Breakdown)

### 1. Phase 1: Backend Security (auth.ts) [backend-specialist]
- Atualizar `canal/src/auth.ts`.
- Habilitar `user.changeEmail: { enabled: true }`.
- Habilitar `user.deleteUser: { enabled: true }` (e adicionar validações ou regras).
- Habilitar `account.accountLinking: { enabled: true }`.
- Certificar-se de ter hooks de envios simulados de e-mail, caso a plataforma não tenha ainda SMTP funcional.

### 2. Phase 2: Frontend API Client [frontend-specialist]
- Criar/exportar uma estância unificada do `authClient` do Better Auth no path do admin panel (`canal/admin/src/lib/auth-client.ts`) para acessar a URL em `/api/v1/auth`.

### 3. Phase 3: Profile Settings UI [frontend-specialist]
- Criar a rota no react em `canal/admin/src/routes/settings/profile.tsx`.
- Adicionar abas/sections:
  - **Dados Pessoais**: Formulário para nome e foto de perfil (`authClient.updateUser`).
  - **Gerenciamento de Senha**: Formulário para senha atual e nova senha (`authClient.changePassword()`).
  - **E-mails de Acesso**: Formulário para migrar e-mails (`authClient.changeEmail()`).
  - **Vinculo de Contas**: Exibir provedores conectados e botões Google/Microsoft/GitHub.
  - **Zona de Perigo**: Botão Hard-delete the account.

### 4. Phase 4: Verification [test-engineer]
- Garantir que todos os componentes TypeScript se auto-verifiquem como isentos de falhas via `npx tsc --noEmit`.
- Inspecionar brechas de injeção e se as proteções de autenticação continuam intactas nas controllers internas de UI.

---

## Agent Pipeline Orchestration

**Agents Requiring Invocation:**
1. `backend-specialist`: Atualizará logicamente a fundação do Better Auth.
2. `frontend-specialist`: Montar a interface gráfica completa interligada com as chamadas de Client.
3. `test-engineer`: Compilação de código e análise superficial de vazamento de rotas.
