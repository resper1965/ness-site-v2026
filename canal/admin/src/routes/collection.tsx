import { useState, useEffect, useCallback } from "react";
import {
  fetchCollection,
  fetchEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleEntryStatus,
  type CollectionDef,
  type FieldDef,
  type EntryMeta,
} from "../lib/api";
import AIWriterModal from "../components/AIWriterModal";

const LOCALES = ["pt", "en", "es"];

/** Renderiza um campo de formulário baseado no FieldDef */
function FieldInput({
  field,
  value,
  onChange,
  collection,
  locale,
  onAIWrite,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  collection?: string;
  locale?: string;
  onAIWrite?: (field: FieldDef) => void;
}) {
  const id = `field-${field.name}`;
  const isTextual = ["text", "textarea", "richtext"].includes(field.type);

  const AIButton = onAIWrite && isTextual ? (
    <button
      type="button"
      onClick={() => onAIWrite(field)}
      title="Gerar com IA"
      style={{
        background: "linear-gradient(135deg, var(--primary) 0%, #0099ff 100%)",
        border: "none",
        borderRadius: 6,
        color: "#fff",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 600,
        padding: "0.2rem 0.55rem",
        letterSpacing: "0.01em",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
    >
      ✦ IA
    </button>
  ) : null;

  switch (field.type) {
    case "textarea":
    case "richtext":
      return (
        <div className="field">
          <label htmlFor={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              {field.label ?? field.name}
              {field.type === "richtext" && <span style={{ fontSize: 10, color: 'var(--primary)', opacity: 0.8, marginLeft: 6 }}>Markdown / HTML</span>}
            </span>
            {AIButton}
          </label>
          <textarea
            id={id}
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            rows={field.type === "richtext" ? 12 : 3}
            style={field.type === "richtext" ? { fontFamily: "var(--mono)", fontSize: 13, lineHeight: 1.6, padding: '1rem' } : undefined}
          />
        </div>
      );

    case "image":
      return (
        <div className="field">
          <label htmlFor={id}>{field.label ?? field.name} (URL da Imagem)</label>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {value ? (
               <img src={value as string} alt="Preview" style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }} />
            ) : (
               <div style={{ width: 64, height: 64, borderRadius: 8, border: '1px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: 10, textAlign: 'center', lineHeight: 1.2 }}>Sem<br/>Capa</div>
            )}
            <input
              id={id}
              type="text"
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              required={field.required}
              placeholder="https://... ou Path do Hub (/media)"
              style={{ flex: 1 }}
            />
          </div>
        </div>
      );

    case "select":
      return (
        <div className="field">
          <label htmlFor={id}>{field.label ?? field.name}</label>
          <select id={id} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">— selecione —</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );

    case "boolean":
      return (
        <div className="field field-check">
          <label className="check-label">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span>{field.label ?? field.name}</span>
          </label>
        </div>
      );

    case "date":
      return (
        <div className="field">
          <label htmlFor={id}>{field.label ?? field.name}</label>
          <input
            id={id}
            type="date"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        </div>
      );

    case "number":
      return (
        <div className="field">
          <label htmlFor={id}>{field.label ?? field.name}</label>
          <input
            id={id}
            type="number"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(Number(e.target.value))}
            required={field.required}
          />
        </div>
      );

    case "json":
      return (
        <div className="field">
          <label htmlFor={id}>{field.label ?? field.name}</label>
          <textarea
            id={id}
            value={typeof value === "string" ? value : JSON.stringify(value ?? [], null, 2)}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            style={{ fontFamily: "var(--mono)", fontSize: 12 }}
          />
        </div>
      );

    default:
      return (
        <div className="field">
          <label htmlFor={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{field.label ?? field.name}</span>
            {AIButton}
          </label>
          <input
            id={id}
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={field.label ?? field.name}
          />
        </div>
      );
  }
}

/** Colunas visíveis na tabela (max 4 + status + ações) */
function getTableFields(fields: FieldDef[]): FieldDef[] {
  if (!fields) return [];
  const priority = ["title", "client", "name", "slug", "tag", "category", "location", "date"];
  const sorted = [...fields].sort((a, b) => {
    const ai = priority.indexOf(a.name);
    const bi = priority.indexOf(b.name);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
  return sorted.slice(0, 4);
}

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

  if (!collection) {
    return (
      <div className="empty-state">
        <p>Collection "{slug}" não encontrada.</p>
      </div>
    );
  }

  const tableFields = getTableFields(collection.fields);

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
