import { CreditCategory } from '@prisma/client';

export class CreateRequirementDto {
  name: string;
  description?: string;
  totalCredits: number;
  startDate: Date;
  endDate: Date;
  categories: CreditCategory[];
} 