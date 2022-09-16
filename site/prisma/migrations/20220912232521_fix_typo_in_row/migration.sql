/*
  Warnings:

  - You are about to drop the column `imgDescriptiom` on the `contributors` table. All the data in the column will be lost.
  - Added the required column `imgDescription` to the `contributors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contributors" DROP COLUMN "imgDescriptiom",
ADD COLUMN     "imgDescription" TEXT NOT NULL;
