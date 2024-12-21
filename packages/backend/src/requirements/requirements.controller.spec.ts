import { Test, TestingModule } from '@nestjs/testing';
import { RequirementsController } from './requirements.controller';
import { RequirementsService } from './requirements.service';
import { CreditCategory } from '@prisma/client';

describe('RequirementsController', () => {
  let controller: RequirementsController;
  let service: RequirementsService;

  const mockRequirementsService = {
    create: jest.fn(),
    findByUser: jest.fn(),
    getProgress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequirementsController],
      providers: [
        {
          provide: RequirementsService,
          useValue: mockRequirementsService,
        },
      ],
    }).compile();

    controller = module.get<RequirementsController>(RequirementsController);
    service = module.get<RequirementsService>(RequirementsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new requirement', async () => {
      const userId = 'test-user-id';
      const createRequirementDto = {
        name: 'AMA Requirement',
        description: 'Annual requirement for AMA',
        totalCredits: 50,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        categories: [CreditCategory.AMA_PRA_CATEGORY_1],
      };

      const expectedResult = {
        id: 'test-req-id',
        ...createRequirementDto,
        userId,
      };

      mockRequirementsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(userId, createRequirementDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(userId, createRequirementDto);
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
        },
      ];

      mockRequirementsService.findByUser.mockResolvedValue(expectedRequirements);

      const result = await controller.findByUser(userId);

      expect(result).toEqual(expectedRequirements);
      expect(service.findByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('getProgress', () => {
    it('should return progress for a requirement', async () => {
      const userId = 'test-user-id';
      const requirementId = 'test-req-id';
      const expectedProgress = {
        requirement: {
          id: requirementId,
          totalCredits: 50,
        },
        totalEarned: 25,
        remaining: 25,
        percentComplete: 50,
      };

      mockRequirementsService.getProgress.mockResolvedValue(expectedProgress);

      const result = await controller.getProgress(userId, requirementId);

      expect(result).toEqual(expectedProgress);
      expect(service.getProgress).toHaveBeenCalledWith(userId, requirementId);
    });
  });
}); 