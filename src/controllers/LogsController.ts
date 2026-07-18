import type { Request, Response, NextFunction } from 'express';
import type { MetricsService } from '../services/MetricsService';

export class LogsController {
  constructor(private readonly metricsService: MetricsService) {}

  recent = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = await this.metricsService.getDashboardMetrics();
      res.status(200).json({ errors: metrics.recentErrors });
    } catch (error) {
      next(error);
    }
  };
}
