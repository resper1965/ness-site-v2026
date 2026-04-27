import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { DeckDocument, BRANDS, TEMPLATES, type SlideContent } from "../components/decks/DeckDocument";

export default function DecksPage() {
  const [brand, setBrand] = useState("ness");
  const [template, setTemplate] = useState("comercial");
  const [title, setTitle] = useState("");
  const [slides, setSlides] = useState<SlideContent[]>([]);
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<{ title: string; brand: string; template: string; date: string; url: string }[]>([]);

  const handleGenerate = () => {
    const tpl = TEMPLATES[template];
    if (!tpl) return;
    const preSlides = tpl.slides.slice(1, -1).map((s) => ({
      title: s,
      body: `Conteúdo da seção "${s}" — edite abaixo antes de exportar.`,
    }));
    setSlides(preSlides);
    setPdfUrl(null);
  };

  const handleSlideChange = (idx: number, field: "title" | "body", value: string) => {
    setSlides((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };

  const handleExportPdf = async () => {
    setGenerating(true);
    try {
      const date = new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long" });
      const blob = await pdf(
        <DeckDocument brand={brand} title={title || "Apresentação"} slides={slides} date={date} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      setHistory((prev) => [{ title: title || "Sem título", brand, template, date, url }, ...prev]);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${brand}-${template}-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
            Geração Dinâmica de Proposals em PDF
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
         <div className="xl:col-span-1 space-y-6">
           <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
             <div className="bg-muted/30 p-5 border-b border-border/40">
               <h3 className="font-semibold leading-none tracking-tight">Parametrizar Documento</h3>
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
                   <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Framework / Template</label>
                   <select 
                     value={template} 
                     onChange={(e) => setTemplate(e.target.value)} 
                     className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background/50 px-4 py-2 text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer text-foreground"
                   >
                     {Object.entries(TEMPLATES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                   </select>
                </div>
                <div className="space-y-2.5">
                   <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Título Comercial</label>
                   <input 
                     type="text" 
                     value={title} 
                     onChange={(e) => setTitle(e.target.value)} 
                     placeholder="Proposal Title..."
                     className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                   />
                </div>
                <button 
                  className="inline-flex mt-2 w-full h-11 items-center justify-center rounded-md border border-input bg-background px-6 font-bold uppercase text-xs tracking-wider shadow-sm hover:bg-accent hover:text-accent-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={handleGenerate}
                >
                  <svg className="mr-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  Carregar Blueprint
                </button>
             </div>
           </div>

           {history.length > 0 && (
             <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
               <div className="bg-muted/30 p-5 border-b border-border/40 flex items-center justify-between">
                 <h3 className="font-semibold leading-none tracking-tight">Histórico de Sessão</h3>
                 <span className="inline-flex items-center justify-center rounded-md bg-background border border-border px-2 py-0.5 font-mono text-[10px] font-bold shadow-sm">
                   {history.length}
                 </span>
               </div>
               <div className="divide-y divide-border">
                 {history.map((h, i) => (
                   <div key={i} className="p-4 hover:bg-muted/50 transition-colors flex flex-col gap-2">
                     <span className="text-xs font-bold text-foreground lead-tight">{h.title}</span>
                     <div className="flex gap-2 items-center">
                        <span className="inline-flex items-center rounded bg-accent/20 border border-border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-foreground">
                           {h.brand}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">{h.date}</span>
                     </div>
                     <button
                        onClick={() => { const a = document.createElement('a'); a.href = h.url; a.download = `${h.brand}-deck.pdf`; a.click(); }}
                        className="inline-flex mt-1 items-center justify-center h-7 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 hover:bg-primary hover:text-white rounded transition-colors w-max px-3 border border-primary/20"
                     >
                        Download PDF
                     </button>
                   </div>
                 ))}
               </div>
             </div>
           )}
         </div>

         <div className="xl:col-span-3 space-y-6">
            {!slides.length ? (
               <div className="flex-1 flex flex-col items-center justify-center p-20 rounded-xl border border-dashed border-border/60 bg-muted/20 text-center">
                 <div className="h-16 w-16 rounded-full bg-accent/10 text-muted-foreground flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                 </div>
                 <h3 className="font-bold text-foreground">Aguardando Blueprint</h3>
                 <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                   Defina os parâmetros na lateral esquerda e carregue o blueprint para iniciar o editor visual de texto.
                 </p>
               </div>
            ) : (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Slide Editor */}
                  <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-[700px]">
                    <div className="bg-muted/30 p-5 border-b border-border/40 flex items-center justify-between shrink-0">
                      <h3 className="font-semibold leading-none tracking-tight">Data Entry ({slides.length} nodes)</h3>
                    </div>
                    <div className="bg-background flex-1 overflow-y-auto p-6 space-y-6">
                      {slides.map((slide, i) => (
                        <div key={i} className="space-y-3 group">
                           <div className="flex items-center justify-between border-b border-border/40 pb-2">
                             <div className="inline-flex font-mono text-[10px] font-bold tracking-widest text-accent items-center gap-2">
                                <span className="inline-block w-4 h-4 bg-accent/20 rounded text-center leading-4">{i + 2}</span>
                                <span className="uppercase">Index {String(i + 2).padStart(2, "0")}</span>
                             </div>
                           </div>
                           <input 
                             type="text" 
                             value={slide.title} 
                             onChange={(e) => handleSlideChange(i, "title", e.target.value)}
                             className="flex h-10 w-full rounded-md border-0 bg-transparent px-3 py-2 text-sm font-bold text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-sm ring-1 ring-border"
                           />
                           <textarea 
                             value={slide.body} 
                             onChange={(e) => handleSlideChange(i, "body", e.target.value)} 
                             rows={4}
                             className="flex w-full rounded-md border-0 bg-slate-950 font-mono text-[13px] text-emerald-400 opacity-90 p-3 shadow-inner ring-1 ring-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-y"
                           />
                        </div>
                      ))}
                    </div>
                    <div className="bg-muted/30 p-4 border-t border-border/40 shrink-0 flex gap-4">
                       <button 
                         className="inline-flex flex-1 h-11 items-center justify-center rounded-md bg-foreground text-background px-6 font-bold uppercase text-xs tracking-wider shadow hover:bg-foreground/90 transition-all disabled:opacity-50" 
                         onClick={handleExportPdf} 
                         disabled={generating}
                       >
                         {generating ? (
                           <>
                             <div className="w-3 h-3 rounded-full border-2 border-background/20 border-r-background animate-spin mr-2" />
                             Compilando V-DOM...
                           </>
                         ) : (
                           "Gerar Artefato PDF"
                         )}
                       </button>
                    </div>
                  </div>

                  {/* Render Preview */}
                  <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-[700px]">
                    <div className="bg-muted/30 p-5 border-b border-border/40 flex items-center justify-between shrink-0">
                      <h3 className="font-semibold leading-none tracking-tight">Renderer IFrame</h3>
                      {pdfUrl && (
                        <button onClick={handleDownload} className="inline-flex h-7 items-center justify-center rounded bg-primary text-white px-3 text-[10px] uppercase font-bold tracking-wider hover:bg-primary/90 transition-all">
                          Download Blob
                        </button>
                      )}
                    </div>
                    {pdfUrl ? (
                      <iframe src={pdfUrl} className="w-full h-full bg-stone-100" />
                    ) : (
                      <div className="flex-1 bg-stone-100/50 flex flex-col items-center justify-center text-center p-8 border-4 border-white">
                        <svg className="text-muted/50 mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                        <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground font-semibold">Waiting Build</p>
                      </div>
                    )}
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
