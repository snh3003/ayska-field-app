# Frontend Integration Scenarios Guide

## Overview

This document outlines all possible user flows and scenarios for the Ayska Field App frontend integration. Each scenario includes the API endpoint, request payload, expected response, and error handling.

## Base Configuration

- **Base URL**: `http://localhost:8000`
- **API Version**: `/api/v1`
- **Authentication**: JWT Bearer token
- **Content-Type**: `application/json`

---

## 🔐 Authentication Scenarios

### 1. Successful Login (Admin)

**User Action**: Admin enters email/phone and OTP
**API Endpoint**: `POST /api/v1/auth/otp/request` → `POST /api/v1/auth/otp/verify`

**Request Flow**:

```json
// Step 1: Request OTP
POST /api/v1/auth/otp/request
{
  "identifier": "admin@ayska.co"
}

// Step 2: Verify OTP
POST /api/v1/auth/otp/verify
{
  "identifier": "admin@ayska.co",
  "otp": "123456"
}
```

**Success Response**:

```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "expires_in": 7776000,
  "user": {
    "id": "a1234567",
    "name": "Admin User",
    "email": "admin@ayska.co",
    "phone": "+91-9876543210",
    "role": "admin"
  }
}
```

**Frontend Action**: Store JWT token, redirect to admin dashboard

---

### 2. Successful Login (Employee)

**User Action**: Employee enters email/phone and OTP
**API Endpoint**: `POST /api/v1/auth/otp/request` → `POST /api/v1/auth/otp/verify`

**Request Flow**: Same as admin login
**Success Response**: Same format, but `role: "employee"`
**Frontend Action**: Store JWT token, redirect to employee dashboard

---

### 3. Login with Unregistered Email

**User Action**: User enters non-existent email
**API Endpoint**: `POST /api/v1/auth/otp/request`

**Request**:

```json
{
  "identifier": "nonexistent@example.com"
}
```

**Error Response** (404):

```json
{
  "error": "user_not_found",
  "message": "Account not found. Contact your admin.",
  "status": 404
}
```

**Frontend Action**: Show error message, suggest contacting admin

---

### 4. Login with Inactive Account

**User Action**: User enters email of deactivated account
**API Endpoint**: `POST /api/v1/auth/otp/request`

**Request**:

```json
{
  "identifier": "deactivated@field.co"
}
```

**Error Response** (403):

```json
{
  "error": "account_inactive",
  "message": "Account deactivated. Contact your admin.",
  "status": 403
}
```

**Frontend Action**: Show error message, suggest contacting admin

---

### 5. Invalid OTP Entry

**User Action**: User enters wrong OTP code
**API Endpoint**: `POST /api/v1/auth/otp/verify`

**Request**:

```json
{
  "identifier": "alice@field.co",
  "otp": "000000"
}
```

**Error Response** (400):

```json
{
  "error": "invalid_otp",
  "message": "Incorrect OTP. Try again.",
  "status": 400
}
```

**Frontend Action**: Show error message, allow retry

---

### 6. Expired OTP

**User Action**: User enters OTP after 10 minutes
**API Endpoint**: `POST /api/v1/auth/otp/verify`

**Error Response** (400):

```json
{
  "error": "otp_expired",
  "message": "OTP expired. Request a new one.",
  "status": 400
}
```

**Frontend Action**: Show error message, redirect to request new OTP

---

### 7. Too Many OTP Attempts

**User Action**: User enters wrong OTP 5+ times
**API Endpoint**: `POST /api/v1/auth/otp/verify`

**Error Response** (400):

```json
{
  "error": "too_many_attempts",
  "message": "Too many attempts. Request new OTP.",
  "status": 400
}
```

**Frontend Action**: Show error message, redirect to request new OTP

---

### 8. Successful Logout

**User Action**: User clicks logout button
**API Endpoint**: `POST /api/v1/auth/logout`

**Request Headers**:

