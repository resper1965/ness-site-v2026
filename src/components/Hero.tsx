import BlueDot from '../components/BlueDot';
import HeroPicture from '../components/HeroPicture';
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { ArrowRight, ShieldCheck, Server, Code2, Scale, Search } from "lucide-react";
import { FOUNDATION_YEAR, YEARS_OF_LEGACY } from '../constants/brand';
import { usePageTitle } from '../hooks/usePageTitle';

/**
 * Hero da ness. — sem Framer Motion (entradas em CSS), sem animações infinitas,
 * imagem self-host como candidato a LCP e uma leitura clara em 5 segundos:
 * o que fazemos, para quem, e uma ação comercial.
 */
const Hero = () => {
  const { t } = useTranslation();
  usePageTitle({
    title: 'tecnologia digital de precisão',
    description: 'ness. é uma plataforma modular de transformação digital corporativa B2B desde 1991. Especialistas em DevSecOps, LGPD, segurança cibernética, perícia digital e engenharia de software de alta performance.',
  });

  const pillars = [
    { icon: ShieldCheck, label: t('hero.pillars.secops', 'segurança 24×7') },
    { icon: Server, label: t('hero.pillars.infra', 'infraestrutura & cloud') },
    { icon: Code2, label: t('hero.pillars.software', 'engenharia de software') },
    { icon: Scale, label: t('hero.pillars.privacy', 'LGPD & compliance') },
    { icon: Search, label: t('hero.pillars.forensics', 'perícia digital') },
  ];

  return (
    <section className="relative min-h-[88vh] flex items-center pt-24 pb-16 overflow-hidden bg-surface-container-lowest">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <HeroPicture brand="ness" opacity={0.55} priority />
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/20 via-surface-container-lowest/80 to-surface-container-lowest z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,173,232,0.15),transparent_70%)] z-20"></div>
        {/* Glow estático: mesmo efeito visual, zero custo por frame */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 blur-[120px] rounded-full z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-container/10 blur-[150px] rounded-full z-10" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-8 w-full">
        <div className="max-w-5xl space-y-8 md:space-y-10 anim-fade-up">
          <span className="inline-flex items-center gap-3 px-4 md:px-5 py-2 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container font-display text-[11px] md:text-xs tracking-[0.14em] md:tracking-[0.18em] uppercase whitespace-nowrap max-w-full overflow-hidden">
            {t('hero.tag')}
            <span className="text-primary-container/60 hidden sm:inline" aria-hidden="true">·</span>
            <span className="normal-case tracking-normal hidden sm:inline">{t('hero.since', { year: FOUNDATION_YEAR, defaultValue: `desde ${FOUNDATION_YEAR}` })}</span>
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-display font-medium text-white leading-[1.05] tracking-tighter lowercase-all">
            <Trans i18nKey="hero.title" components={{ highlight: <span className="text-primary-container drop-shadow-[0_0_20px_rgba(0,173,232,0.6)]" /> }} />
            <BlueDot />
          </h1>
          <p className="text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed">
            {t('hero.subtitle_clear', {
              years: YEARS_OF_LEGACY,
              defaultValue: `operações de segurança 24×7, infraestrutura, engenharia de software, LGPD e perícia digital para empresas que não podem parar. ${YEARS_OF_LEGACY} anos entregando com precisão.`,
            })}
          </p>
          <div className="flex flex-wrap items-center gap-5 md:gap-8 pt-2">
            <Link
              to="/contato?ref=home"
              className="bg-linear-to-r from-primary-container to-primary text-on-primary px-8 md:px-10 py-4 rounded-full font-display font-semibold text-sm shadow-xl shadow-primary-container/20 hover:scale-105 transition-transform focus-visible:ring-2 focus-visible:ring-white"
            >
              {t('hero.cta_primary', 'falar com um especialista')}
            </Link>
            <Link
              to="/solucoes"
              className="flex items-center gap-2 text-white font-display font-medium text-sm hover:text-primary transition-colors group"
            >
              {t('hero.explore')}<BlueDot />
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} aria-hidden="true" />
            </Link>
          </div>

          {/* Pilares: o que a ness. faz, legível antes de qualquer rolagem */}
          <ul className="flex flex-wrap gap-x-6 gap-y-3 pt-4 text-sm text-on-surface-variant" aria-label={t('hero.pillars.label', 'frentes de atuação')}>
            {pillars.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-2">
                <Icon size={16} className="text-primary-container" aria-hidden="true" />
                <span className="lowercase-all">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
