-- AlterTable
ALTER TABLE "Products" ADD COLUMN "slug" TEXT;

-- Backfill existing rows (dev/seed will recreate catalog products)
UPDATE "Products"
SET "slug" = 'product-' || REPLACE("id"::text, '-', '')
WHERE "slug" IS NULL;

-- AlterTable
ALTER TABLE "Products" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Products_slug_key" ON "Products"("slug");
