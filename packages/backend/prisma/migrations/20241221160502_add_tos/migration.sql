/*
  Warnings:

  - You are about to drop the column `expirationDate` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "expirationDate";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tosAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "tosVersion" TEXT;
