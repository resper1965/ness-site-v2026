/**
 * Cliente de API base para o Canal CMS public interface.
 */

// A URL da API base do CMS
// Nota: Em DEV, roda no Worker em 8787.
export const API_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://127.0.0.1:8787';

export interface PostEntry {
  id: string;
  title: string;
  content: string;
  slug: string;
  createdAt: string;
}

export interface CollectionResponse<T> {
  data: T[];
  meta: {
    total: number;
    totalPages: number;
  };
}

/**
 * Busca todos os posts da coleção de blog do Canal CMS.
 */
export async function getPosts(): Promise<PostEntry[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/collections/blog/entries?limit=10`, {
      next: { revalidate: 60 }, // ISR de 60 segundos
    });

    if (!res.ok) {
      console.warn(`[getPosts] CMS retornou erro: ${res.status}`);
      return [];
    }

    const json = (await res.json()) as CollectionResponse<PostEntry>;
    return json.data || [];
  } catch (err) {
    if (process.env.npm_lifecycle_event === 'build') {
      console.warn('[getPosts] Build estático detectado sem CMS online, fallback vazio gerado silenciosamente.');
    } else {
      console.error('[getPosts] Erro ao conectar com CMS:', err);
    }
    return [];
  }
}
