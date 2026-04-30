import { useState } from "react";
import { useNavigate } from "react-router";
import { signIn } from "../lib/auth-client";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn.email({ email, password, callbackURL: "/" });

    if (error) {
      setError(error.message ?? "Credenciais inválidas.");
      setLoading(false);
    } else {
      navigate("/");
    }
  }

  return (
    <div className="min-h-screen bg-background flex selection:bg-primary/20 selection:text-primary">
      {/* Lado Esquerdo - Hero/Branding */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-12 overflow-hidden border-r border-border shadow-glass">
        <div className="absolute inset-0 bg-zinc-950 dark:bg-black z-0">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent mix-blend-screen" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        </div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-lg">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">Canal CMS</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-xl">
          <h1 className="text-5xl font-black tracking-tight text-white leading-[1.1]">
            Inteligência e Governança Integradas
          </h1>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed">
            Plataforma central unificada para gestão de dados, compliance DPO, instrumentação de vulnerabilidades e curadoria de conteúdo B2B, auditável 100% via arquitetura Zero-Trust.
          </p>
          <div className="mt-8 flex gap-4">
             <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
                <span className="block text-3xl font-black text-white">14ms</span>
                <span className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mt-1">Latência API</span>
             </div>
             <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10">
                <span className="block text-3xl font-black text-emerald-400">SOC2</span>
                <span className="block text-xs uppercase tracking-widest text-zinc-500 font-bold mt-1">Audit Trail</span>
             </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-zinc-500 font-mono text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Todos os sistemas operacionais (Aegis Shield Guard)
        </div>
      </div>

      {/* Lado Direito - Form de Login */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-[420px] space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Acesso Autorizado
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              Autentique-se com sua credencial criptográfica corporativa.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
               <div className="space-y-2 group">
                 <label htmlFor="email" className="text-xs font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
                    Correio Eletrônico
                 </label>
                 <input
                   id="email"
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="seu.nome@ness.com.br"
                   required
                   autoFocus
                   className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder:text-muted hover:border-primary/50"
                 />
               </div>

               <div className="space-y-2">
                 <label htmlFor="password" className="text-xs font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
                    Credencial de Acesso
                 </label>
                 <input
                   id="password"
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   required
                   className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder:-translate-y-0.5 placeholder:text-3xl placeholder:align-middle hover:border-primary/50"
                 />
               </div>
            </div>

            {error && (
               <div className="p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-3 animate-in fade-in zoom-in duration-300 shadow-sm">
                  <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span className="text-xs font-bold tracking-wide">{error}</span>
               </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="inline-flex w-full h-12 items-center justify-center rounded-xl bg-primary text-primary-foreground px-6 font-bold text-sm shadow-[0_4px_14px_0_rgba(var(--primary-rgb),0.39)] hover:shadow-[0_6px_20px_rgba(var(--primary-rgb),0.23)] hover:bg-primary/90 hover:-translate-y-0.5 transition-all outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin mr-3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Estabelecendo Conexão...
                </>
              ) : "Entrar no Sistema"}
            </button>
          </form>

          <div className="pt-8 text-center border-t border-border/50">
             <p className="text-[11px] font-mono font-medium text-muted-foreground uppercase opacity-70 tracking-widest">
                Acesso Monitorado & Auditado (SOC2)
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
