# Meal Planner — Project Memory (CLAUDE.md)

_Last updated: 2026-07-19. This file is auto-loaded by Claude Code every session._

> **DESIGN SESSION — DONE (2026-07-19).** The `DESIGN-BRIEF.md` "Table" design session is
> complete. A new **`design/`** folder now exists in the repo with every deliverable from the
> brief §0, all self-contained (link `tokens.css`; system/Google fonts + Unsplash CDN images
> only; no build step). Contents:
> - `design/tokens.css` — **the visual source of truth.** All colors, Fraunces/Inter type,
>   radii, warm shadows, spacing, motion as CSS variables, PLUS every reusable component class
>   (`.btn .chip .card .recipe-card .badge .input .stepper .slider .toggle .toast .skeleton
>   .carousel .dots`). Cook-mode's warm-dark palette is the `.cook-dark` scope at the bottom.
> - `design/components.html` — every component in every state.
> - `design/01-landing.html` … `09-profile.html` — the nine screens (landing, sign-up,
>   onboarding, planner (Woolworths rail + carousels), recipe, cook-mode, shopping, features
>   drawer, profile). Static; light demo JS only.
> - `design/index.html` — navigation index of all deliverables · `design/README.md` — rationale
>   + exact "how Opus should lift this" instructions.
> Direction realised: "Apple's restraint, Mob's appetite" — warm paper `#FDFBF7`, tomato/basil/
> honey accents (no blue near food), big Fraunces display. Checked at 375px + 1280px, AA
> contrast (deep accent variants for small text), `:focus-visible` + reduced-motion honored.
>
> **NEXT STEP → the Opus build session.** Nothing in the live app (`meal-planner.html`,
> `server.js`) was changed by the design session — those get rewritten during the build.
> Opus now starts at **`OPUS-BUILD-BRIEF.md` phase 1** (restructure to a `/public` multi-file
> app-shell), then phase 2 lifts `design/tokens.css` + markup 1:1 into the real screens. The
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
> - **Phase 2 (design lift):** `public/styles.css` = `design/tokens.css` verbatim (design
>   source of truth); new `public/app-screens.css` re-tints every app screen to the Table
>   tokens; `index.html` links both. Cook mode uses the `.cook-dark` warm-dark scope.
> - **Verified in-browser, AI OFF:** questionnaire, week/review, recipes-by-day, shopping,
>   cook mode + read-aloud, target banner, leftovers, pantry hiding, favorites, persistence —
>   all intact. Zero console errors. Checked at 375px + 1280px.
> - **Phase 3 (Supabase) SCAFFOLDED — needs Lucille to connect her project:** `public/config.js`
>   (empty creds = local mode by default), `public/cloud.js` (ESM Supabase client, graceful
>   fallback), sign-in screen (magic link + Google), auth gate + per-user cloud sync + v1
>   migration wired into `app.js`, `supabase/schema.sql` (4 tables + RLS + private `dish-photos`
>   bucket), and **`SUPABASE-SETUP.md`** (her step-by-step). **Verified:** local-mode has zero
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
>   lifting `design/03-onboarding.html` markup onto the shared tokens: Welcome (name) · You
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

> **Phase 5 (2026-07-18): full redesign after market research.** See **`RESEARCH.md`** for the
> competitor research (Mealime, Jow, Eat This Much, Samsung Food…), the quality criteria, the
> exact list of changes (cook mode, kcal/protein, household scaling, persistent shopping-list
> ticks, favorites, copy/print, new warm design system), and the roadmap. Read it before
> touching the frontend — it is the design source of truth now. Changes are local, not yet
> pushed/deployed.
>
> **Deep research (2026-07-18): `STORM-RESEARCH.md`** — a broader, multi-perspective research
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
> - **`DESIGN-BRIEF.md`** → a dedicated Claude *design* session produces a `design/` folder
>   (tokens.css, components.html, 9 screen mockups). Design direction: "Apple's restraint,
>   Mob's appetite" + the exact structural references Lucille chose.
> - **`OPUS-BUILD-BRIEF.md`** → the Opus build session implements the app in 11 phases,
>   lifting the design 1:1. Includes the Supabase/Google/Resend/FormSubmit setup steps
>   Lucille must do (all free) and the "no doubles" QA checklist.
> Run the design session FIRST; Opus starts at its phase 1 only once `design/` exists.
> (Design session is now DONE — see the status block at the very top; Opus is cleared for phase 1.)
>
> **Packaging decided 2026-07-19:** ship BOTH an installable **PWA** (phone + web) AND a
> free **desktop download** (`.dmg`/`.exe` via **Tauri**, Electron fallback) from ONE web
> codebase — Lucille wants it great on phone and computer equally, at zero spend. Desktop
> files distribute via GitHub Releases; App Store (paid) is out of scope. See
> `OPUS-BUILD-BRIEF.md` §0 (dual-target architecture) + phase 11.

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
