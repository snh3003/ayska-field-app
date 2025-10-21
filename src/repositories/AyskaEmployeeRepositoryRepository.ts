import {
  Employee,
  IEmployeeRepository,
} from '../interfaces/AyskaOnboardingInterface';
import { LocalDataRepository } from './AyskaLocalDataRepositoryRepository';

export class EmployeeRepository implements IEmployeeRepository {
  private dataRepository: LocalDataRepository<any>;

  constructor(dataRepository: LocalDataRepository<any>) {
    this.dataRepository = dataRepository;
  }

  async getAll(): Promise<Employee[]> {
    return this.dataRepository.getAll('employees');
  }

  async getById(id: string): Promise<Employee | null> {
    return this.dataRepository.getById('employees', id);
  }

  async create(item: Employee): Promise<Employee> {
    return this.dataRepository.create('employees', item);
  }

  async update(
    id: string,
    updates: Partial<Employee>
  ): Promise<Employee | null> {
    return this.dataRepository.update('employees', id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return this.dataRepository.delete('employees', id);
  }

  async getByEmail(email: string): Promise<Employee | null> {
    const employees = await this.getAll();
    return employees.find(emp => emp.email === email) || null;
  }

  // updatePassword method removed for OTP-based authentication

  async markFirstLoginComplete(id: string): Promise<boolean> {
    const result = await this.update(id, { isFirstLogin: false });
    return result !== null;
  }
}
