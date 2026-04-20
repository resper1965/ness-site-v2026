import React, { useEffect, useState } from "react";
import { authClient } from "../lib/auth-client";

export default function OrganizationsPage() {
  const { data: session } = authClient.useSession();
  const [organizations, setOrgs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const SUPER_ADMIN_EMAILS = ["resper@bekaa.eu", "admin@ness.com.br"];
  const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(session?.user?.email || "");

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
      const res = await fetch("/api/admin/organizations", { credentials: "omit", headers: {
        'x-tenant-id': '', // ignore tenant for global lookups? No need.
        'Authorization': `Bearer ` // we rely on the session cookie that BetterAuth sets, but if using headers...
        // Actually, BetterAuth uses fetch internally. Using credentials: "include" works if same origin.
        // Wait, the client config is set to baseURL: window.location.origin + '/api/auth', but our endpoints are simply /api/admin/...
      }});
      // Let's rewrite fetch call properly:
      const req = await authClient.$fetch("/api/admin/organizations", {
        baseURL: window.location.origin
      });
      if (req.error) {
        setErrorMsg((req.error as { message?: string }).message ?? "Erro ao carregar organizações.");
      } else {
        setOrgs((req.data as any) || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro de conexão ao buscar organizações");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePlan = async (org: any, plan: string) => {
    if (!confirm(`Mudar o plano da organização ${org.name} para ${plan.toUpperCase()}?`)) return;
    const metadata = { ...(typeof org.metadata === 'string' ? JSON.parse(org.metadata || "{}") : org.metadata), plan };
    try {
      const req = await authClient.$fetch(`/api/admin/organizations/${org.id}`, {
        method: "PATCH",
        baseURL: window.location.origin,
        body: { metadata }
      });
      if ((req.data as any)?.success) {
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
      if ((req.data as any)?.success) {
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
      <div className="empty-state" style={{ minHeight: 400 }}>
        <h3>Sem Permissão</h3>
        <p>{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <header className="page-header">
        <h1>Gestão de SaaS (Acesso Global)</h1>
      </header>

      {errorMsg && <div className="error-msg" style={{ marginBottom: 16 }}>{errorMsg}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title">Tenants Configurados ({organizations.length})</span>
        </div>
        
        {loading ? (
          <div className="loader" style={{ margin: "32px auto" }} />
        ) : (
           <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome do Tenant</th>
                  <th>Slug</th>
                  <th>Plano (Global)</th>
                  <th>Membros</th>
                  <th>Ações Danger</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((o: any) => {
                  let meta = o.metadata || {};
                  if (typeof meta === "string") {
                    try { meta = JSON.parse(meta); } catch(e){}
                  }
                  
                  return (
                    <tr key={o.id}>
                      <td><strong>{o.name}</strong></td>
                      <td className="mono" style={{ fontSize: 13 }}>{o.slug}</td>
                      <td>
                        <select
                          className="role-select"
                          value={meta.plan || "free"}
                          onChange={(e) => handleUpdatePlan(o, e.target.value)}
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </td>
                      <td>{o.memberCount || 0}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-ghost"
                          onClick={() => handleDelete(o.id, o.name)}
                          style={{ color: "var(--danger)" }}
                        >
                          Deletar
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
