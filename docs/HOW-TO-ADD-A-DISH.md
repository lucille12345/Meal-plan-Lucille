# 🍳 How to add a dish yourself — no coding needed

This is your guide for adding new dishes to `public/recipes-db.js` — the file with all the
real recipes in it. You don't need to know how to code. You just need to **copy a block, paste
it, and change the words and numbers inside it.**

Two files work together:
- **`public/recipes-db.js`** — the dishes themselves (this guide).
- **`public/ingredient-prices.js`** — what each ingredient costs (its own short guide is at the
  bottom of this file, § 6).

---

## 1. Where to paste your new dish

Open `public/recipes-db.js` in TextEdit, Notes, or any text editor. Scroll to the section your
dish belongs in — you'll see big banner comments like:

```
/* ==========================================================================
   BREAKFASTS
   ========================================================================== */
```

There are four sections: **BREAKFASTS**, **STARTERS & SMALL PLATES**, **MAINS**, **DESSERTS**.
Find the right one, then paste your new dish **right after the last `},` in that section**, still
inside the big `[ ... ]` that holds them all. Don't paste it outside the square brackets at the
top and bottom of the file.

---

## 2. The blank template — copy this and fill it in

Copy everything between the lines below into the file, then change the parts in `⟨angle brackets⟩`.
**Every line needs a comma at the end except the very last one before the closing `}` — copy the
punctuation exactly as shown, that's the part that has to be perfect.**

```js
/* --- NEW. ⟨YOUR DISH NAME IN CAPS⟩ --- */
{
  id:'db-⟨unique-short-code⟩', type:'⟨main role⟩', types:['⟨role1⟩','⟨role2⟩'],
  name:'⟨Dish name⟩', desc:'⟨4 to 6 words describing it⟩',
  sourceUrl:'⟨the web address of the recipe⟩',
  sourceName:'⟨the name of the website⟩',
  photo:'⟨the web address of a photo of the finished dish⟩',
  emoji:'⟨one food emoji⟩', img:'⟨one plain English word, e.g. chicken⟩',
  prepTime:⟨number⟩, cookTime:⟨number⟩, time:⟨prepTime + cookTime added together⟩,
  difficulty:⟨1, 2, 3 or 4⟩, servings:⟨number the recipe makes⟩,
  kcal:⟨calories per serving⟩, protein:⟨grams of protein per serving⟩, nutrition:'⟨source or estimated⟩',
  tags:[⟨'vegetarian' and/or 'vegan' and/or 'fish', or leave empty: []⟩],
  contains:[⟨every allergen it truly contains, or leave empty: []⟩],
  ingredients:[
    {name:'⟨Ingredient name⟩',qty:⟨number⟩,unit:'⟨g, ml, tsp, tbsp, piece, clove, slice, stalk or pinch⟩',category:'⟨aisle⟩',buyDayBefore:⟨true or false⟩},
    {name:'⟨Ingredient name⟩',qty:⟨number⟩,unit:'⟨unit⟩',category:'⟨aisle⟩',buyDayBefore:⟨true or false⟩}],
  steps:[
    '⟨Step one, one sentence.⟩',
    '⟨Step two, one sentence.⟩']
},
```

Section 3 below explains every one of those `⟨...⟩` slots — what's free text you can write
yourself, and what's a fixed list you must pick from exactly.

---

## 3. A real example, fully filled in

This is what a finished entry looks like — a fictional new soup, so you can see the shape with
real values instead of placeholders:

```js
/* --- 29. ROASTED PUMPKIN SOUP ------------------------------------------- */
{
  id:'db-s7', type:'starter', types:['starter','lunch'],
  name:'Roasted pumpkin soup', desc:'Pumpkin, cream, nutmeg, croutons',
  sourceUrl:'https://www.example.com/pumpkin-soup',
  sourceName:'Example Kitchen',
  photo:'https://www.example.com/images/pumpkin-soup.jpg',
  emoji:'🎃', img:'pumpkin',
  prepTime:10, cookTime:25, time:35,
  difficulty:2, servings:4, kcal:210, protein:4, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['dairy'],
  ingredients:[
    {name:'Pumpkin',qty:200,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Onion',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Vegetable broth',qty:150,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Double cream',qty:30,unit:'ml',category:'Dairy',buyDayBefore:false},
    {name:'Nutmeg',qty:0.1,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Roast the diced pumpkin and onion until soft, about 25 minutes.',
    'Blend with the broth until completely smooth.',
    'Stir in the cream and nutmeg, warm through and season.']
},
```

