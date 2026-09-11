import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Send, X, Phone } from 'lucide-react';
import { CANAL_BASE } from '../config/api';
import Dialogo from './Dialogo';

type DisplayMessage = { role: 'bot' | 'user'; content: string };

/** O mesmo número do contato e do /obrigado: é por ele que o n.cirt é acionado. */
const TELEFONE = '+55 (11) 2504-7650';
const TEL = 'tel:+551125047650';

/**
 * Este canal é triagem, não acionamento. As mensagens vão para o assistente e
 * nada aqui chama o plantão. O texto anterior prometia o contrário, e quem
 * estava com um incidente ativo ficava esperando um contato que não vinha.
 * Acionar é pelo telefone, que fica à vista acima da conversa o tempo todo.
 *
 * O texto é só em português: o modal vive na página de produto, que não existe
 * sob /en e /es.
 */
const EMERGENCY_SYSTEM_CONTEXT = `Você é o assistente de triagem de incidentes da ness. (n.cirt).
O usuário está relatando um incidente de segurança possivelmente ativo.
Responda de forma direta, técnica e orientada à contenção imediata.
Colete: tipo do incidente, sistemas afetados, horário de detecção e ações já tomadas.
Oriente sobre preservação de evidências.
Este canal NÃO aciona o time de plantão, e ninguém da ness. acompanha esta conversa em tempo real. Nunca diga que alguém foi ou será acionado. Para acionar o n.cirt, oriente a ligar para ${TELEFONE}.`;

interface EmergencyChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmergencyChatModal({ isOpen, onClose }: EmergencyChatModalProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([
    { role: 'bot', content: 'Qual o tipo de incidente? (Ex.: ransomware, vazamento de dados, indisponibilidade crítica)' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');

    const apiHistory = messages.map((m) => ({
      role: m.role === 'bot' ? ('assistant' as const) : ('user' as const),
      content: m.content,
    }));

    setMessages((prev) => [...prev, { role: 'user', content: userMsg }, { role: 'bot', content: '' }]);
    setLoading(true);

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
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'bot', content: updated[updated.length - 1].content + chunk };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'bot',
          content: `Não foi possível falar com o assistente agora. Para acionar o n.cirt, ligue ${TELEFONE}.`,
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialogo aberto={isOpen} aoFechar={onClose} rotuloId="emergencia-titulo" className="max-w-2xl">
      <div className="flex h-[min(650px,85dvh)] flex-col overflow-hidden rounded-3xl border border-red-500/30 bg-surface-container-lowest">
        <div className="flex items-center justify-between gap-4 border-b border-red-500/20 bg-red-950/40 p-5 md:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
              <ShieldAlert className="text-red-400" size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 id="emergencia-titulo" className="font-display text-xl font-medium text-white">
                n.cirt <span className="text-red-400">emergência</span>
              </h2>
              <p className="mt-1 text-[12.5px] text-red-200/80">triagem do incidente, com assistente</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="fechar"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {/* O aviso fica fixo acima da conversa, e não como a primeira mensagem
            dela: é a informação que não pode rolar para fora da tela. */}
        <div className="border-b border-red-500/20 bg-red-500/10 px-5 py-4 md:px-6">
          <p className="text-sm leading-relaxed text-red-100">
            Este canal organiza as informações do incidente, mas{' '}
            <strong className="font-medium text-white">não aciona o plantão</strong>. Para acionar o n.cirt agora, ligue:
          </p>
          <a
            href={TEL}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-red-600 px-5 font-display text-sm font-medium text-white transition-colors hover:bg-red-500"
          >
            <Phone size={16} aria-hidden="true" /> {TELEFONE}
          </a>
          <p className="mt-3 text-xs leading-relaxed text-red-200/80">
            O faturamento emergencial aplicável começa a partir da entrada tática.
          </p>
        </div>

        <div role="log" aria-live="polite" className="flex-1 space-y-4 overflow-y-auto p-5 md:p-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-5 py-3.5 text-sm leading-relaxed sm:max-w-[80%] ${
                  msg.role === 'user'
                    ? 'rounded-tr-sm bg-red-600/90 text-white'
                    : 'rounded-tl-sm border border-white/10 bg-white/5 text-on-surface'
                }`}
              >
                {msg.content}
                {loading && idx === messages.length - 1 && msg.role === 'bot' && msg.content === '' && (
                  <span className="inline-flex gap-1" aria-label="o assistente está escrevendo">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400 [animation-delay:200ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-400 [animation-delay:400ms]" />
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="border-t border-white/10 bg-surface-container-low p-4 md:p-5">
          <form onSubmit={handleSend} className="relative flex items-center">
            <label htmlFor="emergencia-mensagem" className="sr-only">
              Descreva o incidente em andamento
            </label>
            <input
              id="emergencia-mensagem"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              placeholder="Descreva o incidente em andamento..."
              className="w-full rounded-full border border-white/35 bg-surface-container-lowest py-4 pl-6 pr-14 text-sm text-white transition-colors placeholder:text-white/50 focus:border-red-500/60 focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              aria-label="enviar"
              disabled={!input.trim() || loading}
              className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-500 disabled:bg-white/10 disabled:opacity-40"
            >
              <Send size={16} aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </Dialogo>
  );
}
