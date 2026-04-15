import BlueDot from '../components/BlueDot';
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { usePageTitle } from '../hooks/usePageTitle';

const CANAL_BASE = "https://canal.ness.workers.dev";

const PortfolioCase = () => {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  usePageTitle('', item?.project ?? 'case');

  useEffect(() => {
    if (!slug) return;
    const fetchCase = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${CANAL_BASE}/api/cases/${slug}?lang=${i18n.language}`);
        if (!res.ok) { navigate('/portfolio', { replace: true }); return; }
        const data = await res.json();
        setItem(data);
      } catch {
        navigate('/portfolio', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
    window.scrollTo(0, 0);
  }, [slug, i18n.language, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-container border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!item) return null;

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
          <ArrowLeft size={14} /> portfolio
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
              className="w-full h-full object-cover opacity-70"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}

        {/* Meta */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-3 mb-4">
            {item.client && (
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{item.client}</span>
            )}
            {item.stats && (
              <span className="px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-[10px] font-bold uppercase tracking-widest">
                {item.stats}
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
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold mb-2">resultado</div>
            <div className="text-white text-lg font-display font-semibold">{item.result}</div>
          </motion.div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 border border-white/10 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-white transition-colors"
          >
            <ArrowLeft size={12} /> todos os cases
          </Link>
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
          >
            falar com especialista <ExternalLink size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PortfolioCase;
