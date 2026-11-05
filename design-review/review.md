# Hallquist Lab website: design and implementation review

November 5, 2026

## Recommendation

Retain the current Emory palette and editorial typography. Improve the homepage's balance of explanation and evidence, then carry that visual system through purpose-built Research, People, Publications, Resources, and Join pages. A wholesale theme replacement would have less value than completing those pages.

Open `comparison.html` for three standalone homepage studies, with desktop and phone-width controls. These propose organization and copy; they do not change the production pages. The photo in the Open Lab study is explicitly identified as a historical UNC photo, not the current Emory team.

## What already works

- Restrained blue, white, and gold give the lab an institutional identity without making it look like a departmental template.
- Serif display headings and sans-serif navigation distinguish the site from a generic academic directory.
- Five primary navigation items are manageable. The separate Join action makes an important visitor task prominent.
- Shared layout, responsive CSS, local assets, and static Astro output provide a straightforward foundation for maintenance.
- Skip navigation, visible keyboard focus, current-page labels, reduced-motion support, and a native mobile menu are already present.

The original UNC homepage includes an events calendar with no upcoming events and participant/study spotlights. The new homepage's deliberate hierarchy is a useful improvement over that inherited structure. Original reference: https://dependlab.unc.edu/.

## Highest-priority improvements

### 1. Give current destinations current content

The prominent Join action leads to `/join/`, which is marked as a UNC archive and contains old deadlines, UNC application links, and contact details. A new Emory opportunities page should explain the available training routes and list recruitment status only after it is confirmed. Keep the old page accessible through the archive.

Likewise, Research currently leads to `/studies/`, a migrated set of NeuroMAP, Momentum, and ROSES descriptions. The separate `/about/` page contains the broader scientific approach. Combine these into a current research landing page with themes, associated projects, and related papers. Study recruitment logistics should have their own clearly labeled destination when needed.

Implementation: `src/layouts/BaseLayout.astro`, `src/lib/legacy.ts`, `src/pages/[slug].astro`, and `src/data/legacy-pages.json`.

### 2. Make the homepage more concrete

The large headline, explanatory paragraph, blue lab-description card, question band, and research-focus introduction all explain the lab before visitors encounter a particular result or person. The blue card repeats information already present in the header and introductory copy.

Keep the headline if it still feels right. Replace the card with a selected paper, an actual research figure with a short explanation, or current lab photography. Reduce the height of the hero and statement band so research appears sooner. Integrate the best scientific questions into linked research-theme entries. Add two or three selected papers and a compact people invitation.

Suggested order: concise introduction and feature → three research questions → selected publications → people and opportunities → resources and contact. Add a small dated update only if the lab will maintain it.

Implementation: `src/pages/index.astro` and `src/styles/global.css`.

### 3. Rebuild people profiles as real text

The current Emory section contains two text-only cards, followed by a lengthy UNC team archive. The archived People HTML contains 19 images, all with empty alternative text; the inspected Sophie profile combines the photograph and full biography in one image. That text cannot reflow independently of the image, becomes difficult to read on a phone, and is unavailable to a screen reader through its empty alt attribute.

Use individual portraits, names, roles, research interests, and profile/contact links as HTML. Keep a consistent portrait ratio. Present current members first and put the historical team on a separate archive page. Preserve historical affiliations without presenting them as current. Portraits alongside an adjacent name can use empty alt text when the image adds no further information; biography text must remain accessible HTML.

Implementation: new reusable profile component and structured people data, replacing the current special case in `src/pages/[slug].astro`.

### 4. Make publications easy to scan

The migrated bibliography starts with 2024 and continues as a long series of citation paragraphs. Keep the bibliography, but distinguish title, authors, venue/year, and available actions. Use descriptive links such as Article, PDF, Code, and Data instead of repeated “Click here to access.” Add year jump links and search; topic filters are worthwhile only if someone will maintain the tags. A short selected-work section should introduce the list. Confirm recent entries and preprint/publication duplicates before calling the list current.

Store publications as structured data or a maintained bibliography and render them with a reusable component.

### 5. Give resources a real landing page

