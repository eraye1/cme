import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsService } from './requirements.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreditCategory } from '@prisma/client';

describe('RequirementsService', () => {
  let service: RequirementsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    requirement: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequirementsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RequirementsService>(RequirementsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const mockRequirementData = {
      name: 'AMA Requirement',
      description: 'Annual requirement for AMA',
      totalCredits: 50,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      categories: [CreditCategory.CATEGORY_1],
    };

    it('should create a requirement', async () => {
      const userId = 'test-user-id';
      const expectedResult = {
        id: 'test-req-id',
        ...mockRequirementData,
        userId,
      };

      mockPrismaService.requirement.create.mockResolvedValue(expectedResult);

      const result = await service.create(userId, mockRequirementData);

      expect(result).toEqual(expectedResult);
      expect(prisma.requirement.create).toHaveBeenCalledWith({
        data: {
          ...mockRequirementData,
          userId,
        },
      });
    });
  });

  describe('findByUser', () => {
    it('should return all requirements for a user', async () => {
      const userId = 'test-user-id';
      const expectedRequirements = [
        {
          id: 'req-1',
          name: 'AMA Requirement',
          userId,
          credits: [
            {
              id: 'credit-1',
              title: 'CME Course',
              documents: [],
            },
          ],
        },
      ];

      mockPrismaService.requirement.findMany.mockResolvedValue(expectedRequirements);

      const result = await service.findByUser(userId);

      expect(result).toEqual(expectedRequirements);
      expect(prisma.requirement.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: {
          credits: {
            include: {
              documents: true,
            },
          },
        },
      });
    });
  });

  describe('getProgress', () => {
    it('should calculate progress for a requirement', async () => {
      const userId = 'test-user-id';
      const requirementId = 'test-req-id';
      const requirement = {
        id: requirementId,
        totalCredits: 50,
        credits: [
          { credits: 10 },
          { credits: 15 },
        ],
      };

      mockPrismaService.requirement.findUnique.mockResolvedValue(requirement);

      const result = await service.getProgress(userId, requirementId);

      expect(result).toEqual({
        requirement,
        totalEarned: 25,
        remaining: 25,
        percentComplete: 50,
      });
      expect(prisma.requirement.findUnique).toHaveBeenCalledWith({
        where: { id: requirementId },
        include: {
          credits: true,
        },
      });
    });

    it('should return null for non-existent requirement', async () => {
      const userId = 'test-user-id';
      const requirementId = 'non-existent-id';

      mockPrismaService.requirement.findUnique.mockResolvedValue(null);

      const result = await service.getProgress(userId, requirementId);

      expect(result).toBeNull();
    });
  });
}); 