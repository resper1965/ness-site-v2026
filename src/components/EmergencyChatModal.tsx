import React, { useState, useEffect, useRef } from 'react';
import { m as motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Send, X, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CANAL_BASE } from '../config/api';

type MessageRole = 'system' | 'bot' | 'user';
type DisplayMessage = { role: MessageRole; content: string };

const EMERGENCY_SYSTEM_CONTEXT = `Você é o assistente de resposta a incidentes da ness. (n.cirt).
O usuário está relatando um incidente de segurança crítico ativo.
Responda de forma direta, técnica e orientada à contenção imediata.
Colete informações sobre: tipo do incidente, sistemas afetados, horário de detecção, ações já tomadas.
Oriente sobre preservação de evidências e próximos passos táticos.
Informe que um especialista da ness. será alocado via contato direto em até 15 minutos.`;

interface EmergencyChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyChatModal({ isOpen, onClose }: EmergencyChatModalProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: 'system', content: 'ATENÇÃO: Você iniciou o protocolo de acionamento do n.cirt. Este canal tem SLA de atendimento de 15 minutos.' },
    { role: 'bot', content: 'Qual o tipo de incidente de segurança? (Ex: Ransomware, Vazamento de Dados, Indisponibilidade crítica)' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');

    // Build API history: skip display-only system notice, map bot→assistant
    const apiHistory = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'bot' ? 'assistant' as const : 'user' as const,
        content: m.content,
      }));

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Placeholder for streaming response
    setMessages(prev => [...prev, { role: 'bot', content: '' }]);

    try {
      const response = await fetch(`${CANAL_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: EMERGENCY_SYSTEM_CONTEXT },
            ...apiHistory,
            { role: 'user', content: userMsg },
          ],
        }),
      });
      if (!response.ok || !response.body) throw new Error('api error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'bot',
            content: updated[updated.length - 1].content + chunk,
          };
          return updated;
        });
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'bot',
          content: 'Conexão com a central n.cirt temporariamente indisponível. Ligue imediatamente para o número de emergência da ness.',
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-red-500/30 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(239,68,68,0.15)] flex flex-col h-[650px] max-h-[85vh]"
          >
            {/* Header */}
            <div className="bg-[#150505] border-b border-red-500/20 p-6 flex flex-row items-center justify-between z-10 relative">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/30 relative">
                  <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md animate-pulse"></div>
                  <ShieldAlert className="text-red-500 relative z-10 animate-[pulse_2s_ease-in-out_infinite]" size={22} />
                </div>
                <div>
                  <h3 className="text-white font-display font-medium text-xl flex items-center gap-2">
                    n.cirt <span className="text-red-500 font-medium tracking-tight">emergência</span> 
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse ml-1 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  </h3>
                  <p className="text-red-400/80 text-[11px] font-mono uppercase tracking-[0.2em] mt-1 hidden sm:block">War Room Activation Protocol</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors relative z-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Warning Banner */}
            <div className="bg-red-500/10 px-6 py-3 flex items-start gap-3 border-b border-red-500/10">
              <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
              <p className="text-red-200/70 text-xs leading-relaxed font-normal">
                Este canal isolado é exclusivo para incidentes críticos ativos (Cyberbreach, Ransomware). O faturamento emergencial aplicável começa a partir da entrada tática.
              </p>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 relative bg-linear-to-b from-[#0a0a0a] to-[#0f0505]">
              {messages.map((msg, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[90%] sm:max-w-[80%] rounded-2xl px-5 py-3.5 text-sm font-normal leading-relaxed whitespace-pre-wrap
                    ${msg.role === 'user'
                      ? 'bg-red-600/90 text-white rounded-tr-sm border border-red-500/50 shadow-lg shadow-red-900/20'
                      : msg.role === 'system'
                        ? 'bg-transparent border border-red-500/20 text-red-400/80 w-full text-center font-mono text-[11px] uppercase tracking-wider p-4 rounded-xl'
                        : 'bg-white/5 border border-white/10 text-on-surface-variant rounded-tl-sm backdrop-blur-md'
                    }
                  `}>
                    {msg.content}
                    {loading && idx === messages.length - 1 && msg.role === 'bot' && msg.content === '' && (
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-5 bg-surface-container-lowest border-t border-white/5">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  aria-label="Descreva o incidente de segurança"
                  placeholder="Descreva o incidente em andamento..."
                  className="w-full bg-[#111] border border-white/10 rounded-full py-4 pl-6 pr-14 text-white text-sm focus:outline-none focus:border-red-500/60 transition-colors placeholder:text-white/20 font-normal disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white disabled:opacity-20 disabled:bg-white/10 hover:bg-red-500 transition-colors shadow-lg shadow-red-900/40"
                >
                  <Send size={16} className="-translate-x-px translate-y-px" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
