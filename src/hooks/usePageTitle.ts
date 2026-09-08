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

interface PageMetaOptions {
  /**
   * Quando `false`, o hook não toca no <head>. Usado por componentes que são
   * ao mesmo tempo rota própria e seção da home (Solutions, Services, ...):
   * como seção, eles não podem sobrescrever o título da página que os contém.
   */
  enabled?: boolean;
}

/**
 * Sets document title, meta description, Open Graph, Twitter Card, canonical URL and robots.
 * Backwards compatible: usePageMeta('key', 'fallback') works like old usePageTitle.
 */
export function usePageMeta(titleKeyOrMeta: string | PageMeta, fallback?: string, options: PageMetaOptions = {}) {
  const { t, i18n } = useTranslation();
  const brandLabel = BRAND_LABELS[BRAND];
  const domain = BRAND_DOMAINS[BRAND];
  const enabled = options.enabled !== false;

  useEffect(() => {
    if (!enabled) return;

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
    const url = `${domain}${window.location.pathname}`;
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    const ogImage = image || `${domain}/og-image.jpg`;
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:image', ogImage);

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
    canonical.setAttribute('href', url);

    // Robots — sempre redefinido, para uma página noindex não "vazar" para a próxima
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

  }, [titleKeyOrMeta, fallback, t, i18n.language, brandLabel, domain, enabled]);
}

// Backwards compatibility alias
export const usePageTitle = usePageMeta;
