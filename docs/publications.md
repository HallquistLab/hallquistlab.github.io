# Maintaining publications

`src/data/publications.json` is the publication catalog used by the homepage,
Research page, and Publications page. Content is rendered at build time; visitors
can search by title, author, journal, and year. The entire bibliography and year
navigation remain available without JavaScript.

## Scope and sources

The initial catalog includes all **105 refereed articles** in _Hallquist Curriculum
Vitae Emory.docx_, revised July 8, 2026, plus the Hallquist–Tackett Annual Review
article: **106 records**. It is a bibliography of Michael Hallquist and collaborators,
not a claim that every article by every former lab member is included. The original
lab bibliography, including additional trainee work, is preserved at
`/archive/publications/`. Books, chapters, conference presentations, and manuscripts
under review are not included by default. Selected public preprints may be added
with `status: "preprint"` and an explicit preprint label; they are not counted as
refereed articles. The REPAIR preprint (Vig & Hallquist, November 5, 2026) is the
first such addition, bringing the current catalog to **107 records**. Its metadata
was checked against the OSF API and package documentation on November 6, 2026.

The attached CV is the baseline, identified by `sources: ["cv-july-2026"]` and a
`cvNumber`. The full CV is intentionally not copied into the public repository.

The supplied Google Scholar profile could not be retrieved during this update.
Recent entries were instead reconciled with publisher pages and PubMed records.
`verifiedAt` records the date of that check; records without it retain CV metadata
and have not received a full independent bibliographic audit. Do not describe the
catalog as a live Scholar sync.

Notable reconciliations:

| Record                      | Published metadata used                                                                                                                                                                                                                                              |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Allen et al., 2026          | _Integrating the Hierarchical Taxonomy of Psychopathology and computational psychiatry_, Nature Reviews Psychology 5, 757–772. https://doi.org/10.1038/s44159-026-00621-7. The published title and author list replace the CV's earlier title/workgroup attribution. |
| Hallquist & Tackett, 2026   | _Adolescent Personality Pathology and the Development of Identity, Relationships, and Civic Engagement_. https://doi.org/10.1146/annurev-devpsych-111124-031623. Listed as Review in Advance; no final page range invented.                                          |
| Schreiber & Hallquist, 2026 | Computational Psychiatry 10(1), 85–103. https://doi.org/10.5334/cpsy.159.                                                                                                                                                                                            |
| Vallorani et al., 2026      | SCAN 21(1), nsag027. https://doi.org/10.1093/scan/nsag027; replaces the preprint DOI in the CV.                                                                                                                                                                      |
| Vallorani et al., 2026      | Imaging Neuroscience 4, IMAG.a.1403. https://doi.org/10.1162/IMAG.a.1403; uses the published title including “inter-brain.”                                                                                                                                          |
| Okan & Hallquist, 2025      | Trends in Cognitive Sciences 29(5), 407–420. https://doi.org/10.1016/j.tics.2025.01.002.                                                                                                                                                                             |
| Wicher et al., 2025         | Personality Disorders 16(5), 415–426. https://doi.org/10.1037/per0000725.                                                                                                                                                                                            |
| Schreiber et al., 2025      | Psychological Medicine 55, e105. https://doi.org/10.1017/S0033291725000595.                                                                                                                                                                                          |
| Papale et al., 2025         | Journal of Neuroscience 45(50), e0399252025. https://doi.org/10.1523/JNEUROSCI.0399-25.2025.                                                                                                                                                                         |
| Martin et al., 2024         | Published title: _Behavioral measures of psychotic disorders: Using automatic facial coding to detect nonverbal expressions in video_. https://doi.org/10.1016/j.jpsychires.2024.05.056.                                                                             |
| Shafiei et al., 2024        | Published title: _Generalizable links between borderline personality traits and functional connectivity_. https://doi.org/10.1016/j.biopsych.2024.02.1016; replaces the preprint identifier.                                                                         |
| Hall et al., 2024           | PNAS 121, e2313665121. https://doi.org/10.1073/pnas.2313665121; replaces the preprint identifier.                                                                                                                                                                    |
| Lynn et al.                 | Final issue citation is 2018, 21(1), e12508. https://doi.org/10.1111/desc.12508.                                                                                                                                                                                     |
| Chahal et al.               | Final issue citation is 2021, 51(16), 2835–2845; first online in 2020. https://doi.org/10.1017/S003329172000149X.                                                                                                                                                    |

Existing local PDF links are retained when a matching title appears in the old
bibliography. An old preprint PDF is not relabeled as a final article. A source DOI
in the CV is not assumed to be a journal DOI simply because an article is in press.

## Adding or editing an article

1. Prefer publisher metadata for the final title, author order, year, journal,
   volume/pages/article number, and DOI. Use PubMed when useful for reconciliation.
2. Check existing titles and DOIs before adding a record. Update a preprint/in-press
   record when its article is published rather than creating a duplicate.
3. Give each record a stable `id`. Existing `cv-XXX` IDs retain the original CV
   numbering even if a publication's year or title changes.
4. Record the evidence in `sources`. Add `verifiedAt` only after checking the actual
   citation. Use `published`, `in-press`, `advance-online`, or `preprint` accurately.
5. Add only known links, labeled `Article`, `Open text`, `PDF`, `Code`, `Data`, `Preprint`, or `R package`.
   Put distributable local PDFs under `public/media/`; use publisher links when
   redistribution is uncertain. A record may have no access link.
6. For a spotlight, add `shortTitle`, `summary` in our own words, and `authorLabel`.
   Set `featured: true` for Publications-page spotlights. An `R package` link
   also appears alongside the manuscript link on spotlight cards. Homepage
   choices are explicit IDs in `src/pages/index.astro`. Related research papers are
   explicit IDs in `src/data/research.ts`.
7. Run `npm test`, `npm run build`, and `npm run check:links`.

These are curated selections, not an automatic claim that the first items in an
alphabetical/year sort are the most recent publications by exact release date.

## Importing another CV export

The importer writes **candidates**, never the curated catalog, and refuses to
replace an existing output file:

```bash
node scripts/import-cv-publications.mjs /absolute/path/to/cv-text.txt /tmp/candidates.json
```

Supply plain text containing the numbered Refereed Articles section; stop before
other bibliography sections if the export has different headings. The importer
recognizes the journal names in this CV, strips page furniture and trainee symbols,
and separates authors, title, venue, year, and access links. It fails on unknown
venues or unparseable entries so they can be reviewed explicitly.

Review candidate records before merging. Keep existing enriched fields, stable IDs,
verified metadata, and manual spotlight copy. Never replace the entire catalog
with fresh candidates, scrape Scholar at build time, or check the personal CV into
this repository.
