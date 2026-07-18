export interface CommandEntity {
  id: string;
  userId: string;
  name: string;
  args: string | null;
  success: boolean;
  durationMs: number;
  createdAt: Date;
}
