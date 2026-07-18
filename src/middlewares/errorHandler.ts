import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';

export class AppError extends Error {
  constructor(
    message: string,
    readonly statusCode = 500,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : 'Erro interno';

  logger.error('HTTP error', { statusCode, message });

  res.status(statusCode).json({
    error: message,
  });
}
