# Asset placeholders

Files needed before launch. Each entry: page, location, suggested spec, current state.

## Open Graph images

- `/og/home.png` — 1200x630, homepage social preview. Referenced in pages.json. **TBD.**

## Homepage

- Hero right column visual — intentionally empty space for now. Could host the
  AI demo widget (Part 5+) or an illustrative graphic. Suggested size: ~520x400.
  See comment in `src/pages/index.html` hero section.

## Service pages

- `/services/ai-visibility-audit/` — sample report screenshot. Currently a bordered
  empty placeholder (`div.sample-placeholder__visual`, 16:9, min-height 200px).
  Replace with a redacted excerpt from a real audit when one is delivered.
  See comment in `src/pages/services/ai-visibility-audit.html` above the placeholder.

## Future (deferred until later parts)

- **About page headshot** — previously at `images/dave-cummings.jpg` in git history.
  Recover with `git show ec9fef7:images/dave-cummings.jpg` when building About page.
- **Portfolio** — client before/after screenshots. TBD per client (TruIdentity,
  Austin Home Services, others).
- **Custom Website Build page** — any supporting illustration or visual. TBD.
