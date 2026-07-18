import { startServer } from './server';

/**
 * Entry point do WhatsQA AI.
 * M1: apenas servidor HTTP com healthcheck.
 */
function bootstrap(): void {
  const port = Number(process.env.PORT ?? 3000);
  startServer(Number.isFinite(port) ? port : 3000);
}

bootstrap();
