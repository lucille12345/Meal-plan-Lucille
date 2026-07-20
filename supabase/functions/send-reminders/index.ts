// ============================================================================
// Table — daily shopping reminder (Supabase Edge Function)
// ----------------------------------------------------------------------------
// Runs once a day (see the cron step in docs/SUPABASE-SETUP.md). For every user
// it looks at their saved week, works out what needs buying TODAY, and emails
// them the list via Resend.
//
// Secrets it needs (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY   ← the re_… key from resend.com → API keys
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
// ============================================================================

import { createClient } from 'jsr:@supabase/supabase-js@2';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Same rule as the app: fresh items for day `di` get bought the day before.
function buyDayFor(di: number): string {
  return di === 0 ? 'Sunday (before the week)' : DAYS[di - 1];
}

// Does the user already own this (pantry staples)? Mirrors pantryHas() in app.js.
function pantryHas(pantry: string[], name: string): boolean {
  if (!pantry?.length) return false;
  const n = name.toLowerCase();
  return pantry.some((t) => {
    const term = t.toLowerCase();
    return n.includes(term) || term.includes(n);
  });
}

// Everything this user should buy today, merged and de-duplicated.
function itemsToBuyToday(state: any, todayName: string): string[] {
  const week = state?.week;
  if (!Array.isArray(week) || !week.length) return [];
  const pantry: string[] = state?.profile?.pantry ?? [];
  const found = new Map<string, { name: string; qty: number; unit: string }>();

  week.forEach((day: any, di: number) => {
    if (buyDayFor(di) !== todayName) return;
    (day.meals ?? []).forEach((meal: any) => {
      if (meal.rejected || !meal.recipe || meal.recipe.isLeftover) return;
      (meal.recipe.ingredients ?? []).forEach((ing: any) => {
        if (!ing.buyDayBefore) return;                 // only the fresh stuff
        if (pantryHas(pantry, ing.name)) return;       // already in the cupboard
        const key = `${ing.name.toLowerCase()}|${ing.unit ?? ''}`;
        const hit = found.get(key);
        if (hit) hit.qty += Number(ing.qty) || 0;
        else found.set(key, { name: ing.name, qty: Number(ing.qty) || 0, unit: ing.unit ?? '' });
      });
    });
  });

  return [...found.values()]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i) => (i.qty ? `${i.name} — ${Math.round(i.qty * 100) / 100} ${i.unit}`.trim() : i.name));
}

function emailHtml(name: string, items: string[]): string {
  const rows = items.map((i) => `<li style="padding:6px 0;border-bottom:1px solid #ECE7DD">${i}</li>`).join('');
  return `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#FDFBF7;padding:28px;color:#1D1D1F">
    <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #ECE7DD;border-radius:16px;padding:28px">
      <div style="font-size:22px;font-weight:700">🛒 Tonight: buy for tomorrow</div>
      <p style="color:#6E6A63;font-size:14px;margin:8px 0 18px">
        ${name ? name + ', h' : 'H'}ere's the fresh bit of your list — everything else you already bought at the start of the week.
      </p>
      <ul style="list-style:none;padding:0;margin:0;font-size:15px">${rows}</ul>
      <p style="color:#A39E95;font-size:12px;margin-top:22px">Sent by Table · your weekly meal planner</p>
    </div>
  </div>`;
}

Deno.serve(async () => {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY secret is not set' }), { status: 500 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // Today's weekday name, in Paris time (where Lucille is).
  const todayName = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    timeZone: 'Europe/Paris',
  }).format(new Date());

  const { data: profiles, error } = await supabase.from('profiles').select('user_id, state');
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

  const results: any[] = [];

  for (const row of profiles ?? []) {
    const items = itemsToBuyToday(row.state, todayName);
    if (!items.length) { results.push({ user: row.user_id, sent: false, reason: 'nothing to buy today' }); continue; }

    // Reminders are opt-in: profile.settings.reminders must not be false.
    if (row.state?.profile?.settings?.reminders === false) {
      results.push({ user: row.user_id, sent: false, reason: 'opted out' }); continue;
    }

    const { data: userRes } = await supabase.auth.admin.getUserById(row.user_id);
    const email = userRes?.user?.email;
    if (!email) { results.push({ user: row.user_id, sent: false, reason: 'no email' }); continue; }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: 'Table <onboarding@resend.dev>',   // ← swap for your own domain once verified
        to: email,
        subject: `🛒 Tonight: buy for tomorrow (${items.length} item${items.length === 1 ? '' : 's'})`,
        html: emailHtml(row.state?.profile?.name ?? '', items),
      }),
    });

    results.push({ user: row.user_id, sent: res.ok, status: res.status, items: items.length });
  }

  return new Response(JSON.stringify({ day: todayName, results }, null, 2), {
    headers: { 'content-type': 'application/json' },
  });
});
