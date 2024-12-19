import { IsOptional, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator';
import { ActivityType, CreditCategory } from '@prisma/client';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsNumber()
  credits?: number;

  @IsOptional()
  @IsDateString()
  completedDate?: string;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsOptional()
  @IsEnum(CreditCategory)
  category?: CreditCategory;

  @IsOptional()
  @IsEnum(ActivityType)
  activityType?: ActivityType;
} 