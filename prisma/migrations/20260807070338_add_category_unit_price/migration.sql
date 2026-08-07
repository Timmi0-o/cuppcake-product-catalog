-- Create measurement units and categories first
CREATE TABLE "MeasurementUnits" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeasurementUnits_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MeasurementUnits_symbol_key" ON "MeasurementUnits"("symbol");

CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Categories_slug_key" ON "Categories"("slug");
CREATE INDEX "Categories_deleted_at_idx" ON "Categories"("deleted_at");
CREATE INDEX "Categories_sort_order_idx" ON "Categories"("sort_order");

CREATE TABLE "ProductCategories" (
    "product_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "ProductCategories_pkey" PRIMARY KEY ("product_id","category_id")
);

CREATE INDEX "ProductCategories_category_id_idx" ON "ProductCategories"("category_id");
CREATE UNIQUE INDEX "ProductCategories_product_id_category_id_key" ON "ProductCategories"("product_id", "category_id");

-- Clear existing catalog rows that cannot satisfy new required columns
DELETE FROM "Images" WHERE "entity_type" = 'PRODUCT';
DELETE FROM "Products";

ALTER TABLE "Products" ADD COLUMN "measurement_unit_id" TEXT NOT NULL;
ALTER TABLE "Products" ADD COLUMN "price" DECIMAL(12,2) NOT NULL;

CREATE INDEX "Products_measurement_unit_id_idx" ON "Products"("measurement_unit_id");

ALTER TABLE "ProductCategories" ADD CONSTRAINT "ProductCategories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProductCategories" ADD CONSTRAINT "ProductCategories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Products" ADD CONSTRAINT "Products_measurement_unit_id_fkey" FOREIGN KEY ("measurement_unit_id") REFERENCES "MeasurementUnits"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
