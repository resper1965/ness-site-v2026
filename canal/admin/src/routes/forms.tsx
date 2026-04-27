import { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";

type Form = { id: number; source: string; payload: string; status: string; created_at: string };

export default function FormsPage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [items, setItems] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchForms = () => {
    setLoading(true);
    fetch("/api/admin/forms", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  };

  useEffect(() => { fetchForms(); }, [activeOrg?.id]);

  const handleMarkRead = async (id: number) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: "read" } : i));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remover este formulário permanentemente?")) return;
    await fetch(`/api/admin/forms/${id}`, { method: "DELETE", credentials: "include" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) {
    return <div className="flex justify-center p-16 animate-pulse"><div className="loader-inline" /></div>;
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Caixa de Entrada <span className="text-muted-foreground font-light">::</span> Formulários
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Ingestão de Dados e Contatos Diretos
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeOrg && (
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase text-primary tracking-wide">
               {activeOrg.slug}
            </span>
          )}
          <div className="bg-background border border-border shadow-sm rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</span>
            <span className="text-sm font-black font-mono">{items.length}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="w-full overflow-auto">
          {items.length === 0 ? (
             <div className="p-16 flex flex-col items-center justify-center text-center bg-background/40">
                <div className="h-16 w-16 rounded-full bg-accent text-muted-foreground flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                </div>
                <h4 className="font-semibold text-foreground">Caixa Vazia</h4>
                <p className="text-sm text-muted-foreground mt-1 max-w-[300px]">Nenhum formulário recebido no momento.</p>
              </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground text-left">
                  <th className="font-medium p-4">ID</th>
                  <th className="font-medium p-4">Origem</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Data</th>
                  <th className="font-medium p-4">Dados</th>
                  <th className="font-medium p-4 w-[100px]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  let parsed: any = {};
                  try { parsed = typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload; } catch { /* */ }
                  return (
                    <tr key={item.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                      <td className="p-4"><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">#{item.id}</code></td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:text-slate-300">
                          {item.source}
                        </span>
                      </td>
                      <td className="p-4">
                        {item.status === "new" ? (
                           <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                             Novo
                           </span>
                        ) : (
                           <span className="inline-flex items-center rounded-full bg-slate-500/10 text-slate-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                             Lido
                           </span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-xs text-muted-foreground">{item.created_at?.slice(0, 16)}</td>
                      <td className="p-4 min-w-[300px]">
                        <details className="group">
                          <summary className="cursor-pointer text-xs font-semibold text-primary select-none flex items-center gap-1 hover:text-primary/80 transition-colors">
                            <svg className="transition-transform group-open:rotate-90" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                            Explorar payload
                          </summary>
                          <div className="mt-3 bg-muted/40 p-4 rounded-lg border border-border/50 text-xs font-mono grid gap-2 shadow-inner">
                            {parsed.name && <div className="text-foreground"><strong className="text-muted-foreground mr-2 font-sans text-[11px] uppercase tracking-wider">Nome:</strong> {parsed.name}</div>}
                            {parsed.email && <div className="text-foreground"><strong className="text-muted-foreground mr-2 font-sans text-[11px] uppercase tracking-wider">Email:</strong> {parsed.email}</div>}
                            {parsed.phone && <div className="text-foreground"><strong className="text-muted-foreground mr-2 font-sans text-[11px] uppercase tracking-wider">Fone:</strong> {parsed.phone}</div>}
                            {parsed.company && <div className="text-foreground"><strong className="text-muted-foreground mr-2 font-sans text-[11px] uppercase tracking-wider">Empresa:</strong> {parsed.company}</div>}
                            {parsed.subject && <div className="text-foreground"><strong className="text-muted-foreground mr-2 font-sans text-[11px] uppercase tracking-wider">Assunto:</strong> {parsed.subject}</div>}
                            {parsed.message && <div className="mt-2 text-foreground p-3 bg-background rounded border border-border whitespace-pre-wrap leading-relaxed shadow-sm"><strong className="text-muted-foreground block mb-1 font-sans text-[11px] uppercase tracking-wider">Mensagem:</strong>{parsed.message}</div>}
                          </div>
                        </details>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {item.status === "new" && (
                            <button className="inline-flex h-7 items-center justify-center rounded border border-input bg-background hover:bg-accent hover:text-accent-foreground px-2 text-[10px] font-bold uppercase transition-all shadow-sm" onClick={() => handleMarkRead(item.id)}>
                              Marcar
                            </button>
                          )}
                          <button className="inline-flex h-7 w-7 items-center justify-center rounded border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all focus:outline-none" onClick={() => handleDelete(item.id)} title="Excluir Permanente">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
