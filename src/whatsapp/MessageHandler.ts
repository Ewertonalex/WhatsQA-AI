import type { Message } from 'whatsapp-web.js';
import { logger } from '../config/logger';
import type { MessageOrchestratorService } from '../services/MessageOrchestratorService';
import { normalizePhone } from '../utils/sanitize';

const MAX_WHATSAPP_CHUNK = 3500;

function chunkText(text: string, size = MAX_WHATSAPP_CHUNK): string[] {
  if (text.length <= size) {
    return [text];
  }

  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    chunks.push(remaining.slice(0, size));
    remaining = remaining.slice(size);
  }
  return chunks;
}

export class MessageHandler {
  constructor(private readonly orchestrator: MessageOrchestratorService) {}

  async handle(message: Message): Promise<void> {
    if (message.fromMe) {
      return;
    }

    if (message.isStatus) {
      return;
    }

    const chat = await message.getChat();
    if (chat.isGroup) {
      return;
    }

    const contact = await message.getContact();
    const phone = normalizePhone(contact.number || message.from);
    const body = message.body?.trim() ?? '';

    if (!body) {
      return;
    }

    logger.info('WhatsApp message received', { phone });

    const reply = await this.orchestrator.handle({
      phone,
      name: contact.pushname ?? null,
      body,
    });

    for (const chunk of chunkText(reply)) {
      await message.reply(chunk);
    }
  }
}
