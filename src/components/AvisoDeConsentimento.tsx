import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/**
 * Aviso de medição de audiência — nosso, não o da Zaraz.
 *
 * O modal padrão da Zaraz é um `<dialog>` aberto em modo modal: ele cobre a
 * tela inteira e **trava a página** até o visitante responder. Medimos isso em
 * produção — `document.elementFromPoint` no botão do chat devolvia
 * `DIV.cf_modal_container` — e quem chegava pela primeira vez não conseguia
 * clicar em nada, nem no menu, nem no CTA. Consentir antes de medir é certo;
 * impedir a pessoa de ler o site antes de decidir, não.
 *
 * Aqui o aviso é uma faixa ancorada embaixo, que não bloqueia nada. A Zaraz
 * continua governando a medição: nada é enviado antes de `setAll`, e é a
 * própria API dela que guarda a escolha. O modal dela fica escondido por
 * `hideModal: true` na configuração da zone (ver
 * `scripts/zaraz-consentimento.ps1`).
 *
 * Aceitar e recusar têm o mesmo tamanho e o mesmo contraste, de propósito:
 * recusar não pode custar mais que aceitar.
 *
 * Sem Zaraz na página — preview em workers.dev, desenvolvimento local — o
 * componente não renderiza nada.
 */
export default function AvisoDeConsentimento() {
  const { t } = useTranslation();
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const decidir = () => {
      const consent = window.zaraz?.consent;
      if (!consent) return;
      // Esconde o modal de fábrica também pelo cliente: se a configuração da
      // zone for revertida, o visitante não leva os dois avisos na cara.
      consent.modal = false;
      const escolhas = consent.getAll?.() ?? {};
      const jaRespondeu = Object.values(escolhas).some((v) => v !== undefined);
      setVisivel(!jaRespondeu);
    };

    document.addEventListener('zarazConsentAPIReady', decidir);
    // A API pode já estar pronta quando este efeito roda.
    decidir();
    return () => document.removeEventListener('zarazConsentAPIReady', decidir);
  }, []);

  if (!visivel) return null;

  const responder = (aceitou: boolean) => {
    const consent = window.zaraz?.consent;
    consent?.setAll?.(aceitou);
    if (aceitou) consent?.sendQueuedEvents?.();
    setVisivel(false);
  };

  const botao =
    'min-h-11 rounded-full px-6 font-display text-sm font-medium transition-all ' +
    'focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-surface-container-low';

  return (
    <section
      role="region"
      aria-label={t('consentimento.titulo', 'aviso de privacidade')}
      className="glass anim-fade-up fixed bottom-24 left-4 right-4 z-40 rounded-3xl border-white/10 p-6 shadow-2xl shadow-black/40 sm:bottom-6 sm:right-auto sm:max-w-md"
    >
      <p className="text-sm leading-relaxed text-on-surface-variant">
        <Trans
          i18nKey="consentimento.texto"
          defaults="Medimos audiência para entender como o site é usado. Nada é compartilhado com anunciantes, e você pode recusar sem perder nenhuma função. <politica>Como tratamos seus dados</politica>."
          components={{
            politica: (
              <Link
                to="/compliance/privacidade"
                className="text-primary-container underline underline-offset-2 transition-colors hover:text-primary"
              />
            ),
          }}
        />
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => responder(true)} className={`${botao} bg-primary-container text-on-primary hover:brightness-110`}>
          {t('consentimento.aceitar', 'aceitar')}
        </button>
        <button
          type="button"
          onClick={() => responder(false)}
          className={`${botao} border border-primary-container text-primary-container hover:bg-primary-container/10`}
        >
          {t('consentimento.recusar', 'recusar')}
        </button>
      </div>
    </section>
  );
}
