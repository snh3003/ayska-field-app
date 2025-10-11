import { IDraftStorage, IStorageProvider } from '../interfaces/services';

export class DraftStorageService implements IDraftStorage {
  private storageProvider: IStorageProvider;

  constructor(storageProvider: IStorageProvider) {
    this.storageProvider = storageProvider;
  }

  async saveDraftData(key: string, data: any): Promise<void> {
    await this.storageProvider.setItem(`draft_${key}`, data);
  }

  async getDraftData(key: string): Promise<any | null> {
    return this.storageProvider.getItem(`draft_${key}`);
  }

  async removeDraftData(key: string): Promise<void> {
    await this.storageProvider.removeItem(`draft_${key}`);
  }
}
