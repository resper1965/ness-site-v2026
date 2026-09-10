import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BlueDot from "../../components/BlueDot";
import Abertura, { BOTAO, CabecalhoDeSecao, LINK } from "../../components/Abertura";
import { homeMeta, routeMeta } from '../../utils/meta';

/**
 * A home da forense.io abre com o que só a perícia tem: a cadeia de custódia.
 * O hash é ilustrativo — o que o desenho afirma é que ele é o mesmo em todas
 * as etapas, e é isso que prova que a evidência não mudou.
 */
const HASH = 'sha-256 9f2c…a41b';

type Etapa = { nome: string; texto: string; estado: string };
type Situacao = { titulo: string; texto: string };

/** O elo entre duas etapas: dois anéis que se cruzam. */
function Elo() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 28 12"
      className="absolute -left-[9.5px] bottom-[-24px] h-3 w-7 rotate-90 lg:-top-0.5 lg:bottom-auto lg:left-[calc(100%+6px)] lg:rotate-0"
    >
      <rect x="1" y="1" width="15" height="10" rx="5" className="fill-none stroke-primary/70" />
      <rect x="12" y="1" width="15" height="10" rx="5" className="fill-none stroke-primary/70" />
    </svg>
  );
}

export default function ForenseHome() {
  const { t } = useTranslation();
  const etapas = t('forense.cadeia.etapas', { returnObjects: true }) as Etapa[];
  const situacoes = t('forense.quando.itens', { returnObjects: true }) as Situacao[];

  return (
    <main className="bg-surface-container-lowest">
      <Abertura
        fundo="forense"
        marca={<>forense<BlueDot />io</>}
        titulo={t('forense.hero.titulo')}
        acoes={
          <>
            <Link to="/contato?ref=forense" className={BOTAO}>{t('forense.hero.cta')}</Link>
            <a href="#cadeia" className={LINK}>{t('forense.hero.link')}</a>
          </>
        }
      >
        {t('forense.hero.lede')}
      </Abertura>
      <div className="mx-auto box-content max-w-7xl px-8 pb-24">

        <section id="cadeia" aria-labelledby="t-cadeia" className="mb-24">
          <CabecalhoDeSecao id="t-cadeia" titulo={t('forense.cadeia.titulo')}>{t('forense.cadeia.intro')}</CabecalhoDeSecao>
          <figure>
            <ol className="grid gap-y-9 lg:grid-cols-5 lg:gap-x-10">
              {etapas.map((etapa, i) => (
                <li key={etapa.nome} className="relative flex flex-col gap-1.5 pl-7 lg:pl-0 lg:pt-7">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 h-[9px] w-[9px] rounded-full border border-primary-container bg-surface-container-lowest lg:top-0"
                  />
                  {i < etapas.length - 1 && (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute bottom-[-30px] left-1 top-5 w-px bg-white/20 lg:bottom-auto lg:left-[17px] lg:right-[-6px] lg:top-1 lg:h-px lg:w-auto"
                      />
                      <Elo />
                    </>
                  )}
                  <h3 className="font-display text-[15px] font-medium text-white">{etapa.nome}</h3>
                  <p className="text-[13px] leading-relaxed text-on-surface-variant">{etapa.texto}</p>
                  <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-dashed border-white/10 pt-2.5 lg:mt-auto">
                    <code className="font-mono text-[11.5px] text-on-surface">{HASH}</code>
                    <span className="text-[11.5px] text-primary-container">{etapa.estado}</span>
                  </p>
                </li>
              ))}
            </ol>
            <figcaption className="mt-6 max-w-[72ch] text-[13px] leading-relaxed text-on-surface-variant">
              {t('forense.cadeia.legenda')}
            </figcaption>
          </figure>
        </section>

        <section id="quando" aria-labelledby="t-quando" className="mb-24">
          <CabecalhoDeSecao id="t-quando" titulo={t('forense.quando.titulo')} />
          <dl className="grid gap-x-12 md:grid-cols-2">
            {situacoes.map((s) => (
              <div key={s.titulo} className="border-t border-white/10 py-4">
                <dt className="font-display text-sm font-medium text-white">{s.titulo}</dt>
                <dd className="mt-1 text-[13.5px] leading-relaxed text-on-surface-variant">{s.texto}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="t-fecho" className="grid justify-items-start gap-4 border-t border-white/10 pt-16">
          <h2 id="t-fecho" className="font-display text-xl font-medium lowercase tracking-tight text-white">{t('forense.cta.title')}</h2>
          <p className="max-w-[60ch] text-[15px] leading-relaxed text-on-surface-variant">{t('forense.cta.desc')}</p>
          <Link to="/contato?ref=forense" className={BOTAO}>{t('forense.cta.btn')}</Link>
        </section>
      </div>
    </main>
  );
}

export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => homeMeta('forense', lang));
}
