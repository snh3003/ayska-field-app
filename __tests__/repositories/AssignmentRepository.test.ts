import { AssignmentRepository } from '../../src/repositories/AyskaAssignmentRepository';
import { LocalDataRepository } from '../../src/repositories/AyskaLocalDataRepository';
import { Assignment } from '../../src/types/AyskaModelsType';

// Mock LocalDataRepository
const mockLocalDataRepository = {
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as jest.Mocked<LocalDataRepository<any>>;

describe('AssignmentRepository', () => {
  let assignmentRepository: AssignmentRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    assignmentRepository = new AssignmentRepository(mockLocalDataRepository);
  });

  describe('getByEmployee', () => {
    it('should return assignments for specific employee', async () => {
      // Arrange
      const employeeId = 'emp1';
      const mockAssignments: Assignment[] = [
        {
          id: 'assign1',
          employeeId: 'emp1',
          doctorId: 'doc1',
          target: 10,
          assignedDate: '2024-01-01',
          assignedBy: 'admin1',
          status: 'active',
          currentProgress: 5,
        },
        {
          id: 'assign2',
          employeeId: 'emp1',
          doctorId: 'doc2',
          target: 15,
          assignedDate: '2024-01-02',
          assignedBy: 'admin1',
          status: 'active',
          currentProgress: 8,
        },
        {
          id: 'assign3',
          employeeId: 'emp2', // Different employee
          doctorId: 'doc3',
          target: 20,
          assignedDate: '2024-01-03',
          assignedBy: 'admin1',
          status: 'active',
          currentProgress: 10,
        },
      ];

      mockLocalDataRepository.getAll.mockResolvedValue(mockAssignments);

      // Act
      const result = await assignmentRepository.getByEmployee(employeeId);

      // Assert
      expect(result).toHaveLength(2);
      expect(
        result.every(assignment => assignment.employeeId === employeeId)
      ).toBe(true);
      expect(mockLocalDataRepository.getAll).toHaveBeenCalledWith(
        'assignments'
      );
    });

    it('should return empty array when no assignments found', async () => {
      // Arrange
      const employeeId = 'emp1';
      mockLocalDataRepository.getAll.mockResolvedValue([]);

      // Act
      const result = await assignmentRepository.getByEmployee(employeeId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getByDoctor', () => {
    it('should return assignments for specific doctor', async () => {
      // Arrange
      const doctorId = 'doc1';
      const mockAssignments: Assignment[] = [
        {
          id: 'assign1',
          employeeId: 'emp1',
          doctorId: 'doc1',
          target: 10,
          assignedDate: '2024-01-01',
          assignedBy: 'admin1',
          status: 'active',
          currentProgress: 5,
        },
        {
          id: 'assign2',
          employeeId: 'emp2',
          doctorId: 'doc1',
          target: 15,
          assignedDate: '2024-01-02',
          assignedBy: 'admin1',
          status: 'active',
          currentProgress: 8,
        },
        {
          id: 'assign3',
          employeeId: 'emp3',
          doctorId: 'doc2', // Different doctor
          target: 20,
          assignedDate: '2024-01-03',
          assignedBy: 'admin1',
          status: 'active',
          currentProgress: 10,
        },
      ];

      mockLocalDataRepository.getAll.mockResolvedValue(mockAssignments);

      // Act
      const result = await assignmentRepository.getByDoctor(doctorId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result.every(assignment => assignment.doctorId === doctorId)).toBe(
        true
      );
    });
  });

  describe('updateProgress', () => {
    it('should update assignment progress successfully', async () => {
      // Arrange
      const assignmentId = 'assign1';
      const progressIncrement = 2;
      const existingAssignment: Assignment = {
        id: assignmentId,
        employeeId: 'emp1',
        doctorId: 'doc1',
        target: 10,
        assignedDate: '2024-01-01',
        assignedBy: 'admin1',
        status: 'active',
        currentProgress: 5,
      };

      const updatedAssignment: Assignment = {
        ...existingAssignment,
        currentProgress: 7,
      };

      mockLocalDataRepository.getById.mockResolvedValue(existingAssignment);
      mockLocalDataRepository.update.mockResolvedValue(updatedAssignment);

      // Act
      const result = await assignmentRepository.updateProgress(
        assignmentId,
        progressIncrement
      );

      // Assert
      expect(result).toEqual(updatedAssignment);
      expect(mockLocalDataRepository.update).toHaveBeenCalledWith(
        'assignments',
        assignmentId,
        { currentProgress: 7 }
      );
    });

    it('should return null when assignment not found', async () => {
      // Arrange
      const assignmentId = 'nonexistent';
      mockLocalDataRepository.getById.mockResolvedValue(null);

      // Act
      const result = await assignmentRepository.updateProgress(assignmentId, 1);

      // Assert
      expect(result).toBeNull();
      expect(mockLocalDataRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create new assignment successfully', async () => {
      // Arrange
      const newAssignment: Assignment = {
        id: 'assign1',
        employeeId: 'emp1',
        doctorId: 'doc1',
        target: 10,
        assignedDate: '2024-01-01',
        assignedBy: 'admin1',
        status: 'active',
        currentProgress: 0,
      };

      mockLocalDataRepository.create.mockResolvedValue(newAssignment);

      // Act
      const result = await assignmentRepository.create(newAssignment);

      // Assert
      expect(result).toEqual(newAssignment);
      expect(mockLocalDataRepository.create).toHaveBeenCalledWith(
        'assignments',
        newAssignment
      );
    });
  });
});
