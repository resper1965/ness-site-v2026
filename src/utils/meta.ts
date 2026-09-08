import { BRAND_DOMAINS, BRAND_LABELS, type Brand } from '../config/brand';

export type PageMeta = {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
};

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
export function pageMeta(brand: Brand, pathname: string, meta: PageMeta) {
  const domain = BRAND_DOMAINS[brand];
  const title = meta.title ? `${meta.title} — ${BRAND_LABELS[brand]} IT Company` : `${BRAND_LABELS[brand]} IT Company`;
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
    { property: 'og:type', content: meta.type || 'website' },
    { property: 'og:url', content: url },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: image },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:locale', content: 'pt_BR' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { tagName: 'link', rel: 'canonical', href: url },
  ];
}

/** Atalho para a assinatura que toda rota usa. */
export function routeMeta(
  args: { matches?: { id: string; data?: unknown }[]; location?: { pathname: string } },
  meta: PageMeta | ((brand: Brand) => PageMeta),
) {
  const brand = brandFromMatches(args.matches);
  const resolved = typeof meta === 'function' ? meta(brand) : meta;
  return pageMeta(brand, args.location?.pathname ?? '/', resolved);
}

/**
 * Fallback da marca, usado pelas rotas que não declaram `meta` própria.
 *
 * O título aqui é só a parte específica: `pageMeta` acrescenta o sufixo da
 * marca. Repetir "ness. IT Company" nesta string produz o título dobrado.
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
export const HOME_META: Record<Brand, PageMeta> = {
  ness: {
    title: 'tecnologia digital de precisão',
    description:
      'ness. é uma plataforma modular de transformação digital corporativa B2B desde 1991. Especialistas em DevSecOps, LGPD, segurança cibernética, perícia digital e engenharia de software de alta performance.',
  },
  trustness: {
    title: 'governança, risco e compliance',
    description: BRAND_DEFAULT_META.trustness.description,
  },
  forense: {
    title: 'perícia digital e investigação forense',
    description: BRAND_DEFAULT_META.forense.description,
  },
};
