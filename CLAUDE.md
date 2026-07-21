# Meal Planner — Project Memory (CLAUDE.md)

_Last updated: 2026-07-20. This file is auto-loaded by Claude Code every session._

> **FOLDER STRUCTURE (tidied 2026-07-20).** Root holds only what must run or deploy from
> there; everything reference-only lives in `docs/`.
> ```
> Meal plan Lucille/
> ├── CLAUDE.md          ← this file (must stay at root — auto-loaded)
> ├── README.md          ← plain-English "what is this / how do I run it"
> ├── server.js          ← backend. MUST stay at root (package.json + render.yaml run it)
> ├── package.json       ← "start": node server.js
> ├── render.yaml        ← Render deploy blueprint
> ├── .gitignore
> ├── gemini-key.txt     ← 🔑 SECRET, git-ignored, NEVER delete/commit. server.js reads it
> │                        from the project root (__dirname). Irreplaceable if lost.
> ├── Open Live Website.webloc   ← one-click shortcut to the live Render site
> ├── public/            ← THE APP (served statically by server.js)
> │   ├── index.html  app.js  styles.css  app-screens.css
> │   ├── config.js   ← Supabase URL + publishable key (public-safe by design)
> │   ├── cloud.js    ← Supabase client
> │   ├── manifest.json  sw.js  icons/   ← PWA (Phase 9)
> ├── supabase/schema.sql        ← tables + RLS + storage bucket
> └── docs/              ← reference only, nothing here is served or executed
>     ├── DESIGN-BRIEF.md  OPUS-BUILD-BRIEF.md  ← the two authoritative briefs
>     ├── RESEARCH.md  STORM-RESEARCH.md        ← background research
>     ├── SUPABASE-SETUP.md                     ← Lucille's setup steps
>     └── design/        ← the 9 screen mockups + tokens.css (visual source of truth)
> ```
> **Do not move** `server.js`, `public/`, `package.json`, `render.yaml`, `gemini-key.txt`, or
> `CLAUDE.md` — each is load-bearing at the root.

---

# ⭐ WHERE THINGS STAND (2026-07-20) — read this first

**Product is now called `#Foodie`** (renamed from "Table" everywhere user-facing; the historical
session blocks below still say Table). The `_template:'table'` string in `app.js` is a FormSubmit
leftover parameter, not the brand — leave it.

**Code:** V2 (Phases 1–10a) is **DEPLOYED AND LIVE** as of 2026-07-20. Lucille pushed `main` via
GitHub Desktop and Render auto-deployed.
**Live: https://meal-planner-km6f.onrender.com — verified serving `#Foodie`,** all assets 200 over
HTTPS, and the Gemini key confirmed absent from every served file.
Push future changes the same way: **GitHub Desktop → Push origin** (there are no git credentials in
this CLI, so Claude cannot push). Working tree clean; `main` and `v2-rebuild` hold the same content.

### Accounts & tooling
| Thing | State |
|---|---|
| **Supabase** | LIVE. Schema run, magic-link sign-in verified. Project ref `ckhqnqoazgmqxzzzacfl` |
| **Resend** | Account created (`llucillespam@gmail.com`), API key generated |
| **Google Cloud** | Project "meal planner" created. Calendar API + OAuth consent + credentials **NOT** done |
| **Rust** | Installed (1.97.1). Needs a fresh Terminal window for PATH. Ready for Phase 11 |
| **GitHub** | `lucille12345/Meal-plan-Lucille` — push via GitHub Desktop only |

### Edge Functions — written, NOT yet deployed by Lucille
- `supabase/functions/send-reminders/index.ts` — daily shopping reminder e-mail.
  Secrets: `RESEND_API_KEY`, optional `TEST_EMAIL_TO` (overrides recipient).
  Needs **pg_net installed** before Cron can call an Edge Function. The Supabase schedule box is
  **GMT**; Paris is GMT+2 in summer, so `0 16 * * *` = 6 pm Paris.
- `supabase/functions/send-feedback/index.ts` — powers the in-app feedback form.
  **`app.js` already points at this URL**, so feedback fails until it is deployed.

⚠️ **Resend free tier, no verified domain → only delivers to `llucillespam@gmail.com`.** The first
reminder test returned `{"sent":false,"status":403,"items":2}` for exactly this reason — the logic
worked, the recipient was rejected. Use `TEST_EMAIL_TO`, or log into #Foodie with that gmail.

**FormSubmit was abandoned** — its one-time activation e-mail never arrived (tried the AJAX endpoint
and a classic POST over http). Replaced by `send-feedback`. Don't reintroduce it.

### Verified vs unverified
- **✅ FULL VERIFICATION PASS RUN 2026-07-20 (AI OFF) — all green.** Re-run this before any release:
  | Area | Result |
  |---|---|
  | Repo/build | clean tree, all JS+JSON parse, every required file present |
  | Security | key loads server-side but is in **no** served file; `../gemini-key.txt` → 404; no Resend key in code |
  | Shell | title+header `#Foodie`, manifest valid, SW active, boots to landing (auth gate intact), no FormSubmit left |
  | Questionnaire | 8 steps; first-timer = "Plan my first week 🎉" (no Save btn); returning = "Save changes" + "Save & re-plan week 🔄" |
  | Generation | 40 dishes, **0 duplicates**, correct 3-course shape, targets 2370 kcal / 128 g / 590-950-830 |
  | Planner | 7-day rail, swap works, **drag-and-drop works**, 48 browse cards |
  | Shopping | 76 items, per-day chips, .ics (14 valid events), feedback link, "🔄 Re-plan this week" |
  | Recipes | 7 cards, 7 real links, photos, cook mode + read-aloud |
  | Other | persistence, 375px single-col no h-scroll, 1280px two-col, **zero console errors, zero `/generate-*` calls** |
- **Two false alarms worth remembering:** a `pantryHidden: 0` reading was legitimate (that week simply
  contained no pantry item — `pantryHas()` unit-tests correctly); and a `viewport: 0` reading was a
  browser-pane glitch from toggling sizes, not a layout bug. Re-test in a fresh pane before chasing either.
- **✅ AI-ON PATH TESTED & FIXED (2026-07-20).** Real Gemini response verified end-to-end: 7 days,
  49 dishes, **zero duplicates**, correct starter/main/dessert shape, breakfast flat, no invented
  URLs, nut allergy + mushroom dislike respected. Client parse → 49 meal cards, shopping 83 items /
  €107.30 with real prices, 2 pantry items hidden, 7 recipe links, 14 calendar events, no console errors.
  Three real bugs were found and fixed:
  1. **Model availability is unreliable on the free tier.** `gemini-flash-latest` returned **503
     "high demand"** for minutes; `gemini-2.5-flash` is **retired (404)**; `gemini-2.0-flash` has
     **no free quota (429)**. `server.js` now has a **`MODEL_CHAIN`** that falls through
     (`MODEL` env → `gemini-flash-latest` → **`gemini-flash-lite-latest`** ← verified working →
     `gemini-2.0-flash-lite`), with 1.5 s backoff and no retry on non-retryable errors.
     **If AI ever "stops working", check for 503 first — it's usually Google, not our code.**
  2. **The lite model returned a valid but 1-day week.** The prompt now states the 7-day rule up
     front, names all seven days, and says a short week is invalid.
  3. **Safety net:** `requestWeekAI()` tops a short week up from the built-in pool, sets
     `state.partialAI`, and the planner explains it — never a broken 1-day plan.
