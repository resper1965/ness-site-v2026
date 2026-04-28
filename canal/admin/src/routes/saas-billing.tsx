import { useNavigate } from "react-router";

export default function SaasBilling() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300 relative min-h-screen">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line>
            </svg>
            Billing e Faturamento
          </h2>
          <p className="text-[13px] font-medium text-muted-foreground uppercase tracking-widest">
            Gestão de Assinatura
          </p>
        </div>
      </div>

      <div className="w-full flex items-center justify-center pt-24">
        <div className="flex flex-col items-center justify-center text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(var(--primary),0.3)]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">Módulo em Implementação</h3>
          <p className="text-muted-foreground text-sm mb-8">
            Nossa nova infraestrutura de faturamento e gestão de planos está sendo finalizada e estará disponível no seu próximo ciclo.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-card border border-border text-foreground rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:bg-muted/50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Voltar ao Início
          </button>
        </div>
      </div>
    </div>
  );
}
