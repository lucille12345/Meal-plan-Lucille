# V3 REDESIGN BRIEF — #Foodie
### The decided spec. Execute it in the order given by §7 — not top to bottom.

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
`public/ingredient-prices.js` (**prices — §0.4**) · `public/sw.js` (bump `CACHE`) ·
`server.js` (AI prompt, plus the `/research-dish` endpoint in §0.7) ·
`supabase/schema.sql` (the `user_dishes` table in §0.7).

**Order matters:** §0 (data) → §1 (palette) → §3 (card) → §2 (one page) → §4/§5 → §0.7 → §6. The
numbering is historical; **§7 is the order to actually build in.**

---

## 00. How to run this build — read this before touching anything

### 00.1 Which model for which phase

This brief is written to be executed by **Sonnet** for most phases, with **Opus** on the two that
carry real risk plus the final pass. That split isn't about capability in general — it's about
where this particular spec stops being able to hand you the answer.

| Phase | Model | Why |
|---|---|---|
| **§0.3 data wiring** (steps 1–11) | **Sonnet** | Every edit is given as exact code with a search anchor. The thinking is already done on the page. |
| **§0.4 prices** | **Sonnet** | Literally one line (`priceOf()`), plus a file that already exists. |
| **§1 palette** | **Sonnet** | A token table to transcribe. Mechanical. Just re-check AA contrast at the end. |
| **§3 card component** | **Sonnet** | Anatomy is drawn in the spec; fields come straight from §0's data. |
| **§2 one-page planner** | **🔶 Opus** | **The biggest risk in V3.** Merging three screens into one page with a sticky sidebar, tabs, drag-and-drop and overlays is a layout rebuild, not a transcription. The spec gives structure and intent, not code — so judgment fills the gap. Getting it wrong means redoing §4 and §5 on top of it. |
| **§4 categories + filters** | **Sonnet** | Category table and filter list are fully enumerated. |
| **§5 shopping tab** | **Sonnet** | Mostly moving an existing total and reading §0.4's estimate. |
| **§0.7 "Add a dish I love"** | **🔶 Opus** | New endpoint, untrusted model output, and an **allergen confirmation flow where a subtle bug can reach a real plate**. Well-specified, but the cost of a quiet mistake is the highest in the project. |
| **§6 copy pass** | **Sonnet** | Taste-dependent, but low blast radius and easy for Lucille to judge herself. |
| **§9 final verification** | **🔶 Opus** | Whole-system judgment across everything above. Different skill from building any one piece. |

**Thinking effort.** For the Sonnet phases, normal effort is right — the spec *is* the reasoning,
and long deliberation over a transcription wastes budget. For the three 🔶 Opus phases, turn
thinking up (`high`): those are the ones where the spec deliberately stops short and expects
judgment. If a Sonnet phase starts feeling like it needs invention rather than transcription,
that's the signal to stop and escalate it — see §00.4.

**If you'd rather not switch models at all:** run the whole thing on Opus. You'll get the same
result and spend more. Running the whole thing on Sonnet is also viable *provided* §9's Opus pass
actually happens — but expect §2 to need a revision round.

### 00.2 Line numbers are gone on purpose — locate by search

Earlier drafts of this brief cited line numbers in `app.js`. **Several had already drifted by ~9
lines before the build even started**, and every edit you make shifts everything below it. So every
reference here is now a **search anchor** — a function name or a distinctive line to `grep` for.

**Never trust a line number. Always locate by:**
```
grep -n "function eligibleRecipes" public/app.js
```
If an anchor doesn't match, the code changed — stop and re-read the surrounding function rather
than editing the nearest plausible-looking thing.

### 00.3 Session hygiene

- **One phase per session.** Start fresh at each §7 step. A long session drifts and starts
  contradicting decisions made earlier in the same file.
- **Every session starts by reading `CLAUDE.md` + this brief's §00, §0.2, and the phase you're on.**
  Not the whole file — §0.2 (the regression table) is the part that prevents damage.
- **Commit at the end of every phase**, with the phase named in the message. Never batch two.
- **Never commit `gemini-key.txt`.** It's git-ignored; keep it that way.
- Lucille pushes via **GitHub Desktop** — there are no git credentials in this CLI, so don't try.

### 00.4 When to stop instead of guessing

Stop and ask Lucille — do not improvise — if any of these happen. Each one has burned a session
before:

- A search anchor from this brief **doesn't exist** in the file.
- A change would touch anything in the §0.2 "must not break" table in a way the guard doesn't cover.
- The spec is genuinely ambiguous about **user-visible behaviour** (not styling — styling, pick the
  option closest to the Woolworths reference and move on).
- You're about to **delete or rewrite something you didn't write** and can't tell whether it's load-bearing.
- A Sonnet phase turns out to need real invention rather than transcription → escalate to Opus
  rather than pushing through.
- Anything involving **allergens** where the correct answer isn't obvious. Always fail closed:
  exclude the dish rather than risk serving it.

### 00.5 The three rules that outrank everything else in this file

1. **The database comes before Gemini.** Always. §0 exists for this.
2. **`contains[]` is the allergen truth.** Never regex an ingredient name to decide safety.
3. **Verify with AI OFF before moving on.** The free tier is 20 requests/day and the AI-ON path is
   already verified — burning quota to re-test it proves nothing and costs you the day's budget.

---

## 0. The dish database — build this before anything else

**Why first.** §3 (card anatomy) needs dishes that carry their own photo and a prep/cook split.
§4 (browse carousels, dessert + starter sections) needs enough dishes to fill eight carousels.
§5 (shopping total) needs prices. All three are built on the data layer, so the data layer goes in
first — otherwise §3 and §4 get built twice.

