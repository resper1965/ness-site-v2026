/**
 * Canal CMS — Collection Definitions (code-first, Payload-inspired)
 *
 * Cada collection define o tipo de conteúdo, seus campos e comportamentos.
 * Essas definições alimentam a API CRUD genérica e o admin panel.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'slug'
  | 'select'
  | 'date'
  | 'number'
  | 'boolean'
  | 'json'
  | 'image'
  | 'relation'

export interface FieldDef {
  name: string
  type: FieldType
  label?: string
  required?: boolean
  defaultValue?: unknown
  options?: string[]       // para type: 'select'
  from?: string            // para type: 'slug' — campo de origem
  relation?: string        // para type: 'relation' — slug da collection alvo
}

export interface CollectionDef {
  slug: string
  label: string
  labelPlural?: string
  icon: string
  hasLocale: boolean       // se entries têm campo locale
  hasSlug: boolean         // se entries têm campo slug
  hasStatus: boolean       // se entries têm draft/published
  fields: FieldDef[]
}

// ── Definições das Collections ──────────────────────────────────

export const collections: CollectionDef[] = [
  {
    slug: 'insights',
    label: 'Insight',
    labelPlural: 'Insights',
    icon: 'FileText',
    hasLocale: true,
    hasSlug: true,
    hasStatus: true,
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Título' },
      { name: 'tag', type: 'select', label: 'Tag', options: [
        'Segurança', 'IA', 'Cloud', 'Infraestrutura', 'Dados',
        'Compliance', 'DevOps', 'Telecom', 'Tendências'
      ]},
      { name: 'icon', type: 'text', label: 'Ícone', defaultValue: 'FileText' },
      { name: 'date', type: 'date', required: true, label: 'Data' },
      { name: 'desc', type: 'textarea', label: 'Descrição' },
      { name: 'body', type: 'richtext', label: 'Conteúdo' },
      { name: 'cover', type: 'image', label: 'Imagem de Capa' },
      { name: 'featured', type: 'boolean', label: 'Destaque', defaultValue: false },
    ]
  },
  {
    slug: 'cases',
    label: 'Case',
    labelPlural: 'Cases',
    icon: 'Briefcase',
    hasLocale: true,
    hasSlug: true,
    hasStatus: true,
    fields: [
      { name: 'client', type: 'text', required: true, label: 'Cliente' },
      { name: 'category', type: 'select', label: 'Categoria', options: [
        'infraestrutura', 'segurança', 'cloud', 'telecomunicações',
        'dados', 'compliance', 'ia'
      ]},
      { name: 'project', type: 'text', required: true, label: 'Projeto' },
      { name: 'result', type: 'text', label: 'Resultado' },
      { name: 'desc', type: 'textarea', label: 'Descrição' },
      { name: 'stats', type: 'text', label: 'Estatísticas' },
      { name: 'image', type: 'image', label: 'Imagem' },
      { name: 'featured', type: 'boolean', label: 'Destaque', defaultValue: false },
    ]
  },
  {
    slug: 'jobs',
    label: 'Vaga',
    labelPlural: 'Vagas',
    icon: 'Users',
    hasLocale: true,
    hasSlug: false,
    hasStatus: true,
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Título' },
      { name: 'vertical', type: 'select', label: 'Vertical', options: [
        'engenharia', 'segurança', 'comercial', 'operações', 'dados'
      ]},
      { name: 'location', type: 'text', required: true, label: 'Localização' },
      { name: 'type', type: 'select', label: 'Tipo', options: [
        'Full-time', 'Part-time', 'Freelancer', 'Estágio'
      ]},
      { name: 'desc', type: 'textarea', label: 'Descrição' },
      { name: 'requirements', type: 'json', label: 'Requisitos' },
    ]
  },
  {
    slug: 'pages',
    label: 'Página',
    labelPlural: 'Páginas',
    icon: 'Layout',
    hasLocale: true,
    hasSlug: true,
    hasStatus: true,
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Título' },
      { name: 'body', type: 'richtext', label: 'Conteúdo' },
      { name: 'meta_title', type: 'text', label: 'Meta Title' },
      { name: 'meta_description', type: 'textarea', label: 'Meta Description' },
    ]
  },
]

/** Busca uma collection por slug */
export function getCollection(slug: string): CollectionDef | undefined {
  return collections.find(c => c.slug === slug)
}

/** Retorna os campos obrigatórios de uma collection */
export function getRequiredFields(col: CollectionDef): string[] {
  return col.fields.filter(f => f.required).map(f => f.name)
}
