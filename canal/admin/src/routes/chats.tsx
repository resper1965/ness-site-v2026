import React, { useEffect, useState } from "react";
import { 
  BarChart, 
  Download, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Clock
} from "lucide-react";

interface Session {
  id: string;
  turn_count: number;
  csat_score: number | null;
  locale: string;
  status: string;
  created_at: string;
  ended_at: string | null;
}

interface Stats {
  total_sessions: number;
  avg_turns: number;
  avg_csat: number | null;
}

export default function ChatsHistory() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats>({ total_sessions: 0, avg_turns: 0, avg_csat: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/chat-sessions")
      .then((r) => r.json())
      .then((data: any) => {
        if (data.sessions) {
          setSessions(data.sessions);
          setStats(data.stats);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load generic chat sessions", err);
        setLoading(false);
      });
  }, []);

  const handleExport = () => {
    window.location.href = "/api/admin/chat-sessions/export";
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Registros da Gabi (RAG)</h1>
          <p className="text-sm text-neutral-400">Analise conversas, tokens e intenções capturadas pelo assistente de bordo.</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl shadow-sm border border-neutral-700/50 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-medium text-neutral-300">Total de Sessões</h3>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{stats.total_sessions}</p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BarChart className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-medium text-neutral-300">Média de Interações</h3>
          </div>
          <p className="text-3xl font-bold text-white mt-4">{Number(stats.avg_turns).toFixed(1)} <span className="text-sm font-normal text-neutral-500">mensagens</span></p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800/60 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <ThumbsUp className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="font-medium text-neutral-300">Aceitação (CSAT)</h3>
          </div>
          <p className="text-3xl font-bold text-white mt-4">
            {stats.avg_csat !== null ? ((stats.avg_csat > 0 ? '+' : '') + Number(stats.avg_csat).toFixed(1)) : "N/D"} 
          </p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-400 uppercase bg-neutral-800/50 border-b border-neutral-800/60">
              <tr>
                <th className="px-6 py-4 font-medium">Sessão ID</th>
                <th className="px-6 py-4 font-medium">Data de Início</th>
                <th className="px-6 py-4 font-medium">Interações</th>
                <th className="px-6 py-4 font-medium">Status / Local</th>
                <th className="px-6 py-4 font-medium text-right">CSAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {sessions.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-neutral-200">
                    {s.id.split('-').pop() || s.id}
                  </td>
                  <td className="px-6 py-4 text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 opacity-70" />
                      {s.created_at ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(s.created_at)) : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">{s.turn_count}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700/50">
                      {s.status} / {s.locale.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {s.csat_score === 1 && <ThumbsUp className="w-4 h-4 text-emerald-500 inline-block" />}
                    {s.csat_score === -1 && <ThumbsDown className="w-4 h-4 text-red-500 inline-block" />}
                    {s.csat_score === null && <span className="text-neutral-600">-</span>}
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                    Nenhuma conversa registrada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
