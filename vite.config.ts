import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      target: 'es2022',
      chunkSizeWarningLimit: 600,
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          // Um chunk estável para o runtime React (cache longo entre deploys);
          // o restante é dividido pelo Rollup conforme o uso por rota.
          manualChunks(id) {
            if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom)\//.test(id)) return 'vendor';
            if (id.includes('node_modules/@sentry')) return 'sentry';
            return undefined;
          },
        },
      },
    },
  };
});
