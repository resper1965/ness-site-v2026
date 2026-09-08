import { Link, useLocation } from 'react-router';
import { CheckCircle2, ArrowLeft, Phone } from 'lucide-react';
import { useBrand } from '../config/brand';
import { idiomaDaRota, rotaNoIdioma } from '../utils/lang';
import { routeMeta } from '../utils/meta';

/**
 * A confirmação vira página, não um aviso verde que some ao recarregar.
 *
 * Sem URL própria não há como medir conversão: `/obrigado` é o evento de
 * chegada do lead, e é ela que o GA4 e o anúncio pago contam.
 */
const COPY = {
  pt: {
    titulo: 'recebemos sua mensagem',
    prazo: 'respondemos em até 1 dia útil, no horário comercial de Brasília.',
    urgente: 'incidente em andamento não espera fila:',
    voltar: 'voltar ao início',
  },
  en: {
    titulo: 'we got your message',
    prazo: 'we reply within 1 business day, Brasília business hours.',
    urgente: 'an incident in progress does not wait in line:',
    voltar: 'back to home',
  },
  es: {
    titulo: 'recibimos su mensaje',
    prazo: 'respondemos en hasta 1 día hábil, horario comercial de Brasilia.',
    urgente: 'un incidente en curso no espera en la fila:',
    voltar: 'volver al inicio',
  },
} as const;

// noindex: é página de destino de conversão, não conteúdo para busca.
export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => ({
    title: COPY[lang].titulo,
    noindex: true,
  }));
}

export default function Obrigado() {
  const { pathname } = useLocation();
  const brand = useBrand();
  const copy = COPY[idiomaDaRota(pathname)];
  const telefone = brand === 'forense' ? '+55 (11) 2504-7650' : '+55 (11) 2504-7650';

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-32 bg-surface-container-lowest">
      <div className="max-w-xl w-full text-center space-y-8">
        <CheckCircle2 size={48} className="mx-auto text-primary-container" aria-hidden="true" />

        <h1 className="text-3xl md:text-4xl font-display font-medium text-white lowercase-all">
          {copy.titulo}
        </h1>

        <p className="text-on-surface-variant leading-relaxed">{copy.prazo}</p>

        <p className="text-sm text-on-surface-variant">
          {copy.urgente}{' '}
          <a href="tel:+551125047650" className="text-primary-container font-bold inline-flex items-center gap-1">
            <Phone size={14} aria-hidden="true" /> {telefone}
          </a>
        </p>

        <Link
          to={rotaNoIdioma(pathname, idiomaDaRota(pathname)).replace('/obrigado', '') || '/'}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-on-surface-variant hover:text-primary-container transition-colors"
        >
          <ArrowLeft size={12} aria-hidden="true" /> {copy.voltar}
        </Link>
      </div>
    </div>
  );
}
