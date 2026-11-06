# Hallquist Lab website handoff

November 5, 2026

Your task is to polish the existing Emory site and bring forward relevant science
and materials from the former UNC DEPENd Lab site. The main pages, searchable
publication catalog, Momentum/LENS pages, and UNC archive are implemented. Focus
on accurate content, useful images, and readable layouts. Retain the Emory
blue/gold palette and direct scientific copy; avoid slogans such as “Different
perspectives. Shared questions.”

## Getting started

Repository: [HallquistLab/hallquistlab.github.io](https://github.com/HallquistLab/hallquistlab.github.io).
Configured public address: [hallquistlab.github.io](https://hallquistlab.github.io/).
Use Node.js 24+ and Python 3, then run these commands from the repository folder:

```bash
npm ci
npm run dev
```

Open the local address printed in the terminal. Make changes on a branch such as
`polish/people-and-neuromap`, and submit a pull request for Michael to review.
Pushing to `main` automatically builds and publishes the site through GitHub
Actions.

## How the site works

This is an **Astro 7 static website**, using TypeScript and shared CSS. There is
no WordPress installation, database, or content editor to log into. An `.astro`
file contains HTML plus JavaScript/TypeScript between the opening `---` markers.
Files in `src/pages/` become URLs; the build writes the finished site to `dist/`.
Publication filtering uses a small browser script.

| Where to work                                                       | Purpose                                                                                                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/pages/index.astro` and other files in `src/pages/`             | Homepage and current Research, People, Publications, Resources, Join, Contact, and lab-life pages.                                          |
| `src/layouts/BaseLayout.astro`                                      | Shared navigation, footer, page metadata, and stylesheet import.                                                                            |
| `src/styles/global.css`                                             | Colors, type, spacing, components, and responsive layouts. Reuse these styles.                                                              |
| `src/data/site.json`, `people.json`                                 | Lab identity/contact details and current members. `people.astro` currently displays initials in place of portraits.                         |
| `src/data/research.ts`, `projects.ts`                               | Research themes and project descriptions. `src/pages/research/[project].astro` generates project pages from the project records.            |
| `src/data/publications.json`, `src/lib/publications.ts`             | Curated catalog and publication helpers. `PublicationCard.astro` renders spotlights; homepage selections are explicit IDs in `index.astro`. |
| `public/media/`                                                     | Local images and PDFs, served at `/media/...`. New assets can use descriptive subfolders and filenames.                                     |
| `archive/wp-pages.json`, `src/data/legacy-pages.json`               | Original WordPress page response and cleaned HTML snapshot. Start here when recovering UNC material.                                        |
| `src/pages/archive/`, `src/lib/legacy.ts`, `src/pages/[slug].astro` | Archive routes, historical notices, and compatibility with older root URLs. Preserve existing links.                                        |
| `astro.config.mjs`, `.github/workflows/deploy.yml`                  | Site URL, sitemap rules, and GitHub Pages deployment.                                                                                       |

Edit source files, not `dist/`, `.astro/`, or `node_modules/`. In templates, follow
the existing `import.meta.env.BASE_URL` pattern for internal links and assets.
See [design notes](editorial-design.md) and [publication maintenance](publications.md).
`design-review/` contains earlier exploratory mockups, not the current site.

## Priority work

1. **Finish People and photography.** Ask Michael for the current roster, roles,
   approved biographies, individual portraits, and Emory group/lab photos. Add
   portrait paths to `people.json` and update `people.astro` to render them with
   consistent crops, dimensions, and initials as a fallback. Transcribe relevant
   archived image-based biographies into HTML and verify affiliations before
   reuse. Existing retreat photos are historical UNC images; retain their dates
   and captions.
2. **Add NeuroMAP and review project coverage.** Follow the steps below. Ask
   Michael which projects remain active, which are completed, and how ROSES should
   be represented. LENS remains labeled upcoming until its status is confirmed.
3. **Create useful research visuals.** Ask for original task diagrams or suitable
   published figures. Consider a simple schematic of Pavlovian versus
   goal-directed influences for NeuroMAP, or the repeated assessments in
   Momentum/LENS. Have Michael check scientific accuracy. Use readable labels,
   captions, and text alternatives; do not invent results or reuse the old
   generic study clip art as scientific illustrations.
4. **Finish resources and bibliography links.** Compare the current Resources
   page with the archived Quantitative Methods and Code for Projects pages. The
   programming/reproducibility workshop is one resource not yet on the current
   index. Check external destinations manually. In the 106-record bibliography,
   prioritize records lacking `verifiedAt` or access links; verify publisher
   metadata and add available article/code/data links without duplicating IDs.
5. **Polish layout and copy.** Check heading wraps, portrait crops, card alignment,
   spacing, and mobile navigation. Use Michael’s bio and the Research introduction
   as the scientific reference. Keep labels concrete and remove repeated
   introductions. Add a social-sharing image and matching metadata if an approved
   image is available; the favicon already exists.

## Recovering NeuroMAP and other UNC materials

The local September 2026 snapshot contains 19 pages and two historical events,
plus downloaded assets directly referenced by the pages. It is not a complete
WordPress backup: separate posts, embedded videos, and original-resolution files
may need recovery. First browse `/archive/studies/`, `/archive/about/`,
`/archive/people/`, `/archive/quantitative-methods/`, and `/archive/lab-activities/`
on the local site. Use `sourceUrl` in `legacy-pages.json` to trace originals;
`archive/wp-pages.json` retains the original HTML. Request lab originals or a UNC
export when necessary.

**NeuroMAP should be the first project recovery:**

1. Extract the scientific description from the Studies archive. It covers
   emotional instability, affiliation/personality, Pavlovian and goal-directed
   learning, functional neuroimaging, development, and a NIMH BRAINS award. Ask
   Michael to confirm current status, collaborators, funding wording, and related
   publications. Historical wording is a starting point, not evidence of current
   recruitment or established findings.
2. Draft a short overview, specific research questions, methods, status, and
   related papers. Add a `neuromap` record to `src/data/projects.ts` to generate
   `/research/neuromap/`. Select papers with Michael; do not infer project
   membership from author overlap alone.
3. Generalize the project template first: its companion-study section currently
   assumes Momentum and LENS. Make that section conditional or project-specific.
   `ProjectCards.astro` renders every project record, so review homepage/research
   headings and grid layout after adding a third card. Theme-to-project links in
   `research.astro` are also hardcoded to Momentum/LENS; update them, preferably
   using project IDs per theme. Link NeuroMAP to the relevant themes and add its
   route to the core checks in `scripts/check-site-links.py`.
4. Replace archival formatting with real text and a suitable visual. The Studies
   page has generic illustrations; the About archive has headings embedded in
   images. Recreate relevant labels as HTML. A historical MRI photo exists at
   `public/media/2022/10/Caroline_NMAP_MRI-e1666889453483.jpeg`; confirm its context
   and suitability before reuse. Keep the original archive intact.

Maintain a small recovery checklist recording each item’s source, proposed new
location, missing assets, and questions for Michael. Assess ROSES similarly.
Do not restore old UNC parking directions, application deadlines, contact forms,
or participant links as current Emory information. Do not run `archive:prepare`
casually: it overwrites the raw and cleaned page snapshots.

## Before submitting

```bash
npm run format
npm test
npm run build
npm run check:links
npm run preview
```

Inspect the preview at phone, tablet, and desktop widths, including 320/390, 768,
and 1440 pixels. Check keyboard focus, the mobile menu, publication search and
reset, image captions/alt text, and zoom. The link checker checks local links and
fragments, not external sites or visual quality. Include screenshots, source
notes, and unresolved content questions in the pull request. Done means the new
content is accurate, reachable, readable on a phone, and reviewed by Michael.
