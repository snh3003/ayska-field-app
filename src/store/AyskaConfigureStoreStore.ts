import { configureStore } from '@reduxjs/toolkit';
import { ServiceContainer } from '../di/ServiceContainer';
import authReducer from './slices/AyskaAuthSlice';
import adminReducer from './slices/AyskaAdminSlice';
import employeeReducer from './slices/AyskaEmployeeSlice';
import employeeViewReducer from './slices/AyskaEmployeeViewSlice';
import profileReducer from './slices/AyskaProfileSlice';
import notificationsReducer from './slices/AyskaNotificationsSlice';
import notificationReducer from './slices/AyskaNotificationSlice';
import onboardingReducer from './slices/AyskaOnboardingSlice';
import assignmentReducer from './slices/AyskaAssignmentSlice';
import checkinReducer from './slices/AyskaCheckInSlice';
import analyticsReducer from './slices/AyskaAnalyticsSlice';
import doctorReducer from './slices/AyskaDoctorSlice';

export const serviceContainer = new ServiceContainer();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    employee: employeeReducer,
    employeeView: employeeViewReducer,
    profile: profileReducer,
    notifications: notificationsReducer,
    notification: notificationReducer,
    onboarding: onboardingReducer,
    assignment: assignmentReducer,
    checkin: checkinReducer,
    analytics: analyticsReducer,
    doctor: doctorReducer,
  },
  middleware: (getDefaultMiddleware) =>
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
