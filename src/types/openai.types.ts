export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIRequestInput {
  prompt: string;
  context?: ChatMessage[];
  systemPrompt?: string;
  userId?: string;
  command?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface OpenAIUsageStats {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface OpenAIResponse {
  content: string;
  model: string;
  usage: OpenAIUsageStats;
  durationMs: number;
}
