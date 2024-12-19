import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DocumentSourceType } from '@prisma/client';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocumentsService = {
    create: jest.fn(),
    findByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new document', async () => {
      const userId = 'test-user-id';
      const file = {
        fileName: 'test.pdf',
        fileType: 'application/pdf',
        fileUrl: 'https://example.com/test.pdf',
        sourceType: DocumentSourceType.UPLOAD,
      };

      const expectedResult = {
        id: 'test-doc-id',
        ...file,
        userId,
      };

      mockDocumentsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(userId, file);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(userId, file);
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
        },
      ];

      mockDocumentsService.findByUser.mockResolvedValue(expectedDocs);

      const result = await controller.findByUser(userId);

      expect(result).toEqual(expectedDocs);
      expect(service.findByUser).toHaveBeenCalledWith(userId);
    });
  });
}); 