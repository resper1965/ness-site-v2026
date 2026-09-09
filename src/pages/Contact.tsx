import BlueDot from '../components/BlueDot';
import ConsentimentoPrivacidade from '../components/ConsentimentoPrivacidade';
import React, { useState } from "react";
import { m as motion } from "motion/react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { routeMeta, traduzir } from '../utils/meta';
import { idiomaDaRota, rotaNoIdioma } from '../utils/lang';
import { origemDaVisita } from '../utils/origem';
import { evento } from '../utils/eventos';
import { validarEmail } from '../utils/formulario';
import Turnstile from '../components/Turnstile';
import { canalApi } from '../services/canal';
import { useBrand } from '../config/brand';
import { Mail, Phone, MapPin, Linkedin, Instagram, Facebook, AlertTriangle } from "lucide-react";




/** Maps referrer slugs to display labels and subject values */
const REF_MAP: Record<string, { label: string; subject: string }> = {
  secops: { label: 'n.secops', subject: 'n.secops' },
  infraops: { label: 'n.infraops', subject: 'n.infraops' },
  autoops: { label: 'n.autoops', subject: 'n.autoops' },
  cirt: { label: 'n.cirt', subject: 'n.secops' },
  devarch: { label: 'n.devarch', subject: 'n.secops' },
  dpo: { label: 'DPO as a Service', subject: 'trustness' },
  trustness: { label: 'trustness. GRC', subject: 'trustness' },
  forense: { label: 'forense.io', subject: 'n.secops' },
  'assessment-lgpd': { label: 'Assessment LGPD', subject: 'trustness' },
  'assessment-cyber': { label: 'Assessment Cyber', subject: 'n.secops' },
};

