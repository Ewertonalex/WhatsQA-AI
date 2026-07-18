import { loadEnv } from './config/env';
import { logger } from './config/logger';
import { createContainer } from './container';
import { disconnectPrisma } from './database/prismaClient';
import { startServer } from './server';
import { WhatsAppClient } from './whatsapp/WhatsAppClient';

async function bootstrap(): Promise<void> {
  const env = loadEnv();
  const container = createContainer();
  startServer(container);

  let whatsapp: WhatsAppClient | null = null;

  if (env.ENABLE_WHATSAPP) {
    whatsapp = new WhatsAppClient(container.messageOrchestrator, container.sessionRepository);
    try {
      await whatsapp.start();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao iniciar WhatsApp';
      logger.error('WhatsApp não iniciou; API/dashboard continuam disponíveis', {
        error: message,
      });
      whatsapp = null;
    }
  } else {
    logger.warn('WhatsApp desabilitado (ENABLE_WHATSAPP=false)');
  }

  const shutdown = async (signal: string): Promise<void> => {
    logger.info('Encerrando aplicação', { signal });
    if (whatsapp) {
      await whatsapp.stop();
    }
    await disconnectPrisma();
    process.exit(0);
  };

  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

bootstrap().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : 'Falha no bootstrap';
  // eslint-disable-next-line no-console
  console.error(message);
  process.exit(1);
});
