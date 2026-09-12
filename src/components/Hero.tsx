import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Abertura, { BOTAO, LINK } from './Abertura';
import LinhaDaEmpresa, { FaixaDePresenca } from './LinhaDaEmpresa';
import { anosDeLegado } from '../constants/brand';
import { BRAND_DOMAINS } from '../config/brand';
import { evento } from '../utils/eventos';

const PAISES = ['brazil', 'portugal', 'chile', 'peru', 'colombia', 'usa'] as const;

/**
 * Hero da ness.: a abertura de destaque, centralizada, com a foto da marca de
 * volta ao fundo — a delicadeza sem ela ficou apagada. Sem palavra pintada de
 * azul (acento numa palavra só é o tique mais gasto de título) e sem etiqueta
 * em caixa alta. O mapa das soluções vem logo abaixo.
 */
const Hero = () => {
  const { t } = useTranslation();

  return (
    <Abertura
      fundo="ness"
      base="surface"
      destaque
      /* O <highlight> do texto era um <span/> vazio; sem ele o título chega como
         string e sobe palavra por palavra (Abertura). */
      titulo={t('hero.title').replace(/<\/?highlight>/g, '')}
      /* O segundo plano da primeira tela (spec, seção 4): uma casa, o ciclo
         inteiro, por tempo. Os três pontos levam às páginas que existem — os
         dois domínios do ecossistema e o mapa de soluções. */
      aoLado={
        <LinhaDaEmpresa
          titulo={t('hero.linha.titulo')}
          pontos={[
            {
              quando: t('hero.linha.antes.quando'),
              marca: t('hero.linha.antes.marca'),
              texto: t('hero.linha.antes.texto'),
              href: BRAND_DOMAINS.trustness,
              externo: true,
            },
            {
              quando: t('hero.linha.todo_dia.quando'),
              marca: t('hero.linha.todo_dia.marca'),
              texto: t('hero.linha.todo_dia.texto'),
              href: '/solucoes',
            },
            {
              quando: t('hero.linha.provar.quando'),
              marca: t('hero.linha.provar.marca'),
              texto: t('hero.linha.provar.texto'),
              href: BRAND_DOMAINS.forense,
              externo: true,
            },
          ]}
        />
      }
      /* "clientes atendidos", nunca "escritórios" nem "operação em". Os seis
         países já estavam traduzidos e não eram usados em lugar nenhum. */
      abaixo={<FaixaDePresenca rotulo={t('presence.clientes')} lugares={PAISES.map((p) => t(`presence.locations.${p}`))} />}
      acoes={
        <>
          <Link
            onClick={() => evento('cta_click', { cta: 'hero_primario', destino: '/contato' })}
            to="/contato?ref=home"
            className={BOTAO}
          >
            {t('hero.cta_primary', 'falar com um especialista')}
          </Link>
          <Link to="/solucoes" className={LINK}>{t('hero.explore')}</Link>
        </>
      }
    >
      {t('hero.subtitle_clear', {
        years: anosDeLegado(),
        defaultValue: `operações de segurança 24×7, infraestrutura, engenharia de software, LGPD e perícia digital para empresas que não podem parar. ${anosDeLegado()} anos entregando com precisão.`,
      })}
    </Abertura>
  );
};

export default Hero;
