import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { PrismaClient } from '@prisma/client';
import { SharpImageVariantProcessor } from '../../src/modules/files/infrastructure/image-processing/sharp-image-variant-processor';
import {
  CUPPCAKE_COFFEE_IMAGE_URL,
  CUPPCAKE_DESSERT_IMAGE_POOL,
  CUPPCAKE_SITE_PRODUCT_IMAGES_BY_TITLE,
  CUPPCAKE_SITE_TITLE_ALIASES,
  DRINK_STOCK_IMAGE_RELATIVE_PATHS,
  PRODUCT_IMAGES_PER_ITEM,
} from '../data/cuppcake-site-product-images.seed-data';

type ImageSource =
  | { kind: 'remote'; url: string }
  | { kind: 'local'; absolutePath: string; originalName: string };

type ResolvedImageBuffer = {
  buffer: Buffer;
  originalName: string;
};

const SEED_ASSETS_ROOT = path.resolve(__dirname, '../seed-assets');
const IMAGE_CACHE_ROOT = path.resolve(__dirname, '../.seed-image-cache');
const UPLOADS_PRODUCTS_ROOT = path.resolve(
  process.cwd(),
  'public/uploads/products',
);

function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[«»"'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectImageMimeType(buffer: Buffer): string | null {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return 'image/jpeg';
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return 'image/png';
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

export function findCuppcakeSiteImageUrl(productName: string): string | null {
  const aliased = CUPPCAKE_SITE_TITLE_ALIASES[productName] ?? productName;

  const direct = CUPPCAKE_SITE_PRODUCT_IMAGES_BY_TITLE[aliased];
  if (direct) {
    return direct;
  }

  const normalized = normalizeTitle(aliased);
  for (const [title, url] of Object.entries(
    CUPPCAKE_SITE_PRODUCT_IMAGES_BY_TITLE,
  )) {
    if (normalizeTitle(title) === normalized) {
      return url;
    }
  }

  for (const [title, url] of Object.entries(
    CUPPCAKE_SITE_PRODUCT_IMAGES_BY_TITLE,
  )) {
    const titleNormalized = normalizeTitle(title);
    if (
      titleNormalized.includes(normalized) ||
      normalized.includes(titleNormalized)
    ) {
      return url;
    }
  }

  return null;
}

function pushUnique(target: ImageSource[], source: ImageSource): void {
  const key = source.kind === 'remote' ? source.url : source.absolutePath;
  const exists = target.some((item) =>
    item.kind === 'remote' ? item.url === key : item.absolutePath === key,
  );
  if (!exists) {
    target.push(source);
  }
}

function remote(url: string): ImageSource {
  return { kind: 'remote', url };
}

function localStock(relativePath: string): ImageSource {
  return {
    kind: 'local',
    absolutePath: path.join(SEED_ASSETS_ROOT, relativePath),
    originalName: path.basename(relativePath),
  };
}

export function resolveProductImageSources(input: {
  productName: string;
  primaryCategorySlug: string;
  productIndex: number;
}): ImageSource[] {
  const sources: ImageSource[] = [];

  if (input.primaryCategorySlug === 'napitki') {
    for (const relativePath of DRINK_STOCK_IMAGE_RELATIVE_PATHS) {
      pushUnique(sources, localStock(relativePath));
    }
    pushUnique(sources, remote(CUPPCAKE_COFFEE_IMAGE_URL));
    return sources.slice(0, PRODUCT_IMAGES_PER_ITEM);
  }

  const siteUrl = findCuppcakeSiteImageUrl(input.productName);
  if (siteUrl) {
    pushUnique(sources, remote(siteUrl));
  }

  const pool = CUPPCAKE_DESSERT_IMAGE_POOL;
  let offset = (input.productIndex * PRODUCT_IMAGES_PER_ITEM) % pool.length;
  let guard = 0;
  while (sources.length < PRODUCT_IMAGES_PER_ITEM && guard < pool.length * 2) {
    const candidate = pool[offset % pool.length];
    if (candidate) {
      pushUnique(sources, remote(candidate));
    }
    offset += 1;
    guard += 1;
  }

  return sources.slice(0, PRODUCT_IMAGES_PER_ITEM);
}

async function readCachedOrDownload(url: string): Promise<Buffer> {
  await mkdir(IMAGE_CACHE_ROOT, { recursive: true });
  const cacheKey = createHash('sha256').update(url).digest('hex');
  const cachePath = path.join(IMAGE_CACHE_ROOT, cacheKey);

  try {
    return await readFile(cachePath);
  } catch {
    // cache miss
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'cuppcake-seed/1.0',
      Accept: 'image/*,*/*',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to download image ${url}: HTTP ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(cachePath, buffer);
  return buffer;
}

async function loadImageBuffer(
  source: ImageSource,
): Promise<ResolvedImageBuffer> {
  const buffer =
    source.kind === 'remote'
      ? await readCachedOrDownload(source.url)
      : await readFile(source.absolutePath);

  const mimeType = detectImageMimeType(buffer);
  if (!mimeType) {
    const label =
      source.kind === 'remote' ? source.url : source.absolutePath;
    throw new Error(`Unsupported image type for seed asset: ${label}`);
  }

  const originalName =
    source.kind === 'remote'
      ? path.basename(new URL(source.url).pathname)
      : source.originalName;

  return {
    buffer,
    originalName,
  };
}

export async function clearProductUploadDirectory(): Promise<void> {
  await rm(UPLOADS_PRODUCTS_ROOT, { recursive: true, force: true });
  await mkdir(UPLOADS_PRODUCTS_ROOT, { recursive: true });
}

export async function attachImagesToProducts(
  prisma: PrismaClient,
  input: {
    uploaderUserId: string;
    products: Array<{
      id: string;
      name: string;
      primaryCategorySlug: string;
    }>;
  },
): Promise<{ attachedImages: number; productsWithImages: number }> {
  let attachedImages = 0;
  let productsWithImages = 0;
  const variantProcessor = new SharpImageVariantProcessor();

  for (const [productIndex, product] of input.products.entries()) {
    const sources = resolveProductImageSources({
      productName: product.name,
      primaryCategorySlug: product.primaryCategorySlug,
      productIndex,
    });

    if (sources.length === 0) {
      continue;
    }

    const productUploadDir = path.join(UPLOADS_PRODUCTS_ROOT, product.id);
    await mkdir(productUploadDir, { recursive: true });

    type PreparedSeedImage = {
      originalName: string;
      originalFileName: string;
      originalMimeType: string;
      originalFileSize: bigint;
      originalChecksum: string;
      originalFileUrl: string;
      urls: string[];
    };

    const prepared: PreparedSeedImage[] = [];

    for (const source of sources) {
      const loaded = await loadImageBuffer(source);
      const processed = await variantProcessor.process({
        buffer: loaded.buffer,
        originalName: loaded.originalName,
      });

      const urls: string[] = [];
      let originalFileName = '';
      let originalMimeType = '';
      let originalFileSize = BigInt(0);
      let originalChecksum = '';
      let originalFileUrl = '';

      for (const variantFile of processed.files) {
        const absolutePath = path.join(productUploadDir, variantFile.fileName);
        await writeFile(absolutePath, variantFile.buffer);
        const publicUrl = `/uploads/products/${product.id}/${variantFile.fileName}`;
        urls.push(publicUrl);

        if (variantFile.variant === 'original') {
          originalFileName = variantFile.fileName;
          originalMimeType = variantFile.mimeType;
          originalFileSize = BigInt(variantFile.buffer.byteLength);
          originalChecksum = createHash('sha256')
            .update(variantFile.buffer)
            .digest('hex');
          originalFileUrl = publicUrl;
        }
      }

      prepared.push({
        originalName: processed.originalName,
        originalFileName,
        originalMimeType,
        originalFileSize,
        originalChecksum,
        originalFileUrl,
        urls,
      });
    }

    const files = await prisma.$transaction(async (tx) => {
      const createdFiles = [];
      for (const file of prepared) {
        const created = await tx.file.create({
          data: {
            uploadedBy: input.uploaderUserId,
            fileName: file.originalFileName,
            originalName: file.originalName,
            mimeType: file.originalMimeType,
            fileSize: file.originalFileSize,
            fileUrl: file.originalFileUrl,
            checksum: file.originalChecksum,
            status: 'UPLOADED',
            fileType: 'IMAGE',
            purpose: 'PRODUCT_IMAGE',
            metadata: { urls: file.urls },
            tags: [],
          },
        });
        createdFiles.push(created);
      }

      await tx.image.createMany({
        data: createdFiles.map((file) => ({
          entityType: 'PRODUCT' as const,
          entityId: product.id,
          fileId: file.id,
        })),
      });

      return createdFiles;
    });

    attachedImages += files.length;
    productsWithImages += 1;

    if ((productIndex + 1) % 20 === 0) {
      console.log(
        `Product images progress: ${productIndex + 1}/${input.products.length}`,
      );
    }
  }

  return { attachedImages, productsWithImages };
}
