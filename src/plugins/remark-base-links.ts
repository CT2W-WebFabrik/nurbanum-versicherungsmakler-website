import { visit } from 'unist-util-visit';

/**
 * Remark plugin that prepends the Astro base path to internal markdown links.
 * Ensures [text](/path/) works correctly on subdirectory deployments.
 *
 * Usage in astro.config.mjs:
 *   markdown: { remarkPlugins: [[remarkBaseLinks, { base: '/my-base' }]] }
 */
export default function remarkBaseLinks(options?: { base?: string }) {
  const base = (options?.base || '').replace(/\/$/, '');

  return (tree: any) => {
    if (!base) return;

    visit(tree, 'link', (node: any) => {
      if (
        typeof node.url === 'string' &&
        node.url.startsWith('/') &&
        !node.url.startsWith('//') &&
        !node.url.startsWith(base + '/')
      ) {
        node.url = base + node.url;
      }
    });
  };
}
