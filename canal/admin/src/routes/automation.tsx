import React, { useState, useEffect } from 'react';

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
      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 bg-muted/30 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-semibold text-foreground">GitHub Projects Kanban</h3>
            <p className="text-xs text-muted-foreground mt-1">Visão consolidada das Issues e tracking de desenvolvimento.</p>
          </div>
          <button onClick={fetchIssues} disabled={loading} className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg shadow-sm hover:bg-primary/90 transition-colors font-medium disabled:opacity-50">
            {loading ? 'Sincronizando...' : 'Atualizar Board'}
          </button>
        </div>
        <div className="p-6 md:p-8">
          {error && <div className="text-sm text-red-500 mb-4 bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Todo Column */}
            <div className="bg-muted/10 rounded-2xl border border-dashed border-border/60 flex flex-col h-full min-h-[400px]">
              <div className="px-4 py-3 border-b border-dashed border-border/50 text-xs font-semibold uppercase tracking-wide flex justify-between items-center bg-muted/20 rounded-t-2xl">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"></div> To Do</span>
                <span className="text-xs bg-background px-2 py-0.5 rounded border border-border/50">{loading ? '-' : todo.length}</span>
              </div>
              <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                {loading ? <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Carregando...</div> : todo.map((issue) => (
                  <a href={issue.url} target="_blank" rel="noreferrer" key={issue.id} className="block bg-background rounded-xl border border-border/50 p-4 hover:border-primary/30 transition-all hover:-translate-y-px outline-none cursor-pointer group">
                    <p className="text-xs font-medium text-blue-500 mb-1 line-clamp-1">ness-site2026</p>
                    <h4 className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors">{issue.title}</h4>
                    {issue.labels && issue.labels.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mt-2">
                        {issue.labels.map((l: string) => <span key={l} className="text-xs bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded font-medium">{l}</span>)}
                      </div>
                    )}
                    <div className="flex gap-2 mt-3 items-center justify-between border-t border-border/30 pt-2">
                      <span className="text-xs text-muted-foreground font-mono">#{issue.id}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="bg-muted/10 rounded-2xl border border-dashed border-border/60 flex flex-col h-full min-h-[400px]">
              <div className="px-4 py-3 border-b border-dashed border-border/50 text-xs font-semibold uppercase tracking-wide flex justify-between items-center bg-muted/20 rounded-t-2xl">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> In Progress</span>
                <span className="text-xs bg-background px-2 py-0.5 rounded border border-border/50">{loading ? '-' : inProgress.length}</span>
              </div>
              <div className="p-4 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                {loading ? <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Carregando...</div> : inProgress.map((issue) => (
                  <a href={issue.url} target="_blank" rel="noreferrer" key={issue.id} className="block bg-background rounded-xl border border-yellow-500/30 p-4 hover:border-yellow-500/50 transition-all hover:-translate-y-px outline-none cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-500/10 rounded-bl-xl"></div>
                    <div>
                      <p className="text-xs font-medium text-amber-500 mb-1 line-clamp-1">ness-site2026</p>
                      <h4 className="text-sm font-semibold leading-tight text-foreground group-hover:text-amber-500 transition-colors">{issue.title}</h4>
                      {issue.labels && issue.labels.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mt-2">
                          {issue.labels.map((l: string) => <span key={l} className="text-xs bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-medium">{l}</span>)}
                        </div>
                      )}
                      <div className="flex gap-2 mt-3 items-center justify-between border-t border-border/30 pt-2">
                        <span className="text-xs text-muted-foreground font-mono">#{issue.id}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Done Column */}
            <div className="bg-muted/10 rounded-2xl border border-dashed border-border/60 flex flex-col h-full min-h-[400px]">
              <div className="px-4 py-3 border-b border-dashed border-border/50 text-xs font-semibold uppercase tracking-wide flex justify-between items-center bg-muted/20 rounded-t-2xl">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Done</span>
                <span className="text-xs bg-background px-2 py-0.5 rounded border border-border/50">{loading ? '-' : done.length}</span>
              </div>
              <div className="p-4 space-y-3 flex-1 overflow-y-auto opacity-70 custom-scrollbar">
                {loading ? <div className="p-4 text-center text-xs text-muted-foreground animate-pulse">Carregando...</div> : done.slice(0, 15).map((issue) => (
                   <a href={issue.url} target="_blank" rel="noreferrer" key={issue.id} className="block bg-background/50 rounded-xl border border-border/40 p-4 hover:bg-background transition-colors outline-none cursor-pointer">
                    <h4 className="text-sm font-medium line-through text-muted-foreground transition-colors hover:text-foreground">{issue.title}</h4>
                    <p className="text-xs text-muted-foreground mt-2 font-mono">#{issue.id}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
    <div className="mx-auto max-w-7xl w-full flex-1 min-w-0 p-6 md:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Growth & Automação
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Rotinas autônomas, newsletters e triagem cognitiva
          </p>
        </div>
        
        {/* Apple Segmented Control */}
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted/40 border border-border/50 p-1 text-muted-foreground w-full sm:w-auto flex-nowrap overflow-x-auto overflow-y-hidden custom-scrollbar">
          {[
            { id: 'social', label: 'Social Posts', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> },
            { id: 'newsletter', label: 'Newsletters', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> },
            { id: 'jobs', label: 'Vagas', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg> },
            { id: 'github', label: 'GitHub', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> },
            { id: 'brandbook', label: 'Assinaturas', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors min-w-max ${
                activeTab === tab.id 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'hover:text-foreground hover:bg-muted/60'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px]">
          {activeTab === 'social' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-2xl border border-border/50 bg-card overflow-hidden relative group">
                <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    Criar Postagem Automatizada
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Utilize o roteador Generativo para abstrair copys para suas redes.</p>
                </div>
                
                <div className="p-6">
                  <form className="space-y-5" onSubmit={e => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Plataforma de Destino</label>
                        <select 
                          value={socialPlatform}
                          onChange={e => setSocialPlatform(e.target.value)}
                          className="flex h-10 w-full items-center justify-between rounded-lg border border-border/50 bg-background px-3 py-2 text-sm transition-colors hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer text-foreground">
                          <option value="linkedin">LinkedIn (B2B)</option>
                          <option value="instagram">Instagram (Visual)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Instrução Base</label>
                        <input 
                          value={socialBrief}
                          onChange={e => setSocialBrief(e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40" placeholder="Descreva brevemente o conceito..." />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Rascunho (Preview)</label>
                        <button 
                          onClick={handleGenerateSocial}
                          disabled={isDrafting || !socialBrief}
                          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-xs font-medium h-8 px-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50">
                          {isDrafting ? <div className="loader-inline w-3 h-3 mr-1.5" /> : <svg className="mr-1.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>}
                          Gerar com IA
                        </button>
                      </div>
                      <div className="relative">
                        <textarea 
                          value={socialDraft}
                          onChange={(e) => setSocialDraft(e.target.value)}
                          className="flex min-h-[200px] w-full rounded-lg border border-border/50 bg-background font-mono p-4 text-sm leading-relaxed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 resize-y placeholder:text-muted-foreground/50" placeholder="O output generativo será exibido aqui." />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 justify-end pt-4 border-t border-border/50">
                      <button 
                        onClick={() => handlePublish(true)}
                        disabled={!socialDraft || isDrafting}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium h-10 px-4 border border-border/50 bg-background hover:bg-muted transition-colors disabled:opacity-50">
                        Agendar
                      </button>
                      <button 
                        onClick={() => handlePublish(false)}
                        disabled={!socialDraft || isDrafting}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium h-10 px-5 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50">
                        Publicar Agora
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'newsletter' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 bg-muted/30 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Campanhas de Email</h3>
                    <p className="text-xs text-muted-foreground mt-1">Monte newsletters e dispare para sua matriz de contatos.</p>
                  </div>
                </div>
                <div className="p-16 h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
                  <div className="h-16 w-16 mb-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">Nenhuma campanha ativa</h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-[300px] text-center">Inicie um draft para habilitar seu pipeline de envio.</p>
                  <button className="mt-6 inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium h-10 px-5 border border-border/50 bg-background hover:bg-muted transition-colors">
                    Criar Nova Campanha
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'github' && (
            <GithubKanbanTab />
          )}
          
          {activeTab === 'brandbook' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border/50 bg-muted/30 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Assinaturas HTML</h3>
                    <p className="text-xs text-muted-foreground mt-1">Exporte as assinaturas estruturadas do domínio.</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 bg-muted/30 border border-border/50 p-4 rounded-lg overflow-x-auto w-full">
                    <code className="text-xs font-mono leading-loose text-foreground">
                      &lt;div style=&quot;font-family: Arial, sans-serif; font-size: 14px;&quot;&gt;<br/>
                        &nbsp;&nbsp;&lt;strong&gt;Seu Nome&lt;/strong&gt;&lt;br/&gt;<br/>
                        &nbsp;&nbsp;&lt;span style=&quot;color: #888;&quot;&gt;Cargo / Título&lt;/span&gt;<br/>
                      &lt;/div&gt;
                    </code>
                  </div>
                  <button className="whitespace-nowrap shrink-0 rounded-lg text-sm font-medium h-10 px-5 border border-border/50 bg-background hover:bg-muted transition-colors">
                    Exportar HTML
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  );
}
