import { useState } from "react";
import { createEntry } from "../lib/api";

const BRANDS = ["ness", "trustness", "forense"];
const DEPARTMENTS = ["Diretoria", "Engenharia", "Comercial", "Operações", "RH", "Financeiro", "Marketing", "Cybersecurity", "Legal", "Infraestrutura"];

/* ── Brand config: cor + logo SVG inline (email-safe) ──────────── */
const BRAND_CONFIG: Record<string, { color: string; name: string; logo: string }> = {
  ness: {
    color: "#000000",
    name: "ness.",
    logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32" width="60" height="16"><text x="0" y="26" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="#000">ness</text><text x="60" y="26" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="#00ade8">.</text></svg>`,
  },
  trustness: {
    color: "#2563EB",
    name: "trustness.",
    logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 32" width="80" height="16"><text x="0" y="26" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#2563EB">trustness</text><text x="110" y="26" font-family="Arial,sans-serif" font-size="28" font-weight="bold" fill="#00ade8">.</text></svg>`,
  },
  forense: {
    color: "#052e16",
    name: "forense.io",
    logo: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 32" width="70" height="16"><text x="0" y="26" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="#052e16">forense</text><text x="85" y="26" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#00ade8">.</text><text x="95" y="26" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="#052e16">io</text></svg>`,
  },
};

const LINKEDIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A66C2" width="16" height="16"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;
const GITHUB_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#111827" width="16" height="16"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function SignaturesHub() {
  const [form, setForm] = useState({
    name: "João Silva",
    role: "Engenheiro de Software",
    email: "joao.silva@ness.com.br",
    phone: "+55 (11) 99999-9999",
    brand: "ness",
    department: "Engenharia",
    linkedin: "https://linkedin.com/in/joaosilva",
    github: "https://github.com/joaosilva"
  });

  const [saving, setSaving] = useState(false);

  const handlePhoneChange = (val: string) => {
    let clean = val.replace(/\\D/g, '');
    if (clean.startsWith('55')) {
      clean = clean.substring(2);
    }
    const match = clean.match(/^(\\d{0,2})(\\d{0,5})(\\d{0,4})$/);
    if (!match && clean.length > 0) return setForm({...form, phone: val});
    if (!match) return setForm({...form, phone: ""});
    
    let out = "";
    if (match[1]) out += `+55 (${match[1]}`;
    if (match[2]) out += `) ${match[2]}`;
    if (match[3] && match[2].length === 5) {
      out += `-${match[3]}`;
    } else if (match[3] && match[2].length === 4 && clean.length === 10) { 
      // handle 8-digit phones dynamically
      out += `-${match[3]}`;
    }
    setForm({ ...form, phone: out });
  };

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
    const html = document.getElementById("signature-preview")?.innerHTML || "";
    const cleanedHtml = html.replace(/<!--.*?-->/g, '');
    navigator.clipboard.writeText(cleanedHtml);
    alert("HTML copiado para a área de transferência!");
  };

  const brand = BRAND_CONFIG[form.brand] || BRAND_CONFIG.ness;
  const logoDataUri = svgToDataUri(brand.logo);
  const linkedinDataUri = svgToDataUri(LINKEDIN_SVG);
  const githubDataUri = svgToDataUri(GITHUB_SVG);

  return (
    <div className="signatures-container" style={{ animation: 'fade-in 0.3s ease-out' }}>
      <div className="collection-toolbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 600, margin: 0, color: 'var(--text)' }}>Gerador de Assinatura</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '14px' }}>Crie assinaturas corporativas elegantes e modernas.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={saving}
          style={{ transition: 'all 0.2s', padding: '10px 20px', borderRadius: '8px', fontWeight: 500 }}
        >
          {saving ? "Salvando..." : "Salvar no Histórico"}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(450px, 1.2fr)', gap: '24px', alignItems: 'start' }}>
        {/* Formulário Profissional */}
        <div className="card" style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-50)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--border)', paddingBottom: '12px', color: 'var(--text)' }}>
            Detalhes do Colaborador
          </h3>
          
          <div className="form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="field">
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Nome Completo</label>
              <input 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                placeholder="Ex: Ana Souza"
              />
            </div>

            <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="field">
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Cargo</label>
                <input 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                  value={form.role} 
                  onChange={e => setForm({...form, role: e.target.value})} 
                />
              </div>
              <div className="field">
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Departamento</label>
                <select 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                  value={form.department} 
                  onChange={e => setForm({...form, department: e.target.value})}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="field">
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Email</label>
                <input 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                  type="email"
                  value={form.email} 
                  onChange={e => setForm({...form, email: e.target.value})} 
                />
              </div>
              <div className="field">
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Telefone / Celular</label>
                <input 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                  value={form.phone} 
                  onChange={e => handlePhoneChange(e.target.value)} 
                  placeholder="+55 (00) 00000-0000"
                />
              </div>
            </div>

            <div className="field">
              <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>Marca</label>
              <select 
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                value={form.brand} 
                onChange={e => setForm({...form, brand: e.target.value})}
              >
                {BRANDS.map(b => <option key={b} value={b}>{BRAND_CONFIG[b]?.name || b}</option>)}
              </select>
            </div>

            <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="field">
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>URL do LinkedIn (Opcional)</label>
                <input 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                  value={form.linkedin} 
                  placeholder="https://linkedin.com/in/..."
                  onChange={e => setForm({...form, linkedin: e.target.value})} 
                />
              </div>

              <div className="field">
                <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>URL do GitHub (Opcional)</label>
                <input 
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                  value={form.github} 
                  placeholder="https://github.com/..."
                  onChange={e => setForm({...form, github: e.target.value})} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '24px' }}>
          <div className="card" style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--surface-50)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>Visualização Real</h3>
              <button 
                onClick={copyHTML}
                style={{ padding: '6px 16px', borderRadius: '6px', border: '1px solid var(--accent)', backgroundColor: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0, 173, 232, 0.2)' }}
              >
                Copiar HTML
              </button>
            </div>
            
            {/* The actual HTML Signature Wrapper */}
            <div style={{ padding: '32px 24px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', overflowX: 'auto' }}>
              <div id="signature-preview">
                <table cellPadding={0} cellSpacing={0} border={0} style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', backgroundColor: '#ffffff', color: '#111827' }}>
                  <tbody>
                    <tr>
                      <td valign="top" style={{ paddingLeft: '0px', verticalAlign: 'top' }}>
                        <table cellPadding={0} cellSpacing={0} border={0} width="100%">
                          <tbody>
                            <tr>
                              <td style={{ paddingBottom: '2px' }}>
                                <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0px', lineHeight: 1.2 }}>
                                  {form.name}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ paddingBottom: '16px' }}>
                                <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#4B5563', margin: '0px', letterSpacing: '0.02em', lineHeight: 1.4 }}>
                                  <span style={{ fontWeight: 600 }}>{form.role}</span>
                                  {form.department && (
                                    <span> &nbsp;|&nbsp; {form.department}</span>
                                  )}
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <table cellPadding={0} cellSpacing={0} border={0} width="100%">
                          <tbody>
                            {form.phone && (
                              <tr>
                                <td style={{ paddingBottom: '4px' }}>
                                  <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#9CA3AF', fontWeight: 'bold', paddingRight: '8px' }}>T</span>
                                  <a href={`tel:${form.phone.replace(/[^0-9+]/g, '')}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#111827', textDecoration: 'none' }}>
                                    {form.phone}
                                  </a>
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td style={{ paddingBottom: '4px' }}>
                                <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#9CA3AF', fontWeight: 'bold', paddingRight: '8px' }}>E</span>
                                <a href={`mailto:${form.email}`} style={{ fontFamily: 'Arial, sans-serif', fontSize: '13px', color: brand.color, textDecoration: 'none', fontWeight: 500 }}>
                                  {form.email}
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ paddingTop: '16px', paddingBottom: '4px' }}>
                                <table cellPadding={0} cellSpacing={0} border={0}>
                                  <tbody>
                                    <tr>
                                      <td style={{ paddingRight: '12px', verticalAlign: 'middle' }}>
                                        <a href={`https://${brand.name === 'forense.io' ? 'forense.io' : 'ness.com.br'}`} style={{ textDecoration: 'none', display: 'block' }}>
                                          <img alt={brand.name} height="18" src={logoDataUri} style={{ display: 'block', height: '18px', border: '0px' }} />
                                        </a>
                                      </td>
                                      {form.linkedin && (
                                        <td style={{ verticalAlign: 'middle', paddingLeft: '12px', borderLeft: '1px solid #E5E7EB' }}>
                                          <a href={form.linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', lineHeight: '0' }}>
                                            <img alt="LinkedIn" width="16" height="16" src={linkedinDataUri} style={{ width: '16px', height: '16px', border: '0px', display: 'block' }} />
                                          </a>
                                        </td>
                                      )}
                                      {form.github && (
                                        <td style={{ verticalAlign: 'middle', paddingLeft: '8px' }}>
                                          <a href={form.github} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', lineHeight: '0' }}>
                                            <img alt="GitHub" width="16" height="16" src={githubDataUri} style={{ width: '16px', height: '16px', border: '0px', display: 'block' }} />
                                          </a>
                                        </td>
                                      )}
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, backgroundColor: 'rgba(0,173,232,0.1)', padding: '12px', borderRadius: '6px', border: '1px solid rgba(0,173,232,0.2)' }}>
              <strong style={{ color: 'var(--accent)' }}>Dica de Instalação:</strong> Use o botão "Copiar HTML", abra as configurações do seu cliente de email (Gmail/Outlook) e use Ctrl+V / Cmd+V diretamente na caixa de edição visual.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
