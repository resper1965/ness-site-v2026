import BlueDot from '../components/BlueDot';
import ConsentimentoPrivacidade from '../components/ConsentimentoPrivacidade';
import React, { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { routeMeta, traduzir } from '../utils/meta';
import { canalApi } from '../services/canal';
import type { Job } from '../types/canal';
import { MapPin, X, Briefcase, Clock, Upload } from "lucide-react";

const Careers = () => {
  const { t, i18n } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState("todos");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await canalApi.getJobs(i18n.language);
        setJobs(data);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
    window.scrollTo(0, 0);
  }, [i18n.language]);

  const filteredJobs = filter === "todos" ? jobs : jobs.filter(j => j.vertical === filter);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      <div className="max-w-7xl mx-auto relative z-20">
        <div className="mb-16">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-6"
          >
            {t('careers.title')} — ness. talent
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight mb-6 lowercase">
            {t('careers.subtitle')}<BlueDot />
          </h1>
          <p className="text-base md:text-lg text-on-surface-variant font-light max-w-3xl leading-relaxed">
            {t('careers.desc')}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-16">
          {["todos", "n.secops", "n.autoops", "n.infraops", "n.devarch"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full text-[11px] uppercase tracking-widest font-bold transition-all ${
                filter === cat 
                  ? "bg-primary-container text-on-primary shadow-lg shadow-primary-container/20" 
                  : "bg-white/5 text-on-surface-variant hover:bg-white/10"
              }`}
            >
              {cat === "todos" ? t('common.all') : cat}
            </button>
          ))}
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse border border-white/5 p-8 rounded-3xl bg-surface-container-low/20 h-64"></div>
            ))
          ) : (
            filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-[2.5rem] bg-surface-container-low/30 border border-white/5 hover:bg-surface-container-low/50 transition-all flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center">
                    <Briefcase className="text-primary-container" size={24} />
                  </div>
                  <span className="text-primary-container text-[11px] uppercase tracking-widest font-bold px-4 py-1 rounded-full bg-primary-container/5 border border-primary-container/10">
                    {job.vertical}
                  </span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-4 lowercase-all">{job.title}<BlueDot /></h3>
                
                <div className="flex flex-wrap gap-6 mb-8">
                  <div className="flex items-center gap-2 text-on-surface-variant/60 text-xs">
                    <MapPin size={14} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant/60 text-xs">
                    <Clock size={14} />
                    {job.type}
                  </div>
                </div>

                <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 flex-1">
                  {job.desc}
                </p>

                <button 
                  onClick={() => setSelectedJob(job)}
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-display font-bold uppercase tracking-widest text-xs transition-all border border-white/10"
                >
                  {t('common.learn_more')}
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Application Modal */}
        <AnimatePresence>
          {selectedJob && (
            <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedJob(null)}
                className="absolute inset-0 bg-surface/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-surface-container-low rounded-[3rem] border border-white/10 nebula-shadow p-8 md:p-12 custom-scrollbar"
              >
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="absolute top-8 right-8 text-on-surface-variant hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="grid lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <span className="text-primary-container text-[11px] uppercase tracking-widest font-bold">{selectedJob.vertical}</span>
                      <h2 className="text-2xl md:text-3xl font-display font-bold text-white mt-2 lowercase">{selectedJob.title}<BlueDot /></h2>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-white font-bold text-xs uppercase tracking-widest">{t('careers.requirements')}</h4>
                      <ul className="space-y-3">
                        {selectedJob.requirements.map((req: string, i: number) => (
                          <li key={i} className="flex gap-3 text-on-surface-variant text-sm font-light">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-container mt-1.5 shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                      <h4 className="text-white font-bold text-xs uppercase tracking-widest">{t('careers.benefits')}</h4>
                      <div className="grid grid-cols-2 gap-4 text-[11px] text-on-surface-variant/60 uppercase tracking-widest font-bold">
                        <div>• {t('careers.benefits_list.health')}</div>
                        <div>• {t('careers.benefits_list.bonus')}</div>
                        <div>• {t('careers.benefits_list.education')}</div>
                        <div>• {t('careers.benefits_list.setup')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-high/50 p-8 rounded-4xl border border-white/5">
                    <h3 className="text-xl font-display font-bold text-white mb-8 lowercase-all">{t('careers.apply_title')}<BlueDot /></h3>
                    <form 
                      className="space-y-4" 
                      onSubmit={async (e) => { 
                        e.preventDefault(); 
                        setIsSubmitting(true);
                        setSubmitStatus(null);

                        const formData = new FormData(e.currentTarget);
                        const submitData = new FormData();
                        submitData.append("name", formData.get("name") as string);
                        submitData.append("email", formData.get("email") as string);
                        submitData.append("linkedin_url", formData.get("linkedin") as string);
                        
                        const cvFile = formData.get("cv");
                        if (cvFile) {
                          submitData.append("resume", cvFile);
                        }

                        try {
                          await canalApi.applyJob(selectedJob.id, submitData);
                          setSubmitStatus('success');
                          setTimeout(() => {
                            setSelectedJob(null);
                            setSubmitStatus(null);
                          }, 3000);
                        } catch (error) {
                          setSubmitStatus('error');
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                    >
                      <div className="space-y-2">
                        <label htmlFor="name-input" className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('careers.form.full_name')}</label>
                        <input id="name-input" name="name" type="text" required placeholder="seu nome" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container transition-all" aria-label={t('careers.form.full_name')} />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email-input" className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('contact.form.email')}</label>
                        <input id="email-input" name="email" type="email" required placeholder="email@exemplo.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container transition-all" aria-label={t('contact.form.email')} />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="linkedin-input" className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('careers.form.linkedin')}</label>
                        <input id="linkedin-input" name="linkedin" type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container transition-all" aria-label={t('careers.form.linkedin')} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] uppercase tracking-widest text-on-surface-variant font-bold ml-4">{t('careers.form.attach_cv')}</label>
                        <div className="relative group/upload">
                          <input id="cv-input" name="cv" type="file" accept=".pdf" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" aria-label={t('careers.form.attach_cv')} />
                          <div className="w-full bg-white/5 border border-dashed border-white/20 rounded-2xl px-6 py-8 text-center group-hover/upload:border-primary-container/50 transition-all">
                            <Upload className="mx-auto text-on-surface-variant/60 mb-2 group-hover/upload:text-primary-container transition-colors" size={24} />
                            <p className="text-xs text-on-surface-variant/60">{t('careers.form.drag_drop')}</p>
                          </div>
                        </div>
                      </div>
                      <ConsentimentoPrivacidade id="privacy-consent-careers" />
                      
                      {submitStatus === 'success' && (
                        <div className="bg-primary-container/10 border border-primary-container/20 text-primary-container px-6 py-4 rounded-2xl text-xs font-light mt-4">
                          {t('careers.form.success')}
                        </div>
                      )}
                      {submitStatus === 'error' && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-xs font-light mt-4">
                          {t('careers.form.error')}
                        </div>
                      )}

                      <button 
                        type="submit"
                        disabled={isSubmitting || submitStatus === 'success'}
                        className="w-full bg-primary-container text-on-primary py-3.5 rounded-2xl font-display font-semibold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-primary-container/20 mt-4 disabled:opacity-50"
                      >
                        {isSubmitting ? t('common.sending', 'enviando...') : t('careers.form.send_button')}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


export default Careers;


export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => {
    const t = traduzir(lang);
    return {
    title: t('nav.careers', 'carreiras'),
    description: {
      pt: 'Vagas abertas na ness. Engenharia, operações de segurança, infraestrutura e privacidade.',
      en: 'Open roles at ness. Engineering, security operations, infrastructure and privacy.',
      es: 'Vacantes abiertas en ness. Ingeniería, operaciones de seguridad, infraestructura y privacidad.',
    }[lang],
  };
  });
}
