import BlueDot from '../components/BlueDot';
import React, { useState, useEffect } from "react";
import { m as motion } from "motion/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CANAL_BASE } from '../config/api';
import { ShieldCheck, Cloud, Cpu, Brain, Lock, Workflow, FileText, ChevronRight } from "lucide-react";


interface Insight {
  id?: string;
  slug?: string;
  tag: string;
  date: string;
  title: string;
  desc: string;
  icon: string;
}

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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck": return ShieldCheck;
      case "Cloud": return Cloud;
      case "Lock": return Lock;
      case "Cpu": return Cpu;
      case "Brain": return Brain;
      case "Workflow": return Workflow;
      default: return FileText;
    }
  };

  // Sem post, a seção inteira sai da home: um título "blog." com um vazio de
  // 300 px embaixo é pior do que não ter a seção.
  if (!loading && articles.length === 0) return null;

  return (
    <section id="insights" className="py-24 bg-surface px-8 border-t border-white/5 relative overflow-hidden">
      {/* Immersive Background for Insights */}
      <div className="absolute inset-0 z-0 bg-nebula" aria-hidden="true">
        <div className="absolute inset-0 bg-linear-to-b from-surface/40 via-surface/90 to-surface z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-4xl font-display font-semibold tracking-tighter text-white lowercase-all">
            {t('nav.blog')}<BlueDot />
          </h2>
          <Link className="text-primary-container flex items-center gap-2 hover:gap-4 transition-all font-medium" to="/blog">
            {t('common.view_all')} <ChevronRight size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse border border-white/5 p-8 rounded-3xl bg-surface-container-low/20 h-64" />
            ))
          ) : (
            articles.map((art, i) => {
              const Icon = getIcon(art.icon);
              const slug = art.slug ?? String(i);
              return (
                <motion.article
                  key={art.id ?? i}
                  whileHover={{ y: -10 }}
                  className="group cursor-pointer border border-white/5 p-8 rounded-3xl hover:bg-surface-container-low/50 transition-all"
                >
                  <Link to={`/blog/${slug}`} className="block">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-6">
                      <Icon className="text-primary-container" size={24} />
                    </div>
                    <span className="text-primary-container text-[11px] uppercase tracking-widest font-medium">{art.tag}</span>
                    <h3 className="text-xl mt-2 mb-4 text-white group-hover:text-primary transition-colors lowercase-all">
                      {art.title}
                    </h3>
                    <p className="text-on-surface-variant text-sm font-normal line-clamp-2">
                      {art.desc}
                    </p>
                  </Link>
                </motion.article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};


export default Insights;
