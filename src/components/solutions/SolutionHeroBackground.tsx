import React from 'react';

interface SolutionHeroBackgroundProps {
  slug: string;
}

/** Fundo do hero das soluções em CSS puro (antes: foto de 500 kB a 30 % de opacidade). */
const SolutionHeroBackground: React.FC<SolutionHeroBackgroundProps> = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none bg-nebula" aria-hidden="true">
      <div className="absolute inset-0 bg-linear-to-b from-surface-container-lowest/40 via-surface-container-lowest/90 to-surface-container-lowest z-10"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 z-10"></div>
    </div>
  );
};

export default SolutionHeroBackground;
