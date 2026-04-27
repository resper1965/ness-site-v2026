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
    if (!confirm(`Erradicar permanente o arquivo "${item.filename}"?`)) return;
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

  const isImage = (type: string) => type?.startsWith("image/");

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            Repositório Ativo <span className="text-muted-foreground font-light">::</span> Cloud Media
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Armazenamento R2 S3 Backend-Agnostic
          </p>
        </div>
      </div>

      <div
        className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-12 transition-all cursor-pointer shadow-sm relative overflow-hidden ${
           dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/50 bg-card hover:bg-muted/30"
        }`}
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
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center justify-center gap-4 text-primary animate-pulse">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span className="font-bold uppercase tracking-wider text-sm">Transferindo pacotes via protocolo...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground pointer-events-none">
            <div className="h-14 w-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <p className="text-sm font-medium text-foreground">Solte binários no perímetro</p>
            <p className="text-xs font-semibold uppercase tracking-wider">ou clique no seletor manual</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm mt-6 overflow-hidden">
        <div className="bg-muted/30 p-5 border-b border-border/40 flex items-center justify-between">
          <h3 className="font-semibold leading-none tracking-tight">Index de Recursos Estáticos</h3>
        </div>

        {loading ? (
          <div className="flex justify-center p-16 animate-pulse"><div className="loader-inline" /></div>
        ) : items.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center bg-background/40">
            <div className="h-16 w-16 rounded-full bg-accent text-muted-foreground flex items-center justify-center mb-4">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            </div>
            <h4 className="font-semibold text-foreground text-sm">Bucket Vazio</h4>
          </div>
        ) : (
          <div className="p-6">
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="group relative rounded-xl border border-border/50 bg-background hover:bg-muted/50 overflow-hidden shadow-sm transition-all hover:shadow-md outline-none">
                     <div className="aspect-square bg-slate-100 dark:bg-slate-900 overflow-hidden relative flex items-center justify-center border-b border-border/50">
                        {isImage(item.content_type) ? (
                           <img src={item.url} alt={item.filename} loading="lazy" className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
                        ) : (
                           <div className="text-slate-400 dark:text-slate-600">
                             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                           </div>
                        )}
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                              onClick={() => copyUrl(item.url)} 
                              className="w-8 h-8 rounded-full bg-card hover:bg-accent text-foreground hover:text-accent-foreground border border-border flex items-center justify-center shadow-sm"
                              title="Copiar CDN URL"
                           >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                           </button>
                           <button 
                              onClick={() => handleDelete(item)} 
                              className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white flex items-center justify-center shadow-sm"
                              title="Excluir Definitivo"
                           >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                           </button>
                        </div>
                     </div>
                     <div className="p-3">
                        <div className="truncate text-xs font-bold text-foreground" title={item.filename}>{item.filename}</div>
                        <div className="flex justify-between items-center mt-1">
                           <div className="font-mono text-[10px] uppercase text-muted-foreground tracking-wider">{formatSize(item.size)}</div>
                           <div className="text-[10px] font-bold text-primary capitalize">{item.content_type.split('/')[1] || item.content_type}</div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
             
             {meta && meta.totalPages > 1 && (
               <div className="pt-8 border-t border-border/40 mt-8 flex justify-between items-center px-4">
                  <button 
                     className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background/50 px-4 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                     disabled={page <= 1} 
                     onClick={() => setPage(page - 1)}
                  >
                     <svg className="mr-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg> Rebobinar
                  </button>
                  <span className="font-mono text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">Vol. {page} — {meta.totalPages}</span>
                  <button 
                     className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background/50 px-4 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                     disabled={page >= meta.totalPages} 
                     onClick={() => setPage(page + 1)}
                  >
                     Avançar <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
