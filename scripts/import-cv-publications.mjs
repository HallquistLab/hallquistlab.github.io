/** Create reviewable publication candidates from a text export of the CV.
 * Never fetches Scholar or overwrites the curated catalog. See docs/publications.md.
 */
import fs from "node:fs/promises";
const [input, output] = process.argv.slice(2);
if (!input || !output)
  throw new Error(
    "Usage: node scripts/import-cv-publications.mjs cv.txt candidates.json",
  );
const venues = [
  "Personality and Individual Differences",
  "Contemporary Hypnosis",
  "International Journal of Behavioral Medicine",
  "Health Psychology",
  "American Journal of Chinese Medicine",
  "Journal of Consulting and Clinical Psychology",
  "Personality Disorders: Theory, Research, and Treatment",
  "Personality Disorders: Theory, Research & Treatment",
  "Personality Disorders: Theory, Research and Treatment",
  "Personality Disorders: Theory, Research, & Treatment",
  "Journal of Interpersonal Violence",
  "Structural Equation Modeling",
  "NeuroImage",
  "Journal of Abnormal Psychology",
  "Cerebral Cortex",
  "Journal of Personality Disorders",
  "Journal of Personality Assessment",
  "Journal of Clinical Oncology",
  "Comprehensive Psychiatry",
  "Psychology and Aging",
  "PLOS Biology",
  "Developmental Cognitive Neuroscience",
  "International Journal of Geriatric Psychiatry",
  "International Journal of Psychophysiology",
  "Journal of Clinical Psychiatry",
  "American Journal of Geriatric Psychiatry",
  "Autism Research",
  "Psychological Medicine",
  "Assessment",
  "Psychological Assessment",
  "Biological Psychiatry",
  "Developmental Science",
  "Clinical Psychological Science",
  "Perspectives on Psychological Science",
  "Cognition",
  "Network Neuroscience",
  "Cognitive, Affective, and Behavioral Neuroscience",
  "Psychopathology",
  "Neuropsychopharmacology",
  "Journal of Psychopathology and Behavioral Assessment",
  "Nature Communications",
  "Genetics in Medicine",
  "Brain Connectivity",
  "Journal of Personality",
  "Multivariate Behavioral Research",
  "Psychotherapy Research",
  "Annual Review of Clinical Psychology",
  "Current Opinion in Behavioral Sciences",
  "WIREs Cognitive Science",
  "Behavior Research and Therapy",
  "Journal of Psychiatric Research",
  "Developmental Psychology",
  "Journal of Affective Disorders",
  "Proceedings of the National Academy of Sciences",
  "Science Advances",
  "Journal of Statistics and Data Science Education",
  "JAMA Psychiatry",
  "Trends in Cognitive Sciences",
  "Journal of Neuroscience",
  "Computational Psychiatry",
  "Social Cognitive and Affective Neuroscience",
  "Nature Reviews Psychology",
  "Imaging Neuroscience",
];
let text = await fs.readFile(input, "utf8");
text = text.split("Public Preprints of Manuscripts Under Review")[0];
text = text
  .replace(/<PARSED TEXT FOR PAGE:[^>]*>/g, "")
  .replace(/^\s*Hallquist CV\s+Page \d+\s*$/gm, "")
  .replace(/^Curriculum Vitae: Michael Hallquist\s*$/gm, "")
  .replace(/^Revised .*$/gm, "");
if (text.includes("Refereed Articles"))
  text = text.split("Refereed Articles")[1];
const chunks = [...text.matchAll(/(?:^|\n)(\d+)\. ([\s\S]*?)(?=\n\d+\. |$)/g)];
const candidates = chunks.map(([, num, raw]) => {
  const citation = raw
    .replace(/\s+/g, " ")
    .replace(/[✤*]/g, "")
    .replace(/Denotes a mentored trainee.*$/, "")
    .trim();
  const match = citation.match(
    /^(.+?)\s*\(([^)]*(?:19|20)\d{2}[^)]*)\)\.\s*([\s\S]+)$/,
  );
  if (!match)
    throw new Error(`Could not parse year/authors for CV entry ${num}`);
  const [, authors, date, body] = match;
  const matches = venues
    .map((venue) => {
      const at = body.indexOf(venue);
      return {
        venue,
        at:
          at > 1 &&
          /[.?] $/.test(body.slice(0, at)) &&
          /^[,.]/.test(body.slice(at + venue.length))
            ? at
            : -1,
      };
    })
    .filter((x) => x.at >= 0)
    .sort((a, b) => a.at - b.at || b.venue.length - a.venue.length);
  if (!matches.length)
    throw new Error(`Unknown journal in CV entry ${num}: ${body}`);
  const { venue, at } = matches[0];
  const title = body
    .slice(0, at)
    .trim()
    .replace(/\.\s*$/, "");
  const rest = body.slice(at + venue.length).replace(/^[., ]+/, "");
  const details = rest
    .split(/PMCID:|https?:|\*|These authors|Both authors|Shared first/)[0]
    .replace(/\(Research Report\)[., ]*/g, "")
    .replace(/[. ]+$/, "")
    .replace(/(\d)- (\d)/g, "$1–$2")
    .trim();
  const year = Number(date.match(/(?:19|20)\d{2}/)[0]);
  const links = [];
  const pmc = citation.match(/PMCID:\s*(?:PMC)?(\d+)/);
  if (pmc)
    links.push({
      label: "Open text",
      url: `https://pmc.ncbi.nlm.nih.gov/articles/PMC${pmc[1]}/`,
    });
  for (const m of citation.matchAll(/https?:\/\/[^\s]+/g)) {
    const url = m[0].replace(/[.,]+$/, "");
    links.push({
      label: /10\.(1101|31234)|osf\.io/.test(url) ? "Preprint" : "Article",
      url,
    });
  }
  return {
    id: `cv-${num.padStart(3, "0")}`,
    cvNumber: Number(num),
    year,
    authors: authors.trim(),
    title,
    venue,
    details,
    status: date.includes("press") ? "in-press" : "published",
    links,
    sources: ["cv-july-2026"],
  };
});
if (new Set(candidates.map((p) => p.cvNumber)).size !== candidates.length)
  throw new Error("Duplicate CV numbers");
await fs.writeFile(output, JSON.stringify(candidates, null, 2) + "\n", {
  flag: "wx",
});
console.log(
  `Wrote ${candidates.length} candidates to ${output}; review before merging into src/data/publications.json.`,
);
