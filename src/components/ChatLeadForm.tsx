import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBrand } from '../config/brand';
import { canalApi } from '../services/canal';
import { origemDaVisita } from '../utils/origem';
import { validarEmail } from '../utils/formulario';
import { evento } from '../utils/eventos';
import Turnstile from './Turnstile';

const CAMPO =
  'w-full bg-white/5 border border-white/35 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container';

/**
 * Qualificação dentro do chat, antes de passar para um humano.
 *
 * Sem isto a conversa termina em "entre em contato pelo site" e o visitante
 * recomeça do zero num formulário — a maior parte não recomeça. Três campos,
 * o mínimo para alguém do time saber quem ligar e sobre o quê.
 */
export default function ChatLeadForm({ assunto, onPronto }: { assunto: string; onPronto: () => void }) {
  const { t } = useTranslation();
  const brand = useBrand();
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [avisoEmail, setAvisoEmail] = useState<string | null>(null);

  return (
    <form
      className="px-4 pb-4 pt-2 space-y-2 shrink-0 border-t border-white/5"
      onSubmit={async (e) => {
        e.preventDefault();
        setEnviando(true);
        setErro(null);
        const dados = new FormData(e.currentTarget);
        try {
          await canalApi.submitForm({
            formType: 'chat',
            name: dados.get('nome'),
            email: dados.get('email'),
            company: dados.get('empresa'),
            subject: assunto,
            message: 'lead qualificado pelo chat',
            referrer: brand,
            ...origemDaVisita(),
            turnstileToken: dados.get('cf-turnstile-response'),
          });
          evento('chat_lead', { subject: assunto, brand });
          onPronto();
        } catch {
          setErro(t('chatlead.erro', 'não consegui registrar agora. tente pelo formulário de contato.'));
        } finally {
          setEnviando(false);
        }
      }}
    >
      <p className="text-[11px] text-on-surface-variant leading-relaxed">
        {t('chatlead.intro', 'para chamar a pessoa certa, preciso de três dados:')}
      </p>

      <label className="sr-only" htmlFor="chat-nome">{t('chatlead.nome', 'nome')}</label>
      <input id="chat-nome" name="nome" required autoComplete="name" placeholder={t('chatlead.nome', 'nome')} className={CAMPO} />

      <label className="sr-only" htmlFor="chat-email">{t('chatlead.email', 'e-mail corporativo')}</label>
      <input id="chat-email" name="email" type="email" required autoComplete="email" placeholder={t('chatlead.email', 'e-mail corporativo')}
        onBlur={(e) => setAvisoEmail(validarEmail(e.target.value))}
        aria-describedby={avisoEmail ? 'chat-email-aviso' : undefined}
        className={CAMPO} />
      {avisoEmail && <p id="chat-email-aviso" className="text-[11px] text-amber-300 leading-snug">{avisoEmail}</p>}

      <label className="sr-only" htmlFor="chat-empresa">{t('chatlead.empresa', 'empresa')}</label>
      <input id="chat-empresa" name="empresa" required autoComplete="organization" placeholder={t('chatlead.empresa', 'empresa')} className={CAMPO} />

      <Turnstile action="chat" />

      {erro && <p role="alert" className="text-[11px] text-red-400">{erro}</p>}

      <button type="submit" disabled={enviando}
        className="w-full bg-primary-container text-on-primary py-2.5 rounded-xl text-[11px] font-medium uppercase tracking-widest disabled:opacity-50">
        {enviando ? t('common.sending', 'enviando...') : t('chatlead.enviar', 'quero falar com um especialista')}
      </button>
    </form>
  );
}
