# CLAUDE.md

This file provides guidance to Claude Code when working in this repository.

## Overview

Static portfolio/consulting website for Dave Cummings (davecummings.co).
Built with a Node.js build system (no npm packages) that injects shared
components and outputs to /dist/ for Vercel deployment.

## Business Context

This site IS the product. Dave builds custom websites for small businesses
using modern tooling and AI to ship fast, SEO-strong, accessible sites that
outperform legacy theme-shop builds. The site must exemplify everything
he sells:

- 90+ Lighthouse scores across all pages (target 95–100)
- Impeccable SEO: Schema.org, Open Graph, canonical URLs, sitemap
- Fast load times, accessibility, mobile-first
- The site itself must be AI-visible — practicing what it preaches

**Positioning:** Custom website builds, performance & SEO optimization,
AI visibility — by someone who's been building ecommerce sites for 15+ years.

**Tagline:** "Fast, modern websites built to be found — by Google and by AI."

**Supporting line:** "15 years building ecommerce sites. Now using AI to
build them faster, leaner, and more discoverable than legacy theme shops can."

**Target clients:** Small businesses in Central Texas / Austin metro area
**Based:** Round Rock, TX

## Service Hierarchy

Order of emphasis on the site (highest to lowest):

1. **Custom Website Build** (flagship) — From 2 × $1,500 · 3–6 weeks
2. **Full Website Audit & Optimization** — 2 × $1,250 · 2–3 weeks
3. **AI Visibility Audit** ($350 lead magnet) — flat · 3 business days
4. **Monthly SEO & Performance Retainer** — $600/mo
5. **Quick Wins Package** — 2 × $475 · 1 week
6. **AI Visibility Audit + Fix** — 2 × $350 · 1 week
7. **Automation & AI Consulting** — custom · positioned as "available
   for existing clients" — soft positioning, not a headline product

**Payment model:** 50% upfront via Stripe, 50% on delivery.
Each service has a dedicated /pay/[slug]/ page with Stripe link.

## Two Real Service Pages at Launch

Only two services get their own dedicated `/services/[slug]/` page:
- `services/custom-website-build.html` (the flagship)
- `services/ai-visibility-audit.html` (the lead magnet)

All other services appear on `/services/` index with brief blurbs and
link straight to their `/pay/[slug]/` page or `/contact/`.

## AI Visibility Audit — flagship lead magnet

Most businesses are invisible to ChatGPT, Perplexity, and other AI systems.
The audit covers 6 components:

1. Search test (Perplexity, ChatGPT, Claude screenshots)
2. Citation map (which directories AI crawlers actually index)
3. Schema markup (LocalBusiness, Service structured data)
4. NAP consistency (name/address/phone across all directories)
5. Review quality (content signals, not just count)
6. Competitor gap map (who shows up and why)

Deliverable: Single PDF report with screenshots, gap analysis, fix list.

## Deferred Until Content Ready

These exist as scaffolding pages but have no real content yet, are not
linked from header/footer, and are excluded from the sitemap:

- `/portfolio/` — case studies will live here (TruIdentity, Austin Home
  Services, others)
- `/blog/` — AI visibility and performance topics

They have `<meta name="robots" content="noindex, nofollow">` at launch.
Control whether they appear in nav and sitemap via `indexed: true/false`
in pages.json. Flip to `true` when content is ready.

## Deferred: Spanish

Spanish version is deferred. Build EN-only for now. `pages.json` retains
a `hreflang_es` field set to `null` for all entries. build.js skips
emitting hreflang alternate tags when null. When ready, add Spanish
entries to pages.json and create `src/pages/es/` mirror.

## Goals

**Immediate**
- Full site rebuild with clean architecture (build system)
- 90+ Lighthouse scores on all pages
- Custom Website Build and AI Visibility Audit service pages live
- Site linked from LinkedIn, optimized for organic traffic

