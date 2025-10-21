# Ayska Field App - User Flow Documentation

## 🎯 Overview

This document outlines the complete user flow for both Admin and Employee roles in the Ayska Field App, including API endpoints and notification triggers.

---

## 👨‍💼 ADMIN USER FLOW

1. Admin opens app → **POST** `/api/v1/auth/login`
2. Gets profile data → **GET** `/api/v1/auth/me`
3. Views notifications → **GET** `/api/v1/notifications`
4. Creates Employee 1 → **POST** `/api/v1/admin/employees` → (notification triggered)
5. Creates Doctor 1 → **POST** `/api/v1/admin/doctors`
6. Creates Employee 2 → **POST** `/api/v1/admin/employees` → (notification triggered)
7. Creates Doctor 2 → **POST** `/api/v1/admin/doctors`
8. Creates Employee n → **POST** `/api/v1/admin/employees` → (notification triggered)
9. Creates Doctor n → **POST** `/api/v1/admin/doctors`
10. Views all employees → **GET** `/api/v1/admin/employees`
11. Views all doctors → **GET** `/api/v1/admin/doctors`
12. Selects Employee 1 → **GET** `/api/v1/admin/employees/:id`
13. Assigns Doctor A to Employee 1 → **POST** `/api/v1/admin/assignments` → (notification triggered)
14. Assigns Doctor B to Employee 1 → **POST** `/api/v1/admin/assignments` → (notification triggered)
15. Selects Employee 2 → **GET** `/api/v1/admin/employees/:id`
16. Assigns Doctor C to Employee 2 → **POST** `/api/v1/admin/assignments` → (notification triggered)
17. Views all assignments → **GET** `/api/v1/admin/assignments`
18. Views analytics dashboard → **GET** `/api/v1/admin/analytics`
19. Monitors specific employee → **GET** `/api/v1/admin/employees/:id`
20. Generates performance report → **GET** `/api/v1/admin/reports?type=employee_performance`
21. Updates employee info → **PUT** `/api/v1/admin/employees/:id`
22. Views notification details → **GET** `/api/v1/notifications/:id`
23. Marks notification as read → **PUT** `/api/v1/notifications/:id/read`
24. Logs out → **POST** `/api/v1/auth/logout`

---

## 👷 EMPLOYEE USER FLOW

### First-Time Login (with temporary password from email):

1. Employee receives email with temporary password (sent when admin creates account)
2. Employee opens app → **POST** `/api/v1/auth/login` (with temp password)
3. Backend detects `is_first_login=true` → Forces password change
4. Employee provides new password → Password updated, `is_first_login=false`
5. Employee is now logged in with new password

### Regular Login & Usage:

1. Employee opens app → **POST** `/api/v1/auth/login`
2. Gets profile data → **GET** `/api/v1/auth/me`
3. Views notifications → **GET** `/api/v1/notifications`
4. Marks notifications as read → **PUT** `/api/v1/notifications/:id/read`
5. Views assigned doctors → **GET** `/api/v1/employee/assignments`
6. Views profile with analytics → **GET** `/api/v1/employee/profile`
7. Views new assignment notification → **GET** `/api/v1/notifications` → (notification triggered)
8. Views notification details → **GET** `/api/v1/notifications/:id`
9. Marks assignment notification as read → **PUT** `/api/v1/notifications/:id/read`
10. Views Doctor 1 details → **GET** `/api/v1/employee/doctors/:id`
11. Navigates to doctor location (using map)
12. Checks in with Doctor 1 → **POST** `/api/v1/employee/checkin` → (notification triggered) (Admin notification)
13. Views updated assignments → **GET** `/api/v1/employee/assignments`
14. Views Doctor 2 details → **GET** `/api/v1/employee/doctors/:id`
15. Checks in with Doctor 2 → **POST** `/api/v1/employee/checkin` → (notification triggered) (Admin notification)
16. Views check-in history → **GET** `/api/v1/employee/checkin/history`
17. Views updated profile analytics → **GET** `/api/v1/employee/profile`
18. Logs out → **POST** `/api/v1/auth/logout`

---

## (notification triggered) NOTIFICATION TRIGGERS

### Admin Receives:

- **type: checkin** → When employee checks in with a doctor
- **type: alert** → Low performance, missed targets, or system issues
- **type: system** → Important system-wide announcements

### Employee Receives:

- **type: assignment** → When admin assigns new doctor
- **type: assignment** → When assignment is completed/cancelled
- **type: system** → App updates, policy changes
- **type: alert** → Reminder to complete pending visits

**Note**: Roundup notifications (daily/weekly summaries) will be implemented in v2

---

## 📊 FLOW SUMMARY

### Admin Workflow:

```
Login → Create Employees → Create Doctors → Assign Doctors to Employees → Monitor Performance → Generate Reports
```

### Employee Workflow:

```
Login → View Assignments → Navigate to Doctor → Check In → View Progress → Repeat for All Assignments
```

---

## 🔗 API Endpoints Summary

### Authentication

- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout

### Admin Endpoints

- `POST /api/v1/admin/employees` - Create employee
- `GET /api/v1/admin/employees` - List employees
- `GET /api/v1/admin/employees/:id` - Get employee details
- `PUT /api/v1/admin/employees/:id` - Update employee
- `POST /api/v1/admin/doctors` - Create doctor
- `GET /api/v1/admin/doctors` - List doctors
- `POST /api/v1/admin/assignments` - Create assignment
- `GET /api/v1/admin/assignments` - List assignments
- `GET /api/v1/admin/analytics` - Get analytics
- `GET /api/v1/admin/reports` - Generate reports

### Employee Endpoints

- `GET /api/v1/employee/assignments` - Get assignments
- `GET /api/v1/employee/doctors/:id` - Get doctor details
- `POST /api/v1/employee/checkin` - Check in at location
- `GET /api/v1/employee/checkin/history` - Get check-in history
- `GET /api/v1/employee/profile` - Get profile

### Notifications

- `GET /api/v1/notifications` - List notifications
- `GET /api/v1/notifications/:id` - Get notification details
- `PUT /api/v1/notifications/:id/read` - Mark as read

---

**Note**: All protected endpoints require `Authorization: Bearer <JWT_TOKEN>` header. Notifications are triggered automatically by backend based on user actions.
