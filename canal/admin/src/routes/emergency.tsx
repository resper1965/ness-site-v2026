import React, { useState } from 'react';

export default function EmergencyDashboard() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 mx-auto max-w-7xl w-full flex-1 overflow-hidden min-w-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight uppercase font-mono bg-clip-text text-transparent bg-linear-to-r from-red-600 to-orange-500 dark:from-red-500 dark:to-orange-400">
            Tratativa de Crises (Incidentes P1)
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1">
            FLUXO DE CHAMADOS DE EMERGÊNCIA DOS CLIENTES DA NESS
          </p>
        </div>
        <button className="group relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-10 px-5 py-2 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-all focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 dark:focus:ring-offset-background">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 transition-transform group-hover:scale-110">
            <path d="m11 2 2-2 2 2" /><path d="M12 22V8" /><path d="m5 12-2 2-2-2" /><path d="M16 12h-8" /><path d="m19 12 2-2 2 2" />
          </svg>
          Declarar Crise Manual (P1)
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-red-500/20 bg-card text-card-foreground shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-red-500/5 to-transparent pointer-events-none" />
          <div className="p-5 flex flex-row items-center justify-between space-y-0 relative">
            <h3 className="tracking-tight text-sm font-semibold uppercase text-muted-foreground">Incidentes Abertos</h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500/70">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="p-5 pt-0 relative border-t border-border/50 mt-2">
            <div className="text-4xl font-semibold font-mono text-foreground mt-4 tracking-tighter">0</div>
          </div>
        </div>
        
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm relative overflow-hidden group">
          <div className="p-5 flex flex-row items-center justify-between space-y-0 relative">
            <h3 className="tracking-tight text-sm font-semibold uppercase text-muted-foreground">SLA de Resposta (MTTA)</h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/60">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="p-5 pt-0 relative border-t border-border/50 mt-2">
            <div className="text-4xl font-semibold font-mono text-muted-foreground mt-4 tracking-tighter">--<span className="text-lg opacity-50 ml-1">min</span></div>
            <p className="text-xs text-muted-foreground mt-2 font-medium tracking-wide">Meta: &le; 15min</p>
          </div>
        </div>

        <div className="rounded-xl border border-green-500/20 bg-card text-card-foreground shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-green-500/5 to-transparent pointer-events-none" />
          <div className="p-5 flex flex-row items-center justify-between space-y-0 relative">
            <h3 className="tracking-tight text-sm font-semibold uppercase text-muted-foreground">Taxa de Erro 24h</h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500/70">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div className="p-5 pt-0 relative border-t border-border/50 mt-2">
            <div className="text-4xl font-semibold font-mono text-green-500 dark:text-green-400 mt-4 tracking-tighter">0.00<span className="text-lg ml-1">%</span></div>
          </div>
        </div>
      </div>

      {/* Tabs Control */}
      <div className="space-y-6 pt-2">
        <div className="inline-flex h-10 items-center justify-center rounded-lg bg-card border border-border/60 p-1 text-muted-foreground shadow-sm w-full sm:w-auto">
          {[
            { id: 'active', label: 'Em Andamento', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> },
            { id: 'history', label: 'Histórico & RCA', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg> },
            { id: 'analytics', label: 'Workers Analytics', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
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

        <div className="min-h-[300px]">
          {/* View: Active */}
          {activeTab === 'active' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-dashed border-border/60 bg-card/50 text-card-foreground shadow-sm">
                <div className="p-8 h-80 flex flex-col items-center justify-center text-muted-foreground">
                  <div className="h-16 w-16 mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Sistemas Operacionais</h3>
                  <p className="mt-1 text-sm max-w-[300px] text-center">Nenhum incidente crítico ativo no momento. Monitoramento heurístico em tempo real.</p>
                </div>
              </div>
            </div>
          )}

          {/* View: History */}
          {activeTab === 'history' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="bg-muted/30 p-6 border-b border-border/50">
                  <h3 className="font-semibold leading-none tracking-tight">Histórico de Crises (RCA)</h3>
                  <p className="text-sm text-muted-foreground mt-2">Baixe relatórios estruturados gerados por inteligência artificial após a resolução de Root Causes.</p>
                </div>
                <div className="p-8 flex items-center justify-center text-sm text-muted-foreground">
                   Sem registro formal de quedas ou incidentes arquivados neste mês.
                </div>
              </div>
            </div>
          )}
          
          {/* View: Analytics */}
          {activeTab === 'analytics' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="bg-muted/30 p-6 border-b border-border/50">
                  <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>
                    Telemetria de API (Tenant Isolation)
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">Consulta raw ao dataset <code>canal_metrics</code> processado nos nós de borda (Edge).</p>
                </div>
                <div className="p-6">
                  <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-lg overflow-x-auto">
                    <code className="text-xs font-mono leading-loose text-blue-300">
                      <span className="text-pink-400">SELECT</span> blob1 <span className="text-pink-400">AS</span> tenant_id, blob2 <span className="text-pink-400">AS</span> path, <span className="text-cyan-400">SUM</span>(double1) <span className="text-pink-400">AS</span> latency <br/>
                      <span className="text-pink-400">FROM</span> canal_metrics <br/>
                      <span className="text-pink-400">GROUP BY</span> blob1, blob2
                    </code>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button className="inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-semibold h-9 px-4 py-2 border border-input shadow-sm bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Executar Consulta Query
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
