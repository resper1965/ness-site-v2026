import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/**
 * Caixa de consentimento dos formulários.
 *
 * Fica num componente porque o texto é jurídico e precisa ser idêntico em toda
 * superfície que coleta dado pessoal — e porque antes ele era texto morto:
 * dizia "li e aceito a política de privacidade" sem link nenhum para ela.
 *
 * A caixa é desenhada em vez de nativa: o controle do sistema em color-scheme
 * escuro entra cinza-claro e destoa do formulário inteiro. O `peer` mantém o
 * estado real do input, então teclado e leitor de tela seguem funcionando.
 */
export default function ConsentimentoPrivacidade({ id = 'privacy-consent' }: { id?: string }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex items-start gap-3 py-2">
      <input
        id={id}
        name="privacy_consent"
        type="checkbox"
        required
        aria-label={t('common.privacy_consent')}
        className="peer mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/5 transition-colors checked:border-primary-container checked:bg-primary-container hover:border-white/40 checked:hover:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
      />
      {/* O “✓” fica por cima da caixa, guiado pelo estado do input. Absoluto
          para não ocupar espaço e afastar o texto do controle. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-0 top-2 mt-0.5 h-5 w-5 opacity-0 peer-checked:opacity-100"
      >
        <path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#003549" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <label htmlFor={id} className="cursor-pointer text-[11px] font-light leading-relaxed text-on-surface-variant">
        <Trans
          i18nKey="common.privacy_consent_links"
          defaults="li e aceito a <privacidade>política de privacidade</privacidade> e os <termos>termos de uso</termos>."
          components={{
            privacidade: <Link to="/compliance/privacidade" className="text-primary-container underline underline-offset-2 transition-colors hover:text-primary" />,
            termos: <Link to="/compliance/termos" className="text-primary-container underline underline-offset-2 transition-colors hover:text-primary" />,
          }}
        />
      </label>
    </div>
  );
}
