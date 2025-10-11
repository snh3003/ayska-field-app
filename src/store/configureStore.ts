import { configureStore } from '@reduxjs/toolkit';
import { ServiceContainer } from '../di/ServiceContainer';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import employeeReducer from './slices/employeeSlice';

export const serviceContainer = new ServiceContainer();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    employee: employeeReducer,
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
