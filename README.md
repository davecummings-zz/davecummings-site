# davecummings.co

Static portfolio and consulting website for Dave Cummings — custom website builds, performance optimization, and AI visibility for small businesses in Central Texas. Built with a lightweight Node.js build system (no npm packages) that injects shared components and outputs to `/dist/` for Vercel deployment.

## Build

```bash
node build.js
```

Reads `src/pages.json`, injects shared components, and writes all pages to `dist/`. Also generates `dist/sitemap.xml` and `dist/robots.txt`.

## Preview

```bash
cd dist && python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser.

## Source of Truth

**`CLAUDE.md`** is the authoritative reference for all design, content, architecture, and business decisions. Read it before making any changes to this repo.
