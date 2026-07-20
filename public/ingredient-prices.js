/* ============================================================================
   INGREDIENT PRICE TABLE — #Foodie
   ============================================================================
   This is what lets the shopping list show real money WITHOUT calling Gemini.
   Before this file, per-ingredient prices came only from the AI, so with AI off
   the €/day pill, the per-day € chips and the budget comparison were all blank.

   Covers all 126 distinct ingredients used by public/recipes-db.js.

   ⚠️ HONEST LABEL: these are **informed estimates**, not scraped live prices.
   Basis: a French supermarket (Carrefour / Leclerc / Intermarché), mid-range
   own-brand, 2026. They are here to give a believable weekly budget, not an
   exact receipt. Always show them to the user as "Estimated — varies by shop."
   Lucille can and should correct any number — it is just data.

   ── HOW TO EDIT ────────────────────────────────────────────────────────────
   Change a number, add a line, run `node tools/build-prices-md.js` to refresh
   docs/INGREDIENT-PRICES.md. Nothing else needs touching.

   ── HOW A PRICE IS WORKED OUT ──────────────────────────────────────────────
   Each entry gives a price on its natural shopping basis:
     per:'100g'   → eur is the price of 100 g
     per:'100ml'  → eur is the price of 100 ml
     per:'piece'  → eur is the price of one (one egg, one lemon, one avocado)
     per:'clove' | 'slice' | 'stalk'  → price of one of those
   A recipe measured in tsp / tbsp / pinch is converted to g or ml first, using
   UNIT_TO_BASE below, then priced against the 100 g / 100 ml figure.

   ── KNOWN LIMITS (documented, not hidden) ──────────────────────────────────
   • Linear pricing. A recipe needing 1 tbsp of parsley is charged for 15 g of
     parsley, but in a real shop you buy a whole €1.20 bunch. Small quantities
     of fresh herbs and spices therefore UNDER-count. The offsetting error is
     that the generic 15 g/tbsp and 5 g/tsp conversions are generous for light
     dry spices, so the two partly cancel. Good enough for a budget signal.
     A pack-aware model (charge per bunch/jar) is the future improvement — it
     needs pricing to move AFTER the shopping list aggregates, which it doesn't
     do today.
   • Unknown ingredient → returns 0, never a guess. A wrong number shown
     confidently is worse than no number.
   ============================================================================ */

/* g or ml that one of these units represents, for converting into a 100g/100ml price. */
const UNIT_TO_BASE = {
  g:1, ml:1,
  tsp:5, tbsp:15, pinch:0.5,
  clove:5,        // one garlic clove ≈ 5 g
  slice:35,       // one slice of bread ≈ 35 g
  stalk:40,       // one celery stalk ≈ 40 g
  scoop:30,       // one protein scoop ≈ 30 g
};

