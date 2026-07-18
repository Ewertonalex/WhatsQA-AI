export interface HistoryEntity {
  id: string;
  userId: string;
  kind: string;
  title: string;
  content: string;
  metadataJson: string;
  createdAt: Date;
}
