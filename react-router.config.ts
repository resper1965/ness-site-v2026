import type { Config } from '@react-router/dev/config';

/**
 * O app vive em `src/` (não em `app/`) para a migração não mexer no caminho
 * de nenhum dos ~60 arquivos existentes.
 */
export default {
  appDirectory: 'src',
  // O plugin da Cloudflare escreve o cliente em dist/client; sem alinhar aqui,
  // o passo de servidor procura o manifesto em build/ e falha.
  buildDirectory: 'dist',
  ssr: true,
} satisfies Config;
