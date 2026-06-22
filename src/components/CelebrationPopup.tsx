import BlueDot from '../components/BlueDot';
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { 
PartyPopper} from "lucide-react";

import { FOUNDATION_YEAR, CURRENT_YEAR, YEARS_OF_LEGACY } from '../constants/brand';

const CELEBRATION_CONFIG = {
  active: true,
  startDate: '1991-06-12', // fundação da ness.
  durationDays: 7,
  foundationYear: FOUNDATION_YEAR,
  currentYear: CURRENT_YEAR
};

const CelebrationPopup = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem("ness_35_celebration_seen_v2");
    if (CELEBRATION_CONFIG.active && !hasSeen) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setShow(false);
    localStorage.setItem("ness_35_celebration_seen_v2", "true");
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-surface/80 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-surface-container-low rounded-[3rem] border border-primary-container/30 nebula-shadow p-12 text-center overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-primary-container/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-primary-container/10 border border-primary-container/20 flex items-center justify-center mx-auto mb-8">
                <PartyPopper className="text-primary-container" size={40} />
              </div>
              
              <div className="text-primary-container font-mono text-xs uppercase tracking-[0.3em] mb-4">
                ness. legacy — {CELEBRATION_CONFIG.foundationYear}-{CELEBRATION_CONFIG.currentYear}
              </div>
              
              <h2 className="text-4xl font-display font-bold text-white mb-6 tracking-tighter lowercase-all">
                {t('celebration.title', { years: YEARS_OF_LEGACY, defaultValue: `${YEARS_OF_LEGACY} anos de tecnologia de precisão` })}<BlueDot />
              </h2>
              
              <p className="text-on-surface-variant font-light leading-relaxed mb-10">
                {t('celebration.message', { years: YEARS_OF_LEGACY, defaultValue: `estamos celebrando ${YEARS_OF_LEGACY} anos de inovação, resiliência e parcerias de sucesso. obrigado por fazer parte da nossa história.` })}
              </p>
              
              <button 
                onClick={closePopup}
                className="bg-primary-container text-on-primary px-12 py-4 rounded-full font-display font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-xl shadow-primary-container/20"
              >
                {t('celebration.continue_btn', 'continuar navegando')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};


export default CelebrationPopup;
