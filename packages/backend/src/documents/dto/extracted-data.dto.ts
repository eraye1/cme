import { IsString, IsNumber, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ActivityType, CreditCategory } from '@prisma/client';

export class ExtractedDataDto {
  @IsOptional()
  @IsString()
  title: string | null;

  @IsOptional()
  @IsString()
  provider: string | null;

  @IsOptional()
  @IsNumber()
  credits: number | null;

  @IsOptional()
  @IsDateString()
  completedDate: string | null;

  @IsOptional()
  @IsDateString()
  expirationDate: string | null;

  @IsOptional()
  @IsEnum(CreditCategory)
  category: CreditCategory | null;

  @IsOptional()
  @IsEnum(ActivityType)
  activityType: ActivityType | null;

  @IsNumber()
  confidence: number;

  @IsOptional()
  @IsString()
  description: string | null;

  @IsOptional()
  @IsString()
  notes: string | null;
} 