<!-- 42f483fc-97ba-42a1-9579-e590cf9dfb17 42dbf9bb-bc25-43ee-bad8-3b27b804dc11 -->

# Assignment, Notification & Check-in System Implementation

## System Design Patterns to Implement

### 1. Observer Pattern (Notification System)

- **Purpose**: Real-time notifications to admin/employees for check-ins, assignments
- **Implementation**: Firebase Cloud Messaging + Local notification center
- **Why**: Decouples notification sending from business logic

### 2. Strategy Pattern (Geolocation Validation)

- **Purpose**: Validate employee location matches doctor location (50m tolerance)
- **Implementation**: Create `ILocationValidator` interface with different strategies
- **Why**: Already using Strategy pattern for validation - consistent approach

### 3. Builder Pattern (Assignment Creation)

- **Purpose**: Admin creating complex assignments (employee + multiple doctors + targets)
- **Implementation**: `AssignmentBuilder` for step-by-step assignment creation
- **Why**: Simplifies complex object construction with multiple optional fields

### 4. Repository Pattern (Extended)

- **Purpose**: Data access for new entities (assignments, notifications, check-ins)
- **Implementation**: Extend existing repository pattern
- **Why**: Already implemented - just add new repositories

## Implementation Plan

### Phase 1: Data Models & Interfaces

**Update `src/types/models.ts`:**

```typescript
export interface Assignment {
  id: string;
  employeeId: string;
  doctorId: string;
  target: number; // Number of visits required
  assignedDate: string;
  assignedBy: string; // Admin ID
  status: 'active' | 'completed' | 'cancelled';
}

export interface Notification {
  id: string;
  recipientId: string; // Admin or Employee ID
  recipientRole: 'admin' | 'employee';
  type: 'checkin' | 'assignment' | 'roundup';
  title: string;
  message: string;
  data: any; // Additional payload
  read: boolean;
  timestamp: string;
}

export interface CheckIn {
  id: string;
  employeeId: string;
  doctorId: string;
  assignmentId: string;
  location: Location;
  timestamp: string;
  notes?: string;
  status: 'success' | 'failed';
}

export interface DailyRoundup {
  id: string;
  date: string;
  employeeStats: EmployeeRoundupStat[];
  overallStats: OverallStats;
  generatedAt: string;
}
```

**Create `src/interfaces/notifications.ts`:**

```typescript
export interface INotificationObserver {
  notify(notification: Notification): void;
}

export interface INotificationService {
  subscribe(observer: INotificationObserver): void;
  unsubscribe(observer: INotificationObserver): void;
  notifyAdmins(
    notification: Omit<Notification, 'id' | 'recipientId' | 'recipientRole'>
  ): Promise<void>;
  notifyEmployee(
    employeeId: string,
    notification: Omit<Notification, 'id' | 'recipientId' | 'recipientRole'>
  ): Promise<void>;
  getNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
}

export interface ILocationValidator {
  validate(
    employeeLocation: Location,
    doctorLocation: Location
  ): ValidationResult;
}
```

**Create `src/interfaces/assignments.ts`:**

```typescript
export interface IAssignmentRepository {
  create(assignment: Assignment): Promise<Assignment>;
  getByEmployeeId(employeeId: string): Promise<Assignment[]>;
  updateTarget(assignmentId: string, newTarget: number): Promise<Assignment>;
  delete(assignmentId: string): Promise<boolean>;
}

export interface IAssignmentService {
  assignDoctorsToEmployee(
    employeeId: string,
    doctorIds: string[],
    targets: number[],
    adminId: string
  ): Promise<Assignment[]>;
  updateEmployeeTarget(
    assignmentId: string,
    newTarget: number
  ): Promise<Assignment>;
  getEmployeeAssignments(employeeId: string): Promise<Assignment[]>;
}
```

### Phase 2: Validation Strategy (Geolocation)

**Create `src/validation/strategies/LocationValidator.ts`:**

