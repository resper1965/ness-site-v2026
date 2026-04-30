import type { CollectionDef, FieldDef } from "../../lib/api";
import { FieldInput } from "./FieldInput";
import AIWriterModal from "../AIWriterModal";
import { useState } from "react";

const LOCALES = ["pt", "en", "es"];

interface EntryModalProps {
  mode: "create" | "edit";
  collection: CollectionDef;
  slug: string;
  locale: string;
  form: Record<string, unknown>;
  saving: boolean;
  onFormChange: (form: Record<string, unknown>) => void;
  onSave: () => void;
  onClose: () => void;
}

export function EntryModal({
  mode,
  collection,
  slug,
  locale,
  form,
  saving,
  onFormChange,
  onSave,
  onClose,
}: EntryModalProps) {
  const [aiWriterField, setAiWriterField] = useState<FieldDef | null>(null);

  return (
    <>
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal modal-lg">
          <h2>{mode === "create" ? `Novo ${collection.label}` : `Editar ${collection.label}`}</h2>

          <div className="form">
            {/* Locale + Status */}
            <div className="form-row-2">
              {collection.has_locale ? (
                <div className="field">
                  <label htmlFor="entry-locale">Idioma</label>
                  <select
                    id="entry-locale"
                    value={(form.locale as string) ?? locale}
                    onChange={(e) => onFormChange({ ...form, locale: e.target.value })}
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
                    onChange={(e) => onFormChange({ ...form, status: e.target.value })}
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
                  onChange={(e) => onFormChange({ ...form, slug: e.target.value })}
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
                onChange={(v) => onFormChange({ ...form, [field.name]: v })}
                collection={slug}
                locale={(form.locale as string) ?? locale}
                onAIWrite={(f) => setAiWriterField(f)}
              />
            ))}

            <div className="action-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                {(slug === 'insights' || slug === 'cases') && mode === "edit" && form.id && (
                  <button 
                    className="btn btn-outline text-brand-primary border-brand-primary/50 hover:bg-brand-primary/10 flex items-center gap-2 text-sm" 
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const res = await fetch(`/api/admin/entries/${form.id}/social`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ platform: 'linkedin' })
                        });
                        if (res.ok) alert('Post Social pro LinkedIn enviado p/ Geração na IA!');
                      } catch(err) { alert('Erro.'); }
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><path d="M6 10v1a6 6 0 0 0 12 0v-1"/><path d="M12 18v4"/><path d="M8 22h8"/></svg>
                    Gerar Rascunho Social (LinkedIn)
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
                <button className="btn btn-primary" onClick={onSave} disabled={saving}>
                  {saving ? "Salvando…" : mode === "create" ? `Criar ${collection.label}` : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Writer Modal */}
      {aiWriterField && (
        <AIWriterModal
          field={aiWriterField.name}
          fieldLabel={aiWriterField.label ?? aiWriterField.name}
          collection={slug}
          locale={(form.locale as string) ?? locale}
          onApply={(text) => onFormChange({ ...form, [aiWriterField.name]: text })}
          onClose={() => setAiWriterField(null)}
        />
      )}
    </>
  );
}
