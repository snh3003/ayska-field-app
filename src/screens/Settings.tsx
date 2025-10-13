import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
      onPress: () =>
        Alert.alert('Notifications', 'Notification settings coming soon!'),
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: 'shield-checkmark-outline',
      iconColor: theme.success,
      onPress: () => Alert.alert('Privacy', 'Privacy settings coming soon!'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      iconColor: theme.info,
      onPress: () => Alert.alert('Help', 'Help center coming soon!'),
    },
    {
      id: 'about',
      title: 'About',
      icon: 'information-circle-outline',
      iconColor: theme.secondary,
      onPress: () => Alert.alert('About', 'Field Sales Tracker v1.0.0'),
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[Typography.h3, { color: theme.text }]}>Settings</Text>
          <ThemeToggle />
        </View>

        {/* Logo & Brand */}
        <View style={styles.brandSection}>
          <Logo size="responsive" matchCardWidth={true} />
        </View>

        {/* Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatarLarge,
                { backgroundColor: theme.primary + '15' },
              ]}
            >
              <Ionicons name="person" size={48} color={theme.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[Typography.h3, { color: theme.text }]}>
                {name || 'User'}
              </Text>
              <Text
                style={[
                  Typography.body,
                  { color: theme.textSecondary, marginTop: Spacing.xs },
                ]}
              >
                {name}
              </Text>
              <View
                style={[
                  styles.roleBadge,
                  { backgroundColor: theme.primary + '15' },
                ]}
              >
                <Text
                  style={[
                    Typography.caption,
                    { color: theme.primary, fontWeight: '600' },
                  ]}
                >
                  {role === 'admin' ? 'Administrator' : 'Employee'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Appearance Section */}
        <Text
          style={[
            Typography.h4,
            {
              color: theme.text,
              marginTop: Spacing.lg,
              marginBottom: Spacing.md,
            },
          ]}
        >
          Appearance
        </Text>

        <Card variant="elevated">
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: theme.warning + '15' },
                ]}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={24}
                  color={theme.warning}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text
                  style={[
                    Typography.body,
                    { color: theme.text, fontWeight: '600' },
                  ]}
                >
                  Theme
                </Text>
                <Text
                  style={[
                    Typography.caption,
                    { color: theme.textSecondary, marginTop: Spacing.xs },
                  ]}
                >
                  {scheme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
              </View>
            </View>
            <ThemeToggle />
          </View>
        </Card>

        {/* General Settings */}
        <Text
          style={[
            Typography.h4,
            {
              color: theme.text,
              marginTop: Spacing.lg,
              marginBottom: Spacing.md,
            },
          ]}
        >
          General
        </Text>

        {settingsItems.map((item, index) => (
          <Card
            key={item.id}
            variant="elevated"
            onPress={item.onPress}
            style={{
              marginBottom: index < settingsItems.length - 1 ? Spacing.sm : 0,
            }}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIcon,
                    { backgroundColor: item.iconColor + '15' },
                  ]}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={24}
                    color={item.iconColor}
                  />
                </View>
                <View style={styles.settingInfo}>
                  <Text
                    style={[
                      Typography.body,
                      { color: theme.text, fontWeight: '600' },
                    ]}
                  >
                    {item.title}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.icon} />
            </View>
          </Card>
        ))}

        {/* Logout Button */}
        <Card
          variant={Platform.OS === 'android' ? 'default' : 'elevated'}
          onPress={handleLogout}
          style={{
            marginTop: Spacing.xl,
            backgroundColor: theme.error + '10',
            ...(Platform.OS === 'android'
              ? {
                  elevation: 0,
                  shadowOpacity: 0,
                }
              : {}),
          }}
        >
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.settingIcon,
                  { backgroundColor: theme.error + '15' },
                ]}
              >
                <Ionicons
                  name="log-out-outline"
                  size={24}
                  color={theme.error}
                />
              </View>
              <View style={styles.settingInfo}>
                <Text
                  style={[
                    Typography.body,
                    { color: theme.error, fontWeight: '600' },
                  ]}
                >
                  Logout
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.error} />
          </View>
        </Card>

        {/* App Version */}
        <Text
          style={[
            Typography.caption,
            {
              color: theme.textSecondary,
              textAlign: 'center',
              marginTop: Spacing.xl,
            },
          ]}
        >
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  profileCard: {
    padding: Spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  profileInfo: {
    alignItems: 'center',
  },
  roleBadge: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    marginLeft: Spacing.md,
    flex: 1,
  },
});
