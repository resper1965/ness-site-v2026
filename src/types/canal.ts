/**
 * Canal API Contract — TypeScript types
 *
 * Este arquivo é o contrato entre o site e o Canal CMS.
 * Ambos os lados devem respeitar estas interfaces.
 * Mudanças no Canal que quebrem estas interfaces devem gerar erro de TypeScript no site.
 */

// ── Conteúdo ────────────────────────────────────────────────────

export interface Insight {
  id: string;
  slug: string;
  title: string;
  desc: string;
  tag: string;
  date: string;
  icon: string;
  lang: string;
  featured?: boolean;
}

export interface InsightDetail extends Insight {
  body: string;
}

export interface Case {
  id?: string;
  slug?: string;
  client: string;
  category: string;
  project?: string;
  result: string;
  desc: string;
  stats?: string;
  image?: string;
  featured?: boolean;
  url?: string;
}

export interface Job {
  id: string;
  title: string;
  vertical: string;
  location: string;
  type: string;
  desc: string;
  requirements: string[];
}

// ── Chatbot ─────────────────────────────────────────────────────

export interface ChatbotConfig {
  bot_name: string;
  welcome_message: string;
  theme_color: string;
  enabled: number;
  avatar_url?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  locale?: string;
}

// ── Formulários ──────────────────────────────────────────────────

export type FormType = 'contact' | 'careers' | 'whistleblower' | 'newsletter';

export interface FormPayload {
  type?: FormType;
  name?: string;
  email?: string;
  message?: string;
  phone?: string;
  company?: string;
  subject?: string;
  source?: string;
  referrer?: string;
  referrerLabel?: string;
  [key: string]: unknown;
}

// ── Genéricos ────────────────────────────────────────────────────

export interface ApiSuccess {
  success: true;
  message?: string;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

export type ApiResponse<T> = T | ApiError;