**Short-Term (1–3 months)**
- 1–2 custom build leads/month via LinkedIn + organic search
- 2–3 AI Visibility Audit leads/month
- TruIdentity and Austin Home Services as portfolio case studies
- Stripe payment flow live for all services

**Long-Term**
- $10k+/mo across custom builds, audits, and retainers
- Automation/AI consulting earned organically from existing client trust
- Site ranking for "web developer Round Rock TX", "custom website builder
  Austin", and AI-visibility topics

## Site Structure

```
src/
  components/
    head.html                   ← shared <head> (fonts, meta, anti-FOUC)
    header.html                 ← nav
    footer.html                 ← footer — V2 three-column layout
    styles.css                  ← single shared stylesheet, all tokens here
  pages/
    index.html                  ← homepage
    about.html
    contact.html
    portfolio.html              ← coming-soon scaffolding, noindex
    blog/
      index.html                ← coming-soon scaffolding, noindex
    services/
      index.html                ← all services overview
      custom-website-build.html ← flagship service page
      ai-visibility-audit.html  ← lead magnet service page
    pay/
      ai-visibility-audit.html
      ai-audit-fix.html
      quick-wins.html
      full-audit.html
      custom-build.html
      retainer.html
  pages.json                    ← manifest: per-page meta, indexed flag, lang
dist/                           ← built output — what Vercel serves (do not edit)
build.js                        ← build script, run before deploying
```

## Build System

```bash
node build.js    # builds all pages from src/ into dist/
```

build.js reads pages.json, injects head/header/footer into each source
page via {{HEAD}}, {{HEADER}}, {{FOOTER}} placeholders, substitutes
per-page meta into the head partial, writes output to dist/ mirroring
the source path. Also generates dist/sitemap.xml (only entries with
indexed: true) and dist/robots.txt.

**Vercel build command:** `node build.js`
**Vercel output directory:** `dist`

To preview locally after building:
```bash
cd dist && python3 -m http.server 8000
```

No npm packages. Native Node.js only (fs, path).

## Architectural Decision: Shared CSS

We are reversing the previous site's "inline CSS per page" decision.
Reason: the build system gives us the benefits of both — single source
of truth in `src/components/styles.css`, served once and cached by the
browser. A single CSS file under ~25KB gzipped does not hurt Lighthouse
and is dramatically more maintainable.

## Design System

**Fonts:**
- Display/headings: Instrument Sans (400, 500, 600, 700)
- Body: Inter (400, 450, 500, 600, 700)
- Mono: JetBrains Mono (400, 500)
- All via Google Fonts

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Inter:wght@400;450;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

**Color tokens (defined in src/components/styles.css :root):**
```css
/* Surfaces */
--bg-dark:           #0F172A;
--surface-dark:      #1E293B;
--surface-dark-2:    #273449;
--bg-light:          #F8FAFC;
--surface-light:     #FFFFFF;
--surface-light-2:   #F1F5F9;

/* Accent */
--accent:            #3B82F6;
--accent-hover:      #2563EB;
--accent-dark:       #1D4ED8;   /* Use for buttons — passes WCAG AA */
--accent-pale:       #EFF6FF;
--accent-faint:      #F5F9FF;

/* Text */
--ink:               #0F172A;
--ink-soft:          #334155;
--ink-muted:         #64748B;
--ink-on-dark:       #F8FAFC;
--ink-on-dark-muted: #94A3B8;
--ink-on-dark-faint: #475569;

/* Lines */
--border:            #E2E8F0;
--border-strong:     #CBD5E1;
--border-dark:       #334155;
--border-dark-2:     #334155;

/* Status */
--success:           #10B981;
--danger:            #DC2626;
--danger-pale:       #FEF2F2;

/* Structure */
--radius:            8px;
--radius-sm:         6px;
--radius-lg:         16px;
--radius-pill:       999px;

/* Typography */
--mono: "JetBrains Mono", ui-monospace, monospace;
--sans: "Inter", system-ui, sans-serif;
--display: "Instrument Sans", "Inter", system-ui, sans-serif;
```

