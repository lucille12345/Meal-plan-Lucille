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

0. **Curated recipe database (§9) — DO THIS FIRST.** §3 and §4 both depend on dishes that carry
   their own photo, prep/cook split and real recipe link. Building the card before the data exists
   means building it twice.
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
☐ **A generated week is filled from the curated database first** — with AI off, every slot a curated
  dish can legally fill is filled by one, and legacy-pool dishes only appear once it's exhausted.
☐ **Every curated dish shows its own real photo and links to its real recipe page** — no Google
  search links and no Unsplash stand-ins for dishes that carry a `photo`.
☐ **Allergies use `contains`, not name-guessing.** Tick Gluten → bruschetta, tiramisu and spaghetti
  bolognese all disappear. Tick Soy → teriyaki salmon and Thai red curry disappear.
☐ Opening a curated dish from a browse carousel shows its detail overlay (i.e. `findBrowseRecipe`
  can actually find it) — this breaks silently if the database isn't added to that lookup.
☐ Gemini is only called to *top up* what the database can't fill, never to build a week from scratch.

---

## 9. Curated recipe database ← the app stops depending on Gemini for dishes

**The problem this solves.** Today every dish is either invented by Gemini or comes from a thin
offline pool of placeholder recipes with no real links, no real photos and guessed nutrition. That
makes browsing dull, makes the app fragile when the Gemini quota runs out (free tier = 20 requests
a day), and means the "recipe link" is only ever a Google search.

**The decision: the database is primary, Gemini is the top-up.** The app fills a week from curated
dishes first. Only when the database genuinely cannot fill a slot — heavy dietary restrictions, or
Lucille asking for more variety — does Gemini invent something new.

### What already exists (built 2026-07-20 — do not rebuild it)

| File | What it is |
|---|---|
| `public/recipes-db.js` | **The database. Single source of truth.** 28 real dishes: 5 breakfasts, 6 starters, 12 mains, 5 desserts. Exposes `RECIPES_DB` as a browser global and a Node export. |
| `docs/RECIPE-DATABASE.md` | Human-readable catalogue — photo, link, ingredient table, nutrition per dish. **Generated. Never hand-edit.** |
| `tools/build-recipe-md.js` | Regenerates the `.md` from the `.js`. Run `node tools/build-recipe-md.js`. |

Every link, photo, calorie and protein figure was read from the recipe site's own schema.org
recipe data — none of it is invented. All 28 recipe links and all 28 photo URLs were verified
returning HTTP 200. Sources: Love & Lemons, Cookie and Kate, Budget Bytes.

**The per-dish shape** (full field reference is in the header comment of `recipes-db.js`):

```js
{
  id:'db-m2', type:'dinner', types:['lunch','dinner'],   // types[] = every role it can fill
  name:'Sheet pan chicken fajitas', desc:'Chicken, peppers, lime, tortillas',
  sourceUrl:'https://www.budgetbytes.com/oven-fajitas/', sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/…/Sheet-Pan-Chicken-Fajitas-done.jpg',
  emoji:'🌮', img:'chicken',                              // fallbacks if the photo 404s
  prepTime:15, cookTime:40, time:55,                      // time = prep + cook (ACTIVE only)
  passiveTime:0,                                          // chilling/marinating, excluded from time
  difficulty:1, servings:4, kcal:483, protein:31, nutrition:'source',
  tags:[], contains:['gluten','dairy'],                   // contains = EXPLICIT allergens
  ingredients:[ {name,qty,unit,category,buyDayBefore}, … ],  // PER SERVING, metric
  steps:[ … ]
}
```

Three things about this shape matter for the wiring:

- **`types` is an array.** Most mains are both lunch and dinner. The current `eligibleRecipes()`
  matches on `r.type === role`, which would only ever see the primary role.
- **`ingredients` are per serving.** `scaleRecipe()` already multiplies by household size — do not
  pre-scale, or families get quadruple portions.
- **`contains` is the authoritative allergen list.** The existing `passesDietFilters()` guesses
  allergens by regex over ingredient names, and that regex misses `Baguette`, `Spaghetti` and
  `Savoiardi ladyfingers` (all gluten) and has no soy rule at all. `contains` must win.

### Step-by-step wiring

Do these in order. Verify with **AI OFF** after each. Commit after step 5 and step 8.

