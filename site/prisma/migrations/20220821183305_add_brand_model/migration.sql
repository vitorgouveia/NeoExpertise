-- CreateTable
CREATE TABLE "brands" (
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandLogoUrl" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("slug")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");
