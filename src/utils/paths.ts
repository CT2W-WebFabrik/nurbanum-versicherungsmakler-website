/**
 * Prepends the Astro base path to a URL.
 * Use this for all internal links to ensure they work with GitHub Pages subpath deployment.
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL;
  // Avoid double slashes: base ends with '/', path starts with '/'
  if (path.startsWith('/') && base.endsWith('/')) {
    return base + path.slice(1);
  }
  return base + path;
}
