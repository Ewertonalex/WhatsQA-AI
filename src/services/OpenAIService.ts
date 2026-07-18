import OpenAI from 'openai';
import { getOpenAIConfig } from '../config/openai';
import { logger } from '../config/logger';
import { buildSystemPrompt } from '../prompts/systemPrompt';
import type { IOpenAIService } from '../interfaces/services/IOpenAIService';
import type { ILogRepository } from '../interfaces/repositories/ILogRepository';
import type { IUsageRepository } from '../interfaces/repositories/IUsageRepository';
import type { ChatMessage, OpenAIRequestInput, OpenAIResponse } from '../types/openai.types';
import { calculateCostUsd } from '../utils/costCalculator';
import { estimateTokens } from '../utils/tokenEstimator';

export class OpenAIService implements IOpenAIService {
  private readonly client: OpenAI;

  constructor(
    private readonly usageRepository: IUsageRepository,
    private readonly logRepository: ILogRepository,
    client?: OpenAI,
  ) {
    const config = getOpenAIConfig();
    this.client = client ?? new OpenAI({ apiKey: config.apiKey });
  }

  async complete(input: OpenAIRequestInput): Promise<OpenAIResponse> {
    const config = getOpenAIConfig();
    const startedAt = Date.now();

    const messages: ChatMessage[] = [
      { role: 'system', content: input.systemPrompt ?? buildSystemPrompt() },
      ...(input.context ?? []),
      { role: 'user', content: input.prompt },
    ];

    try {
      const completion = await this.client.chat.completions.create({
        model: config.model,
        temperature: input.temperature ?? config.temperature,
        max_tokens: input.maxTokens ?? config.maxTokens,
        messages,
      });

      const content = completion.choices[0]?.message?.content?.trim() ?? '';
      const promptTokens =
        completion.usage?.prompt_tokens ??
        estimateTokens(messages.map((m) => m.content).join('\n'));
      const completionTokens =
        completion.usage?.completion_tokens ?? estimateTokens(content);
      const totalTokens = completion.usage?.total_tokens ?? promptTokens + completionTokens;
      const durationMs = Date.now() - startedAt;
      const estimatedCostUsd = calculateCostUsd(config.model, promptTokens, completionTokens);

      const response: OpenAIResponse = {
        content,
        model: completion.model || config.model,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens,
          estimatedCostUsd,
        },
        durationMs,
      };

      await this.usageRepository.create({
        userId: input.userId,
        model: response.model,
        command: input.command,
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCostUsd,
        durationMs,
      });

      await this.logRepository.create({
        userId: input.userId,
        level: 'info',
        event: 'openai.complete',
        prompt: input.prompt,
        response: content,
        model: response.model,
        tokens: totalTokens,
        durationMs,
        metadataJson: JSON.stringify({ command: input.command ?? null }),
      });

      return response;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      const message = error instanceof Error ? error.message : 'Erro desconhecido na OpenAI';

      logger.error('OpenAI request failed', { error: message, command: input.command });

      await this.logRepository.create({
        userId: input.userId,
        level: 'error',
        event: 'openai.error',
        prompt: input.prompt,
        model: config.model,
        durationMs,
        errorMessage: message,
        metadataJson: JSON.stringify({ command: input.command ?? null }),
      });

      throw new Error(`Falha ao consultar a OpenAI: ${message}`);
    }
  }
}
