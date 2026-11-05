# Hallquist Lab at Emory University

The Hallquist Lab website is a static Astro site that preserves the public content of the former DEPENd Lab website at UNC–Chapel Hill while establishing a new Emory University home and visual identity.

## What was migrated

The repository contains a September 17, 2026 snapshot of all 19 published WordPress pages and both historical calendar events exposed by `dependlab.unc.edu`, plus local copies of every available image, PDF, and document directly referenced by those pages. The unmodified WordPress page API response is retained in `archive/wp-pages.json`; the site renders a cleaned, local-asset version from `src/data/legacy-pages.json`.

All 19 original pages are preserved under `/archive/<slug>/`. Current-purpose pages for Research, People, Publications, Resources, Join, Contact, and Life in the lab use the Emory editorial design. Historical logistics and team records are clearly labeled; old forms are not operational. Existing root URLs remain available.

The publication catalog contains all 105 refereed articles from the July 2026 CV plus the Hallquist–Tackett Annual Review article. Recent metadata has been reconciled against publisher/PubMed records; the catalog is curated rather than a live Google Scholar feed. See [publication maintenance](docs/publications.md) and the [design notes](docs/editorial-design.md).

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
npm test
npm run format
npm run build
npm run check:links
```

## Editing

- Current lab identity and contact details: `src/data/site.json`
- Current team: `src/data/people.json`
- Research questions and related papers: `src/data/research.ts`
- Momentum and LENS project overviews: `src/data/projects.ts`
- Publication catalog and spotlight copy: `src/data/publications.json`
- Homepage: `src/pages/index.astro`
- Shared navigation, metadata, and footer: `src/layouts/BaseLayout.astro`
- Theme and responsive layout: `src/styles/global.css`
- Migrated page labels and archive warnings: `src/lib/legacy.ts`
- Original scrape: `archive/wp-pages.json`

To recreate the content snapshot from another WordPress pages API export:

```bash
npm run archive:prepare -- /absolute/path/to/pages.json
```

## Publishing

The workflow in `.github/workflows/deploy.yml` publishes pushes to `main` using GitHub Pages. Because this is the `HallquistLab/hallquistlab.github.io` organization-site repository, the configured public URL is <https://hallquistlab.github.io/>. In repository settings, select **GitHub Actions** as the Pages source.
