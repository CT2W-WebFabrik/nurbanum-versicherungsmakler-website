import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const sitemapUrl = new URL(`${base}/sitemap-index.xml`, site).toString();

  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      '# Block training-only crawlers',
      'User-agent: Google-Extended',
      'Disallow: /',
      '',
      'User-agent: CCBot',
      'Disallow: /',
      '',
      'User-agent: Bytespider',
      'Disallow: /',
      '',
      `Sitemap: ${sitemapUrl}`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
};
