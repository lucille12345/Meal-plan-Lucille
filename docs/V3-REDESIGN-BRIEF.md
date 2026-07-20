# V3 REDESIGN BRIEF — #Foodie
### For the next Opus session. This is the decided spec. Execute it in order.

**Read first:** `CLAUDE.md` (state, constraints), then this file. Reference screenshots the user
loves: **woolworths.com.au/shop/meal-plan** — copy its *structure*, not its branding.

**Working rules:** verify every section in-browser with **AI OFF** before the next · 375px + 1280px ·
zero console errors · commit per section · never commit secrets · deploy only on Lucille's word.

**Do NOT break (regression-check each section):** auth gate + Supabase sync · 8-step questionnaire
(asked once; "Save changes" edit mode) · targets engine · hard no-repeat rule + honest repeat notice ·
leftovers · pantry hiding · PWA (bump `CACHE` in `sw.js`) · `.ics` export · cook mode + read-aloud ·
**the verified AI-ON path** (49 dishes, real prices) · **shopping prices + €/day budget pill**.
§0.2 holds the full table of how each of these could break and the guard for it.

**Files:** `public/styles.css` (tokens) · `public/app-screens.css` (layout) · `public/app.js` (all
screens) · `public/index.html` · `public/recipes-db.js` (**the dish database — §0**) ·
`public/sw.js` (bump `CACHE`) · `server.js` (AI prompt only).

**Order matters:** §0 (data) → §1 (palette) → §3 (card) → §2 (one page) → §4/§5 → §6. The numbering
is historical; **§7 is the order to actually build in.**

---

## 0. The dish database — build this before anything else

**Why first.** §3 (card anatomy) needs dishes that carry their own photo and a prep/cook split.
§4 (browse carousels, dessert + starter sections) needs enough dishes to fill eight carousels.
§5 (shopping total) needs prices. All three are built on the data layer, so the data layer goes in
first — otherwise §3 and §4 get built twice.

**The rule this section establishes:** *the curated database is the primary source of dishes.
Gemini is the top-up, not the author.*

### 0.1 What already exists (built 2026-07-20 — do not rebuild)

| File | What it is |
|---|---|
| `public/recipes-db.js` | **The database. Single source of truth.** `RECIPES_DB` — 28 real dishes: 5 breakfasts, 6 starters, 12 mains, 5 desserts. Browser global + Node export. |
| `docs/RECIPE-DATABASE.md` | Human-readable catalogue. **Generated — never hand-edit.** |
| `tools/build-recipe-md.js` | Rebuilds the `.md` from the `.js`. `node tools/build-recipe-md.js` |

Every link, photo, kcal and protein figure was read from the recipe sites' own schema.org data;
all 28 links and all 28 photos verified HTTP 200. Sources: Love & Lemons, Cookie and Kate,
Budget Bytes.

**The per-dish shape** (full field reference is in the header comment of `recipes-db.js`):

```js
{
  id:'db-m2', type:'dinner', types:['lunch','dinner'],   // types[] = every role it can fill
  name:'Sheet pan chicken fajitas', desc:'Chicken, peppers, lime, tortillas',
  sourceUrl:'https://www.budgetbytes.com/oven-fajitas/', sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/…/Sheet-Pan-Chicken-Fajitas-done.jpg',
  emoji:'🌮', img:'chicken',                              // fallbacks if the photo 404s
  prepTime:15, cookTime:40, time:55, passiveTime:0,       // time = prep+cook, ACTIVE only
  difficulty:1, servings:4, kcal:483, protein:31, nutrition:'source',
  tags:[], contains:['gluten','dairy'],                   // contains = EXPLICIT allergens
  ingredients:[ {name,qty,unit,category,buyDayBefore}, … ],  // PER SERVING, metric
  steps:[ … ]
}
```

Three properties of this shape drive the whole method below:

- **`types` is an array.** Most mains are lunch *and* dinner. `eligibleRecipes()` currently matches
  `r.type === role`, which would only ever see the primary role and halve the usable pool.
- **`ingredients` are per serving.** `scaleRecipe()` already multiplies by household size. Do not
  pre-scale. **`servings` is informational only** — it records what the source recipe yielded.
  Nothing may ever multiply by it.
- **`contains` is the authoritative allergen list**, and it must beat the existing name-matching.

### 0.2 What this must not break — check each one before committing

The app has a green verification pass behind it. These are the things §0 sits directly on top of,
the specific way each could break, and the guard. **This table is the regression checklist.**

