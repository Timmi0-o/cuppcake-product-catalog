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
    manualKkal: '5',
    nutritionalInfo: { protein: 0.3, fats: 0.1, carbohydrates: 0.8 },
    price: '190',
    priceVariants: [{ volumeMl: 40, price: '190' }],
    collectionName: 'Чёрный',
  },
  {
    name: 'Американо',
    manualKkal: '8',
    nutritionalInfo: { protein: 0.3, fats: 0.1, carbohydrates: 1.2 },
    price: '200',
    priceVariants: [{ volumeMl: 250, price: '200' }],
    collectionName: 'Чёрный',
  },
  {
    name: 'Фильтр кофе',
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
    manualKkal: '12',
    nutritionalInfo: { protein: 0.4, fats: 0.2, carbohydrates: 1.8 },
    price: '300',
    priceVariants: [{ volumeMl: 200, price: '300' }],
    collectionName: 'Чёрный',
  },
  {
    name: 'Воронка Elf',
    manualKkal: '12',
    nutritionalInfo: { protein: 0.4, fats: 0.2, carbohydrates: 1.8 },
    price: '330',
    priceVariants: [{ volumeMl: 300, price: '330' }],
    collectionName: 'Чёрный',
  },
  {
    name: 'Капучино',
    manualKkal: '90',
    nutritionalInfo: { protein: 4, fats: 4, carbohydrates: 8 },
    price: '300',
    priceVariants: [{ volumeMl: 250, price: '300' }],
    collectionName: 'С молоком',
  },
  {
    name: 'Двойной капучино',
    manualKkal: '120',
    nutritionalInfo: { protein: 5, fats: 5, carbohydrates: 10 },
    price: '350',
    priceVariants: [{ volumeMl: 350, price: '350' }],
    collectionName: 'С молоком',
  },
  {
    name: 'Флэт Уайт',
    manualKkal: '95',
    nutritionalInfo: { protein: 4, fats: 4.5, carbohydrates: 8 },
    price: '300',
    priceVariants: [{ volumeMl: 250, price: '300' }],
    collectionName: 'С молоком',
  },
  {
    name: 'Латте',
    manualKkal: '130',
    nutritionalInfo: { protein: 6, fats: 5, carbohydrates: 12 },
    price: '350',
    priceVariants: [{ volumeMl: 350, price: '350' }],
    collectionName: 'С молоком',
  },
  {
    name: 'Раф',
    manualKkal: '160',
    nutritionalInfo: { protein: 5, fats: 8, carbohydrates: 14 },
    price: '370',
    priceVariants: [{ volumeMl: 350, price: '370' }],
    collectionName: 'С молоком',
  },
  {
    name: 'Какао',
    note: '*по желанию можно добавить сироп топинамбура',
    manualKkal: '180',
    nutritionalInfo: { protein: 5, fats: 6, carbohydrates: 24 },
    price: '320',
    collectionName: 'Не кофе',
  },
  {
    name: 'Матча латте',
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
    manualKkal: '90',
    nutritionalInfo: { protein: 1, fats: 0.2, carbohydrates: 20 },
    price: '320',
    priceVariants: [{ volumeMl: 210, price: '320' }],
    collectionName: 'Не кофе',
  },
  {
    name: 'Латте с перцем андалиман',
    description: 'С кокосовой сгущёнкой',
    manualKkal: '150',
    nutritionalInfo: { protein: 5, fats: 7, carbohydrates: 14 },
    price: '380',
    priceVariants: [{ volumeMl: 350, price: '380' }],
    collectionName: 'Авторские',
  },
  {
    name: 'Латте бобы тонка-лимон',
    manualKkal: '145',
    nutritionalInfo: { protein: 5, fats: 6, carbohydrates: 14 },
    price: '380',
    priceVariants: [{ volumeMl: 350, price: '380' }],
    collectionName: 'Авторские',
  },
  {
    name: 'Матча лайм-мята',
    manualKkal: '100',
    nutritionalInfo: { protein: 3, fats: 3, carbohydrates: 12 },
    price: '350',
    priceVariants: [{ volumeMl: 350, price: '350' }],
    collectionName: 'Авторские',
  },
  {
    name: 'Сырный раф',
    manualKkal: '180',
    nutritionalInfo: { protein: 6, fats: 10, carbohydrates: 14 },
    price: '380',
    priceVariants: [{ volumeMl: 350, price: '380' }],
    collectionName: 'Авторские',
  },
  {
    name: 'ПП Соленая карамель',
    manualKkal: '140',
    nutritionalInfo: { protein: 5, fats: 5, carbohydrates: 16 },
    price: '380',
    priceVariants: [{ volumeMl: 350, price: '380' }],
    collectionName: 'Авторские',
  },
];
