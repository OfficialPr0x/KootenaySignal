-- CreateTable
CREATE TABLE "Audit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clerkUserId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "websiteUrl" TEXT NOT NULL,
    "city" TEXT,
    "industry" TEXT,
    "goals" TEXT,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "errorMessage" TEXT,
    "crawlData" TEXT,
    "serpData" TEXT,
    "psiData" TEXT,
    "signalScore" INTEGER,
    "visibilityScore" INTEGER,
    "trustScore" INTEGER,
    "conversionScore" INTEGER,
    "localPresenceScore" INTEGER,
    "offerClarityScore" INTEGER,
    "paidReadinessScore" INTEGER,
    "seoScore" INTEGER,
    "reportData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Audit_clerkUserId_idx" ON "Audit"("clerkUserId");
