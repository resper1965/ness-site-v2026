import { useState, useEffect } from "react";
import { Link } from "react-router";
import { fetchEntries } from "../lib/api";
import { authClient } from "../lib/auth-client";
import { LogoCard } from "../components/brandbook/LogoCard";

export default function BrandbookHub() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManual, setShowManual] = useState(false);

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
      <div className="collection-toolbar" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        {activeOrg && <span className="badge badge-new" style={{ fontSize: 10 }}>{activeOrg.slug}</span>}
        <span style={{ flex: 1 }} />
        <button className="btn btn-ghost btn-sm" onClick={() => setShowManual(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {showManual ? 'Fechar Manual' : 'Como usar'}
        </button>
        <Link to="/crud/brandbook" className="btn btn-ghost btn-sm">Gerenciar Cadastros</Link>
      </div>

      {showManual && (
        <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid var(--accent)' }}>
          <div className="card-header">
            <span className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              Manual Operacional — Brandbook
            </span>
          </div>
          <div style={{ padding: '20px 24px', fontSize: 13, lineHeight: 1.7, color: 'var(--text-muted)' }}>
            <h4 style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>🎨 Cadastrando uma Nova Cor</h4>
            <ol style={{ paddingLeft: 20, marginBottom: 20 }}>
              <li>Clique em <strong style={{ color: 'var(--text)' }}>"Gerenciar Cadastros"</strong> (botão acima).</li>
              <li>Na listagem, clique em <strong style={{ color: 'var(--text)' }}>+ Novo Registro</strong>.</li>
              <li>Preencha o <strong style={{ color: 'var(--text)' }}>Nome do Asset</strong>, selecione a Categoria <code style={{ background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4 }}>cor</code> e insira o Hex.</li>
              <li>Salve. A cor aparecerá automaticamente abaixo.</li>
            </ol>
            <h4 style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>🏷️ Logotipos</h4>
            <p style={{ marginBottom: 20 }}>Siga o mesmo caminho, selecione a Categoria <code style={{ background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4 }}>logo</code> e a Marca correspondente. O sistema gera previews light/dark e downloads automaticamente.</p>
            <div style={{ background: 'var(--surface-2)', borderRadius: 8, padding: '12px 16px', border: '1px solid var(--border)' }}>
              <strong style={{ color: 'var(--accent)', fontSize: 12 }}>💡 DICA</strong>
              <p style={{ margin: '6px 0 0', fontSize: 12 }}>
                Cada ativo é vinculado ao <strong style={{ color: 'var(--text)' }}>tenant ativo</strong>. Troque o tenant no OrgSwitcher para cadastrar ativos de marcas diferentes.
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Colors */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Cores Corporativas</span>
            <span className="toolbar-count">{colors.length} {colors.length === 1 ? "cor" : "cores"}</span>
          </div>
          {colors.length === 0 ? (
            <div className="empty-state" style={{ padding: "32px 16px" }}><p>Nenhuma cor cadastrada para este tenant.</p></div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {colors.map((color: any) => (
                <div key={color.id} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '1rem', minWidth: 160, backgroundColor: 'var(--surface-2)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => navigator.clipboard.writeText(color.hex_value)} title="Clique para copiar">
                  <div style={{ width: '100%', height: 80, backgroundColor: color.hex_value || '#ccc', borderRadius: 8, marginBottom: 12, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)' }} />
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
            <div className="empty-state" style={{ padding: "32px 16px" }}><p>Nenhum logo cadastrado para este tenant.</p></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {logos.map((logo: any) => <LogoCard key={logo.id} logo={logo} />)}
            </div>
          )}
        </div>

        {/* Typography */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Tipografia</span>
            <span className="toolbar-count">{typography.length} {typography.length === 1 ? "fonte" : "fontes"}</span>
          </div>
          {typography.length === 0 ? (
            <div className="empty-state" style={{ padding: "32px 16px" }}><p>Nenhuma fonte cadastrada para este tenant.</p></div>
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