Notice the ingredient amounts are **per person, one serving** — not for the whole pot. The app
multiplies everything by how many people are eating automatically. So even if your real recipe
serves 4 and uses 800 g of pumpkin, you write `200 g` here (800 ÷ 4).

---

## 4. Every fixed list — the things you can't just make up

Most fields are free text (the name, the description, the steps, the web addresses). But a
handful of fields **must** use one of the exact words below — anything else is silently ignored
or breaks the shopping list. Copy these exactly, including the lowercase spelling and the quotes.

### `type` and `types` — what kind of dish it is

Exactly one of these five words, spelled exactly like this:

```
breakfast   lunch   dinner   starter   dessert
```

`type` is the main one. `types` is a list of every course it can be used for — most main dishes
work for both `lunch` and `dinner`, so most of the time you'll write `types:['lunch','dinner']`.
A breakfast that's just as good at brunch could be `types:['breakfast','lunch']`.

### `difficulty` — **this is a number, not an emoji**

This is the one you asked about. In the data file, difficulty is just a plain number from 1 to 4.
The app turns that number into dots on its own (`●○○○`, `●●○○`, etc.) — you never type a dot or
an emoji here, just the digit:

| You type | What it means | What the app shows |
|---|---|---|
| `1` | Very easy — a child could make it | ●○○○ |
| `2` | Easy — needs a little technique (searing, whisking eggs) | ●●○○ |
| `3` | Needs a bit of care — timing matters, a few steps happening at once | ●●●○ |
| `4` | A project — takes real skill or a long process | ●●●●○ → ●●●● |

Right now every dish in the database is a 1, 2 or 3 — nothing's been rated a 4 yet, but it's a
valid option if you add something like a proper roast or a laminated pastry.

### `emoji` — the actual place a picture-symbol goes

*This* is the field your question was really about. It's the little icon shown if the real photo
ever fails to load. Pick whichever one best matches your dish — here's a ready list, grouped by
type, so you can just copy the one you want:

**Breakfast**
```
🥣 🍳 🥞 🧇 🥯 🥐 🍞 🥐 🥛 🍓 🥑 🌯
```
**Starters & small plates**
```
🥗 🍲 🍅 🧆 🥕 🫒 🥒 🍈 🍄 🌶️
```
**Mains — meat & poultry**
```
🍗 🍖 🥩 🌮 🌯 🍛 🥘
```
**Mains — fish & seafood**
```
🐟 🍤 🦐 🦞 🦀
```
**Mains — pasta, rice & veg**
```
🍝 🍜 🍚 🍲 🥦 🥕 🍆
```
**Desserts & baking**
```
🍰 🍪 🍫 🧁 🥧 🍮 🍨 🍩 🍌 🍎 🍇 🍉
```

You're not limited to this list — any single food emoji works. If none of these feel right, just
pick whichever emoji you'd tap on your phone's keyboard for that dish.

### `nutrition` — is the calorie count exact or a good guess?

Exactly one of two words:

```
source       ← the recipe website itself published the calories and protein
estimated    ← the website didn't publish nutrition, so it was worked out from the ingredients
```

If you're copying calories straight off the recipe page, write `source`. If you (or I) had to
estimate it by eye, write `estimated`. Either is fine — this is just an honesty label.

### `tags` — diet labels, used by the app's filters

Pick every one that's true, or leave the list empty (`[]`) if none apply:

```
vegetarian     vegan     fish
```

A vegan dish should have **both** `'vegetarian'` and `'vegan'` in the list (vegan implies
vegetarian). Only add `'fish'` when the dish actually contains fish or shellfish.

### `contains` — allergens, and this one really matters

This is the honest, explicit list of allergens actually in the dish. **This is what protects
someone with an allergy** — the app trusts this list completely, so it has to be accurate. Pick
every one that's true, or leave empty (`[]`):

```
gluten     dairy     nuts     eggs     soy     shellfish     fish     sesame
```

