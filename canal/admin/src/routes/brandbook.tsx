import { useState, useEffect } from "react";
import { fetchEntries } from "../lib/api";

export default function BrandbookHub() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries("brandbook").then((res) => {
      setItems(res.data ?? []);
      setLoading(false);
    });
  }, []);

  const logos = items.filter(i => i.category === "logo");
  const colors = items.filter(i => i.category === "cor");
  const typography = items.filter(i => i.category === "tipografia");

  if (loading) {
    return <div className="loader" />;
  }

  return (
    <div>
      <div className="collection-toolbar" style={{ marginBottom: 20 }}>
        <h2>Brandbook Estratégico</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Colors */}
        <div className="card">
          <h3>Cores Corporativas</h3>
          {colors.length === 0 ? (
             <p style={{ color: 'var(--text-dim)' }}>Nenhuma cor cadastrada.</p>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
              {colors.map((color: any) => (
                <div key={color.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', minWidth: 150 }}>
                  <div style={{ 
                    width: '100%', 
                    height: 60, 
                    backgroundColor: color.hex_value || '#ccc', 
                    borderRadius: 4,
                    marginBottom: 10
                  }} />
                  <div style={{ fontWeight: 'bold' }}>{color.title}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--text-muted)' }}>{color.hex_value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logos */}
        <div className="card">
          <h3>Logos e Marcas</h3>
          {logos.length === 0 ? (
             <p style={{ color: 'var(--text-dim)' }}>Nenhum logo cadastrado.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              {logos.map((logo: any) => (
                <div key={logo.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', textAlign: 'center' }}>
                  {logo.preview_url ? (
                    <img src={logo.preview_url} alt={logo.title} style={{ maxWidth: '100%', maxHeight: 100, objectFit: 'contain' }} />
                  ) : (
                    <div style={{ height: 100, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Sem imagem</div>
                  )}
                  <div style={{ fontWeight: 'bold', marginTop: 10 }}>{logo.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{logo.brand}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tipografia */}
        <div className="card">
          <h3>Tipografia</h3>
          {typography.length === 0 ? (
             <p style={{ color: 'var(--text-dim)' }}>Nenhuma fonte cadastrada.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {typography.map((font: any) => (
                <div key={font.id} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem' }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 5 }}>Aa</div>
                  <div style={{ fontWeight: 'bold' }}>{font.title}</div>
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
