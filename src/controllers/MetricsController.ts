import type { Request, Response, NextFunction } from 'express';
import type { MetricsService } from '../services/MetricsService';

export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  get = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = await this.metricsService.getDashboardMetrics();
      res.status(200).json(metrics);
    } catch (error) {
      next(error);
    }
  };
}
