import { Router } from 'express';
import type { AppContainer } from '../container';
import { HealthController } from '../controllers/HealthController';
import { MetricsController } from '../controllers/MetricsController';
import { UsersController } from '../controllers/UsersController';
import { LogsController } from '../controllers/LogsController';
import { ChatSimulateController } from '../controllers/ChatSimulateController';
import { adminGuard } from '../middlewares/adminGuard';
import { createMetricsRoutes } from './metrics.routes';

export function createRoutes(container: AppContainer): Router {
  const router = Router();
  const healthController = new HealthController();
  const metricsController = new MetricsController(container.metricsService);
  const usersController = new UsersController(container.metricsService);
  const logsController = new LogsController(container.metricsService);
  const chatSimulateController = new ChatSimulateController(container.messageOrchestrator);

  router.get('/health', (req, res) => {
    healthController.get(req, res);
  });
  router.use('/api/metrics', createMetricsRoutes(metricsController, usersController, logsController));
  router.post('/api/chat/simulate', adminGuard, (req, res, next) => {
    void chatSimulateController.post(req, res, next);
  });

  return router;
}
