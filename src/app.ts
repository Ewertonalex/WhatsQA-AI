import path from 'path';
import cors from 'cors';
import express, { type Application } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import type { AppContainer } from './container';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import { sanitizeBody } from './middlewares/sanitize';
import { createRoutes } from './routes';

export function createApp(container: AppContainer): Application {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(sanitizeBody);
  app.use(requestLogger);
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.use(express.static(path.join(process.cwd(), 'public')));
  app.use(createRoutes(container));

  app.get('/', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'dashboard.html'));
  });

  app.use(errorHandler);

  return app;
}
