-- CreateTable
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "shopDomain" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shipment" (
    "id" SERIAL NOT NULL,
    "shopId" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "trackingId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shopDomain_key" ON "Shop"("shopDomain");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
