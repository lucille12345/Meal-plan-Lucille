# DESIGN BRIEF — Meal Planner v2 "Table"
### For the Claude *design* session. Read this file only; do not write app logic.

_Written 2026-07-18 by Claude (Fable 5), acting as design director for Lucille._
_Companion file: `OPUS-BUILD-BRIEF.md` (engineering). You design; Opus builds. Your output
must be pixel-liftable by Opus with zero guesswork._

---

## 0. Your mission & deliverables

Design the complete visual system and every screen of a meal-planning **app** (installable
PWA, mobile-first, but gorgeous on desktop). Deliver into a new folder **`design/`** in this
project:

1. `design/tokens.css` — every color, font, radius, shadow, spacing step as CSS variables.
2. `design/components.html` — one page showing every component in every state (buttons,
   cards, chips, inputs, badges, drawer, toasts, empty states, skeletons).
3. One static high-fidelity HTML mockup per screen (no JS logic; fake data is fine):
   `design/01-landing.html`, `02-signup.html`, `03-onboarding.html`, `04-planner.html`,
   `05-recipe.html`, `06-cook-mode.html`, `07-shopping.html`, `08-features-drawer.html`,
   `09-profile.html`.
4. `design/README.md` — rationale in 20 lines max + how Opus should lift styles.

Rules: self-contained files (system/Google fonts + Unsplash CDN images only), no frameworks,
no build step, responsive (375px → 1440px), light theme only for now. Check every screen at
375px and 1280px before calling it done.

---

## 1. Design direction (decided — do not re-litigate)

**Concept: "Apple's restraint, Mob's appetite."** Crisp, calm, expensive-feeling structure
with photography and color doing the appetite work.

Lucille's references, and what to take from each:
- **apple.com** → generous white space, huge confident type, few colors, one idea per
  section, buttery hierarchy. Take the *restraint and polish*.
- **mob.co.uk** → photography-led recipe cards (image on top, badges + time below),
  editorial warmth, "Dinner, sorted" tone. Take the *appetite and card language*.
