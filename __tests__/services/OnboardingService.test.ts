import { OnboardingService } from '../../src/services/OnboardingService';
import {
  IDoctorRepository,
  IEmailService,
  IEmployeeRepository,
} from '../../src/interfaces/onboarding';
import { INotificationSubject } from '../../src/interfaces/patterns';
import { Doctor, Employee } from '../../src/types/models';

// Mock implementations
const mockEmployeeRepository: jest.Mocked<IEmployeeRepository> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getByEmail: jest.fn(),
  updatePassword: jest.fn(),
  markFirstLoginComplete: jest.fn(),
};

const mockDoctorRepository: jest.Mocked<IDoctorRepository> = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  getByLocation: jest.fn(),
};

const mockEmailService: jest.Mocked<IEmailService> = {
  sendWelcomeEmail: jest.fn(),
  sendAssignmentEmail: jest.fn(),
};

const mockNotificationSubject: jest.Mocked<INotificationSubject> = {
  attach: jest.fn(),
  detach: jest.fn(),
  notify: jest.fn(),
};

describe('OnboardingService', () => {
  let onboardingService: OnboardingService;

  beforeEach(() => {
    jest.clearAllMocks();
    onboardingService = new OnboardingService(
      mockEmployeeRepository,
      mockDoctorRepository,
      mockEmailService,
      mockNotificationSubject
    );
  });

  describe('onboardEmployee', () => {
    it('should successfully onboard a new employee', async () => {
      // Arrange
      const employeeData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        dateOfBirth: '1998-01-01',
        areaOfOperation: 'Delhi',
        adminId: 'admin1',
      };

      const mockEmployee: Employee = {
        id: 'emp1',
        name: employeeData.name,
        email: employeeData.email,
        password: 'temp123',
        role: 'employee',
        age: employeeData.age,
        dateOfBirth: employeeData.dateOfBirth,
        areaOfOperation: employeeData.areaOfOperation,
        isFirstLogin: true,
        createdAt: new Date().toISOString(),
        createdBy: employeeData.adminId,
      };

      mockEmployeeRepository.getByEmail.mockResolvedValue(null);
      mockEmployeeRepository.create.mockResolvedValue(mockEmployee);
      mockEmailService.sendWelcomeEmail.mockResolvedValue(true);
      mockNotificationSubject.notify.mockImplementation(() => {});

      // Act
      const result = await onboardingService.onboardEmployee(
        employeeData.name,
        employeeData.email,
        employeeData.age,
        employeeData.dateOfBirth,
        employeeData.areaOfOperation,
        employeeData.adminId
      );

      // Assert
      expect(result).toEqual(mockEmployee);
      expect(mockEmployeeRepository.getByEmail).toHaveBeenCalledWith(
        employeeData.email
      );
      expect(mockEmployeeRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: employeeData.name,
          email: employeeData.email,
          age: employeeData.age,
          isFirstLogin: true,
        })
      );
      expect(mockEmailService.sendWelcomeEmail).toHaveBeenCalledWith(
        employeeData.email,
        employeeData.name,
        expect.any(String)
      );
      expect(mockNotificationSubject.notify).toHaveBeenCalled();
    });

    it('should throw error if employee email already exists', async () => {
      // Arrange
      const employeeData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
        dateOfBirth: '1998-01-01',
        areaOfOperation: 'Delhi',
        adminId: 'admin1',
      };

      const existingEmployee: Employee = {
        id: 'emp1',
        name: 'Existing Employee',
        email: employeeData.email,
        password: 'password',
        role: 'employee',
        age: 30,
        dateOfBirth: '1993-01-01',
        areaOfOperation: 'Mumbai',
        isFirstLogin: false,
        createdAt: new Date().toISOString(),
        createdBy: 'admin1',
      };

      mockEmployeeRepository.getByEmail.mockResolvedValue(existingEmployee);

      // Act & Assert
      await expect(
        onboardingService.onboardEmployee(
          employeeData.name,
          employeeData.email,
          employeeData.age,
          employeeData.dateOfBirth,
          employeeData.areaOfOperation,
          employeeData.adminId
        )
      ).rejects.toThrow('Employee with this email already exists.');
    });
  });

  describe('onboardDoctor', () => {
    it('should successfully onboard a new doctor', async () => {
      // Arrange
      const doctorData = {
        name: 'Dr. Smith',
        age: 35,
        dateOfBirth: '1988-01-01',
        specialization: 'Cardiology',
        location: { lat: 28.6139, lng: 77.209 },
        phone: '1234567890',
        adminId: 'admin1',
      };

      const mockDoctor: Doctor = {
        id: 'doc1',
        name: doctorData.name,
        age: doctorData.age,
        dateOfBirth: doctorData.dateOfBirth,
        specialization: doctorData.specialization,
        location: doctorData.location,
        phone: doctorData.phone,
        createdAt: new Date().toISOString(),
        createdBy: doctorData.adminId,
      };

      mockDoctorRepository.create.mockResolvedValue(mockDoctor);
      mockNotificationSubject.notify.mockImplementation(() => {});

      // Act
      const result = await onboardingService.onboardDoctor(
        doctorData.name,
        doctorData.age,
        doctorData.dateOfBirth,
        doctorData.specialization,
        doctorData.location,
        doctorData.adminId,
        doctorData.phone
      );

      // Assert
      expect(result).toEqual(mockDoctor);
      expect(mockDoctorRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: doctorData.name,
          age: doctorData.age,
          specialization: doctorData.specialization,
          location: doctorData.location,
        })
      );
      expect(mockNotificationSubject.notify).toHaveBeenCalled();
    });
  });
});
