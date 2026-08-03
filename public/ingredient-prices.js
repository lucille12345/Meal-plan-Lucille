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
  slice:35, slices:35,  // one slice of bread ≈ 35 g (plural written by some recipes)
  stalk:40,       // one celery stalk ≈ 40 g
  scoop:30,       // one protein scoop ≈ 30 g
  scoops:50,      // a dessert scoop (sorbet/ice cream) ≈ 50 g — 2 scoops ≈ 100 g
  handful:15,     // a handful of leaves/herbs ≈ 15 g  (was pricing €0 before — a real bug)
  bunch:30, sprig:2, knob:15, splash:15, dash:1, drizzle:8, can:400,
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
  'pita bread':              {per:'piece', eur:0.45},
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
  'red wine':                {per:'100ml', eur:0.50},
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

  /* ---------- V4 §4: legacy-pool + common AI ingredients that used to price €0 ----------
     Same basis (French supermarket, mid-range own-brand, 2026). These close the 63 gaps
     found by the coverage test so the shopping total, €/day and budget pill are never
     under-counted. Piece-priced items (per:'piece' etc.) get rounded UP to whole items at
     shopping-list aggregation time — see buildShoppingList in app.js. */
  /* fruit & veg — per piece */
  'tomato':                  {per:'piece', eur:0.35},
  'carrot':                  {per:'piece', eur:0.15},
  'potato':                  {per:'piece', eur:0.25},
  'sweet potato':            {per:'piece', eur:0.60},
  'zucchini':                {per:'piece', eur:0.60},
  'corn cob':                {per:'piece', eur:0.60},
  'radish':                  {per:'piece', eur:0.08},
  'melon':                   {per:'piece', eur:1.80},
  'clementine':              {per:'piece', eur:0.25},
  'pear':                    {per:'piece', eur:0.45},
  'peach':                   {per:'piece', eur:0.50},
  'orange':                  {per:'piece', eur:0.40},
  'plums':                   {per:'piece', eur:0.35},
  'figs':                    {per:'piece', eur:0.55},
  /* fruit & veg — per 100 g */
  'mixed berries':           {per:'100g',  eur:1.60},
  'strawberries':            {per:'100g',  eur:0.90},
  'blueberries':             {per:'100g',  eur:1.80},
  'grapes':                  {per:'100g',  eur:0.55},
  'watermelon':              {per:'100g',  eur:0.25},
  'pineapple':               {per:'100g',  eur:0.30},
  'mixed fruit':             {per:'100g',  eur:0.60},
  'salad greens':            {per:'100g',  eur:1.20},
  'lettuce':                 {per:'100g',  eur:0.60},
  'sweetcorn':               {per:'100g',  eur:0.40},
  'asparagus':               {per:'100g',  eur:1.60},
  'mixed veg':               {per:'100g',  eur:0.35},
  'cooked beetroot':         {per:'100g',  eur:0.55},
  'olives':                  {per:'100g',  eur:1.40},
  'ginger':                  {per:'100g',  eur:0.80},
  /* fresh herbs — per bunch (piece) */
  'fresh dill':              {per:'piece', eur:1.00},
  'parsley':                 {per:'piece', eur:0.90},
  /* grains, pulses, bakery */
  'oats':                    {per:'100g',  eur:0.20},
  'granola':                 {per:'100g',  eur:0.80},
  'muesli':                  {per:'100g',  eur:0.55},
  'quinoa':                  {per:'100g',  eur:0.90},
  'rice':                    {per:'100g',  eur:0.20},
  'risotto rice':            {per:'100g',  eur:0.45},
  'flour':                   {per:'100g',  eur:0.10},
  'red lentils':             {per:'100g',  eur:0.35},
  'cooked lentils':          {per:'100g',  eur:0.45},
  'bagel':                   {per:'piece', eur:0.50},
  'bread':                   {per:'slice', eur:0.10},
  'rye bread':               {per:'slice', eur:0.15},
  'crackers':                {per:'piece', eur:0.06},
  'tortilla wrap':           {per:'piece', eur:0.30},
  'pizza base':              {per:'piece', eur:1.20},
  'falafel':                 {per:'piece', eur:0.25},
  /* dairy & protein */
  'cheese':                  {per:'100g',  eur:1.50},
  'mozzarella':              {per:'100g',  eur:1.10},
  'cottage cheese':          {per:'100g',  eur:0.65},
  'vanilla yogurt':          {per:'100g',  eur:0.40},
  'cream':                   {per:'100ml', eur:0.35},
  'hummus':                  {per:'100g',  eur:0.90},
  'salsa':                   {per:'100g',  eur:0.80},
  'protein powder':          {per:'100g',  eur:3.00},
  'ham':                     {per:'100g',  eur:1.80},
  'beef strips':             {per:'100g',  eur:1.40},
  'turkey mince':            {per:'100g',  eur:1.15},
  'cod fillet':              {per:'100g',  eur:2.20},
  'canned tuna':             {per:'piece', eur:0.95},
  'chopped tomatoes':        {per:'piece', eur:0.70},
  /* frozen desserts — per 100 g (2 scoops ≈ 100 g via UNIT_TO_BASE) */
  'lemon sorbet':            {per:'100g',  eur:0.60},
  'mango sorbet':            {per:'100g',  eur:0.60},

  /* ---------- V4 hearty-mains additions (meat for the higher-calorie / muscle-gain dishes) ---------- */
  'beef steak':              {per:'100g',  eur:2.20},
  'pork loin':               {per:'100g',  eur:1.30},
  'lamb':                    {per:'100g',  eur:2.60},
  'chorizo':                 {per:'100g',  eur:2.20},
  'sausages':                {per:'piece', eur:0.70},
  'burger bun':              {per:'piece', eur:0.40},
  'fries':                   {per:'100g',  eur:0.30},
  'baked beans':             {per:'100g',  eur:0.30},
  'couscous':                {per:'100g',  eur:0.45},
  'duck breast':             {per:'100g',  eur:2.80},
  'mussels':                 {per:'100g',  eur:1.10},
  /* ---------- V4.4: dessert & extra-dish ingredients ---------- */
  'shortcrust pastry':       {per:'100g',  eur:0.55},
  'puff pastry':             {per:'100g',  eur:0.55},
  'gelatine':                {per:'piece', eur:0.30},
  'apricots':                {per:'piece', eur:0.35},
  'raspberries':             {per:'100g',  eur:1.90},
  'ice cream':               {per:'100g',  eur:0.55},
  'rum':                     {per:'100ml', eur:2.00},
  'pistachios':              {per:'100g',  eur:3.50},
  'passion fruit':           {per:'piece', eur:0.90},
  'gnocchi':                 {per:'100g',  eur:0.40},
  /* ---------- V4.5: cuisine-bucket ingredients (French/Italian/Asian/Mexican/Middle-Eastern) ---------- */
  'fava beans':              {per:'100g',  eur:0.90},
  'leeks':                   {per:'piece', eur:0.85},
  'grape leaves':            {per:'100g',  eur:1.80},
  'edamame':                 {per:'100g',  eur:1.20},
  'gyoza wrappers':          {per:'100g',  eur:1.00},
  'sticky rice':             {per:'100g',  eur:0.35},
  'queso fresco':            {per:'100g',  eur:1.60},
  'condensed milk':          {per:'100ml', eur:0.60},
  'yeast':                   {per:'piece', eur:0.20},
  'rosewater':               {per:'100ml', eur:1.80},
  'phyllo pastry':           {per:'100g',  eur:0.65},
  'shredded chicken':        {per:'100g',  eur:1.10},
  'tahini':                  {per:'100g',  eur:1.40},
  'chickpeas':               {per:'100g',  eur:0.30},
  'red wine vinegar':        {per:'100ml', eur:0.60},
  'anchovy fillets':         {per:'100g',  eur:3.50},
  'kalamata olives':         {per:'100g',  eur:1.60},
  'nori sheets':             {per:'piece', eur:0.20},
  'sushi rice':              {per:'100g',  eur:0.45},
  'orange blossom water':    {per:'100ml', eur:1.80},
  /* ---------- V4.7: showpiece-dish ingredients ---------- */
  'beef fillet':             {per:'100g',  eur:4.50},
  'prosciutto':              {per:'100g',  eur:3.60},
  'saffron':                 {per:'100g',  eur:30.00},
  'veal shank':              {per:'100g',  eur:2.40},
  'duck leg':                {per:'100g',  eur:1.90},
  'linguine':                {per:'100g',  eur:0.20},
  'king prawns':             {per:'100g',  eur:2.80},
  'lamb leg':                {per:'100g',  eur:2.20},
  'fresh rosemary':          {per:'100g',  eur:2.50},
  'fennel':                  {per:'piece', eur:1.20},
  'arborio rice':            {per:'100g',  eur:0.45},
  'sea bass fillet':         {per:'100g',  eur:3.20},
  'lamb shoulder':           {per:'100g',  eur:1.90},
  'ricotta':                 {per:'100g',  eur:1.10},
  'mango':                   {per:'piece', eur:1.20},
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