| Already working | How §0 could break it | Guard |
|---|---|---|
| **Hard no-repeat rule** (0 duplicates, 288-profile test) | A favourited database dish appears in the pool **twice** — once from `RECIPES_DB`, once from `state.favorites` — with the same `id`. `usedIds` gets satisfied by one copy while the other still supplies the name. | Dedupe the pool by `id` in `eligibleRecipes()` (step 4). Re-run the duplicate check after. |
| **Allergy filtering** | The existing regex misses gluten in `Baguette`, `Spaghetti`, `Savoiardi ladyfingers`, and has no soy rule at all — 6 of the 28 dishes would reach someone who ticked that allergy. | `contains[]` early-return (step 3). Verified: Gluten drops bruschetta/tiramisu/bolognese; Soy drops teriyaki salmon/Thai curry/sriracha chicken. |
| **AI-ON path** (verified: 49 dishes, 0 dupes, real prices, €107.30 shopping list) | Database dishes carry **no per-ingredient prices**. Swap AI dishes for database dishes and the shopping total, the €/day budget pill, the per-day € chips and §4's "Budget-friendly dinners" all go blank. **This is the one genuine conflict in §0** — see §0.4. | The price table in §0.4. Do not skip it. |
| **`state.partialAI` top-up** | Nothing — it already fills short AI weeks from `generateWeek()`, which after §0 returns database dishes. It silently gets better. | Leave it alone. Keep the notice. |
| **Swap-a-dish with AI on** | — | **`requestSwapAI(profile, role, avoidNames)` already exists** and posts to `/generate-meal` with an avoid-list. This is the top-up primitive. **Do not build a new endpoint.** |
| **Leftovers** (`applyLeftovers` doubles a dinner main → next-day lunch) | Would break if mains were dinner-only. | Database mains carry `types:['lunch','dinner']`, so this works. Verify one leftovers week. |
| **Pantry hiding** | `pantryHas()` substring-matches both directions, so pantry `Pepper` hides **`Red bell pepper`**, `Rice` hides **`Rice wine`**, `Onion` hides **`Spring onions`**, `Flour` hides **`Large flour tortilla`**. 28 ingredients you must actually buy would vanish. Pre-existing, but the database makes it constant. | Fix `pantryHas()` to match whole words, not substrings (step 8). |
| **Cook mode + read-aloud** | Reads `steps[]`. Database dishes have them. | Smoke-test one database dish end to end. |
| **`.ics` export** | Builds its description from `recipeSearchUrl()`. | Point it at `recipeUrl()` (step 6). |
| **PWA** | New file isn't cached; installed users get `RECIPES_DB is not defined`. | Add to `SHELL` **and** bump `CACHE` (step 1). |
| **Supabase sync** | `profiles.state` stores the whole week inline. Database recipes are much fatter (photo URL, sourceUrl, full steps) — a 49-slot week could bloat the row badly. | Store `{id}` references for `db-` dishes and rehydrate on load; keep inlining AI dishes, which have no other home. |

### 0.3 The method — ordered, each step verifiable on its own

Work with **AI OFF** and verify after every step. Commit after step 5, step 8 and step 11.

**Step 1 — load both data files.** In `public/index.html`, before `app.js` (order matters — both
must define their globals first):
```html
<script src="recipes-db.js"></script>
<script src="ingredient-prices.js"></script>
<script src="app.js"></script>
```
In `public/sw.js` add **both** `'./recipes-db.js'` and `'./ingredient-prices.js'` to `SHELL` and
bump `CACHE` `'foodie-shell-v3'` → `'foodie-shell-v4'`. **Skipping the bump ships stale code to
installed PWAs; forgetting either file means an offline user gets a hard `is not defined` crash.**
*Verify:* console — `RECIPES_DB.length` is `28` and `typeof estimateIngredientPrice` is
`'function'`.

**Step 2 — teach the app that a dish has several roles.** Near line 364 of `app.js`:
```js
const DB = (typeof RECIPES_DB !== 'undefined') ? RECIPES_DB : [];
const dishRoles = r => r.types || [r.type];      // legacy dishes only have .type
const isCurated = r => typeof r.id === 'string' && r.id.startsWith('db-');
```

