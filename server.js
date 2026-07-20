/* ============================================================
   MEAL PLANNER — BACKEND (the "middleman")
   Uses Google Gemini's FREE tier (no credit card needed).
   Run with:  node server.js   (from the folder this file is in)
   Your key goes in a plain file next to this one: gemini-key.txt
   ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');

/* ---- 1a. Optional .env support ---- */
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    process.env[key] = val;
  }
}
loadEnv();

/* ---- 1b. Key from plain file gemini-key.txt ---- */
function readKeyFile() {
  const p = path.join(__dirname, 'gemini-key.txt');
  if (!fs.existsSync(p)) return '';
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    return t;
  }
  return '';
}

const API_KEY = readKeyFile() || process.env.GEMINI_API_KEY;
const MODEL   = process.env.MODEL || 'gemini-flash-latest';
const PORT    = process.env.PORT || 8787;   // host (e.g. Render) sets PORT; default 8787 for local use

if (!API_KEY) {
  console.log('\n⚠️  No API key found. Open the file "gemini-key.txt" in this folder and paste');
  console.log('   your key on the first line, then save and run  node server.js  again.');
  console.log('   Get a free key (no card) at https://aistudio.google.com → Get API key.\n');
}

/* ---- daily nutrition target (Mifflin–St Jeor → TDEE → goal → protein) ---- */
function computeTargets(p) {
  const kg = Number(p.weight), cm = Number(p.height), age = Number(p.age);
  if (!(kg > 0 && cm > 0 && age > 0)) return null;
  let bmr;
  if (p.gender === 'male') bmr = 10 * kg + 6.25 * cm - 5 * age + 5;
  else if (p.gender === 'female') bmr = 10 * kg + 6.25 * cm - 5 * age - 161;
  else bmr = 10 * kg + 6.25 * cm - 5 * age - 78;
  const f = Number(p.frequency) || 0;
  const mult = f <= 0 ? 1.2 : f <= 2 ? 1.375 : f <= 4 ? 1.55 : f <= 6 ? 1.725 : 1.9;
  let tdee = bmr * mult;
  const goal = p.goal || 'maintain';
  if (goal === 'lose') tdee *= 0.80; else if (goal === 'gain') tdee *= 1.12;
  return { kcal: Math.round(tdee / 10) * 10, protein: Math.round(kg * (goal === 'maintain' ? 1.6 : 2.0)) };
}

/* ---- per-meal kcal split (mirrors the client's mealSplit, §6.7) ---- */
function mealKcal(p, t) {
  if (!t) return null;
  const s = p.mealSplit || { breakfast: 25, lunch: 40, dinner: 35 };
  const b = Number(s.breakfast) || 0, l = Number(s.lunch) || 0, d = Number(s.dinner) || 0;
  const sum = (b + l + d) || 1;
  const per = x => Math.round(t.kcal * x / sum / 10) * 10;
  return { breakfast: per(b), lunch: per(l), dinner: per(d) };
}
function coursesForGoal(goal) {
  if (goal === 'gain') return ['starter', 'main', 'dessert'];
  if (goal === 'lose') return ['main', 'dessert'];
  return ['starter', 'main'];
}

