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
    <div className="mx-auto max-w-7xl w-full flex-1 min-w-0 p-6 md:p-8 pt-6 md:pt-8 space-y-6 flex flex-col h-[calc(100vh-2rem)] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6 relative shrink-0">
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent"></div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground/60" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
            Inbox Unificado <span className="text-muted-foreground/30 font-light mx-1">/</span> Comunicações
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Visão Omnichannel de Contatos e Leads
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-2 flex-1 min-h-0 overflow-hidden">
        {/* Left panel: List */}
        <div className="flex flex-col flex-1 lg:max-w-[420px] w-full shrink-0 min-h-0">
          <div className="flex flex-col gap-4 mb-5 shrink-0">
            <div className="inline-flex h-10 items-center justify-center rounded-xl bg-muted/40 border border-border/50 p-1 text-muted-foreground w-full">
              {["all", "form", "lead", "chat"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`inline-flex items-center flex-1 justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
                    filter === f
                      ? "bg-background text-foreground shadow-sm border border-border/60"
                      : "hover:text-foreground hover:bg-muted/80"
                  }`}
                >
                  {f === "all" ? "Todos" : TYPE_CONFIG[f]?.label || f} 
                </button>
              ))}
            </div>
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar contatos..."
                className="flex h-11 w-full rounded-xl border border-border/50 bg-background/50 pl-11 pr-4 py-2 text-sm transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm flex-1 overflow-y-auto w-full relative h-[400px] lg:h-auto custom-scrollbar">
            {filtered.length === 0 ? (
               <div className="p-20 flex flex-col items-center justify-center text-center bg-background/20 h-full">
                  <div className="h-16 w-16 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-5 animate-in zoom-in duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </div>
                  <h4 className="font-bold text-foreground text-base">Nenhum evento localizado</h4>
                  <p className="text-sm font-medium text-muted-foreground mt-1.5">Tente modificar os filtros de busca acima.</p>
                </div>
            ) : (
               <div className="flex flex-col divide-y divide-border/30">
                {filtered.map((msg, i) => {
                  const cfg = TYPE_CONFIG[msg.type] || { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>, label: msg.type, colorClass: "text-slate-500 bg-slate-500/10 border-slate-500/20" };
                  const isSelected = selected?.id === msg.id && selected?.type === msg.type;
                  return (
                    <button
                      key={`${msg.type}-${msg.id}-${i}`}
                      onClick={() => setSelected(msg)}
                      className={`text-left p-5 flex gap-4 items-start transition-all duration-300 relative overflow-hidden group ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/30 bg-card'}`}
                    >
                      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                      <div className={`mt-0.5 inline-flex items-center justify-center p-2.5 rounded-xl border shadow-sm ${cfg.colorClass}`}>
                        {cfg.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">{msg.title || "Sem título ID:" + msg.id}</div>
                         <div className="text-xs text-muted-foreground mt-1.5 truncate flex items-center gap-1.5 opacity-80 font-medium">
                            <span className="font-mono  tracking-wide bg-background px-1.5 py-0.5 rounded border border-border/50">{cfg.label}</span>
                            <span className="w-1 h-1 rounded-full bg-border/80"></span>
                            via {msg.source || "—"}
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                         <span className="text-xs font-mono font-medium text-muted-foreground/80">{msg.created_at ? timeAgo(msg.created_at) : "—"}</span>
                         {msg.status === "new" ? (
                           <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 shrink-0 shadow-[0_0_8px_-1px_rgba(16,185,129,0.8)]"></span>
                         ) : (
                           <span className="w-2 h-2 rounded-full border-2 border-border shrink-0 opacity-40"></span>
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
        <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm flex-1 flex flex-col h-[600px] lg:h-auto shrink-0 relative overflow-hidden">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-16 bg-background/20">
               <div className="h-20 w-20 rounded-full bg-muted/40 border border-border/50 text-muted-foreground/50 flex items-center justify-center mb-6 pointer-events-none">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
               </div>
               <p className="text-sm font-medium text-muted-foreground/80">Selecione uma mensagem no painel esquerdo para visualizar o contexto completo.</p>
            </div>
          ) : (() => {
            const cfg = TYPE_CONFIG[selected.type] || { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>, label: selected.type, colorClass: "text-slate-500 bg-slate-500/10 border-slate-500/20" };
            const parsed = parseData(selected.data);
            return (
              <div className="flex flex-col h-full absolute inset-0 overflow-hidden">
                <div className="p-6 border-b border-border/50 flex items-start gap-5 shrink-0 bg-muted/30">
                  <div className={`mt-0.5 inline-flex items-center justify-center p-3 rounded-xl border shadow-sm ${cfg.colorClass}`}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1">
                     <h3 className="text-xl font-bold tracking-tight text-foreground">{cfg.label} <span className="text-muted-foreground/50 mx-1">/</span> #{selected.id}</h3>
                     <div className="text-xs font-mono font-medium text-muted-foreground mt-1.5 flex items-center gap-2">
                        <span>{new Date(selected.created_at).toLocaleString('pt-BR')}</span>
                        <span className="w-1 h-1 rounded-full bg-border"></span>
                        <span className="uppercase tracking-wider">Origem: {selected.source}</span>
                     </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                     <span className={`inline-flex items-center rounded-md px-3 py-1 shadow-sm text-xs font-medium uppercase tracking-wide ${
                        selected.status === "new" ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30" : "bg-muted text-muted-foreground border border-border"
                      }`}>
                        {selected.status}
                      </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-background border border-border/50 p-6 rounded-2xl shadow-sm">
                      {parsed.name && <div className="space-y-1.5"><strong className="text-xs uppercase font-bold text-muted-foreground tracking-wide block">Nome Assinatura</strong> <span className="text-sm font-semibold text-foreground flex items-center gap-2"><svg className="text-muted-foreground w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>{parsed.name}</span></div>}
                      {parsed.contact && <div className="space-y-1.5"><strong className="text-xs uppercase font-bold text-muted-foreground tracking-wide block">Contato Referência</strong> <span className="text-sm font-mono font-medium text-foreground">{parsed.contact}</span></div>}
                      {parsed.email && <div className="space-y-1.5"><strong className="text-xs uppercase font-bold text-muted-foreground tracking-wide block">Nó E-mail</strong> <span className="text-sm font-mono font-medium bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">{parsed.email}</span></div>}
                      {parsed.phone && <div className="space-y-1.5"><strong className="text-xs uppercase font-bold text-muted-foreground tracking-wide block">DDI / Telefone</strong> <span className="text-sm font-mono font-medium text-foreground">{parsed.phone}</span></div>}
                      {parsed.intent && <div className="space-y-1.5"><strong className="text-xs uppercase font-bold text-muted-foreground tracking-wide block">Intenção de Funil</strong> <span className="text-sm font-medium text-foreground">{parsed.intent}</span></div>}
                      {parsed.urgency && <div className="space-y-1.5"><strong className="text-xs uppercase font-bold text-muted-foreground tracking-wide block">Prioridade Urgência</strong> <span className="text-xs font-medium uppercase bg-amber-500/10 text-amber-600 px-2 py-1 rounded inline-flex border border-amber-500/20">{parsed.urgency}</span></div>}
                      {parsed.company && <div className="space-y-1.5 lg:col-span-2"><strong className="text-xs uppercase font-bold text-muted-foreground tracking-wide block">Organização Ancorada</strong> <span className="text-sm font-bold text-foreground">{parsed.company}</span></div>}
                      {parsed.subject && <div className="md:col-span-2 lg:col-span-3"><strong className="text-xs uppercase font-bold text-muted-foreground tracking-wide block">Assunto da Fila</strong> <span className="text-sm font-bold text-foreground bg-muted/50 px-3 py-1.5 rounded-lg border border-border inline-flex">{parsed.subject}</span></div>}
                   </div>
                   
                   {parsed.message && (
                     <div className="space-y-3">
                       <strong className="text-xs uppercase font-medium text-muted-foreground tracking-wide flex items-center gap-2 px-1">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Decoded Message Payload
                       </strong>
                       <div className="bg-background/50 p-6 rounded-2xl border border-border/50 text-sm whitespace-pre-wrap text-foreground font-medium leading-relaxed">
                         {parsed.message}
                       </div>
                     </div>
                   )}

                   {parsed.raw && (
                     <div className="space-y-3">
                       <strong className="text-xs uppercase font-medium text-muted-foreground tracking-wide flex items-center gap-2 px-1">Raw Payload Dump</strong>
                       <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono whitespace-pre-wrap text-emerald-400 overflow-x-auto">
                         {parsed.raw}
                       </div>
                     </div>
                   )}
                </div>

                <div className="p-5 border-t border-border/50 bg-muted/30 shrink-0 flex gap-4 justify-end items-center">
                  
                  {selected.type === "lead" && (
                     <select
                       value={selected.status}
                       onChange={e => handleUpdateStatus(selected, e.target.value)}
                       className="h-10 mr-auto items-center justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer font-bold uppercase tracking-wide text-muted-foreground hover:bg-background appearance-none"
                     >
                       <option value="new">Lead Novo</option>
                       <option value="contacted">Já Contatado</option>
                       <option value="qualified">Qualificado</option>
                       <option value="lost">Lead Perdido</option>
                     </select>
                  )}

                  {selected.type === "form" && selected.status === "new" && (
                    <button 
                      className="mr-auto inline-flex h-10 items-center justify-center rounded-xl border border-border/60 shadow-sm bg-background px-5 py-2 text-xs font-bold uppercase tracking-wide hover:bg-muted/80 transition-all text-foreground"
                      onClick={() => handleUpdateStatus(selected, "read")} 
                    >
                      Processar Leitura
                    </button>
                  )}

                  <button 
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-transparent hover:border-red-500/30 hover:bg-red-500/10 px-5 text-xs font-bold uppercase tracking-wide transition-all text-muted-foreground hover:text-red-500 shadow-sm"
                    onClick={() => handleDelete(selected)} 
                  >
                    Excluir
                  </button>

                  {selected.type !== "chat" && (
                    <button 
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-xs font-medium uppercase tracking-wide text-primary-foreground shadow-[0_4px_14px_0_rgba(var(--primary),0.39)] hover:shadow-[0_6px_20px_rgba(var(--primary),0.23)] hover:-translate-y-px transition-all disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() => handleForward(selected)} 
                      disabled={forwarding}
                    >
                      <svg className="mr-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
                      {forwarding ? "Roteando..." : "Encaminhar"}
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
