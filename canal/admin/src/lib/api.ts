/**
 * Canal Admin — API Client v2
 * Genérico: fala com /api/v1/collections/:slug/entries
 */

const BASE = '/api/v1';

export interface EntryMeta {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface EntryListResponse {
  data: Record<string, unknown>[];
  meta: EntryMeta;
}

export interface CollectionDef {
  id: string;
  slug: string;
  label: string;
  label_plural: string;
  icon: string;
  has_locale: number;
  has_slug: number;
  has_status: number;
  fields: FieldDef[];
}

export interface FieldDef {
  name: string;
  type: string;
  label?: string;
  required?: boolean;
  defaultValue?: unknown;
  options?: string[];
}

/** Busca todas as collections registradas */
export async function fetchCollections(): Promise<CollectionDef[]> {
  const res = await fetch(`${BASE}/collections`);
  const data = await res.json() as { data: CollectionDef[] };
  return (data.data ?? []).map(c => ({
    ...c,
    fields: typeof c.fields === 'string' ? JSON.parse(c.fields) : c.fields ?? [],
  }));
}

/** Busca entries de uma collection */
export async function fetchEntries(
  slug: string,
  params: { locale?: string; page?: number; status?: string } = {}
): Promise<EntryListResponse> {
  const qs = new URLSearchParams();
  if (params.locale) qs.set('locale', params.locale);
  if (params.page) qs.set('page', String(params.page));
  if (params.status) qs.set('status', params.status);
  const res = await fetch(`${BASE}/collections/${slug}/entries?${qs}`);
  return res.json() as Promise<EntryListResponse>;
}

/** Busca uma entry pelo ID */
export async function fetchEntry(slug: string, id: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${BASE}/collections/${slug}/entries/${id}`);
  const data = await res.json() as { data: Record<string, unknown> };
  return data.data;
}

/** Cria uma nova entry */
export async function createEntry(slug: string, body: Record<string, unknown>) {
  const res = await fetch(`${BASE}/collections/${slug}/entries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  return res.json();
}

/** Atualiza uma entry existente */
export async function updateEntry(slug: string, id: string, body: Record<string, unknown>) {
  const res = await fetch(`${BASE}/collections/${slug}/entries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  return res.json();
}

/** Remove uma entry */
export async function deleteEntry(slug: string, id: string) {
  const res = await fetch(`${BASE}/collections/${slug}/entries/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}

/** Busca a lista de media */
export async function fetchMedia(params: { page?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  const res = await fetch(`${BASE}/media?${qs}`, { credentials: 'include' });
  return res.json() as Promise<{ data: Record<string, unknown>[]; meta: EntryMeta }>;
}

/** Upload de media */
export async function uploadMedia(file: File) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}/media`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  return res.json();
}

/** Remove media */
export async function deleteMedia(id: string) {
  const res = await fetch(`${BASE}/media/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}
