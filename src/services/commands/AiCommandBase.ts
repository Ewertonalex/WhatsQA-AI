import type {
  CommandContext,
  CommandResult,
  ICommandHandler,
} from '../../interfaces/commands/ICommandHandler';
import type { IHistoryRepository } from '../../interfaces/repositories/IHistoryRepository';
import type { IOpenAIService } from '../../interfaces/services/IOpenAIService';

export abstract class AiCommandBase implements ICommandHandler {
  abstract readonly name: string;
  protected abstract readonly historyKind: string;
  protected abstract readonly missingArgsMessage: string;

  constructor(
    protected readonly openAIService: IOpenAIService,
    protected readonly historyRepository: IHistoryRepository,
  ) {}

  protected abstract buildPrompt(args: string): string;

  async handle(context: CommandContext): Promise<CommandResult> {
    if (!context.args.trim()) {
      return { reply: this.missingArgsMessage };
    }

    const response = await this.openAIService.complete({
      prompt: this.buildPrompt(context.args),
      userId: context.userId,
      command: this.name,
    });

    const title = `${this.name}: ${context.args.slice(0, 60)}`;

    await this.historyRepository.create({
      userId: context.userId,
      kind: this.historyKind,
      title,
      content: response.content,
    });

    return {
      reply: response.content,
      historyKind: this.historyKind,
      historyTitle: title,
    };
  }
}
