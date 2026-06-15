import BlueDot from '../components/BlueDot';
import React from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';
import { usePageTitle } from '../hooks/usePageTitle';

const Hero = () => {
  const { t } = useTranslation();
  usePageTitle({
    title: 'tecnologia digital de precisão',
    description: 'ness. é uma plataforma modular de transformação digital corporativa B2B desde 1991. Especialistas em DevSecOps, LGPD, segurança cibernética, perícia digital e engenharia de software de alta performance.',
  });
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-surface-container-lowest">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=60&w=2000&fm=webp"
          alt="Abstract Tech Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          fetchPriority="high"
          width={2000}
          height={1333}
        />
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/20 via-surface-container-lowest/80 to-surface-container-lowest z-10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,173,232,0.15),transparent_70%)] z-20"></div>
        
        {/* Floating Glow Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full z-10"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-container/10 blur-[150px] rounded-full z-10"
        />
      </div>
      
      <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-5xl space-y-10"
        >
          <span className="inline-block px-5 py-2 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container font-display text-xs tracking-[0.2em] uppercase">
            {t('hero.tag')}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-medium text-white leading-[1.05] tracking-tighter lowercase-all">
            <Trans i18nKey="hero.title" components={{ highlight: <span className="text-primary-container drop-shadow-[0_0_20px_rgba(0,173,232,0.6)]" /> }} />
            <BlueDot />
          </h1>
          <p className="text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed font-light">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-wrap items-center gap-8 pt-4">
            <Link
              to="/solucoes"
              className="bg-linear-to-r from-primary-container to-primary text-on-primary px-10 py-4 rounded-full font-display font-semibold text-sm shadow-xl shadow-primary-container/20 hover:scale-105 transition-transform"
            >
              {t('hero.explore')}
            </Link>
            <Link
              to="/sobre"
              className="flex items-center gap-2 text-white font-display font-medium text-sm hover:text-primary transition-colors group"
            >
              {t('hero.know_ness')}<BlueDot />
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
