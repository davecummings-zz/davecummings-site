const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const DIST = path.join(ROOT, 'dist');
const PAGES_JSON = path.join(SRC, 'pages.json');
const COMPONENTS_DIR = path.join(SRC, 'components');
const PAGES_DIR = path.join(SRC, 'pages');

function die(msg) {
  console.error(`\nERROR: ${msg}`);
  process.exit(1);
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    die(`Cannot read ${path.relative(ROOT, filePath)}: ${e.message}`);
  }
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(filePath);
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  built:  ${path.relative(ROOT, filePath)}`);
  } catch (e) {
    die(`Cannot write ${path.relative(ROOT, filePath)}: ${e.message}`);
  }
}

function copyFile(src, dest) {
  ensureDir(dest);
  try {
    fs.copyFileSync(src, dest);
    console.log(`  copied: ${path.relative(ROOT, dest)}`);
  } catch (e) {
    die(`Cannot copy ${path.relative(ROOT, src)} to ${path.relative(ROOT, dest)}: ${e.message}`);
  }
}

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

function buildSchemaJsonLd(page) {
  if (!page.schemaType) return '';

  if (page.schemaType === 'LocalBusiness') {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Dave Cummings',
      description: page.description,
      url: page.canonical,
      email: 'dave@davecummings.co',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Round Rock',
        addressRegion: 'TX',
        addressCountry: 'US'
      },
      areaServed: 'Central Texas',
      founder: {
        '@type': 'Person',
        name: 'Dave Cummings',
        sameAs: ['https://www.linkedin.com/in/davidwcummings']
      }
    };
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }

  if (page.schemaType === 'Service') {
    const name = page.title.replace(/\s*—\s*Dave Cummings$/, '');
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name,
      description: page.description,
      provider: {
        '@type': 'Person',
        name: 'Dave Cummings',
        url: 'https://davecummings.co/',
        sameAs: ['https://www.linkedin.com/in/davidwcummings']
      },
      areaServed: {
        '@type': 'Place',
        name: 'Central Texas'
      },
      url: page.canonical
    };
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }

  // TODO: add handlers for schemaType: 'Person', 'CreativeWork', 'Blog'
  return '';
}

function buildHead(template, page) {
  const robots = page.indexed ? 'index, follow' : 'noindex, nofollow';
  const ogImageMeta = page.ogImage
    ? `\n<meta property="og:image" content="${page.ogImage}">`
    : '';
  const schemaJsonLd = buildSchemaJsonLd(page);

  return template
    .replace(/\{\{TITLE\}\}/g, page.title)
    .replace(/\{\{DESCRIPTION\}\}/g, page.description)
    .replace(/\{\{CANONICAL\}\}/g, page.canonical)
    .replace(/\{\{ROBOTS\}\}/g, robots)
    .replace(/\{\{OG_IMAGE_META\}\}/g, ogImageMeta)
    .replace(/\{\{SCHEMA_JSONLD\}\}/g, schemaJsonLd);
}

function buildPage(page, headTemplate, headerContent, footerContent) {
  const sourcePath = path.join(PAGES_DIR, page.path);
  let content = readFile(sourcePath);
  const head = buildHead(headTemplate, page);

  return content
    .replace(/\{\{LANG\}\}/g, page.lang || 'en')
    .replace(/\{\{HEAD\}\}/g, head)
    .replace(/\{\{HEADER\}\}/g, headerContent)
    .replace(/\{\{FOOTER\}\}/g, footerContent);
}

function buildSitemap(pages) {
  const indexedPages = pages.filter(p => p.indexed);
  if (indexedPages.length === 0) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
</urlset>`;
  }

  const urls = indexedPages.map(p => {
    let entry = `  <url>\n    <loc>${p.canonical}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>`;
    if (p.hreflang_es) {
      entry += `\n    <xhtml:link rel="alternate" hreflang="en" href="${p.canonical}" />`;
      entry += `\n    <xhtml:link rel="alternate" hreflang="es" href="${p.hreflang_es}" />`;
    }
    entry += `\n  </url>`;
    return entry;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: https://davecummings.co/sitemap.xml
`;
}

function main() {
  console.log('Building davecummings.co...\n');

  // Clean dist/
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
  console.log('dist/ cleaned\n');

  // Read pages.json
  let pages;
  try {
    pages = JSON.parse(readFile(PAGES_JSON));
  } catch (e) {
    die(`Invalid JSON in pages.json: ${e.message}`);
  }
  if (!Array.isArray(pages)) die('pages.json must be a JSON array');

  // Read shared components
  const headTemplate = readFile(path.join(COMPONENTS_DIR, 'head.html'));
  const headerContent = readFile(path.join(COMPONENTS_DIR, 'header.html'));
  const footerContent = readFile(path.join(COMPONENTS_DIR, 'footer.html'));

  // Build pages
  console.log('Pages:');
  for (const page of pages) {
    if (!page.path) die(`Page entry missing "path" field: ${JSON.stringify(page)}`);
    const built = buildPage(page, headTemplate, headerContent, footerContent);
    writeFile(path.join(DIST, page.path), built);
  }

  // Copy styles.css
  console.log('\nAssets:');
  copyFile(path.join(COMPONENTS_DIR, 'styles.css'), path.join(DIST, 'styles.css'));

  // Copy src/assets/ if it exists
  copyDir(path.join(SRC, 'assets'), DIST);

  // Generate sitemap.xml and robots.txt
  console.log('\nGenerated:');
  writeFile(path.join(DIST, 'sitemap.xml'), buildSitemap(pages));
  writeFile(path.join(DIST, 'robots.txt'), buildRobots());

  console.log(`\nBuild complete. ${pages.length} page(s) built.\n`);
}

main();
