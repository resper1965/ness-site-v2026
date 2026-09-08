import React from "react";
import { Link } from "react-router-dom";
import { m as motion } from "motion/react";
import { useTranslation } from "react-i18next";
import BlueDot from "../components/BlueDot";
import { ArrowRight, Home, MessageSquare } from "lucide-react";
import { usePageMeta } from "../hooks/usePageTitle";

const NotFound = () => {
  const { t } = useTranslation();
  usePageMeta({ title: t('notfound.title', 'página não encontrada'), noindex: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center px-8 bg-surface-container-lowest"
    >
      <div className="text-center max-w-lg">
        <motion.p
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-[120px] font-display font-bold text-primary-container/10 leading-none mb-2"
        >
          404
        </motion.p>
        <h1 className="text-4xl md:text-5xl font-display font-medium text-white tracking-tight lowercase mb-4">
          {t('notfound.title', 'página não encontrada')}<BlueDot />
        </h1>
        <p className="text-base text-on-surface-variant font-light leading-relaxed mb-10">
          {t('notfound.desc', 'a rota que você buscou não existe ou foi removida.')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary-container text-on-primary font-display font-semibold text-sm uppercase tracking-widest hover:brightness-110 transition-all"
          >
            <Home size={16} />
            {t('notfound.cta', 'voltar ao início')}
          </Link>
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 text-white font-display font-semibold text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
          >
            <MessageSquare size={16} />
            {t('nav.contact', 'contato')}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NotFound;
