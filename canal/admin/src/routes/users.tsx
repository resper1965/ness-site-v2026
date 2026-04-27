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
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Data Center <span className="text-muted-foreground font-light">::</span> IAM Usuários
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Plataforma Global Identity Access Management
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
          <h3 className="font-semibold leading-none tracking-tight">Censo de Identidades Globais</h3>
          <span className="inline-flex items-center justify-center rounded-md bg-background border border-border px-3 py-1 font-mono text-sm font-bold shadow-sm">
             T: {users.length}
          </span>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-16 animate-pulse"><div className="loader-inline" /></div>
        ) : (
          <div className="w-full overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground text-left">
                  <th className="font-medium p-4 pl-6">Node Identidade</th>
                  <th className="font-medium p-4">Email Principal</th>
                  <th className="font-medium p-4">Privilégio</th>
                  <th className="font-medium p-4">Estado (Flag)</th>
                  <th className="font-medium p-4 pr-6 text-right">Diretivas</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => {
                  const isBanned = u.banned;
                  return (
                    <tr key={u.id} className={`border-b border-border/50 transition-colors ${isBanned ? 'bg-red-500/5' : 'hover:bg-muted/30'}`}>
                      <td className="p-4 pl-6">
                         <div className="font-semibold text-foreground flex items-center gap-2">
                           <div className="w-6 h-6 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] uppercase border border-primary/20 shrink-0">
                              {u.name?.charAt(0) || '?'}
                           </div>
                           {u.name || "N/A"}
                         </div>
                         <div className="text-[10px] uppercase font-mono text-muted-foreground mt-1.5 tracking-wider opacity-70">ID: {u.id}</div>
                      </td>
                      <td className="p-4 text-xs font-mono font-medium text-muted-foreground">{u.email}</td>
                      <td className="p-4">
                        <select
                          className="flex h-8 items-center justify-between rounded-md border border-input bg-background/50 px-3 py-1 text-[11px] uppercase tracking-wider shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer font-bold disabled:opacity-50"
                          value={u.role || "user"}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as "user" | "admin")}
                          disabled={u.email === session?.user?.email}
                        >
                          <option value="user">MEMBER</option>
                          <option value="admin">ROOT / ADMIN</option>
                        </select>
                      </td>
                      <td className="p-4">
                        {isBanned ? (
                          <span className="inline-flex items-center rounded-full bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            Quarentena
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                            Health Active
                          </span>
                        )}
                      </td>
                      <td className="p-4 pr-6 flex justify-end">
                        <button
                          className={`inline-flex h-8 items-center justify-center rounded-md border text-[10px] font-bold uppercase tracking-wider px-3 transition-all ${
                             isBanned 
                               ? 'border-input bg-background hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
                               : 'border-input bg-background hover:bg-red-500 hover:text-white hover:border-red-500'
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