```
Authorization: Bearer eyJhbGc...
```

**Success Response** (200):

```json
{
  "message": "Logged out successfully"
}
```

**Frontend Action**: Clear JWT token, redirect to login

---

### 9. Access Protected Endpoint Without Token

**User Action**: User tries to access admin/employee features without login
**API Endpoint**: Any protected endpoint (e.g., `GET /api/v1/admin/employees`)

**Request**: No Authorization header

**Error Response** (401):

```json
{
  "detail": "Not authenticated"
}
```

**Frontend Action**: Redirect to login page

---

### 10. Access Admin Endpoint as Employee

**User Action**: Employee tries to access admin features
**API Endpoint**: `GET /api/v1/admin/employees`

**Request Headers**:

```
Authorization: Bearer [employee_token]
```

**Error Response** (403):

```json
{
  "detail": "Not authorized to perform this action. Admin access required."
}
```

**Frontend Action**: Show "Access Denied" message, redirect to employee dashboard

---

## 👨‍💼 Employee Management Scenarios (Admin Only)

### 11. Create Employee Successfully

**User Action**: Admin creates new employee
**API Endpoint**: `POST /api/v1/admin/employees`

**Request Headers**:

```
Authorization: Bearer [admin_token]
```

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

**Frontend Action**: Show success message, refresh employee list

---

### 12. Create Employee with Duplicate Email

**User Action**: Admin tries to create employee with existing email
**API Endpoint**: `POST /api/v1/admin/employees`

**Error Response** (400):

```json
{
  "error": "duplicate_employee",
  "message": "Email or phone already exists.",
  "status": 400
}
```

**Frontend Action**: Show error message, highlight duplicate field

---

### 13. Create Employee with Duplicate Phone

**User Action**: Admin tries to create employee with existing phone
**API Endpoint**: `POST /api/v1/admin/employees`

**Error Response** (400): Same as duplicate email
**Frontend Action**: Show error message, highlight duplicate field

---

### 14. List Employees with Search

**User Action**: Admin searches for employees
**API Endpoint**: `GET /api/v1/admin/employees?search=alice&page=1&size=10`

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

**Frontend Action**: Display employee list with search results

---

### 15. List Employees with Pagination

**User Action**: Admin navigates to page 2 of employee list
**API Endpoint**: `GET /api/v1/admin/employees?page=2&size=10`

**Success Response** (200): Same format as above
**Frontend Action**: Display page 2 of employee list

---

### 16. Get Employee Details

**User Action**: Admin clicks on employee to view details
**API Endpoint**: `GET /api/v1/admin/employees/e1234567`

**Success Response** (200):

