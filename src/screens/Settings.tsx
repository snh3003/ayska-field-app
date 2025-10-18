import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Alert, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../components/ui/Card';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import { Logo } from '../components/layout/Logo';
import type { RootState } from '../store';
import { logout } from '../store/slices/authSlice';

export default function Settings() {
  const { name, role } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
          router.replace('/login');
        },
      },
    ]);
  };

  const settingsItems = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications-outline',
      iconColor: theme.primary,
      iconBgColor: theme.primaryBg,
      onPress: () =>
        Alert.alert('Notifications', 'Notification settings coming soon!'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: 'shield-checkmark-outline',
      iconColor: theme.success,
      iconBgColor: theme.successBg,
      onPress: () => Alert.alert('Privacy', 'Privacy settings coming soon!'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      iconColor: theme.info,
      iconBgColor: theme.infoBg,
      onPress: () => Alert.alert('Help', 'Help center coming soon!'),
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      iconColor: theme.secondary,
      iconBgColor: theme.secondaryBg,
      onPress: () => Alert.alert('About', 'Field Sales Tracker v1.0.0'),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.lg }}
      >
        {/* Header */}
        <TamaguiView
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$lg"
        >
          <TamaguiText fontSize="$6" fontWeight="700" color="$text">
            Settings
          </TamaguiText>
          <ThemeToggle />
        </TamaguiView>

        {/* Logo & Brand */}
        <TamaguiView alignItems="center" marginBottom="$xl" marginTop="$md">
          <Logo size="responsive" matchCardWidth={true} />
        </TamaguiView>

        {/* Profile Card */}
        <Card variant="elevated" style={{ padding: Spacing.lg }}>
          <TamaguiView alignItems="center">
            <TamaguiView
              width={96}
              height={96}
              borderRadius="$xl"
              justifyContent="center"
              alignItems="center"
              marginBottom="$md"
              backgroundColor={theme.avatarBg}
            >
              <Ionicons name="person" size={48} color={theme.primary} />
            </TamaguiView>
            <TamaguiView alignItems="center">
              <TamaguiText fontSize="$6" fontWeight="700" color="$text">
                {name || 'User'}
              </TamaguiText>
              <TamaguiText
                fontSize="$4"
                lineHeight="$6"
                color="$textSecondary"
                marginTop="$xs"
              >
                {name}
              </TamaguiText>
              <TamaguiView
                marginTop="$md"
                paddingHorizontal="$md"
                paddingVertical="$sm"
                borderRadius="$full"
                backgroundColor={theme.primaryBg}
              >
                <TamaguiText
                  fontSize="$2"
                  lineHeight="$4"
                  color="$primary"
                  fontWeight="600"
                >
                  {role === 'admin' ? 'Administrator' : 'Employee'}
                </TamaguiText>
              </TamaguiView>
            </TamaguiView>
          </TamaguiView>
        </Card>

        {/* Appearance Section */}
        <TamaguiText
          fontSize="$5"
          fontWeight="600"
          color="$text"
          marginTop="$lg"
          marginBottom="$md"
        >
          Appearance
        </TamaguiText>

        <Card variant="elevated">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <TamaguiView flexDirection="row" alignItems="center" flex={1}>
              <TamaguiView
                width={48}
                height={48}
                borderRadius="$md"
                justifyContent="center"
                alignItems="center"
                backgroundColor={theme.warningBg}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={24}
                  color={theme.warning}
                />
              </TamaguiView>
              <TamaguiView marginLeft="$md" flex={1}>
                <TamaguiText
                  fontSize="$4"
                  lineHeight="$6"
                  color="$text"
                  fontWeight="600"
                >
                  Theme
                </TamaguiText>
                <TamaguiText
                  fontSize="$2"
                  lineHeight="$4"
                  color="$textSecondary"
                  marginTop="$xs"
                >
                  {scheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </TamaguiText>
              </TamaguiView>
            </TamaguiView>
            <ThemeToggle />
          </TamaguiView>
        </Card>

        {/* General Settings */}
        <TamaguiText
          fontSize="$5"
          fontWeight="600"
          color="$text"
          marginTop="$lg"
          marginBottom="$md"
        >
          General
        </TamaguiText>

        {settingsItems.map((item, index) => (
          <Card
            key={item.id}
            variant="elevated"
            onPress={item.onPress}
            style={{
              marginBottom: index < settingsItems.length - 1 ? Spacing.sm : 0,
            }}
          >
            <TamaguiView
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <TamaguiView flexDirection="row" alignItems="center" flex={1}>
                <TamaguiView
                  width={48}
                  height={48}
                  borderRadius="$md"
                  justifyContent="center"
                  alignItems="center"
                  backgroundColor={item.iconBgColor}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.iconColor}
                  />
                </TamaguiView>
                <TamaguiView marginLeft="$md" flex={1}>
                  <TamaguiText
                    fontSize="$4"
                    lineHeight="$6"
                    color="$text"
                    fontWeight="600"
                  >
                    {item.title}
                  </TamaguiText>
                </TamaguiView>
              </TamaguiView>
              <Ionicons name="chevron-forward" size={20} color={theme.icon} />
            </TamaguiView>
          </Card>
        ))}

        {/* Logout Button */}
        <Card
          variant={Platform.OS === 'android' ? 'default' : 'elevated'}
          onPress={handleLogout}
          style={{
            marginTop: Spacing.xl,
            backgroundColor: '$error',
            ...(Platform.OS === 'android'
              ? {
                  elevation: 0,
                  shadowOpacity: 0,
                }
              : {}),
          }}
        >
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <TamaguiView flexDirection="row" alignItems="center" flex={1}>
              <TamaguiView
                width={48}
                height={48}
                borderRadius="$md"
                justifyContent="center"
                alignItems="center"
                backgroundColor={theme.errorBg}
              >
                <Ionicons
                  name="log-out-outline"
                  size={24}
                  color={theme.error}
                />
              </TamaguiView>
              <TamaguiView marginLeft="$md" flex={1}>
                <TamaguiText
                  fontSize="$4"
                  lineHeight="$6"
                  color="$error"
                  fontWeight="600"
                >
                  Logout
                </TamaguiText>
              </TamaguiView>
            </TamaguiView>
            <Ionicons name="chevron-forward" size={20} color={theme.error} />
          </TamaguiView>
        </Card>

        {/* App Version */}
        <TamaguiText
          fontSize="$2"
          lineHeight="$4"
          color="$textSecondary"
          textAlign="center"
          marginTop="$xl"
        >
          Version 1.0.0
        </TamaguiText>
      </ScrollView>
    </SafeAreaView>
  );
}
