import { IStorageProvider } from '../interfaces/services';

export abstract class StorageProvider implements IStorageProvider {
  protected prefix: string;

  constructor(prefix: string = '@ayska_') {
    this.prefix = prefix;
  }

  abstract setItem<T>(_key: string, _value: T): Promise<void>;
  abstract getItem<T>(_key: string): Promise<T | null>;
  abstract removeItem(_key: string): Promise<void>;
  abstract clear(): Promise<void>;

  protected getKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}
