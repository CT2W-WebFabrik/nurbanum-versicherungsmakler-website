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

/**
 * Convert a label to a URL-safe slug for use as anchor IDs.
 * Handles German umlauts and special characters.
 */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
