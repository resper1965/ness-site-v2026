/**
 * A resposta ao aviso de privacidade, guardada num cookie nosso.
 *
 * Por que um cookie nosso, e não o da Zaraz: o aviso precisa aparecer — ou
 * não aparecer — já no HTML que sai do servidor, e o servidor só enxerga o
 * que vem no cabeçalho `Cookie`. O cookie da Zaraz é dela, tem formato dela
 * e muda quando a configuração da zone muda; escrever nele seria adivinhar.
 * Este aqui responde a uma pergunta só, e é a pergunta que o servidor faz:
 * **esta pessoa já respondeu?**
 *
 * Quem leva a escolha até a medição continua sendo a Zaraz, pela API dela —
 * no componente, quando a página hidrata, e em `public/reforco.js`, quando
 * ela não hidrata. Sem JavaScript nenhum não há Zaraz, não há medição e não
 * há o que consentir: o cookie registra a resposta e o site não mede.
 *
 * Não é `HttpOnly` de propósito: o reforço da rota sem hidratação precisa
 * lê-lo, e o componente hidratado precisa escrevê-lo sem uma ida ao servidor.
 */
export const COOKIE_CONSENTIMENTO = 'ness-consent';

/** Um ano. Depois disso perguntamos de novo. */
export const VALIDADE_CONSENTIMENTO = 60 * 60 * 24 * 365;

export type Consentimento = 'aceito' | 'recusado';

/**
 * Lê a resposta de um cabeçalho `Cookie` (servidor) ou de `document.cookie`
 * (navegador). Devolve `null` para quem ainda não respondeu — que é o único
 * caso em que o aviso aparece.
 */
export function lerConsentimento(cookies: string | null | undefined): Consentimento | null {
  if (!cookies) return null;
  const achado = /(?:^|;\s*)ness-consent=(aceito|recusado)(?:;|$)/.exec(cookies);
  return achado ? (achado[1] as Consentimento) : null;
}
