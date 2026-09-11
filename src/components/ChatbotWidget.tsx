import BlueDot from '../components/BlueDot';
import React, { useState, useRef, useEffect } from "react";
import { m as motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router";
import { CANAL_BASE } from '../config/api';
import { Send, X, ThumbsUp, ThumbsDown } from "lucide-react";

import type { ChatbotConfig } from '../types/canal';
import ChatLeadForm from './ChatLeadForm';
import { useBrand } from '../config/brand';

type DisplayMessage = { role: 'bot' | 'user'; content: string };
type ApiMessage = { role: 'user' | 'assistant'; content: string };

interface ChatbotWidgetProps {
  /** Abre o painel imediatamente (usado pelo ChatLauncher após o clique). */
  initialOpen?: boolean;
}

const ChatbotWidget = ({ initialOpen = false }: ChatbotWidgetProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [botConfig, setBotConfig] = useState<ChatbotConfig | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [sessionId] = useState(`gabi-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const [csatGiven, setCsatGiven] = useState<number | null>(null);
  const BRAND = useBrand();
  /** 'conversa' | 'qualificando' — a captura substitui o campo de mensagem. */
  const [modo, setModo] = useState<'conversa' | 'qualificando'>('conversa');

  // ── Rastreamento Cognitivo de Páginas Visitadas (Opção A) ──────
  useEffect(() => {
    try {
      const currentPath = location.pathname;
      const raw = sessionStorage.getItem("ness_pages_visited");
      let visited: string[] = [];
      if (raw) visited = JSON.parse(raw);
      
      if (visited[visited.length - 1] !== currentPath) {
        visited.push(currentPath);
        if (visited.length > 10) visited.shift(); // limitar a 10 páginas para contexto
        sessionStorage.setItem("ness_pages_visited", JSON.stringify(visited));
      }
    } catch (e) {
      console.error("[cognitive] Error tracking page:", e);
    }
  }, [location]);

  // Abertura proativa removida: o chat só abre por ação do usuário (ver ChatLauncher).

  useEffect(() => {
    fetch(`${CANAL_BASE}/api/chatbot-config?tenant=ness`)
      .then(res => res.json())
      .then(config => {
        setBotConfig(config);
        if (config.enabled === false) return;
        setMessages([
          { role: 'bot', content: config.welcome_message || t('chatbot.welcome', "Olá! Como posso ajudar?") }
        ]);
      })
      .catch(() => {
        setMessages([
          { role: 'bot', content: t('chatbot.welcome', "Olá! Como posso ajudar?") }
        ]);
      });
  }, [t]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Esc fecha o painel e devolve o foco ao botão que o abriu.
  const botao = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      botao.current?.focus();
    };
    document.addEventListener('keydown', aoTeclar);
    return () => document.removeEventListener('keydown', aoTeclar);
  }, [isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');

    // Build API history from display messages (skip welcome, map bot→assistant)
    const apiHistory: ApiMessage[] = messages
      .slice(1)
      .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content }));

    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Add empty bot message placeholder for streaming
    setMessages(prev => [...prev, { role: 'bot', content: '' }]);

    let pagesVisited: string[] = [];
    try {
      const raw = sessionStorage.getItem("ness_pages_visited");
      if (raw) pagesVisited = JSON.parse(raw);
    } catch {}

    try {
      const response = await fetch(`${CANAL_BASE}/api/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({
          messages: [...apiHistory, { role: 'user', content: userMsg }],
          locale: i18n.language,
          pagesVisited,
        }),
      });

      if (!response.ok || !response.body) throw new Error('api error');

      // Read the text stream chunk by chunk and update the last message in real time
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
        updated[updated.length - 1] = { role: 'bot', content: t('chatbot.error') };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCsat = async (score: number) => {
    if (csatGiven !== null) return;
    setCsatGiven(score);
    try {
      await fetch(`${CANAL_BASE}/api/chat/csat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-session-id': sessionId
        },
        body: JSON.stringify({ csat_score: score }),
      });
    } catch (e) {
      console.error(e);
      setCsatGiven(null);
    }
  };

  const renderMessageContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      if (parsed.type === "job-list") {
        return (
          <div className="flex flex-col gap-2">
            <p>{parsed.message}</p>
            <div className="flex flex-col gap-2 mt-2">
              {parsed.data.map((job: any) => (
                <div key={job.id} className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-left">
                  <h5 className="font-medium text-primary-container">{job.title}</h5>
                  <p className="text-xs text-white/70">{job.location} {job.type && `• ${job.type}`}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
      if (parsed.type === "portfolio-list") {
        return (
          <div className="flex flex-col gap-2">
            <p>{parsed.message}</p>
            <div className="flex flex-col gap-2 mt-2">
              {parsed.data.map((item: any) => (
                <div key={item.id} className="bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-left">
                  <h5 className="font-medium text-primary-container">{item.title}</h5>
                  <p className="text-xs text-white/70">{item.sector} {item.metric && `• ${item.metric}`}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return <p>{content}</p>;
    } catch {
      return <p>{content}</p>;
    }
  };

    if (botConfig && botConfig.enabled === 0) {
      return null;
    }

    const primaryColor = botConfig?.theme_color || '#00ade8';
    const avatarUrl = botConfig?.avatar_url || '/img/gabi-avatar.webp';
    const botName = botConfig?.bot_name || 'Gabi';

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40" style={{ '--chat-primary': primaryColor } as React.CSSProperties}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            role="dialog"
            aria-label={botName}
            className="absolute bottom-20 right-0 w-[min(350px,calc(100vw-3rem))] md:w-[400px] h-[min(500px,calc(100dvh-8rem))] bg-surface-container-low border border-primary-container/20 rounded-[2.5rem] nebula-shadow flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-primary-container/10 border-b border-white/5 flex items-center justify-between" style={{ backgroundColor: `${primaryColor}20` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary-container/40" style={{ borderColor: `${primaryColor}66` }}>
                  <img src={avatarUrl} alt="" width={128} height={128} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-display font-medium text-sm lowercase-all flex items-center gap-1">
                    {botName}
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                  </h4>
                  <p className="text-[11px] text-primary-container uppercase tracking-widest font-medium" style={{ color: primaryColor }}>{t('chatbot.status')}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                }}
                aria-label={t('a11y.close')}
                className="text-on-surface-variant hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-primary-container rounded-lg p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div role="log" aria-live="polite" className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-normal leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'text-[#0a0a0a] rounded-tr-none'
                      : 'bg-white/5 text-white border border-white/10 rounded-tl-none'
                  }`}
                  style={msg.role === 'user' ? { backgroundColor: primaryColor } : undefined}
                  >
                    {/* Show typing cursor while streaming the last bot message */}
                    {renderMessageContent(msg.content)}
                    {loading && i === messages.length - 1 && msg.role === 'bot' && msg.content === '' && (
                      <span className="inline-flex gap-1 ml-1">
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor, animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor, animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: primaryColor, animationDelay: '300ms' }} />
                      </span>
                    )}

                    {/* CSAT Rating buttons for the last bot message when stream finishes */}
                    {!loading && i === messages.length - 1 && msg.role === 'bot' && msg.content.length > 5 && i > 0 && (
                      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
                        <p className="text-[11px] text-white/70 uppercase tracking-wider font-medium">{t('a11y.useful', 'a resposta foi útil?')}</p>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleCsat(1)}
                            aria-label={t('a11y.useful_yes', 'sim, foi útil')}
                            aria-pressed={csatGiven === 1}
                            disabled={csatGiven !== null}
                            className={`p-1.5 rounded-md transition-colors ${csatGiven === 1 ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50'}`}
                          >
                            <ThumbsUp size={14} />
                          </button>
                          <button
                            onClick={() => handleCsat(-1)}
                            aria-label={t('a11y.useful_no', 'não foi útil')}
                            aria-pressed={csatGiven === -1}
                            disabled={csatGiven !== null}
                            className={`p-1.5 rounded-md transition-colors ${csatGiven === -1 ? 'bg-red-500/20 text-red-400' : 'text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50'}`}
                          >
                            <ThumbsDown size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Quick Replies — só caminhos comerciais. Falar com especialista
                qualifica aqui dentro, em vez de mandar o visitante recomeçar
                num formulário: quem é mandado embora raramente volta. */}
            {modo === 'conversa' && (
              <div className="px-4 pb-4 pt-2 flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setModo('qualificando')}
                  className="whitespace-nowrap px-4 py-2 bg-primary-container/10 border border-primary-container/30 text-primary-container text-[11px] font-medium uppercase tracking-widest rounded-full hover:bg-primary-container hover:text-on-primary transition-all snap-start shadow-xl shadow-primary-container/5">
                  {t('chatbot.quick_specialist', 'falar com especialista')}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); navigate(BRAND === 'trustness' ? '/assessment/lgpd' : '/assessment/cyber'); }}
                  className="whitespace-nowrap px-4 py-2 bg-white/5 border border-white/10 text-on-surface-variant text-[11px] font-medium uppercase tracking-widest rounded-full hover:text-white transition-all snap-start">
                  {t('chatbot.quick_assessment', 'diagnóstico gratuito')}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsOpen(false); navigate('/solucoes/cirt'); }}
                  className="whitespace-nowrap px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-medium uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-all snap-start shadow-xl shadow-red-500/5">
                  {t('chatbot.quick_incident', 'incidente 24×7')}
                </button>
              </div>
            )}

            {modo === 'qualificando' && (
              <ChatLeadForm
                assunto={BRAND === 'ness' ? 'n.secops' : BRAND}
                onPronto={() => {
                  setModo('conversa');
                  setMessages((anteriores) => [
                    ...anteriores,
                    { role: 'bot', content: t('chatbot.lead_ok', 'recebi seus dados — um especialista responde em até 1 dia útil. se for incidente em andamento, ligue +55 (11) 2504-7650.') },
                  ]);
                }}
              />
            )}

            {/* Input */}
            {modo === 'conversa' && (
            <form onSubmit={handleSend} className="p-4 bg-surface-container-high/50 border-t border-white/5 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label={t('chatbot.placeholder')}
                placeholder={t('chatbot.placeholder')}
                className="flex-1 bg-white/5 border border-white/35 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                style={{ '--tw-ring-color': primaryColor } as any}
              />
              <button
                type="submit"
                aria-label={t('a11y.send')}
                className="w-12 h-12 text-[#0a0a0a] rounded-xl flex items-center justify-center hover:brightness-110 transition-all font-medium"
                style={{ backgroundColor: primaryColor }}
              >
                <Send size={18} />
              </button>
            </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={botao}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? t('a11y.close') : botName}
        aria-expanded={isOpen}
        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-2xl relative group border-2 focus-visible:ring-2 focus-visible:ring-primary-container"
        style={{ borderColor: primaryColor, boxShadow: `0 25px 50px -12px ${primaryColor}40` }}
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-surface rounded-full z-10"></div>
        {isOpen
          ? <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: primaryColor }}><X className="text-[#0a0a0a]" size={24} /></div>
          : <img src={avatarUrl} alt="" width={128} height={128} className="w-full h-full object-cover" />
        }
      </motion.button>
    </div>
  );
};


export default ChatbotWidget;
