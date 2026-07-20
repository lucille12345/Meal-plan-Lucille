# V3 REDESIGN BRIEF — #Foodie
### For the next Opus session. This is the decided spec. Execute it in order.

**Read first:** `CLAUDE.md` (state, constraints), then this file. Reference screenshots the user
loves: **woolworths.com.au/shop/meal-plan** — copy its *structure*, not its branding.

**Working rules:** verify every section in-browser with **AI OFF** before the next · 375px + 1280px ·
zero console errors · commit per section · never commit secrets · deploy only on Lucille's word.

**Do NOT break (regression-check each section):** auth gate + Supabase sync · 8-step questionnaire
(asked once; "Save changes" edit mode) · targets engine · hard no-repeat rule + honest repeat notice ·
leftovers · pantry hiding · PWA (bump `CACHE` in `sw.js`) · `.ics` export · cook mode + read-aloud.

**Files:** `public/styles.css` (tokens) · `public/app-screens.css` (layout) · `public/app.js` (all
screens) · `public/index.html` · `server.js` (AI prompt only).

---

## 1. Palette — replace tomato/honey ENTIRELY

**Direction: rich dark wood + deep luscious greens + sparks of gold, on white.** Think fine
restaurant, not kitchen supply shop. Wood must read as *quality walnut* — deep and warm, never
pale pine or beige. Greens run dark → emerald. Gold appears only in small glinting details.

Overwrite the token block in `public/styles.css`; every screen inherits (no hardcoded hex elsewhere).

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FAF7F2` | page background (warm ivory) |
| `--surface` | `#FFFFFF` | cards |
| `--surface-2` | `#F3EEE6` | insets (soft linen) |
| `--ink` | `#16241C` | primary text (deep green-black) |
| `--muted` | `#55645A` | secondary text |
| `--faint` | `#93A099` | tertiary/placeholder |
| `--hairline` | `#E5DED2` | borders |
| **Wood — deep & luscious** |
| `--wood-deep` | `#2E1C11` | espresso; dark bands, footer, nav |
| `--wood` | `#5C3823` | rich walnut; primary wood surfaces |
| `--wood-mid` | `#8A5A38` | warm oak; dividers/detail on wood |
| `--wood-wash` | `#EDE0D1` | pale wood tint; light section bands |
| **Green — dark → emerald** |
| `--green-deep` | `#12352A` | darkest forest; dark sections, headings |
| `--green` | `#1F6B4D` | **primary actions** (deep emerald) |
| `--emerald` | `#0E8055` | vivid emerald; highlights, success, active |
| `--basil` | `#47764F` | softer herb green; secondary fills |
| `--green-wash` | `#E3EFE8` | green tint; **photo backdrops** |
| **Gold — sparks only** |
| `--gold` | `#C9A227` | antique gold; thin rules, price pills, ♥ active |
| `--gold-bright` | `#E3C463` | shimmer on hover/selected |
| `--gold-deep` | `#8A6B12` | gold text on light (AA) |
| `--gold-wash` | `#F7EFD8` | rare gold tint fill |

**Rules**
- Primary button = `--green`, white text. Secondary = white + `--hairline`. Never a red/tomato button.
- **Gold is a spark, not a surface.** Hairline rules, a thin underline beneath section titles, the
  ⊕/♥ active state, price pills, a 1px card edge on hover. Never a gold-filled button, banner or
  large block — it turns cheap instantly.
- **Photo backdrops must be tinted, never bare white** — this is the Woolworths look she pointed at.
  Every recipe image sits on `background: var(--green-wash)`.
- Alternate section bands: `--paper` → `--green-wash` → `--wood-wash` down the page so it never
  reads flat. Use `--wood-deep` for the footer and any full-bleed dark band, with white text and
  `--gold` hairlines.
- Wood is flat colour (no fake wood-grain images/textures).
- Keep Fraunces (display) + Inter (UI). Keep radii, shadows, `:focus-visible`, reduced-motion.
- Re-check AA contrast; use `--green-deep` / `--gold-deep` for small text on light.

---

## 2. ONE page after the questionnaire ← biggest change

Today `review`, `recipes`, `shopping` are three separate screens. Merge into a **single planner
page**. Nothing navigates away; detail opens in an overlay.

```
┌───────────────────────────────────────────────────────────┐
│  #Foodie logo            [My Meal Plan] [Shop Ingredients] │ ← tabs
├───────────┬───────────────────────────────────────────────┤
│ SIDEBAR   │  [All filters][My saved][Dietary▾][Ingredient▾]│ ← filter row
│ ‹ 13–19 Jul ›                                             │
│ Monday    │  Weeknight winners            ‹ ›             │
│  · meals  │  [card][card][card][card][card]               │
│ Tuesday   │                                               │
│  · meals  │  Sweet endings                ‹ ›             │
│ …Sunday   │  [card][card][card][card][card]               │
└───────────┴───────────────────────────────────────────────┘
```

- **Tabs** (top, pill style): `My Meal Plan` · `Shop Ingredients`. Tab state in `state.plannerTab`.
  The shopping list becomes the second tab — **not** a separate screen. Delete the old `shopping`
  screen route and the 1·2·3 step bar.
- **Sidebar (left, sticky):** week label with ‹ › arrows, then Mon–Sun. Each day lists its dishes as
  small rows (thumbnail + name + course label). Empty slot = dashed `＋`. Day total kcal + €/day.
  Keep drag-and-drop onto a day. Collapses above the main column under 900px.
