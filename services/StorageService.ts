import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  private prefix = '@ayska_';

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(`${this.prefix}${key}`, jsonValue);
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(`${this.prefix}${key}`);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter((key) => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  // Specific app methods
  async saveAuthToken(token: string): Promise<void> {
    await this.setItem('auth_token', token);
  }

  async getAuthToken(): Promise<string | null> {
    return this.getItem<string>('auth_token');
  }

  async removeAuthToken(): Promise<void> {
    await this.removeItem('auth_token');
  }

  async saveUserData(userData: any): Promise<void> {
    await this.setItem('user_data', userData);
  }

  async getUserData(): Promise<any | null> {
    return this.getItem('user_data');
  }

  async saveDraftData(key: string, data: any): Promise<void> {
    await this.setItem(`draft_${key}`, data);
  }

  async getDraftData(key: string): Promise<any | null> {
    return this.getItem(`draft_${key}`);
  }

  async removeDraftData(key: string): Promise<void> {
    await this.removeItem(`draft_${key}`);
  }

  async cacheData(key: string, data: any, expiryInMinutes = 60): Promise<void> {
    const expiryTime = Date.now() + expiryInMinutes * 60 * 1000;
    await this.setItem(`cache_${key}`, { data, expiryTime });
  }

  async getCachedData<T>(key: string): Promise<T | null> {
    const cached = await this.getItem<{ data: T; expiryTime: number }>(`cache_${key}`);
    
    if (!cached) return null;
    
    if (Date.now() > cached.expiryTime) {
      await this.removeItem(`cache_${key}`);
      return null;
    }
    
    return cached.data;
  }

  async saveSettings(settings: any): Promise<void> {
    await this.setItem('app_settings', settings);
  }

  async getSettings(): Promise<any | null> {
    return this.getItem('app_settings');
  }
}

export const storageService = new StorageService();

