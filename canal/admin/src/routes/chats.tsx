import { useState, useEffect } from "react";

type Chat = { id: number; session_id: string; messages: string; created_at: string; updated_at: string };

export default function ChatsPage() {
  const [items, setItems] = useState<Chat[]>([]);

  useEffect(() => {
    fetch("/api/admin/chats", { credentials: "include" })
      .then((r) => r.json() as Promise<Chat[]>)
      .then((data) => setItems(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
            Sessões Interativas <span className="text-muted-foreground font-light">::</span> Audit Logs
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Conversas com o Agente de IA em Tempo Real
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden mt-6">
         <div className="bg-muted/30 p-5 border-b border-border/40 flex items-center justify-between">
           <h3 className="font-semibold leading-none tracking-tight">Registro Vectorial e Conversacional</h3>
         </div>
         <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground text-left">
                  <th className="font-medium p-4 pl-6">ID de Sessão (Hashed)</th>
                  <th className="font-medium p-4 text-center">Depth Msgs</th>
                  <th className="font-medium p-4">Snapshot Timestamp</th>
                  <th className="font-medium p-4 pr-6">Data Dump (JSON Trace)</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 && (
                  <tr><td colSpan={4} className="p-16 text-center text-muted-foreground font-medium text-sm">Nenhuma sessão persistida para leitura na base D1.</td></tr>
                )}
                {items.map((item) => {
                  let msgs: any[] = [];
                  try { msgs = JSON.parse(item.messages); } catch { /* */ }
                  return (
                    <tr key={item.id} className="border-b border-border/50 transition-colors hover:bg-muted/30 group">
                      <td className="p-4 pl-6">
                         <div className="font-mono text-xs font-semibold text-foreground">{item.session_id}</div>
                         <div className="text-[10px] uppercase font-mono text-muted-foreground mt-1 tracking-wider opacity-70">Log ID: {item.id}</div>
                      </td>
                      <td className="p-4 text-center">
                         <span className="inline-flex items-center justify-center bg-accent/10 border border-accent/20 text-accent font-mono w-7 h-7 rounded text-[11px] font-bold">
                            {msgs.length}
                         </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">{item.updated_at?.slice(0, 16)}</td>
                      <td className="p-4 pr-6 min-w-[400px]">
                        <details className="group/details">
                          <summary className="cursor-pointer text-xs font-bold uppercase tracking-wider text-primary select-none flex items-center gap-1 hover:text-primary/80 transition-colors bg-primary/5 w-max px-3 py-1.5 rounded-md border border-primary/20">
                            <svg className="transition-transform group-open/details:rotate-90" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                            Trace Dump
                          </summary>
                          <div className="mt-3 bg-slate-950 p-4 w-full rounded border border-border grid gap-2.5 shadow-inner">
                            {msgs.map((m: any, i: number) => (
                              <div key={i} className={`p-3 rounded-md text-xs font-mono leading-relaxed max-w-[85%] border shadow-sm ${m.role === 'user' ? 'bg-slate-900 border-slate-800 self-end text-emerald-400' : 'bg-slate-800 border-slate-700 self-start text-blue-300'}`}>
                                <strong className={`block text-[9px] uppercase tracking-wider mb-1.5 font-bold ${m.role === 'user' ? 'text-emerald-600' : 'text-blue-500'}`}>{m.role}</strong>
                                <span className="whitespace-pre-wrap font-sans text-[13px] opacity-90">{m.content}</span>
                              </div>
                            ))}
                          </div>
                        </details>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
