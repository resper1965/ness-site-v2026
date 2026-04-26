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
    return <div style={{ display: "flex", justifyContent: "center", padding: 64 }}><div className="loader-inline" /></div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <div className="card" style={{ padding: "20px 24px" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Total de Conversas</span>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", fontFamily: "var(--mono)", marginTop: 4 }}>{stats.totalChats}</div>
        </div>
        <div className="card" style={{ padding: "20px 24px" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Leads Convertidos</span>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", fontFamily: "var(--mono)", marginTop: 4 }}>{stats.totalLeads}</div>
        </div>
        <div className="card" style={{ padding: "20px 24px" }}>
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Conversas (7 dias)</span>
          <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)", fontFamily: "var(--mono)", marginTop: 4 }}>{stats.recentChats}</div>
        </div>
      </div>

      {/* Config */}
      <div className="card" style={{ padding: 24 }}>
        <div className="card-header" style={{ padding: 0, marginBottom: 20, border: "none" }}>
          <span className="card-title">Configuração da Gabi</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setConfig({ ...config, enabled: !config.enabled })}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                background: config.enabled ? "var(--accent)" : "var(--border)",
                position: "relative",
                transition: "background 0.2s",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  left: config.enabled ? 23 : 3,
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }}
              />
            </button>
            <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>
              Chatbot {config.enabled ? "Ativo" : "Desativado"}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {config.enabled ? "A Gabi está respondendo visitantes no site." : "A Gabi não aparecerá para visitantes."}
            </span>
          </div>

          {/* Tone */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Tom de Voz</label>
            <select
              value={config.tone}
              onChange={(e) => setConfig({ ...config, tone: e.target.value })}
              className="role-select"
              style={{ width: "100%", maxWidth: 400 }}
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Custom Prompt */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6 }}>
              Prompt Customizado (deixe vazio para usar o padrão)
            </label>
            <textarea
              value={config.customPrompt}
              onChange={(e) => setConfig({ ...config, customPrompt: e.target.value })}
              rows={8}
              placeholder={DEFAULT_PROMPT}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid var(--border)",
                borderRadius: 6,
                background: "var(--surface-2)",
                color: "var(--text)",
                fontSize: 13,
                lineHeight: 1.7,
                resize: "vertical",
                fontFamily: "var(--mono)",
              }}
            />
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}>
              Variáveis disponíveis: <code style={{ background: "var(--surface-2)", padding: "1px 4px", borderRadius: 3 }}>{"${lang}"}</code>, <code style={{ background: "var(--surface-2)", padding: "1px 4px", borderRadius: 3 }}>{"${ragContext}"}</code>
            </div>
          </div>

          {/* Save */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              className="btn"
              style={{ background: "var(--accent)", color: "#fff" }}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Salvando..." : "Salvar Configurações"}
            </button>
            {saved && (
              <span style={{ fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>
                ✓ Configurações salvas
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
