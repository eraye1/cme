import { Injectable, NotFoundException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProcessingStatus, DocumentSourceType, Prisma } from '@prisma/client';
import { promises as fs } from 'fs';
import { join } from 'path';
import { DocumentProcessingService } from './services/document-processing.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { ExtractedDataDto } from './dto/extracted-data.dto';

interface CreateDocumentDto {
  fileName: string;
  fileType: string;
  fileUrl: string;
  sourceType: DocumentSourceType;
}

@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => DocumentProcessingService))
    private processingService: DocumentProcessingService,
  ) {}

  async create(userId: string, data: CreateDocumentDto) {
    return this.prisma.document.create({
      data: {
        ...data,
        userId,
        status: ProcessingStatus.PENDING,
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.document.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async remove(id: string) {
    const document = await this.findOne(id);
    
    try {
      // Delete the physical file
      const filePath = this.getFilePath(document.fileUrl.split('/').pop()!);
      console.log('[DocumentsService] Attempting to delete file:', filePath);
      await fs.unlink(filePath);
      console.log('[DocumentsService] File deleted successfully');
    } catch (error) {
      console.error('[DocumentsService] Error deleting file:', error);
      // Continue with document deletion even if file deletion fails
    }

    console.log('[DocumentsService] Deleting document from database:', id);
    return this.prisma.document.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: ProcessingStatus, error?: string) {
    await this.findOne(id); // Will throw if not found
    return this.prisma.document.update({
      where: { id },
      data: { status, error },
    });
  }

  getFilePath(fileName: string): string {
    return join(process.cwd(), 'uploads', fileName);
  }

  async processDocument(id: string) {
    try {
      await this.updateStatus(id, ProcessingStatus.PROCESSING);
      const result = await this.processingService.processDocument(id);
      await this.updateStatus(id, ProcessingStatus.COMPLETED);
      return result;
    } catch (error) {
      await this.updateStatus(
        id, 
        ProcessingStatus.FAILED,
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  async validateFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 5MB limit');
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only PDF and images are allowed');
    }
  }

  async update(id: string, data: UpdateDocumentDto) {
    await this.findOne(id);
    
    const updateData: Prisma.DocumentUpdateInput = {
      ...(data.title && { title: data.title }),
      ...(data.provider && { provider: data.provider }),
      ...(data.credits !== undefined && { credits: data.credits }),
      ...(data.completedDate && { completedDate: new Date(data.completedDate) }),
      ...(data.expirationDate && { expirationDate: new Date(data.expirationDate) }),
      ...(data.category && { category: data.category }),
      ...(data.activityType && { activityType: data.activityType }),
    };

    return this.prisma.document.update({
      where: { id },
      data: updateData,
    });
  }

  async updateWithExtractedData(id: string, data: ExtractedDataDto) {
    await this.findOne(id);
    
    const updateData: Prisma.DocumentUpdateInput = {
      ...(data.title && { title: data.title }),
      ...(data.provider && { provider: data.provider }),
      ...(data.credits !== undefined && { credits: data.credits }),
      ...(data.completedDate && { completedDate: new Date(data.completedDate) }),
      ...(data.expirationDate && { expirationDate: new Date(data.expirationDate) }),
      ...(data.category && { category: data.category }),
      ...(data.activityType && { activityType: data.activityType }),
      ...(data.description && { description: data.description }),
      ...(data.notes && { notes: data.notes }),
      confidence: data.confidence,
    };

    return this.prisma.document.update({
      where: { id },
      data: updateData,
    });
  }
} 