- Gemini free tier = **20 requests/day** — don't burn it on casual testing. To re-test the client
  parser without spending quota, save a real response and stub `fetch` for `/generate-week`.

### Offline recipe pool (the AI-OFF fallback)
12 breakfasts · 10 lunches · 11 dinners · 22 starters · 22 desserts.
A 288-profile stress test drove the no-repeat work: **0 duplicates for normal profiles**, but a
heavily-restricted profile (2 allergies + 2 dislikes) genuinely cannot fill 7 unique breakfasts —
`enforceNoRepeat()` records what it couldn't fix and the planner shows an honest notice naming the
repeated dishes and pointing at AI generation. Don't "fix" that notice by hiding it.

### NEXT STEPS, in order
1. ~~Push + deploy v2~~ ✅ **DONE 2026-07-20 — live and verified.**
2. **Lucille:** deploy both Edge Functions, add the `RESEND_API_KEY` secret, install pg_net, create
   the cron job. **Until `send-feedback` is deployed the in-app feedback form fails** (the live app
   already points at that URL).
3. ~~AI-ON test~~ ✅ **DONE 2026-07-20** — tested, three bugs found and fixed (see above). Deploy the fix by pushing.
4. **▶️ V3 REDESIGN → `docs/V3-REDESIGN-BRIEF.md` — IN PROGRESS.** Phases 0, 1, 2 done (below);
   **next up is phase 3 (one-page planner) — switch to Opus, thinking high, for this one.**
   - **Start each phase at the brief's `§00. How to run this build`.** It holds the per-phase model
     plan, session hygiene, and the stop-don't-guess rules. **`§7` is the order to build in — the
     section numbering is historical, do not work top-to-bottom.**
   - **10 phases, one per session.** Phases 0,1,2,4,5,6,8 → **Sonnet**. Phases **3 (one-page
     planner)**, **7 (§0.7)** and **9 (final verification)** → **Opus, thinking high**.
   - **No line numbers anywhere in the brief — every reference is a `grep` anchor.**
   - `§9` is a full final verification pass with copy-pasteable check scripts; `§8` is the
     acceptance checklist.
   - **⚠️ Note on git state (2026-07-21):** a commit titled "publish" appeared on `main`, authored
     by Lucille, that already contained most of phase 2's in-progress work (the `app-screens.css`
     side of the card-component refactor) before it was reviewed or committed as such. Nothing was
     lost or broken by this — the remaining small fix (a class-name collision) was committed
     normally right after — but it means **phase 2's changes are split across the "publish" commit
     and the phase-2 commit that follows it**, not cleanly in one place. Worth knowing if `git
     blame`/`git log` looks confusing for `app-screens.css` around this date.
   - **✅ PHASE 0 DONE + VERIFIED (2026-07-20, Sonnet).** All 11 steps of §0.3 + the §0.4 price
     wiring, committed. What changed in `public/app.js`/`index.html`/`sw.js` (`CACHE` bumped to
     `foodie-shell-v4`): `recipes-db.js` + `ingredient-prices.js` now load; `eligibleRecipes()` /
     `pickMeal()` / `enforceNoRepeat()` prefer curated (`db-`) dishes via a `preferCurated()` helper,
     with the pool deduped by `id` so a favourited curated dish can't double-count;
     `passesDietFilters()` now trusts a dish's `contains[]` over the old regex; `recipeUrl()` /
     `dishImageUrl()` use a dish's real `sourceUrl`/`photo` when present; `priceOf()` falls back to
     `estimateIngredientPrice()` so prices work with AI off; **`pantryHas()` rewritten** with an
     explicit `PANTRY_FALSE_MATCHES` exclusion map (whole-word tokenizing alone does **not** fix
     this — "pepper" is genuinely one of the words in "bell pepper" — so the fix names the specific
     compounds it must not match: `bell pepper`/`pepper flakes`/`jalapeño pepper` for "Pepper",
     `rice wine`/`rice noodle`/`rice paper` for "Rice", `spring onion`/`onion powder` for "Onion",
     `flour tortilla` for "Flour", `garlic powder` for "Garlic"); `planWeek()` now always builds
     from the database first and only calls the existing `requestSwapAI()` to top up genuine gaps
     (capped at 5/week) — **no new endpoint**; the AI checkbox is relabelled *"Let AI fill any
     gaps"* and its related notices reworded to stay honest about what actually happened.
     **Verified live in-browser (AI off):** 57 dishes load; a relaxed profile fills **35/35** slots
     from the database with 0 duplicate names; Gluten and Soy allergy tests both leaked zero
     forbidden dishes; all 4 previously-broken pantry cases now correct *and* the 5 correct-hide
     cases still hide; a curated dish showed its real €-price/link/photo with AI off;
     `findBrowseRecipe` + the browse carousels include curated dishes; zero console errors, zero
     `/generate-*` calls.
   - **🟡 Correction to the earlier "21/21" and "49/49" coverage claims below: those numbers ignored
     the pre-existing difficulty/time filter.** Once verified live against a **realistic** profile
     (cooking confidence 5, 30 min/meal), a "Stay balanced" week (starter+main, 35 slots) filled
     only **18/35** from the database — the other 17 fell to the legacy pool because several curated
     dishes exceed 30 minutes (e.g. Homemade granola 40 min, Breakfast burritos 50 min, Breakfast
     potatoes 45 min all get filtered out for that profile). This is the **existing** filter working
     correctly, not a wiring bug — but the earlier simulation never modelled it, so treat "21/21" /
     "49/49" as an unrestricted **upper bound**, not what most real users will see. Faster/lower-
     difficulty dishes are worth prioritizing in future additions alongside the dessert/starter gap.
   - **✅ PHASE 1 DONE + VERIFIED (2026-07-20/21, Sonnet).** Palette swap (§1). Overwrote the
     `styles.css` token block with the new wood/green/gold table, keeping every **old token name**
     (`--tomato`, `--honey`, `--basil-deep/-wash`, `--blush`, etc.) as an **alias** onto the new
     equivalents instead of renaming ~130 call sites across `app-screens.css` — every screen
     re-tints automatically. Then swept hardcoded hex the alias alone couldn't reach: 6 button/logo/
     quote-mark glow shadows hardcoded to tomato's literal RGB; the pink favourite-heart (now gold,
     matching "♥ active = gold spark"); the honey/peach meal-thumbnail gradients (now wood- and
     green-toned); two peachy notice/banner borders (now a translucent gold hairline); the footer
     rebuilt on `--wood-deep` with white text and a gold hairline divider per the brief's explicit
     rule. **Tightened `--gold-deep`** from `#8A6B12` to `#7C5F10` after measuring contrast:
     the original cleared AA on `--paper` (4.69) but fell short on `--gold-wash` (4.36, where
     notice/badge text actually sits) — the new value clears both (5.61 / 5.22). **Verified live:**
     landing/questionnaire/a full generated week all re-tinted correctly at 1280px + 375px, zero
     tomato/honey hex remaining outside Google's own sign-in-button colors and one intentional
     `--reject` semantic, zero console errors, zero horizontal scroll at 375px.
   - **✅ PHASE 2 DONE + VERIFIED (2026-07-21, Sonnet).** Card component (§3). Found the app had
     **two different card renderers** — `mealCard()` (a horizontal thumbnail-row, literally
     Lucille's "images should be next to the meal, not on the side" complaint — and its `.thumb`
     never even called `dishImageUrl()`, just showed an emoji) and `browseCard()` (already
     photo-on-top). Unified both into one `recipeCardHtml(r, opts)`, matching the brief's exact
     anatomy: photo on top (background `--green-wash`), ♥ top-right white pill, a caller-supplied
     corner button bottom-right (⊕ add in `--basil` for browse, ✕ swap for the plan list),
     Fraunces title (2-line clamp), desc, then **Prep/Cook/Difficulty as three labelled stats**
     (`diffDots()` — 4 dots, never the word), `passiveTime` shown separately ("+ 8h chilling",
     never folded into the headline time), and **`priceLabel()`** — €/serving in `--gold-deep`,
     only when a real or estimated price exists. Deleted the now-dead `.meal`/`.thumb`/`.side-btns`/
     `.swap-btn`/`.fav-btn` CSS (mealCard no longer emits that markup) and one duplicate
     `.recipe-card .photo .emoji-fill.big` rule that would have silently overridden the new
     green-wash version (app-screens.css loads after styles.css). **Real bug caught mid-build:** my
     new `.stat` class collided with the landing page's pre-existing `.stat` (marketing stat-band —
     "~2h saved", "−23% less spent"), which has its own padding/border/background — every
     Prep/Cook/Difficulty stat was rendering as a bordered 30px-padded box instead of a plain
     column. Fixed by renaming to `.card-stat`. **Verified live:** both the plan-list and browse-
     carousel cards render the full anatomy correctly with real curated photos/prices, zero console
     errors, zero horizontal scroll at 375px.
