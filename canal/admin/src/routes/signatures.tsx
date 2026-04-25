import { useState, useEffect } from "react";
import { Link } from "react-router";
import { createEntry } from "../lib/api";

const BRANDS = ["ness", "trustness", "forense"];
const DEPARTMENTS = [
  "Diretoria", "Engenharia", "Comercial", "Operações",
  "RH", "Financeiro", "Marketing", "Cybersecurity", "Legal", "Infraestrutura",
];

const BRAND_CONFIG: Record<string, { name: string; website: string; company: string }> = {
  ness:      { name: "ness.",      website: "https://ness.com.br",      company: "Ness | Inovação e Tecnologia" },
  trustness: { name: "trustness.", website: "https://trustness.com.br", company: "Trustness | Segurança Digital" },
  forense:   { name: "forense.io", website: "https://forense.io",        company: "Forense.io | Tecnologia Forense" },
};

const LOGO_CONFIG: Record<string, { wordmark: string; suffix?: string; color: string }> = {
  ness:      { wordmark: "ness",      color: "#0b1326" },
  trustness: { wordmark: "trustness", color: "#1e40af" },
  forense:   { wordmark: "forense",   suffix: "io", color: "#052e16" },
};

/* ─── Social icons — ALL monochrome for Apple HIG restraint ─── */
const ICON_LINKEDIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" width="16" height="16"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
const ICON_GLOBE    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" width="16" height="16"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;
const ICON_INSTA    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" width="16" height="16"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`;

function svgToDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

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
    name:       "Ricardo Esper",
    role:       "CEO",
    email:      "resper@ness.com.br",
    phone:      "+55 (11) 98339-7196",
    brand:      "ness",
    department: "Diretoria",
    linkedin:   "https://linkedin.com/in/ricardoesper",
    website:    "https://ness.com.br",
    instagram:  "https://instagram.com/ness.tech",
  });

  const [saving, setSaving]   = useState(false);
  const [copied, setCopied]   = useState(false);
  const [toast, setToast]     = useState<{ message: string; type: "success" | "error" } | null>(null);

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
    } catch {
      setToast({ message: "Erro ao salvar.", type: "error" });
    }
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

  const brand = BRAND_CONFIG[form.brand] || BRAND_CONFIG.ness;
  const logo  = LOGO_CONFIG[form.brand]  || LOGO_CONFIG.ness;
  const liUri    = svgToDataUri(ICON_LINKEDIN);
  const globeUri = svgToDataUri(ICON_GLOBE);
  const instaUri = svgToDataUri(ICON_INSTA);

  const FIELD: React.CSSProperties = {
    width: "100%", padding: "9px 13px", borderRadius: 9,
    border: "1px solid var(--border)",
    backgroundColor: "var(--surface-2, #0f172a)",
    color: "var(--text)", fontSize: 13.5, boxSizing: "border-box",
    outline: "none", transition: "border-color 0.15s",
  };
  const LABEL: React.CSSProperties = {
    fontSize: 10.5, fontWeight: 700, color: "var(--text-muted)",
    marginBottom: 5, display: "block",
    textTransform: "uppercase", letterSpacing: "0.08em",
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
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--border)",
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0, color: "var(--text)", letterSpacing: "-0.01em" }}>
            Gerador de Assinatura
          </h2>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: 13 }}>
            Layout profissional — pronto para Gmail e Outlook.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/crud/signatures" style={{
            padding: "9px 16px", borderRadius: 9, fontWeight: 500, fontSize: 13,
            border: "1px solid var(--border)", color: "var(--text-muted)",
            textDecoration: "none", background: "transparent",
          }}>
            Histórico
          </Link>
          <button onClick={handleSave} disabled={saving} style={{
            padding: "9px 16px", borderRadius: 9, fontWeight: 600, fontSize: 13,
            border: "none", cursor: "pointer",
            background: "var(--surface-3, #222a3d)", color: "var(--text-muted)",
            opacity: saving ? 0.6 : 1,
          }}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px,380px) 1fr", gap: 24, alignItems: "start" }}>

        {/* Form */}
        <div style={{ padding: 20, borderRadius: 16, border: "1px solid var(--border)", background: "var(--surface, #0b1326)" }}>
          <p style={{ margin: "0 0 16px", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", color: "var(--text-muted)", paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
            Dados do Colaborador
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {([
              ["Nome Completo", "name",      "Ex: Ana Souza",             "text"],
              ["Cargo",         "role",      "Ex: CPO",                   "text"],
              ["E-mail",        "email",     "nome@ness.com.br",          "email"],
              ["Telefone",      "phone",     "+55 (11) 99999-9999",       "text"],
              ["LinkedIn",      "linkedin",  "https://linkedin.com/in/…", "text"],
              ["Website",       "website",   "https://ness.com.br",       "text"],
              ["Instagram",     "instagram", "https://instagram.com/…",   "text"],
            ] as [string, string, string, string][]).map(([label, key, placeholder, type]) => (
              <div key={key}>
                <label style={LABEL}>{label}</label>
                <input type={type} className="sig-input" style={FIELD}
                  value={(form as Record<string, string>)[key]}
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
          </div>
        </div>

        {/* Preview panel */}
        <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ borderRadius: 16, border: "1px solid var(--border)", background: "var(--surface)", overflow: "hidden" }}>

            {/* Panel header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 18px", borderBottom: "1px solid var(--border)",
              background: "rgba(255,255,255,0.02)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)" }}>
                  Pré-visualização
                </span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99,
                  background: "rgba(123,208,255,0.10)", color: "var(--accent)", fontWeight: 600 }}>
                  LIVE
                </span>
              </div>
              <button onClick={copyHTML} style={{
                padding: "7px 18px", borderRadius: 8, border: "none", cursor: "pointer",
                background: copied ? "rgba(16,185,129,0.9)" : "var(--accent)",
                color: copied ? "#fff" : "#081420",
                fontSize: 12.5, fontWeight: 700, letterSpacing: "0.02em",
                transition: "background 0.15s",
              }}>
                {copied ? "✓ Copiado" : "Copiar HTML"}
              </button>
            </div>

            {/* Email canvas */}
            <div style={{ padding: "24px 24px 20px", background: "#f0f2f5" }}>
              <div style={{ display: "inline-block", background: "#fff", borderRadius: 6, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>

                {/* ══ SIGNATURE ══ */}
                <div id="sig-preview" style={{ padding: "20px 24px 16px" }}>
                  <table cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", fontFamily: "Arial, Helvetica, sans-serif", backgroundColor: "#ffffff" }}>
                    <tbody>
                      <tr>

                        {/* Logo + accent bar */}
                        <td style={{ verticalAlign: "top", paddingRight: 20 }}>
                          <a href={brand.website} style={{ textDecoration: "none", display: "block" }}>
                            {/* Wordmark */}
                            <div style={{
                              fontFamily: "'Montserrat', 'Arial Narrow', Arial, sans-serif",
                              fontSize: 22, fontWeight: "500",
                              color: logo.color,
                              letterSpacing: "-0.04em",
                              lineHeight: "1",
                              whiteSpace: "nowrap",
                            }}>
                              {logo.wordmark}<span style={{ color: "#00ade8" }}>.</span>{logo.suffix || ""}
                            </div>
                            {/* Blue accent bar — the ONLY color element */}
                            <div style={{ height: 2, background: "#00ade8", marginTop: 6, borderRadius: 1 }} />
                          </a>
                        </td>

                        {/* Divider */}
                        <td style={{ verticalAlign: "top", paddingTop: 2 }}>
                          <div style={{ width: 1, height: 72, backgroundColor: "#e5e7eb" }} />
                        </td>

                        {/* Contact block */}
                        <td style={{ verticalAlign: "top", paddingLeft: 20, paddingTop: 1 }}>

                          {/* Name */}
                          <div style={{
                            fontFamily: "Arial, Helvetica, sans-serif",
                            fontSize: 11.5, fontWeight: "700",
                            color: "#0f172a",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            lineHeight: "1",
                            marginBottom: 3,
                          }}>
                            {form.name}
                          </div>

                          {/* Role */}
                          <div style={{
                            fontFamily: "Arial, Helvetica, sans-serif",
                            fontSize: 10, color: "#94a3b8",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            marginBottom: 10,
                          }}>
                            {form.role}{form.department ? ` · ${form.department}` : ""}
                          </div>

                          {/* Contact — text only, no icons */}
                          {form.phone && (
                            <div style={{ marginBottom: 2 }}>
                              <a href={`tel:${form.phone.replace(/[^0-9+]/g, "")}`}
                                style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, color: "#334155", textDecoration: "none" }}>
                                {form.phone}
                              </a>
                            </div>
                          )}
                          <div style={{ marginBottom: 8 }}>
                            <a href={`mailto:${form.email}`}
                              style={{ fontFamily: "Arial, Helvetica, sans-serif", fontSize: 11, color: "#334155", textDecoration: "none" }}>
                              {form.email}
                            </a>
                          </div>

                          {/* Social icons — monochrome */}
                          <table cellPadding={0} cellSpacing={0}><tbody><tr>
                            {form.linkedin && (
                              <td style={{ paddingRight: 6 }}>
                                <a href={form.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "block", lineHeight: 0 }}>
                                  <img src={liUri} width="16" height="16" alt="LinkedIn" style={{ display: "block", border: 0 }} />
                                </a>
                              </td>
                            )}
                            {form.website && (
                              <td style={{ paddingRight: 6 }}>
                                <a href={form.website} target="_blank" rel="noopener noreferrer" style={{ display: "block", lineHeight: 0 }}>
                                  <img src={globeUri} width="16" height="16" alt="Website" style={{ display: "block", border: 0 }} />
                                </a>
                              </td>
                            )}
                            {form.instagram && (
                              <td>
                                <a href={form.instagram} target="_blank" rel="noopener noreferrer" style={{ display: "block", lineHeight: 0 }}>
                                  <img src={instaUri} width="16" height="16" alt="Instagram" style={{ display: "block", border: 0 }} />
                                </a>
                              </td>
                            )}
                          </tr></tbody></table>

                        </td>
                      </tr>

                      {/* Rule */}
                      <tr>
                        <td colSpan={3} style={{ paddingTop: 14, paddingBottom: 8 }}>
                          <div style={{ height: 1, backgroundColor: "#f1f5f9" }} />
                        </td>
                      </tr>

                      {/* Footer */}
                      <tr>
                        <td colSpan={3} align="center">
                          <span style={{
                            fontFamily: "Arial, Helvetica, sans-serif",
                            fontSize: 9, color: "#cbd5e1",
                            letterSpacing: "0.1em", textTransform: "uppercase",
                          }}>
                            {brand.company}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                {/* ══ END SIGNATURE ══ */}

              </div>
            </div>
          </div>

          {/* Tip */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px", borderRadius: 10,
            background: "rgba(0,173,232,0.06)", border: "1px solid rgba(0,173,232,0.14)",
          }}>
            <span style={{ fontSize: 15 }}>💡</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>
              Clique em <strong style={{ color: "var(--accent)" }}>Copiar HTML</strong>, 
              abra Gmail → Configurações → Assinatura → cole com{" "}
              <kbd style={{ fontSize: 11, background: "var(--surface-3)", padding: "1px 6px", borderRadius: 5, border: "1px solid var(--border)" }}>Ctrl+V</kbd>.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
