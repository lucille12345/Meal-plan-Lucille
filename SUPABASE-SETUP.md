# Turning on accounts + cloud sync (Supabase) — your setup checklist

The app already runs **without** this (local-only: saves to one browser). Doing the steps
below turns on **sign-in with your email** and **saving your data to the cloud** so it
follows you across devices. Everything here is **free, no credit card**. Takes ~10 minutes.

Do the steps in order. Anything you paste, keep this file open beside you.

---

## 1. Create your Supabase account + project
1. Go to **https://supabase.com** → click **Start your project** → sign in (GitHub or email).
2. Click **New project**.
   - **Name:** `table` (anything is fine).
   - **Database password:** click *Generate*, then **save it somewhere safe** (a password
     manager). This is secret — you rarely need it, but don't lose it.
   - **Region:** pick the closest one — **West EU (Ireland/Frankfurt)** for France.
3. Click **Create new project** and wait ~2 minutes while it sets up.

## 2. Copy your two connection values into the app
1. In your project, click the **gear icon → Project Settings → API** (or the **Connect**
   button at the top).
2. Copy these two:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public** key — a long string starting with `eyJ...`
     *(This key is safe to put in the app — it only works together with the security rules
     from step 3. The **password** from step 1 is the secret one, never this.)*
3. Open **`public/config.js`** in the project and paste them in:
   ```js
   window.SUPABASE_CONFIG = {
     url: 'https://abcdefgh.supabase.co',
     anonKey: 'eyJ...your-anon-key...'
   };
   ```
   Save the file.

## 3. Create the database tables (one paste)
1. In Supabase, open the **SQL Editor** (left sidebar) → **New query**.
2. Open the file **`supabase/schema.sql`** in the project, copy **everything**, paste it
   into the SQL editor, and click **Run**.
3. It should say **Success**. This creates your tables, the security rules that make each
   account private, and the private photo storage.

## 4. Tell Supabase which addresses are allowed to sign in
1. Go to **Authentication → URL Configuration**.
2. Set **Site URL** to where you open the app:
   - testing on your computer: `http://localhost:8787`
   - the live site later: your Render URL (e.g. `https://meal-planner-km6f.onrender.com`)
3. Under **Redirect URLs**, add **both** of those (one per line) so the magic link works
   from either place. Save.
4. **Authentication → Providers → Email** should already be **enabled** (it is by default).
   Nothing else to do here for email sign-in.

## 5. Try it
1. In Terminal: `node server.js`, then open **http://localhost:8787**.
2. You should now see the **Welcome to Table** sign-in screen.
3. Type your email → **Email me a magic link** → check your inbox → tap the link → you're in.
   Your existing week/favorites from this browser are carried up to your account
   automatically the first time.

---

## Good to know
- **Email limits:** Supabase's built-in email sender is rate-limited (a few messages an
  hour) and links can land in **spam** — totally fine for your own testing. (Higher volume
  later needs a custom email sender; we'll do that if/when it matters.)
- **Google sign-in** ("Continue with Google") is in the UI but needs a separate free Google
  Cloud setup — we'll do that in a later phase; email magic-link is all you need for now.
- **Nothing breaks if you skip this.** Leave `public/config.js` empty and the app stays in
  local-only mode exactly as before.
- **Don't share** your database password. The **anon key is fine** to be in the code.
