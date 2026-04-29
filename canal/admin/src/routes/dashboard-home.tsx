import { useState, useEffect } from "react";

/* ══════════════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════════════ */

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

type ServiceHealth = {
  status: "ok" | "degraded" | "error";
  latency_ms?: number;
};

type HealthStatus = {
  db?: ServiceHealth;
  kv?: ServiceHealth;
  ai?: ServiceHealth;
  storage?: ServiceHealth;
  queue?: ServiceHealth;
  checked_at?: string;
};

/* ══════════════════════════════════════════════════════════════
   ICONS (Lucide, strict 16px, text-muted-foreground)
   ══════════════════════════════════════════════════════════════ */

const I = {
  target: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  file: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  briefcase: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  users: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  clipboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  ),
  chat: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  key: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
  cloud: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  db: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
    </svg>
  ),
  layers: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  cpu: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="15" y1="20" x2="15" y2="23" />
    </svg>
  ),
  bucket: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  ),
  list: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  arrowUpRight: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  ),
};

/* ── Health services config ── */
const SERVICES: { key: keyof Omit<HealthStatus, "checked_at">; label: string; icon: React.ReactNode }[] = [
  { key: "db", label: "D1", icon: I.db },
  { key: "kv", label: "KV", icon: I.layers },
  { key: "ai", label: "AI", icon: I.cpu },
  { key: "storage", label: "R2", icon: I.bucket },
  { key: "queue", label: "Queue", icon: I.list },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  return `${Math.floor(hrs / 24)}d`;
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT (SHADCN BLOCKS ADMIN KIT REPLICA)
   ══════════════════════════════════════════════════════════════ */



export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/health", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([s, h]) => {
        setStats(s as Stats);
        setHealth(h as HealthStatus);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="border border-border/80 p-5 rounded-xl shadow-sm text-center">
          <p className="text-sm text-muted-foreground animate-pulse">Carregando métricas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <h2 className="text-lg font-semibold text-foreground">Falha ao carregar métricas</h2>
        <p className="text-sm text-muted-foreground mt-1">Verifique a conexão e tente recarregar.</p>
      </div>
    );
  }

  // Standard Grid Strategy
  const kpis = [
    { label: "Total Leads", value: stats.totalLeads, delta: stats.newLeads, deltaLabel: "novos", icon: () => I.target },
    { label: "Total Formulários", value: stats.totalForms, delta: stats.newForms, deltaLabel: "pendentes", icon: () => I.clipboard, urgent: true },
    { label: "Usuários Ativos", value: stats.totalUsers, icon: () => I.key },
    { label: "Cases Cadastrados", value: stats.totalCases, icon: () => I.briefcase },
    { label: "Vagas Abertas", value: stats.totalJobs, icon: () => I.users },
    { label: "Sessões de Chat", value: stats.totalChats, icon: () => I.chat },
    { label: "Insights Publicados", value: stats.totalPosts, icon: () => I.file },
    { label: "Artefatos Cloud", value: stats.publishedEntries, icon: () => I.cloud },
  ];

  const allOk = health && SERVICES.every((s) => health[s.key]?.status === "ok");

  return (
    <div className="space-y-6">

      {/* ── Top Bar Simulation (Shadcn Tabs) ── */}
      <div className="flex items-center space-x-2 border-b border-border/50 pb-4">
        <div className="bg-muted px-4 py-1.5 rounded-lg text-sm font-medium text-foreground cursor-pointer transition-colors shadow-sm border border-border/20">
          Overview
        </div>
        <div className="px-4 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
          Analytics
        </div>
        <div className="px-4 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
          Reports
        </div>
      </div>

      {/* ── Infrastructure Status Bar (Discreet) ── */}
      <div className="flex items-center gap-2 flex-wrap text-[11px]">
        <div className="flex items-center gap-1.5 font-medium text-muted-foreground mr-2">
          <span className={`w-1.5 h-1.5 rounded-full ${allOk ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          Sistemas operacionais:
        </div>

        {SERVICES.map(({ key, label }) => {
          const svc = health?.[key];
          const isOk = svc?.status === "ok";
          return (
            <div key={key} className="flex items-center gap-1 text-muted-foreground/70" title={svc?.latency_ms ? `${svc.latency_ms}ms` : undefined}>
              <span>{label}</span>
              {svc?.latency_ms !== undefined && (
                <span className="font-mono text-[9px] opacity-70">({svc.latency_ms}ms)</span>
              )}
              {isOk && <span className="text-emerald-500/70 ml-0.5">•</span>}
            </div>
          );
        })}

        {health?.checked_at && (
          <span className="font-mono text-muted-foreground/40 ml-auto">
            {timeAgo(health.checked_at)} ago
          </span>
        )}
      </div>

      {/* ── Standard Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="stat-card flex flex-col bg-card border border-border/50 rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-muted-foreground">{kpi.label}</span>
                <span className="text-muted-foreground opacity-70"><Icon /></span>
              </div>
              <div className="text-3xl font-bold tabular-nums tracking-tight">
                {kpi.value.toLocaleString("pt-BR")}
              </div>
              <div className="mt-2 text-xs font-medium h-4">
                {kpi.delta !== undefined ? (
                  kpi.delta > 0 
                  ? <span className="text-emerald-500">+{kpi.delta} {kpi.deltaLabel}</span>
                  : <span className="text-muted-foreground/60">0 {kpi.deltaLabel}</span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
