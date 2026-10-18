// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

const web3formsKey =
  process.env.PUBLIC_WEB3FORMS_ACCESS_KEY ?? process.env.WEB3FORMS_ACCESS_KEY ?? '';

export default defineConfig({
  site: process.env.SITE_URL ?? 'https://versacarte.com',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  vite: {
    plugins: [tailwindcss()],
    define: {
      'import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY': JSON.stringify(web3formsKey),
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/motion')) return 'motion';
          },
        },
      },
    },
  },
  integrations: [sitemap()],
});
