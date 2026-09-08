import BlueDot from '../components/BlueDot';
import React, { useEffect, useMemo, useState } from "react";
import { m as motion, AnimatePresence } from "motion/react";
import { Link, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { LayoutGrid } from "lucide-react";
import EmptyState from '../components/EmptyState';
import { routeMeta, traduzir } from '../utils/meta';
import { CANAL_BASE } from '../config/api';
import { listarCases, type D1 } from '../../workers/content';
import { idiomaDaRota } from '../utils/lang';
import type { Case } from '../types/canal';

/** Os cases saem do D1 no servidor; o HTML já chega com eles. */
export async function loader({ request, context }: { request: Request; context: { cloudflare: { env: { DB: D1 } } } }) {
  const lang = idiomaDaRota(new URL(request.url).pathname);
  try {
    return { cases: (await listarCases(context.cloudflare.env.DB, lang)) as unknown as Case[] };
  } catch {
    return { cases: [] as Case[] };
  }
}

const Portfolio = () => {
  const { t, i18n } = useTranslation();
  const { cases: casesDoCms } = useLoaderData() as { cases: Case[] };
  const [filter, setFilter] = useState("todos");
  const [repos, setRepos] = useState<Case[]>([]);
  const loading = false;

  // Os repositórios do GitHub são complemento, não conteúdo indexável: seguem
  // sendo buscados depois da hidratação, para não segurar o HTML.
  useEffect(() => {
    fetch(`${CANAL_BASE}/api/automation/github/repos`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRepos(data as Case[]))
      .catch(() => { /* complemento é opcional */ });
  }, []);

  const cases = useMemo(() => [...casesDoCms, ...repos], [casesDoCms, repos]);

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
            {t('portfolio.badge', 'portfólio de impacto — ness. precision')}
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
          {["todos", "segurança", "ia", "infraestrutura", "dev"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all ${
                filter === cat 
                  ? "bg-primary-container text-on-primary shadow-lg shadow-primary-container/20" 
                  : "bg-white/5 text-on-surface-variant hover:bg-white/10"
              }`}
            >
              {cat === "todos" ? t('common.all') : (cat === "dev" ? "Open Source" : t(`portfolio.categories.${cat}`, cat))}
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
                title={t('portfolio.empty.title', 'nenhum case encontrado.')}
                subtitle={t('portfolio.empty.subtitle', 'nosso time está preparando novos cases. volte em breve.')}
              />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredCases.map((item, i) => {
                const slug = item.slug ?? item.project?.toLowerCase().replace(/\s+/g, '-');
                
                // Parse stats JSON to a readable badge metric
                let highlightStat = '';
                try {
                  if (item.stats && item.stats.startsWith('{')) {
                    const statsObj = JSON.parse(item.stats);
                    const keys = Object.keys(statsObj);
                    if (keys.length > 0) {
                      const keyName = keys[0].replace(/_/g, ' ');
                      highlightStat = `${keyName}: ${statsObj[keys[0]]}`;
                    }
                  } else {
                    highlightStat = item.stats || '';
                  }
                } catch {
                  highlightStat = item.stats || '';
                }

                // Placeholder image if empty
                const imageUrl = item.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.client)}&background=random&color=fff&size=512`;

                return (
                  item.url ? (
                    <a
                      href={item.url as string}
                      target="_blank"
                      rel="noopener noreferrer"
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
                        <div className="aspect-video bg-surface-container-low overflow-hidden relative flex items-center justify-center">
                          <svg className="w-16 h-16 text-white/10 group-hover:scale-110 transition-transform duration-700" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                          {highlightStat && (
                            <div className="absolute top-6 right-6">
                              <div className="px-4 py-2 rounded-full bg-primary-container/20 border border-primary-container/30 backdrop-blur-md flex items-center justify-center gap-2 text-[11px] text-primary-container font-bold uppercase tracking-widest">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m12 2-2 6H4l4 4-2 6 6-4 6 4-2-6 4-4h-6z"/></svg> 
                                {highlightStat.split(':')[1]?.trim() || highlightStat}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                          <div className="mb-6">
                            <span className="text-[11px] uppercase tracking-widest text-primary font-bold">{item.client}</span>
                            <h3 className="text-2xl text-white font-display font-bold mt-2 lowercase">{item.project}<BlueDot /></h3>
                          </div>
                          <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 flex-1">{item.desc}</p>
                          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="text-[11px] uppercase tracking-widest text-on-surface-variant/60 font-bold">Licença</div>
                            <div className="text-xs text-primary-container font-medium uppercase font-mono tracking-widest">{item.result}</div>
                          </div>
                        </div>
                      </motion.div>
                    </a>
                  ) : (
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
                            src={imageUrl}
                            alt={item.project}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-surface-container-lowest to-transparent" />
                          {highlightStat && (
                            <div className="absolute top-6 right-6">
                              <div className="px-4 py-2 rounded-full bg-primary-container/20 border border-primary-container/30 backdrop-blur-md">
                                <span className="text-[11px] text-primary-container font-bold uppercase tracking-widest">{highlightStat}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                          <div className="mb-6">
                            <span className="text-[11px] uppercase tracking-widest text-primary font-bold">{item.client}</span>
                            <h3 className="text-2xl text-white font-display font-bold mt-2 lowercase-all">{item.project}<BlueDot /></h3>
                          </div>
                          <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 flex-1">{item.desc}</p>
                          <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="text-[11px] uppercase tracking-widest text-on-surface-variant/60 font-bold">{t('common.result')}</div>
                            <div className="text-xs text-primary-container font-medium">{item.result}</div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  )
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
                <p className="text-[11px] uppercase tracking-widest font-bold">{t('portfolio.confidentiality', '100% de confidencialidade')}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};


export default Portfolio;


export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => {
    const t = traduzir(lang);
    return {
    title: t('nav.portfolio', 'portfólio'),
    description: {
      pt: 'Casos de infraestrutura crítica, segurança, engenharia de software e privacidade entregues pela ness.',
      en: 'Critical infrastructure, security, software engineering and privacy cases delivered by ness.',
      es: 'Casos de infraestructura crítica, seguridad, ingeniería de software y privacidad entregados por ness.',
    }[lang],
  };
  });
}