**Step 3 — allergens from `contains`.** In `passesDietFilters()` (line 366), after the `dislikes`
loop and **before** the existing `allergies.includes('fish')` block:
```js
if (Array.isArray(recipe.contains)) {
  if (allergies.some(a => recipe.contains.includes(a))) return false;
  return true;                    // curated dish: contains[] is the whole answer
}
```
`allergies` is already lowercased on line 368; every `contains` value is lowercase. Leave the
existing regex path alone — legacy dishes still need it.
*Verify:* tick Gluten → bruschetta, tiramisu, bolognese gone. Tick Soy → teriyaki salmon, Thai
curry, sriracha chicken gone.

**Step 4 — put the database in the pool, deduped.** Rewrite `eligibleRecipes()` (line 381):
```js
function eligibleRecipes(role, profile){
  const seen = new Set();
  const pool = [...DB, ...RECIPES, ...STARTERS, ...DESSERTS, ...state.favorites]
    .filter(r => r && !seen.has(r.id) && seen.add(r.id));      // ← dedupe: favourites re-enter
  const base = pool.filter(r => dishRoles(r).includes(role) && passesDietFilters(r, profile));
  const maxDiff = maxDifficultyFor(profile.cookingLevel);
  const maxTime = Number(profile.timePerMeal) > 0 ? Number(profile.timePerMeal)
                                                  : maxTimeFor(profile.lifeStage);
  const strict = base.filter(r => r.difficulty <= maxDiff && r.time <= maxTime);
  return strict.length ? strict : base;
}
```
The favourites `.filter(f => f.type === role)` is gone — `dishRoles()` covers it. The dedupe is
what protects the no-repeat rule.

**Step 5 — pick curated first.** This is the step that actually delivers "use the database first".
Add beside `pickMeal()`:
```js
const preferCurated = list => { const c = list.filter(isCurated); return c.length ? c : list; };
```
and change the final selection in `pickMeal()` (line 400) so preference runs
**favourites → curated → legacy**:
```js
const favFresh = choices.filter(r => String(r.id).startsWith('fav'));
const from = (favFresh.length && Math.random() < 0.5) ? favFresh : preferCurated(choices);
return from[Math.floor(Math.random() * from.length)];
```
Apply `preferCurated()` to the replacement pick in `enforceNoRepeat()` (line 443) **and** in
`swapMeal()` (line 465) — miss those and swapping quietly drops back to placeholder recipes.
*Verify (measured against the real data):* an unrestricted **main-only week fills 20 of 21 slots**
from the database. A 3-course week fills 31 of 49 — see §0.5.
**Commit.**

**Step 6 — real recipe links.** Keep `recipeSearchUrl()` as the fallback and add beside it:
```js
function recipeUrl(recipe){
  return (recipe && recipe.sourceUrl) ? recipe.sourceUrl : recipeSearchUrl(recipe && recipe.name);
}
```
Replace both call sites: the `.ics` description (line 576) and "See full recipe ↗" (line 1482).
Show `Recipe by ${r.sourceName}` beside the link when present.

**Step 7 — real photos.** First line of `dishImageUrl()` (line 490):
```js
if (recipe.photo) return recipe.photo;      // curated dishes carry their own photo
```
The existing `onerror` emoji fallback stays and now also covers a dead CDN link. Keep `DISH_IMG`
for legacy dishes.

**Step 8 — fix pantry matching before it hides real shopping.** `pantryHas()` (§0.2) currently
hides bell peppers, spring onions, rice wine and flour tortillas. Replace substring matching with
whole-word matching:
```js
function pantryHas(name){
  const list = state.profile?.pantry || []; if (!list.length) return false;
  const words = name.toLowerCase().split(/[^a-z]+/).filter(Boolean);
  return list.some(term => {
    const t = term.toLowerCase().split(/[^a-z]+/).filter(Boolean);
    return t.every(w => words.includes(w)) && t.length === words.length;   // exact word-set match
  });
}
```
*Verify:* with a full pantry, `Olive oil` and `Garlic` still hide; `Red bell pepper`,
`Spring onions`, `Rice wine` and `Large flour tortilla` now correctly stay on the list.
**Commit.**

**Step 9 — make curated dishes browsable *and* openable.** Two places, and missing the second is a
silent bug:
- Browse carousels (lines 1363–1366) read `RECIPES` only. Change each to `[...DB, ...RECIPES]` so
  curated dishes fill `Weeknight winners`, `Sweet endings` etc. This is what widens browsing (§4).
- `findBrowseRecipe()` (line 1313) must become
  `[...DB, ...RECIPES, ...STARTERS, ...DESSERTS, ...state.favorites]`.
  **Skip this and curated cards render fine but tapping one opens nothing** — the lookup returns
  `undefined`.

