import { useState, useEffect, lazy, Suspense } from "react";

const Sparkline = lazy(() => import("../components/dashboard/Sparkline"));

type Stats = {
  totalLeads: number;
  newLeads: number;
  totalForms: number;
  newForms: number;
  totalChats: number;
  publishedEntries: number;
  totalPosts: number;
  totalCases: number;
  totalJobs: number;
  totalUsers: number;
  weeklyLeads: { day: string; count: number }[];
};

type Activity = {
  type: string;
  title: string;
  source: string;
  status: string;
  created_at: string;
};

/** SVG icons for activity feed — replaces emojis per design system checklist */
function ActivityIcon({ type }: { type: string }) {
  const iconClass = "w-4 h-4";
  switch (type) {
    case "lead":
      return <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case "form":
      return <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>;
    case "chat":
      return <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    default:
      return <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
  }
}

const TYPE_LABEL: Record<string, string> = {
  lead: "Lead",
  form: "Formulário",
  chat: "Chat",
  contact: "Contato",
  chatbot: "Chatbot",
};

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/activity", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([s, a]) => {
        setStats(s as Stats);
        setActivity(Array.isArray(a) ? a : []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="loader-inline" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-4">
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Falha ao carregar métricas</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">Verifique a conexão com o D1 ou sua autenticação ativa.</p>
      </div>
    );
  }

  const kpis = [
    { label: "Leads Capturados", value: stats.totalLeads, badge: stats.newLeads > 0 ? `+${stats.newLeads} hoje` : null, badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", icon: "lead" },
    { label: "Posts Públicos", value: stats.totalPosts, badge: null, badgeClass: "", icon: "post" },
    { label: "Cases & Projetos", value: stats.totalCases, badge: null, badgeClass: "", icon: "case" },
    { label: "Vagas Ativas", value: stats.totalJobs, badge: null, badgeClass: "", icon: "job" },
    { label: "Formulários", value: stats.totalForms, badge: stats.newForms > 0 ? `${stats.newForms} pendentes` : null, badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400", icon: "form" },
    { label: "Transcrições", value: stats.totalChats, badge: null, badgeClass: "", icon: "chat" },
    { label: "Super Admins", value: stats.totalUsers, badge: null, badgeClass: "", icon: "user" },
    { label: "Documentos", value: stats.publishedEntries, badge: null, badgeClass: "", icon: "doc" },
  ];

  function renderKpiIcon(name: string) {
    const cls = "w-5 h-5";
    switch (name) {
      case 'lead': return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
      case 'post': return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
      case 'case': return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
      case 'job': return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
      case 'form': return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14h6"/><path d="M9 18h6"/><path d="M9 10h6"/></svg>;
      case 'chat': return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
      case 'user': return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
      case 'doc': return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l-5.94-5.94"/></svg>;
      default: return null;
    }
  }

  const weeklyData = stats.weeklyLeads.map((d) => d.count);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
  }

  return (
    <div className="flex-1 pl-12 pr-8 pt-[68px] pb-6 md:pl-16 md:pr-10 md:pb-8 max-w-[1440px] w-full">

      {/* ── KPI Grid ── Data-Dense: compact cards, maximum data visibility */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="stat-card cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary/8 text-primary flex items-center justify-center transition-colors duration-200 group-hover:bg-primary/15">
                {renderKpiIcon(kpi.icon)}
              </div>
              {kpi.badge && (
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tabular-nums ${kpi.badgeClass}`}>
                  {kpi.badge}
                </span>
              )}
            </div>
            <p className="stat-label">{kpi.label}</p>
            <p className="stat-value">{kpi.value.toLocaleString('pt-BR')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
