# davecummings.co

Custom websites for small businesses. Built by Dave Cummings, a web developer with 15+ years of experience in ecommerce and modern web development.

This repository is the source of the live site at [davecummings.co](https://davecummings.co). The site itself is the portfolio, so the codebase is public.

## Stack

Static HTML and CSS with a small Node.js build script. No frameworks, no npm dependencies, no runtime dependencies. Deployed on Vercel.

The idea: the site is meant to demonstrate what Dave sells (fast, well-structured, AI-friendly websites), so it uses the same lightweight approach he recommends to clients rather than reaching for a framework it doesn't need.

## Build

```bash
node build.js
```

Reads `src/pages.json`, injects shared components (`head.html`, `header.html`, `footer.html`) into each page, and writes output to `dist/`. Also generates `dist/sitemap.xml` and `dist/robots.txt`, and copies static assets from `src/images/` to `dist/images/`.

## Local preview

Because production uses clean URLs and trailing-slash redirects (via `vercel.json`), local previews should use a server that mirrors that routing:

```bash
cd dist
npx serve -p 8000
```

Then open `http://localhost:8000`.

Python's `http.server` will work for the homepage but 404s on most inner pages, because it doesn't understand clean URLs.

## Project layout

```
src/
  components/   Shared head, header, footer, and styles.css
  pages/        Source HTML for every route
  images/       Site images (copied to dist/images/ on build)
  pages.json    Per-page manifest (title, description, canonical, schema type, indexed flag)
build.js        Build script
vercel.json     Vercel deployment config
CLAUDE.md       Design system, content decisions, and architectural notes
```

## Deployment

Every push to `main` triggers a production deploy on Vercel. Every push to any other branch produces a preview deployment at a unique URL.

## Source of truth

`CLAUDE.md` documents design tokens, content decisions, the service hierarchy, and the "AI tells" policy that guides all copy and design choices. Read it before making changes.
