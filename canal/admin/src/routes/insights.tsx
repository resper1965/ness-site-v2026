import { useState, useEffect } from "react";

type Insight = { id: number; title: string; slug: string; lang: string; published_at: string };

export default function InsightsPage() {
  const [items, setItems] = useState<Insight[]>([]);
  const [form, setForm] = useState({ title: "", slug: "", content: "", lang: "pt" });
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/insights?lang=pt");
    const data = await res.json() as { items: Insight[] };
    setItems(data.items ?? []);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    setForm({ title: "", slug: "", content: "", lang: "pt" });
    await load();
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Remover este insight?")) return;
    await fetch(`/api/admin/insights/${id}`, { method: "DELETE", credentials: "include" });
    await load();
  }

  return (
    <>
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>Novo Insight</h3>
        <form className="form" onSubmit={handleCreate}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="field">
              <label>Título</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label>Slug</label>
              <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
            </div>
          </div>
          <div className="field">
            <label>Conteúdo</label>
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>
          <div className="action-row">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Salvando…" : "Publicar"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Título</th><th>Slug</th><th>Lang</th><th>Publicado</th><th></th></tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={5} style={{ color: "var(--text-muted)", textAlign: "center" }}>Nenhum insight ainda.</td></tr>
              )}
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>{item.slug}</td>
                  <td>{item.lang}</td>
                  <td style={{ color: "var(--text-muted)" }}>{item.published_at?.slice(0, 10)}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>
                      Remover
                    </button>
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
