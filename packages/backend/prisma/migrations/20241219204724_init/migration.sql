-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CONFERENCE', 'ONLINE_COURSE', 'JOURNAL_ARTICLE', 'TEACHING', 'MANUSCRIPT_REVIEW', 'SELF_ASSESSMENT', 'POINT_OF_CARE', 'BOARD_REVIEW');

-- CreateEnum
CREATE TYPE "CreditCategory" AS ENUM ('CATEGORY_1', 'CATEGORY_2', 'SPECIALTY');

-- CreateEnum
CREATE TYPE "DocumentSourceType" AS ENUM ('UPLOAD', 'EMAIL', 'PHOTO');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "specialty" TEXT,
    "credentials" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmeCredit" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "category" "CreditCategory" NOT NULL,
    "credits" DOUBLE PRECISION NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "description" TEXT,
    "location" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "templateId" TEXT,
    "userId" TEXT NOT NULL,
    "requirementId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmeCredit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CmeTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "activityType" "ActivityType" NOT NULL,
    "category" "CreditCategory" NOT NULL,
    "credits" DOUBLE PRECISION,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CmeTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "sourceType" "DocumentSourceType" NOT NULL,
    "ocrData" JSONB,
    "status" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalCredits" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "categories" TEXT[],
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CmeCreditToDocument" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CmeCreditToDocument_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CmeCredit_userId_idx" ON "CmeCredit"("userId");

-- CreateIndex
CREATE INDEX "CmeCredit_templateId_idx" ON "CmeCredit"("templateId");

-- CreateIndex
CREATE INDEX "CmeCredit_requirementId_idx" ON "CmeCredit"("requirementId");

-- CreateIndex
CREATE INDEX "CmeTemplate_userId_idx" ON "CmeTemplate"("userId");

-- CreateIndex
CREATE INDEX "Document_userId_idx" ON "Document"("userId");

-- CreateIndex
CREATE INDEX "Requirement_userId_idx" ON "Requirement"("userId");

-- CreateIndex
CREATE INDEX "_CmeCreditToDocument_B_index" ON "_CmeCreditToDocument"("B");

-- AddForeignKey
ALTER TABLE "CmeCredit" ADD CONSTRAINT "CmeCredit_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "CmeTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmeCredit" ADD CONSTRAINT "CmeCredit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmeCredit" ADD CONSTRAINT "CmeCredit_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "Requirement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CmeTemplate" ADD CONSTRAINT "CmeTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CmeCreditToDocument" ADD CONSTRAINT "_CmeCreditToDocument_A_fkey" FOREIGN KEY ("A") REFERENCES "CmeCredit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CmeCreditToDocument" ADD CONSTRAINT "_CmeCreditToDocument_B_fkey" FOREIGN KEY ("B") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
