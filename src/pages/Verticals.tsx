/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import BlueDot from '../components/BlueDot';
import React from "react";
import { m as motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { routeMeta } from '../utils/meta';
import { ShieldCheck, Fingerprint, ArrowUpRight } from "lucide-react";

const Verticals = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-surface px-8 border-t border-white/5 relative overflow-hidden">
      {/* Immersive Background for Verticals */}
      <div className="absolute inset-0 z-0 bg-nebula" aria-hidden="true">
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
              {t('verticals.forense.desc')}
            </p>
            <div className="mt-8 flex items-center gap-2 text-[11px] text-primary-container uppercase tracking-widest font-bold">
              {t('verticals.cta')} <ArrowUpRight size={14} />
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
              {t('verticals.trustness.desc')}
            </p>
            <div className="mt-8 flex items-center gap-2 text-[11px] text-primary-container uppercase tracking-widest font-bold">
              {t('verticals.cta')} <ArrowUpRight size={14} />
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default Verticals;


export function meta(args: Parameters<typeof routeMeta>[0]) {
  return routeMeta(args, {
    title: 'verticais',
    description: 'Como a ness. atende saúde, finanças, indústria e setor público — com os requisitos regulatórios de cada um.',
  });
}
