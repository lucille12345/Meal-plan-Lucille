# Meal Planner — Project Memory (CLAUDE.md)

_Last updated: 2026-07-17. This file is auto-loaded by Claude Code every session._

Source of truth for the meal-planner project. Phases 1, 2 (+ extra features) and 3 (saving) are
built and working on Lucille's Mac. **Phase 4 (go live / hosting): code is ready; deploy to
Render is still pending** — that's the current task (see §10).

> **How to resume:** the working code now lives in
> `~/Work/claude/Projects/Meal plan Lucille/` (Lucille reorganised into a `Projects/` folder on
> 2026-07-16; there's also an unrelated `Projects/Financial planning/` beside it — leave that
> alone). Files: `meal-planner.html`, `server.js`, `gemini-key.txt`, plus the new deploy files
> `package.json`, `render.yaml`, `.gitignore`. Read them plus this file, then help finish the
> Render deploy.
> Always show proposed edits before applying them — Lucille prefers to approve each change.

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
- **Phase 4 — Go live.** IN PROGRESS. Host the whole app (frontend + backend together) on
  Render's free tier so it isn't only on Lucille's Mac. Code changes done & tested locally;
  the actual GitHub push + Render deploy is the remaining step (§10).

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
- Backend local only until the Render deploy is finished → **Phase 4, IN PROGRESS (§10)**.
- Render free tier "cold starts": the service sleeps after ~15 min idle and takes ~30–50 s to
  wake on the next visit. App doesn't break — the first "Generate" after idle just spins longer.
  (Decided 2026-07-17: acceptable for now.)
- Gemini free tier is ~20 generations/day for the whole app — fine for personal use; would be
  the first thing to hit if the URL is shared. (Decided 2026-07-17: ship as-is, revisit if shared.)
- Prices are AI estimates — decent but sanity-check against real receipts.
- Swaps don't yet take a free-text "why" note (backend already supports an avoid-list).

---

## 10. Phase 4 deploy — remaining steps (do from the Terminal Claude Code session)

Code is ready & tested locally. Left to do (needs Lucille's own GitHub + Render accounts; Claude
can't create accounts or push on her behalf):
1. In `~/Work/claude/Projects/Meal plan Lucille/`: `git init`, commit (the `.gitignore` keeps
   `gemini-key.txt` out), create a GitHub repo, and push.
2. On render.com → New → Blueprint → connect that repo → it reads `render.yaml`.
3. When Render asks for `GEMINI_API_KEY`, paste the key from `gemini-key.txt`.
4. Render returns a live URL (e.g. `https://meal-planner-xxxx.onrender.com`) = the whole app.
5. Back in Claude: confirm it's live, then mark Phase 4 DONE here and record the live URL.

Note: the key currently sits in `gemini-key.txt` (git-ignored). On Render it lives only as the
`GEMINI_API_KEY` env var — never commit the key.
