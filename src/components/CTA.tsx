import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";




const CTA = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 px-8 bg-surface">
      <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden relative bg-surface-container-low p-10 md:p-16 border border-white/5 nebula-shadow">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-primary-container/10 opacity-50"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight leading-snug mb-4 lowercase">
              {t('cta.title')}
            </h2>
            <p className="text-on-surface-variant text-sm leading-relaxed font-light">
              {t('cta.subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            <Link to="/contato" className="bg-primary-container text-on-primary px-8 py-3 rounded-full font-display font-semibold text-sm text-center shadow-lg shadow-primary-container/25 transition-all hover:brightness-110 hover:shadow-[0_0_28px_rgba(0,173,232,0.4)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low">
              {t('cta.button')}
            </Link>
            <p className="text-on-surface-variant/70 text-center text-xs font-light">{t('cta.support')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};


export default CTA;