/* ---- 2. The instructions we give the AI ---- */
function buildPrompt(profile, mode, avoid = {}) {
  const p = profile || {};
  const city = (p.city && p.city.trim()) ? p.city.trim() : 'Paris, France';
  const people = Math.min(8, Math.max(1, Number(p.people) || 1));
  const t = computeTargets(p);
  const mk = mealKcal(p, t);
  const bpd = Number(p.budgetPerDay) || (p.budget ? Math.round(Number(p.budget) / 7) : 0);
  const courses = coursesForGoal(p.goal);
  const brk = p.breakfastPref === 'sweet' ? 'SWEET' : p.breakfastPref === 'savory' ? 'SAVORY' : 'either sweet or savory';
  const cuisines = (p.cuisines || []).filter(c => c && c !== 'Surprise me');
  const targetLine = t
    ? `\n- DAILY TARGET (per person): about ${t.kcal} kcal and ${t.protein} g protein per day.`
    : '';
  const perMealLine = mk
    ? `\n- PER-MEAL kcal targets (per person, stay within ±10%): breakfast ≈ ${mk.breakfast}, lunch ≈ ${mk.lunch}, dinner ≈ ${mk.dinner}. For a multi-course lunch/dinner, the courses together should sum to that meal's target (starter & dessert lighter than the main).`
    : '';
  const leftoverLine = p.leftovers
    ? `\n- LEFTOVERS: the person reuses some dinners as next-day lunch. Make dinner mains reheat well and portion them generously.`
    : '';
  const who = `
Person's profile:
- Cooking for: ${people} ${people === 1 ? 'person' : 'people'} — ALL ingredient quantities and prices must be for ${people} ${people === 1 ? 'person' : 'people'}. kcal and protein are PER PERSON.
- Weight: ${p.weight || 'unknown'} kg
- Gender: ${p.gender || 'unspecified'}
- Life stage: ${p.lifeStage || 'working'} (student=quick/cheap, working=fast weeknights, parent=family-friendly, flexible=has time)
- Goal: ${p.goal || 'maintain'} (lose / maintain / gain muscle)
- Activity: ${p.sport || 'none'}, ${p.frequency || 0} times per week
- Cooking confidence: ${p.cookingLevel || 5}/10 (lower = keep recipes simple)
- Time per meal: about ${p.timePerMeal || 30} minutes max
- Breakfast preference: ${brk} breakfasts.
- Cuisines they love (favor these): ${cuisines.length ? cuisines.join(', ') : 'any — surprise them'}
- Dislikes to AVOID: ${(p.dislikes || []).join(', ') || 'none'}
- Also cannot / will NOT eat (respect strictly): ${p.avoidText && p.avoidText.trim() ? p.avoidText.trim() : 'nothing extra'}
- Allergies (STRICTLY EXCLUDE): ${(p.allergies || []).join(', ') || 'none'}
- Daily grocery budget: ${bpd ? '€' + bpd + ' per day' : 'no strict budget'}
- Prices reflect a typical supermarket in: ${city}${targetLine}${perMealLine}${leftoverLine}`;

  const portions = `
PORTION SIZES — make meals genuinely filling for a full-grown adult, enough to actually satisfy for the whole day. Do NOT under-portion. Rough guide per person:
- Protein main: 130-200 g meat/fish (or 150-250 g tofu/legumes). Breakfast: 2-3 eggs, or 60-80 g oats/cereal, or 200 g yogurt.
- Carbs: 75-100 g dry rice/pasta/grains, or 2 slices bread, or 250-350 g potatoes.
- Vegetables/fruit: 150-250 g.
The THREE meals of each day together should cover the person's realistic daily energy needs for their goal (lighter for "lose", larger and higher-protein for "gain"). If in doubt, make portions bigger, not smaller.`;

  const pricing = `
PRICING — use REALISTIC ${city} supermarket prices (2026), not cheap guesses. Reference anchors:
- Chicken breast ≈ €11/kg, beef ≈ €15/kg, salmon ≈ €22/kg, white fish ≈ €18/kg, shrimp ≈ €20/kg
- Eggs ≈ €0.35 each, milk ≈ €1.20/L, cheese ≈ €18/kg, yogurt ≈ €2/500 g
- Rice/pasta ≈ €2/kg, bread ≈ €1.50/loaf, most vegetables €2-4/kg, fruit €2.5-5/kg, olive oil ≈ €0.10/tbsp
Price EACH ingredient for its actual quantity. A realistic weekly grocery total for ONE person eating 3 real meals a day is typically €45-85. If your running total is far below ~€45, your prices are too low — raise them to be realistic. Respect the budget if given, but never make prices unrealistically cheap to fit it.`;

  const shape = `
A RECIPE object has EXACTLY these fields:
{
  "name": "short dish name",
  "desc": "4-6 word ingredient summary",
  "time": integer minutes to prepare,
  "difficulty": integer 1-5 (1=very easy, 5=advanced),
  "emoji": "one food emoji",
  "img": "1-2 lowercase photo keywords, e.g. salmon,dinner",
  "kcal": integer, estimated calories PER PERSON for this course,
  "protein": integer, estimated grams of protein PER PERSON for this course,
  "ingredients": [
    { "name": "Ingredient", "qty": number, "unit": "g|ml|tbsp|can|slices or '' for a count",
      "category": "Produce" | "Meat & Fish" | "Dairy" | "Bakery" | "Frozen" | "Pantry",
      "buyDayBefore": true for fresh/perishable, false otherwise,
      "price": estimated EUR (number) for THIS quantity }
  ],
  "steps": [ "short step 1", "short step 2", ... 3 to 6 clear cooking steps ]
}
Rules: portions per ONE person (see PORTION SIZES). Match difficulty/time to cooking confidence and time-per-meal. Realistic quantities, categories, and EUR prices (see PRICING). Do NOT include any "url"/"link" field — never invent recipe links. Output valid JSON only. No trailing commas.`;

  // Which courses lunch & dinner get for this person's goal.
  const courseList = courses.join(' + ');
  const coursesShape = `
COURSES — lunch and dinner are multi-course for this person: ${courseList}. Starters and desserts are LIGHTER than the main (starter ≈ 120-220 kcal, dessert ≈ 120-220 kcal). ${courses.includes('starter') ? '' : 'No starter. '}${courses.includes('dessert') ? '' : 'No dessert. '}Breakfast is a single ${brk} dish.`;

  if (mode === 'week') {
    return `You are a meal-planning assistant. Create a FULL 7-DAY meal plan personalised to this person.

CRITICAL — LENGTH: the "week" array MUST contain EXACTLY 7 day objects, in this order:
Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.
Do NOT stop after one day. Do NOT return a partial week. A response with fewer than 7 days is invalid
and will be rejected. Keep each recipe concise so all 7 days fit in one response.

CRITICAL — NO REPEATS: every dish name must be UNIQUE across the ENTIRE week — no dish (main, starter or dessert) may appear twice, on any day. A repeated name makes the whole response invalid. Favor the cuisines they love.
${who}
${portions}
${pricing}
${coursesShape}
${shape}

Return ONLY this JSON structure (breakfast is a RECIPE; lunch & dinner hold a "courses" object with ${courseList}):
{ "week": [ { "day": "Monday", "meals": [
    { "type": "breakfast", ...RECIPE fields... },
    { "type": "lunch",  "courses": { ${courses.map(c => `"${c}": <RECIPE>`).join(', ')} } },
    { "type": "dinner", "courses": { ${courses.map(c => `"${c}": <RECIPE>`).join(', ')} } }
] }, ... 7 days Monday..Sunday ] }`;
  }

  const role = avoid.type || 'dinner';
  const roleWord = role === 'starter' ? 'starter (light, ~120-220 kcal)'
    : role === 'dessert' ? 'dessert (light, ~120-220 kcal)'
    : `${role} dish`;
  return `You are a meal-planning assistant. Suggest ONE ${roleWord} for this person, DIFFERENT from these already-used dishes: ${(avoid.names || []).join(', ') || 'none'}.
${who}
${portions}
${pricing}
${shape}

Return ONLY this JSON structure:
{ "meal": <a single RECIPE object> }`;
}

