import qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { logger } from '../config/logger';
import type { ISessionRepository } from '../interfaces/repositories/ISessionRepository';
import type { MessageOrchestratorService } from '../services/MessageOrchestratorService';
import { MessageHandler } from './MessageHandler';
import { getSessionName, getSessionPath } from './session';

export class WhatsAppClient {
  private client: Client | null = null;

  constructor(
    private readonly orchestrator: MessageOrchestratorService,
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async start(): Promise<void> {
    const sessionName = getSessionName();
    const dataPath = getSessionPath();

    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: sessionName,
        dataPath,
      }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      },
    });

    const handler = new MessageHandler(this.orchestrator);

    this.client.on('qr', (qr: string) => {
      logger.info('QR Code gerado. Escaneie com o WhatsApp para autenticar a sessão.');
      qrcode.generate(qr, { small: true });
      void this.sessionRepository.upsertByName({
        sessionName,
        status: 'qr',
      });
    });

    this.client.on('ready', () => {
      logger.info('WhatsApp conectado e pronto', { sessionName });
      void this.sessionRepository.upsertByName({
        sessionName,
        status: 'ready',
        lastSeenAt: new Date(),
      });
    });

    this.client.on('authenticated', () => {
      logger.info('WhatsApp autenticado', { sessionName });
      void this.sessionRepository.upsertByName({
        sessionName,
        status: 'authenticated',
      });
    });

    this.client.on('auth_failure', (message: string) => {
      logger.error('Falha de autenticação WhatsApp', { message });
      void this.sessionRepository.upsertByName({
        sessionName,
        status: 'auth_failure',
        metadataJson: JSON.stringify({ message }),
      });
    });

    this.client.on('disconnected', (reason: string) => {
      logger.warn('WhatsApp desconectado', { reason });
      void this.sessionRepository.upsertByName({
        sessionName,
        status: 'disconnected',
        metadataJson: JSON.stringify({ reason }),
      });
    });

    this.client.on('message', (message) => {
      void handler.handle(message).catch((error: unknown) => {
        const errMessage = error instanceof Error ? error.message : 'erro desconhecido';
        logger.error('Erro no MessageHandler', { error: errMessage });
      });
    });

    await this.client.initialize();
  }

  async stop(): Promise<void> {
    if (!this.client) {
      return;
    }
    await this.client.destroy();
    this.client = null;
  }
}
