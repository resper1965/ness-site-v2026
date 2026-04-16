import { useState, useEffect } from "react";

type Chat = { id: number; session_id: string; messages: string; created_at: string; updated_at: string };

export default function ChatsPage() {
  const [items, setItems] = useState<Chat[]>([]);

  useEffect(() => {
    fetch("/api/admin/chats", { credentials: "include" })
      .then((r) => r.json() as Promise<Chat[]>)
      .then((data) => setItems(Array.isArray(data) ? data : []));
  }, []);

  return (
    <>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Sessão</th><th>Qtd Msgs</th><th>Última Interação</th><th>Logs</th></tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ color: "var(--text-muted)", textAlign: "center" }}>Nenhuma sessão de chat registrada.</td></tr>
              )}
              {items.map((item) => {
                let msgs = [];
                try {
                  msgs = JSON.parse(item.messages);
                } catch {
                  // ignorar
                }
                return (
                  <tr key={item.id}>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>#{item.id}</td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{item.session_id.split('-')[0]}...</td>
                    <td><span className="badge badge-new">{msgs.length}</span></td>
                    <td style={{ color: "var(--text-muted)" }}>{item.updated_at?.slice(0, 16)}</td>
                    <td>
                      <details>
                        <summary style={{ cursor: "pointer", color: "var(--accent)", fontSize: 12 }}>ler conversa</summary>
                        <div style={{ marginTop: 8, background: "var(--surface-3)", padding: 12, borderRadius: 8, display: "flex", flexDirection: "column", gap: 8, maxHeight: 400, overflowY: "auto" }}>
                          {msgs.map((m: any, i: number) => (
                            <div key={i} style={{ padding: 8, borderRadius: 6, background: m.role === 'user' ? "var(--surface-2)" : "var(--accent-soft)", alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                              <strong style={{ display: "block", fontSize: 10, color: m.role === 'user' ? "var(--text-muted)" : "var(--accent)", marginBottom: 4 }}>{m.role.toUpperCase()}</strong>
                              <span style={{ fontSize: 12, color: "var(--text)", whiteSpace: "pre-wrap" }}>{m.content}</span>
                            </div>
                          ))}
                        </div>
                      </details>
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