/* ---- 3. Call the Gemini API ---- */
function sanitizeJson(text) {
  let t = text.trim().replace(/^```(json)?/i, '').replace(/```\s*$/, '').trim();
  t = t.replace(/,(\s*[}\]])/g, '$1');
  return t;
}
// Google's capacity varies a lot on the free tier: `gemini-flash-latest` returned 503 ("high
// demand") for minutes on end, and some pinned models 404 (retired) or 429 (no free quota).
// So we try a chain and use the first that answers. MODEL env var still wins as the first choice.
const MODEL_CHAIN = [...new Set([
  MODEL,
  'gemini-flash-latest',
  'gemini-flash-lite-latest',   // verified working 2026-07-20 when the others were 503
  'gemini-2.0-flash-lite',
])];
const RETRYABLE = /\b(429|500|502|503|504)\b|UNAVAILABLE|overloaded|high demand/i;

async function callAIonce(prompt, model = MODEL) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': API_KEY },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 32768, responseMimeType: 'application/json' },
    }),
  });
  if (!res.ok) { const detail = await res.text(); throw new Error(`Gemini API ${res.status}: ${detail}`); }
  const data = await res.json();
  const finish = data?.candidates?.[0]?.finishReason;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini: ' + JSON.stringify(data).slice(0, 300));
  if (finish && finish !== 'STOP') throw new Error(`Response cut off (finishReason=${finish})`);
  return JSON.parse(sanitizeJson(text));
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callAI(prompt) {
  let lastErr;
  for (const model of MODEL_CHAIN) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const out = await callAIonce(prompt, model);
        if (model !== MODEL) console.log(`(used fallback model: ${model})`);
        return out;
      } catch (e) {
        lastErr = e;
        console.warn(`${model} attempt ${attempt} failed: ${e.message.slice(0, 120)}`);
        if (!RETRYABLE.test(e.message)) break;      // 404/400 etc. → next model, don't retry this one
        if (attempt === 1) await sleep(1500);        // brief backoff before the second try
      }
    }
  }
  throw lastErr;
}