**Step 1 — load the file.**
In `public/index.html`, add the script *before* `app.js` (it must define `RECIPES_DB` first):
```html
<script src="recipes-db.js"></script>
<script src="app.js"></script>
```
In `public/sw.js`, add `'./recipes-db.js'` to the `SHELL` array and bump `CACHE` from
`'foodie-shell-v3'` to `'foodie-shell-v4'`. **Skipping the bump ships stale code to installed PWAs.**
Verify: `typeof RECIPES_DB` is `'object'` in the console and `RECIPES_DB.length` is 28.

**Step 2 — teach the app that a dish can have several roles.**
Near the top of the generation section in `app.js` (around line 364), add:
```js
const DB = (typeof RECIPES_DB !== 'undefined') ? RECIPES_DB : [];   // curated dishes
const dishRoles = r => r.types || [r.type];        // legacy dishes only have .type
const isCurated = r => typeof r.id === 'string' && r.id.startsWith('db-');
```

**Step 3 — allergens from `contains`.**
In `passesDietFilters()` (line 366), after the `dislikes` loop and *before* the existing
`allergies.includes('fish')` block, add an early authoritative path:
```js
if (Array.isArray(recipe.contains)) {
  if (allergies.some(a => recipe.contains.includes(a))) return false;
  return true;                    // curated dish: contains[] is the whole answer
}
```
`allergies` is already lowercased on line 368 and every `contains` value is lowercase, so they match.
Leave the existing regex checks alone — legacy pool dishes still need them.

**Step 4 — put the database in the pool, ahead of everything else.**
Rewrite `eligibleRecipes()` (line 381):
```js
function eligibleRecipes(role, profile){
  const pool = [...DB, ...RECIPES, ...STARTERS, ...DESSERTS, ...state.favorites];
  const base = pool.filter(r => dishRoles(r).includes(role) && passesDietFilters(r, profile));
  const maxDiff = maxDifficultyFor(profile.cookingLevel);
  const maxTime = Number(profile.timePerMeal) > 0 ? Number(profile.timePerMeal)
                                                  : maxTimeFor(profile.lifeStage);
  const strict = base.filter(r => r.difficulty <= maxDiff && r.time <= maxTime);
  return strict.length ? strict : base;
}
```
Note the favourites filter loses its `.filter(f => f.type === role)` — `dishRoles()` handles it now.

**Step 5 — pick curated dishes first.** This is the step that actually delivers "use the database
first". In `pickMeal()` (line 390), the candidate list is currently picked from at random. Add a
preference tier so curated dishes win whenever any are available:
```js
const preferCurated = list => { const c = list.filter(isCurated); return c.length ? c : list; };
```
then change the final selection so the order of preference is **favourites → curated → legacy**:
```js
const favFresh = choices.filter(r => String(r.id).startsWith('fav'));
const from = (favFresh.length && Math.random() < 0.5) ? favFresh : preferCurated(choices);
return from[Math.floor(Math.random() * from.length)];
```
Apply the same `preferCurated()` call to the replacement pick inside `enforceNoRepeat()` (line 443)
and to `swapMeal()` (line 465), or swapping a dish will quietly drop back to placeholder recipes.
**Verify:** generate a week with AI off — count how many slots hold a `db-` id. On an unrestricted
profile it should be every slot the database can legally fill.

**Step 6 — real recipe links.**
`recipeSearchUrl()` (line 473) stays as the fallback. Add beside it:
```js
function recipeUrl(recipe){
  return (recipe && recipe.sourceUrl) ? recipe.sourceUrl : recipeSearchUrl(recipe && recipe.name);
}
```
Replace both call sites — the `.ics` description (line 576) and "See full recipe ↗" (line 1482) —
with `recipeUrl(r)`. Show `Recipe by ${r.sourceName}` next to the link when `sourceName` exists.

**Step 7 — real photos.**
At the top of `dishImageUrl()` (line 490), before the keyword lookup:
```js
if (recipe.photo) return recipe.photo;      // curated dishes carry their own photo
```
The existing `onerror` emoji-tile fallback stays and now covers a dead CDN link too. Leave the
`DISH_IMG` map in place for legacy dishes.

