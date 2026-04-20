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
      { name: 'published', type: 'boolean', label: 'Publicado', defaultValue: false },
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
      { name: 'published', type: 'boolean', label: 'Publicado', defaultValue: false },
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
      { name: 'published', type: 'boolean', label: 'Publicado', defaultValue: false },
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
    slug: 'brandbook',
    label: 'Brand Asset',
    labelPlural: 'Brand Assets',
    icon: 'Palette',
    hasLocale: false,
    hasSlug: true,
    hasStatus: true,
    fields: [
      { name: 'title', type: 'text', required: true, label: 'Nome do Asset' },
      { name: 'category', type: 'select', label: 'Categoria', options: [
        'logo', 'cor', 'tipografia', 'ícone', 'template', 'guideline'
      ]},
      { name: 'brand', type: 'select', label: 'Marca', options: [
        'ness', 'aegis', 'cavan', 'tne', 'canal'
      ]},
      { name: 'desc', type: 'textarea', label: 'Descrição' },
      { name: 'file_url', type: 'text', label: 'URL do Arquivo' },
      { name: 'preview_url', type: 'image', label: 'Preview' },
      { name: 'hex_value', type: 'text', label: 'Hex (cores)' },
      { name: 'usage_notes', type: 'textarea', label: 'Notas de Uso' },
    ]
  },
  {
    slug: 'signatures',
    label: 'Assinatura',
    labelPlural: 'Assinaturas',
    icon: 'Mail',
    hasLocale: false,
    hasSlug: true,
    hasStatus: true,
    fields: [
      { name: 'name', type: 'text', required: true, label: 'Nome Completo' },
      { name: 'role', type: 'text', required: true, label: 'Cargo' },
      { name: 'email', type: 'text', required: true, label: 'Email' },
      { name: 'phone', type: 'text', label: 'Telefone' },
      { name: 'brand', type: 'select', label: 'Marca', required: true, options: [
        'ness', 'aegis', 'cavan', 'tne'
      ]},
      { name: 'photo_url', type: 'image', label: 'Foto' },
      { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
      { name: 'department', type: 'select', label: 'Departamento', options: [
        'Diretoria', 'Engenharia', 'Comercial', 'Operações', 'RH', 'Financeiro', 'Marketing'
      ]},
    ]
  },
  {
    slug: 'forms',
    label: 'Formulário',
    labelPlural: 'Formulários',
    icon: 'Inbox',
    hasLocale: false,
    hasSlug: false,
    hasStatus: true,
    fields: [
      { name: 'source', type: 'text', required: true, label: 'Origem' },
      { name: 'payload', type: 'json', required: true, label: 'Dados' },
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
