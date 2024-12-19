import { DocumentSourceType } from '@prisma/client';

export class CreateDocumentDto {
  fileName: string;
  fileType: string;
  fileUrl: string;
  sourceType: DocumentSourceType;
} 