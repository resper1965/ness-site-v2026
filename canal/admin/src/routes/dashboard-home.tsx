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

const TYPE_ICON: Record<string, string> = {
  lead: "🎯",
  form: "📋",
  chat: "💬",
};

const TYPE_LABEL: Record<string, string> = {
  lead: "Lead",
  form: "Formulário",
  chat: "Chat",
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
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="loader-inline" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          <div className="h-16 w-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">Falha Ponto a Ponto</h2>
          <p className="text-muted-foreground mt-2">Não foi possível consolidar métricas da base primária.</p>
      </div>
    );
  }

  const kpis = [
    { label: "Leads Capturados", value: stats.totalLeads, badge: stats.newLeads > 0 ? `${stats.newLeads} novos` : null, badgeClass: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20", icon: "🎯" },
    { label: "Posts / Insights", value: stats.totalPosts, badge: null, badgeClass: "", icon: "📝" },
    { label: "Cases Históricos", value: stats.totalCases, badge: null, badgeClass: "", icon: "💼" },
    { label: "Vagas Ativas", value: stats.totalJobs, badge: null, badgeClass: "", icon: "👥" },
    { label: "Formulários", value: stats.totalForms, badge: stats.newForms > 0 ? `${stats.newForms} pendentes` : null, badgeClass: "bg-amber-500/10 text-amber-500 border border-amber-500/20", icon: "📋" },
    { label: "Sessões de V-Chat", value: stats.totalChats, badge: null, badgeClass: "", icon: "💬" },
    { label: "IAM Usuários", value: stats.totalUsers, badge: null, badgeClass: "", icon: "🔑" },
    { label: "Artefatos Cloud", value: stats.publishedEntries, badge: null, badgeClass: "", icon: "✅" },
  ];

  const weeklyData = stats.weeklyLeads.map((d) => d.count);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m atrás`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h atrás`;
    const days = Math.floor(hrs / 24);
    return `${days}d atrás`;
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="relative rounded-xl border bg-card p-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
             {/* Background Icon Watermark */}
             <div className="absolute top-4 right-4 text-3xl opacity-10 grayscale group-hover:scale-110 group-hover:-rotate-6 transition-all">{kpi.icon}</div>
             
             <div className="flex flex-col gap-1.5 relative z-10">
                <span className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground">{kpi.label}</span>
                <span className="text-3xl font-black tracking-tighter text-foreground font-mono">{kpi.value.toLocaleString('pt-BR')}</span>
             </div>
             
             <div className="mt-3 min-h-[20px]">
                {kpi.badge && (
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${kpi.badgeClass}`}>
                     {kpi.badge}
                  </span>
                )}
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Weekly Trend Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col">
          <div className="bg-muted/30 p-5 border-b border-border/40 flex items-center justify-between">
             <h3 className="font-semibold leading-none tracking-tight text-foreground flex items-center gap-2">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
               Tração Semanal (Leads)
             </h3>
             <span className="inline-flex rounded-full w-2 h-2 bg-emerald-500 animate-pulse" />
          </div>
          
          <div className="p-6">
             {weeklyData.length > 1 ? (
               <div className="space-y-6">
                 <div className="w-full bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-inner">
                   <Suspense fallback={<div className="h-12 w-full animate-pulse bg-slate-800 rounded" />}>
                     <Sparkline data={weeklyData} width={280} height={48} />
                   </Suspense>
                 </div>
                 <div className="flex flex-wrap gap-3">
                   {stats.weeklyLeads.map((d) => (
                     <div key={d.day} className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-mono bg-muted/40 px-2.5 py-1 rounded-md border border-border/50">
                       <span className="font-bold text-primary">{d.count}</span>
                       <span className="text-muted-foreground">{new Date(d.day + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short" })}</span>
                     </div>
                   ))}
                 </div>
               </div>
             ) : (
               <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                 Série histórica curta para exibição.
               </div>
             )}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col h-[400px]">
          <div className="bg-muted/30 p-5 border-b border-border/40 shrink-0 sticky top-0 z-10 flex items-center justify-between">
             <h3 className="font-semibold leading-none tracking-tight text-foreground flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Tráfego Operacional Liveness
             </h3>
             <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase opacity-70">
                Limit (15)
             </span>
          </div>
          
          <div className="overflow-y-auto w-full flex-1 p-0 divide-y divide-border/50">
             {activity.length === 0 ? (
               <div className="p-8 text-center text-sm font-medium text-muted-foreground">Nenhuma atividade recente reportada pelo sistema.</div>
             ) : (
               activity.map((act, i) => (
                 <div key={i} className="flex gap-4 p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-sm" title={TYPE_LABEL[act.type]}>
                       <span className="text-sm grayscale">{TYPE_ICON[act.type] || "🔹"}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                       <p className="text-sm font-bold text-foreground truncate">{act.title}</p>
                       <div className="flex gap-2 items-center mt-1">
                         <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground opacity-80">{act.source}</span>
                         <span className="text-muted-foreground/30">•</span>
                         <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-primary">{act.status}</span>
                       </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                       <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">{timeAgo(act.created_at)}</span>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