A few real examples so the pattern is clear:
- Bread, pasta, flour, tortillas, breadcrumbs, oats (unless marked gluten-free) → `'gluten'`
- Milk, cheese, butter, cream, yogurt → `'dairy'`
- Peanuts, almonds, pine nuts, cashews → `'nuts'`
- Soy sauce, tofu, edamame → `'soy'`
- Prawns, shrimp, crab, mussels → `'shellfish'`
- Tahini, sesame oil, sesame seeds → `'sesame'`

**Double-check every ingredient in your list against this** before saving — it's easy to forget
that a sauce or a garnish contains one of these.

### `category` — which aisle each ingredient belongs to, for the shopping list

Every single ingredient needs exactly one of these six, spelled exactly like this (note the `&`
and the spaces in `Meat & Fish`):

```
Produce       ← fruit, vegetables, fresh herbs
Meat & Fish   ← raw meat, poultry, fish, shellfish
Dairy         ← milk, cheese, butter, cream, yogurt, eggs
Bakery        ← bread, tortillas, ladyfingers, anything baked
Frozen        ← frozen vegetables, frozen fruit, ice cream (not used yet, but valid)
Pantry        ← everything shelf-stable: spices, oil, tins, pasta, rice, flour, sauces
```

### `unit` — how each ingredient amount is measured

Exactly one of these nine, always lowercase:

```
g       (grams — most solids)
ml      (millilitres — most liquids)
tsp     (teaspoon)
tbsp    (tablespoon)
piece   (a whole item: 1 egg, 1 onion, 1 lemon)
clove   (garlic only)
slice   (bread)
stalk   (celery)
pinch   (a very small amount of salt or seasoning)
```

### `buyDayBefore` — exactly `true` or `false`, no quotes

```
true    ← this needs to be fresh, so buy it close to the day you'll cook it
false   ← this keeps fine bought at the start of the week
```

Fresh herbs, leafy greens, fish, and anything that wilts or spoils fast should be `true`.
Onions, garlic, spices, tins, oils, flour should be `false`.

---

## 5. Before you save — a quick checklist

☐ `id` starts with `db-` and isn't already used by another dish (skim the file — no duplicates).
☐ Every ingredient amount is **per one serving**, not the whole recipe.
☐ `category` is spelled exactly right for every single ingredient (`Meat & Fish` has a space and an `&`).
☐ `unit` is one of the nine words above, lowercase.
☐ `contains` really does list every allergen — this is the one that matters most.
☐ Every line ends with a comma **except** the very last thing before a closing `}` or `]`.
☐ Every piece of text is wrapped in straight quotes `'like this'` — not curly ones your word
  processor might auto-correct to. (TextEdit: turn off "Smart Quotes" in Preferences → Substitutions,
  or just write it in Notes/a plain text editor instead.)

If something looks broken after you save, the single most common cause is a missing comma or a
curly smart-quote — check those two things first.

---

## 6. Prices — the companion file

Every ingredient also needs a price, so the shopping list and the weekly budget can work without
needing the AI. That lives in a separate file: **`public/ingredient-prices.js`**.

If you use an ingredient that's **already** in that file (most common ones already are — onion,
garlic, chicken breast, olive oil, etc.), you don't need to do anything else. If you invent a
brand-new ingredient — say, "Butternut squash" — add one line to `INGREDIENT_PRICES` in that file:

```js
'butternut squash': {per:'100g', eur:0.30},
```

The name must be **lowercase** here (unlike in `recipes-db.js`, where names are capitalized for
display). `per` is either `'100g'`, `'100ml'`, `'piece'`, `'clove'`, `'slice'`, or `'stalk'` —
whichever matches how that ingredient is naturally sold or measured. `eur` is your best guess at
what it costs in euros at that size. If you skip this step, that one ingredient just won't add
anything to the price total — nothing breaks, the budget is just slightly under-counted.

---

## 7. When you're done

Nothing else needs touching for the dish itself to exist correctly in the data. To also refresh
the nice printed catalogue (`docs/RECIPE-DATABASE.md`) so it shows your new dish too, someone with
Terminal access can run:

```
node tools/build-recipe-md.js
```

That step is optional — it only updates the pretty document, not the app itself.
