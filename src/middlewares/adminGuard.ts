import type { NextFunction, Request, Response } from 'express';
import { getEnv } from '../config/env';
import { AppError } from './errorHandler';

export function adminGuard(req: Request, _res: Response, next: NextFunction): void {
  const env = getEnv();
  const token = req.header('x-admin-token') ?? req.query.token;
  const expected = env.DASHBOARD_TOKEN ?? env.ADMIN_NUMBER;

  if (typeof token !== 'string' || token !== expected) {
    next(new AppError('Não autorizado', 401));
    return;
  }

  next();
}
