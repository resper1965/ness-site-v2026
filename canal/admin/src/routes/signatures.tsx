import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "../components/ui/Card";
import { TabGroup, TabPanel } from "../components/ui/Tabs";
import { SignaturePreview } from "../components/signatures/SignaturePreview";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error", onClose?: () => void }) {
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
      {onClose && (
        <button onClick={onClose} className="ml-2 hover:opacity-70 focus:outline-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
      )}
    </div>
  );
}

const DEPARTMENTS = [
  "Diretoria", "Engenharia", "Comercial", "Operações",
  "RH", "Financeiro", "Marketing", "Cybersecurity", "Legal", "Infraestrutura",
];

// Reutilizamos o hook fetch das chamadas para API
async function fetchBrandAssets() {
  try {
    const res = await fetch("/api/admin/brand/assets");
    if (!res.ok) throw new Error("Erro de rede");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function fetchMySignature() {
  try {
    const res = await fetch("/api/admin/brand/signature/me?type=json");
    if (!res.ok) throw new Error("Erro ao buscar dados do usuário");
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default function BrandbookHub() {
  const [activeTab, setActiveTab] = useState("generator");
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState<any>(null);
  
  const [form, setForm] = useState({
    name: "", role: "", email: "", phone: "+55 11 00000-0000",
    brand: "ness", department: "Engenharia",
    linkedin: "https://www.linkedin.com/company/ness", disclaimer: true,
  });

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    async function init() {
      const [assets, sig] = await Promise.all([fetchBrandAssets(), fetchMySignature()]);
      if (assets?.complete_book) {
        setBrandData(assets);
      }
      if (sig?.base_form) {
        setForm({ ...form, ...sig.base_form });
      }
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const copyHTML = () => {
    const el = document.getElementById("sig-preview");
    if (!el) return;
    navigator.clipboard.writeText(el.innerHTML).then(() => {
      setCopied(true);
      setToast({ message: "HTML Snippet copiado com sucesso.", type: "success" });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    setDownloading(true);
    // Compilar querystring
    const qs = new URLSearchParams({
      type: 'file',
      name: form.name,
      role: form.role,
      email: form.email,
      phone: form.phone,
      brand: form.brand,
      linkedin: form.linkedin,
      disclaimer: String(form.disclaimer)
    }).toString();
    
    // Redirect / window.open to force download
    window.location.href = `/api/admin/brand/signature/me?${qs}`;
    
    setTimeout(() => {
      setDownloading(false);
      setToast({ message: "Download HTML gerado.", type: "success" });
    }, 1500);
  };

  if (loading) {
    return <div className="p-12 text-center text-muted-foreground animate-pulse text-sm font-semibold uppercase tracking-widest">Carregando Brandbook...</div>;
  }

  const BRANDS = brandData?.complete_book ? Object.keys(brandData.complete_book) : ["ness"];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
           <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M10 12l2 2 4-4"/></svg>
             Identidade <span className="text-muted-foreground font-light">::</span> Brandbook
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
             Acesso Unificado aos Ativos de Marca e Assinaturas
          </p>
        </div>
      </div>

      <TabGroup 
        active={activeTab} 
        onChange={setActiveTab} 
        tabs={[
          { id: "generator", label: "Gerador de Assinatura" },
          { id: "assets", label: "Brand Assets" }
        ]} 
      />

      <TabPanel id="generator" active={activeTab}>
        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1.8fr] gap-6 items-start mt-6">
          {/* Form Node */}
          <Card>
            <CardHeader>
              <CardTitle>Seus Detalhes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-6">
                {([
                  ["Nome Completo", "name", "Ex: Ana Souza", "text"],
                  ["Cargo", "role", "Ex: CPO", "text"],
                  ["E-mail corporativo", "email", "nome@ness.com.br", "email"],
                  ["Celular / Ramal", "phone", "+55 11 99999-9999", "text"],
                  ["URI do LinkedIn", "linkedin", "https://linkedin.com/…", "text"],
                ] as [string, string, string, string][]).map(([label, key, placeholder, type]) => (
                  <div key={key} className="space-y-2.5">
                    <label className="text-xs font-bold tracking-wide uppercase text-muted-foreground">{label}</label>
                    <input 
                      type={type} 
                      className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                      value={form[key as keyof typeof form] as string}
                      placeholder={placeholder}
                      onChange={e => setForm({ ...form, [key]: e.target.value })} 
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold tracking-wide uppercase text-muted-foreground">Entidade</label>
                    <select 
                      className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs font-semibold uppercase text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      value={form.brand}
                      onChange={e => setForm({ ...form, brand: e.target.value })}
                    >
                      {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold tracking-wide uppercase text-muted-foreground">Vínculo O.G.</label>
                    <select 
                      className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-xs font-semibold uppercase text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                    >
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="mt-2 pt-4 border-t border-border/50">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={form.disclaimer}
                        onChange={e => setForm({ ...form, disclaimer: e.target.checked })}
                        className="w-4 h-4 rounded border-input bg-background focus:ring-primary text-primary shadow-sm" 
                      />
                    </div>
                    <span className="text-xs font-bold tracking-wide uppercase text-muted-foreground">Afixar Disclaimer LGPD</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Engine Node */}
          <div className="flex flex-col gap-6 sticky top-6">
            <Card>
              <CardHeader>
                <CardTitle>Render Engine</CardTitle>
                <CardAction>
                  <button 
                    onClick={copyHTML} 
                    className={`inline-flex px-3 py-1.5 items-center justify-center rounded border ${copied ? "bg-emerald-500 border-emerald-600 text-white" : "bg-card border-border text-foreground hover:bg-muted/50"} text-xs font-semibold transition-colors mr-2`}
                  >
                    {copied ? "Copiado!" : "Clonar HTML"}
                  </button>
                  <button 
                    onClick={handleDownload}
                    disabled={downloading}
                    className="inline-flex px-4 py-1.5 rounded bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {downloading ? "Gerando..." : "Download .html"}
                  </button>
                </CardAction>
              </CardHeader>
              
              <div className="p-8 md:p-12 bg-slate-100 flex items-center justify-center min-h-[300px] overflow-auto min-w-0 max-w-full custom-scrollbar">
                  <div className="inline-block bg-white p-6 rounded border shadow-sm" style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.05)' }}>
                    <SignaturePreview form={form} />
                  </div>
              </div>
            </Card>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-accent/5 border border-accent/20">
                <div className="h-10 w-10 shrink-0 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Distribuição Oficial</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Opere o download para obter o arquivo estruturado. Para injetar, abra o cliente de e-mail e arraste o arquivo ou cole o conteúdo cru.
                  </p>
                </div>
            </div>
          </div>
        </div>
      </TabPanel>

      <TabPanel id="assets" active={activeTab}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          {brandData?.complete_book && Object.entries(brandData.complete_book).map(([key, brand]: [string, any]) => (
            <Card key={key}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="capitalize">{key}</CardTitle>
                    <p className="text-xs font-mono text-muted-foreground mt-1">{brand.websiteDisplay}</p>
                  </div>
                  <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: brand.colors.primary }}>
                    <span className="font-bold uppercase text-xs">{brand.logoWordmark.charAt(0)}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Color Palette</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="group rounded-lg border border-border p-3 flex flex-col gap-2 hover:border-primary transition-colors cursor-copy" onClick={() => navigator.clipboard.writeText(brand.colors.primary)}>
                      <div className="h-10 rounded shadow-inner" style={{ backgroundColor: brand.colors.primary }}></div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">Primary</span>
                        <span className="font-mono text-muted-foreground uppercase">{brand.colors.primary}</span>
                      </div>
                    </div>
                    <div className="group rounded-lg border border-border p-3 flex flex-col gap-2 hover:border-primary transition-colors cursor-copy" onClick={() => navigator.clipboard.writeText(brand.colors.bg)}>
                      <div className="h-10 rounded shadow-inner border border-border/50" style={{ backgroundColor: brand.colors.bg }}></div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-foreground">Background</span>
                        <span className="font-mono text-muted-foreground uppercase">{brand.colors.bg}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Logo Assets (R2 Stubs)</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-md bg-muted/30 border border-border/50">
                      <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        Logotipo (Claro)
                      </span>
                      <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 bg-background rounded border border-border">.SVG</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-md bg-muted/30 border border-border/50">
                      <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        Símbolo Vector
                      </span>
                      <span className="text-xs font-mono text-muted-foreground px-2 py-0.5 bg-background rounded border border-border">.EPS</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabPanel>
    </div>
  );
}
