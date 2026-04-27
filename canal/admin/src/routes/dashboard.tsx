import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router";
import { useSession, signOut, authClient } from "../lib/auth-client";
import { OrgSwitcher } from "../components/dashboard/OrgSwitcher";
import { UserDropdown } from "../components/dashboard/UserDropdown";
import { NAV, ADMIN_NAV, PAGE_META, SUPER_ADMIN_EMAILS } from "../components/dashboard/nav-config";

function useCollapsedGroups() {
  const key = 'canal_nav_expanded';
  const [expanded, setExpanded] = useState<string | null>(() => {
    try { return localStorage.getItem(key) || null; } catch { return null; }
  });
  const toggle = (section: string) => {
    setExpanded(prev => {
      const next = prev === section ? null : section;
      if (next) localStorage.setItem(key, next);
      else localStorage.removeItem(key);
      return next;
    });
  };
  return { expanded, toggle };
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
  const { expanded, toggle } = useCollapsedGroups();
  const { isMinimized, toggleSidebar } = useSidebarCollapse();

  useEffect(() => {
    if (!isPending && !session) navigate("/login");
  }, [session, isPending, navigate]);

  if (isPending) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="loader-inline" /></div>;
  if (!session) return null;

  const isSuperAdmin = session.user.role === 'admin' || SUPER_ADMIN_EMAILS.includes(session.user.email);
  const myMembership = activeOrg?.members?.find((m: any) => m.userId === session?.user?.id || m.user?.email === session?.user?.email);
  const myRole = myMembership?.role || "member";

  const sysAdminRoutes = ['/organizations', '/users'];
  const isSysAdminMode = sysAdminRoutes.some(r => location.pathname.startsWith(r));

  const meta = PAGE_META[location.pathname] ?? { title: "Infraestrutura Canal", sub: "Control Plane" };

  async function handleSignOut() {
    await signOut({ fetchOptions: { onSuccess: () => navigate("/login") } });
  }

  return (
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Sidebar (Apple HIG Glassmorphism Híbrida) */}
      <aside className={`shrink-0 flex flex-col border-r border-black/5 dark:border-white/6 transition-[width] duration-300 z-40 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] will-change-[width] ${
         isMinimized ? 'w-[74px]' : 'w-64 max-w-[280px]'
      } ${isSysAdminMode ? 'bg-danger/5 dark:bg-danger/10 backdrop-blur-3xl' : 'bg-white/50 dark:bg-black/40 backdrop-blur-3xl'}`}>
        <div className="flex items-center h-[52px] px-5 border-b border-black/5 dark:border-white/6 shrink-0 justify-between">
          <span className={`font-black tracking-tighter text-lg leading-none transition-all flex items-center text-neutral-900 dark:text-white truncate ${isMinimized ? 'opacity-0 w-0' : 'opacity-100'}`}>
            canal<span className={isSysAdminMode ? "text-red-500" : "text-primary"}>.</span>
            {isSysAdminMode && <span className="ml-2 text-[10px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">Sys</span>}
          </span>
          <div className="flex items-center gap-3">
             {!isMinimized && <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm shrink-0">v2 IO</span>}
             <button 
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0 outline-none" 
                onClick={toggleSidebar}
             >
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isMinimized ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                 <polyline points="15 18 9 12 15 6"></polyline>
               </svg>
             </button>
          </div>
        </div>

        <div className={`p-4 border-b border-black/5 dark:border-white/6 shrink-0 ${isMinimized ? 'px-3' : 'px-4'}`}>
           <OrgSwitcher userEmail={session.user.email} isSuperAdmin={isSuperAdmin} />
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 custom-scrollbar">
          {(isSysAdminMode ? ADMIN_NAV : NAV).map((group) => {
            if (group.adminOnly && !isSuperAdmin) return null;
            if (group.ownerOnly && !isSuperAdmin && myRole !== "owner") return null;

            const visibleItems = group.items.filter((item) => {
              if (item.adminOnly && !isSuperAdmin) return false;
              if (item.ownerOnly && !isSuperAdmin && myRole !== "owner") return false;
              return true;
            });

            if (visibleItems.length === 0) return null;

            const isCollapsed = expanded !== group.section;

            return (
              <div key={group.section} className="space-y-1">
                <button
                  className={`w-full flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors px-3 py-2 outline-none group rounded-md ${isMinimized ? 'justify-center' : ''}`}
                  onClick={() => toggle(group.section)}
                  aria-expanded={!isCollapsed}
                  title={isMinimized ? group.section : undefined}
                >
                  <div className="flex items-center gap-3 w-full">
                    <span className="shrink-0">{group.icon || (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-55">
                        <rect x="3" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="3" width="7" height="7" rx="1"></rect><rect x="14" y="14" width="7" height="7" rx="1"></rect><rect x="3" y="14" width="7" height="7" rx="1"></rect>
                      </svg>
                    )}</span>
                    {!isMinimized && (
                       <span className="text-[10px] font-bold uppercase tracking-widest text-left line-clamp-1">{group.section}</span>
                    )}
                  </div>
                  {!isMinimized && (
                    <svg
                      width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="opacity-40 transition-transform duration-200"
                      style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  )}
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[800px] opacity-100'}`}>
                  <div className={`flex flex-col gap-1 py-1 ${isMinimized ? 'items-center' : 'pl-3'}`}>
                    {visibleItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `
                           flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] text-[13px] font-medium outline-none active:scale-[0.98] group/link
                           ${isActive 
                              ? 'bg-white/10 dark:bg-black/20 text-neutral-900 dark:text-white shadow-sm border border-black/5 dark:border-white/5' 
                              : 'text-neutral-500 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white border border-transparent'}
                           ${isMinimized ? 'justify-center w-10 h-10 p-0 shadow-none' : 'w-full'}
                        `}
                        title={isMinimized ? item.label : undefined}
                      >
                        <span className="shrink-0">{item.icon}</span>
                        {!isMinimized && <span className="truncate">{item.label}</span>}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className={`shrink-0 border-t border-black/5 dark:border-white/6 p-4 ${isSysAdminMode ? 'bg-danger/5' : 'bg-transparent'}`}>
           <UserDropdown user={session.user} isSuperAdmin={isSuperAdmin} onSignOut={handleSignOut} />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 bg-transparent relative">
        {/* Glow Effects Container (Subtle Aura Híbrida) */}
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none opacity-30 mix-blend-multiply dark:mix-blend-screen" />

        {/* Global Nav Bar (Frosted Glass Topbar HIG) */}
        <header className="flex items-center justify-between h-[52px] px-8 border-b border-black/5 dark:border-white/4 shrink-0 bg-white/60 dark:bg-black/40 backdrop-blur-[20px] sticky top-0 z-30 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] dark:shadow-[0_1px_0_rgba(255,255,255,0.02)_inset]">
          <div className="flex flex-col justify-center">
            <h1 className="text-[14px] font-semibold tracking-tight text-neutral-900 dark:text-white/90 leading-tight">{meta.title}</h1>
            {meta.sub && <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500 dark:text-white/40 leading-tight">{meta.sub}</p>}
          </div>
          <div className="flex items-center gap-4">
             {/* Slot for future global actions */}
          </div>
        </header>

        {/* Dynamic Content Outlet */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