- **Main:** filter row, then category carousels.
- **Recipe detail = overlay** (modal over the page), never a page change. Contains photo,
  ingredients, method, ▶ Cook, ♥, "See full recipe ↗".
- Keep the landing page and questionnaire as they are (separate, pre-login).

---

## 3. Recipe card anatomy — image ON TOP, text under it

Her exact complaint: *"images of each dish should be next to their designated meal explanation and
not on the side"*. The current left-thumbnail row layout is wrong. Replace **everywhere** (sidebar
rows excepted — those stay small square thumbs).

```
┌──────────────────┐
│                  │ ← photo, 4:3, fills width, background var(--basil-wash)
│      PHOTO    ⊕  │   ⊕ add (bottom-right, basil circle) · ♥ (top-right, white pill)
├──────────────────┤
│ Dish name        │ ← Fraunces 600, 2 lines max
│ 4–6 word desc    │
│ Prep · Cook · ⚡ │ ← three labelled stats in a row (copy Woolworths)
└──────────────────┘
```

- Stats row = **Prep / Cook / Difficulty**, each a small caps label above its value. Difficulty as
  4 dots (filled = harder), not the word.
- Add `€x.xx / serving` in `--gold-deep` when a price exists.
- Photo failure → emoji tile on `--basil-wash` (keep existing `onerror` fallback).
- Same card component used in carousels, meal-plan lists and search results. One implementation.

---

## 4. Browse & add — categories + filters

**Categories (carousels, in this order).** Skip any that would be empty.

| Title | Contents |
|---|---|
| `Your favourites ♥` | `state.favorites` |
| `Weeknight winners` | mains, time ≤ 20 min |
| `Budget-friendly dinners` | dinners, cheapest by €/serving |
| `Fresh & light` | mains tagged vegetarian/vegan/fish |
| `Comfort classics` | remaining hearty mains |
| `Small plates to start` | **all starters** |
| `Sweet endings` | **all desserts** ← she explicitly asked for this |
| `Breakfasts` | breakfasts |

Titles must be **appetising, not literal** — she said the current ones ("Lunch mains") are dull.
Never label a section with a database word.

**Filter row** (above carousels, pill buttons, mirrors Woolworths):
- `All filters` (opens sheet) · `My saved` (toggle → favourites only)
- `Dietary ▾` — vegetarian, vegan, fish-free, dairy-free, gluten-free
- `Ingredient ▾` — chicken, beef, fish, pasta, rice, veg
- `Meal type ▾` — breakfast, lunch, dinner, starter, dessert

Filters narrow the carousels live, combine with AND, and show a `Clear all` chip when active.
They must respect the profile's allergies/dislikes at all times (those are never filterable away).

---

## 5. Shopping (the `Shop Ingredients` tab)

- Keep: category grouping, buy-at-start vs buy-fresh-by-day, per-day € chips, persistent ticks,
  pantry hiding, copy/print, 📅 Add to calendar.
- **Move the estimated total to the BOTTOM of the list** (currently at the top). Show as a summary
  card: `Estimated total €X.XX` + `≈ €Y.YY / day` + within/over the €/day budget pill.
- **Gemini must supply the estimate.** In `server.js` add to the AI response a top-level
  `"estimatedTotal": <number, EUR, whole week, for the household size>` alongside the existing
  per-ingredient prices. Display Gemini's figure as the headline total; keep the client-side sum as
  the fallback when AI is off. Label it "Estimated — varies by shop."

---

## 6. Copy pass

Rewrite headings to be warm and appetising (Woolworths tone), never clinical, never a data term.
Keep the friendly goal words (Feel light / Stay balanced / Get stronger) and the internal
`lose|maintain|gain` keys. Proofread every string; no "meals" where "dishes" is meant.

---

## 7. Build order — verify + commit after each

1. Palette swap (§1) — every screen re-tinted, nothing tomato-coloured remains.
2. Card component (§3) — image-on-top, used everywhere.
3. One-page planner + tabs + sidebar (§2); delete the old shopping screen + step bar.
4. Categories + dessert/starter sections (§4).
5. Filter row (§4).
6. Shopping tab + total at bottom + Gemini `estimatedTotal` (§5).
7. Copy pass (§6).
8. Full QA (§8) → show Lucille → deploy only on her word.

---

## 8. Acceptance checklist

☐ No tomato/honey anywhere. Deep walnut wood + dark/emerald greens + gold sparks + white only.
☐ Gold appears only as thin details — no gold-filled buttons, banners or blocks. AA contrast passes.
☐ The 1·2·3 step bar is gone (removed from `index.html` and `updateSteps()` in `app.js`).
☐ Every recipe photo sits **above** its own text, on a tinted (never white) backdrop.
☐ Meal plan, browse and shopping all live on **one page**; only detail/cook open as overlays.
☐ Sidebar shows all 7 days with thumbnails, kcal, €/day; drag-and-drop still works.
☐ `Sweet endings` (desserts) and `Small plates to start` (starters) both browsable and addable.
☐ Filters combine, clear, and never override allergies/dislikes.
☐ Shopping total is at the **bottom**, sourced from Gemini when AI is on.
☐ No dish twice in a week; honest notice when the pool genuinely can't fill it.
☐ Questionnaire still asked once; "Save changes" still edits without regenerating.
☐ Zero console errors · zero `/generate-*` calls with AI off · 375px + 1280px · PWA still installs.
