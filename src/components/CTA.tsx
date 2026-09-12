import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { BOTAO } from "./Abertura";
import ComMarcas from "./ComMarcas";
import { sequencia } from "../utils/movimento";

/**
 * O fecho da home no mesmo tom das outras telas: linha de 1 px, título a 20 px
 * e a ação contida — no lugar do bloco de cantos de 48 px com gradiente.
 */
const CTA = () => {
  const { t } = useTranslation();
  return (
    /* O único lugar em que a luz chega, não responde: o brilho da abertura
       desabrocha atrás do texto quando o fecho entra na tela (PLAN-movimento 4.7). */
    <section className="luz-chega relative isolate bg-surface px-8 pb-24">
      {/* O fecho entra na mesma grade (C1): o texto nas quatro primeiras
          colunas, a ação nas oito seguintes. A seção é curta, então o fixo
          nunca chega a viajar — é a grade que importa aqui, não o sticky. */}
      <div className="filete mx-auto secao-grade max-w-7xl gap-y-4 border-t border-white/10 pt-16">
        <div className="cabecalho-fixo grid justify-items-start gap-4">
          <h2 className="revela font-display text-secao-alt font-medium lowercase tracking-tight text-white" style={sequencia(0)}>{t('cta.title')}</h2>
          <p className="revela max-w-[60ch] text-resumo leading-relaxed text-on-surface-variant" style={sequencia(1)}>
            <ComMarcas>{t('cta.subtitle')}</ComMarcas>
          </p>
        </div>
        <div className="conteudo-grade revela flex flex-wrap items-center gap-x-5 gap-y-2 lg:items-start" style={sequencia(2)}>
          <Link to="/contato" viewTransition className={BOTAO}>{t('cta.button')}</Link>
          <span className="text-[12.5px] text-on-surface-variant">{t('cta.support')}</span>
        </div>
      </div>
    </section>
  );
};


export default CTA;
