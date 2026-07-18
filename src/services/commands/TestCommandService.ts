import { buildTestPrompt } from '../../prompts/test.prompt';
import { AiCommandBase } from './AiCommandBase';

export class TestCommandService extends AiCommandBase {
  readonly name = 'teste';
  protected readonly historyKind = 'teste';
  protected readonly missingArgsMessage =
    'Envie a User Story após o comando. Ex: /teste Como usuário quero...';

  protected buildPrompt(args: string): string {
    return buildTestPrompt(args);
  }
}
