/*
  Warnings:

  - Added the required column `brandSlug` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "brandSlug" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandSlug_fkey" FOREIGN KEY ("brandSlug") REFERENCES "brands"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
