import BlueDot from '../components/BlueDot';
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutGrid } from "lucide-react";
import EmptyState from '../components/EmptyState';
import { usePageTitle } from '../hooks/usePageTitle';
import { CANAL_BASE } from '../config/api';
interface Case {
  slug?: string;
  project?: string;
  client: string;
  category: string;
  result: string;
  desc: string;
  stats: string;
  image: string;
}

const Portfolio = () => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState("todos");
  const [cases, setCases] = useState<Case[]>([]);
  usePageTitle('portfolio.meta_title', 'portfólio — ness.');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${CANAL_BASE}/api/cases?lang=${i18n.language}`);
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        setCases(data);
      } catch (error) {
        console.error('Canal API unavailable:', error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const filteredCases = filter === "todos" ? cases : cases.filter(c => c.category === filter);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="mb-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
          >
            portfólio de impacto — ness. precision
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight mb-6 lowercase">
            {t('portfolio.title')}<BlueDot />
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant font-light max-w-3xl leading-relaxed">
            {t('portfolio.subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-16">
          {["todos", "segurança", "ia", "infraestrutura"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${
                filter === cat 
                  ? "bg-primary-container text-on-primary shadow-lg shadow-primary-container/20" 
                  : "bg-white/5 text-on-surface-variant hover:bg-white/10"
              }`}
            >
              {cat === "todos" ? t('common.all') : cat}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse border border-white/5 p-8 rounded-[2.5rem] bg-surface-container-low/20 h-96" />
            ))
          ) : filteredCases.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={LayoutGrid}
                title="nenhum case encontrado."
                subtitle="nosso time está preparando novos cases. volte em breve."
              />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredCases.map((item, i) => {
                const slug = item.slug ?? item.project?.toLowerCase().replace(/\s+/g, '-');
                return (
                <Link
                  to={`/portfolio/${slug}`}
                  key={item.project ?? i}
                  className="block"
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group relative glass rounded-[2.5rem] border border-white/10 overflow-hidden nebula-shadow flex flex-col h-full hover:border-primary-container/30 transition-colors"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.project}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest to-transparent" />
                      <div className="absolute top-6 right-6">
                        <div className="px-4 py-2 rounded-full bg-primary-container/20 border border-primary-container/30 backdrop-blur-md">
                          <span className="text-[10px] text-primary-container font-bold uppercase tracking-widest">{item.stats}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="mb-6">
                        <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{item.client}</span>
                        <h3 className="text-2xl text-white font-display font-bold mt-2 lowercase-all">{item.project}<BlueDot /></h3>
                      </div>
                      <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 flex-1">{item.desc}</p>
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">{t('common.result')}</div>
                        <div className="text-xs text-primary-container font-medium">{item.result}</div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* CTA - Trust & Authority (UI/UX Pro Max) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 rounded-[3rem] overflow-hidden relative bg-surface-container-low p-12 md:p-24 border border-white/5 nebula-shadow"
        >
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-primary-container/10 opacity-50 backdrop-blur-md"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-display font-medium text-white tracking-tight leading-snug mb-4 lowercase">
                {t('portfolio.cta_title')}<BlueDot />
              </h2>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-light">
                {t('portfolio.cta_desc')}
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full md:w-auto shrink-0 items-center md:items-end">
              <Link 
                to="/contato"
                className="bg-white text-surface px-8 py-4 rounded-full font-display font-semibold uppercase tracking-widest text-xs hover:bg-primary-container hover:text-on-primary hover:scale-105 transition-all shadow-lg shadow-primary-container/20 whitespace-nowrap"
              >
                {t('common.contact_expert')}
              </Link>
              <div className="flex items-center gap-2 opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
                <p className="text-[10px] uppercase tracking-widest font-bold">100% de confidencialidade</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};


export default Portfolio;
