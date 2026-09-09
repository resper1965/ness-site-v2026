import BlueDot from '../components/BlueDot';
import React from "react";
import { m as motion } from "motion/react";
import { Link, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { buscarCase, type D1 } from '../../workers/content';
import { idiomaDaRota } from '../utils/lang';
import { routeMeta } from '../utils/meta';

interface Case {
  project: string;
  client?: string;
  stats?: string;
  desc?: string;
  image?: string;
  result?: string;
}

type LoaderArgs = {
  request: Request;
  params: { slug?: string };
  context: { cloudflare: { env: { DB: D1 } } };
};

/** O case vem do D1 no servidor; slug inexistente é 404, não redirect. */
export async function loader({ request, params, context }: LoaderArgs) {
  const lang = idiomaDaRota(new URL(request.url).pathname);
  const item = await buscarCase(context.cloudflare.env.DB, params.slug ?? '', lang);
  if (!item || !item.project) {
    throw new Response('Not Found', { status: 404 });
  }
  return { item: item as unknown as Case };
}

export function meta(args: Parameters<typeof routeMeta>[0] & { data?: { item: Case } }) {
  const item = args.data?.item;
  if (!item) return routeMeta(args, { title: 'case', noindex: true });
  return routeMeta(args, {
    title: item.project,
    description: item.desc || item.result,
    image: item.image,
    type: 'article',
  });
}

const PortfolioCase = () => {
  const { t } = useTranslation();
  const { item } = useLoaderData() as { item: Case };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      <div className="max-w-5xl mx-auto relative z-20">
        {/* Back */}
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors text-xs uppercase tracking-widest font-bold mb-12"
        >
          <ArrowLeft size={14} /> {t('portfolio.case.back', 'portfolio')}
        </Link>

        {/* Hero image */}
        {item.image && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full aspect-video rounded-4xl overflow-hidden mb-12 border border-white/10"
          >
            <img
              src={item.image}
              alt={item.project}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover opacity-70"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}

        {/* Meta */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-3 mb-4">
            {item.client && (
              <span className="text-[11px] uppercase tracking-widest text-primary font-bold">{item.client}</span>
            )}
            {item.stats && (
              <span className="px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-[11px] font-bold uppercase tracking-widest">
                {(() => {
                  try {
                    if (item.stats.startsWith('{')) {
                      const obj = JSON.parse(item.stats);
                      const key = Object.keys(obj)[0];
                      if (key) return `${key.replace(/_/g, ' ')}: ${obj[key]}`;
                    }
                    return item.stats;
                  } catch {
                    return item.stats;
                  }
                })()}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white lowercase-all mb-6">
            {item.project}<BlueDot />
          </h1>
          <p className="text-base text-on-surface-variant font-light leading-relaxed mb-12">{item.desc}</p>
        </motion.div>

        {/* Result block */}
        {item.result && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-4xl bg-surface-container-low border border-white/5 mb-12"
          >
            <div className="text-[11px] uppercase tracking-widest text-on-surface-variant/60 font-bold mb-2">{t('portfolio.result')}</div>
            <div className="text-white text-lg font-display font-semibold">{item.result}</div>
          </motion.div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 border border-white/10 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
          >
            <ArrowLeft size={12} /> {t('portfolio.case.all', 'todos os cases')}
          </Link>
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
          >
            {t('portfolio.case.talk', 'falar com especialista')} <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCase;
