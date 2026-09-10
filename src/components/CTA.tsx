import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BOTAO } from "./Abertura";
import ComMarcas from "./ComMarcas";

/**
 * O fecho da home no mesmo tom das outras telas: linha de 1 px, título a 20 px
 * e a ação contida — no lugar do bloco de cantos de 48 px com gradiente.
 */
const CTA = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-surface px-8 pb-24">
      <div className="mx-auto grid max-w-7xl justify-items-start gap-4 border-t border-white/10 pt-16">
        <h2 className="font-display text-xl font-medium lowercase tracking-tight text-white">{t('cta.title')}</h2>
        <p className="max-w-[60ch] text-[15px] leading-relaxed text-on-surface-variant">
          <ComMarcas>{t('cta.subtitle')}</ComMarcas>
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link to="/contato" className={BOTAO}>{t('cta.button')}</Link>
          <span className="text-[12.5px] text-on-surface-variant">{t('cta.support')}</span>
        </div>
      </div>
    </section>
  );
};


export default CTA;
