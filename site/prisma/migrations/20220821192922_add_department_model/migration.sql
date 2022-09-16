/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `brands` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "index" SERIAL NOT NULL;

-- CreateTable
CREATE TABLE "departments" (
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "soldProducts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("slug")
);

-- CreateIndex
CREATE UNIQUE INDEX "departments_slug_key" ON "departments"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "brands_index_key" ON "brands"("index");
