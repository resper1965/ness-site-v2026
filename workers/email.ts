/**
 * Envio de e-mail transacional pelo Resend.
 *
 * Fica inerte enquanto `RESEND_API_KEY` não existir: o formulário grava o lead
 * no D1 de qualquer jeito, e o e-mail é aviso, não persistência. Perder o
 * aviso atrasa uma resposta; falhar o envio do formulário perde o lead.
 */
type Env = {
  RESEND_API_KEY?: string;
  LEAD_EMAIL_FROM?: string;
  LEAD_EMAIL_TO?: string;
};

type Mensagem = {
  assunto: string;
  texto: string;
  responderPara?: string;
};

export async function avisarTime(env: Env, msg: Mensagem): Promise<'enviado' | 'sem-chave' | 'falhou'> {
  if (!env.RESEND_API_KEY) return 'sem-chave';

  const de = env.LEAD_EMAIL_FROM;
  const para = env.LEAD_EMAIL_TO;
  if (!de || !para) {
    console.error('[email] RESEND_API_KEY definido sem LEAD_EMAIL_FROM/LEAD_EMAIL_TO');
    return 'falhou';
  }

  try {
    const resposta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: de,
        to: [para],
        subject: msg.assunto,
        text: msg.texto,
        ...(msg.responderPara ? { reply_to: msg.responderPara } : {}),
      }),
    });
    if (!resposta.ok) {
      console.error('[email] resend respondeu', resposta.status, await resposta.text());
      return 'falhou';
    }
    return 'enviado';
  } catch (erro) {
    console.error('[email] falha ao chamar o resend', erro);
    return 'falhou';
  }
}

/** O corpo do aviso de lead novo — texto puro, para ser lido no celular. */
export function corpoDoLead(payload: Record<string, unknown>): string {
  const campo = (chave: string) => (payload[chave] ? String(payload[chave]) : '—');
  return [
    `nome:     ${campo('name')}`,
    `empresa:  ${campo('company')}`,
    `e-mail:   ${campo('email')}`,
    `assunto:  ${campo('subject')}`,
    '',
    'mensagem:',
    campo('message'),
    '',
    '— origem —',
    `página:   ${campo('landing')}`,
    `campanha: ${campo('utm_campaign')} (${campo('utm_source')}/${campo('utm_medium')})`,
    `referrer: ${campo('referrer')}`,
  ].join('\n');
}
