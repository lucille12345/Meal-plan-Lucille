# Table — Design System &amp; Screens

**Concept: "Apple's restraint, Mob's appetite."** Warm paper, huge Fraunces display type,
photography carrying the appetite. Tomato = action, basil = health, honey = highlight. Never
blue near food; max two accents per screen; whitespace everywhere.

## Files
- `tokens.css` — **the source of truth.** All colors, type, radii, shadows, spacing, motion as
  CSS variables, plus base resets and every reusable component class (`.btn`, `.chip`, `.card`,
  `.recipe-card`, `.badge`, `.input`, `.stepper`, `.slider`, `.toggle`, `.toast`, `.skeleton`,
  `.carousel`, `.dots`). Cook-mode's warm-dark palette is the `.cook-dark` scope at the bottom.
- `components.html` — every component in every state (the gallery to eyeball).
- `01`–`09` — one static, self-contained mockup per screen. Fake data; light JS only for demo
  interactions (onboarding stepper, tick toggles, cook drawer, magic-link state).

## How Opus should lift this
1. Copy `tokens.css` into `/public/styles.css` **verbatim** — do not re-derive values.
2. Build real screens by lifting markup structure + class names 1:1 from `01`–`09`; swap fake
   data for live data. The app-bar, week rail, carousels, recipe card, drawer and cook-mode
   patterns are ready to reuse.
3. Images are Unsplash CDN placeholders defining the *treatment* (photo top, 4:3, cover). Map
   real dishes → images per OPUS-BUILD-BRIEF §3; keep the card treatment identical.
4. Emoji are used deliberately as the product's playful vocabulary (goals 🍃⚖️💪, 🎯 targets,
   landing margin doodads). They are decorative — keep `aria-hidden`/labels as written.

## Checked
375px + 1280px on every screen · AA contrast (deep accent variants for small text) ·
`:focus-visible` + `prefers-reduced-motion` honored · no blue near food · Woolworths planner
structure (rail week + categorized carousels) · quote band + editorial stat band on landing.
