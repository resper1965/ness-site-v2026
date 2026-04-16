import React, { useState } from "react";
import { useSession, signOut, authClient } from "../lib/auth-client";

export default function AccountSettingsPage() {
  const { data: session } = useSession();
  
  // States
  const [name, setName] = useState(session?.user?.name || "");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  
  // Feedback
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!session?.user) return null;

  const handleUpdateProfile = async () => {
    setMsg(""); setErrorMsg("");
    const { error } = await authClient.updateUser({ name });
    if (error) setErrorMsg(error.message || "Ocorreu um erro");
    else setMsg("Perfil atualizado com sucesso!");
  };

  const handleChangeEmail = async () => {
    setMsg(""); setErrorMsg("");
    if (!newEmail) return;
    const { error } = await authClient.changeEmail({ newEmail, callbackURL: "/login" });
    if (error) setErrorMsg(error.message || "Ocorreu um erro");
    // Como updateEmailWithoutVerification é falso por padrão, ele pedirá verificação.
    // Mas, como estamos em dev e podemos não ter SMTP, avisamos:
    else setMsg("Se o SMTP estiver ativo, você receberá um email de verificação. Caso contrário, consulte os logs.");
  };

  const handleChangePassword = async () => {
    setMsg(""); setErrorMsg("");
    if (!currentPassword || !newPassword) return;
    const { error } = await authClient.changePassword({ newPassword, currentPassword, revokeOtherSessions: true });
    if (error) setErrorMsg(error.message || "Ocorreu um erro");
    else setMsg("Senha alterada com sucesso! Outras sessões foram revogadas.");
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Certeza absoluta? Esta ação não pode ser desfeita e removerá seus dados e acessos.");
    if (!confirm) return;
    setMsg(""); setErrorMsg("");
    
    // Deleta exigindo a password atual caso seja Credential User
    const { error } = await authClient.deleteUser({ password: deletePassword });
    if (error) setErrorMsg(error.message || "Ocorreu um erro");
    else {
      alert("Conta excluída. Redirecionando...");
      window.location.href = "/login";
    }
  };

  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);
  React.useEffect(() => {
    authClient.listAccounts().then((res) => {
      if (res.data) setLinkedAccounts(res.data);
    });
  }, []);

  const handleLinkSocial = async (provider: "google" | "microsoft") => {
    const { error } = await authClient.linkSocial({ provider, callbackURL: "/account" });
    if (error) setErrorMsg(error.message || "Ocorreu um erro");
  };

  const handleUnlink = async (providerId: string) => {
    const { error } = await authClient.unlinkAccount({ providerId });
    if (error) setErrorMsg(error.message || "Ocorreu um erro");
    else {
      setMsg(`Conta ${providerId} desvinculada com sucesso.`);
      setLinkedAccounts(linkedAccounts.filter(a => a.providerId !== providerId));
    }
  };

  return (
    <div className="collection-page">
      <header className="page-header">
        <h1>Minha Conta</h1>
      </header>

      {msg && <div className="badge badge-read" style={{ marginBottom: "16px" }}>{msg}</div>}
      {errorMsg && <div className="error-msg" style={{ marginBottom: "16px" }}>{errorMsg}</div>}

      <div className="form-row-2">
        <section className="dashboard-section">
          <h2>Perfil</h2>
          <div className="card" style={{ marginTop: "12px" }}>
            <div className="field">
              <label>Nome Completo</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <button className="btn btn-primary" onClick={handleUpdateProfile} style={{ marginTop: "16px" }}>
              Salvar Nome
            </button>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>E-mail</h2>
          <div className="card" style={{ marginTop: "12px" }}>
            <p className="hint" style={{ marginBottom: "12px" }}>E-mail atual: <strong>{session.user.email}</strong></p>
            <div className="field">
              <label>Novo E-mail</label>
              <input 
                type="email" 
                placeholder="novo@email.com"
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
              />
            </div>
            <button className="btn btn-ghost" onClick={handleChangeEmail} style={{ marginTop: "16px" }}>
              Solicitar Troca de E-mail
            </button>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Segurança</h2>
          <div className="card" style={{ marginTop: "12px" }}>
            <div className="field">
              <label>Senha Atual</label>
              <input 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
              />
            </div>
            <div className="field" style={{ marginTop: "12px" }}>
              <label>Nova Senha</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </div>
            <button className="btn btn-primary" onClick={handleChangePassword} style={{ marginTop: "16px" }}>
              Alterar Senha
            </button>
            <p className="hint" style={{ marginTop: "8px", fontSize: "11px" }}>Ao alterar, todas as outras sessões ativas serão desconectadas.</p>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Contas Vinculadas</h2>
          <div className="card" style={{ marginTop: "12px" }}>
            <p className="hint" style={{ marginBottom: "16px" }}>Gerencie acessos via redes sociais associados a esta conta.</p>
            {linkedAccounts.length > 0 ? (
              <ul className="social-list">
                {linkedAccounts.map(acc => (
                  <li key={acc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <strong>{acc.providerId}</strong>
                    <button className="btn btn-ghost" onClick={() => handleUnlink(acc.providerId)} style={{ color: "var(--danger)" }}>
                      Desvincular
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="hint">Nenhuma conta vinculada no momento.</p>
            )}
            
            <div style={{ marginTop: "24px", display: "flex", gap: "8px" }}>
              <button className="btn btn-secondary" onClick={() => handleLinkSocial("google")}>
                 Logo do Google
              </button>
              <button className="btn btn-secondary" onClick={() => handleLinkSocial("microsoft")}>
                 Logo da Microsoft
              </button>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Zona de Risco</h2>
          <div className="card" style={{ marginTop: "12px", borderColor: "rgba(244,63,94,0.3)" }}>
            <h4 style={{ color: "var(--danger)", marginBottom: "8px" }}>Apagar Conta</h4>
            <p className="hint" style={{ marginBottom: "16px" }}>Para confirmar a exclusão da sua conta, digite sua senha atual abaixo.</p>
            <div className="field">
              <label>Senha Atual</label>
              <input 
                type="password" 
                value={deletePassword} 
                placeholder="Confirme sua senha..."
                onChange={(e) => setDeletePassword(e.target.value)} 
              />
            </div>
            <button className="btn btn-danger" onClick={handleDeleteAccount} style={{ marginTop: "16px" }}>
              Excluir Permanentemente
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
