import { ICacheStorage, IStorageProvider } from '../interfaces/services';

export class CacheStorageService implements ICacheStorage {
  private storageProvider: IStorageProvider;

  constructor(storageProvider: IStorageProvider) {
    this.storageProvider = storageProvider;
  }

  async cacheData(key: string, data: any, expiryInMinutes = 60): Promise<void> {
    const expiryTime = Date.now() + expiryInMinutes * 60 * 1000;
    await this.storageProvider.setItem(`cache_${key}`, { data, expiryTime });
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    const cached = await this.storageProvider.getItem<{
      data: T;
      expiryTime: number;
    }>(`cache_${key}`);

    if (!cached) return null;

    if (Date.now() > cached.expiryTime) {
      await this.storageProvider.removeItem(`cache_${key}`);
      return null;
    }

    return cached.data;
  }
}
