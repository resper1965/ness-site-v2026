import { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import ChatsHistory from "./chats";

type AIConfig = {
  enabled: boolean;
  bot_name: string;
  avatar_url: string;
  welcome_message: string;
  system_prompt: string;
  theme_color: string;
  max_turns: number;
};

type AIStats = {
  totalChats: number;
  totalLeads: number;
  recentChats: number;
};

const DEFAULT_PROMPT = `Você é a Gabi, Secretária Executiva e concierge de alto nível da ness.
Elegante, discreta, de extrema confiança e DIRETA.
Responda sempre em no máximo 2-3 frases curtas.
Demonstre domínio do assunto com 1 frase precisa, depois redirecione para o time especialista.
Peça o contato do usuário de forma natural.`;

export default function AISettingsPage() {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [config, setConfig] = useState<AIConfig>({ 
    enabled: true, 
    bot_name: "Gabi.OS", 
    avatar_url: "", 
    welcome_message: "Olá! Como posso ajudar?", 
    system_prompt: "", 
    theme_color: "#00E5A0", 
    max_turns: 20 
  });
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
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Nome do Robô</label>
                <input
                  type="text"
                  value={config.bot_name}
                  onChange={(e) => setConfig({ ...config, bot_name: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Avatar URL (Opcional)</label>
                <input
                  type="text"
                  value={config.avatar_url || ""}
                  onChange={(e) => setConfig({ ...config, avatar_url: e.target.value })}
                  placeholder="https://exemplo.com/avatar.png"
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Cor Padrão (Theme Color)</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="color"
                    value={config.theme_color}
                    onChange={(e) => setConfig({ ...config, theme_color: e.target.value })}
                    className="h-10 w-20 cursor-pointer rounded-lg border-0 p-0"
                  />
                  <span className="text-sm font-mono text-muted-foreground">{config.theme_color}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Máximo de Interações</label>
                <input
                  type="number"
                  value={config.max_turns}
                  min={1} max={50}
                  onChange={(e) => setConfig({ ...config, max_turns: parseInt(e.target.value) || 20 })}
                  className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground">Mensagem de Boas-vindas</label>
                <textarea
                  value={config.welcome_message}
                  onChange={(e) => setConfig({ ...config, welcome_message: e.target.value })}
                  rows={3}
                  className="flex w-full rounded-lg border border-border bg-background px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-semibold text-muted-foreground">Prompt Customizado</label>
                  <span className="text-[10px] text-muted-foreground/70">
                    Variáveis: <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"${lang}"}</code> <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{"${ragContext}"}</code>
                  </span>
                </div>
                <textarea
                  value={config.system_prompt}
                  onChange={(e) => setConfig({ ...config, system_prompt: e.target.value })}
                  rows={8}
                  placeholder={DEFAULT_PROMPT}
                  className="flex w-full rounded-lg border border-border bg-background px-4 py-3 text-sm font-mono transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
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

      <div className="mt-8 pt-6 border-t border-border">
        <ChatsHistory />
      </div>
    </div>
  );
}
