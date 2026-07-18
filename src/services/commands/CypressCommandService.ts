import { buildCypressPrompt } from '../../prompts/cypress.prompt';
import { AiCommandBase } from './AiCommandBase';

export class CypressCommandService extends AiCommandBase {
  readonly name = 'cypress';
  protected readonly historyKind = 'cypress';
  protected readonly missingArgsMessage =
    'Descreva o fluxo. Ex: /cypress login e checkout';

  protected buildPrompt(args: string): string {
    return buildCypressPrompt(args);
  }
}
