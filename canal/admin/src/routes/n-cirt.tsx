import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function NcirtDashboard() {
  const [activeTab, setActiveTab] = useState('active');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-red-600 dark:text-red-500">n.cirt : War Room</h2>
          <p className="text-muted-foreground">Núcleo Central de Incidentes e Resposta Tática.</p>
        </div>
        <Button variant="destructive">Declarar Crise Manual (P1)</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidentes Abertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA de Resposta (MTTA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-- min</div>
            <p className="text-xs text-muted-foreground">Meta: &le; 15min</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Erro 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">0.00%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Em Andamento</TabsTrigger>
          <TabsTrigger value="history">Histórico & RCA</TabsTrigger>
          <TabsTrigger value="analytics">Workers Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="h-64 flex flex-col items-center justify-center text-muted-foreground p-6">
              <span className="text-4xl mb-4">🛡️</span>
              <p>Nenhum incidente ativo no momento. Todos os sistemas operacionais.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Crises (RCA)</CardTitle>
              <CardDescription>Baixe relatórios gerados por inteligência artificial (Llama-3) após resoluções.</CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-sm text-muted-foreground">Sem registro de quedas ou vazamentos.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Telemetria de API (Tenant Isolation)</CardTitle>
              <CardDescription>Consulta do dataset canal_metrics coletado na borda.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded text-xs font-mono">
                SELECT blob1 AS tenant_id, blob2 AS path, SUM(double1) AS latency <br/>
                FROM canal_metrics <br/>
                GROUP BY blob1, blob2 <br/>
              </div>
              <Button variant="outline" className="mt-4">Executar Consulta</Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
