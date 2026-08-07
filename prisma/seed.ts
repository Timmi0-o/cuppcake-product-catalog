import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const CATEGORIES = [
  { name: 'Пасха', slug: 'pasha', sortOrder: 10 },
  { name: 'Бисквитные торты', slug: 'biskvitnye-torty', sortOrder: 20 },
  { name: 'Бенто', slug: 'bento', sortOrder: 30 },
  { name: 'Чизкейки', slug: 'chizkejki', sortOrder: 40 },
  { name: 'Веган торты', slug: 'vegan-torty', sortOrder: 50 },
  { name: 'Веган десерты', slug: 'vegan-deserty', sortOrder: 60 },
  { name: 'Свадебные', slug: 'svadebnye', sortOrder: 70 },
  { name: 'Детские', slug: 'detskie', sortOrder: 80 },
  { name: 'Капкейки', slug: 'kapkejki', sortOrder: 90 },
  { name: 'Эклеры', slug: 'eklery', sortOrder: 100 },
  { name: 'Трайфлы', slug: 'trajfly', sortOrder: 110 },
  { name: 'Пирожные', slug: 'pirozhnye', sortOrder: 120 },
  { name: 'Муссовые', slug: 'mussovye', sortOrder: 130 },
  { name: 'ППшные', slug: 'ppshnye', sortOrder: 140 },
  { name: 'Протеиновые', slug: 'proteinovye', sortOrder: 150 },
  { name: 'Постные', slug: 'postnye', sortOrder: 160 },
  { name: 'Без глютена', slug: 'bez-glyutena', sortOrder: 170 },
];

async function main() {
  const kg = await prisma.measurementUnit.upsert({
    where: { symbol: 'кг' },
    update: { name: 'килограмм' },
    create: { name: 'килограмм', symbol: 'кг' },
  });

  const piece = await prisma.measurementUnit.upsert({
    where: { symbol: 'шт' },
    update: { name: 'штука' },
    create: { name: 'штука', symbol: 'шт' },
  });

  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
        deletedAt: null,
      },
      create: category,
    });
  }

  const biscuit = await prisma.category.findUniqueOrThrow({
    where: { slug: 'biskvitnye-torty' },
  });
  const cheesecake = await prisma.category.findUniqueOrThrow({
    where: { slug: 'chizkejki' },
  });
  const bento = await prisma.category.findUniqueOrThrow({
    where: { slug: 'bento' },
  });

  const existing = await prisma.product.count();
  if (existing === 0) {
    const samples = [
      {
        name: 'Сникерс',
        description:
          'Солёная карамель, арахисовая паста, шоколадный ганаш, бисквит.',
        manualKkal: '320',
        nutritionalInfo: { protein: 8, fats: 18, carbohydrates: 28 },
        price: '2300',
        measurementUnitId: kg.id,
        categoryIds: [biscuit.id],
      },
      {
        name: 'Прага',
        description: 'Классический шоколадный бисквит с абрикосовым конфи.',
        manualKkal: '290',
        nutritionalInfo: { protein: 6, fats: 14, carbohydrates: 32 },
        price: '2100',
        measurementUnitId: kg.id,
        categoryIds: [biscuit.id],
      },
      {
        name: 'Нью-Йорк',
        description: 'Плотный чизкейк на песочной основе с ванилью.',
        manualKkal: '340',
        nutritionalInfo: { protein: 9, fats: 22, carbohydrates: 24 },
        price: '2500',
        measurementUnitId: kg.id,
        categoryIds: [cheesecake.id],
      },
      {
        name: 'Бенто «Ягода»',
        description: 'Мини-торт с ягодным муссом, на 2–3 человека.',
        manualKkal: '180',
        nutritionalInfo: { protein: 4, fats: 9, carbohydrates: 20 },
        price: '1200',
        measurementUnitId: piece.id,
        categoryIds: [bento.id],
      },
    ] as const;

    for (const sample of samples) {
      const product = await prisma.product.create({
        data: {
          name: sample.name,
          description: sample.description,
          manualKkal: sample.manualKkal,
          nutritionalInfo: sample.nutritionalInfo,
          price: sample.price,
          measurementUnitId: sample.measurementUnitId,
          categories: {
            create: sample.categoryIds.map((categoryId) => ({ categoryId })),
          },
        },
      });
      console.log(`Seeded product ${product.name}`);
    }
  }

  console.log('Seed complete', { kg: kg.symbol, piece: piece.symbol });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