**Step 10 — Gemini becomes the top-up.** The plumbing already exists; this is a policy change, not
new infrastructure.
- Build the week from the database **first, always** — including when "Use real AI generation" is on.
- `enforceNoRepeat()` already records slots it could not fill uniquely into `state.repeatedDishes`.
  **That list is the trigger.** If it is non-empty *and* AI is on, call the existing
  `requestSwapAI(profile, role, avoidNames)` once per unfilled slot, passing every name already
  used. No new endpoint.
- Keep `/generate-week` as the "surprise me entirely with AI" path — it is verified working and
  supplies real prices. It is no longer the default.
- Relabel the toggle: *"Let AI invent extra dishes when the cookbook runs short"*.
- **Keep the honest repeat notice** for AI-off with an exhausted pool, and keep `state.partialAI`.
  Do not hide either.
- Mind the quota: Gemini free tier is **20 requests/day**. Per-slot top-up calls are cheap only
  because the database now covers most slots — cap the top-up at ~5 calls per week generation.

**Step 11 — the card (feeds §3).** The database supplies everything §3 asks for: `prepTime` and
`cookTime` for the two stat columns, `difficulty` for the 4-dot meter, `photo` for image-on-top,
`kcal`/`protein` for the detail overlay. Show `passiveTime` **separately** — e.g. *"+ 8 h chilling"* —
never folded into the headline time, or overnight oats reads as an 8-hour recipe.
**Commit.**

### 0.4 Prices — the one thing that genuinely conflicts, and the fix

Today per-ingredient prices come **only from Gemini**. That is why the €/day pill, the per-day €
chips and §4's "Budget-friendly dinners" work with AI on and show nothing with AI off. Making the
database primary would therefore *remove* pricing from most of the week — a regression against
something already verified working.

**Built 2026-07-20 (separate from the recipe data, so Lucille can price-check it independently
of Gemini and of the dish list):**

| File | What it is |
|---|---|
| `public/ingredient-prices.js` | **The price table. Single source of truth.** `INGREDIENT_PRICES` — all 126 distinct ingredients used by `recipes-db.js`, each priced per `100g` / `100ml` / `piece` / `clove` / `slice` / `stalk`. Exposes `estimateIngredientPrice(ing)`. Browser global + Node export, same pattern as `recipes-db.js`. |
| `docs/INGREDIENT-PRICES.md` | Human-readable price list. **Generated — never hand-edit.** |
| `tools/build-prices-md.js` | Rebuilds the `.md` from the `.js`, and warns in the terminal if `recipes-db.js` uses an ingredient this table doesn't price yet. `node tools/build-prices-md.js` |

