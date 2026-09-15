import { useEffect, type RefObject } from 'react';

/**
 * Esc fecha, e clicar fora fecha.
 *
 * São as duas únicas coisas que um `<details>` não faz sozinho, e são
 * melhorias: sem JavaScript o menu ainda abre, fecha pelo próprio `<summary>`
 * e navega. Era esta a diferença que faltava para trocar os menus com estado
 * por menus que o navegador sabe abrir.
 */
export function useFechaSozinho(alvo: RefObject<HTMLDetailsElement | null>) {
  useEffect(() => {
    const fechar = () => { if (alvo.current) alvo.current.open = false; };
    const aoTeclar = (e: KeyboardEvent) => { if (e.key === 'Escape') fechar(); };
    const aoClicarFora = (e: MouseEvent) => {
      if (alvo.current?.open && !alvo.current.contains(e.target as Node)) fechar();
    };
    document.addEventListener('keydown', aoTeclar);
    document.addEventListener('mousedown', aoClicarFora);
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.removeEventListener('mousedown', aoClicarFora);
    };
  }, [alvo]);
}
