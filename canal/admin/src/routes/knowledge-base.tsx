import { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";

type Document = {
  id: string;
  title: string;
  status: 'pending' | 'indexed' | 'error';
  visibility?: 'public' | 'internal' | 'restricted';
  chunk_count: number;
  created_at: string;
};

export default function KnowledgeBasePage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [activeTab, setActiveTab] = useState<'rag' | 'apikeys' | 'pending'>('rag');
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Form State RAG
  const [title, setTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'internal' | 'restricted'>('public');
  const [refreshKey, setRefreshKey] = useState(0);

  // API Keys State
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [keyName, setKeyName] = useState('');
  const [keyScope, setKeyScope] = useState<'public_only' | 'internal_access' | 'full_admin'>('public_only');
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  // Pending Queue State
  const [pendingItems, setPendingItems] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/knowledge-base", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setDocs(data as Document[]);
      })
      .finally(() => setLoading(false));

    fetch("/api/admin/api-keys", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.keys) setApiKeys(data.keys);
      }).catch(() => {});

    fetch("/api/admin/knowledge/pending", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.pending) setPendingItems(data.pending);
      }).catch(() => {});
  }, [activeOrg?.id, refreshKey]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rawText) return;
    setUploading(true);

    try {
      await fetch("/api/admin/knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, text_payload: rawText, visibility }),
      });
      setTitle('');
      setRawText('');
      setVisibility('public');
      setRefreshKey(k => k + 1);
    } finally {
      setUploading(false);
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName) return;

    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: keyName, scope: keyScope }),
      });
      const data = await res.json();
      if (data.apiKey) {
        setCreatedKey(data.apiKey);
        setKeyName('');
        setRefreshKey(k => k + 1);
      }
    } catch(e) { console.error(e); }
  };

  const handleRevokeApiKey = async (id: string) => {
    if (!confirm("Revogar acesso desta chave de agente?")) return;
    try {
      await fetch(`/api/admin/api-keys/${id}`, {
        method: "DELETE",
        credentials: "include"
      });
      setRefreshKey(k => k + 1);
    } catch(e) { console.error(e); }
  };

  const handleApprovePending = async (id: string) => {
    try {
      await fetch(`/api/admin/knowledge/approve/${id}`, {
        method: "POST",
        credentials: "include"
      });
      setRefreshKey(k => k + 1);
    } catch(e) { console.error(e); }
  };

  const handleRejectPending = async (id: string) => {
    try {
      await fetch(`/api/admin/knowledge/reject/${id}`, {
        method: "POST",
        credentials: "include"
      });
      setRefreshKey(k => k + 1);
    } catch(e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este documento da base de inteligência?")) return;
    try {
      await fetch(`/api/admin/knowledge-base/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setRefreshKey(k => k + 1);
    } catch(e) { console.error(e) }
  };

  if (loading) {
    return <div className="flex justify-center p-16"><div className="loader-inline" /></div>;
  }

  const indexedCount = docs.filter(d => d.status === 'indexed').length;
  const pendingCount = docs.filter(d => d.status === 'pending').length;
  const chunkCount = docs.reduce((acc, d) => acc + (d.chunk_count || 0), 0);

  return (
    <div className="max-w-[1750px] w-full px-10 md:px-12 py-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 overflow-hidden flex flex-col">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">Cérebro ness. & RAG</h1>
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] italic mt-2">Inteligência Corporativa, Guardrails e Conectores de IA</p>
        </div>

        <div className="flex items-center gap-4 bg-black/40 p-2 border border-white/10 rounded-2xl">
          <button
            onClick={() => setActiveTab('rag')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all italic ${
              activeTab === 'rag' ? 'bg-brand-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Memória Corporativa
          </button>

          <button
            onClick={() => setActiveTab('apikeys')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all italic ${
              activeTab === 'apikeys' ? 'bg-brand-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Chaves de Agentes ({apiKeys.length})
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`relative px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all italic ${
              activeTab === 'pending' ? 'bg-brand-primary text-white shadow-lg' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Fila de Aprovação ({pendingItems.length})
            {pendingItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-ping" />
            )}
          </button>
        </div>
      </div>

      {activeTab === 'rag' && (
        <>
          {/* Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: "Documentos Indexados", value: indexedCount, icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>, color: "text-emerald-500", glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]" },
              { label: "Memória Vetorial (Chunks)", value: chunkCount, icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></>, color: "text-brand-primary", glow: "shadow-[0_0_20px_rgba(0,173,232,0.2)]" },
              { label: "Pipeline de Sincronia", value: pendingCount, icon: <><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></>, color: "text-amber-500", glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]" }
            ].map((kpi, i) => (
              <div key={i} className="group relative">
                 <div className="absolute -inset-1 bg-white/5 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />
                 <div className={`relative p-10 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[40px] radial-gradient-glass shadow-2xl overflow-hidden h-full flex flex-col justify-between ${kpi.glow}`}>
                    <div className="flex justify-between items-start">
                       <div className={`w-14 h-14 rounded-2xl bg-white/2 border border-white/10 flex items-center justify-center ${kpi.color} group-hover:scale-110 transition-transform duration-700`}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">{kpi.icon}</svg>
                       </div>
                       <span className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.4em] font-mono">Vectorize.v4</span>
                    </div>
                    <div className="mt-8 space-y-2">
                       <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">{kpi.label}</span>
                       <span className="block text-5xl font-black tracking-tighter text-white italic">{kpi.value}</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start flex-1 min-h-0">
            {/* Form Upload */}
            <div className="xl:col-span-4 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 space-y-8">
                 <div className="space-y-2">
                   <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Ingestão RAG</h2>
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">Alimentação do Cérebro Corporativo</span>
                 </div>

                 <form onSubmit={handleUpload} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">Título do Documento</label>
                       <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Blueprint Operacional 2026"
                        className="h-12 w-full bg-black/40 border border-white/5 rounded-2xl px-5 text-sm font-black text-white italic placeholder:text-zinc-800 focus:ring-2 focus:ring-brand-primary/40 outline-none transition-all uppercase tracking-tighter"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">Classificação de Visibilidade (Guardrail)</label>
                      <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value as any)}
                        className="h-12 w-full bg-black/40 border border-white/5 rounded-2xl px-5 text-sm font-black text-white italic focus:ring-2 focus:ring-brand-primary/40 outline-none uppercase"
                      >
                        <option value="public">Público (Visitantes & Assistente Público)</option>
                        <option value="internal">Interno (Apenas Colaboradores Autenticados)</option>
                        <option value="restricted">Restrito / Confidencial (Apenas Admins & DPO)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] italic">Payload (Raw Content)</label>
                       <textarea
                        value={rawText}
                        onChange={(e) => setRawText(e.target.value)}
                        rows={10}
                        placeholder="Cole aqui transcrições, políticas ou documentação..."
                        className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-[13px] font-bold italic font-mono text-zinc-400 placeholder:text-zinc-800 focus:ring-2 focus:ring-brand-primary/40 outline-none resize-none leading-relaxed"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full h-14 rounded-2xl bg-brand-primary text-white text-[11px] font-black uppercase tracking-[0.3em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 italic"
                    >
                      {uploading ? "Indexando Vetores..." : "Alimentar Cérebro"}
                    </button>
                 </form>
            </div>

            {/* List */}
            <div className="xl:col-span-8 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[48px] overflow-hidden shadow-2xl flex flex-col min-h-[600px]">
               <div className="p-10 border-b border-white/5 bg-white/2 flex items-center justify-between">
                 <div>
                   <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Memória Corporativa</h2>
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] italic">Active Knowledge Nodes</span>
                 </div>
               </div>

               <div className="divide-y divide-white/5 overflow-y-auto max-h-[800px]">
                 {docs.map(doc => (
                   <div key={doc.id} className="p-8 hover:bg-white/2 transition-all flex items-center justify-between group">
                     <div className="flex gap-6 items-center flex-1">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <div>
                           <h4 className="text-base font-black text-white italic tracking-tighter uppercase">{doc.title}</h4>
                           <div className="flex items-center gap-4 mt-1">
                              <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] italic">{doc.chunk_count} VETORES</span>
                              <span className="text-[9px] px-3 py-0.5 rounded-full bg-white/10 text-zinc-300 font-black uppercase tracking-widest italic">
                                {doc.visibility || 'public'}
                              </span>
                           </div>
                        </div>
                     </div>

                     <button
                       onClick={() => handleDelete(doc.id)}
                       className="opacity-0 group-hover:opacity-100 transition-all h-10 w-10 flex items-center justify-center text-zinc-600 hover:text-red-500"
                     >
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </>
      )}

      {/* Tab: API Keys para Agentes de IA */}
      {activeTab === 'apikeys' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
          <div className="xl:col-span-4 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 space-y-8">
            <h2 className="text-2xl font-black text-white italic uppercase">Gerar Chave de Agente</h2>
            <form onSubmit={handleCreateApiKey} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Nome do Agente / Framework</label>
                <input
                  type="text"
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  placeholder="Ex: CrewAI SecBot"
                  className="h-12 w-full bg-black/40 border border-white/5 rounded-2xl px-5 text-sm font-bold text-white italic outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em]">Escopo de Acesso (Guardrail)</label>
                <select
                  value={keyScope}
                  onChange={e => setKeyScope(e.target.value as any)}
                  className="h-12 w-full bg-black/40 border border-white/5 rounded-2xl px-5 text-sm font-bold text-white italic outline-none uppercase"
                >
                  <option value="public_only">Apenas Conteúdo Público</option>
                  <option value="internal_access">Público + Interno</option>
                  <option value="full_admin">Acesso Total (Public + Internal + Restricted)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full h-14 rounded-2xl bg-brand-primary text-white text-[11px] font-black uppercase tracking-[0.3em] italic shadow-lg"
              >
                Gerar API Key
              </button>
            </form>

            {createdKey && (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Guarde sua API Key (Exibida uma única vez)</span>
                <input
                  type="text"
                  readOnly
                  value={createdKey}
                  className="w-full bg-black/60 border border-emerald-500/20 rounded-xl p-3 text-xs font-mono font-bold text-emerald-300"
                />
              </div>
            )}
          </div>

          <div className="xl:col-span-8 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 space-y-6">
            <h2 className="text-2xl font-black text-white italic uppercase">Chaves Ativas de Agentes</h2>
            <div className="divide-y divide-white/5">
              {apiKeys.map(k => (
                <div key={k.id} className="py-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-black text-white italic uppercase">{k.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs font-mono text-zinc-500">{k.prefix}_***</span>
                      <span className="text-[9px] px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary font-black uppercase italic">
                        {k.scope}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRevokeApiKey(k.id)}
                    className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-bold uppercase italic transition-all"
                  >
                    Revogar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Fila de Aprovação Humana */}
      {activeTab === 'pending' && (
        <div className="bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[48px] p-10 space-y-6">
          <h2 className="text-2xl font-black text-white italic uppercase">Submissões de Conhecimento por Agentes (Fila de Aprovação)</h2>
          {pendingItems.length === 0 ? (
            <div className="p-16 text-center text-zinc-600 text-sm font-bold uppercase tracking-widest italic">
              Nenhuma submissão pendente de aprovação no momento.
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {pendingItems.map(item => (
                <div key={item.id} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-4">
                      <h4 className="text-lg font-black text-white italic uppercase">{item.title}</h4>
                      <span className="text-[9px] px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-black uppercase italic">
                        {item.visibility}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-zinc-400 bg-black/40 p-4 rounded-2xl max-w-3xl line-clamp-3">
                      {item.content_preview}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-600">Origem: {item.source} · {item.created_at}</span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <button
                      onClick={() => handleApprovePending(item.id)}
                      className="px-6 py-3 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider italic shadow-lg hover:scale-105 transition-all"
                    >
                      Aprovar & Indexar
                    </button>
                    <button
                      onClick={() => handleRejectPending(item.id)}
                      className="px-6 py-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-xs font-black uppercase tracking-wider italic transition-all"
                    >
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
