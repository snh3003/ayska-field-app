# API Integration Documentation for Frontend Team

> **📋 Phase 1 Complete**: UI preparation and error handling updates are complete. See [API-INTEGRATION-PLAN.md](./API-INTEGRATION-PLAN.md) for the comprehensive frontend implementation guide.

## Overview

Create a comprehensive API documentation file that the frontend team can use to integrate with the backend API (Phases 1-4). This will include all implemented endpoints, authentication flow, error handling, and code examples.

## Answers to Integration Questions

**1. Base URL Structure:**

- **Local Development**: `http://localhost:8000`
- **API Base**: `http://localhost:8000/api/v1`
- **Swagger Docs**: `http://localhost:8000/docs`

**2. Implemented Endpoints (Ready for Integration):**
All Phase 1-4 endpoints are implemented and tested:

- Health Check (1 endpoint)
- Authentication (5 endpoints)
- Employee Management (6 endpoints)

**3. Doctor-Related Features:**

- **Status**: Not implemented yet (Phase 5)
- **Action**: FE team should skip/mock doctor-related screens for now
- **Note**: Doctor data exists in seed database but no API endpoints available

**4. Role Features:**

- **Integrate Both**: Admin and Employee features based on user role
- **Priority**: Start with Admin features (fully functional), then add Employee login/profile
- **Note**: Employee check-in features not ready yet (Phase 7)

**5. Missing Endpoints:**

- **Document Both**: Implemented endpoints (full details) + Planned endpoints (overview)
- **Purpose**: FE team knows what to mock and what's coming next

## Document Structure

### Section 1: Quick Start Guide

- Base URL configuration
- Authentication flow overview
- Required headers
- Dev vs Production differences

### Section 2: Authentication Flow

Step-by-step guide with examples:

1. Request OTP
2. Verify OTP & get JWT token
3. Store token
4. Use token in requests
5. Handle token expiration
6. Logout flow

### Section 3: HTTP Status Codes & Error Handling

- Success codes (200, 201)
- Client errors (400, 401, 403, 404, 422)
- Server errors (500)
- Error response format
- Common error scenarios

### Section 4: Common Headers & Request Format

- Authorization header format
- Content-Type headers
- Custom headers (X-Admin-Token)
- Request body format (JSON)

### Section 5: ✅ IMPLEMENTED ENDPOINTS

#### 5.1 Health Check

- `GET /health` - API health status

#### 5.2 Authentication Endpoints

- `POST /api/v1/auth/otp/request` - Request OTP
- `POST /api/v1/auth/otp/verify` - Verify OTP & get JWT
- `GET /api/v1/auth/profile` - Get current user profile
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/admin/create` - Create admin (protected)

#### 5.3 Employee Management (Admin Only)

- `POST /api/v1/admin/employees` - Create employee
- `GET /api/v1/admin/employees` - List employees (search, pagination)
- `GET /api/v1/admin/employees/{id}` - Get employee details
- `PUT /api/v1/admin/employees/{id}` - Update employee
- `DELETE /api/v1/admin/employees/{id}` - Delete employee (soft/hard)
- `POST /api/v1/admin/employees/{id}/reactivate` - Reactivate employee

### Section 6: 🚧 PLANNED ENDPOINTS (Not Yet Available)

- Doctor Management (Phase 5) - 6 endpoints
- Assignment Management (Phase 6) - 5 endpoints
- Check-in System (Phase 7) - 4 endpoints
- Notifications (Phase 8) - 3 endpoints
- Analytics (Phase 9) - 4 endpoints

### Section 7: Request/Response Examples

For each endpoint:

- curl example
- JavaScript fetch example
- Axios example
- Request payload (JSON)
- Success response (JSON)
- Error response examples

### Section 8: Dev Mode Notes

- OTP console logging behavior
- Email dev mode (no SendGrid needed)
- Test credentials from seed data
- Database reset instructions

### Section 9: TypeScript Interfaces

Type-safe interfaces for all requests/responses:

- Auth types
- Employee types
- Error types
- API response types

### Section 10: Integration Checklist

What to implement now vs later:

- ✅ Implement Now: Login, Admin Dashboard, Employee CRUD
- 🚧 Mock/Skip: Doctor screens, Check-ins, Assignments
- 📋 Coming Soon: Phases 5-9

## Implementation Steps

1. **Create `docs/API-INTEGRATION-V1.md`**

- Complete documentation with all sections above
- Include working code examples
- Add TypeScript interfaces

2. **For Each Endpoint, Document:**

- HTTP Method & Path
- Authentication requirements
- Request parameters (path, query, body)
- Request schema with required/optional fields
- Response schema with examples
- Error responses with status codes
- curl example
- JavaScript/TypeScript example

3. **Add Quick Reference Tables:**

- Endpoint summary table
- Status codes table
- Error codes table

4. **Include Testing Guide:**

- How to test with Swagger UI
- How to test with curl
- How to test with Postman
- Sample test data from seed_data.py

## Key Features of Documentation

- **Complete**: All Phase 1-4 endpoints documented
- **Accurate**: Based on actual implementation
- **Practical**: Real code examples (curl, JS, TS)
- **Clear**: Error handling and edge cases explained
- **Future-Ready**: Planned endpoints overview included
- **Dev-Friendly**: Dev mode, test data, troubleshooting tips