/* ---- 4. The web server ---- */
function sendJson(res, status, obj) {
  res.writeHead(status, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'POST, OPTIONS',
  });
  res.end(JSON.stringify(obj));
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); } });
  });
}
/* ---- static file serving for the /public app-shell ---- */
const PUBLIC_DIR = path.join(__dirname, 'public');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};
// Serve a file from /public. urlPath '/' maps to index.html.
// Rejects anything that escapes /public (path-traversal guard).
function sendStatic(res, urlPath) {
  let decoded;
  try { decoded = urlPath === '/' ? 'index.html' : decodeURIComponent(urlPath); }
  catch { res.writeHead(400, { 'content-type': 'text/plain' }); return res.end('Bad request'); }
  const rel = decoded.replace(/^\/+/, '');
  const filePath = path.join(PUBLIC_DIR, rel);
  if (!filePath.startsWith(PUBLIC_DIR + path.sep) && filePath !== path.join(PUBLIC_DIR, 'index.html')) {
    res.writeHead(403, { 'content-type': 'text/plain' }); return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, buf) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'content-type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(buf);
  });
}
const server = http.createServer(async (req, res) => {
 try {
  if (req.method === 'OPTIONS') return sendJson(res, 204, {});
  if (req.method === 'POST' && req.url === '/generate-week') {
    if (!API_KEY) return sendJson(res, 500, { error: 'No API key configured on the server.' });
    try { const profile = await readBody(req); return sendJson(res, 200, await callAI(buildPrompt(profile, 'week'))); }
    catch (e) { console.error(e.message); return sendJson(res, 500, { error: e.message }); }
  }
  if (req.method === 'POST' && req.url === '/generate-meal') {
    if (!API_KEY) return sendJson(res, 500, { error: 'No API key configured on the server.' });
    try { const { profile, type, avoidNames } = await readBody(req); return sendJson(res, 200, await callAI(buildPrompt(profile, 'meal', { type, names: avoidNames }))); }
    catch (e) { console.error(e.message); return sendJson(res, 500, { error: e.message }); }
  }
  // Any other GET → serve the app-shell from /public (index.html, styles.css, app.js, assets…).
  if (req.method === 'GET') return sendStatic(res, req.url.split('?')[0]);
  sendJson(res, 404, { error: 'Not found' });
 } catch (e) {
  // Never let a single bad request take the whole server down.
  console.error('Request error:', e && e.message);
  try { if (!res.headersSent) sendJson(res, 500, { error: 'Server error' }); else res.end(); } catch {}
 }
});
server.listen(PORT, () => {
  console.log(`\n✅ Meal Planner backend running at http://localhost:${PORT}`);
  console.log(`   Provider: Google Gemini (free tier)`);
  console.log(`   Model: ${MODEL}`);
  console.log(`   Key loaded: ${API_KEY ? 'yes' : 'NO — add it to gemini-key.txt'}`);
  console.log(`   Leave this window open while you use the app. Press Ctrl+C to stop.\n`);
});
