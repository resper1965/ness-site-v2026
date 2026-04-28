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
    <div className="flex flex-row h-screen w-full bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary overflow-hidden">
      
      {/* Sidebar (Fully Responsive & Collapsible, FULL HEIGHT) */}
      <aside className={`shrink-0 flex flex-col z-30 transition-[width] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] bg-background will-change-[width] ${isMinimized ? 'w-[80px]' : 'w-[260px]'}`}>
        
        {/* Sidebar Header Space */}
        <div className="flex items-center h-14 px-5 shrink-0 justify-between">
          <h2 className={`font-heading text-[22px] font-black tracking-tighter text-foreground select-none transition-opacity duration-300 ${isMinimized ? 'opacity-0 hidden' : 'opacity-100'}`}>
            canal<span className="text-primary leading-none">.</span>
          </h2>
          <button 
             onClick={toggleSidebar}
             className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground transition-all hover:text-foreground outline-none shrink-0"
             title={isMinimized ? "Expandir menu" : "Recolher menu"}
          >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`}>
               <path d="M15 18l-6-6 6-6" />
             </svg>
          </button>
        </div>

        {/* Org Switcher Space */}
        <div className={`py-4 shrink-0 transition-all duration-300 ${isMinimized ? 'px-3' : 'px-5'}`}>
           {!isMinimized ? (
              <OrgSwitcher userEmail={session.user.email} isSuperAdmin={isSuperAdmin} />
           ) : (
              <div className="w-[48px] h-[48px] rounded-xl bg-card border border-border shadow-sm flex items-center justify-center mx-auto" title={activeOrg?.name}>
                <div className="w-8 h-8 bg-black/5 dark:bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-foreground text-xs uppercase">{activeOrg?.name?.substring(0, 2) || "NS"}</span>
                </div>
              </div>
           )}
        </div>

        {/* Navigation Core */}
        <nav className={`flex-1 overflow-y-auto pb-8 flex flex-col gap-6 custom-scrollbar ${isMinimized ? 'px-3 scrollbar-hide' : 'px-5'}`}>
          {(isSysAdminMode ? ADMIN_NAV : NAV).map((group, index) => {
            if (group.adminOnly && !isSuperAdmin) return null;
            if (group.ownerOnly && !isSuperAdmin && myRole !== "owner") return null;

            const visibleItems = group.items.filter((item) => {
              if (item.adminOnly && !isSuperAdmin) return false;
              if (item.ownerOnly && !isSuperAdmin && myRole !== "owner") return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            return (
              <div key={group.section} className={`flex flex-col relative`}>
                <div className={`mb-3 flex items-center transition-all duration-300 ${isMinimized ? 'justify-center h-[2px] bg-border/40 mx-2 mb-4 rounded-full' : 'px-4'}`}>
                  <span className={`text-xs font-medium text-muted-foreground/45 uppercase tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${isMinimized ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    {group.section}
                  </span>
                </div>
                
                <div className={`flex flex-col ${isMinimized ? 'gap-2 items-center' : 'gap-1'}`}>
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      title={isMinimized ? item.label : undefined}
                      className={({ isActive }) => `
                         flex items-center transition-all duration-200 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] outline-none group/link
                         ${isMinimized ? 'w-[44px] h-[44px] justify-center rounded-2xl' : 'w-full gap-4 px-4 py-2.5 rounded-[12px] active:scale-[0.98]'}
                         ${isActive 
                            ? 'bg-primary/5 text-primary shadow-sm font-semibold dark:bg-primary/10' 
                            : 'text-foreground/75 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground border border-transparent'}
                      `}
                    >
                      <span className="shrink-0 opacity-70 group-hover/link:opacity-100 transition-opacity ease-in-out duration-200">{item.icon}</span>
                      <span className={`text-[14px] whitespace-nowrap overflow-hidden transition-all duration-300 ${isMinimized ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
                        {item.label}
                      </span>
                    </NavLink>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* User Drops / SignOut */}
        <div className={`shrink-0 py-5 border-t border-border/40 transition-all duration-300 ${isMinimized ? 'px-3' : 'px-5'}`}>
           {isMinimized ? (
              <button 
                onClick={handleSignOut} 
                title="Log out" 
                className="w-[44px] h-[44px] mx-auto flex items-center justify-center rounded-[14px] bg-black/5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors outline-none border border-transparent"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
           ) : (
              <UserDropdown user={session.user} isSuperAdmin={isSuperAdmin} onSignOut={handleSignOut} />
           )}
        </div>
      </aside>

      {/* Content Pane (The White Card / System Surface) */}
      <main className="flex-1 overflow-hidden relative flex flex-col bg-card z-20 transition-all duration-300 border-l border-border/40">
        
        {/* Inner Topbar specific to Main Content Area */}
        <header className="flex-none h-12 flex items-center justify-between px-6 md:px-8 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">{meta.title}</h1>
          </div>
          <div className="flex items-center gap-4 shrink-0">
             {/* Theme Toggler */}
             <button 
               onClick={toggleTheme}
               className="w-9 h-9 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-foreground transition-all outline-none border border-black/5 dark:border-white/10 active:scale-[0.96]"
               title={theme === 'light' ? 'Mudar para modo escuro' : 'Mudar para modo claro'}
             >
               {theme === 'light' ? (
                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                 </svg>
               ) : (
                 <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                   <circle cx="12" cy="12" r="5"></circle>
                   <line x1="12" y1="1" x2="12" y2="3"></line>
                   <line x1="12" y1="21" x2="12" y2="23"></line>
                   <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                   <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                   <line x1="1" y1="12" x2="3" y2="12"></line>
                   <line x1="21" y1="12" x2="23" y2="12"></line>
                   <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                   <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                 </svg>
               )}
             </button>
          </div>
        </header>

        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-multiply dark:mix-blend-screen" />
        
        {/* Scrollable page area */}
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar relative">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