```typescript
export class LocationValidator implements ILocationValidator {
  private readonly TOLERANCE_METERS = 50;

  validate(
    employeeLocation: Location,
    doctorLocation: Location
  ): ValidationResult {
    const distance = this.calculateDistance(employeeLocation, doctorLocation);

    if (distance <= this.TOLERANCE_METERS) {
      return { isValid: true };
    }

    return {
      isValid: false,
      error: `You are ${Math.round(distance)}m away. Must be within ${this.TOLERANCE_METERS}m`,
    };
  }

  private calculateDistance(loc1: Location, loc2: Location): number {
    // Haversine formula implementation
  }
}
```

### Phase 3: Repository Layer

**Create `src/repositories/AssignmentRepository.ts`:**

```typescript
export class AssignmentRepository implements IAssignmentRepository {
  constructor(private dataRepo: LocalDataRepository<any>) {}

  async create(assignment: Assignment): Promise<Assignment> {
    return this.dataRepo.create('assignments', assignment);
  }

  async getByEmployeeId(employeeId: string): Promise<Assignment[]> {
    const all = await this.dataRepo.getAll('assignments');
    return all.filter((a: Assignment) => a.employeeId === employeeId);
  }
}
```

**Create `src/repositories/NotificationRepository.ts`:**

```typescript
export class NotificationRepository
  implements IReadRepository<Notification>, IWriteRepository<Notification>
{
  constructor(private dataRepo: LocalDataRepository<any>) {}

  async getByUserId(userId: string): Promise<Notification[]> {
    const all = await this.dataRepo.getAll('notifications');
    return all.filter((n: Notification) => n.recipientId === userId);
  }
}
```

**Create `src/repositories/CheckInRepository.ts`:**

```typescript
export class CheckInRepository {
  constructor(private dataRepo: LocalDataRepository<any>) {}

  async create(checkIn: CheckIn): Promise<CheckIn> {
    return this.dataRepo.create('checkIns', checkIn);
  }

  async getByEmployeeId(
    employeeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<CheckIn[]> {
    // Filter by date range for reports
  }
}
```

### Phase 4: Service Layer

**Create `src/services/NotificationService.ts`:**

```typescript
export class NotificationService implements INotificationService {
  private observers: INotificationObserver[] = [];

  constructor(
    private notificationRepo: NotificationRepository,
    private firebaseService: IFirebaseService
  ) {}

  async notifyAdmins(notification: Omit<Notification, 'id' | 'recipientId' | 'recipientRole'>): Promise<void> {
    const admins = await this.adminRepo.getAll();

    for (const admin of admins) {
      const notif: Notification = {
        ...notification,
        id: generateId(),
        recipientId: admin.id,
        recipientRole: 'admin',
        read: false
      };

      await this.notificationRepo.create(notif);
      await this.firebaseService.sendPushNotification(admin.id, notif);
      this.notifyObservers(notif);
    }
  }

  async notifyEmployee(employeeId: string, notification: ...): Promise<void> {
    // Similar implementation
  }
}
```

**Create `src/services/AssignmentService.ts`:**

```typescript
export class AssignmentService implements IAssignmentService {
  constructor(
    private assignmentRepo: IAssignmentRepository,
    private notificationService: INotificationService
  ) {}

  async assignDoctorsToEmployee(
    employeeId: string,
    doctorIds: string[],
    targets: number[],
    adminId: string
  ): Promise<Assignment[]> {
    const assignments: Assignment[] = [];

    for (let i = 0; i < doctorIds.length; i++) {
      const assignment = new AssignmentBuilder()
        .setEmployee(employeeId)
        .setDoctor(doctorIds[i])
        .setTarget(targets[i])
        .setAssignedBy(adminId)
        .build();

      const created = await this.assignmentRepo.create(assignment);
      assignments.push(created);
    }

    // Notify employee
    await this.notificationService.notifyEmployee(employeeId, {
      type: 'assignment',
      title: 'New Doctors Assigned',
      message: `You have been assigned ${doctorIds.length} new doctors`,
      data: { assignments },
    });

    return assignments;
  }
}
```

**Create `src/services/CheckInService.ts`:**