**THE PRECEDENCE RULE — this section exists to establish it, and nothing later may weaken it:**

> **The database always comes first.** Every meal slot is filled from the curated database (plus the
> user's own verified dishes, §0.7) before Gemini is consulted at all. Gemini is only ever reached
> for a slot the database genuinely cannot fill — and it is never asked to author a dish the
> database could have supplied.

Gemini keeps two legitimate jobs, and both of them *feed* the database rather than bypass it:
**topping up** the rare slot nothing can fill (§0.3 step 10), and **researching** a dish the user
asks for so it becomes a permanent database row (§0.7). Read that second one carefully — it means
every time the user adds a dish they love, the database grows and Gemini's role shrinks.

### 0.1 What already exists (built 2026-07-20 — do not rebuild)

| File | What it is |
|---|---|
| `public/recipes-db.js` | **The database. Single source of truth.** `RECIPES_DB` — 57 real dishes: 9 breakfasts, 16 starters, 22 mains, 10 desserts. Browser global + Node export. |
| `docs/RECIPE-DATABASE.md` | Human-readable catalogue. **Generated — never hand-edit.** |
| `tools/build-recipe-md.js` | Rebuilds the `.md` from the `.js`. `node tools/build-recipe-md.js` |

Every link, photo, kcal and protein figure was read from the recipe sites' own schema.org data;
all 57 links and all 57 photos verified HTTP 200. Sources: Love & Lemons, Cookie and Kate,
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
| **Hard no-repeat rule** (0 duplicates, 288-profile test) | A favourited database dish appears in the pool **twice** — once from `RECIPES_DB`, once from `state.favorites`. The favourite is a re-scaled **copy under a fresh `fav<ts>` id**, so the two entries share a *name* but never an *id*. `usedIds` is satisfied by one copy while the other still supplies the name. | **Two guards, and the order matters.** (1) The one that actually enforces it: `pickMeal()` tracks used **names** (lowercased) across the whole week, and `enforceNoRepeat()` sweeps for name collisions afterwards. That is what delivers 0 duplicates. (2) Belt-and-braces: `eligibleRecipes()` (step 4) dedupes the pool by **name**, so the twin never enters. **An `id` dedupe cannot work here** — the ids differ by construction. It was this table's stated guard until 2026-07-21 and merged nothing; the rule survived only on guard (1). Re-run the duplicate check after touching either. |
| **Allergy filtering** | The existing regex misses gluten in `Baguette`, `Spaghetti`, `Savoiardi ladyfingers`, and has no soy rule at all — several dishes would reach someone who ticked that allergy. | `contains[]` early-return (step 3). Verified: Gluten drops bruschetta/tiramisu/bolognese; Soy drops teriyaki salmon/Thai curry/sriracha chicken. |
| **AI-ON path** (verified: 49 dishes, 0 dupes, real prices, €107.30 shopping list) | Database dishes carry **no per-ingredient prices**. Swap AI dishes for database dishes and the shopping total, the €/day budget pill, the per-day € chips and §4's "Budget-friendly dinners" all go blank. **This is the one genuine conflict in §0** — see §0.4. | The price table in §0.4. Do not skip it. |
| **`state.partialAI` top-up** | Nothing — it already fills short AI weeks from `generateWeek()`, which after §0 returns database dishes. It silently gets better. | Leave it alone. Keep the notice. |
| **Swap-a-dish with AI on** | — | **`requestSwapAI(profile, role, avoidNames)` already exists** and posts to `/generate-meal` with an avoid-list. This is the top-up primitive. **Do not build a new endpoint for the top-up.** (§0.7's `/research-dish` *is* new — different job, see below.) |
| **Leftovers** (`applyLeftovers` doubles a dinner main → next-day lunch) | Would break if mains were dinner-only. | Database mains carry `types:['lunch','dinner']`, so this works. Verify one leftovers week. |
| **Pantry hiding** | `pantryHas()` substring-matches both directions, so pantry `Pepper` hides **`Red bell pepper`**, `Rice` hides **`Rice wine`**, `Onion` hides **`Spring onions`**, `Flour` hides **`Large flour tortilla`**. Dozens of ingredients you must actually buy would vanish. Pre-existing, but the database makes it constant and the problem grows with every dish added. | Fix `pantryHas()` to match whole words, not substrings (step 8). |
| **Cook mode + read-aloud** | Reads `steps[]`. Database dishes have them. | Smoke-test one database dish end to end. |
| **`.ics` export** | Builds its description from `recipeSearchUrl()`. | Point it at `recipeUrl()` (step 6). |
| **PWA** | New file isn't cached; installed users get `RECIPES_DB is not defined`. | Add to `SHELL` **and** bump `CACHE` (step 1). |
| **Supabase sync** | `profiles.state` stores the whole week inline. Database recipes are much fatter (photo URL, sourceUrl, full steps) — a 49-slot week could bloat the row badly. | Store `{id}` references for `db-` dishes and rehydrate on load; keep inlining AI dishes, which have no other home. |
| **Allergy filtering, again — via §0.7** | A user-researched dish enters the same pool as reviewed data, but its `contains[]` was written by a model. An under-listed allergen here reaches a real plate. **The single most safety-critical thing in §0.** | `validateDish()` rejects malformed rows outright, the user confirms the allergen list before saving (`verified:true`), and only `verified` dishes enter `DB` (§0.7.4, §0.7.7). |
| **Hard no-repeat rule, again — via §0.7** | User dishes arriving from both Supabase and the `localStorage` mirror can double up in the pool. | The `eligibleRecipes()` **name** dedupe from step 4 already covers it, and unlike the old `id` dedupe it holds even if a mirrored copy comes back under a different id. Still assign user dishes stable ids of our own (never regenerated on load) — `mergeDishes()` and `findBrowseRecipe()` key on them. |

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
*Verify:* console — `RECIPES_DB.length` is `57` and `typeof estimateIngredientPrice` is
`'function'`.

**Step 2 — teach the app that a dish has several roles.** In `app.js`, immediately above
`function maxDifficultyFor` (start of the generation section):
```js
const DB = (typeof RECIPES_DB !== 'undefined') ? RECIPES_DB : [];
const dishRoles = r => r.types || [r.type];      // legacy dishes only have .type
const isCurated = r => typeof r.id === 'string' && r.id.startsWith('db-');
```
Make `DB` a **function or getter, not a frozen array**, if you build §0.7 in the same session —
user dishes get appended to it there, and a value captured once at load time will never see them.

**Step 3 — allergens from `contains`.** In `passesDietFilters()`, after the `dislikes`
loop and **before** the existing `allergies.includes('fish')` block:
```js
if (Array.isArray(recipe.contains)) {
  if (allergies.some(a => recipe.contains.includes(a))) return false;
  return true;                    // curated dish: contains[] is the whole answer
}
```
`allergies` is already lowercased two lines above (`profile.allergies.map(a=>a.toLowerCase())`);
every `contains` value is lowercase, so they match. Leave the
existing regex path alone — legacy dishes still need it.
*Verify:* tick Gluten → bruschetta, tiramisu, bolognese gone. Tick Soy → teriyaki salmon, Thai
curry, sriracha chicken gone.

**Step 4 — put the database in the pool, deduped.** Rewrite `eligibleRecipes()` in full:
```js
function eligibleRecipes(role, profile){
  const seen = new Set();
  // favourites FIRST, deduped by NAME — see below for why both halves matter
  const pool = [...state.favorites, ...DB, ...RECIPES, ...STARTERS, ...DESSERTS]
    .filter(r => { const k = r && r.name && r.name.toLowerCase();
                   return k && !seen.has(k) && seen.add(k); });
  const base = pool.filter(r => dishRoles(r).includes(role) && passesDietFilters(r, profile));
  const maxDiff = maxDifficultyFor(profile.cookingLevel);
  const maxTime = Number(profile.timePerMeal) > 0 ? Number(profile.timePerMeal)
                                                  : maxTimeFor(profile.lifeStage);
  const strict = base.filter(r => r.difficulty <= maxDiff && r.time <= maxTime);
  return strict.length ? strict : base;
}
```
The favourites `.filter(f => f.type === role)` is gone — `dishRoles()` covers it.

**Why the dedupe is by name and favourites come first** (corrected 2026-07-21 — it was an `id`
dedupe with favourites last, which merged nothing):

- **Name, not id.** `toggleFavorite()` stores a favourite as a *copy* under a fresh `fav<ts>` id —
  deliberately, because it re-scales the ingredients back to one person so any future week can
  re-scale them for any household size. Different id, same dish. Name is already this app's dish
  identity (`isFavorite()`, `toggleFavorite()`, `pickMeal()`'s no-repeat, `enforceNoRepeat()` all
  key on it), so name is the only key that actually merges the two.
- **Favourites first**, so the *copy* wins the dedupe rather than being dropped by its source. The
  copy is the one carrying the user's per-person base quantities, and its `fav` id prefix is what
  `pickMeal()`'s favourite boost tests for. Drop the copy and favourites silently stop being
  preferred.
- **`sourceId` keeps provenance.** Since the copy now survives and its id starts with `fav`,
  `isCurated()`/`isUserDish()` read `r.sourceId ?? r.id` (via `dishOrigin()`). Without that, a
  favourited curated dish would fall out of `preferCurated()` and quietly lose §0's precedence.
- This also collapses the two names shipped in both the curated and legacy pools (**Banana
  pancakes**, **Tomato bruschetta**), keeping the `db-` one — which is what §0 wants anyway.

The name dedupe is a **second** line of defence, not the primary one: the no-repeat rule is
enforced by `pickMeal()`'s used-names set and `enforceNoRepeat()`. See §0.2's first row.

**Step 5 — pick curated first.** This is the step that actually delivers "use the database first".
Add beside `pickMeal()`:
```js
const preferCurated = list => { const c = list.filter(isCurated); return c.length ? c : list; };
```
and change the final selection in `pickMeal()` — the two lines starting `const favFresh=` — so
preference runs
**favourites → curated → legacy**:
```js
const favFresh = choices.filter(r => String(r.id).startsWith('fav'));
const from = (favFresh.length && Math.random() < 0.5) ? favFresh : preferCurated(choices);
return from[Math.floor(Math.random() * from.length)];
```
Apply `preferCurated()` to the replacement pick in `enforceNoRepeat()` (the `if(fresh.length)`
branch) **and** in `swapMeal()` (its `pickMeal(...)` call) — miss those and swapping quietly drops
back to placeholder recipes.
*Verify (measured against the real data, 57 dishes):* an unrestricted **main-only week fills all
21 of 21 slots**, and a 3-course week fills **all 49 of 49** — see §0.5 for the dessert-repeat
caveat that remains even at full coverage.
**Commit.**

**Step 6 — real recipe links.** Keep `recipeSearchUrl()` as the fallback and add beside it:
```js
function recipeUrl(recipe){
  return (recipe && recipe.sourceUrl) ? recipe.sourceUrl : recipeSearchUrl(recipe && recipe.name);
}
```
Replace both call sites — find them with:
```
grep -n 'recipeSearchUrl(' public/app.js
```
One is the `.ics` description (the `` const desc=`Tonight's dinner: `` line), the other is the
`See full recipe ↗` anchor. The definition itself stays as the fallback.
Show `Recipe by ${r.sourceName}` beside the link when present.

**Step 7 — real photos.** First line of the `dishImageUrl()` body:
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
- The browse carousels read `RECIPES` only — the four `const quick=` / `const bfast=` /
  `const lunches=` / `const dinners=` lines inside `renderBrowse`. Change each to `[...DB, ...RECIPES]` so
  curated dishes fill `Weeknight winners`, `Sweet endings` etc. This is what widens browsing (§4).
- `findBrowseRecipe()` must become
  `[...DB, ...RECIPES, ...STARTERS, ...DESSERTS, ...state.favorites]`.
  **Skip this and curated cards render fine but tapping one opens nothing** — the lookup returns
  `undefined`.

**Step 10 — Gemini becomes the top-up.** The plumbing already exists; this is a policy change, not
new infrastructure.
- Build the week from the database **first, always** — including when "Use real AI generation" is on.
- `enforceNoRepeat()` already records slots it could not fill uniquely into `state.repeatedDishes`.
  **That list is the trigger.** If it is non-empty *and* AI is on, call the existing
  `requestSwapAI(profile, role, avoidNames)` once per unfilled slot, passing every name already
  used. **No new endpoint for this** — §0.7's `/research-dish` is a separate feature with a
  different job (filling a database row on request, not filling a slot at plan time).
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
| `public/ingredient-prices.js` | **The price table. Single source of truth.** `INGREDIENT_PRICES` — all 172 distinct ingredients used by `recipes-db.js`, each priced per `100g` / `100ml` / `piece` / `clove` / `slice` / `stalk`. Exposes `estimateIngredientPrice(ing)`. Browser global + Node export, same pattern as `recipes-db.js`. |
| `docs/INGREDIENT-PRICES.md` | Human-readable price list. **Generated — never hand-edit.** |
| `tools/build-prices-md.js` | Rebuilds the `.md` from the `.js`, and warns in the terminal if `recipes-db.js` uses an ingredient this table doesn't price yet. `node tools/build-prices-md.js` |

Prices are **informed estimates** (French supermarket, mid-range own-brand, 2026), not scraped
live prices — the file says so at the top and that framing must reach the UI too (label as
*"Estimated — varies by shop"*, same wording §5 already uses for Gemini's total). Verified: all
172 ingredients used by the current 57 dishes have a price (none return the unknown-ingredient
€0), and a simulated week comes out at a believable €4.78/day (mains only) to €8.85/day (3 courses)
per person — in the same range as the €107/week the real AI-ON test produced for a household.

**The one line this actually takes to wire in** — change `priceOf()` so AI prices
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

- **At 57 dishes, both a main-only week and a 3-course week fill completely from the database.**
  Measured by simulating the step-5 picker against the real data:

  | Goal | Slots/week | Filled from database |
  |---|---|---|
  | Stay balanced / Feel light (mains) | 21 | **21 of 21** |
  | Get stronger (starter + main + dessert) | 49 | **49 of 49** |

  This grew from an initial 31/49 on the "Get stronger" goal (28-dish database) once 10 starters
  and 5 desserts were added. **Desserts remain the thinnest category** (10 dishes covering 14
  dessert slots a week), so a few dessert repeats still show up across a full week even though
  every slot is filled by a real curated dish rather than falling through to the legacy pool or
  Gemini. **Add more desserts first** if the database keeps growing — mains, starters and
  breakfasts are all comfortably ahead of what a week needs.
- **A gluten allergy leaves 22 of 57 dishes.** Dairy and gluten are common across the set. Bias
  future additions toward naturally gluten- and dairy-free dishes.
- **32 of 57 dishes have `nutrition:'estimated'`** — Love & Lemons doesn't publish nutrition, so
  those kcal/protein figures were computed from the ingredients. Good approximations, not measured
  values. The other 16 are `'source'`. Surface the distinction if nutrition is ever shown as a hard
  number.
- **Photos are hotlinked** from the recipe sites' CDNs. The emoji fallback covers a single failure,
  but if a site adds hotlink protection they break together. Durable fix: copy them into the
  existing private `dish-photos` Supabase bucket and rewrite `photo`.
- **`sesame` is tracked in the data but not asked about.** `ALLERGY_OPTIONS` is
  `['Nuts','Dairy','Gluten','Shellfish','Soy']`; hummus/tahini carries `sesame`. Add the option when
  convenient — the data is already there.

### 0.6 How Lucille adds dishes by hand

1. Open `public/recipes-db.js`, copy a block, paste it into the right section.
2. Unique `id` starting with `db-`.
3. Quantities **per serving, metric**. `category` exactly one of
   `Produce` · `Meat & Fish` · `Dairy` · `Bakery` · `Frozen` · `Pantry`.
4. Fill in `contains` honestly — that is what protects an allergic user.
5. `node tools/build-recipe-md.js` to rebuild the catalogue.

No other file needs touching. Once §0.3 is done, a new dish appears in the planner and in browse
automatically. The full plain-English version of this is **`docs/HOW-TO-ADD-A-DISH.md`** — keep the
two in sync if the schema ever changes.

---

### 0.7 "Add a dish I love" — Gemini researches it INTO the database

The feature: the user types a dish they love (*"chicken tikka masala"*), pastes a recipe or a link,
or photographs a recipe card — and Gemini fills in every field the schema needs so it becomes a
permanent, browsable dish. **If it can't do that honestly, it says so and adds nothing.**

**This does not weaken the precedence rule — it strengthens it.** Gemini is a *researcher* filling
in a database row, not an author inventing a meal at plan time. Once a dish is saved it is an
ordinary database dish and is picked ahead of anything Gemini generates on the fly (§0.3 step 5).
Every dish the user adds this way makes the database bigger and Gemini's generate-time role smaller.

#### 0.7.1 Where a researched dish is stored — read this first

**A web page cannot write to `public/recipes-db.js`.** That file is shipped code on Render; the
browser has no filesystem access to it. So "add it to the database" happens on two levels, and
conflating them is the main way this feature gets built wrong:

| Level | Where it lives | Who sees it | When |
|---|---|---|---|
| **Per-user** | `user_dishes` table in Supabase (+ `localStorage` mirror for AI-off/offline) | just that user | immediately on save |
| **Shipped** | `public/recipes-db.js` | everyone, forever | only when Lucille promotes it (§0.7.5) |

The per-user level is what makes the feature real for users. The shipped level is how a genuinely
good dish graduates into the product. Build the per-user level first; §0.7.5 is a ten-minute
add-on once it works.

Add to `supabase/schema.sql` (same owner-only RLS pattern as the four existing tables — copy the
`do $$ ... $$` loop and add `'user_dishes'` to its array):

```sql
create table if not exists public.user_dishes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  dish        jsonb not null,          -- one object in the recipes-db.js shape
  source      text,                    -- 'name' | 'text' | 'url' | 'photo'
  verified    boolean not null default false,   -- user confirmed the allergens
  created_at  timestamptz not null default now()
);
create index if not exists user_dishes_user_idx on public.user_dishes (user_id, created_at desc);
```

#### 0.7.2 The three input modes

One entry point — an **"＋ Add a dish I love"** button on the `My Meal Plan` tab (§2), opening a
small overlay:

| Mode | User gives | What Gemini is asked to do |
|---|---|---|
| **Name** | *"chicken tikka masala"* | Research the classic dish and produce a standard version |
| **Text / link** | pasted recipe, or a URL | Extract and convert what's actually there — do not substitute |
| **Photo** | picture of a recipe card or cookbook page | Read the image and convert what's legible |

Photo mode needs a change to `server.js`: `callAIonce()` currently sends only
`contents:[{parts:[{text: prompt}]}]`. Accept an optional second part so vision works:

```js
async function callAIonce(prompt, model = MODEL, imageBase64 = null, mimeType = 'image/jpeg') {
  const parts = [{ text: prompt }];
  if (imageBase64) parts.push({ inlineData: { mimeType, data: imageBase64 } });
  // …unchanged: contents: [{ parts }], same generationConfig, same error handling
}
```
`callAI()` must thread the same two arguments through its `MODEL_CHAIN` loop. Cap uploads at
**4 MB** and downscale client-side before sending — a full-resolution phone photo will blow the
token budget and can trip the `finishReason !== 'STOP'` guard already in `callAIonce`.

#### 0.7.3 The endpoint and its prompt

New endpoint in `server.js`, next to the two existing ones and following their exact shape
(API-key guard → `readBody` → `callAI` → `sendJson`, `try/catch` returning `{error}`):

```js
if (req.method === 'POST' && req.url === '/research-dish') {
  if (!API_KEY) return sendJson(res, 500, { error: 'No API key configured on the server.' });
  try {
    const { mode, query, imageBase64, mimeType, profile } = await readBody(req);
    const out = await callAI(buildResearchPrompt({ mode, query, profile }), imageBase64, mimeType);
    return sendJson(res, 200, out);
  } catch (e) { console.error(e.message); return sendJson(res, 500, { error: e.message }); }
}
```

`buildResearchPrompt()` must demand **exactly the `recipes-db.js` shape** (§0.1) and enforce these
rules — they are the difference between a usable row and a corrupt one:

- **Quantities per single serving, metric** (`g` `ml` `tsp` `tbsp` `piece` `clove` `slice` `stalk`
  `pinch`). Never a whole-recipe amount — `scaleRecipe()` multiplies by household size afterwards.
- **`category` exactly one of** `Produce` `Meat & Fish` `Dairy` `Bakery` `Frozen` `Pantry`.
- **`contains` must list every allergen present**, from
  `gluten dairy nuts eggs soy shellfish fish sesame`. *"When unsure whether an ingredient carries an
  allergen, include it."* Over-listing costs a user one dish; under-listing can hurt them.
- **`time` = `prepTime` + `cookTime`, active only.** Chilling/marinating goes in `passiveTime`.
- **`nutrition:'estimated'`** unless a real source page was read, in which case `'source'`.
- **Never invent a `sourceUrl` or a `photo` URL.** Return `sourceUrl:null` rather than a guess —
  this is the same anti-hallucination rule §0.3 step 6 already relies on. The client then falls back
  to the existing `recipeSearchUrl(name)`.
- **Return `{"ok":false,"reason":"…"}`** if the request isn't a real dish, the image is unreadable,
  or the text isn't a recipe. A refusal is a correct answer; a fabricated dish is not.

#### 0.7.4 Validate before it ever reaches the pool — non-negotiable

Gemini's reply is **untrusted input**. A malformed dish doesn't just look wrong, it silently breaks
allergy filtering, the shopping list and the no-repeat rule. Write `validateDish(obj)` in `app.js`
and reject rather than repair:

☐ every required field present (`name` `type` `types` `time` `prepTime` `cookTime` `difficulty`
  `servings` `kcal` `protein` `nutrition` `tags` `contains` `ingredients` `steps`)
☐ `type` ∈ the five course words · `types` a non-empty array of them · `type` ∈ `types`
☐ `difficulty` an integer 1–4 · `kcal`, `protein`, `servings`, times all finite and ≥ 0
☐ `time === prepTime + cookTime`
☐ `ingredients` non-empty; **every** row has a valid `category` **and** a valid `unit` and a
  positive numeric `qty`
☐ `contains` an array drawn only from the eight allergen words
☐ `steps` non-empty
☐ `id` **assigned by us**, never by Gemini: `` `user-${crypto.randomUUID()}` ``. Not `db-` —
  `isCurated()` (§0.3 step 2) must still mean *shipped and reviewed*, and `user-` keeps
  `state.favorites`' `fav` prefix unambiguous too.

Anything failing → show the user the failure, save nothing. **Never half-save a dish.**

Then, because allergens are safety-critical and this data came from a model, **show the parsed dish
back to the user before saving** — photo, times, and the `contains` list rendered as plain words
("Contains: gluten, dairy") with an *"Add anything missing"* control. Saving sets `verified:true`.
Until the user confirms, the dish must not enter meal generation. Surface it in the UI as
*"Added by you — nutrition is an estimate"*, and never let a `verified:false` dish be picked for
someone with allergies set.

#### 0.7.5 Promoting a good dish into the shipped database

On any user-added dish, a **"Copy as database entry"** action that puts a ready-to-paste
`recipes-db.js` block on the clipboard — the §0.1 shape, `id` rewritten to the next free `db-…`,
quantities untouched. Lucille pastes it into the right section of `public/recipes-db.js`, adds any
new ingredient to `public/ingredient-prices.js` (§0.4), and runs both generators:

```
node tools/build-recipe-md.js
node tools/build-prices-md.js
```

That is the only path by which a dish reaches every user — and it keeps a human in the loop before
model-written data ships to everyone.

#### 0.7.6 Failure messages — say which thing went wrong

The user's requirement is that the app tells them when it can't. Distinguish the causes, because
the fix differs and a generic "something went wrong" teaches them nothing:

| Cause | Message |
|---|---|
| `{"ok":false}` — not a real dish / unreadable photo | *"I couldn't find a reliable recipe for that. Try a more specific name, or paste the recipe text."* |
| `validateDish()` rejected | *"I found it but couldn't get the details right. Nothing was saved."* |
| Gemini 503 / all models failed | *"The recipe service is busy. Try again in a minute."* (`MODEL_CHAIN` already retries — this is genuinely Google, not us.) |
| Daily quota spent | *"You've used today's recipe lookups. You can still add a dish by hand."* → link `docs/HOW-TO-ADD-A-DISH.md` |
| AI turned off | *"Turn on AI generation to research dishes automatically, or add one by hand."* |
| Offline | *"You're offline — this needs a connection."* |

**Quota is a real constraint: the free tier is 20 requests/day**, shared with week generation and
the §0.3 step-10 top-up. So: one call per add (no automatic retries beyond `MODEL_CHAIN`'s own),
show the user a remaining-today count, and **check the name against the existing pool first** — if
`RECIPES_DB` already has a close name match, offer that dish instead of spending a call.

#### 0.7.7 Wiring it into the pool

User dishes join the pool in **exactly one place** — extend the `DB` constant from §0.3 step 2 so
every downstream consumer (generation, browse carousels, `findBrowseRecipe`, filters) picks them up
with no further changes:

```js
const DB = [
  ...(typeof RECIPES_DB !== 'undefined' ? RECIPES_DB : []),
  ...(state.userDishes || []).filter(d => d.verified),   // user-researched, confirmed
];
```
`state.userDishes` loads from Supabase on sign-in and from `localStorage` otherwise, and syncs
through the existing `profiles.state` blob mechanism. The `eligibleRecipes()` **name** dedupe from
§0.3 step 4 keeps the same dish arriving twice out of the pool, and `pickMeal()`'s used-names set
is what enforces the no-repeat rule itself.

**Ordering, stated once and plainly:** a week is filled from `RECIPES_DB` and verified user dishes
first; only slots that genuinely cannot be filled fall through to Gemini (§0.3 step 10). Adding
dishes here shrinks that fall-through. Gemini never proposes a dish that the database could have
filled.

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
- ~~Wood is flat colour (no fake wood-grain images/textures).~~ **SUPERSEDED 2026-07-21 by
  Lucille.** She saw the flat version and asked for *actual wood*, sending a walnut sample.
  The masthead and footer now carry a **real grain texture** over `--wood-plank` (`#6B4228`).
  It is a **generated inline SVG** (`--wood-grain` in `styles.css`), not a photograph — ~640
  bytes, no network request, works offline in the PWA, and can never 404 or hit hotlink
  protection, which is what the original "no images" instinct was actually protecting against.
  Grain runs **horizontally** on wide bands: vertical grain on a short wide element reads as
  brushed fabric rather than timber (both were tested). Contrast is safe by construction —
  the filter paints only *dark* grain, so the base colour is the lightest possible pixel
  (white on it 8.62:1). **Do not "fix" this back to flat.**
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

**Add one more carousel when §0.7 is built:** `Your own dishes` — the user's researched/added
dishes, shown directly beneath `Your favourites ♥`. Skip it when empty. Its empty state is where
the **"＋ Add a dish I love"** entry point lives, so the feature is discoverable from browse as well
as from the planner.

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

One phase per session (§00.3). The model column repeats §00.1 so you don't have to scroll back.

| # | Phase | Model | Notes |
|---|---|---|---|
| **0** | **Dish database (§0)** — all 11 steps of §0.3 **+ the price wiring in §0.4** | Sonnet | **DO THIS FIRST.** §3 and §4 are built on this data; doing it later means building them twice. Run the §0.2 regression table before moving on. |
| **1** | Palette swap (§1) | Sonnet | Every screen re-tinted, nothing tomato-coloured remains. Re-check AA contrast. |
| **2** | Card component (§3) | Sonnet | Image-on-top, used everywhere. Reads `prepTime`/`cookTime`/`difficulty` from §0's data; `passiveTime` shown separately. |
| **3** | One-page planner + tabs + sidebar (§2) | **🔶 Opus** | Delete the old shopping screen + step bar. Sidebar €/day comes from §0.4 when AI is off. **The highest-risk phase — see §00.1.** |
| **4** | Categories + dessert/starter sections (§4) | Sonnet | `Sweet endings` and `Small plates to start` both now have enough dishes (§0.5). |
| **5** | Filter row (§4) | Sonnet | `Dietary ▾` reads `tags`; allergies read `contains` (§0.3 step 3) and are never filterable away. |
| **6** | Shopping tab + total at bottom (§5) | Sonnet | Gemini `estimatedTotal` as headline, §0.4 estimate as the AI-off fallback. |
| **7** | **"Add a dish I love" (§0.7)** | **🔶 Opus** | Order within the phase: schema + storage (§0.7.1) → `/research-dish` (§0.7.3) → `validateDish()` + confirm-allergens (§0.7.4) → pool wiring (§0.7.7) → `Your own dishes` carousel (§4) → failure messages (§0.7.6) → "Copy as database entry" (§0.7.5). Last of the feature work because it needs the card, the one-page planner and the carousels already in place — and because it's the only part of V3 that puts model-written data beside reviewed data. **Ship name/text modes before photo mode**; vision needs the `callAIonce()` change and is the easiest piece to defer. |
| **8** | Copy pass (§6) | Sonnet | |
| **9** | **Final verification (§9)** | **🔶 Opus** | Whole-system pass. Then show Lucille → deploy **only on her word**. |

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
  Benchmark: at 57 dishes, both a main-only week and a full 3-course week fill **every slot**
  from the database on an unrestricted profile (§0.5).
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
  (`pickMeal()`'s used-names set is what protects this; §0.3 step 4's name dedupe backs it up).
  Check the favourite is still *preferred* too — it must keep its `fav` id and its `sourceId`.
☐ Gemini is only called to *top up* what the database can't fill, never to author a week from
  scratch — and the top-up reuses `requestSwapAI`, adding **no endpoint of its own** and ≤5 calls
  per week. (§0.7's `/research-dish` is the one genuinely new endpoint in V3.)
☐ `state.partialAI` and the honest repeat notice both still fire and are still visible.

**§0.7 — "Add a dish I love"**

☐ All three input modes work: a **dish name**, **pasted recipe text or a URL**, and a **photo** of
  a recipe card. (Name and text may ship first; photo may land after — see §7 step 7.)
☐ A researched dish arrives in the **exact `recipes-db.js` shape**: per-serving metric quantities,
  a valid `category` and `unit` on every ingredient, `time === prepTime + cookTime`.
☐ **`validateDish()` rejects rather than repairs.** Feed it a deliberately broken response (bad
  `category`, missing `contains`, `time` that doesn't add up) → nothing is saved and the user is
  told. **Never a half-saved dish.**
☐ **The user confirms the allergen list before the dish is saved**, and a `verified:false` dish
  never enters meal generation. This is the safety-critical one — test it explicitly with a profile
  that has allergies set.
☐ **Gemini never invents a `sourceUrl` or `photo`** — with no real source it returns `null` and the
  app falls back to `recipeSearchUrl(name)` and the emoji tile.
☐ **Failure is specific, never generic.** Each row of §0.7.6 produces its own message: unresearchable
  dish, validation failure, 503, quota spent, AI off, offline.
☐ **The saved dish behaves like any other database dish** — browsable in `Your own dishes`, opens
  its detail overlay, respects filters and allergies, obeys the no-repeat rule, and is picked
  **ahead of** anything Gemini generates at plan time.
☐ It **survives sign-out → sign-in** (Supabase `user_dishes`) and still exists offline
  (`localStorage` mirror), with no duplicate appearing when both sources load.
☐ **"Copy as database entry"** puts a paste-ready `recipes-db.js` block on the clipboard, with a
  fresh `db-…` id — and pasting it in + running both generators actually works.
☐ Quota is respected: **one call per add**, a remaining-today count is visible, and an existing
  close name match in the pool is offered instead of spending a call.

---

## 9. Final verification pass — 🔶 Opus, whole system

Run this **after every other phase is committed**, in a fresh session, with **AI OFF** unless a
check says otherwise. This is a different job from building any single phase: nobody has yet looked
at all of V3 at once, and the failures that matter now are the ones that live *between* phases.

**Read before starting:** `CLAUDE.md`, then §00, §0.2 and §8 of this file.

### 9.1 Automated — run these first, they're free and catch the dumb things

```bash
cd "~/Work/claude/Projects/Meal plan Lucille"

# 1. Everything parses.
for f in public/app.js public/recipes-db.js public/ingredient-prices.js server.js; do
  node --check "$f" && echo "OK  $f"
done

# 2. The data still passes its own invariants (57 dishes, no bad category/unit, time adds up).
node -e '
const {RECIPES_DB}=require("./public/recipes-db.js");
const {INGREDIENT_PRICES,estimateIngredientPrice}=require("./public/ingredient-prices.js");
const CATS=["Produce","Meat & Fish","Dairy","Bakery","Frozen","Pantry"];
const UNITS=["g","ml","tsp","tbsp","piece","clove","slice","stalk","pinch"];
let e=0; const ids=new Set();
RECIPES_DB.forEach(r=>{
  if(ids.has(r.id)){console.log("DUP ID",r.id);e++;} ids.add(r.id);
  if(r.time!==r.prepTime+r.cookTime){console.log("TIME",r.id);e++;}
  if(!r.types.includes(r.type)){console.log("TYPE",r.id);e++;}
  r.ingredients.forEach(i=>{
    if(!CATS.includes(i.category)){console.log("CAT",r.id,i.name);e++;}
    if(!UNITS.includes(i.unit)){console.log("UNIT",r.id,i.name);e++;}
    if(!INGREDIENT_PRICES[i.name.toLowerCase()]){console.log("UNPRICED",i.name);e++;}
    else if(estimateIngredientPrice(i)===0){console.log("ZERO-PRICE",r.id,i.name);e++;}
  });
});
console.log(RECIPES_DB.length+" dishes, "+e+" errors");'

# 3. Generated docs are in sync with their sources.
#    (Don't use `git diff docs/` for this — it also shows every other uncommitted change.
#     Hash, regenerate, compare: only a change *caused by regenerating* means they were stale.)
before=$(md5 -q docs/RECIPE-DATABASE.md)$(md5 -q docs/INGREDIENT-PRICES.md)
node tools/build-recipe-md.js >/dev/null && node tools/build-prices-md.js >/dev/null
after=$(md5 -q docs/RECIPE-DATABASE.md)$(md5 -q docs/INGREDIENT-PRICES.md)
[ "$before" = "$after" ] && echo "✓ docs in sync" || echo "✗ docs were stale — now regenerated, commit them"

# 4. The secret never got committed.
git log --all --oneline -- gemini-key.txt        # must be empty
grep -rn "AIza" public/ server.js || echo "no API key in shipped files"
```

### 9.2 By hand, in the browser — AI OFF

Work down §8 in full. These are the cross-phase ones §8 can't express, and the ones most likely to
be broken by a *later* phase than the one that introduced them:

☐ **Generate 5 weeks in a row** on an unrestricted profile. Every one: 0 duplicate dish names, every
  slot filled from the database, no `/generate-*` call in the Network tab.
☐ **Then set 2 allergies + 2 dislikes** and generate 5 more. Nothing forbidden appears; if the pool
  genuinely can't fill a slot the honest repeat notice shows rather than a silent duplicate.
☐ **Tick Gluten** → bruschetta, tiramisu, spaghetti bolognese all gone. **Tick Soy** → teriyaki
  salmon, Thai red curry, sriracha chicken all gone. *(This is the check that proves `contains[]`
  beat the old regex — §0.2's most important row.)*
☐ **Prices with AI OFF**: €/day pill, per-day € chips and the bottom total all show real numbers.
  A week lands around **€4.80/day (mains only)** to **€8.85/day (3 courses)** per person — wildly
  outside that range means §0.4 is mis-wired.
☐ **Full pantry ticked**: `Red bell pepper`, `Spring onions`, `Rice wine`, `Large flour tortilla`
  all still on the list; `Olive oil` and `Garlic` correctly hidden.
☐ **Favourite a database dish → re-plan → still 0 duplicates**, and the dish appears in the pool
  **once** (§0.3 step 4's name dedupe), still counting as curated via its `sourceId`.
☐ **Every surface at 375px and 1280px.** No horizontal scroll at 375px. Zero console errors on any
  screen, including after opening/closing every overlay.
☐ **Cook mode + read-aloud** on a database dish, start to finish.
☐ **`.ics` export** → open the file, confirm 14 valid events and that recipe links are the real
  `sourceUrl`, not a Google search, for dishes that have one.
☐ **PWA**: `CACHE` bumped in `sw.js`, `recipes-db.js` **and** `ingredient-prices.js` both in `SHELL`,
  installs cleanly, and an offline reload still boots. *(Miss either file and offline users get a
  hard `is not defined` crash — the single most likely shipping bug in V3.)*
☐ **Questionnaire still asked once**; "Save changes" edits without regenerating.
☐ **Sign out → sign in**: week, favourites and any §0.7 user dishes all survive.

### 9.3 One AI-ON run — exactly one

Only after everything above is green, and budget for it: the free tier is **20 requests/day**.

☐ Tick "Use real AI generation", plan **one** week. Confirm the database still filled the slots it
  could and Gemini was only reached for genuine gaps (§0.3 step 10) — **not** asked to author the
  week. Check the Network tab for the actual call count; ≤5 top-up calls.
☐ Shopping total comes from Gemini's `estimatedTotal` and is labelled *"Estimated — varies by shop."*
☐ If §0.7 shipped: add one dish by name and one by pasted text. Confirm the allergen-confirm step
  appears, the dish saves, and it then behaves like any other database dish.

### 9.4 Write the session up

Before handing back, update `CLAUDE.md`: what shipped, what's verified vs. unverified, anything
deliberately deferred, and any new known gap. That file is the next session's only memory — a
green build with a stale `CLAUDE.md` costs the next person an hour of rediscovery.

**Then show Lucille. Deploy only on her word** — she pushes via GitHub Desktop.
