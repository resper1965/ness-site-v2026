/**
 * De onde o visitante veio, capturado no envio do formulário.
 *
 * Sem isso o lead chega sem origem: dá para contar quantos vieram, não de
 * onde. Os parâmetros ficam na sessão porque a campanha aparece na primeira
 * URL, e o formulário costuma ser preenchido três cliques depois.
 */
const CHAVE = 'ness_origem';
const CAMPOS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'] as const;

export type Origem = Partial<Record<(typeof CAMPOS)[number] | 'referrer' | 'landing', string>>;

/** Guarda a origem na primeira página da sessão. Idempotente. */
export function registrarOrigem(): void {
  if (typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem(CHAVE)) return;
    const params = new URLSearchParams(window.location.search);
    const origem: Origem = {};
    for (const campo of CAMPOS) {
      const valor = params.get(campo);
      if (valor) origem[campo] = valor.slice(0, 200);
    }
    // Referrer externo apenas: navegação interna não é origem.
    if (document.referrer && !document.referrer.startsWith(window.location.origin)) {
      origem.referrer = document.referrer.slice(0, 300);
    }
    origem.landing = window.location.pathname;
    sessionStorage.setItem(CHAVE, JSON.stringify(origem));
  } catch {
    /* navegador sem storage: seguimos sem origem, não sem formulário */
  }
}

export function origemDaVisita(): Origem {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem(CHAVE) || '{}') as Origem;
  } catch {
    return {};
  }
}
