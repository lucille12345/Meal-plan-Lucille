// ============================================================================
// #Foodie — feedback form (Supabase Edge Function)
// ----------------------------------------------------------------------------
// The app posts { message, email } here; this sends it to Lucille via Resend.
// Replaces FormSubmit, which needed a confirmation step that never arrived.
//
// Secret it needs (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY   ← the same re_… key the reminder function uses
//
// NOTE: on Resend's free tier without a verified domain you can only deliver to
// the address the Resend account was created with — that's why INBOX below is
// the gmail one. Add a domain in Resend → Domains to send anywhere.
// ============================================================================

const INBOX = 'llucillespam@gmail.com';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'RESEND_API_KEY secret is not set' }),
      { status: 500, headers: { ...cors, 'content-type': 'application/json' } });
  }

  let body: { message?: string; email?: string; hp?: string };
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: 'bad json' }), { status: 400, headers: { ...cors, 'content-type': 'application/json' } }); }

  if (body.hp) return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, 'content-type': 'application/json' } }); // bot honeypot
  const message = (body.message ?? '').trim();
  if (message.length < 2) {
    return new Response(JSON.stringify({ error: 'empty message' }), { status: 400, headers: { ...cors, 'content-type': 'application/json' } });
  }
  const from = (body.email ?? '').trim() || '(not given)';
  const escape = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!));

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: '#Foodie <onboarding@resend.dev>',
      to: INBOX,
      reply_to: from.includes('@') ? from : undefined,
      subject: '💬 New #Foodie feedback',
      html: `
        <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;background:#FDFBF7;padding:28px;color:#1D1D1F">
          <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #ECE7DD;border-radius:16px;padding:28px">
            <div style="font-size:20px;font-weight:700">💬 Someone sent you a thought</div>
            <p style="white-space:pre-wrap;font-size:15px;line-height:1.6;margin:16px 0">${escape(message)}</p>
            <p style="color:#6E6A63;font-size:13px;border-top:1px solid #ECE7DD;padding-top:14px">
              Reply-to: ${escape(from)}
            </p>
          </div>
        </div>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return new Response(JSON.stringify({ error: 'resend failed', detail }),
      { status: 502, headers: { ...cors, 'content-type': 'application/json' } });
  }
  return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, 'content-type': 'application/json' } });
});
