import { useState, useEffect, lazy, Suspense } from "react";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import { Badge } from "../components/ui/Badge";
import { StatusDot } from "../components/ui/StatusDot";
import { SectionTitle } from "../components/ui/SectionTitle";

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

/* ── SVG Icons (Lucide-style, 16px) ── */

function IconTarget() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconFileText() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconClipboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}
function IconMessageCircle() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}
function IconKey() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}
function IconCloud() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </svg>
  );
}
function IconActivity() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
function IconTrend() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
function IconAlert() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  lead: <IconTarget />,
  form: <IconClipboard />,
  chat: <IconMessageCircle />,
};

const TYPE_LABEL: Record<string, string> = {
  lead: "Lead",
  form: "Formulário",
  chat: "Chat",
};

/* ── Health Services Config ── */
const HEALTH_SERVICES: {
  key: keyof Omit<HealthStatus, "checked_at">;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "db", label: "D1 Database", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" /></svg> },
  { key: "kv", label: "KV Store", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg> },
  { key: "ai", label: "Workers AI", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg> },
  { key: "storage", label: "R2 Storage", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg> },
  { key: "queue", label: "Queue", icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg> },
];

function healthVariant(status?: string): "ok" | "warning" | "error" | "neutral" {
  if (status === "ok") return "ok";
  if (status === "degraded") return "warning";
  if (status === "error") return "error";
  return "neutral";
}

function dotStatus(status?: string): "ok" | "warning" | "error" | "loading" {
  if (status === "ok") return "ok";
  if (status === "degraded") return "warning";
  if (status === "error") return "error";
  return "loading";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m atrás`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h atrás`;
  return `${Math.floor(hrs / 24)}d atrás`;
}

/* ══════════════════════════════════════════════════════════════ */

