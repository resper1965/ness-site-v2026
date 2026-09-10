import { NomeDeProduto } from '../components/BlueDot';
import Abertura, { CabecalhoDeSecao } from '../components/Abertura';
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { routeMeta, traduzir } from '../utils/meta';
import { BRAND_DOMAINS } from '../config/brand';

/**
 * As soluções no ciclo de vida do ambiente — construir, operar, proteger,
 * responder, comprovar — em vez de cinco cards iguais: o visitante escolhe pelo
 * momento em que está, e as duas marcas próprias entram no mesmo mapa (é o que
 * as páginas de serviços e de verticais tentavam dizer separadas).
 *
 * Serve as duas: e a rota /solucoes e a secao de solucoes da home. O nivel do
 * titulo vem da URL, nao de uma prop: o React Router instancia modulo de rota do
 * seu jeito — a prop nao chegava. Como pagina o titulo e h1 e a passagem entre
 * as marcas aparece; dentro da home o h1 ja e o do hero.
 */

type Produto = { nome: string; resumo: string; href: string; externo?: boolean };

const Solutions = () => {
  const { t } = useTranslation();
  const comoPagina = /\/solucoes\/?$/.test(useLocation().pathname);
  const Estagio = comoPagina ? "h2" : "h3";

  const produto = (slug: string): Produto => ({
    nome: `n.${slug}`,
    resumo: t(`solutions.${slug}.desc`),
    href: `/solucoes/${slug}`,
  });
  const ciclo: { chave: string; produtos: Produto[] }[] = [
    { chave: 'construir', produtos: [produto('devarch')] },
    { chave: 'operar', produtos: [produto('infraops'), produto('autoops')] },
    { chave: 'proteger', produtos: [produto('secops')] },
    {
      chave: 'responder',
      produtos: [produto('cirt'), { nome: 'forense.io', resumo: t('solutions.ciclo.forense'), href: BRAND_DOMAINS.forense, externo: true }],
    },
    {
      chave: 'comprovar',
      produtos: [{ nome: 'trustness.', resumo: t('solutions.ciclo.trustness'), href: BRAND_DOMAINS.trustness, externo: true }],
    },
  ];

  return (
    <section id="soluções" className={`bg-surface px-8 ${comoPagina ? 'pb-24 pt-32' : 'py-24'}`}>
      <div className="mx-auto max-w-7xl">
        {comoPagina ? (
          <Abertura titulo={t('solutions.ciclo.titulo')}>{t('solutions.ciclo.lede')}</Abertura>
        ) : (
          <CabecalhoDeSecao titulo={t('nav.solutions')} />
        )}

        <figure>
          <div className="grid lg:grid-cols-5">
            {ciclo.map(({ chave, produtos }) => (
              <div
                key={chave}
                className="relative border-l border-white/20 pb-8 pl-6 last:pb-0 lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pr-6 lg:pt-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[5px] top-1 h-[9px] w-[9px] rounded-full border border-primary-container bg-surface lg:-top-[5px] lg:left-0"
                />
                <Estagio className="mb-5 font-display text-[13px] font-medium text-on-surface-variant">
                  {t(`solutions.ciclo.estagios.${chave}`)}
                </Estagio>
                <ul className="grid gap-6">
                  {produtos.map((p) => {
                    const conteudo = (
                      <>
                        <span className="marca block text-[15px] text-white transition-colors group-hover:text-primary">
                          <NomeDeProduto nome={p.nome} />
                        </span>
                        <span className="mt-1 block text-[13px] leading-relaxed text-on-surface-variant">{p.resumo}</span>
                      </>
                    );
                    return (
                      <li key={p.nome}>
                        {p.externo ? (
                          <a href={p.href} className="group block">{conteudo}</a>
                        ) : (
                          <Link to={p.href} className="group block">{conteudo}</Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </figure>

        {comoPagina && <Passagem />}
      </div>
    </section>
  );
};

/**
 * O caminho de um incidente entre as marcas. Cada seta diz a condição da
 * passagem — é o que impede ler o desenho como "todo incidente vai até o fim".
 */
function Passagem() {
  const { t } = useTranslation();
  const p = (chave: string) => t(`solutions.ciclo.passagem.${chave}`);
  const passos = [
    { nome: 'n.secops', texto: p('secops'), seta: p('para_cirt') },
    { nome: 'n.cirt', texto: p('cirt'), seta: p('para_forense') },
    { nome: 'forense.io', texto: p('forense'), seta: p('para_trustness') },
    { nome: 'trustness.', texto: p('trustness') },
  ];

  return (
    <section id="passagem" aria-labelledby="t-passagem" className="pt-24">
      <CabecalhoDeSecao id="t-passagem" titulo={p('titulo')}>{p('intro')}</CabecalhoDeSecao>
      <ol className="grid lg:grid-cols-4 lg:gap-x-28">
        {passos.map((passo) => (
          <li key={passo.nome} className="relative grid content-start gap-1.5">
            <span className="marca text-[15px] text-white"><NomeDeProduto nome={passo.nome} /></span>
            <p className="text-[13px] leading-relaxed text-on-surface-variant">{passo.texto}</p>
            {passo.seta && (
              <span className="flex items-center gap-3 py-3 text-xs leading-snug text-on-surface-variant lg:absolute lg:left-full lg:top-0 lg:w-28 lg:flex-col lg:gap-1.5 lg:px-3 lg:py-0 lg:text-center">
                <svg aria-hidden="true" width="8" height="28" viewBox="0 0 8 28" className="shrink-0 lg:hidden">
                  <line x1="4" y1="0" x2="4" y2="21" className="stroke-white/25" />
                  <path d="M0.5,21 L4,28 L7.5,21 z" className="fill-on-surface-variant" />
                </svg>
                <span>{passo.seta}</span>
                <svg aria-hidden="true" width="88" height="8" viewBox="0 0 88 8" className="hidden lg:block">
                  <line x1="0" y1="4" x2="81" y2="4" className="stroke-white/25" />
                  <path d="M81,0.5 L88,4 L81,7.5 z" className="fill-on-surface-variant" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}


export default Solutions;


export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => {
    const t = traduzir(lang);
    return {
    title: t('nav.solutions', 'soluções'),
    description: {
      pt: 'As cinco soluções da ness.: SOC 24×7, infraestrutura e cloud, engenharia de software, automação de operações e resposta a incidentes.',
      en: "ness.'s five solutions: 24×7 SOC, infrastructure and cloud, software engineering, operations automation and incident response.",
      es: 'Las cinco soluciones de ness.: SOC 24×7, infraestructura y cloud, ingeniería de software, automatización de operaciones y respuesta a incidentes.',
    }[lang],
  };
  });
}
