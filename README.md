# Hallquist Lab at Emory University

The Hallquist Lab website is a static Astro site that preserves the public content of the former DEPENd Lab website at UNC–Chapel Hill while establishing a new Emory University home and visual identity.

## What was migrated

The repository contains a September 17, 2026 snapshot of all 19 published WordPress pages and both historical calendar events exposed by `dependlab.unc.edu`, plus local copies of every available image, PDF, and document directly referenced by those pages. The unmodified WordPress page API response is retained in `archive/wp-pages.json`; the site renders a cleaned, local-asset version from `src/data/legacy-pages.json`.

UNC-specific participant, recruiting, directions, and contact pages are retained for historical completeness and visibly marked as legacy information. They should not be treated as current Emory logistics.

## Technology

The site follows the same approach as `edm_megalab`: Astro 7, TypeScript, plain shared CSS, static output, an XML sitemap, and GitHub Pages deployment through GitHub Actions.

## Local development

Requires Node.js 24 or later.

```bash
npm install
npm run dev
```

Before publishing, run:

```bash
npm run format
npm run build
```

## Editing

- Current lab identity and contact details: `src/data/site.json`
- New homepage: `src/pages/index.astro`
- Shared navigation, metadata, and footer: `src/layouts/BaseLayout.astro`
- Theme and responsive layout: `src/styles/global.css`
- Migrated page labels and archive warnings: `src/lib/legacy.ts`
- Original scrape: `archive/wp-pages.json`

To recreate the content snapshot from another WordPress pages API export:

```bash
npm run archive:prepare -- /absolute/path/to/pages.json
```

## Publishing

The workflow in `.github/workflows/deploy.yml` publishes pushes to `main` using GitHub Pages. The configured project URL is <https://hallquistlab.github.io/hallquist_lab_web/>. In repository settings, select **GitHub Actions** as the Pages source.
