import { useState, useEffect } from "react";

type Job = { id: number; title: string; location: string; lang: string };

export default function JobsPage() {
  const [items, setItems] = useState<Job[]>([]);
  const [form, setForm] = useState({ title: "", description: "", location: "", lang: "pt" });
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/jobs?lang=pt");
    const data = await res.json() as Job[];
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", location: "", lang: "pt" });
    await load();
    setLoading(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Remover esta vaga?")) return;
    await fetch(`/api/admin/jobs/${id}`, { method: "DELETE", credentials: "include" });
    await load();
  }

  return (
    <>
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16, fontSize: 15, fontWeight: 600 }}>Nova Vaga</h3>
        <form className="form" onSubmit={handleCreate}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="field">
              <label>Título</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="field">
              <label>Localização</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="São Paulo / Remoto" required />
            </div>
          </div>
          <div className="field">
            <label>Descrição</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="action-row">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Salvando…" : "Publicar Vaga"}
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Título</th><th>Localização</th><th>Lang</th><th></th></tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={4} style={{ color: "var(--text-muted)", textAlign: "center" }}>Nenhuma vaga cadastrada.</td></tr>
              )}
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.location}</td>
                  <td>{item.lang}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => handleDelete(item.id)}>Remover</button>
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