5. **Phase 11:** Tauri desktop wrapper over `/public` → `.dmg`/`.exe` via GitHub Releases.
6. **🟡 CURATED RECIPE DATABASE — DATA BUILT, WIRING NOT DONE (2026-07-20, grown same day).**
   - **Built:** `public/recipes-db.js` (`RECIPES_DB`, **57 real dishes** — 9 breakfasts, 16 starters,
     22 mains, 10 desserts; grown from an initial 28), `docs/RECIPE-DATABASE.md` (generated
     catalogue), and `tools/build-recipe-md.js` (regenerates the .md from the .js — **the .js is
     the only source of truth; never hand-edit the .md**). Every link, photo, kcal and protein
     figure was read from the recipe sites' schema.org data; all 57 links + 57 photos verified
     HTTP 200. Sources: Love & Lemons, Cookie and Kate, Budget Bytes.
   - **NOT done: the app doesn't use it yet.** Nothing in `app.js`/`index.html`/`sw.js` was changed,
     so there is zero regression risk from the data landing. The full step-by-step wiring is
     **`docs/V3-REDESIGN-BRIEF.md` §0** (11 steps + a price table) and it is now **step 0 of the
     V3 build order** (§3 and §4 depend on it).
   - **Allergy bug found and fixed in the data:** `passesDietFilters()` guesses allergens by regex
     over ingredient names, and that regex misses `Baguette`, `Spaghetti`, `Savoiardi ladyfingers`
     (gluten) and every `Soy sauce` — several dishes would have been served to someone who ticked
     that allergy. Every dish carries an explicit `contains:[…]` array, and §0.3 step 3 makes it
     win over the regex. **Verified:** ticking Gluten correctly drops bruschetta, tiramisu and
     bolognese; ticking Soy drops teriyaki salmon, Thai curry and sriracha chicken.
   - **Measured coverage** (simulating the §0.3 step-5 picker against the real data, now at 57
     dishes): a main-only week fills **all 21 of 21** slots from the database; a 3-course "Get
     stronger" week now fills **all 49 of 49** slots (up from 31/49 at the original 28-dish size) —
     a few dessert repeats still occur across a week since 10 desserts must stretch across 14
     dessert slots, but every slot is filled by a real curated dish. **Desserts are still the
     thinnest category** — add more there first if continuing to grow the database.
   - **🟡 The one real conflict — prices. Data built, not yet wired.** Per-ingredient prices come
     **only from Gemini** today. Making the database primary would blank the shopping total, the
     €/day budget pill, the per-day € chips and §4's "Budget-friendly dinners" — a regression
     against verified-working behaviour. **Built:** `public/ingredient-prices.js`
     (`INGREDIENT_PRICES` + `estimateIngredientPrice()`, all **172** distinct ingredients used by
     `recipes-db.js` priced — French supermarket, mid-range own-brand, 2026), plus
     `docs/INGREDIENT-PRICES.md` and `tools/build-prices-md.js` (same generated-doc pattern as the
     recipe database — never hand-edit the .md). Verified: 0 unpriced ingredients across all 57
     dishes, 0 priced-but-returning-€0 (a real unit-mismatch bug — several piece-priced vegetables
     had been given gram quantities — was caught this way and fixed). **Not yet wired:** §0.4 has
     the one-line `priceOf()` change (AI price wins when present, this table is the fallback) —
     that's steps 1a/1b of §0.3, still to be done in `app.js`.
   - **🔴 Pre-existing shopping bug found (not caused by the database, but it makes it constant):**
     `pantryHas()` substring-matches both directions, so a ticked pantry `Pepper` hides
     **`Red bell pepper`**, `Rice` hides **`Rice wine`**, `Onion` hides **`Spring onions`** and
     `Flour` hides **`Large flour tortilla`**. With a full pantry, dozens of ingredients you must
     actually buy vanish from the shopping list. Fix is §0.3 step 8 (whole-word matching).
   - **Don't build a `/generate-dishes` endpoint** — `requestSwapAI(profile, role, avoidNames)` →
     `/generate-meal` already exists and is exactly the top-up primitive needed.
   - **`docs/HOW-TO-ADD-A-DISH.md`** is a plain-English, no-coding-required guide for Lucille to add
     her own dishes directly to `recipes-db.js` — copy-paste template, a worked example, and every
     fixed-value list spelled out (course types, the 1–4 difficulty scale vs. the emoji field,
     nutrition/tag/allergen/category/unit values, `buyDayBefore`). Keep it in sync if the schema
     in `recipes-db.js`'s header comment ever changes.
   - **🔵 SPEC'D, NOT BUILT — "Add a dish I love" (`V3-REDESIGN-BRIEF.md` §0.7).** User types a dish
     name, pastes a recipe/URL, or photographs a recipe card → Gemini researches it into a full
     database row; if it can't do that honestly it refuses and saves nothing. Key decisions already
     made, don't re-litigate them: **(1)** a browser can't write to `public/recipes-db.js`, so saved
     dishes live in a new Supabase `user_dishes` table + `localStorage` mirror, and a
     "Copy as database entry" button is how a good one gets promoted into the shipped file by hand.
     **(2)** Gemini's reply is untrusted — `validateDish()` rejects rather than repairs, and the
     **user must confirm the allergen list** before the dish is saved (`verified:true`); a
     `verified:false` dish never enters generation. This is the most safety-critical thing in V3.
     **(3)** Photo mode needs `callAIonce()` in `server.js` extended with an `inlineData` part.
     **(4)** New `/research-dish` endpoint — this one IS new, unlike the §0.3 step-10 top-up which
     must reuse `requestSwapAI`. **(5)** Quota: one call per add against the 20/day free tier, and
     check the existing pool for a close name match before spending a call.

