import { buildBddPrompt } from '../../prompts/bdd.prompt';
import { AiCommandBase } from './AiCommandBase';

export class BddCommandService extends AiCommandBase {
  readonly name = 'bdd';
  protected readonly historyKind = 'bdd';
  protected readonly missingArgsMessage =
    'Envie o contexto/feature após o comando. Ex: /bdd login com MFA';

  protected buildPrompt(args: string): string {
    return buildBddPrompt(args);
  }
}
