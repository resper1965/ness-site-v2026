import * as React from "react";
import { Link } from "react-router";
import { Shield, BrainCircuit, Calendar, CheckCircle2, XCircle, Search, Inbox } from "lucide-react";

interface Applicant {
  id: string;
  tenant_id: string;
  job_id: string;
  name: string;
  email: string;
  linkedin_url: string;
  resume_r2_key: string;
  ai_score: number;
  ai_summary: string;
  status: string;
  created_at: string;
}

export default function ApplicantsPage() {
  const [data, setData] = React.useState<Applicant[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/applicants");
        if (res.ok) {
          setData(await res.json());
        } else {
          console.error("Failed to load applicants", res.status);
        }
      } catch (err) {
        console.error("Failed to load applicants", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/admin/applicants/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });
      setData(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {}
  };

  const filtered = data.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto animation-fade-in">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-regular tracking-tight text-white flex items-center gap-3">
            <BrainCircuit className="text-brand-primary" size={28} />
            Applicant Tracking System
          </h1>
          <p className="text-zinc-400 mt-2">
            Candidates analyzed by Edge AI (Llama-3). AI score is based on resume clarity and skills match.
          </p>
        </div>
        <div className="glass-panel p-2 flex items-center gap-2 rounded-full w-64 border border-white/5">
          <Search size={16} className="text-zinc-400 ml-2" />
          <input 
            type="text" 
            placeholder="Search candidates..." 
            className="bg-transparent border-none outline-none text-sm text-white w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="surface-card rounded-2xl border border-white/5 overflow-hidden">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="p-4 border-b border-white/5 flex gap-4">
              <div className="w-12 h-12 rounded-full skeleton-pulse" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 w-1/4 rounded skeleton-pulse" />
                <div className="h-3 w-1/2 rounded skeleton-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="surface-card rounded-2xl p-16 text-center border border-dashed border-white/10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Inbox size={32} className="text-zinc-500" />
          </div>
          <h3 className="text-xl font-medium text-zinc-300">No applicants found</h3>
          <p className="text-zinc-500 mt-2">Candidates who apply via the `/api/apply` endpoint will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(app => (
            <div key={app.id} className="surface-card p-6 rounded-2xl border border-white/5 hover:border-brand-primary/30 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
              {/* Score Badge */}
              <div className="absolute top-0 right-0 p-4">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-mono text-lg font-bold
                  ${app.ai_score >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
                    app.ai_score >= 50 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
                    'bg-red-500/20 text-red-400 border border-red-500/30'}
                `}>
                  {app.ai_score || '?'}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-medium border border-brand-primary/30">
                  {app.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-medium text-zinc-100 line-clamp-1 pr-12">{app.name}</h3>
                  <a href={`mailto:${app.email}`} className="text-xs text-zinc-400 hover:text-brand-primary transition-colors">{app.email}</a>
                </div>
              </div>

              <div className="text-xs text-zinc-500 mb-4 flex items-center gap-2">
                <Calendar size={12} />
                {new Date(app.created_at).toLocaleDateString()} &middot; Job: {app.job_id}
              </div>

              <div className="bg-black/30 p-4 rounded-xl flex-1 mb-4 border border-white/5">
                <h4 className="text-xs uppercase text-zinc-500 font-medium mb-2 flex items-center gap-1">
                  <BrainCircuit size={12} /> AI Summary
                </h4>
                <p className="text-sm text-zinc-300 leading-relaxed line-clamp-4">
                  {app.ai_summary || 'Waiting for Llama-3 to digest the resume...'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusChange(app.id, 'shortlisted')}
                    className={`p-2 rounded-lg transition-colors ${app.status === 'shortlisted' ? 'bg-brand-primary/20 text-brand-primary' : 'hover:bg-white/5 text-zinc-400'}`}
                    title="Shortlist"
                  >
                    <CheckCircle2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleStatusChange(app.id, 'rejected')}
                    className={`p-2 rounded-lg transition-colors ${app.status === 'rejected' ? 'bg-red-500/20 text-red-400' : 'hover:bg-white/5 text-zinc-400'}`}
                    title="Reject"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
                {app.resume_r2_key && (
                  <a href={`/media/${encodeURIComponent(app.resume_r2_key)}`} target="_blank" rel="noreferrer" className="text-xs font-medium text-brand-primary hover:text-white px-3 py-1.5 rounded-full bg-brand-primary/10 hover:bg-brand-primary/20 transition-colors">
                    View Resume
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
