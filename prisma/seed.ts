import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { CATALOG_SEED_PRODUCTS } from './data/catalog-products.seed-data';
import {
  DRINK_COLLECTIONS,
  DRINK_SEED_PRODUCTS,
} from './data/drinks-menu.seed-data';
import { ensureUniqueSlug, slugify } from '../src/utils/slugify.util';
import {
  attachImagesToProducts,
  clearProductUploadDirectory,
} from './seed/attach-product-images';

const SEED_UPLOADER_EMAIL = 'seed-uploader@cuppcake.local';
const SEED_UPLOADER_PASSWORD = 'seed-uploader-password';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required');
}

function withSchemaSearchPath(value: string): string {
  const url = new URL(value);
  const schema = url.searchParams.get('schema');
  if (!schema || schema === 'public') {
    return value;
  }
  const existingOptions = url.searchParams.get('options') ?? '';
  if (existingOptions.includes('search_path')) {
    return value;
  }
  const searchPathOption = `-csearch_path=${schema}`;
  url.searchParams.set(
    'options',
    existingOptions
      ? `${existingOptions} ${searchPathOption}`
      : searchPathOption,
  );
  return url.toString();
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: withSchemaSearchPath(connectionString),
  }),
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
  { name: 'Напитки', slug: 'napitki', sortOrder: 180 },
] as const;

