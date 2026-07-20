# OPUS BUILD BRIEF — Meal Planner v2: from website to real app
### For the Claude *Opus* build session. This is the complete, decided spec. Execute it.

_Written 2026-07-18 by Claude (Fable 5) for Lucille. Read `CLAUDE.md` first (history,
deploy, constraints), then `DESIGN-BRIEF.md` + the `design/` folder (visual truth — lift
tokens/markup 1:1; do not invent your own styling). `RESEARCH.md` and `STORM-RESEARCH.md`
are background. Working rules: Lucille is a beginner — explain as you go, small steps,
show proposed changes before applying, verify in the browser with AI OFF (Gemini = 20
req/day), never commit secrets, deploy only when she says so._

---

## 0. What "app, not website" means here (DECIDED with Lucille 2026-07-19)

**Ship TWO downloadable targets from ONE web codebase, both free, both first-class on
phone AND computer** (Lucille chose "Both PWA + desktop" / "Both devices equally"):

- **Target A — Installable PWA** (phone home-screen + desktop browser "Install"):
  `manifest.json` (name, icons, standalone display, theme color) + service worker (offline
  app-shell, cached assets, **web push**). iOS Safari supports web push for installed PWAs
  since 16.4. This is the phone story and the instant-web story.
- **Target B — Desktop download** (a real file people download & run): wrap the SAME
  `/public` frontend in **Tauri** → outputs `.dmg` (Mac) + `.msi`/`.exe` (Windows), ~5–10 MB.
  Tauri is free, cross-platform, and reuses the web UI unchanged. (Fallback: **Electron** if
  the Rust toolchain is troublesome to install — heavier ~100 MB but Node-only, already set
  up. Prefer Tauri; only fall back if Tauri won't build cleanly.)
- **Distribution (free):** host the desktop files on **GitHub Releases**; the PWA installs
  from the Render URL. Honesty note for Lucille: an *unsigned* Mac app makes the user
  right-click → Open the first time (a one-time warning); code-signing to remove it needs
  Apple's $99/yr — optional, skip under zero-spend. App Store listing is the only truly
  paid route and is explicitly OUT of scope.

**One codebase, two wrappers — do NOT fork the UI.** The web app-shell in `/public` is the
single source of truth; PWA and Tauri are thin packaging layers over it.

**Architecture (decided):** framework-free, build-step-free web core; split files (single-
file HTML no longer viable at this scale).
```
/public                    ← the app (shared by PWA + Tauri, served by Render)
  index.html   app.js   styles.css   assets/
  manifest.json   sw.js   icons/
/src-tauri                 ← Tauri wrapper (points its webview at the built /public)
  tauri.conf.json   icons/   (Rust shell; no app logic lives here)
server.js                  ← pure Node: serves /public + /generate-week, /generate-meal
```
Both targets call the SAME hosted backend on Render (holds the Gemini key; Supabase is
cloud) — so the desktop app ships NO secrets. `server.js` stays pure Node (extend its
existing static serving). Auth/DB/storage go through Supabase from the client; localStorage
is the offline cache under Supabase, synced on login. The Tauri desktop app points at the
hosted URL (online) with the cached shell for offline — do not bundle the key locally.

## 1. Accounts & sign-in (her requirement: sign up first, stay connected, personalized)

**Supabase free tier** (Lucille must create the account — see §9): Postgres + Auth +
Storage + Edge Functions, no card. Client: `@supabase/supabase-js` via ESM CDN import.
- Auth methods: **email magic link** (primary — no passwords to forget) + **Google sign-in**.
- Gate: landing page is public marketing (see DESIGN-BRIEF §4.01); everything else requires
  a session. After login → onboarding if no profile, else planner.
- Tables (RLS on, owner-only):
  `profiles` (user_id PK, questionnaire JSON, targets JSON, settings JSON),
  `weeks` (id, user_id, week_start date, week JSON, created_at),
  `favorites` (id, user_id, recipe JSON, created_at),
  `photos` (id, user_id, recipe_name, storage_path, created_at).
- **User photos**: Supabase Storage bucket `dish-photos` (private, 1 GB free); upload from
  recipe detail; compress client-side (canvas, ≤1600px, JPEG q0.8) before upload.
- Migration: on first login, if localStorage has old v1 state, offer one-tap import.

## 2. The planner (Woolworths structure — her #1 want)

Two modes, one screen (design 04):
- **"Plan for me"** (existing flow): generate the full week (AI or offline pool) into the
  Mon–Sun sidebar.
- **"Browse & add"** (new): categorized carousels — sources: her favorites, user-photo
  dishes, the built-in pool, and past AI weeks (stored in `weeks`) — each card has ⊕ →
  pick day + slot. Drag-and-drop card→day on desktop (HTML5 DnD); ⊕ tap flow on mobile.
- Any slot: ✕ swap (existing logic), ♥ favorite, tap → recipe detail.
- Week persistence: current week saved to `weeks` (and localStorage cache) on every change.

## 3. Meals: 3 courses, no repeats, real links, photos (her requirements)

- **Course structure**: lunch & dinner become `courses: { starter, main, dessert }` (each a
  recipe object; starter/dessert lighter). Whether starter+dessert appear is driven by the
  goal & calorie budget: "Feel light" → main + light starter OR fruit dessert; "Stay
  balanced" → main + one side course; "Get stronger" → all three. Breakfast stays single
  but respects the **sweet vs savory** preference (§6). Offline pool: add ~8 starters and
  ~8 desserts with kcal/protein so offline mode renders the same shape.
- **Hard no-repeat rule**: no dish name appears twice in a week — enforce in the AI prompt
  AND post-validate: on collision, request/pick a replacement. Also de-dupe against the
  previous stored week when possible.
- **Real recipe links**: NEVER let the AI emit URLs (they hallucinate dead links). Build
  them deterministically: `https://www.google.com/search?q=<encoded dish name> recette` —
  label "See full recipe ↗". Always works, feels professional, zero fabrication.
- **Images**: curated Unsplash CDN mapping for the built-in pool + a keyword→image fallback
  table for AI dishes (~40 common dish keywords: curry, salmon, pasta, salad, soup, tacos,
  omelette…), falling back to the emoji-gradient tile when no keyword matches. User photos
  (§1) override everything for that dish.

## 4. Pricing & shopping (her requirement: per-day prices)

- Show **€/day** chips per day + day totals in the shopping list; week total stays as a
  secondary line. Budget question becomes **€/day** (migrate old weekly value ÷ 7).
- AI prompt: prices per ingredient as today; totals computed client-side per buy-day.
- Keep: pantry-staples subtraction, persistent ticks, copy/print. Add: "Remind me" (§5).

## 5. Integrations (exact free implementations — no invented services)

**Google Calendar (her request):** two tiers, build both:
1. **Tier 1 – .ics export (ship first, zero setup)**: "Add my week to my calendar" →
   generate an .ics file client-side: dinner events (19:00, recipe name + link in notes) and
   shopping-reminder events on each buy-day (17:00, items list in description). Works with
   Google/Apple/any calendar.
2. **Tier 2 – live Google Calendar sync**: Supabase Google OAuth with
   `calendar.events` scope → insert events via Google Calendar API from the client.
   Requires Lucille to create a free Google Cloud project + OAuth consent screen (§9).
   Presented in onboarding connect-step and Features drawer as "Connected ✓ / Connect".

**Reminders (her SMS request — honest substitution):** real SMS is **not free** (Twilio
et al. are paid; email-to-SMS gateways are dead in France) — do NOT fake it. Implement:
- **Web push** (free, the PWA way): service-worker push on shopping days ("🛒 Tonight:
  buy for tomorrow — salmon, broccoli…"). Store subscription in `profiles.settings`.
  Scheduling: Supabase Edge Function on a cron (free tier) firing web-push.
- **Email fallback**: same Edge Function sends the day's list via **Resend** free tier
  (100 emails/day) for users who decline push. Phone-number field: include in the drawer
  UI but disabled with tooltip "SMS coming later — needs a paid service; Lucille's call."

**Feedback to Lucille (her request):** small "💬 A thought? Tell Lucille" card in the
Features drawer + footer → form (message + optional email) POSTing to **FormSubmit.co**
endpoint for `lucillemonamie@icloud.com` (free, no account; use their AJAX endpoint +
honeypot field; first submission triggers their one-time confirmation email to her).

## 6. Questionnaire v2 (post-signup onboarding; friendly words only)

Multi-step (design 03), each step with a one-line "why we ask". New/changed items in bold:
1. **Welcome** — name (what should we call you?).
2. **You** — weight, height, age, gender, **household size**.
3. **Your rhythm** — life stage, activity type + times/week.
4. **Your goal** — **"Feel light 🍃 / Stay balanced ⚖️ / Get stronger 💪"** (maps internally
   to lose/maintain/gain — UI never shows clinical words; keep internal keys stable).
5. **Your tastes** — **sweet or savory breakfast (or surprise me)**, cuisine preferences
   (chips: French, Italian, Asian, Mexican, Middle-Eastern, "surprise me"), dislikes,
   allergies, free-text avoid.
6. **Your kitchen** — cooking confidence, time per meal, **"cook once eat twice?"**,
   pantry staples.
7. **Your numbers** — computed target shown ("~2,430 kcal — sound right?") with **per-meal
   kcal override sliders** (auto-split 25/40/35%, user-adjustable), **budget €/day**, city.
8. **Connect (skippable)** — Google Calendar + reminders benefit cards (design 03).
All editable later from Profile/Features drawer. Persist to `profiles` at each step.

## 7. AI prompt v3 (server.js)

Extend the existing prompt builder (keep all Phase 5/6 rules: portions, prices, kcal &
protein per meal, people scaling, leftovers): **courses object** for lunch/dinner per §3
with per-course kcal; **breakfast sweet/savory** per preference; **unique dish names across
the entire week — repeat = invalid response**; per-meal kcal targets from §6.7 (±10%);
budget interpreted per day; cuisine preferences honored. Update `normalizeRecipe` +
offline generator to the same shape. Raise `maxOutputTokens` if the bigger JSON needs it;
keep sanitize+retry.
**Quota:** 3-course weeks are bigger responses; Gemini free = 20 req/day. Recommend to
Lucille again: free **Groq** account (~14k req/day) as a second provider (`PROVIDER` env
switch, OpenAI-compatible endpoint) — build it if she says yes.

## 8. Build order (each phase verified in-browser, AI OFF, before the next)

1. **Restructure** to /public multi-file app-shell; port ALL Phase 5+6 features intact;
   regression-check against CLAUDE.md Phase 5/6 lists.
2. **Design integration**: lift `design/` tokens & markup → real screens.
3. **Supabase**: auth gate, tables+RLS, profile sync, migration, photos.
4. **Landing page** (public) per design 01.
5. **Questionnaire v2** (§6) + targets engine wiring.
6. **Meals v3**: courses, no-repeat validation, links, image mapping (§3, §7).
7. **Planner v2**: sidebar week + carousels + DnD (§2).
8. **Shopping v2**: per-day prices (§4).
9. **PWA (Target A)**: manifest, sw, offline shell, install prompt; verify installable on
   iOS Safari + desktop Chrome (Lighthouse PWA pass).
10. **Integrations**: .ics → push+email reminders → Calendar OAuth → feedback form (§5).
11. **Desktop app (Target B)**: scaffold Tauri over `/public`, point webview at the Render
    URL with offline shell fallback, app icons from the design set, build `.dmg` + `.exe`,
    smoke-test the produced files, document the GitHub Releases publish step. (Electron
    fallback only if Tauri's Rust toolchain won't install cleanly.)
12. **QA sweep** (§10) → Lucille reviews → deploy (git push → Render) + cut a GitHub Release
    with the desktop files, only on her word.

## 9. What Lucille must set up (all free — walk her through each when reached)

1. **Supabase** account + project (supabase.com) → URL + anon key into the app config.
2. **Google Cloud** project (console.cloud.google.com) → OAuth consent + client ID for
   Google sign-in and Calendar tier 2. (Skippable until phase 10.)
3. **Resend** account (resend.com, free 100/day) for email reminders. (Phase 10.)
4. **FormSubmit**: nothing to create — she just clicks the confirmation email once.
5. Optional: **Groq** account for the 14k/day AI provider.
6. Decision she owes you: SMS = paid (Twilio) — yes/no later; push+email meanwhile.
7. **Desktop build tooling** (phase 11, all free): install **Rust + Tauri CLI** (Tauri
   needs it to build; walk her through `rustup` + `cargo`). A **GitHub account/repo** already
   exists (she uses GitHub Desktop) — the desktop files ship via **GitHub Releases** (free).
   No Apple/Microsoft signing unless she later wants to remove the unsigned-app warning
   (Apple $99/yr — optional, out of scope for now).

## 10. QA checklist ("no doubles", her explicit complaint — verify every phase)

☐ No dish name twice in a week (incl. across courses). ☐ No ingredient listed twice in one
list section (merge works incl. new courses). ☐ No duplicate favorites (dedupe by name).
☐ No repeated UI blocks/copy; every button does exactly one thing; no two features doing
the same job. ☐ No orphan v1 code left after restructure. ☐ Reload mid-anything loses
nothing (Supabase + localStorage). ☐ Lighthouse PWA installable pass. ☐ AA contrast, focus
order, cook-mode read-aloud still works. ☐ All copy proofread, warm, zero clinical terms.
☐ Zero console errors; zero requests to Gemini with AI off; key never in client code
(incl. the shipped desktop binary — verify it contains no secret). ☐ PWA (Target A)
installs on iOS Safari + desktop Chrome. ☐ Desktop app (Target B) `.dmg` and `.exe` build,
launch, and reach the hosted backend; same UI as the web (no forked layout). ☐ Both targets
look right at 375px and 1280px.
