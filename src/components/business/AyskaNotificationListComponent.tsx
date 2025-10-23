// Notification List Component - Complete UI for notification management
// Implements notification listing with filters, actions, and real-time updates

import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../contexts/ToastContext';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { AyskaTitleComponent } from '../ui/AyskaTitleComponent';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaActionButtonComponent } from '../ui/AyskaActionButtonComponent';
import { Card } from '../ui/AyskaCardComponent';
import { Skeleton } from '../feedback/AyskaSkeletonLoaderComponent';
import { EmptyState } from '../feedback/AyskaEmptyStateComponent';
import { ErrorBoundary } from '../feedback/AyskaErrorBoundaryComponent';
import {
  bulkMarkAsRead,
  clearError,
  deleteNotification,
  fetchNotifications,
  fetchNotificationStats,
  markAllAsRead,
  markNotificationAsRead,
  selectBulkOperation,
  selectNotificationError,
  selectNotificationFilters,
  selectNotificationLoading,
  selectNotificationPagination,
  selectNotifications,
  selectNotificationStats,
  setFilters,
} from '../../store/slices/AyskaNotificationSlice';
import type { AppDispatch } from '../../store';
import type { Notification } from '../../types/AyskaNotificationApiType';

interface NotificationListComponentProps {
  onNotificationSelect?: (_notification: Notification) => void;
  onMarkAllAsRead?: () => void;
  showFilters?: boolean;
  showBulkActions?: boolean;
  style?: any;
  accessibilityHint?: string;
}

export const NotificationListComponent: React.FC<
  NotificationListComponentProps
