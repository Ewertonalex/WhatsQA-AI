import fs from 'fs';
import path from 'path';
import winston from 'winston';
import { getEnv } from './env';

const logsDir = path.resolve(process.cwd(), 'logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const consoleFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  const rest = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  const base = `${String(ts)} [${level}] ${String(message)}${rest}`;
  const stackText = typeof stack === 'string' ? stack : undefined;
  return stackText ? `${base}\n${stackText}` : base;
});

export const logger = winston.createLogger({
  level: getEnv().LOG_LEVEL,
  defaultMeta: { service: 'whatsqa-ai' },
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
});

if (getEnv().NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), consoleFormat),
    }),
  );
}

export type Logger = typeof logger;
