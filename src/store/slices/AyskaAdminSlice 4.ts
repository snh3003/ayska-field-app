import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { TeamSales } from '../../types/AyskaApiType';
import { ServiceContainer } from '../../di/ServiceContainer';

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

export const fetchTeamSales = createAsyncThunk<
  TeamSales,
  { teamId: string },
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('admin/fetchTeamSales', async ({ teamId }, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get('IAdminService') as any;
  return service.getTeamSales(teamId);
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTeamSales.pending, state => {
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

export const selectTeamSales = (state: RootState) =>
  state.admin?.teamSales ?? null;
export const selectAdminLoading = (state: RootState) =>
  state.admin?.loading ?? false;
export const selectAdminError = (state: RootState) =>
  state.admin?.error ?? null;

export default adminSlice.reducer;
