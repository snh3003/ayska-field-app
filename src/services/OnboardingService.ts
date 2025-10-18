import {
  IDoctorRepository,
  IEmailService,
  IEmployeeRepository,
  IOnboardingService,
} from '../interfaces/onboarding';
import { INotificationSubject } from '../interfaces/patterns';
import { Doctor, Employee } from '../types/models';

export class OnboardingService implements IOnboardingService {
  constructor(
    private _employeeRepo: IEmployeeRepository,
    private _doctorRepo: IDoctorRepository,
    private _emailService: IEmailService,
    private _notificationObserver: INotificationSubject
  ) {}

  async onboardEmployee(
    _name: string,
    _email: string,
    _age: number,
    _areaOfOperation: string,
    _adminId: string
  ): Promise<Employee> {
    // Generate temporary password
    const tempPassword = this.generateTempPassword();

    const employee: Employee = {
      id: Math.random().toString(36).substr(2, 9),
      email: _email,
      password: tempPassword,
      name: _name,
      role: 'employee',
      age: _age,
      areaOfOperation: _areaOfOperation,
      isFirstLogin: true,
      createdAt: new Date().toISOString(),
      createdBy: _adminId,
    };

    const created = await this._employeeRepo.create(employee);

    // Send welcome email
    await this._emailService.sendWelcomeEmail(_email, _name, tempPassword);

    // Create notification for admin
    this._notificationObserver.notify({
      id: Math.random().toString(36).substr(2, 9),
      userId: _adminId,
      userRole: 'admin',
      type: 'system',
      title: 'Employee Onboarded',
      message: `${_name} has been successfully onboarded`,
      timestamp: new Date().toISOString(),
      read: false,
    });

    return created;
  }

  async onboardDoctor(
    _name: string,
    _age: number,
    _specialization: string,
    _location: { lat: number; lng: number },
    _phone: string,
    _adminId: string
  ): Promise<Doctor> {
    const doctor: Doctor = {
      id: Math.random().toString(36).substr(2, 9),
      name: _name,
      specialization: _specialization,
      location: _location,
      phone: _phone,
      age: _age,
      createdAt: new Date().toISOString(),
      createdBy: _adminId,
    };

    const created = await this._doctorRepo.create(doctor);

    // Create notification for admin
    this._notificationObserver.notify({
      id: Math.random().toString(36).substr(2, 9),
      userId: _adminId,
      userRole: 'admin',
      type: 'system',
      title: 'Doctor Onboarded',
      message: `${_name} has been successfully onboarded`,
      timestamp: new Date().toISOString(),
      read: false,
    });

    return created;
  }

  private generateTempPassword(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

// Interface already defined in interfaces/onboarding.ts
