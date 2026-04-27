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

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; label: string; colorClass: string }> = {
  form: { 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    label: "Formulário", colorClass: "text-blue-500 bg-blue-500/10 border-blue-500/20" 
  },
  lead: { 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    label: "Lead", colorClass: "text-amber-500 bg-amber-500/10 border-amber-500/20" 
  },
  chat: { 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    label: "Chat", colorClass: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
  },
};

export default function CommunicationsPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [forwarding, setForwarding] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: "success" | "error"} | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

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
      if (result.success) showNotification("Mensagem encaminhada com sucesso!");
      else showNotification(`Erro: ${result.error}`, "error");
    } catch {
      showNotification("Erro de rede.", "error");
    } finally {
      setForwarding(false);
    }
  };

  const handleDelete = async (msg: Message) => {
    if (!confirm("Remover permanentemente este item?")) return;
    
    // As rotas originais usam o plural (forms, leads). Em communications, a type vem singular (form, lead, chat).
    const endpoint = `/api/admin/${msg.type}s/${msg.id}`; 
    try {
      await fetch(endpoint, { method: "DELETE", credentials: "include" });
      setMessages((prev) => prev.filter((m) => m.id !== msg.id || m.type !== msg.type));
      setSelected(null);
      showNotification("Item excluído permanentemente.");
    } catch {
      showNotification("Erro de rede ao deletar.", "error");
    }
  };

  const handleUpdateStatus = async (msg: Message, newStatus: string) => {
    const endpoint = `/api/admin/${msg.type}s/${msg.id}`; 
    try {
      await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });
      setMessages((prev) => prev.map((m) => (m.id === msg.id && m.type === msg.type) ? { ...m, status: newStatus } : m));
      if (selected?.id === msg.id && selected?.type === msg.type) {
         setSelected({ ...selected, status: newStatus });
      }
      showNotification("Status atualizado!");
    } catch {
      showNotification("Erro de rede ao atualizar status.", "error");
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
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  }

  if (loading) {
    return <div className="flex justify-center p-16 animate-pulse"><div className="loader-inline" /></div>;
  }

  return (
    <div className="flex-1 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6 shrink-0">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
            Inbox Unificado <span className="text-muted-foreground font-light">::</span> Comunicações
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Visão Omnichannel de Contatos
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6 flex-1 min-h-0 overflow-hidden">
        {/* Left panel: List */}
        <div className="flex flex-col flex-1 lg:max-w-md w-full shrink-0 min-h-0">
          <div className="flex gap-2 mb-4 shrink-0 flex-wrap">
            <div className="inline-flex h-9 items-center justify-center rounded-lg bg-card border border-border/60 p-1 text-muted-foreground shadow-sm">
              {["all", "form", "lead", "chat"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    filter === f
                      ? "bg-background text-foreground shadow-sm border border-border/50"
                      : "hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {f === "all" ? "Todos" : TYPE_CONFIG[f]?.label || f} 
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-[150px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar contatos..."
                className="flex h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex-1 overflow-y-auto w-full relative h-[400px] lg:h-auto">
            {filtered.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center bg-background/40 h-full">
                <div className="h-12 w-12 rounded-full bg-accent text-muted-foreground flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <h4 className="font-semibold text-foreground text-sm">Inbox Vazio</h4>
              </div>
            ) : (
               <div className="flex flex-col divide-y divide-border/50">
                {filtered.map((msg, i) => {
                  const cfg = TYPE_CONFIG[msg.type] || { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>, label: msg.type, colorClass: "text-slate-500 bg-slate-500/10 border-slate-500/20" };
                  const isSelected = selected?.id === msg.id && selected?.type === msg.type;
                  return (
                    <button
                      key={`${msg.type}-${msg.id}-${i}`}
                      onClick={() => setSelected(msg)}
                      className={`text-left p-4 flex gap-3 items-start transition-all ${isSelected ? 'bg-muted/40 shadow-inner' : 'hover:bg-muted/20 bg-card'}`}
                    >
                      <div className={`mt-0.5 inline-flex items-center justify-center p-2 rounded-lg border ${cfg.colorClass}`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="font-semibold text-sm text-foreground truncate">{msg.title || "Sem título ID:" + msg.id}</div>
                         <div className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-1.5 opacity-80">
                            <span className="font-mono text-[10px] uppercase tracking-wider">{cfg.label}</span>
                            <span className="w-1 h-1 rounded-full bg-border"></span>
                            via {msg.source || "—"}
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                         <span className="text-[10px] font-mono font-medium text-muted-foreground">{msg.created_at ? timeAgo(msg.created_at) : "—"}</span>
                         {msg.status === "new" ? (
                           <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-primary/20 shrink-0"></span>
                         ) : (
                           <span className="w-2 h-2 rounded-full border border-border shrink-0 opacity-50"></span>
                         )}
                      </div>
                    </button>
                  );
                })}
               </div>
            )}
          </div>
        </div>

        {/* Right panel: Detail */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex-1 flex flex-col h-[600px] lg:h-auto shrink-0 relative overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-background/50">
               <div className="h-16 w-16 rounded-full bg-border/40 text-muted-foreground flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
               </div>
               <p className="text-sm font-medium text-muted-foreground">Selecione uma mensagem no painel esquerdo para visualizar detalhes.</p>
            </div>
          ) : (() => {
            const cfg = TYPE_CONFIG[selected.type] || { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>, label: selected.type, colorClass: "text-slate-500 bg-slate-500/10 border-slate-500/20" };
            const parsed = parseData(selected.data);
            return (
              <div className="flex flex-col h-full absolute inset-0 overflow-hidden">
                <div className="p-5 border-b border-border/40 flex items-start gap-4 shrink-0 bg-muted/20">
                  <div className={`mt-0.5 inline-flex items-center justify-center p-2 rounded-lg border shadow-sm ${cfg.colorClass}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1">
                     <h3 className="text-lg font-bold tracking-tight text-foreground">{cfg.label}</h3>
                     <div className="text-xs font-mono text-muted-foreground mt-1 flex items-center gap-2">
                        <span>{new Date(selected.created_at).toLocaleString('pt-BR')}</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span className="uppercase tracking-wider">Origem: {selected.source}</span>
                     </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                     <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        selected.status === "new" ? "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20" : "bg-muted text-muted-foreground ring-1 ring-inset ring-border"
                      }`}>
                        {selected.status}
                      </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background border border-border/50 p-5 rounded-xl shadow-sm">
                      {parsed.name && <div><strong className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Nome</strong> <span className="text-sm font-semibold text-foreground">{parsed.name}</span></div>}
                      {parsed.contact && <div><strong className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Contato</strong> <span className="text-sm font-mono text-foreground">{parsed.contact}</span></div>}
                      {parsed.email && <div><strong className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">E-mail</strong> <span className="text-sm font-mono text-foreground">{parsed.email}</span></div>}
                      {parsed.phone && <div><strong className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Telefone</strong> <span className="text-sm font-mono text-foreground">{parsed.phone}</span></div>}
                      {parsed.intent && <div><strong className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Intenção</strong> <span className="text-sm font-medium text-foreground">{parsed.intent}</span></div>}
                      {parsed.urgency && <div><strong className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Urgência</strong> <span className="text-sm font-bold uppercase text-foreground">{parsed.urgency}</span></div>}
                      {parsed.company && <div><strong className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Empresa</strong> <span className="text-sm font-medium text-foreground">{parsed.company}</span></div>}
                      {parsed.subject && <div className="md:col-span-2"><strong className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">Assunto</strong> <span className="text-sm font-medium text-foreground">{parsed.subject}</span></div>}
                   </div>
                   
                   {parsed.message && (
                     <div>
                       <strong className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-2 px-1">Mensagem</strong>
                       <div className="bg-muted/30 p-5 rounded-xl border border-border/50 text-sm whitespace-pre-wrap text-foreground leading-relaxed shadow-inner">
                         {parsed.message}
                       </div>
                     </div>
                   )}

                   {parsed.raw && (
                     <div>
                       <strong className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-2 px-1">Payload JSON</strong>
                       <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono whitespace-pre-wrap text-emerald-400 shadow-inner overflow-x-auto">
                         {parsed.raw}
                       </div>
                     </div>
                   )}
                </div>

                <div className="p-4 border-t border-border/40 bg-muted/10 shrink-0 flex gap-3 justify-end items-center">
                  
                  {selected.type === "lead" && (
                     <select
                       value={selected.status}
                       onChange={e => handleUpdateStatus(selected, e.target.value)}
                       className="h-9 mr-auto items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-semibold uppercase tracking-wider text-muted-foreground hover:bg-accent"
                     >
                       <option value="new">New</option>
                       <option value="contacted">Contacted</option>
                       <option value="qualified">Qualified</option>
                       <option value="lost">Lost</option>
                     </select>
                  )}

                  {selected.type === "form" && selected.status === "new" && (
                    <button 
                      className="mr-auto inline-flex h-9 items-center justify-center rounded-md border border-input shadow-sm bg-background px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-accent"
                      onClick={() => handleUpdateStatus(selected, "read")} 
                    >
                      Marcar como Lido
                    </button>
                  )}

                  <button 
                    className="inline-flex h-9 items-center justify-center rounded-md border border-input shadow-sm bg-background px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-red-500 hover:text-white disabled:opacity-50 text-red-500"
                    onClick={() => handleDelete(selected)} 
                  >
                    Excluir
                  </button>

                  {selected.type !== "chat" && (
                    <button 
                      className="inline-flex h-9 items-center justify-center rounded-md border border-input shadow-sm bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-primary/90 disabled:opacity-50"
                      onClick={() => handleForward(selected)} 
                      disabled={forwarding}
                    >
                      <svg className="mr-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
                      {forwarding ? "Executando..." : "Encaminhar"}
                    </button>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-bottom flex items-center gap-3 z-50 transition-all ${
          notification.type === "success" 
            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
            : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
        }`}>
          {notification.type === "success" ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          )}
          <span className="font-semibold text-sm leading-none">{notification.message}</span>
        </div>
      )}
    </div>
  );
}
