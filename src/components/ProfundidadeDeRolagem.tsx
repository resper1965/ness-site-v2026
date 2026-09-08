import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { eventoUnico, reiniciarEventosUnicos } from '../utils/eventos';

const MARCOS = [25, 50, 75, 100] as const;

/**
 * Quanto da página as pessoas realmente leem.
 *
 * É a medida que diz se a home de 9 seções precisa virar 6: sem ela, cortar
 * conteúdo é palpite. Passivo e sem estado no React — só eventos.
 */
export default function ProfundidadeDeRolagem() {
  const { pathname } = useLocation();

  useEffect(() => {
    reiniciarEventosUnicos();

    let agendado = false;
    const medir = () => {
      agendado = false;
      const alturaVisivel = window.innerHeight;
      const alturaTotal = document.documentElement.scrollHeight;
      if (alturaTotal <= alturaVisivel) return;
      const lido = Math.round(((window.scrollY + alturaVisivel) / alturaTotal) * 100);
      for (const marco of MARCOS) {
        if (lido >= marco) {
          eventoUnico(`rolagem:${pathname}:${marco}`, 'scroll_depth', { percent: marco, page: pathname });
        }
      }
    };

    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, [pathname]);

  return null;
}
