import React, { useState } from 'react';

export default function NcirtDashboard() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-red-600 dark:text-red-500">n.cirt : War Room</h2>
          <p className="text-muted-foreground">Núcleo Central de Incidentes e Resposta Tática.</p>
        </div>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90">Declarar Crise Manual (P1)</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Incidentes Abertos</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">0</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">SLA de Resposta (MTTA)</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">-- min</div>
            <p className="text-xs text-muted-foreground">Meta: &le; 15min</p>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Taxa de Erro 24h</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-green-500">0.00%</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
          <button onClick={() => setActiveTab('active')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-background text-foreground shadow' : ''}`}>Em Andamento</button>
          <button onClick={() => setActiveTab('history')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-background text-foreground shadow' : ''}`}>Histórico & RCA</button>
          <button onClick={() => setActiveTab('analytics')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-background text-foreground shadow' : ''}`}>Workers Analytics</button>
        </div>

        {activeTab === 'active' && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 h-64 flex flex-col items-center justify-center text-muted-foreground">
                <span className="text-4xl mb-4">🛡️</span>
                <p>Nenhum incidente ativo no momento. Todos os sistemas operacionais.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col space-y-1.5">
                <h3 className="font-semibold leading-none tracking-tight">Histórico de Crises (RCA)</h3>
                <p className="text-sm text-muted-foreground">Baixe relatórios gerados por inteligência artificial (Llama-3) após resoluções.</p>
              </div>
              <div className="p-6 pt-0">
                 <p className="text-sm text-muted-foreground">Sem registro de quedas ou vazamentos.</p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="p-6 flex flex-col space-y-1.5">
                <h3 className="font-semibold leading-none tracking-tight">Telemetria de API (Tenant Isolation)</h3>
                <p className="text-sm text-muted-foreground">Consulta do dataset canal_metrics coletado na borda.</p>
              </div>
              <div className="p-6 pt-0">
                <div className="bg-muted p-4 rounded text-xs font-mono">
                  SELECT blob1 AS tenant_id, blob2 AS path, SUM(double1) AS latency <br/>
                  FROM canal_metrics <br/>
                  GROUP BY blob1, blob2 <br/>
                </div>
                <button className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">Executar Consulta</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
