import path from 'path';
import express, { type Application } from 'express';
import { APP_NAME, APP_TAGLINE, BRAND_ASSETS } from './config/constants';

/**
 * Cria a aplicação Express.
 * Rotas, middlewares e dashboard serão registrados nos módulos seguintes.
 */
export function createApp(): Application {
  const app = express();

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(process.cwd(), 'public')));

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      service: APP_NAME,
      tagline: APP_TAGLINE,
      brand: BRAND_ASSETS,
      module: 'foundation',
      timestamp: new Date().toISOString(),
    });
  });

  return app;
}
