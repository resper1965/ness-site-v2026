import React, {  } from "react";
import { useTranslation } from "react-i18next";
import { 
Globe, 
  Network} from "lucide-react";

// Celebration Configuration
const FOUNDATION_YEAR = 1991;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_OF_LEGACY = CURRENT_YEAR - FOUNDATION_YEAR;



const Presence = () => {
  const { t } = useTranslation();
  const locations = [
    t('presence.locations.brazil'),
    t('presence.locations.portugal'),
    t('presence.locations.chile'),
    t('presence.locations.peru'),
    t('presence.locations.colombia'),
    t('presence.locations.usa')
  ];
  return (
    <section className="py-12 bg-surface border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60">
          <div className="flex items-center gap-2">
            <Globe className="text-primary-container" size={20} />
            <span className="text-on-surface-variant text-xs tracking-widest uppercase font-bold">{t('presence.global')}</span>
          </div>
          {locations.map((loc) => (
            <div key={loc} className="flex items-center gap-2">
              <Network className="text-on-surface-variant/50" size={14} />
              <span className="text-on-surface-variant text-sm lowercase-all">{loc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



export default Presence;