```json
{
  "id": "e1234567",
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

**Frontend Action**: Display employee details in modal/sidebar

---

### 17. Get Non-existent Employee

**User Action**: Admin tries to access non-existent employee
**API Endpoint**: `GET /api/v1/admin/employees/nonexistent`

**Error Response** (404):

```json
{
  "error": "employee_not_found",
  "message": "Employee not found.",
  "status": 404
}
```

**Frontend Action**: Show error message, redirect to employee list

---

### 18. Update Employee Successfully

**User Action**: Admin updates employee information
**API Endpoint**: `PUT /api/v1/admin/employees/e1234567`

**Request**:

```json
{
  "name": "Alice Updated",
  "age": 29,
  "area_of_operation": "South Delhi"
}
```

**Success Response** (200): Same as get employee details
**Frontend Action**: Show success message, refresh employee details

---

### 19. Update Employee with Duplicate Email

**User Action**: Admin tries to update employee with existing email
**API Endpoint**: `PUT /api/v1/admin/employees/e1234567`

**Request**:

```json
{
  "email": "existing@field.co"
}
```

**Error Response** (400):

```json
{
  "error": "duplicate_contact",
  "message": "Email or phone already in use.",
  "status": 400
}
```

**Frontend Action**: Show error message, highlight duplicate field

---

### 20. Soft Delete Employee

**User Action**: Admin deactivates employee (soft delete)
**API Endpoint**: `DELETE /api/v1/admin/employees/e1234567?permanent=false`

**Success Response** (200):

```json
{
  "message": "Employee soft deleted successfully",
  "employee_id": "e1234567",
  "permanent": false
}
```

**Frontend Action**: Show success message, mark employee as inactive in list

---

### 21. Hard Delete Employee

**User Action**: Admin permanently deletes employee
**API Endpoint**: `DELETE /api/v1/admin/employees/e1234567?permanent=true`

**Success Response** (200):

```json
{
  "message": "Employee permanently deleted",
  "employee_id": "e1234567",
  "permanent": true
}
```

**Frontend Action**: Show success message, remove employee from list

---

### 22. Reactivate Employee

**User Action**: Admin reactivates soft-deleted employee
**API Endpoint**: `POST /api/v1/admin/employees/e1234567/reactivate`

**Success Response** (200):

```json
{
  "message": "Employee reactivated successfully",
  "employee_id": "e1234567"
}
```

**Frontend Action**: Show success message, mark employee as active in list

---

### 23. Reactivate Already Active Employee

**User Action**: Admin tries to reactivate already active employee
**API Endpoint**: `POST /api/v1/admin/employees/e1234567/reactivate`

**Error Response** (400):

```json
{
  "error": "employee_already_active",
  "message": "Employee is already active.",
  "status": 400
}
```

**Frontend Action**: Show error message, disable reactivate button

---

### Doctor Management Scenarios (Admin Only)

#### 24. Create Doctor Successfully

**User Action**: Admin creates new doctor with location
**API Endpoint**: `POST /api/v1/admin/doctors`

**Request**:

```json
{
  "name": "Dr. Smith",
  "specialization": "Cardiology",
  "phone": "+91-9876543210",
  "email": "dr.smith@hospital.com",
  "location_lat": 28.6139,
  "location_lng": 77.209,
  "address": "123 Medical St, New Delhi, India"
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

**Frontend Action**: Show success message, refresh doctor list

---

#### 25. Create Doctor with Duplicate Email

**User Action**: Admin tries to create doctor with existing email
**API Endpoint**: `POST /api/v1/admin/doctors`

**Error Response** (400):

```json
{
  "error": "duplicate_doctor",
  "message": "Email or phone already exists.",
  "status": 400
}
```

**Frontend Action**: Show error message, highlight duplicate field

---

#### 26. List Doctors with Search

**User Action**: Admin searches for doctors
**API Endpoint**: `GET /api/v1/admin/doctors?search=cardiology&page=1&size=10`

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
      "location_lat": 28.6139,
      "location_lng": 77.209,
      "address": "123 Medical St, New Delhi, India",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10,
  "has_next": false
}
```

**Frontend Action**: Display doctor list with search results

---

#### 27. Get Doctor Details

**User Action**: Admin clicks on doctor to view details
**API Endpoint**: `GET /api/v1/admin/doctors/d1234567`

**Success Response** (200): Complete doctor object
**Frontend Action**: Display doctor details in modal/sidebar

---

#### 28. Update Doctor Successfully

**User Action**: Admin updates doctor information
**API Endpoint**: `PUT /api/v1/admin/doctors/d1234567`

**Request**:

```json
{
  "name": "Dr. John Smith",
  "phone": "+91-9876543211"
}
```

**Success Response** (200): Updated doctor object
**Frontend Action**: Show success message, refresh doctor details

---

#### 29. Delete Doctor

**User Action**: Admin deletes doctor
**API Endpoint**: `DELETE /api/v1/admin/doctors/d1234567`

**Success Response** (200):

```json
{
  "message": "Doctor deleted successfully",
  "doctor_id": "d1234567"
}
```

**Frontend Action**: Show success message, remove doctor from list

---

### Assignment Management Scenarios (Admin Only)

#### 30. Create Assignment Successfully

**User Action**: Admin creates new assignment
**API Endpoint**: `POST /api/v1/admin/assignments`

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

**Frontend Action**: Show success message, refresh assignment list

---

#### 31. Create Assignment with Duplicate Employee-Doctor

**User Action**: Admin tries to create duplicate assignment
**API Endpoint**: `POST /api/v1/admin/assignments`

**Error Response** (400):

```json
{
  "error": "duplicate_assignment",
  "message": "Employee already has an active assignment with this doctor.",
  "status": 400
}
```

**Frontend Action**: Show error message, suggest updating existing assignment

---

#### 32. List Assignments with Filters

**User Action**: Admin filters assignments by status
**API Endpoint**: `GET /api/v1/admin/assignments?status=ACTIVE&employee_id=e1&page=1&size=10`

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
      "assigned_date": "2024-01-15T10:00:00Z",
      "created_at": "2024-01-15T10:00:00Z",
      "employee_name": "Alice",
      "doctor_name": "Dr. Smith"
    }
  ],
  "total": 1,
  "page": 1,
  "size": 10,
  "has_next": false
}
```