**Step 8 — make curated dishes browsable and openable.**
Two separate places, and missing the second is a silent bug:
- The browse carousels (lines 1363–1366) read `RECIPES` only. Change each to read from
  `[...DB, ...RECIPES]` so curated dishes appear in `Weeknight winners`, `Sweet endings`, etc.
  This is what widens the browsing range (§4).
- `findBrowseRecipe()` (line 1313) must become
  `[...DB, ...RECIPES, ...STARTERS, ...DESSERTS, ...state.favorites]`. **If you skip this, curated
  cards render fine but tapping one opens nothing** — the lookup returns `undefined`.

**Step 9 — demote Gemini to a top-up.**
Today `enforceNoRepeat()` records slots it could not fill uniquely into `state.repeatedDishes` and
the planner shows an honest notice. That notice becomes the trigger:
- Build the week from the database first, always — including when "Use real AI generation" is on.
- **Only if** `state.repeatedDishes` is non-empty **and** AI is on, call Gemini for just those
  slots, passing the roles needed and the names already used so it cannot duplicate.
- Add a `/generate-dishes` endpoint in `server.js` taking `{count, role, avoidNames, profile}` and
  returning dishes in the shape above. Keep `/generate-week` for now; it is the "surprise me
  entirely with AI" path, not the default.
- Relabel the toggle: it now means *"let AI invent extra dishes when the cookbook runs short"*,
  not *"generate my week"*.
- Keep the honest repeat notice for when AI is off and the pool is genuinely exhausted. Don't hide it.

**Step 10 — the card (feeds §3).** The database gives the card everything §3 asks for directly:
`prepTime` and `cookTime` for the two stat columns, `difficulty` for the 4-dot meter, `photo` for
the image-on-top, `protein` and `kcal` for the detail overlay. Show `passiveTime` separately as
e.g. *"+ 8 h chilling"* — never fold it into the headline time, or overnight oats reads as an
8-hour recipe.

### How Lucille adds more dishes

1. Open `public/recipes-db.js`, copy any existing block, paste it into the right section.
2. Give it a **unique `id` starting with `db-`**.
3. Quantities **per serving, metric**. `category` must be exactly one of
   `Produce` · `Meat & Fish` · `Dairy` · `Bakery` · `Frozen` · `Pantry`.
4. Fill in `contains` honestly — that is what protects an allergic user.
5. Run `node tools/build-recipe-md.js` to rebuild the catalogue.

No other file needs touching. Once the wiring above is done, a new dish appears in the planner and
in browse automatically.

### Known gaps, so nobody rediscovers them

- **12 of the 28 dishes have `nutrition:'estimated'`** — Love & Lemons doesn't publish nutrition
  data, so those kcal/protein figures were computed from the ingredients. They're good
  approximations, not measured values. The other 16 are `'source'` and can be trusted. Surface the
  distinction if nutrition is ever shown as a hard number.
- **Photos are hotlinked** from the recipe sites' CDNs. Fine for now and the emoji fallback covers a
  failure, but if a site adds hotlink protection the images break all at once. The durable fix is
  to download them into the existing private `dish-photos` Supabase bucket and rewrite `photo`.
- **`contains` doesn't track sesame or soy in the questionnaire.** `ALLERGY_OPTIONS` is
  `['Nuts','Dairy','Gluten','Shellfish','Soy']` — the data carries `sesame` (hummus, tahini) but
  nothing asks the user about it. Add it to the options when convenient; the data is already there.
- **28 dishes covers a main-only week comfortably, but not a 3-course one.** Measured by simulating
  the step-5 logic against the real database:
  | Goal | Slots in a week | Filled from the database |
  |---|---|---|
  | Stay balanced / Feel light (mains) | 21 | **20 of 21** |
  | Get stronger (starter + main + dessert) | 49 | 31 of 49 |

  The shortfall is entirely starters and desserts: a 3-course week needs **14 starters and 14
  desserts**, and the database has **6 and 5**. Until that grows, expect the honest repeat notice
  (or the Gemini top-up) to fire on the "Get stronger" goal. **Priority order for new dishes:
  desserts, then starters** — mains and breakfasts are already in good shape.
- **A gluten allergy leaves only 7 of 28 dishes.** Dairy and gluten are common across the current
  set. Worth biasing the next batch of additions toward naturally gluten- and dairy-free dishes.
