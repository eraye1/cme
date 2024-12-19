import { ActivityType, CreditCategory } from '@prisma/client';

export class CreateCmeCreditDto {
  title: string;
  provider: string;
  activityType: ActivityType;
  category: CreditCategory;
  credits: number;
  completedAt: Date;
  expiresAt?: Date;
  description?: string;
  location?: string;
  templateId?: string;
  requirementId?: string;
} 