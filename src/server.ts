import type { Server } from 'http';
import { APP_NAME } from './config/constants';
import { getEnv } from './config/env';
import { logger } from './config/logger';
import { createApp } from './app';
import type { AppContainer } from './container';

export function startServer(container: AppContainer, port?: number): Server {
  const env = getEnv();
  const listenPort = port ?? env.PORT;
  const app = createApp(container);

  const server = app.listen(listenPort, () => {
    logger.info(`[${APP_NAME}] HTTP listening`, { port: listenPort });
  });

  return server;
}
