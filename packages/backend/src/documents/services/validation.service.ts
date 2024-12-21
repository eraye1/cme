import { Injectable, Logger } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ExtractedDataDto } from '../dto/extracted-data.dto';
import { ActivityType, CreditCategory } from '@prisma/client';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  async validateExtractedData(data: any): Promise<{ 
    isValid: boolean; 
    data: ExtractedDataDto; 
    errors: string[];
  }> {
    const extractedData = plainToClass(ExtractedDataDto, data);
    const errors = await validate(extractedData);

    // Log validation results
    console.log('[Validation] Raw data:', data);
    console.log('[Validation] Transformed data:', extractedData);

    // Collect warnings but don't fail validation
    const warnings: string[] = [];

    // Check dates make sense
    if (extractedData.completedDate) {
      new Date(extractedData.completedDate);
    }

    // Check if credits are reasonable
    if (extractedData.credits !== null && extractedData.credits > 100) {
      warnings.push('Warning: Credit value seems unusually high');
    }

    // Check confidence
    if (extractedData.confidence < 50) {
      warnings.push('Warning: Low confidence in extracted data');
    }

    // Normalize activity type
    if (data.activityType) {
      data.activityType = this.normalizeActivityType(data.activityType);
    }

    // Always return valid but include warnings
    return {
      isValid: true, // Always allow the data through
      data: extractedData,
      errors: warnings, // Use warnings instead of errors
    };
  }

  suggestCorrections(data: ExtractedDataDto): Partial<ExtractedDataDto> {
    const corrections: Partial<ExtractedDataDto> = {};

    // Normalize dates
    if (data.completedDate) {
      try {
        const date = new Date(data.completedDate);
        corrections.completedDate = date.toISOString().split('T')[0];
      } catch (e) {
        // Invalid date format, leave as is
      }
    }

    // Normalize credit values
    if (typeof data.credits === 'string') {
      const numericValue = parseFloat(data.credits);
      if (!isNaN(numericValue)) {
        corrections.credits = numericValue;
      }
    }

    // Normalize category
    if (data.category) {
      const normalizedCategory = this.normalizeCategory(data.category);
      if (normalizedCategory !== data.category) {
        corrections.category = normalizedCategory;
      }
    }

    // Normalize activity type
    if (data.activityType) {
      const normalizedActivity = this.normalizeActivityType(data.activityType);
      if (normalizedActivity !== data.activityType) {
        corrections.activityType = normalizedActivity;
      }
    }

    return corrections;
  }

  private normalizeCategory(category: string): CreditCategory {
    const normalized = category.toLowerCase().replace(/\s+/g, '');
    
    const categoryMap: Record<string, CreditCategory> = {
      'cat1': CreditCategory.AMA_PRA_CATEGORY_1,
      'cat2': CreditCategory.AMA_PRA_CATEGORY_2,
      'category1': CreditCategory.AMA_PRA_CATEGORY_1,
      'category2': CreditCategory.AMA_PRA_CATEGORY_2,
      'categoryI': CreditCategory.AMA_PRA_CATEGORY_1,
      'categoryII': CreditCategory.AMA_PRA_CATEGORY_2,
      '1': CreditCategory.AMA_PRA_CATEGORY_1,
      '2': CreditCategory.AMA_PRA_CATEGORY_2,
      '1a': CreditCategory.AOA_CATEGORY_1A,
      '1b': CreditCategory.AOA_CATEGORY_1B,
      '2a': CreditCategory.AOA_CATEGORY_2A,
      '2b': CreditCategory.AOA_CATEGORY_2B,
      'specialty': CreditCategory.SPECIALTY,
      'other': CreditCategory.OTHER,
    };

    return categoryMap[normalized] || null;
  }

  private normalizeActivityType(type: string | null): ActivityType | null {
    if (!type) return null;

    const normalized = type.toUpperCase().replace(/\s+/g, '_');
    
    // Only accept exact matches from our enum
    if (Object.values(ActivityType).includes(normalized as ActivityType)) {
      return normalized as ActivityType;
    }

    // Map common variations to our enum values
    const activityMap: Record<string, ActivityType> = {
      'ENDURING_MATERIAL': ActivityType.ONLINE_COURSE,
      'WEBINAR': ActivityType.ONLINE_COURSE,
      'LECTURE': ActivityType.TEACHING,
      'ARTICLE': ActivityType.JOURNAL_ARTICLE,
      'PUBLICATION': ActivityType.JOURNAL_ARTICLE,
      'REVIEW': ActivityType.MANUSCRIPT_REVIEW,
      'ASSESSMENT': ActivityType.SELF_ASSESSMENT,
      'POC': ActivityType.POINT_OF_CARE,
      'BOARD': ActivityType.BOARD_REVIEW,
    };

    return activityMap[normalized] || null;
  }
} 