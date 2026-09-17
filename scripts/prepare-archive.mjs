import fs from "node:fs/promises";
import path from "node:path";
import https from "node:https";
import http from "node:http";

const source = process.argv[2];
if (!source)
  throw new Error("Usage: node scripts/prepare-archive.mjs /path/to/pages.json");

const root = path.resolve(import.meta.dirname, "..");
const publicMedia = path.join(root, "public", "media");
const archiveDir = path.join(root, "archive");
const dataDir = path.join(root, "src", "data");
const raw = JSON.parse(await fs.readFile(source, "utf8"));

await fs.mkdir(publicMedia, { recursive: true });
await fs.mkdir(archiveDir, { recursive: true });
await fs.mkdir(dataDir, { recursive: true });

const decode = (text) =>
  text
    .replaceAll("&amp;", "&")
    .replaceAll("&#8217;", "’")
    .replaceAll("&#8211;", "–")
    .replaceAll("&#8212;", "—")
    .replaceAll("&#038;", "&");

const assetUrls = new Set();
for (const page of raw) {
  for (const match of page.content.rendered.matchAll(
    /(?:src|href)=["'](https?:\/\/dependlab\.unc\.edu\/wp-content\/uploads\/[^"']+)["']/gi,
  )) {
    assetUrls.add(decode(match[1]));
  }
}

function relativeMediaPath(url) {
  const parsed = new URL(url);
  return decodeURIComponent(parsed.pathname.split("/wp-content/uploads/sites/266/")[1]);
}

function cleanHtml(input) {
  let html = input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(
      /\s(?:srcset|sizes|style|contenteditable|data-sessionid|data-shapeids|data-slideid|role|aria-label)=("[^"]*"|'[^']*')/gi,
      "",
    )
    .replace(/\son[a-z]+=("[^"]*"|'[^']*')/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "");

  for (const asset of assetUrls) {
    const local = `__BASE__media/${relativeMediaPath(asset).split("/").map(encodeURIComponent).join("/")}`;
    html = html
      .split(asset)
      .join(local)
      .split(asset.replaceAll("&", "&amp;"))
      .join(local);
  }

  html = html
    .replace(/https?:\/\/dependlab\.unc\.edu\/(?:depend\/)?/gi, "__BASE__")
    .replace(/href=["']__BASE__depend-home\/?["']/gi, 'href="__BASE__"')
    .replace(
      /<a([^>]*?)href=(["'])__BASE__(?!media\/)[^"']+\2([^>]*)>(\s*<img([^>]*)src=(["'])(__BASE__media\/[^"']+)\6([^>]*)>\s*)<\/a>/gi,
      '<a$1href="$7"$3>$4</a>',
    )
    .replace(/\sclass=("\s*"|'\s*')/gi, "")
    .replace(/<p>\s*<\/p>/gi, "");
  return html.trim();
}

const pages = raw.map((page) => ({
  id: page.id,
  slug: page.slug === "depend-home" ? "depend-home" : page.slug,
  title: decode(page.title.rendered).replace(/<[^>]+>/g, ""),
  modified: page.modified_gmt,
  sourceUrl: page.link,
  html: cleanHtml(page.content.rendered),
}));

await fs.copyFile(source, path.join(archiveDir, "wp-pages.json"));
await fs.writeFile(
  path.join(dataDir, "legacy-pages.json"),
  `${JSON.stringify(pages, null, 2)}\n`,
);

function download(url, destination, redirects = 0) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;
    const request = client.get(
      url,
      { headers: { "User-Agent": "Mozilla/5.0" } },
      (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location &&
          redirects < 5
        ) {
          response.resume();
          resolve(
            download(
              new URL(response.headers.location, url).href,
              destination,
              redirects + 1,
            ),
          );
          return;
        }
        if (response.statusCode !== 200) {
          response.resume();
          reject(new Error(`${response.statusCode} ${url}`));
          return;
        }
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", async () => {
          await fs.mkdir(path.dirname(destination), { recursive: true });
          await fs.writeFile(destination, Buffer.concat(chunks));
          resolve();
        });
      },
    );
    request.on("error", reject);
    request.setTimeout(60000, () => request.destroy(new Error(`Timeout ${url}`)));
  });
}

const queue = [...assetUrls];
let completed = 0;
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    const destination = path.join(publicMedia, relativeMediaPath(url));
    try {
      await download(url, destination);
      completed += 1;
      process.stdout.write(`\rDownloaded ${completed}/${assetUrls.size}`);
    } catch (error) {
      console.error(`\nFailed: ${error.message}`);
      throw error;
    }
  }
}

await Promise.all(Array.from({ length: 6 }, worker));
console.log(
  `\nPrepared ${pages.length} pages and ${assetUrls.size} referenced media files.`,
);
