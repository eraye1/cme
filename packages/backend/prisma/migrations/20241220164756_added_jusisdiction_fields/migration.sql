-- AlterEnum
ALTER TYPE "LicenseType" ADD VALUE 'MD_DO';

-- AlterTable
ALTER TABLE "JurisdictionRequirement" ADD COLUMN     "live" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
