import BlueDot from '../components/BlueDot';
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePageTitle } from '../hooks/usePageTitle';
import { CANAL_BASE } from '../config/api';
import { BRAND } from '../config/brand';
import { 
Mail,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
  Facebook,
  AlertTriangle} from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';



/** Maps referrer slugs to display labels and subject values */
const REF_MAP: Record<string, { label: string; subject: string }> = {
  devsecops: { label: 'n.devsecops', subject: 'n.secops' },
  secops: { label: 'n.secops', subject: 'n.secops' },
  infraops: { label: 'n.infraops', subject: 'n.infraops' },
  autoops: { label: 'n.autoops', subject: 'n.autoops' },
  aiops: { label: 'n.aiops', subject: 'n.aiops' },
  devarch: { label: 'n.devarch', subject: 'n.secops' },
  dpo: { label: 'DPO as a Service', subject: 'trustness' },
  trustness: { label: 'trustness. GRC', subject: 'trustness' },
  forense: { label: 'forense.io', subject: 'n.secops' },
  'assessment-lgpd': { label: 'Assessment LGPD', subject: 'trustness' },
};

const Contact = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const refInfo = REF_MAP[ref] || (BRAND !== 'ness' ? REF_MAP[BRAND] : null);
  const [selectedSubject, setSelectedSubject] = useState(refInfo?.subject || '');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      {/* Immersive Background for Contact Page */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
          alt="Contact Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="grid lg:grid-cols-2 gap-24">
          {/* Left Side: Info */}
          <div className="space-y-12">
            <div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
              >
                {t('contact.badge', 'get in touch — ness. precision')}
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight leading-tight mb-6 lowercase">
                {t('contact.title')}<BlueDot />
              </h1>
              <p className="text-base md:text-lg text-on-surface-variant font-light leading-relaxed">
                {t('contact.subtitle')}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center shrink-0 group-hover:bg-primary-container/20 transition-colors">
                  <Mail className="text-primary-container" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">{t('contact.info.email')}</h4>
                  <p className="text-on-surface-variant font-light">contato@ness.com.br</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center shrink-0 group-hover:bg-primary-container/20 transition-colors">
                  <Phone className="text-primary-container" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">{t('contact.info.phone')}</h4>
                  <p className="text-on-surface-variant font-light">+55 (11) 2504-7650</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center shrink-0 group-hover:bg-primary-container/20 transition-colors">
                  <MapPin className="text-primary-container" size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-1">{t('contact.info.office')}</h4>
                  <p className="text-on-surface-variant font-light leading-relaxed">
                    Rua George Ohm 230 Torre A Cj 82<br />
                    Brooklin Paulista - São Paulo/SP<br />
                    CEP 04576-020
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 flex gap-4">
              {[
                { Icon: Linkedin, url: "https://www.linkedin.com/company/nesstec" },
                { Icon: Instagram, url: "https://www.instagram.com/ness.tecnologia/" },
                { Icon: Facebook, url: "https://www.facebook.com/nesstecnologia" }
              ].map((social, i) => (
                <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:border-primary-container transition-all">
                  <social.Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-surface-container-low/30 border border-white/5 p-8 md:p-12 rounded-[3rem] nebula-shadow">
            {/* Interest Context Badge */}
            {refInfo && (
              <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary-container/10 border border-primary-container/20">
                <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                <span className="text-[11px] uppercase tracking-widest text-primary-container font-bold">
                  {t('contact.form.interest', { product: refInfo.label, defaultValue: `Interesse em: ${refInfo.label}` })}
                </span>
              </div>
            )}
            <form 
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const payload = {
                  formType: "contact",
                  name: formData.get("name"),
                  company: formData.get("company"),
                  email: formData.get("email"),
                  subject: formData.get("subject"),
                  message: formData.get("message"),
                  referrer: ref || BRAND,
                  referrerLabel: refInfo?.label || BRAND,
                };
                try {
                  const response = await fetch(`${CANAL_BASE}/api/submit-form`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                  });
                  if (response.ok) {
                    alert(t('contact.form.success'));
                    (e.target as HTMLFormElement).reset();
                  } else {
                    throw new Error("Failed to submit");
                  }
                } catch (error) {
                  alert(t('contact.form.error'));
                }
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.name')}</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    placeholder={t('contact.form.name_placeholder')} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
                   aria-label="Input field" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.company')}</label>
                  <input 
                    name="company"
                    type="text" 
                    required
                    placeholder={t('contact.form.company_placeholder')} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
                   aria-label="Input field" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.email')}</label>
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder={t('contact.form.email_placeholder')} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all"
                 aria-label="Input field" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.subject')}</label>
                <select 
                  name="subject" 
                  required 
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all appearance-none"
                >
                  <option value="" className="bg-surface">{t('contact.form.subject_select')}</option>
                  <option value="n.secops" className="bg-surface">n.secops — Segurança Cibernética</option>
                  <option value="n.autoops" className="bg-surface">n.autoops — Automação de Infraestrutura</option>
                  <option value="n.infraops" className="bg-surface">n.infraops — Operações de Infraestrutura</option>
                  <option value="n.aiops" className="bg-surface">n.aiops — Inteligência Artificial</option>
                  <option value="trustness" className="bg-surface">trustness. — GRC & Compliance</option>
                  <option value="forense" className="bg-surface">forense.io — Perícia Digital</option>
                  <option value="outros" className="bg-surface">{t('contact.form.other', 'Outros')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.message')}</label>
                <textarea 
                  name="message"
                  rows={4}
                  required
                  placeholder={t('contact.form.message_placeholder')} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary-container transition-all resize-none"
                ></textarea>
              </div>
              <div className="flex items-start gap-3 px-4 py-2">
                <input 
                  id="privacy-consent"
                  name="privacy_consent"
                  type="checkbox" 
                  required
                  className="mt-1 w-4 h-4 bg-white/5 border border-white/10 rounded focus:ring-1 focus:ring-primary-container accent-primary-container cursor-pointer"
                 aria-label="Input field" />
                <label htmlFor="privacy-consent" className="text-[11px] text-on-surface-variant font-light leading-relaxed cursor-pointer">
                  {t('common.privacy_consent')}
                </label>
              </div>
              <button className="w-full bg-primary-container text-on-primary py-3.5 rounded-2xl font-display font-semibold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-primary-container/20">
                {t('contact.form.send')}
              </button>
            </form>
          </div>
        </div>

        {/* Whistleblowing Callout on Contact Page */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-24 p-8 md:p-12 rounded-[3rem] bg-surface-container-low/20 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-3xl bg-primary-container/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="text-primary-container" size={32} />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-2 lowercase-all">{t('contact.whistleblower.title')}<BlueDot /></h3>
              <p className="text-on-surface-variant font-light text-sm max-w-md">
                {t('contact.whistleblower.desc')}
              </p>
            </div>
          </div>
          <Link 
            to="/compliance/etica"
            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-xs transition-all border border-white/10"
          >
            {t('contact.whistleblower.cta')}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};


export default Contact;
