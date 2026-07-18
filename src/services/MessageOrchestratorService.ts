import type { IMessageRepository } from '../interfaces/repositories/IMessageRepository';
import { sanitizeText } from '../utils/sanitize';
import type { ChatService } from './ChatService';
import type { CommandParserService } from './CommandParserService';
import type { CommandRouterService } from './CommandRouterService';
import type { UserService } from './UserService';
import { logger } from '../config/logger';

export interface IncomingMessage {
  phone: string;
  name?: string | null;
  body: string;
}

export class MessageOrchestratorService {
  constructor(
    private readonly userService: UserService,
    private readonly messageRepository: IMessageRepository,
    private readonly parser: CommandParserService,
    private readonly router: CommandRouterService,
    private readonly chatService: ChatService,
  ) {}

  async handle(incoming: IncomingMessage): Promise<string> {
    const body = sanitizeText(incoming.body);
    if (!body) {
      return 'Mensagem vazia. Envie /help para ver os comandos.';
    }

    const user = await this.userService.resolveFromPhone(incoming.phone, incoming.name);

    await this.messageRepository.create({
      userId: user.id,
      direction: 'inbound',
      content: body,
    });

    try {
      const parsed = this.parser.parse(body);

      if (parsed.isCommand && parsed.name) {
        const result = await this.router.route(parsed.name, {
          userId: user.id,
          phone: user.phone,
          args: parsed.args,
          rawMessage: body,
        });

        await this.messageRepository.create({
          userId: user.id,
          direction: 'outbound',
          content: result.reply,
          command: parsed.name,
        });

        return result.reply;
      }

      const flowResult = await this.router.continueActiveFlow(user.id, body);
      if (flowResult) {
        await this.messageRepository.create({
          userId: user.id,
          direction: 'outbound',
          content: flowResult.reply,
          command: 'flow',
        });
        return flowResult.reply;
      }

      return await this.chatService.reply(user.id, body);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado';
      logger.error('Falha ao processar mensagem', { error: message, phone: user.phone });
      const reply =
        'Ocorreu um erro ao processar sua solicitação. Tente novamente em instantes.';
      await this.messageRepository.create({
        userId: user.id,
        direction: 'outbound',
        content: reply,
        command: 'error',
      });
      return reply;
    }
  }
}