- **Woolworths meal planner screenshot (her #1 structural want)** → the planner screen IS
  this structure: **left sidebar with the week (Mon–Sun slots) + main area of horizontally
  scrolling, categorized recipe-card carousels** ("Budget-friendly dinners", "Quick & easy",
  each card with a photo and a round ⊕ add button). Reproduce this structure, but make it
  beautiful.
- **plantoeat.com quote section (her screenshot 2)** → a soft-gradient testimonial band:
  circular portrait left, large serif quote right, giant ghosted quotation mark. She wants
  exactly this *type of moment* on the landing page.
- **plantoeat.com stats (screenshot 4)** → she likes the *idea* (big numbers: "47.5% less
  planning time"), hates the execution. Redesign as an elegant editorial stat band.
- **Tata Nutrikorner (screenshot 5)** → she likes the **decorative food imagery along the
  page edges**. Do a tasteful version: small photographic/illustrated ingredients (basil
  leaf, cherry tomato, lemon slice, olive-oil bottle) floating in the margins of the
  *landing page only*, subtle parallax on scroll, never overlapping content, never in the
  app screens (app stays clean).

## 2. Design tokens (starting values — refine, then freeze in tokens.css)

- **Base**: warm paper `#FDFBF7`; surfaces `#FFFFFF`; ink `#1D1D1F` (Apple near-black);
  muted `#6E6A63`; hairlines `#ECE7DD`.
- **Appetite accents**: tomato `#E0532F` (primary actions), basil `#2F7D5B` (health/success),
  honey `#F5B841` (highlights, sparingly), blush `#F8E8E0` / cream-green `#EAF3EC` as soft
  fills. Never blue near food (appetite research).
- **Contrast rule**: all text ≥ 4.5:1 (WCAG AA). Darken accents for small text
  (tomato-deep `#B8401F`, basil-deep `#246147`).
- **Type**: Fraunces (600/700) for display & numbers-as-heroes; Inter (400–700) for
  UI/body. Display sizes are BIG: landing H1 ≈ clamp(40px, 7vw, 72px).
- **Shape**: radius 16 (cards) / 12 (inputs) / 999 (chips, pills); shadows soft & warm
  (`0 6px 24px rgba(60,45,30,.07)`), never harsh.
- **Motion**: 150–250ms ease-out; hover lift −2px; page fade-slide 8px; skeleton shimmer
  for loading; respect `prefers-reduced-motion`.

## 3. Photography rules (critical — this carries the whole appetite)

- Source: **Unsplash CDN only** (`images.unsplash.com/...` URLs — free license, hotlinkable).
  Pick each image deliberately: natural light, real plates, 45° or top-down, visible texture,
  warm tones. NO clip-art, no sterile white-box packshots, no obviously-stock smiling people.
- Every recipe card gets a photo (Opus will map dish→image; you define the *style* and the
  card treatment: image top, 4:3, subtle inner shadow at bottom for text legibility if
  overlaid).
- Landing hero: one stunning table-scene image OR a composed grid of 3 dishes — your call,
  show both options in the mockup as A/B if useful.

## 4. Screen-by-screen requirements

### 01 — Landing (pre-auth; marketing only — the app is gated behind sign-up)
Sections in order: (1) sticky glassy nav (logo, "How it works", "Recipes", `Log in`,
`Start free` tomato button); (2) hero: huge Fraunces headline (copy direction: "Your week,
deliciously planned." — you may refine), subline, one CTA, hero imagery; (3) "How it works"
in 3 airy steps with small photos; (4) **planner preview** — a beautified screenshot-style
mock of the Woolworths-layout planner so visitors see the product; (5) **quote band**
(plantoeat style, see §1); (6) **stat band** — 3–4 editorial numbers ("~2 h saved a week",
"−23% grocery spend", "0 € forever"), big Fraunces numerals, one accent-colored tile max;
(7) short FAQ accordion; (8) fat footer. Margin food doodads live here (see §1, Tata note).

### 02 — Sign-up / Log in
One centered card, Apple-clean: email magic-link primary, "Continue with Google" secondary,
microcopy promising: free forever, no card, your data stays yours. Design both states +
"check your email" confirmation state.

### 03 — Onboarding questionnaire (post-signup; multi-step, warm)
A stepped flow (progress dots, one theme per step, big touch targets). Steps & tone are
specced in OPUS-BUILD-BRIEF §6 — design the *pattern*: step header, "why we ask" whisper
line, chip grids, sliders, number steppers, and the **connect step** (Google Calendar +
reminders) presented as two benefit cards with illustration, "Connect" / "Maybe later"
— never guilt-trippy. Design one step of each input type; Opus repeats the pattern.

### 04 — Planner (the heart; her #1 want)
Desktop: left rail = week Mon–Sun, each day showing its 3 chosen meal thumbnails (or empty
slots with dashed ⊕); main area = generated-for-you week summary card on top ("Your week,
ready — 🎯 2,430 kcal/day") + horizontally scrolling carousels by category with photo cards
(⊕ to add to a day, ♥, ✕ swap). Mobile: week collapses to a horizontal day-scroller pinned
under the header. Show drag-onto-day affordance visually (Opus implements).

### 05 — Recipe detail
Photo hero, title, badges (time, difficulty, kcal, protein, course), ingredients with
serving count, method steps, "▶ Cook" and "♥", "See full recipe ↗" external link, photo-add
slot ("Add your photo of this dish" — user photos feature).

### 06 — Cook mode
Keep the existing pattern (full-screen, progress bar, one step huge, 🔊 read-aloud,
ingredients drawer) — restyle to the new tokens. Dark-ish warm option allowed here only.

### 07 — Shopping list
Two-tab or two-section: "Buy at the start" / "Fresh by day"; per-day price chips (**prices
are per day now**), day total + week total, tick states with strikethrough, "Hiding N pantry
items" whisper, Copy/Print/Remind-me buttons.

### 08 — Features drawer (her "rolling down thing")
A right slide-over (desktop) / bottom sheet (mobile) listing connectable features as cards
with status: Google Calendar (Connected ✓ / Connect), Reminders (push), Email digest,
Feedback ("Write to Lucille" — sends to her inbox), Language (FR/EN, future), each with a
one-line benefit. This is also where settings live.

### 09 — Profile
Account, saved favorites grid (photo cards), my photos gallery, targets summary (editable),
sign out, delete account (danger zone, quiet styling).

## 5. Voice & microcopy (design the words too)

Warm, appetized, zero clinical jargon. Never "maintain / lose / gain" — use **"Feel light /
Stay balanced / Get stronger"**. Buttons are verbs ("Plan my week", "Add to Tuesday").
Empty states are charming ("Nothing planned for Thursday yet — lucky Thursday."). French
touches welcome ("Bon appétit") since Lucille is French, but UI language stays English v1.

## 6. Definition of done (self-check before finishing)

☐ Every deliverable file from §0 exists and opens standalone.
☐ 375px and 1280px both flawless; no horizontal scroll except intentional carousels.
☐ All text AA contrast; focus-visible styles designed; reduced-motion respected.
☐ No blue near food; max 2 accents per screen; whitespace generous everywhere.
☐ The planner screen visibly matches the Woolworths structure (sidebar week + carousels).
☐ Quote band + stat band present on landing and beautiful.
☐ It makes you hungry.
