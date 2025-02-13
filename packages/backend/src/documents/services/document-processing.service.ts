import { Injectable, Logger, forwardRef, Inject } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as pdfParse from 'pdf-parse';
import * as sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import { DocumentsService } from '../documents.service';
import { ProcessingStatus } from '@prisma/client';
import { promises as fs } from 'fs';
import { ExtractedDataDto } from '../dto/extracted-data.dto';
import { ValidationService } from './validation.service';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class DocumentProcessingService {
  private readonly logger = new Logger(DocumentProcessingService.name);
  private readonly openai: OpenAI;

  constructor(
    @Inject(forwardRef(() => DocumentsService))
    private documentsService: DocumentsService,
    private validationService: ValidationService,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.openAiConfig.apiKey,
    });
  }

  async processDocument(documentId: string): Promise<ExtractedDataDto> {
    try {
      await this.documentsService.updateStatus(documentId, ProcessingStatus.PROCESSING);
      
      const document = await this.documentsService.findOne(documentId);
      const filePath = this.documentsService.getFilePath(document.fileUrl.split('/').pop()!);
      
      const text = await this.extractText(filePath, document.fileType);
      const extractedData = await this.extractDataWithAI(text);
      
      // Save the extracted data
      await this.documentsService.updateWithExtractedData(documentId, extractedData);
      
      // Validate and normalize the extracted data
      const { isValid, data, errors } = await this.validationService.validateExtractedData(extractedData);
      
      if (!isValid) {
        const status = data.confidence > 50 ? ProcessingStatus.COMPLETED : ProcessingStatus.FAILED;
        await this.documentsService.updateStatus(
          documentId,
          status,
          errors.join('; ')
        );
        return data;
      }

      await this.documentsService.updateStatus(documentId, ProcessingStatus.COMPLETED);
      return data;
    } catch (error) {
      this.logger.error(`Error processing document ${documentId}:`, error);
      await this.documentsService.updateStatus(
        documentId,
        ProcessingStatus.FAILED,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  private async extractText(filePath: string, fileType: string): Promise<string> {
    if (fileType === 'application/pdf') {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text;
    }

    if (fileType.startsWith('image/')) {
      // For images, use Tesseract OCR
      const worker = await createWorker('eng');
      
      // Preprocess image for better OCR
      await sharp(filePath)
        .grayscale()
        .normalize()
        .toFile(`${filePath}-processed`);
      
      const { data: { text } } = await worker.recognize(`${filePath}-processed`);
      await worker.terminate();
      
      // Clean up processed image
      await fs.unlink(`${filePath}-processed`);
      
      return text;
    }

    throw new Error(`Unsupported file type: ${fileType}`);
  }

  private async extractDataWithAI(text: string): Promise<ExtractedDataDto> {
    const systemPrompt = `
      You are a precise CME certificate parser that understands state medical board requirements. Extract information in JSON format only.
      If you cannot find a specific field or are unsure, use null for that field.
      Always respond with a valid JSON object containing these fields:
      - title: string | null (Title of the CME activity, null if not found)
      - provider: string | null (Name of the CME provider, null if not found)
      - credits: number | null (Number of credits awarded, must be a number or null. If there are multiple kinds of credits, use the CME)
      - completedDate: string | null (Date in YYYY-MM-DD format, null if not found)
      - category: string | null (Must be exactly one of: AMA_PRA_CATEGORY_1, AMA_PRA_CATEGORY_2, AOA_CATEGORY_1A, AOA_CATEGORY_1B, AOA_CATEGORY_2A, AOA_CATEGORY_2B, SPECIALTY, OTHER if unclear)
      - activityType: string | null (Must be exactly one of: CONFERENCE, ONLINE_COURSE, JOURNAL_ARTICLE, TEACHING, MANUSCRIPT_REVIEW, SELF_ASSESSMENT, POINT_OF_CARE, BOARD_REVIEW, null if unclear)
      - confidence: number (Your confidence in the overall extraction, 0-100)
      - description: string | null (Description of the CME activity, null if not found)
      - specialRequirements: array (Array of special topic types this activity might fulfill, empty array if none detected)
      - topics: array (Array of detected topic areas, empty array if none detected)

      The specialRequirements array should include any of these detected special topic types:
      - OPIOID_EDUCATION
      - PAIN_MANAGEMENT
      - CONTROLLED_SUBSTANCES
      - ETHICS
      - CULTURAL_COMPETENCY
      - MEDICAL_ERRORS
      - INFECTION_CONTROL
      - DOMESTIC_VIOLENCE
      - HUMAN_TRAFFICKING
      - CHILD_ABUSE
      - END_OF_LIFE_CARE
      - RISK_MANAGEMENT
      - SUICIDE_PREVENTION
      - IMPLICIT_BIAS

      Topics should be extracted from title, description, and any learning objectives.

      Set confidence lower if many fields are null or uncertain.
      Only include text that you are confident about, don't guess.
    `;

    const userPrompt = `
      Extract information from this CME certificate text into JSON format, paying special attention to any content that might fulfill state-specific requirements.
      Remember to use null for any fields you cannot confidently extract.
      For activityType, use only: CONFERENCE, ONLINE_COURSE, JOURNAL_ARTICLE, TEACHING, MANUSCRIPT_REVIEW, SELF_ASSESSMENT, POINT_OF_CARE, BOARD_REVIEW, or null.

      Look for keywords and topics that might fulfill special state requirements like opioid education, ethics, cultural competency, etc.

      Certificate text:
      ${text}
    `;

    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0,
    });

    try {
      const content = completion.choices[0].message.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      const parsedData = JSON.parse(content);
      return parsedData;
    } catch (error) {
      this.logger.error('Error parsing OpenAI response:', error);
      throw new Error('Failed to parse extracted data');
    }
  }
} 