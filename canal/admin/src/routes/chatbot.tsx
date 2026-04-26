import { useEffect, useState, useCallback } from 'react'

interface ChatbotConfig {
  bot_name: string; avatar_url?: string; welcome_message?: string;
  system_prompt?: string; theme_color: string; enabled: number; max_turns: number;
}
interface ChatSession { id: string; visitor_id?: string; locale: string; turn_count: number; csat_score?: number; status: string; created_at: string; }
interface KBDoc { key: string; filename: string; size: number; uploaded: string; }

const API = import.meta.env.VITE_CANAL_URL || ''

export default function ChatbotPage() {
  const [tab, setTab] = useState<'config' | 'analytics' | 'kb'>('config')

  return (
    <div className="page-content">
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['config', 'analytics', 'kb'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`btn ${tab === t ? 'btn-primary' : 'btn-ghost'}`}>
            {t === 'config' ? '⚙️ Configuração' : t === 'analytics' ? '📊 Analytics' : '📚 Knowledge Base'}
          </button>
        ))}
      </div>
      {tab === 'config' ? <ConfigTab /> : tab === 'analytics' ? <AnalyticsTab /> : <KnowledgeBaseTab />}
    </div>
  )
}

function ConfigTab() {
  const [config, setConfig] = useState<ChatbotConfig>({
    bot_name: 'Gabi.OS', theme_color: '#00E5A0', enabled: 1, max_turns: 20,
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/admin/chatbot-config?tenant_id=ness`, { credentials: 'include' })
      .then(r => r.json()).then(setConfig).catch(() => {})
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch(`${API}/api/admin/chatbot-config`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...config, tenant_id: 'ness' }),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h3 style={{ marginBottom: 16 }}>Configuração do Chatbot</h3>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Nome do Bot</span>
            <input className="input" value={config.bot_name} onChange={e => setConfig(c => ({ ...c, bot_name: e.target.value }))} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Mensagem de Boas-vindas</span>
            <textarea className="input" rows={3} value={config.welcome_message || ''} onChange={e => setConfig(c => ({ ...c, welcome_message: e.target.value }))} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>System Prompt (instruções IA)</span>
            <textarea className="input" rows={5} value={config.system_prompt || ''} onChange={e => setConfig(c => ({ ...c, system_prompt: e.target.value }))} style={{ fontFamily: 'monospace', fontSize: 12 }} />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Cor do Tema</span>
              <input type="color" value={config.theme_color} onChange={e => setConfig(c => ({ ...c, theme_color: e.target.value }))} style={{ height: 40, cursor: 'pointer', border: 'none' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Máx. Turnos</span>
              <input type="number" className="input" value={config.max_turns} onChange={e => setConfig(c => ({ ...c, max_turns: parseInt(e.target.value) || 20 }))} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Habilitado</span>
              <select className="input" value={config.enabled} onChange={e => setConfig(c => ({ ...c, enabled: parseInt(e.target.value) }))}>
                <option value={1}>Sim</option>
                <option value={0}>Não</option>
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 8 }}>
            <button className="btn btn-primary" onClick={save} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Configuração'}
            </button>
            {saved && <span style={{ color: '#10b981', fontSize: 13 }}>✓ Salvo com sucesso!</span>}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginTop: 20 }}>
        <h4 style={{ marginBottom: 12 }}>Preview</h4>
        <div style={{ background: '#1a1a2e', borderRadius: 12, padding: 16, maxWidth: 320 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: config.theme_color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
            <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{config.bot_name}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 12, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
            {config.welcome_message || 'Olá! Como posso ajudar?'}
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<{ total_sessions: number; avg_turns: number; avg_csat: number | null; recent: ChatSession[] } | null>(null)

  useEffect(() => {
    fetch(`${API}/api/admin/chat-analytics?tenant_id=ness`, { credentials: 'include' })
      .then(r => r.json()).then(setAnalytics).catch(() => {})
  }, [])

  if (!analytics) return <div className="loader" />

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Analytics do Chat</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{analytics.total_sessions}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sessões totais</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{analytics.avg_turns}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Média de turnos</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{analytics.avg_csat ?? '—'}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>CSAT médio</div>
        </div>
      </div>

      <h4 style={{ marginBottom: 12 }}>Sessões Recentes</h4>
      {analytics.recent.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>Nenhuma sessão registrada.</p>
      ) : (
        <table className="data-table">
          <thead><tr><th>ID</th><th>Idioma</th><th>Turnos</th><th>CSAT</th><th>Status</th><th>Data</th></tr></thead>
          <tbody>
            {analytics.recent.map(s => (
              <tr key={s.id}>
                <td><code style={{ fontSize: 11 }}>{s.id.substring(0, 8)}</code></td>
                <td>{s.locale?.toUpperCase()}</td>
                <td>{s.turn_count}</td>
                <td>{s.csat_score ?? '—'}</td>
                <td><span className="badge" style={{ background: s.status === 'active' ? '#10b981' : '#94a3b8' }}>{s.status}</span></td>
                <td style={{ fontSize: 12 }}>{new Date(s.created_at).toLocaleDateString('pt-BR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <a href={`${API}/api/admin/chat-export?tenant_id=ness`} target="_blank" className="btn btn-ghost" style={{ marginTop: 16 }}>
        ⬇️ Exportar CSV
      </a>
    </div>
  )
}

function KnowledgeBaseTab() {
  const [docs, setDocs] = useState<KBDoc[]>([])
  const [uploading, setUploading] = useState(false)
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    fetch(`${API}/api/admin/knowledge-base?tenant_id=ness`, { credentials: 'include' })
      .then(r => r.json()).then(d => setDocs(d.documents || [])).catch(() => {})
  }, [])

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    await fetch(`${API}/api/admin/knowledge-base/upload?tenant_id=ness`, {
      method: 'POST', credentials: 'include', body: form,
    })
    setUploading(false)
    // Reload
    const res = await fetch(`${API}/api/admin/knowledge-base?tenant_id=ness`, { credentials: 'include' })
    const data = await res.json()
    setDocs(data.documents || [])
  }

  const seed = async () => {
    setSeeding(true)
    await fetch(`${API}/api/admin/seed-vectors?tenant_id=ness`, { method: 'POST', credentials: 'include' })
    setSeeding(false)
  }

  const deleteDoc = async (key: string) => {
    await fetch(`${API}/api/admin/knowledge-base/${key}`, { method: 'DELETE', credentials: 'include' })
    setDocs(prev => prev.filter(d => d.key !== key))
  }

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>Base de Conhecimento (RAG)</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
          {uploading ? 'Enviando...' : '📁 Upload Documento'}
          <input type="file" hidden onChange={upload} accept=".txt,.md,.pdf,.csv,.json" />
        </label>
        <button className="btn btn-ghost" onClick={seed} disabled={seeding}>
          {seeding ? '⏳ Indexando...' : '🧠 Indexar Vetores'}
        </button>
      </div>

      {docs.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>Nenhum documento na base. Faça upload de arquivos TXT, MD ou PDF.</p>
      ) : (
        <table className="data-table">
          <thead><tr><th>Arquivo</th><th>Tamanho</th><th>Upload</th><th>Ações</th></tr></thead>
          <tbody>
            {docs.map(d => (
              <tr key={d.key}>
                <td>📄 {d.filename}</td>
                <td>{(d.size / 1024).toFixed(1)} KB</td>
                <td style={{ fontSize: 12 }}>{new Date(d.uploaded).toLocaleDateString('pt-BR')}</td>
                <td>
                  <button className="btn btn-ghost" style={{ color: '#ef4444', fontSize: 12, padding: '2px 8px' }} onClick={() => deleteDoc(d.key)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
