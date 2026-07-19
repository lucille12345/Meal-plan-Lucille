/* ============================================================
   1. LOCAL RECIPE POOL (offline fallback only; AI is primary)
   kcal & protein are rough per-person estimates.
   ============================================================ */
const RECIPES = [
  {id:'b1',type:'breakfast',name:'Greek yogurt & berries',desc:'Yogurt, berries, honey, granola',time:5,difficulty:1,emoji:'🥣',img:'yogurt,berries',tags:['vegetarian'],kcal:380,protein:20,ingredients:[
    {name:'Greek yogurt',qty:200,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Mixed berries',qty:100,unit:'g',category:'Produce',buyDayBefore:true},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false},{name:'Granola',qty:40,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Spoon yogurt into a bowl.','Top with berries and granola.','Drizzle with honey.']},
  {id:'b2',type:'breakfast',name:'Veggie omelette',desc:'Eggs, spinach, tomato, cheese',time:12,difficulty:2,emoji:'🍳',img:'omelette',tags:['vegetarian'],kcal:420,protein:28,ingredients:[
    {name:'Eggs',qty:3,unit:'',category:'Dairy',buyDayBefore:false},{name:'Spinach',qty:50,unit:'g',category:'Produce',buyDayBefore:true},{name:'Tomato',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Cheese',qty:30,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Beat the eggs and season.','Soften spinach and diced tomato in a pan.','Pour in eggs, add cheese, fold and cook through.']},
  {id:'b3',type:'breakfast',name:'Oatmeal & banana',desc:'Oats, milk, banana, peanut butter',time:8,difficulty:1,emoji:'🥣',img:'oatmeal',tags:['vegetarian'],kcal:450,protein:16,ingredients:[
    {name:'Oats',qty:60,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Milk',qty:250,unit:'ml',category:'Dairy',buyDayBefore:false},{name:'Banana',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Peanut butter',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Simmer oats with milk 4-5 min, stirring.','Top with sliced banana and peanut butter.']},
  {id:'b4',type:'breakfast',name:'Avocado toast & egg',desc:'Sourdough, avocado, poached egg',time:10,difficulty:2,emoji:'🥑',img:'avocado,toast',tags:['vegetarian'],kcal:430,protein:15,ingredients:[
    {name:'Sourdough bread',qty:2,unit:'slices',category:'Bakery',buyDayBefore:true},{name:'Avocado',qty:1,unit:'',category:'Produce',buyDayBefore:true},{name:'Eggs',qty:1,unit:'',category:'Dairy',buyDayBefore:false}],steps:['Toast the bread.','Mash avocado on top, season.','Poach the egg and place on top.']},
  {id:'b5',type:'breakfast',name:'Smoothie bowl',desc:'Banana, berries, protein, oats',time:6,difficulty:1,emoji:'🍓',img:'smoothie,bowl',tags:['vegetarian'],kcal:390,protein:26,ingredients:[
    {name:'Banana',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Mixed berries',qty:80,unit:'g',category:'Produce',buyDayBefore:true},{name:'Protein powder',qty:1,unit:'scoop',category:'Pantry',buyDayBefore:false},{name:'Oats',qty:30,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Blend banana, berries and protein with a splash of water.','Pour into a bowl, top with oats.']},
  {id:'b6',type:'breakfast',name:'Muesli & milk',desc:'Muesli, milk, apple',time:3,difficulty:1,emoji:'🥛',img:'muesli',tags:['vegetarian'],kcal:360,protein:13,ingredients:[
    {name:'Muesli',qty:60,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Milk',qty:200,unit:'ml',category:'Dairy',buyDayBefore:false},{name:'Apple',qty:1,unit:'',category:'Produce',buyDayBefore:false}],steps:['Pour muesli into a bowl with milk.','Top with grated or sliced apple.']},
  {id:'b7',type:'breakfast',name:'Bagel & cream cheese',desc:'Bagel, cream cheese, cucumber',time:5,difficulty:1,emoji:'🥯',img:'bagel',tags:['vegetarian'],kcal:400,protein:13,ingredients:[
    {name:'Bagel',qty:1,unit:'',category:'Bakery',buyDayBefore:true},{name:'Cream cheese',qty:40,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Cucumber',qty:0.5,unit:'',category:'Produce',buyDayBefore:false}],steps:['Toast the bagel.','Spread cream cheese, add sliced cucumber.']},
  {id:'l1',type:'lunch',name:'Chicken quinoa bowl',desc:'Chicken, quinoa, cucumber, feta',time:20,difficulty:2,emoji:'🥗',img:'quinoa,bowl',tags:[],kcal:560,protein:45,ingredients:[
    {name:'Chicken breast',qty:150,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Quinoa',qty:80,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Cucumber',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Feta',qty:40,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Cook quinoa per pack.','Pan-fry seasoned chicken until cooked, slice.','Combine with cucumber and crumbled feta.']},
  {id:'l2',type:'lunch',name:'Lentil soup & bread',desc:'Red lentils, carrot, onion, bread',time:30,difficulty:2,emoji:'🍲',img:'lentil,soup',tags:['vegetarian','vegan'],kcal:520,protein:24,ingredients:[
    {name:'Red lentils',qty:100,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Carrot',qty:2,unit:'',category:'Produce',buyDayBefore:false},{name:'Onion',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Bread',qty:2,unit:'slices',category:'Bakery',buyDayBefore:true}],steps:['Soften chopped onion and carrot.','Add lentils and water, simmer 20 min.','Blend if you like; serve with bread.']},
  {id:'l3',type:'lunch',name:'Tuna salad',desc:'Tuna, greens, sweetcorn, olive oil',time:8,difficulty:1,emoji:'🥗',img:'tuna,salad',tags:['fish'],kcal:430,protein:35,ingredients:[
    {name:'Canned tuna',qty:1,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Salad greens',qty:80,unit:'g',category:'Produce',buyDayBefore:true},{name:'Sweetcorn',qty:80,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Olive oil',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Drain tuna and sweetcorn.','Toss with greens and olive oil.']},
  {id:'l4',type:'lunch',name:'Falafel wrap',desc:'Falafel, tortilla, hummus, salad',time:10,difficulty:1,emoji:'🌯',img:'falafel,wrap',tags:['vegetarian','vegan'],kcal:550,protein:18,ingredients:[
    {name:'Falafel',qty:4,unit:'',category:'Frozen',buyDayBefore:false},{name:'Tortilla wrap',qty:1,unit:'',category:'Bakery',buyDayBefore:false},{name:'Hummus',qty:50,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Salad greens',qty:40,unit:'g',category:'Produce',buyDayBefore:true}],steps:['Heat falafel per pack.','Spread hummus on the wrap.','Add falafel and greens, roll up.']},
  {id:'l5',type:'lunch',name:'Caprese pasta salad',desc:'Pasta, mozzarella, tomato, basil',time:18,difficulty:2,emoji:'🍝',img:'pasta,salad',tags:['vegetarian'],kcal:580,protein:22,ingredients:[
    {name:'Pasta',qty:90,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Mozzarella',qty:60,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Tomato',qty:2,unit:'',category:'Produce',buyDayBefore:false},{name:'Fresh basil',qty:1,unit:'handful',category:'Produce',buyDayBefore:true}],steps:['Cook and cool the pasta.','Toss with torn mozzarella, tomato and basil.','Season with olive oil, salt and pepper.']},
  {id:'l6',type:'lunch',name:'Chicken caesar wrap',desc:'Chicken, lettuce, parmesan, tortilla',time:12,difficulty:1,emoji:'🌯',img:'chicken,wrap',tags:[],kcal:520,protein:38,ingredients:[
    {name:'Chicken breast',qty:120,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Lettuce',qty:60,unit:'g',category:'Produce',buyDayBefore:true},{name:'Parmesan',qty:20,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Tortilla wrap',qty:1,unit:'',category:'Bakery',buyDayBefore:false}],steps:['Cook and slice the chicken.','Fill wrap with lettuce, chicken and parmesan.','Roll up tightly.']},
  {id:'l7',type:'lunch',name:'Rice & bean burrito bowl',desc:'Rice, black beans, corn, salsa',time:15,difficulty:1,emoji:'🍚',img:'burrito,bowl',tags:['vegetarian','vegan'],kcal:560,protein:20,ingredients:[
    {name:'Rice',qty:80,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Black beans',qty:1,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Sweetcorn',qty:60,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Salsa',qty:50,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Cook the rice.','Warm beans and corn.','Assemble in a bowl, top with salsa.']},
  {id:'d1',type:'dinner',name:'Salmon & roasted veg',desc:'Salmon, broccoli, potato',time:30,difficulty:2,emoji:'🐟',img:'salmon,dinner',tags:['fish'],kcal:620,protein:40,ingredients:[
    {name:'Salmon fillet',qty:150,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Broccoli',qty:150,unit:'g',category:'Produce',buyDayBefore:false},{name:'Potato',qty:2,unit:'',category:'Produce',buyDayBefore:false}],steps:['Roast diced potato 25 min.','Add broccoli and salmon, roast 12 min more.','Season and serve.']},
  {id:'d2',type:'dinner',name:'Beef stir-fry',desc:'Beef, peppers, rice, soy',time:20,difficulty:2,emoji:'🥩',img:'beef,stirfry',tags:[],kcal:640,protein:42,ingredients:[
    {name:'Beef strips',qty:150,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Bell pepper',qty:2,unit:'',category:'Produce',buyDayBefore:false},{name:'Rice',qty:80,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Soy sauce',qty:2,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Cook the rice.','Stir-fry beef on high heat, remove.','Fry peppers, return beef, add soy, toss.']},
  {id:'d3',type:'dinner',name:'Veggie chili',desc:'Beans, tomato, onion, rice',time:35,difficulty:2,emoji:'🌶️',img:'chili',tags:['vegetarian','vegan'],kcal:560,protein:22,ingredients:[
    {name:'Kidney beans',qty:1,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Chopped tomatoes',qty:1,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Onion',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Rice',qty:80,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Soften chopped onion.','Add beans, tomatoes and spices, simmer 20 min.','Serve over cooked rice.']},
  {id:'d4',type:'dinner',name:'Chicken curry',desc:'Chicken, coconut milk, rice, spinach',time:30,difficulty:3,emoji:'🍛',img:'chicken,curry',tags:[],kcal:700,protein:44,ingredients:[
    {name:'Chicken breast',qty:150,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Coconut milk',qty:1,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Rice',qty:80,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Spinach',qty:60,unit:'g',category:'Produce',buyDayBefore:true}],steps:['Brown diced chicken with curry spices.','Add coconut milk, simmer 15 min.','Stir in spinach; serve with rice.']},
  {id:'d5',type:'dinner',name:'Margherita pizza & salad',desc:'Pizza base, mozzarella, tomato, greens',time:20,difficulty:2,emoji:'🍕',img:'pizza',tags:['vegetarian'],kcal:680,protein:26,ingredients:[
    {name:'Pizza base',qty:1,unit:'',category:'Bakery',buyDayBefore:false},{name:'Mozzarella',qty:80,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Chopped tomatoes',qty:1,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Salad greens',qty:40,unit:'g',category:'Produce',buyDayBefore:true}],steps:['Spread tomato on the base, add mozzarella.','Bake 10-12 min until golden.','Serve with a side salad.']},
  {id:'d6',type:'dinner',name:'Shrimp tacos',desc:'Shrimp, tortillas, avocado, lime',time:25,difficulty:3,emoji:'🌮',img:'shrimp,tacos',tags:['fish'],kcal:560,protein:32,ingredients:[
    {name:'Shrimp',qty:150,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Tortilla wrap',qty:2,unit:'',category:'Bakery',buyDayBefore:false},{name:'Avocado',qty:1,unit:'',category:'Produce',buyDayBefore:true},{name:'Lime',qty:1,unit:'',category:'Produce',buyDayBefore:false}],steps:['Pan-fry shrimp with spices 3-4 min.','Warm tortillas.','Fill with shrimp, sliced avocado and a squeeze of lime.']},
  {id:'d7',type:'dinner',name:'Spaghetti bolognese',desc:'Beef mince, tomato, pasta, onion',time:35,difficulty:2,emoji:'🍝',img:'spaghetti',tags:[],kcal:720,protein:40,ingredients:[
    {name:'Beef mince',qty:150,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Chopped tomatoes',qty:1,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Pasta',qty:100,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Onion',qty:1,unit:'',category:'Produce',buyDayBefore:false}],steps:['Brown mince with chopped onion.','Add tomatoes, simmer 20 min.','Serve over cooked spaghetti.']},
];

/* ============================================================
   2. STATE
   ============================================================ */
const state = { screen:'profile', profile:null, week:[], usedFallback:false, selectedDay:0,
  useAI:false, favorites:[], checked:{} };
// Where to reach the backend:
//  - opened as a local file (double-click) → talk to the local Node server on :8787
//  - served over http(s) (local `node server.js`, or hosted on Render) → same origin, no host needed
const BACKEND_URL = location.protocol === 'file:' ? 'http://localhost:8787' : '';
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DISLIKE_OPTIONS = ['Fish','Beef','Chicken','Pork','Mushrooms','Eggs','Onion','Spicy food','Cheese'];
const ALLERGY_OPTIONS = ['Nuts','Dairy','Gluten','Shellfish','Soy'];
const PANTRY_OPTIONS = ['Salt','Pepper','Olive oil','Cooking oil','Butter','Flour','Sugar','Rice','Pasta','Onion','Garlic','Soy sauce','Honey','Spices'];

/* ---- persistence (localStorage + optional Supabase cloud) ---- */
const STORAGE_KEY = 'mealPlannerState';
let cloudUser = null;                       // set once signed in (cloud mode only)
function saveState(){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: state.profile, week: state.week,
    useAI: state.useAI, favorites: state.favorites, checked: state.checked })); }
  catch(e){ console.warn('Could not save progress:', e.message); }
  cloudSave();                              // also push to Supabase when signed in (debounced)
}
function cloudEnabled(){ return !!(window.Cloud && window.Cloud.enabled && cloudUser); }
function currentBlob(){ return { profile: state.profile, week: state.week, useAI: state.useAI,
  favorites: state.favorites, checked: state.checked }; }
let _cloudTimer = null;
function cloudSave(){
  if(!cloudEnabled()) return;
  clearTimeout(_cloudTimer);
  _cloudTimer = setTimeout(cloudSaveNow, 800);
}
function cloudSaveNow(){
  if(!cloudEnabled()) return;
  window.Cloud.saveState(cloudUser.id, currentBlob())
    .catch(e => console.warn('Cloud save failed (kept locally):', e && e.message));
}
function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved && typeof saved === 'object') {
      state.profile = saved.profile || null;
      state.week = Array.isArray(saved.week) ? saved.week : [];
      state.useAI = !!saved.useAI;
      state.favorites = Array.isArray(saved.favorites) ? saved.favorites : [];
      state.checked = (saved.checked && typeof saved.checked === 'object') ? saved.checked : {};
      if (state.week.length) state.screen = 'review';
    }
  } catch(e){ console.warn('Could not load saved progress:', e.message); }
}
function hasSavedData(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const saved = JSON.parse(raw);
    return !!(saved && (saved.profile || (Array.isArray(saved.week) && saved.week.length)
      || (Array.isArray(saved.favorites) && saved.favorites.length)));
  } catch(e){ return false; }
}
function clearAllData(){
  try { localStorage.removeItem(STORAGE_KEY); } catch(e){}
  state.profile = null;
  state.week = [];
  state.selectedDay = 0;
  state.favorites = [];
  state.checked = {};
  setScreen('profile');
}

/* ---- daily nutrition target (Mifflin–St Jeor → TDEE → goal → protein) ---- */
function activityMult(p){
  const f=Number(p.frequency)||0;
  if(f<=0)return 1.2; if(f<=2)return 1.375; if(f<=4)return 1.55; if(f<=6)return 1.725; return 1.9;
}
function computeTargets(p){
  if(!p)return null;
  const kg=Number(p.weight), cm=Number(p.height), age=Number(p.age);
  if(!(kg>0&&cm>0&&age>0))return null;               // need all three; else stay silent
  let bmr;
  if(p.gender==='male')bmr=10*kg+6.25*cm-5*age+5;
  else if(p.gender==='female')bmr=10*kg+6.25*cm-5*age-161;
  else bmr=10*kg+6.25*cm-5*age-78;                   // gender-neutral average constant
  let tdee=bmr*activityMult(p);
  const goal=p.goal||'maintain';
  if(goal==='lose')tdee*=0.80; else if(goal==='gain')tdee*=1.12;
  const kcal=Math.round(tdee/10)*10;
  const protein=Math.round(kg*(goal==='maintain'?1.6:2.0));
  return { kcal, protein };
}

/* ---- pantry staples: skip what the user already owns ---- */
function pantryHas(name){
  const list=state.profile?.pantry||[]; if(!list.length)return false;
  const n=name.toLowerCase();
  return list.some(term=>{ const t=term.toLowerCase(); return n.includes(t)||t.includes(n); });
}

/* ---- "cook once, eat twice": turn some lunches into leftovers of the prior dinner ---- */
function applyLeftovers(week){
  for(const di of [1,3,5]){
    if(di>=week.length)continue;
    const prevDay=week[di-1];
    const dinner=prevDay.meals.find(m=>m.type==='dinner');
    const lunch=week[di].meals.find(m=>m.type==='lunch');
    if(!dinner||!dinner.recipe||!lunch)continue;
    const d=dinner.recipe;
    // cook double at dinner so half becomes tomorrow's lunch (buy 2× ingredients)
    d.ingredients=(d.ingredients||[]).map(i=>({...i, qty:i.qty*2,
      ...(typeof i.price==='number'?{price:i.price*2}:{})}));
    d.batchNote=true;
    lunch.recipe={ ...d, id:'lo'+(nextId++), type:'lunch', name:'Leftover '+d.name,
      desc:'From '+prevDay.day+' night — just reheat', isLeftover:true, batchNote:false,
      ingredients:(d.ingredients||[]).map(i=>({...i})),   // kept for display only; not bought again
      steps:['Reheat the leftovers from '+prevDay.day+' until piping hot.'] };
    lunch.rejected=false;
  }
}

/* ---- favorites (per-person base quantities) ---- */
function peopleCount(){ return Math.max(1, Number(state.profile?.people) || 1); }
function isFavorite(name){ return state.favorites.some(f => f.name === name); }
function toggleFavorite(recipe){
  const i = state.favorites.findIndex(f => f.name === recipe.name);
  if (i >= 0) { state.favorites.splice(i, 1); }
  else {
    const n = peopleCount();
    // store scaled back to 1 person so it can be re-scaled for any future week
    const base = { ...recipe, id:'fav'+Date.now(),
      ingredients:(recipe.ingredients||[]).map(ing=>({ ...ing, qty:ing.qty/n,
        ...(typeof ing.price==='number' ? {price:ing.price/n} : {}) })) };
    state.favorites.push(base);
    if (state.favorites.length > 40) state.favorites.shift();
  }
  saveState();
}

/* ============================================================
   3. LOCAL GENERATION (fallback)
   ============================================================ */
function maxDifficultyFor(l){ if(l<=3)return 2; if(l<=6)return 3; if(l<=8)return 4; return 5; }
function maxTimeFor(s){ return {student:25,working:30,parent:40,flexible:999}[s] ?? 999; }
function passesDietFilters(recipe, profile){
  const dislikes=profile.dislikes.map(d=>d.toLowerCase());
  const allergies=profile.allergies.map(a=>a.toLowerCase());
  for(const ing of recipe.ingredients){
    const n=ing.name.toLowerCase();
    if(dislikes.some(d=>n.includes(d.replace(' food',''))))return false;
  }
  if(allergies.includes('fish')&&recipe.tags.includes('fish'))return false;
  if(allergies.includes('shellfish')&&/shrimp|prawn|crab/.test(recipe.name.toLowerCase()))return false;
  if(allergies.includes('dairy')&&recipe.ingredients.some(i=>i.category==='Dairy'))return false;
  if(allergies.includes('gluten')&&recipe.ingredients.some(i=>/bread|pasta|tortilla|pizza|granola|oats|noodle|couscous|bagel|pita|muesli|flour|bun/.test(i.name.toLowerCase())))return false;
  if(allergies.includes('nuts')&&recipe.ingredients.some(i=>/peanut|almond|\bnut/.test(i.name.toLowerCase())))return false;
  return true;
}
function eligibleRecipes(type,profile){
  // favorites of this meal type join the pool (they've earned it)
  const pool=[...RECIPES, ...state.favorites.filter(f=>f.type===type)];
  const base=pool.filter(r=>r.type===type&&passesDietFilters(r,profile));
  const maxDiff=maxDifficultyFor(profile.cookingLevel), maxTime=maxTimeFor(profile.lifeStage);
  const strict=base.filter(r=>r.difficulty<=maxDiff&&r.time<=maxTime);
  return strict.length?strict:base;
}
function pickMeal(type,profile,usedIds){
  const pool=eligibleRecipes(type,profile);
  const fresh=pool.filter(r=>!usedIds.has(r.id));
  const choices=fresh.length?fresh:pool;
  if(!choices.length)return null;
  // favorites get first pick when available and unused
  const favFresh=choices.filter(r=>String(r.id).startsWith('fav'));
  const from=(favFresh.length&&Math.random()<0.5)?favFresh:choices;
  return from[Math.floor(Math.random()*from.length)];
}
function scaleRecipe(r,n){
  if(!r||n===1)return r?{...r,ingredients:(r.ingredients||[]).map(i=>({...i}))}:r;
  return {...r, ingredients:(r.ingredients||[]).map(i=>({ ...i, qty:i.qty*n,
    ...(typeof i.price==='number' ? {price:i.price*n} : {}) }))};
}
function generateWeek(profile){
  const n=Math.max(1,Number(profile.people)||1);
  const week=[]; const used={breakfast:new Set(),lunch:new Set(),dinner:new Set()};
  for(const day of DAYS){
    const meals=[];
    for(const type of ['breakfast','lunch','dinner']){
      const r=pickMeal(type,profile,used[type]);
      if(r)used[type].add(r.id);
      meals.push({type,recipe:scaleRecipe(r,n),rejected:false});
    }
    week.push({day,meals});
  }
  return week;
}
function swapMeal(di,mi){
  const meal=state.week[di].meals[mi];
  const used=new Set();
  state.week.forEach(d=>d.meals.forEach(m=>{if(m.recipe&&m.type===meal.type)used.add(m.recipe.id);}));
  const r=pickMeal(meal.type,state.profile,used);
  if(r)meal.recipe=scaleRecipe(r,peopleCount());
}

/* ============================================================
   3b. AI (backend) — falls back to local pool if backend off
   ============================================================ */
let nextId=1;
function normalizeRecipe(r){
  return { id:'ai'+(nextId++), type:r.type, name:r.name, desc:r.desc, time:r.time,
    difficulty:r.difficulty, emoji:r.emoji||'🍽️', img:r.img||'food', tags:r.tags||[],
    kcal:(typeof r.kcal==='number'?Math.round(r.kcal):undefined),
    protein:(typeof r.protein==='number'?Math.round(r.protein):undefined),
    ingredients:(r.ingredients||[]).map(i=>({...i})), steps:r.steps||[] };
}
async function requestWeekAI(profile){
  const res=await fetch(BACKEND_URL+'/generate-week',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(profile)});
  if(!res.ok)throw new Error('backend '+res.status);
  const data=await res.json();
  if(!data.week)throw new Error('bad response');
  return data.week.map(day=>({day:day.day,meals:day.meals.map(r=>({type:r.type,recipe:normalizeRecipe(r),rejected:false}))}));
}
async function requestSwapAI(profile,type,avoidNames){
  const res=await fetch(BACKEND_URL+'/generate-meal',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({profile,type,avoidNames})});
  if(!res.ok)throw new Error('backend '+res.status);
  const data=await res.json();
  if(!data.meal)throw new Error('bad response');
  return normalizeRecipe(data.meal);
}

/* ============================================================
   4. SHOPPING LIST (with price totals)
   ============================================================ */
function buyDayFor(di){ return di===0?'Sunday (before the week)':DAYS[di-1]; }
function priceOf(ing){ return typeof ing.price==='number'&&isFinite(ing.price)?ing.price:0; }
function itemKey(ing){ return ing.name.toLowerCase()+'|'+ing.unit; }
function buildShoppingList(){
  const pantry=new Map(); const fresh={}; let total=0; let anyPrice=false; let skipped=0;
  state.week.forEach((day,di)=>{
    day.meals.forEach(meal=>{
      if(meal.rejected||!meal.recipe||meal.recipe.isLeftover)return;   // leftovers: nothing new to buy
      meal.recipe.ingredients.forEach(ing=>{
        if(pantryHas(ing.name)){ skipped++; return; }                  // already in your pantry
        const key=itemKey(ing);
        const pr=priceOf(ing); if(pr>0)anyPrice=true; total+=pr;
        if(ing.buyDayBefore){
          const bd=buyDayFor(di); (fresh[bd]??=new Map());
          if(fresh[bd].has(key)){ fresh[bd].get(key).qty+=ing.qty; fresh[bd].get(key).price+=pr; }
          else fresh[bd].set(key,{...ing,price:pr});
        } else {
          if(pantry.has(key)){ pantry.get(key).qty+=ing.qty; pantry.get(key).price+=pr; }
          else pantry.set(key,{...ing,price:pr});
        }
      });
    });
  });
  return { pantry:[...pantry.values()], fresh, total, anyPrice, skipped };
}

/* ============================================================
   5. RENDERING
   ============================================================ */
const app=document.getElementById('app');
function setScreen(n){ state.screen=n; render(); }
function updateSteps(){
  document.querySelectorAll('.step').forEach(el=>{
    el.classList.remove('active','done');
    const order=['profile','review','shopping'];
    const here=order.indexOf(state.screen==='recipes'?'review':state.screen);
    const mine=order.indexOf(el.dataset.step);
    if(mine===here)el.classList.add('active'); else if(mine<here)el.classList.add('done');
  });
}
function render(){
  updateSteps();
  // The 1·2·3 step bar is only meaningful inside the planner flow — hide it on sign-in.
  const stepsEl=document.querySelector('.steps');
  if(stepsEl)stepsEl.style.display=(state.screen==='signin')?'none':'';
  if(state.screen==='signin')renderSignIn();
  else if(state.screen==='profile')renderProfile();
  else if(state.screen==='loading')renderLoading();
  else if(state.screen==='review')renderReview();
  else if(state.screen==='recipes')renderRecipes();
  else if(state.screen==='shopping')renderShopping();
  window.scrollTo(0,0);
  if(state.screen!=='signin')saveState();   // don't persist while signed out
}
function renderLoading(){
  app.innerHTML=`<div class="card" style="text-align:center;padding:48px 20px">
    <div style="font-size:44px">🍳</div><h2>Cooking up your week…</h2>
    <p class="sub">The AI is planning meals, portions, recipes and prices around your profile. Takes several seconds.</p>
    <div class="spinner"></div></div>`;
}

/* ----- Sign-in / sign-up (magic link + Google) — cloud mode only ----- */
function renderSignIn(){
  const cloudOn = !!(window.Cloud && window.Cloud.enabled);
  app.innerHTML=`
    <div class="card auth-card">
      <h2>Welcome to Table</h2>
      <p class="sub">Free forever. No card. Your data stays yours.</p>
      <div id="auth-form">
        <button class="btn-google" id="googleBtn" type="button"><span class="g" aria-hidden="true"></span> Continue with Google</button>
        <div class="divider">or with email</div>
        <label for="authEmail">Email</label>
        <input type="email" id="authEmail" placeholder="you@email.com" autocomplete="email">
        <button class="primary btn-block" id="magicBtn" type="button">Email me a magic link →</button>
        <ul class="promise">
          <li><span class="tick">✓</span> <span><b>Free forever</b> — no card, no trial clock</span></li>
          <li><span class="tick">✓</span> <span><b>No passwords</b> — we email you a one-tap link</span></li>
          <li><span class="tick">✓</span> <span><b>Your data stays yours</b> — export or delete anytime</span></li>
        </ul>
        <p class="auth-err" id="authErr" style="display:none"></p>
      </div>
      <div id="auth-sent" style="display:none">
        <div class="confirm">
          <div class="env" aria-hidden="true">📬</div>
          <h3>Check your email</h3>
          <p class="sub">We sent a magic link to <span id="sentEmail" class="mailto"></span>. Tap it and you're in — no password needed.</p>
          <button class="ghost" id="diffEmail" type="button">Use a different email</button>
        </div>
      </div>
    </div>`;
  const err=document.getElementById('authErr');
  const showErr=(m)=>{ err.textContent=m; err.style.display='block'; };
  const notConnected='Sign-in isn’t connected yet — add your Supabase details in config.js.';
  document.getElementById('magicBtn').onclick=async()=>{
    const email=document.getElementById('authEmail').value.trim();
    if(!/.+@.+\..+/.test(email)){ showErr('Please enter a valid email address.'); return; }
    if(!cloudOn){ showErr(notConnected); return; }
    try{
      const { error }=await window.Cloud.signInWithEmail(email);
      if(error)throw error;
      document.getElementById('sentEmail').textContent=email;
      document.getElementById('auth-form').style.display='none';
      document.getElementById('auth-sent').style.display='block';
    }catch(e){ showErr('Could not send the link: '+((e&&e.message)||'unknown error')); }
  };
  document.getElementById('googleBtn').onclick=async()=>{
    if(!cloudOn){ showErr(notConnected); return; }
    try{ const { error }=await window.Cloud.signInWithGoogle(); if(error)throw error; }
    catch(e){ showErr('Google sign-in failed: '+((e&&e.message)||'unknown error')); }
  };
  document.getElementById('diffEmail').onclick=()=>{
    document.getElementById('auth-sent').style.display='none';
    document.getElementById('auth-form').style.display='block';
  };
}

/* ----- Screen 1: questionnaire ----- */
function renderProfile(){
  const p=state.profile||{weight:'',height:'',age:'',gender:'female',lifeStage:'working',goal:'maintain',sport:'none',frequency:0,cookingLevel:5,people:1,dislikes:[],allergies:[],pantry:[],leftovers:false,avoidText:'',budget:'',city:''};
  app.innerHTML=`
    <div class="card">
      <h2>Tell us about you</h2>
      <p class="sub">This shapes which meals we suggest, how involved they are, portions, and the budget.</p>
      <div class="row">
        <div><label>Weight (kg)</label><input type="number" id="weight" value="${p.weight}" placeholder="e.g. 65"></div>
        <div><label>Height (cm)</label><input type="number" id="height" value="${p.height||''}" placeholder="e.g. 170"></div>
        <div><label>Age</label><input type="number" id="age" value="${p.age||''}" min="1" max="120" placeholder="e.g. 30"></div>
      </div>
      <p class="hint" style="margin:-6px 0 0">Weight, height and age let us estimate your daily calorie & protein target — the meals are portioned to hit it. Leave blank to skip.</p>
      <div class="row">
        <div><label>Gender</label><select id="gender">
          <option value="female" ${p.gender==='female'?'selected':''}>Female</option>
          <option value="male" ${p.gender==='male'?'selected':''}>Male</option>
          <option value="other" ${p.gender==='other'?'selected':''}>Other / prefer not to say</option>
        </select></div>
        <div><label>Cooking for how many?</label><input type="number" id="people" value="${p.people||1}" min="1" max="8"></div>
      </div>
      <div class="row">
        <div><label>Life stage <span class="hint">(affects cooking time)</span></label><select id="lifeStage">
          <option value="student" ${p.lifeStage==='student'?'selected':''}>Student (quick & cheap)</option>
          <option value="working" ${p.lifeStage==='working'?'selected':''}>Working adult</option>
          <option value="parent" ${p.lifeStage==='parent'?'selected':''}>Parent / family</option>
          <option value="flexible" ${p.lifeStage==='flexible'?'selected':''}>Plenty of time to cook</option>
        </select></div>
        <div><label>Goal</label><select id="goal">
          <option value="lose" ${p.goal==='lose'?'selected':''}>Lose weight</option>
          <option value="maintain" ${p.goal==='maintain'?'selected':''}>Maintain</option>
          <option value="gain" ${p.goal==='gain'?'selected':''}>Build muscle / gain</option>
        </select></div>
      </div>
      <div class="row">
        <div><label>Main sport / activity</label><select id="sport">
          <option value="none" ${p.sport==='none'?'selected':''}>None</option>
          <option value="running" ${p.sport==='running'?'selected':''}>Running / cardio</option>
          <option value="gym" ${p.sport==='gym'?'selected':''}>Gym / weights</option>
          <option value="team" ${p.sport==='team'?'selected':''}>Team sport</option>
          <option value="yoga" ${p.sport==='yoga'?'selected':''}>Yoga / pilates</option>
        </select></div>
        <div><label>Times per week</label><input type="number" id="frequency" value="${p.frequency}" min="0" max="14" placeholder="e.g. 3"></div>
      </div>
      <label>How confident are you at cooking? <span class="range-val" id="ckVal">${p.cookingLevel}</span>/10
        <span class="hint">(lower = simpler recipes)</span></label>
      <input type="range" id="cookingLevel" min="1" max="10" value="${p.cookingLevel}">
      <div class="row">
        <div><label>Weekly grocery budget (€)</label><input type="number" id="budget" value="${p.budget}" min="0" placeholder="e.g. 60"></div>
        <div><label>City <span class="hint">(optional — for prices; we assume Paris)</span></label><input type="text" id="city" value="${p.city}" placeholder="Paris, France"></div>
      </div>
      <label>Anything you can't or won't eat <span class="hint">(free text — e.g. "no pork, hate coriander, lactose-free")</span></label>
      <textarea id="avoidText" placeholder="Write anything specific here…">${p.avoidText||''}</textarea>
      <label>Quick dislikes <span class="hint">(tap to toggle)</span></label>
      <div class="chips" id="dislikes">
        ${DISLIKE_OPTIONS.map(o=>`<div class="chip ${p.dislikes.includes(o)?'on':''}" data-v="${o}">${o}</div>`).join('')}
      </div>
      <label>Allergies <span class="hint">(strictly excluded)</span></label>
      <div class="chips" id="allergies">
        ${ALLERGY_OPTIONS.map(o=>`<div class="chip ${p.allergies.includes(o)?'on':''}" data-v="${o}">${o}</div>`).join('')}
      </div>
      <label>Already in your cupboard <span class="hint">(tap what you have — we'll leave it off the shopping list)</span></label>
      <div class="chips" id="pantry">
        ${PANTRY_OPTIONS.map(o=>`<div class="chip ${(p.pantry||[]).includes(o)?'on':''}" data-v="${o}">${o}</div>`).join('')}
      </div>
      <label class="ai-toggle" style="display:flex;align-items:center;gap:8px;margin:16px 0 0;font-weight:normal">
        <input type="checkbox" id="leftovers" ${p.leftovers?'checked':''}>
        Cook once, eat twice <span class="hint">(reuse some dinners as next-day lunch — less cooking, less waste)</span>
      </label>
      <label class="ai-toggle" style="display:flex;align-items:center;gap:8px;margin:14px 0;font-weight:normal">
        <input type="checkbox" id="useAI" ${state.useAI?'checked':''}>
        Use real AI generation <span class="hint">(personalized, but uses 1 of your ~20 free Gemini requests/day — off by default so testing doesn't burn your quota)</span>
      </label>
      ${state.favorites.length?`<p class="sub" style="margin:0 0 4px">♥ ${state.favorites.length} favorite ${state.favorites.length===1?'meal':'meals'} saved — they'll show up in your weeks.</p>`:''}
      <button class="primary" id="genBtn">Generate my week →</button>
      ${hasSavedData()?'<button type="button" class="ghost" id="clearBtn" style="margin-top:10px;margin-left:10px">Clear saved data &amp; start fresh</button>':''}
      ${cloudEnabled()?'<button type="button" class="ghost" id="signOutBtn" style="margin-top:10px;margin-left:10px">Sign out</button>':''}
    </div>`;
  const slider=document.getElementById('cookingLevel');
  slider.oninput=()=>document.getElementById('ckVal').textContent=slider.value;
  app.querySelectorAll('.chip').forEach(c=>c.onclick=()=>c.classList.toggle('on'));
  document.getElementById('useAI').onchange=(e)=>{ state.useAI=e.target.checked; saveState(); };
  const clearBtn=document.getElementById('clearBtn');
  if(clearBtn) clearBtn.onclick=()=>{ if(confirm("Clear your saved profile, week and favorites? This can't be undone.")) clearAllData(); };
  const signOutBtn=document.getElementById('signOutBtn');
  if(signOutBtn) signOutBtn.onclick=async()=>{ try{ await window.Cloud.signOut(); }catch(e){ console.warn('Sign out failed:', e&&e.message); } };
  document.getElementById('genBtn').onclick=async()=>{
    state.profile={
      weight:document.getElementById('weight').value,
      height:document.getElementById('height').value,
      age:document.getElementById('age').value,
      gender:document.getElementById('gender').value,
      lifeStage:document.getElementById('lifeStage').value,
      goal:document.getElementById('goal').value,
      sport:document.getElementById('sport').value,
      frequency:Number(document.getElementById('frequency').value)||0,
      cookingLevel:Number(document.getElementById('cookingLevel').value),
      people:Math.min(8,Math.max(1,Number(document.getElementById('people').value)||1)),
      budget:document.getElementById('budget').value,
      city:document.getElementById('city').value,
      avoidText:document.getElementById('avoidText').value,
      dislikes:[...app.querySelectorAll('#dislikes .chip.on')].map(c=>c.dataset.v),
      allergies:[...app.querySelectorAll('#allergies .chip.on')].map(c=>c.dataset.v),
      pantry:[...app.querySelectorAll('#pantry .chip.on')].map(c=>c.dataset.v),
      leftovers:document.getElementById('leftovers').checked,
    };
    state.checked={};   // fresh week, fresh list
    setScreen('loading');
    if(state.useAI){
      try { state.week=await requestWeekAI(state.profile); state.usedFallback=false; }
      catch(e){ console.warn('Backend unavailable, using local pool:',e.message); state.week=generateWeek(state.profile); state.usedFallback=true; }
    } else {
      state.week=generateWeek(state.profile); state.usedFallback=false;
    }
    if(state.profile.leftovers) applyLeftovers(state.week);
    setScreen('review');
  };
}

/* ----- Screen 2: review ----- */
function nutriBadges(r){
  let out='';
  if(typeof r.kcal==='number') out+=`<span class="badge kcal">🔥 ${r.kcal} kcal</span>`;
  if(typeof r.protein==='number') out+=`<span class="badge kcal">💪 ${r.protein} g protein</span>`;
  return out;
}
function mealCard(meal,di,mi){
  if(meal.loading)return `<div class="meal"><div class="thumb ${meal.type}"><div class="mini-spin"></div></div>
    <div class="body"><div><div class="type">${meal.type}</div><div class="name" style="color:var(--muted)">finding a new dish…</div></div></div></div>`;
  const r=meal.recipe;
  if(!r)return `<div class="meal"><div class="body"><div><div class="type">${meal.type}</div><div class="name">— no option —</div></div></div></div>`;
  const diffLabel=['','Very easy','Easy','Medium','Involved','Advanced'][r.difficulty]||'';
  const extra=(r.isLeftover?'<span class="badge leftover">♻️ Leftover — just reheat</span>':'')
    +(r.batchNote?'<span class="badge batch">🍲 Cook double → tomorrow\'s lunch</span>':'');
  return `<div class="meal ${meal.rejected?'rejected':''}">
    <div class="thumb ${meal.type}">${r.isLeftover?'♻️':(r.emoji||'🍽️')}</div>
    <div class="body"><div>
      <div class="type">${meal.type}</div><div class="name">${r.name}</div><div class="desc">${r.desc}</div>
      <div class="badges"><span class="badge">⏱ ${r.time} min</span><span class="badge diff">${diffLabel}</span>${nutriBadges(r)}${extra}</div>
    </div>
    <div class="side-btns">
      <button class="swap-btn" data-swap="${di}-${mi}" title="Don't like it — swap" aria-label="Swap this ${meal.type}">✕</button>
      <button class="fav-btn ${isFavorite(r.name)?'on':''}" data-fav="${di}-${mi}" title="Save as favorite" aria-label="Save ${r.name} as favorite">♥</button>
    </div></div>
  </div>`;
}
function dayKcal(day){
  let sum=0, any=false;
  day.meals.forEach(m=>{ if(!m.rejected&&m.recipe&&typeof m.recipe.kcal==='number'){ sum+=m.recipe.kcal; any=true; } });
  return any?sum:null;
}
function renderReview(){
  let html=`<div class="card"><h2>Your week</h2>
    <p class="sub">Tap ✕ on anything you don't fancy — it swaps to a new dish. Tap ♥ to keep a meal in your favorites forever.</p>`;
  const tgt=computeTargets(state.profile);
  if(tgt)html+=`<div class="target-banner">
    <div class="tgt-ico">🎯</div>
    <div><div class="tgt-main">Your daily target: ~${tgt.kcal} kcal · ${tgt.protein} g protein <span class="hint">per person</span></div>
    <div class="tgt-sub">Estimated from your height, weight, age, activity and goal (Mifflin–St Jeor). The 3 meals are portioned toward this.</div></div></div>`;
  if(state.usedFallback)html+=`<div class="notice">⚠️ Backend offline — showing built-in meals, not AI (no budget/prices). Start the backend and regenerate.</div>`;
  else if(!state.useAI)html+=`<div class="notice info">ℹ️ Showing built-in meals — AI generation is off. Tick "Use real AI generation" on the profile page for a personalized week.</div>`;
  state.week.forEach((day,di)=>{
    const kc=dayKcal(day);
    html+=`<div class="day-block"><div class="day-head"><h3 class="day-title">${day.day}</h3>
      ${kc?`<span class="day-kcal">≈ ${kc} kcal/day per person (est.)</span>`:''}</div>`;
    day.meals.forEach((meal,mi)=>html+=mealCard(meal,di,mi));
    html+=`</div>`;
  });
  html+=`</div>
    <div class="status-bar">
      <span class="count">✕ swap · ♥ favorite</span>
      <div class="btn-row">
        <button class="ghost" id="backBtn">← Edit profile</button>
        <button class="ghost" id="recipesBtn">📖 Recipes by day</button>
        <button class="primary" id="listBtn" style="margin-top:0">Shopping list →</button>
      </div>
    </div>`;
  app.innerHTML=html;
  app.querySelectorAll('[data-swap]').forEach(btn=>{
    btn.onclick=async()=>{
      const [di,mi]=btn.dataset.swap.split('-').map(Number);
      const meal=state.week[di].meals[mi];
      if(!state.useAI){ swapMeal(di,mi); renderReview(); saveState(); return; }
      const avoid=[]; state.week.forEach(d=>d.meals.forEach(m=>{if(m.recipe&&m.type===meal.type)avoid.push(m.recipe.name);}));
      meal.loading=true; renderReview();
      try { meal.recipe=await requestSwapAI(state.profile,meal.type,avoid); }
      catch(e){ console.warn('Swap failed, local:',e.message); swapMeal(di,mi); }
      meal.loading=false; renderReview(); saveState();
    };
  });
  app.querySelectorAll('[data-fav]').forEach(btn=>{
    btn.onclick=()=>{
      const [di,mi]=btn.dataset.fav.split('-').map(Number);
      const r=state.week[di].meals[mi].recipe;
      if(r){ toggleFavorite(r); renderReview(); }
    };
  });
  document.getElementById('backBtn').onclick=()=>setScreen('profile');
  document.getElementById('recipesBtn').onclick=()=>{ state.selectedDay=0; setScreen('recipes'); };
  document.getElementById('listBtn').onclick=()=>setScreen('shopping');
}

/* ----- Screen: recipes by day (with method + cook mode) ----- */
function renderRecipes(){
  const di=state.selectedDay;
  const day=state.week[di];
  const diffLabel=n=>['','Very easy','Easy','Medium','Involved','Advanced'][n]||'';
  const meals=day.meals.filter(m=>m.recipe&&!m.rejected);
  app.innerHTML=`
    <div class="card">
      <h2>Recipes by day</h2>
      <p class="sub">Pick a day to see each dish — ingredients first, then the method. Hit ▶ Cook for full-screen step-by-step mode.</p>
      <div class="day-tabs">
        ${DAYS.map((d,i)=>`<div class="day-tab ${i===di?'on':''}" data-day="${i}">${d.slice(0,3)}</div>`).join('')}
      </div>
      <h3 class="day-title" style="margin:0 0 14px">${day.day}</h3>
      ${meals.map((m,idx)=>{
        const r=m.recipe;
        if(r.isLeftover){
          return `<div class="recipe">
            <div class="rtype">${m.type}</div>
            <div class="rname">♻️ ${r.name}</div>
            <p class="list-note">${r.desc||''}. You already bought and cooked this — nothing extra to shop for. Just reheat until piping hot.</p>
            <div class="badges"><span class="badge leftover">♻️ Leftover</span>${nutriBadges(r)}</div>
          </div>`;
        }
        return `<div class="recipe">
          <div class="rtype">${m.type}</div>
          <div class="rname">${r.emoji||''} ${r.name}</div>
          <div class="rdesc">${r.desc||''}</div>
          <div class="ing-head">🧾 Ingredients ${peopleCount()>1?`<span class="hint">(for ${peopleCount()} people)</span>`:''}${r.batchNote?' <span class="hint">— double batch, half becomes tomorrow\'s lunch</span>':''}</div>
          <ul class="ing-list">
            ${r.ingredients.map(i=>`<li><span>${i.name}</span><span class="iq">${formatQty(i.qty,i.unit)}${typeof i.price==='number'?' · €'+i.price.toFixed(2):''}</span></li>`).join('')}
          </ul>
          ${(r.steps&&r.steps.length)?`<div class="ing-head">👩‍🍳 Method</div><ol class="step-list">${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`:''}
          <div class="badges">
            <span class="badge">⏱ ${r.time} min</span>
            <span class="badge diff">${diffLabel(r.difficulty)}</span>
            ${nutriBadges(r)}
          </div>
          <div class="recipe-actions">
            ${(r.steps&&r.steps.length)?`<button class="cook-btn" data-cook="${idx}">▶ Cook</button>`:''}
            <button class="ghost fav-inline ${isFavorite(r.name)?'on':''}" data-favr="${idx}" style="padding:9px 14px">${isFavorite(r.name)?'♥ Saved':'♡ Save as favorite'}</button>
          </div>
        </div>`;
      }).join('') || '<p class="sub">No meals for this day.</p>'}
      <div class="btn-row" style="margin-top:8px">
        <button class="ghost" id="backReview2">← Back to week</button>
        <button class="primary" id="toList2" style="margin-top:0">Shopping list →</button>
      </div>
    </div>`;
  app.querySelectorAll('[data-day]').forEach(t=>t.onclick=()=>{ state.selectedDay=Number(t.dataset.day); renderRecipes(); });
  app.querySelectorAll('[data-cook]').forEach(b=>b.onclick=()=>openCookMode(meals[Number(b.dataset.cook)].recipe));
  app.querySelectorAll('[data-favr]').forEach(b=>b.onclick=()=>{ toggleFavorite(meals[Number(b.dataset.favr)].recipe); renderRecipes(); });
  document.getElementById('backReview2').onclick=()=>setScreen('review');
  document.getElementById('toList2').onclick=()=>setScreen('shopping');
}

/* ----- Cook mode (full-screen, one step at a time) ----- */
function speakStep(text){
  try{
    if(!('speechSynthesis' in window))return;
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); u.rate=0.95; speechSynthesis.speak(u);
  }catch(e){}
}
function stopSpeaking(){ try{ if('speechSynthesis' in window)speechSynthesis.cancel(); }catch(e){} }
function openCookMode(recipe){
  let step=0;
  const overlay=document.createElement('div');
  overlay.className='cook-overlay cook-dark';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Cooking '+recipe.name);
  const canSpeak=('speechSynthesis' in window);
  function paint(){
    const steps=recipe.steps||[];
    overlay.innerHTML=`<div class="cook-inner">
      <div class="cook-top">
        <div class="cook-title">${recipe.emoji||''} ${recipe.name}</div>
        <button class="cook-close" title="Close" aria-label="Close cook mode">✕</button>
      </div>
      <div class="cook-progress">${steps.map((_,i)=>`<div class="cook-dot ${i<step?'done':i===step?'now':''}"></div>`).join('')}</div>
      <div class="cook-step-label">Step ${step+1} of ${steps.length}</div>
      <div class="cook-step-text">${steps[step]||''}</div>
      ${canSpeak?`<button class="cook-speak" aria-label="Read this step aloud">🔊 Read step aloud</button>`:''}
      <details class="cook-ing"><summary>🧾 Ingredients</summary>
        <ul class="ing-list" style="margin-top:8px">${recipe.ingredients.map(i=>`<li><span>${i.name}</span><span class="iq">${formatQty(i.qty,i.unit)}</span></li>`).join('')}</ul>
      </details>
      <div class="cook-nav">
        <button class="cook-prev" ${step===0?'disabled':''}>← Back</button>
        <button class="cook-next">${step===steps.length-1?'Done ✓':'Next →'}</button>
      </div>
    </div>`;
    overlay.querySelector('.cook-close').onclick=close;
    overlay.querySelector('.cook-prev').onclick=()=>{ if(step>0){step--;paint();} };
    overlay.querySelector('.cook-next').onclick=()=>{ if(step<steps.length-1){step++;paint();} else close(); };
    const sp=overlay.querySelector('.cook-speak');
    if(sp)sp.onclick=()=>speakStep(steps[step]||'');
  }
  function onKey(e){ if(e.key==='Escape')close(); if(e.key==='ArrowRight')overlay.querySelector('.cook-next').click(); if(e.key==='ArrowLeft')overlay.querySelector('.cook-prev').click(); }
  function close(){ stopSpeaking(); document.removeEventListener('keydown',onKey); overlay.remove(); }
  document.addEventListener('keydown',onKey);
  paint();
  document.body.appendChild(overlay);
}

/* ----- Screen 3: shopping list ----- */
function renderShopping(){
  const { pantry, fresh, total, anyPrice, skipped }=buildShoppingList();
  const buyOrder=['Sunday (before the week)',...DAYS];
  const freshDays=Object.keys(fresh).sort((a,b)=>buyOrder.indexOf(a)-buyOrder.indexOf(b));
  const budget=Number(state.profile?.budget)||0;
  const city=(state.profile?.city&&state.profile.city.trim())?state.profile.city.trim():'Paris';
  let totalBar='';
  if(anyPrice){
    let pill='';
    if(budget>0){ const under=total<=budget; pill=`<span class="pill ${under?'under':'over'}">${under?'within':'over'} budget (€${budget})</span>`; }
    totalBar=`<div class="total-bar">
      <div><div class="sub" style="margin:0">Estimated total · ${city}${peopleCount()>1?` · ${peopleCount()} people`:''}</div><div class="big">€${total.toFixed(2)}</div></div>
      ${pill}</div>
      <p class="sub" style="margin:0 0 14px">Prices are rough estimates and will vary by shop.</p>`;
  }
  app.innerHTML=`
    <div class="card">
      <h2>Your shopping list</h2>
      <p class="sub">Built from ${mealCount()} meals. Repeated items are added up automatically. Ticks are remembered — even if you close the page.</p>
      ${skipped?`<p class="list-note">🧺 Hiding ${skipped} item${skipped===1?'':'s'} you said ${skipped===1?'is':'are'} already in your cupboard.</p>`:''}
      ${totalBar}
      <div class="btn-row no-print" style="margin-bottom:16px">
        <button class="ghost" id="copyList">📋 Copy list</button>
        <button class="ghost" id="printList">🖨 Print / PDF</button>
      </div>
      <div class="list-col">
        <h3>🛒 Buy at the start of the week</h3>
        <p class="when">Keeps for days — pantry, dairy, frozen, sturdy veg.</p>
        ${pantry.length?renderCategories(pantry):'<p class="sub">Nothing here.</p>'}
      </div>
      <div class="list-col">
        <h3>🥬 Buy fresh — day by day</h3>
        <p class="when">Perishable, bought the day before you need it.</p>
        ${freshDays.length?freshDays.map(bd=>`<div class="buyday"><div class="head">📅 ${bd}</div>
          ${[...fresh[bd].values()].sort((a,b)=>a.name.localeCompare(b.name)).map(i=>itemRow(i)).join('')}</div>`).join(''):'<p class="sub">Nothing perishable this week.</p>'}
      </div>
      <div class="btn-row no-print">
        <button class="ghost" id="backReview">← Back to meals</button>
        <button class="ghost" id="recipesBtn2">📖 Recipes by day</button>
        <button class="primary" id="restart" style="margin-top:0">Start a new week</button>
      </div>
    </div>`;
  bindChecks();
  document.getElementById('copyList').onclick=copyListText;
  document.getElementById('printList').onclick=()=>window.print();
  document.getElementById('backReview').onclick=()=>setScreen('review');
  document.getElementById('recipesBtn2').onclick=()=>{ state.selectedDay=0; setScreen('recipes'); };
  document.getElementById('restart').onclick=()=>{ state.week=[]; state.checked={}; setScreen('profile'); };
}
function itemRow(i){
  const key=itemKey(i);
  const done=!!state.checked[key];
  const pr=(typeof i.price==='number'&&i.price>0)?`<span class="pr">€${i.price.toFixed(2)}</span>`:'<span class="pr"></span>';
  return `<label class="item ${done?'checked':''}"><input type="checkbox" data-check="${key}" ${done?'checked':''}><span class="nm">${i.name}</span>
    <span class="qty">${formatQty(i.qty,i.unit)}</span>${pr}</label>`;
}
function bindChecks(){
  app.querySelectorAll('[data-check]').forEach(cb=>{
    cb.onchange=()=>{
      const key=cb.dataset.check;
      if(cb.checked)state.checked[key]=true; else delete state.checked[key];
      cb.closest('.item').classList.toggle('checked',cb.checked);
      saveState();
    };
  });
}
function copyListText(){
  const { pantry, fresh, total, anyPrice }=buildShoppingList();
  const buyOrder=['Sunday (before the week)',...DAYS];
  let out='SHOPPING LIST\n\n— Buy at the start of the week —\n';
  const cats={}; pantry.forEach(i=>{(cats[i.category]??=[]).push(i);});
  Object.keys(cats).forEach(cat=>{
    out+=`\n${cat}:\n`;
    cats[cat].sort((a,b)=>a.name.localeCompare(b.name)).forEach(i=>{ out+=`  [ ] ${i.name} — ${formatQty(i.qty,i.unit)}\n`; });
  });
  const freshDays=Object.keys(fresh).sort((a,b)=>buyOrder.indexOf(a)-buyOrder.indexOf(b));
  if(freshDays.length){
    out+='\n— Buy fresh, day by day —\n';
    freshDays.forEach(bd=>{
      out+=`\n${bd}:\n`;
      [...fresh[bd].values()].sort((a,b)=>a.name.localeCompare(b.name)).forEach(i=>{ out+=`  [ ] ${i.name} — ${formatQty(i.qty,i.unit)}\n`; });
    });
  }
  if(anyPrice)out+=`\nEstimated total: €${total.toFixed(2)}\n`;
  navigator.clipboard.writeText(out).then(()=>{
    const t=document.createElement('div'); t.className='copied-toast'; t.textContent='✓ List copied — paste it anywhere';
    document.body.appendChild(t); setTimeout(()=>t.remove(),2200);
  }).catch(()=>alert('Could not copy — your browser blocked clipboard access.'));
}
function mealCount(){ let n=0; state.week.forEach(d=>d.meals.forEach(m=>{if(!m.rejected&&m.recipe)n++;})); return n; }
function renderCategories(items){
  const cats={}; items.forEach(i=>{(cats[i.category]??=[]).push(i);});
  const order=['Produce','Meat & Fish','Dairy','Bakery','Frozen','Pantry'];
  return Object.keys(cats).sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map(cat=>`
    <div class="cat">${cat}</div>
    ${cats[cat].sort((a,b)=>a.name.localeCompare(b.name)).map(i=>itemRow(i)).join('')}`).join('');
}
function formatQty(qty,unit){ const q=Math.round(qty*100)/100; return unit?`${q} ${unit}`:`${q}`; }

/* ============================================================
   6. BOOT — local-only by default; cloud (Supabase) when configured
   ============================================================ */
function applyBlob(s){
  state.profile = s.profile || null;
  state.week = Array.isArray(s.week) ? s.week : [];
  state.useAI = !!s.useAI;
  state.favorites = Array.isArray(s.favorites) ? s.favorites : [];
  state.checked = (s.checked && typeof s.checked==='object') ? s.checked : {};
  state.screen = state.week.length ? 'review' : 'profile';
}
async function afterSignIn(session){
  cloudUser = session.user;
  let cloudState = null;
  try { cloudState = await window.Cloud.loadState(cloudUser.id); }
  catch(e){ console.warn('Cloud load failed:', e && e.message); }
  if(cloudState){
    applyBlob(cloudState);                    // returning user: use their cloud data
  } else {
    loadState();                              // first login: migrate this browser's v1 data up
    if(state.profile || state.week.length || state.favorites.length) cloudSaveNow();
    else state.screen = 'profile';
  }
  render();
}
function startBoot(){
  if(!(window.Cloud && window.Cloud.enabled)){
    loadState(); render(); return;            // LOCAL-ONLY mode (no accounts) — original behavior
  }
  // CLOUD mode: gate everything behind a session
  window.Cloud.onAuthChange((session)=>{
    if(session){ afterSignIn(session); }
    else { cloudUser=null; state.screen='signin'; render(); }
  });
  window.Cloud.getSession()
    .then(session=>{ if(session){ afterSignIn(session); } else { state.screen='signin'; render(); } })
    .catch(e=>{ console.warn('Session check failed, local fallback:', e && e.message); loadState(); render(); });
}
function boot(){
  if(window.Cloud){ startBoot(); return; }
  let started=false;
  const go=()=>{ if(started)return; started=true; startBoot(); };
  window.addEventListener('cloud-ready', go, { once:true });
  // Safety net: if cloud.js never loads (offline/CDN blocked), fall back to local mode.
  setTimeout(()=>{ if(started)return; if(window.Cloud){ go(); } else { started=true; loadState(); render(); } }, 4000);
}
boot();
