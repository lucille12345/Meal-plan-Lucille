/* ============================================================================
   CURATED RECIPE DATABASE — #Foodie
   ============================================================================
   THIS IS THE APP'S PRIMARY SOURCE OF DISHES. Gemini is the *fallback*, used
   only to invent extra variety when this database can't fill a week.

   Every dish here is a REAL recipe from a real site. The link, the photo, the
   calories, the protein and the times were read from that page's structured
   recipe data (schema.org JSON-LD) on 2026-07-20 — not invented.

   ── HOW TO ADD A DISH ──────────────────────────────────────────────────────
   1. Copy the block format below. Keep the `/* --- N. NAME --- *␀/` separator.
   2. `id` must be unique and start with `db` (that prefix is how the app tells
      curated dishes apart from the old offline pool and from AI dishes).
   3. Quantities are PER SERVING and METRIC (g / ml / tsp / tbsp / piece).
      The app multiplies them by household size itself — do not pre-scale.
   4. `category` must be one of exactly:
      'Produce' | 'Meat & Fish' | 'Dairy' | 'Bakery' | 'Frozen' | 'Pantry'
      (anything else silently drops out of the shopping list grouping).
   5. Run `node tools/build-recipe-md.js` to regenerate docs/RECIPE-DATABASE.md.

   ── FIELD REFERENCE ────────────────────────────────────────────────────────
   id          unique, 'db'-prefixed
   types       ['breakfast'|'lunch'|'dinner'|'starter'|'dessert', ...]
               A dish may serve more than one role (most mains are lunch+dinner).
   type        primary role — kept for backwards-compatibility with the old pool
   name        short, appetising, what appears on the card
   desc        4–6 words, the line under the name on the card
   sourceUrl   the real recipe page (never a search URL, never AI-generated)
   sourceName  the site, shown as "Recipe by …"
   photo       absolute image URL for this exact dish
   emoji       fallback tile glyph if the photo fails to load
   img         keyword(s) for the legacy DISH_IMG map — fallback only
   prepTime    minutes, hands-on prep
   cookTime    minutes, cooking
   time        prepTime + cookTime, ACTIVE minutes (excludes chilling/marinating)
   passiveTime minutes of unattended waiting (chill/marinate/rest). Optional.
   difficulty  1 = anyone · 2 = a little technique · 3 = confident cook · 4 = project
   servings    what the source recipe yields (kcal/protein are per ONE serving)
   kcal        calories per serving
   protein     grams of protein per serving
   nutrition   'source'    = published by the recipe site (trust it)
               'estimated' = computed here from the ingredients (approximate)
   tags        'vegetarian' 'vegan' 'fish' — drives the dietary filters
   contains    EXPLICIT allergens: 'gluten' 'dairy' 'nuts' 'eggs' 'soy'
               'shellfish' 'fish' 'sesame'. ALWAYS fill this in truthfully.
               The old pool guesses allergens by pattern-matching ingredient
               names, which silently misses things like "Baguette" (gluten),
               "Spaghetti" (gluten) and every soy sauce. This field is the
               authoritative answer and must win over any guess.
   ingredients per serving, metric. buyDayBefore:true = must be bought fresh
   steps       short method, rewritten in our own words
   ============================================================================ */

