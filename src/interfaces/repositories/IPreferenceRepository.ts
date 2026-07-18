import type { PreferenceEntity } from '../../entities/Preference';

export interface IPreferenceRepository {
  get(userId: string, key: string): Promise<PreferenceEntity | null>;
  set(userId: string, key: string, valueJson: string): Promise<PreferenceEntity>;
}
