import type {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from '../interfaces/commands/ICommandHandler';
import type { ICommandRepository } from '../interfaces/repositories/ICommandRepository';
import type { CommandName } from '../types/commands.types';
import type { BugCommandService } from './commands/BugCommandService';
import type { RegressionCommandService } from './commands/RegressionCommandService';
import type { ConversationService } from './ConversationService';

export class CommandRouterService {
  private readonly handlers = new Map<string, ICommandHandler>();

  constructor(
    handlers: ICommandHandler[],
    private readonly commandRepository: ICommandRepository,
    private readonly conversationService: ConversationService,
    private readonly bugCommand: BugCommandService,
    private readonly regressionCommand: RegressionCommandService,
  ) {
    for (const handler of handlers) {
      this.handlers.set(handler.name, handler);
    }
  }

  async route(name: CommandName, context: CommandContext): Promise<CommandResult> {
    const handler = this.handlers.get(name);
    if (!handler) {
      return { reply: `Comando /${name} ainda não está disponível.` };
    }

    const startedAt = Date.now();
    try {
      const result = await handler.handle(context);
      await this.commandRepository.create({
        userId: context.userId,
        name,
        args: context.args,
        success: true,
        durationMs: Date.now() - startedAt,
      });
      return result;
    } catch (error) {
      await this.commandRepository.create({
        userId: context.userId,
        name,
        args: context.args,
        success: false,
        durationMs: Date.now() - startedAt,
      });
      throw error;
    }
  }

  async continueActiveFlow(userId: string, message: string): Promise<CommandResult | null> {
    const conversation = await this.conversationService.getOrCreateActive(userId);
    const state = this.conversationService.parseState(conversation);

    if (state.flow === 'bug') {
      return this.bugCommand.continue(userId, state, message);
    }

    if (state.flow === 'regressao') {
      const result = await this.regressionCommand.continue(userId, state, message);
      if (!result.keepFlow) {
        await this.conversationService.clearFlow(userId);
      }
      return result;
    }

    return null;
  }
}
