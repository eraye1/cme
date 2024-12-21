-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CONFERENCE', 'ONLINE_COURSE', 'JOURNAL_ARTICLE', 'TEACHING', 'MANUSCRIPT_REVIEW', 'SELF_ASSESSMENT', 'POINT_OF_CARE', 'BOARD_REVIEW');

-- CreateEnum
CREATE TYPE "CreditCategory" AS ENUM ('AMA_PRA_CATEGORY_1', 'AMA_PRA_CATEGORY_2', 'AOA_CATEGORY_1A', 'AOA_CATEGORY_1B', 'AOA_CATEGORY_2A', 'AOA_CATEGORY_2B', 'SPECIALTY', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentSourceType" AS ENUM ('UPLOAD', 'EMAIL', 'PHOTO');

-- CreateEnum
CREATE TYPE "ProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('MD', 'DO', 'MD_DO');

-- CreateEnum
CREATE TYPE "SpecialTopicType" AS ENUM ('OPIOID_EDUCATION', 'PAIN_MANAGEMENT', 'CONTROLLED_SUBSTANCES', 'ETHICS', 'CULTURAL_COMPETENCY', 'MEDICAL_ERRORS', 'INFECTION_CONTROL', 'DOMESTIC_VIOLENCE', 'HUMAN_TRAFFICKING', 'CHILD_ABUSE', 'END_OF_LIFE_CARE', 'RISK_MANAGEMENT', 'SUICIDE_PREVENTION', 'IMPLICIT_BIAS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNumber" TEXT,
    "specialty" TEXT,
    "credentials" TEXT[],
    "licenseType" "LicenseType",
    "states" TEXT[],
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
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "sourceType" "DocumentSourceType" NOT NULL,
    "title" TEXT,
    "provider" TEXT,
    "credits" DOUBLE PRECISION,
    "completedDate" TIMESTAMP(3),
    "expirationDate" TIMESTAMP(3),
    "category" "CreditCategory",
    "activityType" "ActivityType",
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "description" TEXT,
    "specialRequirements" "SpecialTopicType"[],
    "topics" TEXT[],
    "notes" TEXT,
    "status" "ProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cmeCreditId" TEXT,

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
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JurisdictionRequirement" (
    "id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "licenseType" "LicenseType" NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "live" BOOLEAN NOT NULL DEFAULT false,
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
    "notes" TEXT,
    "oneTime" BOOLEAN NOT NULL DEFAULT false,
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
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "JurisdictionRequirement_state_licenseType_key" ON "JurisdictionRequirement"("state", "licenseType");

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
ALTER TABLE "Document" ADD CONSTRAINT "Document_cmeCreditId_fkey" FOREIGN KEY ("cmeCreditId") REFERENCES "CmeCredit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequirementCategory" ADD CONSTRAINT "RequirementCategory_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "JurisdictionRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialRequirement" ADD CONSTRAINT "SpecialRequirement_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "JurisdictionRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LegalCitation" ADD CONSTRAINT "LegalCitation_jurisdictionId_fkey" FOREIGN KEY ("jurisdictionId") REFERENCES "JurisdictionRequirement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