> **DESIGN SESSION — DONE (2026-07-19).** The `docs/DESIGN-BRIEF.md` "Table" design session is
> complete. A new **`docs/design/`** folder now exists in the repo with every deliverable from the
> brief §0, all self-contained (link `tokens.css`; system/Google fonts + Unsplash CDN images
> only; no build step). Contents:
> - `docs/design/tokens.css` — **the visual source of truth.** All colors, Fraunces/Inter type,
>   radii, warm shadows, spacing, motion as CSS variables, PLUS every reusable component class
>   (`.btn .chip .card .recipe-card .badge .input .stepper .slider .toggle .toast .skeleton
>   .carousel .dots`). Cook-mode's warm-dark palette is the `.cook-dark` scope at the bottom.
> - `docs/design/components.html` — every component in every state.
> - `docs/design/01-landing.html` … `09-profile.html` — the nine screens (landing, sign-up,
>   onboarding, planner (Woolworths rail + carousels), recipe, cook-mode, shopping, features
>   drawer, profile). Static; light demo JS only.
> - `docs/design/index.html` — navigation index of all deliverables · `docs/design/README.md` — rationale
>   + exact "how Opus should lift this" instructions.
> Direction realised: "Apple's restraint, Mob's appetite" — warm paper `#FDFBF7`, tomato/basil/
> honey accents (no blue near food), big Fraunces display. Checked at 375px + 1280px, AA
> contrast (deep accent variants for small text), `:focus-visible` + reduced-motion honored.
>
> **NEXT STEP → the Opus build session.** Nothing in the live app (`meal-planner.html`,
> `server.js`) was changed by the design session — those get rewritten during the build.
> Opus now starts at **`docs/OPUS-BUILD-BRIEF.md` phase 1** (restructure to a `/public` multi-file
> app-shell), then phase 2 lifts `docs/design/tokens.css` + markup 1:1 into the real screens. The
> current single-file app stays live on Render until the rebuilt app is ready to deploy.

> **BUILD SESSION — Phases 1–4 DONE (2026-07-19, Opus).** All work is on branch
> **`v2-rebuild`** (NOT `main`) and **not deployed** — the live Render site is untouched.
> Product renamed to **"Table"** (header + title). Removed v1 `meal-planner.html` + the brief zip.
> **Supabase is LIVE + verified** — Lucille created the project, filled `public/config.js`
> (real URL + publishable key, committed — publishable key is public-safe by design), ran
> `supabase/schema.sql`. Magic-link sign-in + cloud sync confirmed working end-to-end
> (favorite survived sign-out→sign-in). Phase 4 landing page built + verified.
> - **Phase 1 (restructure):** `meal-planner.html` split verbatim into `public/index.html`,
>   `public/styles.css`, `public/app.js`. `server.js` now serves `/public` statically (pure
>   Node, content-type map + path-traversal guard); `/generate-week` + `/generate-meal`
>   unchanged. Old `meal-planner.html` KEPT as a rollback (not deleted).
> - **Phase 2 (design lift):** `public/styles.css` = `docs/design/tokens.css` verbatim (design
>   source of truth); new `public/app-screens.css` re-tints every app screen to the Table
>   tokens; `index.html` links both. Cook mode uses the `.cook-dark` warm-dark scope.
> - **Verified in-browser, AI OFF:** questionnaire, week/review, recipes-by-day, shopping,
>   cook mode + read-aloud, target banner, leftovers, pantry hiding, favorites, persistence —
>   all intact. Zero console errors. Checked at 375px + 1280px.
> - **Phase 3 (Supabase) SCAFFOLDED — needs Lucille to connect her project:** `public/config.js`
>   (empty creds = local mode by default), `public/cloud.js` (ESM Supabase client, graceful
>   fallback), sign-in screen (magic link + Google), auth gate + per-user cloud sync + v1
>   migration wired into `app.js`, `supabase/schema.sql` (4 tables + RLS + private `dish-photos`
>   bucket), and **`docs/SUPABASE-SETUP.md`** (her step-by-step). **Verified:** local-mode has zero
>   regression (no external calls, boots to saved week), sign-in screen renders, form
>   validation + offline-guard work. **UNVERIFIED until she connects Supabase:** real magic-link
>   round-trip, Google OAuth, RLS, cloud sync/migration — test together once config.js is filled
>   + schema.sql is run. Phase-3 sync stores the whole app blob in `profiles.state` (simple/robust);
>   `weeks`/`favorites`/`photos` tables exist for later phases to normalize into.
> - **Phase 4 (landing) DONE:** full-bleed marketing page (`renderLanding()` in app.js,
>   styles in app-screens.css) — glass nav, hero, how-it-works, planner preview, quote band,
>   stat band, FAQ, footer, parallax doodads. Signed-out visitors land here → CTAs → sign-in.
>   Shell split: app screens in `#app-shell` (narrow), landing in `#landing-root` (full width).
> - **To view locally:** `node server.js` → open `http://localhost:8787/`.
> - **NEXT (in order):** meals v3 = 3 courses + no-repeat + real links +
>   photo/image mapping (6), Woolworths planner rail+carousels+DnD (7), per-day pricing (8),
>   PWA (9), integrations incl. Google OAuth (10), Tauri desktop (11).
>   Merge `v2-rebuild` → `main` + deploy only on Lucille's word.

