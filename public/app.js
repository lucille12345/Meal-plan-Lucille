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
  // --- extra mains so dietary filters can't shrink the pool below 7/day (no-repeat rule, §3) ---
  {id:'b8',type:'breakfast',name:'Scrambled eggs on toast',desc:'Eggs, butter, sourdough',time:8,difficulty:1,emoji:'🍳',img:'egg',tags:['vegetarian'],kcal:410,protein:24,ingredients:[
    {name:'Eggs',qty:3,unit:'',category:'Dairy',buyDayBefore:false},{name:'Sourdough bread',qty:2,unit:'slices',category:'Bakery',buyDayBefore:true},{name:'Butter',qty:10,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Whisk and season the eggs.','Scramble gently in butter.','Serve on toasted sourdough.']},
  {id:'b9',type:'breakfast',name:'Porridge & berries',desc:'Oats, milk, berries, honey',time:8,difficulty:1,emoji:'🥣',img:'oatmeal',tags:['vegetarian'],kcal:430,protein:15,ingredients:[
    {name:'Oats',qty:60,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Milk',qty:250,unit:'ml',category:'Dairy',buyDayBefore:false},{name:'Mixed berries',qty:80,unit:'g',category:'Produce',buyDayBefore:true},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Simmer oats with milk 5 min.','Top with berries and honey.']},
  {id:'b10',type:'breakfast',name:'Cottage cheese & tomato',desc:'Cottage cheese, tomato, rye',time:5,difficulty:1,emoji:'🍅',img:'toast',tags:['vegetarian'],kcal:350,protein:26,ingredients:[
    {name:'Cottage cheese',qty:180,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Tomato',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Rye bread',qty:2,unit:'slices',category:'Bakery',buyDayBefore:true}],steps:['Spoon cottage cheese onto the rye.','Top with sliced tomato, salt and pepper.']},
  {id:'b11',type:'breakfast',name:'Banana pancakes',desc:'Banana, eggs, flour',time:14,difficulty:2,emoji:'🥞',img:'pancake',photo:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=70',tags:['vegetarian'],kcal:470,protein:18,ingredients:[
    {name:'Banana',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Eggs',qty:2,unit:'',category:'Dairy',buyDayBefore:false},{name:'Flour',qty:60,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Mash banana, whisk in eggs and flour.','Fry small pancakes 2 min a side.']},
  {id:'b12',type:'breakfast',name:'Baked eggs in tomato',desc:'Eggs, tomato, pepper, bread',time:16,difficulty:2,emoji:'🍳',img:'egg',tags:['vegetarian'],kcal:440,protein:22,ingredients:[
    {name:'Eggs',qty:2,unit:'',category:'Dairy',buyDayBefore:false},{name:'Chopped tomatoes',qty:0.5,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Bell pepper',qty:0.5,unit:'',category:'Produce',buyDayBefore:false},{name:'Bread',qty:1,unit:'slices',category:'Bakery',buyDayBefore:true}],steps:['Simmer tomato and pepper with spices.','Crack in the eggs, cover, cook 6 min.','Serve with bread.']},
  {id:'l8',type:'lunch',name:'Greek salad & pita',desc:'Feta, cucumber, olives, pita',time:10,difficulty:1,emoji:'🥗',img:'salad',tags:['vegetarian'],kcal:520,protein:19,ingredients:[
    {name:'Feta',qty:60,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Cucumber',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Olives',qty:40,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Pita bread',qty:1,unit:'',category:'Bakery',buyDayBefore:true}],steps:['Chop cucumber and tomato, add olives and feta.','Dress with olive oil; serve with warm pita.']},
  {id:'l9',type:'lunch',name:'Ham & cheese toastie',desc:'Ham, cheese, bread, salad',time:9,difficulty:1,emoji:'🥪',img:'toast',tags:[],kcal:560,protein:32,ingredients:[
    {name:'Ham',qty:80,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Cheese',qty:50,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Bread',qty:2,unit:'slices',category:'Bakery',buyDayBefore:true},{name:'Salad greens',qty:40,unit:'g',category:'Produce',buyDayBefore:true}],steps:['Build the sandwich with ham and cheese.','Toast until golden; serve with greens.']},
  {id:'l10',type:'lunch',name:'Sweet potato & chickpea bowl',desc:'Sweet potato, chickpeas, yogurt',time:25,difficulty:2,emoji:'🍠',img:'bowl',tags:['vegetarian'],kcal:590,protein:21,ingredients:[
    {name:'Sweet potato',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Chickpeas',qty:1,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Greek yogurt',qty:60,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Roast diced sweet potato and chickpeas 20 min.','Serve with a spoonful of yogurt.']},
  {id:'d8',type:'dinner',name:'Roast chicken & veg',desc:'Chicken thighs, carrot, potato',time:40,difficulty:2,emoji:'🍗',img:'chicken',tags:[],kcal:680,protein:46,ingredients:[
    {name:'Chicken thighs',qty:200,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Carrot',qty:2,unit:'',category:'Produce',buyDayBefore:false},{name:'Potato',qty:2,unit:'',category:'Produce',buyDayBefore:false}],steps:['Toss chicken and veg with oil and herbs.','Roast 35 min at 200°C, turning once.']},
  {id:'d9',type:'dinner',name:'Cod & lemon potatoes',desc:'Cod, potato, lemon, greens',time:32,difficulty:2,emoji:'🐟',img:'fish',tags:['fish'],kcal:600,protein:42,ingredients:[
    {name:'Cod fillet',qty:160,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Potato',qty:2,unit:'',category:'Produce',buyDayBefore:false},{name:'Lemon',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Green beans',qty:120,unit:'g',category:'Produce',buyDayBefore:false}],steps:['Roast sliced potato 20 min.','Add cod and lemon, roast 12 min more.','Steam the beans and serve.']},
  {id:'d10',type:'dinner',name:'Pea & lemon risotto',desc:'Rice, peas, parmesan, lemon',time:35,difficulty:3,emoji:'🍚',img:'rice',tags:['vegetarian'],kcal:640,protein:22,ingredients:[
    {name:'Risotto rice',qty:90,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Peas',qty:120,unit:'g',category:'Frozen',buyDayBefore:false},{name:'Parmesan',qty:30,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Lemon',qty:0.5,unit:'',category:'Produce',buyDayBefore:false}],steps:['Toast the rice, then add stock a ladle at a time.','Stir in peas near the end.','Finish with parmesan and lemon zest.']},
  {id:'d11',type:'dinner',name:'Turkey meatballs & pasta',desc:'Turkey mince, tomato, pasta',time:30,difficulty:2,emoji:'🍝',img:'pasta',tags:[],kcal:700,protein:45,ingredients:[
    {name:'Turkey mince',qty:150,unit:'g',category:'Meat & Fish',buyDayBefore:true},{name:'Chopped tomatoes',qty:1,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Pasta',qty:100,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Roll the mince into small meatballs and brown them.','Add tomatoes, simmer 15 min.','Serve over pasta.']},
];

/* Starters (light) & desserts — courses for lunch/dinner (§3). Kept lighter than mains. */
const STARTERS = [
  {id:'s1',type:'starter',name:'Green side salad',desc:'Leaves, cucumber, vinaigrette',time:5,difficulty:1,emoji:'🥗',img:'salad',tags:['vegetarian','vegan'],kcal:120,protein:3,ingredients:[
    {name:'Salad greens',qty:60,unit:'g',category:'Produce',buyDayBefore:true},{name:'Cucumber',qty:0.5,unit:'',category:'Produce',buyDayBefore:false},{name:'Olive oil',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Toss greens and sliced cucumber.','Dress with olive oil, salt and a splash of vinegar.']},
  {id:'s2',type:'starter',name:'Tomato bruschetta',desc:'Toast, tomato, basil',time:8,difficulty:1,emoji:'🍅',img:'bruschetta,tomato',tags:['vegetarian'],kcal:180,protein:5,ingredients:[
    {name:'Baguette',qty:2,unit:'slices',category:'Bakery',buyDayBefore:true},{name:'Tomato',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Fresh basil',qty:1,unit:'handful',category:'Produce',buyDayBefore:true}],steps:['Toast the bread.','Top with diced tomato, basil and olive oil.']},
  {id:'s3',type:'starter',name:'Carrot & ginger soup',desc:'Carrot, onion, ginger',time:20,difficulty:2,emoji:'🥕',img:'soup,carrot',tags:['vegetarian','vegan'],kcal:150,protein:4,ingredients:[
    {name:'Carrot',qty:3,unit:'',category:'Produce',buyDayBefore:false},{name:'Onion',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Ginger',qty:1,unit:'tsp',category:'Produce',buyDayBefore:false}],steps:['Soften onion and carrot.','Add water and ginger, simmer 15 min.','Blend until smooth.']},
  {id:'s4',type:'starter',name:'Melon & feta',desc:'Melon, feta, mint',time:6,difficulty:1,emoji:'🍈',img:'melon',tags:['vegetarian'],kcal:160,protein:6,ingredients:[
    {name:'Melon',qty:0.25,unit:'',category:'Produce',buyDayBefore:false},{name:'Feta',qty:30,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Cube the melon.','Crumble feta over and scatter mint.']},
  {id:'s5',type:'starter',name:'Hummus & veg sticks',desc:'Hummus, carrot, pepper',time:5,difficulty:1,emoji:'🥕',img:'hummus',tags:['vegetarian','vegan'],kcal:190,protein:6,ingredients:[
    {name:'Hummus',qty:60,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Carrot',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Bell pepper',qty:0.5,unit:'',category:'Produce',buyDayBefore:false}],steps:['Cut veg into sticks.','Serve with a bowl of hummus.']},
  {id:'s6',type:'starter',name:'Minestrone cup',desc:'Beans, veg, tomato',time:20,difficulty:2,emoji:'🍲',img:'minestrone,soup',tags:['vegetarian','vegan'],kcal:170,protein:7,ingredients:[
    {name:'Mixed veg',qty:100,unit:'g',category:'Produce',buyDayBefore:false},{name:'Cannellini beans',qty:0.5,unit:'can',category:'Pantry',buyDayBefore:false},{name:'Chopped tomatoes',qty:0.5,unit:'can',category:'Pantry',buyDayBefore:false}],steps:['Simmer veg, beans and tomato 15 min.','Season and serve small.']},
  {id:'s7',type:'starter',name:'Caprese bites',desc:'Mozzarella, tomato, basil',time:6,difficulty:1,emoji:'🍅',img:'caprese',tags:['vegetarian'],kcal:200,protein:9,ingredients:[
    {name:'Mozzarella',qty:40,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Tomato',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Fresh basil',qty:1,unit:'handful',category:'Produce',buyDayBefore:true}],steps:['Slice tomato and mozzarella.','Layer with basil, drizzle olive oil.']},
  {id:'s8',type:'starter',name:'Zucchini soup',desc:'Zucchini, onion, stock',time:20,difficulty:2,emoji:'🥣',img:'soup',tags:['vegetarian','vegan'],kcal:130,protein:4,ingredients:[
    {name:'Zucchini',qty:2,unit:'',category:'Produce',buyDayBefore:false},{name:'Onion',qty:1,unit:'',category:'Produce',buyDayBefore:false}],steps:['Soften onion and zucchini.','Add water, simmer 15 min, blend.']},
  {id:'s9',type:'starter',name:'Gazpacho',desc:'Tomato, cucumber, pepper',time:12,difficulty:1,emoji:'🍅',img:'gazpacho,soup',tags:['vegetarian','vegan'],kcal:110,protein:3,ingredients:[
    {name:'Tomato',qty:3,unit:'',category:'Produce',buyDayBefore:false},{name:'Cucumber',qty:0.5,unit:'',category:'Produce',buyDayBefore:false},{name:'Bell pepper',qty:0.5,unit:'',category:'Produce',buyDayBefore:false}],steps:['Blend the vegetables with olive oil and a splash of vinegar.','Chill and serve cold.']},
  {id:'s10',type:'starter',name:'Pea & mint soup',desc:'Peas, onion, mint',time:18,difficulty:2,emoji:'🥣',img:'soup,pea',tags:['vegetarian'],kcal:150,protein:8,ingredients:[
    {name:'Peas',qty:150,unit:'g',category:'Frozen',buyDayBefore:false},{name:'Onion',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Fresh mint',qty:1,unit:'handful',category:'Produce',buyDayBefore:true}],steps:['Soften onion, add peas and water.','Simmer 8 min, blend with mint.']},
  {id:'s11',type:'starter',name:'Garlic bread',desc:'Baguette, garlic, butter',time:10,difficulty:1,emoji:'🧄',img:'garlic,bread',photo:'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?auto=format&fit=crop&w=600&q=70',tags:['vegetarian'],kcal:210,protein:5,ingredients:[
    {name:'Baguette',qty:3,unit:'slices',category:'Bakery',buyDayBefore:true},{name:'Garlic',qty:1,unit:'clove',category:'Produce',buyDayBefore:false},{name:'Butter',qty:15,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Mix soft butter with crushed garlic.','Spread on bread and toast until golden.']},
  {id:'s12',type:'starter',name:'Roasted beet salad',desc:'Beetroot, leaves, feta',time:15,difficulty:1,emoji:'🥗',img:'beet,salad',tags:['vegetarian'],kcal:180,protein:6,ingredients:[
    {name:'Cooked beetroot',qty:120,unit:'g',category:'Produce',buyDayBefore:false},{name:'Salad greens',qty:50,unit:'g',category:'Produce',buyDayBefore:true},{name:'Feta',qty:25,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Slice beetroot over the greens.','Crumble feta and dress with olive oil.']},
  {id:'s13',type:'starter',name:'Stuffed tomatoes',desc:'Tomato, rice, herbs',time:22,difficulty:2,emoji:'🍅',img:'stuffed,tomato',tags:['vegetarian','vegan'],kcal:190,protein:5,ingredients:[
    {name:'Tomato',qty:2,unit:'',category:'Produce',buyDayBefore:false},{name:'Rice',qty:40,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Hollow the tomatoes, fill with cooked herby rice.','Bake 15 min.']},
  {id:'s14',type:'starter',name:'Corn on the cob',desc:'Corn, butter, salt',time:12,difficulty:1,emoji:'🌽',img:'corn',photo:'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=70',tags:['vegetarian'],kcal:170,protein:5,ingredients:[
    {name:'Corn cob',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Butter',qty:10,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Boil the corn 8 min.','Brush with butter and season.']},
  // --- extra starters: lunch AND dinner can each take one, so the pool needs slack for
  //     dietary filtering (14 slots/week at most) — keeps the no-repeat rule honest.
  {id:'s15',type:'starter',name:'Cucumber & dill salad',desc:'Cucumber, dill, vinegar',time:6,difficulty:1,emoji:'🥒',img:'salad',tags:['vegetarian','vegan'],kcal:90,protein:2,ingredients:[
    {name:'Cucumber',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Fresh dill',qty:1,unit:'handful',category:'Produce',buyDayBefore:true}],steps:['Slice cucumber thinly.','Toss with dill, vinegar and a pinch of sugar.']},
  {id:'s16',type:'starter',name:'Roasted pepper soup',desc:'Peppers, onion, paprika',time:22,difficulty:2,emoji:'🌶',img:'soup',tags:['vegetarian','vegan'],kcal:140,protein:3,ingredients:[
    {name:'Bell pepper',qty:2,unit:'',category:'Produce',buyDayBefore:false},{name:'Onion',qty:1,unit:'',category:'Produce',buyDayBefore:false}],steps:['Roast peppers and onion 15 min.','Blend with water and paprika.']},
  {id:'s17',type:'starter',name:'Olives & crudités',desc:'Olives, celery, radish',time:5,difficulty:1,emoji:'🫒',img:'olive',tags:['vegetarian','vegan'],kcal:130,protein:2,ingredients:[
    {name:'Olives',qty:60,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Celery',qty:2,unit:'sticks',category:'Produce',buyDayBefore:false},{name:'Radish',qty:4,unit:'',category:'Produce',buyDayBefore:true}],steps:['Arrange olives and cut vegetables on a plate.']},
  {id:'s18',type:'starter',name:'Lentil & herb salad',desc:'Lentils, parsley, lemon',time:12,difficulty:1,emoji:'🥗',img:'lentil',tags:['vegetarian','vegan'],kcal:190,protein:11,ingredients:[
    {name:'Cooked lentils',qty:120,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Parsley',qty:1,unit:'handful',category:'Produce',buyDayBefore:true},{name:'Lemon',qty:0.5,unit:'',category:'Produce',buyDayBefore:false}],steps:['Toss lentils with chopped parsley.','Dress with lemon and olive oil.']},
  {id:'s19',type:'starter',name:'Grilled asparagus',desc:'Asparagus, oil, lemon',time:10,difficulty:1,emoji:'🌿',img:'asparagus',tags:['vegetarian','vegan'],kcal:110,protein:4,ingredients:[
    {name:'Asparagus',qty:150,unit:'g',category:'Produce',buyDayBefore:true},{name:'Lemon',qty:0.5,unit:'',category:'Produce',buyDayBefore:false}],steps:['Griddle asparagus 5 min, turning.','Finish with lemon and sea salt.']},
  {id:'s20',type:'starter',name:'Watermelon & mint',desc:'Watermelon, mint, lime',time:5,difficulty:1,emoji:'🍉',img:'melon',photo:'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=70',tags:['vegetarian','vegan'],kcal:100,protein:2,ingredients:[
    {name:'Watermelon',qty:250,unit:'g',category:'Produce',buyDayBefore:true},{name:'Fresh mint',qty:1,unit:'handful',category:'Produce',buyDayBefore:true}],steps:['Cube the watermelon.','Scatter mint and squeeze over lime.']},
  {id:'s21',type:'starter',name:'Butternut soup',desc:'Squash, onion, stock',time:25,difficulty:2,emoji:'🎃',img:'soup',tags:['vegetarian','vegan'],kcal:160,protein:4,ingredients:[
    {name:'Butternut squash',qty:250,unit:'g',category:'Produce',buyDayBefore:false},{name:'Onion',qty:1,unit:'',category:'Produce',buyDayBefore:false}],steps:['Soften onion, add squash and water.','Simmer 18 min, then blend.']},
  {id:'s22',type:'starter',name:'Avocado on rye',desc:'Avocado, rye, chilli',time:6,difficulty:1,emoji:'🥑',img:'avocado',tags:['vegetarian','vegan'],kcal:210,protein:5,ingredients:[
    {name:'Avocado',qty:0.5,unit:'',category:'Produce',buyDayBefore:true},{name:'Rye bread',qty:1,unit:'slices',category:'Bakery',buyDayBefore:true}],steps:['Mash avocado onto the rye.','Season with chilli flakes and salt.']},
];
const DESSERTS = [
  {id:'x1',type:'dessert',name:'Fresh fruit salad',desc:'Seasonal fruit, mint',time:6,difficulty:1,emoji:'🍓',img:'fruit,salad',tags:['vegetarian','vegan'],kcal:120,protein:2,ingredients:[
    {name:'Mixed fruit',qty:200,unit:'g',category:'Produce',buyDayBefore:true}],steps:['Chop the fruit.','Toss with a little mint and lemon.']},
  {id:'x2',type:'dessert',name:'Yogurt & honey',desc:'Greek yogurt, honey',time:3,difficulty:1,emoji:'🍯',img:'yogurt',tags:['vegetarian'],kcal:170,protein:10,ingredients:[
    {name:'Greek yogurt',qty:150,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Spoon yogurt into a bowl.','Drizzle with honey.']},
  {id:'x3',type:'dessert',name:'Dark chocolate & clementine',desc:'Chocolate square, clementine',time:2,difficulty:1,emoji:'🍫',img:'chocolate',photo:'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=600&q=70',tags:['vegetarian'],kcal:150,protein:2,ingredients:[
    {name:'Dark chocolate',qty:20,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Clementine',qty:1,unit:'',category:'Produce',buyDayBefore:false}],steps:['Enjoy the chocolate with a peeled clementine.']},
  {id:'x4',type:'dessert',name:'Baked cinnamon apple',desc:'Apple, cinnamon, oats',time:20,difficulty:1,emoji:'🍎',img:'baked,apple',tags:['vegetarian','vegan'],kcal:160,protein:2,ingredients:[
    {name:'Apple',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Oats',qty:20,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Core the apple, fill with oats and cinnamon.','Bake 18 min at 180°C.']},
  {id:'x5',type:'dessert',name:'Berries & cream',desc:'Berries, whipped cream',time:4,difficulty:1,emoji:'🫐',img:'berries',tags:['vegetarian'],kcal:180,protein:3,ingredients:[
    {name:'Mixed berries',qty:120,unit:'g',category:'Produce',buyDayBefore:true},{name:'Cream',qty:40,unit:'ml',category:'Dairy',buyDayBefore:false}],steps:['Spoon berries into a glass.','Top with a little whipped cream.']},
  {id:'x6',type:'dessert',name:'Lemon sorbet',desc:'Lemon sorbet, mint',time:2,difficulty:1,emoji:'🍋',img:'sorbet,lemon',tags:['vegetarian','vegan'],kcal:130,protein:0,ingredients:[
    {name:'Lemon sorbet',qty:2,unit:'scoops',category:'Frozen',buyDayBefore:false}],steps:['Scoop sorbet into a bowl.','Garnish with mint.']},
  {id:'x7',type:'dessert',name:'Poached pear',desc:'Pear, honey, spice',time:18,difficulty:2,emoji:'🍐',img:'pear',tags:['vegetarian','vegan'],kcal:150,protein:1,ingredients:[
    {name:'Pear',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Simmer the pear in water with honey and spice 15 min.','Serve warm.']},
  {id:'x8',type:'dessert',name:'Cheese & grapes',desc:'Cheese, grapes, cracker',time:3,difficulty:1,emoji:'🧀',img:'cheese',photo:'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=600&q=70',tags:['vegetarian'],kcal:210,protein:8,ingredients:[
    {name:'Cheese',qty:30,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Grapes',qty:80,unit:'g',category:'Produce',buyDayBefore:true},{name:'Crackers',qty:2,unit:'',category:'Bakery',buyDayBefore:false}],steps:['Plate cheese with grapes and a couple of crackers.']},
  {id:'x9',type:'dessert',name:'Rice pudding',desc:'Rice, milk, cinnamon',time:22,difficulty:2,emoji:'🍚',img:'rice,pudding',tags:['vegetarian'],kcal:220,protein:7,ingredients:[
    {name:'Rice',qty:40,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Milk',qty:200,unit:'ml',category:'Dairy',buyDayBefore:false}],steps:['Simmer rice in milk 18 min, stirring.','Sweeten and dust with cinnamon.']},
  {id:'x10',type:'dessert',name:'Grilled peach & honey',desc:'Peach, honey',time:8,difficulty:1,emoji:'🍑',img:'peach',tags:['vegetarian','vegan'],kcal:130,protein:1,ingredients:[
    {name:'Peach',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Halve the peach, grill cut-side down 3 min.','Drizzle with honey.']},
  {id:'x11',type:'dessert',name:'Orange & cinnamon',desc:'Orange, cinnamon',time:4,difficulty:1,emoji:'🍊',img:'orange',photo:'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=600&q=70',tags:['vegetarian','vegan'],kcal:90,protein:2,ingredients:[
    {name:'Orange',qty:1,unit:'',category:'Produce',buyDayBefore:false}],steps:['Slice the orange onto a plate.','Dust lightly with cinnamon.']},
  {id:'x12',type:'dessert',name:'Vanilla yogurt & granola',desc:'Yogurt, granola',time:3,difficulty:1,emoji:'🥣',img:'yogurt,granola',tags:['vegetarian'],kcal:200,protein:9,ingredients:[
    {name:'Vanilla yogurt',qty:150,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Granola',qty:30,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Spoon yogurt into a glass.','Top with a little granola.']},
  {id:'x13',type:'dessert',name:'Mango sorbet',desc:'Mango sorbet',time:2,difficulty:1,emoji:'🥭',img:'sorbet,mango',tags:['vegetarian','vegan'],kcal:140,protein:0,ingredients:[
    {name:'Mango sorbet',qty:2,unit:'scoops',category:'Frozen',buyDayBefore:false}],steps:['Scoop sorbet into a bowl and serve.']},
  {id:'x14',type:'dessert',name:'Chocolate mousse',desc:'Chocolate, egg',time:15,difficulty:3,emoji:'🍫',img:'chocolate,mousse',photo:'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&w=600&q=70',tags:['vegetarian'],kcal:230,protein:6,ingredients:[
    {name:'Dark chocolate',qty:40,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Eggs',qty:1,unit:'',category:'Dairy',buyDayBefore:false}],steps:['Melt chocolate, fold into whisked egg white.','Chill 1 hour before serving.']},
  // --- extra desserts: same reason as the starters above (up to 14 slots a week).
  {id:'x15',type:'dessert',name:'Apple compote',desc:'Apple, cinnamon',time:15,difficulty:1,emoji:'🍎',img:'apple',photo:'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=600&q=70',tags:['vegetarian','vegan'],kcal:120,protein:1,ingredients:[
    {name:'Apple',qty:2,unit:'',category:'Produce',buyDayBefore:false}],steps:['Simmer chopped apple with a splash of water 12 min.','Stir in cinnamon; serve warm or cold.']},
  {id:'x16',type:'dessert',name:'Strawberries & balsamic',desc:'Strawberries, balsamic',time:5,difficulty:1,emoji:'🍓',img:'berries',tags:['vegetarian','vegan'],kcal:110,protein:1,ingredients:[
    {name:'Strawberries',qty:150,unit:'g',category:'Produce',buyDayBefore:true}],steps:['Halve the strawberries.','Drizzle with a little balsamic and let sit 5 min.']},
  {id:'x17',type:'dessert',name:'Frozen grapes',desc:'Grapes, straight from the freezer',time:3,difficulty:1,emoji:'🍇',img:'grapes',photo:'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=70',tags:['vegetarian','vegan'],kcal:100,protein:1,ingredients:[
    {name:'Grapes',qty:150,unit:'g',category:'Produce',buyDayBefore:true}],steps:['Freeze the grapes ahead of time.','Serve straight from the freezer.']},
  {id:'x18',type:'dessert',name:'Pineapple carpaccio',desc:'Pineapple, lime, mint',time:8,difficulty:1,emoji:'🍍',img:'pineapple',photo:'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=600&q=70',tags:['vegetarian','vegan'],kcal:120,protein:1,ingredients:[
    {name:'Pineapple',qty:200,unit:'g',category:'Produce',buyDayBefore:true},{name:'Fresh mint',qty:1,unit:'handful',category:'Produce',buyDayBefore:true}],steps:['Slice the pineapple very thinly.','Finish with lime zest and mint.']},
  {id:'x19',type:'dessert',name:'Coconut rice pudding',desc:'Rice, coconut milk',time:22,difficulty:2,emoji:'🥥',img:'rice,pudding',tags:['vegetarian','vegan'],kcal:230,protein:4,ingredients:[
    {name:'Rice',qty:40,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Coconut milk',qty:200,unit:'ml',category:'Pantry',buyDayBefore:false}],steps:['Simmer rice in coconut milk 18 min.','Sweeten to taste and serve warm.']},
  {id:'x20',type:'dessert',name:'Blueberry oat crumble',desc:'Blueberries, oats, honey',time:20,difficulty:2,emoji:'🫐',img:'berries',tags:['vegetarian'],kcal:210,protein:4,ingredients:[
    {name:'Blueberries',qty:120,unit:'g',category:'Produce',buyDayBefore:true},{name:'Oats',qty:30,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Top the berries with oats and honey.','Bake 15 min until bubbling.']},
  {id:'x21',type:'dessert',name:'Roasted plums',desc:'Plums, honey, vanilla',time:18,difficulty:1,emoji:'🍑',img:'plum',tags:['vegetarian','vegan'],kcal:130,protein:1,ingredients:[
    {name:'Plums',qty:3,unit:'',category:'Produce',buyDayBefore:true},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Halve the plums, drizzle with honey.','Roast 15 min at 190°C.']},
  {id:'x22',type:'dessert',name:'Figs & honey',desc:'Fresh figs, honey',time:4,difficulty:1,emoji:'🍯',img:'fig',tags:['vegetarian','vegan'],kcal:150,protein:2,ingredients:[
    {name:'Figs',qty:3,unit:'',category:'Produce',buyDayBefore:true},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Quarter the figs.','Drizzle generously with honey.']},
];
// Which courses a lunch/dinner gets, driven by goal & appetite (§3.1). 'main' is always present.
function coursesForGoal(goal){
  if(goal==='gain') return ['starter','main','dessert'];   // Get stronger → all three
  if(goal==='lose') return ['main','dessert'];             // Feel light → main + light/fruit dessert
  return ['starter','main'];                               // Stay balanced → main + one side
}
const COURSE_LABEL = { starter:'Starter', main:'Main', dessert:'Dessert', single:'' };

/* ============================================================
   2. STATE
   ============================================================ */
// `screen` is now only: landing | signin | profile | loading | review.
// 'review' IS the one-page planner (§2) — the old separate 'recipes' and 'shopping'
// screens were merged into it: shopping is the second tab, recipes are a detail overlay.
const state = { screen:'profile', profile:null, week:[], usedFallback:false, selectedDay:0,
  useAI:false, favorites:[], checked:{}, plannerTab:'plan',   // plannerTab: 'plan' | 'shop'
  // §0.7 "Add a dish I love" — dishes the user researched into their own database.
  // Only `verified:true` ones (allergens confirmed by the user) ever reach generation.
  userDishes:[], researchCallsToday:{ date:'', n:0 },
  // §4 browse filters — ephemeral (not persisted): saved is a toggle, the rest are checklists.
  browseFilters:{ saved:false, dietary:[], ingredient:[], mealType:[] },
  pickMode:null };   // V4 §7: {di,mi} while the user is choosing a replacement for a held slot
// Where to reach the backend:
//  - opened as a local file (double-click) → talk to the local Node server on :8787
//  - served over http(s) (local `node server.js`, or hosted on Render) → same origin, no host needed
const BACKEND_URL = location.protocol === 'file:' ? 'http://localhost:8787' : '';
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DISLIKE_OPTIONS = ['Fish','Beef','Chicken','Pork','Mushrooms','Eggs','Onion','Spicy food','Cheese'];
const ALLERGY_OPTIONS = ['Nuts','Dairy','Gluten','Shellfish','Soy'];
const PANTRY_OPTIONS = ['Salt','Pepper','Olive oil','Cooking oil','Butter','Flour','Sugar','Rice','Pasta','Onion','Garlic','Soy sauce','Honey','Spices'];
// Questionnaire v2 (§6): friendly taste + cuisine choices.
const CUISINE_OPTIONS = [
  {v:'French',emoji:'🇫🇷'},{v:'Italian',emoji:'🇮🇹'},{v:'Asian',emoji:'🥢'},
  {v:'Mexican',emoji:'🌶'},{v:'Middle-Eastern',emoji:'🧆'},{v:'Surprise me',emoji:'✨'},
];
const BREAKFAST_OPTIONS = [
  {v:'sweet',label:'🥐 Sweet'},{v:'savory',label:'🍳 Savory'},{v:'surprise',label:'✨ Surprise me'},
];
// The three friendly goal cards map 1:1 to the stable internal keys (never shown in UI).
const GOAL_CARDS = [
  {key:'lose',    emoji:'🍃', title:'Feel light',   sub:'lighter, fresher plates'},
  {key:'maintain',emoji:'⚖️', title:'Stay balanced', sub:'steady & satisfying'},
  {key:'gain',    emoji:'💪', title:'Get stronger',  sub:'fuller, protein-rich'},
];
const DEFAULT_SPLIT = { breakfast:25, lunch:40, dinner:35 };   // per-meal kcal % (§6.7)

/* ---- persistence (localStorage + optional Supabase cloud) ---- */
const STORAGE_KEY = 'mealPlannerState';
let cloudUser = null;                       // set once signed in (cloud mode only)
function saveState(){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile: state.profile, week: state.week,
    useAI: state.useAI, favorites: state.favorites, checked: state.checked,
    userDishes: state.userDishes, researchCallsToday: state.researchCallsToday })); }
  catch(e){ console.warn('Could not save progress:', e.message); }
  cloudSave();                              // also push to Supabase when signed in (debounced)
}
function cloudEnabled(){ return !!(window.Cloud && window.Cloud.enabled && cloudUser); }
function currentBlob(){ return { profile: state.profile, week: state.week, useAI: state.useAI,
  favorites: state.favorites, checked: state.checked, userDishes: state.userDishes }; }
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
      state.profile = migrateProfile(saved.profile) || null;
      state.week = Array.isArray(saved.week) ? saved.week : [];
      state.useAI = !!saved.useAI;
      state.favorites = Array.isArray(saved.favorites) ? saved.favorites : [];
      state.checked = (saved.checked && typeof saved.checked === 'object') ? saved.checked : {};
      state.userDishes = Array.isArray(saved.userDishes) ? saved.userDishes : [];
      state.researchCallsToday = (saved.researchCallsToday && typeof saved.researchCallsToday === 'object')
        ? saved.researchCallsToday : { date:'', n:0 };
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
  state.userDishes = [];
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
/* ---- per-meal kcal split (§6.7): user-adjustable %, normalized so any mix works ---- */
function mealSplitOf(p){
  const s=(p&&p.mealSplit)||DEFAULT_SPLIT;
  const b=Number(s.breakfast)||0, l=Number(s.lunch)||0, d=Number(s.dinner)||0;
  return (b+l+d)>0 ? {breakfast:b,lunch:l,dinner:d} : {...DEFAULT_SPLIT};
}
function computeMealTargets(p){
  const t=computeTargets(p); if(!t) return null;
  const s=mealSplitOf(p); const sum=s.breakfast+s.lunch+s.dinner;
  const per=m=>Math.round(t.kcal*s[m]/sum/10)*10;
  return { breakfast:per('breakfast'), lunch:per('lunch'), dinner:per('dinner') };
}
// UI never shows clinical words — this maps the internal goal key to friendly copy.
function goalWord(goal){ return {lose:'feeling light',maintain:'balanced',gain:'getting stronger'}[goal]||'balanced'; }

/* ---- keep older saved profiles working as fields are added (§4 budget migration) ---- */
function migrateProfile(p){
  if(!p||typeof p!=='object') return p;
  if(p.budgetPerDay==null && p.budget!=null && p.budget!==''){
    const w=Number(p.budget); if(isFinite(w)&&w>0) p.budgetPerDay=Math.max(1,Math.round(w/7));
  }
  if(!p.mealSplit) p.mealSplit={...DEFAULT_SPLIT};
  if(!p.breakfastPref) p.breakfastPref='surprise';
  if(!Array.isArray(p.cuisines)) p.cuisines=[];
  return p;
}

/* ---- pantry staples: skip what the user already owns ----
   Plain substring matching has one real failure mode: a few pantry staples share a word with
   an UNRELATED ingredient — a compound name where the word is a false-positive substring, not
   the same product. Ticking "Pepper" (the spice) must not hide "Red bell pepper" (a vegetable);
   "Rice" must not hide "Rice wine"; "Onion" must not hide "Spring onions"; "Flour" must not hide
   "Large flour tortilla". These are listed explicitly rather than guessed at generically —
   whole-word tokenizing does NOT fix this (the word "pepper" IS one of the words in "bell
   pepper"), so the exclusion has to name the specific compounds it must not match. */
const PANTRY_FALSE_MATCHES = {
  pepper: /bell pepper|pepper flakes|jalape[nñ]o pepper/,
  rice:   /rice wine|rice noodle|rice paper/,
  onion:  /spring onion|onion powder/,
  flour:  /flour tortilla/,
  garlic: /garlic powder/,
};
function pantryHas(name){
  const list=state.profile?.pantry||[]; if(!list.length)return false;
  const n=name.toLowerCase();
  return list.some(term=>{
    const t=term.toLowerCase();
    const exclude=PANTRY_FALSE_MATCHES[t];
    if(exclude&&exclude.test(n))return false;
    return n.includes(t)||t.includes(n);
  });
}

/* ---- "cook once, eat twice": turn some lunches into leftovers of the prior dinner ---- */
function applyLeftovers(week){
  for(const di of [1,3,5]){
    if(di>=week.length)continue;
    const prevDay=week[di-1];
    const dinnerMain=prevDay.meals.find(m=>m.type==='dinner'&&m.course==='main');
    if(!dinnerMain||!dinnerMain.recipe)continue;
    const d=dinnerMain.recipe;
    // cook double at last night's dinner main so half becomes today's lunch (buy 2× ingredients)
    d.ingredients=(d.ingredients||[]).map(i=>({...i, qty:i.qty*2,
      ...(typeof i.price==='number'?{price:i.price*2}:{})}));
    d.batchNote=true;
    const leftover={ type:'lunch', course:'main', rejected:false, recipe:{
      ...d, id:'lo'+(nextId++), type:'lunch', name:'Leftover '+d.name,
      desc:'From '+prevDay.day+' night — just reheat', isLeftover:true, batchNote:false,
      ingredients:(d.ingredients||[]).map(i=>({...i})),   // kept for display only; not bought again
      steps:['Reheat the leftovers from '+prevDay.day+' until piping hot.'] }};
    // a reheated lunch is one dish — drop that day's lunch starter/dessert
    week[di].meals=week[di].meals.filter(m=>m.type!=='lunch');
    const dIdx=week[di].meals.findIndex(m=>m.type==='dinner');
    if(dIdx===-1) week[di].meals.push(leftover); else week[di].meals.splice(dIdx,0,leftover);
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
    // `sourceId` remembers where the copy came from so `isCurated()`/`isUserDish()` keep working
    // on it — the pool dedupe drops the original (see `eligibleRecipes`), so without this a
    // favourited curated dish would silently stop counting as curated for §0's precedence rule.
    const base = { ...recipe, id:'fav'+Date.now(), sourceId:recipe.sourceId||recipe.id,
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
// The curated database (§0 of docs/V3-REDESIGN-BRIEF.md) — primary source of dishes.
// A function, not a frozen array: §0.7 (user-researched dishes) appends to the effective
// pool later, and callers must see that without re-reading this file.
// §0.7.7: user-researched dishes join the pool in EXACTLY this one place, so every downstream
// consumer (generation, browse carousels, findBrowseRecipe, filters) picks them up unchanged.
// Only `verified` ones — a dish whose allergens the user hasn't confirmed must never be picked.
function DB(){
  const shipped = (typeof RECIPES_DB !== 'undefined') ? RECIPES_DB : [];
  const mine = (state.userDishes || []).filter(d => d && d.verified);
  return mine.length ? [...shipped, ...mine] : shipped;
}
// Provenance reads `sourceId` when present: a favourite is a re-scaled COPY under a `fav<ts>` id,
// and it is the copy that survives the pool dedupe, so it must still answer these honestly.
const dishOrigin = r => String(r?.sourceId ?? r?.id ?? '');
const isUserDish = r => dishOrigin(r).startsWith('user-');
const dishRoles = r => r.types || [r.type];      // legacy pool dishes only have .type
const isCurated = r => dishOrigin(r).startsWith('db-');

// Shelved in the Dairy aisle but carrying no dairy allergen. Plant "milks" are the common
// trap: a dairy-allergic person is often steered TOWARDS oat/almond/soy milk, so excluding
// their dishes is exactly backwards. (Their own allergens — nuts, soy — are caught by the
// nut and soy rules, so nothing is waved through here.)
// Egg matching is deliberately narrow — a loose /\begg/ would wave through "Eggnog", which is
// very much dairy. A dish with eggs AND milk is still excluded: the milk is its own ingredient
// row and does not match, so only the egg row is exempted.
const DAIRY_AISLE_NON_DAIRY = new RegExp([
  '^(?:large |medium |small |free[- ]range |organic |fresh )*eggs?(?: whites?| yolks?)?$',
  '^(?:almond|soy|soya|oat|rice|coconut|cashew|hemp) (?:milk|cream|yogurt|yoghurt)$',
  'dairy[- ]free', '^vegan ',
].join('|'), 'i');
function maxDifficultyFor(l){ if(l<=3)return 2; if(l<=6)return 3; if(l<=8)return 4; return 5; }
function maxTimeFor(s){ return {student:25,working:30,parent:40,flexible:999}[s] ?? 999; }
function passesDietFilters(recipe, profile){
  const dislikes=profile.dislikes.map(d=>d.toLowerCase());
  const allergies=profile.allergies.map(a=>a.toLowerCase());
  for(const ing of recipe.ingredients){
    const n=ing.name.toLowerCase();
    if(dislikes.some(d=>n.includes(d.replace(' food',''))))return false;
  }
  // An explicit allergen list always gets to VETO a dish.
  if(Array.isArray(recipe.contains)&&allergies.some(a=>recipe.contains.includes(a)))return false;
  // But only a REVIEWED list gets to clear one. Shipped dishes were checked by hand and a
  // §0.7 user dish had its allergens confirmed by the person who'll eat it, so for those
  // contains[] is the whole answer (§00.5 rule 2) and the guesses below are skipped — they
  // miss things like "Baguette" or "Soy sauce". A model-written list on an AI top-up dish is
  // neither reviewed nor confirmed, so it falls through for a second opinion.
  if(Array.isArray(recipe.contains)&&(isCurated(recipe)||(isUserDish(recipe)&&recipe.verified)))return true;
  if(allergies.includes('fish')&&recipe.tags.includes('fish'))return false;
  if(allergies.includes('shellfish')&&/shrimp|prawn|crab/.test(recipe.name.toLowerCase()))return false;
  // `category` is the SUPERMARKET AISLE, not an allergen — the Dairy aisle also holds eggs and
  // almond milk, and reading it as "contains dairy" threw away perfectly safe dishes. Same
  // shape of fix as PANTRY_FALSE_MATCHES: name the things shelved there that aren't dairy.
  if(allergies.includes('dairy')&&recipe.ingredients.some(i=>i.category==='Dairy'&&!DAIRY_AISLE_NON_DAIRY.test(i.name)))return false;
  // The gluten list below is deliberately over-inclusive: this path only ever runs for dishes
  // with no honest contains[] to consult (the legacy pool and AI top-ups), so it must fail
  // closed (§00.4). `baguette`, `cracker` and `savoiardi` were verified leaks — legacy
  // "Tomato bruschetta", "Garlic bread" and "Cheese & grapes" all reached a gluten-allergic
  // user before this. `freeFrom` is the one exception that must be honoured: an ingredient
  // that says "gluten-free bread" is safe, and matching `bread` inside it would wrongly
  // reject a dish that was chosen precisely because it is gluten-free.
  const freeFrom=(n,what)=>new RegExp(what+'[\\s-]?free','i').test(n);
  if(allergies.includes('gluten')&&recipe.ingredients.some(i=>{const n=i.name.toLowerCase();
    return !freeFrom(n,'gluten')&&/bread|pasta|tortilla|pizza|granola|oats|noodle|couscous|bagel|pita|muesli|flour|bun|baguette|spaghetti|savoiardi|ladyfinger|crouton|cracker|brioche|croissant|panko|breadcrumb|focaccia|ciabatta|pastry|filo|semolina|barley|wonton|cake|biscuit|cookie|pancake|waffle|crepe/.test(n);}))return false;
  if(allergies.includes('nuts')&&recipe.ingredients.some(i=>/peanut|almond|\bnut/.test(i.name.toLowerCase())))return false;
  // There was no soy rule at all (§0.2) — legacy "Beef stir-fry" carries Soy sauce and was
  // served to anyone who ticked Soy. Soy sauce also carries gluten, hence its listing above.
  if(allergies.includes('soy')&&recipe.ingredients.some(i=>/\bsoy|tofu|edamame|miso|tempeh|teriyaki/.test(i.name.toLowerCase())))return false;
  return true;
}
// `role` is breakfast|lunch|dinner|starter|dessert. Starters/desserts have their own pools.
function eligibleRecipes(role,profile){
  const seen=new Set();
  // Dedupe by NAME, not id. A favourite is a re-scaled copy under a fresh `fav<ts>` id, so an id
  // dedupe never merged it with its source and the pool held the same dish twice (§0.2). Name is
  // already this app's dish identity — `isFavorite()`, `toggleFavorite()` and the no-repeat rule
  // in `pickMeal()`/`enforceNoRepeat()` all key on it — so it is the key that actually merges.
  // FAVOURITES COME FIRST so the copy wins the dedupe: it carries the user's per-person base
  // quantities and the `fav` id that `pickMeal()` boosts on, and `sourceId` preserves its
  // provenance for `preferCurated()`. Curated then beats legacy on the two shipped duplicate
  // names ("Banana pancakes", "Tomato bruschetta"), which is the precedence §0 already wants.
  const pool=[...state.favorites, ...DB(), ...RECIPES, ...STARTERS, ...DESSERTS]
    .filter(r=>{ const k=r&&r.name&&r.name.toLowerCase(); return k && !seen.has(k) && seen.add(k); });
  const base=pool.filter(r=>dishRoles(r).includes(role)&&passesDietFilters(r,profile));
  const maxDiff=maxDifficultyFor(profile.cookingLevel);
  const maxTime=Number(profile.timePerMeal)>0 ? Number(profile.timePerMeal) : maxTimeFor(profile.lifeStage);
  const strict=base.filter(r=>r.difficulty<=maxDiff&&r.time<=maxTime);
  return strict.length?strict:base;
}
// §0 + §0.7.7 precedence: THE DATABASE COMES FIRST — and "the database" means the shipped
// dishes AND the user's own verified ones, which is what DB() returns. `isCurated()` keeps
// its narrower "shipped and reviewed" meaning on purpose (§0.7.4 relies on it), so the
// preference test is deliberately the wider one: without this, a user's own dish could never
// be picked while any shipped dish remained eligible.
const preferCurated = list => {
  const c = list.filter(r => isCurated(r) || isUserDish(r));
  return c.length ? c : list;
};
// usedNames (lowercased dish names) enforces the hard "no dish twice a week" rule (§3) across ALL types.
function pickMeal(type,profile,usedIds,usedNames){
  const pool=eligibleRecipes(type,profile);
  const nameFree=r=>!usedNames||!usedNames.has(r.name.toLowerCase());
  // prefer recipes that are both unused-this-type AND name-unique across the whole week
  let choices=pool.filter(r=>!usedIds.has(r.id)&&nameFree(r));
  if(!choices.length)choices=pool.filter(nameFree);      // relax the per-type constraint first
  if(!choices.length)choices=pool.filter(r=>!usedIds.has(r.id));
  if(!choices.length)choices=pool;
  if(!choices.length)return null;
  // favorites get first pick when available; otherwise curated database dishes are preferred
  // over the legacy pool (§0 precedence rule: the database always comes before Gemini/legacy).
  const favFresh=choices.filter(r=>String(r.id).startsWith('fav'));
  const from=(favFresh.length&&Math.random()<0.5)?favFresh:preferCurated(choices);
  return from[Math.floor(Math.random()*from.length)];
}
function scaleRecipe(r,n){
  if(!r||n===1)return r?{...r,ingredients:(r.ingredients||[]).map(i=>({...i}))}:r;
  return {...r, ingredients:(r.ingredients||[]).map(i=>({ ...i, qty:i.qty*n,
    ...(typeof i.price==='number' ? {price:i.price*n} : {}) }))};
}
function generateWeek(profile){
  const n=Math.max(1,Number(profile.people)||1);
  const week=[];
  const used={breakfast:new Set(),lunch:new Set(),dinner:new Set(),starter:new Set(),dessert:new Set()};
  const usedNames=new Set();
  const courses=coursesForGoal(profile.goal);
  const addSlot=(meals,mealType,course)=>{
    // starters/desserts pick from their own pool; 'main' picks from the meal-type pool
    const role=course==='main'?mealType:course;
    const r=pickMeal(role,profile,used[role],usedNames);
    if(r){ used[role].add(r.id); usedNames.add(r.name.toLowerCase()); }
    meals.push({type:mealType,course,recipe:scaleRecipe(r,n),rejected:false});
  };
  for(const day of DAYS){
    const meals=[];
    addSlot(meals,'breakfast','main');              // breakfast stays single
    for(const mealType of ['lunch','dinner']) for(const course of courses) addSlot(meals,mealType,course);
    week.push({day,meals});
  }
  return enforceNoRepeat(week,profile);
}
/* ---- post-validate: replace any duplicate dish name with an unused eligible one (§3 "no doubles") ---- */
function enforceNoRepeat(week,profile){
  const n=Math.max(1,Number(profile.people)||1);
  const seen=new Set();
  const unresolved=[];          // dishes we genuinely couldn't replace (pool exhausted)
  week.forEach(day=>day.meals.forEach(meal=>{
    if(!meal.recipe) return;
    const nm=meal.recipe.name.toLowerCase();
    if(meal.manual){ seen.add(nm); return; }   // V4 §6: never clobber a deliberate hand-placed dish
    if(!seen.has(nm)){ seen.add(nm); return; }
    // collision → try to find an eligible recipe (same course role) whose name isn't used yet
    const role=meal.course==='main'?meal.type:(meal.course||meal.type);
    const pool=eligibleRecipes(role,profile);
    const fresh=preferCurated(pool.filter(r=>!seen.has(r.name.toLowerCase())));
    if(fresh.length){
      const r=fresh[Math.floor(Math.random()*fresh.length)];
      meal.recipe=scaleRecipe(r,n); seen.add(r.name.toLowerCase());
    } else {
      // The built-in recipe book has no other dish this person can eat. Rather than hide it,
      // record it so the planner can say so honestly (AI weeks don't hit this).
      unresolved.push(meal.recipe.name); seen.add(nm);
    }
  }));
  state.repeatedDishes=[...new Set(unresolved)];
  return week;
}
function swapMeal(di,mi){
  const meal=state.week[di].meals[mi];
  const role=meal.course==='main'?meal.type:(meal.course||meal.type);
  const usedIds=new Set(), usedNames=new Set();
  state.week.forEach(d=>d.meals.forEach(m=>{
    if(!m.recipe) return;
    const mRole=m.course==='main'?m.type:(m.course||m.type);
    if(mRole===role) usedIds.add(m.recipe.id);
    if(m!==meal) usedNames.add(m.recipe.name.toLowerCase());   // avoid every OTHER dish in the week
  }));
  const r=pickMeal(role,state.profile,usedIds,usedNames);
  if(r){ meal.recipe=scaleRecipe(r,peopleCount()); return true; }
  return false;
}
// V4 §7: "Surprise me" — a random eligible swap that respects allergies/dislikes, the time/
// difficulty filter and no-repeat, and (AI on) runs any AI dish through acceptAIDish. Returns
// true only if the dish actually changed, so the caller can offer "Choose it myself" otherwise.
async function doSurpriseSwap(di,mi){
  const meal=state.week[di]&&state.week[di].meals[mi]; if(!meal) return false;
  const before=meal.recipe&&meal.recipe.name;
  if(state.useAI){
    const role=meal.course==='main'?meal.type:(meal.course||meal.type);
    const avoid=[]; state.week.forEach(d=>d.meals.forEach(m=>{if(m.recipe)avoid.push(m.recipe.name);}));
    try{ const r=acceptAIDish(await requestSwapAI(state.profile,role,avoid),state.profile);
         if(r){ meal.recipe=r; } else swapMeal(di,mi); }
    catch(e){ console.warn('Swap failed, local:',e.message); swapMeal(di,mi); }
  } else swapMeal(di,mi);
  return !!(meal.recipe&&meal.recipe.name!==before);
}
// Pick mode: the target slot is held while the user picks a replacement from the browse column,
// by drag OR tap (the phone path). Cancel / Esc leaves the original dish untouched.
function enterPickMode(di,mi){
  state.pickMode={di,mi};
  state.plannerTab='plan';
  renderPlanner();
  document.addEventListener('keydown',pickModeKey);
  app.querySelector('.planner-main')?.scrollIntoView({behavior:'smooth',block:'start'});
}
function exitPickMode(){
  state.pickMode=null;
  document.removeEventListener('keydown',pickModeKey);
  renderPlanner();
}
function pickModeKey(e){ if(e.key==='Escape') exitPickMode(); }
// place the chosen dish into the held slot (shared by tap and drop while in pick mode)
function pickModePlace(recipe){
  const pm=state.pickMode; if(!pm||!recipe) return;
  const ok=placeDishAt(recipe,pm.di,{slotMi:pm.mi});
  if(ok) exitPickMode();     // placeDishAt already refused + toasted if it clashed
}

/* ============================================================
   3a. Recipe links + dish images (§3.3, §3.4)
   ============================================================ */
// Real, never-hallucinated recipe link: a Google search for the dish (always resolves).
function recipeSearchUrl(name){ return 'https://www.google.com/search?q='+encodeURIComponent((name||'')+' recette'); }
// Real recipe link when a curated dish has one; falls back to the search link — never an invented URL.
function recipeUrl(recipe){ return (recipe && recipe.sourceUrl) ? recipe.sourceUrl : recipeSearchUrl(recipe && recipe.name); }

// Curated Unsplash CDN photos (verified-loading IDs), keyed by the pool's img keyword or a
// keyword found in the dish name. Unmatched dishes fall back to the emoji-gradient tile via onerror.
const DISH_IMG = {
  'yogurt':'1488477181946-6428a0291777','berries':'1488477181946-6428a0291777','smoothie':'1490645935967-10de6ba17061',
  'oatmeal':'1517673400267-0251440c45dc','muesli':'1517673400267-0251440c45dc','bagel':'1585445490387-f47934b73b54',
  'avocado':'1541519227354-08fa5d50c44d','toast':'1541519227354-08fa5d50c44d','omelette':'1510693206972-df098062cb71','egg':'1510693206972-df098062cb71',
  'quinoa':'1512621776951-a57141f2eefd','bowl':'1512621776951-a57141f2eefd','salad':'1540189549336-e6e99c3679fe',
  'lentil':'1547592166-23ac45744acd','soup':'1547592166-23ac45744acd','tuna':'1467003909585-2f8a72700288','fish':'1467003909585-2f8a72700288',
  'falafel':'1547592180-85f173990554','wrap':'1626700051175-6818013e1d4f','burrito':'1626700051175-6818013e1d4f',
  'pasta':'1473093295043-cdd812d0e601','spaghetti':'1473093295043-cdd812d0e601','caprese':'1608897013039-887f21d8c804',
  'chicken':'1604908176997-125f25cc6f3d','rice':'1516684732162-798a0062be99',
  'salmon':'1519708227418-c8fd9a32b7a2','beef':'1600891964092-4316c288032e','stir':'1603133872878-684f208fb84b',
  'chili':'1455619452474-d2be8b1e70cd','curry':'1631292784640-2b24be784d5d','pizza':'1513104890138-7c749659a591',
  'shrimp':'1633504581786-316c8002b1b9','taco':'1565299624946-b28f40a0ae38','bolognese':'1473093295043-cdd812d0e601',
};
function dishImageUrl(recipe){
  if(!recipe) return null;
  if(recipe.photo) return recipe.photo;   // curated dishes carry their own real photo
  const keyify=k=>k&&DISH_IMG[k.toLowerCase()];
  // 1) exact img keyword(s) on the pool recipe  2) any keyword found in the dish name
  let id=null;
  (recipe.img||'').split(',').forEach(k=>{ id=id||keyify(k.trim()); });
  if(!id){ const nm=(recipe.name||'').toLowerCase(); for(const k in DISH_IMG){ if(nm.includes(k)){ id=DISH_IMG[k]; break; } } }
  return id?`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&q=70`:null;
}

/* ============================================================
   3b. AI (backend) — falls back to local pool if backend off
   ============================================================ */
let nextId=1;
function normalizeRecipe(r){
  // Keep the model's allergen list, filtered to words we recognise. Dropping it (as this
  // used to) forced every AI dish onto the aisle-based regex below, which reads the
  // supermarket *aisle* as if it were an allergen — and the Dairy aisle holds eggs and
  // almond milk. Note passesDietFilters() does NOT trust an AI contains[] on its own: it is
  // model-written and unreviewed, so it is used as an extra veto, never as a clean bill.
  const contains=Array.isArray(r.contains)
    ? r.contains.filter(a=>typeof a==='string'&&DISH_ALLERGENS.includes(a.toLowerCase()))
                .map(a=>a.toLowerCase())
    : undefined;
  return { id:'ai'+(nextId++), type:r.type, name:r.name, desc:r.desc, time:r.time,
    difficulty:r.difficulty, emoji:r.emoji||'🍽️', img:r.img||'food', tags:r.tags||[],
    kcal:(typeof r.kcal==='number'?Math.round(r.kcal):undefined),
    protein:(typeof r.protein==='number'?Math.round(r.protein):undefined),
    ...(contains?{contains}:{}),
    ingredients:(r.ingredients||[]).map(i=>({...i})), steps:r.steps||[] };
}
function aiSlot(mealType,course,r){ return {type:mealType,course,recipe:normalizeRecipe({...r,type:mealType}),rejected:false}; }
async function requestWeekAI(profile){
  const res=await fetch(BACKEND_URL+'/generate-week',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(profile)});
  if(!res.ok)throw new Error('backend '+res.status);
  const data=await res.json();
  if(!data.week)throw new Error('bad response');
  // §5: Gemini's own whole-week total, shown as the shopping headline when present.
  state.estimatedTotal=(typeof data.estimatedTotal==='number'&&isFinite(data.estimatedTotal)&&data.estimatedTotal>0)?data.estimatedTotal:undefined;
  // AI shape v3: breakfast is a recipe; lunch/dinner carry a `courses` object. Flatten to slots.
  const week=data.week.map((day,i)=>{
    const meals=[];
    (day.meals||[]).forEach(m=>{
      const mealType=m.type||'dinner';
      if(m.courses && typeof m.courses==='object'){
        ['starter','main','dessert'].forEach(c=>{ if(m.courses[c]) meals.push(aiSlot(mealType,c,m.courses[c])); });
      } else {
        meals.push(aiSlot(mealType,'main',m));   // breakfast, or a flat meal (back-compat)
      }
    });
    return {day:day.day||DAYS[i],meals};
  });
  // Safety net: smaller Gemini models sometimes return a partial week (seen: 1 day instead of 7).
  // Rather than show a broken plan, top the missing days up from the built-in pool.
  if(week.length<DAYS.length){
    console.warn(`AI returned only ${week.length} day(s); filling the rest from the built-in recipes.`);
    const filler=generateWeek(profile);
    for(let i=week.length;i<DAYS.length;i++) week.push(filler[i]);
    state.partialAI=true;
  } else state.partialAI=false;
  return week.slice(0,DAYS.length);
}
// A dish Gemini invents is UNTRUSTED in exactly the way §0.7's researched dishes are: it has
// no reviewed contains[], and the prompt asking it to respect allergies is a request, not a
// guarantee. So every AI dish is re-checked against the profile before it can reach a plate,
// and rejected if it fails. Failing closed here costs the user a repeated dish — which the
// honest notice already discloses — instead of putting an allergen in front of them.
function acceptAIDish(recipe,profile){
  if(!recipe||!Array.isArray(recipe.ingredients)) return null;
  if(!passesDietFilters(recipe,profile||{dislikes:[],allergies:[]})){
    console.warn('Rejected an AI dish that failed the diet filter:',recipe.name);
    return null;
  }
  return recipe;
}
async function requestSwapAI(profile,role,avoidNames){
  const res=await fetch(BACKEND_URL+'/generate-meal',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({profile,type:role,avoidNames})});
  if(!res.ok)throw new Error('backend '+res.status);
  const data=await res.json();
  if(!data.meal)throw new Error('bad response');
  return normalizeRecipe({...data.meal,type:role});
}

/* ============================================================
   4. SHOPPING LIST (with price totals)
   ============================================================ */
function buyDayFor(di){ return di===0?'Sunday (before the week)':DAYS[di-1]; }
// AI-supplied prices win when present (real, per-week quote); otherwise fall back to the
// offline estimate table so the shopping total/€/day pill/per-day chips work with AI off too.
function priceOf(ing){
  if(typeof ing.price==='number'&&isFinite(ing.price)) return ing.price;
  return (typeof estimateIngredientPrice==='function') ? estimateIngredientPrice(ing) : 0;
}
// The two pools spell "one of something" differently — the curated database uses unit:'piece',
// the older built-in pool uses unit:''. Keying on the raw string split the SAME ingredient into
// two shopping rows ("Apple · 3 piece" and "Apple · 4"). Normalise so they aggregate into one.
function unitKey(u){ const t=String(u||'').trim().toLowerCase(); return (t===''||t==='piece'||t==='pieces')?'piece':t; }
function itemKey(ing){ return ing.name.toLowerCase()+'|'+unitKey(ing.unit); }
/* ============================================================
   4b. Integrations (§5) — .ics calendar export + feedback form
   (zero-setup, no account needed; push/email/Google OAuth come later)
   ============================================================ */
// The upcoming Monday (today if it's already Monday), as a local Date at 00:00 —
// so "add my week" schedules the plan starting the next Monday, not a past one.
function weekMonday(){
  const d=new Date(); const until=(8-d.getDay())%7;
  return new Date(d.getFullYear(),d.getMonth(),d.getDate()+until);
}
function icsStamp(date,h,min){
  const d=new Date(date.getFullYear(),date.getMonth(),date.getDate(),h,min,0);
  const p=n=>String(n).padStart(2,'0');
  return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}
function icsEsc(s){ return String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n'); }
// V4 §8.3: a Europe/Paris VTIMEZONE so events land at the right local time (not floating), and
// STABLE UIDs keyed to the week's Monday + event identity so re-importing after a re-plan UPDATES
// the same events rather than piling up duplicates.
const ICS_VTIMEZONE=[
  'BEGIN:VTIMEZONE','TZID:Europe/Paris',
  'BEGIN:DAYLIGHT','TZOFFSETFROM:+0100','TZOFFSETTO:+0200','TZNAME:CEST','DTSTART:19700329T020000','RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU','END:DAYLIGHT',
  'BEGIN:STANDARD','TZOFFSETFROM:+0200','TZOFFSETTO:+0100','TZNAME:CET','DTSTART:19701025T030000','RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU','END:STANDARD',
  'END:VTIMEZONE'];
function buildICS(){
  const mon=weekMonday();
  const wk=`${mon.getFullYear()}${String(mon.getMonth()+1).padStart(2,'0')}${String(mon.getDate()).padStart(2,'0')}`;
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//#Foodie//Meal Planner//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH',...ICS_VTIMEZONE];
  const stampNow=icsStamp(new Date(),new Date().getHours(),new Date().getMinutes());
  const ev=(dayOffset,startH,startMin,endH,endMin,summary,desc,uidKey)=>{
    const date=new Date(mon.getFullYear(),mon.getMonth(),mon.getDate()+dayOffset);
    lines.push('BEGIN:VEVENT',`UID:foodie-${wk}-${uidKey}@foodie.app`,`DTSTAMP:${stampNow}`,
      `DTSTART;TZID=Europe/Paris:${icsStamp(date,startH,startMin)}`,`DTEND;TZID=Europe/Paris:${icsStamp(date,endH,endMin)}`,
      `SUMMARY:${icsEsc(summary)}`,`DESCRIPTION:${icsEsc(desc)}`,'END:VEVENT');
  };
  // dinner events (19:00) — main dish name + full-course list + real recipe link
  state.week.forEach((day,di)=>{
    const dinnerMain=day.meals.find(m=>m.type==='dinner'&&(m.course==='main'||!m.course)&&m.recipe&&!m.rejected);
    if(!dinnerMain)return;
    const courses=day.meals.filter(m=>m.type==='dinner'&&m.recipe&&!m.rejected).map(m=>m.recipe.name);
    const desc=`Tonight's dinner: ${courses.join(', ')}.\nRecipe: ${recipeUrl(dinnerMain.recipe)}`;
    ev(di,19,0,19,45,`🍽 ${dinnerMain.recipe.name}`,desc,`dinner-${di}`);
  });
  // shopping reminders (17:00) on each buy-day
  const { fresh }=buildShoppingList();
  const buyOffset={'Sunday (before the week)':-1};
  DAYS.forEach((d,i)=>buyOffset[d]=i);
  Object.keys(fresh).forEach(bd=>{
    const items=[...fresh[bd].values()].map(i=>i.name).sort();
    if(!items.length)return;
    const off=buyOffset[bd]??0;
    ev(off,17,0,17,15,'🛒 Buy fresh for tomorrow',`Pick up: ${items.join(', ')}.`,`shop-${off}`);
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
function downloadICS(){
  const blob=new Blob([buildICS()],{type:'text/calendar;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='table-week.ics';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  showToast('📅 Calendar file downloaded — open it to add your week');
}
// Feedback → our own Supabase Edge Function, which emails Lucille via Resend.
// (Replaced FormSubmit: its one-time confirmation email never arrived.)
const FEEDBACK_ENDPOINT=(window.SUPABASE_CONFIG&&window.SUPABASE_CONFIG.url)
  ? window.SUPABASE_CONFIG.url.replace(/\/$/,'')+'/functions/v1/send-feedback' : '';
function openFeedback(){
  document.querySelectorAll('.fb-overlay').forEach(el=>el.remove());
  const ov=document.createElement('div'); ov.className='fb-overlay';
  ov.innerHTML=`<div class="fb-card" role="dialog" aria-modal="true" aria-label="Send feedback">
    <button class="fb-close" aria-label="Close">✕</button>
    <h3>💬 A thought? Tell Lucille</h3>
    <p class="sub">Ideas, bugs, or just hello — it goes straight to her.</p>
    <label for="fbMsg">Your message</label>
    <textarea id="fbMsg" placeholder="What's on your mind?"></textarea>
    <label for="fbEmail">Your email <span class="hint">(optional — only if you'd like a reply)</span></label>
    <input id="fbEmail" type="email" placeholder="you@email.com">
    <input type="text" id="fbHoney" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">
    <p class="auth-err" id="fbErr" style="display:none"></p>
    <button class="primary btn-block" id="fbSend" style="margin-top:14px">Send to Lucille →</button>
  </div>`;
  document.body.appendChild(ov);
  const close=()=>ov.remove();
  ov.querySelector('.fb-close').onclick=close;
  ov.onclick=(e)=>{ if(e.target===ov)close(); };
  ov.querySelector('#fbSend').onclick=async()=>{
    const msg=ov.querySelector('#fbMsg').value.trim();
    const email=ov.querySelector('#fbEmail').value.trim();
    const err=ov.querySelector('#fbErr');
    if(ov.querySelector('#fbHoney').value){ close(); return; }   // bot honeypot filled → silently drop
    if(msg.length<2){ err.textContent='Please write a short message first.'; err.style.display='block'; return; }
    const btn=ov.querySelector('#fbSend'); btn.disabled=true; btn.textContent='Sending…';
    try{
      if(!FEEDBACK_ENDPOINT) throw new Error('no endpoint configured');
      const key=(window.SUPABASE_CONFIG&&window.SUPABASE_CONFIG.anonKey)||'';
      const res=await fetch(FEEDBACK_ENDPOINT,{method:'POST',
        headers:{'content-type':'application/json',...(key?{apikey:key,Authorization:'Bearer '+key}:{})},
        body:JSON.stringify({message:msg,email:email||'',hp:''})});
      if(!res.ok)throw new Error('status '+res.status);
      close(); showToast('✓ Sent — thank you! 💛');
    }catch(e){ btn.disabled=false; btn.textContent='Send to Lucille →';
      err.textContent='Could not send just now — please try again.'; err.style.display='block'; }
  };
}

// V4 §4.3: whole-item rounding happens HERE, after every recipe's quantity has been summed —
// never inside estimateIngredientPrice. Three recipes each using half an onion sum to 1.5
// onions → you buy 2 (€3.00), not 3 rounded-per-row (€4.50) and not 1.5 (€2.25). Only
// piece-priced table items round; weight/volume and AI-priced rows keep their exact price.
function finalizeLine(line){
  const pp = (typeof piecePriceOf==='function') ? piecePriceOf(line) : null;
  // Round only when the table prices this as whole items AND no AI price was supplied.
  if(pp && !line._hasAIPrice){
    const bought=Math.max(1,Math.ceil(line.qty - 1e-9));
    line.boughtQty=bought;
    if(bought > line.qty + 1e-9) line.roundedFrom=line.qty;   // flag so the UI can say "(you need 1½)"
    line.price=pp.eur*bought;
  }
  return line;
}
function addTo(map,key,ing,pr){
  if(map.has(key)){ const l=map.get(key); l.qty+=ing.qty; l._sumPrice+=pr; if(typeof ing.price==='number')l._hasAIPrice=true; }
  else map.set(key,{...ing,_sumPrice:pr,_hasAIPrice:(typeof ing.price==='number'),price:pr});
}
function buildShoppingList(){
  const pantry=new Map(); const fresh={}; let anyPrice=false; let skipped=0;
  state.week.forEach((day,di)=>{
    day.meals.forEach(meal=>{
      if(meal.rejected||!meal.recipe||meal.recipe.isLeftover)return;   // leftovers: nothing new to buy
      meal.recipe.ingredients.forEach(ing=>{
        if(pantryHas(ing.name)){ skipped++; return; }                  // already in your pantry
        const key=itemKey(ing);
        const pr=priceOf(ing); if(pr>0)anyPrice=true;
        if(ing.buyDayBefore){
          const bd=buyDayFor(di); (fresh[bd]??=new Map());
          addTo(fresh[bd],key,ing,pr);
        } else addTo(pantry,key,ing,pr);
      });
    });
  });
  // Finalise each aggregated line (exact-sum by default, whole-item rounded for piece items),
  // then total from the finalised lines so the headline matches what's on the list.
  let total=0;
  const seal=l=>{ l.price=l._sumPrice; finalizeLine(l); total+=l.price; return l; };
  const pantryLines=[...pantry.values()].map(seal);
  for(const bd in fresh) fresh[bd]=new Map([...fresh[bd]].map(([k,l])=>[k,seal(l)]));
  return { pantry:pantryLines, fresh, total, anyPrice, skipped };
}

/* ============================================================
   5. RENDERING
   ============================================================ */
const app=document.getElementById('app');
function setScreen(n){ state.screen=n; render(); }
const shellEl=document.getElementById('app-shell');
const landingRoot=document.getElementById('landing-root');
function render(){
  // Landing is a full-bleed marketing page rendered outside the narrow app shell.
  if(state.screen==='landing'){
    shellEl.style.display='none';
    landingRoot.style.display='';
    renderLanding();
    window.scrollTo(0,0);
    return;
  }
  shellEl.style.display='';
  landingRoot.style.display='none';
  landingRoot.innerHTML='';
  removeLandingParallax();
  if(state.screen==='signin')renderSignIn();
  else if(state.screen==='profile')renderProfile();
  else if(state.screen==='loading')renderLoading();
  else if(state.week&&state.week.length)renderPlanner();   // 'review' — the one-page planner (§2)
  else renderProfile();          // no week to show: fall back to the questionnaire, never a blank page
  window.scrollTo(0,0);
  if(state.screen!=='signin')saveState();   // don't persist while signed out
}
function renderLoading(){
  app.innerHTML=`<div class="card" style="text-align:center;padding:48px 20px">
    <div style="font-size:44px">🍳</div><h2>Cooking up your week…</h2>
    <p class="sub">We're picking dishes you'll love, working out portions and adding up the shopping. One moment.</p>
    <div class="spinner"></div></div>`;
}

/* ----- Landing (public marketing; signed-out visitors) ----- */
let _landingScroll=null;
function removeLandingParallax(){ if(_landingScroll){ window.removeEventListener('scroll',_landingScroll); _landingScroll=null; } }
function renderLanding(){
  landingRoot.innerHTML=`
  <div class="doodad" data-speed="0.25" style="top:520px;left:2%">🍅</div>
  <div class="doodad" data-speed="0.5" style="top:900px;right:3%;font-size:56px">🍋</div>
  <div class="doodad" data-speed="0.35" style="top:1500px;left:3%;font-size:52px">🌿</div>
  <div class="doodad" data-speed="0.6" style="top:2100px;right:2%">🫒</div>
  <div class="doodad" data-speed="0.4" style="top:2700px;left:2%;font-size:50px">🧄</div>
  <div class="doodad" data-speed="0.55" style="top:3300px;right:3%;font-size:54px">🌶</div>

  <nav class="glass-nav">
    <div class="wrap nav-inner">
      <div class="logo"><span class="mark" aria-hidden="true">🍽</span> #Foodie</div>
      <div class="nav-links">
        <a class="txt hide-sm" href="#how">How it works</a>
        <a class="txt hide-sm" href="#preview">Recipes</a>
        <a class="txt" data-signin>Log in</a>
        <a class="btn btn-primary btn-sm" data-signin>Start free</a>
      </div>
    </div>
  </nav>

  <header class="hero">
    <div class="wrap hero-grid">
      <div>
        <h1>Your week,<br><em>deliciously</em> planned.</h1>
        <p class="sub">Tell us how you like to eat. Get a full week of real dinners — and a shopping list that actually adds up.</p>
        <div class="hero-cta">
          <a class="btn btn-primary btn-lg" data-signin>Plan my week</a>
          <span class="note">Free forever · no card</span>
        </div>
      </div>
      <div class="hero-photos">
        <div class="big"><img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=75" alt="A table laid with fresh dishes"></div>
        <div class="float a"><img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=70" alt="Salmon bowl"></div>
        <div class="float b"><img src="https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=400&q=70" alt="Breakfast"></div>
      </div>
    </div>
  </header>

  <section class="sec" id="how">
    <div class="wrap">
      <div class="sec-kicker">How it works</div>
      <h2>Three steps to dinner, sorted.</h2>
      <div class="lsteps">
        <div class="lstep">
          <div class="thumb"><img src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=600&q=70" alt="Fresh ingredients"></div>
          <div class="n">01</div><h3>Tell us your taste</h3>
          <p>A friendly two-minute questionnaire — how you like to eat, your budget, your kitchen.</p>
        </div>
        <div class="lstep">
          <div class="thumb"><img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=70" alt="A spread of dishes"></div>
          <div class="n">02</div><h3>Get your week</h3>
          <p>A balanced week of real recipes appears — three courses a day, no repeats, portioned for you.</p>
        </div>
        <div class="lstep">
          <div class="thumb"><img src="https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=600&q=70" alt="Shopping"></div>
          <div class="n">03</div><h3>Shop &amp; cook</h3>
          <p>One tidy list with prices per day. Cook mode reads each step aloud. Bon appétit.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" id="preview" style="background:var(--green-wash)">
    <div class="wrap">
      <div class="sec-kicker">The planner</div>
      <h2>Your whole week, on one calm screen.</h2>
      <div class="preview-wrap">
        <div class="pv-top"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="u">Your week · 2,430 kcal/day</span></div>
        <div class="pv-body">
          <aside class="pv-side">
            <div class="day on"><span class="dn">Mon</span><span class="thumbs"><span style="background-image:url('https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=80&q=60')"></span><span style="background-image:url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=60')"></span><span style="background-image:url('https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=80&q=60')"></span></span></div>
            <div class="day"><span class="dn">Tue</span><span class="thumbs"><span style="background-image:url('https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=80&q=60')"></span><span style="background-image:url('https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=80&q=60')"></span><span class="empty"></span></span></div>
            <div class="day"><span class="dn">Wed</span><span class="thumbs"><span style="background-image:url('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=80&q=60')"></span><span class="empty"></span><span class="empty"></span></span></div>
            <div class="day"><span class="dn">Thu</span><span class="thumbs"><span class="empty"></span><span class="empty"></span><span class="empty"></span></span></div>
            <div class="day"><span class="dn">Fri</span><span class="thumbs"><span style="background-image:url('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=80&q=60')"></span><span class="empty"></span><span class="empty"></span></span></div>
          </aside>
          <div class="pv-main">
            <div class="pv-summary"><b>Your week, ready 🎯</b><span class="badge badge-basil">2,430 kcal/day</span></div>
            <div class="pv-cat">Budget-friendly dinners</div>
            <div class="pv-cards">
              <div class="pv-card"><div class="im"><img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=65" alt=""><span class="add">＋</span></div><div class="t">Rainbow veg bowl</div></div>
              <div class="pv-card"><div class="im"><img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=65" alt=""><span class="add">＋</span></div><div class="t">Halloumi grain bowl</div></div>
              <div class="pv-card"><div class="im"><img src="https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=300&q=65" alt=""><span class="add">＋</span></div><div class="t">Lemon pea risotto</div></div>
              <div class="pv-card"><div class="im"><img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=65" alt=""><span class="add">＋</span></div><div class="t">Crunchy kale salad</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec">
    <div class="wrap">
      <div class="quote-band">
        <div class="qmark" aria-hidden="true">”</div>
        <div class="portrait"><img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=70" alt="A happy home cook"></div>
        <blockquote>
          <p>I used to stare into the fridge at 7pm. Now my week just… arrives. We eat better, we waste less, and Sunday planning is gone.</p>
          <cite>— Camille, home cook &amp; mum of two</cite>
        </blockquote>
      </div>
    </div>
  </section>

  <section class="sec" style="padding-top:24px;background:var(--wood-wash)">
    <div class="wrap">
      <div class="sec-kicker">Why people stay</div>
      <h2>Small numbers, big weeknights.</h2>
      <div class="stats">
        <div class="stat"><div class="num">~2 h</div><div class="lab">saved on planning every week</div></div>
        <div class="stat hl"><div class="num">−23%</div><div class="lab">less spent at the grocery store</div></div>
        <div class="stat"><div class="num">0 €</div><div class="lab">forever — no card, no catch</div></div>
        <div class="stat"><div class="num">3×</div><div class="lab">courses a day, never repeated</div></div>
      </div>
    </div>
  </section>

  <section class="sec" style="background:var(--green-wash)">
    <div class="wrap">
      <div class="center"><div class="sec-kicker">Good questions</div><h2 style="margin:10px auto 0">Everything you might ask.</h2></div>
      <div class="faq">
        <details open><summary>Is it really free? <span class="plus" aria-hidden="true">＋</span></summary><p>Yes — free forever, no card required. We built #Foodie to be genuinely useful, not to upsell you.</p></details>
        <details><summary>Do I need to cook every night? <span class="plus" aria-hidden="true">＋</span></summary><p>Not at all. Turn on "cook once, eat twice" and #Foodie plans leftovers for you, doubling the right dinners so nothing goes to waste.</p></details>
        <details><summary>Can I swap a dish I don't fancy? <span class="plus" aria-hidden="true">＋</span></summary><p>Tap ✕ on any dish to swap it straight away, or browse the categories and drop your own favourites onto any day.</p></details>
        <details><summary>Where do the recipes come from? <span class="plus" aria-hidden="true">＋</span></summary><p>Real cookery sites — every dish in our cookbook links to the page it came from, with its own photo and timings. Nothing invented, no dead links. You can add dishes you love too, and they stay in your cookbook for good.</p></details>
        <details><summary>Does my data stay mine? <span class="plus" aria-hidden="true">＋</span></summary><p>Always. Your profile and plans are yours; we never sell your data. You can export or delete everything anytime.</p></details>
      </div>
    </div>
  </section>

  <footer class="fat">
    <div class="wrap">
      <div class="cta-final">
        <h2 class="display" style="color:#fff;font-size:var(--fs-h1);margin:0 auto 20px;max-width:20ch">Hungry yet? Plan this week in two minutes.</h2>
        <a class="btn btn-primary btn-lg" data-signin>Start free</a>
      </div>
      <div class="foot-grid">
        <div>
          <div class="logo"><span class="mark" aria-hidden="true">🍽</span> #Foodie</div>
          <p style="color:#C9C1B4;font-size:var(--fs-sm);margin-top:12px;max-width:34ch">Dinner, sorted. A calm little app for eating well all week — made with love in France.</p>
        </div>
        <div><h4>Product</h4><a href="#how">How it works</a><a href="#preview">The planner</a><a data-signin>Sign up</a></div>
        <div><h4>Company</h4><a data-signin>Get started</a><a data-signin>Our promise</a></div>
        <div><h4>Legal</h4><a data-signin>Privacy</a><a data-signin>Terms</a></div>
      </div>
      <div class="baseline"><span>© 2026 #Foodie · Bon appétit.</span><span>Free forever · Made in France 🇫🇷</span></div>
    </div>
  </footer>`;
  landingRoot.querySelectorAll('[data-signin]').forEach(el=>{ el.onclick=(e)=>{ e.preventDefault(); setScreen('signin'); }; });
  // subtle parallax on the margin doodads (respects reduced-motion)
  removeLandingParallax();
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const dd=[...landingRoot.querySelectorAll('.doodad')];
    let ticking=false;
    _landingScroll=()=>{ if(ticking)return; ticking=true; requestAnimationFrame(()=>{
      const y=window.scrollY;
      dd.forEach(d=>{ const s=parseFloat(d.dataset.speed); d.style.transform=`translateY(${-y*s*0.3}px) rotate(${y*s*0.02}deg)`; });
      ticking=false; }); };
    window.addEventListener('scroll',_landingScroll,{passive:true});
  }
}

/* ----- Sign-in / sign-up (password + Google) — cloud mode only (V4 §1) -----
   Password is the primary path: email is used once at sign-up, then only as the login
   identifier. No email is sent on an ordinary sign-in, so there is no rate limit to hit.
   The last email to sign in on this browser is remembered (email only, never the password —
   V4 §1.3b) so the everyday flow is: open app → email pre-filled → type password → in. */
const LAST_EMAIL_KEY='foodieLastEmail';
function rememberedEmail(){ try{ return localStorage.getItem(LAST_EMAIL_KEY)||''; }catch(e){ return ''; } }
function rememberEmail(email){ try{ localStorage.setItem(LAST_EMAIL_KEY,email); }catch(e){} }
function forgetEmail(){ try{ localStorage.removeItem(LAST_EMAIL_KEY); }catch(e){} }
// Turn Supabase's terse auth errors into plain English (V4 §1.3).
function friendlyAuthError(e){
  const m=((e&&e.message)||'').toLowerCase();
  if(m.includes('invalid login')) return 'That email and password don’t match. Try again, or reset your password.';
  if(m.includes('already registered')||m.includes('already been registered')) return 'You already have an account — switch to Sign in.';
  if(m.includes('email not confirmed')) return 'Check your inbox and click the link, then sign in.';
  if(m.includes('password')&&m.includes('should be')) return 'Passwords need at least 8 characters.';
  return (e&&e.message)||'Something went wrong. Please try again.';
}
function renderSignIn(){
  const cloudOn = !!(window.Cloud && window.Cloud.enabled);
  const remembered=rememberedEmail();
  // mode: 'in' = sign in, 'up' = create account. Default to sign in.
  let mode='in';
  app.innerHTML=`
    <div class="card auth-card">
      <a class="top-back" id="backHome" role="button" tabindex="0">← Back home</a>
      <h2>Welcome to #Foodie</h2>
      <p class="sub">Free forever. No card. Your data stays yours.</p>
      <div id="auth-form">
        <button class="btn-google" id="googleBtn" type="button"><span class="g" aria-hidden="true"></span> Continue with Google</button>
        <div class="divider">or with email</div>
        <div class="auth-tabs" role="tablist">
          <button class="auth-tab active" id="tabIn" type="button" role="tab">Sign in</button>
          <button class="auth-tab" id="tabUp" type="button" role="tab">Create account</button>
        </div>
        <label for="authEmail">Email</label>
        <input type="email" id="authEmail" placeholder="you@email.com" autocomplete="email" value="${remembered.replace(/"/g,'&quot;')}">
        <label for="authPass">Password</label>
        <input type="password" id="authPass" placeholder="At least 8 characters" autocomplete="current-password">
        <div id="confirmRow" style="display:none">
          <label for="authPass2">Confirm password</label>
          <input type="password" id="authPass2" placeholder="Type it again" autocomplete="new-password">
        </div>
        <button class="primary btn-block" id="submitBtn" type="button">Sign in →</button>
        <div class="auth-links">
          <a class="txt" id="forgotLink" role="button" tabindex="0" style="${mode==='in'?'':'display:none'}">Forgot your password?</a>
          ${remembered?`<a class="txt" id="notYouLink" role="button" tabindex="0">Not you? Use a different email</a>`:''}
        </div>
        <ul class="promise">
          <li><span class="tick">✓</span> <span><b>Free forever</b> — no card, no trial clock</span></li>
          <li><span class="tick">✓</span> <span><b>One password</b> — no codes to wait for</span></li>
          <li><span class="tick">✓</span> <span><b>Your data stays yours</b> — export or delete anytime</span></li>
        </ul>
        <p class="auth-err" id="authErr" style="display:none"></p>
        <p class="auth-ok" id="authOk" style="display:none"></p>
      </div>
    </div>`;
  const $=(id)=>document.getElementById(id);
  const backHome=$('backHome'); if(backHome) backHome.onclick=()=>setScreen('landing');
  const err=$('authErr'), ok=$('authOk');
  const showErr=(m)=>{ err.textContent=m; err.style.display='block'; ok.style.display='none'; };
  const showOk=(m)=>{ ok.textContent=m; ok.style.display='block'; err.style.display='none'; };
  const notConnected='Sign-in isn’t connected yet — add your Supabase details in config.js.';
  const emailEl=$('authEmail'), passEl=$('authPass'), pass2El=$('authPass2');

  // Focus straight to the password field when the email is already known (V4 §1.3b).
  if(remembered){ passEl.focus(); } else { emailEl.focus(); }

  function setMode(m){
    mode=m;
    $('tabIn').classList.toggle('active',m==='in');
    $('tabUp').classList.toggle('active',m==='up');
    $('confirmRow').style.display=m==='up'?'block':'none';
    $('submitBtn').textContent=m==='up'?'Create my account →':'Sign in →';
    $('forgotLink').style.display=m==='in'?'':'none';
    passEl.setAttribute('autocomplete',m==='up'?'new-password':'current-password');
    err.style.display='none'; ok.style.display='none';
  }
  $('tabIn').onclick=()=>setMode('in');
  $('tabUp').onclick=()=>setMode('up');

  $('submitBtn').onclick=async()=>{
    const email=emailEl.value.trim(); const pw=passEl.value;
    if(!/.+@.+\..+/.test(email)){ showErr('Please enter a valid email address.'); return; }
    if(pw.length<8){ showErr('Passwords need at least 8 characters.'); return; }
    if(mode==='up' && pw!==pass2El.value){ showErr('Those two passwords don’t match.'); return; }
    if(!cloudOn){ showErr(notConnected); return; }
    $('submitBtn').disabled=true; $('submitBtn').textContent=mode==='up'?'Creating…':'Signing in…';
    try{
      if(mode==='up'){
        const { data, error }=await window.Cloud.signUpWithPassword(email,pw);
        if(error)throw error;
        rememberEmail(email);
        // With email-confirmation OFF (V4 §1.4) a session exists immediately and onAuthChange
        // takes over. If confirmation is ON, no session yet — tell them to check their inbox.
        if(!(data&&data.session)) showOk('Account created — check your inbox to confirm, then sign in.');
      }else{
        const { error }=await window.Cloud.signInWithPassword(email,pw);
        if(error)throw error;
        rememberEmail(email);
        // success → onAuthChange fires and swaps the screen; nothing more to do here.
      }
    }catch(e){ showErr(friendlyAuthError(e)); }
    finally{ $('submitBtn').disabled=false; $('submitBtn').textContent=mode==='up'?'Create my account →':'Sign in →'; }
  };

  $('forgotLink').onclick=async()=>{
    const email=emailEl.value.trim();
    if(!/.+@.+\..+/.test(email)){ showErr('Enter your email above first, then tap Forgot your password.'); return; }
    if(!cloudOn){ showErr(notConnected); return; }
    try{ const { error }=await window.Cloud.sendPasswordReset(email); if(error)throw error;
      showOk('If that email has an account, a reset link is on its way.');
    }catch(e){ showErr('Could not send the reset link: '+((e&&e.message)||'unknown error')); }
  };

  const notYou=$('notYouLink');
  if(notYou) notYou.onclick=()=>{ forgetEmail(); emailEl.value=''; emailEl.focus(); notYou.remove(); };

  $('googleBtn').onclick=async()=>{
    if(!cloudOn){ showErr(notConnected); return; }
    try{ const { error }=await window.Cloud.signInWithGoogle(); if(error)throw error; }
    catch(e){ showErr('Google sign-in failed: '+((e&&e.message)||'unknown error')); }
  };
}

// Generate a fresh week from the CURRENT profile (no questionnaire). Shared by the wizard
// finish and the "re-plan" button, so a new week never re-asks the questionnaire.
// §0 precedence rule: the database (+ legacy pool) always fills the week first, AI on or off.
// AI's only job here is topping up the rare slot the database genuinely couldn't fill uniquely —
// it is never asked to author the week from scratch. requestWeekAI() is kept for a possible future
// "regenerate entirely with AI" action, but planWeek() no longer calls it by default.
async function planWeek(){
  state.checked={};
  setScreen('loading');
  state.week=generateWeek(state.profile);      // sets state.repeatedDishes via enforceNoRepeat
  state.usedFallback=false;
  // Only a full requestWeekAI() call supplies a whole-week estimate (§5) — the per-slot
  // top-up below can't produce one, so there is nothing coherent to show until that future
  // "regenerate entirely with AI" action exists. Clear any stale figure from a previous week.
  state.estimatedTotal=undefined;
  if(state.useAI && state.repeatedDishes && state.repeatedDishes.length){
    const n=Math.max(1,Number(state.profile.people)||1);
    const toFix=[];
    state.week.forEach((day,di)=>day.meals.forEach((meal,mi)=>{
      if(meal.recipe && state.repeatedDishes.includes(meal.recipe.name)) toFix.push({di,mi});
    }));
    for(const {di,mi} of toFix.slice(0,5)){    // cap: mind the 20/day free-tier quota
      const meal=state.week[di].meals[mi];
      const role=meal.course==='main'?meal.type:(meal.course||meal.type);
      const avoidNames=[];
      state.week.forEach(d=>d.meals.forEach(m=>{ if(m.recipe) avoidNames.push(m.recipe.name); }));
      try{
        const r=acceptAIDish(await requestSwapAI(state.profile,role,avoidNames),state.profile);
        if(r) meal.recipe=scaleRecipe(r,n);   // null => keep the repeat, which the notice discloses
      }catch(e){ console.warn('AI top-up failed for a repeated slot:',e.message); }
    }
    enforceNoRepeat(state.week,state.profile);   // recompute state.repeatedDishes after patching
  }
  if(state.profile.leftovers) applyLeftovers(state.week);
  state.plannerTab='plan';       // a fresh week always lands on the meal-plan tab, not shopping
  setScreen('review');
}

/* ----- Screen 1: questionnaire v2 — friendly 8-step onboarding (§6) ----- */
const Q_STEPS = 8;   // Welcome · You · Rhythm · Goal · Tastes · Kitchen · Numbers · Connect
function renderProfile(){
  const d={weight:'',height:'',age:'',gender:'female',lifeStage:'working',goal:'maintain',
    sport:'none',frequency:0,cookingLevel:5,timePerMeal:30,people:1,name:'',
    breakfastPref:'surprise',cuisines:[],dislikes:[],allergies:[],pantry:[],leftovers:false,
    avoidText:'',budget:'',budgetPerDay:12,city:'',mealSplit:{...DEFAULT_SPLIT}};
  const p={...d,...(state.profile||{})};
  const split={...DEFAULT_SPLIT,...(p.mealSplit||{})};
  const sel=(v,cur)=>v===cur?'selected':'';
  const chipRow=(id,opts,chosen,label)=>`<div class="chip-grid" id="${id}">${opts.map(o=>{
    const v=typeof o==='string'?o:o.v; const lab=typeof o==='string'?o:(o.label||`${o.emoji} ${o.v}`);
    return `<button type="button" class="chip ${chosen.includes(v)?'selected':''}" data-v="${v}">${lab}</button>`;
  }).join('')}</div>`;

  app.innerHTML=`
  <div class="wizard">
    <div class="q-top">
      <span class="hint" id="q-count" style="font-style:normal;font-weight:600">Step 1 of ${Q_STEPS}</span>
      ${cloudEnabled()?'<button type="button" class="btn btn-ghost btn-sm" id="q-signout">Sign out</button>':''}
    </div>
    <div class="dots q-dots" id="q-dots">${Array.from({length:Q_STEPS},()=>'<i></i>').join('')}</div>

    <!-- 1 · Welcome -->
    <div class="q-step on" data-step="0">
      <div class="q-emojihead">👋</div>
      <h2>First — what should we call you?</h2>
      <div class="q-why">So your week feels like yours, not a spreadsheet.</div>
      <div class="field"><label for="q-name">Your name</label>
        <input class="input" id="q-name" value="${p.name||''}" placeholder="Lucille" style="font-size:var(--fs-lg)"></div>
      ${hasSavedData()?'<div class="q-util"><button type="button" class="btn btn-ghost btn-sm" id="q-clear">Clear everything &amp; start over</button></div>':''}
    </div>

    <!-- 2 · You -->
    <div class="q-step" data-step="1">
      <div class="q-emojihead">🧍</div>
      <h2>A little about you</h2>
      <div class="q-why">We use this to size portions — never to judge. Friendly numbers only.</div>
      <div class="q-fields" style="margin-bottom:18px">
        <div class="field"><label>Age</label>
          <div class="stepper" data-step-min="14" data-step-max="99"><button type="button" data-dir="-1" aria-label="less">−</button><span class="val" id="q-age">${Number(p.age)||32}</span><button type="button" data-dir="1" aria-label="more">＋</button></div></div>
        <div class="field"><label>Household size</label>
          <div class="stepper" data-step-min="1" data-step-max="8"><button type="button" data-dir="-1" aria-label="less">−</button><span class="val" id="q-people">${Number(p.people)||1}</span><button type="button" data-dir="1" aria-label="more">＋</button></div></div>
      </div>
      <div class="q-fields">
        <div class="field"><label for="q-weight">Weight (kg)</label><input class="input" id="q-weight" type="number" value="${p.weight}" placeholder="64"></div>
        <div class="field"><label for="q-height">Height (cm)</label><input class="input" id="q-height" type="number" value="${p.height}" placeholder="168"></div>
      </div>
      <div class="field" style="margin-top:16px"><label for="q-gender">Gender</label>
        <select class="select" id="q-gender">
          <option value="female" ${sel('female',p.gender)}>Female</option>
          <option value="male" ${sel('male',p.gender)}>Male</option>
          <option value="other" ${sel('other',p.gender)}>Other / prefer not to say</option>
        </select></div>
      <p class="q-why" style="margin-top:16px">Weight, height & age let us estimate your calorie target — leave blank to skip.</p>
    </div>

    <!-- 3 · Rhythm -->
    <div class="q-step" data-step="2">
      <div class="q-emojihead">🏃</div>
      <h2>Your rhythm</h2>
      <div class="q-why">Busy weeks get quicker meals; active weeks get bigger portions.</div>
      <div class="field"><label for="q-lifeStage">Life stage</label>
        <select class="select" id="q-lifeStage">
          <option value="student" ${sel('student',p.lifeStage)}>Student (quick & cheap)</option>
          <option value="working" ${sel('working',p.lifeStage)}>Working adult</option>
          <option value="parent" ${sel('parent',p.lifeStage)}>Parent / family</option>
          <option value="flexible" ${sel('flexible',p.lifeStage)}>Plenty of time to cook</option>
        </select></div>
      <div class="q-fields" style="margin-top:16px">
        <div class="field"><label for="q-sport">Main activity</label>
          <select class="select" id="q-sport">
            <option value="none" ${sel('none',p.sport)}>None</option>
            <option value="running" ${sel('running',p.sport)}>Running / cardio</option>
            <option value="gym" ${sel('gym',p.sport)}>Gym / weights</option>
            <option value="team" ${sel('team',p.sport)}>Team sport</option>
            <option value="yoga" ${sel('yoga',p.sport)}>Yoga / pilates</option>
          </select></div>
        <div class="field"><label for="q-frequency">Times per week</label>
          <input class="input" id="q-frequency" type="number" min="0" max="14" value="${p.frequency}" placeholder="3"></div>
      </div>
    </div>

    <!-- 4 · Goal -->
    <div class="q-step" data-step="3">
      <div class="q-emojihead">🎯</div>
      <h2>What are you hoping for?</h2>
      <div class="q-why">Guides your portions and the courses you get — change it anytime.</div>
      <div class="goal-grid" id="q-goals">
        ${GOAL_CARDS.map(g=>`<div class="goal ${g.key===p.goal?'on':''}" data-goal="${g.key}">
          <div class="g-em">${g.emoji}</div><div class="g-t">${g.title}</div><div class="g-s">${g.sub}</div></div>`).join('')}
      </div>
    </div>

    <!-- 5 · Tastes -->
    <div class="q-step" data-step="4">
      <div class="q-emojihead">😋</div>
      <h2>How do you like to eat?</h2>
      <div class="q-why">The tastier your week, the more you'll actually cook it.</div>
      <div class="field" style="margin-bottom:20px"><label>Breakfast mood</label>
        ${chipRow('q-breakfast',BREAKFAST_OPTIONS,[p.breakfastPref])}</div>
      <div class="field" style="margin-bottom:20px"><label>Cuisines you love</label>
        ${chipRow('q-cuisines',CUISINE_OPTIONS,p.cuisines)}</div>
      <div class="field" style="margin-bottom:20px"><label>Quick dislikes <span class="hint">(tap to toggle)</span></label>
        ${chipRow('q-dislikes',DISLIKE_OPTIONS,p.dislikes)}</div>
      <div class="field" style="margin-bottom:20px"><label>Allergies <span class="hint">(strictly excluded)</span></label>
        ${chipRow('q-allergies',ALLERGY_OPTIONS,p.allergies)}</div>
      <div class="field"><label for="q-avoid">Anything else to avoid <span class="hint">(free text)</span></label>
        <textarea class="input" id="q-avoid" placeholder="e.g. no pork, hate coriander, lactose-free">${p.avoidText||''}</textarea></div>
    </div>

    <!-- 6 · Kitchen -->
    <div class="q-step" data-step="5">
      <div class="q-emojihead">🍳</div>
      <h2>You in the kitchen</h2>
      <div class="q-why">So the recipes match your time and confidence — no stress.</div>
      <div class="slider-block"><div class="sl-head"><b>Cooking confidence</b><span class="sl-val" id="q-cook-val">${p.cookingLevel}/10</span></div>
        <input class="slider" id="q-cook" type="range" min="1" max="10" value="${p.cookingLevel}"></div>
      <div class="slider-block"><div class="sl-head"><b>Time per meal</b><span class="sl-val" id="q-time-val">${p.timePerMeal} min</span></div>
        <input class="slider" id="q-time" type="range" min="10" max="90" step="5" value="${p.timePerMeal}"></div>
      <label class="q-check" style="margin-top:18px"><input type="checkbox" id="q-leftovers" ${p.leftovers?'checked':''}>
        <span><b>Cook once, eat twice</b> <span class="hint">— reuse some dinners as next-day lunch (less cooking, less waste)</span></span></label>
      <div class="field" style="margin-top:18px"><label>Already in your cupboard <span class="hint">(we'll leave these off the shopping list)</span></label>
        ${chipRow('q-pantry',PANTRY_OPTIONS,p.pantry)}</div>
    </div>

    <!-- 7 · Numbers -->
    <div class="q-step" data-step="6">
      <div class="q-emojihead">📊</div>
      <h2>Your numbers, sound right?</h2>
      <div class="q-why">We worked these out for you — nudge anything that feels off.</div>
      <div class="q-target"><div class="big" id="q-target-num">~2,430</div><div class="cap" id="q-target-cap">kcal a day</div></div>
      <div class="slider-block"><div class="sl-head"><b>Breakfast</b><span class="sl-val" id="q-split-breakfast-val"></span></div>
        <input class="slider" id="q-split-breakfast" type="range" min="10" max="45" value="${split.breakfast}"></div>
      <div class="slider-block"><div class="sl-head"><b>Lunch</b><span class="sl-val" id="q-split-lunch-val"></span></div>
        <input class="slider" id="q-split-lunch" type="range" min="20" max="55" value="${split.lunch}"></div>
      <div class="slider-block"><div class="sl-head"><b>Dinner</b><span class="sl-val" id="q-split-dinner-val"></span></div>
        <input class="slider" id="q-split-dinner" type="range" min="20" max="55" value="${split.dinner}"></div>
      <div class="slider-block"><div class="sl-head"><b>Budget</b><span class="sl-val" id="q-budget-val">€${p.budgetPerDay} / day</span></div>
        <input class="slider" id="q-budget" type="range" min="5" max="40" value="${p.budgetPerDay}"></div>
      <div class="field" style="margin-top:16px"><label for="q-city">City <span class="hint">(optional — for prices; we assume Paris)</span></label>
        <input class="input" id="q-city" value="${p.city}" placeholder="Paris, France"></div>
    </div>

    <!-- 8 · Connect -->
    <div class="q-step" data-step="7">
      <div class="q-emojihead">🔗</div>
      <h2>Want a little help remembering?</h2>
      <div class="q-why">Totally optional. Skip it now, add it later — no pressure, ever.</div>
      <div class="connect-cards">
        <div class="connect"><div class="ic cal">📅</div><div class="c-body"><b>Google Calendar</b>
          <p>Your dinners and shopping reminders, right where you already look.</p>
          <span class="badge badge-basil">Coming soon</span></div></div>
        <div class="connect"><div class="ic bell">🔔</div><div class="c-body"><b>Shopping reminders</b>
          <p>A gentle nudge on shopping days — "tonight, buy for tomorrow."</p>
          <span class="badge badge-honey">Coming soon</span></div></div>
      </div>
      <label class="q-check" style="margin-top:22px"><input type="checkbox" id="q-useAI" ${state.useAI?'checked':''}>
        <span><b>Let AI fill any gaps</b> <span class="hint">— your week always comes from the cookbook first. This only steps in on the rare day the cookbook can't find something new, and it also powers looking up a dish you add yourself. Uses a few of your 20 free lookups a day.</span></span></label>
    </div>

    <div class="q-foot">
      <button type="button" class="q-back" id="q-back" style="visibility:hidden">← Back</button>
      ${state.week.length?'<button type="button" class="btn btn-secondary" id="q-save">Save changes</button>':''}
      <button type="button" class="btn btn-primary" id="q-next">Continue</button>
    </div>
  </div>`;

  // --- wizard navigation state ---
  let cur=0;
  const steps=[...app.querySelectorAll('.q-step')];
  const dots=[...app.querySelectorAll('#q-dots i')];
  const backBtn=document.getElementById('q-back');
  const nextBtn=document.getElementById('q-next');
  function showStep(i){
    cur=Math.max(0,Math.min(Q_STEPS-1,i));
    steps.forEach((s,idx)=>s.classList.toggle('on',idx===cur));
    dots.forEach((dt,idx)=>{ dt.className=idx<cur?'done':(idx===cur?'on':''); });
    document.getElementById('q-count').textContent=`Step ${cur+1} of ${Q_STEPS}`;
    backBtn.style.visibility=cur===0?'hidden':'visible';
    nextBtn.textContent=cur===Q_STEPS-1?(state.week.length?'Save & re-plan week 🔄':'Plan my first week 🎉'):'Continue';
    if(cur===6) refreshNumbers();          // recompute target when the Numbers step opens
    window.scrollTo(0,0);
  }

  // --- read the whole wizard into a profile object (used to persist + compute live) ---
  function readWizard(){
    const val=id=>document.getElementById(id)?.value;
    const stepInt=id=>Number(document.getElementById(id)?.textContent)||0;
    const chosen=sel=>[...app.querySelectorAll(sel+' .chip.selected')].map(c=>c.dataset.v);
    const bpd=Number(val('q-budget'))||0;
    return {
      name:(val('q-name')||'').trim(),
      weight:val('q-weight'), height:val('q-height'),
      age:String(stepInt('q-age')||''),
      gender:val('q-gender'),
      people:Math.min(8,Math.max(1,stepInt('q-people')||1)),
      lifeStage:val('q-lifeStage'), sport:val('q-sport'),
      frequency:Number(val('q-frequency'))||0,
      goal:app.querySelector('#q-goals .goal.on')?.dataset.goal||'maintain',
      breakfastPref:app.querySelector('#q-breakfast .chip.selected')?.dataset.v||'surprise',
      cuisines:chosen('#q-cuisines'),
      dislikes:chosen('#q-dislikes'), allergies:chosen('#q-allergies'), pantry:chosen('#q-pantry'),
      avoidText:val('q-avoid'),
      cookingLevel:Number(val('q-cook')),
      timePerMeal:Number(val('q-time')),
      leftovers:document.getElementById('q-leftovers').checked,
      mealSplit:{ breakfast:Number(val('q-split-breakfast')), lunch:Number(val('q-split-lunch')), dinner:Number(val('q-split-dinner')) },
      budgetPerDay:bpd,
      budget:String(Math.round(bpd*7)),   // legacy weekly value keeps the shopping screen working until Phase 8
      city:val('q-city'),
    };
  }
  function persist(){ state.profile=readWizard(); saveState(); }   // §6: save at each step

  // --- Numbers step: live calorie target + per-meal kcal from the split ---
  function refreshNumbers(){
    const cur=readWizard();
    const t=computeTargets(cur);
    const numEl=document.getElementById('q-target-num'), capEl=document.getElementById('q-target-cap');
    if(t){ numEl.textContent='~'+t.kcal.toLocaleString('en-US'); capEl.textContent=`kcal a day · ${goalWord(cur.goal)} · ${t.protein} g protein`; }
    else { numEl.textContent='—'; capEl.textContent='Add age, height & weight for a calorie estimate'; }
    const per=computeMealTargets(cur);
    ['breakfast','lunch','dinner'].forEach(m=>{
      const v=Number(document.getElementById('q-split-'+m).value);
      document.getElementById('q-split-'+m+'-val').textContent = per ? per[m]+' kcal' : v+'%';
    });
  }

  // --- bindings ---
  app.querySelectorAll('.stepper').forEach(st=>{
    const valEl=st.querySelector('.val'); const lo=Number(st.dataset.stepMin), hi=Number(st.dataset.stepMax);
    st.querySelectorAll('button').forEach(b=>b.onclick=()=>{
      let n=Number(valEl.textContent)+Number(b.dataset.dir);
      valEl.textContent=Math.max(lo,Math.min(hi,n));
    });
  });
  app.querySelectorAll('#q-goals .goal').forEach(g=>g.onclick=()=>{
    app.querySelectorAll('#q-goals .goal').forEach(x=>x.classList.remove('on')); g.classList.add('on');
  });
  // single-select chip group (breakfast); the rest are multi-select toggles
  app.querySelectorAll('#q-breakfast .chip').forEach(c=>c.onclick=()=>{
    app.querySelectorAll('#q-breakfast .chip').forEach(x=>x.classList.remove('selected')); c.classList.add('selected');
  });
  ['#q-cuisines','#q-dislikes','#q-allergies','#q-pantry'].forEach(grp=>
    app.querySelectorAll(grp+' .chip').forEach(c=>c.onclick=()=>c.classList.toggle('selected')));
  const cook=document.getElementById('q-cook');
  cook.oninput=()=>document.getElementById('q-cook-val').textContent=cook.value+'/10';
  const time=document.getElementById('q-time');
  time.oninput=()=>document.getElementById('q-time-val').textContent=time.value+' min';
  ['q-split-breakfast','q-split-lunch','q-split-dinner'].forEach(id=>
    document.getElementById(id).oninput=refreshNumbers);
  const budget=document.getElementById('q-budget');
  budget.oninput=()=>document.getElementById('q-budget-val').textContent='€'+budget.value+' / day';
  document.getElementById('q-useAI').onchange=(e)=>{ state.useAI=e.target.checked; saveState(); };

  const clearBtn=document.getElementById('q-clear');
  if(clearBtn) clearBtn.onclick=()=>{ if(confirm("Clear your saved answers, your week and your favourites? This can't be undone.")) clearAllData(); };
  const signOutBtn=document.getElementById('q-signout');
  if(signOutBtn) signOutBtn.onclick=async()=>{ try{ await window.Cloud.signOut(); }catch(e){ console.warn('Sign out failed:', e&&e.message); } };

  backBtn.onclick=()=>{ persist(); showStep(cur-1); };
  // Edit mode ("Save changes"): keep the current week, just save the tweaked profile and go back.
  const saveBtn=document.getElementById('q-save');
  if(saveBtn) saveBtn.onclick=()=>{ persist(); showToast('✓ Saved'); setScreen('review'); };
  nextBtn.onclick=async()=>{
    persist();
    if(cur<Q_STEPS-1){ showStep(cur+1); return; }
    await planWeek();   // finish (first week) OR "Save & re-plan" for an existing profile
  };

  showStep(0);
}

/* ----- Screen 2: review ----- */
function nutriBadges(r){
  let out='';
  if(typeof r.kcal==='number') out+=`<span class="badge kcal">🔥 ${r.kcal} kcal</span>`;
  if(typeof r.protein==='number') out+=`<span class="badge kcal">💪 ${r.protein} g protein</span>`;
  return out;
}
// "Lunch · Starter" when the slot is a side course; just "Lunch" for a main/breakfast.
function mealTypeLabel(meal){
  const c=meal.course; const cl=(c&&c!=='main'&&c!=='single')?' · '+COURSE_LABEL[c]:'';
  return meal.type+cl;
}
// Difficulty as 4 dots (filled = harder) — §3: "not the word." Shared by every card.
function diffDots(n){
  const d=Math.max(1,Math.min(4,Number(n)||1));
  return `<span class="diff-dots" aria-label="Difficulty ${d} of 4">${'●'.repeat(d)}${'○'.repeat(4-d)}</span>`;
}
// €/serving in --gold-deep, only when at least one ingredient actually has a price (real or estimated).
// EXCEPTION for §0.7 user-added dishes: they must be priced in FULL or not at all. §0.4's table
// covers the 172 ingredients the shipped dishes use, so a dish the user added can easily contain
// something unpriced — and a chicken curry reading "€0.27 / serving" because two of its four lines
// silently cost €0 is a lie, not an estimate. Shipped dishes are unaffected (§0.4 verified all 57
// price every ingredient), and the verified AI-ON path is deliberately left on the lenient rule.
function priceLabel(r){
  if(!r||!r.ingredients||!r.ingredients.length) return '';
  const n=Math.max(1,peopleCount()||1);
  const prices=r.ingredients.map(priceOf);
  if(isUserDish(r)&&prices.some(p=>!(p>0))) return '';
  const total=prices.reduce((s,p)=>s+p,0);
  if(total<=0) return '';
  return `<span class="card-price">€${(total/n).toFixed(2)} / serving</span>`;
}
// ONE card anatomy for every context (§3): photo on top (background var(--green-wash)),
// ♥ top-right white pill + a caller-supplied corner action bottom-right, Fraunces title,
// desc, then Prep/Cook/Difficulty as three labelled stats — never the old side-by-side
// thumbnail row. `o.cornerBtn` is the ⊕ add (browse) or ✕ swap (plan list) button markup;
// `o.favAttr`/`o.topLabel`/`o.extraBadges`/`o.className`/`o.draggable` let each caller keep
// its own data-attributes and context label without forking the template.
function recipeCardHtml(r,o={}){
  if(!r) return '';
  const img=dishImageUrl(r);
  const photo=img?`<img src="${img}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'emoji-fill big',textContent:'${r.emoji||'🍽️'}'}))">`
    :`<div class="emoji-fill big">${r.isLeftover?'♻️':(r.emoji||'🍽️')}</div>`;
  const favBtn=o.showFav===false?'':`<button class="icon-btn fav ${isFavorite(r.name)?'on':''}" ${o.favAttr||''} title="Save as favourite">${isFavorite(r.name)?'♥':'♡'}</button>`;
  const prep=(typeof r.prepTime==='number')?r.prepTime:null;
  const cook=(typeof r.cookTime==='number')?r.cookTime:null;
  const stat=(label,val)=>`<div class="card-stat"><span class="stat-label">${label}</span><span class="stat-val">${val}</span></div>`;
  const stats=(prep!==null||cook!==null)
    ? `${prep!==null?stat('Prep',prep+' min'):''}${cook!==null?stat('Cook',cook+' min'):''}${stat('Difficulty',diffDots(r.difficulty))}`
    : `${stat('Time',r.time+' min')}${stat('Difficulty',diffDots(r.difficulty))}`;
  const passive=(typeof r.passiveTime==='number'&&r.passiveTime>0)?r.passiveTime:0;
  const passiveNote=passive?`<div class="card-passive">+ ${passive>=60?Math.round(passive/60)+' h':passive+' min'} chilling/marinating</div>`:'';
  return `<article class="recipe-card ${o.className||''}" ${o.draggable?`draggable="true" data-rid="${r.id}"`:''}>
    <div class="photo">${photo}${favBtn}${o.cornerBtn||''}</div>
    <div class="body">
      ${o.topLabel?`<span class="cat">${o.topLabel}</span>`:''}
      <h3 class="title">${r.name}</h3>
      ${r.desc?`<div class="desc">${r.desc}</div>`:''}
      <div class="card-stats">${stats}</div>
      ${passiveNote}
      ${priceLabel(r)}
      ${o.extraBadges?`<div class="card-extra">${o.extraBadges}</div>`:''}
    </div>
  </article>`;
}
function dayKcal(day){
  let sum=0, any=false;
  day.meals.forEach(m=>{ if(!m.rejected&&m.recipe&&typeof m.recipe.kcal==='number'){ sum+=m.recipe.kcal; any=true; } });
  return any?sum:null;
}
/* ---- planner v2 (design 04): week rail + "Plan for me" / "Browse & add" modes ---- */
function showToast(msg){
  const t=document.createElement('div'); t.className='copied-toast'; t.textContent=msg;
  document.body.appendChild(t); setTimeout(()=>t.remove(),2000);
}
// a small square thumbnail for the rail (photo, else emoji tile)
// Household cost of one day, matching how the shopping list counts: leftovers cost nothing
// extra (already bought with the original dish), and priceOf() falls back to the estimate table.
function dayCost(day){
  let sum=0;
  day.meals.forEach(m=>{
    if(m.rejected||!m.recipe||m.recipe.isLeftover) return;
    (m.recipe.ingredients||[]).forEach(i=>{ sum+=priceOf(i); });
  });
  return sum;
}
// "13–19 Jul" for the sidebar header, from the upcoming Monday the .ics export already uses.
function weekLabel(){
  const mon=weekMonday(); const sun=new Date(mon.getFullYear(),mon.getMonth(),mon.getDate()+6);
  const m=d=>d.toLocaleDateString('en-GB',{month:'short'});
  return mon.getMonth()===sun.getMonth()
    ? `${mon.getDate()}–${sun.getDate()} ${m(sun)}`
    : `${mon.getDate()} ${m(mon)} – ${sun.getDate()} ${m(sun)}`;
}
// One dish inside a sidebar day (V4 §5): photo + name on one line, then ♥ and ✕ directly
// under the name. Tapping the photo/name area opens the detail overlay; ♥ favourites; ✕ swaps.
function railDishRow(meal,di,mi){
  const r=meal.recipe; if(!r) return '';
  const img=dishImageUrl(r);
  const thumb=img?`<img src="${img}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'emoji-fill',textContent:'${r.isLeftover?'♻️':(r.emoji||'🍽️')}'}))">`
    :`<div class="emoji-fill">${r.isLeftover?'♻️':(r.emoji||'🍽️')}</div>`;
  const course=(meal.course&&meal.course!=='main'&&meal.course!=='single')?`<span class="dr-course">${COURSE_LABEL[meal.course]||meal.course}</span>`:'';
  const fav=isFavorite(r.name);
  // NB: dr-main is a DIV, not a button — the ♥/✕ buttons live inside it and nested <button>s
  // are invalid HTML (the browser would reparent them out). Click/keyboard handled in JS.
  return `<div class="dish-row ${meal.rejected?'rejected':''}" data-drop-slot="${di}-${mi}">
    <div class="dr-main" data-open="${di}-${mi}" role="button" tabindex="0" title="See ${r.name}">
      <span class="dr-thumb">${thumb}</span>
      <span class="dr-text"><span class="dr-name">${r.name}</span>${course}
        <span class="dr-actions">
          <button class="dr-fav ${fav?'on':''}" data-fav="${di}-${mi}" title="Save as favourite" aria-label="Save ${r.name} as favourite">${fav?'♥':'♡'}</button>
          <button class="dr-swap" data-swap="${di}-${mi}" title="Swap this dish" aria-label="Swap ${r.name}">✕</button>
        </span>
      </span>
    </div>
  </div>`;
}
// A day's dishes grouped by meal type: BREAKFAST / LUNCH / DINNER header once (bold, display
// font), all that type's dishes beneath it. §5's requested structure.
function railDayDishes(day,di){
  const groups={};
  day.meals.forEach((m,mi)=>{ if(m.recipe) (groups[m.type]??=[]).push({m,mi}); });
  const order=['breakfast','lunch','dinner'];
  return order.filter(t=>groups[t]).map(t=>{
    const rows=groups[t].map(({m,mi})=>railDishRow(m,di,mi)).join('');
    // a slim ＋ target under each meal group: drop here to ADD a dish to this meal (§6)
    const add=`<div class="group-add" data-add-group="${di}|${t}" title="Drop a dish here to add it to ${t}">＋</div>`;
    return `<div class="meal-group"><div class="meal-type">${t}</div>${rows}${add}</div>`;
  }).join('');
}
function railHtml(){
  let rows='';
  state.week.forEach((day,di)=>{
    const kc=dayKcal(day);
    const cost=dayCost(day);
    const dishes=railDayDishes(day,di);
    const empty=day.meals.some(m=>m.recipe)?'':`<div class="slot empty" data-add-day="${di}" title="Nothing planned — browse dishes on the right">＋</div>`;
    rows+=`<div class="day-row" data-drop-day="${di}">
      <div class="dh"><b>${day.day}</b><span class="kcal">${kc?kc.toLocaleString('en-US')+' kcal':'—'}${cost>0?` · €${cost.toFixed(2)}`:''}</span></div>
      <div class="dishes">${dishes}${empty}</div>
    </div>`;
  });
  // The ‹ › arrows are deliberately disabled: the app plans exactly one week at a time, so there
  // is no previous/next week to move to yet. Rendering them disabled (rather than omitting them)
  // keeps the §2 layout shape and matches the "Coming soon" convention used in the questionnaire.
  return `<aside class="rail">
    <div class="rail-head">
      <button class="wk-arrow" disabled title="Only the current week is planned for now">‹</button>
      <span class="wk-label">${weekLabel()}</span>
      <button class="wk-arrow" disabled title="Only the current week is planned for now">›</button>
    </div>
    <div class="sub">Drag a dish from the right onto a day, or tap one to see the recipe.</div>
    ${rows}</aside>`;
}
/* ============================================================
   §4: Browse filters — pill row above the carousels.
   Combine with AND across the three groups below; OR within a group (tick chicken + beef
   to see either). "My saved" and the profile's allergies/dislikes are never filterable away —
   the allergy/dislike check always runs regardless of what's ticked in the filter row.
   ============================================================ */
const DIETARY_OPTIONS = [
  {v:'vegetarian', label:'Vegetarian'},
  {v:'vegan',      label:'Vegan'},
  {v:'fish-free',  label:'Fish-free'},
  {v:'dairy-free', label:'Dairy-free'},
  {v:'gluten-free',label:'Gluten-free'},
];
const INGREDIENT_OPTIONS = [
  {v:'chicken', label:'Chicken'}, {v:'beef', label:'Beef'}, {v:'fish', label:'Fish'},
  {v:'pasta', label:'Pasta'}, {v:'rice', label:'Rice'}, {v:'veg', label:'Veg'},
];
const MEALTYPE_OPTIONS = [
  {v:'breakfast', label:'Breakfast'}, {v:'lunch', label:'Lunch'}, {v:'dinner', label:'Dinner'},
  {v:'starter', label:'Starter'}, {v:'dessert', label:'Dessert'},
];
// Same allergen rules passesDietFilters() trusts for real generation (contains[] first,
// legacy regex fallback) — reused read-only here so the "-free" filter chips agree with it.
function dishHasAllergen(r,allergen){
  if(Array.isArray(r.contains)) return r.contains.includes(allergen);
  if(allergen==='fish') return r.tags.includes('fish');
  if(allergen==='dairy') return r.ingredients.some(i=>i.category==='Dairy');
  if(allergen==='gluten') return r.ingredients.some(i=>/bread|pasta|tortilla|pizza|granola|oats|noodle|couscous|bagel|pita|muesli|flour|bun/.test(i.name.toLowerCase()));
  return false;
}
function matchesDietary(r,key){
  if(key==='vegetarian') return r.tags.includes('vegetarian');
  if(key==='vegan') return r.tags.includes('vegan');
  if(key==='fish-free') return !dishHasAllergen(r,'fish');
  if(key==='dairy-free') return !dishHasAllergen(r,'dairy');
  if(key==='gluten-free') return !dishHasAllergen(r,'gluten');
  return true;
}
function matchesIngredient(r,key){
  const names=r.ingredients.map(i=>i.name.toLowerCase());
  if(key==='veg') return r.tags.includes('vegetarian');
  if(key==='fish') return r.tags.includes('fish')||names.some(n=>n.includes('fish'));
  if(key==='pasta') return names.some(n=>/pasta|spaghetti|orzo|penne|ditalini|noodle/.test(n));
  if(key==='rice') return names.some(n=>/\brice\b/.test(n)&&!/rice wine|rice noodle|rice paper/.test(n));
  return names.some(n=>n.includes(key));   // chicken, beef
}
function matchesMealType(r,key){ return dishRoles(r).includes(key); }
// Applies the whole browseFilters state (AND across groups, OR within a group) to a pool,
// on top of the profile's allergies/dislikes — those are never filterable away.
function applyBrowseFilters(list){
  const f=state.browseFilters;
  let out=list.filter(r=>passesDietFilters(r,state.profile||{dislikes:[],allergies:[]}));
  if(f.saved){ const names=new Set(state.favorites.map(x=>x.name)); out=out.filter(r=>names.has(r.name)); }
  if(f.dietary.length) out=out.filter(r=>f.dietary.every(k=>matchesDietary(r,k)));
  if(f.ingredient.length) out=out.filter(r=>f.ingredient.some(k=>matchesIngredient(r,k)));
  if(f.mealType.length) out=out.filter(r=>f.mealType.some(k=>matchesMealType(r,k)));
  return out;
}
function browseFiltersActive(){
  const f=state.browseFilters;
  return f.saved||f.dietary.length||f.ingredient.length||f.mealType.length;
}
// browse card (recipe-card token markup) — draggable, with ⊕ add + ♥ fav
function browseCard(r){
  return recipeCardHtml(r,{
    draggable:true,
    topLabel:r.type,
    favAttr:`data-bfav="${r.id}"`,
    cornerBtn:`<button class="icon-btn add" data-badd="${r.id}" title="Add to a day">＋</button>`,
  });
}
function carousel(title,list){
  if(!list.length) return '';
  return `<div class="cat-block"><div class="cat-head"><h3>${title}</h3></div>
    <div class="carousel">${list.map(browseCard).join('')}</div></div>`;
}
function findBrowseRecipe(id){
  return [...DB(),...RECIPES,...STARTERS,...DESSERTS,...state.favorites].find(r=>String(r.id)===String(id));
}
// ---- V4 §6: drag (and tap) a dish into ANY slot on ANY day ----
// A slot's `type` is the PLACEMENT (which meal it shows under); a dish's own `recipe.type`
// is its nature and is never rewritten — a dessert dropped on breakfast is still a dessert in
// the database, it just sits in the breakfast slot. `manual:true` marks a hand-placed slot so
// enforceNoRepeat leaves a deliberate duplicate alone.
function naturalMeal(recipe){
  return (recipe.type==='breakfast'||recipe.type==='lunch'||recipe.type==='dinner')?recipe.type:'dinner';
}
// A leftover lunch reheats a doubled dinner main. If that leftover slot is removed/replaced, its
// source is still bought 2× → un-double it so the shopping list doesn't over-buy (V4 §6.3).
function undoubleSourceFor(leftoverRecipe){
  const srcName=String(leftoverRecipe&&leftoverRecipe.name||'').replace(/^Leftover /,'');
  for(const day of state.week) for(const m of day.meals){
    if(m.recipe&&m.recipe.batchNote&&m.recipe.name===srcName){
      m.recipe.ingredients=(m.recipe.ingredients||[]).map(i=>({...i,qty:i.qty/2,
        ...(typeof i.price==='number'?{price:i.price/2}:{})}));
      m.recipe.batchNote=false; return;
    }
  }
}
// The one place a dish is put down. `opts.slotMi` → replace that slot (keep its placement type);
// `opts.mealType` → append a new slot under that meal; neither → natural meal. Refuses (and
// says why) when the dish clashes with the profile's allergies/dislikes (§00.4 rule 2).
function placeDishAt(recipe,di,opts={}){
  const day=state.week[di]; if(!day||!recipe) return false;
  if(!passesDietFilters(recipe,state.profile)){ showToast(`✕ ${recipe.name} clashes with what you can't eat`); return false; }
  const scaled=scaleRecipe({...recipe},peopleCount());
  if(typeof opts.slotMi==='number' && day.meals[opts.slotMi]){
    const slot=day.meals[opts.slotMi];
    if(slot.recipe&&slot.recipe.isLeftover) undoubleSourceFor(slot.recipe);
    slot.recipe=scaled; slot.rejected=false; slot.manual=true;      // slot.type (placement) kept
  } else {
    day.meals.push({type:opts.mealType||naturalMeal(recipe),course:'main',recipe:scaled,rejected:false,manual:true});
  }
  saveState(); showToast(`✓ ${recipe.name} → ${day.day}`); renderPlanner();
  return true;
}
// Move an existing slot to another day/slot (source empties). Leftover reheated dishes aren't
// moveable — they're derived from a dinner main, not standalone.
function moveSlot(fromDi,fromMi,toDi,opts={}){
  const from=state.week[fromDi]&&state.week[fromDi].meals[fromMi];
  if(!from||!from.recipe) return false;
  if(from.recipe.isLeftover){ showToast('Leftovers follow their dinner — swap the dinner instead'); return false; }
  if(fromDi===toDi && opts.slotMi===fromMi) return false;          // dropped on itself
  const recipe=from.recipe;
  // clear the source first so a same-day move doesn't collide with its own index
  from.recipe=null; from.rejected=false; from.manual=false;
  const ok=placeDishAt(recipe,toDi,opts);
  if(!ok){ from.recipe=recipe; return false; }                     // blocked → put it back
  // drop now-empty source slots so the day doesn't show a hole (keep at least the shape)
  state.week[fromDi].meals=state.week[fromDi].meals.filter(m=>m.recipe);
  saveState(); renderPlanner();
  return true;
}
// A drop payload is "rid:<id>" (copy from browse) or "slot:<di>-<mi>" (move within the plan).
function applyDrop(data,toDi,opts={}){
  if(!data) return;
  if(data.startsWith('slot:')){
    const [fromDi,fromMi]=data.slice(5).split('-').map(Number);
    moveSlot(fromDi,fromMi,toDi,opts);
  } else {
    const id=data.startsWith('rid:')?data.slice(4):data;
    const r=findBrowseRecipe(id); if(r) placeDishAt(r,toDi,opts);
  }
}
// Two-step picker (the tap path for phones, where HTML5 drag doesn't work — V4 §6.2):
// pick a day, then pick which meal it goes in.
function openDayPicker(recipe,anchor){
  document.querySelectorAll('.day-picker').forEach(el=>el.remove());
  const menu=document.createElement('div'); menu.className='day-picker';
  const dayStep=()=>{ menu.innerHTML=`<div class="dp-head">Add “${recipe.name}” to which day?</div>`+
      state.week.map((d,di)=>`<button data-pick-day="${di}">${d.day}</button>`).join('');
    menu.querySelectorAll('[data-pick-day]').forEach(b=>b.onclick=()=>mealStep(Number(b.dataset.pickDay))); };
  const mealStep=(di)=>{ menu.innerHTML=`<div class="dp-head">${state.week[di].day} — which meal?</div>`+
      ['breakfast','lunch','dinner'].map(t=>`<button data-pick-meal="${t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')+
      `<button class="dp-back" data-back>← back</button>`;
    menu.querySelectorAll('[data-pick-meal]').forEach(b=>b.onclick=()=>{ placeDishAt(recipe,di,{mealType:b.dataset.pickMeal}); menu.remove(); });
    menu.querySelector('[data-back]').onclick=dayStep;
    position(); };
  const position=()=>{ const r=anchor.getBoundingClientRect();
    menu.style.top=(window.scrollY+r.bottom+6)+'px';
    menu.style.left=Math.min(window.scrollX+r.left, window.scrollX+window.innerWidth-menu.offsetWidth-12)+'px'; };
  dayStep(); document.body.appendChild(menu); position();
  const close=(e)=>{ if(!menu.contains(e.target)){ menu.remove(); document.removeEventListener('click',close); } };
  setTimeout(()=>document.addEventListener('click',close),0);
}
// legacy call sites (empty-day nudge) still use addDishToDay → natural meal
function addDishToDay(recipe,di){ return placeDishAt(recipe,di); }
// The target banner + honest notices that used to sit above the week's day-blocks.
// The day-blocks themselves are gone (§2 — the week now lives in the sidebar), so these
// ride at the top of the main column instead.
function plannerNoticesHtml(){
  const tgt=computeTargets(state.profile);
  let html='';
  if(tgt){
    const per=computeMealTargets(state.profile);
    const perLine=per?` <span class="hint">· roughly ${per.breakfast} / ${per.lunch} / ${per.dinner} kcal across breakfast, lunch & dinner</span>`:'';
    html+=`<div class="target-banner"><div class="tgt-ico">🎯</div>
      <div><div class="tgt-main">Your daily target: ~${tgt.kcal} kcal · ${tgt.protein} g protein <span class="hint">per person</span></div>
      <div class="tgt-sub">Worked out from your height, weight, age and how active you are.${perLine}</div></div></div>`;
  }
  if(state.usedFallback)html+=`<div class="notice">⚠️ We couldn't reach the kitchen just now, so this week comes straight from the cookbook — without prices or your budget.</div>`;
  else if(state.partialAI)html+=`<div class="notice">ℹ️ Only part of the week came back this time, so the later days are from the cookbook. Re-plan whenever you'd like to try again.</div>`;
  else if(!state.useAI)html+=`<div class="notice info">ℹ️ This week comes from the cookbook. If a week ever can't be filled without repeating, tick "Let AI fill any gaps" in your answers.</div>`;
  // Be honest when the built-in recipe book simply can't fill the week without repeating —
  // even with AI on, since AI is only asked to top up specific gaps, not author the week.
  if(state.repeatedDishes&&state.repeatedDishes.length){
    const many=state.repeatedDishes.length===1?'one dish repeats':state.repeatedDishes.length+' dishes repeat';
    const suggestion=state.useAI
      ? `We tried to find something new for those slots and came up short this time — re-plan to try again.`
      : `Ticking <b>"Let AI fill any gaps"</b> in your answers lets us go looking for something new.`;
    html+=`<div class="notice">🔁 What you can and can't eat leaves us a small handful of dishes to work with, so ${many} this week (${state.repeatedDishes.join(', ')}). ${suggestion}</div>`;
  }
  return html;
}
// The filter row: All filters (opens a sheet with everything) · My saved (toggle) ·
// Dietary ▾ / Ingredient ▾ / Meal type ▾ (each opens a small checklist popover) · Clear all.
function filterCount(){ const f=state.browseFilters; return f.dietary.length+f.ingredient.length+f.mealType.length+(f.saved?1:0); }
function filterRowHtml(){
  const n=filterCount();
  return `<div class="filter-row">
    <button class="chip filter-chip" id="allFiltersBtn">☰ All filters${n?` (${n})`:''}</button>
    <button class="chip filter-chip ${state.browseFilters.saved?'selected':''}" data-toggle-saved>My saved</button>
    ${filterDropdownBtn('dietary','Dietary',DIETARY_OPTIONS)}
    ${filterDropdownBtn('ingredient','Ingredient',INGREDIENT_OPTIONS)}
    ${filterDropdownBtn('mealType','Meal type',MEALTYPE_OPTIONS)}
    ${browseFiltersActive()?`<button class="chip filter-chip clear" id="clearFiltersBtn">✕ Clear all</button>`:''}
  </div>`;
}
function filterDropdownBtn(group,label,opts){
  const count=state.browseFilters[group].length;
  return `<button class="chip filter-chip ${count?'selected':''}" data-filter-group="${group}">${label} ${count?`(${count})`:''} ▾</button>`;
}
function filterChecklistHtml(group,opts){
  const sel=state.browseFilters[group];
  return opts.map(o=>`<label class="filter-opt"><input type="checkbox" data-filter-value="${group}:${o.v}" ${sel.includes(o.v)?'checked':''}><span>${o.label}</span></label>`).join('');
}
function toggleFilterValue(group,value){
  const arr=state.browseFilters[group];
  const i=arr.indexOf(value);
  if(i===-1)arr.push(value); else arr.splice(i,1);
}
function openFilterPopover(group,anchor){
  document.querySelectorAll('.filter-popover').forEach(el=>el.remove());
  const opts={dietary:DIETARY_OPTIONS,ingredient:INGREDIENT_OPTIONS,mealType:MEALTYPE_OPTIONS}[group];
  const pop=document.createElement('div'); pop.className='filter-popover';
  pop.innerHTML=filterChecklistHtml(group,opts);
  document.body.appendChild(pop);
  const r=anchor.getBoundingClientRect();
  pop.style.top=(window.scrollY+r.bottom+6)+'px';
  pop.style.left=Math.min(window.scrollX+r.left, window.scrollX+window.innerWidth-pop.offsetWidth-12)+'px';
  pop.querySelectorAll('[data-filter-value]').forEach(cb=>cb.onchange=()=>{
    const [g,v]=cb.dataset.filterValue.split(':'); toggleFilterValue(g,v); renderPlanner();
  });
  const close=(e)=>{ if(!pop.contains(e.target)&&e.target!==anchor){ pop.remove(); document.removeEventListener('click',close); } };
  setTimeout(()=>document.addEventListener('click',close),0);
}
function openAllFiltersSheet(){
  const overlay=document.createElement('div');
  overlay.className='sheet-overlay';
  overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true'); overlay.setAttribute('aria-label','All filters');
  function close(){ document.removeEventListener('keydown',onKey); overlay.remove(); }
  function onKey(e){ if(e.key==='Escape')close(); }
  overlay.innerHTML=`<div class="sheet">
    <button class="sheet-close" aria-label="Close">✕</button>
    <div class="sheet-body">
      <h2 class="rname" style="margin-top:0">All filters</h2>
      <label class="filter-opt" style="margin-bottom:14px"><input type="checkbox" id="af-saved" ${state.browseFilters.saved?'checked':''}><span>My saved only</span></label>
      <div class="ing-head">Dietary</div>
      <div class="filter-grid">${filterChecklistHtml('dietary',DIETARY_OPTIONS)}</div>
      <div class="ing-head">Ingredient</div>
      <div class="filter-grid">${filterChecklistHtml('ingredient',INGREDIENT_OPTIONS)}</div>
      <div class="ing-head">Meal type</div>
      <div class="filter-grid">${filterChecklistHtml('mealType',MEALTYPE_OPTIONS)}</div>
      <div class="recipe-actions" style="margin-top:16px">
        <button class="primary" id="af-apply" style="margin-top:0">Show results</button>
        ${browseFiltersActive()?`<button class="ghost" id="af-clear">Clear all</button>`:''}
      </div>
    </div>
  </div>`;
  overlay.addEventListener('click',e=>{ if(e.target===overlay)close(); });
  document.addEventListener('keydown',onKey);
  document.body.appendChild(overlay);
  overlay.querySelector('.sheet-close').onclick=close;
  overlay.querySelector('#af-saved').onchange=(e)=>{ state.browseFilters.saved=e.target.checked; };
  overlay.querySelectorAll('[data-filter-value]').forEach(cb=>cb.onchange=()=>{
    const [g,v]=cb.dataset.filterValue.split(':'); toggleFilterValue(g,v);
  });
  overlay.querySelector('#af-apply').onclick=()=>{ close(); renderPlanner(); };
  const clearBtn=overlay.querySelector('#af-clear');
  if(clearBtn)clearBtn.onclick=()=>{ clearAllFilters(); close(); renderPlanner(); };
}
function clearAllFilters(){ state.browseFilters={saved:false,dietary:[],ingredient:[],mealType:[]}; }

// Per-serving cost of an UNSCALED catalogue dish (ingredients are already per-serving in the
// data model — see recipes-db.js's header comment — so this is just the ingredient sum, no
// household-size division needed the way scaled week recipes need one).
function dishServingCost(r){ return (r.ingredients||[]).reduce((s,i)=>s+priceOf(i),0); }

/* §4 categories — titles are appetising, never a database word (her explicit complaint about
   "Lunch mains"). Every carousel is skipped entirely when empty, and every pool already passes
   through applyBrowseFilters() so filters narrow every section live. */
function browseBodyHtml(){
  const pool=r=>applyBrowseFilters(r);
  const mains=[...DB(),...RECIPES].filter(r=>{const t=dishRoles(r);return t.includes('lunch')||t.includes('dinner');});
  const dinners=[...DB(),...RECIPES].filter(r=>dishRoles(r).includes('dinner'));
  const starters=[...DB(),...STARTERS].filter(r=>dishRoles(r).includes('starter'));
  const desserts=[...DB(),...DESSERTS].filter(r=>dishRoles(r).includes('dessert'));
  const breakfasts=[...DB(),...RECIPES].filter(r=>dishRoles(r).includes('breakfast'));

  const favs=pool(state.favorites.slice().reverse());
  const ownDishes=pool((state.userDishes||[]).filter(d=>d&&d.verified).slice().reverse());
  const weeknight=pool(mains.filter(r=>r.time<=20));
  const budget=pool(dinners.slice().sort((a,b)=>dishServingCost(a)-dishServingCost(b)));
  const freshLight=pool(mains.filter(r=>r.tags.some(t=>['vegetarian','vegan','fish'].includes(t))));
  const claimed=new Set([...weeknight,...budget,...freshLight].map(r=>r.id));
  const comfort=pool(mains.filter(r=>!claimed.has(r.id)));
  const smallPlates=pool(starters);
  const sweetEndings=pool(desserts);
  const bfast=pool(breakfasts);

  // `Your favourites` and `Your own dishes` are rendered separately below (the latter needs an
  // empty state, which carousel() deliberately has no concept of).
  const sections=[
    ['Weeknight winners', weeknight],
    ['Budget-friendly dinners', budget],
    ['Fresh & light', freshLight],
    ['Comfort classics', comfort],
    ['Small plates to start', smallPlates],
    ['Sweet endings', sweetEndings],
    ['Breakfasts', bfast],
  ];
  const anyResults=sections.some(([,list])=>list.length)||favs.length||ownDishes.length;
  return `${filterRowHtml()}
    <p class="drag-hint">↔ Drag a card onto a day in the week, or tap ⊕ to choose a day.</p>
    ${carousel('Your favourites ♥', favs)}
    ${ownDishesBlockHtml(ownDishes)}
    ${anyResults?sections.map(([title,list])=>carousel(title,list)).join('')
      :`<p class="sub">No dishes match your filters right now. <a role="button" tabindex="0" id="clearFiltersEmpty" style="cursor:pointer;font-weight:600">Clear all filters</a> to see everything.</p>`}`;
}
/* §0.7 + §4: `Your own dishes` sits directly beneath `Your favourites`. Unlike every other
   carousel it still renders when empty — its empty state IS the entry point, which is what
   makes the feature discoverable from browse as well as from the planner. */
function ownDishesBlockHtml(list){
  if(list.length) return `<div class="cat-block"><div class="cat-head">
      <h3>Your own dishes</h3>
      <button class="ghost add-dish-btn" id="addDishBrowse">＋ Add a dish I love</button>
    </div>
    <div class="carousel">${list.map(browseCard).join('')}</div></div>`;
  return `<div class="cat-block"><div class="cat-head"><h3>Your own dishes</h3></div>
    <p class="sub">Nothing here yet. Tell us a dish you love and we'll look up the recipe,
      the times and the ingredients so it joins your cookbook for good.</p>
    <button class="ghost add-dish-btn" id="addDishBrowse" style="margin-top:8px">＋ Add a dish I love</button>
  </div>`;
}
/* ----- THE one-page planner (§2): tabs + sticky week sidebar + main column -----
   `review`, `recipes` and `shopping` used to be three separate screens. They are now one page:
   the week is the sidebar, browsing/shopping are the two tabs, and a recipe opens as an overlay. */
function renderPlanner(){
  const nm=(state.profile?.name||'').trim();
  const tab=state.plannerTab==='shop'?'shop':'plan';
  // V4 §7 pick-mode bar: a persistent, always-visible way out while choosing a replacement.
  let pickBar='';
  if(state.pickMode){
    const pm=state.pickMode; const d=state.week[pm.di]; const meal=d&&d.meals[pm.mi];
    if(meal){ pickBar=`<div class="pick-bar" role="status">
      <span>Choosing a new dish for <b>${d.day} ${meal.type}</b> — tap or drag one below.</span>
      <button class="btn btn-sm" id="pickCancel">Cancel</button></div>`; }
    else state.pickMode=null;   // slot vanished (e.g. re-plan) → drop pick mode
  }
  app.innerHTML=`
    <div class="planner-head">
      <h2>${nm?nm+"'s week":'Your week'}</h2>
      <div class="tabs" role="tablist">
        <button role="tab" data-tab="plan" aria-selected="${tab==='plan'}" class="${tab==='plan'?'on':''}">My Meal Plan</button>
        <button role="tab" data-tab="shop" aria-selected="${tab==='shop'}" class="${tab==='shop'?'on':''}">Shop Ingredients</button>
      </div>
    </div>
    ${pickBar}
    <div class="planner">
      ${railHtml()}
      <main class="planner-main">${tab==='shop'?shoppingBodyHtml()
        :plannerNoticesHtml()+browseBodyHtml()}</main>
    </div>
    <div class="status-bar">
      <span class="count">${tab==='shop'?'Your ticks are remembered':'Drag or ⊕ to add · ♥ to save'}</span>
      <div class="btn-row">
        <button class="ghost" id="backBtn">⚙️ Edit my answers</button>
        <button class="primary" id="replanBtn" style="margin-top:0">🔄 Re-plan this week</button>
      </div>
    </div>`;

  // ---- tabs ----
  app.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{ state.plannerTab=b.dataset.tab; renderPlanner(); });

  // ---- sidebar: tap a dish → detail overlay; ♥ favourites; ✕ swaps (V4 §5) ----
  app.querySelectorAll('[data-open]').forEach(b=>b.onclick=(e)=>{
    if(e.target.closest('[data-fav],[data-swap]')) return;   // the controls have their own handlers
    const [di,mi]=b.dataset.open.split('-').map(Number);
    openRecipeOverlay(di,mi);
  });
  app.querySelectorAll('[data-fav]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation();
    const [di,mi]=b.dataset.fav.split('-').map(Number);
    const meal=state.week[di]&&state.week[di].meals[mi]; if(meal&&meal.recipe){ toggleFavorite(meal.recipe); renderPlanner(); }
  });
  app.querySelectorAll('[data-swap]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation();
    const [di,mi]=b.dataset.swap.split('-').map(Number);
    swapMeal(di,mi); saveState(); renderPlanner();       // ✕ = immediate random swap (§7 keeps this fast path)
  });

  // ---- V4 §7 pick mode: highlight the held slot + the always-visible Cancel ----
  document.getElementById('pickCancel')?.addEventListener('click',exitPickMode);
  if(state.pickMode){
    const held=app.querySelector(`.dish-row[data-drop-slot="${state.pickMode.di}-${state.pickMode.mi}"]`);
    held?.classList.add('picking');
  }

  // ---- browse: ⊕ add / ♥ fav / tap card → detail overlay (or place into held slot in pick mode) ----
  app.querySelectorAll('[data-badd]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation();
    const r=findBrowseRecipe(b.dataset.badd); if(!r)return;
    if(state.pickMode) pickModePlace(r); else openDayPicker(r,b); });
  app.querySelectorAll('[data-bfav]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation();
    const r=findBrowseRecipe(b.dataset.bfav); if(r){ toggleFavorite(r); renderPlanner(); } });
  app.querySelectorAll('.recipe-card[data-rid]').forEach(card=>{
    card.addEventListener('click',e=>{
      if(e.target.closest('.icon-btn')) return;          // ⊕ / ♥ have their own handlers
      const r=findBrowseRecipe(card.dataset.rid); if(!r)return;
      if(state.pickMode) pickModePlace(r);               // tap = place into the held slot (phone path)
      else openRecipeOverlay(null,null,r);
    });
  });

  // ---- drag & drop (V4 §6): browse card → any slot (copy); plan dish → any slot (move) ----
  const DT='text/plain';
  // sources: browse cards (copy) and planned dish rows (move)
  app.querySelectorAll('.recipe-card[draggable]').forEach(card=>{
    card.addEventListener('dragstart',e=>{ e.dataTransfer.setData(DT,'rid:'+card.dataset.rid); e.dataTransfer.effectAllowed='copy'; card.classList.add('dragging'); });
    card.addEventListener('dragend',()=>card.classList.remove('dragging'));
  });
  app.querySelectorAll('.dish-row[data-drop-slot]').forEach(row=>{
    row.setAttribute('draggable','true');
    row.addEventListener('dragstart',e=>{ e.dataTransfer.setData(DT,'slot:'+row.dataset.dropSlot); e.dataTransfer.effectAllowed='move'; row.classList.add('dragging'); e.stopPropagation(); });
    row.addEventListener('dragend',()=>row.classList.remove('dragging'));
    // per-slot drop target: replaces this dish
    row.addEventListener('dragover',e=>{ e.preventDefault(); e.stopPropagation(); row.classList.add('drop-replace'); });
    row.addEventListener('dragleave',()=>row.classList.remove('drop-replace'));
    row.addEventListener('drop',e=>{ e.preventDefault(); e.stopPropagation(); row.classList.remove('drop-replace');
      const [di,mi]=row.dataset.dropSlot.split('-').map(Number);
      applyDrop(e.dataTransfer.getData(DT),di,{slotMi:mi}); });
  });
  // per-meal-group append target: adds a new dish under that meal type
  app.querySelectorAll('.group-add[data-add-group]').forEach(z=>{
    z.addEventListener('dragover',e=>{ e.preventDefault(); e.stopPropagation(); z.classList.add('drop'); });
    z.addEventListener('dragleave',()=>z.classList.remove('drop'));
    z.addEventListener('drop',e=>{ e.preventDefault(); e.stopPropagation(); z.classList.remove('drop');
      const [di,mt]=z.dataset.addGroup.split('|');
      applyDrop(e.dataTransfer.getData(DT),Number(di),{mealType:mt}); });
    z.addEventListener('click',()=>{ /* tap the ＋ → nudge to browse below */ });
  });
  // coarse fallback: dropping anywhere else on a day appends at the dish's natural meal
  app.querySelectorAll('.day-row[data-drop-day]').forEach(row=>{
    row.addEventListener('dragover',e=>{ e.preventDefault(); row.classList.add('drop'); });
    row.addEventListener('dragleave',()=>row.classList.remove('drop'));
    row.addEventListener('drop',e=>{ e.preventDefault(); row.classList.remove('drop');
      applyDrop(e.dataTransfer.getData(DT),Number(row.dataset.dropDay)); });
  });
  // an empty day: nudge toward the browse column (which is already on-screen beside it)
  app.querySelectorAll('.slot.empty[data-add-day]').forEach(s=>s.onclick=()=>{
    state.plannerTab='plan'; renderPlanner();
    app.querySelector('.planner-main')?.scrollIntoView({behavior:'smooth',block:'start'});
  });

  // ---- §4 filter row ----
  if(tab==='plan'){
    document.getElementById('allFiltersBtn')?.addEventListener('click',openAllFiltersSheet);
    document.querySelector('[data-toggle-saved]')?.addEventListener('click',()=>{ state.browseFilters.saved=!state.browseFilters.saved; renderPlanner(); });
    document.getElementById('clearFiltersBtn')?.addEventListener('click',()=>{ clearAllFilters(); renderPlanner(); });
    document.getElementById('clearFiltersEmpty')?.addEventListener('click',()=>{ clearAllFilters(); renderPlanner(); });
    app.querySelectorAll('[data-filter-group]').forEach(b=>b.addEventListener('click',(e)=>{ e.stopPropagation(); openFilterPopover(b.dataset.filterGroup,b); }));
    // §0.7 entry point — it lives in the `Your own dishes` block, which sits on the
    // My Meal Plan tab, satisfying §0.7.2's "one entry point" and §4's "discoverable from
    // browse" at once. A second copy floating above the filters just read as a duplicate.
    document.getElementById('addDishBrowse')?.addEventListener('click',openAddDishOverlay);
  }

  if(tab==='shop') bindShopping();
  document.getElementById('backBtn').onclick=()=>setScreen('profile');
  document.getElementById('replanBtn').onclick=()=>{ if(state.profile) planWeek(); else setScreen('profile'); };
}

/* ----- Recipe detail overlay (§2: "never a page change") -----
   Replaces the old "Recipes by day" screen. Opened from a sidebar dish (di/mi given, so it can
   also swap that slot) or from a browse card (recipe given directly, no slot to swap). */
function openRecipeOverlay(di,mi,recipeDirect){
  const meal=(di!=null&&mi!=null)?state.week[di]?.meals[mi]:null;
  const r=recipeDirect||meal?.recipe;
  if(!r) return;
  const overlay=document.createElement('div');
  overlay.className='sheet-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label',r.name);
  const prevFocus=document.activeElement;
  function close(){
    document.removeEventListener('keydown',onKey);
    overlay.remove();
    if(prevFocus&&prevFocus.focus)prevFocus.focus();
  }
  function onKey(e){ if(e.key==='Escape')close(); }
  function paint(){
    const cur=meal?meal.recipe:r;                      // re-read after a swap
    const img=dishImageUrl(cur);
    const diffLabel=['','Very easy','Easy','Medium','Involved','Advanced'][cur.difficulty]||'';
    overlay.innerHTML=`<div class="sheet">
      <button class="sheet-close" aria-label="Close">✕</button>
      ${img?`<div class="sheet-photo"><img src="${img}" alt="" onerror="this.closest('.sheet-photo').remove()"></div>`:''}
      <div class="sheet-body">
        ${meal?`<div class="rtype">${mealTypeLabel(meal)}</div>`:`<div class="rtype">${cur.type}</div>`}
        <h2 class="rname">${cur.emoji||''} ${cur.name}</h2>
        <div class="rdesc">${cur.desc||''}</div>
        ${isUserDish(cur)?`<p class="list-note">Added by you — nutrition is an estimate.${(cur.contains&&cur.contains.length)?` Contains: ${cur.contains.join(', ')}.`:''}</p>`:''}
        ${cur.isLeftover?`<p class="list-note">You already bought and cooked this — nothing extra to shop for. Just reheat until piping hot.</p>`:`
        <div class="ing-head">🧾 Ingredients ${peopleCount()>1?`<span class="hint">(for ${peopleCount()} people)</span>`:''}${cur.batchNote?' <span class="hint">— double batch, half becomes tomorrow\'s lunch</span>':''}</div>
        <ul class="ing-list">
          ${(cur.ingredients||[]).map(i=>{const pr=priceOf(i);return `<li><span>${i.name}</span><span class="iq">${formatQty(i.qty,i.unit)}${pr>0?' · €'+pr.toFixed(2):''}</span></li>`;}).join('')}
        </ul>
        ${(cur.steps&&cur.steps.length)?`<div class="ing-head">👩‍🍳 Method</div><ol class="step-list">${cur.steps.map(s=>`<li>${s}</li>`).join('')}</ol>`:''}`}
        <div class="badges">
          <span class="badge">⏱ ${cur.time} min</span>
          <span class="badge diff">${diffLabel}</span>
          ${nutriBadges(cur)}
        </div>
        <div class="recipe-actions">
          ${(cur.steps&&cur.steps.length)?`<button class="cook-btn" data-cook>▶ Cook</button>`:''}
          <a class="recipe-link" href="${recipeUrl(cur)}" target="_blank" rel="noopener noreferrer">See full recipe ↗</a>${cur.sourceName?`<span class="sub" style="font-size:.85em">Recipe by ${cur.sourceName}</span>`:''}
          <button class="ghost fav-inline ${isFavorite(cur.name)?'on':''}" data-favr style="padding:9px 14px">${isFavorite(cur.name)?'♥ Saved':'♡ Save as favourite'}</button>
          ${meal?`<button class="ghost" data-swapr style="padding:9px 14px" title="Don't like it — swap for another dish">✕ Swap this dish</button>`:''}
          ${isUserDish(cur)?`<button class="ghost" data-copydb style="padding:9px 14px" title="Copy this dish as a recipes-db.js block">📋 Copy as database entry</button>`:''}
        </div>
      </div>
    </div>`;
    overlay.querySelector('.sheet-close').onclick=close;
    const cookBtn=overlay.querySelector('[data-cook]');
    if(cookBtn)cookBtn.onclick=()=>openCookMode(cur);
    overlay.querySelector('[data-favr]').onclick=()=>{ toggleFavorite(cur); paint(); renderPlanner(); };
    const cp=overlay.querySelector('[data-copydb]');
    if(cp)cp.onclick=()=>copyAsDatabaseEntry(cur);
    // V4 §7: the overlay's swap offers TWO choices — a random "Surprise me" (default, primary)
    // and "Choose it myself" (pick mode). The bare ✕ on the day card stays an instant random swap.
    const sw=overlay.querySelector('[data-swapr]');
    if(sw)sw.onclick=()=>{
      const box=document.createElement('div'); box.className='swap-choices';
      box.innerHTML=`<button class="btn btn-primary btn-sm" data-surprise>🎲 Surprise me</button>
        <button class="btn btn-sm ghost" data-choose>✋ Choose it myself</button>`;
      sw.replaceWith(box);
      box.querySelector('[data-surprise]').onclick=async(ev)=>{
        const b=ev.currentTarget; b.disabled=true; b.textContent='Finding another…';
        const changed=await doSurpriseSwap(di,mi);
        if(changed){ saveState(); paint(); renderPlanner(); }
        else {
          // §7.3 fallback: nothing eligible left → say so honestly, offer Choose it myself.
          box.innerHTML=`<p class="list-note">No other dish fits what you can eat here. Try choosing one yourself.</p>
            <button class="btn btn-sm ghost" data-choose>✋ Choose it myself</button>`;
          box.querySelector('[data-choose]').onclick=()=>{ close(); enterPickMode(di,mi); };
        }
      };
      box.querySelector('[data-choose]').onclick=()=>{ close(); enterPickMode(di,mi); };
    };
  }
  overlay.addEventListener('click',e=>{ if(e.target===overlay)close(); });
  document.addEventListener('keydown',onKey);
  paint();
  document.body.appendChild(overlay);
  overlay.querySelector('.sheet-close').focus();
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
function sumPrices(items){ return items.reduce((s,i)=>s+(typeof i.price==='number'?i.price:0),0); }
function dayChip(items){ const t=sumPrices(items); return t>0?`<span class="day-total">€${t.toFixed(2)}</span>`:''; }
/* The `Shop Ingredients` tab body (§2 — no longer its own screen). */
function shoppingBodyHtml(){
  const { pantry, fresh, total:clientTotal, anyPrice, skipped }=buildShoppingList();
  const buyOrder=['Sunday (before the week)',...DAYS];
  const freshDays=Object.keys(fresh).sort((a,b)=>buyOrder.indexOf(a)-buyOrder.indexOf(b));
  // §5: Gemini's own whole-week figure is the headline when a full AI week supplied one;
  // the client-side ingredient sum is always the fallback (and the only figure with AI off).
  const usingAiTotal=typeof state.estimatedTotal==='number';
  const total=usingAiTotal?state.estimatedTotal:clientTotal;
  const haveTotal=usingAiTotal||anyPrice;
  // Budget is now per-day (§4): compare the week's average day against it.
  const budgetPerDay=Number(state.profile?.budgetPerDay)|| (state.profile?.budget?Math.round(Number(state.profile.budget)/7):0);
  const perDay=total/7;
  const city=(state.profile?.city&&state.profile.city.trim())?state.profile.city.trim():'Paris';
  // §5: the total moves to the BOTTOM of the list, as a summary card.
  let totalBar='';
  if(haveTotal){
    let pill='';
    if(budgetPerDay>0){ const under=perDay<=budgetPerDay; pill=`<span class="pill ${under?'under':'over'}">${under?'within':'over'} your €${budgetPerDay}/day</span>`; }
    totalBar=`<div class="total-bar">
      <div><div class="sub" style="margin:0">Estimated total · ${city}${peopleCount()>1?` · ${peopleCount()} people`:''}</div>
        <div class="big">€${total.toFixed(2)}</div>
        <div class="sub" style="margin:4px 0 0">≈ €${perDay.toFixed(2)} / day</div></div>
      ${pill}</div>
      <p class="sub" style="margin:8px 0 0">Estimated — varies by shop.</p>`;
  }
  return `
    <div class="card">
      <h2>Your shopping list</h2>
      <p class="sub">Built from ${mealCount()} dishes across the week. Repeated items are added up automatically. Ticks are remembered — even if you close the page.</p>
      ${skipped?`<p class="list-note">🧺 Hiding ${skipped} item${skipped===1?'':'s'} you said ${skipped===1?'is':'are'} already in your cupboard.</p>`:''}
      <div class="btn-row no-print" style="margin-bottom:16px">
        <button class="ghost" id="copyList">📋 Copy list</button>
        <button class="ghost" id="printList">🖨 Print / PDF</button>
        <button class="ghost" id="icsBtn" title="Dinners + shopping reminders as calendar events">📅 Add to calendar</button>
      </div>
      <div class="list-col">
        <h3>🛒 Buy at the start of the week ${anyPrice?dayChip(pantry):''}</h3>
        <p class="when">Keeps for days — pantry, dairy, frozen, sturdy veg.</p>
        ${pantry.length?renderCategories(pantry):'<p class="sub">Nothing here.</p>'}
      </div>
      <div class="list-col">
        <h3>🥬 Buy fresh — day by day</h3>
        <p class="when">Perishable, bought the day before you need it. Each day shows its own €.</p>
        ${freshDays.length?freshDays.map(bd=>{ const items=[...fresh[bd].values()]; return `<div class="buyday"><div class="head">📅 ${bd} ${anyPrice?dayChip(items):''}</div>
          ${items.sort((a,b)=>a.name.localeCompare(b.name)).map(i=>itemRow(i)).join('')}</div>`;}).join(''):'<p class="sub">Nothing perishable this week.</p>'}
      </div>
      ${totalBar}
      <p class="sub no-print" style="text-align:center;margin:18px 0 0">
        <a role="button" tabindex="0" id="fbLink" style="cursor:pointer;font-weight:600">💬 A thought? Tell Lucille</a></p>
    </div>`;
}
function bindShopping(){
  bindChecks();
  const on=(id,fn)=>{ const el=document.getElementById(id); if(el)el.onclick=fn; };
  on('copyList',copyListText);
  on('printList',()=>window.print());
  on('icsBtn',downloadICS);
  on('fbLink',openFeedback);
}
// V4 §4.3: a piece item rounded up to whole items shows the whole count you actually buy,
// with a quiet "(you need 1½)" so the maths doesn't look wrong.
function niceFrac(q){ const r=Math.round(q*100)/100; const f=r-Math.floor(r);
  if(Math.abs(f-0.5)<0.02) return (Math.floor(r)>0?Math.floor(r):'')+'½';
  if(Math.abs(f-0.25)<0.02) return (Math.floor(r)>0?Math.floor(r):'')+'¼';
  if(Math.abs(f-0.75)<0.02) return (Math.floor(r)>0?Math.floor(r):'')+'¾';
  return String(r); }
function itemRow(i){
  const key=itemKey(i);
  const done=!!state.checked[key];
  const pr=(typeof i.price==='number'&&i.price>0)?`<span class="pr">€${i.price.toFixed(2)}</span>`:'<span class="pr"></span>';
  const rounded = typeof i.boughtQty==='number';
  const qtyTxt = rounded ? formatQty(i.boughtQty,i.unit) : formatQty(i.qty,i.unit);
  const note = (rounded && i.roundedFrom!=null) ? `<span class="qty-note">you need ${niceFrac(i.roundedFrom)}</span>` : '';
  return `<label class="item ${done?'checked':''}"><input type="checkbox" data-check="${key}" ${done?'checked':''}><span class="nm">${i.name}</span>
    <span class="qty">${qtyTxt}${note}</span>${pr}</label>`;
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
   5b. "ADD A DISH I LOVE" (§0.7) — Gemini researches a dish INTO the database
   ------------------------------------------------------------
   Gemini is a RESEARCHER here, not an author: it fills in a permanent database row for a
   dish the user named, and once saved that dish is picked ahead of anything generated on
   the fly. Every dish added this way makes the database bigger and Gemini's plan-time role
   smaller — this strengthens the §0 precedence rule rather than weakening it.

   The whole reply is UNTRUSTED. validateDish() rejects rather than repairs, and the user
   must confirm the allergen list before anything is saved. An under-listed allergen here
   reaches a real plate, so both gates are non-negotiable.
   ============================================================ */
const DISH_COURSES  = ['breakfast','lunch','dinner','starter','dessert'];
const DISH_CATS     = ['Produce','Meat & Fish','Dairy','Bakery','Frozen','Pantry'];
const DISH_UNITS    = ['g','ml','tsp','tbsp','piece','clove','slice','stalk','pinch'];
const DISH_ALLERGENS= ['gluten','dairy','nuts','eggs','soy','shellfish','fish','sesame'];
const RESEARCH_DAILY_CAP = 20;          // Gemini free tier, shared with week generation (§0.7.6)

/* Reject, never repair (§0.7.4). A malformed dish doesn't just look wrong — it silently
   breaks allergy filtering, the shopping list and the no-repeat rule. Returns
   {ok:true, dish} with an id WE assigned, or {ok:false, errors:[…]}. */
function validateDish(obj){
  const e=[];
  const d=(obj&&typeof obj==='object')?obj:{};
  const num=v=>typeof v==='number'&&isFinite(v);
  const int=v=>num(v)&&Number.isInteger(v);

  if(!d.name||typeof d.name!=='string'||!d.name.trim()) e.push('missing a name');
  if(!DISH_COURSES.includes(d.type)) e.push('bad course type');
  if(!Array.isArray(d.types)||!d.types.length||!d.types.every(t=>DISH_COURSES.includes(t))) e.push('bad course list');
  else if(!d.types.includes(d.type)) e.push('course type is not in its own course list');
  if(!int(d.difficulty)||d.difficulty<1||d.difficulty>4) e.push('difficulty must be 1-4');
  ['time','prepTime','cookTime','servings','kcal','protein'].forEach(k=>{
    if(!num(d[k])||d[k]<0) e.push(`${k} is missing or not a number`);
  });
  if(num(d.time)&&num(d.prepTime)&&num(d.cookTime)&&d.time!==d.prepTime+d.cookTime)
    e.push('time does not equal prep + cook');
  if(d.passiveTime!=null&&(!num(d.passiveTime)||d.passiveTime<0)) e.push('passiveTime is not a number');
  if(d.nutrition!=='source'&&d.nutrition!=='estimated') e.push('nutrition must be "source" or "estimated"');
  if(!Array.isArray(d.tags)) e.push('tags must be a list');
  if(!Array.isArray(d.contains)||!d.contains.every(a=>DISH_ALLERGENS.includes(a)))
    e.push('allergen list is missing or has unknown entries');
  if(!Array.isArray(d.ingredients)||!d.ingredients.length) e.push('no ingredients');
  else d.ingredients.forEach((i,n)=>{
    const where=`ingredient ${n+1}${i&&i.name?` (${i.name})`:''}`;
    if(!i||typeof i!=='object'){ e.push(`${where} is malformed`); return; }
    if(!i.name||typeof i.name!=='string'||!i.name.trim()) e.push(`${where} has no name`);
    if(!num(i.qty)||i.qty<=0) e.push(`${where} has no usable quantity`);
    if(!DISH_UNITS.includes(i.unit)) e.push(`${where} has an invalid unit`);
    if(!DISH_CATS.includes(i.category)) e.push(`${where} has an invalid category`);
  });
  if(!Array.isArray(d.steps)||!d.steps.length||!d.steps.every(s=>typeof s==='string'&&s.trim()))
    e.push('no method steps');

  if(e.length) return {ok:false,errors:e};

  // The id is OURS, never Gemini's. `user-` (not `db-`) keeps isCurated() meaning
  // "shipped and reviewed", and keeps state.favorites' `fav` prefix unambiguous.
  const id='user-'+(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2));
  return {ok:true, dish:{
    id, type:d.type, types:d.types.slice(),
    name:d.name.trim(), desc:(d.desc||'').trim(),
    sourceUrl:typeof d.sourceUrl==='string'&&/^https?:\/\//.test(d.sourceUrl)?d.sourceUrl:null,
    sourceName:(typeof d.sourceName==='string'&&d.sourceName.trim())?d.sourceName.trim():null,
    photo:null,                                 // never trust a model-supplied image URL (§0.7.3)
    emoji:(typeof d.emoji==='string'&&d.emoji.trim())?d.emoji.trim():'🍽️',
    prepTime:d.prepTime, cookTime:d.cookTime, time:d.time,
    passiveTime:num(d.passiveTime)?d.passiveTime:0,
    difficulty:d.difficulty, servings:d.servings, kcal:d.kcal, protein:d.protein,
    nutrition:d.nutrition, tags:d.tags.slice(), contains:d.contains.slice(),
    ingredients:d.ingredients.map(i=>({name:i.name.trim(),qty:i.qty,unit:i.unit,
      category:i.category,buyDayBefore:!!i.buyDayBefore})),
    steps:d.steps.map(s=>s.trim()),
    userAdded:true, verified:false,             // verified only once the user confirms allergens
  }};
}

/* ---- quota (§0.7.6): one call per add, against a 20/day free tier ---- */
function todayKey(){ return new Date().toISOString().slice(0,10); }
function researchCallsUsed(){
  const r=state.researchCallsToday||{};
  return r.date===todayKey()?(Number(r.n)||0):0;
}
function researchCallsLeft(){ return Math.max(0, RESEARCH_DAILY_CAP-researchCallsUsed()); }
function noteResearchCall(){
  state.researchCallsToday={date:todayKey(), n:researchCallsUsed()+1};
  saveState();
}
// Spend nothing when we already have the dish (§0.7.6). Loose match: case/punctuation-insensitive
// containment either way, so "tikka masala" finds "Chicken tikka masala".
function findCloseNameMatch(query){
  const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9 ]+/g,'').replace(/\s+/g,' ').trim();
  const q=norm(query); if(q.length<3) return null;
  const pool=[...DB(),...RECIPES,...STARTERS,...DESSERTS];
  return pool.find(r=>{const n=norm(r.name); return n===q||n.includes(q)||q.includes(n);})||null;
}

/* ---- the network call, with a specific message for every failure (§0.7.6) ---- */
async function researchDish({mode,query,imageBase64,mimeType}){
  if(!navigator.onLine) return {fail:"You're offline — this needs a connection."};
  if(!state.useAI) return {fail:'Turn on AI generation to research dishes automatically, or add one by hand.'};
  if(researchCallsLeft()<=0) return {fail:"You've used today's recipe lookups. You can still add a dish by hand.",quota:true};

  let out;
  try{
    const res=await fetch(BACKEND_URL+'/research-dish',{method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({mode,query,imageBase64,mimeType,profile:state.profile})});
    noteResearchCall();                          // a call was genuinely spent, however it ends
    out=await res.json().catch(()=>({}));
    if(!res.ok){
      const msg=String(out&&out.error||'');
      if(/\b(429|quota|RESOURCE_EXHAUSTED)\b/i.test(msg))
        return {fail:"You've used today's recipe lookups. You can still add a dish by hand.",quota:true};
      if(/\b(503|502|500|504|UNAVAILABLE|overloaded|high demand)\b/i.test(msg))
        return {fail:'The recipe service is busy. Try again in a minute.'};
      return {fail:msg||'The recipe service could not be reached.'};
    }
  }catch(e){
    return {fail:'The recipe service could not be reached. Try again in a minute.'};
  }

  if(!out||out.ok===false)
    return {fail:"I couldn't find a reliable recipe for that. Try a more specific name, or paste the recipe text.",
            detail:out&&out.reason};
  const v=validateDish(out.dish);
  if(!v.ok) return {fail:"I found it but couldn't get the details right. Nothing was saved.",detail:v.errors.join('; ')};
  return {dish:v.dish};
}

/* ---- saving (local mirror + the user_dishes table) ---- */
async function persistUserDish(dish){
  state.userDishes=mergeUserDishes([dish],state.userDishes);
  saveState();                                   // localStorage + the profiles.state blob
  if(cloudEnabled()&&window.Cloud.saveUserDish){
    try{ await window.Cloud.saveUserDish(cloudUser.id,dish); }
    catch(e){ console.warn('User dish cloud save failed (kept locally):',e&&e.message); }
  }
}

/* ---- §0.7.5: promote a good dish into the shipped database, by hand ---- */
function nextDbId(dish){
  const letter={breakfast:'b',lunch:'m',dinner:'m',starter:'s',dessert:'d'}[dish.type]||'m';
  const used=DB().map(r=>r.id).filter(id=>new RegExp(`^db-${letter}\\d+$`).test(id))
    .map(id=>Number(id.slice(letter.length+3)));
  return `db-${letter}${(used.length?Math.max(...used):0)+1}`;
}
function dishAsDatabaseEntry(dish){
  const q=s=>`'${String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'")}'`;
  const ing=dish.ingredients.map(i=>
    `    {name:${q(i.name)}, qty:${i.qty}, unit:${q(i.unit)}, category:${q(i.category)}, buyDayBefore:${!!i.buyDayBefore}},`
  ).join('\n');
  const steps=dish.steps.map(s=>`    ${q(s)},`).join('\n');
  return `  {
    id:${q(nextDbId(dish))}, type:${q(dish.type)}, types:[${dish.types.map(q).join(',')}],
    name:${q(dish.name)}, desc:${q(dish.desc||'')},
    sourceUrl:${dish.sourceUrl?q(dish.sourceUrl):'null'}, sourceName:${dish.sourceName?q(dish.sourceName):'null'},
    photo:null,
    emoji:${q(dish.emoji||'🍽️')}, img:'',
    prepTime:${dish.prepTime}, cookTime:${dish.cookTime}, time:${dish.time}, passiveTime:${dish.passiveTime||0},
    difficulty:${dish.difficulty}, servings:${dish.servings}, kcal:${dish.kcal}, protein:${dish.protein},
    nutrition:${q(dish.nutrition)},
    tags:[${dish.tags.map(q).join(',')}], contains:[${dish.contains.map(q).join(',')}],
    ingredients:[
${ing}
    ],
    steps:[
${steps}
    ],
  },`;
}
function copyAsDatabaseEntry(dish){
  const text=dishAsDatabaseEntry(dish);
  const done=()=>showToast('✓ Copied — paste it into public/recipes-db.js');
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text,done));
  } else fallbackCopy(text,done);
}
function fallbackCopy(text,done){
  const ta=document.createElement('textarea'); ta.value=text;
  ta.style.cssText='position:fixed;top:-1000px'; document.body.appendChild(ta);
  ta.select(); try{ document.execCommand('copy'); done(); }catch(e){ showToast('Could not copy'); }
  ta.remove();
}

/* ---- the entry point overlay: name / pasted text / link ----
   Photo mode is deliberately NOT shipped in this phase (§7 step 7: "ship name/text modes
   before photo mode"). The server already accepts an image part, so adding it later is a
   client-side change only — a file input, a canvas downscale, and a fourth mode button. */
function openAddDishOverlay(){
  const overlay=document.createElement('div');
  overlay.className='sheet-overlay';
  overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Add a dish I love');
  let mode='name';
  function close(){ document.removeEventListener('keydown',onKey); overlay.remove(); }
  function onKey(e){ if(e.key==='Escape')close(); }

  function body(){
    const left=researchCallsLeft();
    return `<div class="sheet">
      <button class="sheet-close" aria-label="Close">✕</button>
      <div class="sheet-body">
        <h2 class="rname" style="margin-top:0">Add a dish you love</h2>
        <p class="sub">Tell us the dish and we'll look up the recipe, the times and the
          ingredients so it joins your own cookbook.</p>
        <div class="tabs" role="tablist" style="margin-bottom:14px">
          <button role="tab" data-mode="name" aria-selected="${mode==='name'}" class="${mode==='name'?'on':''}">By name</button>
          <button role="tab" data-mode="text" aria-selected="${mode!=='name'}" class="${mode!=='name'?'on':''}">Paste a recipe or link</button>
        </div>
        ${mode==='name'
          ? `<label class="ing-head" for="ad-q">Dish name</label>
             <input id="ad-q" type="text" placeholder="e.g. chicken tikka masala" autocomplete="off">`
          : `<label class="ing-head" for="ad-q">Recipe text, or a link to one</label>
             <textarea id="ad-q" rows="7" placeholder="Paste the full recipe here — or just a link to it."></textarea>`}
        <p class="sub" id="ad-msg" style="min-height:1.2em"></p>
        <div class="recipe-actions" style="margin-top:12px">
          <button class="primary" id="ad-go" style="margin-top:0" ${left<=0?'disabled':''}>Look it up</button>
          <button class="ghost" id="ad-cancel">Cancel</button>
        </div>
        <p class="sub" style="margin-top:10px;font-size:.85em">
          ${left>0?`${left} recipe lookup${left===1?'':'s'} left today.`
                  :`You've used today's recipe lookups.`}
          You can always <a href="docs/HOW-TO-ADD-A-DISH.md" target="_blank" rel="noopener">add a dish by hand</a>.
        </p>
      </div>
    </div>`;
  }

  function bind(){
    overlay.querySelector('.sheet-close').onclick=close;
    overlay.querySelector('#ad-cancel').onclick=close;
    overlay.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{
      mode=b.dataset.mode==='name'?'name':'text';
      overlay.innerHTML=body(); bind();
    });
    const input=overlay.querySelector('#ad-q');
    const msg=overlay.querySelector('#ad-msg');
    const go=overlay.querySelector('#ad-go');
    input.focus();

    go.onclick=async()=>{
      const q=(input.value||'').trim();
      if(!q){ msg.textContent='Type a dish name first.'; return; }

      // Don't spend a lookup on something we already have (§0.7.6).
      if(mode==='name'){
        const hit=findCloseNameMatch(q);
        if(hit){
          msg.innerHTML=`We already have <strong>${hit.name}</strong> in the cookbook — no lookup needed.`;
          go.textContent='Open it'; go.onclick=()=>{ close(); openRecipeOverlay(null,null,hit); };
          return;
        }
      }
      // A pasted http(s) link is a different research mode from pasted recipe text.
      const isUrl=mode==='text'&&/^https?:\/\/\S+$/i.test(q);
      // A lookup is usually a few seconds, but when Google's free tier is congested the
      // model chain falls through and it can take a minute or more. A button that says the
      // same thing for 90 seconds reads as broken, so say what's actually happening.
      go.disabled=true; go.textContent='Looking it up…'; msg.textContent='';
      const waitNotes=[
        [8000,  'Reading through the recipe…'],
        [20000, 'Still going — the recipe service is busy right now.'],
        [45000, "Still going. It's slow when Google is under load, but it hasn't failed."],
      ];
      const timers=waitNotes.map(([ms,text])=>setTimeout(()=>{ msg.textContent=text; },ms));
      let out;
      try { out=await researchDish({mode:isUrl?'url':mode,query:q}); }
      finally { timers.forEach(clearTimeout); }
      go.disabled=false; go.textContent='Look it up'; msg.textContent='';
      if(out.fail){
        msg.textContent=out.fail;
        if(out.detail) console.info('Research dish — why it failed:',out.detail);
        if(out.quota) go.disabled=true;
        return;
      }
      close();
      openConfirmDishOverlay(out.dish, isUrl?'url':mode);
    };
    input.onkeydown=e=>{ if(e.key==='Enter'&&mode==='name'){ e.preventDefault(); go.click(); } };
  }

  overlay.innerHTML=body();
  overlay.addEventListener('click',e=>{ if(e.target===overlay)close(); });
  document.addEventListener('keydown',onKey);
  document.body.appendChild(overlay);
  bind();
}

/* ---- the allergen confirmation gate (§0.7.4) — THE safety-critical step ----
   This data was written by a model. The dish stays `verified:false` — and therefore out of
   meal generation entirely — until the person looking at it confirms what's in it. */
function openConfirmDishOverlay(dish,source){
  const overlay=document.createElement('div');
  overlay.className='sheet-overlay';
  overlay.setAttribute('role','dialog'); overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','Confirm this dish');
  const picked=new Set(dish.contains);
  function close(){ document.removeEventListener('keydown',onKey); overlay.remove(); }
  function onKey(e){ if(e.key==='Escape')close(); }

  const containsWords=()=>picked.size?[...picked].join(', '):'nothing from the common allergens';
  const people=peopleCount();

  overlay.innerHTML=`<div class="sheet">
    <button class="sheet-close" aria-label="Close">✕</button>
    <div class="sheet-body">
      <h2 class="rname" style="margin-top:0">${dish.emoji} ${dish.name}</h2>
      <p class="sub">${dish.desc||''}</p>
      <p class="sub"><strong>Added by you — nutrition is an estimate.</strong></p>
      <ul class="ing-list" style="margin:12px 0">
        <li><span>Prep</span><span class="iq">${dish.prepTime} min</span></li>
        <li><span>Cook</span><span class="iq">${dish.cookTime} min</span></li>
        <li><span>Difficulty</span><span class="iq">${diffDots(dish.difficulty)}</span></li>
        ${dish.passiveTime?`<li><span>Unattended (chilling or resting)</span><span class="iq">+ ${dish.passiveTime>=60?`${Math.round(dish.passiveTime/60)} h`:`${dish.passiveTime} min`}</span></li>`:''}
      </ul>
      <p class="sub">About ${dish.kcal} kcal and ${dish.protein} g protein per serving.
        Quantities below are per person — we'll scale them to ${people}.</p>

      <div class="ing-head">Contains: <span id="cd-contains">${containsWords()}</span></div>
      <p class="sub">We checked this automatically. <strong>Please confirm it before saving</strong> —
        tick anything that's missing.</p>
      <div class="filter-grid" id="cd-allergens">
        ${DISH_ALLERGENS.map(a=>`<label class="filter-opt">
          <input type="checkbox" data-allergen="${a}" ${picked.has(a)?'checked':''}><span>${a}</span>
        </label>`).join('')}
      </div>

      <div class="ing-head" style="margin-top:16px">Ingredients (per person)</div>
      <ul class="ing-list">${dish.ingredients.map(i=>`<li><span>${i.name}</span><span class="iq">${formatQty(i.qty,i.unit)}</span></li>`).join('')}</ul>
      <div class="ing-head">Method</div>
      <ol class="step-list">${dish.steps.map(s=>`<li>${s}</li>`).join('')}</ol>

      <div class="recipe-actions" style="margin-top:16px">
        <button class="primary" id="cd-save" style="margin-top:0">Save to my cookbook</button>
        <button class="ghost" id="cd-cancel">Discard</button>
      </div>
    </div>
  </div>`;

  overlay.addEventListener('click',e=>{ if(e.target===overlay)close(); });
  document.addEventListener('keydown',onKey);
  document.body.appendChild(overlay);
  overlay.querySelector('.sheet-close').onclick=close;
  overlay.querySelector('#cd-cancel').onclick=close;
  overlay.querySelectorAll('[data-allergen]').forEach(cb=>cb.onchange=()=>{
    const a=cb.dataset.allergen;
    if(cb.checked)picked.add(a); else picked.delete(a);
    overlay.querySelector('#cd-contains').textContent=containsWords();
  });
  overlay.querySelector('#cd-save').onclick=async()=>{
    // The user's confirmed list wins over the model's — this is the whole point of the step.
    dish.contains=[...picked];
    dish.verified=true;
    dish.source=source||'name';
    await persistUserDish(dish);
    close();
    showToast(`✓ ${dish.name} added to your cookbook`);
    renderPlanner();
  };
}

/* ============================================================
   6. BOOT — local-only by default; cloud (Supabase) when configured
   ============================================================ */
function applyBlob(s){
  state.profile = migrateProfile(s.profile) || null;
  state.week = Array.isArray(s.week) ? s.week : [];
  state.useAI = !!s.useAI;
  state.favorites = Array.isArray(s.favorites) ? s.favorites : [];
  state.checked = (s.checked && typeof s.checked==='object') ? s.checked : {};
  state.userDishes = Array.isArray(s.userDishes) ? s.userDishes : [];
  state.screen = state.week.length ? 'review' : 'profile';
}
// Merge user dishes arriving from two places (the user_dishes table AND the profiles.state
// blob) into one list, deduped by the dish's own stable `user-…` id. §0.2: the ids are
// assigned once by us and never regenerated, which is exactly what makes this safe.
function mergeUserDishes(...lists){
  const seen=new Set(); const out=[];
  lists.flat().forEach(d=>{ if(d&&d.id&&!seen.has(d.id)){ seen.add(d.id); out.push(d); } });
  return out;
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
  // §0.7: user dishes also have their own table. Merge it with whatever the blob carried
  // (and, on a first login, with this browser's local mirror) — deduped by dish id.
  try {
    const rows = await window.Cloud.loadUserDishes(cloudUser.id);
    state.userDishes = mergeUserDishes(rows, state.userDishes);
  } catch(e){ console.warn('User dishes load failed (keeping local):', e && e.message); }
  render();
}
function startBoot(){
  if(!(window.Cloud && window.Cloud.enabled)){
    loadState(); render(); return;            // LOCAL-ONLY mode (no accounts) — original behavior
  }
  // CLOUD mode: gate everything behind a session. Signed-out → public landing.
  window.Cloud.onAuthChange((session)=>{
    if(session){ afterSignIn(session); }
    else { cloudUser=null; if(state.screen!=='signin')state.screen='landing'; render(); }
  });
  window.Cloud.getSession()
    .then(session=>{ if(session){ afterSignIn(session); } else { state.screen='landing'; render(); } })
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
