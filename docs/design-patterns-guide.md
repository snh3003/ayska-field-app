# Ayska Field App - Design Patterns Guide

## 🎯 Overview

Design patterns are like **blueprints for building houses** - they provide proven solutions to common problems. This guide explains WHY we use each pattern, WHAT it does, and WHERE to apply it in our Ayska Field App.

## 🏗️ Dependency Injection (Container Pattern)

### Why We Use It

Think of dependency injection like a **smart restaurant kitchen** - instead of each chef bringing their own ingredients, the kitchen provides everything they need. This makes the kitchen flexible, testable, and easy to maintain.

**Benefits:**

- **Loose Coupling**: Components don't depend on specific implementations
- **Testability**: Easy to swap real services with mocks
- **Flexibility**: Change implementations without breaking code

### What It Does

Our `ServiceContainer` is like a **smart vending machine** that knows exactly what each service needs:

```typescript
// Like stocking a vending machine with different snacks
export class ServiceContainer {
  private services = new Map<string, any>();
  private factories = new Map<string, () => any>();

  // Register services (like stocking the machine)
  registerSingleton('IAuthStorage', () =>
    new AuthStorageService(this.get('IStorageProvider'))
  );

  // Get services (like pressing a button for a snack)
  get<T>(token: string): T {
    const factory = this.factories.get(token);
    if (!factory) {
      throw new Error(`Service ${token} not registered`);
    }
    return factory();
  }
}
```

### Where We Use It

**Everywhere!** Like having electricity in every room of your house:

```typescript
// In Redux thunks (like getting power to your appliances)
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (_, thunkAPI) => {
    const service = thunkAPI.extra.serviceContainer.get('IEmployeeService');
    return service.getEmployees();
  }
);

// In components (like plugging in a device)
const LoginScreen = () => {
  const authService = serviceContainer.get('IAuthService');
  // Use the service
};
```

### Real Example: Adding a New Service

```typescript
// 1. Define the interface (like writing a job description)
interface ITeamsService {
  getTeams(): Promise<Team[]>;
  createTeam(team: Team): Promise<Team>;
}

// 2. Implement the service (like hiring someone for the job)
class TeamsService implements ITeamsService {
  constructor(private teamsRepo: ITeamsRepository) {}

  async getTeams(): Promise<Team[]> {
    return this.teamsRepo.getAll();
  }
}

// 3. Register in container (like adding to the company directory)
this.registerSingleton(
  'ITeamsService',
  () => new TeamsService(this.get('ITeamsRepository'))
);
```

## 🗄️ Repository Pattern

### Why We Use It

Think of repositories like **librarians** - they know exactly where to find books, how to organize them, and how to retrieve them. The rest of the app doesn't need to know about the library's internal organization.

**Benefits:**

- **Separation of Concerns**: Business logic doesn't know about data storage
- **Testability**: Easy to mock data access
- **Flexibility**: Can switch from local storage to API without changing business logic

### What It Does

Repositories are like **data butlers** - they handle all the messy details of data access:

```typescript
// Interface (like a contract for a butler)
interface IAuthRepository {
  saveToken(token: string): Promise<void>;
  getToken(): Promise<string | null>;
  clearToken(): Promise<void>;
}

// Implementation (like the actual butler)
class AuthRepository implements IAuthRepository {
  constructor(private storage: IStorageProvider) {}

  async saveToken(token: string): Promise<void> {
    await this.storage.setItem('auth_token', token);
  }

  async getToken(): Promise<string | null> {
    return this.storage.getItem('auth_token');
  }
}
```

### Where We Use It

**All data operations** - like having a butler for every type of data:

```typescript
// Authentication data
const authRepo = serviceContainer.get('IAuthRepository');
await authRepo.saveToken(token);

// Employee data
const employeeRepo = serviceContainer.get('IEmployeeRepository');
const employees = await employeeRepo.getAll();

// Assignment data
const assignmentRepo = serviceContainer.get('IAssignmentRepository');
const assignment = await assignmentRepo.create(assignmentData);
```

### Real Example: Creating a New Repository

