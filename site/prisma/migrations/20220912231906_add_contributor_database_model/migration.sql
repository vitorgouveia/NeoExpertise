-- CreateTable
CREATE TABLE "contributors" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "socialMediaId" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "imgDescriptiom" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributors_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "SocialMedia" (
    "id" TEXT NOT NULL,
    "platformName" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "contributorSlug" TEXT NOT NULL,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contributors_slug_key" ON "contributors"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SocialMedia_platformName_key" ON "SocialMedia"("platformName");

-- AddForeignKey
ALTER TABLE "SocialMedia" ADD CONSTRAINT "SocialMedia_contributorSlug_fkey" FOREIGN KEY ("contributorSlug") REFERENCES "contributors"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