**Frontend Action**: Display filtered assignment list

---

#### 33. Update Assignment Progress

**User Action**: Admin updates assignment progress
**API Endpoint**: `PUT /api/v1/admin/assignments/a1234567/progress`

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

**Frontend Action**: Show success message, update progress bar

---

#### 34. Update Assignment Status

**User Action**: Admin marks assignment as completed
**API Endpoint**: `PUT /api/v1/admin/assignments/a1234567/status`

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

**Frontend Action**: Show success message, update status badge

---

#### 35. Delete Assignment

**User Action**: Admin deletes assignment
**API Endpoint**: `DELETE /api/v1/admin/assignments/a1234567`

**Success Response** (200):

```json
{
  "message": "Assignment deleted successfully",
  "assignment_id": "a1234567"
}
```

**Frontend Action**: Show success message, remove assignment from list

---

### Check-in System Scenarios (Employee Only)

#### 36. Get My Assignments

**User Action**: Employee views their assignments
**API Endpoint**: `GET /api/v1/employee/assignments`

**Success Response** (200):

```json
{
  "assignments": [
    {
      "id": "a1",
      "doctor_id": "d1",
      "target": 5,
      "current_progress": 2,
      "status": "ACTIVE",
      "assigned_date": "2024-01-15T10:00:00Z",
      "doctor_name": "Dr. Smith",
      "doctor_specialization": "Cardiology"
    }
  ],
  "total": 1,
  "active_assignments": 1,
  "completed_assignments": 0
}
```

**Frontend Action**: Display assignment cards with progress

---

#### 37. Valid Check-in at Doctor Location

**User Action**: Employee checks in within 100m of doctor
**API Endpoint**: `POST /api/v1/employee/checkin`

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

**Frontend Action**: Show success message, update progress, trigger notification

---

#### 38. Invalid Check-in (Too Far)

**User Action**: Employee tries to check in >100m from doctor
**API Endpoint**: `POST /api/v1/employee/checkin`

**Error Response** (400):

```json
{
  "error": "distance_exceeded",
  "message": "You are too far from the doctor's location. Please move closer.",
  "status": 400
}
```

**Frontend Action**: Show error message, show distance to doctor

---

#### 39. Get Check-in History

**User Action**: Employee views check-in history
**API Endpoint**: `GET /api/v1/employee/checkin/history?page=1&size=10`

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
      "assignment_target": 5
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

**Frontend Action**: Display check-in history with map markers

---

#### 40. Get Doctor Details for Check-in

**User Action**: Employee views doctor details before check-in
**API Endpoint**: `GET /api/v1/employee/doctors/d1234567`

**Success Response** (200):

