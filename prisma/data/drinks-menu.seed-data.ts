import type { SeedNutritionalInfo } from './catalog-products.seed-data';

export type SeedDrinkProduct = {
  name: string;
  description?: string;
  note?: string;
  manualKkal: string;
  nutritionalInfo: SeedNutritionalInfo;
  price: string;
  priceVariants?: Array<{ volumeMl: number; price: string }>;
  collectionName: string;
};

export const DRINK_COLLECTIONS = [
  'Чёрный',
  'С молоком',
  'Не кофе',
  'Авторские',
] as const;

/** Меню напитков Cuppcake: объёмные варианты + note где нужно. */
export const DRINK_SEED_PRODUCTS: SeedDrinkProduct[] = [
  {
    name: 'Эспрессо',
    description:
      'Классический плотный шот с насыщенным вкусом и плотной крема. Идеален сам по себе или как основа для молочных напитков.',
    manualKkal: '5',
    nutritionalInfo: { protein: 0.3, fats: 0.1, carbohydrates: 0.8 },
    price: '190',
    priceVariants: [{ volumeMl: 40, price: '190' }],
    collectionName: 'Чёрный',
  },
  {
    name: 'Американо',
    description:
      'Эспрессо, разбавленный горячей водой. Мягче и легче шота, с чистым кофейным вкусом без молока.',
    manualKkal: '8',
    nutritionalInfo: { protein: 0.3, fats: 0.1, carbohydrates: 1.2 },
    price: '200',
    priceVariants: [{ volumeMl: 250, price: '200' }],
    collectionName: 'Чёрный',
  },
  {
    name: 'Фильтр кофе',
    description:
      'Светлая чашка с акцентом на вкус зерна: ягодные, цветочные или цитрусовые ноты в зависимости от лота.',
    manualKkal: '10',
    nutritionalInfo: { protein: 0.4, fats: 0.2, carbohydrates: 1.5 },
    price: '220',
    priceVariants: [
      { volumeMl: 250, price: '220' },
      { volumeMl: 350, price: '250' },
    ],
    collectionName: 'Чёрный',
  },
  {
    name: 'AeroPress',
    description:
      'Заваривание под давлением в AeroPress: чистая, насыщенная чашка с мягким телом и ярким ароматом.',
    manualKkal: '12',
    nutritionalInfo: { protein: 0.4, fats: 0.2, carbohydrates: 1.8 },
    price: '300',
    priceVariants: [{ volumeMl: 200, price: '300' }],
    collectionName: 'Чёрный',
  },
  {
    name: 'Воронка Elf',
    description:
      'Ручное заваривание через воронку: прозрачный вкус, акцент на сладость зерна и чистое послевкусие.',
    manualKkal: '12',
    nutritionalInfo: { protein: 0.4, fats: 0.2, carbohydrates: 1.8 },
    price: '330',
    priceVariants: [{ volumeMl: 300, price: '330' }],
    collectionName: 'Чёрный',
  },
  {
    name: 'Капучино',
    description:
      'Эспрессо с плотной молочной пенкой. Баланс кофейной горечи и сливочной мягкости в классической пропорции.',
    manualKkal: '90',
    nutritionalInfo: { protein: 4, fats: 4, carbohydrates: 8 },
    price: '300',
    priceVariants: [{ volumeMl: 250, price: '300' }],
    collectionName: 'С молоком',
  },
  {
    name: 'Двойной капучино',
    description:
      'Двойной эспрессо под молочной пенкой — более насыщенный и кофейный вариант классического капучино.',
    manualKkal: '120',
    nutritionalInfo: { protein: 5, fats: 5, carbohydrates: 10 },
    price: '350',
    priceVariants: [{ volumeMl: 350, price: '350' }],
    collectionName: 'С молоком',
  },
  {
    name: 'Флэт Уайт',
    description:
      'Двойной эспрессо с тонким слоем микропены. Меньше пены, чем в капучино, больше кофейного вкуса.',
    manualKkal: '95',
    nutritionalInfo: { protein: 4, fats: 4.5, carbohydrates: 8 },
    price: '300',
    priceVariants: [{ volumeMl: 250, price: '300' }],
    collectionName: 'С молоком',
  },
  {
    name: 'Латте',
    description:
      'Мягкий молочный напиток на эспрессо: много молока, лёгкая пенка и спокойный кофейный вкус.',
    manualKkal: '130',
    nutritionalInfo: { protein: 6, fats: 5, carbohydrates: 12 },
    price: '350',
    priceVariants: [{ volumeMl: 350, price: '350' }],
    collectionName: 'С молоком',
  },
  {
    name: 'Раф',
    description:
      'Нежный сливочный напиток на эспрессо со взбитыми сливками — сладкий, плотный и очень мягкий.',
    manualKkal: '160',
    nutritionalInfo: { protein: 5, fats: 8, carbohydrates: 14 },
    price: '370',
    priceVariants: [{ volumeMl: 350, price: '370' }],
    collectionName: 'С молоком',
  },
  {
    name: 'Какао',
    description:
      'Горячий шоколадный напиток на молоке с насыщенным какао и мягкой сладостью.',
    note: '*по желанию можно добавить сироп топинамбура',
    manualKkal: '180',
    nutritionalInfo: { protein: 5, fats: 6, carbohydrates: 24 },
    price: '320',
    collectionName: 'Не кофе',
  },
  {
    name: 'Матча латте',
    description:
      'Японский чай матча на молоке: мягкая травянистая горчинка, кремовая текстура и яркий зелёный цвет.',
    manualKkal: '110',
    nutritionalInfo: { protein: 4, fats: 4, carbohydrates: 12 },
    price: '280',
    priceVariants: [
      { volumeMl: 250, price: '280' },
      { volumeMl: 350, price: '330' },
    ],
    collectionName: 'Не кофе',
  },
  {
    name: 'Фреш апельсин/грейпфрут',
    description:
      'Свежевыжатый сок из апельсина или грейпфрута — яркий, кислый и полностью натуральный.',
    manualKkal: '90',
    nutritionalInfo: { protein: 1, fats: 0.2, carbohydrates: 20 },
    price: '320',
    priceVariants: [{ volumeMl: 210, price: '320' }],
    collectionName: 'Не кофе',
  },
  {
    name: 'Латте с перцем андалиман',
    description:
      'Авторский латте с кокосовой сгущёнкой и перцем андалиман: сладко-сливочный вкус с пряным цитрусовым послевкусием.',
    manualKkal: '150',
    nutritionalInfo: { protein: 5, fats: 7, carbohydrates: 14 },
    price: '380',
    priceVariants: [{ volumeMl: 350, price: '380' }],
    collectionName: 'Авторские',
  },
  {
    name: 'Латте бобы тонка-лимон',
    description:
      'Латте с бобами тонка и лимонной нотой: ванильно-миндальная сладость и свежий цитрусовый акцент.',
    manualKkal: '145',
    nutritionalInfo: { protein: 5, fats: 6, carbohydrates: 14 },
    price: '380',
    priceVariants: [{ volumeMl: 350, price: '380' }],
    collectionName: 'Авторские',
  },
  {
    name: 'Матча лайм-мята',
    description:
      'Освежающий матча-напиток с лаймом и мятой: травянистая матча, кислинка и холодная мятная свежесть.',
    manualKkal: '100',
    nutritionalInfo: { protein: 3, fats: 3, carbohydrates: 12 },
    price: '350',
    priceVariants: [{ volumeMl: 350, price: '350' }],
    collectionName: 'Авторские',
  },
  {
    name: 'Сырный раф',
    description:
      'Раф с сырным кремом: плотный, сливочный и солоновато-сладкий — десертный напиток в чашке.',
    manualKkal: '180',
    nutritionalInfo: { protein: 6, fats: 10, carbohydrates: 14 },
    price: '380',
    priceVariants: [{ volumeMl: 350, price: '380' }],
    collectionName: 'Авторские',
  },
  {
    name: 'ПП Соленая карамель',
    description:
      'Более лёгкий авторский напиток с солёной карамелью: сладко-солёный вкус при меньшей калорийности.',
    manualKkal: '140',
    nutritionalInfo: { protein: 5, fats: 5, carbohydrates: 16 },
    price: '380',
    priceVariants: [{ volumeMl: 350, price: '380' }],
    collectionName: 'Авторские',
  },
];
