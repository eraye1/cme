/*
  Warnings:

  - You are about to drop the column `ocrData` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the `_CmeCreditToDocument` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CmeCreditToDocument" DROP CONSTRAINT "_CmeCreditToDocument_A_fkey";

-- DropForeignKey
ALTER TABLE "_CmeCreditToDocument" DROP CONSTRAINT "_CmeCreditToDocument_B_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "ocrData",
ADD COLUMN     "activityType" "ActivityType",
ADD COLUMN     "category" "CreditCategory",
ADD COLUMN     "cmeCreditId" TEXT,
ADD COLUMN     "completedDate" TIMESTAMP(3),
ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "credits" DOUBLE PRECISION,
ADD COLUMN     "expirationDate" TIMESTAMP(3),
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "title" TEXT;

-- DropTable
DROP TABLE "_CmeCreditToDocument";

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_cmeCreditId_fkey" FOREIGN KEY ("cmeCreditId") REFERENCES "CmeCredit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
