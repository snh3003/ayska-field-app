import {
  ISettingsStorage,
  IStorageProvider,
} from '../interfaces/AyskaServicesInterface';

export class SettingsStorageService implements ISettingsStorage {
  private storageProvider: IStorageProvider;

  constructor(storageProvider: IStorageProvider) {
    this.storageProvider = storageProvider;
  }

  async saveSettings(settings: any): Promise<void> {
    await this.storageProvider.setItem('app_settings', settings);
  }

  async getSettings(): Promise<any | null> {
    return this.storageProvider.getItem('app_settings');
  }
}
