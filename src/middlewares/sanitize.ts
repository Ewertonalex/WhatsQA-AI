import type { NextFunction, Request, Response } from 'express';
import { sanitizeText } from '../utils/sanitize';

export function sanitizeBody(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === 'object') {
    for (const [key, value] of Object.entries(req.body as Record<string, unknown>)) {
      if (typeof value === 'string') {
        (req.body as Record<string, unknown>)[key] = sanitizeText(value);
      }
    }
  }
  next();
}