> = ({
  onNotificationSelect,
  onMarkAllAsRead,
  showFilters = true,
  showBulkActions = true,
  style,
  accessibilityHint,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();

  const notifications = useSelector(selectNotifications);
  const stats = useSelector(selectNotificationStats);
  const loading = useSelector(selectNotificationLoading);
  const error = useSelector(selectNotificationError);
  const pagination = useSelector(selectNotificationPagination);
  const filters = useSelector(selectNotificationFilters);
  const bulkOperation = useSelector(selectBulkOperation);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Load notifications on mount
  useEffect(() => {
    dispatch(fetchNotifications(filters));
    dispatch(fetchNotificationStats());
  }, [dispatch, filters]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    hapticFeedback.light();
    try {
      await Promise.all([
        dispatch(fetchNotifications(filters)),
        dispatch(fetchNotificationStats()),
      ]);
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to refresh notifications:', error);
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Handle load more
  const handleLoadMore = () => {
    if (pagination.hasNext && !loading) {
      const newFilters = { ...filters, page: pagination.page + 1 };
      dispatch(setFilters(newFilters));
      dispatch(fetchNotifications(newFilters));
    }
  };

  // Handle notification selection
  const handleNotificationSelect = (notification: Notification) => {
    hapticFeedback.light();
    onNotificationSelect?.(notification);

    // Mark as read if unread
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification.id));
    }
  };

  // Handle toggle selection
  const handleToggleSelection = (notificationId: string) => {
    hapticFeedback.light();
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Handle bulk mark as read
  const handleBulkMarkAsRead = async () => {
    if (selectedNotifications.length === 0) return;

    hapticFeedback.medium();
    try {
      await dispatch(
        bulkMarkAsRead({ notification_ids: selectedNotifications })
      );
      setSelectedNotifications([]);
      showToast({
        type: 'success',
        title: 'Success',
        message: `${selectedNotifications.length} notifications marked as read.`,
      });
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to bulk mark as read:', error);
      }
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    hapticFeedback.medium();
    try {
      await dispatch(markAllAsRead());
      setSelectedNotifications([]);
      showToast('All notifications marked as read.', 'success');
      onMarkAllAsRead?.();
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to mark all as read:', error);
      }
    }
  };

  // Handle delete notification
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleDeleteNotification = async (notificationId: string) => {
    // Reserved for individual notification delete feature
    hapticFeedback.medium();
    try {
      await dispatch(deleteNotification(notificationId));
      showToast('Notification deleted.', 'success');
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to delete notification:', error);
      }
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchNotifications(newFilters));
  };

  // Clear error
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearError());
    }
  }, [error, showToast, dispatch]);

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Render notification item
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <Card
      style={{
        marginBottom: 12,
        opacity: item.read ? 0.7 : 1,
        borderLeftWidth: item.read ? 0 : 3,
        borderLeftColor: item.read ? 'transparent' : '#3b82f6',
      }}
      onPress={() => handleNotificationSelect(item)}
      {...getA11yProps(`Notification: ${item.title}. ${item.message}`)}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
          <AyskaTitleComponent
            level={4}
            weight="semibold"
            style={{ marginBottom: 4 }}
          >
            {item.title}
          </AyskaTitleComponent>

          <AyskaTextComponent
            variant="body"
            color="textSecondary"
            numberOfLines={2}
            style={{ marginBottom: 8 }}
          >
            {item.message}
          </AyskaTextComponent>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <AyskaTextComponent variant="bodySmall" color="textSecondary">
              {formatTimestamp(item.timestamp)}
            </AyskaTextComponent>

            {!item.read && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#3b82f6',
                }}
              />
            )}
          </View>
        </View>

        {showBulkActions && (
          <AyskaActionButtonComponent
            variant="ghost"
            size="sm"
            onPress={() => handleToggleSelection(item.id)}
            style={{ marginLeft: 8 }}
            {...getA11yProps(`Select notification: ${item.title}`)}
          >
            {selectedNotifications.includes(item.id) ? '✓' : '○'}
          </AyskaActionButtonComponent>
        )}
      </View>
    </Card>
  );

  // Render loading skeleton
  if (loading && notifications.length === 0) {
    return (
      <View style={style}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Skeleton height={100} />
          </View>
        ))}
      </View>
    );
  }

  // Render empty state
  if (!loading && notifications.length === 0) {
    return (
      <EmptyState
        title="No Notifications"
        message="You don't have any notifications yet."
        style={style}
      />
    );
  }

  return (
    <ErrorBoundary style={style} accessibilityHint={accessibilityHint}>
      <AyskaTitleComponent level={2} weight="bold" style={{ marginBottom: 16 }}>
        Notifications
        {stats && (
          <AyskaTextComponent
            variant="body"
            color="textSecondary"
            style={{ marginTop: 4 }}
          >
            {pagination.total} total • {pagination.unreadCount} unread
          </AyskaTextComponent>
        )}
      </AyskaTitleComponent>

      {/* Filters and Actions */}
      {showFilters && (
        <View
          style={{ flexDirection: 'row', marginBottom: 16, flexWrap: 'wrap' }}
        >
          <AyskaActionButtonComponent
            variant={showUnreadOnly ? 'primary' : 'secondary'}
            size="sm"
            onPress={() => {
              setShowUnreadOnly(!showUnreadOnly);
              handleFilterChange({
                ...filters,
                read: showUnreadOnly ? undefined : false,
              });
            }}
            style={{ marginRight: 8, marginBottom: 8 }}
            {...getA11yProps('Filter unread notifications')}
          >
            {showUnreadOnly ? 'Show All' : 'Unread Only'}
          </AyskaActionButtonComponent>

          {showBulkActions && selectedNotifications.length > 0 && (
            <AyskaActionButtonComponent
              variant="secondary"
              size="sm"
              onPress={handleBulkMarkAsRead}
              loading={bulkOperation.loading}
              style={{ marginRight: 8, marginBottom: 8 }}
              {...getA11yProps(
                `Mark ${selectedNotifications.length} notifications as read`
              )}
            >
              Mark Selected Read
            </AyskaActionButtonComponent>
          )}

          {showBulkActions && pagination.unreadCount > 0 && (
            <AyskaActionButtonComponent
              variant="secondary"
              size="sm"
              onPress={handleMarkAllAsRead}
              loading={bulkOperation.loading}
              style={{ marginBottom: 8 }}
              {...getA11yProps('Mark all notifications as read')}
            >
              Mark All Read
            </AyskaActionButtonComponent>
          )}
        </View>
      )}

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ErrorBoundary>
  );
};
