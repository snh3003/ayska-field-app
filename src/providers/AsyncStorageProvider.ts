import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageProvider } from './StorageProvider';

export class AsyncStorageProvider extends StorageProvider {
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(this.getKey(key), jsonValue);
    } catch (error) {
      // Log error for debugging in development
      if (__DEV__) {
        console.error(`Error saving ${key}:`, error);
      }
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(this.getKey(key));
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      // Log error for debugging in development
      if (__DEV__) {
        console.error(`Error reading ${key}:`, error);
      }
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.getKey(key));
    } catch (error) {
      // Log error for debugging in development
      if (__DEV__) {
        console.error(`Error removing ${key}:`, error);
      }
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const appKeys = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(appKeys);
    } catch (error) {
      // Log error for debugging in development
      if (__DEV__) {
        console.error('Error clearing storage:', error);
      }
      throw error;
    }
  }
}
