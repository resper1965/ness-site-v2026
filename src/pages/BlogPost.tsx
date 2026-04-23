import BlueDot from '../components/BlueDot';
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calendar, Tag, FileText } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { usePageTitle } from '../hooks/usePageTitle';

import { CANAL_BASE } from '../config/api';

interface Insight {
  title: string;
  tag?: string;
  date?: string;
  desc?: string;
  body?: string;    // field from Canal CMS
  content?: string; // legacy alias
}

const BlogPost = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [post, setPost] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(true);
  usePageTitle('', post?.title ?? 'insight');

  useEffect(() => {
    if (!slug) return;
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${CANAL_BASE}/api/insights/${slug}?lang=${i18n.language}`);
        if (!res.ok) { navigate('/blog', { replace: true }); return; }
        const data = await res.json();
        setPost(data);
      } catch {
        navigate('/blog', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug, i18n.language, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-container border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return (
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
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-[10px] uppercase tracking-widest font-bold">
                <Tag size={10} /> {post.tag}
              </span>
            )}
            {post.date && (
              <span className="flex items-center gap-1 text-on-surface-variant/40 text-xs font-mono">
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
                <FileText size={40} className="text-on-surface-variant/20 mb-4" />
                <p className="text-on-surface-variant/40 text-sm">{t('blog.comingSoon', 'conteúdo em breve.')}</p>
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
  );
};

export default BlogPost;
