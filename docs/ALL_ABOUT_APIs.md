# Ayska Field App - API Integration Documentation v1.0

## 📋 Quick Start Guide

### Base URLs

- **Local Development**: `http://localhost:8000`
- **API Base**: `http://localhost:8000/api/v1`
- **Swagger Documentation**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/health`

### Authentication Overview

- **Type**: JWT Bearer Token
- **Expiration**: 90 days (3 months)
- **Auto-logout**: Token blacklisted on logout
- **Role-based**: Admin and Employee roles

### Required Headers

```javascript
// For all authenticated requests
{
  "Authorization": "Bearer eyJhbGc...",
  "Content-Type": "application/json"
}
```

### Dev Mode vs Production

- **Dev Mode**: OTP printed to console, no actual email sending
- **Production**: OTP sent via SendGrid, real email delivery
- **Environment**: Controlled by `EMAIL_DEV_MODE` setting

---

## 🔐 Authentication Flow

### Step-by-Step Login Process

#### 1. Request OTP

```javascript
// User enters email/phone
const response = await fetch('http://localhost:8000/api/v1/auth/otp/request', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    identifier: 'alice@field.co'  // Email or phone
  })
});

// Success Response
{
  "message": "OTP sent successfully"
}
```

#### 2. Verify OTP & Get JWT

```javascript
// User enters OTP code
const response = await fetch('http://localhost:8000/api/v1/auth/otp/verify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    identifier: 'alice@field.co',
    otp: '123456'
  })
});

// Success Response
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 7776000,
  "user": {
    "id": "e1",
    "name": "Alice",
    "email": "alice@field.co",
    "phone": "+91-9876543210",
    "role": "employee"  // or "admin"
  }
}
```

#### 3. Store JWT Token

```javascript
// Store token securely
localStorage.setItem('auth_token', response.access_token);
localStorage.setItem('user_info', JSON.stringify(response.user));

