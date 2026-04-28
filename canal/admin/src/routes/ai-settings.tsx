import { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";

type AIConfig = {
  enabled: boolean;
  tone: string;
  customPrompt: string;
};

type AIStats = {
  totalChats: number;
  totalLeads: number;
  recentChats: number;
};

const TONES = [
  { value: "executivo", label: "Executivo — Direto e elegante (padrão)" },
  { value: "formal", label: "Formal — Institucional e polido" },
  { value: "tecnico", label: "Técnico — Preciso e detalhado" },
  { value: "casual", label: "Casual — Acessível e leve" },
];

const DEFAULT_PROMPT = `Você é a Gabi, Secretária Executiva e concierge de alto nível da ness.
Elegante, discreta, de extrema confiança e DIRETA.
Responda sempre em no máximo 2-3 frases curtas.
Demonstre domínio do assunto com 1 frase precisa, depois redirecione para o time especialista.
Peça o contato do usuário de forma natural.`;

export default function AISettingsPage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [config, setConfig] = useState<AIConfig>({ enabled: true, tone: "executivo", customPrompt: "" });
  const [stats, setStats] = useState<AIStats>({ totalChats: 0, totalLeads: 0, recentChats: 0 });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/ai-settings", { credentials: "include" }).then((r) => r.json()),
      fetch("/api/admin/ai-stats", { credentials: "include" }).then((r) => r.json()),
    ]).then(([c, s]) => {
      if (c && !c.error) setConfig(c as AIConfig);
      if (s && !s.error) setStats(s as AIStats);
    }).finally(() => setLoading(false));
  }, [activeOrg?.id]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/admin/ai-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(config),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-16"><div className="loader-inline" /></div>;
  }

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
            Gabi.AI <span className="text-muted-foreground font-light">::</span> Concierge Neural
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Métricas cognitivas e parametrização de interface de conversação
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stats */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
            Total de Conversas
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          <div className="text-4xl font-black font-mono text-foreground tracking-tighter">{stats.totalChats}</div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
            Leads Convertidos
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
          </span>
          <div className="text-4xl font-black font-mono text-foreground tracking-tighter">{stats.totalLeads}</div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col p-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center justify-between">
            Conversas (7 dias)
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </span>
          <div className="text-4xl font-black font-mono text-foreground tracking-tighter">{stats.recentChats}</div>
        </div>
      </div>

      {/* Config */}
      <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden mt-6">
        <div className="bg-muted/30 p-5 border-b border-border/40">
          <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            Parâmetros Analíticos do LLM
          </h3>
        </div>

        <div className="p-6 space-y-8">
          {/* Toggle */}
          <div className="flex items-center gap-4 border border-border/50 bg-background/50 p-4 rounded-lg">
            <button
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                config.enabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                config.enabled ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground tracking-tight">
                Chatbot Periférico {config.enabled ? "Ativo" : "Desativado"}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {config.enabled ? "A Gabi está visível e interceptando visitantes no main site." : "A Gabi está bloqueada por firewall preventivo e não aparecerá nos domínios públicos."}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Perspectiva e Tom de Voz</label>
              <select
                value={config.tone}
                onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                  Prompt Mestre Customizado
                </label>
                <div className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-wider">
                  Variáveis: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">{"${lang}"}</code> <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">{"${ragContext}"}</code>
                </div>
              </div>
              <textarea
                value={config.customPrompt}
                onChange={(e) => setConfig({ ...config, customPrompt: e.target.value })}
                rows={10}
                placeholder={DEFAULT_PROMPT}
                className="flex w-full rounded-lg border border-input bg-background/50 px-4 py-4 text-sm font-mono shadow-inner transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary resize-vertical"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-end pt-4 border-t border-border/40">
            {saved && (
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1 animate-in fade-in zoom-in-95">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                Commited na D1
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex w-full sm:w-auto items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold h-10 px-8 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? (
                <><svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Persistindo...</>
              ) : (
                "Atualizar Prompt de Defesa"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