```typescript
export class CheckInService {
  constructor(
    private checkInRepo: CheckInRepository,
    private assignmentRepo: IAssignmentRepository,
    private locationValidator: ILocationValidator,
    private notificationService: INotificationService
  ) {}

  async performCheckIn(
    employeeId: string,
    doctorId: string,
    employeeLocation: Location,
    notes?: string
  ): Promise<CheckIn> {
    // Get doctor location
    const doctor = await this.doctorRepo.getById(doctorId);

    // Validate location
    const validation = this.locationValidator.validate(
      employeeLocation,
      doctor.location
    );
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Get assignment
    const assignments = await this.assignmentRepo.getByEmployeeId(employeeId);
    const assignment = assignments.find(a => a.doctorId === doctorId);

    // Create check-in
    const checkIn: CheckIn = {
      id: generateId(),
      employeeId,
      doctorId,
      assignmentId: assignment?.id || '',
      location: employeeLocation,
      timestamp: new Date().toISOString(),
      notes,
      status: 'success',
    };

    await this.checkInRepo.create(checkIn);

    // Notify all admins
    await this.notificationService.notifyAdmins({
      type: 'checkin',
      title: 'Employee Check-in',
      message: `${employeeName} checked in with ${doctor.name}`,
      data: { checkIn },
    });

    return checkIn;
  }
}
```

**Create `src/services/RoundupService.ts`:**

```typescript
export class RoundupService {
  constructor(
    private checkInRepo: CheckInRepository,
    private assignmentRepo: IAssignmentRepository,
    private employeeRepo: IEmployeeRepository,
    private notificationService: INotificationService
  ) {}

  async generateDailyRoundup(date: string): Promise<DailyRoundup> {
    const employees = await this.employeeRepo.getAll();
    const employeeStats: EmployeeRoundupStat[] = [];

    for (const employee of employees) {
      const assignments = await this.assignmentRepo.getByEmployeeId(
        employee.id
      );
      const checkIns = await this.checkInRepo.getByEmployeeId(
        employee.id,
        date,
        date
      );

      const totalTarget = assignments.reduce((sum, a) => sum + a.target, 0);
      const completed = checkIns.length;

      employeeStats.push({
        employeeId: employee.id,
        employeeName: employee.name,
        checkInsCompleted: completed,
        targetCheckIns: totalTarget,
        completionRate: totalTarget > 0 ? (completed / totalTarget) * 100 : 0,
        doctorsVisited: checkIns.map(c => c.doctorId),
      });
    }

    const roundup: DailyRoundup = {
      id: generateId(),
      date,
      employeeStats,
      overallStats: this.calculateOverallStats(employeeStats),
      generatedAt: new Date().toISOString(),
    };

    // Notify admins
    await this.notificationService.notifyAdmins({
      type: 'roundup',
      title: 'Daily Roundup',
      message: `${employeeStats.length} employees, ${roundup.overallStats.totalCheckIns} check-ins`,
      data: { roundup },
    });

    return roundup;
  }

  async scheduleWeeklyRoundup(): Promise<void> {
    // Similar to daily but aggregates 7 days
  }
}
```

### Phase 5: Firebase Integration

**Create `src/services/FirebaseService.ts`:**

```typescript
export class FirebaseService implements IFirebaseService {
  async initialize(): Promise<void> {
    // Initialize Firebase SDK
  }

  async registerDeviceToken(userId: string, token: string): Promise<void> {
    // Store FCM token for user
  }

  async sendPushNotification(
    userId: string,
    notification: Notification
  ): Promise<void> {
    // Send via Firebase Cloud Messaging
  }
}
```

**Install Firebase dependencies:**

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

### Phase 6: Builder Pattern

**Create `src/patterns/AssignmentBuilder.ts`:**

```typescript
export class AssignmentBuilder {
  private assignment: Partial<Assignment> = {
    id: generateId(),
    assignedDate: new Date().toISOString(),
    status: 'active',
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
      throw new Error('Missing required fields');
    }
    return this.assignment as Assignment;
  }
}
```

### Phase 7: Service Container Registration

**Update `src/di/ServiceContainer.ts`:**

