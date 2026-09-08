/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import BlueDot from '../components/BlueDot';
import React from "react";
import { m as motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { routeMeta, traduzir } from '../utils/meta';
import { ShieldCheck, Brain, Scale, Network } from "lucide-react";

const ICONS = [Brain, ShieldCheck, Network, Scale];

const Services = () => {
  const { t } = useTranslation();

  const services = [0, 1, 2, 3].map((i) => ({
    title: t(`services.items.${i}.title`),
    desc: t(`services.items.${i}.desc`),
    icon: ICONS[i],
    tags: (t(`services.items.${i}.tags`, { returnObjects: true }) as string[])
  }));

  return (
    <section id="serviços" className="py-24 bg-surface-container-lowest px-8 border-t border-white/5 relative overflow-hidden">
      {/* Immersive Background for Services */}
      <div className="absolute inset-0 z-0 bg-nebula" aria-hidden="true">
        <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-display font-semibold tracking-tighter mb-6 text-white lowercase-all">
              {t('nav.services')}<BlueDot />
            </h2>
            <p className="text-on-surface-variant text-lg font-light">
              {t('services.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-[2.5rem] bg-surface-container-low/30 border border-white/5 hover:bg-surface-container-low/50 transition-all flex flex-col h-full group"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <service.icon className="text-primary-container" size={24} />
              </div>
              <h3 className="text-xl font-medium text-white mb-4">{service.title}</h3>
              <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8 flex-1">
                {service.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="text-[11px] uppercase tracking-widest text-primary-container/60 font-bold px-3 py-1 rounded-full bg-primary-container/5 border border-primary-container/10">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;


export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, (_brand, lang) => {
    const t = traduzir(lang);
    return {
    title: t('nav.services', 'serviços'),
    description: {
      pt: 'Serviços da ness. em infraestrutura crítica, segurança cibernética, engenharia de software, privacidade e perícia digital.',
      en: 'ness. services in critical infrastructure, cybersecurity, software engineering, privacy and digital forensics.',
      es: 'Servicios de ness. en infraestructura crítica, ciberseguridad, ingeniería de software, privacidad y peritaje digital.',
    }[lang],
  };
  });
}