> **BUILD SESSION — Phase 5 DONE (2026-07-19, Opus). Not committed yet — awaiting Lucille's OK.**
> Questionnaire v2 (§6) + targets engine wiring, on branch `v2-rebuild`, verified in-browser AI OFF.
> - **8-step onboarding wizard** replaces the old single-page form (`renderProfile` in `public/app.js`),
>   lifting `docs/design/03-onboarding.html` markup onto the shared tokens: Welcome (name) · You
>   (age/household steppers, weight/height, gender) · Rhythm (life stage, activity, times/week) ·
>   Goal (Feel light/Stay balanced/Get stronger cards → stable internal `lose/maintain/gain` keys) ·
>   Tastes (sweet/savory breakfast single-select, cuisine chips, dislikes, allergies, free-text) ·
>   Kitchen (cooking confidence + time-per-meal sliders, cook-once-eat-twice, pantry) · Numbers
>   (live calorie target + per-meal kcal split sliders + budget €/day + city) · Connect (skippable;
>   Calendar/reminders shown as "Coming soon" — real wiring is Phase 10). Own progress dots; the
>   1·2·3 bar is hidden during the wizard. **Persists to state on every step** (so cloud sync + resume work).
> - **Targets engine:** `computeMealTargets()` splits the daily kcal 25/40/35 (user-adjustable,
>   normalized); shown live in the Numbers step and on the review banner
>   ("roughly 590 / 950 / 830 kcal across breakfast, lunch & dinner"). `goalWord()` keeps UI wording
>   friendly. New profile fields: `name`, `breakfastPref`, `cuisines[]`, `timePerMeal`, `mealSplit`,
>   `budgetPerDay`. **Budget is now €/day**; `migrateProfile()` derives it from an old weekly value
>   (÷7) and sets `budget = budgetPerDay×7` so the current (weekly) shopping-list pill keeps working
>   until Phase 8 reworks pricing to per-day. `timePerMeal` now feeds the recipe time filter.
> - **Verified:** all 8 steps render + navigate, per-step persistence, single/multi chip logic, goal
>   mapping, live target math (~2,370 kcal / 128 g for the test profile — Mifflin check passed),
>   dislikes+allergies excluded from the generated week, pantry hiding on the shopping list, zero
>   `/generate-week` calls with AI off, zero console errors, 375px + 1280px. Edit-profile re-enters
>   the wizard pre-filled.
> - **Known (NOT a Phase-5 bug):** the small offline pool + time/difficulty filter can repeat dish
>   names across the week when AI is off. The **hard no-repeat rule + expanded pool + 3-course
>   structure is Phase 6 (Meals v3)** — the "no doubles" QA item lands there, not here.
> - **Files touched:** `public/app.js` (wizard + targets), `public/app-screens.css` (wizard styles).

> **BUILD SESSION — Phase 6 DONE (2026-07-19, Opus). Committed to `v2-rebuild`.**
> Meals v3 (§3, §7), verified in-browser AI OFF. Two commits: 6a (no-repeat + links +
> images) and 6b (3-course structure + AI prompt v3).
> - **Hard no-repeat (§3):** `pickMeal` tracks used dish NAMES across the whole week (all
>   courses); `enforceNoRepeat()` post-validates and swaps any duplicate for an unused eligible
>   dish; applied to AI weeks too; swap avoids every other dish. **Verified 0 duplicates** for
>   gain/maintain/lose, with & without leftovers.
> - **Real recipe links (§3):** `recipeSearchUrl()` → deterministic Google search
>   ("<dish> recette"), "See full recipe ↗" on each recipe card. Never an AI URL.
> - **Dish images (§3):** curated `DISH_IMG` Unsplash map + `dishImageUrl()`, keyword-matched,
>   with an onerror fallback to the emoji tile so nothing breaks. Photo banner on recipe cards.
> - **3 courses (§3.1):** lunch & dinner are multi-course by goal — Get stronger =
>   starter+main+dessert, Stay balanced = main+side, Feel light = main+light dessert; breakfast
>   single. Week is now a flat list of `{type,course,recipe,rejected}` slots. Added **14 starters
>   + 14 desserts** to the offline pool so a full 3-course week stays unique. Course-aware:
>   generateWeek, enforceNoRepeat, swapMeal, applyLeftovers (doubles dinner MAIN → one reheated
>   next-day lunch), review + recipes show "Lunch · Starter" labels, shopping sums all courses.
> - **AI prompt v3 (server.js §7):** courses object for lunch/dinner w/ per-course kcal, per-meal
>   kcal targets from mealSplit (±10%), breakfast sweet/savory, unique names, budget/day, cuisines,
>   no invented URLs. `requestWeekAI` flattens the courses object into slots.
>   **UNVERIFIED until Lucille runs it with AI ON** (AI off by default; don't burn the 20/day quota).
> - **Then 9 PWA, 10 integrations, 11 Tauri desktop.**

> **BUILD SESSION — Phases 7 & 8 DONE (2026-07-19, Opus). Committed to `v2-rebuild`.**
> Verified in-browser AI OFF.
> - **Phase 7 Planner v2 (design 04):** the week screen (`renderReview`) is now a two-mode
>   planner. Sticky **Mon–Sun rail** (each day = B/L/D photo thumbnails + day kcal; empty slot =
>   ＋). **Mode toggle:** "Plan for me" (generated week, swap/fav as before) and "Browse & add"
>   (5 recipe carousels: favorites, quick & easy, breakfasts, lunch mains, dinner mains — token
>   `.recipe-card` markup, ⊕ add + ♥ fav, photos w/ emoji fallback). **Add a dish two ways:** tap
>   ⊕ → day-picker popover, or **drag a card onto a rail day** (HTML5 DnD). Dish lands at its
>   natural meal main; persists immediately. Rail+main stack under 780px. `state.plannerMode`.
>   Deferred sources (need later phases): "past AI weeks" (weeks-table normalization) and "your
>   photo" dishes (photo upload).
> - **Phase 8 Shopping v2 (§4):** total reframed **per day** — big "€X / day" (week avg), week
>   total secondary, budget pill vs `budgetPerDay`. Each section shows a € chip: the buy-at-start
>   bulk total + a per-buy-day total on every fresh-day header. Prices still per-ingredient from
>   AI; chips only show when prices exist (AI on).
> - **Files:** `public/app.js`, `public/app-screens.css`.
> - Next was Phase 9 (below).

> **SESSION — 2026-07-20 (Opus): rename, folder tidy, integrations, QA, V2 release.**
> - **Folder tidied:** reference material moved to `docs/` (5 briefs/research + the `design/`
>   mockups), `.DS_Store` deleted, `README.md` added, all 17 moved-path references updated.
> - **Renamed Table → #Foodie** everywhere user-facing (title, manifest, header, install button,
>   landing, .ics PRODID, e-mails, README). SW cache bumped to `foodie-shell-v3`.
> - **Questionnaire is now once-only + easy to edit:** in edit mode (a week exists) every step has a
>   **"Save changes"** button that saves and returns to the planner *without* regenerating; the last
>   step becomes "Save & re-plan week". "Start a new week" became **"🔄 Re-plan this week"** and
>   regenerates from the saved profile instead of re-asking the questionnaire. Shared `planWeek()`.
>   Planner button relabelled "⚙️ Edit my answers".
> - **Integrations:** wrote `send-reminders` + `send-feedback` Edge Functions; dropped FormSubmit;
>   added the `TEST_EMAIL_TO` override after the first test returned Resend 403.
> - **QA sweep before release (important):** a 210-profile stress test revealed the no-repeat rule
>   failing in ~half of realistic setups — earlier single-profile passes had just been lucky. Root
>   cause: dietary filters shrank pools below a week's demand (sides were exactly 14 for 14 slots).
>   Fixed by adding **28 recipes** (+5 breakfasts, +3 lunches, +4 dinners, +8 starters, +8 desserts)
>   and by reporting genuinely-unfixable repeats instead of hiding them. Re-verified: 0 duplicates in
>   60 runs on Lucille's profile and 60 with no restrictions.
> - **Security pre-flight:** Gemini key never committed, git-ignored, absent from all shipped files;
>   no Resend key in code; only the Supabase publishable key ships (public-safe by design).
> - **Released:** `v2-rebuild` merged into `main` as "Release v2: #Foodie". Awaiting her push.
> - **Wrote `docs/V3-REDESIGN-BRIEF.md`** from her Woolworths reference — see NEXT STEPS above.
> - **Closed with a full verification pass (all green)** — the results table is in "Verified vs
>   unverified" at the top. Nothing is broken; the only open risks are the untested AI-ON path and
>   the two undeployed Edge Functions.

