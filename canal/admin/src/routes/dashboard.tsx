import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import { useSession, signOut, authClient } from "../lib/auth-client";
import { OrgSwitcher } from "../components/dashboard/OrgSwitcher";
import { UserDropdown } from "../components/dashboard/UserDropdown";
import { NAV, ADMIN_NAV, PAGE_META, SUPER_ADMIN_EMAILS } from "../components/dashboard/nav-config";

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

function useTheme() {
  const key = 'canal_theme';
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored === 'light' || stored === 'dark') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    } catch {}
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(key, theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  return { theme, toggleTheme };
}

export default function DashboardLayout() {
  const { data: session, isPending } = useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isMinimized, toggleSidebar } = useSidebarCollapse();

  useEffect(() => {
    if (!isPending && !session) navigate("/login");
  }, [session, isPending, navigate]);

  if (isPending) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="loader-inline" /></div>;
  if (!session) return null;

  const isSuperAdmin = session?.user?.role === 'admin' || SUPER_ADMIN_EMAILS.includes(session?.user?.email ?? '');
  const myMembership = activeOrg?.members?.find((m: any) => m.userId === session?.user?.id || m.user?.email === session?.user?.email);
  const myRole = myMembership?.role || "member";

  const sysAdminRoutes = ['/organizations', '/users'];
  const isSysAdminMode = sysAdminRoutes.some(r => location.pathname.startsWith(r));

  const meta = PAGE_META[location.pathname] ?? { title: "Infraestrutura Canal", sub: "Control Plane" };

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => navigate("/login") } });
  }

  return (
    <div className="flex h-screen w-full bg-muted/20 p-4 font-sans text-foreground overflow-hidden gap-4">

      {/* ── Sidebar ── */}
      <aside className={`shrink-0 flex flex-col border border-border shadow-sm rounded-xl transition-[width] duration-200 bg-background overflow-hidden ${isMinimized ? 'w-[72px]' : 'w-[240px]'}`}>

        {/* Logo */}
        <div className="flex items-center h-14 px-4 shrink-0 justify-between border-b border-border/50">
          <h2 className={`font-heading text-xl font-black tracking-tight select-none transition-opacity duration-200 ${isMinimized ? 'opacity-0 hidden' : ''}`}>
            canal<span className="text-primary">.</span>
          </h2>
          <button
            onClick={toggleSidebar}
            className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors shrink-0"
            title={isMinimized ? "Expandir" : "Recolher"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isMinimized ? 'rotate-180' : ''}`}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        {/* Org Switcher */}
        <div className={`pb-3 shrink-0 ${isMinimized ? 'px-2' : 'px-4'}`}>
          {!isMinimized ? (
            <OrgSwitcher userEmail={session?.user?.email ?? ''} isSuperAdmin={isSuperAdmin} />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto" title={activeOrg?.name}>
              <span className="font-semibold text-xs uppercase text-foreground">{activeOrg?.name?.substring(0, 2) || "NS"}</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className={`flex-1 overflow-y-auto flex flex-col gap-5 pb-6 ${isMinimized ? 'px-2' : 'px-3'}`}>
          {(isSysAdminMode ? ADMIN_NAV : NAV).map((group) => {
            if (group.adminOnly && !isSuperAdmin) return null;
            if (group.ownerOnly && !isSuperAdmin && myRole !== "owner") return null;

            const visibleItems = group.items.filter((item) => {
              if (item.adminOnly && !isSuperAdmin) return false;
              if (item.ownerOnly && !isSuperAdmin && myRole !== "owner") return false;
              return true;
            });
            if (visibleItems.length === 0) return null;

            return (
              <div key={group.section}>
                {!isMinimized && (
                  <div className="px-3 mb-2">
                    <span className="text-[11px] font-medium text-muted-foreground/50 uppercase tracking-wider">{group.section}</span>
                  </div>
                )}
                {isMinimized && <div className="h-px bg-border/40 mx-2 mb-2" />}
                <div className={`flex flex-col ${isMinimized ? 'gap-1 items-center' : 'gap-0.5'}`}>
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      title={isMinimized ? item.label : undefined}
                      className={({ isActive }) => `
                        flex items-center transition-colors duration-150 outline-none
                        ${isMinimized ? 'w-10 h-10 justify-center rounded-lg' : 'gap-3 px-3 py-2 rounded-lg'}
                        ${isActive
                          ? 'bg-primary/8 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                      `}
                    >
                      <span className="shrink-0 [&>svg]:w-[18px] [&>svg]:h-[18px]">{item.icon}</span>
                      {!isMinimized && <span className="text-[13px] truncate">{item.label}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className={`shrink-0 py-3 border-t border-border/40 ${isMinimized ? 'px-2' : 'px-3'}`}>
          {isMinimized ? (
            <button
              onClick={handleSignOut}
              title="Sair"
              className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          ) : (
            <UserDropdown user={session?.user} isSuperAdmin={isSuperAdmin} onSignOut={handleSignOut} />
          )}
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background border border-border shadow-sm rounded-xl">

        {/* Topbar */}
        <header className="shrink-0 h-14 flex items-center justify-between px-16 border-b border-border/50">
          <h1 className="text-base font-semibold text-foreground truncate">{meta.title}</h1>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          >
            {theme === 'light' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            )}
          </button>
        </header>

        {/* Content — SINGLE source of padding for ALL routes */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
