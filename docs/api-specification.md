# Ayska Field App - API Specification

## 🎯 Overview

This document provides the complete API specification for backend developers to implement the Ayska Field App backend. The API follows RESTful principles and uses JWT authentication for secure communication.

## 🏗️ Architecture Requirements

### API Design Principles

- **RESTful API**: Follow REST conventions for endpoints
- **JWT Authentication**: Secure token-based authentication
- **CORS Configuration**: Allow mobile app origins
- **JSON Format**: All requests and responses in JSON
- **Error Handling**: Consistent error response format
- **Rate Limiting**: Implement appropriate rate limits

### Base Configuration

```
Base URL: https://api.ayska.com/v1
Content-Type: application/json
Authentication: Bearer <JWT_TOKEN>
```

## 🔐 Authentication Endpoints

### POST `/api/auth/login`

**Purpose**: User login and token generation

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "employee" // or "admin"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "employee"
    },
    "expiresIn": 3600
  }
}
```

**Response (401):**

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

### POST `/api/auth/logout`

**Purpose**: User logout and token invalidation

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST `/api/auth/refresh`

**Purpose**: Refresh expired JWT token

**Request:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### GET `/api/auth/me`

**Purpose**: Get current user information

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "employee",
    "profile": {
      "avatar": "https://api.ayska.com/avatars/user-123.jpg",
      "phone": "+1234567890",
      "department": "Field Operations"
    }
  }
}
```

## 👨‍💼 Admin Endpoints

### POST `/api/admin/employees`

**Purpose**: Onboard new employee

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**

```json
{
  "email": "employee@example.com",
  "password": "password123",
  "name": "Jane Smith",
  "age": 28,
  "areaOfOperation": "Downtown District",
  "phone": "+1234567890"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "emp-123",
    "email": "employee@example.com",
    "name": "Jane Smith",
    "role": "employee",
    "age": 28,
    "areaOfOperation": "Downtown District",
    "phone": "+1234567890",
    "isFirstLogin": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": "admin-456"
  }
}
```

### GET `/api/admin/employees`

**Purpose**: List all employees with pagination

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by name or email
- `status` (optional): Filter by status (active, inactive)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": "emp-123",
        "email": "employee@example.com",
        "name": "Jane Smith",
        "role": "employee",
        "age": 28,
        "areaOfOperation": "Downtown District",
        "isFirstLogin": false,
        "createdAt": "2024-01-15T10:30:00Z",
        "createdBy": "admin-456"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
}
```

### GET `/api/admin/employees/:id`

**Purpose**: Get specific employee details

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "emp-123",
    "email": "employee@example.com",
    "name": "Jane Smith",
    "role": "employee",
    "age": 28,
    "areaOfOperation": "Downtown District",
    "phone": "+1234567890",
    "isFirstLogin": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": "admin-456",
    "assignments": [
      {
        "id": "assign-123",
        "doctorId": "doc-456",
        "target": 10,
        "currentProgress": 3,
        "status": "active",
        "assignedDate": "2024-01-15T10:30:00Z"
      }
    ],
    "analytics": {
      "totalCheckIns": 15,
      "averageCheckInsPerDay": 2.5,
      "lastCheckIn": "2024-01-20T14:30:00Z",
      "targetAchievementRate": 0.75
    }
  }
}
```

### PUT `/api/admin/employees/:id`

**Purpose**: Update employee information

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**

```json
{
  "name": "Jane Smith Updated",
  "areaOfOperation": "Uptown District",
  "phone": "+1234567890"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "emp-123",
    "email": "employee@example.com",
    "name": "Jane Smith Updated",
    "role": "employee",
    "age": 28,
    "areaOfOperation": "Uptown District",
    "phone": "+1234567890",
    "updatedAt": "2024-01-20T15:30:00Z"
  }
}
```

### POST `/api/admin/doctors`

**Purpose**: Onboard new doctor

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**

```json
{
  "name": "Dr. Sarah Johnson",
  "specialization": "Cardiology",
  "location": {
    "lat": 40.7128,
    "lng": -74.006,
    "address": "123 Medical Center, New York, NY"
  },
  "phone": "+1234567890",
  "age": 45
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "doc-456",
    "name": "Dr. Sarah Johnson",
    "specialization": "Cardiology",
    "location": {
      "lat": 40.7128,
      "lng": -74.006,
      "address": "123 Medical Center, New York, NY"
    },
    "phone": "+1234567890",
    "age": 45,
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": "admin-456"
  }
}
```

