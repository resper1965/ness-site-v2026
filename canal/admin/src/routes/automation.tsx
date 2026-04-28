import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "../components/ui/Card";

function GithubKanbanTab() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/automation/github/issues');
      if (!res.ok) throw new Error('Falha ao conectar.');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setIssues(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Erro de API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const todo = issues.filter(i => i.status === 'todo');
  const inProgress = issues.filter(i => i.status === 'in-progress');
  const done = issues.filter(i => i.status === 'done');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card>
        <CardHeader>
          <CardTitle>GitHub Projects Kanban</CardTitle>
          <CardAction>
            <button onClick={fetchIssues} disabled={loading} className="text-xs px-3 py-1 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 transition-all font-semibold disabled:opacity-50">
              {loading ? 'Sincronizando...' : 'Atualizar Board'}
            </button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {error && <div className="text-sm text-red-500 mb-4 bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Todo Column */}
            <div className="bg-muted/20 rounded-lg border border-border/50 flex flex-col h-full min-h-[400px]">
              <div className="px-4 py-3 border-b border-border/50 font-bold text-sm flex justify-between items-center bg-muted/40">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div> TO DO</span>
                <span className="text-xs bg-background px-2 py-0.5 rounded-full border border-border/50">{loading ? '-' : todo.length}</span>
              </div>
              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                {loading ? <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Carregando...</div> : todo.map((issue) => (
                  <a href={issue.url} target="_blank" rel="noreferrer" key={issue.id} className="block bg-background rounded-md border border-border/60 p-3 shadow-sm hover:border-accent/40 transition-all active:scale-[0.98] outline-none cursor-pointer group">
                    <p className="text-[10px] font-bold text-blue-400 dark:text-blue-500 mb-1">ness-site2026</p>
                    <h4 className="text-[13px] font-semibold leading-tight group-hover:text-accent transition-colors">{issue.title}</h4>
                    {issue.labels && issue.labels.length > 0 && (
                      <div className="flex gap-1 flex-wrap mt-2">
                        {issue.labels.map((l: string) => <span key={l} className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded uppercase font-semibold">{l}</span>)}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3 items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-mono">#{issue.id}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-muted/20 rounded-lg border border-border/50 flex flex-col h-full min-h-[400px]">
              <div className="px-4 py-3 border-b border-border/50 font-bold text-sm flex justify-between items-center bg-muted/40">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> IN PROGRESS</span>
                <span className="text-xs bg-background px-2 py-0.5 rounded-full border border-border/50">{loading ? '-' : inProgress.length}</span>
              </div>
              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                {loading ? <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Carregando...</div> : inProgress.map((issue) => (
                  <a href={issue.url} target="_blank" rel="noreferrer" key={issue.id} className="block bg-background rounded-md border-accent border-[1.5px] shadow-sm hover:border-accent hover:shadow-accent/20 hover:shadow-md transition-all active:scale-[0.98] outline-none cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-accent/10 rounded-bl-full border-b border-l border-accent/20"></div>
                    <div className="p-3">
                      <p className="text-[10px] font-bold text-amber-500 mb-1">ness-site2026</p>
                      <h4 className="text-[13px] font-semibold leading-tight text-foreground">{issue.title}</h4>
                      {issue.labels && issue.labels.length > 0 && (
                        <div className="flex gap-1 flex-wrap mt-2">
                          {issue.labels.map((l: string) => <span key={l} className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded uppercase font-semibold">{l}</span>)}
                        </div>
                      )}
                      <div className="flex gap-2 mt-3 items-center justify-between">
                        <span className="text-[10px] text-muted-foreground font-mono">#{issue.id}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div className="bg-muted/20 rounded-lg border border-border/50 flex flex-col h-full min-h-[400px]">
              <div className="px-4 py-3 border-b border-border/50 font-bold text-sm flex justify-between items-center bg-muted/40">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> DONE</span>
                <span className="text-xs bg-background px-2 py-0.5 rounded-full border border-border/50">{loading ? '-' : done.length}</span>
              </div>
              <div className="p-3 space-y-3 flex-1 overflow-y-auto opacity-70">
                {loading ? <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Carregando...</div> : done.slice(0, 15).map((issue) => (
                   <a href={issue.url} target="_blank" rel="noreferrer" key={issue.id} className="block bg-background/50 rounded-md border border-border/40 p-3 hover:bg-background transition-colors outline-none cursor-pointer">
                    <h4 className="text-[12px] font-medium line-through text-muted-foreground transition-colors hover:text-foreground">{issue.title}</h4>
                    <p className="text-[10px] text-muted-foreground mt-2 font-mono">#{issue.id}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



export default function AutomationDashboard() {
  const [activeTab, setActiveTab] = useState('social');

  // GenAI Social Draft State
  const [socialBrief, setSocialBrief] = useState('');
  const [socialPlatform, setSocialPlatform] = useState('linkedin');
  const [socialDraft, setSocialDraft] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const handleGenerateSocial = async () => {
    if (!socialBrief) return;
    setIsDrafting(true);
    setSocialDraft('Conectando ao núcleo Generativo...');
    try {
      const res = await fetch('/api/automation/social-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: socialPlatform, brief: socialBrief })
      });
      const data = await res.json();
      if (data.success) {
        setSocialDraft(data.text);
      } else {
        setSocialDraft('Falha: ' + (data.error || 'Erro desconhecido.'));
      }
    } catch (e) {
      setSocialDraft('Erro de conexão ao gerar post.');
    } finally {
      setIsDrafting(false);
    }
  };

  const handlePublish = async (isScheduled: boolean) => {
    if (!socialDraft) return;
    try {
      await fetch('/api/automation/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: socialPlatform,
          content: socialDraft,
          scheduled_at: isScheduled ? new Date(Date.now() + 86400000).toISOString() : undefined // schedule for tomorrow if true
        })
      });
      alert(isScheduled ? 'Inserido na Fila de Tasks de amanhã!' : 'Publicado com sucesso!');
      setSocialDraft('');
      setSocialBrief('');
    } catch (e) {
      alert('Erro ao confirmar publicação.');
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Growth & Automação <span className="text-muted-foreground font-light">::</span> Fase 5
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1">
            ROTINAS AUTÔNOMAS, NEWSLETTERS E TRIAGEM COGNITIVA
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tabs Control */}
        <div className="inline-flex h-10 items-center justify-center rounded-lg bg-card border border-border/60 p-1 text-muted-foreground shadow-sm w-full sm:w-auto">
          {[
            { id: 'social', label: 'Social Posts (IA)', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> },
            { id: 'newsletter', label: 'Newsletters', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> },
            { id: 'jobs', label: 'Triagem de Vagas', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg> },
            { id: 'github', label: 'GitHub Kanban', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> },
            { id: 'brandbook', label: 'Assinaturas', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-semibold transition-all ${
                activeTab === tab.id 
                  ? 'bg-background text-foreground shadow-sm border border-border/50' 
                  : 'hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[400px]">
          {activeTab === 'social' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>}>
                    Criar Postagem Automatizada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-muted-foreground">Plataforma de Destino</label>
                        <select 
                          value={socialPlatform}
                          onChange={e => setSocialPlatform(e.target.value)}
                          className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50">
                          <option value="linkedin">LinkedIn (B2B Authority)</option>
                          <option value="instagram">Instagram (Visual First)</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-muted-foreground">Instrução Base (Brainstorming)</label>
                        <input 
                          value={socialBrief}
                          onChange={e => setSocialBrief(e.target.value)}
                          className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary" placeholder="Descreva brevemente o conceito ou a news..." />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-muted-foreground">Rascunho Inteligente (Preview Raw)</label>
                        <button 
                          onClick={handleGenerateSocial}
                          disabled={isDrafting || !socialBrief}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold h-7 px-3 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50">
                          {isDrafting ? <div className="loader-inline w-3 h-3 mr-1.5" /> : <svg className="mr-1.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>}
                          Processar Prompt Generativo
                        </button>
                      </div>
                      <div className="relative group/textarea">
                        <textarea 
                          value={socialDraft}
                          onChange={(e) => setSocialDraft(e.target.value)}
                          className="flex min-h-[220px] w-full rounded-lg border border-input bg-background/50 px-4 py-4 text-sm font-mono shadow-inner transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" placeholder="O output generativo final, pronto para proofreading, será transposto aqui." />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 justify-end pt-2 border-t border-border/40">
                      <button 
                        onClick={() => handlePublish(true)}
                        disabled={!socialDraft || isDrafting}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-10 px-5 border border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50">
                        <svg className="mr-2 opacity-70" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/><path d="M12 2v20"/><polyline points="18 15 21 12 18 9"/></svg>
                        Agendar Fila (Queue)
                      </button>
                      <button 
                        onClick={() => handlePublish(false)}
                        disabled={!socialDraft || isDrafting}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-10 px-6 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50">
                        Publicar Live Agora
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'newsletter' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Campanhas de Email</CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex flex-col items-center justify-center text-muted-foreground bg-background/40">
                  <div className="h-16 w-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Draft Engine Desativada</h3>
                  <p className="mt-1 text-sm max-w-[340px] text-center">Nenhuma campanha orquestrada. Inicie um draft para habilitar seu SMTP relay pipeline.</p>
                  <button className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-10 px-6 border border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition-all">
                    Criar Novo Blueprint
                  </button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'github' && (
            <GithubKanbanTab />
          )}
          
          {activeTab === 'brandbook' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Assinaturas HTML</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 bg-muted/20 border border-border/50 p-4 rounded-lg shadow-inner overflow-x-auto w-full">
                    <code className="text-xs font-mono leading-loose text-foreground/80">
                      &lt;div style=&quot;font-family: Arial, sans-serif; font-size: 14px;&quot;&gt;<br/>
                        &nbsp;&nbsp;&lt;strong&gt;Seu Nome&lt;/strong&gt;&lt;br/&gt;<br/>
                        &nbsp;&nbsp;&lt;span style=&quot;color: #888;&quot;&gt;Cargo / Título&lt;/span&gt;<br/>
                      &lt;/div&gt;
                    </code>
                  </div>
                  <button className="whitespace-nowrap shrink-0 rounded-md text-sm font-semibold h-10 px-5 border border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition-all">
                    Extrair Build.HTML
                  </button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
