import React from 'react';
import { BRAND, BRAND_DOMAINS } from '../config/brand';
import { FOUNDATION_YEAR, YEARS_OF_LEGACY } from '../constants/brand';

interface SchemaOrgProps {
  type?: 'organization' | 'website' | 'article' | 'faq' | 'service' | 'breadcrumb';
  data?: Record<string, unknown>;
}

function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://ness.com.br/#organization',
    name: 'ness. IT Company',
    alternateName: ['NESS Tecnologia', 'ness.', 'Ness IT'],
    url: 'https://ness.com.br',
    logo: {
      '@type': 'ImageObject',
      url: 'https://ness.com.br/favicon.svg',
    },
    foundingDate: '1991-06-12',
    description: `Empresa brasileira de tecnologia de precisão desde 1991. ${YEARS_OF_LEGACY} anos de experiência em infraestrutura crítica, segurança cibernética (DevSecOps), LGPD, investigação forense e engenharia de software B2B.`,
    slogan: 'tecnologia digital de precisão',
    knowsAbout: [
      'DevSecOps', 'Cybersecurity', 'LGPD', 'Digital Forensics',
      'Infrastructure Operations', 'Software Engineering', 'AI Operations',
      'GRC', 'ISO 27001', 'Penetration Testing', 'Incident Response',
    ],
    sameAs: [
      'https://www.linkedin.com/company/nesstec',
      'https://www.instagram.com/ness.tecnologia/',
      'https://www.facebook.com/nesstecnologia',
      'https://trustness.com.br',
      'https://forense.io',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'commercial',
      telephone: '+55-11-2504-7650',
      email: 'contato@ness.com.br',
      availableLanguage: ['Portuguese', 'English', 'Spanish'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua George Ohm, 230 - Torre A, Cj 82',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      postalCode: '04576-020',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.6086,
      longitude: -46.6936,
    },
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      minValue: 10,
      maxValue: 50,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Brazil'
    },
  };
}

function getWebSiteSchema() {
  const domain = BRAND_DOMAINS[BRAND];
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${domain}/#website`,
    url: domain,
    name: BRAND === 'ness' ? 'ness. IT Company' : BRAND === 'trustness' ? 'trustness. GRC & Compliance' : 'forense.io — Perícia Digital',
    description: BRAND === 'ness'
      ? 'Plataforma modular de transformação digital corporativa B2B'
      : BRAND === 'trustness'
        ? 'Governança, Risco e Compliance para corporações nacionais'
        : 'Perícia digital, resposta a incidentes e investigação forense computacional',
    publisher: { '@id': 'https://ness.com.br/#organization' },
    inLanguage: ['pt-BR', 'en', 'es'],
  };
}

function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

function getFAQSchema(questions: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}

function getServiceSchema(service: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': service.url,
    name: service.name,
    description: service.description,
    provider: { '@id': 'https://ness.com.br/#organization' },
    areaServed: { '@type': 'Country', name: 'Brazil' },
    serviceType: 'IT Services',
  };
}

function getArticleSchema(article: { title: string; description: string; url: string; datePublished: string; image?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    datePublished: article.datePublished,
    dateModified: article.datePublished,
    image: article.image || 'https://ness.com.br/og-image.png',
    publisher: { '@id': 'https://ness.com.br/#organization' },
    author: { '@id': 'https://ness.com.br/#organization' },
    inLanguage: 'pt-BR',
  };
}

export default function SchemaOrg({ type = 'organization', data }: SchemaOrgProps) {
  let schema: unknown;

  switch (type) {
    case 'organization':
      schema = [getOrganizationSchema(), getWebSiteSchema()];
      break;
    case 'website':
      schema = getWebSiteSchema();
      break;
    case 'breadcrumb':
      schema = getBreadcrumbSchema(data?.items as { name: string; url: string }[] || []);
      break;
    case 'faq':
      schema = getFAQSchema(data?.questions as { question: string; answer: string }[] || []);
      break;
    case 'service':
      schema = getServiceSchema(data as unknown as { name: string; description: string; url: string });
      break;
    case 'article':
      schema = getArticleSchema(data as unknown as { title: string; description: string; url: string; datePublished: string; image?: string });
      break;
    default:
      schema = getOrganizationSchema();
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

// Re-export for convenience
export { getOrganizationSchema, getWebSiteSchema, getBreadcrumbSchema, getFAQSchema, getServiceSchema, getArticleSchema };
