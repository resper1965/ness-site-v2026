/**
 * Eventos de conversão, num lugar só.
 *
 * O destino é o Zaraz, que roda na Cloudflare: o navegador manda um pacote
 * pequeno e ela repassa ao GA4 do lado servidor. Nada de `gtag.js` no
 * navegador, e o consentimento é respeitado pelo próprio Zaraz — quem recusa
 * analytics não tem evento enviado, sem o site precisar saber disso.
 *
 * Se o Zaraz não estiver presente (preview local, ou zone sem ele), o evento
 * simplesmente não sai. Silêncio é melhor que medir escondido.
 */
type Parametros = Record<string, string | number | boolean | undefined>;

/**
 * A API de consentimento da Zaraz. `modal = false` esconde o aviso de fabrica
 * dela, que trava a pagina; o nosso fica em AvisoDeConsentimento.tsx.
 */
type ConsentimentoZaraz = {
  modal: boolean;
  get?: (finalidade: string) => boolean | undefined;
  getAll?: () => Record<string, boolean | undefined>;
  set?: (escolhas: Record<string, boolean>) => void;
  setAll?: (aceitou: boolean) => void;
  sendQueuedEvents?: () => void;
};

declare global {
  interface Window {
    zaraz?: {
      track: (nome: string, parametros?: Parametros) => void;
      consent?: ConsentimentoZaraz;
    };
  }
}

export function evento(nome: string, parametros: Parametros = {}): void {
  if (typeof window === 'undefined') return;
  window.zaraz?.track(nome, parametros);
}

/**
 * Marca um evento que só deve sair uma vez por carregamento — profundidade de
 * rolagem dispara a cada pixel, e sem trava vira ruído.
 */
const jaDisparados = new Set<string>();

export function eventoUnico(chave: string, nome: string, parametros: Parametros = {}): void {
  if (jaDisparados.has(chave)) return;
  jaDisparados.add(chave);
  evento(nome, parametros);
}

/** Chamado na troca de rota: cada página tem sua própria contagem. */
export function reiniciarEventosUnicos(): void {
  jaDisparados.clear();
}
