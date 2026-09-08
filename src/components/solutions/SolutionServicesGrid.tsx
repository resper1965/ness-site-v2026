import React from 'react';
import { m as motion } from 'motion/react';
import BlueDot from '../BlueDot';

interface ServiceItem {
  name: string;
  desc: string;
}

interface SolutionServicesGridProps {
  services: ServiceItem[];
  t: (key: string, defaultString: string) => string;
  icon: React.ElementType;
}

const SolutionServicesGrid: React.FC<SolutionServicesGridProps> = ({ services, t, icon: Icon }) => {
  return (
    <section id="serviços" className="mb-24">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-display font-semibold text-white tracking-tight lowercase">
          {t('solutions.strategic_solutions', 'soluções estratégicas')}<BlueDot />
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.02 }}
            className="group relative p-10 rounded-4xl border border-white/5 bg-surface-container-low/30 hover:bg-surface-container-low/50 overflow-hidden transition-all flex flex-col justify-between"
          >
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
            <div className="absolute top-8 right-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
              <Icon size={140} />
            </div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-primary-container/20 flex items-center justify-center mb-8 border border-primary-container/20 shadow-[0_0_20px_rgba(var(--primary-container-rgb),0.15)] group-hover:shadow-[0_0_30px_rgba(var(--primary-container-rgb),0.3)] transition-shadow">
                <Icon className="text-primary-container" size={26} />
              </div>
              <h4 className="text-white font-display text-xl lg:text-2xl font-semibold mb-4 tracking-tight drop-shadow-md group-hover:text-primary-container transition-colors">
                {service.name}
              </h4>
              <p className="text-on-surface-variant font-light leading-relaxed flex-1">
                {service.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SolutionServicesGrid;
