import { configureStore } from '@reduxjs/toolkit';
import { ServiceContainer } from '../di/ServiceContainer';
import authReducer from './slices/AyskaAuthSliceSlice';
import adminReducer from './slices/AyskaAdminSliceSlice';
import employeeReducer from './slices/AyskaEmployeeSliceSlice';
import profileReducer from './slices/AyskaProfileSliceSlice';
import notificationsReducer from './slices/AyskaNotificationsSliceSlice';
import onboardingReducer from './slices/AyskaOnboardingSliceSlice';
import assignmentReducer from './slices/AyskaAssignmentSliceSlice';
import checkInReducer from './slices/AyskaCheckInSliceSlice';
import analyticsReducer from './slices/AyskaAnalyticsSliceSlice';

export const serviceContainer = new ServiceContainer();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    employee: employeeReducer,
    profile: profileReducer,
    notifications: notificationsReducer,
    onboarding: onboardingReducer,
    assignment: assignmentReducer,
    checkIn: checkInReducer,
    analytics: analyticsReducer,
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
