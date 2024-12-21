import { IsString, IsNumber, IsOptional, IsArray, IsEnum, IsDateString } from 'class-validator';
import { ActivityType, CreditCategory, SpecialTopicType } from '@prisma/client';

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

  @IsArray()
  @IsEnum(SpecialTopicType, { each: true })
  specialRequirements: SpecialTopicType[];

  @IsArray()
  @IsString({ each: true })
  topics: string[];
} 