### GET `/api/admin/doctors`

**Purpose**: List all doctors

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search by name or specialization
- `specialization` (optional): Filter by specialization

**Response (200):**

```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "id": "doc-456",
        "name": "Dr. Sarah Johnson",
        "specialization": "Cardiology",
        "location": {
          "lat": 40.7128,
          "lng": -74.006,
          "address": "123 Medical Center, New York, NY"
        },
        "phone": "+1234567890",
        "age": 45,
        "createdAt": "2024-01-15T10:30:00Z",
        "createdBy": "admin-456"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
}
```

### POST `/api/admin/assignments`

**Purpose**: Create new assignment

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**

```json
{
  "employeeId": "emp-123",
  "doctorId": "doc-456",
  "target": 10,
  "assignedBy": "admin-456"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "assign-123",
    "employeeId": "emp-123",
    "doctorId": "doc-456",
    "target": 10,
    "currentProgress": 0,
    "assignedDate": "2024-01-15T10:30:00Z",
    "assignedBy": "admin-456",
    "status": "active"
  }
}
```

### GET `/api/admin/assignments`

**Purpose**: List all assignments

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (active, completed, cancelled)
- `employeeId` (optional): Filter by employee
- `doctorId` (optional): Filter by doctor

**Response (200):**

```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "assign-123",
        "employeeId": "emp-123",
        "doctorId": "doc-456",
        "target": 10,
        "currentProgress": 3,
        "assignedDate": "2024-01-15T10:30:00Z",
        "assignedBy": "admin-456",
        "status": "active",
        "employee": {
          "id": "emp-123",
          "name": "Jane Smith",
          "email": "employee@example.com"
        },
        "doctor": {
          "id": "doc-456",
          "name": "Dr. Sarah Johnson",
          "specialization": "Cardiology"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
}
```

### GET `/api/admin/analytics`

**Purpose**: Get analytics dashboard data

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `period` (optional): Time period (daily, weekly, monthly)
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalEmployees": 25,
      "activeEmployees": 20,
      "totalDoctors": 15,
      "totalAssignments": 45,
      "completedAssignments": 30,
      "totalCheckIns": 150
    },
    "employeeAnalytics": [
      {
        "employeeId": "emp-123",
        "employeeName": "Jane Smith",
        "totalAssignments": 5,
        "completedAssignments": 3,
        "totalCheckIns": 15,
        "averageCheckInsPerDay": 2.5,
        "lastCheckIn": "2024-01-20T14:30:00Z",
        "targetAchievementRate": 0.75
      }
    ],
    "checkInTrends": {
      "daily": [
        { "date": "2024-01-20", "count": 8 },
        { "date": "2024-01-19", "count": 12 },
        { "date": "2024-01-18", "count": 6 }
      ],
      "weekly": [
        { "week": "2024-W03", "count": 45 },
        { "week": "2024-W02", "count": 38 },
        { "week": "2024-W01", "count": 42 }
      ]
    }
  }
}
```

### GET `/api/admin/reports`

**Purpose**: Generate reports

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `type` (required): Report type (employee_performance, checkin_summary, assignment_status)
- `format` (optional): Report format (json, csv, pdf)
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "reportId": "report-123",
    "type": "employee_performance",
    "format": "json",
    "generatedAt": "2024-01-20T15:30:00Z",
    "data": [
      {
        "employeeId": "emp-123",
        "employeeName": "Jane Smith",
        "totalAssignments": 5,
        "completedAssignments": 3,
        "totalCheckIns": 15,
        "targetAchievementRate": 0.75,
        "performanceScore": 85
      }
    ]
  }
}
```

## 👷 Employee Endpoints

### GET `/api/employee/assignments`

