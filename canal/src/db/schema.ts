import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

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
  created_at: text('created_at') // SQLite stores datetimes as text
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

export const audit_logs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  tenant_id: text('tenant_id'),
  user_id: text('user_id'),
  action: text('action').notNull(),
  resource: text('resource').notNull(), // e.g., 'entry', 'collection', 'webhook'
  resource_id: text('resource_id'),
  details: text('details'),
  ip_address: text('ip_address'),
  created_at: text('created_at').notNull()
});
