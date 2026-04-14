import { useState, useEffect } from "react";

type Form = { id: number; source: string; payload: string; status: string; created_at: string };

export default function FormsPage() {
  const [items, setItems] = useState<Form[]>([]);

  useEffect(() => {
    fetch("/api/admin/forms", { credentials: "include" })
      .then((r) => r.json() as Promise<Form[]>)
      .then((data) => setItems(Array.isArray(data) ? data : []));
  }, []);

  return (
    <>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Origem</th><th>Status</th><th>Data</th><th>Payload</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ color: "var(--text-muted)", textAlign: "center" }}>Nenhum formulário recebido.</td></tr>
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
                  <td style={{ color: "var(--text-muted)" }}>{item.created_at?.slice(0, 16)}</td>
                  <td>
                    <details>
                      <summary style={{ cursor: "pointer", color: "var(--accent)", fontSize: 12 }}>ver dados</summary>
                      <pre style={{ fontFamily: "var(--mono)", fontSize: 11, marginTop: 8, whiteSpace: "pre-wrap", color: "var(--text-muted)" }}>
                        {JSON.stringify(JSON.parse(item.payload || "{}"), null, 2)}
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
