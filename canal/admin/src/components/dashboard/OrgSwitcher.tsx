import { useState, useEffect, useRef } from "react";
import { authClient, organization } from "../../lib/auth-client";

export function OrgSwitcher({ userEmail, isSuperAdmin }: { userEmail: string; isSuperAdmin: boolean }) {
  const { data: activeOrg } = authClient.useActiveOrganization();
  const { data: orgs } = authClient.useListOrganizations();
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Auto-activate ness for super admins who don't have an active org
  useEffect(() => {
    if (isSuperAdmin && !activeOrg && orgs?.length) {
      const globalOrg = orgs.find((o: any) => o.slug === 'ness-global') || orgs.find((o: any) => o.slug === 'ness') || orgs[0];
      if (globalOrg) {
        organization.setActive({ organizationId: globalOrg.id });
      }
    }
  }, [isSuperAdmin, activeOrg, orgs]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setCreating(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSwitch = async (orgId: string) => {
    await organization.setActive({ organizationId: orgId });
    setOpen(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const { data } = await organization.create({ name: newName, slug });
      if (data) await organization.setActive({ organizationId: data.id });
      setNewName("");
      setCreating(false);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const orgName = activeOrg?.name || "Workspace";
  const orgSlug = activeOrg?.slug || userEmail.split("@")[1]?.split(".")[0];

  return (
    <div className="org-switcher" ref={ref}>
      <button
        className={`org-switcher-btn${open ? " open" : ""}`}
        onClick={() => setOpen(!open)}
      >
        <div>
          <div style={{ lineHeight: 1.2 }}>{orgName}</div>
          {orgSlug && <div className="org-switcher-slug">{orgSlug}</div>}
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="org-dropdown">
          {orgs?.map((o: any) => (
            <button
              key={o.id}
              className={`org-dropdown-item${activeOrg?.id === o.id ? " active" : ""}`}
              onClick={() => handleSwitch(o.id)}
            >
              <span>{o.name}</span>
              {activeOrg?.id === o.id && (
                <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
          <div className="org-dropdown-divider" />

          {isSuperAdmin && (
            creating ? (
              <div className="org-create-inline">
                <input
                  autoFocus
                  placeholder="Nome da organização"
                  value={newName}
                  aria-label="Nome da organização"
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
                <div className="org-create-actions">
                  <button className="btn btn-sm btn-ghost" onClick={() => { setCreating(false); setNewName(""); }}>
                    Cancelar
                  </button>
                  <button className="btn btn-sm btn-primary" onClick={handleCreate} disabled={loading || !newName.trim()}>
                    {loading ? "..." : "Criar"}
                  </button>
                </div>
              </div>
            ) : (
              <button className="org-dropdown-create" onClick={() => setCreating(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Nova Organização
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
