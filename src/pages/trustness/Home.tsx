import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BlueDot from "../../components/BlueDot";
import Abertura, { BOTAO, CabecalhoDeSecao, LINK } from "../../components/Abertura";
import LinhaDaEmpresa from "../../components/LinhaDaEmpresa";
import LeadMagnet from "../../components/LeadMagnet";
import ComMarcas from "../../components/ComMarcas";
import { homeMeta, routeMeta } from '../../utils/meta';

/**
 * A home da trustness. mostra a auditoria como ela anda — fases em ordem fixa
 * sobre uma régua de 4 a 8 semanas — e o DPO como ele é: duas fases de entrada
 * e, depois, um ciclo entre manutenção e auditoria. O texto antigo chamava tudo
 * de "ciclo de quatro fases"; o desenho corrige.
 */

type Fase = { nome: string; texto: string };
type Servico = { titulo: string; texto: string };

function CicloDpo() {
  const { t } = useTranslation();
  const d = (chave: string) => t(`trustness.dpo.diagrama.${chave}`);
  const entrada = t('trustness.dpo.diagrama.entrada', { returnObjects: true }) as string[];
  const manutencaoSub = t('trustness.dpo.diagrama.manutencao_sub', { returnObjects: true }) as string[];
  const TITULO = 'fill-white font-display text-[13px] font-medium';
  // 13 px: o desenho encolhe no celular, e a 11,5 px o rótulo ficava com 10 px.
  const SUB = 'fill-on-surface-variant text-[13px]';

  return (
    <svg viewBox="0 0 360 430" role="img" aria-label={d('descricao')} className="block h-auto w-full max-w-[380px] font-sans">
      <defs>
        <marker id="seta-dpo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="fill-on-surface-variant" />
        </marker>
      </defs>
      <g className="fill-none stroke-on-surface-variant" strokeWidth={1}>
        <line x1="40" y1="38" x2="40" y2="100" markerEnd="url(#seta-dpo)" />
        <line x1="40" y1="118" x2="40" y2="290" markerEnd="url(#seta-dpo)" />
        <path d="M44,294 A90,90 0 0 1 216,294" markerEnd="url(#seta-dpo)" />
        <path d="M216,306 A90,90 0 0 1 44,306" markerEnd="url(#seta-dpo)" />
      </g>
      <path d="M252,26 H260 V134 H252" className="fill-none stroke-white/20" />
      <text x="268" y="76" className={SUB}>{entrada[0]}</text>
      <text x="268" y="92" className={SUB}>{entrada[1]}</text>

      <circle cx="40" cy="30" r="4.5" className="fill-surface-container-lowest stroke-primary-container" />
      <text x="56" y="34" className={TITULO}>{d('diagnostico')}</text>
      <text x="56" y="52" className={SUB}>{d('diagnostico_sub')}</text>

      <circle cx="40" cy="110" r="4.5" className="fill-surface-container-lowest stroke-primary-container" />
      <text x="56" y="114" className={TITULO}>{d('adequacao')}</text>
      <text x="56" y="132" className={SUB}>{d('adequacao_sub')}</text>

      <circle cx="40" cy="300" r="4.5" className="fill-primary-container" />
      <text x="56" y="296" className={TITULO}>{d('manutencao')}</text>
      <text x="56" y="314" className={SUB}>{manutencaoSub[0]}</text>
      <text x="56" y="330" className={SUB}>{manutencaoSub[1]}</text>

      <circle cx="220" cy="300" r="4.5" className="fill-primary-container" />
      <text x="234" y="296" className={TITULO}>{d('auditoria')}</text>
      <text x="234" y="314" className={SUB}>{d('auditoria_sub')}</text>

      <text x="130" y="200" textAnchor="middle" className={SUB}>{d('ida')}</text>
      <text x="130" y="414" textAnchor="middle" className={SUB}>{d('volta')}</text>
    </svg>
  );
}

