#!/usr/bin/env node
/* Regenerates docs/INGREDIENT-PRICES.md from public/ingredient-prices.js.
   public/ingredient-prices.js is the SINGLE SOURCE OF TRUTH — never hand-edit the .md,
   it is overwritten. Change a price, add an ingredient, then run:
     node tools/build-prices-md.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { INGREDIENT_PRICES } = require(path.join(ROOT, 'public', 'ingredient-prices.js'));
let coverage = null;
try {
  const { RECIPES_DB } = require(path.join(ROOT, 'public', 'recipes-db.js'));
  const used = new Set();
  RECIPES_DB.forEach(r => r.ingredients.forEach(i => used.add(i.name.toLowerCase())));
  const priced = [...used].filter(n => INGREDIENT_PRICES[n]);
  coverage = { total: used.size, priced: priced.length };
} catch (e) { /* recipes-db.js optional for this generator */ }

const CATS = [
  ['Meat & Fish', ['chicken breast','chicken thighs','beef mince','ground turkey','bacon','cooked ham','salmon fillet','shrimp']],
  ['Dairy', ['eggs','milk','almond milk','greek yogurt','butter','cheddar','parmesan','pecorino','feta','fresh mozzarella','mascarpone','cream cheese','double cream','sour cream']],
  ['Bakery', ['baguette','crusty bread','sourdough bread','large flour tortilla','small tortillas','savoiardi ladyfingers']],
  ['Produce', ['apple','avocado','banana','bell pepper','bell peppers','red bell pepper','green bell pepper','carrots','celery','cherry tomatoes','cremini mushrooms','cucumber','garlic','heirloom tomatoes','ripe tomatoes','kale','spinach','lemon','lime','onion','yellow onion','red onion','spring onions','fresh ginger','fresh basil','fresh mint','fresh parsley','flat-leaf parsley','fresh coriander']],
  ['Pantry', null],  // everything else
];

function section(title, keys) {
  const rows = keys.map(k => [k, INGREDIENT_PRICES[k]]).filter(([, v]) => v);
  if (!rows.length) return [];
  const out = [`### ${title} (${rows.length})`, '', '| Ingredient | Price basis | EUR |', '|---|---|---|'];
  rows.sort((a, b) => a[0].localeCompare(b[0]));
  rows.forEach(([name, { per, eur }]) => {
    const label = name.replace(/\b\w/g, c => c.toUpperCase());
    out.push(`| ${label} | per ${per.replace('100g', '100 g').replace('100ml', '100 ml')} | €${eur.toFixed(2)} |`);
  });
  out.push('');
  return out;
}

let out = [];
out.push('# 💶 Ingredient price table — #Foodie');
out.push('');
out.push('> **Generated file — do not edit by hand.**');
out.push('> The source of truth is [`public/ingredient-prices.js`](../public/ingredient-prices.js).');
out.push('> Change a price there, then run `node tools/build-prices-md.js` to rebuild this page.');
out.push('');
out.push(`**${Object.keys(INGREDIENT_PRICES).length} ingredients priced.**` +
  (coverage ? ` Covers ${coverage.priced} of the ${coverage.total} distinct ingredients currently used by \`recipes-db.js\`.` : ''));
out.push('');
out.push('⚠️ **These are informed estimates, not live scraped prices** — a French supermarket');
out.push('(Carrefour / Leclerc / Intermarché), mid-range own-brand, 2026. They exist so the shopping');
out.push('total, the €/day pill and the per-day chips show a believable number **even with AI off**.');
out.push('Always label them in the app as *"Estimated — varies by shop."* Gemini\'s own price estimate');
out.push('(when AI is on) always takes priority over this table — see `priceOf()` in `app.js`.');
out.push('');

const listed = new Set();
for (const [title, keys] of CATS) {
  if (keys) { keys.forEach(k => listed.add(k)); out.push(...section(title, keys)); }
}
const rest = Object.keys(INGREDIENT_PRICES).filter(k => !listed.has(k));
out.push(...section('Pantry', rest));

out.push('---');
out.push('');
out.push('## Adding or correcting a price');
out.push('');
out.push('1. Open [`public/ingredient-prices.js`](../public/ingredient-prices.js).');
out.push('2. Find or add a line: `\'ingredient name\': {per:\'100g\', eur:1.10},` — key must be the');
out.push('   ingredient\'s exact lowercase name as it appears in `recipes-db.js`.');
out.push('3. `per` is one of `100g`, `100ml`, `piece`, `clove`, `slice`, `stalk` — whichever the');
out.push('   ingredient is naturally priced by.');
out.push('4. Run `node tools/build-prices-md.js` to rebuild this page.');
out.push('');
out.push('A dish ingredient whose name isn\'t in this table simply prices at €0 rather than a guess —');
out.push('check the terminal output of the build script, it lists anything used but unpriced.');
out.push('');

fs.writeFileSync(path.join(ROOT, 'docs', 'INGREDIENT-PRICES.md'), out.join('\n'));
console.log(`Wrote docs/INGREDIENT-PRICES.md — ${Object.keys(INGREDIENT_PRICES).length} ingredients.`);
if (coverage && coverage.priced < coverage.total) {
  console.log(`⚠️  ${coverage.total - coverage.priced} ingredient(s) used in recipes-db.js have no price yet.`);
}
