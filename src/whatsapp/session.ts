import path from 'path';
import { getEnv } from '../config/env';

export function getSessionPath(): string {
  const { SESSION_NAME } = getEnv();
  return path.resolve(process.cwd(), 'sessions', SESSION_NAME);
}

export function getSessionName(): string {
  return getEnv().SESSION_NAME;
}
