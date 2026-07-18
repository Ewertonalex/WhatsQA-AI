export interface SessionEntity {
  id: string;
  userId: string | null;
  sessionName: string;
  status: string;
  lastSeenAt: Date | null;
  metadataJson: string;
  createdAt: Date;
  updatedAt: Date;
}
