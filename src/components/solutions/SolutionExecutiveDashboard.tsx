import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import ChatPreview from '../ChatPreview';

interface SolutionDashboardProps {
  slug: string;
  dashboard?: {
    title?: string;
    mainStat: { value: string; label: string };
    metrics: { color: string; value: string; label: string }[];
    progress: { label: string; value: string; subLabel: string };
  };
}

const SolutionExecutiveDashboard: React.FC<SolutionDashboardProps> = ({ slug, dashboard }) => {
  const { t } = useTranslation();

  if (slug === 'autoops') {
    return <ChatPreview />;
  }

  return (
    <div className="relative glass p-8 md:p-12 rounded-[3rem] border border-white/10 nebula-shadow overflow-hidden">
      <div className="absolute top-0 right-0 p-6">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">
            {t('solutions.active_resilience')}
          </span>
        </div>
      </div>
      
      <div className="space-y-10">
        <div className="flex justify-between items-end">
          <h3 className="text-xs uppercase tracking-[0.2em] text-primary font-bold">
            {dashboard?.title || 'executive dashboard'}
          </h3>
          <div className="text-right">
            <div className="text-3xl font-display font-bold text-white tracking-tighter">
              {dashboard?.mainStat.value || '99.9%'}
            </div>
            <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">
              {dashboard?.mainStat.label || 'uptime operacional'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {dashboard?.metrics.map((metric, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <motion.div 
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                className={`${metric.color} text-xl font-bold mb-1`}
              >
                {metric.value}
              </motion.div>
              <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
              {dashboard?.progress.label}
            </h4>
            <span className="text-[10px] text-primary font-mono">
              {dashboard?.progress.value} {dashboard?.progress.subLabel}
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: dashboard?.progress.value }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-linear-to-r from-primary to-primary-container"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionExecutiveDashboard;
