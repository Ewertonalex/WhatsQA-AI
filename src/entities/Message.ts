export type MessageDirection = 'inbound' | 'outbound';

export interface MessageEntity {
  id: string;
  userId: string;
  conversationId: string | null;
  direction: MessageDirection;
  content: string;
  command: string | null;
  metadataJson: string;
  createdAt: Date;
}
