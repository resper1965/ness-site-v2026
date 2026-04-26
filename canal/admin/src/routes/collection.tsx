import { useState, useEffect, useCallback } from "react";
import {
  fetchCollection,
  fetchEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleEntryStatus,
  toggleEntryFeatured,
  forwardForm,
  type CollectionDef,
  type FieldDef,
  type EntryMeta,
} from "../lib/api";
import AIWriterModal from "../components/AIWriterModal";

const LOCALES = ["pt", "en", "es"];

import { getTableFields } from "../components/collection/getTableFields";
import { FieldInput } from "../components/collection/FieldInput";

export default function CollectionPage({ slug }: { slug: string }) {
  const [collection, setCollection] = useState<CollectionDef | null>(null);
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [meta, setMeta] = useState<EntryMeta | null>(null);
  const [locale, setLocale] = useState("pt");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [aiWriterField, setAiWriterField] = useState<FieldDef | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);

  // Load collection definition
  useEffect(() => {
    fetchCollection(slug).then((col) => {
      setCollection(col ?? null);
    });
  }, [slug]);

  // Load entries
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchEntries(slug, { locale, page });
      setItems(res.data ?? []);
      setMeta(res.meta);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }, [slug, locale, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset page on slug/locale change
  useEffect(() => {
    setPage(1);
  }, [slug, locale]);

  function openCreate() {
    const defaults: Record<string, unknown> = {};
    collection?.fields.forEach((f) => {
      if (f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
    });
    if (collection?.has_locale) defaults.locale = locale;
    if (collection?.has_status) defaults.status = "draft";
    setForm(defaults);
    setEditing(null);
    setModal("create");
  }

  function openEdit(item: Record<string, unknown>) {
    setEditing(item);
    setForm({ ...item });
    setModal("edit");
  }

  function closeModal() {
    setModal(null);
    setEditing(null);
    setForm({});
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (modal === "create") {
        await createEntry(slug, form);
      } else if (editing) {
        await updateEntry(slug, editing.id as string, form);
      }
      closeModal();
      await load();
    } catch (err) {
      console.error("Save failed:", err);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este item permanentemente?")) return;
    await deleteEntry(slug, id);
    await load();
  }

  async function handleToggleStatus(item: Record<string, unknown>) {
    const id = item.id as string;
    const next = item.status === "published" ? "draft" : "published";
    setTogglingId(id);
    try {
      await toggleEntryStatus(slug, id, next);
      await load();
    } finally {
      setTogglingId(null);
    }
  }

  async function handleToggleFeatured(item: Record<string, unknown>) {
    const id = item.id as string;
    const next = !item.featured;
    setTogglingFeaturedId(id);
    try {
      await toggleEntryFeatured(slug, id, next);
      await load();
    } finally {
      setTogglingFeaturedId(null);
    }
  }

  if (!collection) {
    return (
      <div className="empty-state">
        <p>Collection "{slug}" não encontrada.</p>
      </div>
    );
  }

  const tableFields = getTableFields(collection.fields).filter(f => f.name !== 'featured');
  const hasFeatured = collection.fields.some(f => f.name === 'featured');

  return (
    <>
      {/* Toolbar */}
      <div className="collection-toolbar">
        <div className="toolbar-left">
          {collection.has_locale ? (
            <div className="locale-tabs">
              {LOCALES.map((l) => (
                <button
                  key={l}
                  className={`locale-tab ${l === locale ? "active" : ""}`}
                  onClick={() => setLocale(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          ) : null}
          {meta && (
            <span className="toolbar-count">
              {meta.total} {meta.total === 1 ? "item" : "itens"}
            </span>
          )}
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Novo {collection.label}
        </button>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="empty-state"><div className="loader-inline" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p>Nenhum {collection.label.toLowerCase()} cadastrado.</p>
            <button className="btn btn-ghost btn-sm" onClick={openCreate}>
              Criar primeiro
            </button>
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {tableFields.map((f) => (
                      <th key={f.name}>{f.label ?? f.name}</th>
                    ))}
                    {hasFeatured ? <th>Destaque</th> : null}
                    {collection.has_status ? <th>Status</th> : null}
                    <th>Data</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id as string}>
                      {tableFields.map((f) => (
                        <td key={f.name} style={f.name === "title" || f.name === "client" ? { fontWeight: 500 } : { color: "var(--text-dim)" }}>
                          {f.type === "boolean"
                            ? item[f.name] ? "✓" : "—"
                            : String(item[f.name] ?? "—")}
                        </td>
                      ))}
                      {hasFeatured ? (
                        <td>
                          <button
                            onClick={() => handleToggleFeatured(item)}
                            disabled={togglingFeaturedId === (item.id as string)}
                            title={item.featured ? "Remover destaque" : "Destacar"}
                            style={{
                              appearance: "none",
                              border: `1px solid ${item.featured ? "var(--primary)" : "var(--border)"}`,
                              borderRadius: 4,
                              padding: "0.2rem 0.5rem",
                              fontSize: 10,
                              fontWeight: 600,
                              cursor: togglingFeaturedId === (item.id as string) ? "wait" : "pointer",
                              background: item.featured ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent",
                              color: item.featured ? "var(--primary)" : "var(--text-dim)",
                              transition: "all 0.15s",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {togglingFeaturedId === (item.id as string) ? "…" : item.featured ? "★ Destacado" : "☆ Fixar"}
                          </button>
                        </td>
                      ) : null}
                      {collection.has_status ? (
                        <td>
                          <button
                            onClick={() => handleToggleStatus(item)}
                            disabled={togglingId === (item.id as string)}
                            title={item.status === "published" ? "Clique para despublicar" : "Clique para publicar"}
                            style={{
                              appearance: "none",
                              border: `1.5px solid ${item.status === "published" ? "var(--success, #22c55e)" : "var(--border)"}`,
                              borderRadius: 20,
                              padding: "0.2rem 0.65rem",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: togglingId === (item.id as string) ? "wait" : "pointer",
                              background: item.status === "published"
                                ? "color-mix(in srgb, #22c55e 12%, transparent)"
                                : "transparent",
                              color: item.status === "published" ? "#4ade80" : "var(--text-dim)",
                              letterSpacing: "0.02em",
                              transition: "all 0.15s",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {togglingId === (item.id as string)
                              ? "…"
                              : item.status === "published"
                              ? "✓ Publicado"
                              : "◯ Rascunho"}
                          </button>
                        </td>
                      ) : null}
                      <td style={{ color: "var(--text-muted)", fontFamily: "var(--mono)", fontSize: 12 }}>
                        {((item.createdAt ?? item.publishedAt ?? "") as string).slice(0, 10)}
                      </td>
                      <td>
                        <div className="action-row" style={{ marginTop: 0 }}>
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(item)}>Editar</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id as string)}>Remover</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {meta && meta.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  ← Anterior
                </button>
                <span className="page-info">
                  {page} / {meta.totalPages}
                </span>
                <button
                  className="btn btn-ghost btn-sm"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de criação/edição */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal modal-lg">
            <h2>{modal === "create" ? `Novo ${collection.label}` : `Editar ${collection.label}`}</h2>

            <div className="form">
              {/* Locale + Status */}
              <div className="form-row-2">
                {collection.has_locale ? (
                  <div className="field">
                    <label htmlFor="entry-locale">Idioma</label>
                    <select
                      id="entry-locale"
                      value={(form.locale as string) ?? locale}
                      onChange={(e) => setForm({ ...form, locale: e.target.value })}
                    >
                      {LOCALES.map((l) => (
                        <option key={l} value={l}>{l.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                ) : null}
                {collection.has_status ? (
                  <div className="field">
                    <label htmlFor="entry-status">Status</label>
                    <select
                      id="entry-status"
                      value={(form.status as string) ?? "draft"}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="draft">Rascunho</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>
                ) : null}
              </div>

              {/* Slug */}
              {collection.has_slug ? (
                <div className="field">
                  <label htmlFor="entry-slug">Slug</label>
                  <input
                    id="entry-slug"
                    value={(form.slug as string) ?? ""}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="url-amigavel"
                    style={{ fontFamily: "var(--mono)", fontSize: 13 }}
                  />
                </div>
              ) : null}

              {/* Collection fields */}
              {collection.fields.map((field) => (
                <FieldInput
                  key={field.name}
                  field={field}
                  value={form[field.name]}
                  onChange={(v) => setForm({ ...form, [field.name]: v })}
                  collection={slug}
                  locale={(form.locale as string) ?? locale}
                  onAIWrite={(f) => setAiWriterField(f)}
                />
              ))}

              <div className="action-row">
                <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? "Salvando…" : modal === "create" ? `Criar ${collection.label}` : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Writer Modal */}
      {aiWriterField && (
        <AIWriterModal
          field={aiWriterField.name}
          fieldLabel={aiWriterField.label ?? aiWriterField.name}
          collection={slug}
          locale={(form.locale as string) ?? locale}
          onApply={(text) => setForm({ ...form, [aiWriterField.name]: text })}
          onClose={() => setAiWriterField(null)}
        />
      )}
    </>
  );
}
