import type { Request, Response } from 'express';
import { APP_NAME, APP_TAGLINE, BRAND_ASSETS } from '../config/constants';
import { getEnv } from '../config/env';

export class HealthController {
  get(_req: Request, res: Response): void {
    const env = getEnv();
    res.status(200).json({
      status: 'ok',
      service: APP_NAME,
      tagline: APP_TAGLINE,
      brand: BRAND_ASSETS,
      whatsappEnabled: env.ENABLE_WHATSAPP,
      timestamp: new Date().toISOString(),
    });
  }
}
