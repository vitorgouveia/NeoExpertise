-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "stauts" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
