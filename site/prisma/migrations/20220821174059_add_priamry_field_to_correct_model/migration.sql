/*
  Warnings:

  - You are about to drop the column `isPrimary` on the `products` table. All the data in the column will be lost.
  - You are about to drop the `Computer` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "isPrimary";

-- DropTable
DROP TABLE "Computer";

-- CreateTable
CREATE TABLE "computers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "computers_pkey" PRIMARY KEY ("id")
);