```typescript
// 1. Define the interface (like writing a job description for a butler)
interface ITeamsRepository {
  getTeams(): Promise<Team[]>;
  getTeamById(id: string): Promise<Team | null>;
  createTeam(team: Team): Promise<Team>;
  updateTeam(id: string, team: Team): Promise<Team>;
  deleteTeam(id: string): Promise<void>;
}

// 2. Implement the repository (like training the butler)
class TeamsRepository implements ITeamsRepository {
  constructor(private dataRepo: LocalDataRepository<any>) {}

  async getTeams(): Promise<Team[]> {
    return this.dataRepo.getAll('teams');
  }

  async getTeamById(id: string): Promise<Team | null> {
    return this.dataRepo.getById('teams', id);
  }

  async createTeam(team: Team): Promise<Team> {
    return this.dataRepo.create('teams', team);
  }
}

// 3. Register in container (like adding to the staff directory)
this.registerSingleton(
  'ITeamsRepository',
  () => new TeamsRepository(this.get('IDataRepository'))
);
```

## 🎯 Strategy Pattern

### Why We Use It

Think of the strategy pattern like **different tools for different jobs** - you wouldn't use a hammer to cut wood, or a saw to drive nails. Each validation strategy is a specialized tool for a specific type of validation.

**Benefits:**

- **Flexibility**: Easy to add new validation rules
- **Maintainability**: Each validator has one responsibility
- **Testability**: Can test each validator independently

### What It Does

Strategies are like **specialized workers** - each one knows how to do one thing really well:

```typescript
// Strategy interface (like a job description for validators)
interface IValidationStrategy {
  validate(value: any): ValidationResult;
}

// Required field validator (like a security guard checking IDs)
class RequiredValidator implements IValidationStrategy {
  constructor(private message: string = 'This field is required') {}

  validate(value: any): ValidationResult {
    if (!value || value.toString().trim() === '') {
      return { isValid: false, error: this.message };
    }
    return { isValid: true };
  }
}

// Email validator (like a mail sorter checking addresses)
class EmailValidator implements IValidationStrategy {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(value: any): ValidationResult {
    if (!this.emailRegex.test(value)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    return { isValid: true };
  }
}
```

### Where We Use It

**Form validation** - like having quality control inspectors for different types of data:

```typescript
// Form validation (like having multiple inspectors)
const validationRules = {
  email: [new RequiredValidator('Email is required'), new EmailValidator()],
  password: [
    new RequiredValidator('Password is required'),
    new MinLengthValidator(6, 'Password must be at least 6 characters'),
  ],
  location: [
    new RequiredValidator('Location is required'),
    new ProximityValidator(doctorLocation, 100), // Within 100 meters
  ],
};
```

### Real Example: Adding a New Validator

```typescript
// 1. Create the validator (like training a new inspector)
class PhoneNumberValidator implements IValidationStrategy {
  private phoneRegex = /^\+?[\d\s\-\(\)]+$/;

  validate(value: any): ValidationResult {
    if (!this.phoneRegex.test(value)) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }
    return { isValid: true };
  }
}

// 2. Use in validation rules (like assigning the inspector to a station)
const validationRules = {
  phone: [
    new RequiredValidator('Phone number is required'),
    new PhoneNumberValidator(),
  ],
};
```

## 👀 Observer Pattern

### Why We Use It

Think of the observer pattern like a **newsletter system** - when something important happens, all subscribers get notified automatically. This keeps everything in sync without tight coupling.

**Benefits:**

- **Loose Coupling**: Observers don't know about each other
- **Flexibility**: Easy to add/remove observers
- **Scalability**: Can have many observers for one subject

### What It Does

Observers are like **subscribers to a newsletter** - they get notified when something interesting happens:

```typescript
// Subject interface (like a newsletter publisher)
interface INotificationSubject {
  attach(observer: INotificationObserver): void;
  detach(observer: INotificationObserver): void;
  notify(event: NotificationEvent): void;
}

// Observer interface (like a newsletter subscriber)
interface INotificationObserver {
  update(event: NotificationEvent): void;
}

// Concrete subject (like the actual newsletter publisher)
class NotificationObserverService implements INotificationSubject {
  private observers: INotificationObserver[] = [];

  attach(observer: INotificationObserver): void {
    this.observers.push(observer);
  }

  notify(event: NotificationEvent): void {
    this.observers.forEach(observer => observer.update(event));
  }
}
```

### Where We Use It

**Notifications** - like having a town crier who announces important news:

```typescript
// Admin dashboard observer (like a manager who needs to know everything)
class AdminDashboardObserver implements INotificationObserver {
  update(event: NotificationEvent): void {
    if (event.type === 'checkin' || event.type === 'assignment') {
      // Update admin dashboard
      this.updateDashboard(event);
    }
  }
}

// Employee feed observer (like an employee who needs to know about their tasks)
class EmployeeFeedObserver implements INotificationObserver {
  update(event: NotificationEvent): void {
    if (event.employeeId === this.employeeId) {
      // Update employee feed
      this.updateFeed(event);
    }
  }
}
```

### Real Example: Adding a New Observer

```typescript
// 1. Create the observer (like subscribing to a newsletter)
class AnalyticsObserver implements INotificationObserver {
  update(event: NotificationEvent): void {
    // Track analytics events
    this.trackEvent(event.type, event.data);
  }

  private trackEvent(type: string, data: any): void {
    // Send to analytics service
    analytics.track(type, data);
  }
}

// 2. Attach to subject (like subscribing to the newsletter)
const notificationSubject = serviceContainer.get('INotificationSubject');
notificationSubject.attach(new AnalyticsObserver());
```

## 🏗️ Builder Pattern

### Why We Use It

Think of the builder pattern like **building a custom pizza** - you start with a base and add ingredients step by step. Each step is optional, and you can build complex objects without a confusing constructor.

**Benefits:**

- **Flexibility**: Can build objects with different combinations of properties
- **Readability**: Code is self-documenting
- **Maintainability**: Easy to add new optional properties

### What It Does

Builders are like **custom pizza makers** - they know how to build complex objects step by step:

```typescript
// Builder interface (like a pizza order form)
interface IAssignmentBuilder {
  setEmployee(employeeId: string): IAssignmentBuilder;
  setDoctor(doctorId: string): IAssignmentBuilder;
  setTarget(target: number): IAssignmentBuilder;
  setAssignedBy(adminId: string): IAssignmentBuilder;
  build(): Assignment;
}

// Concrete builder (like the actual pizza maker)
class AyskaAssignmentBuilderPattern implements IAssignmentBuilder {
  private assignment: Partial<Assignment> = {};

  setEmployee(employeeId: string): IAssignmentBuilder {
    this.assignment.employeeId = employeeId;
    return this;
  }

  setDoctor(doctorId: string): IAssignmentBuilder {
    this.assignment.doctorId = doctorId;
    return this;
  }

  setTarget(target: number): IAssignmentBuilder {
    this.assignment.target = target;
    return this;
  }

  build(): Assignment {
    return {
      id: generateId(),
      ...this.assignment,
      currentProgress: 0,
      assignedDate: new Date().toISOString(),
      status: 'active',
    } as Assignment;
  }
}
```

### Where We Use It

**Complex object creation** - like building a custom car with many optional features:

```typescript
// Building an assignment (like building a custom car)
const assignment = new AyskaAssignmentBuilderPattern()
  .setEmployee('emp-123')
  .setDoctor('doc-456')
  .setTarget(10)
  .setAssignedBy('admin-789')
  .build();
```

### Real Example: Adding a New Builder

```typescript
// 1. Create the builder (like designing a new pizza)
class TeamBuilder implements ITeamBuilder {
  private team: Partial<Team> = {};

  setName(name: string): ITeamBuilder {
    this.team.name = name;
    return this;
  }

  setDescription(description: string): ITeamBuilder {
    this.team.description = description;
    return this;
  }

  setMembers(members: string[]): ITeamBuilder {
    this.team.members = members;
    return this;
  }

  build(): Team {
    return {
      id: generateId(),
      ...this.team,
      createdAt: new Date().toISOString(),
      createdBy: getCurrentUserId(),
    } as Team;
  }
}

// 2. Use the builder (like ordering a custom pizza)
const team = new TeamBuilder()
  .setName('Development Team')
  .setDescription('Frontend development team')
  .setMembers(['emp-1', 'emp-2', 'emp-3'])
  .build();
```

## 🏭 Factory Pattern

### Why We Use It

Think of the factory pattern like a **smart manufacturing plant** - you tell it what you need, and it produces the right product. The factory handles all the complexity of creation.

**Benefits:**

