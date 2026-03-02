// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ct2w-webfabrik.github.io',
  base: '/nurbanum-versicherungsmakler-website',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en', 'tr', 'ar', 'fr', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Optimize build output
  compressHTML: true,
});
