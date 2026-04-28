import { useEffect, useState } from 'react'
import { authClient } from '../lib/auth-client'

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

// We replace legacy STATUS_COLORS with styling classes explicitly in rendering

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
    if (diff < 0) return { label: `${Math.abs(diff)}d atrasado`, colorClass: 'text-red-500 bg-red-500/10 border border-red-500/20' }
    if (diff <= 3) return { label: `${diff}d restantes`, colorClass: 'text-amber-500 bg-amber-500/10 border border-amber-500/20' }
    return { label: `${diff}d restantes`, colorClass: 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' }
  }

  return (
    <div className="mx-auto max-w-7xl w-full flex-1 min-w-0 p-6 md:p-8 pt-6 md:pt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 border-b border-border/50 pb-6 relative shrink-0">
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent"></div>
        <div>
           <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground/60" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M10 12l2 2 4-4"/></svg>
             Aegis <span className="text-muted-foreground/30 font-light mx-1">/</span> Compliance
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
             Governança, Políticas e Privacidade de Dados
          </p>
        </div>
        
        {/* Apple Segmented Control */}
        <div className="inline-flex h-10 items-center justify-center rounded-xl bg-muted/40 border border-border/50 p-1 text-muted-foreground w-full xl:w-auto flex-nowrap overflow-x-auto overflow-y-hidden custom-scrollbar">
          {(['dsar', 'whistleblower', 'policies'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all min-w-max ${
                tab === t
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "hover:text-foreground hover:bg-muted/80 opacity-80"
              }`}
            >
              {t === 'dsar' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>}
              {t === 'whistleblower' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
              {t === 'policies' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
              {t === 'dsar' ? 'Solicitações DSAR' : t === 'whistleblower' ? 'Denúncias' : 'Políticas'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-20 animate-pulse"><div className="loader-inline" /></div>
      ) : tab === 'dsar' ? (
        <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-muted/30 p-5 px-6 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Solicitações de Titulares de Dados (LGPD/DSAR)</h3>
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-xl text-xs font-medium uppercase tracking-wide text-primary bg-primary/10 px-4 border border-primary/20 hover:bg-primary/20 transition-all shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Conectar OneTrust / Externo
            </button>
          </div>
          {dsars.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-16 m-6 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-accent/20 border border-border/50 text-accent flex items-center justify-center mb-4 shadow-sm">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M12 7V2"/><path d="M3 15h2"/><path d="M19 15h2"/><path d="M4 8l1.4 1.4"/><path d="M20 8l-1.4 1.4"/></svg>
              </div>
              <h4 className="text-sm font-semibold tracking-wide text-foreground">SLA Cumprido</h4>
              <p className="text-xs text-muted-foreground mt-1 max-w-[300px]">Sem solicitações ativas no funil DSAR.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto min-w-0 max-w-full custom-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-background/40 text-xs uppercase tracking-wide text-muted-foreground text-left">
                    <th className="font-bold py-3.5 px-6">ID Protocolo</th>
                    <th className="font-bold py-3.5 px-4">Titular (Nome)</th>
                    <th className="font-bold py-3.5 px-4">Categoria do Pedido</th>
                    <th className="font-bold py-3.5 px-4">Status Interno</th>
                    <th className="font-bold py-3.5 px-4">Termômetro SLA</th>
                    <th className="font-bold py-3.5 px-6 text-right w-[150px]">Diretivas</th>
                  </tr>
                </thead>
                <tbody>
                  {dsars.map(d => {
                    const sla = slaStatus(d.sla_deadline)
                    return (
                      <tr key={d.id} className="border-b border-border/20 transition-colors hover:bg-muted/30">
                        <td className="py-3 px-6">
                           <code className="font-mono bg-muted/40 border border-border/60 px-2 py-0.5 rounded-md text-foreground text-xs uppercase font-medium tracking-wide">{d.id.substring(0, 8)}</code>
                        </td>
                        <td className="py-3 px-4 font-bold text-sm text-foreground">{d.requester_name}</td>
                        <td className="py-3 px-4">
                           <span className="inline-flex items-center shadow-sm rounded-md bg-muted/50 border border-border/60 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                              {d.request_type}
                           </span>
                        </td>
                        <td className="py-3 px-4">
                           <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide border shadow-sm ${
                              d.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                              d.status === 'rejected' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' :
                              d.status === 'in-progress' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                              'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                           }`}>
                              {d.status}
                           </span>
                        </td>
                        <td className="py-3 px-4">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs uppercase font-medium tracking-wide shadow-sm ${sla.colorClass}`}>
                             {sla.label}
                           </span>
                        </td>
                        <td className="py-3 px-6 flex justify-end">
                          <select 
                            value={d.status} 
                            onChange={e => updateDsar(d.id, e.target.value)} 
                            className="flex h-9 w-[140px] items-center justify-between rounded-xl border border-border/50 bg-background/50 px-3 py-1 text-xs uppercase tracking-wide transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-bold appearance-none cursor-pointer"
                          >
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
            </div>
          )}
        </div>
      ) : tab === 'whistleblower' ? (
        <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-muted/30 p-5 px-6 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Canal de Denúncias Anônimo (Whistleblower)</h3>
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-xl text-xs font-medium uppercase tracking-wide text-primary bg-primary/10 px-4 border border-primary/20 hover:bg-primary/20 transition-all shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Conectar Sistema Terceiro
            </button>
          </div>
          {cases.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-16 m-6 flex flex-col items-center justify-center text-center">
               <div className="h-16 w-16 rounded-full bg-accent/20 border border-border/50 text-accent flex items-center justify-center mb-4 shadow-sm">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
               </div>
               <h4 className="text-sm font-semibold tracking-wide text-foreground">Zero Relatos</h4>
               <p className="text-xs text-muted-foreground mt-1 max-w-[300px]">Nenhuma incidência listada anonimamente pela organização.</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto min-w-0 max-w-full custom-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-background/40 text-xs uppercase tracking-wide text-muted-foreground text-left">
                    <th className="font-bold py-3.5 px-6">Ghost Code</th>
                    <th className="font-bold py-3.5 px-4">Classificação de Incidência</th>
                    <th className="font-bold py-3.5 px-4">Status Interno</th>
                    <th className="font-bold py-3.5 px-4">Termômetro SLA</th>
                    <th className="font-bold py-3.5 px-4">Timestamp (UTC)</th>
                    <th className="font-bold py-3.5 px-6 text-right w-[150px]">Diretivas</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(c => {
                    const sla = slaStatus(c.sla_deadline)
                    return (
                      <tr key={c.id} className="border-b border-border/20 transition-colors hover:bg-muted/30">
                        <td className="py-3 px-6">
                           <code className="font-mono bg-muted/40 border border-border/60 px-2 py-0.5 rounded-md text-foreground text-xs uppercase font-medium tracking-wide">{c.case_code}</code>
                        </td>
                        <td className="py-3 px-4 font-bold text-sm text-foreground uppercase tracking-wide">{c.category || '—'}</td>
                        <td className="py-3 px-4">
                           <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide border shadow-sm ${
                              c.status === 'closed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                              c.status === 'investigating' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' :
                              'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                           }`}>
                              {c.status}
                           </span>
                        </td>
                        <td className="py-3 px-4">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs uppercase font-medium tracking-wide shadow-sm ${sla.colorClass}`}>
                             {sla.label}
                           </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-muted-foreground tracking-wide">{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="py-3 px-6 flex justify-end">
                          <select 
                            value={c.status} 
                            onChange={e => updateCase(c.id, e.target.value)} 
                            className="flex h-9 w-[140px] items-center justify-between rounded-xl border border-border/50 bg-background/50 px-3 py-1 text-xs uppercase tracking-wide transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-bold appearance-none cursor-pointer"
                          >
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
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden sticky top-6">
               <div className="bg-muted/30 p-5 px-6 border-b border-border/50">
                  <h3 className="text-sm font-semibold text-foreground">Cunhar Nova Política</h3>
               </div>
               <div className="p-6 md:p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-5">
                    <div className="space-y-3">
                       <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Domínio</label>
                       <select value={newPolicy.type} onChange={e => setNewPolicy(p => ({ ...p, type: e.target.value }))} className="flex h-11 w-full items-center justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-xs font-medium uppercase tracking-wide transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer text-foreground appearance-none">
                          <option value="privacy">PRIVACIDADE</option>
                          <option value="terms">TERMOS E USO</option>
                          <option value="cookie">COOKIES INFO</option>
                          <option value="lgpd">DPA / LGPD</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Idioma Alvo</label>
                       <select value={newPolicy.locale} onChange={e => setNewPolicy(p => ({ ...p, locale: e.target.value }))} className="flex h-11 w-full items-center justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-xs font-medium uppercase tracking-wide transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary cursor-pointer text-foreground appearance-none">
                          <option value="pt">PT-BR</option>
                          <option value="en">EN-US</option>
                          <option value="es">ES-ES</option>
                       </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Título do Contrato</label>
                     <input type="text" placeholder="Nomeie o documento formal" value={newPolicy.title} onChange={e => setNewPolicy(p => ({ ...p, title: e.target.value }))} className="flex h-11 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm font-bold transition-all focus:bg-background hover:bg-background placeholder:text-muted-foreground/50 placeholder:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50" />
                  </div>
                  <div className="space-y-3">
                     <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Corpo (Markdown Format)</label>
                     <textarea placeholder="## 1. Disposições Iniciais..." value={newPolicy.body_md} onChange={e => setNewPolicy(p => ({ ...p, body_md: e.target.value }))} rows={8} className="flex w-full rounded-xl border border-border/50 bg-background font-mono text-foreground p-5 text-xs leading-relaxed tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-y" />
                  </div>
                  <div className="pt-4">
                     <button className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-foreground text-background px-6 font-medium text-xs tracking-wide shadow-sm hover:bg-foreground/90 hover:shadow-md transition-all disabled:opacity-50 disabled:hover:shadow-sm" onClick={createPolicy} disabled={!newPolicy.title || !newPolicy.body_md}>
                        Publicar Documento Padrão
                     </button>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden h-full flex flex-col">
               <div className="bg-muted/30 p-5 px-6 border-b border-border/50">
                  <h3 className="text-sm font-semibold text-foreground">Diretório Global de Termos de Uso (DGT)</h3>
               </div>
               {policies.length === 0 ? (
                 <div className="flex-1 rounded-bl-2xl rounded-br-2xl border-dashed border-t-0 border-border/60 bg-muted/10 p-16 flex flex-col items-center justify-center text-center mt-4 mx-4 mb-4 border relative">
                    <div className="h-16 w-16 rounded-full bg-accent/20 border border-border/50 text-accent flex items-center justify-center mb-4 shadow-sm">
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    </div>
                    <h4 className="text-sm font-semibold tracking-wide text-foreground">Sem Histórico DGT</h4>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[300px]">Nenhuma política gerada neste tenant de infraestrutura.</p>
                 </div>
               ) : (
                 <div className="w-full overflow-x-auto min-w-0 max-w-full custom-scrollbar flex-1">
                   <table className="w-full text-sm">
                     <thead>
                       <tr className="border-b border-border/50 bg-background/40 text-xs uppercase tracking-wide text-muted-foreground text-left">
                         <th className="font-bold py-3.5 px-6">Label de Arquivo</th>
                         <th className="font-bold py-3.5 px-4 w-[80px] text-center">Lang</th>
                         <th className="font-bold py-3.5 px-4">Index / v</th>
                         <th className="font-bold py-3.5 px-4">Status Deploy</th>
                         <th className="font-bold py-3.5 px-6 text-right">Git Timestamp</th>
                       </tr>
                     </thead>
                     <tbody>
                       {policies.map(p => (
                         <tr key={p.id} className="border-b border-border/20 transition-colors hover:bg-muted/30">
                           <td className="py-3 px-6">
                              <div className="font-bold text-sm text-foreground">{p.title}</div>
                              <span className="inline-flex mt-1 items-center rounded-md bg-muted/50 border border-border/60 px-1.5 py-0.5  uppercase tracking-wide text-muted-foreground shadow-sm">
                                 {p.type}
                              </span>
                           </td>
                           <td className="py-3 px-4 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border/60 font-medium tracking-wide text-xs uppercase text-foreground bg-accent/10">
                                 {p.locale}
                              </span>
                           </td>
                           <td className="py-3 px-4 font-mono font-bold tracking-wide text-muted-foreground text-xs">v{p.version}.0</td>
                           <td className="py-3 px-4">
                              <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide border shadow-sm ${
                                 p.status === 'published' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                              }`}>
                                 {p.status}
                              </span>
                           </td>
                           <td className="py-3 px-6 text-right font-mono text-xs text-muted-foreground opacity-80">{new Date(p.created_at).toLocaleString('pt-BR')}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
