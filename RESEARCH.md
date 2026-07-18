# Market Research & Redesign Plan — Meal Planner

_Written 2026-07-18 by Claude (Sonnet 5) for Lucille, and as a handoff document so
Opus (or any future Claude session) can pick this up without missing anything._

**Read `CLAUDE.md` first** — it holds the project history, architecture, deploy setup
(Render + GitHub), and all locked-in decisions (zero spend, Gemini free tier, single
HTML file, teach-as-we-go). This file covers: (1) competitor research, (2) the quality
criteria derived from it, (3) exactly what was changed in the 2026-07-18 redesign,
(4) what was deliberately NOT done and why, (5) future roadmap.

---

## 1. Competitor research (done 2026-07-18, live web research)

### The apps studied

| App | Status | What makes it win | What users complain about |
|---|---|---|---|
| **Mealime** | 4.8★ iOS (35k reviews), 7M users, free tier genuinely usable | Radical simplicity: short onboarding, ~30-min recipes, step-by-step **cooking mode** (hands-free), auto grocery list organized by aisle, Instacart integration | Grocery list **resets checked-off items** when the plan changes (their most-cited UX bug); advanced diet filters paywalled ($2.99/mo) |
| **Eat This Much** | Free basic + $9/mo premium | **Calories & macros per meal**, plans built around a numeric goal; automatic grocery lists | Repetitive recipes; shopping list huge & not organized by category; free tier capped at daily (not weekly) plans; ads |
| **Jow** (France, 9M users) | Free (paid by supermarkets) | **Household-size scaling** (exact quantities per number of people), turns the week's menu into a real supermarket cart (Carrefour, Leclerc…), ~5,000 recipes, saves users ~10%/week | Locked to partner supermarkets; recommends sponsored products; app-first (weak web) |
| **PlateJoy** | **Shut down** | (Was: deep lifestyle quiz → personalized plans) | Proof that a subscription meal planner without a strong free tier dies |
| **Samsung Food** (ex-Whisk) | Free + $6.99/mo | Save recipes from any website; 240k recipes; strong free tier | Intrusive diet ads in free tier; best experience locked to Samsung ecosystem; multi-device sync degraded |
| **Paprika 3** | $4.99 one-time | Best-in-class recipe *organization* | It's a filing cabinet, not a planner — no generation |
| **Plan to Eat** | Subscription | Great for families, drag-and-drop calendar | Manual: you bring your own recipes; nothing is generated |

### Why users abandon meal-planning apps (churn research)

1. **Too many taps** — clunky flows kill retention faster than missing features.
2. **Feature bloat** — apps that try to do everything become annoying; the winners do one loop extremely well.
3. **Paywalls on basics** — users invest time entering preferences, then discover planning/export is paid. Feels like a trap.
4. **Over-collection of personal data** — 60% of people have refused an app over data hunger. Ask only what shapes the output.
5. **Boring repetition** — same meals every week (this killed meal-kit retention too; ~70% churn within 3 months industry-wide).

### Food-app design research (what makes food UIs appetizing)

- **Warm colors stimulate appetite** (reds, oranges, terracotta, golds); blue suppresses it. Support with clean neutrals/cream, not stark white or grey.
- **Big rounded cards, generous white space** → signals "clean and fresh".
- **Images matter more than text** for meal decisions — but a *wrong/ugly* photo is worse than no photo. Random stock photos that don't match the dish undermine trust.
- **Minimal friction end-to-end**: the fewer screens between "I'm hungry" and "here's my list", the better.
- **Typography**: a warm serif/display face for headings + a clean sans for body is the current food-brand idiom (see Jow, Mealime marketing).

### Sources

