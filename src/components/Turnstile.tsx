import { useEffect, useRef } from 'react';

const SITEKEY = import.meta.env.VITE_TURNSTILE_SITEKEY as string | undefined;
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

/**
 * Verificação antirrobô do Cloudflare.
 *
 * Sem `VITE_TURNSTILE_SITEKEY` o componente não renderiza nada e o formulário
 * segue funcionando — a chave é criada no painel, e o site não pode ficar
 * sem formulário esperando por ela. O servidor só exige o token quando o
 * segredo correspondente existe.
 */
export default function Turnstile({ action }: { action: string }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!SITEKEY || document.querySelector(`script[src^="${SCRIPT}"]`)) return;
    const script = document.createElement('script');
    script.src = SCRIPT;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  if (!SITEKEY) return null;

  // Renderização implícita: o script injeta no formulário um campo oculto
  // chamado `cf-turnstile-response`, que é o que o servidor verifica.
  // `data-action` amarra o token à superfície: sem isso, um token emitido no
  // chat vale no formulário de contato e vice-versa.
  return (
    <div
      ref={container}
      className="cf-turnstile"
      data-sitekey={SITEKEY}
      data-action={action}
      data-theme="dark"
      data-language="auto"
    />
  );
}
