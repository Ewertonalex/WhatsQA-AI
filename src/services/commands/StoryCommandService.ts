import { buildStoryPrompt } from '../../prompts/story.prompt';
import { AiCommandBase } from './AiCommandBase';

export class StoryCommandService extends AiCommandBase {
  readonly name = 'story';
  protected readonly historyKind = 'story';
  protected readonly missingArgsMessage =
    'Envie a ideia da story. Ex: /story tela de recuperação de senha';

  protected buildPrompt(args: string): string {
    return buildStoryPrompt(args);
  }
}
