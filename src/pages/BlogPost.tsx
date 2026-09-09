import BlueDot from '../components/BlueDot';
import React from "react";
import { m as motion } from "motion/react";
import { Link, useLoaderData, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calendar, Tag, FileText } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import SchemaOrg from '../components/SchemaOrg';
import { BRAND_DOMAINS, useBrand } from '../config/brand';
import { buscarInsight, type D1 } from '../../workers/content';
import { idiomaDaRota } from '../utils/lang';
import { routeMeta } from '../utils/meta';

interface Insight {
  title: string;
  tag?: string;
  date?: string;
  desc?: string;
  body?: string;    // field from Canal CMS
  content?: string; // legacy alias
}

/**
 * O post vem do D1 no servidor, antes de renderizar: o HTML que sai da edge
 * já contém o corpo do artigo. Antes ele era buscado por fetch depois da
 * hidratação, então quem não executa JavaScript via uma página vazia.
 */
export async function loader({ request, params, context }: LoaderArgs) {
  const lang = idiomaDaRota(new URL(request.url).pathname);
  const post = await buscarInsight(context.cloudflare.env.DB, params.slug ?? '', lang);
  if (!post || !post.title) {
    throw new Response('Not Found', { status: 404 });
  }
  return { post: post as unknown as Insight };
}

type LoaderArgs = {
  request: Request;
  params: { slug?: string };
  context: { cloudflare: { env: { DB: D1 } } };
};

export function meta(args: Parameters<typeof routeMeta>[0] & { data?: { post: Insight } }) {
  const post = args.data?.post;
  if (!post) return routeMeta(args, { title: 'insight', noindex: true });
  return routeMeta(args, {
    title: post.title,
    description: post.desc,
    type: 'article',
  });
}

const BlogPost = () => {
  const { t } = useTranslation();
  const { post } = useLoaderData() as { post: Insight };
  const { pathname } = useLocation();
  // O JSON-LD precisa da URL canônica; `window` não existe no servidor.
  const canonical = BRAND_DOMAINS[useBrand()] + pathname;

  return (
    <>
      <SchemaOrg 
        type="article" 
        data={{ 
          title: post.title, 
          description: post.desc || '', 
          datePublished: post.date || new Date().toISOString(), 
          url: canonical 
        }} 
      />
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      <div className="max-w-3xl mx-auto relative z-20">
        {/* Back */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs uppercase tracking-widest font-bold mb-12"
        >
          <ArrowLeft size={14} /> {t('blog.back', 'blog')}
        </Link>

        {/* Meta */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6 mb-12">
          <div className="flex items-center gap-4 flex-wrap">
            {post.tag && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-[11px] uppercase tracking-widest font-bold">
                <Tag size={10} /> {post.tag}
              </span>
            )}
            {post.date && (
              <span className="flex items-center gap-1 text-on-surface-variant/60 text-xs font-mono">
                <Calendar size={12} /> {post.date}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight lowercase-all">
            {post.title}<BlueDot />
          </h1>
          {post.desc && (
            <p className="text-base text-on-surface-variant font-light leading-relaxed">{post.desc}</p>
          )}
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-white/5 mb-12" />

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-sm max-w-none"
        >
          {(() => {
            const rawBody = post.body ?? post.content ?? '';
            if (!rawBody) return (
              <div className="flex flex-col items-center py-16 text-center">
                <FileText size={40} className="text-on-surface-variant/70 mb-4" />
                <p className="text-on-surface-variant/60 text-sm">{t('blog.comingSoon', 'conteúdo em breve.')}</p>
              </div>
            );
            return (
              <div className="text-on-surface-variant text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{rawBody}</ReactMarkdown>
              </div>
            );
          })()}
        </motion.div>

        {/* CTA */}
        <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest font-bold"
          >
            <ArrowLeft size={12} /> {t('blog.all_insights', 'todos os insights')}
          </Link>
          <Link
            to="/contato"
            className="px-6 py-2 rounded-full bg-primary-container text-on-primary text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
          >
            {t('blog.talk_expert', 'falar com especialista')}
          </Link>
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default BlogPost;
