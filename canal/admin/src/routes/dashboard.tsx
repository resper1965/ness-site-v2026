import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import { useSession, signOut, authClient } from "../lib/auth-client";
import { OrgSwitcher } from "../components/dashboard/OrgSwitcher";
import { UserDropdown } from "../components/dashboard/UserDropdown";
import { NAV, PAGE_META, SUPER_ADMIN_EMAILS } from "../components/dashboard/nav-config";

function useCollapsedGroups() {
  const key = 'canal_nav_collapsed';
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
  });
  const toggle = (section: string) => {
    setCollapsed(prev => {
      const next = { ...prev, [section]: !prev[section] };
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };
  return { collapsed, toggle };
}

function useSidebarCollapse() {
  const key = 'canal_sidebar_minimized';
  const [isMinimized, setIsMinimized] = useState(() => {
    try { return localStorage.getItem(key) === 'true'; } catch { return false; }
  });
  const toggleSidebar = () => {
    setIsMinimized(prev => {
      const next = !prev;
      localStorage.setItem(key, String(next));
      return next;
    });
  };
  return { isMinimized, toggleSidebar };
}

export default function DashboardLayout() {
  const { data: session, isPending } = useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggle } = useCollapsedGroups();
  const { isMinimized, toggleSidebar } = useSidebarCollapse();

  useEffect(() => {
    if (!isPending && !session) navigate("/login");
  }, [session, isPending, navigate]);

  if (isPending) return <div className="loader" />;
  if (!session) return null;

  const isSuperAdmin = session.user.role === 'admin' || SUPER_ADMIN_EMAILS.includes(session.user.email);
  const myMembership = activeOrg?.members?.find((m: any) => m.userId === session?.user?.id || m.user?.email === session?.user?.email);
  const myRole = myMembership?.role || "member";

  const meta = PAGE_META[location.pathname] ?? { title: "Canal Admin", sub: "" };

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => navigate("/login") } });
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar${isMinimized ? ' minimized' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-logo">
            canal<span>.</span>
          </span>
          {!isMinimized && <span className="sidebar-version">v2</span>}
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isMinimized ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        <OrgSwitcher userEmail={session.user.email} isSuperAdmin={isSuperAdmin} />

        <nav className="sidebar-nav">
          {NAV.map((group) => {
            if (group.adminOnly && !isSuperAdmin) return null;
            if (group.ownerOnly && !isSuperAdmin && myRole !== "owner") return null;

            const visibleItems = group.items.filter((item) => {
              if (item.adminOnly && !isSuperAdmin) return false;
              if (item.ownerOnly && !isSuperAdmin && myRole !== "owner") return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            const isCollapsed = !!collapsed[group.section];

            return (
              <div key={group.section}>
                <button
                  className="nav-section-btn"
                  onClick={() => toggle(group.section)}
                  aria-expanded={!isCollapsed}
                  title={isMinimized ? group.section : undefined}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                    {(group as any).icon || (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.55 }}>
                        <rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect>
                      </svg>
                    )}
                    <span className="nav-label">{group.section}</span>
                  </div>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{ transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)', opacity: 0.4 }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className={`nav-group-items${isCollapsed ? ' collapsed' : ''}`}>
                  <div>
                    {visibleItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                        title={isMinimized ? item.label : undefined}
                      >
                        {item.icon}
                        <span className="nav-label">{item.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <UserDropdown user={session.user} onSignOut={handleSignOut} />
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
