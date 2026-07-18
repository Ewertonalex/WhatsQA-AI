import type { Server } from 'http';
import { createApp } from './app';
import { APP_NAME } from './config/constants';

const DEFAULT_PORT = 3000;

/**
 * Sobe o servidor HTTP.
 * Bootstrap do WhatsApp e DI entram nos módulos M11/M12.
 */
export function startServer(port: number = DEFAULT_PORT): Server {
  const app = createApp();

  const server = app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[${APP_NAME}] HTTP listening on port ${port}`);
  });

  return server;
}
