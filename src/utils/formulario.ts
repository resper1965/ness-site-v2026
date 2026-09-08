/**
 * Validação no envio de foco, não no envio do formulário: o erro aparece onde
 * o olho ainda está. Domínio gratuito não bloqueia — avisa. Barrar gmail
 * custaria lead legítimo de empresa pequena.
 */
const GRATUITOS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com', 'icloud.com'];

export function validarEmail(valor: string): string | null {
  if (!valor) return null;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(valor)) return 'e-mail inválido — confira o endereço.';
  const dominio = valor.split('@')[1]?.toLowerCase() ?? '';
  if (GRATUITOS.includes(dominio)) return 'prefira o e-mail corporativo: a resposta vai para o time certo mais rápido.';
  return null;
}