export default function TrustnessHome() {
  const { t } = useTranslation();
  const fases = t('trustness.auditoria.fases', { returnObjects: true }) as Fase[];
  const servicos = t('trustness.servicos.itens', { returnObjects: true }) as Servico[];

  return (
    <div className="bg-surface-container-lowest">
      <Abertura
        fundo="trustness"
        marca={<>trustness<BlueDot /></>}
        titulo={t('trustness.hero.titulo')}
        /* A linha da trustness. (spec, seção 4): medir, estruturar, testar,
           manter. Link só onde o alvo existe nesta página. */
        aoLado={
          <LinhaDaEmpresa
            titulo={t('trustness.linha.titulo')}
            pontos={[
              { quando: t('trustness.linha.medir.quando'), texto: t('trustness.linha.medir.texto'), href: '#auditoria', externo: true },
              { quando: t('trustness.linha.estruturar.quando'), texto: t('trustness.linha.estruturar.texto') },
              { quando: t('trustness.linha.testar.quando'), texto: t('trustness.linha.testar.texto') },
              { quando: t('trustness.linha.manter.quando'), texto: t('trustness.linha.manter.texto'), href: '#dpo', externo: true },
            ]}
          />
        }
        acoes={
          <>
            <Link to="/contato?ref=trustness" className={BOTAO}>{t('trustness.hero.cta')}</Link>
            <a href="#auditoria" className={LINK}>{t('trustness.hero.link')}</a>
          </>
        }
      >
        {t('trustness.hero.lede')}
      </Abertura>
      <div className="mx-auto box-content max-w-7xl px-8 pb-24">

        {/* A partir de 1024 px a seção vira doze colunas (C1): o cabeçalho nas
            quatro primeiras, acompanhando o leitor enquanto a régua rola, e o
            desenho nas oito restantes. O fixo é o div de fora; o `.revela` do
            cabeçalho fica dentro dele, porque `sticky` impediria a animação
            guiada por rolagem de completar o alcance. */}
        <section id="auditoria" aria-labelledby="t-auditoria" className="secao-grade mb-24">
          <div className="cabecalho-fixo">
            <CabecalhoDeSecao id="t-auditoria" titulo={t('trustness.auditoria.titulo')}>{t('trustness.auditoria.intro')}</CabecalhoDeSecao>
          </div>
          <figure className="conteudo-grade">
            <ol className="grid lg:grid-cols-5">
              {fases.map((fase, i) => (
                <li
                  key={fase.nome}
                  className="relative pb-5 pl-9 font-display text-[13.5px] font-medium leading-snug text-white last:pb-0 lg:pb-0 lg:pl-0 lg:pr-4 lg:pt-8"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-[9px] top-0 w-px bg-white/20 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[9px] lg:h-px lg:w-auto ${i === fases.length - 1 ? 'hidden lg:block' : ''}`}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 z-10 grid h-[19px] w-[19px] place-items-center rounded-full border border-primary-container bg-surface-container-lowest text-[10.5px] text-on-surface"
                  >
                    {i + 1}
                  </span>
                  {fase.nome}
                  <span className="mt-1 block font-sans text-[12.5px] font-normal leading-normal text-on-surface-variant">{fase.texto}</span>
                </li>
              ))}
            </ol>
            <div aria-hidden="true" className="mt-11 grid items-center gap-x-4 gap-y-2.5 text-xs text-on-surface-variant md:grid-cols-[72px_minmax(0,1fr)]">
              <span>{t('trustness.auditoria.semanas')}</span>
              <div className="grid grid-cols-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <span key={s} className="border-l border-white/10 pl-1.5">{s}</span>
                ))}
              </div>
              <span className="hidden md:block" />
              <div className="grid h-3 grid-cols-8 items-center">
                <span className="col-span-4 h-0.5 rounded-full bg-primary-container" />
                <span className="col-span-4 border-t border-dashed border-primary" />
              </div>
            </div>
            <figcaption className="mt-5 max-w-[72ch] text-[13px] leading-relaxed text-on-surface-variant">
              {t('trustness.auditoria.legenda')}
            </figcaption>
          </figure>
        </section>

        <section id="dpo" aria-labelledby="t-dpo" className="mb-24 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
          <div>
            <CabecalhoDeSecao id="t-dpo" titulo={t('trustness.dpo.titulo')}>
              <p><ComMarcas>{t('trustness.dpo.texto')}</ComMarcas></p>
              <p>{t('trustness.dpo.plataforma')}</p>
            </CabecalhoDeSecao>
            <Link to="/dpo-as-a-service" className={LINK}>{t('trustness.dpo.link')}</Link>
          </div>
          <figure>
            <CicloDpo />
          </figure>
        </section>

        <section id="servicos" aria-labelledby="t-servicos" className="secao-grade mb-24">
          <div className="cabecalho-fixo">
            <CabecalhoDeSecao id="t-servicos" titulo={t('trustness.servicos.titulo')} />
          </div>
          <dl className="conteudo-grade grid gap-x-12 md:grid-cols-2 lg:grid-cols-3">
            {servicos.map((s) => (
              <div key={s.titulo} className="border-t border-white/10 py-4">
                <dt className="font-display text-sm font-medium text-white">{s.titulo}</dt>
                <dd className="mt-1 text-resumo leading-relaxed text-on-surface-variant">{s.texto}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* O checklist e o assessment são as duas portas de entrada que viram
            lead sem conversa: ficam, no mesmo tom contido do resto. */}
        {/* grid-cols-1 e não grid solto: sem a coluna declarada, a largura mínima
            de um filho alargava a coluna e empurrava a página 4 px para o lado. */}
        <section className="mb-24 grid grid-cols-1 gap-8">
          <LeadMagnet
            slug="lgpd-checklist"
            title={t('leadmagnet.lgpd_titulo')}
            description={t('leadmagnet.lgpd_desc')}
            items={t('leadmagnet.lgpd_itens', { returnObjects: true }) as string[]}
          />
          <div className="flex flex-col items-start gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[60ch] space-y-1.5">
              <h2 className="font-display text-lg font-medium lowercase text-white">{t('leadmagnet.quiz_titulo')}<BlueDot /></h2>
              <p className="text-[13.5px] leading-relaxed text-on-surface-variant">{t('leadmagnet.quiz_desc')}</p>
            </div>
            <Link to="/assessment/lgpd" className={BOTAO}>{t('leadmagnet.quiz_botao')}</Link>
          </div>
        </section>

        <section aria-labelledby="t-fecho" className="grid justify-items-start gap-4 border-t border-white/10 pt-16">
          <h2 id="t-fecho" className="font-display text-secao-alt font-medium lowercase tracking-tight text-white">{t('trustness.cta.title')}</h2>
          <p className="max-w-[60ch] text-resumo leading-relaxed text-on-surface-variant">{t('trustness.cta.desc')}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link to="/contato?ref=trustness" className={BOTAO}>{t('trustness.cta.btn1')}</Link>
            <Link to="/contato?ref=trustness" className={LINK}>{t('trustness.cta.btn2')}</Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => homeMeta('trustness', lang));
}
