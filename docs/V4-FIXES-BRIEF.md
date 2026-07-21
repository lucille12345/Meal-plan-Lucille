# V4 — FIXES BRIEF

_Written 2026-07-21, from Lucille's feedback after using the live V3 app._
_Same conventions as `docs/V3-REDESIGN-BRIEF.md`: no line numbers anywhere, every reference is a
`grep` anchor. **Read `§00` before starting any phase.**_

---

## §00. How to run this build

### §00.1 What Lucille actually said

Her words, kept verbatim so nothing gets softened in translation:

1. *"The connect to your google account doesn't work yet."*
2. *"Don't do the email sign in but rather with the creation of a password because otherwise I am
   overly limited in how many times I can open this."*
3. *"I really enjoy the opening page however. It's really nice. The colors and all have to go
   together. Here the brown and green don't go well together at all because they only appear once
   each. Research a bit about color theory. If you want to put on the same page a certain color
   that same color needs to appear a second time on that same page visibly so it looks good."*
4. *"Google calendar and shopping reminders also aren't active yet."*
5. *"I like the drag and drop but they should be able to drag and drop anywhere they want (a dinner
   plate can also be a lunch plate or a breakfast plate, dessert can also be a starter or a
   breakfast…)."*
6. *"The X or heart should appear next to the name of the dishes per day in the normal page and
   every day the structure should be type of meal at the top in bold and different font, next line
   the image and name of the dish and right under the name heart and cross."*
7. *"I really like what happens when you click on the foods but I want the swap dishes (when you
   click on the dish in the main frame of the app) to show 2 options: 1 random dish, 2 drag and
   drop. If the X is pressed and nothing is chosen then it is of course the random dish."*
8. *"There are a lot of dishes without pictures. Please make sure the database with dishes all have
   pictures and if they don't, research or ask me to do so and for which dish."*
9. *"I really like the rest though! It's really nice and professional and beautiful."*
10. *"Make another database showing certain ingredients and their prices because there are way too
    many gaps right now. Also if it says half of something then the price I want written is the
    price of the full thing (for example half an onion is 1.50 euros not 0.75)."*

### §00.2 Build order and model per phase

**Nine phases, one per session.** Do not work top-to-bottom by section number — follow this table.

| # | Phase | Model | Why this model | Depends on |
|---|---|---|---|---|
| 1 | Password sign-in (§1) | **Sonnet** | Mechanical Supabase API swap, but security-adjacent — follow §1's checklist exactly | — |
| 1b | Google sign-in (§1.5) | **Lucille** | Google Cloud console work, not code | — |
| 2 | Colour rebalance (§2) | **Sonnet** | Design judgment, but §2 gives a mechanical rule to apply | — |
| 3 | A photo for every dish (§3) | **Sonnet** | Data gathering + link verification, high volume, low risk | — |
| 4 | Ingredient prices v2 (§4) | **Opus, thinking high** | The whole-item rounding rule has a subtle aggregation trap — see §4.3 | — |
| 5 | Day card restructure (§5) | **Sonnet** | Contained markup + CSS change | — |
| 6 | Drag and drop anywhere (§6) | **Opus, thinking high** | Touches the week data model, course shape, leftovers | 5 |
| 7 | Swap overlay, two options (§7) | **Opus, thinking high** | Sits on top of 5 and 6; the fallback path must not regress | 5, 6 |
| 8 | Calendar + reminders (§8) | **Sonnet** + **Lucille** | Code is small; most of the work is her deploying things | — |
| 9 | Final verification (§9) | **Opus, thinking high** | Whole-app pass | all |

Phases 1–4 are independent of each other and of 5–7. If a session has room, 1+2 or 3+4 can share
one — but **never** merge 6 or 7 into anything else.

### §00.3 Session hygiene

- **One phase per session.** Start each session by reading `CLAUDE.md`, then this file's `§00` and
  the section for your phase only.
- **Commit at the end of each phase** with a message naming the phase and section
  (e.g. `Phase 4: ingredient prices v2 (V4 §4)`).
- **Update `CLAUDE.md`** at the end of each phase with what actually changed, what was verified,
  and anything you deliberately did not do. Write down surprises — that file is the only memory
  the next session has.
- **Bump `CACHE` in `public/sw.js`** on any change to a shipped file. It is at `foodie-shell-v5`.
  Next is `foodie-shell-v6`, then `-v7`, one per phase that touches `public/`.
- **Claude cannot push.** Lucille pushes via GitHub Desktop → Push origin. Render auto-deploys.

### §00.4 The rules that override everything

1. **The database comes before Gemini, always.** V3 §0's precedence rule stands. No phase here may
   make the app call the AI to do something the local data can do.
2. **Fail closed on allergens.** Every phase that touches dish selection, drag-and-drop, or swapping
   must run the result through `passesDietFilters()`. V3's phase 9 found a real safety bug here
   (`acceptAIDish` in `public/app.js`) — do not create a path that bypasses it.
3. **Never invent a URL, a photo, or a price.** If you cannot verify it, say so and ask. §3 and §4
   both have explicit "ask Lucille" paths — use them rather than guessing.
4. **Don't burn the Gemini quota.** 20 requests/day, free tier. Stub `fetch` to test client code.
5. **Stop and ask rather than guess.** If a phase's instruction conflicts with what you find in the
   code, write down the conflict and ask. Do not silently pick one.

### §00.5 How to verify

Every phase ends with an in-browser verification pass using the Browser pane
(`preview_start` with `.claude/launch.json`, **never** `node server.js` via Bash). Minimum for
every phase:

- Zero console errors.
- Zero horizontal scroll at **375px** and at **1280px**.
- Zero `/generate-*` network calls with the AI checkbox off.
- The specific checks listed in that phase's own `Verify` block.

