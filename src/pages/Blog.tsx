import BlueDot from '../components/BlueDot';
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { 
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

  ShieldCheck, 
  Cloud, 
  Cpu, 
  Brain, 
  Lock, 
  Workflow, 
  FileText, 
  ArrowUpRight} from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';



const Blog = () => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/insights?lang=${i18n.language}`);
        if (!response.ok) throw new Error("API error");
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Canal API unavailable:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
    window.scrollTo(0, 0);
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      <div className="max-w-7xl mx-auto relative z-20">
        <div className="mb-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
          >
            blog — ness. insights
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight mb-6 lowercase">
            {t('blog.title')}<BlueDot />
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant font-light max-w-3xl leading-relaxed">
            {t('blog.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse border border-white/5 p-8 rounded-3xl bg-surface-container-low/20 h-80"></div>
            ))
          ) : (
            articles.map((art, i) => {
              const Icon = getIcon(art.icon);
              return (
                <motion.article 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer border border-white/5 p-8 rounded-3xl bg-surface-container-low/30 hover:bg-surface-container-low/50 transition-all flex flex-col h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-6">
                    <Icon className="text-primary-container" size={24} />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-primary-container text-[10px] uppercase tracking-widest font-bold">{art.tag}</span>
                    <span className="text-on-surface-variant/40 text-[10px] font-mono">{art.date}</span>
                  </div>
                  <h3 className="text-2xl mb-4 text-white group-hover:text-primary transition-colors lowercase-all leading-tight">
                    {art.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 flex-1">
                    {art.desc}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-primary-container uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    ler artigo completo <ArrowUpRight size={14} />
                  </div>
                </motion.article>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};


export default Blog;
