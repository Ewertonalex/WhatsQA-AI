import { Router } from 'express';
import type { MetricsController } from '../controllers/MetricsController';
import type { UsersController } from '../controllers/UsersController';
import type { LogsController } from '../controllers/LogsController';
import { adminGuard } from '../middlewares/adminGuard';

export function createMetricsRoutes(
  metricsController: MetricsController,
  usersController: UsersController,
  logsController: LogsController,
): Router {
  const router = Router();
  router.use(adminGuard);
  router.get('/', (req, res, next) => {
    void metricsController.get(req, res, next);
  });
  router.get('/users', (req, res, next) => {
    void usersController.latest(req, res, next);
  });
  router.get('/logs', (req, res, next) => {
    void logsController.recent(req, res, next);
  });
  return router;
}
