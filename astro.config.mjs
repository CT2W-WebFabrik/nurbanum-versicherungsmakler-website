// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';
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
        !page.endsWith('/impressum/') &&
        !page.endsWith('/datenschutz/') &&
        !page.endsWith('/erstinformation/'),
    }),
  ],
  markdown: {
    remarkPlugins: [[remarkBaseLinks, { base }]],
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
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
