import React from "react";
import { m as motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldAlert, Fingerprint, HardDrive, Smartphone, Network, Clock, FileCheck, Scale, Activity, ShieldCheck, MessageSquare, Search, Lock, CheckCircle2 } from "lucide-react";
import BlueDot from "../../components/BlueDot";
import HeroPicture from "../../components/HeroPicture";
import { homeMeta, routeMeta } from '../../utils/meta';
import { useTranslation } from "react-i18next";

export default function ForenseHome() {
  const { t } = useTranslation();
  
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 z-0">
          <HeroPicture brand="forense" opacity={0.4} priority grayscale />
          <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/50 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
          {/* Intense blue glow to contrast with blue dot */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-container/10 blur-[120px] rounded-full z-10" />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl space-y-10"
          >
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-medium text-white leading-[1.05] tracking-tighter lowercase-all">
              forense<BlueDot />io<br />
              <span className="text-white/90 drop-shadow-[0_0_20px_rgba(0,173,232,0.4)]">{t("forense.hero.tag")}</span> {t("forense.hero.tag2")}
            </h1>
            <p className="text-lg md:text-2xl text-on-surface-variant max-w-3xl leading-relaxed font-light">
              {t("forense.hero.subtitle")}
            </p>
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <Link
                to="/contato?ref=forense"
                className="bg-primary-container text-on-primary px-8 md:px-10 py-4 rounded-full font-display font-semibold text-sm shadow-xl shadow-primary-container/25 transition-all hover:brightness-110 hover:shadow-[0_0_28px_rgba(0,173,232,0.4)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-lowest"
              >
                {t("forense.hero.cta1")}
              </Link>
              <a
                href="#resources"
                className="flex items-center gap-2 text-white font-display font-medium text-sm hover:text-primary transition-colors group"
              >
                {t("forense.hero.cta2")}
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
                {t("forense.why.title")}<BlueDot />
             </h2>
             <p className="mt-6 text-on-surface-variant max-w-2xl leading-relaxed font-light">
                {t("forense.why.desc")}
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: t("forense.why.items.ransomware.title"),
                subtitle: t("forense.why.items.ransomware.subtitle"),
                description: t("forense.why.items.ransomware.desc"),
                icon: ShieldAlert,
                className: 'lg:col-span-2'
              },
              {
                title: t("forense.why.items.datalen.title"),
                subtitle: t("forense.why.items.datalen.subtitle"),
                description: t("forense.why.items.datalen.desc"),
                icon: Network,
              },
              {
                title: t("forense.why.items.judicial.title"),
                subtitle: t("forense.why.items.judicial.subtitle"),
                description: t("forense.why.items.judicial.desc"),
                icon: Scale,
              },
              {
                title: t("forense.why.items.corp.title"),
                subtitle: t("forense.why.items.corp.subtitle"),
                description: t("forense.why.items.corp.desc"),
                icon: Fingerprint,
                className: 'lg:col-span-2'
              }
            ].map((feature, i) => (
              <div key={i} className={`p-8 rounded-3xl bg-surface-container border border-white/5 hover:border-primary-container/30 transition-colors group ${feature.className}`}>
                <feature.icon className="text-primary-container mb-6 group-hover:scale-110 transition-transform" size={32} />
                <span className="text-[11px] text-primary-container font-bold uppercase tracking-widest block mb-2">{feature.title}</span>
                <h3 className="text-lg font-display text-white mb-3 tracking-tight leading-tight">{feature.subtitle}</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Recursos Principais */}
      <section id="resources" className="py-24 px-8 bg-surface border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <h2 className="text-3xl md:text-4xl font-display font-medium text-white lowercase-all tracking-tighter">
                {t("forense.resources.title")}<BlueDot />
             </h2>
             <p className="mt-4 text-on-surface-variant max-w-2xl font-light">{t("forense.resources.desc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: HardDrive, title: t("forense.resources.items.disk.title"), desc: t("forense.resources.items.disk.desc") },
              { icon: Activity, title: t("forense.resources.items.ram.title"), desc: t("forense.resources.items.ram.desc") },
              { icon: Smartphone, title: t("forense.resources.items.mobile.title"), desc: t("forense.resources.items.mobile.desc") },
              { icon: Network, title: t("forense.resources.items.network.title"), desc: t("forense.resources.items.network.desc") },
              { icon: Clock, title: t("forense.resources.items.timeline.title"), desc: t("forense.resources.items.timeline.desc") },
              { icon: ShieldCheck, title: t("forense.resources.items.custodian.title"), desc: t("forense.resources.items.custodian.desc") },
              { icon: FileCheck, title: t("forense.resources.items.report.title"), desc: t("forense.resources.items.report.desc") },
              { icon: MessageSquare, title: t("forense.resources.items.testimony.title"), desc: t("forense.resources.items.testimony.desc") },
              { icon: Search, title: t("forense.resources.items.counter.title"), desc: t("forense.resources.items.counter.desc") },
              { icon: Lock, title: t("forense.resources.items.preservation.title"), desc: t("forense.resources.items.preservation.desc") },
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

      {/* Métricas Forenses */}
      <section className="py-24 px-8 bg-surface-container border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter mb-8">
                {t("forense.metrics.title")}<BlueDot />
              </h2>
              <div className="space-y-6">
                {[0, 1, 2, 3].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/80 font-display">
                    <CheckCircle2 size={24} className="text-primary-container" />
                    <span>{t(`forense.metrics.checks.${item}`)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: t("forense.metrics.stats.pericias.label"), value: t("forense.metrics.stats.pericias.value") },
                { label: t("forense.metrics.stats.laudos.label"), value: t("forense.metrics.stats.laudos.value") },
                { label: t("forense.metrics.stats.iso.label"), value: t("forense.metrics.stats.iso.value") },
                { label: t("forense.metrics.stats.assitencia.label"), value: t("forense.metrics.stats.assitencia.value") }
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

      {/* Processo Pericial */}
      <section className="py-24 px-8 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
             <h2 className="text-3xl md:text-5xl font-display font-medium text-white lowercase-all tracking-tighter">
                {t("forense.process.title")}<BlueDot />
             </h2>
             <p className="mt-6 text-on-surface-variant max-w-2xl leading-relaxed font-light">
                {t("forense.process.desc")}
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: t("forense.process.steps.s1.step"), title: t("forense.process.steps.s1.title"), desc: t("forense.process.steps.s1.desc") },
              { step: t("forense.process.steps.s2.step"), title: t("forense.process.steps.s2.title"), desc: t("forense.process.steps.s2.desc") },
              { step: t("forense.process.steps.s3.step"), title: t("forense.process.steps.s3.title"), desc: t("forense.process.steps.s3.desc") },
              { step: t("forense.process.steps.s4.step"), title: t("forense.process.steps.s4.title"), desc: t("forense.process.steps.s4.desc") },
              { step: t("forense.process.steps.s5.step"), title: t("forense.process.steps.s5.title"), desc: t("forense.process.steps.s5.desc") },
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
            {t("forense.cta.title")}<BlueDot />
          </h2>
          <p className="text-on-surface-variant text-lg font-light leading-relaxed">
            {t("forense.cta.desc")}
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-6">
            <Link
              to="/contato"
              className="inline-block bg-primary-container text-on-primary px-12 py-5 rounded-full font-display font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all"
            >
              {t("forense.cta.btn")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => homeMeta('forense', lang));
}