```json
{
  "id": "d1",
  "name": "Dr. Smith",
  "specialization": "Cardiology",
  "phone": "+91-9876543210",
  "email": "dr.smith@hospital.com",
  "location_lat": 28.6139,
  "location_lng": 77.209,
  "address": "123 Medical St, New Delhi, India"
}
```

**Frontend Action**: Display doctor info with map location

---

#### 41. Get Employee Profile with Analytics

**User Action**: Employee views their profile
**API Endpoint**: `GET /api/v1/employee/profile`

**Success Response** (200):

```json
{
  "employee_id": "e1",
  "name": "Alice",
  "email": "alice@field.co",
  "phone": "+91-9876543210",
  "address": "123 Main St, New Delhi, India",
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

**Frontend Action**: Display profile with performance analytics

---

### Notifications Scenarios (Both Roles)

#### 42. Get My Notifications

**User Action**: User views their notifications
**API Endpoint**: `GET /api/v1/notifications?page=1&size=10`

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

**Frontend Action**: Display notification list with unread badges

---

#### 43. Mark Notification as Read

**User Action**: User marks notification as read
**API Endpoint**: `PUT /api/v1/notifications/n1/read`

**Success Response** (200):

```json
{
  "message": "Notification marked as read",
  "notification_id": "n1",
  "read": true
}
```

**Frontend Action**: Update notification UI, remove unread badge

---

#### 44. Bulk Mark Notifications as Read

**User Action**: User marks multiple notifications as read
**API Endpoint**: `PUT /api/v1/notifications/bulk/read`

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

**Frontend Action**: Update multiple notifications, refresh unread count

---

#### 45. Mark All Notifications as Read

**User Action**: User marks all notifications as read
**API Endpoint**: `PUT /api/v1/notifications/all/read`

**Success Response** (200):

```json
{
  "message": "Marked 5 notifications as read",
  "notification_id": "all",
  "read": true
}
```

**Frontend Action**: Update all notifications, clear unread count

---

#### 46. Get Notification Statistics

**User Action**: User views notification stats
**API Endpoint**: `GET /api/v1/notifications/stats`

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

**Frontend Action**: Display notification statistics dashboard

---

### Analytics Scenarios (Admin Only)

#### 47. Dashboard Overview

**User Action**: Admin views system dashboard
**API Endpoint**: `GET /api/v1/analytics/dashboard`

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
  "assignment_completion_rate": 62.5,
  "average_completion_time": 3.2,
  "system_uptime": 99.5
}
```

**Frontend Action**: Display dashboard cards with key metrics

---

#### 48. Employee Performance Analytics

**User Action**: Admin views employee performance
**API Endpoint**: `GET /api/v1/analytics/employees/performance`

**Success Response** (200):

```json
{
  "employees": [
    {
      "employee_id": "e1",
      "employee_name": "Alice",
      "total_assignments": 3,
      "completed_assignments": 2,
      "completion_rate": 66.7,
      "total_checkins": 8,
      "valid_checkins": 6,
      "success_rate": 75.0,
      "average_distance": 25.5,
      "productivity_score": 70.8
    }
  ],
  "total_employees": 1,
  "average_completion_rate": 66.7,
  "average_success_rate": 75.0,
  "top_performer": "Alice"
}
```

**Frontend Action**: Display performance charts and rankings

---

#### 49. Assignment Analytics

**User Action**: Admin views assignment analytics
**API Endpoint**: `GET /api/v1/analytics/assignments`

**Success Response** (200):

```json
{
  "total_assignments": 8,
  "active_assignments": 3,
  "completed_assignments": 5,
  "cancelled_assignments": 0,
  "completion_rate": 62.5,
  "average_completion_time": 3.2,
  "assignments_by_status": {
    "ACTIVE": 3,
    "COMPLETED": 5,
    "CANCELLED": 0
  },
  "assignments_by_employee": [
    {
      "employee_id": "e1",
      "employee_name": "Alice",
      "total_assignments": 3,
      "completed_assignments": 2,
      "completion_rate": 66.7
    }
  ]
}
```