- **Encapsulation**: Creation logic is hidden
- **Flexibility**: Easy to add new product types
- **Consistency**: All products are created the same way

### What It Does

Factories are like **smart manufacturing machines** - they know how to create different types of objects:

```typescript
// Factory interface (like a manufacturing order)
interface IMapProvider {
  getMapComponent(): React.ComponentType;
  getDirections(origin: Location, destination: Location): Promise<Directions>;
}

// Google Maps factory (like a Google Maps machine)
class GoogleMapProvider implements IMapProvider {
  getMapComponent(): React.ComponentType {
    return GoogleMap;
  }

  getDirections(origin: Location, destination: Location): Promise<Directions> {
    return GoogleMapsAPI.getDirections(origin, destination);
  }
}

// Mappls factory (like a Mappls machine)
class MapplsMapProvider implements IMapProvider {
  getMapComponent(): React.ComponentType {
    return MapplsMap;
  }

  getDirections(origin: Location, destination: Location): Promise<Directions> {
    return MapplsAPI.getDirections(origin, destination);
  }
}
```

### Where We Use It

**Conditional object creation** - like choosing the right tool for the job:

```typescript
// Map provider factory (like choosing the right map service)
this.registerFactory('IMapProvider', () => {
  return MapsConfig.provider === 'google'
    ? new GoogleMapProvider()
    : new MapplsMapProvider();
});

// HTTP client factory (like choosing the right communication method)
this.registerFactory('IHttpClient', () => {
  const client = new HttpClient('', 15000);
  client.addInterceptor(new AuthInterceptor());
  client.addInterceptor(new RetryInterceptor());
  return client;
});
```

### Real Example: Adding a New Factory

```typescript
// 1. Create the factory (like building a new manufacturing machine)
class NotificationFactory {
  static create(type: NotificationType): INotificationService {
    switch (type) {
      case 'push':
        return new PushNotificationService();
      case 'email':
        return new EmailNotificationService();
      case 'sms':
        return new SmsNotificationService();
      default:
        throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

// 2. Use the factory (like ordering from the factory)
const notificationService = NotificationFactory.create('push');
await notificationService.send(notification);
```

## 🎯 Pattern Summary

| Pattern                  | Why Use It                       | What It Does                        | Where We Use It             |
| ------------------------ | -------------------------------- | ----------------------------------- | --------------------------- |
| **Dependency Injection** | Loose coupling, testability      | Manages service dependencies        | All service instantiation   |
| **Repository**           | Data access separation           | Handles data operations             | All data access             |
| **Strategy**             | Flexible validation              | Encapsulates algorithms             | Form validation             |
| **Observer**             | Loose coupling for notifications | Notifies multiple objects           | Push notifications          |
| **Builder**              | Complex object creation          | Builds objects step by step         | Assignment creation         |
| **Factory**              | Conditional object creation      | Creates objects based on conditions | Map providers, HTTP clients |

## 🚨 Common Pattern Mistakes

### 1. Not Using Interfaces

```typescript
// ❌ Bad: Concrete dependency
class AuthService {
  constructor(private authRepo: AuthRepository) {}
}

// ✅ Good: Interface dependency
class AuthService {
  constructor(private authRepo: IAuthRepository) {}
}
```

### 2. Direct Instantiation

```typescript
// ❌ Bad: Direct instantiation
const authService = new AuthService(authRepo);

// ✅ Good: Dependency injection
const authService = serviceContainer.get('IAuthService');
```

### 3. Missing Strategy Pattern

```typescript
// ❌ Bad: If/else validation
if (field === 'email') {
  if (!emailRegex.test(value)) return 'Invalid email';
} else if (field === 'phone') {
  if (!phoneRegex.test(value)) return 'Invalid phone';
}

// ✅ Good: Strategy pattern
const validator = validationRules[field];
return validator.validate(value);
```

## 🔗 Next Steps

- Read the [Developer Guide](./dev-guide.md) to understand the overall architecture
- Check the [Data Flow Guide](./data-flow-guide.md) to see patterns in action
- Review the [UI Best Practices](./ui-best-practices.md) for component patterns

---

**Remember**: Design patterns are like **proven recipes** - they've been tested by many chefs and produce consistent, high-quality results. Follow the patterns, and your code will be maintainable, testable, and scalable! 🏗️
