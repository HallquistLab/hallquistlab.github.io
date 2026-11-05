# Emory editorial design

The November 2026 update retains white space, Emory blue/gold, serif display type,
and the existing static Astro foundation. It shortens the homepage introduction,
replaces the repeated lab-description card with a real paper, and makes research
questions navigable. The homepage now leads with “Learning, emotion, and mental
health,” supported by the lab’s emphasis on individual differences and
transdiagnostic dimensions of personality and psychopathology.

## Copy style

Use the supplied short bio and research statement as the source for the lab’s
scientific description. Name the subject of each section directly: Research team,
Selected publications, Statistical and computational methods. Avoid motivational
slogans, generic claims about curiosity or collaboration, and repeating the same
research summary in every section. Questions should identify a specific research
problem. Keep publication titles, study status, and historical records accurate.

## Visitor flow

- Home → Research themes → related publications.
- Home / Research → Momentum and LENS → questions, methods, related work, and
  companion project.
- Home → selected papers → complete searchable bibliography.
- People → training opportunities → current contact information.
- Resources → software, workshops, and courses.
- Life in the lab → dated historical photos and archive links.

All prominent destinations now have current-purpose pages. Recruitment copy avoids
asserting that a position is open or reusing a historical deadline. The current
team is sourced from the existing Emory section, with real HTML biographies and
monograms; current portraits can be added when available. Historical group photos
are explicitly labeled with their UNC context and dates.

## Archive boundaries

All 19 migrated pages have stable `/archive/<slug>/` copies. Existing root URLs
remain available; pages with historical logistics or content render an archive
notice, while current People, Publications, Resources, Join, and Contact routes
have dedicated pages. Historical forms are removed from rendered HTML and old
FAQ buttons become native disclosures. Original source data remains unchanged.

Archive pages are marked `noindex, follow` to avoid presenting outdated logistics
as current search results. They are omitted from the sitemap. Archives are still
reachable through the footer and relevant current pages.

## Editing

- `src/styles/global.css`: color, type, spacing, grids, mobile layout.
- `src/data/people.json`: current team.
- `src/data/research.ts`: research questions and related publication IDs.
- `src/data/projects.ts`: Momentum and LENS summaries, questions, methods, and
  related publication IDs.
- `src/pages/research/[project].astro`: shared project page template.
- `src/components/ProjectCards.astro`: homepage and research project summaries.
- `src/data/publications.json`: catalog and spotlight copy; see `publications.md`.
- `src/components/PublicationCard.astro`: shared homepage/publication spotlights.
- `src/components/ArchivePage.astro`: historical wrapper.

The earlier alternatives under `design-review/` are exploratory local material,
not a dependency of this site or part of the production build.

## Momentum and LENS

Momentum is presented as the foundation for a connected research program, with
LENS explicitly labeled as an upcoming study. Both projects connect to all three
research themes. The original UNC Momentum description remains in the archive.
Related publications supply scientific context; they are not labeled as findings
from LENS.

Public project copy was checked against the supplied LENS narrative, abstract,
specific aims, and final research strategy. The study's hypotheses remain
questions. Planned enrollment, age cutoffs, assessment counts, and recruitment
details are omitted until the public protocol and recruitment status are settled.
The private study documents are not included in the public site.

## Verification

Use Node 24 or later. Run the data/search regression tests, Astro check/build, and
built-site link checker.

The local recovery on November 5, 2026 passed all five data/search regression
tests, formatting, Astro check (zero errors, warnings, or hints), and a 46-page
build/link check. Chromium checks covered ten current pages at 390, 768, 1024,
and 1440 pixel widths without horizontal overflow, with screenshots inspected
for the homepage, research overview, and project layouts. Project/companion links,
the mobile menu, publication search/year/reset/no-match states, native FAQ
disclosures, and keyboard skip navigation passed. A 720-pixel viewport checked
reflow equivalent to a 1440-pixel viewport at 200% zoom. All 106 publications
remained readable with JavaScript disabled.

Browser QA found and fixed a publication reset timing bug: filtering now runs
after the browser restores the form's default values. Verification used the built
static site served locally; deployment was not changed.

The copy revision also passed browser checks at 320 pixels, including the longer
homepage headline and section headings. The supplied short bio is displayed in
two paragraphs on the People page.
