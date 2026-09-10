import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import BlueDot from './BlueDot';
import { BRAND_DOMAINS, useBrand, type Brand } from '../config/brand';

// `nome` é a parte antes do ponto e `sufixo` o que vem depois: o ponto é
// sempre o BlueDot, nunca a cor do texto — inclusive em forense.io.
const MARCAS: { marca: Brand; nome: string; sufixo?: string; descricao: string }[] = [
  { marca: 'ness', nome: 'ness', descricao: 'infraestrutura, segurança e engenharia' },
  { marca: 'trustness', nome: 'trustness', descricao: 'governança, risco e compliance' },
  { marca: 'forense', nome: 'forense', sufixo: 'io', descricao: 'perícia digital e investigação' },
];

/**
 * Troca entre as três marcas do grupo.
 *
 * Cada marca tem domínio próprio, então trocar é sair do site — por isso são
 * âncoras, não Links: o Worker de destino é outro. Fica no lugar do selo de
 * longevidade, que dizia uma coisa só e não levava a lugar nenhum.
 */
export default function EcosystemSwitcher() {
  const atual = useBrand();
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const aoTeclar = (e: KeyboardEvent) => { if (e.key === 'Escape') setAberto(false); };
    const aoClicarFora = (e: MouseEvent) => {
      if (caixa.current && !caixa.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener('keydown', aoTeclar);
    document.addEventListener('mousedown', aoClicarFora);
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.removeEventListener('mousedown', aoClicarFora);
    };
  }, [aberto]);

  return (
    <div ref={caixa} className="relative">
      <button
        type="button"
        aria-expanded={aberto}
        aria-controls="ecossistema"
        aria-label="trocar de marca"
        onClick={() => setAberto((a) => !a)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary-container/40 transition-colors focus-visible:ring-2 focus-visible:ring-primary-container"
      >
        {/* Não repete o nome da marca: o logo ao lado já diz onde se está. */}
        <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-widest">
          ecossistema
        </span>
        <ChevronDown size={11} aria-hidden="true" className={`text-on-surface-variant ${aberto ? 'rotate-180' : ''} transition-transform`} />
      </button>

      {aberto && (
        <div id="ecossistema" className="absolute left-0 top-full pt-3 w-[260px] z-50">
          <div className="bg-surface-container-low/98 backdrop-blur-xl rounded-2xl border border-white/10 p-2 nebula-shadow">
            {MARCAS.map((m) => (
              <a
                key={m.marca}
                href={BRAND_DOMAINS[m.marca]}
                aria-current={m.marca === atual ? 'true' : undefined}
                className={`block px-3 py-2 rounded-xl transition-colors ${
                  m.marca === atual ? 'bg-white/5' : 'hover:bg-white/5'
                }`}
              >
                <span className="marca block text-sm text-white">
                  {m.nome}<BlueDot />{m.sufixo}
                </span>
                <span className="block text-[11px] text-on-surface-variant leading-snug">{m.descricao}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
