import {
  IAuthStorage,
  IStorageProvider,
} from '../interfaces/AyskaServicesInterface';

export class AuthStorageService implements IAuthStorage {
  private storageProvider: IStorageProvider;

  constructor(storageProvider: IStorageProvider) {
    this.storageProvider = storageProvider;
  }

  async saveAuthToken(token: string): Promise<void> {
    await this.storageProvider.setItem('auth_token', token);
  }

  async getAuthToken(): Promise<string | null> {
    return this.storageProvider.getItem<string>('auth_token');
  }

  async removeAuthToken(): Promise<void> {
    await this.storageProvider.removeItem('auth_token');
  }

  async saveUserData(userData: any): Promise<void> {
    await this.storageProvider.setItem('user_data', userData);
  }

  async getUserData(): Promise<any | null> {
    return this.storageProvider.getItem('user_data');
  }
}
