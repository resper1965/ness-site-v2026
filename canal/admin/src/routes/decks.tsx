import { useState, useRef } from "react";
import { BRANDS } from "../components/decks/DeckDocument";

export default function DecksPage() {
  const [brand, setBrand] = useState("ness");
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<{ title: string; brand: string; date: string; filename: string }[]>([
    { title: "Proposta Corporativa", brand: "ness", date: "10 de outubro de 2026", filename: "proposal-corporativo-v1.pdf" }
  ]);

  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setTimeout(() => {
      setHistory(prev => [{ title: title || files[0].name, brand, date: new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long" }), filename: files[0].name }, ...prev]);
      setUploading(false);
      setTitle("");
    }, 1200);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Decks Engine <span className="text-muted-foreground font-light">::</span> Apresentações
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Repositório Simplificado de Apresentações Institucionais PDF
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
         <div className="xl:col-span-1 space-y-6">
           <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
             <div className="bg-muted/30 p-5 border-b border-border/40">
               <h3 className="font-semibold leading-none tracking-tight">Parametrizar Upload</h3>
             </div>
             <div className="p-6 space-y-5">
                <div className="space-y-2.5">
                   <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Tenant / Marca</label>
                   <select 
                     value={brand} 
                     onChange={(e) => setBrand(e.target.value)} 
                     className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background/50 px-4 py-2 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer text-foreground"
                   >
                     {Object.entries(BRANDS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
                   </select>
                </div>
                <div className="space-y-2.5">
                   <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Título Comercial Opcional</label>
                   <input 
                     type="text" 
                     value={title} 
                     onChange={(e) => setTitle(e.target.value)} 
                     placeholder="Ex: Q3 Master Deck"
                     className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                   />
                </div>
             </div>
           </div>
         </div>

         <div className="xl:col-span-3 space-y-6">
            <div
              className={`w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-16 transition-all cursor-pointer shadow-sm relative overflow-hidden ${
                 dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/50 bg-card hover:bg-muted/30"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files)}
              />
              {uploading ? (
                <div className="flex flex-col items-center justify-center gap-4 text-primary animate-pulse">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  <span className="font-bold uppercase tracking-wider text-sm">Processando PDF...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground pointer-events-none">
                  <div className="h-14 w-14 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center font-bold mb-2">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </div>
                  <p className="text-sm font-semibold text-foreground">Solte sua apresentação PDF pronta aqui</p>
                  <p className="text-xs font-semibold uppercase tracking-wider">Apenas material estático e aprovado</p>
                </div>
              )}
            </div>

            {history.length > 0 && (
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="bg-muted/30 p-5 border-b border-border/40 flex items-center justify-between">
                  <h3 className="font-semibold leading-none tracking-tight">Histórico de Decks da Organização</h3>
                  <span className="inline-flex items-center justify-center rounded-md bg-background border border-border px-2 py-0.5 font-mono text-[10px] font-bold shadow-sm">
                    {history.length}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {history.map((h, i) => (
                    <div key={i} className="p-4 hover:bg-muted/50 transition-colors flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-foreground lead-tight">{h.title}</span>
                        <div className="flex gap-2 items-center">
                           <span className="inline-flex items-center rounded bg-accent/10 border border-border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              Marca: {BRANDS[h.brand as keyof typeof BRANDS]?.name || h.brand}
                           </span>
                           <span className="text-[10px] font-mono text-muted-foreground uppercase">{h.date}</span>
                        </div>
                      </div>
                      <button className="inline-flex items-center justify-center h-8 text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 hover:bg-primary hover:text-white rounded transition-colors w-max px-4 border border-primary/20">
                         Baixar Original
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