const RECIPES_DB = [

/* ==========================================================================
   BREAKFASTS
   ========================================================================== */

/* --- 1. OVERNIGHT OATS ------------------------------------------------- */
{
  id:'db-b1', type:'breakfast', types:['breakfast'],
  name:'Overnight oats', desc:'Oats, chia, yogurt, apple',
  sourceUrl:'https://www.loveandlemons.com/overnight-oats-recipe/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2022/09/overnight-oats-recipe.jpg',
  emoji:'🥣', img:'oatmeal',
  prepTime:10, cookTime:0, time:10, passiveTime:480,
  difficulty:1, servings:1, kcal:390, protein:15, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy','nuts'],
  ingredients:[
    {name:'Rolled oats',qty:45,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Chia seeds',qty:12,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Greek yogurt',qty:60,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Almond milk',qty:160,unit:'ml',category:'Dairy',buyDayBefore:false},
    {name:'Apple sauce',qty:30,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Maple syrup',qty:1,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cinnamon',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Apple',qty:0.5,unit:'piece',category:'Produce',buyDayBefore:false}],
  steps:[
    'Put the oats, chia seeds, yogurt, maple syrup and a pinch of salt in a jar.',
    'Pour in the almond milk and stir well so no chia clumps sit at the bottom.',
    'Stir through the apple sauce and cinnamon. Cover and chill overnight.',
    'In the morning top with diced apple and a little more maple syrup.']
},

/* --- 2. SHAKSHUKA ------------------------------------------------------- */
{
  id:'db-b2', type:'breakfast', types:['breakfast','lunch'],
  name:'Shakshuka', desc:'Eggs poached in spiced tomato',
  sourceUrl:'https://cookieandkate.com/foolproof-shakshuka-recipe/',
  sourceName:'Cookie and Kate',
  photo:'https://cookieandkate.com/images/2019/02/best-shakshuka-recipe-3.jpg',
  emoji:'🍳', img:'egg',
  prepTime:15, cookTime:20, time:35,
  difficulty:2, servings:6, kcal:216, protein:11, nutrition:'source',
  tags:['vegetarian'],
  contains:['dairy','gluten','eggs'],
  ingredients:[
    {name:'Olive oil',qty:1,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Yellow onion',qty:0.2,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Red bell pepper',qty:0.2,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Garlic',qty:0.5,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Tomato paste',qty:1,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Ground cumin',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Smoked paprika',qty:0.1,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Crushed tomatoes',qty:130,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:1,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Feta',qty:20,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Fresh parsley',qty:1,unit:'tsp',category:'Produce',buyDayBefore:true},
    {name:'Crusty bread',qty:60,unit:'g',category:'Bakery',buyDayBefore:true}],
  steps:[
    'Heat the oven to 190°C. Soften the onion and pepper in oil in an oven-safe pan with a pinch of salt, about 5 minutes.',
    'Stir in the garlic, tomato paste, cumin and paprika and cook 1 minute until fragrant.',
    'Add the crushed tomatoes and parsley, simmer gently 5 minutes, then season.',
    'Make a well per egg and crack each one in. Spoon a little sauce over the whites.',
    'Bake 8–12 minutes until the whites are set but the yolks still wobble.',
    'Scatter over the feta and parsley and serve with bread.']
},

/* --- 3. BANANA PANCAKES ------------------------------------------------- */
{
  id:'db-b3', type:'breakfast', types:['breakfast'],
  name:'Banana pancakes', desc:'Fluffy, cinnamon-spiced, maple syrup',
  sourceUrl:'https://www.loveandlemons.com/banana-pancakes/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2022/02/Banana-Pancakes_Rev-2_Fullsize-05.jpg',
  emoji:'🥞', img:'pancake',
  prepTime:10, cookTime:20, time:30,
  difficulty:2, servings:4, kcal:340, protein:8, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy','eggs'],
  ingredients:[
    {name:'Plain flour',qty:47,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Caster sugar',qty:6,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Baking powder',qty:0.5,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Bicarbonate of soda',qty:0.12,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cinnamon',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Banana',qty:0.5,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Eggs',qty:0.25,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Milk',qty:40,unit:'ml',category:'Dairy',buyDayBefore:false},
    {name:'Neutral oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Vanilla extract',qty:0.4,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Maple syrup',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Stir the flour, sugar, baking powder, bicarb, cinnamon and a pinch of salt together in a bowl.',
    'Whisk the mashed banana, egg, milk, oil and vanilla in a second bowl, then fold into the dry mix until only just combined.',
    'Cook scoops of batter in a lightly oiled pan over medium-low heat, 1–2 minutes a side, until puffed and golden. Serve with maple syrup.']
},

/* --- 4. BREAKFAST BURRITOS ---------------------------------------------- */
{
  id:'db-b4', type:'breakfast', types:['breakfast','lunch'],
  name:'Breakfast burritos', desc:'Eggs, ham, peppers, cheddar',
  sourceUrl:'https://www.budgetbytes.com/freezer-breakfast-burritos/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2011/01/Freezer-Breakfast-Burrito-close.jpg',
  emoji:'🌯', img:'wrap',
  prepTime:20, cookTime:30, time:50,
  difficulty:2, servings:8, kcal:421, protein:28, nutrition:'source',
  tags:[],
  contains:['gluten','dairy','eggs'],
  ingredients:[
    {name:'Cheddar',qty:28,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Yellow onion',qty:0.12,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Bell pepper',qty:0.12,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Butter',qty:3.5,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Cooked ham',qty:57,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Eggs',qty:1.5,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Large flour tortilla',qty:1,unit:'piece',category:'Bakery',buyDayBefore:false}],
  steps:[
    'Grate the cheddar and dice the onion and pepper.',
    'Soften the onion and pepper in a little butter, 5 minutes, then season and set aside.',
    'Brown the diced ham in the same pan, 5 minutes, and set aside.',
    'Scramble the eggs in the last of the butter, pulling them to the centre as they set. Stop while still moist.',
    'Fill each tortilla with eggs, peppers, cheese and ham, fold in the sides and roll up tightly.']
},

/* --- 5. AVOCADO TOAST --------------------------------------------------- */
{
  id:'db-b5', type:'breakfast', types:['breakfast'],
  name:'Avocado toast', desc:'Smashed avocado, lemon, flaky salt',
  sourceUrl:'https://www.loveandlemons.com/avocado-toast/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2020/01/how-to-make-avocado-toast.jpg',
  emoji:'🥑', img:'avocado',
  prepTime:2, cookTime:2, time:4,
  difficulty:1, servings:2, kcal:290, protein:7, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:['gluten'],
  ingredients:[
    {name:'Avocado',qty:0.5,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Lemon',qty:0.12,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Sourdough bread',qty:2,unit:'slice',category:'Bakery',buyDayBefore:true},
    {name:'Flaky sea salt',qty:1,unit:'pinch',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Halve the avocado, remove the stone and dice the flesh in its skin. Squeeze over lemon and season.',
    'Scoop onto hot toast, mash roughly with a fork and finish with flaky salt.']
},

/* --- 6. HOMEMADE GRANOLA ------------------------------------------------ */
{
  id:'db-b6', type:'breakfast', types:['breakfast'],
  name:'Homemade granola', desc:'Oats, walnuts, maple, coconut',
  sourceUrl:'https://www.loveandlemons.com/granola/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2020/01/granola.jpg',
  emoji:'🥣', img:'oatmeal',
  prepTime:10, cookTime:30, time:40,
  difficulty:1, servings:5, kcal:320, protein:8, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:['nuts'],
  ingredients:[
    {name:'Rolled oats',qty:32,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Walnuts',qty:10,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Coconut flakes',qty:8,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Cinnamon',qty:0.4,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Coconut oil',qty:0.4,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Maple syrup',qty:0.8,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Almond butter',qty:6,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Dried cranberries',qty:8,unit:'g',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Heat the oven to 150°C and line a baking sheet.',
    'Stir the oats, walnuts, coconut flakes, cinnamon and salt together, then work in the melted coconut oil, maple syrup and almond butter.',
    'Spread on the sheet and bake 15 minutes, break it up a little, then bake 15 minutes more until golden.',
    'Scatter over the cranberries once cool.']
},

/* --- 7. BREAKFAST EGG MUFFINS ------------------------------------------- */
{
  id:'db-b7', type:'breakfast', types:['breakfast'],
  name:'Breakfast egg muffins', desc:'Pepper, feta, scallion, oven-baked',
  sourceUrl:'https://www.loveandlemons.com/egg-muffins/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2023/01/egg-muffins-1.jpg',
  emoji:'🍳', img:'egg',
  prepTime:15, cookTime:25, time:40,
  difficulty:2, servings:4, kcal:230, protein:16, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['eggs','dairy','gluten'],
  ingredients:[
    {name:'Red bell pepper',qty:0.6,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Spring onions',qty:1.2,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Eggs',qty:2.25,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Garlic',qty:0.25,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Plain flour',qty:0.75,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Baking powder',qty:0.19,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Feta',qty:13,unit:'g',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Heat the oven to 175°C and grease a muffin tin. Divide the pepper and spring onion between the cups.',
    'Whisk the eggs with the garlic, salt and pepper, then whisk in the flour and baking powder.',
    'Pour the egg mixture over the vegetables and top with feta.',
    'Bake 22–24 minutes until set. Cool slightly before turning out.']
},

/* --- 8. FRENCH TOAST ----------------------------------------------------- */
{
  id:'db-b8', type:'breakfast', types:['breakfast'],
  name:'French toast', desc:'Cinnamon, vanilla, maple syrup',
  sourceUrl:'https://www.loveandlemons.com/french-toast/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2024/08/french-toast.jpg',
  emoji:'🍞', img:'toast',
  prepTime:10, cookTime:10, time:20,
  difficulty:1, servings:4, kcal:380, protein:13, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy','eggs'],
  ingredients:[
    {name:'Eggs',qty:1,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Milk',qty:40,unit:'ml',category:'Dairy',buyDayBefore:false},
    {name:'Vanilla extract',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cinnamon',qty:0.12,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Butter',qty:5,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Crusty bread',qty:70,unit:'g',category:'Bakery',buyDayBefore:true},
    {name:'Maple syrup',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Whisk the eggs, milk, vanilla, cinnamon and a pinch of salt in a shallow dish.',
    'Heat a buttered skillet or griddle over medium heat.',
    'Dip each slice of bread in the egg mixture, coating both sides, and cook 2 minutes a side until golden.',
    'Serve with maple syrup.']
},

/* --- 9. BREAKFAST POTATOES ----------------------------------------------- */
{
  id:'db-b9', type:'breakfast', types:['breakfast'],
  name:'Breakfast potatoes', desc:'Crispy, smoked paprika, garlic',
  sourceUrl:'https://www.loveandlemons.com/breakfast-potatoes/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/2026/03/344_LLBlogMarch_BreakfastPotatoes_28529-social.jpg',
  emoji:'🥔', img:'potato',
  prepTime:10, cookTime:35, time:45,
  difficulty:1, servings:6, kcal:160, protein:3, nutrition:'source',
  tags:['vegetarian','vegan'],
  contains:[],
  ingredients:[
    {name:'Yukon gold potatoes',qty:151,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Olive oil',qty:0.3,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Smoked paprika',qty:0.17,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Garlic powder',qty:0.08,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Onion powder',qty:0.04,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Fresh parsley',qty:0.5,unit:'tbsp',category:'Produce',buyDayBefore:true}],
  steps:[
    'Heat the oven to 220°C and line a large baking sheet.',
    'Toss the diced potatoes with oil, paprika, garlic powder, onion powder, salt and pepper.',
    'Spread evenly and roast 25–35 minutes until golden and crisp at the edges.',
    'Season to taste and scatter with parsley.']
},

/* ==========================================================================
   STARTERS & SMALL PLATES
   ========================================================================== */

/* --- 6. HUMMUS ---------------------------------------------------------- */
{
  id:'db-s1', type:'starter', types:['starter'],
  name:'Silky hummus', desc:'Chickpea, tahini, lemon, cumin',
  sourceUrl:'https://cookieandkate.com/best-hummus-recipe/',
  sourceName:'Cookie and Kate',
  photo:'https://cookieandkate.com/images/2018/05/best-hummus-recipe-6.jpg',
  emoji:'🧆', img:'hummus',
  prepTime:20, cookTime:20, time:40,
  difficulty:2, servings:8, kcal:151, protein:5, nutrition:'source',
  tags:['vegetarian','vegan'],
  contains:['sesame'],
  ingredients:[
    {name:'Chickpeas',qty:53,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Tahini',qty:15,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Lemon',qty:0.2,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:0.12,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Ground cumin',qty:0.06,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Olive oil',qty:0.4,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Simmer the chickpeas with a little bicarbonate of soda for 20 minutes until very soft, then drain.',
    'Blend the lemon juice, garlic and salt first and let it sit so the garlic mellows.',
    'Add the tahini and blend until thick and pale, then trickle in ice water until ultra-smooth.',
    'Add the cumin and chickpeas, drizzle in the olive oil while blending, and season to taste.']
},

/* --- 7. BRUSCHETTA ------------------------------------------------------ */
{
  id:'db-s2', type:'starter', types:['starter'],
  name:'Tomato bruschetta', desc:'Ripe tomato, basil, toasted baguette',
  sourceUrl:'https://www.loveandlemons.com/bruschetta/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/2025/05/bruschetta-recipe.jpg',
  emoji:'🍅', img:'bruschetta,tomato',
  prepTime:15, cookTime:15, time:30,
  difficulty:1, servings:8, kcal:165, protein:4, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:['gluten'],
  ingredients:[
    {name:'Baguette',qty:50,unit:'g',category:'Bakery',buyDayBefore:true},
    {name:'Ripe tomatoes',qty:113,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Fresh basil',qty:1,unit:'tbsp',category:'Produce',buyDayBefore:true},
    {name:'Garlic',qty:0.25,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Balsamic vinegar',qty:0.12,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Olive oil',qty:1,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Heat the oven to 200°C. Slice the baguette thinly, drizzle both sides with oil and bake 10–12 minutes until golden.',
    'Stir the diced tomatoes with the basil, grated garlic, balsamic, salt and pepper.',
    'Spoon the tomatoes onto the toasts with a slotted spoon, leaving the juices behind. Finish with oil and flaky salt.']
},

/* --- 8. CAPRESE SALAD --------------------------------------------------- */
{
  id:'db-s3', type:'starter', types:['starter'],
  name:'Caprese salad', desc:'Tomato, mozzarella, basil, balsamic',
  sourceUrl:'https://www.loveandlemons.com/caprese-salad/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2019/08/caprese-salad-recipe.jpg',
  emoji:'🍅', img:'caprese',
  prepTime:10, cookTime:0, time:10,
  difficulty:1, servings:4, kcal:204, protein:13, nutrition:'source',
  tags:['vegetarian'],
  contains:['dairy'],
  ingredients:[
    {name:'Heirloom tomatoes',qty:1,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Fresh mozzarella',qty:57,unit:'g',category:'Dairy',buyDayBefore:true},
    {name:'Fresh basil',qty:1,unit:'tbsp',category:'Produce',buyDayBefore:true},
    {name:'Olive oil',qty:1,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Balsamic vinegar',qty:0.5,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Arrange sliced tomato, sliced mozzarella and basil leaves on a platter.',
    'Drizzle with olive oil and balsamic, season with flaky salt and pepper, and serve straight away.']
},

/* --- 9. GAZPACHO -------------------------------------------------------- */
{
  id:'db-s4', type:'starter', types:['starter'],
  name:'Chilled gazpacho', desc:'Tomato, cucumber, sherry vinegar',
  sourceUrl:'https://www.loveandlemons.com/gazpacho-recipe/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2020/08/gazpacho-1.jpg',
  emoji:'🍅', img:'gazpacho,soup',
  prepTime:10, cookTime:0, time:10, passiveTime:120,
  difficulty:1, servings:4, kcal:190, protein:3, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:[],
  ingredients:[
    {name:'Cucumber',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Ripe tomatoes',qty:280,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Red bell pepper',qty:0.12,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Red onion',qty:0.06,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:0.5,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Fresh coriander',qty:1,unit:'tbsp',category:'Produce',buyDayBefore:true},
    {name:'Sherry vinegar',qty:0.75,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Olive oil',qty:2,unit:'tbsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Finely chop a quarter of the cucumber and keep it back for garnish.',
    'Peel the rest of the cucumber and blend with the tomatoes, pepper, onion, garlic, coriander, vinegar, oil, salt and pepper until smooth.',
    'Chill for at least 2 hours. Serve with the diced cucumber, a drizzle of oil and black pepper.']
},

/* --- 10. STUFFED MUSHROOMS ---------------------------------------------- */
{
  id:'db-s5', type:'starter', types:['starter'],
  name:'Stuffed mushrooms', desc:'Pecorino, pine nut, sun-dried tomato',
  sourceUrl:'https://www.loveandlemons.com/stuffed-mushrooms/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2019/12/stuffed-mushrooms-1.jpg',
  emoji:'🍄', img:'mushroom',
  prepTime:20, cookTime:20, time:40,
  difficulty:2, servings:7, kcal:93, protein:6, nutrition:'source',
  tags:['vegetarian'],
  contains:['gluten','dairy','nuts'],
  ingredients:[
    {name:'Cremini mushrooms',qty:3,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Panko breadcrumbs',qty:8,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Pecorino',qty:11,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Fresh parsley',qty:1,unit:'tbsp',category:'Produce',buyDayBefore:true},
    {name:'Sun-dried tomatoes',qty:8,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Pine nuts',qty:4,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Garlic',qty:0.3,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Olive oil',qty:1,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Heat the oven to 200°C and line a baking sheet.',
    'Mix the panko, pecorino, parsley, sun-dried tomatoes, pine nuts, garlic, salt and pepper.',
    'Set the stemmed mushrooms cavity-up, drizzle with oil and salt, then spoon in the filling.',
    'Drizzle again and bake about 20 minutes until golden. Finish with parsley.']
},

/* --- 11. GREEK SALAD ---------------------------------------------------- */
{
  id:'db-s6', type:'starter', types:['starter','lunch'],
  name:'Greek salad', desc:'Feta, cucumber, olives, oregano',
  sourceUrl:'https://www.loveandlemons.com/greek-salad/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2019/07/greek-salad-2.jpg',
  emoji:'🥗', img:'salad',
  prepTime:15, cookTime:0, time:15,
  difficulty:1, servings:4, kcal:280, protein:7, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['dairy'],
  ingredients:[
    {name:'Cucumber',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Green bell pepper',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Cherry tomatoes',qty:75,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Feta',qty:35,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Red onion',qty:0.1,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Kalamata olives',qty:15,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Fresh mint',qty:1,unit:'tbsp',category:'Produce',buyDayBefore:true},
    {name:'Olive oil',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Red wine vinegar',qty:0.75,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Dried oregano',qty:0.12,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Whisk the oil, vinegar, minced garlic, oregano, a little Dijon, salt and pepper into a dressing.',
    'Lay out the cucumber, pepper, tomatoes, feta, onion and olives on a platter.',
    'Drizzle over the dressing, toss very gently and finish with oregano and mint.']
},

/* --- 7. DEVILED EGGS ----------------------------------------------------- */
{
  id:'db-s7', type:'starter', types:['starter'],
  name:'Deviled eggs', desc:'Creamy yolk, mustard, paprika',
  sourceUrl:'https://www.loveandlemons.com/deviled-eggs/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2024/03/deviled-eggs-recipe.jpg',
  emoji:'🥚', img:'egg',
  prepTime:10, cookTime:15, time:25, passiveTime:20,
  difficulty:2, servings:6, kcal:111, protein:6, nutrition:'source',
  tags:['vegetarian'],
  contains:['eggs'],
  ingredients:[
    {name:'Eggs',qty:1,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Mayonnaise',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Dijon mustard',qty:0.17,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Balsamic vinegar',qty:0.17,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Paprika',qty:0.1,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Boil the eggs, then cover and let sit off the heat 10–12 minutes.',
    'Chill in ice water, then peel and halve lengthwise.',
    'Mash the yolks with mayonnaise, mustard and a dash of vinegar until creamy; season.',
    'Pipe or spoon back into the whites and dust with paprika.']
},

/* --- 8. PEANUT SUMMER ROLLS ---------------------------------------------- */
{
  id:'db-s8', type:'starter', types:['starter','lunch'],
  name:'Peanut summer rolls', desc:'Rice paper, avocado, herbs, peanut sauce',
  sourceUrl:'https://www.loveandlemons.com/spring-rolls/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2013/10/spring-rolls.jpg',
  emoji:'🥢', img:'spring roll',
  prepTime:10, cookTime:5, time:15,
  difficulty:3, servings:2, kcal:320, protein:9, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:['nuts','soy'],
  ingredients:[
    {name:'Mushrooms',qty:35,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Soy sauce',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Rice noodles',qty:57,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Peanut sauce',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Rice paper wrappers',qty:2,unit:'piece',category:'Pantry',buyDayBefore:false},
    {name:'Avocado',qty:0.5,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Fresh basil',qty:0.5,unit:'tbsp',category:'Produce',buyDayBefore:true}],
  steps:[
    'Brown the mushrooms in a little oil, then toss with soy sauce.',
    'Toss the cooked noodles with a spoonful of peanut sauce.',
    'Dip a rice paper wrapper in warm water 5 seconds and lay it on a clean towel.',
    'Fill with noodles, mushrooms, avocado and herbs, fold in the sides and roll up tightly.',
    'Serve with extra peanut sauce for dipping.']
},

/* --- 9. FRENCH ONION SOUP -------------------------------------------------- */
{
  id:'db-s9', type:'starter', types:['starter','lunch'],
  name:'French onion soup', desc:'Caramelised onion, Gruyère, baguette',
  sourceUrl:'https://www.loveandlemons.com/french-onion-soup/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2019/12/french-onion-soup-recipe.jpg',
  emoji:'🧅', img:'soup',
  prepTime:10, cookTime:90, time:100,
  difficulty:3, servings:5, kcal:380, protein:14, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy'],
  ingredients:[
    {name:'Olive oil',qty:1.2,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Yellow onion',qty:1.8,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Balsamic vinegar',qty:0.3,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Soy sauce',qty:0.3,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Fresh thyme',qty:0.3,unit:'tbsp',category:'Produce',buyDayBefore:true},
    {name:'Garlic',qty:0.6,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Plain flour',qty:0.6,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'White wine',qty:48,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Vegetable broth',qty:288,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Baguette',qty:30,unit:'g',category:'Bakery',buyDayBefore:true},
    {name:'Gruyère',qty:20,unit:'g',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Cook the sliced onions in oil with salt over low heat, stirring often, about 40 minutes until deeply caramelised.',
    'Stir in the balsamic, soy sauce, thyme and garlic, then the flour, then the wine, and simmer.',
    'Add the broth and simmer to develop the flavour.',
    'Toast baguette slices topped with cheese under the grill until melted and golden.',
    'Ladle the soup into bowls and top each with a cheesy toast.']
},

/* --- 10. MINESTRONE SOUP --------------------------------------------------- */
{
  id:'db-s10', type:'starter', types:['starter','lunch'],
  name:'Minestrone soup', desc:'White beans, vegetables, small pasta',
  sourceUrl:'https://www.loveandlemons.com/minestrone-soup/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2021/11/minestrone-soup-1.jpg',
  emoji:'🍲', img:'soup',
  prepTime:15, cookTime:30, time:45,
  difficulty:2, servings:5, kcal:220, protein:9, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:['gluten'],
  ingredients:[
    {name:'Olive oil',qty:0.4,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Onion',qty:0.2,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Carrots',qty:0.4,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Celery',qty:0.4,unit:'stalk',category:'Produce',buyDayBefore:true},
    {name:'Garlic',qty:0.6,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Diced tomatoes',qty:160,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Cannellini beans',qty:50,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Green beans',qty:20,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Vegetable broth',qty:192,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Dried oregano',qty:0.2,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Dried thyme',qty:0.2,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Ditalini pasta',qty:15,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Fresh parsley',qty:5,unit:'g',category:'Produce',buyDayBefore:true}],
  steps:[
    'Soften the onion, carrot and celery in oil with salt and pepper, about 8 minutes.',
    'Add the garlic, tomatoes, beans, green beans, broth, bay leaves, oregano and thyme. Cover and simmer 20 minutes.',
    'Stir in the pasta and cook uncovered 10 minutes more until tender.',
    'Season to taste and serve with parsley.']
},

/* --- 11. BABA GANOUSH ------------------------------------------------------ */
{
  id:'db-s11', type:'starter', types:['starter'],
  name:'Baba ganoush', desc:'Smoky roasted eggplant, tahini, lemon',
  sourceUrl:'https://www.loveandlemons.com/baba-ganoush/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2019/08/baba-ganoush.jpg',
  emoji:'🍆', img:'eggplant',
  prepTime:30, cookTime:60, time:90,
  difficulty:2, servings:4, kcal:140, protein:4, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:['sesame'],
  ingredients:[
    {name:'Eggplant',qty:0.5,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Tahini',qty:15,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Lemon',qty:0.12,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Olive oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Garlic',qty:0.5,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Fresh parsley',qty:0.5,unit:'tbsp',category:'Produce',buyDayBefore:true},
    {name:'Pita bread',qty:1,unit:'',category:'Bakery',buyDayBefore:true}],
  steps:[
    'Roast the whole eggplants wrapped in foil at 200°C for 50–60 minutes until soft and collapsed.',
    'Once cool, peel and drain the flesh in a strainer for 20 minutes to remove excess water.',
    'Blend the eggplant flesh with tahini, lemon juice, olive oil, garlic and salt until smooth.',
    'Sprinkle with parsley and serve with warm pita.']
},

/* --- 12. CAESAR SALAD ------------------------------------------------------- */
{
  id:'db-s12', type:'starter', types:['starter','lunch'],
  name:'Caesar salad', desc:'Romaine, parmesan, croutons, dressing',
  sourceUrl:'https://www.loveandlemons.com/caesar-salad/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/2024/12/caesar-salad-opengraph.jpg',
  emoji:'🥗', img:'salad',
  prepTime:20, cookTime:10, time:30,
  difficulty:2, servings:6, kcal:280, protein:8, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy','eggs'],
  ingredients:[
    {name:'Crusty bread',qty:27,unit:'g',category:'Bakery',buyDayBefore:true},
    {name:'Olive oil',qty:0.83,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Mayonnaise',qty:38,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Lemon',qty:0.1,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Dijon mustard',qty:0.33,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Garlic',qty:0.17,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Worcestershire sauce',qty:0.17,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Parmesan',qty:17,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Romaine lettuce',qty:76,unit:'g',category:'Produce',buyDayBefore:true}],
  steps:[
    'Toss cubed bread with oil and salt and bake at 175°C until golden, for the croutons.',
    'Whisk the mayonnaise, oil, lemon juice, mustard, garlic and Worcestershire into a dressing; stir in half the parmesan.',
    'Toss the lettuce with the dressing, croutons and remaining parmesan. Season and serve.']
},

/* --- 13. CREAMY TOMATO SOUP -------------------------------------------------- */
{
  id:'db-s13', type:'starter', types:['starter','lunch'],
  name:'Creamy tomato soup', desc:'Roasted tomato, garlic, croutons',
  sourceUrl:'https://www.loveandlemons.com/tomato-soup/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2018/01/tomato-soup.jpg',
  emoji:'🍅', img:'soup,carrot',
  prepTime:15, cookTime:30, time:45,
  difficulty:2, servings:4, kcal:210, protein:6, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy'],
  ingredients:[
    {name:'Garlic',qty:0.86,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Ripe tomatoes',qty:171,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Onion',qty:0.29,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Diced tomatoes',qty:114,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Chickpeas',qty:16,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Balsamic vinegar',qty:0.29,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Maple syrup',qty:0.14,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Olive oil',qty:0.57,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Crusty bread',qty:60,unit:'g',category:'Bakery',buyDayBefore:true},
    {name:'Parmesan',qty:15,unit:'g',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Roast the garlic, whole tomatoes and onion wedges at 230°C for 20–25 minutes until soft and blistered.',
    'Blend with the canned tomatoes, chickpeas, balsamic, maple syrup, thyme, olive oil and seasoning until creamy.',
    'Toast the bread with a little parmesan for croutons.',
    'Serve the soup hot with the croutons.']
},

/* --- 14. CAULIFLOWER SOUP ---------------------------------------------------- */
{
  id:'db-s14', type:'starter', types:['starter','lunch'],
  name:'Cauliflower soup', desc:'Roasted cauliflower, miso, lemon',
  sourceUrl:'https://www.loveandlemons.com/cauliflower-soup/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2021/01/cauliflower-soup-2.jpg',
  emoji:'🥣', img:'soup',
  prepTime:15, cookTime:45, time:60,
  difficulty:2, servings:6, kcal:150, protein:5, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:['soy'],
  ingredients:[
    {name:'Cauliflower',qty:0.19,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Shallots',qty:0.33,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:0.67,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Vegetable broth',qty:160,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Fresh thyme',qty:0.5,unit:'tsp',category:'Produce',buyDayBefore:true},
    {name:'Olive oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Miso paste',qty:0.08,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Dijon mustard',qty:0.08,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Lemon',qty:0.1,unit:'piece',category:'Produce',buyDayBefore:false}],
  steps:[
    'Roast the chopped cauliflower with oil, salt and pepper at 200°C until browned; wrap and roast the shallot and garlic alongside.',
    'Simmer the broth with the roasted cauliflower, shallot, garlic and thyme, covered, 15 minutes.',
    'Blend until smooth, then stir in the miso, mustard and lemon juice. Season to taste.']
},

/* --- 15. BUTTERNUT SQUASH SOUP ----------------------------------------------- */
{
  id:'db-s15', type:'starter', types:['starter','lunch'],
  name:'Butternut squash soup', desc:'Sage, rosemary, roasted squash',
  sourceUrl:'https://www.loveandlemons.com/butternut-squash-soup/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2019/10/butternut-squash-soup.jpg',
  emoji:'🎃', img:'soup',
  prepTime:10, cookTime:35, time:45,
  difficulty:2, servings:6, kcal:180, protein:3, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:[],
  ingredients:[
    {name:'Olive oil',qty:0.33,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Yellow onion',qty:0.17,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Butternut squash',qty:227,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Garlic',qty:0.5,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Fresh ginger',qty:0.17,unit:'tsp',category:'Produce',buyDayBefore:false},
    {name:'Vegetable broth',qty:140,unit:'ml',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Soften the onion in oil with salt, then add the squash and cook until it starts to soften.',
    'Add the garlic and ginger, cook until fragrant, then pour in the broth.',
    'Simmer covered until the squash is tender, 20–25 minutes.',
    'Blend until smooth, thinning with more broth if needed, and season to taste.']
},

/* --- 16. BROCCOLI CHEDDAR SOUP ----------------------------------------------- */
{
  id:'db-s16', type:'starter', types:['starter','lunch'],
  name:'Broccoli cheddar soup', desc:'Creamy, sharp cheddar, carrot',
  sourceUrl:'https://www.loveandlemons.com/broccoli-cheddar-soup/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2022/11/broccoli-cheddar-soup-1.jpg',
  emoji:'🥦', img:'soup',
  prepTime:10, cookTime:25, time:35,
  difficulty:2, servings:4, kcal:320, protein:13, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['dairy','gluten'],
  ingredients:[
    {name:'Butter',qty:14,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Onion',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:0.75,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Plain flour',qty:7.5,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Milk',qty:120,unit:'ml',category:'Dairy',buyDayBefore:false},
    {name:'Vegetable broth',qty:120,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Broccoli',qty:68,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Carrots',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Dijon mustard',qty:0.13,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cheddar',qty:56,unit:'g',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Soften the onion in butter with salt and pepper, then stir in the garlic and flour.',
    'Whisk in the milk and broth until smooth.',
    'Add the broccoli, carrot and mustard, and simmer 15–20 minutes until the broccoli is tender.',
    'Stir in the cheese gradually until melted and creamy. Season and serve.']
},

/* ==========================================================================
   MAINS — lunch & dinner
   ========================================================================== */

/* --- 12. LENTIL SOUP ---------------------------------------------------- */
{
  id:'db-m1', type:'lunch', types:['lunch','dinner'],
  name:'Best lentil soup', desc:'Lentils, cumin, tomato, greens',
  sourceUrl:'https://cookieandkate.com/best-lentil-soup-recipe/',
  sourceName:'Cookie and Kate',
  photo:'https://cookieandkate.com/images/2019/01/best-lentil-soup-recipe-4.jpg',
  emoji:'🍲', img:'lentil,soup',
  prepTime:10, cookTime:45, time:55,
  difficulty:2, servings:4, kcal:367, protein:15, nutrition:'source',
  tags:['vegetarian','vegan'],
  contains:[],
  ingredients:[
    {name:'Olive oil',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Yellow onion',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Carrots',qty:0.5,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:1,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Ground cumin',qty:0.5,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Curry powder',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Dried thyme',qty:0.12,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Diced tomatoes',qty:200,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Green lentils',qty:48,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Vegetable broth',qty:240,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Kale',qty:20,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Lemon',qty:0.15,unit:'piece',category:'Produce',buyDayBefore:false}],
  steps:[
    'Soften the onion and carrot in the olive oil over medium heat, about 5 minutes.',
    'Add the garlic, cumin, curry powder and thyme and stir 30 seconds, then the tomatoes for a few minutes more.',
    'Pour in the lentils, broth and water, season, bring to the boil then simmer partly covered 25–30 minutes.',
    'Blend 2 cups of the soup smooth and stir it back in for body.',
    'Add the greens for a final 5 minutes, then finish with lemon juice and season well.']
},

/* --- 13. SHEET PAN CHICKEN FAJITAS -------------------------------------- */
{
  id:'db-m2', type:'dinner', types:['lunch','dinner'],
  name:'Sheet pan chicken fajitas', desc:'Chicken, peppers, lime, tortillas',
  sourceUrl:'https://www.budgetbytes.com/oven-fajitas/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2022/03/Sheet-Pan-Chicken-Fajitas-done.jpg',
  emoji:'🌮', img:'chicken',
  prepTime:15, cookTime:40, time:55,
  difficulty:1, servings:4, kcal:483, protein:31, nutrition:'source',
  tags:[],
  contains:['gluten','dairy'],
  ingredients:[
    {name:'Chicken breast',qty:113,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Bell peppers',qty:0.75,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Yellow onion',qty:0.5,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Chili powder',qty:0.75,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Paprika',qty:0.4,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Ground cumin',qty:0.06,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cooking oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Lime',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Small tortillas',qty:2,unit:'piece',category:'Bakery',buyDayBefore:false},
    {name:'Sour cream',qty:30,unit:'g',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Heat the oven to 200°C and mix the chili powder, paprika, onion and garlic powder, cumin, cayenne, sugar and salt.',
    'Slice the onion, peppers and chicken into thin strips and spread over a large baking tray.',
    'Drizzle with oil, scatter over the seasoning and toss with your hands until evenly coated.',
    'Roast 35–40 minutes, stirring once halfway, then squeeze over lime juice.',
    'Pile into warm tortillas with coriander, sour cream and an extra squeeze of lime.']
},

/* --- 14. PASTA E FAGIOLI ------------------------------------------------ */
{
  id:'db-m3', type:'dinner', types:['lunch','dinner'],
  name:'Pasta e fagioli', desc:'White beans, tomato, ditalini, bacon',
  sourceUrl:'https://www.budgetbytes.com/pasta-e-fagioli/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2023/01/Pasta-e-Fagioli-bowl.jpg',
  emoji:'🍲', img:'soup',
  prepTime:15, cookTime:35, time:50,
  difficulty:2, servings:6, kcal:248, protein:8, nutrition:'source',
  tags:[],
  contains:['gluten','dairy'],
  ingredients:[
    {name:'Bacon',qty:19,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Olive oil',qty:0.5,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Onion',qty:0.17,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Carrots',qty:0.33,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Celery',qty:0.5,unit:'stalk',category:'Produce',buyDayBefore:true},
    {name:'Garlic',qty:0.67,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Dried oregano',qty:0.08,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cannellini beans',qty:71,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Crushed tomatoes',qty:132,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Vegetable broth',qty:80,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Ditalini pasta',qty:23,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Parmesan',qty:4,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Flat-leaf parsley',qty:1,unit:'tsp',category:'Produce',buyDayBefore:true}],
  steps:[
    'Fry the chopped bacon in the olive oil until brown and crisp, about 10 minutes. Lift out half and set aside.',
    'Add the finely diced onion, carrot, celery, garlic, oregano, chilli flakes and seasoning and soften 6 minutes.',
    'Tip in the beans, tomatoes, water and broth, bring to the boil and cook 5 minutes.',
    'Add the pasta and cook uncovered to the packet time, stirring often so it does not catch.',
    'Off the heat stir through the Parmesan and parsley, loosen with broth if needed, and top with the reserved bacon.']
},

/* --- 15. CAJUN CHICKEN PASTA -------------------------------------------- */
{
  id:'db-m4', type:'dinner', types:['lunch','dinner'],
  name:'Creamy cajun chicken pasta', desc:'One pot, smoky, tomato cream',
  sourceUrl:'https://www.budgetbytes.com/one-pot-creamy-cajun-chicken-pasta/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2018/10/One-Pot-Creamy-Cajun-Chicken-Pasta-pan.jpg',
  emoji:'🍝', img:'pasta',
  prepTime:10, cookTime:20, time:30,
  difficulty:2, servings:4, kcal:483, protein:35, nutrition:'source',
  tags:[],
  contains:['gluten','dairy'],
  ingredients:[
    {name:'Chicken breast',qty:113,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Penne pasta',qty:57,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Smoked paprika',qty:0.5,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Dried oregano',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Dried thyme',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Olive oil',qty:0.25,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Butter',qty:3.5,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Yellow onion',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Fire roasted diced tomatoes',qty:106,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Chicken broth',qty:120,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Cream cheese',qty:14,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Spring onions',qty:0.75,unit:'piece',category:'Produce',buyDayBefore:true}],
  steps:[
    'Mix the cajun spices, cube the chicken and toss it in the seasoning.',
    'Sear the chicken in hot oil and butter until cooked through, then add the diced onion for 2 minutes.',
    'Add the pasta, tomatoes with their juice and the broth, stir, cover and bring to the boil.',
    'Simmer on medium-low about 10 minutes, stirring often, until the pasta is tender and saucy.',
    'Stir in the cream cheese in chunks until melted, then scatter with spring onions.']
},

/* --- 16. TERIYAKI SALMON ------------------------------------------------ */
{
  id:'db-m5', type:'dinner', types:['lunch','dinner'],
  name:'Teriyaki salmon', desc:'Sticky glaze, sriracha mayo',
  sourceUrl:'https://www.budgetbytes.com/teriyaki-salmon/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2011/09/Teriyaki-Salmon-Overhead.jpg',
  emoji:'🐟', img:'salmon',
  prepTime:10, cookTime:10, time:20, passiveTime:30,
  difficulty:2, servings:4, kcal:315, protein:24, nutrition:'source',
  tags:['fish'],
  contains:['fish','soy','gluten','eggs'],
  ingredients:[
    {name:'Salmon fillet',qty:113,unit:'g',category:'Meat & Fish',buyDayBefore:true},
    {name:'Soy sauce',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Toasted sesame oil',qty:0.12,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Fresh ginger',qty:0.25,unit:'tsp',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:0.12,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Brown sugar',qty:6,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Rice wine',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Corn starch',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Mayonnaise',qty:15,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Sriracha',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Whisk the soy sauce, water, sesame oil, garlic, ginger, brown sugar, rice wine and cornstarch into a marinade.',
    'Portion the salmon, coat in the marinade and refrigerate at least 30 minutes.',
    'Cook in a hot, well-oiled non-stick pan — the glaze catches easily — until just cooked through.',
    'Stir the sriracha into the mayonnaise and spoon over the fish.']
},

/* --- 17. TURKEY MEATBALLS ----------------------------------------------- */
{
  id:'db-m6', type:'dinner', types:['lunch','dinner'],
  name:'Turkey meatballs', desc:'Parmesan, herbs, oven-baked',
  sourceUrl:'https://www.budgetbytes.com/turkey-meatballs/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2023/09/Turkey-Meatballs-Overhead.jpg',
  emoji:'🍝', img:'pasta',
  prepTime:10, cookTime:20, time:30,
  difficulty:1, servings:4, kcal:213, protein:31, nutrition:'source',
  tags:[],
  contains:['gluten','dairy','eggs'],
  ingredients:[
    {name:'Ground turkey',qty:113,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Plain breadcrumbs',qty:14,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Parmesan',qty:4,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Italian seasoning',qty:0.5,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Garlic powder',qty:0.06,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Onion powder',qty:0.12,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:0.25,unit:'piece',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Heat the oven to 200°C. Stir the breadcrumbs, Parmesan, Italian seasoning, garlic and onion powder, salt and pepper together.',
    'Mix the turkey with the egg and the breadcrumb mix by hand — stop as soon as it comes together or the meatballs go tough.',
    'Shape into 16 meatballs of about two tablespoons each.',
    'Bake on a lined tray for 20 minutes until cooked through, or a few minutes longer for more colour.']
},

/* --- 18. SPAGHETTI BOLOGNESE -------------------------------------------- */
{
  id:'db-m7', type:'dinner', types:['lunch','dinner'],
  name:'Weeknight spaghetti bolognese', desc:'Beef, butter, crushed tomato',
  sourceUrl:'https://www.budgetbytes.com/spaghetti-with-meat-sauce/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2018/04/weeknight-pasta-plated.jpg',
  emoji:'🍝', img:'spaghetti',
  prepTime:5, cookTime:40, time:45,
  difficulty:1, servings:6, kcal:480, protein:20, nutrition:'estimated',
  tags:[],
  contains:['gluten','dairy'],
  ingredients:[
    {name:'Beef mince',qty:38,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Spaghetti',qty:85,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Olive oil',qty:0.5,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Onion',qty:0.17,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Butter',qty:5,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Crushed tomatoes',qty:132,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Italian seasoning',qty:0.08,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Brown the beef mince in the olive oil over medium heat, about 5 minutes, draining if very fatty.',
    'Add the finely diced onion and the butter and cook until soft and translucent, 5 minutes.',
    'Stir in the crushed tomatoes, Italian seasoning and plenty of black pepper.',
    'Cover, bring to a simmer and cook gently for 30 minutes. Season and serve over spaghetti.']
},

/* --- 19. SHRIMP SCAMPI -------------------------------------------------- */
{
  id:'db-m8', type:'dinner', types:['lunch','dinner'],
  name:'Shrimp scampi', desc:'Garlic, butter, lemon, white wine',
  sourceUrl:'https://www.budgetbytes.com/shrimp-scampi/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2024/12/Shrimp-Scampi-Plated.jpg',
  emoji:'🍤', img:'shrimp',
  prepTime:10, cookTime:10, time:20,
  difficulty:2, servings:4, kcal:218, protein:23, nutrition:'source',
  tags:['fish'],
  contains:['shellfish','dairy'],
  ingredients:[
    {name:'Shrimp',qty:113,unit:'g',category:'Meat & Fish',buyDayBefore:true},
    {name:'Butter',qty:14,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Olive oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Garlic',qty:1,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'White wine',qty:30,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Lemon',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Flat-leaf parsley',qty:1,unit:'tbsp',category:'Produce',buyDayBefore:true},
    {name:'Red pepper flakes',qty:0.06,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Pat the shrimp dry and season. Melt half the butter with the oil in a wide pan.',
    'Sear the shrimp about 1 minute a side until just pink, then lift out.',
    'Soften the garlic and chilli flakes in the pan, then pour in the wine and let it reduce by half.',
    'Swirl in the rest of the butter and the lemon juice to make a glossy sauce.',
    'Return the shrimp, toss to coat, and finish with parsley.']
},

/* --- 20. HONEY SRIRACHA CHICKEN ----------------------------------------- */
{
  id:'db-m9', type:'dinner', types:['lunch','dinner'],
  name:'Honey sriracha chicken', desc:'Sticky, spicy, roasted thighs',
  sourceUrl:'https://www.budgetbytes.com/honey-sriracha-chicken/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2013/12/Sriracha-Chicken-Thighs-angle.jpg',
  emoji:'🍗', img:'chicken',
  prepTime:10, cookTime:30, time:40, passiveTime:30,
  difficulty:2, servings:6, kcal:266, protein:30, nutrition:'source',
  tags:[],
  contains:['soy','gluten'],
  ingredients:[
    {name:'Chicken thighs',qty:130,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Sriracha',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Soy sauce',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Garlic',qty:0.5,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Fresh ginger',qty:0.25,unit:'tsp',category:'Produce',buyDayBefore:false},
    {name:'Lime',qty:0.17,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Spring onions',qty:0.5,unit:'piece',category:'Produce',buyDayBefore:true}],
  steps:[
    'Whisk the honey, sriracha, soy sauce, garlic, ginger and lime juice into a marinade.',
    'Coat the chicken thighs and marinate at least 30 minutes in the fridge.',
    'Heat the oven to 190°C and arrange the thighs in a baking dish with the marinade.',
    'Roast about 30 minutes, basting once, until sticky and cooked through.',
    'Rest briefly and finish with sliced spring onion and a squeeze of lime.']
},

/* --- 21. PESTO PASTA ---------------------------------------------------- */
{
  id:'db-m10', type:'lunch', types:['lunch','dinner'],
  name:'Easy pesto pasta', desc:'Basil pesto, parmesan, pine nuts',
  sourceUrl:'https://www.loveandlemons.com/pesto-pasta/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/2025/07/pesto-pasta-social.jpg',
  emoji:'🍝', img:'pasta',
  prepTime:15, cookTime:10, time:25,
  difficulty:1, servings:4, kcal:520, protein:15, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy','nuts'],
  ingredients:[
    {name:'Pasta',qty:85,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Basil pesto',qty:45,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Parmesan',qty:15,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Pine nuts',qty:8,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Fresh basil',qty:1,unit:'tbsp',category:'Produce',buyDayBefore:true},
    {name:'Lemon',qty:0.12,unit:'piece',category:'Produce',buyDayBefore:false}],
  steps:[
    'Cook the pasta in well-salted water until al dente, saving a mug of the cooking water.',
    'Drain and return to the pan off the heat, then stir through the pesto.',
    'Loosen with splashes of pasta water until the sauce coats every strand.',
    'Fold in the Parmesan, toasted pine nuts, basil and a squeeze of lemon.']
},

/* --- 22. VEGETARIAN CHILI ----------------------------------------------- */
{
  id:'db-m11', type:'dinner', types:['lunch','dinner'],
  name:'Vegetarian chili', desc:'Beans, tomato, peppers, smoky spice',
  sourceUrl:'https://www.loveandlemons.com/vegetarian-chili/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2019/10/vegetarian-chili.jpg',
  emoji:'🌶️', img:'chili',
  prepTime:10, cookTime:35, time:45,
  difficulty:2, servings:5, kcal:330, protein:15, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:[],
  ingredients:[
    {name:'Olive oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Onion',qty:0.2,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Red bell pepper',qty:0.2,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Carrots',qty:0.4,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:0.6,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Black beans',qty:85,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Kidney beans',qty:85,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Diced tomatoes',qty:160,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Chili powder',qty:0.6,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Ground cumin',qty:0.4,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Smoked paprika',qty:0.2,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Vegetable broth',qty:100,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Lime',qty:0.2,unit:'piece',category:'Produce',buyDayBefore:false}],
  steps:[
    'Soften the onion, pepper and carrot in the oil with a pinch of salt, about 8 minutes.',
    'Stir in the garlic and all the spices and cook 1 minute until fragrant.',
    'Add the beans, tomatoes and broth, bring to the boil then simmer 30 minutes until thick.',
    'Season generously and finish with lime juice.']
},

/* --- 23. THAI RED CURRY ------------------------------------------------- */
{
  id:'db-m12', type:'dinner', types:['lunch','dinner'],
  name:'Thai red curry', desc:'Coconut, vegetables, basil, rice',
  sourceUrl:'https://cookieandkate.com/thai-red-curry-recipe/',
  sourceName:'Cookie and Kate',
  photo:'https://cookieandkate.com/images/2015/10/thai-red-curry-with-vegetables-1.jpg',
  emoji:'🍛', img:'curry',
  prepTime:10, cookTime:30, time:40,
  difficulty:2, servings:4, kcal:340, protein:8, nutrition:'source',
  tags:['vegetarian','vegan'],
  contains:['soy','gluten'],
  ingredients:[
    {name:'Jasmine rice',qty:60,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Coconut oil',qty:0.25,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Onion',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:0.5,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Fresh ginger',qty:0.25,unit:'tbsp',category:'Produce',buyDayBefore:false},
    {name:'Red bell pepper',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Carrots',qty:0.5,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Thai red curry paste',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Coconut milk',qty:100,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Spinach',qty:35,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Soy sauce',qty:0.4,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Lime',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false}],
  steps:[
    'Cook the rice and keep it warm.',
    'Soften the onion in the coconut oil, then add the garlic, ginger, pepper and carrot for a few minutes.',
    'Stir in the curry paste and cook 1 minute, then pour in the coconut milk and a splash of water.',
    'Simmer until the vegetables are tender, then wilt in the spinach.',
    'Season with soy sauce, sugar and lime juice and serve over the rice.']
},

/* --- 13. EASY COCONUT CURRY -------------------------------------------- */
{
  id:'db-m13', type:'dinner', types:['lunch','dinner'],
  name:'Easy coconut curry', desc:'Squash, cauliflower, spinach, rice',
  sourceUrl:'https://www.loveandlemons.com/vegetable-curry/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2018/10/curry.jpg',
  emoji:'🍛', img:'curry',
  prepTime:15, cookTime:35, time:50,
  difficulty:2, servings:4, kcal:409, protein:8, nutrition:'source',
  tags:['vegetarian','vegan'],
  contains:[],
  ingredients:[
    {name:'Coconut oil',qty:0.25,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Onion',qty:0.27,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:0.5,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Fresh ginger',qty:0.125,unit:'tsp',category:'Produce',buyDayBefore:false},
    {name:'Ground cumin',qty:0.125,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Ground coriander',qty:0.06,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Turmeric',qty:0.06,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Butternut squash',qty:70,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Cauliflower',qty:0.06,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Coconut milk',qty:100,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Lime',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Spinach',qty:30,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Peas',qty:19,unit:'g',category:'Frozen',buyDayBefore:false},
    {name:'Jasmine rice',qty:88,unit:'g',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Cook the onion in coconut oil until soft and well browned, about 10 minutes.',
    'Stir together the garlic, ginger, cumin, coriander, turmeric and salt, then add to the pot.',
    'Add the squash and cook 5 minutes, then the cauliflower, coconut milk and spice mix. Cover and simmer 20 minutes.',
    'Stir in the lemon and lime juice, spinach and peas. Season to taste.',
    'Serve over the rice.']
},

/* --- 14. CHANA MASALA --------------------------------------------------- */
{
  id:'db-m14', type:'dinner', types:['lunch','dinner'],
  name:'Chana masala', desc:'Chickpea, tomato, garam masala, rice',
  sourceUrl:'https://www.loveandlemons.com/chana-masala/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2023/07/chana-masala-recipe.jpg',
  emoji:'🍛', img:'curry',
  prepTime:15, cookTime:40, time:55,
  difficulty:2, servings:4, kcal:380, protein:14, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['dairy'],
  ingredients:[
    {name:'Olive oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Onion',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Cumin seeds',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Garam masala',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Ground coriander',qty:0.125,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Turmeric',qty:0.125,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Garlic',qty:0.5,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Fresh ginger',qty:0.125,unit:'tsp',category:'Produce',buyDayBefore:false},
    {name:'Diced tomatoes',qty:200,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Chickpeas',qty:125,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Fresh coriander',qty:5,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Jasmine rice',qty:44,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Greek yogurt',qty:7.5,unit:'g',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Cook the onion in oil until soft and well browned, about 8 minutes.',
    'Add the cumin seeds, garam masala, coriander, turmeric and a pinch of cayenne; cook until fragrant.',
    'Stir in the garlic, ginger, salt and a splash of water, then the tomatoes, breaking them apart as you go.',
    'Simmer 8–10 minutes until thickened, then add the chickpeas and warm through.',
    'Serve over rice with a dollop of yogurt and fresh coriander.']
},

/* --- 15. BLACK BEAN TACOS ------------------------------------------------ */
{
  id:'db-m15', type:'dinner', types:['lunch','dinner'],
  name:'Black bean tacos', desc:'Spiced beans, lime, cotija, tortillas',
  sourceUrl:'https://www.loveandlemons.com/black-bean-tacos/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/2025/03/black-bean-tacos-social.jpg',
  emoji:'🌮', img:'chili',
  prepTime:15, cookTime:15, time:30,
  difficulty:2, servings:4, kcal:362, protein:15, nutrition:'source',
  tags:['vegetarian'],
  contains:['dairy'],
  ingredients:[
    {name:'Avocado oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'White onion',qty:0.125,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Jalapeno pepper',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Garlic',qty:0.75,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Taco seasoning',qty:0.375,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Black beans',qty:125,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Lime',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Small tortillas',qty:2,unit:'piece',category:'Bakery',buyDayBefore:false},
    {name:'Cotija cheese',qty:7.5,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Fresh coriander',qty:3,unit:'g',category:'Produce',buyDayBefore:true}],
  steps:[
    'Soften the onion, jalapeño, garlic and salt in oil, about 8 minutes.',
    'Stir in the taco seasoning, then the beans and a splash of their liquid; cook until thick.',
    'Mash some of the beans for a creamy texture and stir in the lime juice.',
    'Assemble in warm tortillas with cotija, coriander and extra jalapeño.']
},

/* --- 16. BUTTER CHICKEN --------------------------------------------------- */
{
  id:'db-m16', type:'dinner', types:['lunch','dinner'],
  name:'Butter chicken', desc:'Marinated chicken, tomato cream sauce',
  sourceUrl:'https://www.budgetbytes.com/butter-chicken/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2025/04/Butter_Chicken_Fork.jpg',
  emoji:'🍛', img:'chicken,curry',
  prepTime:10, cookTime:25, time:35, passiveTime:60,
  difficulty:3, servings:4, kcal:468, protein:42, nutrition:'source',
  tags:[],
  contains:['dairy'],
  ingredients:[
    {name:'Chicken breast',qty:170,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Greek yogurt',qty:30,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Lemon',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Fresh ginger',qty:0.5,unit:'tsp',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:1,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Garam masala',qty:1,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Smoked paprika',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Turmeric',qty:0.19,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cooking oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Butter',qty:10.5,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Onion',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Ground cumin',qty:0.125,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Tomato sauce',qty:106,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Heavy cream',qty:20,unit:'ml',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Mix the yogurt, lemon juice, ginger, garlic, garam masala, paprika, turmeric and salt into a marinade; coat the cubed chicken and chill at least 1 hour.',
    'Sear the chicken in hot oil until browned and cooked through; set aside.',
    'Melt the butter in the same pan, soften the onion, then add the garlic, ginger and remaining spices.',
    'Add the tomato sauce and water, simmer 7–8 minutes, then stir in the cream.',
    'Return the chicken to the sauce, simmer 2–3 minutes and serve with rice or naan.']
},

/* --- 17. CHICKEN PARMESAN -------------------------------------------------- */
{
  id:'db-m17', type:'dinner', types:['lunch','dinner'],
  name:'Chicken parmesan', desc:'Breaded cutlet, marinara, mozzarella',
  sourceUrl:'https://www.budgetbytes.com/chicken-parmesan/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2024/04/Chicken-Parmesan-Overhead.jpg',
  emoji:'🍗', img:'chicken',
  prepTime:10, cookTime:12, time:22,
  difficulty:2, servings:4, kcal:570, protein:41, nutrition:'source',
  tags:[],
  contains:['gluten','dairy','eggs'],
  ingredients:[
    {name:'Chicken breast',qty:170,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Plain breadcrumbs',qty:30,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Parmesan',qty:8,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Garlic powder',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Italian seasoning',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:0.25,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Plain flour',qty:15,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Cooking oil',qty:15,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Marinara sauce',qty:30,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Fresh mozzarella',qty:28,unit:'g',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Fillet the chicken breasts into thin cutlets and season with salt, pepper, Italian seasoning and garlic powder.',
    'Set up three dishes: seasoned breadcrumbs with parmesan, beaten egg, and flour.',
    'Dredge each cutlet in flour, then egg, then the breadcrumb mix.',
    'Fry in hot oil until golden on the first side, about 5 minutes.',
    'Flip, top with marinara and mozzarella, cover and cook until the cheese melts.']
},

/* --- 18. HOMEMADE CHICKEN NOODLE SOUP -------------------------------------- */
{
  id:'db-m18', type:'dinner', types:['lunch','dinner'],
  name:'Chicken noodle soup', desc:'Shredded chicken, egg noodles, herbs',
  sourceUrl:'https://www.budgetbytes.com/chicken-noodle-soup/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2017/02/Chicken-Noodle-Soup-Front-Bowl.jpg',
  emoji:'🍲', img:'soup',
  prepTime:15, cookTime:90, time:105,
  difficulty:2, servings:8, kcal:213, protein:17, nutrition:'source',
  tags:[],
  contains:['gluten','eggs'],
  ingredients:[
    {name:'Onion',qty:0.125,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:0.375,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Carrots',qty:0.5,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Celery',qty:0.25,unit:'stalk',category:'Produce',buyDayBefore:true},
    {name:'Fresh parsley',qty:0.125,unit:'tbsp',category:'Produce',buyDayBefore:true},
    {name:'Olive oil',qty:0.25,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Dried basil',qty:0.125,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Dried thyme',qty:0.06,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Chicken breast',qty:85,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Chicken broth',qty:240,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Egg noodles',qty:21,unit:'g',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Dice the onion, carrots and celery, and cook in olive oil until softened, about 6 minutes.',
    'Add the garlic, basil, thyme, bay leaf and pepper; cook 5 minutes more.',
    'Add the chicken breasts and cover with the broth. Bring to a boil, then simmer gently, covered, for 1 hour.',
    'Remove the chicken, shred it, and season the broth to taste.',
    'Add the noodles and boil until tender, about 7 minutes, then return the chicken and finish with parsley.']
},

/* --- 19. CHICKEN FRIED RICE ------------------------------------------------ */
{
  id:'db-m19', type:'dinner', types:['lunch','dinner'],
  name:'Chicken fried rice', desc:'Egg, vegetables, soy, sesame oil',
  sourceUrl:'https://www.budgetbytes.com/chicken-fried-rice/',
  sourceName:'Budget Bytes',
  photo:'https://www.budgetbytes.com/wp-content/uploads/2024/02/Chicken-Fried-Rice-Plated.jpg',
  emoji:'🍚', img:'rice',
  prepTime:15, cookTime:20, time:35,
  difficulty:2, servings:4, kcal:500, protein:23, nutrition:'source',
  tags:[],
  contains:['eggs','soy'],
  ingredients:[
    {name:'Garlic',qty:0.5,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Fresh ginger',qty:0.25,unit:'tsp',category:'Produce',buyDayBefore:false},
    {name:'Spring onions',qty:0.75,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Carrots',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Red bell pepper',qty:0.25,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Peas',qty:38,unit:'g',category:'Frozen',buyDayBefore:false},
    {name:'Chicken breast',qty:50,unit:'g',category:'Meat & Fish',buyDayBefore:false},
    {name:'Eggs',qty:0.5,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Cooking oil',qty:0.75,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Toasted sesame oil',qty:0.75,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Soy sauce',qty:0.75,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Jasmine rice',qty:131,unit:'g',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Prep and dice all the vegetables and the chicken before starting.',
    'Scramble the eggs in a little oil, then set aside.',
    'Stir-fry the carrot, then the pepper and white parts of the spring onion, then the peas.',
    'Add more oil and cook the chicken through, about 4 minutes.',
    'Add the cooked rice, then the soy sauce and sesame oil, stirring to coat.',
    'Return the egg and vegetables, toss together and top with the green spring onion.']
},

/* --- 20. QUINOA SALAD ------------------------------------------------------ */
{
  id:'db-m20', type:'lunch', types:['lunch','dinner'],
  name:'Quinoa salad', desc:'Feta, olives, roasted tomato, pine nuts',
  sourceUrl:'https://www.loveandlemons.com/quinoa-salad/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2020/08/quinoa-salad.jpg',
  emoji:'🥗', img:'quinoa,bowl',
  prepTime:20, cookTime:20, time:40,
  difficulty:2, servings:6, kcal:340, protein:10, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['dairy','nuts'],
  ingredients:[
    {name:'Jasmine rice',qty:93,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Cherry tomatoes',qty:38,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Arugula',qty:7,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Cucumber',qty:0.07,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Fresh basil',qty:3,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Feta',qty:19,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Kalamata olives',qty:19,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Red onion',qty:0.08,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Pine nuts',qty:7.5,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Olive oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Lemon',qty:0.05,unit:'piece',category:'Produce',buyDayBefore:false}],
  steps:[
    'Cook the quinoa (or rice) and roast the tomatoes ahead of time.',
    'Combine the quinoa, roasted tomatoes, arugula, cucumber, herbs, feta, olives, onion and pine nuts.',
    'Drizzle with the dressing and toss, seasoning to taste.']
},

/* --- 21. ORZO SALAD --------------------------------------------------------- */
{
  id:'db-m21', type:'lunch', types:['lunch','dinner'],
  name:'Orzo salad', desc:'Cherry tomato, feta, olives, herbs',
  sourceUrl:'https://www.loveandlemons.com/orzo-salad/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2021/05/orzo-salad-1.jpg',
  emoji:'🥗', img:'pasta,salad',
  prepTime:30, cookTime:8, time:38,
  difficulty:1, servings:6, kcal:310, protein:10, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy'],
  ingredients:[
    {name:'Orzo pasta',qty:50,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Olive oil',qty:0.67,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Red wine vinegar',qty:0.17,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Lemon',qty:0.05,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Dried oregano',qty:0.08,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cucumber',qty:0.33,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Cherry tomatoes',qty:50,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Chickpeas',qty:28,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Feta',qty:19,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Red onion',qty:0.06,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Kalamata olives',qty:13,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Fresh basil',qty:3,unit:'g',category:'Produce',buyDayBefore:true}],
  steps:[
    'Cook the orzo until just past al dente, drain and toss with a little oil so it doesn’t stick.',
    'Whisk together the dressing with vinegar, lemon juice, oregano and salt.',
    'Toss the orzo with cucumber, tomatoes, chickpeas, feta, onion and olives.',
    'Drizzle with dressing, add the herbs, season and toss again.']
},

/* --- 22. LENTIL SALAD ------------------------------------------------------- */
{
  id:'db-m22', type:'lunch', types:['lunch','dinner'],
  name:'Lentil salad', desc:'Kale, feta, radish, herby dressing',
  sourceUrl:'https://www.loveandlemons.com/lentil-salad/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2022/08/lentil-salad-1.jpg',
  emoji:'🥗', img:'lentil',
  prepTime:20, cookTime:20, time:40,
  difficulty:2, servings:5, kcal:330, protein:14, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['dairy'],
  ingredients:[
    {name:'Olive oil',qty:12,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Lemon',qty:0.3,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Garlic',qty:0.6,unit:'clove',category:'Produce',buyDayBefore:false},
    {name:'Dijon mustard',qty:0.2,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Italian seasoning',qty:0.2,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Ground cumin',qty:0.05,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Green lentils',qty:100,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Cucumber',qty:0.6,unit:'piece',category:'Produce',buyDayBefore:true},
    {name:'Cherry tomatoes',qty:22,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Red onion',qty:0.1,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Kale',qty:16,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Radishes',qty:12,unit:'g',category:'Produce',buyDayBefore:true},
    {name:'Feta',qty:18,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Fresh parsley',qty:4,unit:'g',category:'Produce',buyDayBefore:true}],
  steps:[
    'Whisk the olive oil, lemon juice, garlic, mustard, Italian seasoning, cumin and pepper into a dressing.',
    'Cook the lentils until tender but not mushy.',
    'Toss the lentils, cucumber, tomatoes, onion, kale and radishes with the dressing.',
    'Add the feta, parsley and mint, toss again and season to taste.']
},

/* ==========================================================================
   DESSERTS — sweet endings
   ========================================================================== */

/* --- 24. BANANA BREAD --------------------------------------------------- */
{
  id:'db-x1', type:'dessert', types:['dessert','breakfast'],
  name:'Banana bread', desc:'Moist, cinnamon, brown sugar',
  sourceUrl:'https://www.loveandlemons.com/banana-bread-recipe/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2023/07/banana-bread.jpg',
  emoji:'🍌', img:'banana',
  prepTime:15, cookTime:55, time:70,
  difficulty:2, servings:8, kcal:290, protein:4, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','eggs'],
  ingredients:[
    {name:'Plain flour',qty:31,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Banana',qty:0.4,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Brown sugar',qty:19,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:0.25,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Neutral oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Baking soda',qty:0.12,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cinnamon',qty:0.12,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Vanilla extract',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Heat the oven to 180°C and line a loaf tin.',
    'Whisk the mashed banana, sugar, eggs, oil and vanilla together.',
    'Fold in the flour, baking soda, cinnamon and salt until only just combined.',
    'Pour into the tin and bake about 55 minutes, until a skewer comes out clean.',
    'Cool in the tin for 10 minutes before turning out.']
},

/* --- 25. CHOCOLATE CHIP COOKIES ----------------------------------------- */
{
  id:'db-x2', type:'dessert', types:['dessert'],
  name:'Chocolate chip cookies', desc:'Crisp edge, chewy middle',
  sourceUrl:'https://www.loveandlemons.com/chocolate-chip-cookies/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2024/08/chocolate-chip-cookies.jpg',
  emoji:'🍪', img:'cookie',
  prepTime:20, cookTime:10, time:30, passiveTime:30,
  difficulty:2, servings:24, kcal:180, protein:2, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy','eggs'],
  ingredients:[
    {name:'Plain flour',qty:12,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Butter',qty:9,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Brown sugar',qty:8,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Caster sugar',qty:4,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:0.08,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Dark chocolate chips',qty:10,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Vanilla extract',qty:0.08,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Baking soda',qty:0.02,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Cream the butter with both sugars until light, then beat in the egg and vanilla.',
    'Fold in the flour, baking soda and salt, then the chocolate chips.',
    'Chill the dough for 30 minutes — this is what stops them spreading thin.',
    'Scoop onto lined trays, spaced well apart, and bake at 180°C for 9–11 minutes.',
    'Leave on the tray 5 minutes; they finish setting as they cool.']
},

/* --- 26. BROWNIES ------------------------------------------------------- */
{
  id:'db-x3', type:'dessert', types:['dessert'],
  name:'Fudgy brownies', desc:'Dark chocolate, crackly top',
  sourceUrl:'https://www.loveandlemons.com/brownies-recipe/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2020/01/brownie-recipe.jpg',
  emoji:'🍫', img:'chocolate',
  prepTime:5, cookTime:45, time:50,
  difficulty:2, servings:16, kcal:230, protein:3, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy','eggs'],
  ingredients:[
    {name:'Dark chocolate',qty:14,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Butter',qty:14,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Caster sugar',qty:19,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:0.19,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Plain flour',qty:12,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Cocoa powder',qty:3,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Vanilla extract',qty:0.12,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Heat the oven to 180°C and line a square tin.',
    'Melt the chocolate and butter together, then let it cool slightly.',
    'Whisk in the sugar, then the eggs and vanilla, until glossy.',
    'Fold in the flour, cocoa and salt — stop as soon as no streaks remain.',
    'Bake about 35–45 minutes until the middle is just set, then cool fully before cutting.']
},

/* --- 27. TIRAMISU ------------------------------------------------------- */
{
  id:'db-x4', type:'dessert', types:['dessert'],
  name:'Tiramisu', desc:'Mascarpone, espresso, cocoa',
  sourceUrl:'https://www.loveandlemons.com/tiramisu-recipe/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/2026/01/tiramisu-social.jpg',
  emoji:'🍰', img:'dessert',
  prepTime:30, cookTime:0, time:30, passiveTime:480,
  difficulty:3, servings:9, kcal:413, protein:6, nutrition:'source',
  tags:['vegetarian'],
  contains:['gluten','dairy','eggs'],
  ingredients:[
    {name:'Mascarpone',qty:56,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Double cream',qty:50,unit:'ml',category:'Dairy',buyDayBefore:false},
    {name:'Caster sugar',qty:17,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:0.33,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Savoiardi ladyfingers',qty:3,unit:'piece',category:'Bakery',buyDayBefore:false},
    {name:'Espresso',qty:50,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Cocoa powder',qty:1,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Whisk the egg yolks with the sugar until pale and thick, then fold in the mascarpone.',
    'Whip the cream to soft peaks and fold it through to keep the mixture light.',
    'Dip each ladyfinger briefly in the cooled espresso — a second a side, no longer — and line the dish.',
    'Layer cream and biscuits, finishing with cream. Chill at least 8 hours or overnight.',
    'Dust generously with cocoa just before serving.']
},

/* --- 28. HEALTHY BANANA BREAD ------------------------------------------- */
{
  id:'db-x5', type:'dessert', types:['dessert','breakfast'],
  name:'Wholewheat banana bread', desc:'Honey, oats, olive oil',
  sourceUrl:'https://cookieandkate.com/healthy-banana-bread-recipe/',
  sourceName:'Cookie and Kate',
  photo:'https://cookieandkate.com/images/2020/05/healthy-banana-bread-recipe-5.jpg',
  emoji:'🍌', img:'banana',
  prepTime:10, cookTime:55, time:65,
  difficulty:2, servings:10, kcal:233, protein:5, nutrition:'source',
  tags:['vegetarian'],
  contains:['gluten','eggs'],
  ingredients:[
    {name:'Wholewheat flour',qty:22,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Banana',qty:0.3,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Honey',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Olive oil',qty:0.5,unit:'tbsp',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:0.2,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Baking soda',qty:0.1,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cinnamon',qty:0.1,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Vanilla extract',qty:0.1,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Heat the oven to 165°C and grease a loaf tin.',
    'Beat the oil and honey together, then the eggs, then the mashed banana and a splash of milk.',
    'Whisk in the baking soda, vanilla, cinnamon and salt.',
    'Fold in the flour until only just combined — over-mixing makes it dense.',
    'Bake 55–60 minutes until a skewer comes out clean, then cool before slicing.']
},

/* --- 6. LEMON BARS ------------------------------------------------------- */
{
  id:'db-x6', type:'dessert', types:['dessert'],
  name:'Lemon bars', desc:'Shortbread crust, tangy lemon filling',
  sourceUrl:'https://www.loveandlemons.com/lemon-bars/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2024/05/lemon-bars-recipe.jpg',
  emoji:'🍋', img:'dessert',
  prepTime:20, cookTime:40, time:60, passiveTime:180,
  difficulty:2, servings:16, kcal:180, protein:3, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy','eggs'],
  ingredients:[
    {name:'Plain flour',qty:9,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Powdered sugar',qty:2.5,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Butter',qty:7,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Vanilla extract',qty:0.03,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Caster sugar',qty:12.5,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:0.25,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Lemon',qty:0.19,unit:'piece',category:'Produce',buyDayBefore:false}],
  steps:[
    'Heat the oven to 175°C and line an 8x8-inch tin, leaving an overhang.',
    'Mix flour, powdered sugar and salt, add melted butter and vanilla, and press into the tin.',
    'Bake the crust 18–20 minutes until lightly browned.',
    'Whisk the sugar, flour, eggs and lemon juice together and pour over the hot crust.',
    'Bake 20–25 minutes until just set, then cool 1 hour and chill 2 hours before slicing.']
},

/* --- 7. EASY APPLE CRISP -------------------------------------------------- */
{
  id:'db-x7', type:'dessert', types:['dessert'],
  name:'Easy apple crisp', desc:'Cinnamon apples, oat crumble topping',
  sourceUrl:'https://www.loveandlemons.com/apple-crisp/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2024/08/apple-crisp.jpg',
  emoji:'🍎', img:'dessert',
  prepTime:15, cookTime:55, time:70,
  difficulty:2, servings:6, kcal:320, protein:3, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy'],
  ingredients:[
    {name:'Apple',qty:1.05,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Plain flour',qty:12.5,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Brown sugar',qty:23,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Lemon',qty:0.05,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Vanilla extract',qty:0.17,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cinnamon',qty:0.25,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Nutmeg',qty:0.08,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Rolled oats',qty:10,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Butter',qty:19,unit:'g',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Heat the oven to 190°C and grease an 8x8-inch dish.',
    'Toss the chopped apples with flour, brown sugar, lemon juice, vanilla, cinnamon and nutmeg; spread in the dish.',
    'Rub the oats, flour, brown sugar, cinnamon and cold butter together into a crumbly topping and sprinkle over.',
    'Cover and bake 35–40 minutes until bubbling, then uncover for 10–15 minutes until golden.',
    'Cool at least 10 minutes before serving.']
},

/* --- 8. EASY CARROT CAKE -------------------------------------------------- */
{
  id:'db-x8', type:'dessert', types:['dessert'],
  name:'Carrot cake', desc:'Spiced, walnuts, cream cheese frosting',
  sourceUrl:'https://www.loveandlemons.com/carrot-cake/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/2025/03/carrot-cake-social.jpg',
  emoji:'🥕', img:'dessert',
  prepTime:30, cookTime:30, time:60,
  difficulty:3, servings:14, kcal:380, protein:5, nutrition:'estimated',
  tags:['vegetarian'],
  contains:['gluten','dairy','eggs','nuts'],
  ingredients:[
    {name:'Plain flour',qty:21,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Baking powder',qty:0.14,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Baking soda',qty:0.07,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Cinnamon',qty:0.14,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Ground ginger',qty:0.07,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Nutmeg',qty:0.04,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Brown sugar',qty:16,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Caster sugar',qty:7,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Vegetable oil',qty:13,unit:'ml',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:0.29,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Apple sauce',qty:17,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Vanilla extract',qty:0.14,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Carrots',qty:0.33,unit:'piece',category:'Produce',buyDayBefore:false},
    {name:'Walnuts',qty:8,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Cream cheese',qty:7,unit:'g',category:'Dairy',buyDayBefore:false}],
  steps:[
    'Heat the oven to 175°C and grease two 9-inch round tins.',
    'Whisk the flour, baking powder, baking soda, cinnamon, ginger and nutmeg together.',
    'Whisk the sugars and oil, then the eggs, then the applesauce and vanilla.',
    'Fold in the dry ingredients, then the carrots and walnuts.',
    'Divide between the tins and bake 30–35 minutes until a skewer comes out clean.',
    'Cool completely, then frost with cream cheese frosting.']
},

/* --- 9. PEANUT BUTTER COOKIES --------------------------------------------- */
{
  id:'db-x9', type:'dessert', types:['dessert'],
  name:'Peanut butter cookies', desc:'Classic crosshatch, soft centre',
  sourceUrl:'https://www.loveandlemons.com/peanut-butter-cookies/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2023/10/peanut-butter-cookie-recipe.jpg',
  emoji:'🍪', img:'cookie',
  prepTime:30, cookTime:20, time:50,
  difficulty:2, servings:30, kcal:116, protein:3, nutrition:'source',
  tags:['vegetarian'],
  contains:['gluten','dairy','eggs','nuts'],
  ingredients:[
    {name:'Plain flour',qty:4,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Baking soda',qty:0.02,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Butter',qty:4,unit:'g',category:'Dairy',buyDayBefore:false},
    {name:'Brown sugar',qty:4,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Caster sugar',qty:2,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Peanut butter',qty:9,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Eggs',qty:0.03,unit:'piece',category:'Dairy',buyDayBefore:false},
    {name:'Vanilla extract',qty:0.03,unit:'tsp',category:'Pantry',buyDayBefore:false}],
  steps:[
    'Heat the oven to 175°C and line two baking sheets.',
    'Whisk the flour, baking soda and salt together.',
    'Beat the butter and both sugars until fluffy, then mix in the peanut butter, egg and vanilla.',
    'Gradually add the dry ingredients until just combined.',
    'Roll into balls, coat in sugar, flatten with a fork crosshatch, and bake 10–12 minutes.']
},

/* --- 10. BAKED APPLES ------------------------------------------------------ */
{
  id:'db-x10', type:'dessert', types:['dessert'],
  name:'Baked apples', desc:'Oat crumble filling, warm spices',
  sourceUrl:'https://www.loveandlemons.com/baked-apples/',
  sourceName:'Love & Lemons',
  photo:'https://cdn.loveandlemons.com/wp-content/uploads/opengraph/2021/09/baked-apples-1.jpg',
  emoji:'🍎', img:'dessert',
  prepTime:20, cookTime:30, time:50,
  difficulty:2, servings:4, kcal:340, protein:4, nutrition:'estimated',
  tags:['vegetarian','vegan'],
  contains:['nuts'],
  ingredients:[
    {name:'Rolled oats',qty:12.5,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Almond flour',qty:14,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Brown sugar',qty:18,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Walnuts',qty:7.5,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Cinnamon',qty:0.125,unit:'tsp',category:'Pantry',buyDayBefore:false},
    {name:'Coconut oil',qty:14,unit:'g',category:'Pantry',buyDayBefore:false},
    {name:'Apple',qty:1,unit:'piece',category:'Produce',buyDayBefore:false}],
  steps:[
    'Heat the oven to 190°C.',
    'Combine the oats, almond flour, brown sugar, walnuts, cinnamon and salt, then work in the firm coconut oil until crumbly.',
    'Scoop a little out of the centre of each apple half and set in a baking dish.',
    'Fill with the crumble, drizzle with melted coconut oil, cover with foil and bake about 30 minutes until tender.',
    'Serve warm.']
},


];

/* Browser global + Node export, so the app and the doc generator share one file. */
if (typeof module !== 'undefined' && module.exports) module.exports = { RECIPES_DB };
if (typeof window !== 'undefined') window.RECIPES_DB = RECIPES_DB;
