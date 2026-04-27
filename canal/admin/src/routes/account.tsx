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
    <div className="flex-1 space-y-6 p-8 pt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Identidade Central <span className="text-muted-foreground font-light">::</span> Perfil
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Gestão de Credenciais e SSO
          </p>
        </div>
      </div>

      {(msg || errorMsg) && (
        <div className={`p-4 rounded-xl border ${errorMsg ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'} flex items-start gap-3`}>
          <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            {errorMsg ? <circle cx="12" cy="12" r="10"/> : <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>}
            {errorMsg ? <line x1="12" y1="8" x2="12" y2="12"/> : <polyline points="22 4 12 14.01 9 11.01"/>}
            {errorMsg && <line x1="12" y1="16" x2="12.01" y2="16"/>}
          </svg>
          <span className="text-sm font-bold tracking-wide">{errorMsg || msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Profile Card */}
        <section className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
          <div className="bg-muted/30 p-5 border-b border-border/40">
            <h3 className="font-semibold leading-none tracking-tight">Dados Cadastrais</h3>
          </div>
          <div className="p-6 space-y-5 flex-1">
            <div className="space-y-2.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Nome de Exibição</label>
              <input 
                type="text" 
                className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
            <button 
              className="inline-flex h-10 items-center justify-center rounded-md bg-foreground text-background px-6 font-bold uppercase text-xs tracking-wider shadow hover:bg-foreground/90 transition-all"
              onClick={handleUpdateProfile}
            >
              Salvar Perfil
            </button>
          </div>
        </section>

        {/* Email Card */}
        <section className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
          <div className="bg-muted/30 p-5 border-b border-border/40">
            <h3 className="font-semibold leading-none tracking-tight">Endereço de E-mail</h3>
          </div>
          <div className="p-6 space-y-5 flex-1">
            <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/20">
              E-mail autenticado: <strong className="text-foreground mono ml-1">{session.user.email}</strong>
            </p>
            <div className="space-y-2.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Habilitar Novo E-mail</label>
              <input 
                type="email" 
                placeholder="novo@dominio.com"
                className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={newEmail} 
                onChange={(e) => setNewEmail(e.target.value)} 
              />
            </div>
            <button 
              className="inline-flex h-10 items-center justify-center rounded-md border border-input shadow-sm bg-background px-6 font-semibold uppercase text-xs tracking-wider hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={handleChangeEmail}
            >
              Solicitar Migração
            </button>
          </div>
        </section>

        {/* Security / Password Card */}
        <section className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
          <div className="bg-muted/30 p-5 border-b border-border/40">
            <h3 className="font-semibold leading-none tracking-tight">Chaves de Acesso e Sessão</h3>
          </div>
          <div className="p-6 space-y-5 flex-1">
            <div className="space-y-2.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Senha Atual</label>
              <input 
                type="password" 
                className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
              />
            </div>
            <div className="space-y-2.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">Nova Senha Forte</label>
              <input 
                type="password" 
                className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </div>
            <div className="pt-2">
              <button 
                className="inline-flex h-10 items-center justify-center rounded-md bg-foreground text-background px-6 font-bold uppercase text-xs tracking-wider shadow hover:bg-foreground/90 transition-all"
                onClick={handleChangePassword}
              >
                Rotacionar Chave
              </button>
              <p className="text-xs text-muted-foreground mt-3 uppercase tracking-wide font-semibold opacity-70">
                Atenção: Revoga todas as outras sessões ativas do usuário.
              </p>
            </div>
          </div>
        </section>

        {/* Social / SSO Links */}
        <section className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
          <div className="bg-muted/30 p-5 border-b border-border/40">
            <h3 className="font-semibold leading-none tracking-tight">Delegações SSO (IdP)</h3>
          </div>
          <div className="p-6 space-y-6 flex-1">
            <div className="space-y-3">
              {linkedAccounts.length > 0 ? (
                <div className="space-y-2">
                  {linkedAccounts.map(acc => (
                    <div key={acc.id} className="flex justify-between items-center p-3 rounded border border-border/50 bg-background/40">
                      <strong className="font-mono text-sm capitalize">{acc.providerId}</strong>
                      <button 
                        className="text-xs font-bold text-red-500 uppercase hover:text-red-600 tracking-wider" 
                        onClick={() => handleUnlink(acc.providerId)}
                      >
                        Desvincular
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum provedor de identidade externo vinculado.</p>
              )}
            </div>
            
            <div className="flex gap-3 pt-2">
              <button 
                className="inline-flex h-10 items-center gap-2 justify-center rounded-md border border-input shadow-sm bg-background px-4 font-semibold uppercase text-xs tracking-wider hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => handleLinkSocial("google")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 12c0-.8-.1-1.6-.3-2.3H12v4.4h5.7c-.2 1.4-1 2.6-2.2 3.4v2.8h3.6C21.2 18.3 22 15.4 22 12V12z"/><path d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.6-2.8c-.9.6-2.1.9-3.3.9-2.5 0-4.6-1.7-5.4-4H3v2.8C4.7 20 8.1 22 12 22z"/><path d="M6.6 13.6c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V7.2H3C2.4 8.7 2 10.3 2 12s.4 3.3 1 4.8l3.6-3.2z"/><path d="M12 5.8c1.5 0 2.9.5 4 1.5l3-3C17.2 2.6 14.8 1.6 12 1.6 8.1 1.6 4.7 3.6 3 7.2l3.6 2.8C7.4 7.5 9.5 5.8 12 5.8z"/></svg> 
                Vincular Google
              </button>
              <button 
                className="inline-flex h-10 items-center gap-2 justify-center rounded-md border border-input shadow-sm bg-background px-4 font-semibold uppercase text-xs tracking-wider hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => handleLinkSocial("microsoft")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="9" height="9"/><rect x="13" y="2" width="9" height="9"/><rect x="2" y="13" width="9" height="9"/><rect x="13" y="13" width="9" height="9"/></svg> 
                Vincular Microsoft
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-xl border border-red-500/20 bg-card text-card-foreground shadow-sm overflow-hidden md:col-span-1 xl:col-span-2 mt-4 relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
          <div className="bg-red-500/5 p-5 border-b border-red-500/10">
            <h3 className="font-bold leading-none tracking-tight text-red-500">Limpeza Nuclear</h3>
          </div>
          <div className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-6 max-w-xl">
              Remoção permanente dos dados deste usuário, perda de vínculos e cancelamento de todos os direitos granulares atribuídos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-end max-w-xl">
               <div className="space-y-2.5 w-full">
                <label className="text-xs font-semibold tracking-wide uppercase text-red-500">Confirmar Senha</label>
                <input 
                  type="password" 
                  placeholder="Confirme sua senha para destravar..."
                  className="flex h-11 w-full rounded-lg border border-red-500/20 bg-background/50 px-4 py-2 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  value={deletePassword} 
                  onChange={(e) => setDeletePassword(e.target.value)} 
                />
              </div>
              <button 
                className="inline-flex h-11 items-center justify-center rounded-md bg-red-500 px-8 font-bold uppercase text-xs tracking-wider text-white shadow hover:bg-red-600 transition-all shrink-0 disabled:opacity-50"
                onClick={handleDeleteAccount}
                disabled={!deletePassword}
              >
                Aniquilar Conta
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
