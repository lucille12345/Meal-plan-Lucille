# STORM Research — Deep Dive on the Meal-Planning App Space

_Written 2026-07-18 by Claude (Opus 4.8) for Lucille. A "STORM-style" report: the topic
researched from many independent perspectives, then synthesized. This is the **deep**
companion to [`RESEARCH.md`](RESEARCH.md) (which covered the head-to-head competitor
comparison). Read `CLAUDE.md` first for project history and the zero-spend / single-HTML /
Gemini-free-tier constraints — every recommendation below is filtered through those._

**How to use this doc:** each section ends with a **→ For our app** box translating the
finding into a concrete, zero-cost decision. The consolidated backlog is in §10.

---

## 0. Executive summary (the 8 things that actually matter)

1. **The market is huge and freemium-shaped.** ~$5.2B by 2034; >70% of apps are freemium;
   typical premium is $3–12/mo; free→paid conversion is only 3–7%. A generous free tier
   isn't charity — it's the category's proven acquisition engine. Our app being 100% free
   is a genuine competitive edge, not a limitation.
2. **The winning loop is "answer a few questions → get a full week in seconds."** AI-from-
   scratch generation (what we already do) is the 2026 frontier. We're on the right side of
   the trend; most incumbents are still shuffling a fixed recipe database.
3. **Nutrition numbers are now table stakes**, and there's a *correct way* to compute them
   (Mifflin–St Jeor → TDEE → macro split). We added kcal/protein estimates in Phase 5; the
   next step up is computing a real calorie target from the profile we already collect.
4. **Retention comes from habit + gentle streaks, not features.** Notifications and streaks
   lift engagement 40–70%, but overdone gamification is now flagged as *harmful* for some
   users. There's a tasteful middle we can hit.
