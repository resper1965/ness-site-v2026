import { useState, useEffect } from "react";
import { Link } from "react-router";
import { createEntry } from "../lib/api";
import { SignaturePreview, BRAND_CONFIG } from "../components/signatures/SignaturePreview";

const BRANDS = ["ness", "trustness", "forense"];
const DEPARTMENTS = [
  "Diretoria", "Engenharia", "Comercial", "Operações",
  "RH", "Financeiro", "Marketing", "Cybersecurity", "Legal", "Infraestrutura",
];

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: type === "success" ? "rgba(16,185,129,0.96)" : "rgba(244,63,94,0.96)",
      backdropFilter: "blur(8px)", color: "#fff",
      padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 500,
      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
      animation: "toast-in 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      display: "flex", alignItems: "center", gap: 8,
    }}>
      {type === "success" ? "✓" : "✕"} {message}
    </div>
  );
}

export default function SignaturesHub() {
  const [form, setForm] = useState({
    name: "Ricardo Esper", role: "CEO", email: "resper@ness.com.br",
    phone: "+55 11 98339-7196", brand: "ness", department: "Diretoria",
    linkedin: "https://www.linkedin.com/company/ness", disclaimer: true,
  });

  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await createEntry("signatures", form);
      setToast({ message: "Salvo no histórico.", type: "success" });
    } catch { setToast({ message: "Erro ao salvar.", type: "error" }); }
    setSaving(false);
  };

  const copyHTML = () => {
    const el = document.getElementById("sig-preview");
    if (!el) return;
    navigator.clipboard.writeText(el.innerHTML).then(() => {
      setCopied(true);
      setToast({ message: "HTML copiado — cole no Gmail.", type: "success" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const FIELD: React.CSSProperties = {
    width: "100%", padding: "9px 13px", borderRadius: 9,
    border: "1px solid var(--border)", backgroundColor: "var(--surface-2, #0f172a)",
    color: "var(--text)", fontSize: 13.5, boxSizing: "border-box",
    outline: "none", transition: "border-color 0.15s",
  };
  const LABEL: React.CSSProperties = {
    fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)",
    marginBottom: 5, display: "block", textTransform: "uppercase", letterSpacing: "0.08em",
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .sig-input:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(123,208,255,0.1); }
      `}</style>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/crud/signatures" style={{ padding: "9px 16px", borderRadius: 9, fontWeight: 500, fontSize: 13, border: "1px solid var(--border)", color: "var(--text-muted)", textDecoration: "none", background: "transparent" }}>Histórico</Link>
          <button onClick={handleSave} disabled={saving} style={{ padding: "9px 16px", borderRadius: 9, fontWeight: 600, fontSize: 13, border: "none", cursor: "pointer", background: "var(--surface-3, #222a3d)", color: "var(--text-muted)", opacity: saving ? 0.6 : 1 }}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,380px) 1fr", gap: 24, alignItems: "start" }}>
        {/* Form */}
        <div style={{ padding: 20, borderRadius: 16, border: "1px solid var(--border)", background: "var(--surface, #0b1326)" }}>
          <p style={{ margin: "0 0 16px", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
            Dados do Colaborador
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {([
              ["Nome Completo", "name", "Ex: Ana Souza", "text"],
              ["Cargo", "role", "Ex: CPO", "text"],
              ["E-mail", "email", "nome@ness.com.br", "email"],
              ["Telefone", "phone", "+55 11 99999-9999", "text"],
              ["LinkedIn URL", "linkedin", "https://linkedin.com/…", "text"],
            ] as [string, string, string, string][]).map(([label, key, placeholder, type]) => (
              <div key={key}>
                <label style={LABEL}>{label}</label>
                <input type={type} className="sig-input" style={FIELD}
                  value={form[key as keyof typeof form] as string}
                  aria-label={label} placeholder={placeholder}
                  onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={LABEL}>Marca</label>
                <select className="sig-input" style={FIELD} value={form.brand}
                  onChange={e => setForm({ ...form, brand: e.target.value })}>
                  {BRANDS.map(b => <option key={b} value={b}>{BRAND_CONFIG[b]?.name}</option>)}
                </select>
              </div>
              <div>
                <label style={LABEL}>Departamento</label>
                <select className="sig-input" style={FIELD} value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", paddingTop: 4 }}>
              <input type="checkbox" checked={form.disclaimer}
                onChange={e => setForm({ ...form, disclaimer: e.target.checked })}
                style={{ width: 16, height: 16, accentColor: "var(--accent)" }} />
              <span style={{ ...LABEL, margin: 0 }}>Incluir aviso de confidencialidade</span>
            </label>
          </div>
        </div>

        {/* Preview */}
        <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ borderRadius: 16, border: "1px solid var(--border)", background: "var(--surface)", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>Pré-visualização</span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(123,208,255,0.10)", color: "var(--accent)", fontWeight: 600 }}>LIVE</span>
              </div>
              <button onClick={copyHTML} style={{ padding: "7px 18px", borderRadius: 8, border: "none", cursor: "pointer", background: copied ? "rgba(16,185,129,0.9)" : "var(--accent)", color: copied ? "#fff" : "#081420", fontSize: 12.5, fontWeight: 700, transition: "background 0.15s" }}>
                {copied ? "✓ Copiado" : "Copiar HTML"}
              </button>
            </div>
            <div style={{ padding: "32px 28px", background: "#f4f5f7", overflowX: "auto" }}>
              <div style={{ display: "inline-block", background: "#fff", borderRadius: 8, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
                <SignaturePreview form={form} />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 10, background: "rgba(0,173,232,0.06)", border: "1px solid rgba(0,173,232,0.14)" }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
              Clique em <strong style={{ color: "var(--accent)" }}>Copiar HTML</strong>, abra Gmail → Configurações → Assinatura → cole com <kbd style={{ fontSize: 11, background: "var(--surface-3)", padding: "1px 6px", borderRadius: 5, border: "1px solid var(--border)" }}>Ctrl+V</kbd>.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
