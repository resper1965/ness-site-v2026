import { useState, useEffect } from "react";
import { Link } from "react-router";
import { createEntry } from "../lib/api";
import { SignaturePreview, BRAND_CONFIG } from "../components/signatures/SignaturePreview";

const BRANDS = ["ness", "trustness", "forense"];
const DEPARTMENTS = [
  "Diretoria", "Engenharia", "Comercial", "Operações",
  "RH", "Financeiro", "Marketing", "Cybersecurity", "Legal", "Infraestrutura",
];

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 font-medium text-sm text-white ${
      type === "success" ? "bg-emerald-500 border border-emerald-400" : "bg-red-500 border border-red-400"
    }`}>
      {type === "success" ? (
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      ) : (
         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
      )}
      {message}
    </div>
  );
}

export default function SignaturesHub() {
  const [form, setForm] = useState({
    name: "Ricardo Esper", role: "CEO", email: "resper@ness.com.br",
    phone: "+55 11 98339-7196", brand: "ness", department: "Diretoria",
    linkedin: "https://www.linkedin.com/company/ness", disclaimer: true,
  });

  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await createEntry("signatures", form);
      setToast({ message: "Salvo no histórico.", type: "success" });
    } catch { setToast({ message: "Erro ao salvar.", type: "error" }); }
    setSaving(false);
  };

  const copyHTML = () => {
    const el = document.getElementById("sig-preview");
    if (!el) return;
    navigator.clipboard.writeText(el.innerHTML).then(() => {
      setCopied(true);
      setToast({ message: "HTML Snippet copiado com sucesso.", type: "success" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
           <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M10 12l2 2 4-4"/></svg>
             Branding <span className="text-muted-foreground font-light">::</span> Assinaturas
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
             Gerador de Assinaturas Corporativas (HTML)
          </p>
        </div>
        <div className="flex items-center gap-3">
           <Link to="/crud/signatures" className="inline-flex h-10 items-center justify-center rounded-md border border-input shadow-sm bg-background px-4 font-semibold uppercase text-xs tracking-wider hover:bg-accent hover:text-accent-foreground transition-colors">
              Histórico
           </Link>
           <button 
             onClick={handleSave} 
             disabled={saving} 
             className="inline-flex h-10 items-center justify-center rounded-md bg-foreground text-background px-6 font-bold uppercase text-xs tracking-wider shadow hover:bg-foreground/90 transition-all disabled:opacity-50 border-0"
           >
             {saving ? "Registrando..." : "Registrar"}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-6 items-start">
        {/* Form Node */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="bg-muted/30 p-5 border-b border-border/40">
             <h3 className="font-semibold leading-none tracking-tight">Parametrização Visual</h3>
          </div>
          <div className="p-6 space-y-5">
             <div className="grid gap-5">
               {([
                 ["Nome Completo", "name", "Ex: Ana Souza", "text"],
                 ["Cargo", "role", "Ex: CPO", "text"],
                 ["E-mail corporativo", "email", "nome@ness.com.br", "email"],
                 ["Celular / Ramal", "phone", "+55 11 99999-9999", "text"],
                 ["URI do LinkedIn", "linkedin", "https://linkedin.com/…", "text"],
               ] as [string, string, string, string][]).map(([label, key, placeholder, type]) => (
                 <div key={key} className="space-y-2.5">
                   <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">{label}</label>
                   <input 
                     type={type} 
                     className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm text-foreground shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                     value={form[key as keyof typeof form] as string}
                     placeholder={placeholder}
                     onChange={e => setForm({ ...form, [key]: e.target.value })} 
                   />
                 </div>
               ))}
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2.5">
                   <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Entidade / Marca</label>
                   <select 
                     className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-[11px] font-bold tracking-wider uppercase text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                     value={form.brand}
                     onChange={e => setForm({ ...form, brand: e.target.value })}
                   >
                     {BRANDS.map(b => <option key={b} value={b}>{BRAND_CONFIG[b]?.name}</option>)}
                   </select>
                 </div>
                 <div className="space-y-2.5">
                   <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Vínculo O.G.</label>
                   <select 
                     className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-[11px] font-bold tracking-wider uppercase text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                     value={form.department}
                     onChange={e => setForm({ ...form, department: e.target.value })}
                   >
                     {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                 </div>
               </div>
               
               <div className="mt-2 pt-4 border-t border-border/40">
                 <label className="flex items-center gap-3 cursor-pointer">
                   <div className="relative flex items-center">
                     <input 
                       type="checkbox" 
                       checked={form.disclaimer}
                       onChange={e => setForm({ ...form, disclaimer: e.target.checked })}
                       className="w-4 h-4 rounded border-input bg-background focus:ring-primary text-primary shadow-sm" 
                     />
                   </div>
                   <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Afixar Disclaimer LGPD no rodapé</span>
                 </label>
               </div>
             </div>
          </div>
        </div>

        {/* Preview Engine Node */}
        <div className="flex flex-col gap-6 sticky top-6">
           <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
             <div className="bg-muted/30 p-5 border-b border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <h3 className="font-semibold leading-none tracking-tight">Render Engine</h3>
                   <span className="inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-white bg-accent animate-pulse tracking-wide ml-2">LIVE IO</span>
                </div>
                <button 
                  onClick={copyHTML} 
                  className={`inline-flex h-8 px-4 items-center justify-center rounded border ${copied ? "bg-emerald-500 border-emerald-600 text-white" : "bg-background border-border text-foreground hover:bg-accent hover:text-accent-foreground"} text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm`}
                >
                  {copied ? "Cód. Fonte na Área de Transf." : "Clonar HTML"}
                </button>
             </div>
             
             {/* Virtual Container representing email body background */}
             <div className="p-8 md:p-12 bg-slate-100 flex items-center justify-center min-h-[300px] overflow-auto">
                <div className="inline-block bg-white p-6 rounded border shadow-sm" style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.05)' }}>
                  <SignaturePreview form={form} />
                </div>
             </div>
           </div>

           <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
              <div className="h-10 w-10 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div>
                 <p className="text-sm font-semibold text-foreground">Como acoplar o elemento no Workspace:</p>
                 <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                   Opere o extrator acima via botão <strong>"Clonar HTML"</strong>. Navegue até seu G-Suite local (Web) &gt; Console Settings &gt; Signature e execute a colagem (<kbd className="bg-muted px-1.5 py-0.5 rounded border border-border/50 shadow-sm font-mono text-[10px]">CMD+V</kbd> ou <kbd className="bg-muted px-1.5 py-0.5 rounded border border-border/50 shadow-sm font-mono text-[10px]">CTRL+V</kbd>).
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
