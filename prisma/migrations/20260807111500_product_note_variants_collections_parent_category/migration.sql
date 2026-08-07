-- AlterTable Categories
ALTER TABLE "Categories" ADD COLUMN "parent_category_id" TEXT;

-- AlterTable Products
ALTER TABLE "Products" ADD COLUMN "note" TEXT;
ALTER TABLE "Products" ADD COLUMN "price_variants" JSONB;

-- CreateTable
CREATE TABLE "ProductCollections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ProductCollections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCollectionProducts" (
    "product_id" TEXT NOT NULL,
    "product_collection_id" TEXT NOT NULL,

    CONSTRAINT "ProductCollectionProducts_pkey" PRIMARY KEY ("product_id","product_collection_id")
);

-- CreateIndex
CREATE INDEX "Categories_parent_category_id_idx" ON "Categories"("parent_category_id");

-- CreateIndex
CREATE INDEX "ProductCollections_deleted_at_idx" ON "ProductCollections"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCollectionProducts_product_id_product_collection_id_key" ON "ProductCollectionProducts"("product_id", "product_collection_id");

-- CreateIndex
CREATE INDEX "ProductCollectionProducts_product_collection_id_idx" ON "ProductCollectionProducts"("product_collection_id");

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCollectionProducts" ADD CONSTRAINT "ProductCollectionProducts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCollectionProducts" ADD CONSTRAINT "ProductCollectionProducts_product_collection_id_fkey" FOREIGN KEY ("product_collection_id") REFERENCES "ProductCollections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
