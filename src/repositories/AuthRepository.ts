import { Admin, Employee, IAuthRepository } from '../interfaces/repositories';
import { LocalDataRepository } from './LocalDataRepository';

export class AuthRepository implements IAuthRepository {
  private dataRepository: LocalDataRepository<any>;

  constructor(dataRepository: LocalDataRepository<any>) {
    this.dataRepository = dataRepository;
  }

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const admins = await this.dataRepository.getAll('admins');
    return (
      admins.find(
        (admin: Admin) => admin.email === email && admin.password === password
      ) || null
    );
  }

  async validateEmployee(
    email: string,
    password: string
  ): Promise<Employee | null> {
    const employees = await this.dataRepository.getAll('employees');
    return (
      employees.find(
        (emp: Employee) => emp.email === email && emp.password === password
      ) || null
    );
  }
}
