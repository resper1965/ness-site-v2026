import { CANAL_BASE } from '../config/api';

/**
 * Global API Service for interacting with the Canal backend.
 * Centralizes error handling, JSON parsing, and standardizes fetch calls.
 */

export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function fetchWithHandler<T>(url: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: Record<string, string> = {};

  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${CANAL_BASE}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(response.status, errorData.message || 'Erro na requisição', errorData);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    return text as unknown as T;
  }
}

export const canalApi = {
  // --- Formulários e Leads ---
  submitForm: (payload: any) =>
    fetchWithHandler<{ success: boolean; id?: number }>('/api/submit-form', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  submitWhistleblower: (payload: any) =>
    fetchWithHandler<{ success: boolean; caseCode?: string }>('/api/whistleblower', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // --- Vagas e Candidaturas ---
  getJobs: (lang: string) => fetchWithHandler<any>(`/api/jobs?lang=${lang}`),
  
  applyJob: (jobId: string, payload: FormData) =>
    fetchWithHandler<{ success: boolean }>(`/api/automation/apply/${jobId}`, {
      method: 'POST',
      body: payload,
    }),

  // --- Insights / Blog ---
  getInsights: (lang: string) => fetchWithHandler<any>(`/api/insights?lang=${lang}`),
  
  getInsightBySlug: (slug: string, lang: string) => fetchWithHandler<any>(`/api/insights/${slug}?lang=${lang}`),

  // --- Cases de Portfolio ---
  getCases: (lang: string) => fetchWithHandler<any>(`/api/cases?lang=${lang}`),
  
  getCaseBySlug: (slug: string, lang: string) => fetchWithHandler<any>(`/api/cases/${slug}?lang=${lang}`),

  // --- Automações e Extras ---
  getGithubRepos: () => fetchWithHandler<any>('/api/automation/github/repos'),
};
