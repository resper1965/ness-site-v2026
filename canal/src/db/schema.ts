import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ── CMS Core ────────────────────────────────────────────────────

export const collections = sqliteTable('collections', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  label: text('label').notNull(),
  label_plural: text('label_plural'),
  icon: text('icon').default('FileText'),
  has_locale: integer('has_locale').notNull().default(1),
  has_slug: integer('has_slug').notNull().default(1),
  has_status: integer('has_status').notNull().default(1),
  fields: text('fields').notNull().default('[]'),
  sort_order: integer('sort_order').default(0),
  created_at: text('created_at')
});

export const entries = sqliteTable('entries', {
  id: text('id').primaryKey(),
  tenant_id: text('tenant_id'),
  collection_id: text('collection_id').notNull().references(() => collections.id, { onDelete: 'cascade' }),
  data: text('data').notNull().default('{}'),
  slug: text('slug'),
  locale: text('locale').notNull().default('pt'),
  status: text('status').notNull().default('draft'),
  created_by: text('created_by'),
  updated_by: text('updated_by'),
  governance_decision: text('governance_decision'),
  classification_reason: text('classification_reason'),
  published_at: text('published_at'),
  created_at: text('created_at'),
  updated_at: text('updated_at')
});

// ── Engagement ──────────────────────────────────────────────────

export const leads = sqliteTable('leads', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tenant_id: text('tenant_id'),
  name: text('name').notNull(),
  contact: text('contact').notNull(),
  source: text('source').default('web'),
  intent: text('intent'),
  urgency: text('urgency').default('media'),
  status: text('status').default('new'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at')
});

export const forms = sqliteTable('forms', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  payload: text('payload'),
  source: text('source'),
  status: text('status').default('new'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP')
});

export const chats = sqliteTable('chats', {
  session_id: text('session_id').primaryKey(),
  messages: text('messages'),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at')
});

export const newsletter = sqliteTable('newsletter', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  created_at: text('created_at').default('CURRENT_TIMESTAMP')
});

// ── Media ───────────────────────────────────────────────────────

export const mediaTable = sqliteTable('media', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  mime_type: text('mime_type').notNull(),
  size_bytes: integer('size_bytes'),
  r2_key: text('r2_key').notNull(),
  alt_text: text('alt_text'),
  width: integer('width'),
  height: integer('height'),
  created_at: text('created_at')
});

// ── Webhooks ────────────────────────────────────────────────────

export const webhooks_targets = sqliteTable('webhooks_targets', {
  id: text('id').primaryKey(),
  tenant_id: text('tenant_id'),
  url: text('url').notNull(),
  secret: text('secret'),
  events: text('events').notNull().default('["entry.published"]'),
  active: integer('active').notNull().default(1),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull()
});

// ── Audit ───────────────────────────────────────────────────────

export const audit_logs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  tenant_id: text('tenant_id'),
  user_id: text('user_id'),
  action: text('action').notNull(),
  resource: text('resource').notNull(),
  resource_id: text('resource_id'),
  details: text('details'),
  ip_address: text('ip_address'),
  created_at: text('created_at').notNull()
});

// ── Better Auth (managed by library, read-only schemas) ─────────

export const organization = sqliteTable('organization', {
  id: text('id').primaryKey(),
  name: text('name'),
  slug: text('slug'),
  logo: text('logo'),
  metadata: text('metadata'),
  createdAt: text('createdAt'),
});

export const member = sqliteTable('member', {
  id: text('id').primaryKey(),
  organizationId: text('organizationId').references(() => organization.id),
  userId: text('userId'),
  role: text('role'),
  createdAt: text('createdAt'),
});

export const invitation = sqliteTable('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organizationId').references(() => organization.id),
  email: text('email'),
  role: text('role'),
  status: text('status'),
  inviterId: text('inviterId'),
  expiresAt: text('expiresAt'),
});

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull(),
  role: text('role'),
  image: text('image'),
  createdAt: text('createdAt'),
  updatedAt: text('updatedAt'),
});

export const apikey = sqliteTable('apikey', {
  id: text('id').primaryKey(),
  name: text('name'),
  prefix: text('prefix'),
  key: text('key'),
  metadata: text('metadata'),
  createdAt: text('createdAt'),
});