const MIN_PRODUCTS_PER_CATEGORY = 7;

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

  const milliliter = await prisma.measurementUnit.upsert({
    where: { symbol: 'мл' },
    update: { name: 'миллилитр' },
    create: { name: 'миллилитр', symbol: 'мл' },
  });

  const unitByKey = {
    kg: kg.id,
    piece: piece.id,
    ml: milliliter.id,
  } as const;

  for (const category of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        sortOrder: category.sortOrder,
        deletedAt: null,
        parentCategoryId: null,
      },
      create: {
        name: category.name,
        slug: category.slug,
        sortOrder: category.sortOrder,
      },
    });
  }

  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    select: { id: true, slug: true },
  });
  const categoryIdBySlug = new Map(
    categories.map((category) => [category.slug, category.id]),
  );

  for (const product of CATALOG_SEED_PRODUCTS) {
    for (const slug of product.categorySlugs) {
      if (!categoryIdBySlug.has(slug)) {
        throw new Error(`Unknown category slug in seed data: ${slug}`);
      }
    }
  }

  const drinksCategoryId = categoryIdBySlug.get('napitki');
  if (!drinksCategoryId) {
    throw new Error('Drinks category napitki is missing');
  }

  const usedProductSlugs = new Set<string>();

  const seedUploaderPasswordHash = await bcrypt.hash(
    SEED_UPLOADER_PASSWORD,
    10,
  );
  const seedUploader = await prisma.user.upsert({
    where: { email: SEED_UPLOADER_EMAIL },
    update: {
      passwordHash: seedUploaderPasswordHash,
      deletedAt: null,
    },
    create: {
      email: SEED_UPLOADER_EMAIL,
      passwordHash: seedUploaderPasswordHash,
    },
  });

  await clearProductUploadDirectory();

  await prisma.$transaction(
    async (tx) => {
      await tx.image.deleteMany({ where: { entityType: 'PRODUCT' } });
      await tx.file.deleteMany({ where: { purpose: 'PRODUCT_IMAGE' } });
      await tx.productCollectionProduct.deleteMany();
      await tx.productCategory.deleteMany();
      await tx.product.deleteMany();
      await tx.productCollection.deleteMany();

      const collectionIdByName = new Map<string, string>();
      for (const collectionName of DRINK_COLLECTIONS) {
        const collection = await tx.productCollection.create({
          data: { name: collectionName },
        });
        collectionIdByName.set(collectionName, collection.id);
      }

      for (const sample of CATALOG_SEED_PRODUCTS) {
        const slug = ensureUniqueSlug(slugify(sample.name), usedProductSlugs);

        // Nested relation creates break FK checks with Prisma driver adapter in transactions.
        const product = await tx.product.create({
          data: {
            name: sample.name,
            slug,
            description: sample.description,
            note: null,
            manualKkal: sample.manualKkal,
            nutritionalInfo: sample.nutritionalInfo,
            price: sample.price,
            priceVariants: undefined,
            measurementUnitId: unitByKey[sample.unit],
          },
        });

        await tx.productCategory.createMany({
          data: sample.categorySlugs.map((categorySlug) => ({
            productId: product.id,
            categoryId: categoryIdBySlug.get(categorySlug)!,
          })),
        });
      }

      for (const drink of DRINK_SEED_PRODUCTS) {
        const collectionId = collectionIdByName.get(drink.collectionName);
        if (!collectionId) {
          throw new Error(`Unknown drink collection: ${drink.collectionName}`);
        }

        const slug = ensureUniqueSlug(slugify(drink.name), usedProductSlugs);
        const price =
          drink.priceVariants && drink.priceVariants.length > 0
            ? String(
                Math.min(
                  ...drink.priceVariants.map((variant) => Number(variant.price)),
                ),
              )
            : drink.price;

        const product = await tx.product.create({
          data: {
            name: drink.name,
            slug,
            description: drink.description ?? null,
            note: drink.note ?? null,
            manualKkal: drink.manualKkal,
            nutritionalInfo: drink.nutritionalInfo,
            price,
            priceVariants: drink.priceVariants ?? undefined,
            measurementUnitId: unitByKey.ml,
          },
        });

        await tx.productCategory.createMany({
          data: [{ productId: product.id, categoryId: drinksCategoryId }],
        });

        await tx.productCollectionProduct.createMany({
          data: [{ productId: product.id, productCollectionId: collectionId }],
        });
      }
    },
    {
      maxWait: 20_000,
      timeout: 300_000,
    },
  );

  const productsForImages = await prisma.product.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      name: true,
      categories: {
        select: {
          category: { select: { slug: true } },
        },
        take: 1,
      },
    },
    orderBy: { name: 'asc' },
  });

  const imageStats = await attachImagesToProducts(prisma, {
    uploaderUserId: seedUploader.id,
    products: productsForImages.map((product) => ({
      id: product.id,
      name: product.name,
      primaryCategorySlug: product.categories[0]?.category.slug ?? 'unknown',
    })),
  });

  const counts = await prisma.productCategory.groupBy({
    by: ['categoryId'],
    _count: { productId: true },
  });

  const countByCategoryId = new Map(
    counts.map((row) => [row.categoryId, row._count.productId]),
  );

  const dessertCategorySlugs = CATEGORIES.filter(
    (category) => category.slug !== 'napitki',
  ).map((category) => category.slug);

  const underfilled = dessertCategorySlugs
    .filter((slug) => {
      const categoryId = categoryIdBySlug.get(slug);
      const count = categoryId ? (countByCategoryId.get(categoryId) ?? 0) : 0;
      return count < MIN_PRODUCTS_PER_CATEGORY;
    })
    .map((slug) => ({
      slug,
      count: countByCategoryId.get(categoryIdBySlug.get(slug)!) ?? 0,
    }));

  if (underfilled.length > 0) {
    throw new Error(
      `Seed integrity failed: categories below ${MIN_PRODUCTS_PER_CATEGORY} products: ${JSON.stringify(underfilled)}`,
    );
  }

  console.log('Seed complete', {
    dessertProducts: CATALOG_SEED_PRODUCTS.length,
    drinkProducts: DRINK_SEED_PRODUCTS.length,
    collections: DRINK_COLLECTIONS.length,
    categories: CATEGORIES.length,
    units: { kg: kg.symbol, piece: piece.symbol, ml: milliliter.symbol },
    productsWithImages: imageStats.productsWithImages,
    attachedImages: imageStats.attachedImages,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
