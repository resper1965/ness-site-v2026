import { useEffect, useState } from 'react'
import { useSession, authClient } from '../lib/auth-client'

interface DSARRequest {
  id: string; requester_name: string; requester_email: string; request_type: string;
  status: string; sla_deadline: string; created_at: string; description?: string;
}
interface WhistleblowerCase {
  id: string; case_code: string; category: string; status: string;
  sla_deadline: string; created_at: string;
}
interface Policy {
  id: string; type: string; locale: string; title: string; body_md: string;
  version: number; status: string; effective_date?: string; created_at: string;
}

const API = import.meta.env.VITE_CANAL_URL || ''
const STATUS_COLORS: Record<string, string> = {
  received: '#f59e0b', 'in-progress': '#3b82f6', resolved: '#10b981', rejected: '#ef4444',
  new: '#f59e0b', investigating: '#3b82f6', closed: '#10b981',
  draft: '#94a3b8', published: '#10b981',
}

export default function CompliancePage() {
  const [tab, setTab] = useState<'dsar' | 'whistleblower' | 'policies'>('dsar')
  const [dsars, setDsars] = useState<DSARRequest[]>([])
  const [cases, setCases] = useState<WhistleblowerCase[]>([])
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    Promise.all([
      fetch(`${API}/api/admin/dsar?tenant_id=ness`, { headers, credentials: 'include' }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/admin/whistleblower?tenant_id=ness`, { headers, credentials: 'include' }).then(r => r.json()).catch(() => []),
      fetch(`${API}/api/admin/policies?tenant_id=ness`, { headers, credentials: 'include' }).then(r => r.json()).catch(() => []),
    ]).then(([d, w, p]) => {
      setDsars(Array.isArray(d) ? d : [])
      setCases(Array.isArray(w) ? w : [])
      setPolicies(Array.isArray(p) ? p : [])
      setLoading(false)
    })
  }, [])

  const updateDsar = async (id: string, status: string) => {
    await fetch(`${API}/api/admin/dsar/${id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, tenant_id: 'ness' }),
    })
    setDsars(prev => prev.map(d => d.id === id ? { ...d, status } : d))
  }

  const updateCase = async (id: string, status: string) => {
    await fetch(`${API}/api/admin/whistleblower/${id}`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  const [newPolicy, setNewPolicy] = useState({ type: 'privacy', locale: 'pt', title: '', body_md: '' })
  const createPolicy = async () => {
    if (!newPolicy.title || !newPolicy.body_md) return
    const res = await fetch(`${API}/api/admin/policies`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newPolicy, tenant_id: 'ness' }),
    })
    const data = await res.json()
    if (data.success) {
      setPolicies(prev => [{ ...newPolicy, id: data.id, version: 1, status: 'draft', created_at: new Date().toISOString() }, ...prev])
      setNewPolicy({ type: 'privacy', locale: 'pt', title: '', body_md: '' })
    }
  }

  function slaStatus(deadline: string) {
    const d = new Date(deadline)
    const now = new Date()
    const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diff < 0) return { label: `${Math.abs(diff)}d atrasado`, color: '#ef4444' }
    if (diff <= 3) return { label: `${diff}d restantes`, color: '#f59e0b' }
    return { label: `${diff}d restantes`, color: '#10b981' }
  }

  return (
    <div className="page-content">
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['dsar', 'whistleblower', 'policies'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`btn ${tab === t ? 'btn-primary' : 'btn-ghost'}`}>
            {t === 'dsar' ? '📋 DSAR' : t === 'whistleblower' ? '🔒 Canal Denúncia' : '📄 Políticas'}
          </button>
        ))}
      </div>

      {loading ? <div className="loader" /> : tab === 'dsar' ? (
        <div>
          <h3 style={{ marginBottom: 16 }}>Solicitações de Titulares (LGPD)</h3>
          {dsars.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma solicitação recebida ainda.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>Protocolo</th><th>Nome</th><th>Tipo</th><th>Status</th><th>SLA</th><th>Ações</th></tr></thead>
              <tbody>
                {dsars.map(d => {
                  const sla = slaStatus(d.sla_deadline)
                  return (
                    <tr key={d.id}>
                      <td><code>{d.id.substring(0, 8).toUpperCase()}</code></td>
                      <td>{d.requester_name}</td>
                      <td><span className="badge">{d.request_type}</span></td>
                      <td><span className="badge" style={{ background: STATUS_COLORS[d.status] || '#94a3b8' }}>{d.status}</span></td>
                      <td><span style={{ color: sla.color, fontWeight: 600, fontSize: 12 }}>{sla.label}</span></td>
                      <td>
                        <select value={d.status} onChange={e => updateDsar(d.id, e.target.value)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                          <option value="received">Recebido</option>
                          <option value="in-progress">Em análise</option>
                          <option value="resolved">Resolvido</option>
                          <option value="rejected">Rejeitado</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : tab === 'whistleblower' ? (
        <div>
          <h3 style={{ marginBottom: 16 }}>Canal de Denúncia (Anônimo)</h3>
          {cases.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma denúncia registrada.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>Código</th><th>Categoria</th><th>Status</th><th>SLA</th><th>Data</th><th>Ações</th></tr></thead>
              <tbody>
                {cases.map(c => {
                  const sla = slaStatus(c.sla_deadline)
                  return (
                    <tr key={c.id}>
                      <td><code style={{ fontWeight: 700 }}>{c.case_code}</code></td>
                      <td>{c.category || '—'}</td>
                      <td><span className="badge" style={{ background: STATUS_COLORS[c.status] || '#94a3b8' }}>{c.status}</span></td>
                      <td><span style={{ color: sla.color, fontWeight: 600, fontSize: 12 }}>{sla.label}</span></td>
                      <td style={{ fontSize: 12 }}>{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <select value={c.status} onChange={e => updateCase(c.id, e.target.value)} style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                          <option value="new">Novo</option>
                          <option value="investigating">Investigando</option>
                          <option value="closed">Encerrado</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div>
          <h3 style={{ marginBottom: 16 }}>Políticas & Termos</h3>
          <div className="card" style={{ padding: 16, marginBottom: 24 }}>
            <h4 style={{ marginBottom: 12 }}>Nova Política</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <select value={newPolicy.type} onChange={e => setNewPolicy(p => ({ ...p, type: e.target.value }))} className="input">
                <option value="privacy">Privacidade</option>
                <option value="terms">Termos de Uso</option>
                <option value="cookie">Cookies</option>
                <option value="lgpd">LGPD</option>
              </select>
              <select value={newPolicy.locale} onChange={e => setNewPolicy(p => ({ ...p, locale: e.target.value }))} className="input">
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            <input type="text" placeholder="Título da política" value={newPolicy.title} onChange={e => setNewPolicy(p => ({ ...p, title: e.target.value }))} className="input" style={{ width: '100%', marginBottom: 12 }} />
            <textarea placeholder="Conteúdo em Markdown..." value={newPolicy.body_md} onChange={e => setNewPolicy(p => ({ ...p, body_md: e.target.value }))} className="input" rows={6} style={{ width: '100%', marginBottom: 12, fontFamily: 'monospace' }} />
            <button className="btn btn-primary" onClick={createPolicy}>Criar Política</button>
          </div>

          {policies.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>Nenhuma política cadastrada.</p>
          ) : (
            <table className="data-table">
              <thead><tr><th>Tipo</th><th>Título</th><th>Idioma</th><th>Versão</th><th>Status</th><th>Data</th></tr></thead>
              <tbody>
                {policies.map(p => (
                  <tr key={p.id}>
                    <td><span className="badge">{p.type}</span></td>
                    <td>{p.title}</td>
                    <td>{p.locale.toUpperCase()}</td>
                    <td>v{p.version}</td>
                    <td><span className="badge" style={{ background: STATUS_COLORS[p.status] || '#94a3b8' }}>{p.status}</span></td>
                    <td style={{ fontSize: 12 }}>{new Date(p.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
