import { useEffect, useRef } from 'react';

const SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY as string | undefined;
const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

type ApiTurnstile = {
  render: (elemento: HTMLElement, opcoes: Record<string, unknown>) => string | undefined;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    turnstile?: ApiTurnstile;
  }
}

/**
 * Carrega a API uma vez por página, mesmo com vários widgets.
 */
let carregando: Promise<void> | null = null;

function carregarApi(): Promise<void> {
  if (carregando) return carregando;
  carregando = new Promise((resolver, rejeitar) => {
    const script = document.createElement('script');
    script.src = SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolver();
    script.onerror = () => rejeitar(new Error('turnstile não carregou'));
    document.head.appendChild(script);
  });
  return carregando;
}

/**
 * Verificação antirrobô do Cloudflare.
 *
 * Renderização **explícita**, depois da hidratação. Na implícita, o script
 * escrevia dentro da div assim que carregava — e o React, ao hidratar,
 * descartava aquele conteúdo. O widget sumia da tela, nenhum token era
 * gerado, e todo envio era recusado pelo servidor: foi o que aconteceu em
 * produção. Aqui a div nasce vazia no HTML, o React assume, e só então o
 * Turnstile preenche.
 *
 * Sem `VITE_TURNSTILE_SITEKEY` não renderiza nada e o formulário segue
 * funcionando — o servidor só exige token quando o segredo existe.
 */
/**
 * `tamanho`: o widget normal ocupa 300 px. Em coluna estreita — o rodapé tem
 * 156 px — ele nao encolhe: transborda e empurra o documento inteiro, o que
 * pos rolagem horizontal de 64 px nos tres dominios em producao. Nessas
 * colunas use 'compact', que mede 150 px.
 */
export default function Turnstile({ action, tamanho = 'normal' }: { action: string; tamanho?: 'normal' | 'compact' }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITEKEY || !container.current) return;

    let cancelado = false;
    let idWidget: string | undefined;

    carregarApi()
      .then(() => {
        if (cancelado || !container.current || !window.turnstile) return;
        idWidget = window.turnstile.render(container.current, {
          sitekey: SITEKEY,
          // Amarra o token à superfície: um token do chat não vale no contato.
          action,
          theme: 'dark',
          language: 'auto',
          size: tamanho,
        });
      })
      .catch(() => {
        /* sem widget, o servidor recusa — melhor que aceitar qualquer coisa */
      });

    return () => {
      cancelado = true;
      if (idWidget && window.turnstile) window.turnstile.remove(idWidget);
    };
  }, [action, tamanho]);

  if (!SITEKEY) return null;

  return <div ref={container} className="w-0 min-w-full max-w-full overflow-x-auto" />;
}
