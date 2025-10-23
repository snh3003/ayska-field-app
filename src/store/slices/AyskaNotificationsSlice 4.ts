import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '..';
import type { Notification } from '../../types';
import { ServiceContainer } from '../../di/ServiceContainer';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk<
  Notification[],
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('notifications/fetchNotifications', async (userId, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'INotificationsService'
  ) as any;
  return service.fetchNotifications(userId);
});

export const markAsRead = createAsyncThunk<
  void,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('notifications/markAsRead', async (notificationId, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'INotificationsService'
  ) as any;
  await service.markNotificationRead(notificationId);
});

export const markAllAsRead = createAsyncThunk<
  void,
  string,
  { state: RootState; extra: { serviceContainer: ServiceContainer } }
>('notifications/markAllAsRead', async (userId, thunkAPI) => {
  const service = thunkAPI.extra.serviceContainer.get(
    'INotificationsService'
  ) as any;
  await service.clearAllNotifications(userId);
});

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load notifications';
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          n => n.id === action.meta.arg
        );
        if (notification) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsRead.fulfilled, state => {
        state.notifications.forEach(notification => {
          notification.read = true;
        });
        state.unreadCount = 0;
      });
  },
});

export const selectNotifications = (state: RootState) =>
  state.notifications?.notifications ?? [];
export const selectUnreadCount = (state: RootState) =>
  state.notifications?.unreadCount ?? 0;
export const selectNotificationsLoading = (state: RootState) =>
  state.notifications?.loading ?? false;
export const selectNotificationsError = (state: RootState) =>
  state.notifications?.error ?? null;

export default notificationsSlice.reducer;
