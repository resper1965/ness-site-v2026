import { lazy, Suspense, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ChatbotWidget = lazy(() => import('./ChatbotWidget'));

/**
 * Botão estático do chat. O widget completo (streaming, CSAT, histórico) só é
 * baixado no primeiro clique, então nenhuma página paga o custo do chat sem o
 * usuário pedir. Nunca abre sozinho.
 *
 * O rosto da Gabi fica dentro da conversa, não no botão: em cima do fundo
 * escuro o avatar entrava com moldura branca e destoava do resto do site. Aqui
 * o convite é tipográfico — ponto azul, ícone e o nome dela.
 */
export default function ChatLauncher() {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <Suspense fallback={<LauncherButton pending onClick={() => undefined} label={t('chatbot.open', 'falar com a Gabi')} />}>
        <ChatbotWidget initialOpen />
      </Suspense>
    );
  }

  return <LauncherButton onClick={() => setLoaded(true)} label={t('chatbot.open', 'falar com a Gabi')} />;
}

function LauncherButton({ onClick, label, pending = false }: { onClick: () => void; label: string; pending?: boolean }) {
  return (
    /* Quem só olha a abertura não vê chat; quem começou a ler ganha o convite
       (PLAN-movimento 4.5). Só opacidade e transform: o botão continua no lugar. */
    <div className="chat-launcher chega-ao-rolar fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-busy={pending}
        className="group glass flex h-14 w-14 items-center justify-center gap-3 rounded-full border-primary-container/25 shadow-xl shadow-black/30 sm:w-auto sm:justify-start sm:px-5 transition-all hover:border-primary-container/60 hover:shadow-2xl active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      >
        <span
          aria-hidden="true"
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary transition-transform group-hover:scale-105 ${pending ? 'opacity-60' : ''}`}
        >
          <MessageCircle size={18} strokeWidth={2.25} />
        </span>
        <span className="hidden pr-1 text-sm font-display font-medium text-white sm:inline lowercase-all">
          {label}
        </span>
      </button>
    </div>
  );
}