**Purpose**: Get employee's assignments

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `status` (optional): Filter by status (active, completed, cancelled)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "assign-123",
        "doctorId": "doc-456",
        "target": 10,
        "currentProgress": 3,
        "assignedDate": "2024-01-15T10:30:00Z",
        "status": "active",
        "doctor": {
          "id": "doc-456",
          "name": "Dr. Sarah Johnson",
          "specialization": "Cardiology",
          "location": {
            "lat": 40.7128,
            "lng": -74.006,
            "address": "123 Medical Center, New York, NY"
          },
          "phone": "+1234567890"
        }
      }
    ]
  }
}
```

### POST `/api/employee/checkin`

**Purpose**: Check in at doctor location

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Request:**

```json
{
  "doctorId": "doc-456",
  "assignmentId": "assign-123",
  "location": {
    "lat": 40.7128,
    "lng": -74.006
  },
  "notes": "Successful visit, discussed treatment plan"
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "checkin-123",
    "doctorId": "doc-456",
    "employeeId": "emp-123",
    "assignmentId": "assign-123",
    "timestamp": "2024-01-20T14:30:00Z",
    "location": {
      "lat": 40.7128,
      "lng": -74.006
    },
    "notes": "Successful visit, discussed treatment plan",
    "distanceFromDoctor": 25.5,
    "isValid": true
  }
}
```

### GET `/api/employee/checkin/history`

**Purpose**: Get employee's check-in history

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `startDate` (optional): Start date (ISO 8601)
- `endDate` (optional): End date (ISO 8601)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "checkIns": [
      {
        "id": "checkin-123",
        "doctorId": "doc-456",
        "assignmentId": "assign-123",
        "timestamp": "2024-01-20T14:30:00Z",
        "location": {
          "lat": 40.7128,
          "lng": -74.006
        },
        "notes": "Successful visit, discussed treatment plan",
        "distanceFromDoctor": 25.5,
        "isValid": true,
        "doctor": {
          "id": "doc-456",
          "name": "Dr. Sarah Johnson",
          "specialization": "Cardiology"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    }
  }
}
```

### GET `/api/employee/doctors/:id`

**Purpose**: Get specific doctor details

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "doc-456",
    "name": "Dr. Sarah Johnson",
    "specialization": "Cardiology",
    "location": {
      "lat": 40.7128,
      "lng": -74.006,
      "address": "123 Medical Center, New York, NY"
    },
    "phone": "+1234567890",
    "age": 45,
    "createdAt": "2024-01-15T10:30:00Z",
    "assignments": [
      {
        "id": "assign-123",
        "target": 10,
        "currentProgress": 3,
        "status": "active",
        "assignedDate": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### GET `/api/employee/profile`

**Purpose**: Get employee's profile information

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "emp-123",
    "email": "employee@example.com",
    "name": "Jane Smith",
    "role": "employee",
    "age": 28,
    "areaOfOperation": "Downtown District",
    "phone": "+1234567890",
    "isFirstLogin": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "analytics": {
      "totalAssignments": 5,
      "completedAssignments": 3,
      "totalCheckIns": 15,
      "averageCheckInsPerDay": 2.5,
      "lastCheckIn": "2024-01-20T14:30:00Z",
      "targetAchievementRate": 0.75
    }
  }
}
```

## 🔔 Notification Endpoints

### GET `/api/notifications`

**Purpose**: List notifications for user

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `type` (optional): Filter by type (visit, assignment, attendance, system, alert, checkin, roundup)
- `read` (optional): Filter by read status (true, false)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notif-123",
        "userId": "emp-123",
        "userRole": "employee",
        "type": "assignment",
        "title": "New Assignment",
        "message": "You have been assigned to visit Dr. Sarah Johnson",
        "timestamp": "2024-01-20T10:30:00Z",
        "read": false,
        "actionable": true,
        "actionData": {
          "targetId": "assign-123",
          "route": "/employee/assignments",
          "assignmentId": "assign-123"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "pages": 1
    },
    "unreadCount": 5
  }
}
```

### PUT `/api/notifications/:id/read`

**Purpose**: Mark notification as read

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### GET `/api/notifications/:id`

**Purpose**: Get specific notification details

**Headers:**

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "notif-123",
    "userId": "emp-123",
    "userRole": "employee",
    "type": "assignment",
    "title": "New Assignment",
    "message": "You have been assigned to visit Dr. Sarah Johnson",
    "timestamp": "2024-01-20T10:30:00Z",
    "read": false,
    "actionable": true,
    "actionData": {
      "targetId": "assign-123",
      "route": "/employee/assignments",
      "assignmentId": "assign-123"
    }
  }
}
```

## 📊 Data Models

### User Models

```typescript
interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
}

