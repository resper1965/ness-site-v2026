import BlueDot from '../components/BlueDot';
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Send, Linkedin, Instagram, Facebook, Lock } from "lucide-react";

import { FOUNDATION_YEAR, anoAtual } from '../constants/brand';
import { CANAL_BASE } from '../config/api';
import { useBrand, BRAND_LABELS, BRAND_DOMAINS } from '../config/brand';
import Turnstile from './Turnstile';

const ECOSYSTEM_LINKS = [
  { brand: 'ness',      label: 'ness.',       href: BRAND_DOMAINS.ness },
  { brand: 'trustness', label: 'trustness.',  href: BRAND_DOMAINS.trustness },
  { brand: 'forense',   label: 'forense.io',  href: BRAND_DOMAINS.forense },
] as const;

const Footer = () => {
  const BRAND = useBrand();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || newsletterStatus === 'sending') return;
    setNewsletterStatus('sending');
    const campos = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const res = await fetch(`${CANAL_BASE}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          website: campos.get('website'),
          turnstileToken: campos.get('cf-turnstile-response'),
        }),
      });
      setNewsletterStatus(res.ok ? 'ok' : 'error');
    } catch {
      setNewsletterStatus('error');
    }
  };

  const brandLabel = BRAND_LABELS[BRAND];

  return (
    <footer className="bg-surface px-8 pt-16 pb-28 md:pb-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 min-w-0">
        <div className="max-w-xs space-y-6 min-w-0">
          <div className="marca text-xl text-white">
            {BRAND === 'trustness' ? <>trustness<BlueDot /></> :
             BRAND === 'forense'   ? <>forense<BlueDot />io</> :
                                     <>ness<BlueDot /></>}
          </div>
          <p className="text-sm text-on-surface-variant/85 leading-relaxed font-normal">
            {t('hero.subtitle')}
          </p>
          {/* Alvo de toque de 44 px: a margem negativa mantém o alinhamento
              visual com o texto acima, sem encolher a área clicável. */}
          <div className="flex gap-1 -ml-3">
            {[
              { Icon: Linkedin, url: "https://www.linkedin.com/company/nesstec", label: "LinkedIn" },
              { Icon: Instagram, url: "https://www.instagram.com/ness.tecnologia/", label: "Instagram" },
              { Icon: Facebook,  url: "https://www.facebook.com/nesstecnologia", label: "Facebook" },
            ].map((social) => (
              <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant/80 transition-colors hover:bg-white/5 hover:text-primary">
                <social.Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-[11px] uppercase tracking-widest text-white font-bold">{t('footer.company')}</h2>
            <ul className="space-y-1 text-sm text-on-surface-variant/85 font-normal">
              <li><Link className="inline-block py-1 hover:text-white transition-colors" to="/sobre">{t('nav.about')}</Link></li>
              <li><Link className="inline-block py-1 hover:text-white transition-colors" to="/portfolio">{t('nav.portfolio')}</Link></li>
              <li><Link className="inline-block py-1 hover:text-white transition-colors" to="/blog">{t('nav.blog')}</Link></li>
              <li><Link className="inline-block py-1 hover:text-white transition-colors" to="/carreiras">{t('nav.careers')}</Link></li>
              <li><Link className="inline-block py-1 hover:text-white transition-colors" to="/contato">{t('nav.contact')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-[11px] uppercase tracking-widest text-white font-bold">{t('footer.legal')}</h2>
            <ul className="space-y-1 text-sm text-on-surface-variant/85 font-normal">
              <li><Link className="inline-block py-1 hover:text-white transition-colors" to="/compliance/termos">{t('footer.terms')}</Link></li>
              <li><Link className="inline-block py-1 hover:text-white transition-colors" to="/compliance/privacidade">{t('footer.privacy')}</Link></li>
              <li><Link className="inline-block py-1 hover:text-white transition-colors" to="/compliance/etica">{t('footer.compliance')}</Link></li>
              <li><Link className="inline-block py-1 text-primary-container font-semibold transition-colors hover:text-white" to="/compliance/etica">{t('contact.whistleblower.title')}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-[11px] uppercase tracking-widest text-white font-bold">{t('footer.ecosystem')}</h2>
            <ul className="space-y-1 text-sm text-on-surface-variant/85 font-normal">
              {ECOSYSTEM_LINKS
                .filter(l => l.brand !== BRAND)
                .map(l => (
                  <li key={l.brand}>
                    <a href={l.href} className="inline-block py-1 hover:text-white transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          <div className="space-y-4 col-span-2 lg:col-span-1">
            <h2 className="text-[11px] uppercase tracking-widest text-white font-bold">{t('footer.updates')}</h2>
            <p className="text-sm text-on-surface-variant/85 font-normal">{t('footer.newsletter')}</p>
            {newsletterStatus === 'ok' ? (
              <p className="text-xs text-primary-container font-bold uppercase tracking-widest">✓ inscrito.</p>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
                {/* Armadilha: fora da tela e fora do teclado. */}
                <div aria-hidden="true" className="absolute w-px h-px overflow-hidden -left-[9999px]">
                  <label htmlFor="newsletter-website">não preencha</label>
                  <input id="newsletter-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder={t('footer.email_placeholder')}
                  aria-label={t('footer.email_placeholder')}
                  className="bg-surface-container-low border border-white/10 rounded-full px-4 py-2 text-xs w-full focus:outline-none focus-visible:ring-2 focus:ring-primary text-white"
                />
                <button
                  type="submit"
                  disabled={newsletterStatus === 'sending'}
                  aria-label={t('a11y.subscribe')}
                  className="bg-primary-container text-on-primary rounded-full p-2 flex items-center justify-center hover:brightness-110 transition-all disabled:opacity-50"
                >
                  <Send size={14} />
                </button>
                </div>

                <Turnstile action="newsletter" tamanho="compact" />
              </form>
            )}
            {newsletterStatus === 'error' && (
              <p className="text-xs text-red-400">erro ao inscrever. tente novamente.</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5">
        <div className="flex flex-wrap gap-4 text-[11px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">
          {(t('footer.locations', { returnObjects: true }) as string[]).map((loc, i, arr) => (
            <span key={loc}>
              {loc}
              {i < arr.length - 1 && <span className="text-primary-container ml-4">/</span>}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-on-surface-variant/70 font-normal">
          © {FOUNDATION_YEAR}–{anoAtual()} {brandLabel} precision digital engineering. {t('footer.rights')}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-container" />
            <span className="text-[11px] uppercase tracking-tighter text-on-surface-variant/70 font-semibold">{t('footer.status')}</span>
          </div>
          <a
            href="https://canal.ness.com.br"
            target="_blank"
            rel="noopener noreferrer"
            title="canal (acesso restrito)"
            aria-label="Canal CMS — acesso restrito"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant/70 transition-colors hover:bg-white/5 hover:text-on-surface-variant focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <Lock size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
