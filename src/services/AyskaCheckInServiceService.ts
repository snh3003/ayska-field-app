import {
  IAssignmentRepository,
  ICheckInRepository,
  ICheckInService,
  IDoctorRepository,
  IGeolocationService,
} from '../interfaces/AyskaOnboardingInterface';
import {
  ILocationValidator,
  INotificationSubject,
} from '../interfaces/AyskaPatternsInterface';
import { CheckIn } from '../types/AyskaModelsType';

export class CheckInService implements ICheckInService {
  constructor(
    private _checkInRepo: ICheckInRepository,
    private _doctorRepo: IDoctorRepository,
    private _assignmentRepo: IAssignmentRepository,
    private _locationValidator: ILocationValidator,
    private _notificationObserver: INotificationSubject,
    private _geolocationService: IGeolocationService
  ) {}

  async performCheckIn(
    _employeeId: string,
    _doctorId: string,
    _employeeLocation: { lat: number; lng: number },
    _notes?: string
  ): Promise<CheckIn> {
    const doctor = await this._doctorRepo.getById(_doctorId);
    if (!doctor) throw new Error('Doctor not found');

    // STRATEGY PATTERN: Validate location
    const validation = this._locationValidator.validateProximity(
      _employeeLocation,
      doctor.location,
      50 // 50 meters tolerance
    );

    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const distance = this._geolocationService.calculateDistance(
      _employeeLocation,
      doctor.location
    );

    // Get assignment
    const assignments = await this._assignmentRepo.getByEmployee(_employeeId);
    const assignment = assignments.find(
      a => a.doctorId === _doctorId && a.status === 'active'
    );

    // Create check-in
    const checkIn: CheckIn = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: _employeeId,
      doctorId: _doctorId,
      assignmentId: assignment?.id || '',
      timestamp: new Date().toISOString(),
      location: _employeeLocation,
      ...(_notes && { notes: _notes }),
      distanceFromDoctor: distance,
      isValid: true,
    };

    await this._checkInRepo.create(checkIn);

    // Update assignment progress
    if (assignment) {
      await this._assignmentRepo.updateProgress(
        assignment.id,
        assignment.currentProgress + 1
      );
    }

    // OBSERVER PATTERN: Notify all admins
    this._notificationObserver.notify({
      id: Math.random().toString(36).substr(2, 9),
      userId: 'admin', // Will be broadcast to all admins
      userRole: 'admin',
      type: 'checkin',
      title: 'Employee Check-in',
      message: `Employee checked in with ${doctor.name}`,
      timestamp: new Date().toISOString(),
      read: false,
      actionData: { targetId: checkIn.id },
    });

    return checkIn;
  }
}

// Interface already defined in interfaces/onboarding.ts
