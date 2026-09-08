import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

/** Discrete breadcrumb trail for navigation and SEO rich snippets */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const location = useLocation();

  const crumbs: Crumb[] = [{ label: "ness.", to: "/" }, ...items];

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest font-bold"
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <ChevronRight
                size={10}
                className="text-on-surface-variant/70 shrink-0"
              />
            )}
            {isLast || !crumb.to ? (
              <span className="text-primary-container truncate max-w-[200px]">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.to}
                className="text-on-surface-variant/70 hover:text-on-surface-variant transition-colors truncate max-w-[120px]"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
