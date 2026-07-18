export interface ConversationEntity {
  id: string;
  userId: string;
  title: string | null;
  flow: string;
  stateJson: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
