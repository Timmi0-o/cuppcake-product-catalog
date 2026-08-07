-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'UPLOADED');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "FilePurpose" AS ENUM ('PRODUCT_IMAGE');

-- CreateEnum
CREATE TYPE "ImageEntityType" AS ENUM ('PRODUCT');

-- CreateTable
CREATE TABLE "Files" (
    "id" TEXT NOT NULL,
    "uploaded_by" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL DEFAULT '',
    "file_size" BIGINT NOT NULL DEFAULT 0,
    "file_url" TEXT NOT NULL,
    "checksum" TEXT,
    "status" "FileStatus" NOT NULL DEFAULT 'PENDING',
    "file_type" "FileType" NOT NULL,
    "purpose" "FilePurpose" NOT NULL,
    "metadata" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL,
    "entity_type" "ImageEntityType" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "manual_kkal" DECIMAL(12,2) NOT NULL,
    "nutritional_info" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshTokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Files_file_url_key" ON "Files"("file_url");

-- CreateIndex
CREATE INDEX "Files_uploaded_by_idx" ON "Files"("uploaded_by");

-- CreateIndex
CREATE INDEX "Files_purpose_idx" ON "Files"("purpose");

-- CreateIndex
CREATE INDEX "Files_checksum_idx" ON "Files"("checksum");

-- CreateIndex
CREATE INDEX "Files_deleted_at_idx" ON "Files"("deleted_at");

-- CreateIndex
CREATE INDEX "Images_entity_type_entity_id_idx" ON "Images"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "Images_file_id_idx" ON "Images"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "Images_entity_type_entity_id_file_id_key" ON "Images"("entity_type", "entity_id", "file_id");

-- CreateIndex
CREATE INDEX "Products_deleted_at_idx" ON "Products"("deleted_at");

-- CreateIndex
CREATE INDEX "Products_name_idx" ON "Products"("name");

-- CreateIndex
CREATE INDEX "RefreshTokens_user_id_idx" ON "RefreshTokens"("user_id");

-- CreateIndex
CREATE INDEX "RefreshTokens_expires_at_idx" ON "RefreshTokens"("expires_at");

-- CreateIndex
CREATE INDEX "Sessions_user_id_idx" ON "Sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE INDEX "Users_deleted_at_idx" ON "Users"("deleted_at");

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
