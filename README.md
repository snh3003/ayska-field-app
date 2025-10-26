`Login Screen -> Android & iOS`
<img width="1095" height="809" alt="Screenshot 2025-10-10 at 2 29 52 AM" src="https://github.com/user-attachments/assets/898ff0da-9ded-4c7d-9f3d-3b677eaddfc1" />

`Admin Dashboard Android & Employee Dashboard iOS`
<img width="1095" height="809" alt="Screenshot 2025-10-10 at 2 30 09 AM" src="https://github.com/user-attachments/assets/4c034bcb-bbcb-410b-a6a2-e5a2f652b935" />

`Settings Page -> Android & iOS`
<img width="1095" height="809" alt="Screenshot 2025-10-10 at 2 30 18 AM" src="https://github.com/user-attachments/assets/20bd32a4-ca1c-4a27-9544-2ee9eaa26a77" />

`Employee Details -> Android & Doctor Details -> iOS`
<img width="1095" height="809" alt="Screenshot 2025-10-10 at 2 30 41 AM" src="https://github.com/user-attachments/assets/ee335900-103e-49a0-9a9b-951dc27d12a6" />

`Employee Details -> Android & Doctor Details -> iOS with extended CTS`
<img width="1095" height="809" alt="Screenshot 2025-10-10 at 2 30 48 AM" src="https://github.com/user-attachments/assets/4e933eb1-a927-49f7-a41c-767e4469e0fe" />

## Data Flow (API → services → store → UI)

This app includes a typed service layer and Redux Toolkit store to fetch and render employee activities, team sales, and reports.

### Services

- `src/api/client.ts`: Axios wrapper injecting Bearer token and handling 401 (dispatches logout) and single retry on network/5xx.
- `src/services/EmployeeService.ts`: `getActivities(employeeId)`, `submitActivity(payload)`.
- `src/services/AdminService.ts`: `getTeamSales(teamId)`.
- `src/services/ReportService.ts`: `getReports(start, end)`.

### Store

- `src/store/index.ts`: configureStore with `auth`, `employee`, `admin` reducers.
- `src/store/slices/authSlice.ts`: minimal token+role with `setCredentials`, `logout`.
- `src/store/slices/employeeSlice.ts`, `adminSlice.ts`: async thunks, loading/error states, selectors.

### UI examples

- `src/screens/EmployeeDashboard.tsx`, `src/screens/AdminDashboard.tsx` use store selectors and render minimal cards with loading/empty/error states.

### Mock data

Small fixtures in `src/fixtures/mockData.ts` for local demos/tests.

### Setup

```bash
npm install
npm run start
```

### Tests

```bash
npm run test
```

Jest tests in `__tests__/services/*.test.ts` mock axios and cover success/error paths.

## Development Guidelines

### Pre-commit Hooks

The project uses an automated pre-commit hook that **blocks commits** containing duplicate files with " 2" suffix (a common Cursor IDE issue).

**Test the hook:**

```bash
.git/hooks/pre-commit
```

**If hook blocks your commit:**

```bash
# 1. Compare duplicate with original
diff "file.ts" "file 2.ts"

# 2. Delete if identical, or merge changes then delete
rm "file 2.ts"

# 3. Commit again
git commit -m "Your message"
```

### Available Scripts

```bash
# Development
npm start                 # Start Expo dev server
npm run android          # Run on Android
npm run ios              # Run on iOS

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # TypeScript type checking
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode

# Duplicate File Management
npm run check-duplicates # Scan and clean duplicate files
npm run clean:duplicates # Alias for check-duplicates

# Pre-commit (runs automatically)
npm run pre-commit       # Duplicate check + linting
```

### Preventing Duplicate Files

Cursor IDE sometimes creates files with " 2" suffix. The pre-commit hook prevents these from being committed.

**Manual cleanup:**

```bash
npm run check-duplicates  # Interactive scan and cleanup
```

**See full documentation:** `docs/PREVENTING-DUPLICATE-FILES.md`
