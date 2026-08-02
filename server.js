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
// Default to the LITE model on purpose. `gemini-flash-latest` is the free tier's most
// contended model — on 2026-07-21 it returned 503 "high demand" for every attempt, and because
// it led MODEL_CHAIN every lookup burned two failed calls plus backoff on it before falling
// through, turning a ~5 s request into ~90 s. `gemini-flash-lite-latest` answered first time
// on both occasions we've tested, and its output passed validateDish() cleanly. The heavier
// model stays in the chain below as a fallback. Override with the MODEL env var on Render.
const MODEL   = process.env.MODEL || 'gemini-flash-lite-latest';
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
  "contains": [ every allergen in this dish, from "gluten" "dairy" "nuts" "eggs" "soy" "shellfish" "fish" "sesame" ],
  "ingredients": [
    { "name": "Ingredient", "qty": number, "unit": "g|ml|tbsp|can|slices or '' for a count",
      "category": "Produce" | "Meat & Fish" | "Dairy" | "Bakery" | "Frozen" | "Pantry",
      "buyDayBefore": true for fresh/perishable, false otherwise,
      "price": estimated EUR (number) for THIS quantity }
  ],
  "steps": [ "short step 1", "short step 2", ... 3 to 6 clear cooking steps ]
}
ALLERGENS — "contains" is the field the app actually trusts to keep someone safe, so fill it
honestly and completely. When unsure whether an ingredient carries an allergen, INCLUDE it:
over-listing costs one dish, under-listing can put someone in hospital. The non-obvious ones:
soy sauce contains gluten AND soy; bread, pasta, couscous and most baked goods contain gluten;
pesto often contains nuts and dairy; hummus and tahini contain sesame; Worcestershire sauce
contains fish. Note "category" is the SUPERMARKET AISLE, not an allergen — eggs are shelved
under "Dairy" but their allergen is "eggs", so a dish with eggs and no milk lists "eggs" only.

INGREDIENT NAMES are shopping-list names: what you'd write on a list, with no preparation.
"Chicken breast" not "chicken breast, cubed". "Onion" not "onion, finely chopped".
The preparation belongs in "steps".

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

Also include a top-level "estimatedTotal": the sum of every ingredient "price" across the whole
week, in EUR, for ${people} ${people === 1 ? 'person' : 'people'} — add up the numbers you already
priced per ingredient rather than inventing a separate figure; it must be internally consistent
with them.

Return ONLY this JSON structure (breakfast is a RECIPE; lunch & dinner hold a "courses" object with ${courseList}):
{ "week": [ { "day": "Monday", "meals": [
    { "type": "breakfast", ...RECIPE fields... },
    { "type": "lunch",  "courses": { ${courses.map(c => `"${c}": <RECIPE>`).join(', ')} } },
    { "type": "dinner", "courses": { ${courses.map(c => `"${c}": <RECIPE>`).join(', ')} } }
] }, ... 7 days Monday..Sunday ],
  "estimatedTotal": <number, EUR, whole week, for ${people} ${people === 1 ? 'person' : 'people'}> }`;
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

/* ---- 2b. "Add a dish I love" — research one dish INTO the database (V3 §0.7) ----
   This is a RESEARCHER, not an author: it fills in a permanent database row for a dish the
   user already named, rather than inventing a meal at plan time. The output shape is
   `recipes-db.js`'s, NOT buildPrompt()'s recipe shape — they are deliberately different
   (per-serving metric quantities, prep/cook split, explicit contains[]).
   The client re-validates everything here with validateDish(); this prompt is the first line
   of defence, not the only one. */
function buildResearchPrompt({ mode, query, profile } = {}) {
  const p = profile || {};
  const people = Math.min(8, Math.max(1, Number(p.people) || 1));
  const ask = {
    name: `The user says they love this dish: "${query}".
Research the classic, widely-recognised version of it and produce a standard recipe.`,
    text: `The user pasted the following recipe. EXTRACT and convert what is actually written here.
Do NOT substitute a different recipe, and do NOT add ingredients that aren't present:
"""
${String(query || '').slice(0, 12000)}
"""`,
    url: `The user gave this recipe link: ${query}
