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
    return <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><div className="loader-inline" /></div>;
  }

  return (
    <>
      <div className="collection-toolbar" style={{ marginBottom: 16 }}>
        <div className="toolbar-left">
          <span className="toolbar-count">{items.length} {items.length === 1 ? "submissão" : "submissões"}</span>
        </div>
        {activeOrg && <span className="badge badge-new" style={{ fontSize: 10 }}>{activeOrg.slug}</span>}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Origem</th><th>Status</th><th>Data</th><th>Dados</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ color: "var(--text-muted)", textAlign: "center", padding: "32px 16px" }}>Nenhum formulário recebido.</td></tr>
              )}
              {items.map((item) => {
                let parsed: any = {};
                try { parsed = typeof item.payload === 'string' ? JSON.parse(item.payload) : item.payload; } catch { /* */ }
                return (
                  <tr key={item.id}>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>#{item.id}</td>
                    <td><span className="badge badge-new">{item.source}</span></td>
                    <td>
                      <span className={`badge ${item.status === "new" ? "badge-new" : "badge-read"}`}>
                        {item.status === "new" ? "Novo" : "Lido"}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>{item.created_at?.slice(0, 16)}</td>
                    <td>
                      <details>
                        <summary style={{ cursor: "pointer", color: "var(--accent)", fontSize: 12 }}>ver dados</summary>
                        <div style={{ marginTop: 8, background: "var(--surface-2)", padding: 12, borderRadius: 8, fontSize: 12, fontFamily: "var(--mono)" }}>
                          {parsed.name && <div><strong>Nome:</strong> {parsed.name}</div>}
                          {parsed.email && <div><strong>Email:</strong> {parsed.email}</div>}
                          {parsed.phone && <div><strong>Fone:</strong> {parsed.phone}</div>}
                          {parsed.company && <div><strong>Empresa:</strong> {parsed.company}</div>}
                          {parsed.subject && <div><strong>Assunto:</strong> {parsed.subject}</div>}
                          {parsed.message && <div style={{ marginTop: 6, whiteSpace: "pre-wrap", color: "var(--text-muted)" }}>{parsed.message}</div>}
                        </div>
                      </details>
                    </td>
                    <td>
                      <div className="action-row" style={{ marginTop: 0 }}>
                        {item.status === "new" && (
                          <button className="btn btn-ghost btn-sm" onClick={() => handleMarkRead(item.id)}>
                            Marcar Lido
                          </button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>X</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
