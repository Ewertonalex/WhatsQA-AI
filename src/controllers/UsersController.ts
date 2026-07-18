import type { Request, Response, NextFunction } from 'express';
import type { MetricsService } from '../services/MetricsService';

export class UsersController {
  constructor(private readonly metricsService: MetricsService) {}

  latest = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = await this.metricsService.getDashboardMetrics();
      res.status(200).json({ users: metrics.latestUsers });
    } catch (error) {
      next(error);
    }
  };
}
