import { useState } from "react";

type Case = {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  url: string;
  status: "published" | "draft";
  createdAt: string;
};

const MOCK: Case[] = [
  {
    id: "1",
    title: "Redesign da Plataforma Cavan",
    client: "Cavan Infrastructure",
    category: "Web Design",
    description: "Migração completa para React Router v7 com admin panel integrado.",
    url: "https://cavan.com.br",
    status: "published",
    createdAt: "2026-03-10",
  },
];

const CATEGORIES = ["Web Design", "Branding", "SaaS", "E-commerce", "Mobile", "Consultoria"];

type Form = Partial<Omit<Case, "id" | "createdAt">>;

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>(MOCK);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Case | null>(null);
  const [form, setForm] = useState<Form>({});

  function openCreate() {
    setForm({ status: "draft" });
    setEditing(null);
    setModal("create");
  }

  function openEdit(c: Case) {
    setEditing(c);
    setForm(c);
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
    setForm({});
  }

  function handleSave() {
    if (modal === "create") {
      const newCase: Case = {
        id: Date.now().toString(),
        title: form.title ?? "",
        client: form.client ?? "",
        category: form.category ?? CATEGORIES[0],
        description: form.description ?? "",
        url: form.url ?? "",
        status: form.status ?? "draft",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setCases((prev) => [newCase, ...prev]);
    } else if (editing) {
      setCases((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...form } as Case : c)));
    }
    closeModal();
  }

  function handleDelete(id: string) {
    if (confirm("Remover este case?")) setCases((prev) => prev.filter((c) => c.id !== id));
  }

  const f = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span />
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Case
          </button>
        </div>

        {cases.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            <p>Nenhum case cadastrado ainda.</p>
            <button className="btn btn-ghost btn-sm" onClick={openCreate}>Adicionar primeiro case</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Cliente</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.title}</td>
                    <td style={{ color: "var(--text-dim)" }}>{c.client}</td>
                    <td style={{ color: "var(--text-dim)" }}>{c.category}</td>
                    <td>
                      <span className={`badge ${c.status === "published" ? "badge-read" : "badge-pending"}`}>
                        {c.status === "published" ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontFamily: "var(--mono)", fontSize: 12 }}>{c.createdAt}</td>
                    <td>
                      <div className="action-row" style={{ marginTop: 0 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Remover</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal">
            <h2>{modal === "create" ? "Novo Case" : "Editar Case"}</h2>
            <div className="form">
              <div className="field">
                <label htmlFor="case-title">Título</label>
                <input id="case-title" value={form.title ?? ""} onChange={f("title")} placeholder="Nome do projeto" />
              </div>
              <div className="field">
                <label htmlFor="case-client">Cliente</label>
                <input id="case-client" value={form.client ?? ""} onChange={f("client")} placeholder="Nome do cliente" />
              </div>
              <div className="field">
                <label htmlFor="case-category">Categoria</label>
                <select id="case-category" value={form.category ?? CATEGORIES[0]} onChange={f("category")}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="case-url">URL do projeto</label>
                <input id="case-url" type="url" value={form.url ?? ""} onChange={f("url")} placeholder="https://exemplo.com" />
              </div>
              <div className="field">
                <label htmlFor="case-desc">Descrição</label>
                <textarea id="case-desc" value={form.description ?? ""} onChange={f("description")} placeholder="Descreva o projeto brevemente…" />
              </div>
              <div className="field">
                <label htmlFor="case-status">Status</label>
                <select id="case-status" value={form.status ?? "draft"} onChange={f("status")}>
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
              <div className="action-row">
                <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSave}>
                  {modal === "create" ? "Criar Case" : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
