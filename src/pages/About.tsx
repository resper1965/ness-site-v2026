import BlueDot from '../components/BlueDot';
import CTA from '../components/CTA';
import AnimatedCounter from '../components/AnimatedCounter';
import React from "react";
import { motion } from "motion/react";
import { useTranslation, Trans } from "react-i18next";
import { usePageTitle } from '../hooks/usePageTitle';
import { Target, Eye, Heart, Shield, Globe, Cpu } from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';

const About = () => {
  const { t } = useTranslation();
  usePageTitle('about.meta_title', 'sobre — ness.');

  const timeline = [
    { year: "1991", desc: t('about.timeline.1991', "ness. é fundada como terceirização da área de tecnologia de um grande grupo econômico.") },
    { year: "1992", desc: t('about.timeline.1992', "Início das atividades de infraestrutura crítica, processamento de dados e BPO em larga escala.") },
    { year: "2004", desc: t('about.timeline.2004', "Expansão global: infraestrutura em grandes eventos por diversos países da Europa, Américas, África e Ásia.") },
    { year: "2012", desc: t('about.timeline.2012', "Pioneirismo no início de serviços especializados de privacidade e segurança digital avançada.") },
    { year: "2015", desc: t('about.timeline.2015', "Lançamento da divisão de software e processos, focada em engenharia digital de alta performance.") },
    { year: "2016", desc: t('about.timeline.2016', "Incubação da NESS Technology Healthcare (que viria a se tornar a IONIC Health).") },
    { year: "2017", desc: t('about.timeline.2017', "Incubação da Trustness como unidade de negócios estratégica para GRC.") },
    { year: "2022", desc: t('about.timeline.2022', "Incubação da forense.io como unidade de negócios líder em investigação digital.") },
    { year: "2024", desc: t('about.timeline.2024', "Estabelecida como uma plataforma modular para transformação digital confiável e segura.") },
    { year: "2026", desc: t('about.timeline.2026', "Início da operação de IA e Agentes, consolidando a ness. como líder em orquestração de conhecimento inteligente.") }
  ];

  const pillars = [
    { icon: Target, key: 'mission', title: t('about.mission'), desc: t('about.mission_desc') },
    { icon: Eye,    key: 'vision',  title: t('about.vision'),  desc: t('about.vision_desc') },
    { icon: Heart,  key: 'values',  title: t('about.values'),  desc: t('about.values_desc', "Excelência técnica inegociável, inovação constante e aplicada, parceria verdadeira e transparente, resultados reais e mensuráveis.") }
  ];

  const credentials = [
    { icon: Globe,  label: t('about.cred.global', "Presença global"), value: "30+" },
    { icon: Shield, label: t('about.cred.security', "Seg. & Privacidade"), value: "ISO 27001" },
    { icon: Cpu,    label: t('about.cred.ai', "IA & Agentes"), value: "2026" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative pt-32 pb-24 px-8 bg-surface-container-lowest min-h-screen"
    >
      {/* Background image — subtle */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.img
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.12 }}
          transition={{ duration: 1.8 }}
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=60&w=1600"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/50 via-surface-container-lowest/90 to-surface-container-lowest z-10" />
      </div>

      <div className="max-w-6xl mx-auto space-y-28 relative z-20">

        {/* ── Hero ────────────────────────────────────────────── */}
        <div className="max-w-3xl">
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-primary-container font-mono text-[10px] uppercase tracking-[0.3em] mb-5"
          >
            since {FOUNDATION_YEAR} — {YEARS_OF_LEGACY} {t('about.years_label', 'anos de excelência')}
          </motion.p>

          <motion.h1
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight leading-[1.1] mb-6 lowercase"
          >
            <Trans
              i18nKey="about.subtitle"
              components={{ highlight: <span className="text-primary-container drop-shadow-[0_0_15px_rgba(0,173,232,0.6)]" /> }}
            /><BlueDot />
          </motion.h1>

          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-base md:text-lg text-on-surface-variant font-light leading-relaxed max-w-xl"
          >
            {t('about.desc')}
          </motion.p>

          {/* Credential badges */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            {credentials.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-low/40 border border-white/8 text-xs text-on-surface-variant"
              >
                <Icon size={13} className="text-primary-container shrink-0" />
                <span className="font-medium text-white">{value}</span>
                <span className="opacity-60">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Mission / Vision / Values ────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-8 border-y border-white/5 py-16">
          {pillars.map(({ icon: Icon, key, title, desc }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-4"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center">
                <Icon className="text-primary-container" size={20} />
              </div>
              <h2 className="text-base font-display font-semibold text-white lowercase tracking-tight">
                {title}<BlueDot />
              </h2>
              <p className="text-sm text-on-surface-variant font-light leading-relaxed">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Metrics ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-t border-white/5 pt-16 mt-8 mb-16">
          <AnimatedCounter value={YEARS_OF_LEGACY} label={t('about.metrics.legacy', 'anos de operação')} suffix="+" duration={1500} />
          <AnimatedCounter value={30} label={t('about.metrics.countries', 'países atendidos')} suffix="+" duration={2000} />
          <AnimatedCounter value={500} label={t('about.metrics.projects', 'projetos globais')} suffix="+" duration={2500} />
          <AnimatedCounter value={99} label={t('about.metrics.uptime', 'sla / uptime')} suffix="%" duration={3000} />
        </div>

        {/* ── Timeline ─────────────────────────────────────────── */}
        <section>
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-2xl font-display font-medium text-white sticky top-32 tracking-tight lowercase">
                {t('about.history_title')}<BlueDot />
              </h2>
              <p className="mt-4 text-sm text-on-surface-variant font-light leading-relaxed sticky top-52">
                {YEARS_OF_LEGACY} {t('about.history_sub', 'anos construindo a base tecnológica de grandes corporações e eventos globais.')}
              </p>
            </div>

            <div className="md:w-2/3 space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex gap-10 group"
                >
                  <div className="w-16 shrink-0 text-primary-container font-mono text-sm font-bold pt-0.5">
                    {item.year}
                  </div>
                  <div className="relative pb-10 border-l border-white/8 pl-10 group-last:border-transparent">
                    <div className="absolute top-2.5 -left-[5px] w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_rgba(0,173,232,0.4)]" />
                    <p className="text-sm text-white font-light leading-relaxed group-hover:text-primary-container transition-colors duration-200">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </div>
    </motion.div>
  );
};

export default About;
