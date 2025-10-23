import {
  IAuthStorage,
  IStorageProvider,
} from '../interfaces/AyskaServicesInterface';
import { UserProfile } from '../types/AyskaAuthApiType';

export class AuthStorageService implements IAuthStorage {
  private storageProvider: IStorageProvider;

  constructor(storageProvider: IStorageProvider) {
    this.storageProvider = storageProvider;
  }

  // Token management
  async setToken(token: string): Promise<void> {
    await this.storageProvider.setItem('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    return this.storageProvider.getItem<string>('auth_token');
  }

  async clearToken(): Promise<void> {
    await this.storageProvider.removeItem('auth_token');
  }

  // User data management
  async setUser(user: UserProfile): Promise<void> {
    await this.storageProvider.setItem('user_data', user);
  }

  async getUser(): Promise<UserProfile | null> {
    return this.storageProvider.getItem<UserProfile>('user_data');
  }

  async clearUser(): Promise<void> {
    await this.storageProvider.removeItem('user_data');
  }

  // Refresh token management
  async setRefreshToken(refreshToken: string): Promise<void> {
    await this.storageProvider.setItem('refresh_token', refreshToken);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.storageProvider.getItem<string>('refresh_token');
  }

  async clearRefreshToken(): Promise<void> {
    await this.storageProvider.removeItem('refresh_token');
  }

  // Token expiry management
  async setTokenExpiry(expiresAt: string): Promise<void> {
    await this.storageProvider.setItem('token_expires_at', expiresAt);
  }

  async getTokenExpiry(): Promise<string | null> {
    return this.storageProvider.getItem<string>('token_expires_at');
  }

  async clearTokenExpiry(): Promise<void> {
    await this.storageProvider.removeItem('token_expires_at');
  }

  // Check if token is expired
  async isTokenExpired(): Promise<boolean> {
    const expiresAt = await this.getTokenExpiry();
    if (!expiresAt) return true;

    const expiryTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();

    // Add 5 minute buffer before actual expiry
    return currentTime >= expiryTime - 5 * 60 * 1000;
  }

  // Complete logout - clear all auth data
  async clearAll(): Promise<void> {
    await Promise.all([
      this.clearToken(),
      this.clearUser(),
      this.clearRefreshToken(),
      this.clearTokenExpiry(),
    ]);
  }

  // Legacy methods for backward compatibility
  async saveAuthToken(token: string): Promise<void> {
    await this.setToken(token);
  }

  async getAuthToken(): Promise<string | null> {
    return this.getToken();
  }

  async removeAuthToken(): Promise<void> {
    await this.clearToken();
  }

  async saveUserData(userData: any): Promise<void> {
    await this.setUser(userData);
  }

  async getUserData(): Promise<any | null> {
    return this.getUser();
  }
}
