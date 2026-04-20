import { useState } from "react";
import { createEntry } from "../lib/api";

const BRANDS = ["ness", "trustness", "forense"];
const DEPARTMENTS = [
  "Diretoria", "Engenharia", "Comercial", "Operações",
  "RH", "Financeiro", "Marketing", "Cybersecurity", "Legal", "Infraestrutura",
];

const BRAND_CONFIG: Record<string, { color: string; name: string; website: string; company: string }> = {
  ness:      { color: "#000000", name: "ness.",      website: "https://ness.com.br",       company: "Ness | Inovação e Tecnologia" },
  trustness: { color: "#1e40af", name: "trustness.", website: "https://trustness.com.br",  company: "Trustness | Segurança Digital" },
  forense:   { color: "#052e16", name: "forense.io", website: "https://forense.io",         company: "Forense.io | Tecnologia Forense" },
};

/* ─── SVG icons (email-safe, inlined as data URIs) ─── */
const ICON_LINKEDIN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A66C2" width="22" height="22"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
const ICON_GLOBE    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A66C2" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`;
const ICON_INSTA    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A66C2" width="22" height="22"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`;
const ICON_EMAIL    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`;
const ICON_PHONE    = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.29 6.29l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`;

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/* ─── Inline ness. logo: wordmark + colored dot ─── */
function buildLogo(brand: string) {
  if (brand === "forense") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 56" width="120" height="56"><text x="0" y="44" font-family="Arial,Helvetica,sans-serif" font-size="36" font-weight="400" fill="#052e16" letter-spacing="-1">forense</text><circle cx="197" cy="40" r="6" fill="#00ade8"/><text x="204" y="44" font-family="Arial,Helvetica,sans-serif" font-size="36" font-weight="400" fill="#052e16">io</text></svg>`;
  }
  if (brand === "trustness") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 56" width="140" height="56"><text x="0" y="44" font-family="Arial,Helvetica,sans-serif" font-size="36" font-weight="400" fill="#1e40af" letter-spacing="-1">trustness</text><circle cx="247" cy="40" r="6" fill="#00ade8"/></svg>`;
  }
  // default: ness.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 56" width="110" height="56"><text x="0" y="44" font-family="Arial,Helvetica,sans-serif" font-size="44" font-weight="400" fill="#111827" letter-spacing="-2">ness</text><circle cx="166" cy="40" r="8" fill="#00ade8"/></svg>`;
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

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await createEntry("signatures", form);
      alert("Assinatura salva no histórico com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar assinatura");
    }
    setSaving(false);
  };

  const copyHTML = () => {
    const el = document.getElementById("sig-preview");
    if (!el) return;
    navigator.clipboard.writeText(el.innerHTML);
    alert("HTML copiado! Cole diretamente no editor do Gmail / Outlook.");
  };

  const brand      = BRAND_CONFIG[form.brand] || BRAND_CONFIG.ness;
  const logoSvg    = buildLogo(form.brand);
  const logoUri    = svgToDataUri(logoSvg);
  const liUri      = svgToDataUri(ICON_LINKEDIN);
  const globeUri   = svgToDataUri(ICON_GLOBE);
  const instaUri   = svgToDataUri(ICON_INSTA);
  const emailUri   = svgToDataUri(ICON_EMAIL);
  const phoneUri   = svgToDataUri(ICON_PHONE);

  const FIELD_STYLE: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: "6px",
    border: "1px solid var(--border)", backgroundColor: "var(--bg)",
    color: "var(--text)", fontSize: "14px", boxSizing: "border-box",
  };
  const LABEL_STYLE: React.CSSProperties = {
    fontSize: "11px", fontWeight: 600, color: "var(--text-muted)",
    marginBottom: "5px", display: "block",
    textTransform: "uppercase", letterSpacing: "0.05em",
  };

  return (
    <div style={{ animation: "fade-in 0.3s ease-out" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 600, margin: 0, color: "var(--text)" }}>Gerador de Assinatura</h2>
          <p style={{ margin: "4px 0 0", color: "var(--text-muted)", fontSize: "13px" }}>
            Layout profissional — pronto para Gmail e Outlook.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}
          style={{ padding: "10px 20px", borderRadius: "8px", fontWeight: 500 }}>
          {saving ? "Salvando..." : "Salvar no Histórico"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px,1fr) minmax(500px,1.4fr)", gap: "24px", alignItems: "start" }}>

        {/* ── Form ── */}
        <div className="card" style={{ padding: "24px", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor: "var(--surface-50)" }}>
          <h3 style={{ margin: "0 0 18px", fontSize: "15px", fontWeight: 600, borderBottom: "1px solid var(--border)", paddingBottom: "12px", color: "var(--text)" }}>
            Dados do Colaborador
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "13px" }}>
            {([ ["Nome Completo","name","Ex: Ana Souza","text"],
                ["Cargo","role","Ex: CEO","text"],
                ["E-mail","email","nome@ness.com.br","email"],
                ["Telefone","phone","+55 (11) 99999-9999","text"],
                ["LinkedIn","linkedin","https://linkedin.com/in/...","text"],
                ["Website (ícone globo)","website","https://ness.com.br","text"],
                ["Instagram","instagram","https://instagram.com/...","text"],
            ] as [string,string,string,string][]).map(([label, key, placeholder, type]) => (
              <div key={key}>
                <label style={LABEL_STYLE}>{label}</label>
                <input type={type} style={FIELD_STYLE}
                  value={(form as Record<string,string>)[key]}
                  placeholder={placeholder}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={LABEL_STYLE}>Marca</label>
                <select style={FIELD_STYLE} value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}>
                  {BRANDS.map(b => <option key={b} value={b}>{BRAND_CONFIG[b]?.name || b}</option>)}
                </select>
              </div>
              <div>
                <label style={LABEL_STYLE}>Departamento</label>
                <select style={FIELD_STYLE} value={form.department} onChange={e => setForm({ ...form, department: e.target.value })}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Preview ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "24px" }}>
          <div className="card" style={{ padding: "24px", borderRadius: "12px", border: "1px solid var(--border)", backgroundColor: "var(--surface-50)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid var(--border)", paddingBottom: "12px" }}>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "var(--text)" }}>Visualização Real</h3>
              <button onClick={copyHTML}
                style={{ padding: "6px 16px", borderRadius: "6px", border: "none", backgroundColor: "var(--accent)", color: "#fff", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                Copiar HTML
              </button>
            </div>

            {/* White e-mail canvas */}
            <div style={{ padding: "36px 28px 20px", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
              <div id="sig-preview">

                {/* ══ SIGNATURE TABLE ══ */}
                <table cellPadding={0} cellSpacing={0} border={0}
                  style={{ fontFamily: "Arial, Helvetica, sans-serif", maxWidth: "560px", width: "100%", backgroundColor: "#ffffff" }}>
                  <tbody>
                    <tr>
                      {/* Logo */}
                      <td valign="middle" style={{ paddingRight: "28px", verticalAlign: "middle" }}>
                        <a href={brand.website} style={{ textDecoration: "none", display: "block" }}>
                          <img src={logoUri} alt={brand.name} width="110" height="56"
                            style={{ display: "block", border: "0", width: "110px", height: "56px" }} />
                        </a>
                      </td>

                      {/* Vertical divider */}
                      <td width={1} valign="middle" style={{ verticalAlign: "middle", paddingBottom: "0" }}>
                        <div style={{ width: "1px", height: "80px", backgroundColor: "#d1d5db" }} />
                      </td>

                      {/* Contact info */}
                      <td valign="middle" style={{ paddingLeft: "28px", verticalAlign: "middle" }}>
                        <table cellPadding={0} cellSpacing={0} border={0}>
                          <tbody>
                            {/* Name */}
                            <tr>
                              <td style={{ paddingBottom: "1px" }}>
                                <span style={{ fontFamily: "Arial,Helvetica,sans-serif", fontSize: "15px", fontWeight: 500,
                                  color: "#111827", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                  {form.name}
                                </span>
                              </td>
                            </tr>
                            {/* Role */}
                            <tr>
                              <td style={{ paddingBottom: "10px" }}>
                                <span style={{ fontFamily: "Arial,Helvetica,sans-serif", fontSize: "12px", color: "#6b7280" }}>
                                  {form.role}
                                </span>
                              </td>
                            </tr>
                            {/* Email */}
                            <tr>
                              <td style={{ paddingBottom: "3px" }}>
                                <table cellPadding={0} cellSpacing={0} border={0}><tbody><tr>
                                  <td valign="middle" style={{ paddingRight: "6px" }}>
                                    <img src={emailUri} width="14" height="14" alt="" style={{ display: "block", border: "0" }} />
                                  </td>
                                  <td valign="middle">
                                    <a href={`mailto:${form.email}`}
                                      style={{ fontFamily: "Arial,Helvetica,sans-serif", fontSize: "12px", color: "#374151", textDecoration: "none" }}>
                                      {form.email}
                                    </a>
                                  </td>
                                </tr></tbody></table>
                              </td>
                            </tr>
                            {/* Phone */}
                            {form.phone && (
                              <tr>
                                <td style={{ paddingBottom: "10px" }}>
                                  <table cellPadding={0} cellSpacing={0} border={0}><tbody><tr>
                                    <td valign="middle" style={{ paddingRight: "6px" }}>
                                      <img src={phoneUri} width="14" height="14" alt="" style={{ display: "block", border: "0" }} />
                                    </td>
                                    <td valign="middle">
                                      <a href={`tel:${form.phone.replace(/[^0-9+]/g, "")}`}
                                        style={{ fontFamily: "Arial,Helvetica,sans-serif", fontSize: "12px", color: "#374151", textDecoration: "none" }}>
                                        {form.phone}
                                      </a>
                                    </td>
                                  </tr></tbody></table>
                                </td>
                              </tr>
                            )}
                            {/* Social icons */}
                            <tr>
                              <td>
                                <table cellPadding={0} cellSpacing={0} border={0}><tbody><tr>
                                  {form.linkedin && (
                                    <td style={{ paddingRight: "8px" }}>
                                      <a href={form.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "block", lineHeight: "0" }}>
                                        <img src={liUri} width="22" height="22" alt="LinkedIn" style={{ display: "block", border: "0", width: "22px", height: "22px" }} />
                                      </a>
                                    </td>
                                  )}
                                  {form.website && (
                                    <td style={{ paddingRight: "8px" }}>
                                      <a href={form.website} target="_blank" rel="noopener noreferrer" style={{ display: "block", lineHeight: "0" }}>
                                        <img src={globeUri} width="22" height="22" alt="Website" style={{ display: "block", border: "0", width: "22px", height: "22px" }} />
                                      </a>
                                    </td>
                                  )}
                                  {form.instagram && (
                                    <td>
                                      <a href={form.instagram} target="_blank" rel="noopener noreferrer" style={{ display: "block", lineHeight: "0" }}>
                                        <img src={instaUri} width="22" height="22" alt="Instagram" style={{ display: "block", border: "0", width: "22px", height: "22px" }} />
                                      </a>
                                    </td>
                                  )}
                                </tr></tbody></table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    {/* ── Thin horizontal rule ── */}
                    <tr>
                      <td colSpan={3} style={{ paddingTop: "16px", paddingBottom: "8px" }}>
                        <div style={{ height: "1px", backgroundColor: "#e5e7eb", width: "100%" }} />
                      </td>
                    </tr>

                    {/* ── Footer ── */}
                    <tr>
                      <td colSpan={3} align="center">
                        <span style={{ fontFamily: "Arial,Helvetica,sans-serif", fontSize: "11px", color: "#9ca3af" }}>
                          {brand.company}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} align="center" style={{ paddingTop: "2px" }}>
                        <span style={{ fontFamily: "Arial,Helvetica,sans-serif", fontSize: "10px", color: "#9ca3af" }}>
                          {"Este e-mail pode conter "}
                          <span style={{ color: "#6b7280" }}>informações confidenciais</span>
                          {"."}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

              </div>{/* /sig-preview */}
            </div>

            <div style={{ marginTop: "14px", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5,
              backgroundColor: "rgba(0,173,232,0.07)", padding: "10px 14px", borderRadius: "6px",
              border: "1px solid rgba(0,173,232,0.15)" }}>
              <strong style={{ color: "var(--accent)" }}>Como usar:</strong>{" "}
              Clique em "Copiar HTML", abra o Gmail/Outlook → Configurações → Assinatura → cole com <kbd>Ctrl+V</kbd> no editor visual.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