Use what you reliably know about that page's recipe. If you do not actually know its contents,
return the refusal object rather than guessing at it.`,
    photo: `The user photographed a recipe card or cookbook page (attached as an image).
READ the image and convert only what is legibly written there. Do not fill gaps by invention —
if too much is unreadable, return the refusal object.`,
  }[mode] || '';

  return `You are a careful recipe librarian filling in ONE row of a curated recipe database.

${ask}

Return a single JSON object in EXACTLY this shape (no extra fields, no missing fields):
{
  "ok": true,
  "dish": {
    "type": one of "breakfast" | "lunch" | "dinner" | "starter" | "dessert",
    "types": array of EVERY role this dish can fill, drawn from the same five words, and it MUST include "type",
    "name": "short dish name",
    "desc": "4-6 word ingredient summary",
    "sourceUrl": the real recipe URL if and only if you are certain of it, otherwise null,
    "sourceName": the site or book name if known, otherwise null,
    "emoji": one food emoji that suits the dish,
    "prepTime": integer minutes of ACTIVE preparation,
    "cookTime": integer minutes of ACTIVE cooking,
    "time": integer, MUST equal prepTime + cookTime exactly,
    "passiveTime": integer minutes of unattended chilling/marinating/rising (0 if none),
    "difficulty": integer 1-4 (1 = very easy, 4 = advanced),
    "servings": integer the ORIGINAL recipe yields (informational only),
    "kcal": integer calories PER SERVING,
    "protein": integer grams of protein PER SERVING,
    "nutrition": "source" if you read real published nutrition figures, otherwise "estimated",
    "tags": array of any of "vegetarian" "vegan" "fish" "quick" "comfort" (may be empty),
    "contains": array of allergens, see the ALLERGEN RULE below,
    "ingredients": [ { "name": "...", "qty": positive number, "unit": "...", "category": "...", "buyDayBefore": true|false }, ... ],
    "steps": [ "step 1", "step 2", ... ]
  }
}

THE RULES THAT MATTER MOST — a row breaking any of these is useless and will be rejected:

1. QUANTITIES ARE PER SINGLE SERVING, in metric. The app multiplies by household size
   afterwards (it is currently cooking for ${people}), so never give a whole-recipe amount.
   If the source recipe serves 4, DIVIDE every quantity by 4.
2. "unit" must be EXACTLY one of: "g" "ml" "tsp" "tbsp" "piece" "clove" "slice" "stalk" "pinch".
3. "category" must be EXACTLY one of: "Produce" "Meat & Fish" "Dairy" "Bakery" "Frozen" "Pantry".
   This is the SUPERMARKET AISLE, not an allergen: eggs are shelved under "Dairy", coconut milk
   and soy sauce under "Pantry". Allergens go in "contains" and nowhere else.
3b. "name" is a shopping-list name — what you'd write on a list, with no preparation.
   "Chicken breast" not "chicken breast, cubed". "Onion" not "onion, finely chopped".
   Preparation belongs in "steps".
4. ALLERGEN RULE — "contains" must list EVERY allergen present, drawn only from:
   "gluten" "dairy" "nuts" "eggs" "soy" "shellfish" "fish" "sesame".
   When you are unsure whether an ingredient carries an allergen, INCLUDE IT.
   Over-listing costs the user one dish. Under-listing can put them in hospital.
   Remember the non-obvious ones: soy sauce contains gluten AND soy; bread, pasta, couscous,
   ladyfingers and most baked goods contain gluten; pesto often contains nuts and dairy;
   hummus and tahini contain sesame; Worcestershire sauce contains fish.
5. "time" must equal "prepTime" + "cookTime". Chilling, marinating and proving are NOT active
   time — they belong in "passiveTime".
6. NEVER invent a "sourceUrl" or any image URL. If you are not certain of a real one, return
   null. A guessed link is worse than no link.
7. "buyDayBefore" is true only for genuinely perishable fresh items (fresh fish, fresh herbs,
   salad leaves, fresh bread); false for pantry staples and anything that keeps a week.

IF YOU CANNOT DO THIS HONESTLY, refuse. Return exactly:
{ "ok": false, "reason": "<one short sentence saying why>" }
Refuse when: the request is not a real dish, the pasted text is not a recipe, the image is not
legible enough, or you would have to invent the recipe rather than recall or read it.
A refusal is a correct answer. A fabricated dish is not.

