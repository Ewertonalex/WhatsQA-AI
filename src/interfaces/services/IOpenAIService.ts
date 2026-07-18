import type { OpenAIRequestInput, OpenAIResponse } from '../../types/openai.types';

export interface IOpenAIService {
  complete(input: OpenAIRequestInput): Promise<OpenAIResponse>;
}