**Frontend Action**: Display assignment analytics with charts

---

#### 50. Check-in Analytics

**User Action**: Admin views check-in analytics
**API Endpoint**: `GET /api/v1/analytics/checkins`

**Success Response** (200):

```json
{
  "total_checkins": 15,
  "valid_checkins": 12,
  "invalid_checkins": 3,
  "success_rate": 80.0,
  "average_distance": 25.5,
  "checkins_by_employee": [
    {
      "employee_id": "e1",
      "employee_name": "Alice",
      "total_checkins": 8,
      "valid_checkins": 6,
      "success_rate": 75.0,
      "average_distance": 25.5
    }
  ],
  "checkins_by_doctor": [
    {
      "doctor_id": "d1",
      "doctor_name": "Dr. Smith",
      "total_checkins": 5,
      "valid_checkins": 4,
      "success_rate": 80.0
    }
  ]
}
```

**Frontend Action**: Display check-in analytics with success rates

---

#### 51. Daily Trends Analysis

**User Action**: Admin views daily trends
**API Endpoint**: `GET /api/v1/analytics/trends/daily?days=7`

**Success Response** (200):

```json
{
  "trend_direction": "increasing",
  "change_percentage": 15.5,
  "data_points": [
    {
      "date": "2024-01-15",
      "checkins": 5,
      "assignments": 2,
      "employees_active": 3
    }
  ],
  "period": "7 days",
  "summary": "Check-ins increased by 15.5% over the last 7 days"
}
```

**Frontend Action**: Display trend charts with direction indicators

---

#### 52. Generate Performance Report

**User Action**: Admin generates custom report
**API Endpoint**: `POST /api/v1/analytics/reports/generate`

**Request**:

```json
{
  "report_type": "performance",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-12-31T23:59:59Z",
  "filters": {
    "employee_ids": ["e1", "e2"],
    "doctor_ids": ["d1"],
    "status": ["ACTIVE", "COMPLETED"]
  }
}
```

**Success Response** (200):

```json
{
  "report_id": "r1234567",
  "report_type": "performance",
  "status": "generated",
  "summary": {
    "total_employees": 2,
    "total_assignments": 5,
    "completion_rate": 80.0,
    "average_productivity": 75.0
  },
  "generated_at": "2024-01-15T10:00:00Z",
  "expires_at": "2024-01-22T10:00:00Z"
}
```

**Frontend Action**: Show report generation success, provide download link

---

#### 53. CSV Export

**User Action**: Admin exports data as CSV
**API Endpoint**: `GET /api/v1/analytics/export/csv?data_type=employees`

**Success Response** (200): CSV file download
**Content-Type**: `text/csv`

**Frontend Action**: Trigger file download, show success message

---

#### 54. System Health Monitoring

**User Action**: Admin views system health
**API Endpoint**: `GET /api/v1/analytics/system/health`

**Success Response** (200):

```json
{
  "total_users": 5,
  "active_users": 4,
  "data_completeness": 95.0,
  "most_active_user": "Alice",
  "system_uptime": 99.5,
  "average_response_time": 150.0,
  "error_rate": 0.5,
  "database_health": "healthy",
  "last_backup": "2024-01-15T09:00:00Z"
}
```

**Frontend Action**: Display system health dashboard with status indicators

---

#### 55. Key Performance Indicators

**User Action**: Admin views KPIs
**API Endpoint**: `GET /api/v1/analytics/kpis`

**Success Response** (200):

```json
{
  "assignment_completion_rate": 62.5,
  "checkin_success_rate": 80.0,
  "employee_productivity": 75.0,
  "system_uptime": 99.5,
  "average_response_time": 150.0,
  "data_quality_score": 95.0
}
```

**Frontend Action**: Display KPI cards with performance indicators

---

### Integrated Workflow Scenarios

#### 56. Complete Admin Workflow

