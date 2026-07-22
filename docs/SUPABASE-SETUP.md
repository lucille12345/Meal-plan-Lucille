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
Easiest: click the green **Connect** button at the **top of the dashboard** (next to your
project name) → **App Frameworks** tab → it shows both values below, each with a copy button.

Or find them manually:
- **Project URL** — it's just your **Project ID** (Settings → General) wrapped like this:
  `https://YOUR-PROJECT-ID.supabase.co`
- **Publishable key** — Settings → **API Keys** → the key starting with **`sb_publishable_...`**
  *(If you only see a "Legacy API keys" tab, use the one labelled **`anon` `public`**, starts
  with `eyJ...`.)* This public key is safe in the app — the security rules from step 3 are what
  actually protect your data. **Never** use a key labelled `secret` or `service_role`.

Then open **`public/config.js`** and paste them in:
```js
window.SUPABASE_CONFIG = {
  url: 'https://YOUR-PROJECT-ID.supabase.co',
  anonKey: 'sb_publishable_...'          // the Publishable key (or a legacy anon eyJ... key)
};
```
Save the file. *(The field is named `anonKey` for historical reasons — the `sb_publishable_`
key goes there just fine.)*

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

## 5. Turn OFF the confirmation email (do this — it's the whole point of V4 §1)

The app now uses **a password**, not an emailed link. But Supabase, by default, still makes
you click a confirmation link the **first** time you create an account — which puts you back
into "wait for an email" territory. Turn it off:

1. Supabase dashboard → **Authentication** → **Sign In / Providers** → **Email**.
2. Turn **OFF** the toggle **"Confirm email"**. Save.

**Trade-off, so you know:** with this off, anyone can sign up with any email without proving
they own it. For a personal meal planner where each account only sees its own data, that's
completely fine. If you'd rather keep confirmation on, the app already shows a clear "check
your inbox" message — it just means the first sign-up needs one emailed click. Everyday
sign-ins never send email either way.

While you're here: **Authentication → URL Configuration → Redirect URLs** → add
`http://localhost:8787` so sign-in also works when you run it locally.

## 6. Try it
1. In Terminal: `node server.js`, then open **http://localhost:8787**.
2. You'll see **Welcome to #Foodie** with **Sign in / Create account** tabs.
3. Tap **Create account** → type your email + a password (8+ characters) twice → **Create my
   account**. You're straight in (no email link, assuming step 5 is done).
4. Your existing week/favorites from this browser are carried up to your account the first time.
5. Sign out, then sign back in with just your **email + password** — your email is already
   filled in for you, so you only type the password.

---

## 7. "Continue with Google" — the setup that makes it actually work

The Google button is in the app and the code is correct, but it fails until you connect a
Google project. This is a one-time, free setup. Do it in order:

1. **Google Cloud Console** (console.cloud.google.com) → your existing **"meal planner"**
   project → **APIs & Services** → **OAuth consent screen**. Choose **External**,
   app name **#Foodie**, your email (`lucillemonamie@icloud.com`) as both support and
   developer contact. Save.
2. Same area → **Audience** → add `lucillemonamie@icloud.com` (and any other address you'll
   sign in with) as **Test users**. While the app is in "Testing", only these can sign in.
3. **APIs & Services** → **Credentials** → **Create credentials** → **OAuth client ID** →
   application type **Web application**.
4. Under **Authorised redirect URIs**, add **exactly** this — copied byte-for-byte, no
   trailing slash:
   `https://ckhqnqoazgmqxzzzacfl.supabase.co/auth/v1/callback`
5. Create it, then copy the **Client ID** and **Client secret**.
6. **Supabase dashboard** → **Authentication** → **Sign In / Providers** → **Google** →
   enable it, paste both values, Save.
7. Test on the live site. If it still fails, it's almost always the redirect URI in step 4 —
   it must match exactly, no trailing slash.

---

## Good to know
- **Password sign-in has no email limit** — the reason we switched. Only the *first* account
  creation (and password resets) touch email, and with confirmation off even sign-up doesn't.
- **Magic link still exists** as a hidden fallback for account recovery — it's just no longer
  the main button.
- **Nothing breaks if you skip all this.** Leave `public/config.js` empty and the app stays in
  local-only mode exactly as before.
- **Don't share** your database password. The **anon key is fine** to be in the code.

---

## 8. Shopping reminders + the feedback form (V4 §8)

Both of these are **written and waiting** — they just need you to deploy them once. **Until you
do, the in-app "Tell Lucille" feedback form silently fails** (the live app already points at it).

1. Supabase dashboard → **Edge Functions** → deploy **both** `send-reminders` and
   `send-feedback` from this repo (`supabase/functions/`).
2. **Edge Functions → Secrets** → add **`RESEND_API_KEY`** (from your Resend account,
   `llucillespam@gmail.com`).
3. **Database → Extensions** → enable **`pg_net`**. A cron job cannot call an Edge Function
   without it.
4. **Database → Cron Jobs** → new job calling `send-reminders`.
   **⚠️ The schedule box is in GMT.** Paris is GMT+2 in summer, so `0 16 * * *` = **6 pm Paris**.

**⚠️ The Resend limit you WILL hit:** on the free tier with no verified domain, Resend **only
delivers to `llucillespam@gmail.com`**. The first test came back `{"sent":false,"status":403}`
for exactly this — the function worked, Resend just refused the recipient. Options: use the
`TEST_EMAIL_TO` env override, sign in to #Foodie with that gmail, or verify a domain in Resend.
Pick one before you spend time thinking the function is broken.

## 9. Google Calendar — the honest recommendation

The **"Add to calendar" button already works** — it downloads a `.ics` file your calendar app
imports, and V4 improved it: correct **Europe/Paris** times and **stable event IDs**, so
re-planning your week **updates** the same events instead of creating a second copy. This works
with **Apple Calendar too**, which matters since you use an iCloud address.

**Full two-way Google Calendar sync (OAuth) was deliberately NOT built.** It needs a Google Cloud
project, the Calendar API, a consent screen that **Google reviews** because calendar access is a
sensitive scope, and token storage/refresh — disproportionate for a personal meal planner, and
the `.ics` gives you the same result (dinners + shopping reminders on your calendar) with no
accounts and no review. If after using the `.ics` version you still want live Google sync, say so
and it can be built as its own phase.
