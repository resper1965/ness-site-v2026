import * as React from "react";
import { Calendar, Share2, PlusCircle, CheckCircle2 } from "lucide-react";

interface SocialPost {
  id: string;
  tenant_id: string;
  platform: string;
  content: string;
  image_url: string;
  scheduled_at: string;
  published_at: string;
  status: string;
  ai_generated: number;
  created_at: string;
}

export default function SocialCalendarPage() {
  const [data, setData] = React.useState<SocialPost[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/social-posts");
        if (res.ok) {
          setData(await res.json());
        } else {
          console.error("Failed to load posts", res.status);
        }
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await fetch(`/api/admin/social-posts/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "approved" }),
      });
      setData(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));
    } catch (err) {}
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animation-fade-in">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-regular tracking-tight text-white flex items-center gap-3">
            <Share2 className="text-brand-primary" size={28} />
            Social Calendar
          </h1>
          <p className="text-zinc-400 mt-2">
            Rascunhos gerados pela IA e posts agendados e publicados.
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <PlusCircle size={16} /> Criar Post Manual
        </button>
      </header>

      {loading ? (
        <div className="flex gap-4">
          <div className="w-1/3 h-64 rounded-xl skeleton-pulse" />
          <div className="w-1/3 h-64 rounded-xl skeleton-pulse" />
        </div>
      ) : data.length === 0 ? (
        <div className="surface-card rounded-2xl p-16 text-center border border-dashed border-white/10">
          <Calendar size={32} className="text-zinc-500 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-zinc-300">Nenhum post agendado</h3>
          <p className="text-zinc-500 mt-2">Use a Gabi IA em Insights e Cases para gerar posts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map(post => (
            <div key={post.id} className="surface-card p-6 rounded-2xl border border-white/5 flex flex-col h-full relative">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border
                  ${post.platform === 'linkedin' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-pink-500/10 text-pink-400 border-pink-500/20'}`}>
                  {post.platform}
                </span>
                <span className={`text-[11px] font-medium uppercase px-2 py-0.5 rounded-full
                  ${post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                    post.status === 'approved' ? 'bg-brand-primary/20 text-brand-primary' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {post.status}
                </span>
              </div>
              <div className="bg-black/20 p-4 rounded-xl flex-1 mb-4 border border-white/5">
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">{post.content}</p>
              </div>
              <div className="text-xs text-zinc-500 flex justify-between items-center mt-auto">
                <span>Agendado: {post.scheduled_at ? new Date(post.scheduled_at).toLocaleDateString() : 'Não definido'}</span>
                {post.status === 'draft' && (
                  <button onClick={() => handleApprove(post.id)} className="text-brand-primary hover:text-white flex flex-items gap-1 transition-colors">
                    <CheckCircle2 size={14} /> Aprovar AI
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
