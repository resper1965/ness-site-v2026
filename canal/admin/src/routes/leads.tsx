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
    if (!confirm("Remover este lead permanentemente?")) return;
    await fetch(`/api/admin/leads/${id}`, { method: "DELETE", credentials: "include" });
    setLeads(prev => prev.filter(l => l.id !== id));
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Fluxo de Conversão <span className="text-muted-foreground font-light">::</span> CRM Leads
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Gestão de Oportunidades e Prospects Inbound
          </p>
        </div>
        
        <div className="inline-flex h-10 items-center justify-center rounded-lg bg-card border border-border/60 p-1 text-muted-foreground shadow-sm">
          {["", "new", "contacted", "qualified", "lost"].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                filter === s
                  ? "bg-background text-foreground shadow-sm border border-border/50"
                  : "hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {s === "" ? "Todos" : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-16 animate-pulse">
          <div className="loader-inline" />
        </div>
      ) : leads.length === 0 ? (
        <div className="p-16 flex flex-col items-center justify-center text-center bg-background/40 rounded-xl border border-border/50 mt-6">
          <div className="h-16 w-16 rounded-full bg-accent text-muted-foreground flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <h4 className="font-semibold text-foreground">Nenhum Lead Capturado</h4>
          <p className="text-sm text-muted-foreground mt-1 max-w-[300px]">O pipeline para este status está vazio.</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground text-left">
                  <th className="font-medium p-4">Identificação</th>
                  <th className="font-medium p-4">Contato Direto</th>
                  <th className="font-medium p-4">Intenção Mapeada</th>
                  <th className="font-medium p-4">Termômetro</th>
                  <th className="font-medium p-4">Status Pipeline</th>
                  <th className="font-medium p-4">Timeline</th>
                  <th className="font-medium p-4 w-[60px]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                    <td className="p-4">
                      <div className="font-semibold text-foreground">{lead.name}</div>
                      <div className="text-[10px] uppercase font-mono text-muted-foreground mt-1 tracking-wider opacity-70">ID: {lead.id}</div>
                    </td>
                    <td className="p-4">
                      <a href={`mailto:${lead.contact}`} className="inline-flex items-center gap-1.5 text-primary hover:underline hover:text-primary/80 font-medium text-xs font-mono transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        {lead.contact}
                      </a>
                    </td>
                    <td className="p-4 text-xs font-medium text-muted-foreground max-w-[200px] truncate" title={lead.intent}>
                      {lead.intent}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        lead.urgency === 'alta' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                        lead.urgency === 'media' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                      }`}>
                        {lead.urgency}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={lead.status}
                        onChange={e => updateStatus(lead.id, e.target.value)}
                        className="flex h-8 items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer font-semibold uppercase tracking-wider text-muted-foreground hover:bg-accent"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="p-4 flex justify-end">
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded border border-transparent hover:border-red-500/30 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all focus:outline-none" 
                        title="Descartar Lead"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
