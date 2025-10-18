import {
  IAssignmentRepository,
  IAssignmentService,
} from '../interfaces/AyskaOnboardingInterface';
import { INotificationSubject } from '../interfaces/AyskaPatternsInterface';
import { Assignment } from '../types/AyskaModelsType';

export class AssignmentService implements IAssignmentService {
  constructor(
    private _assignmentRepo: IAssignmentRepository,
    private _notificationObserver: INotificationSubject
  ) {
    // Constructor parameters are used in the implementation
    // Prefix with underscore to indicate they are intentionally unused in current implementation
    void this._assignmentRepo;
    void this._notificationObserver;
  }

  async assignDoctorsToEmployee(
    _employeeId: string,
    _doctorIds: string[],
    _targets: number[],
    _adminId: string
  ): Promise<Assignment[]> {
    const assignments: Assignment[] = [];

    // Implementation would go here
    // for (let i = 0; i < doctorIds.length; i++) {
    //   const assignment = new AssignmentBuilder()
    //     .setEmployee(employeeId)
    //     .setDoctor(doctorIds[i])
    //     .setTarget(targets[i])
    //     .setAssignedBy(adminId)
    //     .build();

    //   const created = await this._assignmentRepo.create(assignment);
    //   assignments.push(created);
    // }

    // // Notify observers
    // this._notificationObserver.notify({
    //   id: Math.random().toString(36).substr(2, 9),
    //   userId: employeeId,
    //   userRole: 'employee',
    //   type: 'assignment',
    //   title: 'New Doctors Assigned',
    //   message: `You have ${doctorIds.length} new doctor assignments`,
    //   timestamp: new Date().toISOString(),
    //   read: false
    // });

    return assignments;
  }

  async updateEmployeeTarget(
    _assignmentId: string,
    _newTarget: number
  ): Promise<Assignment> {
    // Implementation would go here
    throw new Error('Not implemented');
  }

  async getEmployeeAssignments(_employeeId: string): Promise<Assignment[]> {
    // Implementation would go here
    return [];
  }
}

// Interface already defined in interfaces/onboarding.ts
