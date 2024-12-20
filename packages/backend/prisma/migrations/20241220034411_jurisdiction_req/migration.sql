-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('MD', 'DO');

-- CreateTable
CREATE TABLE "JurisdictionRequirement" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "licenseType" "LicenseType" NOT NULL,
    "requiresCme" BOOLEAN NOT NULL DEFAULT true,
    "hasSpecificContent" BOOLEAN NOT NULL DEFAULT false,
    "totalHours" INTEGER NOT NULL,
    "cycleLength" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JurisdictionRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RequirementCategory" (
    "id" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "categoryName" TEXT NOT NULL,
    "requiredHours" INTEGER NOT NULL,
    "maximumHours" INTEGER,
    "annualLimit" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequirementCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialRequirement" (
    "id" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "requiredHours" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpecialRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LegalCitation" (
    "id" TEXT NOT NULL,
    "jurisdictionId" TEXT NOT NULL,
    "citation" TEXT NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LegalCitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JurisdictionRequirement_state_licenseType_key" ON "JurisdictionRequirement"("state", "licenseType");

-- AddForeignKey
ALTER TABLE "RequirementCategory" ADD CONSTRAINT "RequirementCategory_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "JurisdictionRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialRequirement" ADD CONSTRAINT "SpecialRequirement_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "JurisdictionRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalCitation" ADD CONSTRAINT "LegalCitation_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "JurisdictionRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
