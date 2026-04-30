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
    return (
      <div className="bg-card rounded-[24px] border border-border/60 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden mt-6">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="py-4 px-8 w-1/3"><div className="h-3 w-24 bg-muted/50 rounded-full"></div></th>
                <th className="py-4 px-4 w-1/4"><div className="h-3 w-16 bg-muted/50 rounded-full"></div></th>
                <th className="py-4 px-4 w-1/4"><div className="h-3 w-20 bg-muted/50 rounded-full"></div></th>
                <th className="py-4 px-8 w-auto text-right"><div className="h-3 w-12 bg-muted/50 rounded-full ml-auto"></div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="py-5 px-8"><div className="h-4 w-3/4 rounded-lg bg-muted/50" style={{ animation: 'skeletonPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}></div></td>
                  <td className="py-5 px-4"><div className="h-4 w-1/2 rounded-lg bg-muted/50" style={{ animation: 'skeletonPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }}></div></td>
                  <td className="py-5 px-4"><div className="h-4 w-24 rounded-lg bg-muted/50" style={{ animation: 'skeletonPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.2}s` }}></div></td>
                  <td className="py-5 px-8 text-right"><div className="h-8 w-16 rounded-lg bg-muted/50 inline-block" style={{ animation: 'skeletonPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.25}s` }}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center bg-card rounded-[24px] border border-border/50 shadow-sm mt-4">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/30 mb-6">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
        <h3 className="text-xl font-bold text-foreground font-mono">Database Vazio</h3>
        <p className="text-muted-foreground mt-2 mb-6 max-w-sm">Nenhum {collection.label.toLowerCase()} encontrado na view primária.</p>
        <button 
          className="bg-foreground text-background font-semibold px-6 py-2.5 rounded-full hover:bg-muted-foreground transition-colors shadow-lg" 
          onClick={onCreateFirst}
        >
          Criar primeiro registro
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Enterprise Data Table Card */}
      <div className="bg-card rounded-[24px] border border-border/60 shadow-[0_2px_20px_-8px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                {tableFields.map((f, i) => (
                  <th key={f.name} className={`py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground/80 ${i === 0 ? 'pl-8 pr-4' : 'px-4'}`}>
                    {f.label ?? f.name}
                  </th>
                ))}
                {hasFeatured && <th className="px-4 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground/80">Contexto</th>}
                {collection.has_status && <th className="px-4 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground/80">Liveness</th>}
                <th className="px-4 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground/80">Snapshot</th>
                <th className="pr-8 pl-4 py-4 font-bold text-[11px] uppercase tracking-widest text-muted-foreground/80 text-right">Ajustes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {items.map((item) => (
                <tr key={item.id as string} className="group hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-150">
                  {tableFields.map((f, i) => {
                    const isPrimary = f.name === "title" || f.name === "client" || f.name === "name";
                    return (
                      <td key={f.name} className={`py-5 text-[14px] ${i === 0 ? 'pl-8 pr-4' : 'px-4'} ${isPrimary ? 'font-bold text-foreground' : 'font-medium text-muted-foreground'}`}>
                        {f.type === "boolean"
                          ? item[f.name] ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : "—"
                          : String(item[f.name] ?? "—")}
                      </td>
                    );
                  })}
                  
                  {hasFeatured && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onToggleFeatured(item)}
                        disabled={togglingFeaturedId === (item.id as string)}
                        title={item.featured ? "Remover destaque" : "Destacar"}
                        className={`
                          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-widest outline-none transition-all
                          ${togglingFeaturedId === item.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                          ${item.featured 
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-sm' 
                            : 'bg-transparent text-muted-foreground/50 border border-transparent hover:border-border hover:bg-muted'}
                        `}
                      >
                        {item.featured ? (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            Fixado
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            Fixar
                          </>
                        )}
                      </button>
                    </td>
                  )}

                  {collection.has_status && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onToggleStatus(item)}
                        disabled={togglingId === (item.id as string)}
                        title={item.status === "published" ? "Clique para despublicar" : "Clique para publicar"}
                        className={`
                          inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest outline-none transition-all shadow-sm
                          ${togglingId === item.id ? 'opacity-50 cursor-wait' : 'cursor-pointer hover:-translate-y-px'}
                          ${item.status === "published" 
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                            : 'bg-muted/50 text-muted-foreground border border-border/50 hover:bg-black/5 dark:hover:bg-white/5'}
                        `}
                      >
                        {item.status === "published" ? (
                          <><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live</>
                        ) : (
                          <><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />Draft</>
                        )}
                      </button>
                    </td>
                  )}

                  <td className="px-4 py-3 text-muted-foreground font-mono text-[12px] opacity-70">
                    {((item.createdAt ?? item.publishedAt ?? "") as string).slice(0, 10).replace(/-/g, '/')}
                  </td>

                  <td className="pr-8 pl-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-foreground hover:bg-primary/10 hover:text-primary transition-colors outline-none disabled:opacity-50" 
                        onClick={() => onEdit(item)}
                        title="Editar Registro"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>
                      <button 
                        className="p-2 rounded-lg bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors outline-none disabled:opacity-50" 
                        onClick={() => onDelete(item.id as string)}
                        title="Remover Permanentemente"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center mt-10 mb-6">
          <div className="flex items-center gap-2 bg-card border border-border shadow-sm p-1 rounded-full">
            <button
              className="px-4 py-2 rounded-full hover:bg-muted text-[13px] font-bold text-muted-foreground outline-none transition-colors disabled:opacity-30"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              ← Prev
            </button>
            <div className="px-4 py-1 text-[12px] font-bold font-mono tracking-widest text-foreground bg-black/5 dark:bg-white/5 rounded-full">
              PAG {page} / {meta.totalPages}
            </div>
            <button
              className="px-4 py-2 rounded-full hover:bg-muted text-[13px] font-bold text-foreground outline-none transition-colors disabled:opacity-30"
              disabled={page >= meta.totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
