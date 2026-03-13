// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import remarkBaseLinks from './src/plugins/remark-base-links.ts';

const base = '/nurbanum-versicherungsmakler-website';

// https://astro.build/config
export default defineConfig({
  site: 'https://ct2w-webfabrik.github.io',
  base,
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/impressum') &&
        !page.includes('/datenschutz') &&
        !page.includes('/erstinformation'),
    }),
  ],
  markdown: {
    remarkPlugins: [[remarkBaseLinks, { base }]],
  },
  i18n: {
    defaultLocale: 'de',
    locales: ['de'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // Optimize build output
  compressHTML: true,
});
