import React, { useEffect, useState } from "react";
import { authClient, admin } from "../lib/auth-client";

export default function UsersPage() {
  const { data: session } = authClient.useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const SUPER_ADMIN_EMAILS = ["resper@bekaa.eu", "admin@ness.com.br"];
  const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(session?.user?.email || "");

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
    if (!confirm(`Deseja realmente ${isBanned ? 'desbanir' : 'banir'} este usuário?`)) return;
    
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
      <div className="empty-state" style={{ minHeight: 400 }}>
        <h3>Sem Permissão</h3>
        <p>{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <header className="page-header">
        <h1>Gestão de Usuários (Global)</h1>
      </header>

      {errorMsg && <div className="error-msg" style={{ marginBottom: 16 }}>{errorMsg}</div>}

      <div className="card">
        <div className="card-header">
          <span className="card-title">Usuários da Plataforma ({users.length})</span>
        </div>
        
        {loading ? (
          <div className="loader" style={{ margin: "32px auto" }} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => {
                  const isBanned = u.banned;
                  return (
                    <tr key={u.id}>
                      <td>{u.name || "—"}</td>
                      <td className="mono" style={{ fontSize: 13 }}>{u.email}</td>
                      <td>
                        <select
                          className="role-select"
                          value={u.role || "user"}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as "user" | "admin")}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        {isBanned ? (
                          <span className="badge badge-danger" style={{ background: "var(--danger)", color: "#fff" }}>Banido</span>
                        ) : (
                          <span className="badge badge-read">Ativo</span>
                        )}
                      </td>
                      <td>
                        <button
                          className={`btn btn-sm ${isBanned ? 'btn-secondary' : 'btn-ghost'}`}
                          onClick={() => handleBan(u.id, isBanned)}
                          style={{ color: isBanned ? "inherit" : "var(--danger)", padding: "4px 8px", fontSize: 12 }}
                        >
                          {isBanned ? "Desbanir" : "Banir"}
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