```typescript
// Repositories
this.registerSingleton(
  'IAssignmentRepository',
  () => new AssignmentRepository(this.get('IDataRepository'))
);
this.registerSingleton(
  'INotificationRepository',
  () => new NotificationRepository(this.get('IDataRepository'))
);
this.registerSingleton(
  'ICheckInRepository',
  () => new CheckInRepository(this.get('IDataRepository'))
);

// Services
this.registerSingleton('IFirebaseService', () => new FirebaseService());
this.registerSingleton(
  'INotificationService',
  () =>
    new NotificationService(
      this.get('INotificationRepository'),
      this.get('IFirebaseService')
    )
);
this.registerFactory(
  'IAssignmentService',
  () =>
    new AssignmentService(
      this.get('IAssignmentRepository'),
      this.get('INotificationService')
    )
);
this.registerFactory(
  'ICheckInService',
  () =>
    new CheckInService(
      this.get('ICheckInRepository'),
      this.get('IAssignmentRepository'),
      new LocationValidator(),
      this.get('INotificationService')
    )
);
this.registerFactory(
  'IRoundupService',
  () =>
    new RoundupService(
      this.get('ICheckInRepository'),
      this.get('IAssignmentRepository'),
      this.get('IEmployeeRepository'),
      this.get('INotificationService')
    )
);
```

### Phase 8: UI Components

**Admin Assignment Screen** - `src/screens/Admin/AssignDoctors.tsx`

**Employee Notifications Center** - `src/screens/Employee/Notifications.tsx`

**Admin Notifications Log** - `src/screens/Admin/NotificationLog.tsx`

**Admin Roundup Dashboard** - `src/screens/Admin/Roundups.tsx`

**Check-in with Location** - Update `src/screens/Employee/DoctorDetail.tsx`

### Phase 9: Redux Slices

**Create `src/store/slices/notificationSlice.ts`** - Manage notification state

**Create `src/store/slices/assignmentSlice.ts`** - Manage assignment state

**Update `src/store/slices/employeeSlice.ts`** - Add check-in actions

### Phase 10: Scheduled Jobs

**Create `src/services/SchedulerService.ts`:**

```typescript
export class SchedulerService {
  async scheduleDailyRoundup(): Promise<void> {
    // Run at 6 PM daily using expo-task-manager
  }

  async scheduleWeeklyRoundup(): Promise<void> {
    // Run every Monday at 9 AM
  }
}
```

## Summary of Patterns Used

1. **Observer Pattern** - Notification system (Firebase + local observers)
2. **Strategy Pattern** - Location validation (consistent with existing validation)
3. **Builder Pattern** - Assignment creation (clean multi-doctor assignment)
4. **Repository Pattern** - Data access (extends existing architecture)
5. **Factory Pattern** - Service creation via ServiceContainer (already in use)
6. **Dependency Injection** - All services injected (already in use)

## Why These Patterns?

- **Observer**: Decouples notification logic from business logic
- **Strategy**: Consistent with existing validation approach
- **Builder**: Simplifies complex assignment with multiple doctors
- **Repository**: Already implemented - just extend it
- **No over-engineering**: Uses existing patterns, adds minimal new complexity

## Daily/Weekly Roundup Logic (No ML Required)

Simple data aggregation:

1. Count check-ins per employee
2. Calculate completion rate (checkIns / target)
3. Identify top performers (>80% completion)
4. Flag low performers (<50% completion)
5. Calculate trends (compare to previous period)

This is basic arithmetic and filtering - no machine learning needed!

### To-dos

- [ ] Update type definitions for Assignment, Notification, CheckinAttempt, and ActivityRoundup
- [ ] Add repository and service interfaces for assignments, notifications, check-ins, and roundups
- [ ] Implement AssignmentRepository, NotificationRepository, CheckinRepository, and RoundupRepository
- [ ] Create GeolocationService with distance calculation and 50m proximity validation
- [ ] Create FirebaseNotificationService with FCM integration and local notification storage
- [ ] Create CheckinService with location validation and admin notification triggers
- [ ] Create AssignmentService for managing doctor assignments and targets
- [ ] Create RoundupService for generating daily/weekly activity summaries with scheduling
- [ ] Create Redux slices for assignments, notifications, check-ins, and roundups
- [ ] Build UI components for assignments, notifications, check-ins, and roundups
- [ ] Create/update admin screens for assignment management, notification logs, and roundups
- [ ] Create/update employee screens for viewing assignments, notifications, and geolocation check-ins
- [ ] Register all new services and repositories in ServiceContainer
- [ ] Create location, notification, and scheduling utility functions
- [ ] Install dependencies, configure Firebase, and set up Cloud Messaging
