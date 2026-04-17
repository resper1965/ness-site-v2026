# Projeto: Auditoria e Expansão da Administração SaaS

Este documento planeja os próximos passos para fechar o ciclo de gestão de SaaS na plataforma Canal. Atualmente a fundação com Better Auth foi bem implementada, mas há lacunas operacionais para os Administradores Globais (`admin@ness.com.br`, `resper@bekaa.eu`).

## 1. Auditoria do Estado Atual (O que já temos)

Avaliei o banco de dados e os contratos atuais da sua API:

### A. Capacidades do Plugin `admin` (Better Auth)
- Traz as colunas `role` ("admin" | "user") e controle de banimentos globais.
- ✅ **UI Concluída**: Já criamos a aba `/users` onde você consegue gerenciar o acesso global da base inteira.

### B. Capacidades do Plugin `organization` (SaaS Tenants)
- Traz tabelas de `organization`, `member` e convites.
- Os membros internos do tenant possuem a própria hierarquia de roles: `owner`, `admin`, `member`.
- Adicionamos campos extensíveis de plano (`plan: "free" | "pro" | "enterprise"`) e `usageLimit`.
- ✅ **UI Concluída**: Já criamos a aba `/saas` para gestão isolada de um Workspace (Membros, Switcher de Planos, Troca de Slug e Exclusão Segura).

### C. Capacidades do Plugin `api-key` (Para Agentes e Máquinas M-2-M)
- Já configurado no servidor para permitir que agentes do Claude ou automações pinguem a API passando `x-api-key`.
- ✅ **UI Concluída**: Já criamos a aba de "Desenvolvedor" no painel de Configurações Organizacionais (`saas.tsx`) para gerar tokens de acesso nativos interagindo com o plugin `apiKey()`.

---

## 2. A Grande Lacuna: Gestão Global de Organizações

Como Super Admin (Gestor da Plataforma), você hoje gerencia usuários globalmente... **Mas você não gerencia Organizações Globalmente.**

Hoje um usuário normal pode ser banido por você através do `/users`. Porém, se uma empresa violar as regras ou precisar de um Upgrade Manual feito pela Ness, **você não consegue visualizar uma grade listando todas as Organizações do banco, a menos que você seja membro direto delas.**

### 🎯 Rota Global `/organizations` (✅ Implementado)
Apenas para Super Admins, uma página irmã da `/users`:
1. ✅ Lista todos os Tenants que existem no sistema.
2. ✅ Mostra quantos membros cada um tem.
3. ✅ Permite **Deletar** organizações infratoras.
4. ✅ Permite forçar a mudança de plano comercial (Ex: migrar uma empresa de Free para Enterprise).
5. [Opcional] Botão "Acessar como Admin" (futuro).

---

## 3. Onde os Super Admins Mapeados Agem

Atualmente as variáveis de trava no Frontend são:
`const SUPER_ADMIN_EMAILS = ["resper@bekaa.eu", "admin@ness.com.br"];`

As travas no servidor (`backend-specialist` role) são as colunas de banco:
`role: "admin"`

A arquitetura está segura: se alguém burlar a trava do frontend `SUPER_ADMIN_EMAILS`, será derrubado na proteção RPC (`ctx.session.user.role === 'admin'`).

---

## 🛑 User Review Required (Socratic Gate)

Antes de eu fechar o planejamento ou escrever uma linha de código, preciso da sua priorização. Responda a estas questões:

1. **Gestão Global de Orgs**: Você precisará ver TODAS as empresas do banco e controlar os planos comerciais delas dentro do Dashboard Admin da Ness, correto? 
2. **API Keys**: Os "Agentes MCP" (da tela SaaS Visão Geral) vão precisar de chaves para autenticar nessa API. Quer que eu planeje uma área "Desenvolvedor / API Keys" dentro da tela de SaaS (`saas.tsx`) para o cliente gerar seus próprios hashes?
3. **Limite de Criação**: Os clientes pagantes poderão criar infinitas Organizações clicando no "Nova Organização"? Atualmente eu só libero o "Nova Organização" **para Super Admins** e barrava usuários normais para que vocês centralizem a venda. Mantemos o modelo "só a Ness abre novos tenants"?

Aguardando sua validação para definirmos se incluo o painel de "Gestão de APIs" e "Painel Global das Orgs" no roadmap!
