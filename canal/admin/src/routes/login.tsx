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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 selection:bg-primary/20 selection:text-primary">
      <div className="w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-xl overflow-hidden shadow-black/5">
        <div className="p-8 sm:p-10 space-y-6">
          
          <div className="flex flex-col items-center justify-center space-y-4">
             <div className="w-16 h-16 rounded-2xl bg-foreground text-background flex items-center justify-center mb-2 shadow-sm border border-border/20">
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
             </div>
             <div className="text-center space-y-1.5">
                <h1 className="text-2xl font-black tracking-tighter text-foreground flex items-baseline justify-center gap-1">
                   Canal Aegis <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                </h1>
                <p className="text-sm font-medium text-muted-foreground">Autenticação restrita à equipe Root/Admin</p>
             </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
               <div className="space-y-2">
                 <label htmlFor="email" className="text-xs font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    Correio Eletrônico
                 </label>
                 <input
                   id="email"
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="voce@ness.com.br"
                   required
                   autoFocus
                   className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder:text-muted"
                 />
               </div>

               <div className="space-y-2">
                 <label htmlFor="password" className="text-xs font-bold tracking-wide uppercase text-muted-foreground flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Acesso Criptográfico
                 </label>
                 <input
                   id="password"
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   required
                   className="flex h-12 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary text-foreground placeholder:-translate-y-0.5 placeholder:text-3xl placeholder:align-middle"
                 />
               </div>
            </div>

            {error && (
               <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/10 text-red-500 flex items-center gap-3">
                  <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span className="text-xs font-bold tracking-wide">{error}</span>
               </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="inline-flex w-full h-12 items-center justify-center rounded-xl bg-foreground text-background px-6 font-black uppercase text-sm tracking-wide shadow-md hover:bg-foreground/90 transition-all active:scale-[0.98] border-0"
            >
              {loading ? (
                <>
                  <svg className="animate-spin mr-3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Validando Identidade
                </>
              ) : "Estabelecer Sessão"}
            </button>
          </form>
        </div>
        
        <div className="p-4 bg-muted/30 border-t border-border/50 text-center">
           <p className="text-xs font-mono font-medium text-muted-foreground uppercase opacity-70 tracking-wide">
              Acesso Monitorado & Auditado (SOC2)
           </p>
        </div>
      </div>
    </div>
  );
}
