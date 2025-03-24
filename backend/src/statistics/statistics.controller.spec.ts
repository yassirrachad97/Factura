import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let service: StatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        {
          provide: StatisticsService,
          useValue: { 
            calculateStatistics: jest.fn().mockResolvedValue({ totalUsers: 100, totalSales: 5000 }) 
          },
        },
      ],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);
    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return statistics', async () => {
    const result = await controller.getStatistics();
    expect(result).toEqual({ totalUsers: 100, totalSales: 5000 });
    expect(service.calculateStatistics).toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    jest.spyOn(service, 'calculateStatistics').mockRejectedValueOnce(new Error('Database error'));
    
    try {
      await controller.getStatistics();
      fail('Expected getStatistics to throw an error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Database error');
    }
  });
});