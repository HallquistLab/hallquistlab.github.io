import legacyPages from "../data/legacy-pages.json";

export interface LegacyPage {
  id: number;
  slug: string;
  title: string;
  modified: string;
  sourceUrl: string;
  html: string;
}

export const pages = legacyPages as LegacyPage[];

export const pageDescriptions: Record<string, string> = {
  "depend-home":
    "A preserved snapshot of the former DEPENd Lab homepage at UNC–Chapel Hill.",
  about:
    "Our scientific approach to personality, self-regulation, decision-making, and psychopathology.",
  "diversity-equity":
    "Our commitment to a research community strengthened by differences in identity, experience, and perspective.",
  studies:
    "Research on the neurocomputational processes that connect emotion, learning, personality, and behavior.",
  people: "The Hallquist Lab at Emory and the people who built the DEPENd Lab at UNC.",
  publications: "Peer-reviewed articles, preprints, and open research from the lab.",
  join: "Ways to train and conduct research with the Hallquist Lab.",
  news: "Research milestones, presentations, celebrations, and lab updates.",
  "quantitative-methods":
    "Open training materials for multilevel modeling, structural equation modeling, R, and reproducible research.",
  "lab-activities":
    "An archive of retreats, presentations, celebrations, and everyday life in the lab.",
  "code-for-projects": "Open-source code and software produced by the lab.",
  mplusautomation:
    "Tools for automating latent variable model estimation and interpretation in Mplus from R.",
  "participation-forms":
    "Archived participant information from studies conducted at UNC–Chapel Hill.",
  "depend-parking-maps-directions":
    "Archived directions for the former UNC–Chapel Hill lab location.",
  contact: "Contact the Hallquist Lab at Emory University.",
  participate: "Research participation information from the former UNC lab website.",
  resources: "Research, training, and software resources from the lab.",
  "media-resources": "Media resources from the former lab website.",
  "our-team": "Team information from the former lab website.",
};

export const archivedContext = new Set([
  "depend-home",
  "participation-forms",
  "depend-parking-maps-directions",
  "contact",
  "join",
  "participate",
]);

export function getPage(slug: string) {
  return pages.find((page) => page.slug === slug);
}

export function renderLegacyHtml(html: string, base: string) {
  return html.replaceAll("__BASE__", base);
}
