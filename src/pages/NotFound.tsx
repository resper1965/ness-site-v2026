import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import BlueDot from "../components/BlueDot";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-8 bg-surface-container-lowest"
    >
      <div className="text-center max-w-lg">
        <p className="text-primary-container font-mono text-[10px] uppercase tracking-[0.3em] mb-6">
          404
        </p>
        <h1 className="text-5xl font-display font-medium text-white tracking-tight lowercase mb-4">
          {t('notfound.title', 'página não encontrada')}<BlueDot />
        </h1>
        <p className="text-base text-on-surface-variant font-light leading-relaxed mb-10">
          {t('notfound.desc', 'a rota que você buscou não existe ou foi removida.')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary-container text-on-primary font-display font-semibold text-sm uppercase tracking-widest hover:brightness-110 transition-all"
        >
          {t('notfound.cta', 'voltar ao início')}
        </Link>
      </div>
    </motion.div>
  );
};

export default NotFound;
