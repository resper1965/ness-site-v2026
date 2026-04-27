import { useEffect, useState } from 'react';

interface ChatbotConfig {
  bot_name: string; avatar_url?: string; welcome_message?: string;
  system_prompt?: string; theme_color: string; enabled: number; max_turns: number;
}
interface ChatSession { id: string; visitor_id?: string; locale: string; turn_count: number; csat_score?: number; status: string; created_at: string; }
interface KBDoc { key: string; filename: string; size: number; uploaded: string; }

const API = import.meta.env.VITE_CANAL_URL || '';

export default function ChatbotPage() {
  const [tab, setTab] = useState<'config' | 'analytics' | 'kb'>('config');

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
            Interface Cognitiva <span className="text-muted-foreground font-light">::</span> Chatbot
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            ORQUESTRAÇÃO DO MOTOR DE Diálogo E CONTEXTO RETRIEVAL (RAG)
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-6">
        <div className="inline-flex h-10 items-center justify-center rounded-lg bg-card border border-border/60 p-1 text-muted-foreground shadow-sm w-full sm:w-auto self-start">
          <button onClick={() => setTab('config')} className={`inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-semibold transition-all ${tab === 'config' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'hover:text-foreground hover:bg-muted/50'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Configuração
          </button>
          <button onClick={() => setTab('analytics')} className={`inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-semibold transition-all ${tab === 'analytics' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'hover:text-foreground hover:bg-muted/50'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            Analytics
          </button>
          <button onClick={() => setTab('kb')} className={`inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-semibold transition-all ${tab === 'kb' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'hover:text-foreground hover:bg-muted/50'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            Knowledge Base
          </button>
        </div>

        <div className="min-h-[400px]">
          {tab === 'config' ? <ConfigTab /> : tab === 'analytics' ? <AnalyticsTab /> : <KnowledgeBaseTab />}
        </div>
      </div>
    </div>
  );
}

function ConfigTab() {
  const [config, setConfig] = useState<ChatbotConfig>({
    bot_name: 'Gabi.OS', theme_color: '#00ade8', enabled: 1, max_turns: 20,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/admin/chatbot-config?tenant_id=ness`, { credentials: 'include' })
      .then(r => r.json()).then(setConfig).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch(`${API}/api/admin/chatbot-config`, {
      method: 'PUT', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...config, tenant_id: 'ness' }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-muted/30 p-5 border-b border-border/40">
            <h3 className="font-semibold leading-none tracking-tight">Setup Dinâmico</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Identificação (Nome do Bot)</label>
                <input className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary" value={config.bot_name} onChange={e => setConfig(c => ({ ...c, bot_name: e.target.value }))} />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Cor Accent do Widget</label>
                <div className="flex gap-3">
                  <input type="color" value={config.theme_color} onChange={e => setConfig(c => ({ ...c, theme_color: e.target.value }))} className="h-11 w-14 cursor-pointer rounded border-0 bg-transparent p-0" />
                  <input className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm font-mono shadow-sm transition-colors uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary" value={config.theme_color} onChange={e => setConfig(c => ({ ...c, theme_color: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Mensagem de Boas-vindas</label>
              <textarea className="flex w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary resize-y" rows={2} value={config.welcome_message || ''} onChange={e => setConfig(c => ({ ...c, welcome_message: e.target.value }))} />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground flex justify-between">
                System Prompt (Instruções Core)
                <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px]">INJEÇÃO DE CONTEXTO</span>
              </label>
              <textarea className="flex w-full rounded-lg border border-input bg-background/50 px-4 py-3 text-sm font-mono shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary resize-y" rows={6} value={config.system_prompt || ''} onChange={e => setConfig(c => ({ ...c, system_prompt: e.target.value }))} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Segurança: Limite de Turnos</label>
                <input type="number" className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary" value={config.max_turns} onChange={e => setConfig(c => ({ ...c, max_turns: parseInt(e.target.value) || 20 }))} />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Status do Serviço</label>
                <select className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={config.enabled} onChange={e => setConfig(c => ({ ...c, enabled: parseInt(e.target.value) }))}>
                  <option value={1}>Ativo (Online)</option>
                  <option value={0}>Inativo (Offline)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 items-center justify-end pt-4 border-t border-border/40">
              {saved && (
                 <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1 animate-in fade-in">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                 Salvo com sucesso
               </span>
              )}
              <button onClick={save} disabled={saving} className="inline-flex w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-10 px-8 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50">
                {saving ? 'Gravando...' : 'Salvar Configuração'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden sticky top-6">
          <div className="bg-muted/30 p-5 border-b border-border/40">
            <h3 className="font-semibold leading-none tracking-tight">Preview</h3>
          </div>
          <div className="p-6 bg-slate-100 flex justify-center py-10 dark:bg-slate-900/50">
            <div className="w-full max-w-[320px] rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden dark:border-slate-800 dark:bg-slate-950">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: config.theme_color }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">{config.bot_name}</h4>
                  <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Online
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 min-h-[160px] flex flex-col justify-end dark:bg-slate-900">
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1" style={{ backgroundColor: config.theme_color }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
                  </div>
                  <div className="bg-white border border-slate-200 text-sm p-3 rounded-2xl rounded-tl-sm text-slate-700 shadow-sm whitespace-pre-wrap dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                    {config.welcome_message || 'Olá! Como posso ajudar?'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const [analytics, setAnalytics] = useState<{ total_sessions: number; avg_turns: number; avg_csat: number | null; recent: ChatSession[] } | null>(null);

  useEffect(() => {
    fetch(`${API}/api/admin/chat-analytics?tenant_id=ness`, { credentials: 'include' })
      .then(r => r.json()).then(setAnalytics).catch(() => {});
  }, []);

  if (!analytics) return <div className="flex justify-center p-16"><div className="loader-inline" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
            Sessões Totais
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </span>
          <div className="text-4xl font-black font-mono text-foreground tracking-tighter">{analytics.total_sessions}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
            Média de Turnos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          <div className="text-4xl font-black font-mono text-foreground tracking-tighter">{analytics.avg_turns}</div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
            CSAT Médio
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
          </span>
          <div className="text-4xl font-black font-mono text-foreground tracking-tighter">{analytics.avg_csat ?? '—'}</div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="bg-muted/30 p-5 border-b border-border/40 flex justify-between items-center">
          <h3 className="font-semibold leading-none tracking-tight">Sessões Recentes</h3>
          <a href={`${API}/api/admin/chat-export?tenant_id=ness`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold h-8 px-3 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground transition-all">
            <svg className="mr-2" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar CSV
          </a>
        </div>
        <div className="w-full overflow-auto">
          {analytics.recent.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground bg-background/50">Nenhuma sessão registrada.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground text-left">
                  <th className="font-medium p-4">Sessão ID</th>
                  <th className="font-medium p-4">Idioma</th>
                  <th className="font-medium p-4">Turnos</th>
                  <th className="font-medium p-4">CSAT</th>
                  <th className="font-medium p-4">Status</th>
                  <th className="font-medium p-4">Data</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recent.map(s => (
                  <tr key={s.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                    <td className="p-4"><code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">{s.id.substring(0, 8)}</code></td>
                    <td className="p-4 font-mono text-xs uppercase">{s.locale}</td>
                    <td className="p-4">{s.turn_count}</td>
                    <td className="p-4 font-bold text-foreground">{s.csat_score ?? '—'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${s.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-inset ring-emerald-500/20' : 'bg-slate-500/10 text-slate-500 ring-1 ring-inset ring-slate-500/20'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-mono text-muted-foreground">{new Date(s.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function KnowledgeBaseTab() {
  const [docs, setDocs] = useState<KBDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/admin/knowledge-base?tenant_id=ness`, { credentials: 'include' })
      .then(r => r.json()).then(d => setDocs(d.documents || [])).catch(() => {});
  }, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    await fetch(`${API}/api/admin/knowledge-base/upload?tenant_id=ness`, {
      method: 'POST', credentials: 'include', body: form,
    });
    setUploading(false);
    const res = await fetch(`${API}/api/admin/knowledge-base?tenant_id=ness`, { credentials: 'include' });
    const data = await res.json();
    setDocs(data.documents || []);
  };

  const seed = async () => {
    setSeeding(true);
    await fetch(`${API}/api/admin/seed-vectors?tenant_id=ness`, { method: 'POST', credentials: 'include' });
    setSeeding(false);
  };

  const deleteDoc = async (key: string) => {
    await fetch(`${API}/api/admin/knowledge-base/${key}`, { method: 'DELETE', credentials: 'include' });
    setDocs(prev => prev.filter(d => d.key !== key));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
        <div className="bg-muted/30 p-5 border-b border-border/40 flex justify-between items-center">
          <div>
            <h3 className="font-semibold leading-none tracking-tight text-foreground">Base de Vetores Corporativa</h3>
            <p className="text-xs text-muted-foreground mt-1.5 uppercase font-medium tracking-wide">Contexto RAG de Alta Fidelidade</p>
          </div>
          <div className="flex gap-2">
            <label className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-9 px-4 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-all cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <svg className="mr-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {uploading ? 'Subindo...' : 'Importar Source'}
              <input type="file" hidden onChange={upload} accept=".txt,.md,.pdf,.csv,.json" />
            </label>
            <button onClick={seed} disabled={seeding} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-9 px-4 border border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50">
              <svg className={`mr-2 ${seeding ? 'animate-spin' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
              {seeding ? 'Indexando...' : 'Re-indexar Vetores'}
            </button>
          </div>
        </div>

        <div className="w-full overflow-auto">
          {docs.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center bg-background/40">
              <div className="h-16 w-16 rounded-full bg-accent text-muted-foreground flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h4 className="font-semibold text-foreground">Silo de Conhecimento Vazio</h4>
              <p className="text-sm text-muted-foreground mt-1 max-w-[300px]">Nenhum source map injetado. Alimente arquivos TXT/PDF para o LLM interpretar a empresa.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/20 text-xs uppercase tracking-wider text-muted-foreground text-left">
                  <th className="font-medium p-4">Arquivo Source</th>
                  <th className="font-medium p-4">Peso</th>
                  <th className="font-medium p-4">Data Build</th>
                  <th className="font-medium p-4 w-[100px]">Ações</th>
                </tr>
              </thead>
              <tbody>
                {docs.map(d => (
                  <tr key={d.key} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                    <td className="p-4 flex items-center gap-2">
                       <svg className="text-primary" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                       <span className="font-medium text-foreground tracking-tight">{d.filename}</span>
                    </td>
                    <td className="p-4 font-mono text-xs">{`${(d.size / 1024).toFixed(1)} KB`}</td>
                    <td className="p-4 font-mono text-xs text-muted-foreground">{new Date(d.uploaded).toLocaleDateString('pt-BR')}</td>
                    <td className="p-4">
                      <button onClick={() => deleteDoc(d.key)} className="inline-flex h-7 items-center justify-center rounded border border-red-500/30 bg-red-500/10 px-3 text-[10px] font-bold uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all">
                        Expurgar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
