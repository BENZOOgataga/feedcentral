-- CreateTable
CREATE TABLE "license_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "issuedBy" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemedBy" TEXT,
    "redeemedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "instanceId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "notes" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "license_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "license_keys_key_key" ON "license_keys"("key");

-- CreateIndex
CREATE UNIQUE INDEX "license_keys_redeemedBy_key" ON "license_keys"("redeemedBy");

-- CreateIndex
CREATE INDEX "license_keys_redeemedBy_idx" ON "license_keys"("redeemedBy");

-- CreateIndex
CREATE INDEX "license_keys_isRevoked_idx" ON "license_keys"("isRevoked");

-- CreateIndex
CREATE INDEX "license_keys_instanceId_idx" ON "license_keys"("instanceId");
