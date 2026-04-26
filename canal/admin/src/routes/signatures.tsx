import { useState, useEffect } from "react";
import { Link } from "react-router";
import { createEntry } from "../lib/api";

const BRANDS = ["ness", "trustness", "forense"];
const DEPARTMENTS = [
  "Diretoria", "Engenharia", "Comercial", "Operações",
  "RH", "Financeiro", "Marketing", "Cybersecurity", "Legal", "Infraestrutura",
];

const BRAND_CONFIG: Record<string, { name: string; website: string; websiteDisplay: string }> = {
  ness:      { name: "ness.",      website: "https://ness.com.br",      websiteDisplay: "ness.com.br" },
  trustness: { name: "trustness.", website: "https://trustness.com.br", websiteDisplay: "trustness.com.br" },
  forense:   { name: "forense.io", website: "https://forense.io",        websiteDisplay: "forense.io" },
};

const LOGO_CONFIG: Record<string, { wordmark: string; suffix?: string }> = {
  ness:      { wordmark: "ness" },
  trustness: { wordmark: "trustness" },
  forense:   { wordmark: "forense", suffix: "io" },
};

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
    phone:      "+55 11 98339-7196",
    brand:      "ness",
    department: "Diretoria",
    linkedin:   "https://www.linkedin.com/company/ness",
    disclaimer: true,
  });

  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast]   = useState<{ message: string; type: "success" | "error" } | null>(null);

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

  const phoneClean    = form.phone.replace(/[^0-9+]/g, "");
  const linkedinDisplay = form.linkedin.replace(/^https?:\/\/(www\.)?/, "");

  const FIELD: React.CSSProperties = {
    width: "100%", padding: "9px 13px", borderRadius: 9,
    border: "1px solid var(--border)", backgroundColor: "var(--surface-2, #0f172a)",
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

      {/* Toolbar actions */}
      <div style={{ display:"flex", justifyContent:"flex-end", alignItems:"center",
        marginBottom:28, paddingBottom:20, borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", gap:10 }}>
          <Link to="/crud/signatures" style={{
            padding:"9px 16px", borderRadius:9, fontWeight:500, fontSize:13,
            border:"1px solid var(--border)", color:"var(--text-muted)",
            textDecoration:"none", background:"transparent",
          }}>Histórico</Link>
          <button onClick={handleSave} disabled={saving} style={{
            padding:"9px 16px", borderRadius:9, fontWeight:600, fontSize:13,
            border:"none", cursor:"pointer",
            background:"var(--surface-3, #222a3d)", color:"var(--text-muted)",
            opacity: saving ? 0.6 : 1,
          }}>
            {saving ? "Salvando…" : "Salvar"}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"minmax(280px,380px) 1fr", gap:24, alignItems:"start" }}>

        {/* Form */}
        <div style={{ padding:20, borderRadius:16, border:"1px solid var(--border)", background:"var(--surface, #0b1326)" }}>
          <p style={{ margin:"0 0 16px", fontSize:10.5, fontWeight:700, textTransform:"uppercase",
            letterSpacing:"0.1em", color:"var(--text-muted)", paddingBottom:12, borderBottom:"1px solid var(--border)" }}>
            Dados do Colaborador
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
            {([
              ["Nome Completo","name",    "Ex: Ana Souza",          "text"],
              ["Cargo",        "role",    "Ex: CPO",                "text"],
              ["E-mail",       "email",   "nome@ness.com.br",       "email"],
              ["Telefone",     "phone",   "+55 11 99999-9999",      "text"],
              ["LinkedIn URL", "linkedin","https://linkedin.com/…", "text"],
            ] as [string,string,string,string][]).map(([label, key, placeholder, type]) => (
              <div key={key}>
                <label style={LABEL}>{label}</label>
                <input type={type} className="sig-input" style={FIELD}
                  value={form[key as keyof typeof form] as string}
                  aria-label={label} placeholder={placeholder}
                  onChange={e => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
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
            {/* Disclaimer toggle */}
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", paddingTop:4 }}>
              <input type="checkbox" checked={form.disclaimer}
                onChange={e => setForm({ ...form, disclaimer: e.target.checked })}
                style={{ width:16, height:16, accentColor:"var(--accent)" }} />
              <span style={{ ...LABEL, margin:0 }}>Incluir aviso de confidencialidade</span>
            </label>
          </div>
        </div>

        {/* Preview */}
        <div style={{ position:"sticky", top:24, display:"flex", flexDirection:"column", gap:12 }}>
          <div style={{ borderRadius:16, border:"1px solid var(--border)", background:"var(--surface)", overflow:"hidden" }}>

            {/* Panel header */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"12px 18px", borderBottom:"1px solid var(--border)", background:"rgba(255,255,255,0.02)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text-muted)" }}>
                  Pré-visualização
                </span>
                <span style={{ fontSize:10, padding:"2px 8px", borderRadius:99,
                  background:"rgba(123,208,255,0.10)", color:"var(--accent)", fontWeight:600 }}>LIVE</span>
              </div>
              <button onClick={copyHTML} style={{
                padding:"7px 18px", borderRadius:8, border:"none", cursor:"pointer",
                background: copied ? "rgba(16,185,129,0.9)" : "var(--accent)",
                color: copied ? "#fff" : "#081420",
                fontSize:12.5, fontWeight:700, transition:"background 0.15s",
              }}>
                {copied ? "✓ Copiado" : "Copiar HTML"}
              </button>
            </div>

            {/* Canvas */}
            <div style={{ padding:"32px 28px", background:"#f4f5f7", overflowX:"auto" }}>
              <div style={{ display:"inline-block", background:"#fff", borderRadius:8,
                boxShadow:"0 2px 16px rgba(0,0,0,0.07)" }}>

                {/* ══ SIGNATURE ══ */}
                <div id="sig-preview">
                  <table cellPadding={0} cellSpacing={0} border={0}
                    style={{ fontFamily:"Montserrat, Arial, Helvetica, sans-serif", color:"#000000", width:680, maxWidth:680 }}>
                    <tbody>
                      <tr>

                        {/* LEFT BLOCK */}
                        <td width={285} valign="middle" style={{ padding:"22px 28px 22px 28px" }}>
                          <table cellPadding={0} cellSpacing={0} border={0} style={{ width:"100%" }}>
                            <tbody>
                              {/* Logo */}
                              <tr>
                                <td style={{ paddingBottom:22 }}>
                                  <a href={brand.website} style={{ textDecoration:"none" }}>
                                    <div style={{ fontSize:34, lineHeight:"1", fontWeight:500, letterSpacing:"-1px", color:"#000000" }}>
                                      {logo.wordmark}
                                      {logo.suffix && <span style={{ fontWeight:500 }}>{logo.suffix}</span>}
                                      <span style={{ fontWeight:700, color:"#00ade8" }}>.</span>
                                    </div>
                                  </a>
                                </td>
                              </tr>
                              {/* Accent bar */}
                              <tr>
                                <td style={{ paddingBottom:20 }}>
                                  <div style={{ width:46, height:3, background:"#00ade8", lineHeight:"3px", fontSize:"3px" }}>&nbsp;</div>
                                </td>
                              </tr>
                              {/* Name + Role */}
                              <tr>
                                <td>
                                  <div style={{ fontSize:22, lineHeight:"1.25", fontWeight:700, color:"#000000", letterSpacing:"-0.3px" }}>
                                    {form.name}
                                  </div>
                                  <div style={{ fontSize:15, lineHeight:"1.5", fontWeight:400, color:"#777777", paddingTop:3 }}>
                                    {form.role}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>

                        {/* DIVIDER */}
                        <td width={1} style={{ background:"#dddddd", fontSize:"1px", lineHeight:"1px" }}>&nbsp;</td>

                        {/* RIGHT BLOCK */}
                        <td valign="middle" style={{ padding:"22px 0 22px 34px" }}>
                          <table cellPadding={0} cellSpacing={0} border={0}
                            style={{ fontFamily:"Montserrat, Arial, Helvetica, sans-serif", color:"#000000" }}>
                            <tbody>
                              {/* Phone */}
                              <tr>
                                <td width={28} valign="middle" style={{ fontSize:15, color:"#000000", padding:"0 12px 11px 0" }}>T</td>
                                <td valign="middle" style={{ fontSize:15, lineHeight:"1.4", color:"#000000", padding:"0 0 11px 0" }}>
                                  <a href={`tel:${phoneClean}`} style={{ color:"#000000", textDecoration:"none" }}>
                                    {form.phone}
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={2} style={{ height:1, background:"#e6e6e6", lineHeight:"1px", fontSize:"1px" }}>&nbsp;</td>
                              </tr>
                              {/* Email */}
                              <tr>
                                <td width={28} valign="middle" style={{ fontSize:15, color:"#000000", padding:"11px 12px 11px 0" }}>E</td>
                                <td valign="middle" style={{ fontSize:15, lineHeight:"1.4", color:"#000000", padding:"11px 0 11px 0" }}>
                                  <a href={`mailto:${form.email}`} style={{ color:"#000000", textDecoration:"none" }}>
                                    {form.email}
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={2} style={{ height:1, background:"#e6e6e6", lineHeight:"1px", fontSize:"1px" }}>&nbsp;</td>
                              </tr>
                              {/* Website */}
                              <tr>
                                <td width={28} valign="middle" style={{ fontSize:15, color:"#000000", padding:"11px 12px 11px 0" }}>W</td>
                                <td valign="middle" style={{ fontSize:15, lineHeight:"1.4", color:"#000000", padding:"11px 0 11px 0" }}>
                                  <a href={brand.website} style={{ color:"#000000", textDecoration:"none" }}>
                                    {brand.websiteDisplay}
                                  </a>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={2} style={{ height:1, background:"#e6e6e6", lineHeight:"1px", fontSize:"1px" }}>&nbsp;</td>
                              </tr>
                              {/* LinkedIn */}
                              <tr>
                                <td width={28} valign="middle" style={{ fontSize:15, color:"#000000", padding:"11px 12px 0 0" }}>in</td>
                                <td valign="middle" style={{ fontSize:15, lineHeight:"1.4", color:"#000000", padding:"11px 0 0 0" }}>
                                  <a href={form.linkedin} style={{ color:"#000000", textDecoration:"none" }}>
                                    {linkedinDisplay}
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>

                      </tr>

                      {/* DISCLAIMER */}
                      {form.disclaimer && (
                        <tr>
                          <td colSpan={3} style={{ paddingTop:14 }}>
                            <div style={{ fontSize:10, lineHeight:"1.45", color:"#999999", borderTop:"1px solid #eeeeee", paddingTop:10, textAlign:"center" }}>
                              Esta mensagem e seus anexos podem conter informações confidenciais. Caso tenha recebido este e-mail por engano, por favor informe o remetente e exclua a mensagem.
                              <br />
                              This message and its attachments may contain confidential information. If you received this email in error, please notify the sender and delete the message.
                            </div>
                          </td>
                        </tr>
                      )}

                    </tbody>
                  </table>
                </div>
                {/* ══ END SIGNATURE ══ */}

              </div>
            </div>
          </div>

          {/* Tip */}
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 16px",
            borderRadius:10, background:"rgba(0,173,232,0.06)", border:"1px solid rgba(0,173,232,0.14)" }}>
            <span style={{ fontSize:15 }}>💡</span>
            <span style={{ fontSize:12, color:"var(--text-muted)", lineHeight:1.5 }}>
              Clique em <strong style={{ color:"var(--accent)" }}>Copiar HTML</strong>,{" "}
              abra Gmail → Configurações → Assinatura → cole com{" "}
              <kbd style={{ fontSize:11, background:"var(--surface-3)", padding:"1px 6px",
                borderRadius:5, border:"1px solid var(--border)" }}>Ctrl+V</kbd>.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
