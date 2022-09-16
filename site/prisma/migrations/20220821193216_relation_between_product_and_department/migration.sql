/*
  Warnings:

  - Added the required column `departmentSlug` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "departmentSlug" TEXT NOT NULL,
ADD COLUMN     "sold" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_departmentSlug_fkey" FOREIGN KEY ("departmentSlug") REFERENCES "departments"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
