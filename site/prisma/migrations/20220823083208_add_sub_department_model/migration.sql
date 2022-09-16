-- CreateTable
CREATE TABLE "sub-departments" (
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "soldProducts" INTEGER NOT NULL DEFAULT 0,
    "departmentSlug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub-departments_pkey" PRIMARY KEY ("slug")
);

-- CreateIndex
CREATE UNIQUE INDEX "sub-departments_slug_key" ON "sub-departments"("slug");

-- AddForeignKey
ALTER TABLE "sub-departments" ADD CONSTRAINT "sub-departments_departmentSlug_fkey" FOREIGN KEY ("departmentSlug") REFERENCES "departments"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;
