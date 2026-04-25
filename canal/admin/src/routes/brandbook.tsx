import { useState, useEffect } from "react";
import { Link } from "react-router";
import { fetchEntries } from "../lib/api";
import { authClient } from "../lib/auth-client";

export default function BrandbookHub() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  // Refetch when active org changes
  useEffect(() => {
    setLoading(true);
    fetchEntries("brandbook", { status: "all" }).then((res) => {
      setItems(res.data ?? []);
      setLoading(false);
    }).catch(() => {
      setItems([]);
      setLoading(false);
    });
  }, [activeOrg?.id]);

  const logos = items.filter(i => i.category === "logo");
  const colors = items.filter(i => i.category === "cor");
  const typography = items.filter(i => i.category === "tipografia");

  if (loading) {
    return <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><div className="loader-inline" /></div>;
  }

  return (
    <div>
      <div className="collection-toolbar" style={{ marginBottom: 20, display: "flex", alignItems: "center" }}>
        {activeOrg && <span className="badge badge-new" style={{ fontSize: 10 }}>{activeOrg.slug}</span>}
        <span style={{ flex: 1 }} />
        <Link to="/crud/brandbook" className="btn btn-ghost btn-sm">
          Gerenciar Cadastros
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Colors */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Cores Corporativas</span>
            <span className="toolbar-count">{colors.length} {colors.length === 1 ? "cor" : "cores"}</span>
          </div>
          {colors.length === 0 ? (
             <div className="empty-state" style={{ padding: "32px 16px" }}>
               <p>Nenhuma cor cadastrada para este tenant.</p>
             </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {colors.map((color: any) => (
                <div 
                  key={color.id} 
                  style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '1rem', minWidth: 160, backgroundColor: 'var(--surface-2)', cursor: 'pointer', transition: 'all 0.2s', position: 'relative' }}
                  onClick={() => { navigator.clipboard.writeText(color.hex_value); }}
                  title="Clique para copiar"
                >
                  <div style={{ 
                    width: '100%', 
                    height: 80, 
                    backgroundColor: color.hex_value || '#ccc', 
                    borderRadius: 8,
                    marginBottom: 12,
                    boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                  }} />
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{color.title}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-muted)' }}>{color.hex_value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logos */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Logos e Marcas</span>
            <span className="toolbar-count">{logos.length} {logos.length === 1 ? "logo" : "logos"}</span>
          </div>
          {logos.length === 0 ? (
             <div className="empty-state" style={{ padding: "32px 16px" }}>
               <p>Nenhum logo cadastrado para este tenant.</p>
             </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {logos.map((logo: any) => {
                const isSynthetic = !logo.preview_url;
                const parts = logo.title.split('.');

                const handleDownloadSVG = () => {
                  const width = logo.title.length * 15 + 10;
                  
                  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 32" width="${width}" height="32">`;
                  svg += `<style>@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500&amp;display=swap'); text { font-family: 'Montserrat', Arial, sans-serif; }</style>`;
                  
                  if (parts.length === 1) {
                    svg += `<text x="0" y="26" font-size="26" font-weight="500" letter-spacing="-0.03em" fill="#0b1326">${parts[0]}</text>`;
                  } else {
                    const p0Width = parts[0].length * 15;
                    svg += `<text x="0" y="26" font-size="26" font-weight="500" letter-spacing="-0.03em" fill="#0b1326">${parts[0]}</text>`;
                    svg += `<text x="${p0Width}" y="26" font-size="26" font-weight="500" letter-spacing="-0.03em" fill="#00ade8">.</text>`;
                    if (parts[1]) {
                      svg += `<text x="${p0Width + 9}" y="26" font-size="26" font-weight="500" letter-spacing="-0.03em" fill="#0b1326">${parts[1]}</text>`;
                    }
                  }
                  svg += `</svg>`;

                  const blob = new Blob([svg], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(blob);
                  downloadUrl(url, `${logo.title.replace('.', '')}-logo-transparent.svg`);
                };

                const handleDownloadPNG = () => {
                  // Use a canvas to draw with the document's loaded fonts
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  if (!ctx) return;
                  
                  // Setup size with some padding, high-res for better quality
                  const scale = 4;
                  canvas.width = (logo.title.length * 15 + 20) * scale;
                  canvas.height = 40 * scale;
                  
                  ctx.scale(scale, scale);
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.font = '500 26px Montserrat, Arial, sans-serif';
                  ctx.textBaseline = 'top';
                  
                  let currentX = 0;
                  // First text part
                  ctx.fillStyle = '#0b1326';
                  ctx.fillText(parts[0], currentX, 4);
                  currentX += ctx.measureText(parts[0]).width - 2; // adjust spacing
                  
                  if (parts.length > 1) {
                    // Dot
                    ctx.fillStyle = '#00ade8';
                    ctx.fillText('.', currentX, 4);
                    currentX += ctx.measureText('.').width - 2;
                    
                    // Second part
                    if (parts[1]) {
                      ctx.fillStyle = '#0b1326';
                      ctx.fillText(parts[1], currentX, 4);
                    }
                  }
                  
                  const url = canvas.toDataURL('image/png');
                  downloadUrl(url, `${logo.title.replace('.', '')}-logo-transparent.png`);
                };

                const downloadUrl = (url: string, filename: string) => {
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                };

                return (
                  <div key={logo.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', textAlign: 'center', background: 'var(--surface-2)', position: 'relative' }}>
                    {logo.preview_url ? (
                      <img src={logo.preview_url} alt={logo.title} style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }} />
                    ) : (
                      <div style={{ height: 100, backgroundColor: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
                        <span style={{ fontWeight: 500, fontFamily: 'Montserrat, sans-serif', fontSize: 26, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                          {parts.map((part: string, i: number, arr: string[]) => (
                            <span key={i}>
                              {part}
                              {i < arr.length - 1 && <span style={{ color: '#00ade8' }}>.</span>}
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                    <div style={{ fontWeight: 600, marginTop: 16, fontSize: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      {logo.title}
                    </div>
                    {isSynthetic ? (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
                        <button 
                          onClick={handleDownloadPNG}
                          style={{ background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 4px rgba(0, 173, 232, 0.2)' }}
                          title="Baixar Logotipo Vetorial (PNG Transparente Alta Qualidade)"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                          PNG
                        </button>
                        <button 
                          onClick={handleDownloadSVG}
                          style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Baixar Logotipo Vetorial (SVG de fundo transparente)"
                        >
                          SVG
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                         <button 
                          onClick={() => navigator.clipboard.writeText(logo.title)}
                          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px 8px', borderRadius: 4, fontSize: 11 }}
                          title="Copiar texto do logo"
                        >
                          Copiar Nome
                        </button>
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{logo.brand}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tipografia */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Tipografia</span>
            <span className="toolbar-count">{typography.length} {typography.length === 1 ? "fonte" : "fontes"}</span>
          </div>
          {typography.length === 0 ? (
             <div className="empty-state" style={{ padding: "32px 16px" }}>
               <p>Nenhuma fonte cadastrada para este tenant.</p>
             </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {typography.map((font: any) => (
                <div key={font.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', background: 'var(--surface-2)' }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 5, color: 'var(--text)' }}>Aa</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{font.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 5 }}>{font.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
