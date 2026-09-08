import React, { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

const ChatbotWidget = lazy(() => import('./ChatbotWidget'));

/**
 * Botão estático do chat. O widget completo (streaming, CSAT, histórico) só é
 * baixado no primeiro clique, então nenhuma página paga o custo do chat sem o
 * usuário pedir. Nunca abre sozinho.
 */
export default function ChatLauncher() {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <Suspense fallback={<LauncherButton pending onClick={() => undefined} label={t('chatbot.open', 'abrir chat com a Gabi')} />}>
        <ChatbotWidget initialOpen />
      </Suspense>
    );
  }

  return <LauncherButton onClick={() => setLoaded(true)} label={t('chatbot.open', 'abrir chat com a Gabi')} />;
}

function LauncherButton({ onClick, label, pending = false }: { onClick: () => void; label: string; pending?: boolean }) {
  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-busy={pending}
        className="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-2xl shadow-primary-container/30 border-2 border-primary-container bg-surface-container-low transition-transform hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-container"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-surface rounded-full z-10" aria-hidden="true" />
        <img
          src="/img/gabi-avatar.webp"
          alt=""
          width={128}
          height={128}
          loading="lazy"
          decoding="async"
          className={`w-full h-full object-cover ${pending ? 'opacity-60' : ''}`}
        />
      </button>
    </div>
  );
}