- [FoodiePrep — 10 Best Meal Planning Apps 2026](https://www.foodieprep.ai/blog/meal-planning-apps-in-2026-which-tools-actually-simplify-your-kitchen)
- [Eat This Much blog — Best Meal Planning Apps](https://blog.eatthismuch.com/best-meal-planning-apps/)
- [Mealime Review 2026 — The Sunrise Digest](https://thesunrisedigest.com/eat/mealime-review-2026/)
- [Plan to Eat — Mealime pros & cons](https://www.plantoeat.com/blog/2023/04/mealime-app-review-pros-and-cons/) (the grocery-list-reset complaint)
- [Plan to Eat — Eat This Much pros & cons](https://www.plantoeat.com/blog/2023/10/eat-this-much-app-review-pros-and-cons/)
- [Jow — comment ça marche](https://jow.fr/pages/misc/jow-comment-ca-marche) and [independent review](https://davidgos.fr/jow-lapplication-qui-a-enfin-sauve-mes-diners-et-mon-budget/)
- [Plan to Eat — Samsung Food review 2026](https://www.plantoeat.com/blog/2026/01/samsung-food-review-pros-and-cons/)
- [OrganizEat — what Reddit users hate in meal planners](https://home.organizeat.com/blog/meal-planner-app-reddit/)
- [Toptal — food app design guide](https://www.toptal.com/designers/ux/food-app-design), [uitop — food app design best practices](https://uitop.design/blog/design/food-app-design/)

---

## 2. The quality criteria (what "absolute best" means here)

Derived from the research, ranked. ✅ = implemented in the 2026-07-18 redesign.

1. ✅ **Fastest loop in the category**: profile → week → list in 3 screens, no account, no paywall, nothing collected that doesn't shape the output. (We already beat everyone here — kept it.)
2. ✅ **Appetizing, trustworthy design**: warm terracotta/cream palette, display serif + clean sans, big rounded meal cards, generous spacing, subtle motion.
3. ✅ **Cooking mode** (Mealime's killer feature): full-screen, one step at a time, huge text readable from across the kitchen, prev/next.
4. ✅ **Nutrition at a glance** (Eat This Much's edge): kcal + protein per meal, kcal total per day. Estimates, clearly labeled as such.
5. ✅ **Household scaling** (Jow's edge): "How many people?" → all quantities and prices scale.
6. ✅ **Shopping list that respects your work** (fixes Mealime's #1 complaint): checked-off items persist across re-renders, screen changes, and page reloads.
7. ✅ **Favorites** (anti-repetition): ♥ any meal; favorites are kept, survive weeks, and get priority when generating offline weeks.
8. ✅ **Take the list with you**: copy-as-text button + print-friendly stylesheet (works as PDF via the browser print dialog).
9. ✅ **Honest images**: replaced random stock photos (loremflickr — often wrong dish, slow, ugly) with beautiful emoji tiles on warm per-meal-type gradients. A wrong photo is worse than a pretty tile. Real photography is future work (needs an asset pipeline or paid API — see §5).
10. ✅ **Quota honesty**: keep the "Use real AI" toggle (Gemini free tier = 20 requests/day, confirmed) with clear, friendly copy.

---

## 3. What was changed on 2026-07-18 (the redesign)

All in `meal-planner.html` (frontend) and `server.js` (prompt only). Same architecture,
same zero dependencies, same single-file frontend, same free hosting.

### Design system (new)
- Palette: cream background `#faf6ef`, ink `#26221c`, terracotta accent `#d95d2a`,
  deep green secondary `#2f7d5b` (kept for "healthy" accents/badges), soft shadows,
  16px radius cards.
- Fonts: **Fraunces** (headings) + **Inter** (body) from Google Fonts, with system
  fallbacks — free, one `<link>`, degrades gracefully offline.
- Meal thumbs: emoji on per-type gradients (breakfast amber, lunch green, dinner terracotta).
- Micro-interactions: card hover lift, fade-in on screen change, smooth transitions.
- Print stylesheet: `@media print` hides chrome, shows just the shopping list.

### New features (each mapped to a criterion in §2)
- **Cook mode** (§2.3): every recipe card has a "▶ Cook" button → full-screen overlay,
  step N of M, big text, ingredient reference, prev/next/done. Pure CSS/JS overlay.
- **Nutrition** (§2.4): AI schema now includes `kcal` (integer) and `protein` (g) per
  meal; badges on meal cards + recipe pages; per-day kcal totals on the review screen.
  The 21 offline fallback recipes got hand-estimated kcal/protein values so the UI is
  consistent in both modes. Labeled "est." everywhere — these are estimates.
- **People / household size** (§2.5): new profile field `people` (1–8, default 1).
  AI prompt: portions & prices for N people. Offline mode: quantities × N, prices × N.
- **Persistent checkboxes** (§2.6): `state.checked` (object keyed by item name|unit),
  saved to localStorage with everything else, survives reloads; cleared only by
  "Start a new week" or "Clear saved data".
- **Favorites** (§2.7): ♥ toggle on every meal card and recipe; stored in
  `state.favorites` (deduped by name, capped at 40); favorite recipes matching the
  meal type are injected into the offline generation pool with priority; favorites
  survive "Start a new week".
- **Copy & print** (§2.8): "Copy list" builds a plain-text list → clipboard;
  "Print / PDF" triggers the print stylesheet.

### Backend prompt changes (`server.js`)
- `shape` schema: added `"kcal"` and `"protein"` fields per meal.
- `who` block: added `People to cook for: N` and instruction that ALL ingredient
  quantities and prices are for N people.
- Nothing else touched — endpoints, key handling, retries, sanitizing all unchanged.

### Data-shape changes (additive, backward-compatible)
```
Profile  += { people: number }          // default 1
Recipe   += { kcal?: number, protein?: number }   // optional; UI hides if absent
state    += { favorites: Recipe[], checked: {[key]:true} }
```
Old saved localStorage data still loads fine (new fields default sensibly).

---

## 4. Deliberately NOT done (and why)

- **Real food photography** — every free option is bad: loremflickr = random wrong
  photos; Unsplash Source API is deprecated; scraping is fragile/illegal. Doing it
  right needs either a curated local asset set or a paid API. Emoji tiles are honest
  and fast. (Candidate future approach: ~100 curated self-hosted thumbnails keyed by
  dish keywords.)
- **Supermarket cart integration (Jow's moat)** — requires commercial partnerships/APIs
  (Carrefour etc.). Impossible at zero spend. The copy/print list is the honest substitute.
- **Accounts + cross-device sync** — deliberate later-phase (see CLAUDE.md §9). localStorage
  is enough for a single-user product; adding auth now = friction the research says kills apps.
- **Switching AI provider to Groq** (~14,400 free req/day vs Gemini's 20) — real option,
  needs Lucille to create a free Groq account + a provider rewrite in server.js.
  Proposed to her; do only with her go-ahead.
- **PWA (installable, offline)** — nice-to-have; needs a manifest + service worker.
  Low risk, medium reward. Good next task.
- **French language / i18n** — the app is English; Lucille is French and Jow's audience
  is French. A language toggle is a strong candidate next feature. Not done: doubles
  every string; do it deliberately, not as a side effect.

---

## 5. Roadmap after this redesign (in suggested order)

1. **Deploy** the redesign (push via GitHub Desktop → Render auto-deploys). Verify live.
2. **Groq provider option** (if Lucille approves): free account, ~14,400 req/day,
   OpenAI-compatible API; keep Gemini as fallback. Kills the 20/day ceiling at zero cost.
3. **PWA**: manifest + icon + service worker → installable on her phone home screen.
4. **French/English toggle.**
5. **Curated photo set** for the ~21 fallback recipes + common AI dishes.
6. **"Cook once, eat twice"** option (batch-cooking: dinner leftovers become next
   day's lunch) — reduces cost & effort, no competitor does this well.

## 6. How to verify after any change

Local: `node server.js` from the project folder → http://localhost:8787 → run through
profile → generate (AI **off** — don't burn quota testing) → review (swap a meal,
♥ a meal) → recipes (open cook mode) → shopping list (check items, reload page,
confirm checks survive; copy list; print preview). Then push to deploy.