const INGREDIENT_PRICES = {

  /* ---------- Meat & Fish ---------- */
  'chicken breast':          {per:'100g',  eur:1.10},
  'chicken thighs':          {per:'100g',  eur:0.75},
  'beef mince':              {per:'100g',  eur:1.20},
  'ground turkey':           {per:'100g',  eur:1.15},
  'bacon':                   {per:'100g',  eur:1.60},
  'cooked ham':              {per:'100g',  eur:1.80},
  'salmon fillet':           {per:'100g',  eur:2.90},
  'shrimp':                  {per:'100g',  eur:2.50},

  /* ---------- Dairy ---------- */
  'eggs':                    {per:'piece', eur:0.32},
  'milk':                    {per:'100ml', eur:0.11},
  'almond milk':             {per:'100ml', eur:0.18},
  'greek yogurt':            {per:'100g',  eur:0.35},
  'butter':                  {per:'100g',  eur:1.10},
  'cheddar':                 {per:'100g',  eur:1.30},
  'parmesan':                {per:'100g',  eur:2.40},
  'pecorino':                {per:'100g',  eur:2.60},
  'feta':                    {per:'100g',  eur:1.40},
  'fresh mozzarella':        {per:'100g',  eur:1.20},
  'mascarpone':              {per:'100g',  eur:0.90},
  'cream cheese':            {per:'100g',  eur:1.00},
  'double cream':            {per:'100ml', eur:0.45},
  'heavy cream':             {per:'100ml', eur:0.55},
  'sour cream':              {per:'100g',  eur:0.50},

  /* ---------- Bakery ---------- */
  'baguette':                {per:'100g',  eur:0.35},
  'crusty bread':            {per:'100g',  eur:0.40},
  'sourdough bread':         {per:'slice', eur:0.30},
  'large flour tortilla':    {per:'piece', eur:0.30},
  'small tortillas':         {per:'piece', eur:0.18},
  'savoiardi ladyfingers':   {per:'piece', eur:0.15},

  /* ---------- Produce ---------- */
  'apple':                   {per:'piece', eur:0.45},
  'avocado':                 {per:'piece', eur:1.10},
  'banana':                  {per:'piece', eur:0.25},
  'bell pepper':             {per:'piece', eur:0.85},
  'bell peppers':            {per:'piece', eur:0.85},
  'red bell pepper':         {per:'piece', eur:0.85},
  'green bell pepper':       {per:'piece', eur:0.80},
  'carrots':                 {per:'piece', eur:0.18},
  'celery':                  {per:'stalk', eur:0.25},
  'cherry tomatoes':         {per:'100g',  eur:0.55},
  'cremini mushrooms':       {per:'piece', eur:0.22},
  'cucumber':                {per:'piece', eur:0.90},
  'garlic':                  {per:'clove', eur:0.08},
  'heirloom tomatoes':       {per:'piece', eur:0.80},
  'ripe tomatoes':           {per:'100g',  eur:0.35},
  'kale':                    {per:'100g',  eur:0.50},
  'spinach':                 {per:'100g',  eur:0.90},
  'lemon':                   {per:'piece', eur:0.40},
  'lime':                    {per:'piece', eur:0.35},
  'onion':                   {per:'piece', eur:0.30},
  'yellow onion':            {per:'piece', eur:0.30},
  'red onion':               {per:'piece', eur:0.35},
  'spring onions':           {per:'piece', eur:0.20},
  'fresh ginger':            {per:'100g',  eur:0.80},
  'fresh basil':             {per:'100g',  eur:2.20},
  'fresh mint':              {per:'100g',  eur:2.20},
  'fresh parsley':           {per:'100g',  eur:1.80},
  'flat-leaf parsley':       {per:'100g',  eur:1.80},
  'fresh coriander':         {per:'100g',  eur:1.80},
  'fresh thyme':             {per:'100g',  eur:2.50},
  'arugula':                 {per:'100g',  eur:1.60},
  'broccoli':                {per:'100g',  eur:0.45},
  'butternut squash':        {per:'100g',  eur:0.28},
  'cauliflower':             {per:'piece', eur:1.60},
  'eggplant':                {per:'piece', eur:1.10},
  'green beans':             {per:'100g',  eur:0.70},
  'jalapeno pepper':         {per:'piece', eur:0.30},
  'mushrooms':               {per:'100g',  eur:0.65},
  'radishes':                {per:'100g',  eur:0.60},
  'romaine lettuce':         {per:'100g',  eur:0.55},
  'shallots':                {per:'piece', eur:0.30},
  'white onion':             {per:'piece', eur:0.30},
  'yukon gold potatoes':     {per:'100g',  eur:0.20},

  /* ---------- Pantry — staples ---------- */
  'plain flour':             {per:'100g',  eur:0.09},
  'wholewheat flour':        {per:'100g',  eur:0.14},
  'caster sugar':            {per:'100g',  eur:0.11},
  'brown sugar':             {per:'100g',  eur:0.18},
  'rolled oats':             {per:'100g',  eur:0.20},
  'chia seeds':              {per:'100g',  eur:1.20},
  'jasmine rice':            {per:'100g',  eur:0.25},
  'pasta':                   {per:'100g',  eur:0.18},
  'penne pasta':             {per:'100g',  eur:0.18},
  'spaghetti':               {per:'100g',  eur:0.18},
  'ditalini pasta':          {per:'100g',  eur:0.22},
  'panko breadcrumbs':       {per:'100g',  eur:0.55},
  'plain breadcrumbs':       {per:'100g',  eur:0.35},
  'corn starch':             {per:'100g',  eur:0.30},
  'baking powder':           {per:'100g',  eur:0.80},
  'baking soda':             {per:'100g',  eur:0.30},
  'bicarbonate of soda':     {per:'100g',  eur:0.30},
  'orzo pasta':              {per:'100g',  eur:0.22},
  'egg noodles':             {per:'100g',  eur:0.45},
  'rice noodles':            {per:'100g',  eur:0.35},
  'almond flour':            {per:'100g',  eur:1.80},
  'powdered sugar':          {per:'100g',  eur:0.20},

  /* ---------- Pantry — tins, pulses, jars ---------- */
  'crushed tomatoes':        {per:'100g',  eur:0.18},
  'diced tomatoes':          {per:'100g',  eur:0.18},
  'fire roasted diced tomatoes': {per:'100g', eur:0.24},
  'tomato paste':            {per:'100g',  eur:0.55},
  'sun-dried tomatoes':      {per:'100g',  eur:1.60},
  'chickpeas':               {per:'100g',  eur:0.22},
  'black beans':             {per:'100g',  eur:0.25},
  'kidney beans':            {per:'100g',  eur:0.25},
  'cannellini beans':        {per:'100g',  eur:0.25},
  'green lentils':           {per:'100g',  eur:0.30},
  'kalamata olives':         {per:'100g',  eur:1.20},
  'apple sauce':             {per:'100g',  eur:0.35},
  'basil pesto':             {per:'100g',  eur:1.40},
  'tahini':                  {per:'100g',  eur:1.10},
  'mayonnaise':              {per:'100g',  eur:0.55},
  'pine nuts':               {per:'100g',  eur:4.50},
  'peanut butter':           {per:'100g',  eur:0.90},
  'almond butter':           {per:'100g',  eur:1.60},
  'peanut sauce':            {per:'100g',  eur:0.90},
  'marinara sauce':          {per:'100g',  eur:0.30},
  'tomato sauce':            {per:'100g',  eur:0.20},
  'dried cranberries':       {per:'100g',  eur:1.10},
  'coconut flakes':          {per:'100g',  eur:1.20},
  'walnuts':                 {per:'100g',  eur:1.90},
  'gruyère':                 {per:'100g',  eur:2.20},
  'cotija cheese':           {per:'100g',  eur:1.80},
  'peas':                    {per:'100g',  eur:0.35},
  'rice paper wrappers':     {per:'piece', eur:0.15},
  'pita bread':              {per:'100g',  eur:0.40},
  'miso paste':              {per:'100g',  eur:1.60},
  'taco seasoning':          {per:'100g',  eur:2.50},
  'worcestershire sauce':    {per:'100ml', eur:0.90},

  /* ---------- Pantry — oils, liquids, sauces ---------- */
  'olive oil':               {per:'100ml', eur:0.75},
  'cooking oil':             {per:'100ml', eur:0.25},
  'neutral oil':             {per:'100ml', eur:0.25},
  'vegetable oil':           {per:'100ml', eur:0.20},
  'avocado oil':             {per:'100ml', eur:1.50},
  'coconut oil':             {per:'100ml', eur:1.00},
  'toasted sesame oil':      {per:'100ml', eur:1.80},
  'soy sauce':               {per:'100ml', eur:0.60},
  'sriracha':                {per:'100ml', eur:0.90},
  'thai red curry paste':    {per:'100g',  eur:1.60},
  'coconut milk':            {per:'100ml', eur:0.32},
  'vegetable broth':         {per:'100ml', eur:0.06},
  'chicken broth':           {per:'100ml', eur:0.07},
  'white wine':              {per:'100ml', eur:0.50},
  'rice wine':               {per:'100ml', eur:0.70},
  'balsamic vinegar':        {per:'100ml', eur:0.60},
  'red wine vinegar':        {per:'100ml', eur:0.30},
  'sherry vinegar':          {per:'100ml', eur:0.80},
  'espresso':                {per:'100ml', eur:0.30},
  'honey':                   {per:'100g',  eur:1.20},
  'maple syrup':             {per:'100ml', eur:2.20},
  'vanilla extract':         {per:'100ml', eur:8.00},
  'dijon mustard':           {per:'100g',  eur:1.20},

  /* ---------- Pantry — chocolate & baking ---------- */
  'dark chocolate':          {per:'100g',  eur:1.80},
  'dark chocolate chips':    {per:'100g',  eur:2.00},
  'cocoa powder':            {per:'100g',  eur:1.60},

  /* ---------- Pantry — salt & spices (sold in small jars) ---------- */
  'flaky sea salt':          {per:'100g',  eur:1.50},
  'chili powder':            {per:'100g',  eur:3.00},
  'paprika':                 {per:'100g',  eur:2.50},
  'smoked paprika':          {per:'100g',  eur:3.00},
  'ground cumin':            {per:'100g',  eur:3.00},
  'cumin seeds':             {per:'100g',  eur:3.00},
  'curry powder':            {per:'100g',  eur:2.50},
  'cinnamon':                {per:'100g',  eur:3.50},
  'dried oregano':           {per:'100g',  eur:4.00},
  'dried thyme':             {per:'100g',  eur:4.00},
  'dried basil':             {per:'100g',  eur:4.00},
  'italian seasoning':       {per:'100g',  eur:3.50},
  'garlic powder':           {per:'100g',  eur:2.50},
  'onion powder':            {per:'100g',  eur:2.50},
  'red pepper flakes':       {per:'100g',  eur:3.50},
  'ground coriander':        {per:'100g',  eur:3.00},
  'turmeric':                {per:'100g',  eur:3.00},
  'ground ginger':           {per:'100g',  eur:3.50},
  'garam masala':            {per:'100g',  eur:3.50},
  'nutmeg':                  {per:'100g',  eur:5.00},
};

