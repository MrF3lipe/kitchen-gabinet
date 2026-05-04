import { M as useRouter, r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CdCgfE48.js";
import { L as Link } from "./router-B9RXT7T5.js";
function useLocation(opts) {
  const router = useRouter();
  {
    const location = router.stores.location.get();
    return location;
  }
}
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const toCamelCase = (string) => string.replace(
  /^([A-Z])|[\s-_]+(\w)/g,
  (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase()
);
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => reactExports.createElement(
    "svg",
    {
      ref,
      ...defaultAttributes,
      width: size,
      height: size,
      stroke: color,
      strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
      className: mergeClasses("lucide", className),
      ...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
      ...rest
    },
    [
      ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
      ...Array.isArray(children) ? children : [children]
    ]
  )
);
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(
        `lucide-${toKebabCase(toPascalCase(iconName))}`,
        `lucide-${iconName}`,
        className
      ),
      ...props
    })
  );
  Component.displayName = toPascalCase(iconName);
  return Component;
};
const __iconNode$5 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$5);
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  [
    "path",
    {
      d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",
      key: "9ktpf1"
    }
  ]
];
const Compass = createLucideIcon("compass", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    { d: "M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z", key: "fpq118" }
  ],
  ["path", { d: "M5 10h14", key: "elsbfy" }],
  ["path", { d: "M15 7v6", key: "1nx30x" }]
];
const Refrigerator = createLucideIcon("refrigerator", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
      key: "1i5ecw"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$1);
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  let dbp;
  const getDB = () => {
    if (dbp)
      return dbp;
    const request = indexedDB.open(dbName);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName);
    dbp = promisifyRequest(request);
    dbp.then((db2) => {
      db2.onclose = () => dbp = void 0;
    }, () => {
    });
    return dbp;
  };
  return (txMode, callback) => getDB().then((db2) => callback(db2.transaction(storeName, txMode).objectStore(storeName)));
}
let defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
const img = (q) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=900&q=70`;
function seedRecipes() {
  const now = Date.now();
  const base = (i, r) => ({
    ...r,
    id: `seed-${i}`,
    createdAt: now - i * 1e3,
    updatedAt: now - i * 1e3
  });
  return [
    base(1, {
      title: "Sopa de Tomate Rostizado con Albahaca",
      title_en: "Roasted Tomato & Basil Soup",
      description: "Una receta reconfortante que aprovecha al máximo los tomates maduros y un toque de albahaca fresca.",
      description_en: "A comforting recipe that makes the most of ripe tomatoes with a touch of fresh basil.",
      image: img("photo-1547592180-85f173990554/1600x900"),
      category: "soup",
      difficulty: "easy",
      timeMinutes: 25,
      servings: 4,
      ingredients: [
        { name: "Tomates maduros", quantity: "1 kg" },
        { name: "Cebolla", quantity: "1" },
        { name: "Ajo", quantity: "3 dientes" },
        { name: "Albahaca fresca", quantity: "1 puñado" },
        { name: "Aceite de oliva", quantity: "3 cdas" },
        { name: "Sal", quantity: "al gusto" }
      ],
      ingredients_en: [
        { name: "Ripe tomatoes", quantity: "1 kg" },
        { name: "Onion", quantity: "1" },
        { name: "Garlic", quantity: "3 cloves" },
        { name: "Fresh basil", quantity: "1 handful" },
        { name: "Olive oil", quantity: "3 tbsp" },
        { name: "Salt", quantity: "to taste" }
      ],
      equipment: ["Horno", "Licuadora", "Olla"],
      equipment_en: ["Oven", "Blender", "Pot"],
      steps: [
        "Precalienta el horno a 200°C. Corta los tomates a la mitad y colócalos en una bandeja con la cebolla y el ajo.",
        "Rocía con aceite de oliva y sal. Asa durante 25 minutos hasta que los bordes se doren.",
        "Pasa todo a la licuadora con la albahaca y procesa hasta obtener una crema suave.",
        "Calienta en una olla 5 minutos. Sirve con un chorrito de aceite y hojas de albahaca."
      ],
      steps_en: [
        "Preheat oven to 200°C/400°F. Halve tomatoes and place on a tray with onion and garlic.",
        "Drizzle with olive oil and salt. Roast 25 minutes until edges caramelise.",
        "Blend everything with basil until smooth.",
        "Warm in a pot for 5 minutes. Serve with olive oil and basil leaves."
      ],
      featured: true
    }),
    base(2, {
      title: "Ensalada Caprese Rústica",
      title_en: "Rustic Caprese Salad",
      description: "Fresca, rápida y sin necesidad de cocinar. Ideal para aprovechar tus tomates más jugosos.",
      description_en: "Fresh, fast, and no cooking needed. Perfect for the juiciest tomatoes.",
      image: img("photo-1592417817038-d13fd7342605/1600x900"),
      category: "salad",
      difficulty: "easy",
      timeMinutes: 10,
      servings: 2,
      ingredients: [
        { name: "Tomate", quantity: "2 grandes" },
        { name: "Mozzarella fresca", quantity: "200g" },
        { name: "Albahaca fresca", quantity: "10 hojas" },
        { name: "Aceite de oliva", quantity: "2 cdas" },
        { name: "Sal y pimienta", quantity: "al gusto" }
      ],
      ingredients_en: [
        { name: "Tomato", quantity: "2 large" },
        { name: "Fresh mozzarella", quantity: "200g" },
        { name: "Fresh basil", quantity: "10 leaves" },
        { name: "Olive oil", quantity: "2 tbsp" },
        { name: "Salt & pepper", quantity: "to taste" }
      ],
      equipment: ["Cuchillo", "Tabla"],
      equipment_en: ["Knife", "Board"],
      steps: [
        "Corta los tomates y la mozzarella en rodajas del mismo grosor.",
        "Alterna en un plato con las hojas de albahaca.",
        "Riega con aceite de oliva, sal y pimienta. Sirve de inmediato."
      ],
      steps_en: [
        "Slice tomatoes and mozzarella to similar thickness.",
        "Alternate on a plate with basil leaves.",
        "Drizzle with olive oil, salt and pepper. Serve immediately."
      ]
    }),
    base(3, {
      title: "Salsa Base de Tomate y Cebolla",
      title_en: "Tomato & Onion Base Sauce",
      description: "El bloque de construcción perfecto para pastas, guisos y pizzas, usando tus tomates frescos.",
      description_en: "The perfect base for pastas, stews and pizzas, using fresh tomatoes.",
      image: img("photo-1608897013039-887f21d8c804/1600x900"),
      category: "sauce",
      difficulty: "medium",
      timeMinutes: 45,
      servings: 6,
      ingredients: [
        { name: "Tomates pelados", quantity: "800g" },
        { name: "Cebolla picada", quantity: "1" },
        { name: "Ajo", quantity: "2 dientes" },
        { name: "Aceite de oliva", quantity: "2 cdas" },
        { name: "Orégano seco", quantity: "1 cdita" }
      ],
      equipment: ["Olla", "Cuchara"],
      steps: [
        "Sofríe la cebolla en aceite hasta dorar. Añade el ajo 1 minuto.",
        "Agrega los tomates pelados aplastados y el orégano.",
        "Cuece a fuego bajo 30 minutos removiendo. Ajusta sal y reserva."
      ]
    }),
    base(4, {
      title: "Pan de Masa Madre Rústico",
      title_en: "Rustic Sourdough Bread",
      description: "Una receta clásica de panadería artesanal. Exterior crujiente, miga suave y aireada con ese toque ácido de la masa madre.",
      description_en: "Classic artisan sourdough. Crisp crust, airy crumb and that signature tang.",
      image: img("photo-1509440159596-0249088772ff/1600x900"),
      category: "bakery",
      difficulty: "hard",
      timeMinutes: 45,
      servings: 8,
      ingredients: [
        { name: "Harina de fuerza", quantity: "500g" },
        { name: "Agua tibia", quantity: "350ml" },
        { name: "Masa madre activa", quantity: "100g" },
        { name: "Sal marina fina", quantity: "10g" }
      ],
      equipment: ["Horno 250°C", "Olla de hierro", "Bol grande", "Cuchilla (lame)"],
      equipment_en: ["Oven 250°C", "Dutch oven", "Large bowl", "Lame"],
      steps: [
        "Autólisis: mezcla harina y agua, deja reposar 1 hora.",
        "Incorpora la masa madre y la sal. Amasa con técnica slap & fold 5–7 minutos.",
        "Fermentación en bloque 3 horas con pliegues cada 30 minutos.",
        "Forma una hogaza, enharina y deja en banneton en frío 12–16 horas.",
        "Hornea en olla cerrada 20 min a 250°C, luego destapa 20 min más."
      ],
      featured: true
    }),
    base(5, {
      title: "Pizza Margarita Clásica",
      title_en: "Classic Margherita Pizza",
      description: "Masa fina, salsa de tomate, mozzarella fundente y albahaca fresca.",
      description_en: "Thin crust, tomato sauce, melting mozzarella and fresh basil.",
      image: img("photo-1604068549290-dea0e4a305ca/1600x900"),
      category: "dinner",
      difficulty: "medium",
      timeMinutes: 45,
      servings: 2,
      ingredients: [
        { name: "Masa de pizza", quantity: "1" },
        { name: "Salsa de tomate", quantity: "150g" },
        { name: "Mozzarella", quantity: "200g" },
        { name: "Albahaca fresca", quantity: "al gusto" }
      ],
      equipment: ["Horno", "Bandeja"],
      steps: [
        "Precalienta el horno al máximo con la bandeja dentro.",
        "Estira la masa, añade salsa y mozzarella.",
        "Hornea 8–10 minutos hasta que burbujee. Añade albahaca al sacar."
      ]
    }),
    base(6, {
      title: "Avena de la Abuela",
      title_en: "Grandma's Oatmeal",
      description: "Avena cremosa con frutos rojos y un toque de miel.",
      description_en: "Creamy oatmeal with berries and a touch of honey.",
      image: img("photo-1517673132405-a56a62b18caf/1600x900"),
      category: "breakfast",
      difficulty: "easy",
      timeMinutes: 15,
      servings: 2,
      ingredients: [
        { name: "Avena", quantity: "1 taza" },
        { name: "Leche", quantity: "2 tazas" },
        { name: "Frutos rojos", quantity: "1 taza" },
        { name: "Miel", quantity: "2 cdas" }
      ],
      equipment: ["Olla pequeña"],
      steps: [
        "Lleva la leche a fuego medio.",
        "Añade la avena y cuece 5 minutos removiendo.",
        "Sirve con frutos rojos y miel."
      ]
    }),
    base(7, {
      title: "Pasta Casera al Pesto",
      title_en: "Homemade Pesto Pasta",
      description: "Spaghetti con pesto fresco de albahaca y piñones.",
      description_en: "Spaghetti tossed in fresh basil and pine nut pesto.",
      image: img("photo-1551183053-bf91a1d81141/1600x900"),
      category: "lunch",
      difficulty: "easy",
      timeMinutes: 35,
      servings: 4,
      ingredients: [
        { name: "Spaghetti", quantity: "400g" },
        { name: "Albahaca fresca", quantity: "60g" },
        { name: "Piñones", quantity: "30g" },
        { name: "Parmesano", quantity: "50g" },
        { name: "Aceite de oliva", quantity: "100ml" },
        { name: "Ajo", quantity: "1 diente" }
      ],
      equipment: ["Olla", "Procesador"],
      steps: [
        "Cuece la pasta en agua con sal según el paquete.",
        "Procesa albahaca, ajo, piñones, parmesano y aceite.",
        "Mezcla con la pasta caliente y un poco de agua de cocción."
      ]
    }),
    base(8, {
      title: "Delicia de Capas",
      title_en: "Layered Delight",
      description: "Postre frío en vaso con galleta, crema y frutos rojos.",
      description_en: "Cold dessert in a glass with biscuit, cream and berries.",
      image: img("photo-1587314168485-3236d6710814/1600x900"),
      category: "dessert",
      difficulty: "easy",
      timeMinutes: 60,
      servings: 4,
      ingredients: [
        { name: "Galletas", quantity: "200g" },
        { name: "Queso crema", quantity: "300g" },
        { name: "Crema de leche", quantity: "200ml" },
        { name: "Frutos rojos", quantity: "150g" },
        { name: "Azúcar", quantity: "80g" }
      ],
      equipment: ["Vasos", "Batidora"],
      steps: [
        "Tritura las galletas. Bate queso crema, crema y azúcar.",
        "Alterna capas en vasos: galleta, crema, frutos rojos.",
        "Refrigera al menos 1 hora antes de servir."
      ]
    }),
    base(9, {
      title: "Ensalada Rústica de la Huerta",
      title_en: "Garden Rustic Salad",
      description: "Mezcla fresca y reconfortante de vegetales asados con vinagreta de hierbas.",
      description_en: "Fresh, hearty mix of roasted vegetables with herb vinaigrette.",
      image: img("photo-1540420773420-3366772f4999/1600x900"),
      category: "salad",
      difficulty: "easy",
      timeMinutes: 25,
      servings: 2,
      ingredients: [
        { name: "Mezcla de hojas verdes", quantity: "150g" },
        { name: "Tomates cherry", quantity: "200g" },
        { name: "Pepino", quantity: "1" },
        { name: "Aceite de oliva", quantity: "3 cdas" },
        { name: "Vinagre balsámico", quantity: "1 cda" }
      ],
      equipment: ["Bol", "Cuchillo"],
      steps: [
        "Lava y corta los vegetales.",
        "Mezcla aceite y vinagre con sal.",
        "Combina todo y sirve."
      ],
      featured: true
    }),
    base(10, {
      title: "Tortilla Española",
      title_en: "Spanish Omelette",
      description: "Clásica tortilla de patatas con cebolla pochada.",
      description_en: "Classic potato omelette with slow-cooked onion.",
      image: img("photo-1568901346375-23c9450c58cd/1600x900"),
      category: "lunch",
      difficulty: "medium",
      timeMinutes: 40,
      servings: 4,
      ingredients: [
        { name: "Patatas", quantity: "500g" },
        { name: "Cebolla", quantity: "1" },
        { name: "Huevos", quantity: "6" },
        { name: "Aceite de oliva", quantity: "200ml" },
        { name: "Sal", quantity: "al gusto" }
      ],
      equipment: ["Sartén", "Plato grande"],
      steps: [
        "Confita patatas y cebolla en aceite a fuego bajo 25 minutos.",
        "Bate los huevos, mezcla con las patatas escurridas.",
        "Cuaja en sartén 4 minutos por lado dándole la vuelta con un plato."
      ]
    }),
    base(11, {
      title: "Smoothie Verde",
      title_en: "Green Smoothie",
      description: "Bebida refrescante con espinacas, plátano y manzana.",
      description_en: "Refreshing drink with spinach, banana and apple.",
      image: img("photo-1610970881699-44a5587cabec/1600x900"),
      category: "drink",
      difficulty: "easy",
      timeMinutes: 5,
      servings: 1,
      ingredients: [
        { name: "Espinacas frescas", quantity: "1 taza" },
        { name: "Plátano", quantity: "1" },
        { name: "Manzana", quantity: "1" },
        { name: "Agua", quantity: "200ml" }
      ],
      equipment: ["Licuadora"],
      steps: ["Pela y trocea las frutas.", "Licúa todo con el agua hasta que esté cremoso."]
    }),
    base(12, {
      title: "Curry de Garbanzos",
      title_en: "Chickpea Curry",
      description: "Reconfortante curry vegetariano con leche de coco.",
      description_en: "Comforting vegetarian curry with coconut milk.",
      image: img("photo-1565557623262-b51c2513a641/1600x900"),
      category: "dinner",
      difficulty: "medium",
      timeMinutes: 35,
      servings: 4,
      ingredients: [
        { name: "Garbanzos cocidos", quantity: "400g" },
        { name: "Leche de coco", quantity: "400ml" },
        { name: "Cebolla", quantity: "1" },
        { name: "Ajo", quantity: "3 dientes" },
        { name: "Curry en polvo", quantity: "2 cdas" },
        { name: "Tomate triturado", quantity: "200g" }
      ],
      equipment: ["Olla"],
      steps: [
        "Sofríe cebolla y ajo. Añade el curry y tuesta 1 minuto.",
        "Agrega tomate y leche de coco. Cuece 10 minutos.",
        "Incorpora garbanzos y cuece 10 minutos más. Sirve con arroz."
      ]
    }),
    base(13, {
      title: "Guacamole Clásico",
      title_en: "Classic Guacamole",
      description: "Aguacate fresco con lima, cilantro y un toque picante.",
      description_en: "Fresh avocado with lime, cilantro and a touch of heat.",
      image: img("photo-1600335895229-6e75511892c8/1600x900"),
      category: "snack",
      difficulty: "easy",
      timeMinutes: 10,
      servings: 4,
      ingredients: [
        { name: "Aguacate maduro", quantity: "3" },
        { name: "Lima", quantity: "1" },
        { name: "Cilantro", quantity: "1 puñado" },
        { name: "Cebolla roja", quantity: "1/2" },
        { name: "Chile", quantity: "1" }
      ],
      equipment: ["Bol", "Tenedor"],
      steps: ["Aplasta los aguacates.", "Mezcla con cebolla, cilantro, chile y zumo de lima."]
    }),
    base(14, {
      title: "Galletas de Avena y Chocolate",
      title_en: "Oat & Chocolate Cookies",
      description: "Crujientes por fuera y tiernas por dentro, con chips de chocolate.",
      description_en: "Crisp outside, tender inside, packed with chocolate chips.",
      image: img("photo-1499636136210-6f4ee915583e/1600x900"),
      category: "dessert",
      difficulty: "easy",
      timeMinutes: 25,
      servings: 12,
      ingredients: [
        { name: "Avena", quantity: "150g" },
        { name: "Harina", quantity: "100g" },
        { name: "Mantequilla", quantity: "100g" },
        { name: "Azúcar moreno", quantity: "100g" },
        { name: "Huevo", quantity: "1" },
        { name: "Chips de chocolate", quantity: "100g" }
      ],
      equipment: ["Horno 180°C", "Bandeja"],
      steps: [
        "Bate mantequilla y azúcar. Añade huevo y mezcla.",
        "Incorpora harina, avena y chocolate.",
        "Forma bolas, aplasta y hornea 12 minutos a 180°C."
      ]
    }),
    base(15, {
      title: "Limonada de Hierbabuena",
      title_en: "Mint Lemonade",
      description: "Refresco casero perfecto para días calurosos.",
      description_en: "Homemade cooler perfect for warm days.",
      image: img("photo-1556881286-fc6915169721/1600x900"),
      category: "drink",
      difficulty: "easy",
      timeMinutes: 10,
      servings: 4,
      ingredients: [
        { name: "Limones", quantity: "4" },
        { name: "Agua fría", quantity: "1L" },
        { name: "Azúcar", quantity: "100g" },
        { name: "Hierbabuena", quantity: "1 ramita" }
      ],
      equipment: ["Jarra"],
      steps: ["Exprime los limones.", "Mezcla con agua, azúcar y hierbabuena. Sirve con hielo."]
    })
  ];
}
function seedPantry() {
  const item = (id, name, name_en, category, available = true) => ({
    id,
    name,
    name_en,
    category,
    available
  });
  return [
    item("p1", "Leche Entera", "Whole milk", "Lácteos & Huevos"),
    item("p2", "Huevos (Docena)", "Eggs (dozen)", "Lácteos & Huevos"),
    item("p3", "Mantequilla sin sal", "Unsalted butter", "Lácteos & Huevos", false),
    item("p4", "Cebolla Blanca", "White onion", "Verduras Frescas"),
    item("p5", "Zanahorias", "Carrots", "Verduras Frescas", false),
    item("p6", "Ajo (Cabezas)", "Garlic (heads)", "Verduras Frescas"),
    item("p7", "Tomate", "Tomato", "Verduras Frescas"),
    item("p8", "Albahaca fresca", "Fresh basil", "Verduras Frescas"),
    item("p9", "Pimienta Negra Molida", "Ground black pepper", "Especias Secas"),
    item("p10", "Sal Marina Fina", "Fine sea salt", "Especias Secas"),
    item("p11", "Orégano Seco", "Dried oregano", "Especias Secas"),
    item("p12", "Aceite de Oliva", "Olive oil", "Aceites & Vinagres"),
    item("p13", "Harina", "Flour", "Granos & Pastas"),
    item("p14", "Avena", "Oats", "Granos & Pastas"),
    item("p15", "Spaghetti", "Spaghetti", "Granos & Pastas")
  ];
}
const KEY = "kc:db:v1";
const defaultSettings = { locale: "es", theme: "light", onboarded: false };
let state = {
  recipes: [],
  pantry: [],
  shopping: [],
  favorites: [],
  settings: defaultSettings
};
let loaded = false;
const listeners$1 = /* @__PURE__ */ new Set();
function notify() {
  listeners$1.forEach((l) => l());
}
async function persist() {
  await set(KEY, state);
}
async function initDb() {
  if (typeof window === "undefined" || loaded) return;
  const stored = await get(KEY);
  if (stored && stored.recipes?.length) {
    state = { ...state, ...stored };
  } else {
    state = {
      recipes: seedRecipes(),
      pantry: seedPantry(),
      shopping: [],
      favorites: [],
      settings: defaultSettings
    };
    await persist();
  }
  if (state.settings.theme === "dark") document.documentElement.classList.add("dark");
  loaded = true;
  notify();
}
function subscribe$1(cb) {
  listeners$1.add(cb);
  return () => listeners$1.delete(cb);
}
function getSnapshot() {
  return state;
}
function getServerSnapshot() {
  return state;
}
function useDb() {
  return reactExports.useSyncExternalStore(subscribe$1, getSnapshot, getServerSnapshot);
}
function update(mutator) {
  state = mutator(state);
  notify();
  void persist();
}
const db = {
  // recipes
  addRecipe(r) {
    update((s) => ({ ...s, recipes: [r, ...s.recipes] }));
  },
  updateRecipe(id, patch) {
    update((s) => ({
      ...s,
      recipes: s.recipes.map((r) => r.id === id ? { ...r, ...patch, updatedAt: Date.now() } : r)
    }));
  },
  deleteRecipe(id) {
    update((s) => ({
      ...s,
      recipes: s.recipes.filter((r) => r.id !== id),
      favorites: s.favorites.filter((f) => f !== id)
    }));
  },
  incrementCooked(id) {
    update((s) => ({
      ...s,
      recipes: s.recipes.map(
        (r) => r.id === id ? { ...r, cookedCount: (r.cookedCount ?? 0) + 1, updatedAt: Date.now() } : r
      )
    }));
  },
  rateRecipe(id, rating) {
    update((s) => ({
      ...s,
      recipes: s.recipes.map((r) => r.id === id ? { ...r, rating, updatedAt: Date.now() } : r)
    }));
  },
  // favorites
  toggleFavorite(id) {
    update((s) => ({
      ...s,
      favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id]
    }));
  },
  // pantry
  addPantry(item) {
    update((s) => ({ ...s, pantry: [...s.pantry, item] }));
  },
  updatePantry(id, patch) {
    update((s) => ({ ...s, pantry: s.pantry.map((p) => p.id === id ? { ...p, ...patch } : p) }));
  },
  deletePantry(id) {
    update((s) => ({ ...s, pantry: s.pantry.filter((p) => p.id !== id) }));
  },
  togglePantry(id) {
    update((s) => ({
      ...s,
      pantry: s.pantry.map((p) => p.id === id ? { ...p, available: !p.available } : p)
    }));
  },
  // shopping
  addShopping(item) {
    update((s) => ({ ...s, shopping: [...s.shopping, item] }));
  },
  addManyShopping(items) {
    update((s) => ({ ...s, shopping: [...s.shopping, ...items] }));
  },
  toggleShopping(id) {
    update((s) => ({
      ...s,
      shopping: s.shopping.map((i) => i.id === id ? { ...i, done: !i.done } : i)
    }));
  },
  deleteShopping(id) {
    update((s) => ({ ...s, shopping: s.shopping.filter((i) => i.id !== id) }));
  },
  clearDoneShopping() {
    update((s) => ({ ...s, shopping: s.shopping.filter((i) => !i.done) }));
  },
  // settings
  setSettings(patch) {
    update((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
    if (patch.theme) {
      document.documentElement.classList.toggle("dark", patch.theme === "dark");
    }
  },
  // backup
  exportAll() {
    return JSON.stringify(state, null, 2);
  },
  importAll(json) {
    const parsed = JSON.parse(json);
    update(() => ({ ...parsed }));
    if (parsed.settings?.theme) {
      document.documentElement.classList.toggle("dark", parsed.settings.theme === "dark");
    }
  }
};
function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
const dict = {
  es: {
    appName: "Kitchen Cabinet",
    explorer: "Explorador",
    search: "Buscar",
    newRecipe: "Nueva Receta",
    pantry: "Despensa",
    favorites: "Favoritos",
    shopping: "Lista de compras",
    settings: "Ajustes",
    cookMode: "Modo Cocina",
    whatToCook: "¿Qué cocinamos hoy?",
    searchPlaceholder: "Buscar por nombre, ingredientes o utensilios",
    searchBtn: "Buscar",
    suggestionsForYou: "Sugerencias para ti",
    results: "resultados",
    ingredientsIHave: "Ingredientes que tengo",
    utensils: "Utensilios",
    difficulty: "Dificultad",
    easy: "Fácil",
    medium: "Medio",
    hard: "Difícil",
    veryEasy: "Muy fácil",
    addOther: "Añadir otro",
    addIngredient: "Añadir Ingrediente",
    addEquipment: "Añadir Equipo",
    addPantry: "Añadir ingrediente",
    myPantry: "Mi Despensa",
    pantrySubtitle: "Gestiona tus ingredientes para saber qué puedes cocinar hoy.",
    ingredients: "Ingredientes",
    equipment: "Equipo",
    instructions: "Instrucciones",
    preparation: "Preparación",
    tools: "Herramientas",
    saveRecipe: "Guardar receta",
    recipeTitle: "Título de la receta",
    titlePlaceholder: "ej. Pasta Carbonara de la Abuela",
    prepTime: "Tiempo de preparación",
    timePlaceholder: "ej. 45 min",
    category: "Categoría",
    selectCategory: "Selecciona una categoría",
    addPhoto: "Añadir foto",
    docCreation: "Documenta tu última creación culinaria.",
    viewRecipe: "Ver Receta",
    featured: "Destacado",
    minutes: "min",
    servings: "porciones",
    youHave: "Tienes",
    of: "de",
    missing: "Faltan",
    addToShopping: "Añadir a la lista",
    online: "Online",
    searchOnline: "Buscar recetas en línea",
    onlinePlaceholder: "ej. risotto de hongos para 4",
    importFromUrl: "Importar desde URL",
    importPlaceholder: "Pega el enlace de una receta",
    import: "Importar",
    saveToLibrary: "Guardar en biblioteca",
    aiAssist: "Asistir con IA",
    aiThinking: "Pensando...",
    share: "Compartir",
    shareAsImage: "Compartir como imagen",
    shareQr: "Código QR",
    exportJson: "Exportar JSON",
    delete: "Eliminar",
    deleteConfirm: "¿Eliminar esta receta?",
    backup: "Copia de seguridad",
    exportAll: "Exportar todo",
    importAll: "Importar copia",
    language: "Idioma",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
    step: "Paso",
    next: "Siguiente",
    previous: "Anterior",
    finish: "Terminar",
    timer: "Temporizador",
    start: "Iniciar",
    pause: "Pausar",
    reset: "Reiniciar",
    nothingYet: "Aún no hay nada aquí.",
    noResults: "Sin resultados. Prueba con otros filtros.",
    download: "Descargar",
    sources: "Fuentes",
    saved: "Guardado",
    expiresOn: "Caduca",
    today: "hoy",
    tomorrow: "mañana",
    daysLeft: "días",
    expired: "caducado",
    cookedTimes: "Cocinado {n} veces",
    rate: "Tu valoración",
    cancel: "Cancelar",
    confirm: "Confirmar",
    close: "Cerrar",
    breakfast: "Desayunos",
    lunch: "Almuerzos",
    dinner: "Cenas",
    dessert: "Postres",
    snack: "Snacks",
    bakery: "Panadería",
    drink: "Bebidas",
    sauce: "Salsas",
    salad: "Ensaladas",
    soup: "Sopas",
    all: "Todo"
  },
  en: {
    appName: "Kitchen Cabinet",
    explorer: "Explorer",
    search: "Search",
    newRecipe: "New Recipe",
    pantry: "Pantry",
    favorites: "Favorites",
    shopping: "Shopping list",
    settings: "Settings",
    cookMode: "Cook Mode",
    whatToCook: "What shall we cook today?",
    searchPlaceholder: "Search by name, ingredients or tools",
    searchBtn: "Search",
    suggestionsForYou: "Suggestions for you",
    results: "results",
    ingredientsIHave: "Ingredients I have",
    utensils: "Utensils",
    difficulty: "Difficulty",
    easy: "Easy",
    medium: "Medium",
    hard: "Hard",
    veryEasy: "Very easy",
    addOther: "Add other",
    addIngredient: "Add Ingredient",
    addEquipment: "Add Equipment",
    addPantry: "Add ingredient",
    myPantry: "My Pantry",
    pantrySubtitle: "Manage your ingredients to know what you can cook today.",
    ingredients: "Ingredients",
    equipment: "Equipment",
    instructions: "Instructions",
    preparation: "Preparation",
    tools: "Tools",
    saveRecipe: "Save recipe",
    recipeTitle: "Recipe title",
    titlePlaceholder: "e.g. Grandma's Sunday Roast",
    prepTime: "Prep & cook time",
    timePlaceholder: "e.g. 45 min",
    category: "Category",
    selectCategory: "Select a category",
    addPhoto: "Add recipe photo",
    docCreation: "Document your latest culinary creation.",
    viewRecipe: "View Recipe",
    featured: "Featured",
    minutes: "min",
    servings: "servings",
    youHave: "You have",
    of: "of",
    missing: "Missing",
    addToShopping: "Add to shopping",
    online: "Online",
    searchOnline: "Search recipes online",
    onlinePlaceholder: "e.g. mushroom risotto for 4",
    importFromUrl: "Import from URL",
    importPlaceholder: "Paste a recipe link",
    import: "Import",
    saveToLibrary: "Save to library",
    aiAssist: "AI assist",
    aiThinking: "Thinking...",
    share: "Share",
    shareAsImage: "Share as image",
    shareQr: "QR code",
    exportJson: "Export JSON",
    delete: "Delete",
    deleteConfirm: "Delete this recipe?",
    backup: "Backup",
    exportAll: "Export everything",
    importAll: "Import backup",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    step: "Step",
    next: "Next",
    previous: "Previous",
    finish: "Finish",
    timer: "Timer",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    nothingYet: "Nothing here yet.",
    noResults: "No results. Try different filters.",
    download: "Download",
    sources: "Sources",
    saved: "Saved",
    expiresOn: "Expires",
    today: "today",
    tomorrow: "tomorrow",
    daysLeft: "days",
    expired: "expired",
    cookedTimes: "Cooked {n} times",
    rate: "Your rating",
    cancel: "Cancel",
    confirm: "Confirm",
    close: "Close",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    dessert: "Desserts",
    snack: "Snacks",
    bakery: "Bakery",
    drink: "Drinks",
    sauce: "Sauces",
    salad: "Salads",
    soup: "Soups",
    all: "All"
  }
};
const LOCALE_KEY = "kc:locale";
let current = "es";
const listeners = /* @__PURE__ */ new Set();
async function initLocale() {
  if (typeof window === "undefined") return;
  const stored = await get(LOCALE_KEY) ?? "es";
  current = stored;
  document.documentElement.lang = current;
  listeners.forEach((l) => l());
}
function setLocale(loc) {
  current = loc;
  if (typeof document !== "undefined") document.documentElement.lang = loc;
  void set(LOCALE_KEY, loc);
  listeners.forEach((l) => l());
}
function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function useLocale() {
  return reactExports.useSyncExternalStore(
    subscribe,
    () => current,
    () => "es"
  );
}
function t(key, locale = current, vars) {
  let value = dict[locale][key] ?? dict.es[key] ?? key;
  if (vars) for (const k of Object.keys(vars)) value = value.replace(`{${k}}`, String(vars[k]));
  return value;
}
function useT() {
  const locale = useLocale();
  return (key, vars) => t(key, locale, vars);
}
function AppShell({ children, title, showHeader = true, showNav = true }) {
  useT();
  reactExports.useEffect(() => {
    void initLocale();
    void initDb();
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex min-h-screen max-w-md flex-col bg-background", children: [
    showHeader && /* @__PURE__ */ jsxRuntimeExports.jsx(AppHeader, { title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: `flex-1 ${showNav ? "pb-24" : ""}`, children }),
    showNav && /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] });
}
function AppHeader({ title }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-14 items-center justify-between px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/settings", className: "rounded-full p-2 text-primary transition hover:bg-surface-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "font-display text-lg font-semibold tracking-tight text-primary", children: title ?? "Kitchen Cabinet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/favorites", className: "rounded-full p-2 text-primary transition hover:bg-surface-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-5 w-5" }) })
  ] }) });
}
function BottomNav() {
  const t2 = useT();
  const { pathname } = useLocation();
  const items = [
    { to: "/", label: t2("explorer"), icon: Compass, match: (p) => p === "/" },
    { to: "/search", label: t2("search"), icon: Search, match: (p) => p.startsWith("/search") },
    { to: "/new", label: t2("newRecipe"), icon: CirclePlus, match: (p) => p.startsWith("/new") },
    { to: "/pantry", label: t2("pantry"), icon: Refrigerator, match: (p) => p.startsWith("/pantry") }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/95 backdrop-blur", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid grid-cols-4", children: items.map(({ to, label, icon: Icon2, match }) => {
      const active = match(pathname);
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to,
          className: `flex flex-col items-center gap-1 py-2.5 text-xs transition ${active ? "text-primary" : "text-on-surface-variant"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: `h-6 w-6 ${active ? "fill-primary/10" : ""}`, strokeWidth: active ? 2.4 : 1.8 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: active ? "font-semibold" : "", children: label })
          ]
        }
      ) }, to);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[env(safe-area-inset-bottom)]" })
  ] });
}
export {
  AppShell as A,
  Search as S,
  useDb as a,
  uid as b,
  createLucideIcon as c,
  db as d,
  useLocale as e,
  setLocale as s,
  useT as u
};
