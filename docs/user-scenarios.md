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

## 🚧 Planned Scenarios (Not Yet Available)

### Doctor Management (Phase 5)

- Create doctor
- List doctors
- Update doctor
- Delete doctor
- Search doctors by specialization

### Assignment Management (Phase 6)

- Assign employee to doctor
- List assignments
- Update assignment
- Complete assignment
- Cancel assignment

### Check-in System (Phase 7)

- Employee check-in at doctor location
- Validate check-in distance
- View check-in history
- Update assignment progress

### Notifications (Phase 8)

- Get notifications
- Mark notification as read
- Filter notifications by type

### Analytics (Phase 9)

- Dashboard metrics
- Employee performance
- Assignment completion rates
- Check-in trends

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

- Admin: Show employee management features
- Employee: Show check-in and assignment features
- Both: Show notifications and profile

### Dev Mode Notes

- OTP codes are printed to server console
- Welcome emails are printed to server console
- No actual email sending in development
- Use test credentials from seed data
