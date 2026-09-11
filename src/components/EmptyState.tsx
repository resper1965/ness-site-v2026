import BlueDot from '../components/BlueDot';
import React from "react";
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
    <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
      <div className="w-20 h-20 rounded-3xl bg-surface-container-low border border-white/5 flex items-center justify-center mb-8">
        <Icon className="text-primary-container/40" size={36} aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-display font-semibold text-white/80 mb-3 lowercase">
        {displayTitle}<BlueDot />
      </h2>
      <p className="text-sm text-on-surface-variant/80 font-normal max-w-md leading-relaxed">
        {displaySubtitle}
      </p>
    </div>
  );
};

export default EmptyState;