/* ----------------------------------------------------------------------------
   piecePriceOf(ing) → {eur} when this ingredient is bought as whole items
   (per:piece/clove/slice/stalk) and can therefore be rounded UP to a whole
   count at shopping-list aggregation (V4 §4.3: half an onion costs a whole
   onion). Returns null for weight/volume ingredients (which must NOT round —
   nobody buys a whole 1 kg bag because a recipe needs 200 g) and for anything
   the table doesn't price. AI-supplied per-row prices bypass this entirely,
   handled in app.js by only rounding when the ingredient has no AI price.
---------------------------------------------------------------------------- */
function piecePriceOf(ing){
  if (!ing || !ing.name) return null;
  const entry = INGREDIENT_PRICES[String(ing.name).trim().toLowerCase()];
  if (!entry) return null;
  const unit = (ing.unit || 'piece').trim().toLowerCase();
  if ((entry.per==='piece'||entry.per==='clove'||entry.per==='slice'||entry.per==='stalk') && unit!=='g' && unit!=='ml')
    return { eur: entry.eur };
  return null;
}

/* ----------------------------------------------------------------------------
   packOf(name) → { pack, packEur, label } for a weight/volume ingredient that
   is bought as a whole PACK you can't split — a bottle of oil, a jar of spice,
   a bag of flour, a bunch of herbs. This is the "true till total" model (Lucille's
   choice): you use 1 tsp of cinnamon but you buy the whole €1.50 jar. The shopping
   list charges ceil(total ÷ pack) × packEur (same idea as onions, extended to packs).
   Proteins and loose produce return null → still charged by weight, which is realistic
   (you buy roughly the amount at the counter). Pack price is kept consistent with the
   per-100 price so nothing contradicts the per-serving figure.
---------------------------------------------------------------------------- */
function packOf(name){
  const e = INGREDIENT_PRICES[String(name||'').trim().toLowerCase()];
  if (!e || (e.per!=='100g' && e.per!=='100ml')) return null;   // only weight/volume items
  const n = String(name).toLowerCase();
  let pack=null, label='pack';
  if (e.per==='100ml'){
    if (/coconut milk/.test(n)) { pack=400; label='can'; }
    else if (/condensed milk/.test(n)) { pack=397; label='can'; }
    else if (/\bmilk\b|broth|stock/.test(n)) { pack=1000; label='carton'; }
    else if (/rosewater|orange blossom/.test(n)) { pack=250; label='bottle'; }
    else if (/cream/.test(n)) { pack=200; label='pot'; }
    else if (/\boil\b/.test(n)) { pack=500; label='bottle'; }
    else if (/red wine|white wine/.test(n)) { pack=750; label='bottle'; }
    else if (/wine|vinegar|extract|espresso/.test(n)) { pack=250; label='bottle'; }
    else if (/soy sauce|sriracha|worcestershire|syrup|sauce/.test(n)) { pack=250; label='bottle'; }
    else { pack=500; label='bottle'; }
  } else { // 100g
    if (/protein powder/.test(n)) { pack=500; label='tub'; }
    else if (/fresh (basil|mint|parsley|coriander|thyme|dill|ginger)|flat-leaf parsley|arugula|\bspinach\b|\bkale\b/.test(n)) { pack=30; label='bunch'; }
    else if (/salt|pepper|paprika|cumin|cinnamon|oregano|nutmeg|powder|flakes|seasoning|baking|bicarbonate|corn ?starch|cocoa|curry|chili|masala|turmeric|coriander|dried (thyme|basil|oregano)|italian season/.test(n) && !/chickpea|noodle/.test(n)) { pack=45; label='jar'; }
    else if (/flour|\bsugar\b/.test(n)) { pack=1000; label='bag'; }
    else if (/rice|pasta|spaghetti|penne|orzo|ditalini|noodle|oats|couscous|quinoa|lentils|breadcrumb|granola|muesli/.test(n)) { pack=500; label='pack'; }
    else if (/(kidney|black|cannellini|butter|baked|broad|pinto|white) beans?|chickpea|crushed tomato|diced tomato|roasted tomato|tomato paste|tomato sauce|marinara|passata|beetroot|sweetcorn/.test(n)) { pack=400; label='can'; }
    else if (/cheese|feta|mozzarella|parmesan|pecorino|gruy|cheddar|mascarpone|cotija|halloumi|paneer|ricotta|queso/.test(n)) { pack=200; label='pack'; }
    else if (/edamame|gyoza wrapper|grape leaves/.test(n)) { pack=250; label='pack'; }
    else if (/butter/.test(n) && !/nut butter|peanut butter|almond butter/.test(n)) { pack=250; label='pack'; }
    else if (/yogurt|hummus|pesto|tahini|mayonnaise|salsa|paste|mustard|jam|nut butter|peanut butter|almond butter|apple sauce|miso|olives/.test(n)) { pack=200; label='pot'; }
    else if (/berries|strawberr|blueberr|raspberr|grapes|cranberr/.test(n)) { pack=250; label='punnet'; }
    else if (/pastry/.test(n)) { pack=320; label='block'; }
    else if (/chocolate|chips|walnuts|pine nuts|almond|pistachio|coconut|chia|seeds/.test(n)) { pack=150; label='pack'; }
    else if (/sorbet|ice cream/.test(n)) { pack=500; label='tub'; }
    // proteins & loose produce (chicken, beef, tomato-by-weight, broccoli…) → null → by weight
  }
  if (!pack) return null;
  return { pack, packEur: +(e.eur*pack/100).toFixed(2), label };
}

/* Browser global + Node export, so the app and the doc generator share one file. */
if (typeof module !== 'undefined' && module.exports)
  module.exports = { INGREDIENT_PRICES, UNIT_TO_BASE, estimateIngredientPrice, piecePriceOf, packOf };
if (typeof window !== 'undefined') {
  window.INGREDIENT_PRICES = INGREDIENT_PRICES;
  window.estimateIngredientPrice = estimateIngredientPrice;
  window.piecePriceOf = piecePriceOf;
  window.packOf = packOf;
}
