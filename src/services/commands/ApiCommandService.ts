import { buildApiPrompt } from '../../prompts/api.prompt';
import { AiCommandBase } from './AiCommandBase';

export class ApiCommandService extends AiCommandBase {
  readonly name = 'api';
  protected readonly historyKind = 'api';
  protected readonly missingArgsMessage =
    'Envie o endpoint/contrato. Ex: /api POST /users criar usuário';

  protected buildPrompt(args: string): string {
    return buildApiPrompt(args);
  }
}
