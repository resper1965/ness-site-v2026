import React from 'react';
import { motion } from 'motion/react';

interface SolutionHeroBackgroundProps {
  bgImage: string;
  slug: string;
}

const SolutionHeroBackground: React.FC<SolutionHeroBackgroundProps> = ({ bgImage, slug }) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <motion.img 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.3 }}
        transition={{ duration: 1.5 }}
        src={bgImage}
        alt={`ness. ${slug} background`}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 z-10"></div>
    </div>
  );
};

export default SolutionHeroBackground;