> **BUILD SESSION — Phases 9 & 10a DONE (2026-07-19, Opus). Committed to `v2-rebuild`.**
> - **Phase 9 PWA (Target A):** `public/manifest.json` (standalone, theme/bg colour, SVG icons
>   incl. maskable), `public/sw.js` service worker, `public/icons/icon.svg` + `icon-maskable.svg`
>   (tomato place-setting mark), install wiring in `index.html` (manifest link, apple-touch-icon,
>   web-app-capable metas, SW registration, `beforeinstallprompt` → "Install Table" button).
>   **SW strategy: network-first for the app's own html/js/css/json** (so updates always reach
>   users; offline falls back to the cached shell), cache-first for icons. **Bump `CACHE` in sw.js
>   on every shell change** or users get stale code. Verified: SW registers + controls page,
>   manifest valid, shell cached (offline fallback works), installable.
> - **Phase 10a integrations (§5, zero-setup):** `buildICS()` → "📅 Add to calendar" on the
>   shopping screen downloads a `.ics` for the **upcoming** Mon–Sun (dinners 19:00 w/ recipe link,
>   shopping reminders 17:00 per buy-day). `openFeedback()` → "💬 Tell Lucille" modal POSTs to
>   FormSubmit.co AJAX for lucillemonamie@icloud.com (honeypot; she must click their one-time
>   confirmation email on first real submit). Verified in-browser (not actually submitted).
> - **STILL TODO (need Lucille's free accounts / tooling — good handoff point):**
>   Phase 10b: web-push + Resend email reminders via a Supabase Edge Function on cron; Google
>   Calendar OAuth Tier 2 (needs a Google Cloud project). Phase 11: Tauri desktop wrapper over
>   `/public` (needs Rust + Tauri CLI installed on her Mac) → `.dmg`/`.exe` via GitHub Releases.
>   Also: whole `v2-rebuild` branch is still unmerged/undeployed — merge → `main` only on her word.
>   And the AI-ON path (Phase 6b course JSON) is still unverified until she tests with AI on.

Source of truth for the meal-planner project. **Phases 1–4 are all DONE.** The app is live on
the public internet (Render free tier) — frontend + backend + AI generation all verified working.
**Live URL: https://meal-planner-km6f.onrender.com**

> **How to resume:** the working code lives in `~/Work/claude/Projects/Meal plan Lucille/`
> (there's an unrelated `Projects/Financial planning/` beside it — leave that alone). Files:
> `meal-planner.html`, `server.js`, `gemini-key.txt` (local key, git-ignored), `package.json`,
> `render.yaml`, `.gitignore`. Hosted on Render, auto-deploys from GitHub repo
> `github.com/lucille12345/Meal-plan-Lucille` on every push. To ship a change: edit files → push
> to that repo → Render redeploys automatically.
> Always show proposed edits before applying them — Lucille prefers to approve each change.

> **Phase 5 (2026-07-18): full redesign after market research.** See **`docs/RESEARCH.md`** for the
> competitor research (Mealime, Jow, Eat This Much, Samsung Food…), the quality criteria, the
> exact list of changes (cook mode, kcal/protein, household scaling, persistent shopping-list
> ticks, favorites, copy/print, new warm design system), and the roadmap. Read it before
> touching the frontend — it is the design source of truth now. Changes are local, not yet
> pushed/deployed.
>
> **Deep research (2026-07-18): `docs/STORM-RESEARCH.md`** — a broader, multi-perspective research
> report (nutrition/TDEE engine, monetization, retention, food-waste/leftovers, onboarding,
> dietary frameworks, accessibility/EU law, free data APIs) with a ranked, zero-cost feature
> backlog in its §10.
>
> **Phase 6 (2026-07-18): built STORM backlog items 1–4** (all local, verified in-browser with
> AI off, not yet pushed/deployed):
> 1. **Real calorie & protein target** — new profile fields *height* + *age*; `computeTargets()`
>    (Mifflin–St Jeor → activity multiplier from weekly frequency → goal adjust → protein g/kg)
>    lives in BOTH `meal-planner.html` and `server.js`. Shown as a 🎯 banner on the review
>    screen; injected into the AI prompt so portions are numerically grounded. Silent if
>    height/age/weight aren't all provided (backward-compatible).
> 2. **"Cook once, eat twice"** — profile checkbox `profile.leftovers`. `applyLeftovers(week)`
>    post-processes ANY week (AI or offline): turns Tue/Thu/Sat lunches into "Leftover <prev
>    dinner>", **doubles the source dinner's ingredients** (batchNote badge "cook double"), and
>    the leftover meal (`isLeftover:true`) is **skipped in the shopping list** so nothing is
>    bought/counted twice. Verified: Mon salmon → 300 g, Tue leftover adds 0.
> 3. **Pantry staples** — profile chip row `profile.pantry` (Salt, Olive oil, Rice, …).
>    `pantryHas()` filters those out of the shopping list (substring match either direction);
>    shows "Hiding N items you already have". `buildShoppingList()` now returns `skipped`.
> 4. **Read-aloud cook mode + accessibility** — 🔊 "Read step aloud" button using the browser's
>    free `speechSynthesis` (speech cancelled on close/step-change); WCAG AA pass: small orange
>    labels darkened to `--accent-deep` (contrast), global `:focus-visible` outline,
>    `prefers-reduced-motion`, ARIA on the cook dialog and icon buttons.
>
> **Next candidates (STORM §10, not built):** diet-type/cuisine selectors → gentle "weeks
> planned" counter → PWA → French/English toggle → Groq provider (needs Lucille's free account).
>
> **V2 — THE BIG ONE (2026-07-18, specced, not started).** Lucille commissioned a full
> product evolution: real *app* (installable PWA), sign-up/sign-in (Supabase free tier),
> marketing landing page, Woolworths-style planner (sidebar week + recipe carousels),
> 3-course meals, no-repeat rule, per-day prices, sweet/savory breakfast, friendly wording
> (never "maintain/lose/gain" in UI), real recipe links, user dish photos, Google Calendar
> (.ics first, OAuth later), push/email reminders (SMS = paid, deferred, her call),
> feedback form to lucillemonamie@icloud.com. Two authoritative briefs, division of labor:
> - **`docs/DESIGN-BRIEF.md`** → a dedicated Claude *design* session produces a `docs/design/` folder
>   (tokens.css, components.html, 9 screen mockups). Design direction: "Apple's restraint,
>   Mob's appetite" + the exact structural references Lucille chose.
> - **`docs/OPUS-BUILD-BRIEF.md`** → the Opus build session implements the app in 11 phases,
>   lifting the design 1:1. Includes the Supabase/Google/Resend/FormSubmit setup steps
>   Lucille must do (all free) and the "no doubles" QA checklist.
> Run the design session FIRST; Opus starts at its phase 1 only once `docs/design/` exists.
> (Design session is now DONE — see the status block at the very top; Opus is cleared for phase 1.)
>
> **Packaging decided 2026-07-19:** ship BOTH an installable **PWA** (phone + web) AND a
> free **desktop download** (`.dmg`/`.exe` via **Tauri**, Electron fallback) from ONE web
> codebase — Lucille wants it great on phone and computer equally, at zero spend. Desktop
> files distribute via GitHub Releases; App Store (paid) is out of scope. See
> `docs/OPUS-BUILD-BRIEF.md` §0 (dual-target architecture) + phase 11.

---

## 1. The vision

A web app that builds a personalized week of meals adapted to each person, then produces a
shopping list to actually follow the plan.

Core flow: **Questionnaire → Generate a week (AI) → Review (reject/swap) → Recipes by day →
Shopping list (with prices).**

---

## 2. Big decisions (locked in)

| Decision | Choice | Notes |
|---|---|---|
| Who it's for | A real product for others (eventually) | Built in phases; single-user first. |
| Meal generation | AI-generated (Google Gemini, FREE tier) | Working. Local pool = offline fallback. |
| How we work | Teach-as-we-go | Claude builds + explains; Lucille (non-coder) learns. |
| Frontend | One self-contained HTML file | Plain HTML/CSS/JS, opens in browser. |
| Review model | Reject-only | No approve step. Tap ✕ to swap. Un-crossed meals kept. |
| AI provider | Google Gemini free tier (no card) | Zero spend. Model `gemini-flash-latest`. |
| Key security | Local backend holds the key | Key in `gemini-key.txt`, never in the browser. |
| Currency / prices | Euros, default city Paris | AI estimates prices; user can set another city. |
| Dev tooling | Claude Code (from Phase 3 on) | Edits files in place; no more download/replace/restart. |

**Why not Anthropic/Claude API for the app:** it bills per use; Lucille wants zero spend →
Gemini free tier. (Claude Code the *tool* is covered by her Pro plan; that's separate.)

---

## 3. The phased roadmap

- **Phase 1 — Core, single-user, in-browser.** ✅ DONE.
- **Phase 2 — Real AI meal generation.** ✅ DONE AND WORKING (Gemini free tier via local backend).
- **Phase 2.5 — Extra features.** ✅ DONE: free-text "can't/won't eat", € budget + optional city,
  estimated shopping-list price + budget check, "Recipes by day" page, cooking method per dish,
  realistic portions & prices.
- **Phase 3 — Saving / persistence.** ✅ DONE: profile + week persist to browser `localStorage`,
  survive a refresh, and there's a "Clear saved data & start fresh" control. Per-browser only —
  no accounts/database yet (that's a later phase if ever needed).
- **Phase 4 — Go live.** ✅ DONE (2026-07-18). Whole app (frontend + backend together) hosted on
  Render's free tier at https://meal-planner-km6f.onrender.com. Auto-deploys from GitHub repo
  `lucille12345/Meal-plan-Lucille` on every push. Live AI generation verified end-to-end (real
  7-day week returned; Gemini key set as a Render env var, never in the repo). See §10 for how it
  was set up and how to redeploy.

---

## 4. Files & how to run

Everything is in **`~/Work/claude/Projects/Meal plan Lucille/`**:
- `meal-planner.html` — the app (frontend).
- `server.js` — the backend (holds key, calls Gemini; also serves the HTML). Pure Node, zero deps.
- `gemini-key.txt` — the secret Gemini key on line 1. Keep private (git-ignored, never commit/share).
- `package.json` / `render.yaml` / `.gitignore` — deploy files added in Phase 4 (see §10).
- `CLAUDE.md` — this file.

Run locally: Terminal → `cd ~/Work/claude/Projects/Meal\ plan\ Lucille` → `node server.js`
(wait for `✅ ... Key loaded: yes`). Then either open `meal-planner.html` by double-click, OR
visit `http://localhost:8787/` (the server now serves the page too). Stop with `Ctrl + C`.
(In Claude Code, it can run/restart the server for you.)

---

## 5. Architecture & data

**Flow:** browser (`meal-planner.html`) → local backend (`server.js`) → Gemini API → back.

**Backend (`server.js`):** pure Node, built-in http + fetch, no dependencies.
- Key from `gemini-key.txt` (first non-comment line); `.env` supported as fallback.
- Gemini call: `POST /v1beta/models/{MODEL}:generateContent`, header `x-goog-api-key`,
  `responseMimeType: application/json`, `temperature: 0.4`, `maxOutputTokens: 32768`.
- Robustness: `sanitizeJson()` strips trailing commas; retries twice; errors clearly on
  `finishReason` MAX_TOKENS cut-off.
- Endpoints: `POST /generate-week` → `{week:[{day,meals:[recipe×3]}]}`;
  `POST /generate-meal` → `{meal:recipe}` (swaps; avoids named dishes).
- Also `GET /` (and `/meal-planner.html`) → serves the HTML page, so frontend + backend can
  run from ONE URL/one deploy (this is what makes the single-service Render hosting work).
- Port: `process.env.PORT || 8787` — Render assigns its own port; 8787 stays the local default.
- CORS `*` so a double-clicked `file://` page can still call a locally-running server.
- **Frontend→backend URL (`meal-planner.html`):** `BACKEND_URL = location.protocol==='file:' ?
  'http://localhost:8787' : ''`. Double-clicked file → localhost; served over http(s) (local Node
  or Render) → same-origin relative calls. So the same HTML works locally and hosted, unchanged.

**Data shapes:**
```
Profile    = { weight, gender, lifeStage, goal, sport, frequency, cookingLevel,
               dislikes[], allergies[], avoidText, budget, city }
Recipe     = { id, type, name, desc, time, difficulty, emoji, img, tags[],
               ingredients[], steps[] }
Ingredient = { name, qty, unit, category, buyDayBefore, price }   // price in EUR
Week       = [ { day, meals: [ { type, recipe, rejected } ] } ]   // 7 days
```

**Frontend screens:** profile → (loading) → review → recipes (by day) → shopping.
- Review: reject-only; ✕ calls `/generate-meal` (mini-spinner), local fallback on error.
- Recipes by day: day tabs Mon–Sun; each dish shows ingredients, then method (steps), then
  time + difficulty.
- Shopping: computed from kept meals; `Map` keyed by `name|unit` sums qty AND price; two
  sections (buy-at-start vs buy-fresh-by-day); shows € total + within/over-budget pill.
- Offline fallback: ~21 built-in recipes (include `steps`); yellow banner when backend off.
- **Persistence (Phase 3):** `state.profile` and `state.week` are saved to `localStorage` under
  key `mealPlannerState` on every `render()` (plus explicitly after a swap, since swaps re-render
  without going through the main `render()`). On page load, `loadState()` restores them before
  the first render — if a saved week exists it jumps straight to the Review screen instead of the
  blank questionnaire. `hasSavedData()`/`clearAllData()` back the "Clear saved data & start
  fresh" button on the profile screen (only shown when there's real saved content, not just an
  empty storage entry — see gotcha below). All storage access is try/caught so a browser that
  blocks `localStorage` just degrades to no persistence instead of crashing.

---

## 6. Questionnaire fields (current)

weight, gender, life stage (student/working/parent/flexible), goal (lose/maintain/gain),
sport + times/week, cooking confidence 1–10, weekly budget (€), city (optional, default Paris),
free-text "can't/won't eat", quick dislikes (chips), allergies (chips).

---

## 7. AI prompt rules (in server.js)

- Respect dislikes, free-text avoid list, and allergies strictly.
- Portions: filling, adult-sized (130–200 g protein mains, proper carbs/veg); the day's 3 meals
  cover realistic daily energy needs for the goal. Never under-portion.
- Prices: realistic 2026 city supermarket prices with anchors; a one-person week ≈ €45–85;
  don't lowball. Respect budget if given, but never fake unrealistically cheap prices.
- Method: 3–6 short cooking steps per meal.
- Output valid JSON only, no trailing commas.

---

## 8. Lessons learned / gotchas

- Node v24 installed. Gemini key made free at aistudio.google.com (no card). An early key was
  briefly visible on screen → regenerate advised.
- Reliable file workflow in Cowork was: download files from chat into `~/Work/claude` + Terminal
  (screen-control was flaky; Lucille approves each step).
- Bugs fixed: JSON trailing-comma parse error (sanitize + retry); full-week responses hitting
  the 8192-token cap (raised to 32768); prices too low & portions too small (added anchors +
  portion rules); `hasSavedData()` initially checked only whether the `localStorage` key existed,
  but `saveState()` always rewrites that key (even to an empty `{profile:null,week:[]}`) right
  after clearing — so the "Clear saved data" button would've kept reappearing. Fixed to check the
  actual content instead of just key presence.
- A stray `backend/` subfolder (with its own unused `.env` holding a real-looking Gemini key)
  was found and removed on 2026-07-16 — `server.js` only ever reads the key from the root
  `gemini-key.txt` (or a root `.env`), so `backend/` was dead leftover from an earlier setup
  attempt. If that key is a live one, consider regenerating it at aistudio.google.com as a
  precaution, same as the earlier exposed-key note above.
- Lucille is a beginner and learning as we go — explain choices, keep steps small, confirm before
  irreversible actions.

---

## 9. Known limitations / next work

- Saving is per-browser only (`localStorage`) — same profile/week won't follow you to another
  browser or device. Real accounts + a database would be a later phase, not needed yet.
- Now hosted on Render (Phase 4 done). Still per-browser saving; still no user accounts/database.
- Render free tier "cold starts": the service sleeps after ~15 min idle and takes ~30–50 s to
  wake on the next visit. App doesn't break — the first "Generate" after idle just spins longer.
  (Decided 2026-07-17: acceptable for now.)
- Gemini free tier limits — **confirmed 2026-07-18 directly on Lucille's AI Studio dashboard**
  (aistudio.google.com → Limite de débit), for the model actually in use, **Gemini 3.5 Flash**:
  **20 requests/day (RPD)**, 5 requests/minute (RPM), 250K tokens/minute (TPM). The dashboard's
  own "Limit" line on the RPD chart sits at 20, and usage/errors on it line up exactly with the
  429s hit during Phase 4 testing on 2026-07-17. (Earlier note flagged a conflicting ~1,500/day
  figure from third-party blog sites — that number is simply wrong for this model/tier; ignore
  it. 20/day is the real, confirmed limit.) Google's dashboard also showed a "set up billing to
  raise your limits" option — not needed, just noting it exists if more headroom is ever wanted
  without abandoning the free/pay-as-you-go model.
- Prices are AI estimates — decent but sanity-check against real receipts.
- Swaps don't yet take a free-text "why" note (backend already supports an avoid-list).
- **"Use real AI generation" toggle (added 2026-07-18):** checkbox on the profile screen,
  `state.useAI`, **off by default**, persisted via localStorage same as profile/week. Off →
  "Generate my week" and every ✕ swap use the local recipe pool instantly, zero network calls,
  zero quota used (verified: no requests hit `/generate-week` or `/generate-meal` when off). On →
  original AI behavior, still falls back to local on a real error. Review screen shows a neutral
  blue "AI generation is off" note when off, vs. the amber "Backend offline" warning only for an
  actual failure — the two are deliberately not conflated. Considered other ways to raise the
  20/day ceiling (extra Gemini keys — confirmed doesn't work, limits are per-project; enabling
  billing — works but costs money, off the table per "zero spend" decision; switching to Groq's
  free tier, ~14,400 req/day per their own docs — real option, not done, would need a provider
  rewrite in `server.js` + a new Groq account). This toggle was the free, no-new-account fix.

---

## 10. Phase 4 deploy — DONE (how it's set up + how to redeploy)

Set up 2026-07-18. How it went live:
- GitHub repo: `github.com/lucille12345/Meal-plan-Lucille` (private). Published via GitHub Desktop
  (git + gh CLI weren't the smooth path for a beginner; GitHub Desktop's "Publish repository" was).
- Render: free "web service" via **Blueprint** (reads `render.yaml`). Connected to the GitHub repo
  with "all repos" access. Gemini key pasted into Render as the `GEMINI_API_KEY` env var.
- Live URL: **https://meal-planner-km6f.onrender.com**

**To ship a change from now on:** edit files locally → commit & push to the GitHub repo (GitHub
Desktop: Commit → Push origin) → **Render auto-deploys** within a minute or two. No manual redeploy
needed. The live URL stays the same.

Key hygiene: the key lives in `gemini-key.txt` locally (git-ignored) and as the `GEMINI_API_KEY`
env var on Render — never in the repo. If the key is ever rotated, update it in BOTH places.

Gotchas seen during deploy: Render's repo picker showed "An error occurred" once (transient —
reload/re-auth GitHub fixed it). The repo is named after the folder (`Meal-plan-Lucille`), not
"meal-planner". First hit after idle = ~40s cold start (normal, not a failure).