5. **Food waste / leftovers is the biggest under-served need** that fits our zero-spend model
   perfectly (it's pure logic, no paid API). "Cook once, eat twice" + a pantry-aware list
   would leapfrog most paid apps.
6. **Onboarding length is a real lever** — but "shorter" is not automatically "better."
   Explaining *why* each question is asked converts better than a bare form. Our
   questionnaire should show its reasoning.
7. **Free data exists.** Open Food Facts (no key, 2.5M products, nutrition + Nutri-Score)
   and its Open Prices project are genuinely free and open — a path to real nutrition/price
   data without abandoning zero-spend, if we ever want it.
8. **Accessibility is now law in the EU** (European Accessibility Act, WCAG 2.1 AA since
   June 2025). Lucille is in France. Our cook mode and contrast should meet AA — cheap to
   do, and the right thing regardless.

---

## 1. Market & business model — why "free" is a weapon

- Freemium is the dominant model (**44.8%** share; **>70%** of top nutrition apps use it).
  Free tier almost always = a **cap on plans per week (3–5)**; premium unlocks unlimited
  plans, AI, grocery-delivery integration, advanced filters, ad-free.
- Premium pricing clusters at **$3–12/mo**; ~**41%** of users who pay do so within 6 months,
  mostly for *exclusive recipes* and *analytics*.
- Free→paid conversion is only **3–7%** industry-wide — meaning ~95% of users never pay, and
  the free experience is what 95% of people actually judge you on.
- In-app purchases ≈ **45%** of revenue; the market grows ~**15% CAGR**.

**→ For our app:** we have no paywall, no ads, no account wall — the exact three things
Reddit users say they hate (see §4). That's a real, ownable positioning: *"the meal planner
that doesn't nickel-and-dime you."* We should never add a paywall to the core loop. If money
is ever needed, the honest levers are: optional donation, or affiliate grocery links — never
locking planning/list/export.

Sources: [Diet & Nutrition App Statistics 2026](https://media.market.us/diet-and-nutrition-apps-statistics/),
[Meal Planning App Market Report](https://dataintelo.com/report/meal-planning-app-market),
[Nyusoft — monetization models](https://nyusoft.com/fitness-app-monetization-strategies/).

---

## 2. How the best AI planners actually work (the nutrition engine)

The 2026 standard pipeline, which we can partially adopt for **free**, in plain JS:

1. **BMR** via **Mifflin–St Jeor** (the clinical gold standard):
   - Men: `10·kg + 6.25·cm − 5·age + 5`
   - Women: `10·kg + 6.25·cm − 5·age − 161`
2. **TDEE** = BMR × activity multiplier (1.2 sedentary → 1.9 very active). AI apps increasingly
   pull *real* activity from wearables instead of a static multiplier.
3. **Calorie target** = TDEE adjusted for goal (−15–20% to lose, +10–15% to gain).
4. **Macro split** from the goal: more protein for muscle, more carbs for endurance, balanced
   for fat loss. GLP-1 / high-protein era → protein floors of ~1.6–2.2 g/kg are now common.
5. **Adaptive targeting** (the cutting edge, e.g. MacroFactor): ignore the formula's *estimate*
   and reverse-engineer true TDEE from the user's actual weight trend over time.
6. **Photo logging** via computer vision: 83–96% accuracy depending on macro. (Not relevant to
   us — we plan, we don't track intake.)

**→ For our app:** we already collect weight, gender, goal, sport, and frequency — **we have
everything Mifflin–St Jeor needs except age and height.** Two tiny profile fields unlock a
*real* daily calorie target we can (a) show the user and (b) feed into the AI prompt so
portions are numerically grounded instead of hand-waved. This is the single highest-leverage
upgrade available to us and it costs nothing. Adaptive targeting and wearables are out of
scope (need accounts + device APIs).

Sources: [Fitia — how AI sets calorie targets](https://fitia.app/learn/article/ai-meal-planning-calorie-targets-macros/),
[The Nutrition Magazine — best macro apps 2026](https://thenutritionmagazine.com/articles/the-best-macro-tracking-apps-2026/).

---

## 3. Retention — habit and streaks, tastefully

- Streaks/gamification lift engagement **~40%**; notifications lift it **up to 70%**;
  goal-setters are **30%** more likely to stay; badges push 90-day retention to ~**24%**.
- MyFitnessPal's durability is credited to *habit integration* — logging/streaks feel like
  part of a daily rhythm, avoiding "novelty burnout."
- **But** (2026 caution): the Washington Times and others report gamified nutrition features
  can be *harmful* — streak fatigue, and for some users an unhealthy compulsion. Streaks that
  punish a missed day backfire.

**→ For our app:** we're a *weekly* planner, not a daily tracker, so heavy streaks don't fit
and could do harm. The tasteful version: a gentle **"weeks planned" counter** and remembering
returning users warmly ("Welcome back — plan week 4?"). No punishing streaks, no push spam
(we're a website without accounts anyway). Favorites (already shipped) is the healthy
retention mechanic — it makes each week better than the last. That's the right lane.

Sources: [Trophy — streaks case study](https://trophy.so/blog/streaks-gamification-case-study),
[Propel — MyFitnessPal retention](https://www.trypropel.ai/resources/blogs/myfitnesspal-customer-retention-strategy),
[Washington Times — gaming features carry risks](https://www.washingtontimes.com/news/2026/jun/30/nutrition-apps-help-build-healthy-habits-users-gaming-features-carry/).

---

## 4. What users actually complain about (unmet needs)

Recurring across Reddit and review round-ups:

1. **Feature bloat** — the app tries to do everything and becomes annoying. (We're lean. Guard this.)
2. **Recipe-source fragmentation** — people's recipes live in TikTok, screenshots, cookbook
   photos, handwritten cards; generic planners don't ingest them.
3. **Paywalled basics** after time invested; unclear what's free. (We have none of this.)
4. **Shopping lists that reset / aren't store-organized.** (We fixed reset in Phase 5; ours is
   category-organized.)
5. **Repetition** — same meals every week.

**→ For our app:** #1, #3, #4 are already strengths. #5 is addressed by AI + favorites. #2
(recipe capture) is a genuine unmet need but a *different product* — importing a user's own
recipes is a big feature; note it as a possible future direction, don't chase it now.

Source: [OrganizEat — Reddit meal planner round-up](https://home.organizeat.com/blog/meal-planner-app-reddit/).

---

## 5. The biggest zero-cost opportunity: food waste & leftovers

This is where paid apps are weak and where our constraints are actually an *advantage* —
it's pure logic, no external API:

- **Eat This Much** has a "virtual pantry" that prioritizes what you own; **Little Lunches**
  folds last week's leftovers into new recipes; **OH, a potato!** generates a list of only
  what you *don't* already have; **MealPrepPro / 20 Dishes** design weeks around batch cooking.
- The unifying idea: **don't make people buy and cook 21 unrelated things a week.** Reuse
  ingredients across meals; turn dinner into next-day lunch; subtract pantry staples from the list.

**→ For our app (high value, all free):**
- **"Cook once, eat twice"** toggle → the generator/prompt deliberately reuses a dinner as the
  next day's lunch (halves cooking effort and waste). No competitor does this well and it's
  pure prompt + logic.
- **Pantry staples** → a quick checklist ("I already have: oil, salt, rice, pasta…") that
  subtracts those from the shopping list. Pure client-side filtering.
- **Ingredient reuse scoring** in offline generation → prefer weeks where the same fresh
  ingredient appears in 2–3 meals, so nothing rots half-used.

Sources: [Conserve Food — 6 apps that cut waste](https://conservefood.org/2025/07/02/6-meal-planning-recipes-apps-to-simplify-cooking-and-cut-food-waste/),
[Eat This Much blog](https://blog.eatthismuch.com/best-meal-planning-apps/).

---

## 6. Onboarding — length, and the "why"

- No magic number: **3–5 questions** is a safe start; **5–7 is fine** *if each answer visibly
  shapes the result* and the app explains *why* it's asking. Health apps that explain the why
  convert meaningfully higher.
- Counter-intuitive: **shorter isn't always better.** One app's *longer* onboarding beat "no
  onboarding" by **+40%** paid conversion; shortening it later *cost* 13%. The lesson is
  *relevance*, not brevity.
- Segmenting users up front and personalizing lifts conversion ~**15%**. Delaying sign-up
  (let people taste value first) converts better.

**→ For our app:** our questionnaire is already ~9 fields and each one demonstrably changes the
output — that's on the right side of the research. Two cheap improvements: (1) add a one-line
"why we ask" under the heavier fields (we already do this for a few), and (2) we have **no
sign-up at all**, which is the strongest possible version of "delay the sign-up." Keep it.

Sources: [Adapty — onboarding best practices 2026](https://adapty.io/blog/how-to-fix-your-onboarding-flow/),
[Appcues — mobile onboarding](https://www.appcues.com/blog/mobile-onboarding-best-practices),
[Reteno — won in 60 seconds](https://reteno.com/blog/won-in-60-seconds-how-top-apps-nail-onboarding-to-drive-subscriptions).

---

## 7. Dietary frameworks & cultural diversity

- Best-in-class breadth (Mealime, Kitchendary, Culina): keto, paleo, Mediterranean, vegetarian,
  vegan, low-FODMAP, gluten/dairy-free, **allergen filtering at the ingredient level**,
  intermittent-fasting windows, cuisine preferences, and **per-household-member restrictions**
  — all layerable simultaneously.
- The AI advantage: "handle any restriction described in plain English." We already do this via
  the free-text "can't/won't eat" field + the AI prompt.

**→ For our app:** cheap wins are a **diet-type selector** (omnivore / vegetarian / vegan /
pescatarian / keto / Mediterranean) that maps to a single prompt line and, in offline mode, to
the `tags` we already have on recipes; plus a **cuisine preference** chip row (Italian, Asian,
Mexican…). Both are one prompt line each. Per-member different diets is powerful but complex —
future.

Sources: [Fortune — best meal planning apps 2026](https://fortune.com/article/best-meal-planning-apps/),
[Kitchendary guide](https://weeklymealsplanner.app/guides/healthy-meal-planning-app).

---

## 8. Accessibility — now a legal floor in the EU

- **European Accessibility Act** in force since **June 2025**: goods/services offered in the EU
  must meet **WCAG 2.1 AA**. Lucille is in France → this applies if the app is ever a real product.
- AA essentials that are cheap for us: **4.5:1 contrast** for normal text (3:1 for large),
  full **keyboard navigation** with visible focus outlines, screen-reader-readable ingredient
  quantities, and large touch targets.
- Hands-free / voice cooking (Cookie, Voicipe, Yes Chef) is the accessibility frontier for the
  *cook* step specifically — messy hands, low-vision, busy cooks. Our cook mode already has
  keyboard nav (←/→/Esc) and big text; a "read step aloud" button using the browser's built-in
  **SpeechSynthesis API is free** and would be a standout.

**→ For our app:** (1) audit our terracotta-on-cream and green badge contrast against AA and
fix any that fail; (2) add visible focus styles + ARIA on the questionnaire and cook mode;
(3) optional: a 🔊 "read this step" button in cook mode via `speechSynthesis` — zero cost,
genuinely differentiating, and directly serves the accessibility mandate.

Sources: [AFixt — mobile accessibility best practices](https://afixt.com/mobile-app-accessibility-best-practices-for-inclusive-design/),
[OrganizEat — accessible recipe formatting](https://home.organizeat.com/blog/accessible-recipe-formatting-best-practices/),
[Cookie — hands-free cooking](https://cookievoicerecipes.com/).

---

## 9. Free data sources (if we ever want real numbers)

- **Open Food Facts** — nonprofit, **no API key**, 2.5M+ products from 180+ countries; barcode →
  ingredients, nutrition, **Nutri-Score**, allergens, images. `world.openfoodfacts.org/api/v2`.
- **Open Prices** (same org) — community-sourced real prices, open API. Could one day replace
  our AI price *estimates* with real data for common products.
- Free-tier alternatives: **Edamam** (900k foods, recipe + nutrition analysis), **Nutritionix**
  (natural-language, strong restaurant catalog), **Chomp** (barcode). All have free developer tiers.

**→ For our app:** not needed now (AI estimates are fine and simpler), but this is the documented
escape hatch if we ever want verified nutrition or prices *without* spending money. Open Food
Facts is the one to reach for — no key, no signup, no cost, aligns with our ethos.

Sources: [Open Food Facts API](https://prices.openfoodfacts.org/api/docs),
[Suggestic — 17 food APIs](https://blog.suggestic.com/food-api-ultimate-list),
[DEV — 8 free food APIs no key](https://dev.to/0012303/8-free-food-nutrition-apis-no-key-tested-2026-3doh).

---

## 10. Consolidated backlog (from this STORM, ranked by value ÷ cost)

All are compatible with zero-spend / single-HTML / Gemini-free-tier. **Items 1–4 shipped
2026-07-18 (Phase 6)** — see CLAUDE.md. The rest is the remaining menu.

| # | Feature | Why (evidence) | Cost | Notes |
|---|---|---|---|---|
| 1 | ✅ **Real calorie target** (Mifflin–St Jeor) — age + height added, TDEE computed, shown as a banner, fed to the AI prompt | §2 — grounds portions in real numbers; table stakes in 2026 | Low | DONE. `computeTargets()` in both HTML and server.js. |
| 2 | ✅ **"Cook once, eat twice"** leftovers toggle | §5 — biggest under-served need; free logic | Low | DONE. `applyLeftovers()` — post-processes any week (AI or offline); dinner batch-doubled, leftover lunch buys nothing. |
| 3 | ✅ **Pantry staples** checklist that subtracts from the list | §5 — cuts waste & cost | Low | DONE. `pantryHas()` filters the shopping list; shows "hiding N items". |
| 4 | ✅ **Read-step-aloud** in cook mode (`speechSynthesis`) + AA contrast/focus audit | §8 — legal in EU, differentiating, free | Low | DONE. 🔊 button in cook mode; small orange labels darkened to `--accent-deep`; focus-visible + reduced-motion added; ARIA on dialog & icon buttons. |
| 5 | **Diet-type + cuisine selectors** | §7 — breadth expected of top apps | Low | One prompt line each. NEXT candidate. |
| 6 | **Gentle "weeks planned" counter**, warm returning-user copy | §3 — healthy retention without harm | Low | No punishing streaks. |
| 7 | **"Why we ask" microcopy** on heavier questionnaire fields | §6 — explaining why lifts conversion | Low | A few lines of text. |
| 8 | **PWA** (installable on phone) | general — meets users on mobile | Med | Manifest + service worker. (Also in RESEARCH.md.) |
| 9 | **French / English toggle** | Lucille + Jow's market is French | Med | Doubles strings; do deliberately. |
| 10 | **Groq provider** (~14.4k req/day vs Gemini's 20) | RESEARCH.md — kills quota ceiling free | Med | Needs Lucille's free Groq account + server rewrite. |
| 11 | Real nutrition/prices via **Open Food Facts** | §9 — verified data, still free | Med | Only if AI estimates ever feel insufficient. |
| — | Recipe *import* from user's own sources (TikTok/photos) | §4 — real unmet need | High | Different product. Note only. |

**Suggested next sprint (all Low cost, compounding value):** #1 → #2 → #3 → #4. Together they
turn the app from "a pretty AI menu" into "a nutritionally-grounded, waste-cutting, accessible
weekly kitchen assistant" — which, against the field surveyed here, would genuinely be
best-in-class for a free product.

---

## 11. Honest caveats about this research

- Web sources include vendor blogs and SEO round-ups; statistics (conversion %, engagement
  lifts, market size) are directional, not gospel — treat them as "which way is up," not exact.
- No competitor's *private* analytics are public; churn/retention figures are industry
  aggregates.
- Everything here is filtered through our hard constraints (zero spend, no accounts, single
  file). Some "best practice" (wearables, adaptive TDEE, delivery integration) is deliberately
  excluded as out-of-scope, not overlooked.
