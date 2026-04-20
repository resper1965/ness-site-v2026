import { useState, useEffect } from "react";
import { fetchEntries, deleteEntry, toggleEntryStatus, forwardForm } from "../lib/api";
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

  async function handleDelete(id: string) {
    if (!confirm("Remover este formulário permanentemente?")) return;
    await deleteEntry("forms", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleToggleStatus(item: Form) {
    const next = item.status === "new" ? "read" : "new";
    await toggleEntryStatus("forms", item.id, next as 'published'|'draft');
    // Hack: 'new' and 'read' instead of standard published/draft
    // Wait, the toggleEntryStatus function hardcodes type to 'published'|'draft'.
    // We can cast in the UI or let the backend take whatever string if we updated it,
    // but the API type is just string. Let's force it.
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: next } : i)));
  }

  async function handleForward(item: Form) {
    const email = prompt("Encaminhar para qual e-mail?");
    if (!email) return;

    try {
      const res = await forwardForm(item.id, [email]);
      if (res.error) alert(`Erro: ${res.error}`);
      else alert("E-mail enviado com sucesso!");
    } catch (e) {
      alert("Falha ao encaminhar erro de rede.");
    }
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
              <tr><th>ID</th><th>Origem</th><th>Status</th><th>Data</th><th>Payload</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={6} style={{ color: "var(--text-muted)", textAlign: "center", padding: "32px 16px" }}>Nenhum formulário recebido neste tenant.</td></tr>
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
                      <pre style={{ fontFamily: "var(--mono)", fontSize: 11, marginTop: 8, whiteSpace: "pre-wrap", color: "var(--text-muted)", maxHeight: 150, overflowY: "auto" }}>
                        {JSON.stringify(item.payload, null, 2)}
                      </pre>
                    </details>
                  </td>
                  <td>
                    <div className="action-row" style={{ marginTop: 0 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleToggleStatus(item)}>
                        {item.status === "new" ? "Lido" : "Não Lido"}
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleForward(item)} title="Encaminhar por E-mail">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>X</button>
                    </div>
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
