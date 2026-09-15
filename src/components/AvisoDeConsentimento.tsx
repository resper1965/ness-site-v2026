import { useEffect, useState, type FormEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useLocation, useRouteLoaderData } from 'react-router';

import { COOKIE_CONSENTIMENTO, VALIDADE_CONSENTIMENTO, type Consentimento } from '../utils/consentimento';
import { useSemJs } from '../utils/semJs';

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
 * componente não renderiza nada nas rotas hidratadas. A exceção é a rota
 * servida sem o runtime: lá quem decide é o servidor, pelo cookie, porque
 * este componente nunca chega a montar.
 *
 * `z-30`, um degrau abaixo do chat, não é detalhe: os dois moram no canto
 * de baixo e no celular eles se sobrepõem. Em `z-40`, empatado com o chat e
 * montado depois dele, este aviso ficava por cima e comia os cliques das
 * respostas rápidas — medido em produção, o parágrafo daqui recebia o toque
 * destinado ao botão "falar com especialista".
 */
/**
 * O cookie é o único sinal confiável de que a pessoa já respondeu.
 *
 * A primeira versão disto perguntava ao `getAll()` da Zaraz e tratava
 * `undefined` como "ainda não respondeu", que é o que a documentação sugere.
 * Medido em produção, `getAll()` devolve `{ analytics: false }` para quem
 * nunca respondeu — a Zaraz nega por padrão, e por essa API "negado por
 * padrão" é indistinguível de "recusou". O aviso nunca aparecia.
 *
 * O cookie não tem essa ambiguidade: ou existe, e houve resposta, ou não
 * existe. `zaraz-consent` é o nome configurado nas nossas zones; `cf_consent`
 * é o padrão da Zaraz, aceito aqui para o caso de a configuração mudar; e
 * `ness-consent` é o nosso, o único que o servidor enxerga.
 */
function jaRespondeu(): boolean {
  return /(?:^|;\s*)(zaraz-consent|cf_consent|ness-consent)=/.test(document.cookie);
}

/** O mesmo cookie que o Worker grava, quando quem responde é o navegador. */
function guardarEscolha(escolha: Consentimento) {
  const seguro = window.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${COOKIE_CONSENTIMENTO}=${escolha}; path=/; max-age=${VALIDADE_CONSENTIMENTO}; samesite=lax${seguro}`;
}

export default function AvisoDeConsentimento() {
  const { t } = useTranslation();
  const location = useLocation();
  const dados = useRouteLoaderData('root') as { consentimento?: Consentimento | null } | undefined;
  const semJs = useSemJs();

  /**
   * Quem decide se a faixa aparece depende de haver hidratação.
   *
   * Na rota servida sem o runtime não existe um segundo momento: ou o HTML
   * sai com a faixa, ou o visitante nunca responde. Então lá a pergunta é a
   * do servidor — tem cookie? —, e a resposta vai por formulário.
   *
   * Nas rotas hidratadas quem decide continua sendo a Zaraz, no efeito
   * abaixo: ela é quem sabe se há medição nesta página. Onde não há (o
   * preview em workers.dev, o desenvolvimento local), nada aparece, como
   * antes — pedir consentimento para uma medição que não existe seria pedir
   * por pedir.
   */
  const [visivel, setVisivel] = useState(semJs && !dados?.consentimento);

  useEffect(() => {
    const decidir = () => {
      // Tudo aqui dentro é conversa com código de terceiro. Um erro solto
      // sobe até o ErrorBoundary e derruba a árvore inteira — foi o que
      // aconteceu em produção: sem nav, sem rodapé, sem h1, porque
      // `consent.modal = false` chamava o `hideConsentModal()` da Zaraz, que
      // tentava remover um modal que a própria configuração `hideModal: true`
      // já tinha impedido de existir. O pior desfecho aceitável aqui é o
      // aviso não aparecer; nunca o site sumir.
      try {
        const consent = window.zaraz?.consent;
        if (!consent) return;
        // Só desliga o modal de fábrica se ele existir de verdade. Serve para
        // o caso de a configuração da zone ser revertida — aí o visitante não
        // leva os dois avisos na cara.
        const temModal = document.querySelector('.cf_modal_container') ||
          [...document.querySelectorAll('*')].some((el) => el.shadowRoot?.querySelector('.cf_modal'));
        if (temModal && consent.modal !== false) consent.modal = false;
        setVisivel(!jaRespondeu());
      } catch {
        // Terceiro quebrou. O site segue.
      }
    };

    document.addEventListener('zarazConsentAPIReady', decidir);
    // A API pode já estar pronta quando este efeito roda.
    decidir();
    return () => document.removeEventListener('zarazConsentAPIReady', decidir);
  }, []);

  if (!visivel) return null;

  /**
   * Com JavaScript, responder não recarrega a página: o envio é interceptado,
   * a escolha vai para o cookie e para a Zaraz, e a faixa sai. Sem
   * JavaScript nada disto roda e o formulário segue para o Worker, que faz o
   * mesmo e devolve a pessoa à página em que ela estava.
   */
  const responder = (e: FormEvent<HTMLFormElement>) => {
    const botao = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const aceitou = botao?.value === 'aceito';
    e.preventDefault();
    guardarEscolha(aceitou ? 'aceito' : 'recusado');
    // Mesmo motivo do try/catch acima: a escolha da pessoa tem que valer
    // mesmo que a API da Zaraz quebre no meio.
    try {
      const consent = window.zaraz?.consent;
      consent?.setAll?.(aceitou);
      if (aceitou) consent?.sendQueuedEvents?.();
    } catch {
      /* segue */
    }
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
      className="glass surge fixed bottom-24 left-4 right-4 z-30 rounded-3xl border-white/10 p-6 shadow-2xl shadow-black/40 sm:bottom-6 sm:right-auto sm:max-w-md"
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
      <form method="post" action="/consentimento" onSubmit={responder} className="mt-5 flex flex-wrap gap-3">
        {/* Para onde o Worker devolve a pessoa depois de gravar a escolha. */}
        <input type="hidden" name="volta" value={location.pathname + location.search} />
        <button type="submit" name="resposta" value="aceito" className={`${botao} bg-primary-container text-on-primary hover:brightness-110`}>
          {t('consentimento.aceitar', 'aceitar')}
        </button>
        <button
          type="submit"
          name="resposta"
          value="recusado"
          className={`${botao} border border-primary-container text-primary-container hover:bg-primary-container/10`}
        >
          {t('consentimento.recusar', 'recusar')}
        </button>
      </form>
    </section>
  );
}
