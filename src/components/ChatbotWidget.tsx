import BlueDot from '../components/BlueDot';
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CANAL_BASE } from '../config/api';
import { Send, X, MessageSquare, Bot } from "lucide-react";




type DisplayMessage = { role: 'bot' | 'user'; content: string };
type ApiMessage = { role: 'user' | 'assistant'; content: string };

const ChatbotWidget = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: 'bot', content: t('chatbot.welcome', "Olá! Eu sou a Gabi, cicerone digital da ness.\nUse os atalhos abaixo para abrir um chamado rápido, ou digite sua dúvida caso queira bater papo.") }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

    try {
      const response = await fetch(`${CANAL_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...apiHistory, { role: 'user', content: userMsg }],
          locale: i18n.language,
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
                  <h5 className="font-bold text-primary-container">{job.title}</h5>
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
                  <h5 className="font-bold text-primary-container">{item.title}</h5>
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

  return (
    <div className="fixed bottom-8 right-8 z-60">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-surface-container-low border border-primary-container/20 rounded-[2.5rem] nebula-shadow flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-primary-container/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary-container/40">
                  <img src="/gabi-avatar.png" alt="Gabi" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-white font-display font-bold text-sm lowercase-all">Gabi<BlueDot /></h4>
                  <p className="text-[10px] text-primary-container uppercase tracking-widest font-bold">{t('chatbot.status')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={t('a11y.close')}
                className="text-on-surface-variant hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-light leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-primary-container text-on-primary rounded-tr-none'
                      : 'bg-white/5 text-white border border-white/10 rounded-tl-none'
                  }`}>
                    {/* Show typing cursor while streaming the last bot message */}
                    {renderMessageContent(msg.content)}
                    {loading && i === messages.length - 1 && msg.role === 'bot' && msg.content === '' && (
                      <span className="inline-flex gap-1 ml-1">
                        <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-primary-container rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-4 pt-2 flex gap-2 overflow-x-auto scrollbar-hide shrink-0 snap-x">
              <button 
                type="button"
                onClick={() => { setIsOpen(false); navigate('/contato'); }}
                className="whitespace-nowrap px-4 py-2 bg-primary-container/10 border border-primary-container/30 text-primary-container text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-primary-container hover:text-on-primary transition-all snap-start shadow-xl shadow-primary-container/5">
                {t('chatbot.quick_specialist', 'Falar com Especialista')}
              </button>
              <button 
                type="button"
                onClick={() => { setIsOpen(false); navigate('/solucoes/cirt'); }}
                className="whitespace-nowrap px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-all snap-start shadow-xl shadow-red-500/5">
                {t('chatbot.quick_incident', 'Incidente (n.cirt)')}
              </button>
              <button 
                type="button"
                onClick={() => { setIsOpen(false); navigate('/compliance/etica'); }}
                className="whitespace-nowrap px-4 py-2 bg-primary-container/10 border border-primary-container/30 text-primary-container text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-primary-container hover:text-on-primary transition-all snap-start shadow-xl shadow-primary-container/5">
                {t('chatbot.quick_dpo', 'Ouvidoria DPO')}
              </button>
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-surface-container-high/50 border-t border-white/5 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                aria-label="Input field"
                placeholder={t('chatbot.placeholder')}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
              />
              <button
                type="submit"
                aria-label={t('a11y.send')}
                className="w-12 h-12 bg-primary-container text-on-primary rounded-xl flex items-center justify-center hover:brightness-110 transition-all"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? t('a11y.close') : 'Gabi'}
        aria-expanded={isOpen}
        className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl shadow-primary-container/40 relative group border-2 border-primary-container/60"
      >
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-surface rounded-full z-10"></div>
        {isOpen
          ? <div className="w-full h-full bg-primary-container flex items-center justify-center"><X className="text-on-primary" size={24} /></div>
          : <img src="/gabi-avatar.png" alt="Gabi" className="w-full h-full object-cover" />
        }
      </motion.button>
    </div>
  );
};


export default ChatbotWidget;