**Verify that the new thing is PRESENT, not just that the old thing is gone.** V3's phase 1 shipped
a wood palette that was applied to almost nothing, and the checklist passed anyway because it only
ever asked "is tomato gone?". Both halves of every check.

---

## §1. Password sign-in — replace the magic link

**Model: Sonnet. Depends on: nothing.**

### §1.1 The problem

`public/cloud.js` (grep `signInWithEmail`) uses `client.auth.signInWithOtp` — Supabase's magic
link. Supabase's free tier rate-limits those emails hard (a handful per hour), so Lucille is
locked out of her own app while testing. Her fix, and it is the right one: real accounts with
passwords.

### §1.2 What to build

In `public/cloud.js`, next to the existing `signInWithEmail` / `signInWithGoogle` (grep
`signInWithGoogle`), add:

```
signUpWithPassword: (email, password) =>
  client.auth.signUp({ email, password }),
signInWithPassword: (email, password) =>
  client.auth.signInWithPassword({ email, password }),
sendPasswordReset: (email) =>
  client.auth.resetPasswordForEmail(email, { redirectTo: location.origin }),
```

**Keep `signInWithEmail` in the file.** It is the account-recovery path if a password is forgotten
and Supabase's reset email fails. It just stops being the primary button.

In `public/app.js`, rewrite the sign-in screen (grep `renderSignin`) to a **two-mode card**:

- A `Sign in` / `Create account` toggle at the top of the card, defaulting to `Sign in`.
- **Sign in mode:** Email, Password, `Sign in →` button, and a small `Forgot your password?` text
  link that calls `sendPasswordReset` and shows the confirmation inline.
- **Create account mode:** Email, Password, Confirm password, `Create my account →`.
- Keep `Continue with Google` on top, keep the `or with email` divider, keep the three
  reassurance lines at the bottom (`Free forever`, `Your data stays yours`). Change
  `No passwords — we email you a one-tap link` to something true, e.g.
  `One password — no codes to wait for`.

### §1.3 Rules

- **Minimum 8 characters**, checked client-side before the call, with a plain-English message
  (`Passwords need at least 8 characters`). Do not add complexity rules — they annoy users and
  don't help.
- **Confirm-password mismatch** is caught before the network call.
- **Show the real Supabase error**, translated to plain English. The three that actually happen:
  - `Invalid login credentials` → `That email and password don't match. Try again, or reset your password.`
  - `User already registered` → `You already have an account — switch to Sign in.`
  - `Email not confirmed` → see §1.4.
- **Never log a password**, never put it in `state`, never persist it. It exists only in the input
  and the one function call.
- The auth gate, per-user cloud sync, and the v1 migration in `app.js` are **unchanged**. This
  phase swaps how a session is obtained, nothing about what happens after.
- **RLS is untouched.** Do not edit `supabase/schema.sql` in this phase.

### §1.3b Remember the email so she only ever types the password