const Contact = () => {
  const BRAND = useBrand();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const ref = searchParams.get('ref') || '';
  const refInfo = REF_MAP[ref] || (BRAND !== 'ness' ? REF_MAP[BRAND] : null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'error' | null>(null);
  const [erroEmail, setErroEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // O assunto sai da origem da visita, não de um select que o visitante
  // preenche por obrigação: um campo a menos e um dado mais confiável.
  const assunto = refInfo?.subject || (BRAND === 'ness' ? 'outros' : BRAND);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      {/* Immersive Background for Contact Page */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-nebula" aria-hidden="true">
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
                className="text-primary-container font-mono text-xs lowercase tracking-[0.3em] mb-6"
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
                  <p className="text-white font-bold text-xs uppercase tracking-widest mb-1">{t('contact.info.email')}</p>
                  <a href="mailto:contato@ness.com.br" className="text-on-surface-variant hover:text-primary transition-colors">contato@ness.com.br</a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center shrink-0 group-hover:bg-primary-container/20 transition-colors">
                  <Phone className="text-primary-container" size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-xs uppercase tracking-widest mb-1">{t('contact.info.phone')}</p>
                  <a href="tel:+551125047650" className="text-on-surface-variant hover:text-primary transition-colors">+55 (11) 2504-7650</a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center shrink-0 group-hover:bg-primary-container/20 transition-colors">
                  <MapPin className="text-primary-container" size={24} />
                </div>
                <div>
                  <p className="text-white font-bold text-xs uppercase tracking-widest mb-1">{t('contact.info.office')}</p>
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
                { Icon: Linkedin, url: "https://www.linkedin.com/company/nesstec", label: "LinkedIn" },
                { Icon: Instagram, url: "https://www.instagram.com/ness.tecnologia/", label: "Instagram" },
                { Icon: Facebook, url: "https://www.facebook.com/nesstecnologia", label: "Facebook" }
              ].map((social) => (
                <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-primary-container hover:border-primary-container transition-all">
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
                <div className="w-2 h-2 rounded-full bg-primary-container" aria-hidden="true" />
                <span className="text-[11px] lowercase tracking-widest text-primary-container font-bold">
                  {t('contact.form.interest', { product: refInfo.label, defaultValue: `Interesse em: ${refInfo.label}` })}
                </span>
              </div>
            )}
            <form 
              className="space-y-6"
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setSubmitStatus(null);
                const formData = new FormData(e.currentTarget);
                const payload = {
                  formType: "contact",
                  name: formData.get("name"),
                  company: formData.get("company"),
                  email: formData.get("email"),
                  subject: assunto,
                  message: formData.get("message"),
                  referrer: ref || BRAND,
                  referrerLabel: refInfo?.label || BRAND,
                  // Origem da visita: sem isso não dá para saber qual canal
                  // traz lead, só quantos leads chegaram.
                  ...origemDaVisita(),
                  // Armadilha: humano não vê o campo, robô preenche.
                  website: formData.get("website"),
                  turnstileToken: formData.get("cf-turnstile-response"),
                };
                try {
                  await canalApi.submitForm(payload);
                  evento('generate_lead', { form_type: 'contact', subject: assunto, brand: BRAND });
                  navigate(rotaNoIdioma(pathname, idiomaDaRota(pathname)).replace('/contato', '/obrigado'));
                } catch (error) {
                  setSubmitStatus('error');
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold ml-6">{t('contact.form.name')}</label>
                  <input 
                    id="contact-name"
                    name="name"
                    type="text" 
                    required
                    placeholder={t('contact.form.name_placeholder')} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container transition-all"
                    aria-label={t('contact.form.name')} />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-company" className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold ml-6">{t('contact.form.company')}</label>
                  <input 
                    id="contact-company"
                    name="company"
                    type="text" 
                    required
                    placeholder={t('contact.form.company_placeholder')} 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container transition-all"
                    aria-label={t('contact.form.company')} />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold ml-6">{t('contact.form.email')}</label>
                <input 
                  id="contact-email"
                  name="email"
                  type="email" 
                  required
                  placeholder={t('contact.form.email_placeholder_v2', 'nome@empresa.com.br')}
                  autoComplete="email"
                  aria-invalid={!!erroEmail}
                  aria-describedby={erroEmail ? 'contact-email-erro' : undefined}
                  onBlur={(e) => setErroEmail(validarEmail(e.target.value))}
                  onChange={() => erroEmail && setErroEmail(null)}
                  className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container transition-all ${erroEmail ? 'border-red-500/60' : 'border-white/10'}`}
                  aria-label={t('contact.form.email')} />
                {erroEmail && (
                  <p id="contact-email-erro" role="alert" className="text-[11px] text-red-400 ml-4">{erroEmail}</p>
                )}
              </div>
              {/* Honeypot: fora do fluxo de teclado e invisível para leitor de tela. */}
              <div aria-hidden="true" className="absolute w-px h-px overflow-hidden -left-[9999px]">
                <label htmlFor="website">não preencha</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold ml-6">{t('contact.form.message')}</label>
                <textarea 
                  id="contact-message"
                  name="message"
                  rows={4}
                  required
                  placeholder={t('contact.form.message_placeholder')} 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container transition-all resize-none"
                ></textarea>
              </div>
              <ConsentimentoPrivacidade />

              {submitStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-xs font-light mt-4 flex items-start gap-3">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-1">{t('contact.form.error', 'Erro ao enviar mensagem.')}</p>
                    <p className="text-red-400/80">Por favor, verifique sua conexão ou tente novamente em alguns instantes. Se o problema persistir, contate-nos diretamente pelo e-mail contato@ness.com.br.</p>
                  </div>
                </div>
              )}

              <Turnstile action="contato" />

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-container text-on-primary py-3.5 rounded-2xl font-display font-semibold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-primary-container/20 disabled:opacity-50"
              >
                {isSubmitting ? t('common.sending', 'enviando...') : t('contact.form.send')}
              </button>
              <p className="text-xs text-on-surface-variant/70 text-center">
                {t('contact.form.sla', 'respondemos em até 1 dia útil. incidente em andamento? ligue +55 (11) 2504-7650.')}
              </p>
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
              <h2 className="text-xl font-display font-bold text-white mb-2 lowercase-all">{t('contact.whistleblower.title')}<BlueDot /></h2>
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

// O `meta` roda fora da árvore React, onde não há useTranslation: `traduzir`
// devolve um `t` fixo no idioma da rota.
export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => {
    const t = traduzir(lang);
    return {
      title: t('contact.meta_title', 'contato — fale com um especialista'),
      description: t(
        'contact.meta_description',
        'Fale com a ness.: diagnóstico de segurança, infraestrutura, engenharia de software, LGPD e perícia digital. Resposta em até 1 dia útil. +55 (11) 2504-7650.',
      ),
    };
  });
}
