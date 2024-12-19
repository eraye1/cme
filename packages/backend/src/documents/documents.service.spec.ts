import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentSourceType, ProcessingStatus } from '@prisma/client';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    document: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockFile = {
      fileName: 'test.pdf',
      fileType: 'application/pdf',
      fileUrl: 'https://example.com/test.pdf',
      sourceType: DocumentSourceType.UPLOAD,
    };

    it('should create a document with pending status', async () => {
      const userId = 'test-user-id';
      const expectedResult = {
        id: 'test-doc-id',
        ...mockFile,
        userId,
        status: ProcessingStatus.PENDING,
      };

      mockPrismaService.document.create.mockResolvedValue(expectedResult);

      const result = await service.create(userId, mockFile);

      expect(result).toEqual(expectedResult);
      expect(prisma.document.create).toHaveBeenCalledWith({
        data: {
          ...mockFile,
          userId,
          status: ProcessingStatus.PENDING,
        },
      });
    });
  });

  describe('findByUser', () => {
    it('should return all documents for a user', async () => {
      const userId = 'test-user-id';
      const expectedDocs = [
        {
          id: 'doc-1',
          fileName: 'test1.pdf',
          userId,
          cmeCredits: [],
        },
        {
          id: 'doc-2',
          fileName: 'test2.pdf',
          userId,
          cmeCredits: [],
        },
      ];

      mockPrismaService.document.findMany.mockResolvedValue(expectedDocs);

      const result = await service.findByUser(userId);

      expect(result).toEqual(expectedDocs);
      expect(prisma.document.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: {
          cmeCredits: true,
        },
      });
    });
  });

  describe('updateProcessingStatus', () => {
    it('should update document status', async () => {
      const docId = 'test-doc-id';
      const newStatus = ProcessingStatus.COMPLETED;
      const expectedResult = {
        id: docId,
        status: newStatus,
      };

      mockPrismaService.document.update.mockResolvedValue(expectedResult);

      const result = await service.updateProcessingStatus(docId, newStatus);

      expect(result).toEqual(expectedResult);
      expect(prisma.document.update).toHaveBeenCalledWith({
        where: { id: docId },
        data: { status: newStatus },
      });
    });

    it('should update document status with error message', async () => {
      const docId = 'test-doc-id';
      const newStatus = ProcessingStatus.FAILED;
      const error = 'Processing failed';
      const expectedResult = {
        id: docId,
        status: newStatus,
        error,
      };

      mockPrismaService.document.update.mockResolvedValue(expectedResult);

      const result = await service.updateProcessingStatus(docId, newStatus, error);

      expect(result).toEqual(expectedResult);
      expect(prisma.document.update).toHaveBeenCalledWith({
        where: { id: docId },
        data: { status: newStatus, error },
      });
    });
  });
}); 