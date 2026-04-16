import { useEffect } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import { useSession, signOut } from "../lib/auth-client";

const NAV = [
  {
    section: "Conteúdo",
    items: [
      {
        to: "/",
        end: true,
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
      {
        to: "/pages",
        label: "Páginas",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
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
    ],
  },
  {
    section: "Gestão",
    items: [
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
    ],
  },
];

const PAGE_META: Record<string, { title: string; sub: string }> = {
  "/":        { title: "Insights",       sub: "Artigos e publicações do blog" },
  "/cases":   { title: "Cases",          sub: "Portfólio de projetos e cases" },
  "/jobs":    { title: "Vagas",          sub: "Oportunidades publicadas" },
  "/pages":       { title: "Páginas",        sub: "Páginas estáticas do site" },
  "/media":       { title: "Media",          sub: "Galeria de imagens e arquivos" },
  "/brandbook":   { title: "Brandbook",      sub: "Assets de marca do grupo" },
  "/signatures":  { title: "Assinaturas",    sub: "Assinaturas de email corporativas" },
  "/forms":   { title: "Formulários",    sub: "Submissões recebidas" },
  "/chats":   { title: "Chatlogs AI",    sub: "Auditoria de interações com IA" },
};

export default function DashboardLayout() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isPending && !session) navigate("/login");
  }, [session, isPending, navigate]);

  if (isPending) return <div className="loader" />;
  if (!session) return null;

  const meta = PAGE_META[location.pathname] ?? { title: "Canal Admin", sub: "" };

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => navigate("/login") } });
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-logo">
            canal<span>.</span>
          </span>
          <span className="sidebar-version">v2</span>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="nav-section">{group.section}</div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-name">{session.user.name || "Admin"}</div>
            <div className="user-email truncate">{session.user.email}</div>
          </div>
          <button className="nav-link" onClick={handleSignOut}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="main-area">
        <header className="topbar">
          <div>
            <div className="topbar-title">{meta.title}</div>
            {meta.sub && <div className="topbar-sub">{meta.sub}</div>}
          </div>
          <div className="topbar-actions" />
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
