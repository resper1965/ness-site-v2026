import type { ReactNode } from 'react';
import BlueDot from './BlueDot';

/**
 * A abertura das páginas de produto no desenho delicado: a marca pequena, uma
 * frase que promete em até 32 px, o texto de apoio e as ações. Nada de título
 * gigante — pedido do Ricardo em 10/09: elegante e delicado, sem fontes grandes,
 * sempre dentro do branding.
 */
export default function Abertura({
  marca,
  titulo,
  children,
  acoes,
}: {
  marca?: ReactNode;
  titulo: string;
  children: ReactNode;
  acoes?: ReactNode;
}) {
  return (
    <div className="mb-16 grid max-w-[700px] gap-4">
      {marca && <p className="marca text-[17px] text-white">{marca}</p>}
      <h1 className="text-balance font-display text-2xl font-medium leading-tight tracking-tight text-white md:text-[32px]">
        {titulo}<BlueDot />
      </h1>
      <p className="max-w-[62ch] text-base leading-relaxed text-on-surface-variant">{children}</p>
      {acoes && <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">{acoes}</div>}
    </div>
  );
}

/** Título de seção a 20 px, com o ponto azul, e o texto que o apresenta. */
export function CabecalhoDeSecao({ id, titulo, children }: { id?: string; titulo: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-9 max-w-[62ch]">
      <h2 id={id} className="text-balance font-display text-xl font-medium lowercase tracking-tight text-white">
        {titulo}<BlueDot />
      </h2>
      {children && <div className="mt-2 space-y-3 text-[15px] leading-relaxed text-on-surface-variant">{children}</div>}
    </div>
  );
}

/** Ação principal e link secundário, no mesmo tamanho contido (40 px de alvo). */
export const BOTAO =
  'inline-flex h-10 items-center rounded-full bg-primary-container px-5 font-display text-[13.5px] font-medium text-on-primary transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(0,173,232,0.25)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest';

export const LINK =
  'inline-block py-1 font-display text-[13.5px] font-medium text-white underline decoration-white/20 underline-offset-[5px] transition-colors hover:decoration-primary-container';
