import BlueDot from '../components/BlueDot';
import ChatPreview from '../components/ChatPreview';
import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { solutionsData } from "../data/solutionsData";
import { 
ChevronLeft,
  CheckCircle2,
  ExternalLink} from "lucide-react";

// Celebration Configuration
const FOUNDATION_YEAR = 1991;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_OF_LEGACY = CURRENT_YEAR - FOUNDATION_YEAR;



const SolutionPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const solution = slug ? solutionsData[slug] : null;
  const Icon = solution?.icon;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!solution) return <div className="min-h-screen flex items-center justify-center text-white">{t('common.loading')}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen overflow-hidden"
    >
      {/* Immersive Background for Solution Page */}
      <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1.5 }}
            src={solution.bgImage}
            alt={`${solution.title} Background`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
        
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 z-10"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-12 transition-colors group">
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          {t('common.back')}
        </Link>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center">
                <Icon className="text-primary-container" size={32} />
              </div>
              <h1 className="text-2xl font-brand font-medium text-white lowercase-all">
                {t(`solutions.${slug}.title`).split('.')[0]}<span className="text-primary-container">.</span>{t(`solutions.${slug}.title`).split('.')[1]}
              </h1>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight leading-tight lowercase">
              {t(`solutions.${slug}.fullTitle`)}<BlueDot />
            </h2>
            <p className="text-base md:text-lg text-on-surface-variant font-light leading-relaxed">
              {t(`solutions.${slug}.longDesc`)}
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-primary-container text-on-primary px-8 py-3 rounded-full font-display font-semibold text-sm hover:brightness-110 transition-all">
                {t(`solutions.${slug}.cta`)}
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
            {slug === 'autoops' ? (
              <ChatPreview />
            ) : (
              <div className="relative glass p-8 md:p-12 rounded-[3rem] border border-white/10 nebula-shadow overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{t('solutions.active_resilience')}</span>
                  </div>
                </div>
                
                <div className="space-y-10">
                  <div className="flex justify-between items-end">
                    <h3 className="text-xs uppercase tracking-[0.2em] text-primary font-bold">{solution.dashboard?.title || 'executive dashboard'}</h3>
                    <div className="text-right">
                      <div className="text-3xl font-display font-bold text-white tracking-tighter">{solution.dashboard?.mainStat.value || '99.9%'}</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">{solution.dashboard?.mainStat.label || 'uptime operacional'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {solution.dashboard?.metrics.map((metric: any, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <motion.div 
                          initial={{ opacity: 0.5 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                          className={`${metric.color} text-xl font-bold mb-1`}
                        >
                          {metric.value}
                        </motion.div>
                        <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{solution.dashboard?.progress.label}</h4>
                      <span className="text-[10px] text-primary font-mono">{solution.dashboard?.progress.value} {solution.dashboard?.progress.subLabel}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: solution.dashboard?.progress.value }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-linear-to-r from-primary to-primary-container"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{t('solutions.intelligence_flow')}</h4>
                    <div className="space-y-3">
                      {solution.workflow?.map((w: any) => (
                        <motion.div 
                          key={w.step} 
                          initial={{ opacity: 0.4 }}
                          whileInView={{ opacity: 1 }}
                          className="flex gap-4 group/step items-center"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-[10px] font-mono text-primary-container">
                            {w.step}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h4 className="text-white text-xs font-medium group-hover/step:text-primary transition-colors">{w.name}</h4>
                              <div className="h-px flex-1 mx-4 bg-white/5"></div>
                              <CheckCircle2 size={12} className="text-primary-container" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 gap-24 mb-24">
          <section id="benefícios">
            <h3 className="text-xl md:text-2xl font-display font-semibold text-white mb-10 tracking-tight lowercase">{t('solutions.business_value', 'valor para o negócio')}<BlueDot /></h3>
            <div className="grid grid-cols-1 gap-6">
              {solution.benefits?.map((benefit: any, i: number) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 10 }}
                  className="p-8 rounded-3xl bg-surface-container-low/30 border border-white/5 hover:bg-surface-container-low/50 transition-all"
                >
                  <h4 className="text-primary-container font-bold text-xs uppercase tracking-widest mb-3">{benefit.title}</h4>
                  <p className="text-white text-lg font-light leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="serviços">
            <h3 className="text-xl md:text-2xl font-display font-semibold text-white mb-10 tracking-tight lowercase">{t('solutions.strategic_solutions', 'soluções estratégicas')}<BlueDot /></h3>
            <div className="space-y-6">
              {solution.services.map((service: any, i: number) => (
                <div key={i} className="group p-6 rounded-2xl border border-white/5 bg-surface-container-low/10 hover:bg-surface-container-low/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center shrink-0">
                      <Icon className="text-primary-container" size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{service.name}</h4>
                      <p className="text-on-surface-variant text-sm font-light">{service.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 p-10 rounded-[3rem] bg-linear-to-br from-primary-container to-primary text-on-primary shadow-2xl shadow-primary-container/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                <Icon size={120} />
              </div>
              <div className="relative z-10">
                <h4 className="text-xl font-display font-bold mb-3 tracking-tight">{t('solutions.cta_title', 'sua empresa em um novo nível.')}</h4>
                <p className="text-base mb-6 opacity-90 font-light">{t('solutions.cta_desc', 'descubra como a ness pode transformar sua operação com inteligência e segurança de elite.')}</p>
                <button className="bg-white text-primary px-8 py-3 rounded-full font-display font-semibold uppercase tracking-widest text-xs hover:shadow-xl transition-all">
                  {solution.ctaLabel}
                </button>
              </div>
            </div>
          </section>
        </div>

        {solution.technicalFeatures && (
          <section id="tecnologia" className="mb-24 pt-24 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
              <div className="max-w-xl">
                <h3 className="text-xl md:text-2xl font-display font-semibold text-white tracking-tight lowercase">{t('solutions.tech_engine', 'o motor da resiliência')}<BlueDot /></h3>
                <p className="text-on-surface-variant mt-4 font-light">{t('solutions.tech_desc', 'para os interessados na engenharia por trás da proteção, aqui estão os pilares técnicos que sustentam nossa entrega de valor.')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {solution.technicalFeatures.map((feat: any, i: number) => (
                <div key={i} className="p-8 rounded-3xl border border-white/5 bg-surface-container-low/20 hover:border-primary/20 transition-all">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    {feat.title}
                  </h4>
                  <p className="text-on-surface-variant text-xs font-light leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="portfólio">
          <h3 className="text-xl md:text-2xl font-display font-semibold text-white mb-10 tracking-tight lowercase">{t('solutions.impact_portfolio', 'portfólio de impacto')}<BlueDot /></h3>
          <div className="grid md:grid-cols-2 gap-8">
            {solution.portfolio.map((item: any, i: number) => (
              <div key={i} className="p-8 rounded-4xl border border-white/5 bg-linear-to-br from-surface-container-low to-surface-container-lowest">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{item.client}</span>
                    <h4 className="text-xl text-white mt-1 font-medium">{item.project}</h4>
                  </div>
                  <ExternalLink className="text-on-surface-variant/40" size={20} />
                </div>
                <div className="p-4 rounded-xl bg-primary-container/5 border border-primary-container/10">
                  <p className="text-primary-container text-sm font-medium">{t('common.result')}: {item.result}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};


export default SolutionPage;
