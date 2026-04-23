# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Overview

Static portfolio/consulting website for Dave Cummings (davecummings.co). No build tools, 
frameworks, or dependencies — pure HTML, CSS, and JavaScript. Deployed automatically to 
Vercel on push to `main`.

## Business Context

This site IS the product. Dave sells website performance, SEO, and optimization services 
to small/local businesses in South Texas. The site must exemplify everything he markets:

- Perfect or near-perfect Lighthouse scores (95-100 all categories)
- Impeccable SEO: Schema.org, Open Graph, canonical URLs, sitemap
- Fast load times, accessibility, mobile-first
- The site itself is proof of his expertise — it must practice what it preaches

**Positioning:** Web Consultant | Performance, SEO & Visibility  
**Tagline:** "I build fully optimized websites that work — and fix the ones that don't."  
**Target clients:** Local South Texas small businesses with underperforming websites

## Services Offered

- **Quick Wins Package** — $950, 1 week, top 5 issues fixed
- **Full Website Audit & Optimization** — $2,500, 2-3 weeks
- **Custom Website Development** — Starting at $3,000, 3-6 weeks
- **Monthly SEO & Performance Retainer** — $600/mo

## Goals

**Immediate**
- Get live at davecummings.co
- Perfect Lighthouse scores on all pages
- Add first case study (TruIdentity audit)

**Short-Term (1-3 months)**
- Generate 2-3 audit leads/month
- Add 3-5 case studies for social proof
- Refine messaging based on what resonates

**Long-Term**
- Scale to $5k/mo
- Add blog, free tools, lead magnets
- Transition to productized/repeatable services

## Development

No build step. To preview locally:

```bash
python3 -m http.server 8000
# or
npx http-server .
```

## Architecture

Each page is a self-contained `.html` file with inline `<style>` blocks — there is no 
shared external CSS file. When updating styles (colors, typography, spacing), the change 
must be replicated across all pages. This is intentional for Lighthouse performance.

**Pages:** `index.html`, `about.html`, `contact.html`, `404.html`

**`product-images/`** — Standalone HTML files (1200×1200px) for Stripe service icons. 
Not part of site navigation.

## Design System

CSS custom properties defined per-page:

```css
--midnight: #0F172A;    /* Dark navy — backgrounds, headings */
--slate: #475569;       /* Body text */
--pearl: #F8FAFC;       /* Page background */
--red-orange: #e20f2e;  /* Brand accent, CTAs */
```

**Fonts:** Space Grotesk (headings, 600–800) + Inter (body, 400–600) via Google Fonts.

## SEO Structure

Every page includes:
- Schema.org JSON-LD structured data (LocalBusiness / Service schemas)
- Open Graph and Twitter Card meta tags
- Canonical URL
- Sitemap entry in `sitemap.xml`

When adding or renaming pages, update `sitemap.xml` accordingly.

## Code Principles

- Never introduce frameworks, build tools, or external dependencies
- Never sacrifice Lighthouse scores for convenience
- When editing headers, footers, or shared CSS — update ALL pages
- Mobile-first, accessible, fast — always
- Every change should maintain or improve SEO

## Deploy Workflow
This site auto-deploys to Vercel on push to `main` on GitHub.
After making and verifying changes locally:
1. Stage all changed files
2. Write a clear, descriptive commit message
3. Push to main branch
4. Confirm push succeeded

Always ask before committing and pushing — never auto-deploy without confirmation.