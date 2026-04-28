import { useState, useEffect } from "react";
import { Link } from "react-router";
import { fetchEntries } from "../lib/api";
import { authClient } from "../lib/auth-client";
import { LogoCard } from "../components/brandbook/LogoCard";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-3">
            Brandbook & Identidade
            {activeOrg && (
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                {activeOrg.slug}
              </span>
            )}
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1">
            ASSETS DE MARCA DO GRUPO
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowManual(v => !v)}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-9 px-4 transition-all ${
              showManual 
                ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90' 
                : 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            <svg className="mr-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {showManual ? 'Ocultar Manual' : 'Como Usar'}
          </button>
          <Link to="/crud/brandbook" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-9 px-4 bg-foreground text-background shadow hover:bg-foreground/90 transition-all">
            <svg className="mr-2 opacity-70" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>
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
        <Card>
          <CardHeader>
            <CardTitle>Cores Corporativas</CardTitle>
            <CardAction>
              <Badge variant="neutral">
                <span className="font-mono">{colors.length} {colors.length === 1 ? "cor" : "cores"}</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {colors.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
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
                    <div className="w-full aspect-[4/3] rounded-md mb-3 shadow-inner relative" style={{ backgroundColor: color.hex_value || '#ccc' }}>
                       <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-md"></div>
                    </div>
                    <div className="flex flex-col gap-0.5 z-10">
                      <span className="font-bold text-sm tracking-tight text-foreground truncate">{color.title}</span>
                      <span className="font-mono text-xs font-semibold text-muted-foreground uppercase">{color.hex_value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Logos */}
        <Card>
          <CardHeader>
            <CardTitle>Logos e Assinaturas</CardTitle>
            <CardAction>
              <Badge variant="neutral">
                <span className="font-mono">{logos.length} {logos.length === 1 ? "logo" : "logos"}</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {logos.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
                Nenhum motor de logo configurado para processamento dinâmico neste tenant.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {logos.map((logo: any) => <LogoCard key={logo.id} logo={logo} />)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Tipografia</CardTitle>
            <CardAction>
              <Badge variant="neutral">
                <span className="font-mono">{typography.length} {typography.length === 1 ? "fonte" : "fontes"}</span>
              </Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            {typography.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 p-8 text-center text-sm text-muted-foreground">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
