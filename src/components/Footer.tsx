import BlueDot from '../components/BlueDot';
import React, {  } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Send,
  Linkedin,
  Instagram,
  Facebook,
  Lock
} from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';
import { CANAL_BASE } from '../config/api';



const BRAND = import.meta.env.VITE_BRAND || 'ness';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-surface py-16 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs space-y-6">
          <div className="text-xl text-white font-display lowercase-all">
            {BRAND === 'trustness' ? (
              <>trustness<BlueDot /></>
            ) : BRAND === 'forense' ? (
              <>forense<BlueDot />io</>
            ) : (
              <>ness<BlueDot /></>
            )}
          </div>
          <p className="text-sm text-on-surface-variant/60 leading-relaxed font-light">
            {t('hero.subtitle')}
          </p>
          <div className="flex gap-4">
            {[
              { Icon: Linkedin, url: "https://www.linkedin.com/company/ness-tecnologia/" },
              { Icon: Instagram, url: "https://www.instagram.com/ness.tecnologia/" },
              { Icon: Facebook, url: "https://www.facebook.com/nesstecnologia" }
            ].map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="text-on-surface-variant/50 hover:text-primary transition-all">
                <social.Icon size={20} />
              </a>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-24">
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-white font-bold">{t('footer.company')}</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant/60 font-light">
              <li><Link className="hover:text-white transition-all" to="/sobre">{t('nav.about')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/portfolio">{t('nav.portfolio')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/blog">{t('nav.blog')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/carreiras">{t('nav.careers')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/contato">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-white font-bold">{t('footer.legal')}</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant/60 font-light">
              <li><Link className="hover:text-white transition-all" to="/compliance/termos">{t('footer.terms')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/compliance/privacidade">{t('footer.privacy')}</Link></li>
              <li><Link className="hover:text-white transition-all" to="/compliance/etica">{t('footer.compliance')}</Link></li>
              <li><Link className="hover:text-white transition-all text-primary-container font-medium" to="/compliance/etica">{t('contact.whistleblower.title')}</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-white font-bold">{t('footer.ecosystem')}</h4>
            <ul className="space-y-3 text-sm text-on-surface-variant/60 font-light">
              {BRAND !== 'ness' && <li><a href="https://ness.com.br" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all">ness.</a></li>}
              {BRAND !== 'trustness' && <li><a href="/trustness" className="hover:text-white transition-all">trustness.</a></li>}
              {BRAND !== 'forense' && <li><a href="/forense" className="hover:text-white transition-all">forense.io</a></li>}
            </ul>
          </div>
          <div className="hidden lg:block space-y-4">
            <h4 className="text-[10px] uppercase tracking-widest text-white font-bold">{t('footer.updates')}</h4>
            <p className="text-sm text-on-surface-variant/60 font-light">{t('footer.newsletter')}</p>
            <div className="flex gap-2">
              <input 
                type="email"
                name="email"
                placeholder={t('footer.email_placeholder')}
                className="bg-surface-container-low border border-white/10 rounded-full px-4 py-2 text-xs w-full focus:outline-none focus:ring-1 focus:ring-primary text-white"
               aria-label="Input field" />
              <button
                aria-label={t('a11y.subscribe')}
                className="bg-primary-container text-on-primary rounded-full p-2 flex items-center justify-center hover:brightness-110 transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5">
        <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest text-on-surface-variant/40 font-bold">
          {(t('footer.locations', { returnObjects: true }) as string[]).map((loc, i, arr) => (
            <span key={loc}>
              {loc}
              {i < arr.length - 1 && <span className="text-primary-container ml-4">/</span>}
            </span>
          ))}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-on-surface-variant/40 font-light">
          © {FOUNDATION_YEAR}–{CURRENT_YEAR} {BRAND === 'trustness' ? 'trustness.' : BRAND === 'forense' ? 'forense.io' : 'ness.'} precision digital engineering. {t('footer.rights')}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-tighter text-on-surface-variant/40 font-bold">{t('footer.status')}</span>
          </div>
          <a
            href={CANAL_BASE}
            target="_blank"
            rel="noopener noreferrer"
            title="canal"
            className="text-on-surface-variant/20 hover:text-on-surface-variant/60 transition-all duration-300"
          >
            <Lock size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
