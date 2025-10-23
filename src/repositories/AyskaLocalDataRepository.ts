import data from '../fixtures/data.json';
import {
  ActivityRoundup,
  Admin,
  Assignment,
  Attendance,
  CheckIn,
  Doctor,
  Employee,
  Notification,
  Visit,
} from '../types';

export interface Database {
  admins: Admin[];
  employees: Employee[];
  doctors: Doctor[];
  assignments: Assignment[];
  attendance: Attendance[];
  visits: Visit[];
  notifications: Notification[];
  checkIns: CheckIn[];
  roundups: ActivityRoundup[];
}

export class LocalDataRepository<T> {
  private data: Database = data as Database;

  async getAll(collectionName: keyof Database): Promise<T[]> {
    return this.data[collectionName] as T[];
  }

  async getById(collectionName: keyof Database, id: string): Promise<T | null> {
    const collection = this.data[collectionName] as T[];
    return collection.find((item: any) => item.id === id) || null;
  }

  async create(collectionName: keyof Database, item: T): Promise<T> {
    const collection = this.data[collectionName] as T[];
    collection.push(item);
    return item;
  }

  async update(
    collectionName: keyof Database,
    id: string,
    updates: Partial<T>
  ): Promise<T | null> {
    const collection = this.data[collectionName] as T[];
    const index = collection.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      collection[index] = { ...collection[index], ...updates } as T;
      return collection[index] || null;
    }
    return null;
  }

  async delete(collectionName: keyof Database, id: string): Promise<boolean> {
    const collection = this.data[collectionName] as any[];
    const index = collection.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      collection.splice(index, 1);
      return true;
    }
    return false;
  }
}