interface Employee {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'employee';
  age: number;
  areaOfOperation: string;
  isFirstLogin: boolean;
  createdAt: string;
  createdBy: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  location: Location;
  phone?: string;
  age: number;
  createdAt: string;
  createdBy: string;
}
```

### Business Models

```typescript
interface Assignment {
  id: string;
  employeeId: string;
  doctorId: string;
  target: number;
  currentProgress: number;
  assignedDate: string;
  assignedBy: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface CheckIn {
  id: string;
  doctorId: string;
  employeeId: string;
  assignmentId: string;
  timestamp: string;
  location: Location;
  notes?: string;
  distanceFromDoctor: number;
  isValid: boolean;
}

interface Notification {
  id: string;
  userId: string;
  userRole: 'admin' | 'employee';
  type:
    | 'visit'
    | 'assignment'
    | 'attendance'
    | 'system'
    | 'alert'
    | 'checkin'
    | 'roundup';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  actionData?: {
    targetId?: string;
    route?: string;
    visitId?: string;
    employeeId?: string;
    doctorId?: string;
    attendanceId?: string;
    assignmentId?: string;
  };
}
```

### Utility Models

```typescript
interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface EmployeeAnalytics {
  employeeId: string;
  totalAssignments: number;
  completedAssignments: number;
  totalCheckIns: number;
  averageCheckInsPerDay: number;
  lastCheckIn: string | null;
  targetAchievementRate: number;
}
```

## 🚨 Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  }
}
```

### HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **422**: Unprocessable Entity
- **500**: Internal Server Error

### Common Error Codes

- **INVALID_CREDENTIALS**: Invalid email or password
- **TOKEN_EXPIRED**: JWT token has expired
- **TOKEN_INVALID**: JWT token is invalid
- **ACCESS_DENIED**: Insufficient permissions
- **VALIDATION_ERROR**: Request validation failed
- **RESOURCE_NOT_FOUND**: Requested resource not found
- **DUPLICATE_RESOURCE**: Resource already exists
- **RATE_LIMIT_EXCEEDED**: Too many requests
- **SERVER_ERROR**: Internal server error

## 🔐 Authentication Flow

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-123",
    "email": "user@example.com",
    "role": "employee",
    "iat": 1640995200,
    "exp": 1640998800
  }
}
```

### Token Refresh Flow

1. Client sends refresh token to `/api/auth/refresh`
2. Server validates refresh token
3. Server issues new JWT token
4. Client updates stored token
5. Client continues with new token

### Unauthorized Handling

1. Server returns 401 status
2. Client clears stored tokens
3. Client redirects to login screen
4. User must re-authenticate

## 📱 Mobile App Integration

### Request Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
User-Agent: AyskaFieldApp/1.0.0
```

### Response Handling

- Always check `success` field in response
- Handle error responses gracefully
- Implement retry logic for network errors
- Cache responses when appropriate

### Offline Support

- Cache critical data locally
- Queue requests when offline
- Sync when connection restored
- Handle network timeouts

## 🗄️ Database Schema (Recommended)

### Users Table

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') NOT NULL,
  age INT,
  area_of_operation VARCHAR(255),
  phone VARCHAR(20),
  is_first_login BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Doctors Table

```sql
CREATE TABLE doctors (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  location_address TEXT,
  phone VARCHAR(20),
  age INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(36)
);
```

### Assignments Table

```sql
CREATE TABLE assignments (
  id VARCHAR(36) PRIMARY KEY,
  employee_id VARCHAR(36) NOT NULL,
  doctor_id VARCHAR(36) NOT NULL,
  target INT NOT NULL,
  current_progress INT DEFAULT 0,
  assigned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by VARCHAR(36) NOT NULL,
  status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (assigned_by) REFERENCES users(id)
);
```

### Check-ins Table

```sql
CREATE TABLE check_ins (
  id VARCHAR(36) PRIMARY KEY,
  doctor_id VARCHAR(36) NOT NULL,
  employee_id VARCHAR(36) NOT NULL,
  assignment_id VARCHAR(36) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  notes TEXT,
  distance_from_doctor DECIMAL(10, 2),
  is_valid BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (employee_id) REFERENCES users(id),
  FOREIGN KEY (assignment_id) REFERENCES assignments(id)
);
```

### Notifications Table

```sql
CREATE TABLE notifications (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  user_role ENUM('admin', 'employee') NOT NULL,
  type ENUM('visit', 'assignment', 'attendance', 'system', 'alert', 'checkin', 'roundup') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE,
  actionable BOOLEAN DEFAULT FALSE,
  action_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔗 Next Steps

1. **Set up the database** using the recommended schema
2. **Implement authentication** with JWT tokens
3. **Create the API endpoints** following the specifications
4. **Add validation** for all request/response data
5. **Implement error handling** with proper HTTP status codes
6. **Add rate limiting** and security measures
7. **Test the API** with the mobile app
8. **Deploy to production** with proper monitoring

---

**Remember**: This API specification is the contract between the mobile app and backend. Follow it precisely to ensure seamless integration! 🚀
