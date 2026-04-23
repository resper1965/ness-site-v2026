import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { BRAND, BRAND_DOMAINS, BRAND_LABELS } from '../config/brand';

interface PageMeta {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
}

/**
 * Sets document title, meta description, Open Graph, Twitter Card, and canonical URL.
 * Backwards compatible: usePageMeta('key', 'fallback') works like old usePageTitle.
 */
export function usePageMeta(titleKeyOrMeta: string | PageMeta, fallback?: string) {
  const { t, i18n } = useTranslation();
  const brandLabel = BRAND_LABELS[BRAND];
  const domain = BRAND_DOMAINS[BRAND];

  useEffect(() => {
    let title: string;
    let description: string | undefined;
    let image: string | undefined;
    let type = 'website';
    let noindex = false;

    if (typeof titleKeyOrMeta === 'string') {
      // Backwards-compatible mode
      title = fallback ?? t(titleKeyOrMeta);
      description = undefined;
    } else {
      title = titleKeyOrMeta.title || '';
      description = titleKeyOrMeta.description;
      image = titleKeyOrMeta.image;
      type = titleKeyOrMeta.type || 'website';
      noindex = titleKeyOrMeta.noindex || false;
    }

    // Title
    const fullTitle = title ? `${title} — ${brandLabel} IT Company` : `${brandLabel} IT Company`;
    document.title = fullTitle;

    // Helper to set/update meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Description
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', `${domain}${window.location.pathname}`);
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }

    // Twitter Card
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${domain}${window.location.pathname}`);

    // Robots
    if (noindex) {
      setMeta('name', 'robots', 'noindex, nofollow');
    }

  }, [titleKeyOrMeta, fallback, t, i18n.language, brandLabel, domain]);
}

// Backwards compatibility alias
export const usePageTitle = usePageMeta;
