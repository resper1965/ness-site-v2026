import * as React from "react";
import { authClient, organization, apiKey } from "../lib/auth-client";
import { ApiDocsViewer } from "../components/ApiDocsViewer";

type Tab = "overview" | "members" | "plan" | "settings" | "api-keys";

const SUPER_ADMIN_EMAILS = ["resper@bekaa.eu", "admin@ness.com.br"];

// SVG icons
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const BotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const KeyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
  </svg>
);

/* ── Helper: role badge ───────────────────────────── */
function RoleBadge({ role }: { role: string }) {
  const r = role?.toLowerCase() || "member";
  return <span className={`badge-role badge-role-${r}`}>{r}</span>;
}

/* ── Tab: Visão Geral ─────────────────────────────── */
function OverviewTab({ org, agents }: { org: any; agents: any[] }) {
  const memberCount = org?.members?.length || 0;

  return (
    <>
      {/* Hero card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "var(--radius-sm)",
            background: "var(--accent-soft)", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 700, color: "var(--accent)",
            fontFamily: "var(--display)"
          }}>
            {(org?.name || "?")[0]?.toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{org?.name}</h2>
            <span className="mono" style={{ fontSize: 12, color: "var(--text-muted)" }}>{org?.slug}</span>
            <span className="badge badge-new" style={{ marginLeft: 10 }}>
              {(org?.metadata?.plan || "free").toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Membros</div>
          <div className="stat-value">{memberCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Plano</div>
          <div className="stat-value" style={{ fontSize: 22 }}>
            {(org?.metadata?.plan || "free").toUpperCase()}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AI Agents</div>
          <div className="stat-value">{agents.length}</div>
        </div>
      </div>

      {/* Agents section */}
      <div className="card">
        <div className="card-header">
          <span className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BotIcon /> Agentes MCP
          </span>
        </div>
        {agents.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Modo</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((a: any) => (
                  <tr key={a.id}>
                    <td className="mono">{a.name}</td>
                    <td><span className="badge badge-read">{a.mode}</span></td>
                    <td><span className="badge badge-new">{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <BotIcon />
            <p>Nenhum agente registrado.</p>
            <p className="hint">Agentes se registram via <code>/.well-known/agent-configuration</code></p>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Tab: Membros ─────────────────────────────────── */
function MembersTab({ org, isAdmin }: { org: any; isAdmin: boolean }) {
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState("member");
  const [inviting, setInviting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const members = org?.members || [];

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setError("");
    setSuccess("");
    try {
      await organization.inviteMember({
        email: inviteEmail.trim(),
        role: inviteRole as any,
        organizationId: org.id,
      });
      setSuccess(`Convite enviado para ${inviteEmail}`);
      setInviteEmail("");
    } catch (e: any) {
      setError(e?.message || "Erro ao convidar membro");
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    if (!confirm("Remover este membro da organização?")) return;
    try {
      await organization.removeMember({
        memberIdOrEmail: memberId,
        organizationId: org.id,
      });
    } catch (e: any) {
      setError(e?.message || "Erro ao remover membro");
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    try {
      await organization.updateMemberRole({
        memberId,
        role: newRole as any,
        organizationId: org.id,
      });
    } catch (e: any) {
      setError(e?.message || "Erro ao alterar role");
    }
  };

  return (
    <>
      {/* Invite card */}
      {isAdmin && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div className="card-header">
            <span className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <MailIcon /> Convidar Membro
            </span>
          </div>
          <div className="form">
            <div className="form-row-2">
              <div className="field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="colaborador@empresa.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                />
              </div>
              <div className="field">
                <label>Role</label>
                <select
                  className="role-select"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={{ padding: "10px 14px", fontSize: 14 }}
                >
                  <option value="admin">Admin</option>
                  <option value="member">Editor</option>
                  <option value="member">User</option>
                </select>
              </div>
            </div>
            {error && <div className="error-msg">{error}</div>}
            {success && <div style={{ color: "var(--success)", fontSize: 13 }}>{success}</div>}
            <div className="action-row">
              <button className="btn btn-primary" onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
                {inviting ? "Enviando..." : "Enviar Convite"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Members table */}
      <div className="card">
        <div className="card-header">
          <span className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UsersIcon /> Membros ({members.length})
          </span>
        </div>
        {members.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Role</th>
                  {isAdmin && <th style={{ width: 100 }}>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {members.map((m: any) => (
                  <tr key={m.id}>
                    <td>{m.user?.name || "—"}</td>
                    <td className="mono" style={{ fontSize: 12 }}>{m.user?.email || m.email}</td>
                    <td>
                      {isAdmin && m.role !== "owner" ? (
                        <select
                          className="role-select"
                          value={m.role}
                          onChange={(e) => handleRoleChange(m.id, e.target.value)}
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Editor</option>
                        </select>
                      ) : (
                        <RoleBadge role={m.role} />
                      )}
                    </td>
                    {isAdmin && (
                      <td>
                        {m.role !== "owner" && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleRemove(m.id)}
                            title="Remover membro"
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <UsersIcon />
            <p>Nenhum membro na organização.</p>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Tab: Plano ───────────────────────────────────── */
function PlanTab({ org }: { org: any }) {
  const currentPlan = (org?.metadata?.plan || "free").toLowerCase();
  const [switching, setSwitching] = React.useState(false);

  const handleSwitch = async (plan: string) => {
    if (plan === currentPlan) return;
    setSwitching(true);
    try {
      await organization.update({
        data: { metadata: { ...org.metadata, plan } },
        organizationId: org.id,
      });
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div className="plan-grid">
      {/* Free Plan */}
      <div className={`plan-card${currentPlan === "free" ? " current" : ""}`}>
        {currentPlan === "free" && (
          <div className="plan-card-badge">
            <span className="badge badge-new">Atual</span>
          </div>
        )}
        <h3>Free</h3>
        <p className="plan-desc">Para equipes pequenas começando.</p>
        <ul className="plan-features">
          <li><CheckIcon /> 1 organização</li>
          <li><CheckIcon /> Até 3 membros</li>
          <li><CheckIcon /> Conteúdo ilimitado</li>
          <li><CheckIcon /> 1 agente MCP</li>
          <li><CheckIcon /> Brandbook básico</li>
        </ul>
        {currentPlan !== "free" ? (
          <button
            className="btn btn-ghost"
            onClick={() => handleSwitch("free")}
            disabled={switching}
          >
            {switching ? "..." : "Mudar para Free"}
          </button>
        ) : (
          <button className="btn btn-secondary" disabled>
            <ShieldIcon /> Plano Ativo
          </button>
        )}
      </div>

      {/* Pro Plan */}
      <div className={`plan-card${currentPlan === "pro" ? " current" : ""}`}>
        {currentPlan === "pro" && (
          <div className="plan-card-badge">
            <span className="badge badge-new">Atual</span>
          </div>
        )}
        <h3>Pro</h3>
        <p className="plan-desc">Para empresas e agências em crescimento.</p>
        <ul className="plan-features">
          <li><CheckIcon /> Organizações ilimitadas</li>
          <li><CheckIcon /> Membros ilimitados</li>
          <li><CheckIcon /> Conteúdo ilimitado</li>
          <li><CheckIcon /> Agentes MCP ilimitados</li>
          <li><CheckIcon /> Brandbook avançado</li>
          <li><CheckIcon /> Suporte prioritário</li>
          <li><CheckIcon /> API & Webhooks</li>
        </ul>
        {currentPlan !== "pro" ? (
          <button
            className="btn btn-primary"
            onClick={() => handleSwitch("pro")}
            disabled={switching}
          >
            {switching ? "..." : "Ativar Pro"}
          </button>
        ) : (
          <button className="btn btn-secondary" disabled>
            <ShieldIcon /> Plano Ativo
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Tab: Configurações ───────────────────────────── */
function SettingsTab({ org }: { org: any }) {
  const [name, setName] = React.useState(org?.name || "");
  const [slug, setSlug] = React.useState(org?.slug || "");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState("");

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await organization.update({
        data: { name, slug },
        organizationId: org.id,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirmDelete !== org.slug) return;
    await organization.delete({ organizationId: org.id });
    window.location.reload();
  };

  return (
    <>
      {/* Edit org */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <span className="card-title">Informações da Organização</span>
        </div>
        <div className="form">
          <div className="form-row-2">
            <div className="field">
              <label>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
              />
            </div>
          </div>
          <div className="action-row">
            {saved && <span style={{ color: "var(--success)", fontSize: 13, marginRight: "auto" }}>Salvo!</span>}
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ borderColor: "rgba(244,63,94,0.2)" }}>
        <div className="card-header">
          <span className="card-title" style={{ color: "var(--danger)" }}>Zona de Risco</span>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
          Excluir a organização remove todos os dados, membros e conteúdo permanentemente.
        </p>
        <div className="field" style={{ marginBottom: 12 }}>
          <label>Digite <strong style={{ color: "var(--danger)" }}>{org?.slug}</strong> para confirmar</label>
          <input
            type="text"
            placeholder={org?.slug}
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
          />
        </div>
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={confirmDelete !== org?.slug}
        >
          <TrashIcon /> Excluir Organização
        </button>
      </div>
    </>
  );
}

/* ── Tab: API Keys ────────────────────────────────── */
function ApiKeysTab({ org }: { org: any }) {
  const [name, setName] = React.useState("");
  const [generating, setGenerating] = React.useState(false);
  const [keyData, setKeyData] = React.useState<any>(null);
  const [error, setError] = React.useState("");
  const [keys, setKeys] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await authClient.$fetch(`/api/admin/api-keys/${org.id}`, { baseURL: window.location.origin });
      if (res.data) setKeys(res.data as any[]);
    } catch (e) {
      console.error("Failed to load keys", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchKeys();
  }, [org.id]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setGenerating(true);
    setError("");
    setKeyData(null);
    try {
      const res = await (apiKey as any).create({
         name: name.trim(),
         metadata: { orgId: org.id }
      });
      if (res.data) {
         setKeyData(res.data);
         fetchKeys();
      }
      if (res.error) setError(res.error.message || "Erro ao criar API Key");
    } catch(e: any) {
      setError(e.message || "Erro inesperado.");
    } finally {
       setGenerating(false);
    }
  };

  const handleRevoke = async (id: string, keyName: string) => {
    if (!confirm(`Revogar a chave "${keyName}"? Integrações irão falhar imediatamente.`)) return;
    try {
      const res = await authClient.$fetch(`/api/admin/api-keys/${id}`, { 
        method: "DELETE", 
        baseURL: window.location.origin 
      });
      if ((res.data as any)?.success) {
         fetchKeys();
      } else {
         alert("Erro ao revogar.");
      }
    } catch(err: any) {
      alert("Erro: " + err.message);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(400px, 1fr)', gap: '24px', alignItems: 'start' }}>
      <div className="card">
        <div className="card-header">
           <span className="card-title" style={{ display: "flex", alignItems: "center", gap: 8 }}><KeyIcon /> Tokens de Acesso (API Keys)</span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 20 }}>
           Gere chaves para agentes MCP, crawlers e integrações M2M se conectarem ao Canal CMS em nome desta Organização.
        </p>

        {/* Form */}
        <div className="form">
          <div className="field">
             <label>Nome do Token</label>
             <input type="text" placeholder="Ex: Claude MCP Agent" value={name} onChange={e => setName(e.target.value)} disabled={!!keyData} />
          </div>
          {error && <div className="error-msg">{error}</div>}
          
          {keyData ? (
             <div style={{ background: "var(--bg-card)", border: "1px dashed var(--accent)", padding: 16, borderRadius: "var(--radius-md)", marginTop: 16 }}>
               <h4 style={{ margin: "0 0 8px 0", color: "var(--accent)" }}>Chave Gerada com Sucesso</h4>
               <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>Copie o token abaixo. Você não poderá vê-lo novamente.</p>
               <div style={{ position: "relative" }}>
                 <code style={{ display: "block", padding: "12px 14px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", wordBreak: "break-all", fontSize: 14 }}>
                   {keyData.key}
                 </code>
                 <button 
                    className="btn btn-sm btn-ghost" 
                    style={{ position: "absolute", right: 6, top: 6 }}
                    onClick={() => navigator.clipboard.writeText(keyData.key)}
                 >
                   Copiar
                 </button>
               </div>
               <button className="btn btn-secondary" style={{ marginTop: 16, width: "100%" }} onClick={() => { setKeyData(null); setName(""); }}>
                 Gerar outro
               </button>
             </div>
          ) : (
             <div className="action-row">
               <button className="btn btn-primary" onClick={handleCreate} disabled={generating || !name.trim()}>
                 {generating ? "Gerando..." : "Gerar Novo Token"}
               </button>
             </div>
          )}
        </div>

        {keys.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h4 style={{ fontSize: 14, marginBottom: 12 }}>Chaves Ativas</h4>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Chave</th>
                    <th>Criada em</th>
                    <th style={{ width: 80 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {keys.map((k) => (
                    <tr key={k.id}>
                      <td><strong>{k.name}</strong></td>
                      <td className="mono" style={{ fontSize: 13, color: "var(--text-muted)" }}>{k.prefix || "sk_"}••••••••</td>
                      <td style={{ fontSize: 13, color: "var(--text-muted)" }}>{new Date(k.createdAt).toLocaleDateString("pt-BR")}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-ghost" 
                          style={{ color: "var(--danger)" }}
                          onClick={() => handleRevoke(k.id, k.name)}
                        >
                          Revogar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div style={{ position: 'sticky', top: '24px' }}>
        <ApiDocsViewer />
      </div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────── */
export default function SaasSettingsPage() {
  const { data: session } = authClient.useSession();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [agents, setAgents] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState<Tab>("overview");

  React.useEffect(() => {
    // Agents fetched via different API layer if needed
    setAgents([]);
  }, []);

  // Determine user role in this org
  const userEmail = session?.user?.email || "";
  const isSuperAdmin = SUPER_ADMIN_EMAILS.includes(userEmail);
  const myMembership = activeOrg?.members?.find((m: any) => m.user?.email === userEmail || m.userId === session?.user?.id);
  const myRole = myMembership?.role || "member";
  const isAdmin = isSuperAdmin || myRole === "owner" || myRole === "admin";
  const isEditor = isAdmin || myRole === "member";

  // Define visible tabs based on role
  const tabs: { key: Tab; label: string; visible: boolean }[] = [
    { key: "overview", label: "Visão Geral", visible: true },
    { key: "members", label: "Membros", visible: isEditor },
    { key: "plan", label: "Plano", visible: true },
    { key: "api-keys", label: "Desenvolvedor", visible: isAdmin },
    { key: "settings", label: "Configurações", visible: isAdmin },
  ];

  if (!activeOrg) {
    return (
      <div className="empty-state" style={{ minHeight: 400 }}>
        <ShieldIcon />
        <h3 style={{ fontSize: 16, fontWeight: 600 }}>Nenhuma organização selecionada</h3>
        <p style={{ color: "var(--text-muted)", maxWidth: 460, textAlign: "center", lineHeight: 1.5, marginTop: 12 }}>
          A página de Organização serve para gerenciar configurações, membros e planos do seu Tenant. 
          Você não está vinculado a uma organização no momento.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Tab bar */}
      <div className="tab-bar">
        {tabs.filter(t => t.visible).map((t) => (
          <button
            key={t.key}
            className={`tab-btn${activeTab === t.key ? " active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab org={activeOrg} agents={agents} />}
      {activeTab === "members" && isEditor && <MembersTab org={activeOrg} isAdmin={isAdmin} />}
      {activeTab === "plan" && <PlanTab org={activeOrg} />}
      {activeTab === "api-keys" && isAdmin && <ApiKeysTab org={activeOrg} />}
      {activeTab === "settings" && isAdmin && <SettingsTab org={activeOrg} />}
    </div>
  );
}
