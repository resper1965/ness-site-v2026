# PLAN: Canal Modules Refactor

## 🎯 Overview
Reestruturação e unificação da arquitetura de módulos do Canal CMS. O objetivo é remover fragmentações herdadas do antigo backoffice, consolidando fluxos de mídia, inteligência artificial (RAG), tratativa de incidentes (Emergência) e governança em interfaces especializadas e bem diagramadas. O foco da reorganização é alinhar as funções disponíveis às rotinas "Tenant" em vez de operações "SaaS Global".

**Project Type:** WEB (React, Vite, Tailwind CSS v4)

## 🏆 Success Criteria
- [ ] O menu lateral (NAV) reflete precisamente as intenções organizacionais e de negócios do cliente da Ness, sem mesclar rotinas nativas de infraestrutura.
- [ ] `media.tsx` atua divididamente como um repositório clássico ("Public Media") e uma docstore de metadados para IA generativa ("Knowledge Base / RAG").
- [ ] Rotinas restritas limitam a ação generativa indesejada (como o Upload Estático de Decks).

## 🛠️ Tech Stack
- React 19 + TypeScript
- React Router (Configuração Client-Side via `App.tsx` / Lazily Loaded Routes)
- Tailwind CSS v4 (Sintaxe `bg-linear` e tokens semânticos)
- Componentes Base Funcionais e Hooks de Fetch

## 📁 File Structure Impact
```text
canal/admin/src/
├── components/dashboard/
│   └── nav-config.tsx        (Estrutura do Menu)
├── routes/
│   ├── media.tsx             (Assets Públicos e Base RAG)
│   ├── emergency.tsx         (Fluxo de Crises do Cliente - Opcional via Webhooks)
│   ├── decks.tsx             (Depósito Simplificado)
│   └── compliance.tsx        (Integração OneTrust/Denúncias)
```

---

## 📋 Task Breakdown (Epics)

### Fase 1: Fundação Estrutural de Rotas (Navigation)

**Task 1.1: Reorganização do NAV Object**
- **Ref:** Correção do Menu baseado na lógica de Tenant-Driven
- **Agente Sugerido:** `frontend-specialist` | **Skill:** `frontend-design`
- **INPUT:** `nav-config.tsx` e `dashboard.tsx` atual.
- **OUTPUT:** Remoção total do 'Fluxo de Emergência' da área Global. Reorganização do Chatbot para o hub do Media (ou mesclado nos Assets/IA). Update semântico das chaves `PAGE_META`.
- **VERIFY:** O dev server levanta sem erros no `NavBar`.

*(Status: Concluído na sessão de alinhamento anterior)*

---

### Fase 2: Unificação de Mídias e IA (Media & RAG Hub)

**Task 2.1: Refatoração da UI Principal de Media para Multicamadas**
- **Agente Sugerido:** `frontend-specialist` | **Skill:** `frontend-design`
- **INPUT:** O atual `media.tsx` de galeria infinita.
- **OUTPUT:** Transformação do `MediaPage` devolvendo agora duas "Tabs" principais (Design Pattern similar ao implementado no `communications.tsx` ou `emergency.tsx`): **"Public Media"** e **"Knowledge Base"**.
- **VERIFY:** Clicar nas abas esvazia o estado da tela sem quebrar as requests no Backend. A interface drag-and-drop funciona igualmente para ambos os contextos.

**Task 2.2: Mock de Vetorização para Knowledge Base**
- **Agente Sugerido:** `frontend-specialist` | **Skill:** `frontend-design`
- **INPUT:** `media.tsx` - Aba Knowledge Base.
- **OUTPUT:** Alteração no map de arquivos do repositório RAG. Documentos identificados devem exibir badge de status "Vetorizado" (Verde) e não possuir visualização por imagem e sim por ícone de documento/texto.
- **VERIFY:** Os itens categorizados como "Knowledge" apresentam cards detalhando ID de Vetor ou Metadados.

---

### Fase 3: Ajustes Estéticos Finais e Limitação (Utilitários & Compliance)

**Task 3.1: Enxugamento do Fluxo de Apresentações (`decks.tsx`)**
- **Agente Sugerido:** `frontend-specialist` | **Skill:** `clean-code`
- **INPUT:** `decks.tsx`.
- **OUTPUT:** Redução da página de "Gerador de PDF" para interface de upload de material existente (exigindo que o cliente insira o PDF já finalizado), garantindo coerência sistêmica de que a aplicação não deve forjar slides institucionais.
- **VERIFY:** A página demonstra um espaço limpo de drag-and-drop / download de PDFs sem opções de inserção de texto corporativo generativo.

**Task 3.2: Readequação do Dashboard de Compliance (`compliance.tsx`)**
- **Agente Sugerido:** `frontend-specialist` | **Skill:** `frontend-design`
- **INPUT:** `compliance.tsx`.
- **OUTPUT:** Modificação nos cabeçalhos da interface onde trata LGPD para apontar explicitamente para endpoints terceirizados (ex: possibilidade de apontamento OneTrust ou formulário DSAR embutido simples).
- **VERIFY:** Leitura clara e coesa na UI de Compliance.

---

## ✅ PHASE X: Verificação Final (Quality Assurance)
O fechamento do Epic ocorrerá se e somente se as seguintes averiguações manuais e via script retornarem positivo:

- [ ] Sintaxe Estrita: `npx tsc --noEmit` reporta ZERO erros nestes componentes refatorados.
- [ ] UX Audit: Interfaces como `media.tsx` mantém a regra *Tailwind v4* sem invocar cores banidas e respeitando Contrastes.
- [ ] Segurança: As chamadas internas para a rota `/api/admin/media` invocam verificação condicional correta.
- [ ] Teste de Navegador: Rodar `npm run dev` e percorrer `Media`, `Apresentações` e `LGPD`. Nenhuma das rotas deverá estourar layout.
