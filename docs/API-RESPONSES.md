# API Response Reference - Ayska Backend

**Version:** 1.0  
**Last Updated:** 2025-10-24  
**For Developers:** Complete reference of all HTTP responses

---

## Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Admin - Employee Management](#admin---employee-management)
3. [Admin - Doctor Management](#admin---doctor-management)
4. [Admin - Employee Task Assignment](#admin---employee-task-assignment)
5. [Employee - Assignments](#employee---assignments)
6. [Employee - Check-ins](#employee---check-ins)
7. [Employee - Doctors & Profile](#employee---doctors--profile)
8. [Analytics Endpoints](#analytics-endpoints)
9. [Notification Endpoints](#notification-endpoints)
10. [WebSocket Endpoints](#websocket-endpoints)
11. [Common Response Patterns](#common-response-patterns)

---

## Authentication Endpoints

### POST `/api/v1/auth/otp/request`

Request OTP code for login.

**Success Response (200)**

```json
{
  "message": "OTP sent successfully"
}
```

**Error Responses**

| Status | Error Code          | Message                                  | When                     |
| ------ | ------------------- | ---------------------------------------- | ------------------------ |
| 404    | `user_not_found`    | Account not found. Contact your admin.   | User doesn't exist in DB |
| 403    | `account_inactive`  | Account deactivated. Contact your admin. | User account is inactive |
| 500    | `email_send_failed` | Failed to send OTP. Try again.           | Email service failure    |

---

### POST `/api/v1/auth/otp/verify`

Verify OTP and get JWT token.

**Success Response (200)**

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

**Error Responses**

| Status | Error Code          | Message                                | When                            |
| ------ | ------------------- | -------------------------------------- | ------------------------------- |
| 400    | `otp_not_found`     | OTP not found. Request a new one.      | No OTP generated for identifier |
| 400    | `otp_expired`       | OTP expired. Request a new one.        | OTP older than 10 minutes       |
| 400    | `too_many_attempts` | Too many attempts. Request new OTP.    | More than 3 failed attempts     |
| 400    | `invalid_otp`       | Incorrect OTP. Try again.              | Wrong OTP code                  |
| 404    | `user_not_found`    | Account not found. Contact your admin. | User doesn't exist              |

---

### POST `/api/v1/auth/logout`

Logout user by blacklisting token.

**Success Response (200)**

```json
{
  "message": "Logged out successfully"
}
```

**Error Responses**

| Status | Error Code | Message      | When                     |
| ------ | ---------- | ------------ | ------------------------ |
| 401    | -          | Unauthorized | Invalid or missing token |

---

### GET `/api/v1/auth/profile`

Get current user profile.

**Success Response (200)**

```json
{
  "id": "e1",
  "email": "alice@field.co",
  "phone": "+91-9876543210",
  "name": "Alice",
  "role": "employee",
  "is_active": true,
  "age": 28,
  "area_of_operation": "Mumbai",
  "created_at": "2025-01-15T10:30:00"
}
```

**Error Responses**

| Status | Error Code | Message      | When                     |
| ------ | ---------- | ------------ | ------------------------ |
| 401    | -          | Unauthorized | Invalid or missing token |

---

### POST `/api/v1/auth/admin/create`

Create new admin account (Protected endpoint).

**Headers Required**

- `X-Admin-Token`: SECRET_ADMIN_TOKEN value

**Success Response (201)**

```json
{
  "message": "Admin created successfully. OTP sent to email for first login.",
  "admin_id": "a7f4e2d9",
  "email": "admin@ayska.co"
}
```

**Error Responses**

| Status | Error Code | Message                                                 | When                       |
| ------ | ---------- | ------------------------------------------------------- | -------------------------- |
| 401    | -          | Invalid or missing admin token. Access denied.          | Wrong X-Admin-Token header |
| 403    | -          | Only Ayska domain emails can be created as admins       | Non-@ayska.co email        |
| 409    | -          | User with email {email} or phone {phone} already exists | Duplicate user             |

---

## Admin - Employee Management

### POST `/api/v1/admin/employees`

Create new employee (Admin only).

**Success Response (201)**

```json
{
  "message": "Employee created successfully. Welcome email sent.",
  "employee_id": "e8a3b5c2",
  "email": "employee@field.co"
}
```

**Error Responses**

| Status | Error Code           | Message                        | When                           |
| ------ | -------------------- | ------------------------------ | ------------------------------ |
| 400    | `duplicate_employee` | Email or phone already exists. | Duplicate email/phone          |
| 401    | -                    | Unauthorized                   | Not logged in or invalid token |
| 401    | -                    | Admin access required          | User is not admin              |
| 422    | -                    | Validation error               | Invalid request data           |

---

### GET `/api/v1/admin/employees`

List all employees with pagination.

**Query Parameters**

- `page` (default: 1)
- `size` (default: 10, max: 100)
- `search` (optional)
- `include_inactive` (default: false)

**Success Response (200)**

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
      "area_of_operation": "Mumbai",
      "created_at": "2025-01-15T10:30:00",
      "updated_at": "2025-01-15T10:30:00",
      "created_by": "a1"
    }
  ],
  "total": 25,
  "page": 1,
  "size": 10,
  "has_next": true
}
```

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### GET `/api/v1/admin/employees/{employee_id}`

Get employee details by ID.

**Success Response (200)**

```json
{
  "id": "e1",
  "email": "alice@field.co",
  "phone": "+91-9876543210",
  "name": "Alice",
  "role": "employee",
  "is_active": true,
  "age": 28,
  "area_of_operation": "Mumbai",
  "created_at": "2025-01-15T10:30:00",
  "updated_at": "2025-01-15T10:30:00",
  "created_by": "a1"
}
```

**Error Responses**

| Status | Error Code           | Message               | When                |
| ------ | -------------------- | --------------------- | ------------------- |
| 404    | `employee_not_found` | Employee not found.   | Invalid employee_id |
| 401    | -                    | Admin access required | Not admin           |

---

### PUT `/api/v1/admin/employees/{employee_id}`

Update employee information.

**Success Response (200)**

```json
{
  "id": "e1",
  "email": "alice@field.co",
  "phone": "+91-9876543210",
  "name": "Alice Updated",
  "role": "employee",
  "is_active": true,
  "age": 29,
  "area_of_operation": "Mumbai",
  "created_at": "2025-01-15T10:30:00",
  "updated_at": "2025-10-24T12:00:00",
  "created_by": "a1"
}
```

**Error Responses**

| Status | Error Code           | Message                        | When                 |
| ------ | -------------------- | ------------------------------ | -------------------- |
| 404    | `employee_not_found` | Employee not found.            | Invalid employee_id  |
| 400    | `duplicate_contact`  | Email or phone already in use. | Email/phone conflict |
| 401    | -                    | Admin access required          | Not admin            |
| 422    | -                    | Validation error               | Invalid request data |

---

### DELETE `/api/v1/admin/employees/{employee_id}`

Delete employee (soft or hard).

**Query Parameters**

- `permanent` (default: false) - true for hard delete

**Success Response (200)**

```json
{
  "message": "Employee soft deleted successfully",
  "employee_id": "e1",
  "permanent": false
}
```

OR

```json
{
  "message": "Employee permanently deleted",
  "employee_id": "e1",
  "permanent": true
}
```

**Error Responses**

| Status | Error Code           | Message               | When                |
| ------ | -------------------- | --------------------- | ------------------- |
| 404    | `employee_not_found` | Employee not found.   | Invalid employee_id |
| 401    | -                    | Admin access required | Not admin           |

---

### POST `/api/v1/admin/employees/{employee_id}/reactivate`

Reactivate soft-deleted employee.

**Success Response (200)**

```json
{
  "message": "Employee reactivated successfully",
  "employee_id": "e1"
}
```

**Error Responses**

| Status | Error Code                | Message                     | When                |
| ------ | ------------------------- | --------------------------- | ------------------- |
| 404    | `employee_not_found`      | Employee not found.         | Invalid employee_id |
| 400    | `employee_already_active` | Employee is already active. | Already active      |
| 401    | -                         | Admin access required       | Not admin           |

---

## Admin - Doctor Management

### POST `/api/v1/admin/doctors`

Create new doctor.

**Success Response (201)**

```json
{
  "message": "Doctor created successfully",
  "doctor_id": "d3f8a1b4",
  "name": "Dr. Smith"
}
```

**Error Responses**

| Status | Error Code               | Message                                       | When                 |
| ------ | ------------------------ | --------------------------------------------- | -------------------- |
| 400    | `duplicate_doctor_phone` | Doctor with this phone number already exists. | Duplicate phone      |
| 401    | -                        | Admin access required                         | Not admin            |
| 422    | -                        | Validation error                              | Invalid request data |

---

### GET `/api/v1/admin/doctors`

List all doctors with pagination.

**Query Parameters**

- `page` (default: 1)
- `size` (default: 10, max: 100)
- `search` (optional)
- `specialization` (optional filter)

**Success Response (200)**

```json
{
  "doctors": [
    {
      "id": "d1",
      "name": "Dr. Smith",
      "specialization": "Cardiology",
      "age": 45,
      "phone": "+91-1234567890",
      "location_lat": 19.076,
      "location_lng": 72.8777,
      "location_address": "123 Medical St, Mumbai",
      "created_at": "2025-01-15T10:30:00",
      "updated_at": "2025-01-15T10:30:00",
      "created_by": "a1"
    }
  ],
  "total": 50,
  "page": 1,
  "size": 10,
  "has_next": true
}
```

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### GET `/api/v1/admin/doctors/{doctor_id}`

Get doctor details by ID.

**Success Response (200)**

```json
{
  "id": "d1",
  "name": "Dr. Smith",
  "specialization": "Cardiology",
  "age": 45,
  "phone": "+91-1234567890",
  "location_lat": 19.076,
  "location_lng": 72.8777,
  "location_address": "123 Medical St, Mumbai",
  "created_at": "2025-01-15T10:30:00",
  "updated_at": "2025-01-15T10:30:00",
  "created_by": "a1"
}
```

**Error Responses**

| Status | Error Code         | Message               | When              |
| ------ | ------------------ | --------------------- | ----------------- |
| 404    | `doctor_not_found` | Doctor not found.     | Invalid doctor_id |
| 401    | -                  | Admin access required | Not admin         |

---

### PUT `/api/v1/admin/doctors/{doctor_id}`

Update doctor information.

**Success Response (200)**

```json
{
  "id": "d1",
  "name": "Dr. Smith Updated",
  "specialization": "Cardiology",
  "age": 46,
  "phone": "+91-1234567890",
  "location_lat": 19.076,
  "location_lng": 72.8777,
  "location_address": "123 Medical St, Mumbai",
  "created_at": "2025-01-15T10:30:00",
  "updated_at": "2025-10-24T12:00:00",
  "created_by": "a1"
}
```

**Error Responses**

| Status | Error Code               | Message                                       | When                 |
| ------ | ------------------------ | --------------------------------------------- | -------------------- |
| 404    | `doctor_not_found`       | Doctor not found.                             | Invalid doctor_id    |
| 400    | `duplicate_doctor_phone` | Doctor with this phone number already exists. | Phone conflict       |
| 401    | -                        | Admin access required                         | Not admin            |
| 422    | -                        | Validation error                              | Invalid request data |

---

### DELETE `/api/v1/admin/doctors/{doctor_id}`

Delete doctor (always permanent).

**Success Response (200)**

```json
{
  "message": "Doctor permanently deleted",
  "doctor_id": "d1",
  "permanent": true
}
```

**Error Responses**

| Status | Error Code         | Message               | When              |
| ------ | ------------------ | --------------------- | ----------------- |
| 404    | `doctor_not_found` | Doctor not found.     | Invalid doctor_id |
| 401    | -                  | Admin access required | Not admin         |

---

## Admin - Employee Task Assignment

### POST `/api/v1/admin/assignments`

Create new assignment.

**Success Response (201)**

```json
{
  "message": "Assignment created successfully",
  "assignment_id": "a9b2c5f1",
  "employee_id": "e1",
  "doctor_id": "d1",
  "target": 10
}
```

**Error Responses**

| Status | Error Code           | Message                                                         | When                      |
| ------ | -------------------- | --------------------------------------------------------------- | ------------------------- |
| 400    | `employee_not_found` | Employee not found or inactive.                                 | Invalid/inactive employee |
| 400    | `doctor_not_found`   | Doctor not found.                                               | Invalid doctor_id         |
| 400    | `assignment_exists`  | Active assignment already exists for this employee-doctor pair. | Duplicate assignment      |
| 401    | -                    | Admin access required                                           | Not admin                 |
| 422    | -                    | Validation error                                                | Invalid request data      |

---

### GET `/api/v1/admin/assignments`

List all assignments with pagination.

**Query Parameters**

- `page` (default: 1)
- `size` (default: 10, max: 100)
- `search` (optional)
- `status` (optional: active, completed, cancelled)
- `employee_id` (optional filter)
- `doctor_id` (optional filter)

**Success Response (200)**

```json
{
  "assignments": [
    {
      "id": "a1",
      "employee_id": "e1",
      "doctor_id": "d1",
      "target": 10,
      "current_progress": 3,
      "status": "active",
      "progress_percentage": 30.0,
      "is_completed": false,
      "assigned_date": "2025-01-20",
      "created_at": "2025-01-20T09:00:00",
      "updated_at": "2025-01-22T14:30:00",
      "assigned_by": "a1",
      "employee_name": "Alice",
      "doctor_name": "Dr. Smith",
      "doctor_specialization": "Cardiology"
    }
  ],
  "total": 100,
  "page": 1,
  "size": 10,
  "has_next": true
}
```

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### GET `/api/v1/admin/assignments/{assignment_id}`

Get assignment details by ID.

**Success Response (200)**

```json
{
  "id": "a1",
  "employee_id": "e1",
  "doctor_id": "d1",
  "target": 10,
  "current_progress": 3,
  "status": "active",
  "progress_percentage": 30.0,
  "is_completed": false,
  "assigned_date": "2025-01-20",
  "created_at": "2025-01-20T09:00:00",
  "updated_at": "2025-01-22T14:30:00",
  "assigned_by": "a1",
  "employee_name": "Alice",
  "doctor_name": "Dr. Smith",
  "doctor_specialization": "Cardiology"
}
```

**Error Responses**

| Status | Error Code             | Message               | When                  |
| ------ | ---------------------- | --------------------- | --------------------- |
| 404    | `assignment_not_found` | Assignment not found. | Invalid assignment_id |
| 401    | -                      | Admin access required | Not admin             |

---

### PUT `/api/v1/admin/assignments/{assignment_id}`

Update assignment information.

**Success Response (200)**

```json
{
  "id": "a1",
  "employee_id": "e1",
  "doctor_id": "d1",
  "target": 15,
  "current_progress": 3,
  "status": "active",
  "progress_percentage": 20.0,
  "is_completed": false,
  "assigned_date": "2025-01-20",
  "created_at": "2025-01-20T09:00:00",
  "updated_at": "2025-10-24T12:00:00",
  "assigned_by": "a1",
  "employee_name": "Alice",
  "doctor_name": "Dr. Smith",
  "doctor_specialization": "Cardiology"
}
```

**Error Responses**

| Status | Error Code             | Message                                      | When                  |
| ------ | ---------------------- | -------------------------------------------- | --------------------- |
| 404    | `assignment_not_found` | Assignment not found.                        | Invalid assignment_id |
| 400    | `invalid_target`       | Target cannot be less than current progress. | Target < progress     |
| 400    | `invalid_progress`     | Progress cannot exceed target.               | Progress > target     |
| 401    | -                      | Admin access required                        | Not admin             |
| 422    | -                      | Validation error                             | Invalid request data  |

---

### DELETE `/api/v1/admin/assignments/{assignment_id}`

Delete assignment (permanent).

**Success Response (200)**

```json
{
  "message": "Assignment permanently deleted",
  "assignment_id": "a1",
  "status": "active"
}
```

**Error Responses**

| Status | Error Code             | Message               | When                  |
| ------ | ---------------------- | --------------------- | --------------------- |
| 404    | `assignment_not_found` | Assignment not found. | Invalid assignment_id |
| 401    | -                      | Admin access required | Not admin             |

---

### PUT `/api/v1/admin/assignments/{assignment_id}/progress`

Update assignment progress.

**Success Response (200)**

```json
{
  "id": "a1",
  "employee_id": "e1",
  "doctor_id": "d1",
  "target": 10,
  "current_progress": 5,
  "status": "active",
  "progress_percentage": 50.0,
  "is_completed": false,
  "assigned_date": "2025-01-20",
  "created_at": "2025-01-20T09:00:00",
  "updated_at": "2025-10-24T12:00:00",
  "assigned_by": "a1",
  "employee_name": "Alice",
  "doctor_name": "Dr. Smith",
  "doctor_specialization": "Cardiology"
}
```

**Error Responses**

| Status | Error Code             | Message                        | When                  |
| ------ | ---------------------- | ------------------------------ | --------------------- |
| 404    | `assignment_not_found` | Assignment not found.          | Invalid assignment_id |
| 400    | `invalid_progress`     | Progress cannot exceed target. | Progress > target     |
| 401    | -                      | Admin access required          | Not admin             |
| 422    | -                      | Validation error               | Invalid request data  |

**Note:** Auto-completes assignment when progress reaches target.

---

### PUT `/api/v1/admin/assignments/{assignment_id}/status`

Update assignment status.

**Success Response (200)**

```json
{
  "id": "a1",
  "employee_id": "e1",
  "doctor_id": "d1",
  "target": 10,
  "current_progress": 10,
  "status": "completed",
  "progress_percentage": 100.0,
  "is_completed": true,
  "assigned_date": "2025-01-20",
  "created_at": "2025-01-20T09:00:00",
  "updated_at": "2025-10-24T12:00:00",
  "assigned_by": "a1",
  "employee_name": "Alice",
  "doctor_name": "Dr. Smith",
  "doctor_specialization": "Cardiology"
}
```

**Error Responses**

| Status | Error Code              | Message                                 | When                  |
| ------ | ----------------------- | --------------------------------------- | --------------------- |
| 404    | `assignment_not_found`  | Assignment not found.                   | Invalid assignment_id |
| 400    | `invalid_status_change` | Cannot reactivate completed assignment. | Completed → Active    |
| 401    | -                       | Admin access required                   | Not admin             |
| 422    | -                       | Validation error                        | Invalid request data  |

---

## Employee - Assignments

### GET `/api/v1/employee/assignments`

Get my assignments (Employee only).

**Success Response (200)**

```json
{
  "assignments": [
    {
      "id": "a1",
      "doctor_id": "d1",
      "doctor_name": "Dr. Smith",
      "doctor_specialization": "Cardiology",
      "doctor_location": {
        "lat": 19.076,
        "lng": 72.8777,
        "address": "123 Medical St, Mumbai"
      },
      "target": 10,
      "current_progress": 3,
      "status": "active",
      "progress_percentage": 30.0,
      "is_completed": false,
      "assigned_date": "2025-01-20"
    }
  ],
  "total": 5,
  "active_assignments": 3,
  "completed_assignments": 2,
  "total_target_visits": 50,
  "total_completed_visits": 28,
  "overall_progress_percentage": 56.0
}
```

**Error Responses**

| Status | Error Code | Message                  | When         |
| ------ | ---------- | ------------------------ | ------------ |
| 401    | -          | Employee access required | Not employee |

---

## Employee - Check-ins

### POST `/api/v1/employee/checkin`

Check in at doctor location.

**Success Response (201)**

```json
{
  "message": "Check-in recorded successfully",
  "checkin_id": "c7f2e9a3",
  "is_valid": true,
  "distance_meters": 45.8,
  "assignment_progress": 4,
  "assignment_completed": false
}
```

OR (when assignment completes)

```json
{
  "message": "Check-in recorded successfully",
  "checkin_id": "c7f2e9a3",
  "is_valid": true,
  "distance_meters": 45.8,
  "assignment_progress": 10,
  "assignment_completed": true
}
```

OR (invalid check-in)

```json
{
  "message": "Check-in recorded successfully",
  "checkin_id": "c7f2e9a3",
  "is_valid": false,
  "distance_meters": 150.2,
  "assignment_progress": null,
  "assignment_completed": null
}
```

**Error Responses**

| Status | Error Code             | Message                                     | When                 |
| ------ | ---------------------- | ------------------------------------------- | -------------------- |
| 400    | `doctor_not_found`     | Doctor not found.                           | Invalid doctor_id    |
| 400    | `assignment_not_found` | No active assignment found for this doctor. | No assignment        |
| 401    | -                      | Employee access required                    | Not employee         |
| 422    | -                      | Validation error                            | Invalid request data |

**Note:** Check-in is recorded regardless of validity. Only valid check-ins (within 100m) update progress.

---

### GET `/api/v1/employee/checkin/history`

Get my check-in history.

**Query Parameters**

- `page` (default: 1)
- `size` (default: 10, max: 100)
- `doctor_id` (optional filter)
- `is_valid` (optional filter: true/false)

**Success Response (200)**

```json
{
  "checkins": [
    {
      "id": "c1",
      "employee_id": "e1",
      "doctor_id": "d1",
      "latitude": 19.0765,
      "longitude": 72.878,
      "is_valid": true,
      "distance_meters": 45.8,
      "max_radius_meters": 100.0,
      "notes": "Successful meeting with doctor",
      "checkin_time": "2025-01-22T14:30:00",
      "doctor_name": "Dr. Smith",
      "doctor_specialization": "Cardiology",
      "assignment_id": "a1",
      "assignment_progress": 4,
      "assignment_target": 10,
      "assignment_completed": false
    }
  ],
  "total": 25,
  "page": 1,
  "size": 10,
  "has_next": true,
  "valid_checkins": 20,
  "invalid_checkins": 5,
  "total_doctors_visited": 8
}
```

**Error Responses**

| Status | Error Code | Message                  | When         |
| ------ | ---------- | ------------------------ | ------------ |
| 401    | -          | Employee access required | Not employee |

---

## Employee - Doctors & Profile

### GET `/api/v1/employee/doctors/{doctor_id}`

Get doctor details with assignment info.

**Success Response (200)**

```json
{
  "id": "d1",
  "name": "Dr. Smith",
  "specialization": "Cardiology",
  "age": 45,
  "phone": "+91-1234567890",
  "location": {
    "lat": 19.076,
    "lng": 72.8777,
    "address": "123 Medical St, Mumbai"
  },
  "assignment_id": "a1",
  "assignment_target": 10,
  "assignment_progress": 3,
  "assignment_status": "active",
  "assignment_progress_percentage": 30.0
}
```

OR (no assignment)

```json
{
  "id": "d1",
  "name": "Dr. Smith",
  "specialization": "Cardiology",
  "age": 45,
  "phone": "+91-1234567890",
  "location": {
    "lat": 19.076,
    "lng": 72.8777,
    "address": "123 Medical St, Mumbai"
  },
  "assignment_id": null,
  "assignment_target": null,
  "assignment_progress": null,
  "assignment_status": null,
  "assignment_progress_percentage": null
}
```

**Error Responses**

| Status | Error Code         | Message                  | When              |
| ------ | ------------------ | ------------------------ | ----------------- |
| 404    | `doctor_not_found` | Doctor not found.        | Invalid doctor_id |
| 401    | -                  | Employee access required | Not employee      |

---

### GET `/api/v1/employee/profile`

Get my profile with analytics.

**Success Response (200)**

```json
{
  "id": "e1",
  "name": "Alice",
  "email": "alice@field.co",
  "phone": "+91-9876543210",
  "age": 28,
  "area_of_operation": "Mumbai",
  "is_active": true,
  "created_at": "2025-01-15T10:30:00",
  "total_assignments": 5,
  "active_assignments": 3,
  "completed_assignments": 2,
  "total_checkins": 25,
  "valid_checkins": 20,
  "invalid_checkins": 5,
  "success_rate": 80.0,
  "average_distance": 52.3,
  "most_visited_doctor": "Dr. Smith",
  "most_visited_specialization": "Cardiology"
}
```

**Error Responses**

| Status | Error Code | Message                  | When         |
| ------ | ---------- | ------------------------ | ------------ |
| 401    | -          | Employee access required | Not employee |

---

## Analytics Endpoints

### GET `/api/v1/analytics/dashboard`

Get comprehensive dashboard statistics.

**Success Response (200)**

```json
{
  "total_employees": 50,
  "active_employees": 45,
  "inactive_employees": 5,
  "total_doctors": 100,
  "total_assignments": 200,
  "active_assignments": 120,
  "completed_assignments": 70,
  "cancelled_assignments": 10,
  "assignment_completion_rate": 35.0,
  "total_checkins": 1500,
  "valid_checkins": 1200,
  "invalid_checkins": 300,
  "checkin_success_rate": 80.0,
  "average_distance": 55.6,
  "most_productive_employee": {
    "id": "e1",
    "name": "Alice",
    "total_checkins": 150
  },
  "recent_checkins_today": 45,
  "recent_checkins_this_week": 320,
  "assignments_created_this_week": 15
}
```

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### GET `/api/v1/analytics/employees/{employee_id}/performance`

Get performance analytics for specific employee.

**Success Response (200)**

```json
{
  "employee_id": "e1",
  "employee_name": "Alice",
  "total_assignments": 5,
  "active_assignments": 3,
  "completed_assignments": 2,
  "completion_rate": 40.0,
  "total_checkins": 25,
  "valid_checkins": 20,
  "invalid_checkins": 5,
  "checkin_success_rate": 80.0,
  "average_distance": 52.3,
  "most_visited_doctor": "Dr. Smith",
  "most_visited_specialization": "Cardiology",
  "total_target_visits": 50,
  "total_completed_visits": 20,
  "overall_progress_percentage": 40.0
}
```

**Error Responses**

| Status | Error Code           | Message               | When                |
| ------ | -------------------- | --------------------- | ------------------- |
| 404    | `employee_not_found` | Employee not found.   | Invalid employee_id |
| 401    | -                    | Admin access required | Not admin           |

---

### GET `/api/v1/analytics/assignments`

Get assignment analytics.

**Success Response (200)** - Returns comprehensive assignment statistics including completion rates, distributions, and trends.

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### GET `/api/v1/analytics/checkins`

Get check-in analytics.

**Success Response (200)** - Returns comprehensive check-in statistics including success rates, distance analytics, and trends.

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### GET `/api/v1/analytics/system/health`

Get system health analytics.

**Success Response (200)** - Returns system health metrics, data quality indicators, and usage statistics.

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### GET `/api/v1/analytics/kpis`

Get Key Performance Indicators.

**Success Response (200)** - Returns operational, business, and quality KPIs.

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### GET `/api/v1/analytics/employees/performance`

Get performance analytics for all employees (paginated).

**Query Parameters**

- `page` (default: 1)
- `size` (default: 10, max: 100)

**Success Response (200)** - Returns array of employee performance data.

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### GET `/api/v1/analytics/trends/daily`

Get daily trend data.

**Query Parameters**

- `days` (default: 7, max: 30)

**Success Response (200)**

```json
{
  "period": "daily",
  "data_points": [
    { "date": "2025-10-17", "checkins": 45 },
    { "date": "2025-10-18", "checkins": 52 },
    { "date": "2025-10-19", "checkins": 48 }
  ],
  "trend_direction": "up",
  "change_percentage": 8.5
}
```

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### GET `/api/v1/analytics/trends/weekly`

Get weekly trend data.

**Query Parameters**

- `weeks` (default: 4, max: 12)

**Success Response (200)**

```json
{
  "period": "weekly",
  "data_points": [
    { "week": "2025-W41", "success_rate": 78.5 },
    { "week": "2025-W42", "success_rate": 82.3 }
  ],
  "trend_direction": "up",
  "change_percentage": 4.8
}
```

**Error Responses**

| Status | Error Code | Message               | When      |
| ------ | ---------- | --------------------- | --------- |
| 401    | -          | Admin access required | Not admin |

---

### POST `/api/v1/analytics/reports/generate`

Generate custom analytics report.

**Request Body**

```json
{
  "report_type": "performance",
  "start_date": "2025-01-01",
  "end_date": "2025-10-24",
  "employee_ids": ["e1", "e2"],
  "doctor_ids": null,
  "assignment_status": null
}
```

**Report Types:** `performance`, `assignments`, `checkins`, `system`

**Success Response (201)**

```json
{
  "report_id": "rpt7a3f9b2",
  "report_type": "performance",
  "generated_at": "2025-10-24T12:00:00",
  "data": {
    /* Report-specific data */
  },
  "summary": {
    "total_employees": 2,
    "average_completion_rate": 72.5
  },
  "filters_applied": {
    "start_date": "2025-01-01",
    "end_date": "2025-10-24",
    "employee_ids": ["e1", "e2"],
    "doctor_ids": null,
    "assignment_status": null
  }
}
```

**Error Responses**

| Status | Error Code            | Message                                                                         | When       |
| ------ | --------------------- | ------------------------------------------------------------------------------- | ---------- |
| 400    | `invalid_report_type` | Invalid report type. Must be one of: performance, assignments, checkins, system | Wrong type |
| 401    | -                     | Admin access required                                                           | Not admin  |

---

### GET `/api/v1/analytics/export/csv`

Export analytics data as CSV.

**Query Parameters**

- `data_type` (required): `employees`, `assignments`, or `checkins`

**Success Response (200)** - Returns CSV file with appropriate headers.

**Error Responses**

| Status | Error Code          | Message                                                             | When       |
| ------ | ------------------- | ------------------------------------------------------------------- | ---------- |
| 400    | `invalid_data_type` | Invalid data type. Must be one of: employees, assignments, checkins | Wrong type |
| 401    | -                   | Admin access required                                               | Not admin  |

---

## Notification Endpoints

### GET `/api/v1/notifications`

Get my notifications (both Admin and Employee).

**Query Parameters**

- `page` (default: 1)
- `size` (default: 10, max: 100)
- `type` (optional filter)
- `read` (optional filter: true/false)
- `actionable` (optional filter: true/false)

**Success Response (200)**

```json
{
  "notifications": [
    {
      "id": "n1",
      "user_id": "e1",
      "user_role": "employee",
      "type": "assignment_created",
      "title": "New Assignment",
      "message": "You have been assigned to visit Dr. Smith",
      "read": false,
      "actionable": true,
      "action_data": {
        "assignment_id": "a1",
        "doctor_id": "d1"
      },
      "timestamp": "2025-01-20T09:00:00",
      "created_at": "2025-01-20T09:00:00"
    }
  ],
  "total": 50,
  "unread_count": 12,
  "page": 1,
  "size": 10,
  "has_next": true
}
```

**Error Responses**

| Status | Error Code | Message      | When          |
| ------ | ---------- | ------------ | ------------- |
| 401    | -          | Unauthorized | Not logged in |

---

### GET `/api/v1/notifications/stats`

Get notification statistics.

**Success Response (200)**

```json
{
  "total_notifications": 50,
  "unread_notifications": 12,
  "read_notifications": 38,
  "notifications_by_type": {
    "assignment_created": 15,
    "assignment_completed": 10,
    "checkin_completed": 25
  },
  "recent_notifications": [
    /* Last 5 notifications */
  ]
}
```

**Error Responses**

| Status | Error Code | Message      | When          |
| ------ | ---------- | ------------ | ------------- |
| 401    | -          | Unauthorized | Not logged in |

---

### GET `/api/v1/notifications/{notification_id}`

Get notification details.

**Success Response (200)**

```json
{
  "id": "n1",
  "user_id": "e1",
  "user_role": "employee",
  "type": "assignment_created",
  "title": "New Assignment",
  "message": "You have been assigned to visit Dr. Smith",
  "read": false,
  "actionable": true,
  "action_data": {
    "assignment_id": "a1",
    "doctor_id": "d1"
  },
  "timestamp": "2025-01-20T09:00:00",
  "created_at": "2025-01-20T09:00:00"
}
```

**Error Responses**

| Status | Error Code               | Message                 | When                                         |
| ------ | ------------------------ | ----------------------- | -------------------------------------------- |
| 404    | `notification_not_found` | Notification not found. | Invalid notification_id or not owned by user |
| 401    | -                        | Unauthorized            | Not logged in                                |

---

### PUT `/api/v1/notifications/{notification_id}/read`

Mark notification as read.

**Success Response (200)**

```json
{
  "message": "Notification marked as read",
  "notification_id": "n1",
  "read": true
}
```

**Error Responses**

| Status | Error Code               | Message                 | When                                         |
| ------ | ------------------------ | ----------------------- | -------------------------------------------- |
| 404    | `notification_not_found` | Notification not found. | Invalid notification_id or not owned by user |
| 401    | -                        | Unauthorized            | Not logged in                                |

---

### PUT `/api/v1/notifications/bulk/read`

Mark multiple notifications as read.

**Request Body**

```json
{
  "notification_ids": ["n1", "n2", "n3"]
}
```

**Success Response (200)**

```json
{
  "message": "Marked 3 notifications as read",
  "updated_count": 3,
  "notification_ids": ["n1", "n2", "n3"]
}
```

**Error Responses**

| Status | Error Code | Message          | When                 |
| ------ | ---------- | ---------------- | -------------------- |
| 400    | -          | Validation error | Invalid request data |
| 401    | -          | Unauthorized     | Not logged in        |

**Note:** Max 100 notifications per request. Only updates notifications owned by user.

---

### PUT `/api/v1/notifications/all/read`

Mark all notifications as read.

**Success Response (200)**

```json
{
  "message": "Marked 12 notifications as read",
  "notification_id": "all",
  "read": true
}
```

**Error Responses**

| Status | Error Code | Message      | When          |
| ------ | ---------- | ------------ | ------------- |
| 401    | -          | Unauthorized | Not logged in |

---

### DELETE `/api/v1/notifications/{notification_id}`

Delete notification (permanent).

**Success Response (200)**

```json
{
  "message": "Notification deleted successfully",
  "notification_id": "n1"
}
```

**Error Responses**

| Status | Error Code               | Message                 | When                                         |
| ------ | ------------------------ | ----------------------- | -------------------------------------------- |
| 404    | `notification_not_found` | Notification not found. | Invalid notification_id or not owned by user |
| 401    | -                        | Unauthorized            | Not logged in                                |

---

## WebSocket Endpoints

### WS `/ws/notifications/{user_id}`

WebSocket endpoint for real-time notifications.

**Connection** - Opens persistent WebSocket connection.

**Message Types Received**

1. **Notification Message**

```json
{
  "type": "notification",
  "data": {
    "id": "n1",
    "type": "assignment_created",
    "title": "New Assignment",
    "message": "You have been assigned to visit Dr. Smith"
  },
  "timestamp": "2025-01-20T09:00:00"
}
```

2. **System Message**

```json
{
  "type": "system",
  "message": "System maintenance in 10 minutes",
  "timestamp": "2025-01-20T09:00:00"
}
```

3. **Pong Response** (reply to ping)

```json
{
  "type": "pong",
  "timestamp": "2025-01-20T09:00:00"
}
```

**Message Types Sent**

1. **Ping** (keep-alive)

```json
{
  "type": "ping"
}
```

**Connection Closure**

| Code | Reason         | When             |
| ---- | -------------- | ---------------- |
| 1008 | User not found | Invalid user_id  |
| 1000 | Normal closure | Clean disconnect |

---

### GET `/ws/health`

WebSocket system health check.

**Success Response (200)**

```json
{
  "status": "healthy",
  "active_connections": 25,
  "active_users": 20,
  "message": "WebSocket system is running"
}
```

---

### GET `/ws/connections`

Get WebSocket connection status.

**Success Response (200)**

```json
{
  "active_connections": {
    "e1": 2,
    "e2": 1,
    "a1": 1
  },
  "total_connections": 4,
  "active_users": ["e1", "e2", "a1"]
}
```

---

## Common Response Patterns

### Authentication Errors

All authenticated endpoints return:

**401 Unauthorized**

```json
{
  "detail": "Not authenticated"
}
```

OR

```json
{
  "detail": "Invalid authentication credentials"
}
```

OR

```json
{
  "detail": "Token has expired"
}
```

OR

```json
{
  "detail": "Token has been revoked"
}
```

### Authorization Errors

**401 Unauthorized** (Not admin)

```json
{
  "detail": "Admin access required"
}
```

**401 Unauthorized** (Not employee)

```json
{
  "detail": "Employee access required"
}
```

### Validation Errors

**422 Unprocessable Entity**

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Standard Error Response Format

Most endpoints return errors in this format:

```json
{
  "error": "error_code_identifier",
  "message": "User-friendly error message",
  "status": 400
}
```

### Pagination Pattern

Endpoints with pagination follow this pattern:

```json
{
  "items": [
    /* Array of items */
  ],
  "total": 100,
  "page": 1,
  "size": 10,
  "has_next": true
}
```

---

## Response Headers

All responses include:

```
Content-Type: application/json
```

CSV exports include:

```
Content-Type: text/csv
Content-Disposition: attachment; filename={filename}.csv
```

---

## HTTP Status Code Summary

| Code | Meaning               | Usage                                        |
| ---- | --------------------- | -------------------------------------------- |
| 200  | OK                    | Successful GET/PUT/DELETE                    |
| 201  | Created               | Successful POST (resource created)           |
| 400  | Bad Request           | Invalid request data or business logic error |
| 401  | Unauthorized          | Authentication required or failed            |
| 403  | Forbidden             | Authenticated but insufficient permissions   |
| 404  | Not Found             | Resource doesn't exist                       |
| 409  | Conflict              | Duplicate resource                           |
| 422  | Unprocessable Entity  | Validation error                             |
| 500  | Internal Server Error | Server-side error                            |

---

## Notification Types

| Type                   | Triggered When             | Recipients           |
| ---------------------- | -------------------------- | -------------------- |
| `assignment_created`   | Admin creates assignment   | Employee             |
| `assignment_completed` | Assignment target reached  | Employee + Admin     |
| `checkin_completed`    | Employee checks in         | Admin                |
| `system_message`       | Manual system notification | All or role-specific |

---

## Assignment Status Values

| Status      | Meaning                     |
| ----------- | --------------------------- |
| `active`    | Currently in progress       |
| `completed` | Target reached              |
| `cancelled` | Manually cancelled by admin |

---

## Notes for Frontend Developers

1. **Token Management**: Store JWT securely, include in all authenticated requests as `Authorization: Bearer {token}`.

2. **Error Handling**: Always check for `error` field in response body for user-friendly messages.

3. **Pagination**: Use `has_next` to determine if more pages exist.

4. **Check-in Validation**: Check-ins are recorded even if invalid (outside 100m radius). Only valid check-ins update progress.

5. **Assignment Auto-completion**: When progress reaches target, status automatically changes to "completed".

6. **Notification Polling**: Poll `/api/v1/notifications` every 30-60 seconds for new notifications. Use `unread_count` in response.

7. **WebSocket Optional**: WebSocket is optional for real-time notifications. Polling is the primary method.

8. **CSV Exports**: Use `data_type` query parameter to specify export type.

---

**End of Documentation**
