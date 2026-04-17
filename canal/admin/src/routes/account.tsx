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
      if (res.data) setLinkedAccounts(res.data.filter((a: any) => a.providerId !== 'credential'));
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
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12c0-.8-.1-1.6-.3-2.3H12v4.4h5.7c-.2 1.4-1 2.6-2.2 3.4v2.8h3.6C21.2 18.3 22 15.4 22 12V12z"/><path d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.6-2.8c-.9.6-2.1.9-3.3.9-2.5 0-4.6-1.7-5.4-4H3v2.8C4.7 20 8.1 22 12 22z"/><path d="M6.6 13.6c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.2H3C2.4 8.7 2 10.3 2 12s.4 3.3 1 4.8l3.6-3.2z"/><path d="M12 5.8c1.5 0 2.9.5 4 1.5l3-3C17.2 2.6 14.8 1.6 12 1.6 8.1 1.6 4.7 3.6 3 7.2l3.6 2.8C7.4 7.5 9.5 5.8 12 5.8z"/></svg> Google
              </button>
              <button className="btn btn-secondary" onClick={() => handleLinkSocial("microsoft")}>
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg> Microsoft
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
