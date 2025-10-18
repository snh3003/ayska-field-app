import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';

import { HapticTab } from '@/src/components/ui/AyskaHapticTabComponent';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { RootState } from '@/src/store';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const unreadCount = useSelector(
    (s: RootState) => s.notifications?.unreadCount ?? 0
  );

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        headerShown: false,
        tabBarButton: (props: any) => <HapticTab {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, focused }) => (
            <TamaguiView position="relative">
              <Ionicons
                name={focused ? 'notifications' : 'notifications-outline'}
                size={24}
                color={color}
              />
              {unreadCount > 0 && (
                <TamaguiView
                  position="absolute"
                  top={-4}
                  right={-8}
                  minWidth={16}
                  height={16}
                  borderRadius={8}
                  backgroundColor="$error"
                  justifyContent="center"
                  alignItems="center"
                  paddingHorizontal={4}
                >
                  <TamaguiText
                    fontSize={10}
                    fontWeight="600"
                    color="$background"
                    textAlign="center"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount.toString()}
                  </TamaguiText>
                </TamaguiView>
              )}
            </TamaguiView>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
