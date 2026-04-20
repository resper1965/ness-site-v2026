import { useState, useEffect } from "react";
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
      <div className="collection-toolbar" style={{ marginBottom: 20 }}>
        <h2>Brandbook {activeOrg ? `— ${activeOrg.name}` : "— Global (Ness)"}</h2>
        {activeOrg && <span className="badge badge-new" style={{ fontSize: 10 }}>{activeOrg.slug}</span>}
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
              {logos.map((logo: any) => (
                <div key={logo.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', textAlign: 'center', background: 'var(--surface-2)' }}>
                  {logo.preview_url ? (
                    <img src={logo.preview_url} alt={logo.title} style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }} />
                  ) : (
                    <div style={{ height: 100, backgroundColor: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05)' }}>
                      <span style={{ fontWeight: 600, fontFamily: 'Montserrat, sans-serif', fontSize: 26, letterSpacing: '-0.03em', color: 'var(--text)' }}>
                        {logo.title.split('.').map((part: string, i: number, arr: string[]) => (
                          <span key={i}>
                            {part}
                            {i < arr.length - 1 && <span style={{ color: '#00ade8' }}>.</span>}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}
                  <div style={{ fontWeight: 600, marginTop: 16, fontSize: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                    {logo.title}
                    <button 
                      onClick={() => navigator.clipboard.writeText(logo.title)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.5, padding: 2 }}
                      title="Copiar texto do logo"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                    </button>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{logo.brand}</div>
                </div>
              ))}
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
