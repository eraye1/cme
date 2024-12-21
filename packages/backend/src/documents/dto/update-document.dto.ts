import { IsOptional, IsString, IsNumber, IsDateString, IsEnum, IsArray } from 'class-validator';
import { ActivityType, CreditCategory, SpecialTopicType } from '@prisma/client';

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
  @IsEnum(CreditCategory)
  category?: CreditCategory;

  @IsOptional()
  @IsEnum(ActivityType)
  activityType?: ActivityType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsEnum(SpecialTopicType, { each: true })
  specialRequirements?: SpecialTopicType[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
} 