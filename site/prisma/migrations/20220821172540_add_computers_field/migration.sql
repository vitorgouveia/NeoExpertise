-- AlterTable
ALTER TABLE "products" ADD COLUMN     "blurredImages" TEXT[],
ADD COLUMN     "images" TEXT[];

-- CreateTable
CREATE TABLE "Computer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,

    CONSTRAINT "Computer_pkey" PRIMARY KEY ("id")
);
