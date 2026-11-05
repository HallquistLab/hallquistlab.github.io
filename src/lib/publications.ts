import records from "../data/publications.json";

export interface Publication {
  id: string;
  cvNumber?: number;
  year: number;
  authors: string;
  authorLabel?: string;
  title: string;
  venue: string;
  details: string;
  status: string;
  doi?: string;
  links: { label: string; url: string }[];
  sources: string[];
  featured?: boolean;
  shortTitle?: string;
  summary?: string;
  keywords?: string[];
}
export const publications: Publication[] = [...records].sort(
  (a, b) => b.year - a.year || a.authors.localeCompare(b.authors),
);
export const featuredPublications = publications.filter(
  (paper) => paper.featured,
);
export function getPublication(id: string): Publication {
  const paper = publications.find((paper) => paper.id === id);
  if (!paper) throw new Error(`Unknown publication: ${id}`);
  return paper;
}
export function publicationUrl(paper: Publication, base = "/") {
  const link =
    paper.links.find((link) => link.label === "Article") ?? paper.links[0];
  return link
    ? link.url.startsWith("/")
      ? `${base}${link.url.slice(1)}`
      : link.url
    : `${base}publications/#${paper.id}`;
}
