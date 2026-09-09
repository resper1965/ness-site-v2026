import { beforeEach, describe, expect, it, vi } from 'vitest';
import { evento, eventoUnico, reiniciarEventosUnicos } from './eventos';

describe('eventos', () => {
  beforeEach(() => {
    window.zaraz = { track: vi.fn() };
    reiniciarEventosUnicos();
  });

  it('encaminha nome e parâmetros', () => {
    evento('cta_click', { cta: 'hero_primario' });
    expect(window.zaraz!.track).toHaveBeenCalledWith('cta_click', { cta: 'hero_primario' });
  });

  // Rolagem dispara a cada pixel: sem trava, um marco vira centenas de eventos.
  it('dispara o evento único uma vez só', () => {
    eventoUnico('rolagem:/:50', 'scroll_depth', { percent: 50 });
    eventoUnico('rolagem:/:50', 'scroll_depth', { percent: 50 });
    eventoUnico('rolagem:/:50', 'scroll_depth', { percent: 50 });
    expect(window.zaraz!.track).toHaveBeenCalledTimes(1);
  });

  it('trata marcos diferentes como eventos diferentes', () => {
    eventoUnico('rolagem:/:25', 'scroll_depth', { percent: 25 });
    eventoUnico('rolagem:/:50', 'scroll_depth', { percent: 50 });
    expect(window.zaraz!.track).toHaveBeenCalledTimes(2);
  });

  // Cada página tem a própria contagem: reiniciar é o que separa uma da outra.
  it('libera o mesmo marco depois de reiniciar', () => {
    eventoUnico('rolagem:/:50', 'scroll_depth', { percent: 50 });
    reiniciarEventosUnicos();
    eventoUnico('rolagem:/:50', 'scroll_depth', { percent: 50 });
    expect(window.zaraz!.track).toHaveBeenCalledTimes(2);
  });

  // Preview local não tem Zaraz: silêncio é melhor que quebrar a página.
  it('não quebra quando o Zaraz não está presente', () => {
    window.zaraz = undefined;
    expect(() => evento('cta_click')).not.toThrow();
  });
});
