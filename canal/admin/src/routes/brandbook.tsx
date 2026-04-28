import { useState, useEffect } from "react";
import { Link } from "react-router";
import { fetchEntries } from "../lib/api";
import { authClient } from "../lib/auth-client";
import { LogoCard } from "../components/brandbook/LogoCard";

export default function BrandbookHub() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchEntries("brandbook", { status: "all" }).then((res) => {
      setItems(res.data ?? []);
      setLoading(false);
    }).catch(() => {
      setItems([]);
      setLoading(false);
    });
  }, [activeOrg?.id]);

  const logos = items.filter(i => i.category === "logo");
  const colors = items.filter(i => i.category === "cor");
  const typography = items.filter(i => i.category === "tipografia");

  if (loading) {
    return <div className="flex justify-center p-16"><div className="loader-inline" /></div>;
  }

  return (
    <div className="mx-auto max-w-7xl w-full flex-1 min-w-0 p-6 md:p-8 pt-6 md:pt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-border/50 pb-6 relative shrink-0">
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent"></div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground/60" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Brandbook & Identidade
            {activeOrg && (
              <span className="inline-flex items-center rounded-lg bg-primary/10 px-2 py-1 text-xs uppercase tracking-wide font-semibold text-primary border border-primary/20">
                {activeOrg.slug}
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Assets de Marca do Grupo
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => setShowManual(v => !v)}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs uppercase tracking-wide font-semibold h-10 px-5 transition-all w-full sm:w-auto shadow-sm ${
              showManual 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/20' 
                : 'border border-border/60 bg-card hover:bg-muted/80 text-foreground'
            }`}
          >
            <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {showManual ? 'Ocultar Manual' : 'Como Usar'}
          </button>
          <Link to="/crud/brandbook" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xs uppercase tracking-wide font-semibold h-10 px-5 bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 transition-all w-full sm:w-auto">
            <svg className="mr-2 opacity-70" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
            Gerenciar Cadastros
          </Link>
        </div>
      </div>

      {showManual && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 mb-6">
          <div className="rounded-xl border border-primary/30 bg-primary/5 text-card-foreground shadow-sm overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <div className="p-6">
              <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2 mb-4 text-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Manual Operacional — Brandbook
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-foreground/80">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent"></div> Cadastrando uma Nova Cor</h4>
                    <ol className="list-decimal list-inside space-y-1.5 ml-1 text-muted-foreground">
                      <li>Clique em <strong className="text-foreground">Gerenciar Cadastros</strong>.</li>
                      <li>Na listagem, clique em <strong className="text-foreground">+ Novo Registro</strong>.</li>
                      <li>Preencha o Nome, Categoria <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">cor</code> e insira o Hex.</li>
                    </ol>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent"></div> Logotipos</h4>
                    <p className="text-muted-foreground ml-4 leading-relaxed">Siga o mesmo caminho da cor, selecione a Categoria <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">logo</code> e informe a Marca correspondente. O sistema gera previews light/dark e downloads SVG/PNG baseados em renderização em tempo real nativamente.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Colors */}
        <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-muted/30 p-5 px-6 border-b border-border/50 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Cores Corporativas</h3>
            </div>
            <span className="inline-flex items-center justify-center rounded-lg bg-background border border-border/60 px-3 py-1 font-mono text-xs font-medium tracking-wide text-muted-foreground">
              {colors.length} {colors.length === 1 ? "cor" : "cores"}
            </span>
          </div>
          
          <div className="p-6 md:p-8">
            {colors.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-12 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Nenhuma cor alocada para o tenant ativo no contexto visual.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {colors.map((color: any) => (
                  <div 
                    key={color.id} 
                    className="group flex flex-col rounded-xl border border-border/60 bg-background p-3 shadow-sm transition-all hover:shadow hover:border-accent/40 cursor-pointer overflow-hidden relative"
                    onClick={() => navigator.clipboard.writeText(color.hex_value)} title="Clique para copiar HEX"
                  >
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="w-full aspect-4/3 rounded-lg mb-3 relative" style={{ backgroundColor: color.hex_value || '#ccc' }}>
                       <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg"></div>
                    </div>
                    <div className="flex flex-col gap-0.5 z-10">
                      <span className="font-bold text-sm tracking-tight text-foreground truncate">{color.title}</span>
                      <span className="font-mono text-xs font-semibold text-muted-foreground uppercase">{color.hex_value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Logos */}
        <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-muted/30 p-5 px-6 border-b border-border/50 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Logos e Assinaturas (Preview Renderer)</h3>
            </div>
            <span className="inline-flex items-center justify-center rounded-lg bg-background border border-border/60 px-3 py-1 font-mono text-xs font-medium tracking-wide text-muted-foreground">
              {logos.length} {logos.length === 1 ? "logo" : "logos"}
            </span>
          </div>
          
          <div className="p-6 md:p-8">
            {logos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-12 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Nenhum motor de logo configurado para processamento dinâmico neste tenant.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {logos.map((logo: any) => <LogoCard key={logo.id} logo={logo} />)}
              </div>
            )}
          </div>
        </div>

        {/* Typography */}
        <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden">
          <div className="bg-muted/30 p-5 px-6 border-b border-border/50 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Tipografia</h3>
            </div>
            <span className="inline-flex items-center justify-center rounded-lg bg-background border border-border/60 px-3 py-1 font-mono text-xs font-medium tracking-wide text-muted-foreground">
              {typography.length} {typography.length === 1 ? "fonte" : "fontes"}
            </span>
          </div>
          
          <div className="p-6 md:p-8">
            {typography.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/60 bg-muted/10 p-12 text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Familia tipográfica não estabelecida no manual central.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {typography.map((font: any) => (
                  <div key={font.id} className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background p-5 shadow-sm">
                    <div className="text-4xl font-bold tracking-tighter text-foreground font-mono mb-2">Aa</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-base tracking-tight text-foreground">{font.title}</span>
                      <span className="text-xs font-medium text-muted-foreground leading-relaxed">{font.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
