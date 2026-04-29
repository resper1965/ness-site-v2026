import { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";

type Document = {
  id: string;
  title: string;
  status: 'pending' | 'indexed' | 'error';
  chunk_count: number;
  created_at: string;
};

export default function KnowledgeBasePage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/admin/knowledge-base", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setDocs(data as Document[]);
      })
      .finally(() => setLoading(false));
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
        body: JSON.stringify({ title, text_payload: rawText }),
      });
      setTitle('');
      setRawText('');
      setRefreshKey(k => k + 1); // trigger list refresh
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este documento da base de inteligência? (Os vetores podem demorar até 1h para sumirem completamente em cache)")) return;
    try {
      await fetch(`/api/admin/knowledge-base/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      setRefreshKey(k => k + 1);
    } catch(e) {
       console.error(e)
    }
  };

  if (loading) {
    return <div className="flex justify-center p-16"><div className="loader-inline" /></div>;
  }

  const indexedCount = docs.filter(d => d.status === 'indexed').length;
  const pendingCount = docs.filter(d => d.status === 'pending').length;
  const chunkCount = docs.reduce((acc, d) => acc + (d.chunk_count || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Documentos Indexados" value={indexedCount} />
        <StatCard label="Fatias (Chunks) RAG" value={chunkCount} />
        <StatCard label="Na Fila (Processando)" value={pendingCount} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Upload Form */}
        <Card className="xl:col-span-1 border border-border/50 bg-background/30 h-max">
          <CardHeader>
            <CardTitle icon={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            }>
              Inserir Conhecimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Título Documento</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Política Hibrida 2026"
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex justify-between">
                  <span>Conteúdo (Raw Text)</span>
                  <span className="text-[10px] lowercase-all bg-muted px-1.5 rounded text-foreground">Apenas .txt/.md (MVP)</span>
                </label>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={8}
                  placeholder="Cole aqui o texto puro do seu documento normativo, política ou página de suporte. A inteligência artificial fará o fracionamento automático."
                  className="flex w-full rounded-lg border border-border bg-background px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold h-10 px-6 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {uploading ? (
                  <>Processando...</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                    Indexar Documento
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Docs */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Memória Corporativa</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {docs.length === 0 ? (
              <div className="p-8 text-center border-t border-border/50 bg-background/20">
                <p className="text-sm font-medium text-foreground">Nenhum documento hospedado no Vectorize desta Org.</p>
                <p className="text-xs text-muted-foreground mt-1">Insira seu primeiro documento ao lado.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {docs.map(doc => (
                  <div key={doc.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                    <div className="flex gap-4 items-center">
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
                        doc.status === 'indexed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        doc.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          {doc.status === 'indexed' ? <polyline points="20 6 9 17 4 12"/> :
                           doc.status === 'pending' ? <circle cx="12" cy="12" r="10" /> :
                           <line x1="18" y1="6" x2="6" y2="18"/>}
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{doc.title}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          {new Date(doc.created_at).toLocaleDateString('pt-BR')} 
                          <span className="w-1 h-1 bg-border rounded-full" />
                          {doc.chunk_count} blocos fatiados
                          {doc.status === 'pending' && <span className="text-blue-500 ml-2">(Na Fila de Embeddings)</span>}
                          {doc.status === 'error' && <span className="text-red-500 ml-2">(Falha de processamento LLM)</span>}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                      title="Excluir Documento"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
