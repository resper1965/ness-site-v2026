import type { ReactNode } from "react";

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  end?: boolean;
  adminOnly?: boolean;
  ownerOnly?: boolean;
}

export interface NavGroup {
  section: string;
  items: NavItem[];
  adminOnly?: boolean;
  ownerOnly?: boolean;
}

export const NAV: NavGroup[] = [
  {
    section: "Conteúdo",
    items: [
      {
        to: "/",
        end: true,
        label: "Dashboard",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
        ),
      },
      {
        to: "/insights",
        label: "Insights",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        ),
      },
      {
        to: "/cases",
        label: "Cases",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
        ),
      },
      {
        to: "/jobs",
        label: "Vagas",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: "Assets",
    items: [
      {
        to: "/media",
        label: "Media",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: "Marketing",
    items: [
      {
        to: "/brandbook",
        label: "Brandbook",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/>
            <circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
          </svg>
        ),
      },
      {
        to: "/signatures",
        label: "Assinaturas",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        ),
      },
      {
        to: "/decks",
        label: "Apresentações",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: "Gestão",
    items: [
      {
        to: "/newsletters",
        label: "Newsletters",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
        ),
      },
      {
        to: "/forms",
        label: "Formulários",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
          </svg>
        ),
      },
      {
        to: "/chats",
        label: "Chatlogs AI",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        ),
      },
      {
        to: "/leads",
        label: "Leads Gabi",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
      },
      {
        to: "/communications",
        label: "Central de Msgs",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/>
          </svg>
        ),
      },
      {
        to: "/ai-settings",
        label: "Gabi IA",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M6 10v1a6 6 0 0 0 12 0v-1"/><path d="M12 18v4"/><path d="M8 22h8"/>
          </svg>
        ),
      },
      {
        to: "/chatbot",
        label: "Chatbot & RAG",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8"/><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="6" y="14" width="12" height="8" rx="2"/><path d="M12 10v4"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: "Compliance",
    items: [
      {
        to: "/compliance",
        label: "LGPD & Denúncias",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: "Administração",
    ownerOnly: true,
    items: [
      {
        to: "/saas",
        label: "Sua Empresa",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
        ),
      },
    ],
  },
  {
    section: "Sistema Total",
    adminOnly: true,
    items: [
      {
        to: "/organizations",
        label: "Gestão Global de Empresas",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
        ),
      },
      {
        to: "/users",
        label: "Usuários da Plataforma",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
      },
    ],
  },
];

export const PAGE_META: Record<string, { title: string; sub: string }> = {
  "/":        { title: "Dashboard",       sub: "Visão geral da plataforma" },
  "/insights": { title: "Insights",       sub: "Artigos e publicações do blog" },
  "/cases":   { title: "Cases",          sub: "Portfólio de projetos e cases" },
  "/jobs":    { title: "Vagas",          sub: "Oportunidades publicadas" },
  "/media":       { title: "Media",          sub: "Galeria de imagens e arquivos" },
  "/brandbook":   { title: "Brandbook",      sub: "Assets de marca do grupo" },
  "/signatures":  { title: "Assinaturas",    sub: "Assinaturas de email corporativas" },
  "/decks":       { title: "Apresentações",  sub: "Gerador de decks PDF corporativos" },
  "/forms":   { title: "Formulários",    sub: "Submissões recebidas" },
  "/newsletters": { title: "Newsletters",   sub: "Compor e disparar e-mails em massa" },
  "/chats":   { title: "Chatlogs AI",    sub: "Auditoria de interações com IA" },
  "/leads":   { title: "Leads Gabi",     sub: "Contatos qualificados pela IA" },
  "/communications": { title: "Central de Mensagens", sub: "Inbox unificado de forms, leads e chats" },
  "/ai-settings": { title: "Gabi IA",      sub: "Configuração da assistente virtual" },
  "/account": { title: "Minha Conta",   sub: "Perfil, senha e vinculações" },
  "/saas":    { title: "Sua Empresa",     sub: "Gestão do workspace e membros" },
  "/users":   { title: "Gestão Global de Usuários", sub: "Administração de acessos (Super Admin)" },
  "/organizations": { title: "Gestão Global de Empresas", sub: "Visão central de workspaces (Super Admin)" },
  "/compliance":  { title: "Compliance & LGPD", sub: "DSAR, Canal de Denúncia e Políticas" },
  "/chatbot":     { title: "Chatbot & RAG",     sub: "Configuração, analytics e base de conhecimento" },
};

export const SUPER_ADMIN_EMAILS = ["resper@bekaa.eu", "admin@ness.com.br", "resper@ness.com.br"];
