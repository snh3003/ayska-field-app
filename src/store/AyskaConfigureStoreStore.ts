import { configureStore } from '@reduxjs/toolkit';
import { ServiceContainer } from '../di/ServiceContainer';
import authReducer from './slices/AyskaAuthSlice';
import adminReducer from './slices/AyskaAdminSlice';
import employeeReducer from './slices/AyskaEmployeeSlice';
import profileReducer from './slices/AyskaProfileSlice';
import notificationsReducer from './slices/AyskaNotificationsSlice';
import notificationReducer from './slices/AyskaNotificationSlice';
import onboardingReducer from './slices/AyskaOnboardingSlice';
import assignmentReducer from './slices/AyskaAssignmentSlice';
import checkInReducer from './slices/AyskaCheckInSlice';
import analyticsReducer from './slices/AyskaAnalyticsSlice';
import doctorReducer from './slices/AyskaDoctorSlice';

export const serviceContainer = new ServiceContainer();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    employee: employeeReducer,
    profile: profileReducer,
    notifications: notificationsReducer,
    notification: notificationReducer,
    onboarding: onboardingReducer,
    assignment: assignmentReducer,
    checkIn: checkInReducer,
    analytics: analyticsReducer,
    doctor: doctorReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          serviceContainer,
        },
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
