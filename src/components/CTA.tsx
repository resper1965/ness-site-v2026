import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BOTAO } from "./Abertura";
import BlueDot from "./BlueDot";
import ComMarcas from "./ComMarcas";
import { sequencia } from "../utils/movimento";

/**
 * O fecho da home com peso (docs/ESTUDO-desktop-wow.md, C4): a grade inteira,
 * o título a 32 px à esquerda com o ponto azul, a ação à direita, e o ar que a
 * luz precisa para ser vista. No celular, empilha como sempre.
 *
 * É o único lugar em que a luz chega, não responde: o brilho da abertura
 * desabrocha atrás do texto quando o fecho entra na tela (PLAN-movimento 4.7).
 * O site começa com a luz e termina com ela.
 */
const CTA = () => {
  const { t } = useTranslation();
  return (
    <section className="luz-chega relative isolate bg-surface px-8 pb-32 pt-8">
      <div className="filete mx-auto grid max-w-7xl gap-x-8 gap-y-8 border-t border-white/10 pt-20 lg:grid-cols-12 lg:items-center">
        <div className="grid justify-items-start gap-4 lg:col-span-7">
          <h2 className="revela font-display text-secao font-medium lowercase tracking-tight text-white" style={sequencia(0)}>
            {t('cta.title')}<BlueDot />
          </h2>
          <p className="revela max-w-[52ch] text-resumo leading-relaxed text-on-surface-variant" style={sequencia(1)}>
            <ComMarcas>{t('cta.subtitle')}</ComMarcas>
          </p>
        </div>
        <div className="revela flex flex-wrap items-center gap-x-5 gap-y-2 lg:col-span-5 lg:justify-end" style={sequencia(2)}>
          <Link to="/contato" viewTransition className={BOTAO}>{t('cta.button')}</Link>
          <span className="text-[12.5px] text-on-surface-variant">{t('cta.support')}</span>
        </div>
      </div>
    </section>
  );
};


export default CTA;
