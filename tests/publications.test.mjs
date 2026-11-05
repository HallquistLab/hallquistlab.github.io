import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  filterPublications,
  publicationSearchText,
} from "../src/lib/publication-filter.ts";
const papers = JSON.parse(
  fs.readFileSync(
    new URL("../src/data/publications.json", import.meta.url),
    "utf8",
  ),
);
const records = papers.map((paper) => ({
  search: publicationSearchText(paper),
  year: String(paper.year),
}));
const find = (query, year = "") =>
  papers
    .filter((_, index) => filterPublications(records, query, year)[index])
    .map((p) => p.id);

test("CV import retains every numbered refereed article, without duplicate titles or DOIs", () => {
  assert.deepEqual(
    papers
      .filter((p) => p.cvNumber)
      .map((p) => p.cvNumber)
      .sort((a, b) => a - b),
    Array.from({ length: 105 }, (_, i) => i + 1),
  );
  const titles = papers.map((p) =>
    p.title.toLowerCase().replace(/[^a-z0-9]/g, ""),
  );
  assert.equal(new Set(titles).size, papers.length);
  const dois = papers.filter((p) => p.doi).map((p) => p.doi.toLowerCase());
  assert.equal(new Set(dois).size, dois.length);
  for (const paper of papers) {
    assert.ok(
      paper.title && paper.authors && paper.venue && paper.sources.length,
    );
    assert.ok(
      ["published", "in-press", "advance-online"].includes(paper.status),
    );
    for (const link of paper.links)
      assert.ok(
        link.url.startsWith("https://") || link.url.startsWith("/media/"),
      );
  }
});

test("spotlights use final article identifiers and distinguish advance publication", () => {
  const selected = papers.filter((p) => p.featured);
  assert.equal(selected.length, 2);
  assert.equal(
    selected.find((p) => p.id === "cv-104").doi,
    "10.1038/s44159-026-00621-7",
  );
  assert.equal(
    selected.find((p) => p.id === "hallquist-tackett-2026").status,
    "advance-online",
  );
  for (const paper of selected) {
    assert.ok(paper.summary && paper.shortTitle && paper.authorLabel);
    assert.ok(
      paper.links.some((link) => link.url === `https://doi.org/${paper.doi}`),
    );
    assert.ok(!paper.links.some((link) => /10\.(1101|31234)/.test(link.url)));
  }
});

test("search combines terms and year, recognizes HiTOP and accents, and resets", () => {
  assert.deepEqual(find("Allen computational", "2026"), ["cv-104"]);
  assert.deepEqual(find("HiTOP", "2026"), ["cv-104"]);
  assert.deepEqual(find("negative affect impulsivity", "2025"), ["cv-098"]);
  assert.deepEqual(find("Schréiber", "2025"), ["cv-100"]);
  assert.deepEqual(find("not-a-real-publication"), []);
  assert.equal(find("  ").length, papers.length);
  assert.ok(find("Hallquist", "2026").includes("hallquist-tackett-2026"));
});

test("all catalog PDF links resolve to a local asset", () => {
  for (const paper of papers)
    for (const link of paper.links)
      if (link.url.startsWith("/")) {
        assert.ok(
          fs.existsSync(
            new URL(
              `../public${decodeURIComponent(link.url)}`,
              import.meta.url,
            ),
          ),
          `${paper.id}: ${link.url}`,
        );
      }
});

test("CV candidates preserve journal names inside titles and never overwrite curated data", async () => {
  const { mkdtempSync, writeFileSync, readFileSync, rmSync } = await import(
    "node:fs"
  );
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const { spawnSync } = await import("node:child_process");
  const temporary = mkdtempSync(join(tmpdir(), "hallquist-cv-test-"));
  try {
    const input = join(temporary, "cv.txt"),
      output = join(temporary, "candidates.json");
    writeFileSync(
      input,
      "Refereed Articles\n1. Allen, T. A., & Hallquist, M. N. (2026, in press). Integrating HiTOP and Computational Psychiatry for a New Era of Clinical Science. Nature Reviews Psychology.\n2. Kotov, R., & Hallquist, M. N. (2021). The Hierarchical Taxonomy of Psychopathology (HiTOP): A quantitative nosology based on consensus of evidence. Annual Review of Clinical Psychology, 17, 83–108.\nPublic Preprints of Manuscripts Under Review\n1. Another author. (2024). Not a journal article.",
    );
    const script = new URL(
      "../scripts/import-cv-publications.mjs",
      import.meta.url,
    );
    const run = () =>
      spawnSync(process.execPath, [script.pathname, input, output], {
        encoding: "utf8",
      });
    assert.equal(run().status, 0);
    const imported = JSON.parse(readFileSync(output, "utf8"));
    assert.equal(imported.length, 2);
    assert.equal(imported[0].venue, "Nature Reviews Psychology");
    assert.ok(imported[1].title.includes("Psychopathology (HiTOP)"));
    assert.equal(imported[1].venue, "Annual Review of Clinical Psychology");
    assert.notEqual(run().status, 0);
    assert.equal(JSON.parse(readFileSync(output, "utf8")).length, 2);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});