**User Action**: Admin manages complete employee lifecycle
**API Flow**:

1. Create employee → Create doctor → Create assignment → View analytics
2. Monitor progress → Generate reports → Export data

**Frontend Action**: Seamless navigation between admin features

---

#### 57. Complete Employee Workflow

**User Action**: Employee completes assignment cycle
**API Flow**:

1. Login → View assignments → Check-in at doctor → View notifications
2. Track progress → View profile analytics → Complete assignment

**Frontend Action**: Intuitive employee dashboard with progress tracking

---

#### 58. Assignment Completion Flow

**User Action**: Employee completes assignment through multiple check-ins
**API Flow**:

1. Multiple valid check-ins → Auto-progress updates → Assignment completion
2. Notification triggers → Status updates → Analytics updates

**Frontend Action**: Real-time progress updates with completion celebrations

---

#### 59. Real-time Notification Flow

**User Action**: User receives real-time notifications
**API Flow**:

1. Assignment created → Notification sent → Employee receives notification
2. Check-in completed → Admin notification → Status updates

**Frontend Action**: Real-time notification updates with polling/WebSocket

---

#### 60. Analytics Dashboard Flow

**User Action**: Admin monitors system performance
**API Flow**:

1. View dashboard → Drill down to specific metrics → Generate reports
2. Export data → Monitor trends → Take action based on insights

**Frontend Action**: Comprehensive analytics dashboard with interactive charts

---

## 📱 Frontend Implementation Notes

### Error Handling

- Always check for `error` field in error responses
- Display `message` field to users (user-friendly)
- Use `status` field for programmatic handling
- Handle 401/403 by redirecting to login

### Success Handling

- Store JWT token securely
- Include user role in app state
- Refresh data after successful operations
- Show success messages for user feedback

### Authentication Flow

1. User enters email/phone → Request OTP
2. User enters OTP → Verify & get JWT + user info
3. Store JWT token
4. Use JWT in all subsequent requests
5. Handle token expiration (redirect to login)
6. Logout clears token

### Role-Based UI

- **Admin**: Show employee management, doctor management, assignment management, analytics dashboard
- **Employee**: Show assignments, check-in functionality, notifications, profile analytics
- **Both**: Show notifications, profile, real-time updates

### New Features Implementation

#### Doctor Management (Admin)

- **Google Maps Integration**: Use Google Maps API for location selection
- **Geolocation Validation**: Display doctor location on map
- **Search & Filter**: Real-time search by name/specialization
- **CRUD Operations**: Full doctor lifecycle management

#### Assignment Management (Admin)

- **Progress Tracking**: Visual progress bars and completion indicators
- **Auto-completion**: Real-time status updates when targets are met
- **Filtering**: Advanced filters by employee, doctor, status
- **Bulk Operations**: Manage multiple assignments efficiently

#### Check-in System (Employee)

- **GPS Integration**: Use device GPS for location validation
- **Distance Calculation**: Show distance to doctor location
- **Map Display**: Display check-in locations on map
- **History Tracking**: Visual timeline of check-ins
- **Progress Updates**: Real-time assignment progress

#### Notifications (Both Roles)

- **Real-time Polling**: Poll every 30 seconds for updates
- **WebSocket Support**: Optional real-time notifications
- **Bulk Operations**: Mark multiple notifications as read
- **Actionable Notifications**: Direct navigation to relevant screens
- **NO Email**: App-only notifications

#### Analytics (Admin)

- **Dashboard Cards**: Key metrics and KPIs
- **Interactive Charts**: Performance trends and analytics
- **Report Generation**: Custom reports with filters
- **CSV Export**: Download analytics data
- **System Health**: Monitor system performance

### Dev Mode Notes

- OTP codes are printed to server console
- Welcome emails are printed to server console
- No actual email sending in development
- Use test credentials from seed data
- GPS coordinates are validated but not restricted in dev mode
- Notifications are stored in database (no email sending)
