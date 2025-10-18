import { configureStore } from '@reduxjs/toolkit';
import { ServiceContainer } from '../di/ServiceContainer';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import employeeReducer from './slices/employeeSlice';
import notificationsReducer from './slices/notificationsSlice';

export const serviceContainer = new ServiceContainer();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    employee: employeeReducer,
    notifications: notificationsReducer,
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
