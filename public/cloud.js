/* ============================================================================
   #Foodie — Supabase integration (ES module)
   ----------------------------------------------------------------------------
   Activates ONLY when public/config.js has a url + anonKey. Otherwise the app
   runs in local-only mode and this module does nothing (app.js falls back to
   localStorage, exactly as before).

   Exposes a small window.Cloud API that app.js (a classic script) can call, and
   fires a 'cloud-ready' event on window once it's decided enabled vs. disabled.
   Loading @supabase/supabase-js from an ESM CDN keeps the build step-free.
   ============================================================================ */

const cfg = (window.SUPABASE_CONFIG) || {};

function ready(obj) {
  window.Cloud = obj;
  window.dispatchEvent(new Event('cloud-ready'));
}

// Build the per-user state document we store in profiles.state (a single JSON
// blob for Phase 3 — later phases can normalize week/favorites into their tables).
function stateBlob(s) {
  return { profile: s.profile, week: s.week, useAI: s.useAI, favorites: s.favorites,
           checked: s.checked, userDishes: s.userDishes };
}

if (!cfg.url || !cfg.anonKey) {
  ready({ enabled: false, reason: 'not-configured' });
} else {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const client = createClient(cfg.url, cfg.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });

    ready({
      enabled: true,
      client,
      stateBlob,

      // ---- auth ----
      getSession: async () => (await client.auth.getSession()).data.session,
      // Primary path (V4 §1): real accounts with a password. Email is used once at sign-up and
      // then only as the login identifier — no email is sent on an ordinary sign-in, so there is
      // no rate limit to hit.
      signUpWithPassword: (email, password) =>
        client.auth.signUp({ email, password }),
      signInWithPassword: (email, password) =>
        client.auth.signInWithPassword({ email, password }),
      sendPasswordReset: (email) =>
        client.auth.resetPasswordForEmail(email, { redirectTo: location.origin }),
      // Kept as the account-recovery fallback if a password is forgotten and the reset email
      // fails — no longer the primary button (V4 §1.2).
      signInWithEmail: (email) =>
        client.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin } }),
      signInWithGoogle: () =>
        client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin } }),
      signOut: () => client.auth.signOut(),
      onAuthChange: (cb) => client.auth.onAuthStateChange((_event, session) => cb(session)),

      // ---- per-user state (profiles table, owner-only via RLS) ----
      loadState: async (uid) => {
        const { data, error } = await client
          .from('profiles').select('state').eq('user_id', uid).maybeSingle();
        if (error) throw error;
        return data ? data.state : null;
      },
      saveState: async (uid, state) => {
        const { error } = await client
          .from('profiles')
          .upsert({ user_id: uid, state, updated_at: new Date().toISOString() });
        if (error) throw error;
      },

      // ---- user-added dishes ("Add a dish I love", V3 §0.7) ----
      // The dish's own stable `user-…` id is stored INSIDE the jsonb, not as the row's
      // primary key, so the same dish arriving from here and from the state blob dedupes
      // cleanly by that id (V3 §0.2 — this is what protects the no-repeat rule).
      loadUserDishes: async (uid) => {
        const { data, error } = await client
          .from('user_dishes').select('dish, source, verified').eq('user_id', uid)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return (data || []).map(r => ({ ...r.dish, source: r.source, verified: r.verified }));
      },
      saveUserDish: async (uid, dish) => {
        const { error } = await client.from('user_dishes').insert({
          user_id: uid, dish, source: dish.source || null, verified: !!dish.verified,
        });
        if (error) throw error;
      },

      // ---- user dish photos (private Storage bucket) ----
      uploadDishPhoto: async (uid, file, recipeName) => {
        const safe = (recipeName || 'dish').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
        const path = `${uid}/${Date.now()}-${safe}.jpg`;
        const { error } = await client.storage
          .from('dish-photos').upload(path, file, { contentType: 'image/jpeg', upsert: false });
        if (error) throw error;
        return { path };
      }
    });
  } catch (e) {
    // CDN blocked / offline / bad config → degrade gracefully to local mode.
    console.warn('Supabase did not load — staying in local mode:', e && e.message);
    ready({ enabled: false, reason: 'load-error' });
  }
}
