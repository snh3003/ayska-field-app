import { Assignment } from '../types/models';

// Utility function to generate unique IDs
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export class AssignmentBuilder {
  private assignment: Partial<Assignment> = {
    id: generateId(),
    assignedDate: new Date().toISOString(),
    status: 'active',
    currentProgress: 0,
  };

  setEmployee(employeeId: string): this {
    this.assignment.employeeId = employeeId;
    return this;
  }

  setDoctor(doctorId: string): this {
    this.assignment.doctorId = doctorId;
    return this;
  }

  setTarget(target: number): this {
    this.assignment.target = target;
    return this;
  }

  setAssignedBy(adminId: string): this {
    this.assignment.assignedBy = adminId;
    return this;
  }

  build(): Assignment {
    if (
      !this.assignment.employeeId ||
      !this.assignment.doctorId ||
      !this.assignment.target
    ) {
      throw new Error('Missing required assignment fields');
    }
    return this.assignment as Assignment;
  }
}
