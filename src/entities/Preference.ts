export interface PreferenceEntity {
  id: string;
  userId: string;
  key: string;
  valueJson: string;
  createdAt: Date;
  updatedAt: Date;
}
