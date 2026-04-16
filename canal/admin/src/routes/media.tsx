import { useState, useEffect, useRef } from "react";
import { fetchMedia, uploadMedia, deleteMedia, type EntryMeta } from "../lib/api";

type MediaItem = {
  id: string;
  key: string;
  filename: string;
  content_type: string;
  size: number;
  url: string;
  uploaded_at: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [meta, setMeta] = useState<EntryMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchMedia({ page });
      setItems((res.data ?? []) as MediaItem[]);
      setMeta(res.meta);
    } catch {
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [page]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      await uploadMedia(file);
    }
    setUploading(false);
    await load();
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Remover "${item.filename}"?`)) return;
    await deleteMedia(item.id);
    await load();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
  }

  return (
    <>
      {/* Upload zone */}
      <div
        className={`upload-zone ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*,application/pdf"
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files)}
        />
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        {uploading ? (
          <p>Enviando…</p>
        ) : (
          <p>Arraste arquivos aqui ou <strong>clique para enviar</strong></p>
        )}
      </div>

      {/* Gallery */}
      <div className="card" style={{ marginTop: 20 }}>
        {loading ? (
          <div className="empty-state"><div className="loader-inline" /></div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <p>Nenhum arquivo enviado ainda.</p>
          </div>
        ) : (
          <>
            <div className="media-grid">
              {items.map((item) => (
                <div key={item.id} className="media-card">
                  <div className="media-preview">
                    {item.content_type?.startsWith("image/") ? (
                      <img src={item.url} alt={item.filename} loading="lazy" />
                    ) : (
                      <div className="media-file-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="media-info">
                    <span className="media-name truncate">{item.filename}</span>
                    <span className="media-size">{formatSize(item.size)}</span>
                  </div>
                  <div className="media-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => copyUrl(item.url)} title="Copiar URL">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="pagination">
                <button className="btn btn-ghost btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                  ← Anterior
                </button>
                <span className="page-info">{page} / {meta.totalPages}</span>
                <button className="btn btn-ghost btn-sm" disabled={page >= meta.totalPages} onClick={() => setPage(page + 1)}>
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