**Dark mode:** `html[data-theme="dark"]` overrides light surface tokens.
Defaults to light mode. Persists in localStorage under key `"dc-theme"`.
Anti-FOUC script runs synchronously in `<head>` on every page.

**Contrast requirements (WCAG AA):**
- Normal text: 4.5:1 minimum
- Large text / UI components: 3:1 minimum
- Buttons: always use `--accent-dark` (#1D4ED8), not `--accent` (#3B82F6)
  — white on #1D4ED8 = 5.9:1 ✓
- Footer bottom text: use `--ink-on-dark-muted` (#94A3B8)
  — #94A3B8 on #0F172A = 5.9:1 ✓
- Document contrast ratios inline as CSS comments

## Footer — V2 Three Balanced Columns

The footer uses the V2 design from Footer Explorations.html:
- Column 1: Brand (name, tagline, email card with "Direct line" label)
- Column 2: Navigate (Home, Services, About, Contact)
- Column 3: Connect (LinkedIn, Email, "Let's chat →" accent link)
- Bottom bar: copyright left, coordinates right (30.508° N, 97.679° W)
- Dark background (--bg-dark), all text left-aligned
- No availability badge
- Portfolio, Blog, and Resources links omitted from nav and footer until content is ready

## Header

- Left: wordmark "Dave." (final logo design decided in Part 2)
- Right: nav links (Home, Services, About, Contact),
  theme toggle (sun/moon icon), primary CTA "Let's chat →"
- Mobile: hamburger menu
- Portfolio and Blog links omitted from nav until content is ready

## SEO Requirements

Every page must include:
- Unique `<title>` and `<meta name="description">`
- `<link rel="canonical">`
- Schema.org JSON-LD appropriate to page type:
  - Homepage: LocalBusiness + Person
  - Service pages: Service
  - About: Person (with sameAs linking to LinkedIn)
  - Portfolio: CreativeWork per project (when content ready)
  - Blog index: Blog (when content ready)
- Open Graph and Twitter Card meta tags
- Breadcrumb nav on all inner pages
- hreflang tags emitted only when pages.json hreflang_es is non-null

## Payment Flow

Each service has a `/pay/[slug]/` page showing:
- Service name and two-payment breakdown (50% now, 50% on delivery)
- Stripe payment button (placeholder: `YOUR_STRIPE_LINK_[SERVICE]`)
- What happens next (3 steps)
- "Prefer to pay by invoice? Email dave@davecummings.co"

Pay pages: `<meta name="robots" content="noindex">` — not in sitemap.

**Stripe placeholder keys to replace with real links:**
- `YOUR_STRIPE_LINK_AI_VISIBILITY_AUDIT`
- `YOUR_STRIPE_LINK_AI_AUDIT_FIX`
- `YOUR_STRIPE_LINK_QUICK_WINS`
- `YOUR_STRIPE_LINK_FULL_AUDIT`
- `YOUR_STRIPE_LINK_CUSTOM_BUILD`
- `YOUR_STRIPE_LINK_RETAINER`

## Contact Form

Email: `dave@davecummings.co` (plain in markup, no obfuscation — Gmail handles).
The contact form will POST to a Vercel serverless function at `/api/contact`
which calls Resend. To be built in a later part — Part 1 does not include
the contact form.

## CTA Copy

Primary CTA in header: "Let's chat" (informal, approachable).
Lower-page CTAs may vary contextually:
- "Book a 20-min call →"
- "Start with a free audit →"
- "Get a quote →"

## Code Principles

- No frameworks, no npm packages — native Node.js and vanilla JS only
- Single `styles.css` — no inline styles except truly page-specific
  (e.g. a one-off hero background image)
- Never sacrifice Lighthouse scores for convenience
- Mobile-first, accessible, semantic HTML throughout
- All contrast ratios documented inline as CSS comments
- No Co-Authored-By trailers in commit messages
- Always ask before committing or pushing — never auto-deploy

## Avoiding AI Tells

This site exists to demonstrate technical credibility. Visitors who can
spot AI-generated copy and design patterns will lose trust if they spot
them here. Both the copy and the visual design must avoid the following
patterns. This applies to all deliverables — site copy, blog posts,
commit messages, and CLAUDE.md itself.

### Copy tells to avoid

- Em dashes. Use commas, colons, parentheses, or two sentences instead.
- "It's not just X, it's Y" constructions.
- The rule-of-three sentence cadence used repeatedly (three-item lists
  back to back to back).
- Words and phrases: "delve," "navigate the complexities of," "in
  today's fast-paced world," "leverage" as a verb, "robust," "seamless,"
  "unlock," "elevate," "harness the power of," "game-changer,"
  "revolutionize," "cutting-edge."
- Superlatives without backup ("the best," "incredible," "amazing").
  If you can't put a number or concrete example next to a claim, cut it.
- Used-car-salesman energy. Calm confidence beats enthusiasm.

### Design tells to avoid

- Eyebrow labels (e.g. "// OUR PROCESS") above every section. Use
  sparingly, twice on the whole site at most.
- Numbered process step cards (01 Discovery → 02 Design → 03 Build).
- Stat strips ("500+ projects · 15+ years · 100% satisfaction").
- "Trusted by" or "As seen in" logo walls without real client logos.
- Gradient mesh backgrounds.
- Gradient-fill text (background-clip on headlines).
- Glassmorphism / frosted-glass / backdrop-blur effects.
- Section-section-section grids of identical feature cards with icon
  + heading + two-sentence body.
- Wordmark "punctuation as personality" (e.g. "Brand.") used as the
  primary mark. Some uses are fine, but recognize the pattern.
- Horizontal-scroll mobile nav. Either fit inline or use a hamburger.

### Positive principles

- Asymmetric layouts over symmetric grids when content allows.
- Mixed section widths (some full-bleed, some narrow).
- Prose paragraphs sometimes, where most sites would default to bullets.
- Concrete numbers and named examples over abstract claims.
- One strong example beats three weak ones.
- Empty space reads as confidence.

## Design Moments by Page

Each page gets one distinctive moment so the site doesn't read as
section-section-section template work. Status as of Part 2:

| Page | Moment | Status |
|------|--------|--------|
| Home | Asymmetric hero, left-aligned, empty right column for future visual | Part 2 |
| Services index | Speed receipt in footer of page (live Lighthouse score) | Part 3+ |
| Custom Website Build | Speed receipt + before/after teaser → portfolio | Part 3+ |
| AI Visibility Audit | Sample audit excerpt screenshot | Part 3+ |
| About | Headshot + actual story prose (no process steps) | Part 3+ |
| Portfolio | Before/after slider with real client screenshots | Deferred |
| Pay pages | Speed receipt + minimal "what happens after you pay" | Part 4 |

### Future / Resources page

A dedicated /resources/ page is planned (not Part 2). It will host
interactive tools that pre-qualify leads — likely starting with a
"check if AI knows about your business" widget that calls Perplexity's
API and shows the response with citations highlighted. Build the site
so this is additive later, not a refactor.

## Deploy Workflow

Site auto-deploys to Vercel on push to `main`.
**GitHub repo:** davecummings-zz/davecummings-site
**Working branch during rebuild:** `rebuild`
Production cuts over when `rebuild` is merged to `main`.

1. Edit source files in `src/`
2. Run `node build.js` — confirm all pages built to `dist/`
3. Preview: `cd dist && python3 -m http.server 8000`
4. Check pages visually before pushing
5. Stage changes
6. Write a clear commit message (no Co-Authored-By trailers)
7. Ask Dave before committing or pushing
8. Confirm push succeeded and Vercel preview/production build passes
