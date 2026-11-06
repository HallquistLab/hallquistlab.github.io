"""Check the built site's local links, fragments, headings, and archive controls."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote, urljoin
import json

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
if not (dist / 'index.html').exists():
    raise SystemExit('Build the site before checking links: npm run build')

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.links, self.h1, self.forms, self.old_buttons, self.articles = set(), [], 0, 0, 0, 0
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'): self.ids.add(a['id'])
        if tag in ['a', 'link'] and a.get('href'): self.links.append(a['href'])
        if tag in ['img', 'script'] and a.get('src'): self.links.append(a['src'])
        self.h1 += tag == 'h1'
        self.forms += tag == 'form'
        self.old_buttons += tag == 'button' and a.get('data-toggle') == 'collapse'
        self.articles += tag == 'article' and 'data-publication' in a

files = {('/' + str(path.relative_to(dist)).replace('index.html','')): path for path in dist.rglob('*.html')}
pages = {url: Page(path.read_text()) for url, path in files.items()}
core = ['/', '/research/', '/research/momentum/', '/research/lens/', '/people/', '/publications/', '/resources/', '/join/', '/contact/', '/lab/', '/archive/']
# Separate GitHub Pages project sites share the lab hostname but are deployed
# from their own repositories, outside this build. Keep this list explicit.
external_project_paths = ('/repair/',)
errors = []
for url in core:
    if url not in pages: errors.append(f'{url}: required page is missing')
for url, page in pages.items():
    failures = errors
    if url in core and page.h1 != 1: errors.append(f'{url}: expected one h1, found {page.h1}')
    if url.startswith('/archive/') and (page.forms or page.old_buttons): errors.append(f'{url}: historical form or inactive collapse button remains')
    for link in page.links:
        parsed = urlsplit(urljoin('https://hallquistlab.github.io' + url, link))
        if parsed.scheme not in ['http','https'] or parsed.netloc != 'hallquistlab.github.io': continue
        path = unquote(parsed.path)
        if path.startswith(external_project_paths): continue
        target = dist / path.lstrip('/')
        if target.is_dir(): target = target / 'index.html'
        if not target.exists():
            failures.append(f'{url}: missing {link}')
        elif parsed.fragment and path in pages and unquote(parsed.fragment) not in pages[path].ids:
            failures.append(f'{url}: missing fragment {link}')

expected = len(json.loads((root / 'src/data/publications.json').read_text()))
if pages['/publications/'].articles != expected: errors.append('The complete catalog is not present in server-rendered HTML')
for url in ['/join/', '/contact/']:
    if 'unc.az1.qualtrics.com' in files[url].read_text(): errors.append(f'{url}: old UNC application is exposed as current')
print(f'Checked {len(pages)} built pages; {expected} server-rendered publications.')
if errors:
    print('Broken links or archive-control errors:')
    for problem in sorted(set(errors)): print('  ' + problem)
    raise SystemExit(1)
print('All local links, fragments, images, and archive-control checks passed.')
