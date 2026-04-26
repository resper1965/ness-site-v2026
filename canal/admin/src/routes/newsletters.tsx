import { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";

type Subscriber = { id: number; email: string; created_at: string };

type Draft = {
  subject: string;
  preheader: string;
  audience: string;
  body: string;
};

const EMPTY_DRAFT: Draft = { subject: "", preheader: "", audience: "todos", body: "" };

const AUDIENCES = ["todos", "clientes", "prospects", "parceiros", "interno"];

export default function NewslettersPage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [draft, setDraft] = useState<Draft>({ ...EMPTY_DRAFT });
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ subject: string; count: number; date: string }[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [tab, setTab] = useState<"compose" | "subscribers">("compose");

  useEffect(() => {
    fetch("/api/admin/newsletter-subscribers", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setSubscribers(Array.isArray(data) ? data : []))
      .catch(() => setSubscribers([]));
  }, []);

  const handleSend = async () => {
    if (!draft.subject || !draft.body) {
      alert("Preencha o assunto e o corpo do e-mail.");
      return;
    }
    if (subscribers.length === 0) {
      alert("Nenhum assinante cadastrado. Adicione pelo menos um.");
      return;
    }
    if (!confirm(`Enviar "${draft.subject}" para ${subscribers.length} assinante(s)?`)) return;
    
    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletters/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(draft),
      });
      const result = await res.json() as { success?: boolean; sent?: number; error?: string };
      if (result.success) {
        setSent((prev) => [
          { subject: draft.subject, count: result.sent || subscribers.length, date: new Date().toLocaleString("pt-BR") },
          ...prev,
        ]);
        setDraft({ ...EMPTY_DRAFT });
        alert(`Newsletter enviada com sucesso para ${result.sent || subscribers.length} destinatário(s)!`);
      } else {
        alert(`Erro: ${result.error || "Falha no envio"}`);
      }
    } catch {
      alert("Erro de rede ao enviar.");
    } finally {
      setSending(false);
    }
  };

  const handleAddSubscriber = async () => {
    if (!newEmail || !newEmail.includes("@")) return;
    try {
      const res = await fetch("/api/admin/newsletter-subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: newEmail }),
      });
      const result = await res.json() as { success?: boolean; id?: number };
      if (result.success) {
        setSubscribers((prev) => [{ id: result.id || Date.now(), email: newEmail, created_at: new Date().toISOString() }, ...prev]);
        setNewEmail("");
      }
    } catch { /* */ }
  };

  const handleRemoveSubscriber = async (id: number) => {
    if (!confirm("Remover este assinante?")) return;
    await fetch(`/api/admin/newsletter-subscribers/${id}`, { method: "DELETE", credentials: "include" });
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  const renderEmailPreview = () => {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:8px;overflow:hidden;">
        <div style="background:#0A0A0A;padding:32px 40px;">
          <span style="font-family:Montserrat,sans-serif;font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.5px;">ness<span style="color:#00ADE8;">.</span></span>
        </div>
        <div style="padding:40px;">
          <h1 style="font-size:22px;color:#111;margin:0 0 8px;">${draft.subject || "Assunto do e-mail"}</h1>
          <p style="font-size:13px;color:#888;margin:0 0 24px;">${draft.preheader || ""}</p>
          <div style="font-size:14px;line-height:1.8;color:#333;white-space:pre-wrap;">${draft.body || "Corpo do e-mail..."}</div>
        </div>
        <div style="background:#F8F9FA;padding:20px 40px;border-top:1px solid #eee;">
          <p style="font-size:11px;color:#999;margin:0;">ness. · canal.ness.com.br · Você recebeu porque se inscreveu em nossa newsletter.</p>
        </div>
      </div>
    `;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          className={`btn btn-sm ${tab === "compose" ? "" : "btn-ghost"}`}
          style={tab === "compose" ? { background: "var(--accent)", color: "#fff" } : {}}
          onClick={() => setTab("compose")}
        >
          Compor Newsletter
        </button>
        <button
          className={`btn btn-sm ${tab === "subscribers" ? "" : "btn-ghost"}`}
          style={tab === "subscribers" ? { background: "var(--accent)", color: "#fff" } : {}}
          onClick={() => setTab("subscribers")}
        >
          Assinantes ({subscribers.length})
        </button>
      </div>

      {tab === "compose" && (
        <>
          {/* Compose */}
          <div className="card" style={{ padding: 24 }}>
            <div className="card-header" style={{ padding: 0, marginBottom: 20, border: "none" }}>
              <span className="card-title">Nova Newsletter</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Assunto</label>
                  <input
                    type="text"
                    value={draft.subject}
                    onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                    placeholder="Ex: Novidades de Abril — ness."
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface-2)", color: "var(--text)", fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Audiência</label>
                  <select
                    value={draft.audience}
                    onChange={(e) => setDraft({ ...draft, audience: e.target.value })}
                    className="role-select"
                    style={{ width: "100%" }}
                  >
                    {AUDIENCES.map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Pré-header (texto de preview na caixa de entrada)</label>
                <input
                  type="text"
                  value={draft.preheader}
                  onChange={(e) => setDraft({ ...draft, preheader: e.target.value })}
                  placeholder="Resumo curto que aparece no preview do e-mail"
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface-2)", color: "var(--text)", fontSize: 13 }}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Corpo do E-mail</label>
                <textarea
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  rows={10}
                  placeholder="Escreva o conteúdo da newsletter aqui..."
                  style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface-2)", color: "var(--text)", fontSize: 13, lineHeight: 1.7, resize: "vertical" }}
                />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn" style={{ background: "var(--accent)", color: "#fff" }} onClick={handleSend} disabled={sending}>
                  {sending ? "Enviando..." : `Enviar para ${subscribers.length} assinante(s)`}
                </button>
                <button className="btn btn-ghost" onClick={() => setShowPreview((v) => !v)}>
                  {showPreview ? "Fechar Preview" : "Preview"}
                </button>
              </div>
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="card" style={{ padding: 24 }}>
              <div className="card-header" style={{ padding: 0, marginBottom: 16, border: "none" }}>
                <span className="card-title">Preview do E-mail</span>
              </div>
              <div
                style={{ background: "#F0F0F0", padding: 32, borderRadius: 8 }}
                dangerouslySetInnerHTML={{ __html: renderEmailPreview() }}
              />
            </div>
          )}

          {/* History */}
          {sent.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <div className="card-header" style={{ padding: 0, marginBottom: 16, border: "none" }}>
                <span className="card-title">Enviados nesta sessão</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Assunto</th><th>Destinatários</th><th>Data</th></tr></thead>
                  <tbody>
                    {sent.map((s, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{s.subject}</td>
                        <td><span className="badge badge-new">{s.count}</span></td>
                        <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {tab === "subscribers" && (
        <div className="card" style={{ padding: 24 }}>
          <div className="card-header" style={{ padding: 0, marginBottom: 20, border: "none" }}>
            <span className="card-title">Assinantes da Newsletter</span>
          </div>
          
          {/* Add subscriber */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="email@exemplo.com"
              onKeyDown={(e) => e.key === "Enter" && handleAddSubscriber()}
              style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--border)", borderRadius: 6, background: "var(--surface-2)", color: "var(--text)", fontSize: 13 }}
            />
            <button className="btn" style={{ background: "var(--accent)", color: "#fff" }} onClick={handleAddSubscriber}>
              + Adicionar
            </button>
          </div>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Email</th><th>Inscrito em</th><th></th></tr></thead>
              <tbody>
                {subscribers.length === 0 && (
                  <tr><td colSpan={3} style={{ textAlign: "center", color: "var(--text-muted)", padding: "24px 16px" }}>Nenhum assinante. Adicione acima ou capture via formulário do site.</td></tr>
                )}
                {subscribers.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{s.email}</td>
                    <td style={{ fontSize: 12, color: "var(--text-muted)" }}>{s.created_at?.slice(0, 10)}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemoveSubscriber(s.id)}>✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