/* ----------------------------------------------------------------------------
   estimateIngredientPrice({name, qty, unit}) → EUR (number, 0 when unknown)
   Pure function, no state. Safe to call on AI dishes too — an ingredient the
   table doesn't know returns 0 rather than an invented figure.
---------------------------------------------------------------------------- */
function estimateIngredientPrice(ing){
  if (!ing || !ing.name) return 0;
  const entry = INGREDIENT_PRICES[String(ing.name).trim().toLowerCase()];
  if (!entry) return 0;

  const qty = Number(ing.qty);
  if (!isFinite(qty) || qty <= 0) return 0;
  const unit = (ing.unit || 'piece').trim().toLowerCase();

  // NOTE: deliberately NOT rounded here. A week's shopping list sums ~240
  // ingredient rows, many of them fractions of a cent (0.12 tsp of bicarb).
  // Rounding each row to 2dp would silently discard all of them and under-state
  // the total. Round once, at display time, where the app already does .toFixed(2).

  // Priced per item: one egg, one lemon, one clove, one slice, one stalk.
  if (entry.per === 'piece' || entry.per === 'clove' || entry.per === 'slice' || entry.per === 'stalk'){
    // A per-piece ingredient asked for by weight can't be converted — don't guess.
    if (unit === 'g' || unit === 'ml') return 0;
    return entry.eur * qty;
  }

  // Priced per 100 g / 100 ml: convert whatever unit the recipe used into g/ml.
  const factor = UNIT_TO_BASE[unit];
  if (!factor) return 0;                     // unknown unit → no guess
  return entry.eur * (qty * factor) / 100;
}

/* Browser global + Node export, so the app and the doc generator share one file. */
if (typeof module !== 'undefined' && module.exports)
  module.exports = { INGREDIENT_PRICES, UNIT_TO_BASE, estimateIngredientPrice };
if (typeof window !== 'undefined') {
  window.INGREDIENT_PRICES = INGREDIENT_PRICES;
  window.estimateIngredientPrice = estimateIngredientPrice;
}
