# Nurbanum Versicherungsmakler Website

Website for [Nurbanum Versicherungsmakler](https://nurbanum.de) — independent insurance broker based in Zirndorf near Nuremberg.

110+ static pages covering insurance products, specializations by target group, guides, FAQ, and glossary. German language, DSGVO-compliant (self-hosted fonts, 2-click consent for embeds).

## Tech Stack

- **Astro 5** — static site generator with Content Collections, zero client JS by default
- **Tailwind CSS v4** — `@tailwindcss/vite` plugin, custom theme via `@theme` directive
- **Self-hosted fonts** — Cabinet Grotesk + Crimson Pro (no Google CDN)
- **GitHub Pages** — deployed via GitHub Actions on push to `master`

## Development

```sh
npm install
npm run dev       # localhost:4321
npm run build     # production build → dist/
npm run preview   # preview production build
```

## Project Structure

```
src/
├── content/          # Markdown content (versicherungen, ratgeber, blog, faq)
├── components/       # Astro components (Header, Footer, Breadcrumb, etc.)
├── layouts/          # BaseLayout, ArticleLayout
├── pages/            # Routes (index, versicherungen, spezialisierungen, ratgeber, etc.)
├── styles/           # global.css with @font-face + Tailwind theme
├── utils/            # url() helper for base-path-aware links
└── plugins/          # Remark plugin for base-aware markdown links
```

## Deployment

Pushes to `master` trigger automatic deployment to GitHub Pages via `.github/workflows/deploy.yml`.

Currently configured with a `base` path for GitHub Pages subdirectory hosting. A `CNAME` file is present for future custom domain setup.
