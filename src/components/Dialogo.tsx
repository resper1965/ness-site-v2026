import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Janela modal sobre o `<dialog>` nativo.
 *
 * Os overlays feitos à mão deixavam o teclado e o leitor de tela passeando
 * atrás da janela, sem Esc e sem devolver o foco. O `showModal()` já faz as
 * três coisas: Esc fecha, o fundo fica inerte e o foco volta a quem abriu.
 *
 * O preflight do Tailwind zera a margem de tudo, inclusive a do dialog: sem o
 * `m-auto`, a janela nasce colada no canto de cima.
 */
export default function Dialogo({
  aberto,
  aoFechar,
  rotuloId,
  className = '',
  children,
}: {
  aberto: boolean;
  aoFechar: () => void;
  /** id do título da janela: é o nome que o leitor de tela anuncia. */
  rotuloId: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const janela = ref.current;
    if (!janela) return;
    if (aberto && !janela.open) janela.showModal();
    if (!aberto && janela.open) janela.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={rotuloId}
      onCancel={(e) => {
        e.preventDefault();
        aoFechar();
      }}
      // Clique no véu: o alvo é o próprio dialog, nunca o conteúdo.
      onClick={(e) => {
        if (e.target === e.currentTarget) aoFechar();
      }}
      className={`m-auto max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto bg-transparent p-0 text-on-surface backdrop:bg-black/80 ${className}`}
    >
      {aberto ? children : null}
    </dialog>
  );
}
