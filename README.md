# Nurbanum Versicherungsmakler Website

Professional website for Nurbanum Versicherungsmakler — independent insurance broker in Zirndorf (near Nuremberg).

## Tech Stack

- **Astro** — static site generator, zero JS by default
- **Tailwind CSS v4** — utility-first styling
- **GitHub Pages** — hosting via GitHub Actions

## Development

```sh
npm install
npm run dev       # localhost:4321
npm run build     # production build to ./dist/
npm run preview   # preview production build
```

## Deployment

Pushes to `master` automatically deploy to GitHub Pages via `.github/workflows/deploy.yml`.
