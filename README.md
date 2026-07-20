# 🍽 #Foodie — weekly meal planner

A little app that builds you a personalised week of meals — with recipes, prices and one
shopping list. Made for (and with) Lucille.

**Live site:** https://meal-planner-km6f.onrender.com
*(that's the old version — the rebuilt app lives on the `v2-rebuild` branch, not deployed yet)*

---

## Run it on your computer

1. Open **Terminal**
2. Paste this and press Enter:
   ```
   cd ~/Work/claude/Projects/Meal\ plan\ Lucille
   node server.js
   ```
3. Wait for `✅ ... Key loaded: yes`
4. Open **http://localhost:8787** in your browser

To stop it: click the Terminal window and press **Ctrl + C**.

---

## What's in this folder

| Thing | What it is |
|---|---|
| `public/` | **The app itself** — what you see in the browser |
| `server.js` | The backend. Holds the AI key and talks to Google Gemini |
| `gemini-key.txt` | 🔑 **Your secret AI key.** Never share it, never commit it |
| `supabase/` | The database setup (accounts, saved weeks, favorites) |
| `docs/` | Briefs, research and the design mockups — reading material, not code |
| `CLAUDE.md` | Project memory — Claude reads this automatically each session |

---

## Publishing a change

1. Commit and push with **GitHub Desktop**
2. **Render redeploys automatically** in a minute or two
3. The live address stays the same

---

## Good to know

- **The AI is off by default.** There's a "Use real AI generation" tick-box — the free Gemini
  plan allows ~20 requests a day, so it stays off while testing. With it off the app uses its
  own built-in recipes and costs nothing.
- **The key lives in two places** — `gemini-key.txt` here, and as `GEMINI_API_KEY` in the
  Render dashboard. If you ever change it, change it in both.
- **Everything is free.** No card, no subscription, on any of the services used.