Lucille's mental model, and it's the right one: after the first sign-up she wants to open the app
and just type her password — no email step. Email + password is how the account is *identified*
(you can't log in by name — two people share names, an email is unique), but the email typing can
disappear from the everyday flow entirely:

- **On a successful sign-in**, save the email string to `localStorage` under a dedicated key
  (e.g. `foodieLastEmail`) — the same storage the app already uses for the meal plan, wrapped in
  the same try/catch so a browser that blocks storage just degrades to typing it.
- **On the sign-in screen**, pre-fill the email field from that key when it exists, and move focus
  straight to the password field. So the everyday flow becomes: open app → email already there →
  type password → in.
- **Store the email only. Never the password**, not even obfuscated — §1's "never persist a
  password" rule is absolute and this does not bend it. The remembered email is not a secret; it's
  the same string that's about to be typed anyway.
- A small `Not you? Use a different email` text link clears the key and empties the field, for a
  shared computer.
- This is a device-local convenience: it remembers the last email that signed in **on this
  browser**, nothing more. It is not "stay logged in" (Supabase's session already handles staying
  logged in) — it's purely pre-filling the box.

### §1.4 Lucille's one Supabase setting

Supabase defaults to **requiring email confirmation** on sign-up, which reintroduces exactly the
email dependency she's trying to escape. In her Supabase dashboard:

> **Authentication → Sign In / Providers → Email → turn OFF `Confirm email`.**

Tell her this in plain language and tell her the trade-off: anyone can sign up with an email they
don't own. For a personal meal planner with per-user RLS, that is fine. If she'd rather keep
confirmation on, the app must handle the `Email not confirmed` error with a clear
`Check your inbox and click the link, then sign in` message — build that message either way, it
costs nothing.

### §1.5 Google sign-in — why it doesn't work, and what Lucille must do

**This is not a code bug.** `signInWithGoogle` in `public/cloud.js` is correct and complete. It
fails because the Google provider has never been configured — `CLAUDE.md` records
*"Google Cloud: Project 'meal planner' created. Calendar API + OAuth consent + credentials **NOT** done."*

The steps are hers, not Claude's. Write them into `docs/SUPABASE-SETUP.md` as a numbered section:

1. **Google Cloud Console** → her existing "meal planner" project → `APIs & Services` →
   `OAuth consent screen`. User type **External**, app name `#Foodie`, her email as support and
   developer contact. Save.
2. Same screen → `Audience` → add `lucillemonamie@icloud.com` and any other address she'll sign in
   with as **Test users**. While the app is in Testing mode only those addresses can sign in.
3. `APIs & Services` → `Credentials` → `Create credentials` → **OAuth client ID** → type
   **Web application**.
4. **Authorised redirect URI** — exactly one, copied from Supabase:
   `https://ckhqnqoazgmqxzzzacfl.supabase.co/auth/v1/callback`
5. Copy the **Client ID** and **Client secret**.
6. **Supabase dashboard** → `Authentication` → `Sign In / Providers` → `Google` → enable, paste
   both values, Save.
7. Test on the live site. Also add `http://localhost:8787` to Supabase's
   `Authentication → URL Configuration → Redirect URLs` so it works locally too.

Until step 6 is done the button will keep failing. **If it still fails after step 6, the error is
almost always a redirect-URI mismatch — the URI in step 4 must match byte for byte, no trailing
slash.**

### §1.6 Verify

- Create a brand-new account with a fresh email → lands in the questionnaire, signed in.
- Sign out → sign back in with the same password → the saved week and favourites are still there
  (this proves cloud sync still works through the new path).
- Wrong password → the friendly message, no console error, no crash.
- Sign up with an email that already exists → the "switch to Sign in" message.
- 7-character password → blocked client-side, no network call made.
- Password never appears in `localStorage`, in `state`, or in any console line.
- After a successful sign-in, reload the sign-in screen (sign out): the email is pre-filled and
  focus is on the password field. Only the email is in `localStorage` — grep the storage, confirm
  no password. `Not you?` clears it.
- 375px: the card fits, no horizontal scroll.

---

## §2. Colour rebalance — make brown and green belong together

**Model: Sonnet. Depends on: nothing.**

### §2.1 The problem, in her words and in numbers

*"The brown and green don't go well together at all because they only appear once each."*

She has diagnosed this correctly, and there's a name for it. The relevant principles:

- **Repetition / echo.** A colour used exactly once reads as an accident — the eye has nothing to
  connect it to, so it looks stuck on. A colour that reappears reads as a deliberate scheme. This
  is the rule she stated herself and it is the one that matters most here.
- **The 60-30-10 rule.** A balanced page is roughly 60% dominant (here: `--paper` ivory),
  30% secondary (here: **green**), 10% accent (here: **gold**). Wood is the *frame* — mastheads,
  footers, band dividers — not a fourth competing field.
- **Anchoring.** A dark band at the very top and the very bottom of a page brackets it. One dark
  band at the top only, with nothing answering it, reads as unfinished.

The measured state after V3's wood fix: the landing page bands run
`paper → green-wash → paper → wood-wash → green-wash → wood-deep footer`, and the masthead is
`--wood-plank` with grain. So wood appears twice on the landing page — but the **planner** screen
has the wood masthead and then nothing else wooden below it, and green appears there only as card
photo backgrounds. That inner screen is what she's looking at when she says it doesn't work.

### §2.2 The rule to apply

> **Every colour that appears on a screen must appear at least twice on that screen, in two
> different kinds of element, and at least one of those appearances must be visible without
> scrolling.**

"Two different kinds of element" is what stops this being satisfied by a repeated icon. A band and
a button counts. Two identical chips does not.

### §2.3 What to do

**Do not add new colours.** The palette in `public/styles.css` (grep `--wood-plank`, `--basil`,
`--gold`) is good and she likes it. This phase is about distribution only.

1. **Audit first, then edit.** For each of the six screens — landing, sign-in, questionnaire,
   loading, planner (My Meal Plan tab), planner (Shop Ingredients tab) — count real, visible uses
   of each of `wood`, `green`, `gold`. Put the counts in a table in your session notes and in the
   `CLAUDE.md` write-up. **A count of 1 is the bug.** A count of 0 is fine — a colour is allowed
   to be absent from a screen.
2. **Fix by echoing, not by adding.** Give each under-represented colour a second home that is
   structurally justified, not decorative. Suggested homes, in order of preference:
   - **Wood on the planner:** the sidebar's `rail-head` (grep `rail-head`) — the week label strip —
     becomes a wood band, echoing the masthead above it and bracketing the day list. This is the
     single highest-value change in the phase.
   - **Wood, second echo:** the shopping tab's total card (grep `shoppingBodyHtml`) sits at the
     bottom of that tab — a wood-deep card there brackets the tab the way the footer brackets the
     landing page.
   - **Green:** it already carries buttons; make sure it also carries a *surface* on every screen —
     the day-row hover state, the active tab underline, the questionnaire progress dots.
   - **Gold:** already the hairline and the ♥. Add the second kind of element as the €-price text
     and the active-filter chip border, both of which already want emphasis.
3. **Contrast is not optional.** Every new text-on-colour pairing must clear **WCAG AA (4.5:1)**.
   Measure it, don't estimate it, and write the measured ratios into `CLAUDE.md` the way V3's
   phase 1 did. `--gold-deep` is `#7C5F10` and was tightened specifically to clear AA on both
   `--paper` and `--gold-wash` — don't lighten it back.
4. **Leave the landing page's structure alone.** She explicitly likes it. You may add a second
   echo where a colour is currently used once, but do not re-order or re-tint the bands.
5. **The wood grain stays.** `--wood-grain` in `public/styles.css` is a generated inline SVG, not a
   photo, chosen deliberately (offline-safe, ~640 bytes, cannot 404). Horizontal grain on wide
   bands. Do not replace it with flat colour and do not swap in a photograph.

### §2.4 Verify

- The audit table, re-run after the edit: **no screen has any colour at a count of exactly 1.**
- Screenshots of all six screens at 1280px and at 375px, before and after, in the session notes.
- Every new text-on-colour pairing measured at ≥ 4.5:1, ratios written down.
- No horizontal scroll at 375px (full-bleed bands are the usual cause — V3 hit this).
- Zero console errors.

---

## §3. A photo for every dish

**Model: Sonnet. Depends on: nothing.**

### §3.1 The problem, measured

The 57 curated dishes in `public/recipes-db.js` are fine — **all 57 carry their own real `photo`
URL**, verified HTTP 200 in V3.

The gap is the **legacy pool** in `public/app.js` (grep `const RECIPES`). Those 77 dishes have no
`photo` field. They fall through to `dishImageUrl()` (grep `dishImageUrl`), which keyword-matches
against a 40-entry `DISH_IMG` map of Unsplash photo IDs. Measured result:

- **24 of 77 legacy dishes get no photo at all** and render an emoji tile.
- The other 53 get a *generic keyword* photo — `'salad'`, `'soup'`, `'chicken'` — which is often
  not the dish. That's a second, quieter problem: a wrong photo is worse than an honest emoji.

The 24 with nothing, and note the pattern — it is almost entirely starters and desserts:

**Breakfast (1):** Banana pancakes
**Starters (9):** Tomato bruschetta · Melon & feta · Hummus & veg sticks · Garlic bread ·
Stuffed tomatoes · Corn on the cob · Olives & crudités · Grilled asparagus · Watermelon & mint
**Desserts (14):** Dark chocolate & clementine · Baked cinnamon apple · Lemon sorbet ·
Poached pear · Cheese & grapes · Grilled peach & honey · Orange & cinnamon · Mango sorbet ·
Chocolate mousse · Apple compote · Frozen grapes · Pineapple carpaccio · Roasted plums ·
Figs & honey

### §3.2 What to build

Give **every** legacy dish its own `photo:` field, the same way curated dishes have one, so
`dishImageUrl()`'s keyword guessing becomes a fallback that never fires.

1. **Source photos from Unsplash**, same as the existing map — free, hotlinkable, no API key
   needed for direct `images.unsplash.com/photo-<id>` URLs. Match the **actual dish**, not the
   category. A photo of poached pears, not "a dessert".
2. **Verify every URL returns HTTP 200 before writing it in.** A `curl -sI -o /dev/null -w "%{http_code}"`
   loop over all 77 at the end of the phase, output pasted into the session notes. V3 did exactly
   this for the curated 57 — same standard.
3. **Use the same URL shape** the app already uses:
   `https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=600&q=70`
4. **Then shrink `DISH_IMG`.** Once every dish has its own `photo`, the keyword map is dead weight
   and a source of wrong matches. Delete it and the keyword-matching branch of `dishImageUrl()`,
   leaving: return `recipe.photo` if present, otherwise `null` (which already falls back to the
   emoji tile — keep that, it is the honest failure mode and it is what AI-generated and
   user-added dishes will still hit).

### §3.3 When you can't find one — ask, don't guess

She said it herself: *"if they don't, research or ask me to do so and for which dish."*

If a dish has no photo you can find and verify, **do not** substitute a loosely-related one.
Instead, leave that dish's `photo` as `null` and collect it. At the end of the phase, give her a
single list in this shape:

```
I couldn't find a good photo for these N dishes. For each one, either:
  (a) send me a link to a photo you like, or
  (b) tell me to drop the dish from the pool.

  1. Watermelon & mint (starter)
  2. …
```

**One list, at the end.** Do not interrupt her per dish.

### §3.4 Verify

- Every dish in both pools has a `photo` field, or is on the ask-Lucille list. Print the count of
  each.
- All photo URLs return HTTP 200 — full loop output in the notes.
- Generate a week and open the planner: **every** dish row in the sidebar and every browse card
  shows a real photo, not an emoji tile. Screenshot it.
- Spot-check ten photos by eye against their dish names. A wrong photo is a failure of this phase
  even though it is technically "present".
- Zero console errors, zero broken-image events (`onerror` never fires — check the console).
- `CACHE` bumped in `public/sw.js`.

---

## §4. Ingredient prices v2 — fill the gaps, price whole items

**Model: Opus, thinking high. Depends on: nothing.**

### §4.1 The problem

Two separate things, and the second is the subtle one.

**Gaps.** `public/ingredient-prices.js` (grep `INGREDIENT_PRICES`) holds **163 entries**, built to
cover exactly the ingredients used by the curated 57. Anything outside that list —
every legacy-pool ingredient, every AI-generated dish, every user-added dish — returns **€0**.
V3's phase 7 already hit this: a user-added chicken curry displayed *"€0.27 / serving"*, a partial
sum presented as a price. The per-card display was patched to show nothing rather than a wrong
number, but **the aggregate totals — the sidebar's €/day and the shopping list total — still
silently under-count**. That was flagged for V3 §9 and deliberately left. This is where it gets
fixed.

**Whole-item pricing.** Her rule: *"if it says half of something then the price I want written is
the price of the full thing (for example half an onion is 1.50 euros not 0.75)."* She is right,
and it's not a rounding preference — it's what actually happens at the till. You cannot buy half
an onion. The shopping list should tell her what she will actually spend.

### §4.2 Filling the gaps

1. **Enumerate every ingredient name the app can produce**, from all three sources: the curated
   database, the legacy `RECIPES` pool in `public/app.js`, and — best-effort — the ingredient names
   Gemini has actually returned in past logs. Deduplicate case-insensitively.
2. **Price the ones that are missing.** Same basis as the existing table, stated in its header
   comment: **French supermarket, mid-range own-brand, 2026, EUR**. Keep the existing `per` /
   `eur` shape so `estimateIngredientPrice()` needs no change to read them.
3. **Do not invent prices for things you can't reason about.** An ingredient you genuinely cannot
   price belongs on an ask-Lucille list, same format as §3.3, one list at the end.
4. **Regenerate the doc**: `node tools/build-prices-md.js`. `docs/INGREDIENT-PRICES.md` is
   generated — **never hand-edit it**. Same for `docs/RECIPE-DATABASE.md`.
5. **Add a coverage test** to whatever check script the phase uses: assert that every ingredient
   across both pools returns a **non-zero** price. V3's §9.1 already ran this for the curated set
   and it caught a real unit-mismatch bug (piece-priced vegetables given gram quantities). Extend
   it to the legacy pool and keep it in the §9 verification script.

### §4.3 Whole-item pricing — the trap, read this twice

The naive implementation is to round each ingredient row up inside `estimateIngredientPrice()`.
**That is wrong and it will over-charge her badly.**

Consider three recipes in one week that each use half an onion. Rounding per row gives
`1 onion + 1 onion + 1 onion = 3 onions = €4.50`. But the shopping list aggregates them first:
she needs 1.5 onions, so she buys **2 onions = €3.00**.

> **The rule: round up to whole items at SHOPPING-LIST AGGREGATION time, after the quantities from
> every recipe have been summed — never inside the per-recipe price of a single row.**

Concretely:

- `estimateIngredientPrice()` (grep `estimateIngredientPrice`) **keeps returning the exact
  fractional price.** Its header comment already explains why it deliberately doesn't round, and
  that reasoning still holds — per-card €/serving and per-recipe figures stay proportional.
- The rounding happens in `buildShoppingList()` (grep `buildShoppingList`), **after** the `Map`
  keyed by `name|unit` has summed every recipe's contribution. For an ingredient whose price entry
  has `per: 'piece' | 'clove' | 'slice' | 'stalk'`, compute
  `Math.ceil(totalQty) × entry.eur`.
- **Only piece-priced ingredients round.** Weight- and volume-priced ones (`per: '100g'`,
  `per: '100ml'`) must **not** — nobody buys a whole 1kg bag because a recipe needs 200g of flour,
  and applying it there would inflate the total absurdly. If she later wants pack-size rounding for
  those too, that's a separate decision needing real pack-size data, and it needs asking first.
- **Show her the rounding.** Where a row was rounded up, the shopping list should say so, quietly:
  `Onion · 2 (you need 1½)`. Otherwise the arithmetic looks broken. Keep the wording in the
  Woolworths tone V3 §6 established.

### §4.4 Knock-on effects to check

Rounding changes the total, which changes three things already on screen. Check each:

- The **budget pill** (compares against `budgetPerDay` — grep `budgetPerDay`). Totals go up, so a
  week that was inside budget may now show as over. That is correct and honest; don't compensate.
- The **per-day € chips** and the sidebar's `dayCost()` (grep `dayCost`). These are per-day splits
  of a now-rounded weekly total — decide explicitly whether they show rounded or exact, write the
  decision down, and be consistent. **Recommendation: per-day stays exact** (it's a share of a
  shared onion, not a purchase), **the shopping total is rounded** (that's the till). Label them so
  the difference isn't confusing.
- **"Budget-friendly dinners"** in the browse carousels (grep `dishServingCost`) sorts by
  €/serving. It should keep using the **exact** figure — it's comparing dishes, not shopping.

### §4.5 Verify

- **Zero** ingredients across both pools return €0. Print the count.
- The half-onion case, end to end: a week containing three recipes each using half an onion shows
  **2 onions** on the shopping list at **€3.00**, not 3 at €4.50 and not 1.5 at €2.25.
- A 200g-of-flour recipe does **not** bill a whole bag.
- A user-added dish with unusual ingredients now contributes a real number to both the sidebar
  €/day and the shopping total — the V3 §7 under-count is gone. Test with the exact chicken curry
  case from `CLAUDE.md`.
- Weekly total for a normal profile lands in a sane band — V3 measured €96.60/week ≈ €6.90/day
  against a €4.80–€8.85 reference. Expect it to rise somewhat with rounding; if it doubles,
  something is rounding that shouldn't be.
- `docs/INGREDIENT-PRICES.md` regenerated from the tool, not by hand.
- Zero console errors.

---

## §5. Day card restructure — meal type, photo, name, then ♥ and ✕

**Model: Sonnet. Depends on: nothing. Do this before §6 and §7.**

### §5.1 What she asked for

> *"The X or heart should appear next to the name of the dishes per day in the normal page and
> every day the structure should be type of meal at the top in bold and different font, next line
> the image and name of the dish and right under the name heart and cross."*

Today, the sidebar day rows (grep `railDishRow`) are a thumbnail, the dish name, and a small course
label — **and no ♥ or ✕ at all**. Those controls currently live only on browse cards and inside the
recipe overlay, which is why she can't act on a planned dish without opening it first.

### §5.2 The exact structure

Per day, per dish, top to bottom:

```
BREAKFAST                    ← meal type. Bold, Fraunces (the display font),
                               uppercase, letter-spaced. Visually distinct from
                               the dish name below it — that's the "different
                               font" she asked for.
┌─────┐  Banana pancakes     ← photo left, dish name right, on one line
│photo│  ♥  ✕                ← the two controls, directly under the NAME,
└─────┘                        not floating at the row's edge
```

Rules:

- **The meal type is a header for the group, not a label on each dish.** If a day has a starter, a
  main and a dessert for dinner, `DINNER` appears once, with all three dishes under it. Use
  `mealTypeLabel()` (grep `mealTypeLabel`) for the course wording within the group.
- **♥ and ✕ sit under the name, left-aligned with it** — not pinned to the right edge of the row.
  She said "right under the name" and meant it literally.
- **♥** toggles favourite via the existing `toggleFavorite()` (grep `toggleFavorite`) and fills gold
  when active — that's the established convention, keep it.
- **✕** opens the swap flow. In this phase it keeps today's behaviour (immediate random swap);
  §7 changes what it opens. Build it so §7 only has to change the handler, not the markup.
- **Both controls must stop event propagation** — the row itself is a button that opens the recipe
  overlay, and she likes that. Tapping ♥ must not also open the overlay.
- **Touch targets ≥ 44×44px** even though the icons are small. At 375px this row is the primary
  interface.
- Keep the leftover `♻️` treatment (grep `isLeftover`) working.

### §5.3 Where

`railDishRow()` and `railHtml()` in `public/app.js` (grep `function railHtml`), plus the `.rail` /
`.day-row` / `.dish-row` styles in `public/app-screens.css`. Group `day.meals` by `type` before
rendering so the header appears once per meal type.

**Watch the sidebar height.** V3 gave the rail its own scroll specifically because a 3-course week
ran off-screen. This change makes each dish taller — re-check that a full 3-course week still
scrolls properly and still collapses above the main column under 900px.

### §5.4 Verify

- A 3-course week: each day shows `BREAKFAST` / `LUNCH` / `DINNER` once each, dishes grouped
  correctly beneath.
- ♥ on a planned dish toggles it, fills gold, persists across reload, and does **not** open the
  overlay.
- ✕ swaps the dish and updates the sidebar without a full navigation.
- Tapping the row (not the controls) still opens the recipe overlay.
- The meal-type header is visibly a different font from the dish name — screenshot at 1280px.
- 375px: no horizontal scroll, both controls comfortably tappable, full week still scrollable.
- Leftover days still show `♻️`.
- Zero console errors.

---

## §6. Drag and drop anywhere

**Model: Opus, thinking high. Depends on: §5.**

### §6.1 What she asked for

> *"I like the drag and drop but they should be able to drag and drop anywhere they want (a dinner
> plate can also be a lunch plate or a breakfast plate, dessert can also be a starter or a
> breakfast…)."*

Today, dropping a dish on a day calls `addDishToDay()` (grep `addDishToDay`), which places it at
its **"natural meal"** — a dish typed `dinner` always lands in dinner. And the drop target is the
whole `day-row` (grep `data-drop-day`), so you cannot choose *where* in the day it goes.

Her point is a good one: these categories are a suggestion, not a law. People eat leftover curry
for breakfast.

### §6.2 What to build

1. **Drop targets become per-slot, not per-day.** Every position in a day accepts a drop:
   each existing dish row (replace it), and an `＋` add-slot under each meal-type group (append
   there). The `day-row` stays a target as a coarse fallback — dropping on the day's empty space
   should still work and land at the natural meal, since that's the current behaviour and it's a
   sensible default.
2. **Accept any dish in any slot.** Drop a dessert on breakfast and it becomes that day's
   breakfast. `addDishToDay()` gains an explicit target (`{dayIndex, mealType, courseIndex}`) and
   stops consulting the dish's own `type` when one is given.
3. **The dish's `type` is not rewritten.** A dessert placed at breakfast is still a dessert in the
   database — it's the *slot* that knows where it sits. Rewriting `type` would corrupt the pool for
   every future week. Store the placement on the week slot, which already has a
   `{type, course, recipe, rejected}` shape (grep `applyLeftovers` for how slots are handled).
4. **Show the target before the drop.** A clear insertion indicator — a gold line between rows, or
   a highlighted row for replace. `dragover` must make it unambiguous whether this drop *replaces*
   or *inserts*. Getting this wrong makes the feature feel broken even when it works.
5. **Dragging works both ways.** Browse card → day (exists today), and **day → day**, so she can
   move Tuesday's dinner to Thursday. Moving within the plan is a move, not a copy: the source slot
   empties. Set `effectAllowed` correctly for each case (`copy` from browse, `move` within plan).
6. **Touch.** HTML5 drag-and-drop does not work on iOS Safari, and this is a PWA she'll use on her
   phone. Either add pointer-event-based dragging, or — simpler and probably better — ensure every
   drag action has a tap equivalent. The `⊕` → day-picker popover already exists (grep
   `addDishToDay`); extend that picker to also choose the meal type. **Decide explicitly, write the
   decision in `CLAUDE.md`, and don't leave the phone with no path.**

### §6.3 The rules that must survive

- **Allergen filtering still applies.** A dropped dish must pass `passesDietFilters()`. If it
  doesn't, refuse the drop with a clear message naming the reason. §00.4 rule 2.
- **The no-repeat rule.** Dropping a dish that's already in the week is *allowed* — she asked for
  it explicitly, it's her plan. But `enforceNoRepeat()` (grep `enforceNoRepeat`) must not
  subsequently "fix" her deliberate duplicate on the next re-render. **Mark manually-placed slots
  and have `enforceNoRepeat()` skip them.** This is the most likely silent bug in this phase.
- **Leftovers.** `applyLeftovers()` doubles a dinner's ingredients and marks the next day's lunch.
  If she drags away either half of that pair, the doubling must be undone or the shopping list
  over-buys. Handle it and test it.
- **The shopping list, sidebar kcal, and €/day all recompute** after any drop.
- **Persist immediately**, as the current drop handler does.

### §6.4 Verify

- Drag a dessert from browse onto a breakfast slot → it sits at breakfast, shows under the
  `BREAKFAST` header, and is still a dessert in the data.
- Drag Tuesday's dinner onto Thursday → Tuesday's slot is empty, Thursday has it. Not duplicated.
- Drop onto an existing dish → replaces it. Drop onto an `＋` slot → appends. The indicator showed
  which was going to happen, before the drop.
- Drop a dish that violates a set allergy → refused, with a message naming the allergen. **Test
  this with a real allergy set.**
- Manually place the same dish twice → both survive a re-render and a reload.
- Drag away a leftover's source dinner → shopping list quantities are correct, nothing
  double-counted.
- On a phone-sized viewport, there is a working path to move a dish. State which path.
- Shopping list, day kcal and €/day all update after a drop.
- Zero console errors.

---

## §7. Swap overlay — two options

**Model: Opus, thinking high. Depends on: §5 and §6.**

### §7.1 What she asked for

> *"I want the swap dishes (when you click on the dish in the main frame of the app) to show 2
> options: 1 random dish, 2 drag and drop. If the X is pressed and nothing is chosen then it is of
> course the random dish."*

And, importantly: *"I really like what happens when you click on the foods"* — the recipe overlay
from V3 §2 (grep `openRecipeOverlay`) stays exactly as it is. This phase changes the **swap**
action inside it, not the overlay itself.

### §7.2 The behaviour

Two entry points, deliberately different:

- **✕ pressed directly** (on the day card from §5, or the overlay's swap button) → **immediate
  random swap**, exactly today's behaviour. No dialog, no extra tap. Her sentence *"if the X is
  pressed and nothing is chosen then it is of course the random dish"* means the fast path must
  stay fast.
- **The swap control inside the recipe overlay** → shows the two options:
  1. **`🎲 Surprise me`** — picks a random eligible dish, same code path as ✕, respecting
     allergies, dislikes, the time/difficulty filter, and no-repeat. This is the default and should
     be visually the primary option.
  2. **`✋ Choose it myself`** — closes the overlay and puts the planner into a **pick mode**: the
     target slot is highlighted and held, the browse carousels are in view, and dragging (or
     tapping) any dish drops it straight into that slot. Escape or a `Cancel` button exits pick
     mode leaving the original dish untouched.

Pick mode is **§6's drop machinery with a pre-selected target** — do not build a second placement
path. If §6 is done properly this is mostly state and highlighting.

### §7.3 Details that matter

- **Pick mode needs an obvious exit.** A persistent bar — `Choosing a new dish for Tuesday dinner ·
  Cancel` — pinned where she can see it. A mode with no visible exit is how people get stuck.
- **On mobile, pick mode must be tap-driven**, per §6.2 point 6. Tapping a browse card while in
  pick mode places it. No drag required.
- **`Surprise me` respects everything.** Allergies, dislikes, time and difficulty filters,
  no-repeat, and — if the AI is on and gets involved — `acceptAIDish()` (grep `acceptAIDish`),
  which is the safety net V3 §9 added after finding AI dishes were placed unchecked. Do not
  bypass it.
- **Fall back gracefully.** If no eligible dish exists for `Surprise me` (a heavily restricted
  profile), say so honestly and offer `Choose it myself` — don't fail silently and don't relax the
  filters. The existing honest-notice convention (grep `plannerNoticesHtml`) is the model.
- Both options must work with the AI checkbox **off**, using only the local pools.

### §7.4 Verify

- ✕ on a day card → immediate swap, no dialog. Timed: it should feel identical to today.
- Overlay swap → two options shown, `Surprise me` visually primary.
- `Surprise me` → new eligible dish, week still has no accidental duplicates, allergies respected.
- `Choose it myself` → overlay closes, slot highlighted, bar visible with `Cancel`; dragging a
  browse card into it works; `Cancel` and `Esc` both leave the original dish in place.
- Pick mode on a 375px viewport: tap-to-place works, no drag needed.
- A profile so restricted that no swap exists → honest message, no crash, no filter relaxation.
- With AI on: the swapped-in dish passed `acceptAIDish()`. Check the network tab — at most one
  `/generate-meal` call, and **zero** `/generate-week`.
- Zero console errors.

---

## §8. Google Calendar and shopping reminders

**Model: Sonnet for code, Lucille for everything else.**

### §8.1 Why they don't work

Neither is a bug. Both are **undeployed**, and `CLAUDE.md` has said so since V2:

- **Shopping reminders** — `supabase/functions/send-reminders/index.ts` is written and has never
  been deployed. It needs a `RESEND_API_KEY` secret, `pg_net` installed, and a cron job.
- **The feedback form** — `supabase/functions/send-feedback/index.ts`, same situation. **The live
  app already points at its URL, so the in-app feedback form is failing right now.** Worth fixing
  in the same sitting since it's the same three steps.
- **Google Calendar** — only the `.ics` download exists (grep `buildICS`), which is real and works.
  True two-way Google Calendar sync needs OAuth, which needs the same Google Cloud project setup as
  §1.5.

### §8.2 Lucille's steps — reminders and feedback

Write these into `docs/SUPABASE-SETUP.md` and walk her through them:

1. Supabase dashboard → `Edge Functions` → deploy both `send-reminders` and `send-feedback` from
   the repo.
2. `Edge Functions` → `Secrets` → add `RESEND_API_KEY` (from her Resend account,
   `llucillespam@gmail.com`).
3. `Database` → `Extensions` → enable **`pg_net`**. Cron cannot call an Edge Function without it.
4. `Database` → `Cron Jobs` → new job calling `send-reminders`.
   **The schedule box is GMT.** Paris is GMT+2 in summer, so `0 16 * * *` = 6pm Paris. Say this
   explicitly — it has caused confusion before.

**⚠️ The Resend limit she will hit:** free tier with no verified domain **only delivers to
`llucillespam@gmail.com`**. The first test returned `{"sent":false,"status":403}` for exactly this
reason — the logic was fine, the recipient was rejected. Either use the `TEST_EMAIL_TO` env
override, or sign into #Foodie with that gmail, or verify a domain in Resend. Tell her which she'd
prefer before she spends time debugging a working function.

### §8.3 Google Calendar — decide before building

Full OAuth Calendar sync is real work: Google Cloud project, Calendar API enabled, consent screen
verification (Google reviews apps requesting calendar scopes), token storage and refresh. It is
disproportionate for one person's meal plan.

**Recommendation: improve the `.ics` path instead, and only build OAuth if she asks for it after
seeing the improved version.** `.ics` needs no accounts, no consent screen, no tokens, and works
with Apple Calendar too — which, given she uses an iCloud address, may matter more than Google.

Improvements worth making to `buildICS()` (grep `buildICS`), all small:

- A `Subscribe to this week` option alongside the download, so re-planning updates her calendar
  rather than creating a second set of events. This needs the `.ics` served from a stable URL —
  a small addition to `server.js`.
- Correct `UID`s per event, so re-importing updates rather than duplicating. This is the single
  most-noticed `.ics` bug and worth checking.
- Timezone written as `Europe/Paris` rather than floating times.

**Ask her which she wants before building either.** Do not start OAuth on your own judgment.

### §8.4 Verify

- Reminders: a real email arrives at `llucillespam@gmail.com`.
- Feedback: the in-app form submits successfully and the message arrives. Confirm it currently
  fails **before** the fix, so you know the fix is what changed it.
- `.ics`: 14 valid events, real `sourceUrl` links, correct timezone; re-importing after a re-plan
  updates rather than duplicating.
- Whatever is still not done is written into `CLAUDE.md` as explicitly not done.

---

## §9. Final verification pass

**Model: Opus, thinking high. Depends on: all phases.**

Run V3's `§9` script first — it still applies and catches regressions in everything V3 built. Then
add these V4-specific checks.

### §9.1 Automated

- Every JS file parses.
- Dish data: no duplicate ids, `time === prep + cook`, every category and unit valid, **every dish
  in both pools has a photo**, **every photo URL returns 200**.
- Prices: **zero** ingredients across both pools return €0.
- Generated docs (`docs/RECIPE-DATABASE.md`, `docs/INGREDIENT-PRICES.md`) are in sync with their
  sources — regenerate and confirm no diff.
- `gemini-key.txt` has never been committed; no API key appears in any shipped file.

### §9.2 By hand, AI off

Everything in V3 §9.2, plus:

- **Auth:** create an account, sign out, sign in, wrong password, password reset. Saved state
  survives. Password appears nowhere in storage.
- **Colour:** the §2 audit table re-run on the final build — no colour at a count of exactly 1 on
  any screen.
- **Photos:** generate a week — every dish shows a real photo. Screenshot.
- **Prices:** the half-onion case gives 2 onions at €3.00. Weekly total in a sane band. A
  user-added dish contributes real numbers to the sidebar and the shopping total.
- **Day cards:** meal-type headers in the display font, ♥ and ✕ under each name, both working,
  neither opening the overlay.
- **Drag and drop:** dessert onto breakfast; day-to-day move; replace vs insert; an allergen
  violation refused; a deliberate duplicate surviving a reload.
- **Swap:** ✕ is instant; overlay offers two options; pick mode has a visible exit and works by tap
  at 375px.
- 375px and 1280px clean. Zero console errors. Zero `/generate-*` calls with AI off.

### §9.3 One AI-on run

Budget: a handful of requests against the 20/day limit. Confirm:

- The §00.4 rule 1 precedence still holds — an unrestricted profile plans with **zero** backend
  calls.
- A restricted profile tops up via `/generate-meal` only, capped, and every AI dish passed
  `acceptAIDish()`.
- An AI-generated dish's ingredients now get **real prices** from the expanded table rather than
  €0 — this is the clearest proof §4 worked.
- A swap via the overlay's `Surprise me` with AI on stays safe.

### §9.4 Acceptance checklist

Both halves of every line. The new thing present, the old thing gone.

- [ ] Password sign-in works; magic link is no longer the primary path but still exists for recovery
- [ ] Google sign-in either works, or `docs/SUPABASE-SETUP.md` has Lucille's exact remaining steps
- [ ] No colour appears exactly once on any screen; every new pairing measured ≥ 4.5:1
- [ ] Every dish has a real, verified photo — or is on a list Lucille has been given
- [ ] Zero ingredients price at €0; piece-priced items round up **at aggregation**, not per row
- [ ] Day cards: bold display-font meal type, photo + name, ♥ and ✕ under the name
- [ ] Any dish can be dropped into any slot; allergen filtering still refuses unsafe drops
- [ ] Overlay swap offers Surprise me / Choose it myself; ✕ alone is still instant and random
- [ ] Shopping reminders and the feedback form deliver; `.ics` doesn't duplicate on re-import
- [ ] `CACHE` bumped; `CLAUDE.md` updated with what was done, verified, and deliberately not done

---

## §10. Things deliberately not in this brief

Written down so a future session doesn't think they were forgotten:

- **Photo mode for "Add a dish I love"** — V3 §7 step 7 explicitly allowed deferring it. The server
  already accepts the image part and enforces the 4MB cap; the remaining work is a file input and a
  client-side downscale. Still deferred.
- **Multi-week storage.** The week ‹ › arrows are still disabled with a tooltip. Everything else
  is built; only storage is missing. Not requested here.
- **Unit consolidation on the shopping list.** Olive oil still appears as tbsp, tsp and ml on
  separate rows. Needs real unit conversion at aggregation time; `ingredient-prices.js` has
  `UNIT_TO_BASE` and each ingredient would need a g-or-ml base. **§4 touches this code — if the
  fix falls out naturally while doing the rounding work, take it. Do not go looking for it.**
- **`estimatedTotal` from Gemini.** Wired and ready but never called, because §00.4 rule 1 means
  `requestWeekAI()` isn't invoked. A decision, not a defect. See V3 §9.3.
- **Tauri desktop wrapper** — still V3's phase 11, unstarted.
