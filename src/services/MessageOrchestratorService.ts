import type { IMessageRepository } from '../interfaces/repositories/IMessageRepository';
import { sanitizeText } from '../utils/sanitize';
import type { ChatService } from './ChatService';
import type { CommandParserService } from './CommandParserService';
import type { CommandRouterService } from './CommandRouterService';
import type { UserService } from './UserService';
import type { WelcomeService } from './WelcomeService';
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
    private readonly welcomeService: WelcomeService,
  ) {}

  async handle(incoming: IncomingMessage): Promise<string> {
    const body = sanitizeText(incoming.body);
    if (!body) {
      return this.welcomeService.buildWelcome(incoming.name);
    }

    const { user, isNew } = await this.userService.resolveFromPhone(
      incoming.phone,
      incoming.name,
    );

    await this.messageRepository.create({
      userId: user.id,
      direction: 'inbound',
      content: body,
    });

    try {
      const wantsWelcome = isNew || this.welcomeService.isGreeting(body);
      const parsed = this.parser.parse(body);
      const isRealCommand = parsed.isCommand && parsed.name !== null;

      // Novo contato ou saudação → apresentação + menu
      if (wantsWelcome && !isRealCommand) {
        const welcome = this.welcomeService.buildWelcome(user.name ?? incoming.name);
        await this.persistOutbound(user.id, welcome, 'welcome');
        return welcome;
      }

      if (isRealCommand && parsed.name) {
        const result = await this.router.route(parsed.name, {
          userId: user.id,
          phone: user.phone,
          args: parsed.args,
          rawMessage: body,
        });

        // Primeiro contato já veio com comando: apresenta + executa
        const reply =
          isNew && parsed.name !== 'help'
            ? `${this.welcomeService.buildWelcome(user.name ?? incoming.name)}\n\n---\n\n${result.reply}`
            : result.reply;

        await this.persistOutbound(user.id, reply, parsed.name);
        return reply;
      }

      const flowResult = await this.router.continueActiveFlow(user.id, body);
      if (flowResult) {
        await this.persistOutbound(user.id, flowResult.reply, 'flow');
        return flowResult.reply;
      }

      return await this.chatService.reply(user.id, body);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro inesperado';
      logger.error('Falha ao processar mensagem', { error: message, phone: user.phone });
      const reply =
        'Ocorreu um erro ao processar sua solicitação. Tente novamente em instantes.';
      await this.persistOutbound(user.id, reply, 'error');
      return reply;
    }
  }

  private async persistOutbound(
    userId: string,
    content: string,
    command: string,
  ): Promise<void> {
    await this.messageRepository.create({
      userId,
      direction: 'outbound',
      content,
      command,
    });
  }
}