The Resources navigation currently opens Quantitative Methods. Code for Projects and MplusAutomation exist separately but have no direct links in the shared primary/footer navigation. Create a resource index with clear groups for software, courses/workshops, and analysis tutorials. Link existing maintained destinations rather than duplicating their documentation.

### 6. Finish the interaction migration

The old recruitment FAQ contains 13 buttons with Bootstrap collapse attributes, but the shared layout loads no interaction script. CSS forces `.collapse` bodies to display while the buttons retain `aria-expanded="false"`. Use native `details`/`summary` or accessible working disclosures; do not leave controls that visually imply behavior they cannot provide.

The migrated Contact page still contains a WordPress form posting to `/wp-json/wp/v2/pages/…`. Static Astro output supplies no matching form handler. Replace it with current contact details and an email action, or deliberately implement a form service if one is wanted. Retained historical form markup should not look operational.

## Layout and typography refinements

- Preserve generous spacing but reduce the number of very tall introductory sections.
- Separate a wide layout shell from a narrower prose column, around 65–75 characters where practical. The current legacy paragraphs can be 890 pixels wide.
- Use at least approximately 13–14 pixels for useful navigation and labels; several current labels are 10–11 pixels.
- Relax the tightest display typography: the hero uses a 0.86 line-height and -0.065em letter spacing. Judge the final values with the actual chosen font and at narrow widths.
- Select and load a deliberate heading/body font pair if consistent rendering across operating systems matters. Inter is currently named in CSS but not loaded by the layout; the serif stack also varies by platform.
- Make research focus items actual links and preserve clear hover and keyboard-focus states.
- Check the two-column hero around tablet widths. It retains a 340-pixel minimum right column until the 760-pixel breakpoint; the layout merits testing before assuming it fits comfortably.
- Treat a favicon, social-sharing image, and consistent contact entry as finishing touches after the core visitor journeys work.

## Alternative directions

| Direction | Color and typography | Layout | Tradeoff |
| --- | --- | --- | --- |
| Emory editorial — recommended | White, Emory blue, restrained gold; serif headlines | Compact split hero with featured paper; ruled research index; selected work | Strongest continuity; improvement depends on better content hierarchy |
| Research studio | Navy, warm ivory, muted teal; bold sans-serif | Dark opening organized around a scientific question; indexed research modules | Distinctive computational-science identity, with less of the current scholarly warmth |
| Open lab | Warm off-white, Emory navy, subdued ochre; serif headlines | Split photo opening; welcoming introduction; people share prominence with research | More personal and inviting; needs good current portraits and lab photography |

The alternatives are design proposals, not claims that these palettes are official Emory templates. A mostly dark site is unnecessary; the Research Studio example uses dark color selectively in the opening.

## Implementation sequence

1. Keep the current shell; create current Join and Contact destinations and make legacy forms/disclosures unambiguous.
2. Replace the repeated homepage card with selected work and make the research themes navigable.
3. Build current Research and People pages from reusable components and data; give historical content its own archive destinations.
4. Structure publications and resources, adding only the filtering/navigation that serves real visitor needs.
5. Verify desktop, tablet, phone, keyboard navigation, text zoom, images, and links, then publish through the existing workflow when requested.

Keep raw historical content for preservation, but avoid making the JSON/WordPress HTML renderer the long-term authoring system for current pages. Dedicated Astro pages can replace the corresponding dynamic routes while archive routes retain the original content. No framework migration is needed.

## Verification and limits

- Reviewed the shared layout, homepage, page wrapper, all shared CSS, migration helpers, and representative content for People, Research, Publications, Resources, Join, and Contact.
- `npm run build` passed using Node 24.21.0: 23 static pages; Astro check reported zero errors, warnings, or hints.
- The configured GitHub Pages URL returned “Site not found” during this review. That is a deployment observation, separate from the successful local build.
- Browser visual and responsive verification could not be completed: local server binding was denied, and browser policy does not allow opening local file URLs. Layout recommendations are based on source inspection, not a completed screenshot audit.
- The comparison HTML is self-contained, including the historical photo. Its JavaScript syntax and theme-switching output were checked locally. Production source files were not changed.
