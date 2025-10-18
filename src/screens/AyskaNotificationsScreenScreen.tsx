import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NotificationCard } from '../components/business/AyskaNotificationCardComponent';
import { EmptyState } from '../components/feedback/AyskaEmptyStateComponent';
import { ListItemSkeleton } from '../components/feedback/AyskaSkeletonLoaderComponent';
import { ThemeToggle } from '../components/layout/AyskaThemeToggleComponent';
import { Logo } from '../components/layout/AyskaLogoComponent';
import type { RootState } from '../store';
import {
  fetchNotifications,
  markAllAsRead,
  markAsRead,
} from '../store/slices/AyskaNotificationsSliceSlice';
import { Notification } from '../types';
import { hapticFeedback } from '../../utils/haptics';

type FilterType = 'all' | 'unread';

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<FilterType>('all');

  const dispatch = useDispatch();
  const { userId } = useSelector((s: RootState) => s.auth);
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const loading = useSelector(selectNotificationsLoading);
  // const error = useSelector(selectNotificationsError);

  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const loadNotifications = useCallback(() => {
    if (userId) {
      dispatch(fetchNotifications(userId) as any);
    }
  }, [dispatch, userId]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = useCallback(() => {
    hapticFeedback.light();
    loadNotifications();
  }, [loadNotifications]);

  const handleNotificationPress = (notification: Notification) => {
    hapticFeedback.light();

    if (!notification.read) {
      dispatch(markAsRead(notification.id) as any);
    }

    if (notification.actionable && notification.actionData?.route) {
      // Navigate to dedicated detail page
      router.push(`/notification/${notification.id}` as any);
    }
    // Non-actionable: just mark as read, no feedback
  };

  const handleMarkAsRead = (notificationId: string) => {
    dispatch(markAsRead(notificationId) as any);
  };

  const handleMarkAllAsRead = () => {
    if (userId && unreadCount > 0) {
      hapticFeedback.medium();
      dispatch(markAllAsRead(userId) as any);
    }
  };

  const handleFilterChange = (newFilter: FilterType) => {
    hapticFeedback.light();
    setFilter(newFilter);
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') {
      return !notification.read;
    }
    return true;
  });

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationCard
      notification={item}
      onPress={handleNotificationPress}
      onMarkRead={handleMarkAsRead}
      style={{ marginBottom: Spacing.sm }}
    />
  );

  const renderEmptyState = () => {
    if (loading) {
      return <ListItemSkeleton />;
    }

    const emptyConfig = {
      all: {
        icon: 'notifications-outline',
        title: 'No Notifications',
        message: 'You have no notifications yet',
      },
      unread: {
        icon: 'checkmark-done-outline',
        title: 'All Caught Up!',
        message: 'You have no unread notifications',
      },
    };

    return (
      <EmptyState
        icon={emptyConfig[filter].icon as any}
        title={emptyConfig[filter].title}
        message={emptyConfig[filter].message}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <TamaguiView
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={Spacing.lg}
        paddingVertical={Spacing.md}
        borderBottomWidth={1}
        borderBottomColor={theme.border}
      >
        <TamaguiView flexDirection="row" alignItems="center" flex={1}>
          <Logo size="small" />
          <TamaguiText
            fontSize="$6"
            fontWeight="700"
            color="$text"
            marginLeft="$md"
          >
            Notifications
          </TamaguiText>
        </TamaguiView>

        <TamaguiView flexDirection="row" alignItems="center" gap="$sm">
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={handleMarkAllAsRead}
              style={{
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.xs,
                borderRadius: 8,
                backgroundColor: theme.primaryBg,
              }}
            >
              <TamaguiText fontSize="$2" fontWeight="600" color="$primary">
                Mark All Read
              </TamaguiText>
            </TouchableOpacity>
          )}
          <ThemeToggle />
        </TamaguiView>
      </TamaguiView>

      {/* Filter Tabs */}
      <TamaguiView
        flexDirection="row"
        paddingHorizontal={Spacing.lg}
        paddingVertical={Spacing.md}
        gap="$sm"
      >
        <TouchableOpacity
          onPress={() => handleFilterChange('all')}
          style={{
            flex: 1,
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: 8,
            backgroundColor: filter === 'all' ? theme.primary : theme.card,
            alignItems: 'center',
          }}
        >
          <TamaguiText
            fontSize="$3"
            fontWeight="600"
            color={filter === 'all' ? '$background' : '$text'}
          >
            All ({notifications.length})
          </TamaguiText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleFilterChange('unread')}
          style={{
            flex: 1,
            paddingVertical: Spacing.sm,
            paddingHorizontal: Spacing.md,
            borderRadius: 8,
            backgroundColor: filter === 'unread' ? theme.primary : theme.card,
            alignItems: 'center',
          }}
        >
          <TamaguiView flexDirection="row" alignItems="center" gap="$xs">
            <TamaguiText
              fontSize="$3"
              fontWeight="600"
              color={filter === 'unread' ? '$background' : '$text'}
            >
              Unread ({unreadCount})
            </TamaguiText>
            {unreadCount > 0 && (
              <TamaguiView
                width={6}
                height={6}
                borderRadius={3}
                backgroundColor={
                  filter === 'unread' ? '$background' : '$primary'
                }
              />
            )}
          </TamaguiView>
        </TouchableOpacity>
      </TamaguiView>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          padding: Spacing.lg,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// Selectors
const selectNotifications = (state: RootState) =>
  state.notifications?.notifications ?? [];
const selectUnreadCount = (state: RootState) =>
  state.notifications?.unreadCount ?? 0;
const selectNotificationsLoading = (state: RootState) =>
  state.notifications?.loading ?? false;
// const selectNotificationsError = (state: RootState) => state.notifications?.error ?? null;
