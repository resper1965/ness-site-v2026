import { reactRouter } from '@react-router/dev/vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // O plugin da Cloudflare roda o código do servidor no workerd também em
  // desenvolvimento — o que quebra aqui quebra em produção, e vice-versa.
  plugins: [
    // `remoteBindings: false` mantém dev e preview inteiramente locais: sem
    // isso o plugin abre uma sessão remota para AI e Vectorize e exige
    // CLOUDFLARE_API_TOKEN até para rodar o e2e.
    cloudflare({ viteEnvironment: { name: 'ssr' }, remoteBindings: false }),
    tailwindcss(),
    reactRouter(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    target: 'es2022',
  },
  // O plugin da Cloudflare escreve cada ambiente em dist/<nome>; o React
  // Router procura o servidor em dist/server. Sem isto o build quebra ao
  // ler o manifesto.
  environments: {
    ssr: {
      build: {
        outDir: 'dist/server',
      },
    },
  },
});
