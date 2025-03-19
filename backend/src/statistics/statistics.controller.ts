import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get()
  async getStatistics() {
    try {
      // Calculer les statistiques
      return await this.statisticsService.calculateStatistics();
    } catch (error) {
      console.error("Error while fetching statistics:", error);
      throw error; 
    }
  }
}

