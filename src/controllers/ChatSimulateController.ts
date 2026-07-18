import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import type { MessageOrchestratorService } from '../services/MessageOrchestratorService';
import { AppError } from '../middlewares/errorHandler';

const bodySchema = z.object({
  phone: z.string().min(8),
  name: z.string().optional(),
  message: z.string().min(1),
});

/**
 * Endpoint de simulação (sem WhatsApp) para testes locais do fluxo de mensagens.
 */
export class ChatSimulateController {
  constructor(private readonly orchestrator: MessageOrchestratorService) {}

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = bodySchema.safeParse(req.body);
      if (!parsed.success) {
        throw new AppError('Payload inválido', 400);
      }

      const reply = await this.orchestrator.handle({
        phone: parsed.data.phone,
        name: parsed.data.name ?? null,
        body: parsed.data.message,
      });

      res.status(200).json({ reply });
    } catch (error) {
      next(error);
    }
  };
}
