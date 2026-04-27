import React, { useState } from 'react';

export default function AutomationDashboard() {
  const [activeTab, setActiveTab] = useState('social');

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
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
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden relative group">
                <div className="bg-muted/30 p-6 border-b border-border/40">
                  <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    Criar Postagem Automatizada
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">Utilize o roteador do LLM Llama-3 para gerar copys para suas redes e engatilhar o agendamento de forma robusta.</p>
                </div>
                
                <div className="p-6">
                  <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Plataforma de Destino</label>
                        <select className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background/50 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent disabled:cursor-not-allowed disabled:opacity-50">
                          <option value="linkedin">LinkedIn (B2B Authority)</option>
                          <option value="instagram">Instagram (Visual First)</option>
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Instrução Base (Brainstorming)</label>
                        <input className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent" placeholder="Descreva brevemente o conceito ou a news..." />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Rascunho Inteligente (Preview Raw)</label>
                        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-semibold h-7 px-3 bg-accent text-primary-foreground shadow hover:bg-accent/90 transition-all">
                          <svg className="mr-1.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                          Processar Prompt Llama-3
                        </button>
                      </div>
                      <div className="relative group/textarea">
                        <textarea className="flex min-h-[220px] w-full rounded-lg border border-input bg-background/50 px-4 py-4 text-sm font-mono shadow-inner transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent" placeholder="O output generativo final, pronto para proofreading, será transposto aqui." />
                      </div>
                    </div>
                    
                    <div className="flex gap-3 justify-end pt-2 border-t border-border/40">
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-10 px-5 border border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition-all">
                        <svg className="mr-2 opacity-70" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/><path d="M12 2v20"/><polyline points="18 15 21 12 18 9"/></svg>
                        Agendar Fila (Queue)
                      </button>
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-10 px-6 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-all">
                        Publicar Live Agora
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'newsletter' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="bg-muted/30 p-6 border-b border-border/40">
                  <h3 className="font-semibold leading-none tracking-tight">Campanhas de Email (SMTP Dispatcher)</h3>
                  <p className="text-sm text-muted-foreground mt-2">Monte newsletters e dispare por double opt-in para sua matriz de contatos isolada por tenant.</p>
                </div>
                <div className="p-8 h-80 flex flex-col items-center justify-center text-muted-foreground bg-background/40">
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
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'jobs' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="bg-muted/30 p-6 border-b border-border/40">
                  <h3 className="font-semibold leading-none tracking-tight">Pipeline de Triagem HR</h3>
                  <p className="text-sm text-muted-foreground mt-2">Visão isolada dos currículos submetidos, classificados autonomamente pelo motor vetorial de adequação.</p>
                </div>
                <div className="p-6">
                  <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
                    Telemetry: 0 eventos na fila morta. Nenhum candidato pendente classificação neste namespace temporal.
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'brandbook' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="bg-muted/30 p-6 border-b border-border/40">
                  <h3 className="font-semibold leading-none tracking-tight">Assinaturas HTML (Identity Provider)</h3>
                  <p className="text-sm text-muted-foreground mt-2">Central de sincronização de Identidade. Exporte as assinaturas estruturadas do domínio root.</p>
                </div>
                <div className="p-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex-1 bg-neutral-900 border border-neutral-800 p-4 rounded-lg shadow-inner overflow-x-auto w-full">
                    <code className="text-xs font-mono leading-loose text-blue-300">
                      &lt;div style=&quot;font-family: Arial, sans-serif; font-size: 14px;&quot;&gt;<br/>
                        &nbsp;&nbsp;&lt;strong&gt;Seu Nome&lt;/strong&gt;&lt;br/&gt;<br/>
                        &nbsp;&nbsp;&lt;span style=&quot;color: #888;&quot;&gt;Cargo / Título&lt;/span&gt;<br/>
                      &lt;/div&gt;
                    </code>
                  </div>
                  <button className="whitespace-nowrap shrink-0 rounded-md text-sm font-semibold h-10 px-5 border border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition-all">
                    Extrair Build.HTML
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
