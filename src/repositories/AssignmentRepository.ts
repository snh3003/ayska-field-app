import { Assignment, IAssignmentRepository } from '../interfaces/onboarding';
import { LocalDataRepository } from './LocalDataRepository';

export class AssignmentRepository implements IAssignmentRepository {
  private dataRepository: LocalDataRepository<any>;

  constructor(dataRepository: LocalDataRepository<any>) {
    this.dataRepository = dataRepository;
  }

  async getAll(): Promise<Assignment[]> {
    return this.dataRepository.getAll('assignments');
  }

  async getById(id: string): Promise<Assignment | null> {
    return this.dataRepository.getById('assignments', id);
  }

  async create(item: Assignment): Promise<Assignment> {
    return this.dataRepository.create('assignments', item);
  }

  async update(
    id: string,
    updates: Partial<Assignment>
  ): Promise<Assignment | null> {
    return this.dataRepository.update('assignments', id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return this.dataRepository.delete('assignments', id);
  }

  async getByEmployee(employeeId: string): Promise<Assignment[]> {
    const assignments = await this.getAll();
    return assignments.filter(
      assignment => assignment.employeeId === employeeId
    );
  }

  async getByDoctor(doctorId: string): Promise<Assignment[]> {
    const assignments = await this.getAll();
    return assignments.filter(assignment => assignment.doctorId === doctorId);
  }

  async updateProgress(
    id: string,
    progress: number
  ): Promise<Assignment | null> {
    return this.update(id, { currentProgress: progress });
  }
}
