import { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total de Conversas"
          value={stats.totalChats}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
        />
        <StatCard
          label="Leads Convertidos"
          value={stats.totalLeads}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>}
        />
        <StatCard
          label="Conversas (7 dias)"
          value={stats.recentChats}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
        />
      </div>

      {/* Config */}
      <Card>
        <CardHeader>
          <CardTitle icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          }>
            Parâmetros do LLM
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Toggle */}
          <div className="flex items-center gap-4 border border-border/50 bg-background/50 p-4 rounded-lg">
            <button
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
                config.enabled ? "bg-primary" : "bg-muted"
              }`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                config.enabled ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                Chatbot {config.enabled ? "Ativo" : "Desativado"}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {config.enabled ? "Gabi está visível e interceptando visitantes." : "Gabi está bloqueada e não aparecerá nos domínios públicos."}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground">Tom de Voz</label>
              <select
                value={config.tone}
                onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {TONES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-sm font-semibold text-muted-foreground">Prompt Customizado</label>
                <span className="text-[10px] text-muted-foreground/70">
                  Variáveis: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"${lang}"}</code> <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"${ragContext}"}</code>
                </span>
              </div>
              <textarea
                value={config.customPrompt}
                onChange={(e) => setConfig({ ...config, customPrompt: e.target.value })}
                rows={10}
                placeholder={DEFAULT_PROMPT}
                className="flex w-full rounded-lg border border-border bg-background px-4 py-3 text-sm font-mono transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="justify-end gap-3">
          {saved && (
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 animate-in fade-in">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              Salvo
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-lg text-sm font-semibold h-9 px-6 bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Atualizar Prompt"}
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
