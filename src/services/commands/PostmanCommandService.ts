import { buildPostmanPrompt } from '../../prompts/postman.prompt';
import { AiCommandBase } from './AiCommandBase';

export class PostmanCommandService extends AiCommandBase {
  readonly name = 'postman';
  protected readonly historyKind = 'postman';
  protected readonly missingArgsMessage =
    'Descreva a API. Ex: /postman CRUD de produtos com auth JWT';

  protected buildPrompt(args: string): string {
    return buildPostmanPrompt(args);
  }
}
