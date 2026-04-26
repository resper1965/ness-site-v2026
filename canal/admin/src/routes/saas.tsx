import * as React from "react";
import { authClient } from "../lib/auth-client";
import { ShieldIcon } from "../components/saas/Icons";
import { OverviewTab } from "../components/saas/OverviewTab";
import { MembersTab } from "../components/saas/MembersTab";
import { PlanTab } from "../components/saas/PlanTab";
import { SettingsTab } from "../components/saas/SettingsTab";
import { ApiKeysTab } from "../components/saas/ApiKeysTab";

type Tab = "overview" | "members" | "plan" | "settings" | "api-keys";

const SUPER_ADMIN_EMAILS = ["resper@bekaa.eu", "admin@ness.com.br", "resper@ness.com.br"];

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
