import {
  CheckIn,
  ICheckInRepository,
} from '../interfaces/AyskaOnboardingInterface';
import { LocalDataRepository } from './AyskaLocalDataRepository';

export class CheckInRepository implements ICheckInRepository {
  private dataRepository: LocalDataRepository<any>;

  constructor(dataRepository: LocalDataRepository<any>) {
    this.dataRepository = dataRepository;
  }

  async getAll(): Promise<CheckIn[]> {
    return this.dataRepository.getAll('checkIns');
  }

  async getById(id: string): Promise<CheckIn | null> {
    return this.dataRepository.getById('checkIns', id);
  }

  async create(item: CheckIn): Promise<CheckIn> {
    return this.dataRepository.create('checkIns', item);
  }

  async update(id: string, updates: Partial<CheckIn>): Promise<CheckIn | null> {
    return this.dataRepository.update('checkIns', id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return this.dataRepository.delete('checkIns', id);
  }

  async getByEmployee(
    employeeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<CheckIn[]> {
    const checkIns = await this.getAll();
    let filtered = checkIns.filter(
      checkIn => checkIn.employeeId === employeeId
    );

    if (startDate && endDate) {
      filtered = filtered.filter(checkIn => {
        const checkInDate = new Date(checkIn.timestamp);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return checkInDate >= start && checkInDate <= end;
      });
    }

    return filtered;
  }

  async getByDoctor(doctorId: string): Promise<CheckIn[]> {
    const checkIns = await this.getAll();
    return checkIns.filter(checkIn => checkIn.doctorId === doctorId);
  }
}
