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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-end mb-8">
        <div className="flex gap-2">
          {["", "new", "contacted", "qualified", "lost"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === s
                  ? "bg-white text-black"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {s === "" ? "Todos" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 text-zinc-500">Carregando...</div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-zinc-500 gap-2">
          <span className="text-3xl">🎯</span>
          <p>Nenhum lead capturado ainda.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">Nome</th>
                <th className="text-left px-4 py-3">Contato</th>
                <th className="text-left px-4 py-3">Intenção</th>
                <th className="text-left px-4 py-3">Urgência</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Capturado em</th>
                <th className="text-left px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{lead.name}</td>
                  <td className="px-4 py-3 text-zinc-300">
                    <a href={`mailto:${lead.contact}`} className="hover:text-white transition-colors">
                      {lead.contact}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 max-w-[200px] truncate">{lead.intent}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${URGENCY_COLOR[lead.urgency] || ""}`}>
                      {lead.urgency}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={e => updateStatus(lead.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-lg border-none outline-none cursor-pointer ${STATUS_COLOR[lead.status] || "bg-zinc-700 text-zinc-300"}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs">
                    {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="text-zinc-600 hover:text-red-400 transition-colors text-xs"
                    >
                      ✕
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