Prices are **informed estimates** (French supermarket, mid-range own-brand, 2026), not scraped
live prices — the file says so at the top and that framing must reach the UI too (label as
*"Estimated — varies by shop"*, same wording §5 already uses for Gemini's total). Verified: all
126 ingredients used by the current 28 dishes have a price (none return the unknown-ingredient
€0), and a simulated week comes out at a believable €4.79/day (mains only) to €6.17/day (3 courses)
per person — in the same range as the €107/week the real AI-ON test produced for a household.

**The one line this actually takes to wire in** — change `priceOf()` (line 552) so AI prices
still win, and this is only ever the fallback:
```js
function priceOf(ing){
  if (typeof ing.price === 'number' && isFinite(ing.price)) return ing.price;  // AI wins
  return (typeof estimateIngredientPrice === 'function') ? estimateIngredientPrice(ing) : 0;
}
```
`estimateIngredientPrice` needs `ingredient-prices.js` loaded — add it to `index.html` next to
`recipes-db.js` (step 1) and to the PWA `SHELL` array (same step, same `CACHE` bump).

Everything downstream (`sumPrices`, the per-day chips, the budget pill, §4's cheapest-by-€ sort)
then works unchanged — and for the first time **works with AI off too**. §5's Gemini
`estimatedTotal` stays the headline when AI is on; this becomes its fallback.

**Status: built and verified. Not yet wired into `app.js`** (that one `priceOf()` change, plus
loading the file, is step 1a / step 1b of §0.3).

### 0.5 Known gaps — measured, so nobody rediscovers them

- **28 dishes covers a main-only week, not a 3-course one.** Measured by simulating the step-5
  picker against the real data:

  | Goal | Slots/week | Filled from database |
  |---|---|---|
  | Stay balanced / Feel light (mains) | 21 | **20 of 21** |
  | Get stronger (starter + main + dessert) | 49 | 31 of 49 |

  The shortfall is entirely starters and desserts: a 3-course week needs **14 of each**; the
  database has **6 and 5**. Until it grows, expect the repeat notice or the Gemini top-up to fire on
  "Get stronger". **Add desserts and starters first** — mains and breakfasts are already strong.
- **A gluten allergy leaves only 7 of 28 dishes.** Dairy and gluten are common across the set. Bias
  the next additions toward naturally gluten- and dairy-free dishes.
- **12 of 28 dishes have `nutrition:'estimated'`** — Love & Lemons doesn't publish nutrition, so
  those kcal/protein figures were computed from the ingredients. Good approximations, not measured
  values. The other 16 are `'source'`. Surface the distinction if nutrition is ever shown as a hard
  number.
- **Photos are hotlinked** from the recipe sites' CDNs. The emoji fallback covers a single failure,
  but if a site adds hotlink protection they break together. Durable fix: copy them into the
  existing private `dish-photos` Supabase bucket and rewrite `photo`.
- **`sesame` is tracked in the data but not asked about.** `ALLERGY_OPTIONS` is
  `['Nuts','Dairy','Gluten','Shellfish','Soy']`; hummus/tahini carries `sesame`. Add the option when
  convenient — the data is already there.

### 0.6 How Lucille adds dishes

1. Open `public/recipes-db.js`, copy a block, paste it into the right section.
2. Unique `id` starting with `db-`.
3. Quantities **per serving, metric**. `category` exactly one of
   `Produce` · `Meat & Fish` · `Dairy` · `Bakery` · `Frozen` · `Pantry`.
4. Fill in `contains` honestly — that is what protects an allergic user.
5. `node tools/build-recipe-md.js` to rebuild the catalogue.

No other file needs touching. Once §0.3 is done, a new dish appears in the planner and in browse
automatically.

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

0. **Dish database (§0) — DO THIS FIRST.** All 11 steps of §0.3, plus the price table in §0.4.
   §3 and §4 are both built on this data; doing it after means building them twice. Run the §0.2
   regression table before moving on.
1. Palette swap (§1) — every screen re-tinted, nothing tomato-coloured remains.
2. Card component (§3) — image-on-top, used everywhere. Reads `prepTime`/`cookTime`/`difficulty`
   straight from §0's data; show `passiveTime` separately.
3. One-page planner + tabs + sidebar (§2); delete the old shopping screen + step bar.
   The sidebar's €/day comes from §0.4's price estimate when AI is off.
4. Categories + dessert/starter sections (§4). `Sweet endings` and `Small plates to start` are only
   worth building once §0's dessert/starter count has grown — see §0.5.
5. Filter row (§4). The `Dietary ▾` filters read `tags`; allergies read `contains` (§0.3 step 3).
6. Shopping tab + total at bottom (§5) — Gemini `estimatedTotal` as headline, §0.4 estimate as the
   AI-off fallback.
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

**§0 — the dish database**

☐ **A generated week is filled from the database first** — with AI off, every slot a curated dish
  can legally fill is filled by one; legacy-pool dishes appear only once it's exhausted.
  Benchmark: a main-only week on an unrestricted profile fills **20 of 21** slots.
☐ **Every curated dish shows its own real photo and links to its real recipe page** — no Google
  search links and no Unsplash stand-ins for a dish that carries a `photo`.
☐ **Allergies use `contains`, not name-guessing.** Tick Gluten → bruschetta, tiramisu and bolognese
  disappear. Tick Soy → teriyaki salmon, Thai red curry and sriracha chicken disappear.
☐ Opening a curated dish from a browse carousel shows its detail overlay — i.e. `findBrowseRecipe`
  was updated. **Breaks silently if skipped.**
☐ **Prices still work.** €/day pill, per-day € chips and the shopping total show real numbers with
  AI **off** (§0.4) as well as on. This is the regression most likely to slip through.
☐ **Pantry hiding no longer eats real shopping** — with a full pantry, `Red bell pepper`,
  `Spring onions`, `Rice wine` and `Large flour tortilla` all stay on the list, while `Olive oil`
  and `Garlic` still hide.
☐ **No-repeat survives favouriting.** Favourite a database dish, re-plan, confirm still 0 duplicates
  (the pool dedupe in §0.3 step 4 is what protects this).
☐ Gemini is only called to *top up* what the database can't fill, never to author a week from
  scratch — and the top-up reuses `requestSwapAI`, with **no new endpoint** and ≤5 calls per week.
☐ `state.partialAI` and the honest repeat notice both still fire and are still visible.
