#!/usr/bin/env node
/* Regenerates docs/RECIPE-DATABASE.md from public/recipes-db.js.
   public/recipes-db.js is the SINGLE SOURCE OF TRUTH — never hand-edit the .md,
   it is overwritten. Add dishes to the .js, then run:  node tools/build-recipe-md.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { RECIPES_DB } = require(path.join(ROOT, 'public', 'recipes-db.js'));

const GROUPS = [
  ['Breakfasts',            r => r.type === 'breakfast'],
  ['Starters & small plates', r => r.type === 'starter'],
  ['Mains',                 r => r.type === 'lunch' || r.type === 'dinner'],
  ['Desserts',              r => r.type === 'dessert'],
];

const DIFF = { 1: 'Very easy', 2: 'Easy', 3: 'Needs a bit of care', 4: 'A project' };
const dots = d => '●'.repeat(d) + '○'.repeat(4 - d);
const qty  = i => `${+i.qty.toFixed(3)}${i.unit && i.unit !== 'piece' ? ' ' + i.unit : i.unit === 'piece' ? '' : ''}`.trim();

const mins = m => m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? (m % 60) + ' min' : ''}`.trim() : `${m} min`;

let out = [];
out.push('# 🍽️ Curated recipe database — #Foodie');
out.push('');
out.push('> **Generated file — do not edit by hand.**');
out.push('> The source of truth is [`public/recipes-db.js`](../public/recipes-db.js).');
out.push('> Add or change a dish there, then run `node tools/build-recipe-md.js` to rebuild this page.');
out.push('');
out.push(`**${RECIPES_DB.length} dishes** · every link, photo, calorie and protein figure was read from the`);
out.push('recipe site\'s own structured data — nothing here is invented by AI.');
out.push('');

// summary table
const counts = {};
RECIPES_DB.forEach(r => { counts[r.type] = (counts[r.type] || 0) + 1; });
out.push('| Course | Dishes |');
out.push('|---|---|');
out.push(`| Breakfast | ${counts.breakfast || 0} |`);
out.push(`| Starter | ${counts.starter || 0} |`);
out.push(`| Main (lunch / dinner) | ${(counts.lunch || 0) + (counts.dinner || 0)} |`);
out.push(`| Dessert | ${counts.dessert || 0} |`);
out.push('');
out.push('`Nutrition: source` = the figure published by the recipe site. `estimated` = worked out here');
out.push('from the ingredient list, so treat it as a good approximation rather than a measured value.');
out.push('');

let n = 0;
for (const [title, test] of GROUPS) {
  const dishes = RECIPES_DB.filter(test);
  if (!dishes.length) continue;
  out.push('');
  out.push(`# ${title}`);
  out.push('');

  for (const r of dishes) {
    n++;
    out.push('---');
    out.push('');
    out.push(`## ${n}. ${r.name}`);
    out.push('');
    out.push(`*${r.desc}*`);
    out.push('');
    out.push(`<img src="${r.photo}" alt="${r.name}" width="420">`);
    out.push('');
    out.push(`**Recipe:** [${r.sourceName} ↗](${r.sourceUrl})`);
    out.push('');
    out.push('| | |');
    out.push('|---|---|');
    out.push(`| **Calories** | ${r.kcal} kcal per serving |`);
    out.push(`| **Protein** | ${r.protein} g per serving |`);
    out.push(`| **Time** | ${mins(r.time)} active${r.passiveTime ? ` · plus ${mins(r.passiveTime)} chilling / marinating` : ''} |`);
    out.push(`| **Prep / cook** | ${mins(r.prepTime)} prep · ${mins(r.cookTime)} cook |`);
    out.push(`| **Difficulty** | ${dots(r.difficulty)} ${DIFF[r.difficulty]} |`);
    out.push(`| **Serves** | ${r.servings} |`);
    out.push(`| **Course** | ${r.types.join(', ')} |`);
    out.push(`| **Diet tags** | ${r.tags.length ? r.tags.join(', ') : '—'} |`);
    out.push(`| **Contains** | ${r.contains && r.contains.length ? r.contains.join(', ') : 'none of the tracked allergens'} |`);
    out.push(`| **Nutrition** | ${r.nutrition} |`);
    out.push('');
    out.push('**Ingredients** *(per serving — the app multiplies these by household size)*');
    out.push('');
    out.push('| Ingredient | Amount | Aisle |');
    out.push('|---|---|---|');
    for (const i of r.ingredients) {
      out.push(`| ${i.name}${i.buyDayBefore ? ' 🥬' : ''} | ${qty(i)} | ${i.category} |`);
    }
    out.push('');
    out.push('🥬 = buy fresh, close to the day you cook it.');
    out.push('');
    out.push('**Method**');
    out.push('');
    r.steps.forEach((s, k) => out.push(`${k + 1}. ${s}`));
    out.push('');
  }
}

out.push('---');
out.push('');
out.push('## Adding your own dishes');
out.push('');
out.push('1. Open [`public/recipes-db.js`](../public/recipes-db.js).');
out.push('2. Copy any existing block, paste it at the end of its section, and change the values.');
out.push('3. Give it a **unique `id` starting with `db-`**.');
out.push('4. Amounts are **per serving, metric** (g / ml / tsp / tbsp). Do not pre-multiply for a family —');
out.push('   the app scales them itself.');
out.push('5. `category` must be exactly one of: `Produce`, `Meat & Fish`, `Dairy`, `Bakery`, `Frozen`, `Pantry`.');
out.push('6. Run `node tools/build-recipe-md.js` to rebuild this page.');
out.push('');

fs.writeFileSync(path.join(ROOT, 'docs', 'RECIPE-DATABASE.md'), out.join('\n'));
console.log(`Wrote docs/RECIPE-DATABASE.md — ${RECIPES_DB.length} dishes.`);