// Use token in subsequent requests
const token = localStorage.getItem('auth_token');
```

#### 4. Use JWT in Requests

```javascript
// All authenticated requests
const response = await fetch('http://localhost:8000/api/v1/admin/employees', {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

#### 5. Handle Token Expiration

```javascript
// Check if token is expired
const tokenData = JSON.parse(atob(token.split('.')[1]));
const isExpired = Date.now() >= tokenData.exp * 1000;

if (isExpired) {
  // Redirect to login
  window.location.href = '/login';
}
```

#### 6. Logout Flow

```javascript
// Logout user
const response = await fetch('http://localhost:8000/api/v1/auth/logout', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Clear local storage
localStorage.removeItem('auth_token');
localStorage.removeItem('user_info');
```

---

## 📊 HTTP Status Codes

| Code | Status                | Description              | Action                  |
| ---- | --------------------- | ------------------------ | ----------------------- |
| 200  | OK                    | Request successful       | Continue                |
| 201  | Created               | Resource created         | Show success message    |
| 400  | Bad Request           | Invalid input/OTP        | Show error message      |
| 401  | Unauthorized          | Invalid/missing token    | Redirect to login       |
| 403  | Forbidden             | Insufficient permissions | Show access denied      |
| 404  | Not Found             | Resource not found       | Show not found message  |
| 422  | Unprocessable Entity  | Validation error         | Show field errors       |
| 429  | Too Many Requests     | Rate limited             | Show rate limit message |
| 500  | Internal Server Error | Server error             | Show generic error      |

---

## 🚨 Error Response Format

### Standard Error Structure

```json
{
  "error": "error_code",
  "message": "User-friendly message",
  "status": 400
}
```

### Common Error Codes

| Error Code                | Message                                                                           | Status | Action                                             |
| ------------------------- | --------------------------------------------------------------------------------- | ------ | -------------------------------------------------- |
| `user_not_found`          | "Account not found. Contact your admin."                                          | 404    | Show message, suggest contacting admin             |
| `account_inactive`        | "Account deactivated. Contact your admin."                                        | 403    | Show message, suggest contacting admin             |
| `email_send_failed`       | "Failed to send OTP. Try again."                                                  | 500    | Show message, allow retry                          |
| `invalid_otp`             | "Incorrect OTP. Try again."                                                       | 400    | Show message, allow retry                          |
| `otp_not_found`           | "OTP not found. Request a new one."                                               | 400    | Show message, redirect to request OTP              |
| `otp_expired`             | "OTP expired. Request a new one."                                                 | 400    | Show message, redirect to request OTP              |
| `too_many_attempts`       | "Too many attempts. Request new OTP."                                             | 400    | Show message, redirect to request OTP              |
| `employee_not_found`      | "Employee not found."                                                             | 404    | Show message, redirect to list                     |
| `duplicate_employee`      | "Email or phone already exists."                                                  | 400    | Show message, highlight duplicate field            |
| `duplicate_contact`       | "Email or phone already in use."                                                  | 400    | Show message, highlight duplicate field            |
| `employee_already_active` | "Employee is already active."                                                     | 400    | Show message, disable button                       |
| `doctor_not_found`        | "Doctor not found."                                                               | 404    | Show message, redirect to list                     |
| `duplicate_doctor_phone`  | "Doctor with this phone number already exists."                                   | 400    | Show message, highlight duplicate field            |
| `assignment_not_found`    | "Assignment not found."                                                           | 404    | Show message, redirect to list                     |
| `assignment_exists`       | "Active assignment already exists for this employee-doctor pair."                 | 400    | Show message, suggest updating existing assignment |
| `invalid_target`          | "Target cannot be less than current progress."                                    | 400    | Show message, allow correction                     |
| `invalid_progress`        | "Progress cannot exceed target."                                                  | 400    | Show message, allow correction                     |
| `invalid_status_change`   | "Cannot reactivate completed assignment."                                         | 400    | Show message, explain restriction                  |
| `notification_not_found`  | "Notification not found."                                                         | 404    | Show message, refresh list                         |
| `invalid_report_type`     | "Invalid report type. Must be one of: performance, assignments, checkins, system" | 400    | Show message, list valid types                     |
| `invalid_data_type`       | "Invalid data type. Must be one of: employees, assignments, checkins"             | 400    | Show message, list valid types                     |

---

## ✅ Implemented Endpoints

### Root Endpoint

**Endpoint**: `GET /`
**Description**: API root with basic information
**Auth Required**: No

**Response**:

```json
{
  "message": "Welcome to Ayska Field App API",
  "docs": "/docs",
  "health": "/health"
}
```

---

### Health Check

**Endpoint**: `GET /health`
**Description**: API health status
**Auth Required**: No

**Response**:

```json
{
  "status": "healthy",
  "message": "Ayska Field App API is running",
  "version": "1.0.0",
  "environment": "development"
}
```

---

### Authentication Endpoints

#### 1. Request OTP

**Endpoint**: `POST /api/v1/auth/otp/request`
**Description**: Request OTP code for login (auto-detects role)
**Auth Required**: No

**Request**:

```json
{
  "identifier": "alice@field.co" // Email or phone
}
```

**Success Response** (200):

```json
{
  "message": "OTP sent successfully"
}
```

**Error Responses**:

- 404: User not found
- 403: Account inactive
- 500: Email send failed

**curl Example**:

```bash
curl -X POST "http://localhost:8000/api/v1/auth/otp/request" \
  -H "Content-Type: application/json" \
  -d '{"identifier": "alice@field.co"}'
```

**JavaScript Example**:

```javascript
const response = await fetch('http://localhost:8000/api/v1/auth/otp/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identifier: 'alice@field.co' }),
});
```

---

#### 2. Verify OTP & Login

**Endpoint**: `POST /api/v1/auth/otp/verify`
**Description**: Verify OTP and get JWT token (auto-detects role)
**Auth Required**: No

**Request**:

```json
{
  "identifier": "alice@field.co",
  "otp": "123456"
}
```

**Success Response** (200):

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 7776000,
  "user": {
    "id": "e1",
    "name": "Alice",
    "email": "alice@field.co",
    "phone": "+91-9876543210",
    "role": "employee"
  }
}
```

**Error Responses**:

- 400: Invalid/expired OTP, too many attempts
- 404: User not found

---

#### 3. Get Profile

**Endpoint**: `GET /api/v1/auth/profile`
**Description**: Get current user profile
**Auth Required**: Yes (JWT token)

**Success Response** (200):

```json
{
  "id": "e1",
  "email": "alice@field.co",
  "phone": "+91-9876543210",
  "name": "Alice",
  "role": "employee",
  "is_active": true,
  "age": 28,
  "area_of_operation": "North Delhi",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z",
  "created_by": "a1234567"
}
```

---

#### 4. Logout

**Endpoint**: `POST /api/v1/auth/logout`
**Description**: Logout user (blacklist token)
**Auth Required**: Yes (JWT token)

**Success Response** (200):

```json
{
  "message": "Logged out successfully"
}
```

---

#### 5. Create Admin (Protected)

**Endpoint**: `POST /api/v1/auth/admin/create`
**Description**: Create new admin account (X-Admin-Token required)
**Auth Required**: X-Admin-Token header

**Request Headers**:

```
X-Admin-Token: HE_IS_FLYING
```

**Request**:

```json
{
  "email": "newadmin@ayska.co",
  "phone": "+91-9876543210",
  "name": "New Admin"
}
```

**Success Response** (201):

```json
{
  "message": "Admin created successfully. OTP sent to email for first login.",
  "admin_id": "a1234567",
  "email": "newadmin@ayska.co"
}
```

---

### Employee Management Endpoints (Admin Only)

#### 1. Create Employee

**Endpoint**: `POST /api/v1/admin/employees`
**Description**: Create new employee
**Auth Required**: Yes (Admin JWT token)

**Request**:

```json
{
  "email": "newemployee@field.co",
  "phone": "+91-9876543210",
  "name": "New Employee",
  "age": 25,
  "area_of_operation": "North Delhi"
}
```

**Success Response** (201):

```json
{
  "message": "Employee created successfully. Welcome email sent.",
  "employee_id": "e1234567",
  "email": "newemployee@field.co"
}
```

**Error Responses**:

- 400: Duplicate email/phone
- 401: Unauthorized
- 422: Validation error

---

#### 2. List Employees

**Endpoint**: `GET /api/v1/admin/employees`
**Description**: List employees with search and pagination
**Auth Required**: Yes (Admin JWT token)

**Query Parameters**:

- `page` (int): Page number (default: 1)
- `size` (int): Page size (default: 10, max: 100)
- `search` (string): Search by name, email, or phone
- `include_inactive` (bool): Include inactive employees (default: false)

**Success Response** (200):

```json
{
  "employees": [
    {
      "id": "e1",
      "email": "alice@field.co",
      "phone": "+91-9876543210",
      "name": "Alice",
      "role": "employee",
      "is_active": true,
      "age": 28,
      "area_of_operation": "North Delhi",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z",
      "created_by": "a1234567"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10,
  "has_next": false
}
```

---

#### 3. Get Employee

**Endpoint**: `GET /api/v1/admin/employees/{id}`
**Description**: Get employee details
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200): Same as employee object in list
**Error Responses**:

- 404: Employee not found
- 401: Unauthorized

---

#### 4. Update Employee

**Endpoint**: `PUT /api/v1/admin/employees/{id}`
**Description**: Update employee information
**Auth Required**: Yes (Admin JWT token)

**Request** (partial update):

```json
{
  "name": "Alice Updated",
  "age": 29,
  "area_of_operation": "South Delhi"
}
```

**Success Response** (200): Updated employee object
**Error Responses**:

- 404: Employee not found
- 400: Duplicate email/phone
- 401: Unauthorized

---

#### 5. Delete Employee

**Endpoint**: `DELETE /api/v1/admin/employees/{id}`
**Description**: Delete employee (soft or hard)
**Auth Required**: Yes (Admin JWT token)

**Query Parameters**:

- `permanent` (bool): Hard delete (default: false)

**Success Response** (200):

```json
{
  "message": "Employee soft deleted successfully",
  "employee_id": "e1234567",
  "permanent": false
}
```

**Error Responses**:

- 404: Employee not found
- 401: Unauthorized

---

#### 6. Reactivate Employee

**Endpoint**: `POST /api/v1/admin/employees/{id}/reactivate`
**Description**: Reactivate soft-deleted employee
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200):

```json
{
  "message": "Employee reactivated successfully",
  "employee_id": "e1234567"
}
```

**Error Responses**:

- 404: Employee not found
- 400: Employee already active
- 401: Unauthorized

---

### Doctor Management Endpoints (Admin Only)

#### 1. Create Doctor

**Endpoint**: `POST /api/v1/admin/doctors`
**Description**: Create new doctor with location
**Auth Required**: Yes (Admin JWT token)

**Request**:

```json
{
  "name": "Dr. Smith",
  "specialization": "Cardiology",
  "age": 45,
  "phone": "+91-9876543210",
  "location_lat": 28.6139,
  "location_lng": 77.209,
  "location_address": "123 Medical St, New Delhi, India"
}
```

**Success Response** (201):

```json
{
  "message": "Doctor created successfully",
  "doctor_id": "d1234567",
  "name": "Dr. Smith",
  "specialization": "Cardiology"
}
```

**Error Responses**:

- 400: Duplicate email/phone
- 401: Unauthorized
- 422: Validation error

---

#### 2. List Doctors

**Endpoint**: `GET /api/v1/admin/doctors`
**Description**: List doctors with search and pagination
**Auth Required**: Yes (Admin JWT token)

**Query Parameters**:

- `page` (int): Page number (default: 1)
- `size` (int): Page size (default: 10, max: 100)
- `search` (string): Search by name or specialization
- `specialization` (string): Filter by specialization

**Success Response** (200):

```json
{
  "doctors": [
    {
      "id": "d1",
      "name": "Dr. Smith",
      "specialization": "Cardiology",
      "phone": "+91-9876543210",
      "email": "dr.smith@hospital.com",
      "age": 45,
      "location_lat": 28.6139,
      "location_lng": 77.209,
      "location_address": "123 Medical St, New Delhi, India",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z",
      "created_by": "a1234567"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10,
  "has_next": false
}
```

---

#### 3. Get Doctor

**Endpoint**: `GET /api/v1/admin/doctors/{id}`
**Description**: Get doctor details
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200): Same as doctor object in list
**Error Responses**:

- 404: Doctor not found
- 401: Unauthorized

---

#### 4. Update Doctor

**Endpoint**: `PUT /api/v1/admin/doctors/{id}`
**Description**: Update doctor information
**Auth Required**: Yes (Admin JWT token)

**Request** (partial update):

```json
{
  "name": "Dr. John Smith",
  "phone": "+91-9876543211"
}
```

**Success Response** (200): Updated doctor object
**Error Responses**:

- 404: Doctor not found
- 400: Duplicate email/phone
- 401: Unauthorized

---

#### 5. Delete Doctor

**Endpoint**: `DELETE /api/v1/admin/doctors/{id}`
**Description**: Delete doctor
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200):

```json
{
  "message": "Doctor deleted successfully",
  "doctor_id": "d1234567"
}
```

**Error Responses**:

- 404: Doctor not found
- 401: Unauthorized

---

### Assignment Management Endpoints (Admin Only)

#### 1. Create Assignment

**Endpoint**: `POST /api/v1/admin/assignments`
**Description**: Create new assignment
**Auth Required**: Yes (Admin JWT token)

**Request**:

```json
{
  "employee_id": "e1234567",
  "doctor_id": "d1234567",
  "target": 5
}
```

**Success Response** (201):

```json
{
  "message": "Assignment created successfully",
  "assignment_id": "a1234567",
  "employee_id": "e1234567",
  "doctor_id": "d1234567",
  "target": 5
}
```

**Error Responses**:

- 400: Employee/doctor not found, duplicate assignment
- 401: Unauthorized
- 422: Validation error

---

#### 2. List Assignments

**Endpoint**: `GET /api/v1/admin/assignments`
**Description**: List assignments with filters
**Auth Required**: Yes (Admin JWT token)

**Query Parameters**:

- `page` (int): Page number (default: 1)
- `size` (int): Page size (default: 10, max: 100)
- `employee_id` (string): Filter by employee
- `doctor_id` (string): Filter by doctor
- `status` (string): Filter by status (ACTIVE, COMPLETED, CANCELLED)
- `search` (string): Search by employee/doctor name

**Success Response** (200):

```json
{
  "assignments": [
    {
      "id": "a1",
      "employee_id": "e1",
      "doctor_id": "d1",
      "target": 5,
      "current_progress": 2,
      "status": "ACTIVE",
      "progress_percentage": 40.0,
      "is_completed": false,
      "assigned_date": "2024-01-15T10:00:00Z",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z",
      "assigned_by": "a1234567",
      "employee_name": "Alice",
      "doctor_name": "Dr. Smith",
      "doctor_specialization": "Cardiology"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10,
  "has_next": false
}
```

---

#### 3. Get Assignment

**Endpoint**: `GET /api/v1/admin/assignments/{id}`
**Description**: Get assignment details
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200): Complete assignment object with related data
**Error Responses**:

- 404: Assignment not found
- 401: Unauthorized

---

#### 4. Update Assignment

**Endpoint**: `PUT /api/v1/admin/assignments/{id}`
**Description**: Update assignment
**Auth Required**: Yes (Admin JWT token)

**Request**:

```json
{
  "target": 10
}
```

**Success Response** (200): Updated assignment object
**Error Responses**:

- 404: Assignment not found
- 400: Invalid target value
- 401: Unauthorized

---

#### 5. Update Assignment Progress

**Endpoint**: `PUT /api/v1/admin/assignments/{id}/progress`
**Description**: Update assignment progress
**Auth Required**: Yes (Admin JWT token)

**Request**:

```json
{
  "progress": 3
}
```

**Success Response** (200):

```json
{
  "message": "Assignment progress updated successfully",
  "assignment_id": "a1234567",
  "current_progress": 3,
  "completed": false
}
```

---

#### 6. Update Assignment Status

**Endpoint**: `PUT /api/v1/admin/assignments/{id}/status`
**Description**: Update assignment status
**Auth Required**: Yes (Admin JWT token)

**Request**:

```json
{
  "status": "COMPLETED"
}
```

**Success Response** (200):

```json
{
  "message": "Assignment status updated successfully",
  "assignment_id": "a1234567",
  "status": "COMPLETED"
}
```

---

#### 7. Delete Assignment

**Endpoint**: `DELETE /api/v1/admin/assignments/{id}`
**Description**: Delete assignment
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200):

```json
{
  "message": "Assignment deleted successfully",
  "assignment_id": "a1234567"
}
```

**Error Responses**:

- 404: Assignment not found
- 401: Unauthorized

---

### Check-in System Endpoints (Employee Only)

#### 1. Get My Assignments

**Endpoint**: `GET /api/v1/employee/assignments`
**Description**: Get employee's assignments
**Auth Required**: Yes (Employee JWT token)

**Success Response** (200):

```json
{
  "assignments": [
    {
      "id": "a1",
      "doctor_id": "d1",
      "doctor_name": "Dr. Smith",
      "doctor_specialization": "Cardiology",
      "doctor_location": {
        "lat": 28.6139,
        "lng": 77.209,
        "address": "123 Medical St, New Delhi, India"
      },
      "target": 5,
      "current_progress": 2,
      "status": "ACTIVE",
      "progress_percentage": 40.0,
      "is_completed": false,
      "assigned_date": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1,
  "active_assignments": 1,
  "completed_assignments": 0,
  "total_target_visits": 5,
  "total_completed_visits": 2,
  "overall_progress_percentage": 40.0
}
```

---

#### 2. Check-in at Doctor Location

**Endpoint**: `POST /api/v1/employee/checkin`
**Description**: Check-in at doctor location with GPS validation
**Auth Required**: Yes (Employee JWT token)

**Request**:

```json
{
  "doctor_id": "d1234567",
  "latitude": 28.6139,
  "longitude": 77.209,
  "notes": "Regular check-in"
}
```

**Success Response** (201):

```json
{
  "message": "Check-in recorded successfully",
  "checkin_id": "c1234567",
  "is_valid": true,
  "distance_meters": 15.5,
  "assignment_progress": 3,
  "assignment_completed": false
}
```

**Error Responses**:

- 400: Doctor not found, assignment not found, distance exceeded
- 401: Unauthorized
- 422: Validation error

---

#### 3. Get Check-in History

**Endpoint**: `GET /api/v1/employee/checkin/history`
**Description**: Get check-in history with filters
**Auth Required**: Yes (Employee JWT token)

**Query Parameters**:

- `page` (int): Page number (default: 1)
- `size` (int): Page size (default: 10, max: 100)
- `doctor_id` (string): Filter by doctor
- `is_valid` (bool): Filter by validity

**Success Response** (200):

```json
{
  "checkins": [
    {
      "id": "c1",
      "employee_id": "e1",
      "doctor_id": "d1",
      "latitude": 28.6139,
      "longitude": 77.209,
      "is_valid": true,
      "distance_meters": 15.5,
      "max_radius_meters": 100.0,
      "notes": "Regular check-in",
      "checkin_time": "2024-01-15T10:00:00Z",
      "doctor_name": "Dr. Smith",
      "doctor_specialization": "Cardiology",
      "assignment_id": "a1",
      "assignment_progress": 3,
      "assignment_target": 5,
      "assignment_completed": false
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10,
  "has_next": false,
  "valid_checkins": 1,
  "invalid_checkins": 0,
  "total_doctors_visited": 1
}
```

---

#### 4. Get Doctor Details

**Endpoint**: `GET /api/v1/employee/doctors/{id}`
**Description**: Get doctor details for employees
**Auth Required**: Yes (Employee JWT token)

**Success Response** (200):

```json
{
  "id": "d1",
  "name": "Dr. Smith",
  "specialization": "Cardiology",
  "age": 45,
  "phone": "+91-9876543210",
  "location": {
    "lat": 28.6139,
    "lng": 77.209,
    "address": "123 Medical St, New Delhi, India"
  },
  "assignment_id": "a1",
  "assignment_target": 5,
  "assignment_progress": 2,
  "assignment_status": "ACTIVE",
  "assignment_progress_percentage": 40.0
}
```

---

#### 5. Get Employee Profile

**Endpoint**: `GET /api/v1/employee/profile`
**Description**: Get employee profile with analytics
**Auth Required**: Yes (Employee JWT token)

**Success Response** (200):

```json
{
  "id": "e1",
  "name": "Alice",
  "email": "alice@field.co",
  "phone": "+91-9876543210",
  "age": 28,
  "area_of_operation": "North Delhi",
  "is_active": true,
  "created_at": "2024-01-15T10:00:00Z",
  "total_assignments": 1,
  "active_assignments": 1,
  "completed_assignments": 0,
  "total_checkins": 5,
  "valid_checkins": 4,
  "invalid_checkins": 1,
  "success_rate": 80.0,
  "average_distance": 25.5,
  "most_visited_doctor": "Dr. Smith",
  "most_visited_specialization": "Cardiology"
}
```

---

### Notifications Endpoints (Both Roles)

#### 1. Get My Notifications

**Endpoint**: `GET /api/v1/notifications`
**Description**: Get user notifications with filters
**Auth Required**: Yes (JWT token)

**Query Parameters**:

- `page` (int): Page number (default: 1)
- `size` (int): Page size (default: 10, max: 100)
- `type` (string): Filter by notification type
- `read` (bool): Filter by read status
- `actionable` (bool): Filter by actionable status

**Success Response** (200):

```json
{
  "notifications": [
    {
      "id": "n1",
      "user_id": "e1",
      "user_role": "EMPLOYEE",
      "type": "ASSIGNMENT",
      "title": "New Doctor Assignment",
      "message": "You have been assigned to Dr. Smith",
      "read": false,
      "actionable": true,
      "action_data": {
        "assignment_id": "a1",
        "doctor_name": "Dr. Smith",
        "route": "/employee/assignments/a1"
      },
      "timestamp": "2024-01-15T10:00:00Z",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1,
  "unread_count": 1,
  "page": 1,
  "size": 10,
  "has_next": false
}
```

---

#### 2. Get Notification Statistics

**Endpoint**: `GET /api/v1/notifications/stats`
**Description**: Get notification statistics
**Auth Required**: Yes (JWT token)

**Success Response** (200):

```json
{
  "total_notifications": 5,
  "unread_notifications": 2,
  "read_notifications": 3,
  "notifications_by_type": {
    "ASSIGNMENT": 3,
    "CHECKIN": 2
  },
  "recent_notifications": [
    {
      "id": "n1",
      "title": "New Doctor Assignment",
      "message": "You have been assigned to Dr. Smith",
      "read": false,
      "timestamp": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

#### 3. Get Notification Details

**Endpoint**: `GET /api/v1/notifications/{id}`
**Description**: Get notification details
**Auth Required**: Yes (JWT token)

**Success Response** (200): Complete notification object
**Error Responses**:

- 404: Notification not found
- 401: Unauthorized

---

#### 4. Mark Notification as Read

**Endpoint**: `PUT /api/v1/notifications/{id}/read`
**Description**: Mark notification as read
**Auth Required**: Yes (JWT token)

**Success Response** (200):

```json
{
  "message": "Notification marked as read",
  "notification_id": "n1",
  "read": true
}
```

---

#### 5. Bulk Mark as Read

**Endpoint**: `PUT /api/v1/notifications/bulk/read`
**Description**: Mark multiple notifications as read
**Auth Required**: Yes (JWT token)

**Request**:

```json
{
  "notification_ids": ["n1", "n2", "n3"]
}
```

**Success Response** (200):

```json
{
  "message": "Marked 3 notifications as read",
  "updated_count": 3,
  "notification_ids": ["n1", "n2", "n3"]
}
```

---

#### 6. Mark All as Read

**Endpoint**: `PUT /api/v1/notifications/all/read`
**Description**: Mark all notifications as read
**Auth Required**: Yes (JWT token)

**Success Response** (200):

```json
{
  "message": "Marked 5 notifications as read",
  "notification_id": "all",
  "read": true
}
```

---

#### 7. Delete Notification

**Endpoint**: `DELETE /api/v1/notifications/{id}`
**Description**: Delete notification
**Auth Required**: Yes (JWT token)

**Success Response** (200):

```json
{
  "message": "Notification deleted successfully",
  "notification_id": "n1"
}
```

---

### WebSocket Endpoints (Real-time Notifications)

#### 1. WebSocket Connection

**Endpoint**: `WS /api/v1/ws/notifications/{user_id}`
**Description**: WebSocket connection for real-time notifications
**Auth Required**: Yes (User ID validation)

**Connection**:

```javascript
const ws = new WebSocket('ws://localhost:8000/api/v1/ws/notifications/e1');

ws.onopen = () => {
  console.log('WebSocket connected');
  // Send ping to keep connection alive
  setInterval(() => {
    ws.send(JSON.stringify({ type: 'ping' }));
  }, 30000);
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.type === 'notification') {
    // Handle new notification
    console.log('New notification:', message.data);
  } else if (message.type === 'pong') {
    // Keep-alive response
    console.log('Connection alive');
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('WebSocket disconnected');
};
```

**Message Types**:

- `notification`: New notification data
- `system`: System messages
- `ping`: Keep-alive request (client → server)
- `pong`: Keep-alive response (server → client)

**Notification Message Format**:

```json
{
  "type": "notification",
  "data": {
    "id": "n1",
    "user_id": "e1",
    "user_role": "EMPLOYEE",
    "type": "ASSIGNMENT",
    "title": "New Doctor Assignment",
    "message": "You have been assigned to Dr. Smith",
    "read": false,
    "actionable": true,
    "action_data": {
      "assignment_id": "a1",
      "doctor_name": "Dr. Smith",
      "route": "/employee/assignments/a1"
    },
    "timestamp": "2024-01-15T10:00:00Z"
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

#### 2. WebSocket Health Check

**Endpoint**: `GET /api/v1/ws/health`
**Description**: Check WebSocket system health
**Auth Required**: No

**Success Response** (200):

```json
{
  "status": "healthy",
  "active_connections": 5,
  "active_users": 3,
  "message": "WebSocket system is running"
}
```

---

#### 3. WebSocket Connection Status

**Endpoint**: `GET /api/v1/ws/connections`
**Description**: Get active WebSocket connections
**Auth Required**: No

**Success Response** (200):

```json
{
  "active_connections": {
    "e1": 2,
    "a1": 1
  },
  "total_connections": 3,
  "active_users": ["e1", "a1"]
}
```

**Note**: WebSocket is optional. The system also supports polling every 30 seconds for notifications.

---

### Analytics Endpoints (Admin Only)

#### 1. Dashboard Overview

**Endpoint**: `GET /api/v1/analytics/dashboard`
**Description**: Get system overview metrics
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200):

```json
{
  "total_employees": 5,
  "active_employees": 4,
  "total_doctors": 3,
  "total_assignments": 8,
  "active_assignments": 3,
  "completed_assignments": 5,
  "total_checkins": 15,
  "valid_checkins": 12,
  "invalid_checkins": 3,
  "checkin_success_rate": 80.0,
  "average_assignment_completion_time": 3.2,
  "most_productive_employee": "Alice",
  "most_visited_doctor": "Dr. Smith",
  "most_visited_specialization": "Cardiology",
  "recent_checkins": 5,
  "recent_assignments": 2,
  "recent_completions": 1
}
```

---

#### 2. Key Performance Indicators

**Endpoint**: `GET /api/v1/analytics/kpis`
**Description**: Get Key Performance Indicators
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200):

```json
{
  "assignment_completion_rate": 62.5,
  "checkin_success_rate": 80.0,
  "employee_productivity": 75.0,
  "system_uptime": 99.5,
  "total_visits_completed": 120,
  "average_visits_per_assignment": 5.2,
  "doctor_engagement_rate": 85.0,
  "geographic_coverage": 90.0,
  "data_accuracy": 95.0,
  "user_satisfaction": 4.5,
  "system_reliability": 98.0
}
```

---

#### 3. Employee Performance

**Endpoint**: `GET /api/v1/analytics/employees/performance`
**Description**: Get all employees performance
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200):

```json
[
  {
    "employee_id": "e1",
    "employee_name": "Alice",
    "total_assignments": 3,
    "completed_assignments": 2,
    "active_assignments": 1,
    "completion_rate": 66.7,
    "total_checkins": 8,
    "valid_checkins": 6,
    "invalid_checkins": 2,
    "checkin_success_rate": 75.0,
    "average_distance": 25.5,
    "most_visited_doctor": "Dr. Smith",
    "most_visited_specialization": "Cardiology",
    "last_checkin": "2024-01-15T10:00:00Z",
    "last_assignment": "2024-01-14T09:00:00Z",
    "average_assignment_duration": 5.2
  }
]
```

**Note**: This endpoint returns a paginated list. Use `page` and `size` query parameters.

---

#### 4. Individual Employee Performance

**Endpoint**: `GET /api/v1/analytics/employees/{id}/performance`
**Description**: Get individual employee performance
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200):

```json
{
  "employee_id": "e1",
  "employee_name": "Alice",
  "total_assignments": 3,
  "completed_assignments": 2,
  "active_assignments": 1,
  "completion_rate": 66.7,
  "total_checkins": 8,
  "valid_checkins": 6,
  "invalid_checkins": 2,
  "checkin_success_rate": 75.0,
  "average_distance": 25.5,
  "most_visited_doctor": "Dr. Smith",
  "most_visited_specialization": "Cardiology",
  "last_checkin": "2024-01-15T10:00:00Z",
  "last_assignment": "2024-01-14T09:00:00Z",
  "average_assignment_duration": 5.2
}
```

**Error Responses**:

- 404: Employee not found
- 401: Unauthorized

---

#### 5. Assignment Analytics

**Endpoint**: `GET /api/v1/analytics/assignments`
**Description**: Get assignment analytics
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200):

```json
{
  "total_assignments": 8,
  "active_assignments": 3,
  "completed_assignments": 5,
  "cancelled_assignments": 0,
  "completion_rate": 62.5,
  "average_completion_time": 3.2,
  "fastest_completion": 1.5,
  "slowest_completion": 7.8,
  "total_target_visits": 40,
  "total_completed_visits": 25,
  "overall_progress_percentage": 62.5,
  "assignments_by_doctor": {
    "d1": 3,
    "d2": 5
  },
  "assignments_by_specialization": {
    "Cardiology": 5,
    "Neurology": 3
  },
  "assignments_by_employee": {
    "e1": 3,
    "e2": 5
  }
}
```

---

#### 6. Check-in Analytics

**Endpoint**: `GET /api/v1/analytics/checkins`
**Description**: Get check-in analytics
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200):

```json
{
  "total_checkins": 15,
  "valid_checkins": 12,
  "invalid_checkins": 3,
  "success_rate": 80.0,
  "average_distance": 25.5,
  "min_distance": 5.2,
  "max_distance": 95.8,
  "checkins_today": 3,
  "checkins_this_week": 10,
  "checkins_this_month": 15,
  "checkins_by_doctor": {
    "d1": 5,
    "d2": 10
  },
  "checkins_by_specialization": {
    "Cardiology": 8,
    "Neurology": 7
  },
  "checkins_by_employee": {
    "e1": 8,
    "e2": 7
  },
  "daily_checkin_trend": [
    {
      "date": "2024-01-15",
      "checkins": 5
    }
  ],
  "weekly_success_rate": [
    {
      "week": "2024-01-08",
      "success_rate": 75.0
    }
  ]
}
```

---

#### 7. Daily Trends

**Endpoint**: `GET /api/v1/analytics/trends/daily`
**Description**: Get daily trend data
**Auth Required**: Yes (Admin JWT token)

**Query Parameters**:

- `days` (int): Number of days (default: 7, max: 30)

**Success Response** (200):

```json
{
  "period": "daily",
  "data_points": [
    {
      "date": "2024-01-15",
      "checkins": 5
    }
  ],
  "trend_direction": "up",
  "change_percentage": 15.5
}
```

---

#### 8. Weekly Trends

**Endpoint**: `GET /api/v1/analytics/trends/weekly`
**Description**: Get weekly trend data
**Auth Required**: Yes (Admin JWT token)

**Query Parameters**:

- `weeks` (int): Number of weeks (default: 4, max: 12)

**Success Response** (200): Similar to daily trends but with weekly data points

---

#### 9. Generate Report

**Endpoint**: `POST /api/v1/analytics/reports/generate`
**Description**: Generate custom report
**Auth Required**: Yes (Admin JWT token)

**Request**:

```json
{
  "report_type": "performance",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-12-31T23:59:59Z",
  "employee_ids": ["e1", "e2"],
  "doctor_ids": ["d1"],
  "assignment_status": "COMPLETED"
}
```

**Success Response** (201):

```json
{
  "report_id": "r1234567",
  "report_type": "performance",
  "generated_at": "2024-01-15T10:00:00Z",
  "data": {
    "employees": [...]
  },
  "summary": {
    "total_employees": 2,
    "total_assignments": 5,
    "completion_rate": 80.0
  },
  "filters_applied": {
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-12-31T23:59:59Z",
    "employee_ids": ["e1", "e2"],
    "doctor_ids": ["d1"],
    "assignment_status": "COMPLETED"
  }
}
```

---

#### 10. CSV Export

**Endpoint**: `GET /api/v1/analytics/export/csv`
**Description**: Export analytics data as CSV
**Auth Required**: Yes (Admin JWT token)

**Query Parameters**:

- `data_type` (string): Type of data to export (employees, assignments, checkins)

**Success Response** (200): CSV file download
**Content-Type**: `text/csv`

---

#### 11. System Health

**Endpoint**: `GET /api/v1/analytics/system/health`
**Description**: Get system health metrics
**Auth Required**: Yes (Admin JWT token)

**Success Response** (200):

```json
{
  "total_users": 5,
  "total_doctors": 3,
  "total_assignments": 8,
  "total_checkins": 15,
  "total_notifications": 25,
  "average_response_time": 150.0,
  "system_uptime": 99.5,
  "error_rate": 0.5,
  "data_completeness": 95.0,
  "duplicate_records": 0,
  "orphaned_records": 0,
  "most_active_user": "Alice",
  "most_used_endpoint": "/api/v1/employee/checkin",
  "peak_usage_hour": 14
}
```

---

## 📝 TypeScript Interfaces

### Authentication Types

```typescript
interface OTPRequest {
  identifier: string;
}

interface OTPVerify {
  identifier: string;
  otp: string;
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'employee';
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: UserInfo;
}

interface ErrorDetail {
  error: string;
  message: string;
  status: number;
}
```

### Employee Types

```typescript
interface EmployeeCreate {
  email: string;
  phone: string;
  name: string;
  age?: number;
  area_of_operation?: string;
}

interface EmployeeUpdate {
  email?: string;
  phone?: string;
  name?: string;
  age?: number;
  area_of_operation?: string;
}

interface Employee {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: string;
  is_active: boolean;
  age?: number;
  area_of_operation?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

interface EmployeeListResponse {
  employees: Employee[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
}
```

### Doctor Types

```typescript
interface DoctorCreate {
  name: string;
  specialization: string;
  age?: number;
  phone?: string;
  location_lat: number;
  location_lng: number;
  location_address?: string;
}

interface DoctorUpdate {
  name?: string;
  specialization?: string;
  age?: number;
  phone?: string;
  location_lat?: number;
  location_lng?: number;
  location_address?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  age?: number;
  phone?: string;
  location_lat: number;
  location_lng: number;
  location_address?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

interface DoctorListResponse {
  doctors: Doctor[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
}

interface DoctorDetailsResponse {
  id: string;
  name: string;
  specialization: string;
  age?: number;
  phone?: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  assignment_id?: string;
  assignment_target?: number;
  assignment_progress?: number;
  assignment_status?: string;
  assignment_progress_percentage?: number;
}
```

### Assignment Types

```typescript
interface AssignmentCreate {
  employee_id: string;
  doctor_id: string;
  target: number;
}

interface AssignmentUpdate {
  target?: number;
  current_progress?: number;
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

interface AssignmentProgressUpdate {
  current_progress: number;
}

interface AssignmentStatusUpdate {
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

interface Assignment {
  id: string;
  employee_id: string;
  doctor_id: string;
  target: number;
  current_progress: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  progress_percentage: number;
  is_completed: boolean;
  assigned_date: string;
  created_at: string;
  updated_at: string;
  assigned_by: string;
  employee_name?: string;
  doctor_name?: string;
  doctor_specialization?: string;
}

interface AssignmentListResponse {
  assignments: Assignment[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
}
```

### Check-in Types

```typescript
interface CheckinRequest {
  doctor_id: string;
  latitude: number;
  longitude: number;
  notes?: string;
}

interface CheckinCreateResponse {
  message: string;
  checkin_id: string;
  is_valid: boolean;
  distance_meters: number;
  assignment_progress?: number;
  assignment_completed?: boolean;
}

interface Checkin {
  id: string;
  employee_id: string;
  doctor_id: string;
  latitude: number;
  longitude: number;
  is_valid: boolean;
  distance_meters: number;
  max_radius_meters: number;
  notes?: string;
  checkin_time: string;
  doctor_name?: string;
  doctor_specialization?: string;
  assignment_id?: string;
  assignment_progress?: number;
  assignment_target?: number;
  assignment_completed?: boolean;
}

interface CheckinHistoryResponse {
  checkins: Checkin[];
  total: number;
  page: number;
  size: number;
  has_next: boolean;
  valid_checkins: number;
  invalid_checkins: number;
  total_doctors_visited: number;
}

interface EmployeeProfileResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  area_of_operation?: string;
  is_active: boolean;
  created_at: string;
  total_assignments: number;
  active_assignments: number;
  completed_assignments: number;
  total_checkins: number;
  valid_checkins: number;
  invalid_checkins: number;
  success_rate: number;
  average_distance?: number;
  most_visited_doctor?: string;
  most_visited_specialization?: string;
}

interface EmployeeAssignmentResponse {
  id: string;
  doctor_id: string;
  doctor_name: string;
  doctor_specialization: string;
  doctor_location: {
    lat: number;
    lng: number;
    address?: string;
  };
  target: number;
  current_progress: number;
  status: string;
  progress_percentage: number;
  is_completed: boolean;
  assigned_date: string;
}

interface EmployeeAssignmentsResponse {
  assignments: EmployeeAssignmentResponse[];
  total: number;
  active_assignments: number;
  completed_assignments: number;
  total_target_visits: number;
  total_completed_visits: number;
  overall_progress_percentage: number;
}
```

### Notification Types

```typescript
interface Notification {
  id: string;
  user_id: string;
  user_role: 'ADMIN' | 'EMPLOYEE';
  type: 'ASSIGNMENT' | 'CHECKIN' | 'SYSTEM';
  title: string;
  message: string;
  read: boolean;
  actionable: boolean;
  action_data?: {
    assignment_id?: string;
    doctor_name?: string;
    route?: string;
  };
  timestamp: string;
  created_at: string;
}

interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unread_count: number;
  page: number;
  size: number;
  has_next: boolean;
}

interface NotificationStatsResponse {
  total_notifications: number;
  unread_notifications: number;
  read_notifications: number;
  notifications_by_type: Record<string, number>;
  recent_notifications: Notification[];
}

interface NotificationBulkReadRequest {
  notification_ids: string[];
}
```

### Analytics Types

```typescript
interface DashboardResponse {
  total_employees: number;
  active_employees: number;
  total_doctors: number;
  total_assignments: number;
  active_assignments: number;
  completed_assignments: number;
  total_checkins: number;
  valid_checkins: number;
  invalid_checkins: number;
  checkin_success_rate: number;
  average_assignment_completion_time?: number;
  most_productive_employee?: string;
  most_visited_doctor?: string;
  most_visited_specialization?: string;
  recent_checkins: number;
  recent_assignments: number;
  recent_completions: number;
}

interface KPIsResponse {
  assignment_completion_rate: number;
  checkin_success_rate: number;
  employee_productivity: number;
  system_uptime: number;
  total_visits_completed: number;
  average_visits_per_assignment: number;
  doctor_engagement_rate: number;
  geographic_coverage: number;
  data_accuracy: number;
  user_satisfaction?: number;
  system_reliability: number;
}

interface EmployeePerformance {
  employee_id: string;
  employee_name: string;
  total_assignments: number;
  completed_assignments: number;
  active_assignments: number;
  completion_rate: number;
  total_checkins: number;
  valid_checkins: number;
  invalid_checkins: number;
  checkin_success_rate: number;
  average_distance?: number;
  most_visited_doctor?: string;
  most_visited_specialization?: string;
  last_checkin?: string;
  last_assignment?: string;
  average_assignment_duration?: number;
}

interface AssignmentAnalyticsResponse {
  total_assignments: number;
  active_assignments: number;
  completed_assignments: number;
  cancelled_assignments: number;
  completion_rate: number;
  average_completion_time?: number;
  fastest_completion?: number;
  slowest_completion?: number;
  total_target_visits: number;
  total_completed_visits: number;
  overall_progress_percentage: number;
  assignments_by_doctor: Record<string, number>;
  assignments_by_specialization: Record<string, number>;
  assignments_by_employee: Record<string, number>;
}

interface CheckinAnalyticsResponse {
  total_checkins: number;
  valid_checkins: number;
  invalid_checkins: number;
  success_rate: number;
  average_distance?: number;
  min_distance?: number;
  max_distance?: number;
  checkins_today: number;
  checkins_this_week: number;
  checkins_this_month: number;
  checkins_by_doctor: Record<string, number>;
  checkins_by_specialization: Record<string, number>;
  checkins_by_employee: Record<string, number>;
  daily_checkin_trend: Array<Record<string, any>>;
  weekly_success_rate: Array<Record<string, any>>;
}

interface TrendDataResponse {
  period: 'daily' | 'weekly' | 'monthly';
  data_points: Array<Record<string, any>>;
  trend_direction: 'up' | 'down' | 'stable';
  change_percentage?: number;
}

interface ReportRequest {
  report_type: 'performance' | 'assignments' | 'checkins' | 'system';
  start_date?: string;
  end_date?: string;
  employee_ids?: string[];
  doctor_ids?: string[];
  assignment_status?: string;
}

interface ReportResponse {
  report_id: string;
  report_type: string;
  generated_at: string;
  data: Record<string, any>;
  summary: Record<string, any>;
  filters_applied: Record<string, any>;
}

interface SystemHealthResponse {
  total_users: number;
  total_doctors: number;
  total_assignments: number;
  total_checkins: number;
  total_notifications: number;
  average_response_time?: number;
  system_uptime?: number;
  error_rate?: number;
  data_completeness: number;
  duplicate_records: number;
  orphaned_records: number;
  most_active_user?: string;
  most_used_endpoint?: string;
  peak_usage_hour?: number;
}
```

### API Response Types

```typescript
interface ApiResponse<T> {
  data?: T;
  error?: ErrorDetail;
  message?: string;
}

interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
  include_inactive?: boolean;
}
```

---

## 🛠️ Dev Mode Guide

### OTP Console Logging

In development, OTP codes are printed to the server console:

```
============================================================
📧 EMAIL DEV MODE - OTP Not Sent via SendGrid
============================================================
To: alice@field.co
Name: Alice
OTP CODE: 123456
Expires: 10 minutes
============================================================
```

### Welcome Email Console Logging

Welcome emails are also printed to console:

```
🎉 Welcome Email for newemployee@field.co:
   Hi New Employee,
   Welcome to the Ayska Field App platform!
   Login Instructions: Use your email (newemployee@field.co) or phone (+91-9876543210) to request an OTP for login.
   We're excited to have you on board!
   Thanks, The Ayska Team
```

### Test Credentials

From seed data:

- **Admin**: `admin@field.co` (use OTP)
- **Employee 1**: `alice@field.co` (use OTP)
- **Employee 2**: `bob@field.co` (use OTP)

### Database Reset

```bash
# Reset database and seed data
rm ayska.db
python scripts/seed_data.py
```

---

## 🧪 Testing Guide

### Using Swagger UI

1. Go to `http://localhost:8000/docs`
2. Click "Try it out" on any endpoint
3. Fill in request body
4. Click "Execute"
5. Check response

### Using curl

```bash
# Test health check
curl http://localhost:8000/health

# Test OTP request
curl -X POST "http://localhost:8000/api/v1/auth/otp/request" \
  -H "Content-Type: application/json" \
  -d '{"identifier": "alice@field.co"}'

# Test OTP verify
curl -X POST "http://localhost:8000/api/v1/auth/otp/verify" \
  -H "Content-Type: application/json" \
  -d '{"identifier": "alice@field.co", "otp": "123456"}'
```

### Using Postman

1. Import collection from Swagger UI
2. Set base URL to `http://localhost:8000`
3. Use environment variables for tokens
4. Test all endpoints

### Common Test Scenarios

1. **Login Flow**: Request OTP → Verify OTP → Get JWT
2. **Admin Features**: Create employee → List employees → Update employee
3. **Error Handling**: Test invalid OTP, expired OTP, unauthorized access
4. **Role-based Access**: Test admin vs employee permissions

---

## 📋 Integration Checklist

### ✅ Complete Implementation (All Phases 1-9)

#### Phase 1-4: Core System ✅

- [x] Authentication flow (OTP request/verify)
- [x] JWT token management
- [x] Admin dashboard (employee CRUD)
- [x] Role-based routing
- [x] Error handling
- [x] Success messages

#### Phase 5: Doctor Management ✅

- [x] Doctor CRUD operations
- [x] Geolocation support
- [x] Search and filtering
- [x] Validation and error handling

#### Phase 6: Assignment Management ✅

- [x] Assignment creation and management
- [x] Progress tracking
- [x] Auto-completion logic
- [x] Status management
- [x] Comprehensive filtering

#### Phase 7: Check-in System ✅

- [x] GPS-based validation (100m radius)
- [x] Distance calculation (Haversine/Geodesic)
- [x] Assignment progress updates
- [x] Check-in history with filters
- [x] Employee profile analytics

#### Phase 8: Notifications System ✅

- [x] App-only notifications (NO email)
- [x] Real-time polling (30 seconds)
- [x] WebSocket support (optional)
- [x] Notification triggers for all events
- [x] Bulk operations and management

#### Phase 9: Analytics & Reporting ✅

- [x] Dashboard with system metrics
- [x] Employee performance tracking
- [x] Assignment/check-in analytics
- [x] Trend analysis (daily/weekly)
- [x] Custom report generation
- [x] CSV export functionality

### 🎯 Ready for Frontend Integration

All 51 API endpoints are implemented and ready for frontend integration:

- **Authentication**: 5 endpoints
- **Employee Management**: 6 endpoints
- **Doctor Management**: 5 endpoints
- **Assignment Management**: 7 endpoints
- **Check-in System**: 5 endpoints
- **Notifications**: 7 endpoints
- **Analytics**: 11 endpoints
- **WebSocket**: 3 endpoints
- **Health & Root**: 2 endpoints

### 📊 System Status

- **Total Endpoints**: 51
- **Authentication**: JWT-based with 90-day expiration
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Real-time**: WebSocket support + polling
- **Geolocation**: GPS validation with 100m radius
- **Notifications**: App-only, no email
- **Analytics**: Comprehensive reporting and export

---

## 🔧 Frontend Implementation Tips

### State Management

```javascript
// Store user info and token
const authState = {
  token: localStorage.getItem('auth_token'),
  user: JSON.parse(localStorage.getItem('user_info') || '{}'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
};
```

### API Client Setup

```javascript
// Create API client with auth
const apiClient = {
  baseURL: 'http://localhost:8000/api/v1',

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  },
};
```

### Error Handling

```javascript
// Global error handler
const handleApiError = (error) => {
  if (error.status === 401) {
    // Redirect to login
    window.location.href = '/login';
  } else if (error.status === 403) {
    // Show access denied
    showError('Access denied. Insufficient permissions.');
  } else {
    // Show generic error
    showError(error.message || 'Something went wrong.');
  }
};
```

### Role-based Components

```javascript
// Admin-only component
const AdminOnly = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  return user.role === 'admin' ? children : null;
};

// Employee-only component
const EmployeeOnly = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  return user.role === 'employee' ? children : null;
};
```

---

## **Analytics & Reporting (Phase 9)**

### **Dashboard Analytics**

- `GET /api/v1/analytics/dashboard` - System overview metrics
- `GET /api/v1/analytics/kpis` - Key Performance Indicators
- `GET /api/v1/analytics/system/health` - System health metrics

### **Employee Analytics**

- `GET /api/v1/analytics/employees/performance` - All employees performance
- `GET /api/v1/analytics/employees/{id}/performance` - Individual performance

### **Assignment Analytics**

- `GET /api/v1/analytics/assignments` - Assignment metrics and trends
- `GET /api/v1/analytics/checkins` - Check-in analytics and patterns

### **Trend Analysis**

- `GET /api/v1/analytics/trends/daily?days=7` - Daily trend data
- `GET /api/v1/analytics/trends/weekly?weeks=4` - Weekly trend data

### **Report Generation**

- `POST /api/v1/analytics/reports/generate` - Generate custom reports
- `GET /api/v1/analytics/export/csv?data_type=employees` - Export CSV data

### **Report Types**

- **performance**: Employee performance reports
- **assignments**: Assignment analytics reports
- **checkins**: Check-in analytics reports
- **system**: System health reports

### **CSV Export Types**

- **employees**: Employee performance data
- **assignments**: Assignment analytics data
- **checkins**: Check-in analytics data

---

## 📞 Support

For questions or issues:

1. Check the Swagger documentation at `/docs`
2. Review error messages in browser console
3. Check server logs for detailed errors
4. Test with curl/Postman to isolate issues

**Happy coding!** 🚀