export default function DashboardHome() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/activity", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/health", { credentials: "include" }).then((r) => r.json()),
    ])
      .then(([s, a, h]) => {
        setStats(s as Stats);
        setActivity(Array.isArray(a) ? a : []);
        setHealth(h as HealthStatus);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="loader-inline" />
      </div>
    );
  }

  /* ── Error ── */
  if (!stats) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        </div>
        <h2 className="text-xl font-semibold text-foreground">Falha Ponto a Ponto</h2>
        <p className="text-muted-foreground mt-2">Não foi possível consolidar métricas da base primária.</p>
      </div>
    );
  }

  /* ── KPI Data ── */
  const kpis = [
    { label: "Leads Capturados", value: stats.totalLeads, change: stats.newLeads > 0 ? `+${stats.newLeads} novos` : null, changeColor: "text-emerald-500", icon: <IconTarget /> },
    { label: "Posts / Insights", value: stats.totalPosts, icon: <IconFileText /> },
    { label: "Cases Históricos", value: stats.totalCases, icon: <IconBriefcase /> },
    { label: "Vagas Ativas", value: stats.totalJobs, icon: <IconUsers /> },
    { label: "Formulários", value: stats.totalForms, change: stats.newForms > 0 ? `${stats.newForms} pendentes` : null, changeColor: "text-amber-500", icon: <IconClipboard /> },
    { label: "Sessões de Chat", value: stats.totalChats, icon: <IconMessageCircle /> },
    { label: "IAM Usuários", value: stats.totalUsers, icon: <IconKey /> },
    { label: "Artefatos Cloud", value: stats.publishedEntries, icon: <IconCloud /> },
  ];

  const weeklyData = stats.weeklyLeads.map((d) => d.count);
  const allOk = health && HEALTH_SERVICES.every((s) => health[s.key]?.status === "ok");
  const hasError = health && HEALTH_SERVICES.some((s) => health[s.key]?.status === "error");

  return (
    <div className="space-y-8">

      {/* ── Welcome Banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(195,100%,42%)] via-[hsl(200,90%,48%)] to-[hsl(210,80%,55%)] p-8 text-white">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold tracking-tight">Painel de Controle</h2>
          <p className="mt-1 text-white/70 text-sm">Visão geral dos seus dados e serviços.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-40 h-40 rounded-full bg-white/5 translate-y-1/2" />

        {/* Health badges inline */}
        {health && (
          <div className="relative z-10 flex flex-wrap gap-2 mt-5">
            {HEALTH_SERVICES.map(({ key, label, icon }) => {
              const svc = health[key];
              const isOk = svc?.status === "ok";
              const isError = svc?.status === "error";
              return (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                    isOk ? 'bg-white/20 text-white' :
                    isError ? 'bg-red-500/30 text-red-100' :
                    'bg-white/10 text-white/60'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isOk ? 'bg-emerald-300' : isError ? 'bg-red-300' : 'bg-white/40'}`} />
                  {icon}
                  {label}
                  {svc?.latency_ms !== undefined && <span className="font-mono opacity-60">{svc.latency_ms}ms</span>}
                </span>
              );
            })}
            {health.checked_at && (
              <span className="text-[10px] font-mono text-white/40 self-center ml-2">
                verificado {timeAgo(health.checked_at)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => {
          const colors = [
            'bg-sky-500/10 text-sky-600 dark:text-sky-400',
            'bg-violet-500/10 text-violet-600 dark:text-violet-400',
            'bg-amber-500/10 text-amber-600 dark:text-amber-400',
            'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
            'bg-rose-500/10 text-rose-600 dark:text-rose-400',
            'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
            'bg-teal-500/10 text-teal-600 dark:text-teal-400',
            'bg-orange-500/10 text-orange-600 dark:text-orange-400',
          ];
          return (
            <div
              key={kpi.label}
              className="group rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-border/80 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[i % colors.length]}`}>
                  {kpi.icon}
                </div>
                <svg className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
              </div>
              <div className="text-3xl font-bold tracking-tight text-foreground">{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">{kpi.label}</div>
              {kpi.change && (
                <div className={`text-xs font-semibold mt-2 ${kpi.changeColor}`}>{kpi.change}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Weekly Trend — 3 cols */}
        <div className="lg:col-span-3 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <IconTrend />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Tração Semanal</h3>
            </div>
            <span className={`w-2 h-2 rounded-full ${weeklyData.length > 1 ? 'bg-emerald-400' : 'bg-muted-foreground/30'}`} />
          </div>
          {weeklyData.length > 1 ? (
            <div className="space-y-4">
              <div className="w-full bg-muted/30 rounded-xl p-4 border border-border/40">
                <Suspense fallback={<div className="h-12 w-full animate-pulse bg-muted/40 rounded" />}>
                  <Sparkline data={weeklyData} width={400} height={56} />
                </Suspense>
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.weeklyLeads.map((d) => (
                  <div key={d.day} className="flex items-center gap-2 text-xs font-mono bg-muted/30 px-3 py-1.5 rounded-lg border border-border/40">
                    <span className="font-bold text-primary">{d.count}</span>
                    <span className="text-muted-foreground">{new Date(d.day + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short" })}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 gap-3">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground border border-border/40">
                <IconAlert />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Série histórica curta</p>
              <p className="text-xs text-muted-foreground/60">Dados insuficientes para gerar tendência semanal.</p>
            </div>
          )}
        </div>

        {/* Activity Feed — 2 cols */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card flex flex-col max-h-[480px]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <IconEdit />
              </div>
              <h3 className="text-sm font-semibold text-foreground">Atividade Recente</h3>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/50">Últimos 15</span>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-border/30">
            {activity.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Nenhuma atividade.</div>
            ) : (
              activity.map((act, i) => (
                <div key={i} className="flex gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-muted/40 border border-border/30 flex items-center justify-center text-muted-foreground">
                    {ACTIVITY_ICONS[act.type] || <IconCloud />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{act.title}</p>
                    <div className="flex gap-2 items-center mt-0.5">
                      <span className="text-xs text-muted-foreground">{act.source}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                        act.status === 'new' ? 'bg-primary/10 text-primary' :
                        act.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {act.status}
                      </span>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] font-mono text-muted-foreground/60 self-center">{timeAgo(act.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
