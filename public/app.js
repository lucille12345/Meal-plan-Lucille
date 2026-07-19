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
  {id:'s11',type:'starter',name:'Garlic bread',desc:'Baguette, garlic, butter',time:10,difficulty:1,emoji:'🧄',img:'garlic,bread',tags:['vegetarian'],kcal:210,protein:5,ingredients:[
    {name:'Baguette',qty:3,unit:'slices',category:'Bakery',buyDayBefore:true},{name:'Garlic',qty:1,unit:'clove',category:'Produce',buyDayBefore:false},{name:'Butter',qty:15,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Mix soft butter with crushed garlic.','Spread on bread and toast until golden.']},
  {id:'s12',type:'starter',name:'Roasted beet salad',desc:'Beetroot, leaves, feta',time:15,difficulty:1,emoji:'🥗',img:'beet,salad',tags:['vegetarian'],kcal:180,protein:6,ingredients:[
    {name:'Cooked beetroot',qty:120,unit:'g',category:'Produce',buyDayBefore:false},{name:'Salad greens',qty:50,unit:'g',category:'Produce',buyDayBefore:true},{name:'Feta',qty:25,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Slice beetroot over the greens.','Crumble feta and dress with olive oil.']},
  {id:'s13',type:'starter',name:'Stuffed tomatoes',desc:'Tomato, rice, herbs',time:22,difficulty:2,emoji:'🍅',img:'stuffed,tomato',tags:['vegetarian','vegan'],kcal:190,protein:5,ingredients:[
    {name:'Tomato',qty:2,unit:'',category:'Produce',buyDayBefore:false},{name:'Rice',qty:40,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Hollow the tomatoes, fill with cooked herby rice.','Bake 15 min.']},
  {id:'s14',type:'starter',name:'Corn on the cob',desc:'Corn, butter, salt',time:12,difficulty:1,emoji:'🌽',img:'corn',tags:['vegetarian'],kcal:170,protein:5,ingredients:[
    {name:'Corn cob',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Butter',qty:10,unit:'g',category:'Dairy',buyDayBefore:false}],steps:['Boil the corn 8 min.','Brush with butter and season.']},
];
const DESSERTS = [
  {id:'x1',type:'dessert',name:'Fresh fruit salad',desc:'Seasonal fruit, mint',time:6,difficulty:1,emoji:'🍓',img:'fruit,salad',tags:['vegetarian','vegan'],kcal:120,protein:2,ingredients:[
    {name:'Mixed fruit',qty:200,unit:'g',category:'Produce',buyDayBefore:true}],steps:['Chop the fruit.','Toss with a little mint and lemon.']},
  {id:'x2',type:'dessert',name:'Yogurt & honey',desc:'Greek yogurt, honey',time:3,difficulty:1,emoji:'🍯',img:'yogurt',tags:['vegetarian'],kcal:170,protein:10,ingredients:[
    {name:'Greek yogurt',qty:150,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Spoon yogurt into a bowl.','Drizzle with honey.']},
  {id:'x3',type:'dessert',name:'Dark chocolate & clementine',desc:'Chocolate square, clementine',time:2,difficulty:1,emoji:'🍫',img:'chocolate',tags:['vegetarian'],kcal:150,protein:2,ingredients:[
    {name:'Dark chocolate',qty:20,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Clementine',qty:1,unit:'',category:'Produce',buyDayBefore:false}],steps:['Enjoy the chocolate with a peeled clementine.']},
  {id:'x4',type:'dessert',name:'Baked cinnamon apple',desc:'Apple, cinnamon, oats',time:20,difficulty:1,emoji:'🍎',img:'baked,apple',tags:['vegetarian','vegan'],kcal:160,protein:2,ingredients:[
    {name:'Apple',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Oats',qty:20,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Core the apple, fill with oats and cinnamon.','Bake 18 min at 180°C.']},
  {id:'x5',type:'dessert',name:'Berries & cream',desc:'Berries, whipped cream',time:4,difficulty:1,emoji:'🫐',img:'berries',tags:['vegetarian'],kcal:180,protein:3,ingredients:[
    {name:'Mixed berries',qty:120,unit:'g',category:'Produce',buyDayBefore:true},{name:'Cream',qty:40,unit:'ml',category:'Dairy',buyDayBefore:false}],steps:['Spoon berries into a glass.','Top with a little whipped cream.']},
  {id:'x6',type:'dessert',name:'Lemon sorbet',desc:'Lemon sorbet, mint',time:2,difficulty:1,emoji:'🍋',img:'sorbet,lemon',tags:['vegetarian','vegan'],kcal:130,protein:0,ingredients:[
    {name:'Lemon sorbet',qty:2,unit:'scoops',category:'Frozen',buyDayBefore:false}],steps:['Scoop sorbet into a bowl.','Garnish with mint.']},
  {id:'x7',type:'dessert',name:'Poached pear',desc:'Pear, honey, spice',time:18,difficulty:2,emoji:'🍐',img:'pear',tags:['vegetarian','vegan'],kcal:150,protein:1,ingredients:[
    {name:'Pear',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Simmer the pear in water with honey and spice 15 min.','Serve warm.']},
  {id:'x8',type:'dessert',name:'Cheese & grapes',desc:'Cheese, grapes, cracker',time:3,difficulty:1,emoji:'🧀',img:'cheese',tags:['vegetarian'],kcal:210,protein:8,ingredients:[
    {name:'Cheese',qty:30,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Grapes',qty:80,unit:'g',category:'Produce',buyDayBefore:true},{name:'Crackers',qty:2,unit:'',category:'Bakery',buyDayBefore:false}],steps:['Plate cheese with grapes and a couple of crackers.']},
  {id:'x9',type:'dessert',name:'Rice pudding',desc:'Rice, milk, cinnamon',time:22,difficulty:2,emoji:'🍚',img:'rice,pudding',tags:['vegetarian'],kcal:220,protein:7,ingredients:[
    {name:'Rice',qty:40,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Milk',qty:200,unit:'ml',category:'Dairy',buyDayBefore:false}],steps:['Simmer rice in milk 18 min, stirring.','Sweeten and dust with cinnamon.']},
  {id:'x10',type:'dessert',name:'Grilled peach & honey',desc:'Peach, honey',time:8,difficulty:1,emoji:'🍑',img:'peach',tags:['vegetarian','vegan'],kcal:130,protein:1,ingredients:[
    {name:'Peach',qty:1,unit:'',category:'Produce',buyDayBefore:false},{name:'Honey',qty:1,unit:'tbsp',category:'Pantry',buyDayBefore:false}],steps:['Halve the peach, grill cut-side down 3 min.','Drizzle with honey.']},
  {id:'x11',type:'dessert',name:'Orange & cinnamon',desc:'Orange, cinnamon',time:4,difficulty:1,emoji:'🍊',img:'orange',tags:['vegetarian','vegan'],kcal:90,protein:2,ingredients:[
    {name:'Orange',qty:1,unit:'',category:'Produce',buyDayBefore:false}],steps:['Slice the orange onto a plate.','Dust lightly with cinnamon.']},
  {id:'x12',type:'dessert',name:'Vanilla yogurt & granola',desc:'Yogurt, granola',time:3,difficulty:1,emoji:'🥣',img:'yogurt,granola',tags:['vegetarian'],kcal:200,protein:9,ingredients:[
    {name:'Vanilla yogurt',qty:150,unit:'g',category:'Dairy',buyDayBefore:false},{name:'Granola',qty:30,unit:'g',category:'Pantry',buyDayBefore:false}],steps:['Spoon yogurt into a glass.','Top with a little granola.']},
  {id:'x13',type:'dessert',name:'Mango sorbet',desc:'Mango sorbet',time:2,difficulty:1,emoji:'🥭',img:'sorbet,mango',tags:['vegetarian','vegan'],kcal:140,protein:0,ingredients:[
    {name:'Mango sorbet',qty:2,unit:'scoops',category:'Frozen',buyDayBefore:false}],steps:['Scoop sorbet into a bowl and serve.']},
  {id:'x14',type:'dessert',name:'Chocolate mousse',desc:'Chocolate, egg',time:15,difficulty:3,emoji:'🍫',img:'chocolate,mousse',tags:['vegetarian'],kcal:230,protein:6,ingredients:[
    {name:'Dark chocolate',qty:40,unit:'g',category:'Pantry',buyDayBefore:false},{name:'Eggs',qty:1,unit:'',category:'Dairy',buyDayBefore:false}],steps:['Melt chocolate, fold into whisked egg white.','Chill 1 hour before serving.']},
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
const state = { screen:'profile', profile:null, week:[], usedFallback:false, selectedDay:0,
  useAI:false, favorites:[], checked:{}, plannerMode:'plan' };
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
      state.profile = migrateProfile(saved.profile) || null;
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
// `role` is breakfast|lunch|dinner|starter|dessert. Starters/desserts have their own pools.
function eligibleRecipes(role,profile){
  const pool=[...RECIPES, ...STARTERS, ...DESSERTS, ...state.favorites.filter(f=>f.type===role)];
  const base=pool.filter(r=>r.type===role&&passesDietFilters(r,profile));
  const maxDiff=maxDifficultyFor(profile.cookingLevel);
  const maxTime=Number(profile.timePerMeal)>0 ? Number(profile.timePerMeal) : maxTimeFor(profile.lifeStage);
  const strict=base.filter(r=>r.difficulty<=maxDiff&&r.time<=maxTime);
  return strict.length?strict:base;
}
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
  // favorites get first pick when available
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
  week.forEach(day=>day.meals.forEach(meal=>{
    if(!meal.recipe) return;
    const nm=meal.recipe.name.toLowerCase();
    if(!seen.has(nm)){ seen.add(nm); return; }
    // collision → try to find an eligible recipe (same course role) whose name isn't used yet
    const role=meal.course==='main'?meal.type:(meal.course||meal.type);
    const pool=eligibleRecipes(role,profile);
    const fresh=pool.filter(r=>!seen.has(r.name.toLowerCase()));
    if(fresh.length){
      const r=fresh[Math.floor(Math.random()*fresh.length)];
      meal.recipe=scaleRecipe(r,n); seen.add(r.name.toLowerCase());
    } else { seen.add(nm); }   // pool exhausted (tiny offline set) — leave it; AI weeks won't hit this
  }));
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
  if(r)meal.recipe=scaleRecipe(r,peopleCount());
}

/* ============================================================
   3a. Recipe links + dish images (§3.3, §3.4)
   ============================================================ */
// Real, never-hallucinated recipe link: a Google search for the dish (always resolves).
function recipeSearchUrl(name){ return 'https://www.google.com/search?q='+encodeURIComponent((name||'')+' recette'); }

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
  return { id:'ai'+(nextId++), type:r.type, name:r.name, desc:r.desc, time:r.time,
    difficulty:r.difficulty, emoji:r.emoji||'🍽️', img:r.img||'food', tags:r.tags||[],
    kcal:(typeof r.kcal==='number'?Math.round(r.kcal):undefined),
    protein:(typeof r.protein==='number'?Math.round(r.protein):undefined),
    ingredients:(r.ingredients||[]).map(i=>({...i})), steps:r.steps||[] };
}
function aiSlot(mealType,course,r){ return {type:mealType,course,recipe:normalizeRecipe({...r,type:mealType}),rejected:false}; }
async function requestWeekAI(profile){
  const res=await fetch(BACKEND_URL+'/generate-week',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(profile)});
  if(!res.ok)throw new Error('backend '+res.status);
  const data=await res.json();
  if(!data.week)throw new Error('bad response');
  // AI shape v3: breakfast is a recipe; lunch/dinner carry a `courses` object. Flatten to slots.
  return data.week.map(day=>{
    const meals=[];
    (day.meals||[]).forEach(m=>{
      const mealType=m.type||'dinner';
      if(m.courses && typeof m.courses==='object'){
        ['starter','main','dessert'].forEach(c=>{ if(m.courses[c]) meals.push(aiSlot(mealType,c,m.courses[c])); });
      } else {
        meals.push(aiSlot(mealType,'main',m));   // breakfast, or a flat meal (back-compat)
      }
    });
    return {day:day.day,meals};
  });
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
  updateSteps();
  // The 1·2·3 step bar is only meaningful inside the planner flow — hide it on sign-in.
  const stepsEl=document.querySelector('.steps');
  // Sign-in and the onboarding wizard each have their own progress UI — hide the 1·2·3 bar there.
  if(stepsEl)stepsEl.style.display=(state.screen==='signin'||state.screen==='profile')?'none':'';
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
      <div class="logo"><span class="mark" aria-hidden="true">🍽</span> Table</div>
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

  <section class="sec" id="preview" style="background:var(--surface-2)">
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

  <section class="sec" style="padding-top:24px">
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

  <section class="sec" style="background:var(--surface-2)">
    <div class="wrap">
      <div class="center"><div class="sec-kicker">Good questions</div><h2 style="margin:10px auto 0">Everything you might ask.</h2></div>
      <div class="faq">
        <details open><summary>Is it really free? <span class="plus" aria-hidden="true">＋</span></summary><p>Yes — free forever, no card required. We built Table to be genuinely useful, not to upsell you.</p></details>
        <details><summary>Do I need to cook every night? <span class="plus" aria-hidden="true">＋</span></summary><p>Not at all. Turn on "cook once, eat twice" and Table plans leftovers for you, doubling the right dinners so nothing goes to waste.</p></details>
        <details><summary>Can I swap meals I don't like? <span class="plus" aria-hidden="true">＋</span></summary><p>Tap ✕ on any dish to swap it instantly, or browse categories and add your own favorites to any day.</p></details>
        <details><summary>Where do the recipes link to? <span class="plus" aria-hidden="true">＋</span></summary><p>Every dish links to a real recipe search — no dead links, no fabricated pages. What you see is what you can cook.</p></details>
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
          <div class="logo"><span class="mark" aria-hidden="true">🍽</span> Table</div>
          <p style="color:#C9C1B4;font-size:var(--fs-sm);margin-top:12px;max-width:34ch">Dinner, sorted. A calm little app for eating well all week — made with love in France.</p>
        </div>
        <div><h4>Product</h4><a href="#how">How it works</a><a href="#preview">The planner</a><a data-signin>Sign up</a></div>
        <div><h4>Company</h4><a data-signin>Get started</a><a data-signin>Our promise</a></div>
        <div><h4>Legal</h4><a data-signin>Privacy</a><a data-signin>Terms</a></div>
      </div>
      <div class="baseline"><span>© 2026 Table · Bon appétit.</span><span>Free forever · Made in France 🇫🇷</span></div>
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

/* ----- Sign-in / sign-up (magic link + Google) — cloud mode only ----- */
function renderSignIn(){
  const cloudOn = !!(window.Cloud && window.Cloud.enabled);
  app.innerHTML=`
    <div class="card auth-card">
      <a class="top-back" id="backHome" role="button" tabindex="0">← Back home</a>
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
  const backHome=document.getElementById('backHome');
  if(backHome) backHome.onclick=()=>setScreen('landing');
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
      ${hasSavedData()?'<div class="q-util"><button type="button" class="btn btn-ghost btn-sm" id="q-clear">Clear saved data &amp; start fresh</button></div>':''}
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
        <span><b>Use real AI generation</b> <span class="hint">— personalized, but uses 1 of your ~20 free Gemini requests/day. Off by default so testing doesn't burn your quota.</span></span></label>
    </div>

    <div class="q-foot">
      <button type="button" class="q-back" id="q-back" style="visibility:hidden">← Back</button>
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
    nextBtn.textContent=cur===Q_STEPS-1?'Plan my first week 🎉':'Continue';
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
  if(clearBtn) clearBtn.onclick=()=>{ if(confirm("Clear your saved profile, week and favorites? This can't be undone.")) clearAllData(); };
  const signOutBtn=document.getElementById('q-signout');
  if(signOutBtn) signOutBtn.onclick=async()=>{ try{ await window.Cloud.signOut(); }catch(e){ console.warn('Sign out failed:', e&&e.message); } };

  backBtn.onclick=()=>{ persist(); showStep(cur-1); };
  nextBtn.onclick=async()=>{
    persist();
    if(cur<Q_STEPS-1){ showStep(cur+1); return; }
    // --- finish: generate the week ---
    state.checked={};   // fresh week, fresh list
    setScreen('loading');
    if(state.useAI){
      try { state.week=enforceNoRepeat(await requestWeekAI(state.profile),state.profile); state.usedFallback=false; }
      catch(e){ console.warn('Backend unavailable, using local pool:',e.message); state.week=generateWeek(state.profile); state.usedFallback=true; }
    } else {
      state.week=generateWeek(state.profile); state.usedFallback=false;
    }
    if(state.profile.leftovers) applyLeftovers(state.week);
    setScreen('review');
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
function mealCard(meal,di,mi){
  if(meal.loading)return `<div class="meal"><div class="thumb ${meal.type}"><div class="mini-spin"></div></div>
    <div class="body"><div><div class="type">${mealTypeLabel(meal)}</div><div class="name" style="color:var(--muted)">finding a new dish…</div></div></div></div>`;
  const r=meal.recipe;
  if(!r)return `<div class="meal"><div class="body"><div><div class="type">${mealTypeLabel(meal)}</div><div class="name">— no option —</div></div></div></div>`;
  const diffLabel=['','Very easy','Easy','Medium','Involved','Advanced'][r.difficulty]||'';
  const extra=(r.isLeftover?'<span class="badge leftover">♻️ Leftover — just reheat</span>':'')
    +(r.batchNote?'<span class="badge batch">🍲 Cook double → tomorrow\'s lunch</span>':'');
  return `<div class="meal ${meal.rejected?'rejected':''}">
    <div class="thumb ${meal.type}">${r.isLeftover?'♻️':(r.emoji||'🍽️')}</div>
    <div class="body"><div>
      <div class="type">${mealTypeLabel(meal)}</div><div class="name">${r.name}</div><div class="desc">${r.desc}</div>
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
/* ---- planner v2 (design 04): week rail + "Plan for me" / "Browse & add" modes ---- */
function showToast(msg){
  const t=document.createElement('div'); t.className='copied-toast'; t.textContent=msg;
  document.body.appendChild(t); setTimeout(()=>t.remove(),2000);
}
// a small square thumbnail for the rail (photo, else emoji tile)
function railSlot(day,mealType){
  const slot=day.meals.find(m=>m.type===mealType&&(m.course==='main'||m.course==='single'||!m.course));
  const lab={breakfast:'B',lunch:'L',dinner:'D'}[mealType];
  if(!slot||!slot.recipe) return `<div class="slot empty" data-add-day="${DAYS.indexOf(day.day)}" title="Add ${mealType}">＋</div>`;
  const img=dishImageUrl(slot.recipe);
  const inner=img?`<img src="${img}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'emoji-fill',textContent:'${slot.recipe.emoji||'🍽️'}'}))">`
    :`<div class="emoji-fill">${slot.recipe.emoji||'🍽️'}</div>`;
  return `<div class="slot" title="${slot.recipe.name}">${inner}<span class="lab">${lab}</span></div>`;
}
function railHtml(){
  let rows='';
  state.week.forEach((day,di)=>{
    const kc=dayKcal(day);
    rows+=`<div class="day-row" data-drop-day="${di}">
      <div class="dh"><b>${day.day}</b><span class="kcal">${kc?kc.toLocaleString('en-US')+' kcal':'—'}</span></div>
      <div class="slots">${railSlot(day,'breakfast')}${railSlot(day,'lunch')}${railSlot(day,'dinner')}</div>
    </div>`;
  });
  return `<aside class="rail"><h2>This week</h2><div class="sub">Drag a dish onto a day, or tap ＋</div>${rows}</aside>`;
}
// browse card (recipe-card token markup) — draggable, with ⊕ add + ♥ fav
function browseCard(r){
  const img=dishImageUrl(r);
  const photo=img?`<img src="${img}" alt="" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'emoji-fill big',textContent:'${r.emoji||'🍽️'}'}))">`
    :`<div class="emoji-fill big">${r.emoji||'🍽️'}</div>`;
  const kc=typeof r.kcal==='number'?`<span class="badge badge-tomato">${r.kcal} kcal</span>`:'';
  const pr=typeof r.protein==='number'?`<span class="badge badge-basil">${r.protein} g</span>`:'';
  return `<article class="recipe-card" draggable="true" data-rid="${r.id}">
    <div class="photo">${photo}
      <button class="icon-btn fav ${isFavorite(r.name)?'on':''}" data-bfav="${r.id}" title="Save as favorite">${isFavorite(r.name)?'♥':'♡'}</button>
      <button class="icon-btn add" data-badd="${r.id}" title="Add to a day">＋</button></div>
    <div class="body"><span class="cat">${r.type}</span><h3 class="title">${r.name}</h3>
      <div class="meta"><span class="badge">⏱ ${r.time} min</span>${kc||pr}</div></div>
  </article>`;
}
function carousel(title,list){
  if(!list.length) return '';
  return `<div class="cat-block"><div class="cat-head"><h3>${title}</h3></div>
    <div class="carousel">${list.map(browseCard).join('')}</div></div>`;
}
function findBrowseRecipe(id){
  return [...RECIPES,...STARTERS,...DESSERTS,...state.favorites].find(r=>String(r.id)===String(id));
}
// place a browsed dish onto a day at its natural meal (breakfast/lunch/dinner main)
function addDishToDay(recipe,di){
  const day=state.week[di]; if(!day) return;
  const mealType=(recipe.type==='breakfast'||recipe.type==='lunch'||recipe.type==='dinner')?recipe.type:'dinner';
  let slot=day.meals.find(m=>m.type===mealType&&(m.course==='main'||m.course==='single'||!m.course));
  const scaled=scaleRecipe({...recipe},peopleCount());
  if(slot){ slot.recipe=scaled; slot.rejected=false; }
  else { day.meals.push({type:mealType,course:'main',recipe:scaled,rejected:false}); }
  saveState(); showToast(`✓ ${recipe.name} → ${day.day}`); renderReview();
}
function openDayPicker(recipe,anchor){
  document.querySelectorAll('.day-picker').forEach(el=>el.remove());
  const menu=document.createElement('div'); menu.className='day-picker';
  menu.innerHTML=`<div class="dp-head">Add “${recipe.name}” to…</div>`+
    state.week.map((d,di)=>`<button data-pick="${di}">${d.day}</button>`).join('');
  document.body.appendChild(menu);
  const r=anchor.getBoundingClientRect();
  menu.style.top=(window.scrollY+r.bottom+6)+'px';
  menu.style.left=Math.min(window.scrollX+r.left, window.scrollX+window.innerWidth-menu.offsetWidth-12)+'px';
  menu.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{ addDishToDay(recipe,Number(b.dataset.pick)); menu.remove(); });
  const close=(e)=>{ if(!menu.contains(e.target)){ menu.remove(); document.removeEventListener('click',close); } };
  setTimeout(()=>document.addEventListener('click',close),0);
}
function planBodyHtml(){
  const tgt=computeTargets(state.profile);
  let html='';
  if(tgt){
    const per=computeMealTargets(state.profile);
    const perLine=per?` <span class="hint">· roughly ${per.breakfast} / ${per.lunch} / ${per.dinner} kcal across breakfast, lunch & dinner</span>`:'';
    html+=`<div class="target-banner"><div class="tgt-ico">🎯</div>
      <div><div class="tgt-main">Your daily target: ~${tgt.kcal} kcal · ${tgt.protein} g protein <span class="hint">per person</span></div>
      <div class="tgt-sub">Estimated from your height, weight, age, activity and goal (Mifflin–St Jeor).${perLine}</div></div></div>`;
  }
  if(state.usedFallback)html+=`<div class="notice">⚠️ Backend offline — showing built-in meals, not AI (no budget/prices).</div>`;
  else if(!state.useAI)html+=`<div class="notice info">ℹ️ Showing built-in meals — AI generation is off. Tick "Use real AI generation" on the profile page for a personalized week.</div>`;
  state.week.forEach((day,di)=>{
    const kc=dayKcal(day);
    html+=`<div class="day-block"><div class="day-head"><h3 class="day-title">${day.day}</h3>
      ${kc?`<span class="day-kcal">≈ ${kc} kcal/day per person (est.)</span>`:''}</div>`;
    day.meals.forEach((meal,mi)=>html+=mealCard(meal,di,mi));
    html+=`</div>`;
  });
  return html;
}
function browseBodyHtml(){
  const favs=state.favorites.slice().reverse();
  const quick=[...RECIPES].filter(r=>['breakfast','lunch','dinner'].includes(r.type)&&r.time<=12);
  const bfast=RECIPES.filter(r=>r.type==='breakfast');
  const lunches=RECIPES.filter(r=>r.type==='lunch');
  const dinners=RECIPES.filter(r=>r.type==='dinner');
  return `<p class="drag-hint">↔ Drag a card onto a day in the week, or tap ⊕ to choose a day.</p>
    ${carousel('From your favorites ♥',favs)}
    ${carousel('Quick & easy',quick)}
    ${carousel('Breakfasts',bfast)}
    ${carousel('Lunch mains',lunches)}
    ${carousel('Dinner mains',dinners)}`;
}
function renderReview(){
  const nm=(state.profile?.name||'').trim();
  const mode=state.plannerMode;
  app.innerHTML=`
    <div class="planner-head">
      <h2>${nm?nm+"'s week":'Your week'}</h2>
      <div class="mode-toggle">
        <button data-mode="plan" class="${mode==='plan'?'on':''}">✨ Plan for me</button>
        <button data-mode="browse" class="${mode==='browse'?'on':''}">🧺 Browse &amp; add</button>
      </div>
    </div>
    <div class="planner">
      ${railHtml()}
      <main class="planner-main">${mode==='browse'?browseBodyHtml():planBodyHtml()}</main>
    </div>
    <div class="status-bar">
      <span class="count">${mode==='browse'?'Drag or ⊕ to add · ♥ favorite':'✕ swap · ♥ favorite'}</span>
      <div class="btn-row">
        <button class="ghost" id="backBtn">← Edit profile</button>
        <button class="ghost" id="recipesBtn">📖 Recipes by day</button>
        <button class="primary" id="listBtn" style="margin-top:0">Shopping list →</button>
      </div>
    </div>`;
  // mode toggle
  app.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{ state.plannerMode=b.dataset.mode; renderReview(); });
  // plan-mode swap / fav
  app.querySelectorAll('[data-swap]').forEach(btn=>{
    btn.onclick=async()=>{
      const [di,mi]=btn.dataset.swap.split('-').map(Number);
      const meal=state.week[di].meals[mi];
      if(!state.useAI){ swapMeal(di,mi); renderReview(); saveState(); return; }
      const role=meal.course==='main'?meal.type:(meal.course||meal.type);
      const avoid=[]; state.week.forEach(d=>d.meals.forEach(m=>{if(m.recipe)avoid.push(m.recipe.name);}));
      meal.loading=true; renderReview();
      try { meal.recipe=await requestSwapAI(state.profile,role,avoid); }
      catch(e){ console.warn('Swap failed, local:',e.message); swapMeal(di,mi); }
      meal.loading=false; renderReview(); saveState();
    };
  });
  app.querySelectorAll('[data-fav]').forEach(btn=>{
    btn.onclick=()=>{ const [di,mi]=btn.dataset.fav.split('-').map(Number);
      const r=state.week[di].meals[mi].recipe; if(r){ toggleFavorite(r); renderReview(); } };
  });
  // browse-mode add / fav
  app.querySelectorAll('[data-badd]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation();
    const r=findBrowseRecipe(b.dataset.badd); if(r)openDayPicker(r,b); });
  app.querySelectorAll('[data-bfav]').forEach(b=>b.onclick=(e)=>{ e.stopPropagation();
    const r=findBrowseRecipe(b.dataset.bfav); if(r){ toggleFavorite(r); renderReview(); } });
  // drag & drop: cards → rail days
  app.querySelectorAll('.recipe-card[draggable]').forEach(card=>{
    card.addEventListener('dragstart',e=>{ e.dataTransfer.setData('text/plain',card.dataset.rid); e.dataTransfer.effectAllowed='copy'; card.classList.add('dragging'); });
    card.addEventListener('dragend',()=>card.classList.remove('dragging'));
  });
  app.querySelectorAll('.day-row[data-drop-day]').forEach(row=>{
    row.addEventListener('dragover',e=>{ e.preventDefault(); e.dataTransfer.dropEffect='copy'; row.classList.add('drop'); });
    row.addEventListener('dragleave',()=>row.classList.remove('drop'));
    row.addEventListener('drop',e=>{ e.preventDefault(); row.classList.remove('drop');
      const r=findBrowseRecipe(e.dataTransfer.getData('text/plain')); if(r)addDishToDay(r,Number(row.dataset.dropDay)); });
  });
  // empty rail slots: tap ＋ to add via day already known
  app.querySelectorAll('.slot.empty[data-add-day]').forEach(s=>s.onclick=()=>{ state.plannerMode='browse'; renderReview(); });
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
            <div class="rtype">${mealTypeLabel(m)}</div>
            <div class="rname">♻️ ${r.name}</div>
            <p class="list-note">${r.desc||''}. You already bought and cooked this — nothing extra to shop for. Just reheat until piping hot.</p>
            <div class="badges"><span class="badge leftover">♻️ Leftover</span>${nutriBadges(r)}</div>
          </div>`;
        }
        const imgUrl=dishImageUrl(r);
        return `<div class="recipe">
          ${imgUrl?`<div class="recipe-photo"><img src="${imgUrl}" alt="" loading="lazy" onerror="this.closest('.recipe-photo').remove()"></div>`:''}
          <div class="rtype">${mealTypeLabel(m)}</div>
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
            <a class="recipe-link" href="${recipeSearchUrl(r.name)}" target="_blank" rel="noopener noreferrer">See full recipe ↗</a>
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
      <p class="sub">Built from ${mealCount()} dishes across the week. Repeated items are added up automatically. Ticks are remembered — even if you close the page.</p>
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
  state.profile = migrateProfile(s.profile) || null;
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
