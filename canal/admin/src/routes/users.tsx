import React, { useEffect, useState } from "react";
import { authClient, admin } from "../lib/auth-client";

export default function UsersPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const SUPER_ADMIN_EMAILS = ["resper@bekaa.eu", "admin@ness.com.br", "resper@ness.com.br"];
  const isSuperAdmin = session?.user?.role === 'admin' || SUPER_ADMIN_EMAILS.includes(session?.user?.email || "");

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    } else {
      setLoading(false);
      setErrorMsg("Acesso restrito a Super Admins.");
    }
  }, [isSuperAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await admin.listUsers({ query: { limit: 100 } });
      if (res.data?.users) {
        setUsers(res.data.users);
      } else if (res.error) {
        setErrorMsg(res.error.message || "Erro ao buscar usuários");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão ao buscar usuários");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: "user" | "admin") => {
    const res = await admin.setRole({ userId, role: newRole });
    if (!res.error) fetchUsers();
    else alert(res.error.message);
  };

  const handleBan = async (userId: string, isBanned: boolean) => {
    if (!confirm(`Deseja realmente ${isBanned ? 'desbanir' : 'banir'} este usuário da infraestrutura?`)) return;
    
    let res;
    if (isBanned) {
      res = await admin.unbanUser({ userId });
    } else {
      res = await admin.banUser({ userId });
    }
    
    if (!res.error) fetchUsers();
    else alert(res.error.message);
  };

  if (!isSuperAdmin) {
    return (
      <div className="mx-auto max-w-7xl w-full flex-1 min-w-0 p-6 md:p-8 pt-6 md:pt-8 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-400 overflow-y-auto custom-scrollbar">
         <div className="flex-1 flex flex-col items-center justify-center p-20 rounded-2xl border border-red-500/20 bg-background/50">
            <div className="h-20 w-20 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-6 border border-red-500/20 shadow-sm animate-pulse">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 className="text-lg font-semibold tracking-tighter text-foreground uppercase">Acesso Negado</h2>
            <p className="text-muted-foreground font-medium mt-2 max-w-md text-center">{errorMsg}</p>
         </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full flex-1 min-w-0 p-6 md:p-8 pt-6 md:pt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6 relative shrink-0">
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent"></div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground/60" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Data Center <span className="text-muted-foreground/30 font-light mx-1">/</span> IAM Usuários
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Plataforma Global Identity Access Management
          </p>
        </div>
      </div>

      {errorMsg && (
         <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/30 text-red-500 flex items-start gap-4 shadow-sm">
            <div className="mt-0.5 inline-flex items-center justify-center p-1 rounded-md bg-red-500/20 border border-red-500/30">
              <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <span className="text-sm font-bold tracking-wide">{errorMsg}</span>
         </div>
      )}

      <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="bg-muted/30 p-5 px-6 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Censo de Identidades Globais</h3>
          <span className="inline-flex items-center justify-center rounded-lg bg-background border border-border/60 px-3 py-1 font-mono text-xs font-medium tracking-wide text-muted-foreground">
             T: {users.length}
          </span>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-20 animate-pulse"><div className="loader-inline" /></div>
        ) : (
          <div className="w-full overflow-x-auto min-w-0 max-w-full custom-scrollbar">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-background/40 text-xs uppercase tracking-wide text-muted-foreground text-left">
                  <th className="font-bold py-3.5 px-6">Node Identidade</th>
                  <th className="font-bold py-3.5 px-4">Email Principal</th>
                  <th className="font-bold py-3.5 px-4">Privilégio</th>
                  <th className="font-bold py-3.5 px-4">Estado (Flag)</th>
                  <th className="font-bold py-3.5 px-6 text-right w-[150px]">Diretivas</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => {
                  const isBanned = u.banned;
                  return (
                    <tr key={u.id} className={`border-b border-border/20 transition-colors ${isBanned ? 'bg-red-500/5' : 'hover:bg-muted/30'}`}>
                      <td className="py-3 px-6">
                         <div className="font-bold text-sm text-foreground flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs uppercase border border-primary/20 shrink-0 shadow-sm">
                              {u.name?.charAt(0) || '?'}
                           </div>
                           {u.name || "N/A"}
                         </div>
                         <div className="text-xs uppercase font-mono text-muted-foreground mt-1.5 tracking-wider opacity-70 ml-11">ID: {u.id}</div>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono font-medium text-muted-foreground">{u.email}</td>
                      <td className="py-3 px-4">
                        <select
                          className="flex h-9 w-[140px] items-center justify-between rounded-xl border border-border/50 bg-background/50 px-3 py-1 text-xs uppercase tracking-wide transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-bold disabled:opacity-50 appearance-none cursor-pointer"
                          value={u.role || "user"}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as "user" | "admin")}
                          disabled={u.email === session?.user?.email}
                        >
                          <option value="user">Member Default</option>
                          <option value="admin">Root Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        {isBanned ? (
                          <span className="inline-flex shadow-sm items-center rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 px-2 py-0.5 text-xs font-medium uppercase tracking-wide">
                            Quarentena
                          </span>
                        ) : (
                          <span className="inline-flex shadow-sm items-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-xs font-medium uppercase tracking-wide">
                            Health Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-6 flex justify-end">
                        <button
                          className={`inline-flex h-9 items-center justify-center rounded-xl border text-xs font-medium uppercase tracking-wide px-4 transition-all shadow-sm ${
                             isBanned 
                               ? 'border-border/60 bg-background/50 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 hover:shadow-emerald-500/20'
                               : 'border-border/60 bg-background/50 hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-red-500/20'
                          }`}
                          onClick={() => handleBan(u.id, isBanned)}
                          disabled={u.email === session?.user?.email}
                        >
                          {isBanned ? "Revogar Ban" : "Banir Node"}
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
