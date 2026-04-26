import { useEffect, useState } from "react";

type Lead = {
  id: number;
  name: string;
  contact: string;
  intent: string;
  urgency: "baixa" | "media" | "alta";
  status: string;
  source: string;
  created_at: string;
};

const URGENCY_COLOR: Record<string, string> = {
  alta: "bg-red-500/20 text-red-400 border border-red-500/30",
  media: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  baixa: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
};

const STATUS_COLOR: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-purple-500/20 text-purple-400",
  qualified: "bg-emerald-500/20 text-emerald-400",
  lost: "bg-zinc-500/20 text-zinc-400",
};

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  async function fetchLeads() {
    setLoading(true);
    try {
      const url = filter ? `/api/admin/leads?status=${filter}` : "/api/admin/leads";
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json() as Lead[];
      setLeads(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchLeads(); }, [filter]);

  async function updateStatus(id: number, status: string) {
    await fetch(`/api/admin/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  }

  async function deleteLead(id: number) {
    if (!confirm("Remover este lead?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE", credentials: "include" });
    setLeads(prev => prev.filter(l => l.id !== id));
  }

  return (
    <div>
      <div className="collection-toolbar" style={{ marginBottom: 20, display: "flex", justifyContent: "flex-end" }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {["", "new", "contacted", "qualified", "lost"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={filter === s ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
            >
              {s === "" ? "Todos" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <div className="loader-inline" />
        </div>
      ) : leads.length === 0 ? (
        <div className="empty-state">
          <p>Nenhum lead capturado ainda.</p>
        </div>
      ) : (
        <div className="card table-wrap" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Contato</th>
                <th>Intenção</th>
                <th>Urgência</th>
                <th>Status</th>
                <th>Capturado em</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: 500 }}>{lead.name}</td>
                  <td>
                    <a href={`mailto:${lead.contact}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      {lead.contact}
                    </a>
                  </td>
                  <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-muted)' }}>
                    {lead.intent}
                  </td>
                  <td>
                    <span className={`badge badge-role-${lead.urgency === 'alta' ? 'editor' : 'member'}`}>
                      {lead.urgency}
                    </span>
                  </td>
                  <td>
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value)}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '6px', 
                        border: '1px solid var(--border)', 
                        background: 'var(--surface-2)', 
                        color: 'var(--text)',
                        fontSize: '12px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                    })}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 8px', color: 'var(--danger)', opacity: 0.8 }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
