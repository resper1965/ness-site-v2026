import BlueDot from '../components/BlueDot';
import React, { useState, useMemo } from "react";
import { Link, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { ShieldCheck, Cloud, Cpu, Brain, Lock, Workflow, FileText, ArrowUpRight } from "lucide-react";
import EmptyState from '../components/EmptyState';
import { routeMeta } from '../utils/meta';
import { listarInsights, type D1 } from '../../workers/content';
import { idiomaDaRota } from '../utils/lang';
import type { Insight } from '../types/canal';

/**
 * A lista sai do D1 no servidor: o HTML já chega com os artigos. Antes vinha
 * por fetch depois da hidratação, e o crawler via a página vazia.
 *
 * Falha do D1 não derruba a página — a lista vem vazia e o EmptyState aparece.
 */
export async function loader({ request, context }: { request: Request; context: { cloudflare: { env: { DB: D1 } } } }) {
  const lang = idiomaDaRota(new URL(request.url).pathname);
  try {
    return { articles: (await listarInsights(context.cloudflare.env.DB, lang)) as unknown as Insight[] };
  } catch {
    return { articles: [] as Insight[] };
  }
}

const Blog = () => {
  const { t, i18n } = useTranslation();
  const { articles } = useLoaderData() as { articles: Insight[] };
  const loading = false;
  const [activeTag, setActiveTag] = useState<string>('all');

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

  const tags = useMemo(() => {
    const unique = Array.from(new Set(articles.map((a) => a.tag).filter(Boolean)));
    return ['all', ...unique];
  }, [articles]);

  const filtered = activeTag === 'all' ? articles : articles.filter((a) => a.tag === activeTag);

  return (
    <div className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen">
      <div className="max-w-7xl mx-auto relative z-20">
        <div className="mb-12">
          <div className="text-primary-container font-mono text-xs lowercase tracking-[0.3em] mb-6">
            {t('blog.badge', 'blog — ness. insights')}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight mb-6 lowercase">
            {t('blog.title')}<BlueDot />
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant font-normal max-w-3xl leading-relaxed">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Tag filter bar */}
        {!loading && tags.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-12">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-5 py-2 rounded-full text-[11px] uppercase tracking-widest font-medium transition-all ${
                  activeTag === tag
                    ? 'bg-primary-container text-on-primary shadow-lg shadow-primary-container/20'
                    : 'bg-white/5 text-on-surface-variant hover:bg-white/10'
                }`}
              >
                {tag === 'all' ? t('common.all') : tag}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse border border-white/5 p-8 rounded-3xl bg-surface-container-low/20 h-80" />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={FileText}
                title={t('blog.empty_title', "nenhum insight encontrado.")}
                subtitle={t('blog.empty_subtitle', "novos conteúdos em breve. fique de olho.")}
              />
            </div>
          ) : (
            filtered.map((art, i) => {
              const Icon = getIcon(art.icon);
              const slug = art.slug ?? String(i);
              return (
                <article key={art.id ?? i} className="group border border-white/5 p-8 rounded-3xl bg-surface-container-low/30 hover:bg-surface-container-low/50 transition-all flex flex-col h-full">
                  <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center mb-6">
                    <Icon className="text-primary-container" size={24} />
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-primary-container text-[11px] uppercase tracking-widest font-medium">{art.tag}</span>
                    <span className="text-on-surface-variant/80 text-[11px] font-mono">{art.date}</span>
                  </div>
                  <h2 className="text-2xl mb-4 text-white group-hover:text-primary transition-colors lowercase-all leading-tight">
                    {art.title}
                  </h2>
                  <p className="text-on-surface-variant text-sm font-normal leading-relaxed mb-8 flex-1">
                    {art.desc}
                  </p>
                  <Link
                    to={`/blog/${slug}`}
                    className="inline-flex min-h-11 items-center gap-2 text-[11px] text-primary-container uppercase tracking-widest font-medium"
                  >
                    {t('blog.read_article', 'ler artigo completo')} <ArrowUpRight size={14} />
                  </Link>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;


export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => {
    return {
    title: { pt: 'insights', en: 'insights', es: 'insights' }[lang],
    description: {
      pt: 'Análises da ness. sobre segurança cibernética, infraestrutura, privacidade e engenharia de software.',
      en: 'ness. analysis on cybersecurity, infrastructure, privacy and software engineering.',
      es: 'Análisis de ness. sobre ciberseguridad, infraestructura, privacidad e ingeniería de software.',
    }[lang],
  };
  });
}
