import BlueDot from '../components/BlueDot';
import React, {  } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { 
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

  ShieldCheck, 
  Brain, 
  Scale, 
  Network} from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';



const Services = () => {
  const { t } = useTranslation();
  const services = [
    {
      title: "Consultoria em IA & Dados",
      desc: "Estratégia para implementação de copilotos e orquestração de conhecimento corporativo.",
      icon: Brain,
      tags: ["RAG", "LLM Ops", "Data Strategy"]
    },
    {
      title: "Resposta a Incidentes (IR)",
      desc: "Atuação tática em crises cibernéticas, contenção de danos e recuperação de ambientes.",
      icon: ShieldCheck,
      tags: ["War Room", "Forensics", "Crisis Mgmt"]
    },
    {
      title: "Engenharia de Plataforma",
      desc: "Design de arquiteturas escaláveis e pipelines de entrega contínua de alta performance.",
      icon: Network,
      tags: ["Cloud Native", "DevOps", "Scalability"]
    },
    {
      title: "Governança & Compliance",
      desc: "Automação de GRC e adequação dinâmica a normas globais e regulamentações.",
      icon: Scale,
      tags: ["ISO 27001", "LGPD", "Risk Audit"]
    }
  ];

  return (
    <section id="serviços" className="py-24 bg-surface-container-lowest px-8 border-t border-white/5 relative overflow-hidden">
      {/* Immersive Background for Services */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2000"
          alt="Professional Services Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
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
                  <span key={tag} className="text-[10px] uppercase tracking-widest text-primary-container/60 font-bold px-3 py-1 rounded-full bg-primary-container/5 border border-primary-container/10">
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
