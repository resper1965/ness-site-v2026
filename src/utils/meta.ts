import { BRAND_DOMAINS, BRAND_SITE_NAME, BRAND_TITLE_SUFFIX, type Brand } from '../config/brand';
import i18n from '../i18n';
import { IDIOMAS, IDIOMA_PADRAO, rotaNoIdioma, type Idioma } from './lang';

export type PageMeta = {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  /** Página que não existe em en/es: não deve anunciar alternates. */
  semAlternates?: boolean;
};

/** Um texto nos três idiomas, para o que não existe como chave do i18n. */
export type Trad = Record<Idioma, string>;

/**
 * Tradução dentro do `meta`, que roda fora da árvore React e não tem acesso
 * ao useTranslation. O bundle do idioma já foi carregado pelo loader da raiz.
 */
export function traduzir(lang: Idioma) {
  return i18n.getFixedT(lang);
}

/**
 * A marca da requisição, publicada pelo loader da raiz. O `meta` de uma rota
 * não recebe a marca direto — ela desce pelas rotas casadas.
 */
export function brandFromMatches(matches: { id: string; data?: unknown }[] | undefined): Brand {
  const root = matches?.find((m) => m.id === 'root')?.data as { brand?: Brand } | undefined;
  return root?.brand ?? 'ness';
}

/**
 * Os metadados de uma página, renderizados no servidor.
 *
 * O React Router não mescla `meta` de pai e filho: o da rota mais profunda
 * substitui o da raiz inteiro. Por isso esta função devolve o conjunto
 * completo — quem exporta `meta` numa página não pode herdar metade da raiz.
 *
 * O canonical usa sempre o domínio de produção da marca, nunca a origem que
 * respondeu: é o que impede uma URL de preview de se declarar canônica.
 */
export function pageMeta(brand: Brand, pathname: string, meta: PageMeta, lang: Idioma = IDIOMA_PADRAO) {
  const domain = BRAND_DOMAINS[brand];
  const sufixo = BRAND_TITLE_SUFFIX[brand];
  const title = meta.title ? `${meta.title} — ${sufixo}` : sufixo;
  const url = domain + pathname;
  const image = meta.image || `${domain}/og-image.jpg`;
  const description = meta.description ?? BRAND_DEFAULT_META[brand].description;

  return [
    { title },
    { name: 'description', content: description },
    { name: 'author', content: 'NESS Tecnologia' },
    { name: 'robots', content: meta.noindex ? 'noindex, nofollow' : 'index, follow' },
    { name: 'theme-color', content: '#060e20' },
    { name: 'color-scheme', content: 'dark' },
    { property: 'og:site_name', content: BRAND_SITE_NAME[brand] },
    { property: 'og:type', content: meta.type || 'website' },
    { property: 'og:url', content: url },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { property: 'og:locale', content: lang === 'pt' ? 'pt_BR' : lang },
    { tagName: 'link', rel: 'canonical', href: url },
    // hreflang de verdade: o sitemap declarava os três idiomas apontando para
    // a mesma URL, o que o Google ignora. Agora cada idioma tem endereço.
    ...(meta.semAlternates
      ? []
      : IDIOMAS.map((idioma) => ({
          tagName: 'link' as const,
          rel: 'alternate',
          hrefLang: idioma,
          href: BRAND_DOMAINS[brand] + rotaNoIdioma(pathname, idioma),
        }))),
  ];
}

/** Atalho para a assinatura que toda rota usa. */
export function routeMeta(
  args: { matches?: { id: string; data?: unknown }[]; location?: { pathname: string } },
  meta: PageMeta | ((brand: Brand, lang: Idioma) => PageMeta),
) {
  const brand = brandFromMatches(args.matches);
  const lang = idiomaDosMatches(args.matches);
  const resolved = typeof meta === 'function' ? meta(brand, lang) : meta;
  return pageMeta(brand, args.location?.pathname ?? '/', resolved, lang);
}

/** O idioma da requisição, publicado pelo loader da raiz. */
export function idiomaDosMatches(matches: { id: string; data?: unknown }[] | undefined): Idioma {
  const root = matches?.find((m) => m.id === 'root')?.data as { lang?: Idioma } | undefined;
  return root?.lang ?? IDIOMA_PADRAO;
}

/**
 * Fallback da marca, usado pelas rotas que não declaram `meta` própria.
 *
 * O título aqui é só a parte específica: `pageMeta` acrescenta o sufixo da
 * marca. Repetir o sufixo nesta string produz o título dobrado.
 */
export const BRAND_DEFAULT_META: Record<Brand, Required<Pick<PageMeta, 'title' | 'description'>>> = {
  ness: {
    title: 'tecnologia de precisão desde 1991',
    description:
      'Plataforma modular de transformação digital corporativa B2B — infraestrutura crítica, segurança cibernética, LGPD, investigação forense e engenharia de software de alta performance.',
  },
  trustness: {
    title: 'governança, risco e compliance',
    description:
      'trustness. é a vertical de GRC da ness. Consultoria em LGPD, ISO 27001, gestão de riscos, auditoria de segurança, pentest e DPO as a Service para corporações nacionais.',
  },
  forense: {
    title: 'perícia digital e investigação forense',
    description:
      'forense.io — Perícia digital, resposta a incidentes, análise de ransomware, preservação de evidências e assistência técnica judicial. Laudos com validade processual e cadeia de custódia ISO 27037.',
  },
};

/**
 * A home de cada marca. Serve para "/" (que muda conforme o Host) e também
 * para /trustness e /forense, acessíveis a partir de qualquer domínio.
 */
/**
 * A home de cada marca, nos três idiomas. Serve para "/" (que muda conforme o
 * Host) e também para /trustness e /forense, acessíveis de qualquer domínio.
 */
export function homeMeta(brand: Brand, lang: Idioma): PageMeta {
  const t = traduzir(lang);
  if (brand === 'trustness') {
    return {
      title: { pt: 'governança, risco e compliance', en: 'governance, risk and compliance', es: 'gobernanza, riesgo y cumplimiento' }[lang],
      description: BRAND_DEFAULT_META.trustness.description,
    };
  }
  if (brand === 'forense') {
    return {
      title: { pt: 'perícia digital e investigação forense', en: 'digital forensics and investigation', es: 'peritaje digital e investigación forense' }[lang],
      description: BRAND_DEFAULT_META.forense.description,
    };
  }
  return {
    title: t('hero.tag', 'tecnologia digital de precisão'),
    description: {
      pt: 'ness. é uma plataforma modular de transformação digital corporativa B2B desde 1991. Especialistas em DevSecOps, LGPD, segurança cibernética, perícia digital e engenharia de software de alta performance.',
      en: 'ness. is a modular B2B digital transformation platform since 1991. Specialists in DevSecOps, privacy compliance, cybersecurity, digital forensics and high-performance software engineering.',
      es: 'ness. es una plataforma modular de transformación digital corporativa B2B desde 1991. Especialistas en DevSecOps, privacidad, ciberseguridad, peritaje digital e ingeniería de software de alto rendimiento.',
    }[lang],
  };
}
