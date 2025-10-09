import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import { ApiClient } from '../../api/client';
import { AdminService } from '../../services/AdminService';
import type { TeamSales } from '../../types/api';

interface AdminState {
  teamSales: TeamSales | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  teamSales: null,
  loading: false,
  error: null,
};

const createAdminService = (state: RootState, dispatch: any) => {
  const api = new ApiClient({ baseURL: '', getState: () => state, dispatch });
  return new AdminService(api.axios);
};

export const fetchTeamSales = createAsyncThunk<
  TeamSales,
  { teamId: string },
  { state: RootState }
>('admin/fetchTeamSales', async ({ teamId }, thunkAPI) => {
  const service = createAdminService(thunkAPI.getState(), thunkAPI.dispatch);
  return service.getTeamSales(teamId);
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamSales.fulfilled, (state, action) => {
        state.loading = false;
        state.teamSales = action.payload;
      })
      .addCase(fetchTeamSales.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load team sales';
      });
  },
});

export const selectTeamSales = (state: RootState) => state.admin?.teamSales ?? null;
export const selectAdminLoading = (state: RootState) => state.admin?.loading ?? false;
export const selectAdminError = (state: RootState) => state.admin?.error ?? null;

export default adminSlice.reducer;


