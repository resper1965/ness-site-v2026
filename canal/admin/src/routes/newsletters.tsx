import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";

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
    <div className="flex-1 space-y-6 p-9 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-3">
             <svg className="text-muted-foreground" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/><polyline points="14 2 14 8 20 8"/><path d="M5 11l-3 3 3 3"/><path d="M9 11l3 3-3 3"/></svg>
            Broadcasts <span className="text-muted-foreground font-light">::</span> Newsletters
          </h2>
          <p className="text-sm font-medium text-muted-foreground tracking-wide mt-1 uppercase">
            Comunicações em Massa e Gestão de Audiência
          </p>
        </div>

        <div className="inline-flex h-10 items-center justify-center rounded-lg bg-card border border-border/60 p-1 text-muted-foreground shadow-sm w-full sm:w-auto">
          <button onClick={() => setTab('compose')} className={`inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all ${tab === 'compose' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'hover:text-foreground hover:bg-muted/50'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M21 15V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10"/></svg>
            Composição
          </button>
          <button onClick={() => setTab('subscribers')} className={`inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-xs font-semibold transition-all ${tab === 'subscribers' ? 'bg-background text-foreground shadow-sm border border-border/50' : 'hover:text-foreground hover:bg-muted/50'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Assinantes ({subscribers.length})
          </button>
        </div>
      </div>

      {tab === "compose" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nova Campanha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-muted-foreground">Assunto do E-mail</label>
                    <input
                      type="text"
                      className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                      value={draft.subject}
                      onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                      placeholder="Ex: Insight Letter nº 42"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-sm font-semibold text-muted-foreground">Cluster de Audiência</label>
                    <select
                      value={draft.audience}
                      onChange={(e) => setDraft({ ...draft, audience: e.target.value })}
                      className="flex h-11 w-full items-center justify-between rounded-lg border border-input bg-background/50 px-4 py-2 text-sm uppercase shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-mono tracking-wider font-semibold text-muted-foreground"
                    >
                      {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-muted-foreground">Pré-header (Caixa de Entrada)</label>
                  <input
                    type="text"
                    className="flex h-11 w-full rounded-lg border border-input bg-background/50 px-4 py-2 text-sm shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
                    value={draft.preheader}
                    onChange={(e) => setDraft({ ...draft, preheader: e.target.value })}
                    placeholder="Um resumo de 1 linha instigante para aumentar taxa de abertura."
                  />
                </div>

                <div className="space-y-2.5 border-t border-border/40 pt-5 mt-2">
                  <label className="text-sm font-semibold text-muted-foreground flex justify-between">
                    Text Plain Output (Rmarkdown-like)
                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px]">Markdown Auto-convertido</span>
                  </label>
                  <textarea
                    className="flex w-full rounded-lg border border-input bg-background/50 px-4 py-4 text-sm font-mono leading-relaxed shadow-inner transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-y"
                    value={draft.body}
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                    rows={12}
                    placeholder="Injete o conteúdo estruturado aqui..."
                  />
                </div>

                <div className="flex gap-4 items-center justify-between pt-5 mt-2">
                  <button className="inline-flex h-10 items-center justify-center rounded-md border border-input shadow-sm bg-background px-6 font-semibold uppercase text-xs tracking-wider transition-colors hover:bg-accent hover:text-accent-foreground" onClick={() => setShowPreview((v) => !v)}>
                    <svg className="mr-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    {showPreview ? "Recolher Editor" : "Renderizar HTML"}
                  </button>
                  <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all disabled:opacity-50" onClick={handleSend} disabled={sending}>
                    {sending ? "Transmitindo..." : `Atirar p/ ${subscribers.length} Emails`}
                  </button>
                </div>
              </CardContent>
            </Card>

            {sent.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Registro de Transmissão</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20 text-xs tracking-tight text-muted-foreground text-left">
                        <th className="font-medium p-4">Assunto Compilado</th>
                        <th className="font-medium p-4">Destinatários Hits</th>
                        <th className="font-medium p-4">Data/Hora Log</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sent.map((s, i) => (
                        <tr key={i} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                          <td className="p-4 font-bold text-foreground">{s.subject}</td>
                          <td className="p-4"><span className="inline-flex shadow-sm items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold font-mono text-emerald-500 border border-emerald-500/20">{s.count} disparos</span></td>
                          <td className="p-4 font-mono text-[11px] text-muted-foreground">{s.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
             <div className={`rounded-xl border shadow-xl overflow-hidden sticky top-6 ${showPreview ? 'bg-muted/40' : 'bg-card text-card-foreground'}`}>
               <div className="bg-muted/30 p-5 border-b border-border/40 flex justify-between items-center bg-background/90 backdrop-blur">
                  <h3 className="font-semibold leading-none tracking-tight">Painel de Preview HTML</h3>
               </div>
               {showPreview ? (
                 <div className="p-6 overflow-hidden">
                   <div style={{ transform: 'scale(1)', transformOrigin: 'top center' }} dangerouslySetInnerHTML={{ __html: renderEmailPreview() }} />
                 </div>
               ) : (
                 <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="h-16 w-16 rounded-full bg-muted text-muted-foreground flex items-center justify-center mb-4">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/><line x1="4" y1="4" x2="20" y2="20"/></svg>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Clique em Renderizar HTML para simular a saída.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {tab === "subscribers" && (
        <Card className="animate-in fade-in slide-in-from-bottom-2">
          <CardHeader>
            <CardTitle>CRM de Assinantes</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Incluir email..."
                onKeyDown={(e) => e.key === "Enter" && handleAddSubscriber()}
                className="flex h-9 w-full sm:w-[250px] rounded-md border border-border bg-background px-3 py-1 text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button 
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-all shrink-0" 
                onClick={handleAddSubscriber}
              >
                Adicionar
              </button>
            </div>
          </CardHeader>

          <div className="w-full overflow-auto">
            {subscribers.length === 0 ? (
               <div className="p-16 flex flex-col items-center justify-center text-center bg-background/40">
                  <div className="h-16 w-16 rounded-full bg-accent text-muted-foreground flex items-center justify-center mb-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  </div>
                  <h4 className="font-semibold text-foreground">Lista de Captura Vazia</h4>
                  <p className="text-sm text-muted-foreground mt-1 max-w-[300px]">Sem leads inbound para a newsletter nativa.</p>
                </div>
            ) : (
               <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/20 text-xs tracking-tight text-muted-foreground text-left">
                    <th className="font-medium p-4 pl-6">Nó Email (Identificável)</th>
                    <th className="font-medium p-4">Captado Em</th>
                    <th className="font-medium p-4 w-[100px] text-right pr-6">Remover</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                    <tr key={s.id} className="border-b border-border/50 transition-colors hover:bg-muted/30">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase border border-primary/20">
                              {s.email.charAt(0)}
                           </div>
                           <span className="font-mono text-xs font-semibold text-foreground">{s.email}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-xs text-muted-foreground opacity-90">{s.created_at?.slice(0, 10)}</td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          className="inline-flex h-7 w-7 items-center justify-center rounded border border-transparent hover:border-red-500/30 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-all focus:outline-none" 
                          onClick={() => handleRemoveSubscriber(s.id)}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
