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
      <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
        <div className="loader-inline" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="empty-state" style={{ minHeight: 300 }}>
        <p>Não foi possível carregar as estatísticas.</p>
      </div>
    );
  }

  const kpis = [
    {
      label: "Leads Capturados",
      value: stats.totalLeads,
      badge: stats.newLeads > 0 ? `${stats.newLeads} novos` : null,
      badgeClass: "badge-new",
      icon: "🎯",
    },
    {
      label: "Posts / Insights",
      value: stats.totalPosts,
      badge: null,
      badgeClass: "",
      icon: "📝",
    },
    {
      label: "Cases",
      value: stats.totalCases,
      badge: null,
      badgeClass: "",
      icon: "💼",
    },
    {
      label: "Vagas",
      value: stats.totalJobs,
      badge: null,
      badgeClass: "",
      icon: "👥",
    },
    {
      label: "Formulários",
      value: stats.totalForms,
      badge: stats.newForms > 0 ? `${stats.newForms} pendentes` : null,
      badgeClass: "badge-new",
      icon: "📋",
    },
    {
      label: "Sessões de Chat",
      value: stats.totalChats,
      badge: null,
      badgeClass: "",
      icon: "💬",
    },
    {
      label: "Usuários",
      value: stats.totalUsers,
      badge: null,
      badgeClass: "",
      icon: "🔑",
    },
    {
      label: "Publicados",
      value: stats.publishedEntries,
      badge: null,
      badgeClass: "",
      icon: "✅",
    },
  ];

  const weeklyData = stats.weeklyLeads.map((d) => d.count);

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}min atrás`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h atrás`;
    const days = Math.floor(hrs / 24);
    return `${days}d atrás`;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="card"
            style={{
              padding: "20px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 20,
                fontSize: 28,
                opacity: 0.15,
              }}
            >
              {kpi.icon}
            </div>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
              {kpi.label}
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "var(--text)",
                fontFamily: "var(--mono)",
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {kpi.value}
            </span>
            {kpi.badge && (
              <span
                className={`badge ${kpi.badgeClass}`}
                style={{ alignSelf: "flex-start", fontSize: 10, marginTop: 4 }}
              >
                {kpi.badge}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Two columns: Sparkline + Activity */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
        }}
      >
        {/* Weekly Trend */}
        <div className="card" style={{ padding: "20px 24px" }}>
          <div className="card-header" style={{ padding: 0, marginBottom: 16, border: "none" }}>
            <span className="card-title" style={{ fontSize: 13 }}>
              Leads — Últimos 7 dias
            </span>
          </div>
          {weeklyData.length > 1 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Suspense fallback={<div style={{ width: 280, height: 48, background: "var(--border)", opacity: 0.5 }} />}>
                <Sparkline data={weeklyData} width={280} height={48} />
              </Suspense>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {stats.weeklyLeads.map((d) => (
                  <div key={d.day} style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--mono)" }}>
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{d.count}</span>{" "}
                    {new Date(d.day + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short" })}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Dados insuficientes para exibir tendência.
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="card" style={{ padding: "20px 24px" }}>
          <div className="card-header" style={{ padding: 0, marginBottom: 16, border: "none" }}>
            <span className="card-title" style={{ fontSize: 13 }}>
              Atividade Recente
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {activity.length === 0 && (
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Nenhuma atividade registrada.</div>
            )}
            {activity.slice(0, 10).map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 0",
                  borderBottom: i < 9 ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>
                  {TYPE_ICON[item.type] || "📄"}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {TYPE_LABEL[item.type] || item.type}: {item.title}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    via {item.source || "—"}
                  </div>
                </div>
                <span style={{ fontSize: 11, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {item.created_at ? timeAgo(item.created_at) : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
