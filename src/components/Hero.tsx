import BlueDot from '../components/BlueDot';
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { BOTAO, LINK } from './Abertura';
import { anosDeLegado } from '../constants/brand';
import { evento } from '../utils/eventos';

/**
 * Hero da ness. no desenho delicado: título a 32 px no máximo, sem palavra
 * pintada de azul, sem etiqueta em caixa alta, sem foto e sem brilhos — o
 * pedido de 10/09 foi uma home menos grosseira, sem fontes grandes. O que a
 * ness. faz vem no texto de apoio; o mapa das soluções está logo abaixo.
 */
const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-surface px-8 pb-4 pt-36 md:pt-44">
      <div className="mx-auto max-w-7xl">
        <div className="grid max-w-[720px] gap-5">
          <h1 className="text-balance font-display text-[28px] font-medium leading-tight tracking-tight text-white lowercase-all md:text-[32px]">
            {/* O destaque da palavra saiu: acento numa palavra só é o tique mais
                gasto de título. A chave de tradução segue a mesma. */}
            <Trans i18nKey="hero.title" components={{ highlight: <span /> }} />
            <BlueDot />
          </h1>
          <p className="max-w-[62ch] text-base leading-relaxed text-on-surface-variant">
            {t('hero.subtitle_clear', {
              years: anosDeLegado(),
              defaultValue: `operações de segurança 24×7, infraestrutura, engenharia de software, LGPD e perícia digital para empresas que não podem parar. ${anosDeLegado()} anos entregando com precisão.`,
            })}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
            <Link
              onClick={() => evento('cta_click', { cta: 'hero_primario', destino: '/contato' })}
              to="/contato?ref=home"
              className={BOTAO}
            >
              {t('hero.cta_primary', 'falar com um especialista')}
            </Link>
            <Link to="/solucoes" className={LINK}>{t('hero.explore')}</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
