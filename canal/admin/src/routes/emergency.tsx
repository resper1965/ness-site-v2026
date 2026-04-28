import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";

export default function EmergencyDashboard() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="flex-1 space-y-6 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Incidentes Abertos"
          value={0}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
        />
        <StatCard
          label="SLA de Resposta (MTTA)"
          value="--"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
          change="Meta: ≤ 15min"
          changeColor="text-muted-foreground"
        />
        <StatCard
          label="Taxa de Erro 24h"
          value="0.00%"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
          changeColor="text-emerald-500"
        />
      </div>

      {/* Tabs Control */}
      <div className="space-y-6">
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
          {activeTab === 'active' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-dashed border-border/60 bg-card/50 shadow-sm">
                <div className="p-8 h-80 flex flex-col items-center justify-center text-muted-foreground">
                  <div className="h-16 w-16 mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Sistemas Operacionais</h3>
                  <p className="mt-1 text-sm max-w-[300px] text-center">Nenhum incidente crítico ativo no momento. Monitoramento heurístico em tempo real.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Crises (RCA)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Relatórios estruturados gerados por IA após resolução de Root Causes.</p>
                  <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                    Sem registro formal de incidentes arquivados neste mês.
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="21.17" y1="8" x2="12" y2="8"/><line x1="3.95" y1="6.06" x2="8.54" y2="14"/><line x1="10.88" y1="21.94" x2="15.46" y2="14"/></svg>}>
                    Telemetria de API (Tenant Isolation)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">Consulta raw ao dataset <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">canal_metrics</code> processado nos nós Edge.</p>
                  <div className="bg-muted/20 border border-border/50 p-5 rounded-lg overflow-x-auto">
                    <code className="text-xs font-mono leading-loose text-foreground/80">
                      SELECT blob1 AS tenant_id, blob2 AS path, SUM(double1) AS latency <br/>
                      FROM canal_metrics <br/>
                      GROUP BY blob1, blob2
                    </code>
                  </div>
                  <div className="mt-5 flex justify-end">
                    <button className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold h-9 px-4 border border-border bg-background hover:bg-muted/50 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Executar Consulta
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
