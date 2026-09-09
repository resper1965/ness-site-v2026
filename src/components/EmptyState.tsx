import BlueDot from '../components/BlueDot';
import React from "react";
import { m as motion } from "motion/react";
import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  icon?: React.ElementType;
  titleKey?: string;
  subtitleKey?: string;
  title?: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  titleKey,
  subtitleKey,
  title,
  subtitle,
}) => {
  const { t } = useTranslation();

  const displayTitle = title ?? (titleKey ? t(titleKey) : t('common.empty_title'));
  const displaySubtitle = subtitle ?? (subtitleKey ? t(subtitleKey) : t('common.empty_subtitle'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-32 px-8 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-surface-container-low border border-white/5 flex items-center justify-center mb-8">
        <Icon className="text-primary-container/40" size={36} />
      </div>
      <h3 className="text-2xl font-display font-semibold text-white/60 mb-3 lowercase">
        {displayTitle}<BlueDot />
      </h3>
      <p className="text-sm text-on-surface-variant/60 font-normal max-w-md leading-relaxed">
        {displaySubtitle}
      </p>
    </motion.div>
  );
};

export default EmptyState;
