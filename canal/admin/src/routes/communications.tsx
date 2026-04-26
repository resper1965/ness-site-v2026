import { useState, useEffect } from "react";

type Message = {
  type: string;
  id: number;
  title: string;
  data: string;
  source: string;
  status: string;
  created_at: string;
};

const TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  form: { icon: "📋", label: "Formulário", color: "var(--accent)" },
  lead: { icon: "🎯", label: "Lead", color: "#e67e00" },
  chat: { icon: "💬", label: "Chat", color: "#2a9d2a" },
};

export default function CommunicationsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [forwarding, setForwarding] = useState(false);

  useEffect(() => {
    fetch("/api/admin/communications", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const handleForward = async (msg: Message) => {
    const email = prompt("Encaminhar para qual e-mail?");
    if (!email) return;
    setForwarding(true);
    try {
      const res = await fetch(`/api/admin/communications/forward`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ messageId: msg.id, messageType: msg.type, to: email }),
      });
      const result = await res.json() as { success?: boolean; error?: string };
      if (result.success) alert("Mensagem encaminhada com sucesso!");
      else alert(`Erro: ${result.error}`);
    } catch {
      alert("Erro de rede.");
    } finally {
      setForwarding(false);
    }
  };

  const filtered = messages.filter((m) => {
    if (filter !== "all" && m.type !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (m.title || "").toLowerCase().includes(s) || (m.data || "").toLowerCase().includes(s);
    }
    return true;
  });

  const parseData = (data: string) => {
    try { return typeof data === "string" ? JSON.parse(data) : data; } catch { return { raw: data }; }
  };

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><div className="loader-inline" /></div>;
  }

  return (
    <div style={{ display: "flex", gap: 16, height: "calc(100vh - 180px)" }}>
      {/* Left panel: message list */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["all", "form", "lead", "chat"].map((f) => (
            <button
              key={f}
              className={`btn btn-sm ${filter === f ? "" : "btn-ghost"}`}
              style={filter === f ? { background: "var(--accent)", color: "#fff" } : {}}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "Todos" : TYPE_CONFIG[f]?.label || f} ({f === "all" ? messages.length : messages.filter((m) => m.type === f).length})
            </button>
          ))}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail..."
            style={{ flex: 1, minWidth: 150, padding: "6px 10px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface-2)", color: "var(--text)", fontSize: 12 }}
          />
        </div>

        {/* Messages list */}
        <div className="card" style={{ flex: 1, overflow: "auto", padding: 0 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>Nenhuma mensagem encontrada.</div>
          )}
          {filtered.map((msg, i) => {
            const cfg = TYPE_CONFIG[msg.type] || { icon: "📄", label: msg.type, color: "var(--text-muted)" };
            const isSelected = selected?.id === msg.id && selected?.type === msg.type;
            return (
              <div
                key={`${msg.type}-${msg.id}-${i}`}
                onClick={() => setSelected(msg)}
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  background: isSelected ? "var(--surface-2)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  transition: "background 0.15s",
                }}
              >
                <span style={{ fontSize: 18 }}>{cfg.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {msg.title || "Sem título"}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                    <span style={{ color: cfg.color, fontWeight: 600 }}>{cfg.label}</span> · via {msg.source || "—"}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{msg.created_at ? timeAgo(msg.created_at) : "—"}</span>
                  <span className={`badge ${msg.status === "new" ? "badge-new" : "badge-read"}`} style={{ fontSize: 9 }}>
                    {msg.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right panel: detail */}
      <div className="card" style={{ width: 380, flexShrink: 0, padding: 24, overflow: "auto" }}>
        {!selected ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: 13 }}>
            Selecione uma mensagem para ver os detalhes.
          </div>
        ) : (() => {
          const cfg = TYPE_CONFIG[selected.type] || { icon: "📄", label: selected.type, color: "var(--text-muted)" };
          const parsed = parseData(selected.data);
          return (
            <>
              <div style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span>{cfg.icon}</span>
                <span className="card-title" style={{ fontSize: 16 }}>{cfg.label}</span>
                <span className={`badge ${selected.status === "new" ? "badge-new" : "badge-read"}`} style={{ fontSize: 10, marginLeft: "auto" }}>{selected.status}</span>
              </div>

              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 16 }}>
                {selected.created_at?.slice(0, 16)} · via {selected.source}
              </div>

              <div style={{ background: "var(--surface-2)", borderRadius: 8, padding: 16, fontSize: 13, lineHeight: 1.7 }}>
                {parsed.name && <div><strong>Nome:</strong> {parsed.name}</div>}
                {parsed.contact && <div><strong>Contato:</strong> {parsed.contact}</div>}
                {parsed.email && <div><strong>Email:</strong> {parsed.email}</div>}
                {parsed.phone && <div><strong>Fone:</strong> {parsed.phone}</div>}
                {parsed.intent && <div><strong>Intenção:</strong> {parsed.intent}</div>}
                {parsed.urgency && <div><strong>Urgência:</strong> <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{parsed.urgency}</span></div>}
                {parsed.company && <div><strong>Empresa:</strong> {parsed.company}</div>}
                {parsed.subject && <div><strong>Assunto:</strong> {parsed.subject}</div>}
                {parsed.message && <div style={{ marginTop: 8, whiteSpace: "pre-wrap", color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: 8 }}>{parsed.message}</div>}
                {parsed.raw && <div style={{ whiteSpace: "pre-wrap", fontFamily: "var(--mono)", fontSize: 11 }}>{parsed.raw}</div>}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button className="btn btn-ghost btn-sm" onClick={() => handleForward(selected)} disabled={forwarding}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
                  {forwarding ? " Enviando..." : " Encaminhar"}
                </button>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}
