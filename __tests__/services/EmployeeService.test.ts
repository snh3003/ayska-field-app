import { EmployeeService } from '../../src/services/AyskaEmployeeService';
import { HttpClient } from '../../src/api/HttpClient';
import type {
  EmployeeCreatePayload,
  EmployeeListResponse,
  EmployeeResponse,
} from '../../src/types/AyskaEmployeeApiType';

// Mock HttpClient
jest.mock('../../src/api/HttpClient');

describe('EmployeeService', () => {
  let service: EmployeeService;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as any;
    service = new EmployeeService(mockHttpClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getEmployees', () => {
    it('fetches employees successfully', async () => {
      const mockResponse: EmployeeListResponse = {
        employees: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
            age: 30,
            area_of_operation: 'North',
            role: 'employee',
            is_active: true,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
            created_by: 'admin-1',
          },
        ],
        total: 1,
        page: 1,
        size: 10,
        has_next: false,
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const result = await service.getEmployees({ page: 1, size: 10 });

      expect(result).toEqual(mockResponse);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/admin/employees?page=1&size=10');
    });
  });

  describe('getEmployeeById', () => {
    it('fetches employee by ID successfully', async () => {
      const mockEmployee: EmployeeResponse = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        age: 30,
        area_of_operation: 'North',
        role: 'employee',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        created_by: 'admin-1',
      };

      mockHttpClient.get.mockResolvedValue(mockEmployee);

      const result = await service.getEmployeeById('1');

      expect(result).toEqual(mockEmployee);
      expect(mockHttpClient.get).toHaveBeenCalledWith('/admin/employees/1');
    });
  });

  describe('createEmployee', () => {
    it('creates employee successfully', async () => {
      const payload: EmployeeCreatePayload = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        age: 30,
        area_of_operation: 'North',
      };

      const mockResponse: EmployeeResponse = {
        id: '1',
        ...payload,
        role: 'employee',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        created_by: 'admin-1',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await service.createEmployee(payload);

      expect(result).toEqual(mockResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/admin/employees', payload);
    });
  });

  describe('updateEmployee', () => {
    it('updates employee successfully', async () => {
      const payload = { name: 'Jane Doe' };
      const mockResponse: EmployeeResponse = {
        id: '1',
        name: 'Jane Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        age: 30,
        area_of_operation: 'North',
        role: 'employee',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        created_by: 'admin-1',
      };

      mockHttpClient.put.mockResolvedValue(mockResponse);

      const result = await service.updateEmployee('1', payload);

      expect(result).toEqual(mockResponse);
      expect(mockHttpClient.put).toHaveBeenCalledWith('/admin/employees/1', payload);
    });
  });

  describe('deleteEmployee', () => {
    it('deletes employee successfully', async () => {
      mockHttpClient.delete.mockResolvedValue(undefined);

      await service.deleteEmployee('1');

      expect(mockHttpClient.delete).toHaveBeenCalledWith('/admin/employees/1');
    });
  });

  describe('reactivateEmployee', () => {
    it('reactivates employee successfully', async () => {
      const mockResponse: EmployeeResponse = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        age: 30,
        area_of_operation: 'North',
        role: 'employee',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        created_by: 'admin-1',
      };

      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await service.reactivateEmployee('1');

      expect(result).toEqual(mockResponse);
      expect(mockHttpClient.post).toHaveBeenCalledWith('/admin/employees/1/reactivate');
    });
  });
});