Return ONLY the JSON object, nothing else.`;
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
  MODEL,                        // gemini-flash-lite-latest by default — see the note on MODEL
  'gemini-flash-latest',        // heavier, but the first to be throttled on the free tier
  'gemini-2.0-flash-lite',
])];
const RETRYABLE = /\b(429|500|502|503|504)\b|UNAVAILABLE|overloaded|high demand/i;

// `imageBase64` is optional and only used by /research-dish photo mode (V3 §0.7.2): Gemini
// takes an image as a second `inlineData` part alongside the text prompt.
async function callAIonce(prompt, model = MODEL, imageBase64 = null, mimeType = 'image/jpeg') {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const parts = [{ text: prompt }];
  if (imageBase64) parts.push({ inlineData: { mimeType, data: imageBase64 } });
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': API_KEY },
    body: JSON.stringify({
      contents: [{ parts }],
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

async function callAI(prompt, imageBase64 = null, mimeType = 'image/jpeg') {
  let lastErr;
  for (const model of MODEL_CHAIN) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const out = await callAIonce(prompt, model, imageBase64, mimeType);
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
  // "Add a dish I love" (V3 §0.7): research ONE dish into a database row. Distinct from the
  // §0.3 step-10 top-up, which reuses /generate-meal and must not come here.
  if (req.method === 'POST' && req.url === '/research-dish') {
    if (!API_KEY) return sendJson(res, 500, { error: 'No API key configured on the server.' });
    try {
      const { mode, query, imageBase64, mimeType, profile } = await readBody(req);
      if (!['name', 'text', 'url', 'photo'].includes(mode)) return sendJson(res, 400, { error: 'Unknown mode.' });
      if (mode !== 'photo' && !String(query || '').trim()) return sendJson(res, 400, { error: 'Nothing to look up.' });
      if (mode === 'photo' && !imageBase64) return sendJson(res, 400, { error: 'No image supplied.' });
      // 4 MB cap (§0.7.2) — base64 is ~4/3 the byte size of the original.
      if (imageBase64 && imageBase64.length > 4 * 1024 * 1024 * 1.37) {
        return sendJson(res, 413, { error: 'That photo is too large. Try a smaller one.' });
      }
      const out = await callAI(buildResearchPrompt({ mode, query, profile }), imageBase64 || null, mimeType || 'image/jpeg');
      return sendJson(res, 200, out);
    } catch (e) { console.error(e.message); return sendJson(res, 500, { error: e.message }); }
  }
  // Find a REAL photo for a dish the user added (V4.6). A model cannot be trusted to produce a
  // working image URL — it invents them — so validateDish() drops any photo Gemini supplies.
  // Instead we take the dish's genuine `sourceUrl` (a real recipe page the model found) and read
  // that page's own og:image. That is a real photograph of that exact dish, published by that
  // site, and it's verified to actually load before we hand it back. If anything is off we return
  // photo:null and the dish keeps its emoji tile — never a wrong or broken picture.
  if (req.method === 'GET' && req.url.startsWith('/dish-image')) {
    try {
      const target = new URL(req.url, 'http://x').searchParams.get('url') || '';
      if (!/^https?:\/\//i.test(target)) return sendJson(res, 400, { error: 'Bad url' });
      const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';
      const page = await fetch(target, { headers: { 'user-agent': UA }, redirect: 'follow' });
      if (!page.ok) return sendJson(res, 200, { photo: null });
      const html = (await page.text()).slice(0, 400000);
      const grab = (re) => { const m = html.match(re); return m ? m[1] : null; };
      let img =
        grab(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        grab(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
        grab(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
      if (!img) return sendJson(res, 200, { photo: null });
      img = new URL(img, target).href;                       // resolve protocol-relative / relative
      // Confirm it really is a loadable image before we let it near the UI.
      const head = await fetch(img, { method: 'HEAD', headers: { 'user-agent': UA }, redirect: 'follow' });
      const type = head.headers.get('content-type') || '';
      if (!head.ok || !type.startsWith('image/')) return sendJson(res, 200, { photo: null });
      return sendJson(res, 200, { photo: img });
    } catch (e) { return sendJson(res, 200, { photo: null }); }
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
