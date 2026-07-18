import { z } from 'zod';

export const simulateMessageSchema = z.object({
  phone: z.string().min(8),
  name: z.string().optional(),
  message: z.string().min(1).max(8000),
});

export type SimulateMessageInput = z.infer<typeof simulateMessageSchema>;
