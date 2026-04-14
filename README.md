# ness. — Engenharia de Precisão Digital

A **ness.** é uma consultoria boutique especializada em engenharia de software de alta performance, resiliência cibernética e operações inteligentes. Este repositório contém o site institucional da empresa, desenvolvido com foco em performance, design minimalista e integração tecnológica.

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 19, React Router 7, Tailwind CSS 4, Framer Motion.
- **Backend:** Hono (Produção) / Express (Desenvolvimento).
- **IA:** Gabi.OS (Inteligência Generativa integrada via Backoffice).
- **Infraestrutura:** Proxy reverso para integração com sistemas legados e backoffice centralizado.

## ✨ Funcionalidades Principais

- **Design Imersivo:** Interface "Dark Mode" com estética de precisão e animações fluidas.
- **Gabi.OS Chatbot:** Widget de IA generativa com vetorização de conteúdo para suporte inteligente.
- **Canal de Compliance:** Sistema completo de denúncias anônimas e políticas de privacidade/termos de uso.
- **Gestão de Carreiras & Blog:** Integração dinâmica via API com o sistema de backoffice da ness.
- **Cálculo Dinâmico de Legado:** Sistema automático de contagem de anos (Fundação em 1991) e timeline atualizada até 2026.

## 🛠️ Como Executar

### Pré-requisitos
- Node.js (v18 ou superior)
- npm / yarn

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 🌐 Estrutura de API

O projeto atua como um proxy para o backoffice centralizado:
- `GET /api/insights`: Busca artigos do blog.
- `GET /api/jobs`: Lista vagas em aberto.
- `POST /api/submit-form`: Centraliza envios de Contato, Carreiras e Denúncias.
- `POST /api/chat`: Interface de comunicação com a Gabi.OS.

---
*Invisíveis quando tudo funciona. Presentes quando mais importa.*
