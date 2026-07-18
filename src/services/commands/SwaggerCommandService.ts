import { buildSwaggerPrompt } from '../../prompts/swagger.prompt';
import { AiCommandBase } from './AiCommandBase';

export class SwaggerCommandService extends AiCommandBase {
  readonly name = 'swagger';
  protected readonly historyKind = 'swagger';
  protected readonly missingArgsMessage =
    'Cole/descreva o Swagger. Ex: /swagger GET /orders';

  protected buildPrompt(args: string): string {
    return buildSwaggerPrompt(args);
  }
}
