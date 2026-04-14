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
    ],
  },
];

// Map route → page title/subtitle
const PAGE_META: Record<string, { title: string; sub: string }> = {
  "/":        { title: "Insights",       sub: "Artigos e publicações do blog" },
  "/cases":   { title: "Cases",          sub: "Portfólio de projetos e cases" },
  "/jobs":    { title: "Vagas",          sub: "Oportunidades publicadas" },
  "/forms":   { title: "Formulários",    sub: "Submissões recebidas" },
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
        {/* Topbar — mesma altura que sidebar-header */}
        <header className="topbar">
          <div>
            <div className="topbar-title">{meta.title}</div>
            {meta.sub && <div className="topbar-sub">{meta.sub}</div>}
          </div>
          <div className="topbar-actions">
            {/* slot para botões contextuais via Outlet context se necessário */}
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
