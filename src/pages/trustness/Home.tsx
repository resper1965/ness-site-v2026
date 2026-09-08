import React from "react";
import { m as motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, Fingerprint, Lock, FileCheck, ShieldCheck, Target, GraduationCap, Scale, Activity, PieChart, Users, ShieldAlert, CheckCircle2 } from "lucide-react";
import BlueDot from "../../components/BlueDot";
import HeroPicture from "../../components/HeroPicture";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import LeadMagnet from "../../components/LeadMagnet";

export default function TrustnessHome() {
  const { t } = useTranslation();
  usePageTitle({
    title: 'governança, risco e compliance',
    description: 'trustness. é a vertical de GRC da ness. Consultoria em LGPD, ISO 27001, gestão de riscos, auditoria de segurança, pentest e DPO as a Service para corporações nacionais.',
  });
  
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <HeroPicture brand="trustness" opacity={0.3} priority grayscale />
          <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/50 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
          {/* Intense blue glow to distinguish trustness */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full z-10" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl space-y-10"
          >
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-medium text-white leading-[1.05] tracking-tighter lowercase-all">
              {t("trustness.title")}<BlueDot />{" "}<br />
              <span className="text-white/90 drop-shadow-[0_0_20px_rgba(0,173,232,0.4)]">{t("trustness.hero.tag")}</span>
            </h1>
            <p className="text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed font-light">
              {t("trustness.hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <Link
                to="/contato?ref=trustness"
                className="bg-primary-container text-on-primary px-10 py-4 rounded-full font-display font-semibold text-sm shadow-xl shadow-primary-container/20 hover:scale-105 transition-transform"
              >
                {t("trustness.hero.cta1")}
              </Link>
              <a
                 href="#cases"
                className="flex items-center gap-2 text-white font-display font-medium text-sm hover:text-primary transition-colors group"
              >
                {t("trustness.hero.cta2")}<BlueDot />
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Por que importa */}
      <section className="py-24 px-8 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter">
                {t("trustness.why.title")}<BlueDot />
             </h2>
             <p className="mt-6 text-on-surface-variant max-w-2xl leading-relaxed font-light">
                {t("trustness.why.desc")}
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: t("trustness.why.items.sgsi.title"),
                subtitle: t("trustness.why.items.sgsi.subtitle"),
                description: t("trustness.why.items.sgsi.desc"),
                icon: FileCheck,
              },
              {
                title: t("trustness.why.items.lgpd.title"),
                subtitle: t("trustness.why.items.lgpd.subtitle"),
                description: t("trustness.why.items.lgpd.desc"),
                icon: ShieldCheck,
              },
              {
                title: t("trustness.why.items.exec.title"),
                subtitle: t("trustness.why.items.exec.subtitle"),
                description: t("trustness.why.items.exec.desc"),
                icon: Target,
              },
              {
                title: t("trustness.why.items.gap.title"),
                subtitle: t("trustness.why.items.gap.subtitle"),
                description: t("trustness.why.items.gap.desc"),
                icon: Lock,
              },
              {
                title: t("trustness.why.items.dpo.title"),
                subtitle: t("trustness.why.items.dpo.subtitle"),
                description: t("trustness.why.items.dpo.desc"),
                icon: Users,
                highlight: true
              }
            ].map((feature, i) => (
              <div key={i} className={`p-8 rounded-3xl border transition-colors group ${feature.highlight ? 'bg-primary-container/5 border-primary-container/20' : 'bg-surface-container border-white/5 hover:border-primary-container/30'}`}>
                <feature.icon className="text-primary-container mb-6 group-hover:scale-110 transition-transform" size={32} />
                <span className="text-[11px] text-primary-container font-bold uppercase tracking-widest block mb-2">{feature.title}</span>
                <h3 className="text-lg font-display text-white mb-3 tracking-tight leading-tight">{feature.subtitle}</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* DPO as a Service — Featured Banner */}
          <div className="mt-8 p-8 md:p-12 rounded-3xl bg-primary-container/5 border border-primary-container/20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <span className="text-[11px] text-primary-container font-bold uppercase tracking-widest block mb-3">serviço principal</span>
              <h3 className="text-2xl md:text-3xl font-display text-white mb-3 tracking-tight lowercase">
                dpo as a service<BlueDot />
              </h3>
              <p className="text-on-surface-variant font-light leading-relaxed max-w-xl">
                A trustness. assume o papel do Encarregado (DPO) da sua organização com tecnologia proprietária Aegis. Adequação, manutenção e auditoria contínua — sem ferramentas extras.
              </p>
            </div>
            <Link
              to="/dpo-as-a-service"
              className="bg-primary-container text-on-primary px-8 py-4 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all whitespace-nowrap shrink-0"
            >
              saiba mais
            </Link>
          </div>
        </div>
      </section>

      {/* Recursos Principais */}
      <section id="cases" className="py-24 px-8 bg-surface border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <h2 className="text-3xl md:text-4xl font-display font-medium text-white lowercase-all tracking-tighter">
                {t("trustness.resources.title")}<BlueDot />
             </h2>
             <p className="mt-4 text-on-surface-variant max-w-2xl font-light">{t("trustness.resources.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Target, title: t("trustness.resources.items.ass.title"), desc: t("trustness.resources.items.ass.desc") },
              { icon: FileCheck, title: t("trustness.resources.items.audit.title"), desc: t("trustness.resources.items.audit.desc") },
              { icon: ShieldCheck, title: t("trustness.resources.items.iso.title"), desc: t("trustness.resources.items.iso.desc") },
              { icon: Lock, title: t("trustness.resources.items.pen.title"), desc: t("trustness.resources.items.pen.desc") },
              { icon: ShieldAlert, title: t("trustness.resources.items.vuln.title"), desc: t("trustness.resources.items.vuln.desc") },
              { icon: PieChart, title: t("trustness.resources.items.gov.title"), desc: t("trustness.resources.items.gov.desc") },
              { icon: Users, title: t("trustness.resources.items.due.title"), desc: t("trustness.resources.items.due.desc") },
              { icon: GraduationCap, title: t("trustness.resources.items.train.title"), desc: t("trustness.resources.items.train.desc") },
              { icon: Scale, title: t("trustness.resources.items.reg.title"), desc: t("trustness.resources.items.reg.desc") },
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-surface-container border border-white/5 hover:border-primary-container/30 transition-colors group">
                <feature.icon className="text-primary-container mb-6 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-xl font-display text-white mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Magnet — Checklist LGPD */}
      <section className="py-20 px-8 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-8">
          <LeadMagnet
            slug="lgpd-checklist"
            title="checklist lgpd — 30 itens essenciais de conformidade"
            description="Avalie rapidamente a conformidade da sua organização com os requisitos da LGPD. Checklist prático com os 30 pontos mais críticos."
            items={[
              "Nomeação e comunicação do DPO à ANPD",
              "ROPA documentado e atualizado",
              "Política de privacidade publicada",
              "Gestão de consentimento de titulares",
              "Contratos DPA com fornecedores",
            ]}
          />

          {/* Assessment CTA */}
          <div className="p-8 md:p-10 rounded-3xl bg-surface-container border border-white/10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-3">
              <span className="text-[11px] text-primary-container font-bold uppercase tracking-widest block">assessment interativo</span>
              <h3 className="text-xl md:text-2xl font-display text-white tracking-tight lowercase">
                descubra sua maturidade lgpd em 3 minutos<BlueDot />
              </h3>
              <p className="text-sm text-on-surface-variant font-light leading-relaxed max-w-lg">
                Quiz gratuito com 10 perguntas que avalia governança, processos, tecnologia e pessoas. Receba seu score e recomendações personalizadas.
              </p>
            </div>
            <Link
              to="/assessment/lgpd"
              className="bg-white text-surface px-8 py-4 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:bg-primary-container hover:text-on-primary transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              iniciar assessment
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Métricas de Excelência */}
      <section className="py-24 px-8 bg-surface-container border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter mb-8">
                {t("trustness.metrics.title")}<BlueDot />
              </h2>
              <div className="space-y-6">
                {[0, 1, 2, 3].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/80 font-display">
                    <CheckCircle2 size={24} className="text-primary-container" />
                    <span>{t(`trustness.metrics.checks.${item}`)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: t("trustness.metrics.stats.fw.label"), value: t("trustness.metrics.stats.fw.value") },
                { label: t("trustness.metrics.stats.cert.label"), value: t("trustness.metrics.stats.cert.value") },
                { label: t("trustness.metrics.stats.comp.label"), value: t("trustness.metrics.stats.comp.value") },
                { label: t("trustness.metrics.stats.stake.label"), value: t("trustness.metrics.stats.stake.value") }
              ].map((m, i) => (
                <div key={i} className="p-8 rounded-3xl bg-surface-container-lowest border border-white/5 text-center">
                  <div className="text-3xl font-display text-white mb-2">{m.value}</div>
                  <div className="text-[11px] text-primary-container font-bold uppercase tracking-widest">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Processo de Auditoria */}
      <section className="py-24 px-8 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter">
                {t("trustness.process.title")}<BlueDot />
             </h2>
             <p className="mt-6 text-on-surface-variant max-w-2xl leading-relaxed font-light">
                {t("trustness.process.desc")}
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: t("trustness.process.steps.s1.step"), title: t("trustness.process.steps.s1.title"), desc: t("trustness.process.steps.s1.desc") },
              { step: t("trustness.process.steps.s2.step"), title: t("trustness.process.steps.s2.title"), desc: t("trustness.process.steps.s2.desc") },
              { step: t("trustness.process.steps.s3.step"), title: t("trustness.process.steps.s3.title"), desc: t("trustness.process.steps.s3.desc") },
              { step: t("trustness.process.steps.s4.step"), title: t("trustness.process.steps.s4.title"), desc: t("trustness.process.steps.s4.desc") },
              { step: t("trustness.process.steps.s5.step"), title: t("trustness.process.steps.s5.title"), desc: t("trustness.process.steps.s5.desc") },
            ].map((s, i) => (
              <div key={i} className="p-6 rounded-2xl bg-surface-container/50 border border-white/5">
                <span className="text-primary-container font-display text-xs font-bold block mb-4 tracking-widest">{s.step}</span>
                <h3 className="text-lg font-display text-white mb-2 leading-tight">{s.title}</h3>
                <p className="text-xs text-on-surface-variant font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-8 bg-surface">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-display font-medium text-white lowercase-all tracking-tighter">
            {t("trustness.cta.title")}<BlueDot />
          </h2>
          <p className="text-on-surface-variant text-lg font-light leading-relaxed">
            {t("trustness.cta.desc")}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-6">
            <Link
              to="/contato"
              className="bg-primary-container text-on-primary px-12 py-5 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all"
            >
              {t("trustness.cta.btn1")}
            </Link>
            <Link
              to="/contato"
              className="border border-white/10 text-white px-12 py-5 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              {t("trustness.cta.btn2")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
