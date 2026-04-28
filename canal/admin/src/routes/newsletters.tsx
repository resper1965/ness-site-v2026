import { useState, useEffect } from "react";

type Subscriber = { id: number; email: string; created_at: string };

type Draft = {
  subject: string;
  preheader: string;
  audience: string;
  body: string;
};

const EMPTY_DRAFT: Draft = { subject: "", preheader: "", audience: "todos", body: "" };

const AUDIENCES = ["todos", "clientes", "prospects", "parceiros", "interno"];

export default function NewslettersPage() {
  const [draft, setDraft] = useState<Draft>({ ...EMPTY_DRAFT });
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ subject: string; count: number; date: string }[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [tab, setTab] = useState<"compose" | "subscribers">("compose");

  useEffect(() => {
    fetch("/api/admin/newsletter-subscribers", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setSubscribers(Array.isArray(data) ? data : []))
      .catch(() => setSubscribers([]));
  }, []);

  const handleSend = async () => {
    if (!draft.subject || !draft.body) {
      alert("Preencha o assunto e o corpo do e-mail.");
      return;
    }
    if (subscribers.length === 0) {
      alert("Nenhum assinante cadastrado. Adicione pelo menos um.");
      return;
    }
    if (!confirm(`Enviar "${draft.subject}" para ${subscribers.length} assinante(s)?`)) return;
    
    setSending(true);
    try {
      const res = await fetch("/api/admin/newsletters/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(draft),
      });
      const result = await res.json() as { success?: boolean; sent?: number; error?: string };
      if (result.success) {
        setSent((prev) => [
          { subject: draft.subject, count: result.sent || subscribers.length, date: new Date().toLocaleString("pt-BR") },
          ...prev,
        ]);
        setDraft({ ...EMPTY_DRAFT });
        alert(`Newsletter enviada com sucesso para ${result.sent || subscribers.length} destinatário(s)!`);
      } else {
        alert(`Erro: ${result.error || "Falha no envio"}`);
      }
    } catch {
      alert("Erro de rede ao enviar.");
    } finally {
      setSending(false);
    }
  };

  const handleAddSubscriber = async () => {
    if (!newEmail || !newEmail.includes("@")) return;
    try {
      const res = await fetch("/api/admin/newsletter-subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: newEmail }),
      });
      const result = await res.json() as { success?: boolean; id?: number };
      if (result.success) {
        setSubscribers((prev) => [{ id: result.id || Date.now(), email: newEmail, created_at: new Date().toISOString() }, ...prev]);
        setNewEmail("");
      }
    } catch { /* */ }
  };

  const handleRemoveSubscriber = async (id: number) => {
    if (!confirm("Remover este assinante permanente?")) return;
    await fetch(`/api/admin/newsletter-subscribers/${id}`, { method: "DELETE", credentials: "include" });
    setSubscribers((prev) => prev.filter((s) => s.id !== id));
  };

  const renderEmailPreview = () => {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:16px;overflow:hidden;box-shadow:0 10px 40px -10px rgba(0,0,0,0.1);">
        <div style="background:#0A0A0A;padding:32px 40px;display:flex;align-items:center;">
          <span style="font-family:Montserrat,sans-serif;font-size:24px;font-weight:900;color:#fff;letter-spacing:-0.5px;">ness<span style="color:#00ADE8;">.</span></span>
        </div>
        <div style="padding:48px 40px;">
          <h1 style="font-size:24px;color:#0f172a;margin:0 0 8px;font-weight:800;letter-spacing:-0.03em;">${draft.subject || "Assunto do e-mail"}</h1>
          <p style="font-size:14px;color:#64748b;margin:0 0 32px;font-weight:500;">${draft.preheader || ""}</p>
          <div style="font-size:15px;line-height:1.8;color:#334155;white-space:pre-wrap;">${draft.body || "Escreva algo impactante..."}</div>
        </div>
        <div style="background:#f8fafc;padding:32px 40px;border-top:1px solid #e2e8f0;text-align:center;">
          <p style="font-size:11px;color:#94a3b8;margin:0;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;">ness. · canal.ness.com.br · Você optou por receber esta newsletter.</p>
        </div>
      </div>
    `;
  };

  return (
    <div className="mx-auto max-w-7xl w-full flex-1 overflow-y-auto min-w-0 p-6 md:p-8 pt-6 md:pt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-400 custom-scrollbar">
      {/* Header Segment */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6 relative">
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border/60 to-transparent"></div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-3">
            <svg className="text-muted-foreground/60" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/><polyline points="14 2 14 8 20 8"/><path d="M5 11l-3 3 3 3"/><path d="M9 11l3 3-3 3"/></svg>
            Broadcasts <span className="text-muted-foreground/30 font-light mx-1">/</span> Newsletters
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Comunicações em Massa e Gestão de Audiência
          </p>
        </div>

        {/* Apple Segmented Control */}
        <div className="inline-flex h-10 items-center justify-center rounded-xl bg-muted/40 border border-border/50 p-1 text-muted-foreground w-full sm:w-auto">
          <button onClick={() => setTab('compose')} className={`inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-lg px-5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${tab === 'compose' ? 'bg-background text-foreground shadow-sm border border-border/60' : 'hover:text-foreground hover:bg-muted/80'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M21 15V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10"/></svg>
            Composição
          </button>
          <button onClick={() => setTab('subscribers')} className={`inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-lg px-5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${tab === 'subscribers' ? 'bg-background text-foreground shadow-sm border border-border/60' : 'hover:text-foreground hover:bg-muted/80'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Assinantes ({subscribers.length})
          </button>
        </div>
      </div>

      {tab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden transform transition-all">
              <div className="bg-muted/30 p-5 border-b border-border/50 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                <h3 className="text-sm font-semibold text-foreground">Nova Campanha Inbound</h3>
              </div>
              <div className="p-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase text-muted-foreground block">Assunto do E-mail</label>
                    <input
                      type="text"
                      className="flex h-11 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground/40"
                      value={draft.subject}
                      onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                      placeholder="Ex: Insight Letter nº 42"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase text-muted-foreground block">Cluster de Audiência</label>
                    <select
                      value={draft.audience}
                      onChange={(e) => setDraft({ ...draft, audience: e.target.value })}
                      className="flex h-11 w-full items-center justify-between rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm uppercase transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary font-mono tracking-wider font-semibold text-muted-foreground appearance-none"
                    >
                      {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase text-muted-foreground flex justify-between">
                    <span>Pré-header (Caixa de Entrada)</span>
                  </label>
                  <input
                    type="text"
                     className="flex h-11 w-full rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground/40"
                    value={draft.preheader}
                    onChange={(e) => setDraft({ ...draft, preheader: e.target.value })}
                    placeholder="Um resumo de 1 linha instigante para aumentar taxa de abertura."
                  />
                </div>

                <div className="space-y-2 mt-4">
                  <label className="text-xs uppercase text-muted-foreground flex justify-between mb-3 border-t border-border/30 pt-6">
                    Text Plain Output (Rmarkdown-like)
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md  border border-primary/20 shadow-sm">MARKDOWN ENGINE AUTO-ATTACHED</span>
                  </label>
                  <textarea
                    className="flex w-full rounded-xl border border-border/50 bg-background/50 px-5 py-5 text-sm font-mono leading-relaxed transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y placeholder:text-muted-foreground/30"
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                    rows={12}
                    placeholder="[ Injetar conteúdo estruturado de alta perfomance aqui... ]"
                  />
                </div>

                <div className="flex gap-4 items-center justify-between pt-6 mt-4 border-t border-border/30">
                  <button className="inline-flex h-10 items-center justify-center rounded-xl border border-border shadow-sm bg-background/50 px-6 font-bold uppercase text-xs tracking-wider transition-all hover:bg-muted hover:text-foreground" onClick={() => setShowPreview((v) => !v)}>
                    <svg className="mr-2 opacity-60" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    {showPreview ? "Recolher Viewer" : "Renderizar HTML"}
                  </button>
                  <button className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-8 text-xs font-medium uppercase tracking-wide text-primary-foreground shadow-[0_4px_14px_0_rgba(var(--primary),0.39)] hover:shadow-[0_6px_20px_rgba(var(--primary),0.23)] hover:-translate-y-px transition-all disabled:opacity-50 disabled:pointer-events-none" onClick={handleSend} disabled={sending}>
                    {sending ? "Transmitindo Pacotes..." : `Atirar p/ ${subscribers.length} Emails`}
                  </button>
                </div>
              </div>
            </div>

            {sent.length > 0 && (
              <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-muted/30 p-5 border-b border-border/50 flex items-center justify-between">
                  <h3 className="text-xs uppercase text-muted-foreground">Registro de Transmissão (Sessão Atual)</h3>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="w-full overflow-x-auto min-w-0 max-w-full custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-background/40 text-xs uppercase tracking-wide text-muted-foreground text-left">
                        <th className="font-bold py-3 px-5">Assunto Compilado</th>
                        <th className="font-bold py-3 px-5">Destinatários Hits</th>
                        <th className="font-bold py-3 px-5 text-right">Data/Hora Log</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sent.map((s, i) => (
                        <tr key={i} className="border-b border-border/20 transition-colors hover:bg-muted/30">
                          <td className="py-3 px-5 font-semibold text-foreground text-sm">{s.subject}</td>
                          <td className="py-3 px-5"><span className="inline-flex shadow-sm items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs tracking-wider font-bold font-mono text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">{s.count} disparos</span></td>
                          <td className="py-3 px-5 font-mono text-xs text-muted-foreground text-right">{s.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
             <div className={`rounded-2xl border border-border/50 shadow-lg overflow-hidden sticky top-8 transition-colors duration-500 ${showPreview ? 'bg-slate-100 dark:bg-slate-900 ring-1 ring-border/50' : 'bg-card text-card-foreground'}`}>
               <div className="bg-background/90 backdrop-blur-md p-5 border-b border-border/50 flex justify-between items-center">
                  <h3 className="text-xs uppercase text-foreground">Output: Terminal HTML</h3>
               </div>
               {showPreview ? (
                 <div className="p-6 overflow-x-auto custom-scrollbar">
                   <div className="rounded-xl overflow-hidden ring-1 ring-border shadow-2xl" style={{ transform: 'scale(1)', transformOrigin: 'top center' }} dangerouslySetInnerHTML={{ __html: renderEmailPreview() }} />
                 </div>
               ) : (
                 <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 rounded-full bg-muted/50 border border-border/50 text-muted-foreground flex items-center justify-center mb-5">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><line x1="4" y1="4" x2="20" y2="20"/></svg>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground">Clique em Renderizar HTML<br/>para simular a saída.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {tab === "subscribers" && (
        <div className="rounded-2xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-muted/30 p-5 lg:px-8 border-b border-border/50 flex sm:flex-row flex-col sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-base font-bold tracking-tight text-foreground">CRM de Assinantes</h3>
              <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide mt-1">Mailing List Master File</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Incluir raw email..."
                onKeyDown={(e) => e.key === "Enter" && handleAddSubscriber()}
                className="flex h-10 w-full sm:w-[260px] rounded-xl border border-border/50 bg-background/50 px-4 py-2 text-sm transition-all hover:bg-background focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-muted-foreground/40"
              />
              <button 
                className="inline-flex h-10 items-center justify-center rounded-xl bg-foreground px-5 text-xs font-medium uppercase tracking-wide text-background shadow-md hover:bg-foreground/90 transition-all shrink-0" 
                onClick={handleAddSubscriber}
              >
                Injetar
              </button>
            </div>
          </div>

          <div className="w-full overflow-x-auto min-w-0 max-w-full custom-scrollbar">
            {subscribers.length === 0 ? (
               <div className="p-20 flex flex-col items-center justify-center text-center bg-background/20">
                  <div className="h-16 w-16 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mb-5 animate-in zoom-in duration-500">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  </div>
                  <h4 className="text-base font-bold text-foreground">Lista de Captura Vazia</h4>
                  <p className="text-sm font-medium text-muted-foreground mt-1.5 max-w-[300px]">Sem leads inbound para a newsletter nativa.</p>
                </div>
            ) : (
               <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-background/40 text-xs uppercase tracking-wide text-muted-foreground text-left">
                    <th className="font-bold py-3.5 px-8">Nó Email (Identificável)</th>
                    <th className="font-bold py-3.5 px-6">Captado Em</th>
                    <th className="font-bold py-3.5 px-8 w-[100px] text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                    <tr key={s.id} className="border-b border-border/20 transition-colors hover:bg-muted/30">
                      <td className="py-3 px-8">
                        <div className="flex items-center gap-4">
                           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs uppercase border border-primary/20 shadow-sm">
                              {s.email.charAt(0)}
                           </div>
                           <span className="font-mono text-sm font-semibold text-foreground tracking-tight">{s.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 font-mono text-xs font-medium text-muted-foreground opacity-90">{s.created_at?.slice(0, 10)}</td>
                      <td className="py-3 px-8 text-right">
                        <button 
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-transparent hover:border-red-500/30 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all focus:outline-none shadow-sm" 
                          onClick={() => handleRemoveSubscriber(s.id)}
                          title="Remover assinatura"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
