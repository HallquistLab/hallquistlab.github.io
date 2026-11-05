export function publicationSearchText(paper: {
  title: string;
  authors: string;
  venue: string;
  year: number;
  keywords?: string[];
}): string {
  return [
    paper.title,
    paper.authors,
    paper.venue,
    paper.year,
    ...(paper.keywords ?? []),
  ].join(" ");
}

export const normalizeSearch = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function filterPublications(
  records: { search: string; year: string }[],
  query: string,
  year: string,
): boolean[] {
  const terms = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
  return records.map(
    (record) =>
      (!year || record.year === year) &&
      terms.every((term) => normalizeSearch(record.search).includes(term)),
  );
}
