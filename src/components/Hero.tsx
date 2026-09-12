import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Abertura, { BOTAO, LINK } from './Abertura';
import { anosDeLegado } from '../constants/brand';
import { evento } from '../utils/eventos';

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
