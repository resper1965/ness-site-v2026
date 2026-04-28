import { useState, useEffect, useCallback } from "react";
import {
  fetchCollection,
  fetchEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  toggleEntryStatus,
  toggleEntryFeatured,
  type CollectionDef,
  type EntryMeta,
} from "../lib/api";
import { EntryTable } from "../components/collection/EntryTable";
import { EntryModal } from "../components/collection/EntryModal";

const LOCALES = ["pt", "en", "es"];

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
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [togglingFeaturedId, setTogglingFeaturedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCollection(slug).then((col) => setCollection(col ?? null));
  }, [slug]);

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

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [slug, locale]);

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
    try { await toggleEntryStatus(slug, id, next); await load(); }
    finally { setTogglingId(null); }
  }

  async function handleToggleFeatured(item: Record<string, unknown>) {
    const id = item.id as string;
    setTogglingFeaturedId(id);
    try { await toggleEntryFeatured(slug, id, !item.featured); await load(); }
    finally { setTogglingFeaturedId(null); }
  }

  if (!collection) {
    return <div className="flex items-center justify-center h-full"><div className="loader-inline" /></div>;
  }

  return (
    <div className="flex flex-col h-full overflow-hidden fadeIn">
      {/* 
        This is the global Data View header.
      */}
      <div className="flex-none px-6 md:px-12 py-8 flex border-b border-border/50 w-full min-w-0 overflow-hidden">
        <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto min-w-0">
          {/* Top row: Metrics & Locale */}
          <div className="flex items-center justify-between w-full h-12">
            <div className="flex items-center gap-6">
              {collection.has_locale && (
                <div className="flex p-1 bg-black/5 dark:bg-white/5 rounded-full border border-black/5 dark:border-white/5">
                  {LOCALES.map((l) => (
                    <button 
                      key={l} 
                      className={`px-4 py-1.5 rounded-full text-xs uppercase transition-all duration-200 outline-none ${l === locale ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setLocale(l)}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              )}
              {meta && (
                <span className="text-[14px] font-medium text-muted-foreground bg-muted/40 px-3 py-1 rounded-full border border-border/50">
                  {meta.total} {meta.total === 1 ? "registro ativo" : "registros ativos"}
                </span>
              )}
            </div>

            <button 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-[14px] font-semibold px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all outline-none"
              onClick={openCreate}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>{`Novo ${collection.label}`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Container */}
      <div className="flex-1 overflow-y-auto px-6 md:px-12 py-8 custom-scrollbar w-full min-w-0 overflow-hidden">
        <div className="max-w-[1400px] mx-auto min-w-0">
          <EntryTable
            collection={collection}
            items={items}
            meta={meta}
            loading={loading}
            page={page}
            togglingId={togglingId}
            togglingFeaturedId={togglingFeaturedId}
            onPageChange={setPage}
            onEdit={openEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
            onToggleFeatured={handleToggleFeatured}
            onCreateFirst={openCreate}
          />
        </div>
      </div>

      {/* Modal is injected correctly */}
      {modal && (
        <EntryModal
          mode={modal}
          collection={collection}
          slug={slug}
          locale={locale}
          form={form}
          saving={saving}
          onFormChange={setForm}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
