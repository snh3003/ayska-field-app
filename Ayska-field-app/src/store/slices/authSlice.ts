import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import data from '../../fixtures/data.json';

export type UserRole = 'employee' | 'admin' | null;

interface AuthState {
  token: string | null;
  role: UserRole;
  userId: string | null;
  name: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  role: null,
  userId: null,
  name: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    await new Promise((r) => setTimeout(r, 300));
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return {
      token: `local-${user.id}`,
      role: user.role as Exclude<UserRole, null>,
      userId: user.id,
      name: user.name,
    };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; role: Exclude<UserRole, null> }>) {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    logout(state) {
      state.token = null;
      state.role = null;
      state.userId = null;
      state.name = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.userId = action.payload.userId;
        state.name = action.payload.name;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;


