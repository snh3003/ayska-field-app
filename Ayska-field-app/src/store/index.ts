import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';
import employeeReducer from './slices/employeeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    admin: adminReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


