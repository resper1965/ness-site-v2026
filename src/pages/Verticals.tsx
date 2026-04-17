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
  Fingerprint, 
  ArrowUpRight} from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';



const Verticals = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-surface px-8 border-t border-white/5 relative overflow-hidden">
      {/* Immersive Background for Verticals */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 1.5 }}
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
          alt="Corporate Verticals Background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-linear-to-b from-surface/40 via-surface/90 to-surface z-10"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-display font-semibold tracking-tighter mb-6 text-white lowercase-all">
              {t('verticals.title')}<BlueDot />
            </h2>
            <p className="text-on-surface-variant text-lg font-light">
              {t('verticals.subtitle')}
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <motion.a 
            href="/forense"
            whileHover={{ scale: 1.02 }}
            className="block relative group cursor-pointer border border-white/5 p-12 rounded-[3rem] bg-surface-container-low/20 hover:bg-surface-container-low/40 transition-all"
          >
            <div className="mb-8 w-16 h-16 rounded-2xl bg-primary-container/5 border border-primary-container/10 flex items-center justify-center">
              <Fingerprint className="text-primary-container" size={40} />
            </div>
            <h3 className="text-3xl mb-4 text-white font-brand font-medium lowercase-all">
              forense<span className="text-primary-container">.</span>io
            </h3>
            <p className="text-on-surface-variant leading-relaxed font-light">
              líder em investigação digital e resposta a incidentes complexos. unimos tecnologia proprietária e expertise humana para desvendar o invisível.
            </p>
            <div className="mt-8 flex items-center gap-2 text-[10px] text-primary-container uppercase tracking-widest font-bold">
              explorar unidade <ArrowUpRight size={14} />
            </div>
          </motion.a>

          <motion.a 
            href="/trustness"
            whileHover={{ scale: 1.02 }}
            className="block relative group cursor-pointer border border-white/5 p-12 rounded-[3rem] bg-surface-container-low/20 hover:bg-surface-container-low/40 transition-all"
          >
            <div className="mb-8 w-16 h-16 rounded-2xl bg-primary-container/5 border border-primary-container/10 flex items-center justify-center">
              <ShieldCheck className="text-primary-container" size={40} />
            </div>
            <h3 className="text-3xl mb-4 text-white font-brand font-medium lowercase-all">
              trustness<BlueDot />
            </h3>
            <p className="text-on-surface-variant leading-relaxed font-light">
              consultoria estratégica em governança, riscos e conformidade. criando alicerces sólidos para que sua empresa cresça com segurança e ética.
            </p>
            <div className="mt-8 flex items-center gap-2 text-[10px] text-primary-container uppercase tracking-widest font-bold">
              explorar unidade <ArrowUpRight size={14} />
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
};


export default Verticals;
