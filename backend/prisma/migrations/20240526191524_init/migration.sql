-- CreateTable
CREATE TABLE "Invoices" (
    "id" TEXT NOT NULL,
    "customerNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    "electricityAmount" DOUBLE PRECISION NOT NULL,
    "electricityUnitPrice" DOUBLE PRECISION NOT NULL,
    "electricityValue" DOUBLE PRECISION NOT NULL,
    "SCEEEnergyWithoutICMSAmount" DOUBLE PRECISION NOT NULL,
    "SCEEEnergyWithoutICMSUnitPrice" DOUBLE PRECISION NOT NULL,
    "SCEEEnergyWithoutICMSValue" DOUBLE PRECISION NOT NULL,
    "compensatedEnergyGDIAmount" DOUBLE PRECISION NOT NULL,
    "compensatedEnergyGDIUnitPrice" DOUBLE PRECISION NOT NULL,
    "compensatedEnergyGDIValue" DOUBLE PRECISION NOT NULL,
    "publicLightingContribution" DOUBLE PRECISION NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);
