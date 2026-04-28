import { useEffect, useState } from 'react'
import { authClient } from '../lib/auth-client'
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "../components/ui/Card"
import { TabGroup, TabPanel } from "../components/ui/Tabs"
import { EmptyState } from "../components/ui/EmptyState"

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
           <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M10 12l2 2 4-4"/></svg>
             Aegis <span className="text-muted-foreground font-light">::</span> Compliance
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
             Governança, Políticas e Privacidade de Dados
          </p>
        </div>
        
        <TabGroup
          tabs={[
            { id: 'dsar', label: 'Solicitações DSAR', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg> },
            { id: 'whistleblower', label: 'Denúncias', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
            { id: 'policies', label: 'Políticas', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
          ]}
          active={tab}
          onChange={(id) => setTab(id as 'dsar' | 'whistleblower' | 'policies')}
        />
      </div>

      {loading ? (
        <div className="flex justify-center p-16 animate-pulse"><div className="loader-inline" /></div>
      ) : (<>
      <TabPanel id="dsar" active={tab}>
        <Card>
          <CardHeader>
            <CardTitle>Solicitações DSAR (LGPD)</CardTitle>
            <CardAction>
              <button className="inline-flex items-center justify-center gap-2 rounded text-xs font-medium text-primary bg-primary/5 px-2 py-1 border border-primary/20 hover:bg-primary/10 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Conectar OneTrust
              </button>
            </CardAction>
          </CardHeader>
          {dsars.length === 0 ? (
            <EmptyState
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M12 7V2"/><path d="M3 15h2"/><path d="M19 15h2"/><path d="M4 8l1.4 1.4"/><path d="M20 8l-1.4 1.4"/></svg>}
              title="SLA Cumprido"
              description="Sem solicitações ativas no funil DSAR."
            />
          ) : (
            <div className="w-full overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20 text-xs tracking-tight text-muted-foreground text-left">
                    <th className="font-medium p-4 pl-6">ID Protocolo</th>
                    <th className="font-medium p-4">Titular (Nome)</th>
                    <th className="font-medium p-4">Categoria do Pedido</th>
                    <th className="font-medium p-4">Status Interno</th>
                    <th className="font-medium p-4">Termômetro SLA</th>
                    <th className="font-medium p-4 pr-6">Diretivas</th>
                  </tr>
                </thead>
                <tbody>
                  {dsars.map(d => {
                    const sla = slaStatus(d.sla_deadline)
                    return (
                      <tr key={d.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                        <td className="p-4 pl-6">
                           <code className="font-mono text-foreground font-bold tracking-tight">{d.id.substring(0, 8).toUpperCase()}</code>
                        </td>
                        <td className="p-4 font-semibold text-foreground">{d.requester_name}</td>
                        <td className="p-4">
                           <span className="inline-flex items-center rounded-full bg-muted border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                              {d.request_type}
                           </span>
                        </td>
                        <td className="p-4">
                           <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                              d.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                              d.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              d.status === 'in-progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                              'bg-amber-500/10 text-amber-500 border-amber-500/20'
                           }`}>
                              {d.status}
                           </span>
                        </td>
                        <td className="p-4">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${sla.colorClass}`}>
                             {sla.label}
                           </span>
                        </td>
                        <td className="p-4 pr-6">
                          <select 
                            value={d.status} 
                            onChange={e => updateDsar(d.id, e.target.value)} 
                            className="flex h-8 items-center justify-between rounded-md border border-input bg-background/50 px-3 py-1 text-[11px] tracking-tight shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer font-bold"
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
        </Card>
      </TabPanel>
      <TabPanel id="whistleblower" active={tab}>
        <Card>
          <CardHeader>
            <CardTitle>Canal de Denúncias (Whistleblower)</CardTitle>
            <CardAction>
              <button className="inline-flex items-center justify-center gap-2 rounded text-xs font-medium text-primary bg-primary/5 px-2 py-1 border border-primary/20 hover:bg-primary/10 transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Conectar Sistema Terceiro
              </button>
            </CardAction>
          </CardHeader>
          {cases.length === 0 ? (
            <EmptyState
              icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
              title="Zero Relatos"
              description="Nenhuma incidência listada anonimamente pela organização."
            />
          ) : (
            <div className="w-full overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20 text-xs tracking-tight text-muted-foreground text-left">
                    <th className="font-medium p-4 pl-6">Ghost Code</th>
                    <th className="font-medium p-4">Classificação de Incidência</th>
                    <th className="font-medium p-4">Status Interno</th>
                    <th className="font-medium p-4">Termômetro SLA</th>
                    <th className="font-medium p-4">Timestamp (UTC)</th>
                    <th className="font-medium p-4 pr-6">Diretivas</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map(c => {
                    const sla = slaStatus(c.sla_deadline)
                    return (
                      <tr key={c.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                        <td className="p-4 pl-6">
                           <code className="font-mono text-foreground font-bold tracking-tight">{c.case_code}</code>
                        </td>
                        <td className="p-4 font-semibold text-foreground uppercase text-[11px] tracking-wider">{c.category || '—'}</td>
                        <td className="p-4">
                           <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                              c.status === 'closed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                              c.status === 'investigating' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                              'bg-amber-500/10 text-amber-500 border-amber-500/20'
                           }`}>
                              {c.status}
                           </span>
                        </td>
                        <td className="p-4">
                           <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${sla.colorClass}`}>
                             {sla.label}
                           </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-muted-foreground">{new Date(c.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="p-4 pr-6">
                          <select 
                            value={c.status} 
                            onChange={e => updateCase(c.id, e.target.value)} 
                            className="flex h-8 items-center justify-between rounded-md border border-input bg-background/50 px-3 py-1 text-[11px] tracking-tight shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer font-bold"
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
        </Card>
      </TabPanel>
      <TabPanel id="policies" active={tab}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
               <CardHeader>
                 <CardTitle>Cunhar Nova Política</CardTitle>
               </CardHeader>
               <CardContent className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                       <label className="text-sm font-semibold text-muted-foreground">Domínio</label>
                       <select value={newPolicy.type} onChange={e => setNewPolicy(p => ({ ...p, type: e.target.value }))} className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background/50 px-4 py-2 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer text-foreground">
                          <option value="privacy">PRIVACIDADE</option>
                          <option value="terms">TERMOS E USO</option>
                          <option value="cookie">COOKIES INFO</option>
                          <option value="lgpd">DPA / LGPD</option>
                       </select>
                    </div>
                    <div className="space-y-2.5">
                       <label className="text-sm font-semibold text-muted-foreground">Idioma Alvo</label>
                       <select value={newPolicy.locale} onChange={e => setNewPolicy(p => ({ ...p, locale: e.target.value }))} className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background/50 px-4 py-2 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer text-foreground">
                          <option value="pt">PT-BR</option>
                          <option value="en">EN-US</option>
                          <option value="es">ES-ES</option>
                       </select>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                     <label className="text-sm font-semibold text-muted-foreground">Título do Contrato</label>
                     <input type="text" placeholder="Nomeie o documento formal" value={newPolicy.title} onChange={e => setNewPolicy(p => ({ ...p, title: e.target.value }))} className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" />
                  </div>
                  <div className="space-y-2.5">
                     <label className="text-sm font-semibold text-muted-foreground">Corpo (Markdown Format)</label>
                     <textarea placeholder="## 1. Disposições Iniciais..." value={newPolicy.body_md} onChange={e => setNewPolicy(p => ({ ...p, body_md: e.target.value }))} rows={8} className="flex w-full rounded-lg border border-input bg-background/80 font-mono text-foreground p-4 text-xs shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y" />
                  </div>
                  <div className="pt-2">
                     <button className="inline-flex h-11 w-full items-center justify-center rounded-md bg-foreground text-background px-6 font-bold uppercase text-xs tracking-wider shadow hover:bg-foreground/90 transition-all disabled:opacity-50" onClick={createPolicy} disabled={!newPolicy.title || !newPolicy.body_md}>
                        Publicar Documento Padrão
                     </button>
                  </div>
               </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-full">
               <CardHeader>
                 <CardTitle>Diretório de Termos de Uso</CardTitle>
               </CardHeader>
               {policies.length === 0 ? (
                 <EmptyState
                   icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
                   title="Sem Histórico DGT"
                   description="Nenhuma política gerada neste tenant de infraestrutura."
                 />
               ) : (
                 <div className="w-full overflow-auto">
                   <table className="w-full text-sm">
                     <thead>
                       <tr className="border-b border-border/50 bg-muted/20 text-xs tracking-tight text-muted-foreground text-left">
                         <th className="font-medium p-4 pl-6">Label de Arquivo</th>
                         <th className="font-medium p-4">ISO Lang</th>
                         <th className="font-medium p-4">Index / v</th>
                         <th className="font-medium p-4">Status Deploy</th>
                         <th className="font-medium p-4 pr-6">Git Timestamp</th>
                       </tr>
                     </thead>
                     <tbody>
                       {policies.map(p => (
                         <tr key={p.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                           <td className="p-4 pl-6">
                              <div className="font-semibold text-foreground">{p.title}</div>
                              <span className="inline-flex mt-1 items-center rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">
                                 {p.type}
                              </span>
                           </td>
                           <td className="p-4">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded border border-border font-bold text-[10px] uppercase text-foreground bg-accent/30 shadow-sm">
                                 {p.locale}
                              </span>
                           </td>
                           <td className="p-4 font-mono font-bold tracking-tight opacity-80 text-foreground text-xs">v{p.version}.0</td>
                           <td className="p-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                 p.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted/30 text-muted-foreground border-border/50'
                              }`}>
                                 {p.status}
                              </span>
                           </td>
                           <td className="p-4 pr-6 font-mono text-[11px] text-muted-foreground opacity-80">{new Date(p.created_at).toLocaleString('pt-BR')}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               )}
            </Card>
          </div>
        </div>
      </TabPanel>
      </>)}
    </div>
  )
}
