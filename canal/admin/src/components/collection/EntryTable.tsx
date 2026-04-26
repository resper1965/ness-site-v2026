import type { CollectionDef, EntryMeta } from "../../lib/api";
import { getTableFields } from "./getTableFields";

interface EntryTableProps {
  collection: CollectionDef;
  items: Record<string, unknown>[];
  meta: EntryMeta | null;
  loading: boolean;
  page: number;
  togglingId: string | null;
  togglingFeaturedId: string | null;
  onPageChange: (p: number) => void;
  onEdit: (item: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (item: Record<string, unknown>) => void;
  onToggleFeatured: (item: Record<string, unknown>) => void;
  onCreateFirst: () => void;
}

export function EntryTable({
  collection,
  items,
  meta,
  loading,
  page,
  togglingId,
  togglingFeaturedId,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
  onCreateFirst,
}: EntryTableProps) {
  const tableFields = getTableFields(collection.fields).filter(f => f.name !== 'featured');
  const hasFeatured = collection.fields.some(f => f.name === 'featured');

  if (loading) {
    return <div className="empty-state"><div className="loader-inline" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <p>Nenhum {collection.label.toLowerCase()} cadastrado.</p>
        <button className="btn btn-ghost btn-sm" onClick={onCreateFirst}>
          Criar primeiro
        </button>
      </div>
    );
  }

  return (
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
                      onClick={() => onToggleFeatured(item)}
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
                      onClick={() => onToggleStatus(item)}
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
                    <button className="btn btn-ghost btn-sm" onClick={() => onEdit(item)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(item.id as string)}>Remover</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="pagination">
          <button
            className="btn btn-ghost btn-sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            ← Anterior
          </button>
          <span className="page-info">
            {page} / {meta.totalPages}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            disabled={page >= meta.totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            Próxima →
          </button>
        </div>
      )}
    </>
  );
}
