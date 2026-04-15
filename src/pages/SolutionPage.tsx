import BlueDot from '../components/BlueDot';
import ChatPreview from '../components/ChatPreview';
import EmergencyChatModal from '../components/EmergencyChatModal';
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { solutionsData } from "../data/solutionsData";
import { 
  ChevronLeft,
  CheckCircle2,
  ExternalLink,
  ChevronDown
} from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';



const SolutionPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const solution = slug ? solutionsData[slug] : null;
  const Icon = solution?.icon;
  const [showTech, setShowTech] = useState(false);
  const [isEmergencyChatOpen, setIsEmergencyChatOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowTech(false);
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
              {solution.overview || t(`solutions.${slug}.longDesc`)}
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
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* NEW Fluxo Operacional (Workflow Espaçoso) */}
        <section id="fluxo-operacional" className="mb-24">
          <div className="mb-12">
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight lowercase">
              {t('solutions.intelligence_flow', 'o fluxo de inteligência')}<BlueDot />
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {solution.workflow?.map((w: any, idx: number) => (
              <motion.div 
                key={w.step}
                whileHover={{ y: -5 }} 
                className="relative p-8 rounded-4xl bg-surface-container-low/10 border border-white/5 hover:bg-surface-container-low/30 hover:border-primary/20 transition-all overflow-hidden group flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all z-0"></div>
                <div className="relative z-10 flex flex-col flex-1">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-sm font-mono text-primary-container font-bold shadow-[0_0_15px_rgba(var(--primary-container-rgb),0.1)] group-hover:shadow-[0_0_20px_rgba(var(--primary-container-rgb),0.2)] transition-shadow">
                      {w.step}
                    </div>
                    <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent group-hover:from-primary-container/30 transition-colors"></div>
                  </div>
                  <h4 className="text-white font-display font-medium text-[1.15rem] leading-snug mb-4 tracking-tight group-hover:text-primary-container transition-colors drop-shadow-sm">{w.name}</h4>
                  {w.desc && (
                    <p className="text-on-surface-variant font-light leading-relaxed text-sm flex-1">{w.desc}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* NEW Casos de Uso Típicos (Legacy Refactored) */}
        {solution.useCases && (
          <section id="casos-de-uso" className="mb-24">
            <div className="mb-12">
              <h3 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight lowercase">
                {t('solutions.use_cases', 'casos de uso reais')}<BlueDot />
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {solution.useCases.map((useCase: any, i: number) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5 }}
                  className="p-8 lg:p-10 rounded-4xl bg-surface-container-low/10 border border-white/5 hover:bg-surface-container-low/30 hover:border-primary/20 transition-all group flex flex-col justify-between"
                >
                  <h4 className="text-white font-medium text-lg lg:text-xl leading-tight mb-4 group-hover:text-primary-container transition-colors pr-6">{useCase.title}</h4>
                  <p className="text-on-surface-variant font-light text-sm">{useCase.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* NEW Valor para o Negócio (Full Width Bento-style Cards) */}
        <section id="benefícios" className="mb-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div className="max-w-2xl">
              <h3 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight lowercase">
                {t('solutions.business_value', 'valor para o negócio')}<BlueDot />
              </h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solution.benefits?.map((benefit: any, i: number) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10 }}
                className="p-10 rounded-[2rem] bg-surface-container-low/20 border border-white/5 hover:bg-surface-container-low/40 hover:border-primary/30 transition-all relative overflow-hidden group flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all"></div>
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/10 flex items-center justify-center mb-8 border border-primary-container/20">
                    <CheckCircle2 className="text-primary-container" size={24} />
                  </div>
                  <h4 className="text-white font-display font-semibold text-xl mb-4 group-hover:text-primary-container transition-colors tracking-tight">{benefit.title}</h4>
                  <p className="text-on-surface-variant font-light leading-relaxed flex-1">{benefit.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* NEW Soluções Estratégicas (Full Width SaaS Modules) */}
        <section id="serviços" className="mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight lowercase">
              {t('solutions.strategic_solutions', 'soluções estratégicas')}<BlueDot />
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solution.services.map((service: any, i: number) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.02 }}
                className="group relative p-10 rounded-[2rem] border border-white/5 bg-surface-container-low/30 hover:bg-surface-container-low/50 overflow-hidden transition-all flex flex-col justify-between"
              >
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
                <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                  <Icon size={140} />
                </div>
                
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container/20 flex items-center justify-center mb-8 border border-primary-container/20 shadow-[0_0_20px_rgba(var(--primary-container-rgb),0.15)] group-hover:shadow-[0_0_30px_rgba(var(--primary-container-rgb),0.3)] transition-shadow">
                    <Icon className="text-primary-container" size={26} />
                  </div>
                  <h4 className="text-white font-display text-xl lg:text-2xl font-semibold mb-4 tracking-tight drop-shadow-md group-hover:text-primary-container transition-colors">{service.name}</h4>
                  <p className="text-on-surface-variant font-light leading-relaxed flex-1">{service.desc}</p>
                </div>
                

              </motion.div>
            ))}
          </div>
        </section>

        {/* NEW O Arsenal Técnico (Features Legadas) */}
        {solution.features && (
          <section id="funcionalidades" className="mb-24 pt-12 border-t border-white/5">
            <div className="mb-16 text-center">
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight lowercase mb-6">
                {t('solutions.technical_arsenal', 'o arsenal em operação')}<BlueDot />
              </h3>
            </div>
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className="flex flex-wrap items-center justify-center gap-4 max-w-[1000px] mx-auto relative p-4"
            >
              {/* Linhas de conexão visuais no fundo pra dar sensação de correlação/pipeline */}
              <div className="absolute inset-x-20 top-1/2 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 z-0 hidden lg:block"></div>
              
              {solution.features.map((feat: any, i: number) => (
                <motion.div 
                  key={i} 
                  variants={{
                    hidden: { opacity: 0, scale: 0.8, y: 15 },
                    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" } }
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="relative z-10 flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 bg-surface-container-low/80 backdrop-blur-md hover:border-primary/50 hover:bg-surface-container-low transition-all shadow-xl shadow-black/20 group cursor-default"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-container shadow-[0_0_8px_rgba(var(--primary-container-rgb),0.8)] group-hover:scale-150 transition-transform"></div>
                  <span className="text-white text-sm font-medium">{feat.name}</span>
                  <span className="text-on-surface-variant text-[10px] uppercase tracking-widest ml-2 hidden md:inline-block border-l border-white/10 pl-2">{feat.category}</span>
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* NEW Timeline de Onboarding (Legacy Refactored) */}
        {solution.onboarding && (
          <section id="onboarding" className="mb-24 pt-12 border-t border-white/5">
            <div className="mb-16">
              <h3 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight lowercase mb-6">
                {t('solutions.onboarding_journey', 'jornada de ativação')}<BlueDot />
              </h3>
            </div>
            <div className="flex flex-col md:flex-row gap-8 relative mt-16">
              <div className="absolute top-6 left-0 right-0 h-px bg-white/5 hidden md:block z-0"></div>
              {solution.onboarding.map((step: any, i: number) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -10 }}
                  className="flex-1 relative z-10 bg-surface-container-lowest md:bg-transparent p-6 md:p-0 rounded-3xl border border-white/5 md:border-transparent group"
                >
                  <div className="w-12 h-12 bg-surface-container-lowest border border-white/10 rounded-full flex items-center justify-center text-primary font-mono text-sm font-bold mb-8 mx-auto shadow-xl group-hover:border-primary/50 group-hover:text-primary-container transition-all">
                    {step.step}
                  </div>
                  <div className="text-center md:px-2">
                    <h4 className="text-white font-medium text-lg mb-3 tracking-tight">{step.title}</h4>
                    <p className="text-on-surface-variant text-xs md:text-sm font-light leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Modular CTA Banner */}
        <div className="mb-24 p-12 lg:p-16 rounded-[4rem] bg-surface-container-low border border-white/5 nebula-shadow relative overflow-hidden group text-center">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-primary-container/10 opacity-50 backdrop-blur-md"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 scale-150 group-hover:scale-110 transition-transform duration-1000">
            <Icon size={400} />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h4 className="text-3xl lg:text-5xl font-display font-medium text-white mb-6 tracking-tight lowercase">{t('solutions.cta_title', 'sua empresa em um novo nível')}<BlueDot /></h4>
            <p className="text-lg text-on-surface-variant font-light leading-relaxed mb-10">{t('solutions.cta_desc', 'descubra como a ness pode transformar sua operação com inteligência e segurança de elite.')}</p>
            <button 
              onClick={() => {
                if (slug === 'cirt') {
                  setIsEmergencyChatOpen(true);
                } else {
                  navigate('/contact');
                }
              }}
              className="bg-white text-surface px-10 py-5 rounded-full font-display font-semibold uppercase tracking-widest text-sm hover:bg-primary-container hover:text-on-primary hover:scale-105 transition-all shadow-lg shadow-primary-container/20 whitespace-nowrap">
              {solution.ctaLabel}
            </button>
          </div>
        </div>

        {solution.technicalFeatures && solution.technicalFeatures.length > 0 && (
          <section id="tecnologia" className="mb-24 pt-12 border-t border-white/5">
            <div className="flex justify-center mb-8">
              <button 
                onClick={() => setShowTech(!showTech)}
                className="flex items-center gap-3 px-8 py-4 rounded-full bg-surface-container-low border border-white/10 hover:bg-surface-container-low/80 hover:border-primary/20 transition-all text-on-surface-variant text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-black/20"
              >
                {t('solutions.technical_view_toggle', 'visão para engenharia & ctos')}
                <motion.div animate={{ rotate: showTech ? 180 : 0 }}>
                  <ChevronDown size={16} className="text-primary" />
                </motion.div>
              </button>
            </div>
            
            <AnimatePresence>
              {showTech && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8 pt-6">
                    <div className="max-w-xl">
                      <h3 className="text-xl md:text-2xl font-display font-semibold text-white tracking-tight lowercase">{t('solutions.tech_engine', 'o motor da resiliência')}<BlueDot /></h3>
                      <p className="text-on-surface-variant mt-4 font-light">{t('solutions.tech_desc', 'para os interessados na engenharia por trás da proteção, aqui estão os pilares técnicos que sustentam nossa entrega de valor.')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
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
                </motion.div>
              )}
            </AnimatePresence>
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
      
      <EmergencyChatModal 
        isOpen={isEmergencyChatOpen} 
        onClose={() => setIsEmergencyChatOpen(false)} 
      />
    </motion.div>
  );
};


export default SolutionPage;
