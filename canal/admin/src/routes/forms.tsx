import { useState, useEffect } from "react";
import { fetchEntries } from "../lib/api";
import { authClient } from "../lib/auth-client";

type Form = { id: string; source: string; payload: any; status: string; createdAt: string };

export default function FormsPage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [items, setItems] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  // Refetch when org changes
  useEffect(() => {
    setLoading(true);
    fetchEntries("forms", { status: "all" }).then((res) => {
      setItems(res.data as unknown as Form[]);
      setLoading(false);
    }).catch(() => {
      setItems([]);
      setLoading(false);
    });
  }, [activeOrg?.id]);

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><div className="loader-inline" /></div>;
  }

  if (!activeOrg) {
    return (
      <div className="empty-state" style={{ minHeight: 300 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <p>Selecione uma organização para ver os formulários.</p>
      </div>
    );
  }

  return (
    <>
      <div className="collection-toolbar" style={{ marginBottom: 16 }}>
        <div className="toolbar-left">
          <span className="toolbar-count">{items.length} {items.length === 1 ? "submissão" : "submissões"}</span>
        </div>
        <span className="badge badge-new" style={{ fontSize: 10 }}>{activeOrg.slug}</span>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Origem</th><th>Status</th><th>Data</th><th>Payload</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ color: "var(--text-muted)", textAlign: "center", padding: "32px 16px" }}>Nenhum formulário recebido neste tenant.</td></tr>
              )}
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>#{item.id}</td>
                  <td>{item.source}</td>
                  <td>
                    <span className={`badge ${item.status === "new" ? "badge-new" : "badge-read"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)" }}>{item.createdAt?.slice(0, 16)}</td>
                  <td>
                    <details>
                      <summary style={{ cursor: "pointer", color: "var(--accent)", fontSize: 12 }}>ver dados</summary>
                      <pre style={{ fontFamily: "var(--mono)", fontSize: 11, marginTop: 8, whiteSpace: "pre-wrap", color: "var(--text-muted)" }}>
                        {JSON.stringify(item.payload, null, 2)}
                      </pre>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
