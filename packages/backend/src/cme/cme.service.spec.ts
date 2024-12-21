import { Test, TestingModule } from '@nestjs/testing';
import { CmeService } from './cme.service';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityType, CreditCategory } from '@prisma/client';

describe('CmeService', () => {
  let service: CmeService;
  let prisma: PrismaService;

  const mockPrismaService = {
    cmeCredit: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CmeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CmeService>(CmeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCredit', () => {
    const mockCreditData = {
      title: 'Test CME Course',
      provider: 'Test Provider',
      activityType: ActivityType.ONLINE_COURSE,
      category: CreditCategory.AMA_PRA_CATEGORY_1,
      credits: 2.5,
      completedAt: new Date(),
    };

    it('should create a CME credit', async () => {
      const userId = 'test-user-id';
      const expectedResult = { id: 'test-credit-id', ...mockCreditData, userId };

      mockPrismaService.cmeCredit.create.mockResolvedValue(expectedResult);

      const result = await service.createCredit(userId, mockCreditData);

      expect(result).toEqual(expectedResult);
      expect(prisma.cmeCredit.create).toHaveBeenCalledWith({
        data: {
          ...mockCreditData,
          userId,
        },
        include: {
          template: true,
          requirement: true,
          documents: true,
        },
      });
    });

    it('should create a CME credit with template', async () => {
      const userId = 'test-user-id';
      const templateId = 'test-template-id';
      const creditWithTemplate = { ...mockCreditData, templateId };

      const expectedResult = {
        id: 'test-credit-id',
        ...mockCreditData,
        userId,
        templateId,
      };

      mockPrismaService.cmeCredit.create.mockResolvedValue(expectedResult);

      const result = await service.createCredit(userId, creditWithTemplate);

      expect(result).toEqual(expectedResult);
      expect(prisma.cmeCredit.create).toHaveBeenCalledWith({
        data: {
          ...mockCreditData,
          userId,
          template: {
            connect: { id: templateId },
          },
        },
        include: {
          template: true,
          requirement: true,
          documents: true,
        },
      });
    });
  });

  describe('getCreditsByUser', () => {
    it('should return all credits for a user', async () => {
      const userId = 'test-user-id';
      const expectedCredits = [
        {
          id: 'credit-1',
          title: 'CME Course 1',
          userId,
        },
        {
          id: 'credit-2',
          title: 'CME Course 2',
          userId,
        },
      ];

      mockPrismaService.cmeCredit.findMany.mockResolvedValue(expectedCredits);

      const result = await service.getCreditsByUser(userId);

      expect(result).toEqual(expectedCredits);
      expect(prisma.cmeCredit.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: {
          documents: true,
          template: true,
          requirement: true,
        },
      });
    });
  });
}); 