import React, { useState } from 'react';

export default function AutomationDashboard() {
  const [activeTab, setActiveTab] = useState('social');

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Growth & Automação (Fase 5)</h2>
      </div>

      <div className="space-y-4">
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
          <button onClick={() => setActiveTab('social')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${activeTab === 'social' ? 'bg-background text-foreground shadow' : ''}`}>Social Posts (IA)</button>
          <button onClick={() => setActiveTab('newsletter')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${activeTab === 'newsletter' ? 'bg-background text-foreground shadow' : ''}`}>Newsletters</button>
          <button onClick={() => setActiveTab('jobs')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${activeTab === 'jobs' ? 'bg-background text-foreground shadow' : ''}`}>Triagem de Vagas</button>
          <button onClick={() => setActiveTab('brandbook')} className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all ${activeTab === 'brandbook' ? 'bg-background text-foreground shadow' : ''}`}>Brandbook & Assinaturas</button>
        </div>

        {activeTab === 'social' && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <h3 className="font-semibold leading-none tracking-tight mb-2">Criar Postagem Automatizada</h3>
              <p className="text-sm text-muted-foreground mb-6">Utilize o roteador do LLM Llama-3 para gerar copys para suas redes e engatilhar o agendamento.</p>
              
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Plataforma</label>
                    <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option value="linkedin">LinkedIn</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none">Instrução Base (O que divulgar?)</label>
                    <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="Resuma em poucas palavras o mote..." />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">Rascunho Inteligente Gerado</label>
                  <textarea className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" placeholder="O post gerado pela inteligência aparecerá aqui..." />
                </div>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90">Gerar com IA</button>
                <div className="flex gap-2 justify-end mt-4">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">Agendar</button>
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90">Publicar Agora</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'newsletter' && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <h3 className="font-semibold leading-none tracking-tight mb-2">Campanhas de Email</h3>
              <p className="text-sm text-muted-foreground mb-6">Monte newsletters e dispare por double opt-in para a rede de contatos.</p>
              
              <div className="h-64 flex items-center justify-center border-dashed border-2 rounded">
                <div className="text-center text-muted-foreground">
                  <p>Nenhuma campanha criada.</p>
                  <button className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">Nova Campanha</button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <h3 className="font-semibold leading-none tracking-tight mb-2">Triagem de Candidatos</h3>
              <p className="text-sm text-muted-foreground mb-6">Visão dos currículos submetidos, classificados automaticamente pela precisão com a vaga.</p>
              <p className="text-sm text-muted-foreground p-4 bg-muted rounded">Nenhum candidato aguardando triagem.</p>
            </div>
          </div>
        )}
        
        {activeTab === 'brandbook' && (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <h3 className="font-semibold leading-none tracking-tight mb-2">Gerador de Assinaturas</h3>
              <p className="text-sm text-muted-foreground mb-6">Gere assinaturas de email HTML com a marca do Tenant.</p>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">Baixar Assinatura HTML</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
