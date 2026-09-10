import BlueDot from '../components/BlueDot';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CANAL_BASE } from '../config/api';
import { LINK } from '../components/Abertura';


interface Insight {
  id?: string;
  slug?: string;
  tag: string;
  date: string;
  title: string;
  desc: string;
  icon: string;
}

/**
 * Os três posts mais recentes, como lista e não como cards: linha de 1 px,
 * título a 15 px, sem ícone e sem o salto de 10 px ao passar o mouse — o
 * desenho delicado das outras telas.
 */
const Insights = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${CANAL_BASE}/api/insights?lang=${i18n.language}`);
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        // Show only the 3 most recent
        setArticles(data.slice(0, 3));
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [i18n.language]);

  // Sem post, a seção inteira sai da home: um título "blog." com um vazio de
  // 300 px embaixo é pior do que não ter a seção.
  if (!loading && articles.length === 0) return null;

  return (
    <section id="insights" className="bg-surface px-8 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex items-baseline justify-between gap-6">
          <h2 className="font-display text-xl font-medium lowercase tracking-tight text-white">
            {t('nav.blog')}<BlueDot />
          </h2>
          <Link to="/blog" className={LINK}>{t('common.view_all')}</Link>
        </div>

        <div className="grid gap-x-10 md:grid-cols-3">
          {loading
            ? [1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse border-t border-white/10" />)
            : articles.map((art, i) => (
                <article key={art.id ?? i} className="border-t border-white/10 py-5">
                  <Link to={`/blog/${art.slug ?? String(i)}`} className="group block">
                    <span className="text-[12.5px] text-primary-container">{art.tag}</span>
                    <h3 className="mt-1.5 font-display text-[15px] font-medium leading-snug text-white transition-colors group-hover:text-primary lowercase-all">
                      {art.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[13.5px] leading-relaxed text-on-surface-variant">{art.desc}</p>
                  </Link>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
};


export default Insights;
