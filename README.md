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

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
