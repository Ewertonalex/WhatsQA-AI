export interface UserEntity {
  id: string;
  phone: string;
  name: string | null;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}
