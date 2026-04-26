import * as React from "react";
import type { FieldDef } from "../../lib/api";

export function FieldInput({
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
