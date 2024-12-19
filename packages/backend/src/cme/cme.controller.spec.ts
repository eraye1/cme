import { Test, TestingModule } from '@nestjs/testing';
import { CmeController } from './cme.controller';
import { CmeService } from './cme.service';
import { ActivityType, CreditCategory } from '@prisma/client';

describe('CmeController', () => {
  let controller: CmeController;
  let service: CmeService;

  const mockCmeService = {
    createCredit: jest.fn(),
    getCreditsByUser: jest.fn(),
    getCreditsByRequirement: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CmeController],
      providers: [
        {
          provide: CmeService,
          useValue: mockCmeService,
        },
      ],
    }).compile();

    controller = module.get<CmeController>(CmeController);
    service = module.get<CmeService>(CmeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createCredit', () => {
    it('should create a new CME credit', async () => {
      const userId = 'test-user-id';
      const createCreditDto = {
        title: 'Test CME Course',
        provider: 'Test Provider',
        activityType: ActivityType.ONLINE_COURSE,
        category: CreditCategory.CATEGORY_1,
        credits: 2.5,
        completedAt: new Date(),
      };

      const expectedResult = {
        id: 'test-credit-id',
        ...createCreditDto,
        userId,
      };

      mockCmeService.createCredit.mockResolvedValue(expectedResult);

      const result = await controller.createCredit(userId, createCreditDto);

      expect(result).toEqual(expectedResult);
      expect(service.createCredit).toHaveBeenCalledWith(userId, createCreditDto);
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
      ];

      mockCmeService.getCreditsByUser.mockResolvedValue(expectedCredits);

      const result = await controller.getCreditsByUser(userId);

      expect(result).toEqual(expectedCredits);
      expect(service.getCreditsByUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('getCreditsByRequirement', () => {
    it('should return credits for a specific requirement', async () => {
      const userId = 'test-user-id';
      const requirementId = 'test-req-id';
      const expectedCredits = [
        {
          id: 'credit-1',
          title: 'CME Course 1',
          userId,
          requirementId,
        },
      ];

      mockCmeService.getCreditsByRequirement.mockResolvedValue(expectedCredits);

      const result = await controller.getCreditsByRequirement(userId, requirementId);

      expect(result).toEqual(expectedCredits);
      expect(service.getCreditsByRequirement).toHaveBeenCalledWith(userId, requirementId);
    });
  });
}); 