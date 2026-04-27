import React, { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";

interface Organization {
  id: string;
  name: string;
  slug: string;
  metadata: string | Record<string, unknown>;
  createdAt: string;
  memberCount: number;
}

export default function OrganizationsPage() {
  const { data: session } = authClient.useSession();
  const [organizations, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const SUPER_ADMIN_EMAILS = ["resper@bekaa.eu", "admin@ness.com.br", "resper@ness.com.br"];
  const isSuperAdmin = session?.user?.role === 'admin' || SUPER_ADMIN_EMAILS.includes(session?.user?.email || "");

  useEffect(() => {
    if (isSuperAdmin) {
      fetchOrganizations();
    } else {
      setLoading(false);
      setErrorMsg("Acesso restrito a Super Admins.");
    }
  }, [isSuperAdmin]);

  const fetchOrganizations = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const req = await authClient.$fetch("/api/admin/organizations", {
        baseURL: window.location.origin
      });
      if (req.error) {
        setErrorMsg((req.error as { message?: string }).message ?? "Erro ao carregar organizações.");
      } else {
        setOrgs((req.data as Organization[]) || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão ao buscar organizações");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (org: Organization, plan: string) => {
    if (!confirm(`Mudar o plano da organização ${org.name} para ${plan.toUpperCase()}?`)) return;
    const metadata = { ...(typeof org.metadata === 'string' ? JSON.parse(org.metadata || "{}") : org.metadata), plan };
    try {
      const req = await authClient.$fetch(`/api/admin/organizations/${org.id}`, {
        method: "PATCH",
        baseURL: window.location.origin,
        body: { metadata }
      });
      if ((req.data as { success?: boolean })?.success) {
        fetchOrganizations();
      } else {
        alert("Erro ao atualizar plano.");
      }
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const confirmName = prompt(`CUIDADO: Escreva "${name}" para excluir esta organização DEFINITIVAMENTE.`);
    if (confirmName !== name) return;
    
    try {
      const req = await authClient.$fetch(`/api/admin/organizations/${id}`, {
        method: "DELETE",
        baseURL: window.location.origin
      });
      if ((req.data as { success?: boolean })?.success) {
        fetchOrganizations();
      } else {
        alert("Erro ao excluir.");
      }
    } catch (err: any) {
      alert("Erro: " + err.message);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="flex-1 p-8 flex flex-col animate-in fade-in slide-in-from-bottom-2">
         <div className="flex-1 flex flex-col items-center justify-center p-16 rounded-xl border border-red-500/20 bg-background/50">
            <div className="h-16 w-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">Acesso Negado</h2>
            <p className="text-muted-foreground mt-2">{errorMsg}</p>
         </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 10h16M4 14h16M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/><path d="M8 10v4M16 10v4"/></svg>
            Cloud Platform <span className="text-muted-foreground font-light">::</span> Tenant Ops
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Instâncias Multi-Tenant e Provisionamento
          </p>
        </div>
      </div>

      {errorMsg && (
         <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/30 text-red-500 flex items-start gap-3">
            <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span className="text-sm font-bold tracking-wide">{errorMsg}</span>
         </div>
      )}

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="bg-muted/30 p-5 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-semibold leading-none tracking-tight">Topologia de Instâncias Aprovadas</h3>
          <span className="inline-flex items-center justify-center rounded-md bg-background border border-border px-3 py-1 font-mono text-sm font-bold shadow-sm">
             Nodes: {organizations.length}
          </span>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-16 animate-pulse"><div className="loader-inline" /></div>
        ) : (
           <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground text-left">
                  <th className="font-medium p-4 pl-6">Estrutura Org. (Tenant)</th>
                  <th className="font-medium p-4">Identifier / Slug</th>
                  <th className="font-medium p-4">Policy / Billing</th>
                  <th className="font-medium p-4 text-center">Seats Utilizados</th>
                  <th className="font-medium p-4 pr-6 text-right">Diretiva de Erradicação</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((o: any) => {
                  let meta = o.metadata || {};
                  if (typeof meta === "string") {
                    try { meta = JSON.parse(meta); } catch(e){}
                  }
                  
                  return (
                    <tr key={o.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                      <td className="p-4 pl-6">
                        <div className="font-semibold text-[15px] font-sans text-foreground">{o.name}</div>
                        <div className="text-[10px] uppercase font-mono text-muted-foreground mt-1 tracking-wider opacity-70">ID: {o.id}</div>
                      </td>
                      <td className="p-4 text-xs font-mono font-medium text-muted-foreground">
                        <span className="bg-muted px-2 py-0.5 rounded text-foreground">{o.slug}</span>
                      </td>
                      <td className="p-4">
                        <select
                          className="flex h-8 items-center justify-between rounded-md border border-input bg-background/50 px-3 py-1 text-[11px] uppercase tracking-wider shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer font-bold"
                          value={meta.plan || "free"}
                          onChange={(e) => handleUpdatePlan(o, e.target.value)}
                        >
                          <option value="free">Tier: FREE</option>
                          <option value="pro">Tier: PRO</option>
                          <option value="enterprise">Tier: ENTERPRISE</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                         <span className="inline-flex items-center justify-center bg-accent/20 text-accent-foreground font-mono w-7 h-7 rounded-full text-xs font-bold border border-border">
                            {o.memberCount || 0}
                         </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent hover:border-red-500/30 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all focus:outline-none"
                          onClick={() => handleDelete(o.id, o.name)}
                          title="Purge Tenant"
                        >
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
