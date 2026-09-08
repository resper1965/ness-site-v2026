/**
 * Eventos de conversão, num lugar só.
 *
 * O `gtag` é enfileirado pelo /boot.js antes de o SDK chegar, então chamar
 * cedo não perde evento. Se o consentimento negar analytics, a fila
 * simplesmente não é despachada — a decisão não é daqui.
 */
type Parametros = Record<string, string | number | boolean | undefined>;

export function evento(nome: string, parametros: Parametros = {}): void {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', nome, parametros);
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
